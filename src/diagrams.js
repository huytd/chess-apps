/* Book Reader: finding chess diagrams on a page and reading their positions (copied to docs/diagrams.js by the build).
   The recognition is Watch Chess in 3D's (https://github.com/huytd/watchchess3d): its square classifier (a small CNN,
   weights in vendor/watchchess3d/model.json, copied to docs/diagram-model.json) and its board finder (the strongest 8x8
   light/dark checkerboard pattern, then each edge nudged until every cell's rim sits inside one square), ported from
   its static/engine.js and static/cnn.js. What's different for a book page:
   - a page can hold several diagrams, of any size: the checkerboard search runs over a small image pyramid and keeps
     every strong board it finds, not just the best one
   - a photo of a book is seldom square-on: after the edges, each corner is nudged on its own (a perspective warp)
   - the CNN runs in plain JavaScript (no TensorFlow.js), one 32x32 tile per square
   - the readings are decoded with a little chess sense: one king of each colour, no pawns on the first or last rank
   In the browser this file is both a script (the global Diagrams) and the Web Worker that does the reading; in Node,
   require() it. Images are {w, h, data, ch}: pixels row by row, ch channels (4 for canvas RGBA, 3 for RGB). */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Diagrams = factory();
}(typeof self !== 'undefined' ? self : this, function() {
'use strict';
const CLASSES = ['.', 'P', 'N', 'B', 'R', 'Q', 'K', 'p', 'n', 'b', 'r', 'q', 'k'];
const TILE = 32, CROP = 256;

/* OpenCV's RGB -> grey, in the same fixed point (as watchchess3d) */
const grey = (r, g, b) => (r * 4899 + g * 9617 + b * 1868 + 8192) >> 14;

/* pixels of w x h (ch channels) -> RGB of W x H, each output pixel the average of the input area it covers */
function resizeArea(img, W, H) {
  const { w, h, data: src, ch } = img, out = new Uint8Array(W * H * 3), acc = new Float64Array(W * 3);
  const sx = w / W, sy = h / H, area = sx * sy;
  for (let Y = 0; Y < H; Y++) {
    acc.fill(0);
    const y0 = Y * sy, y1 = y0 + sy;
    for (let y = Math.floor(y0); y < Math.min(h, Math.ceil(y1)); y++) {
      const wy = Math.min(y1, y + 1) - Math.max(y0, y);
      for (let X = 0; X < W; X++) {
        const x0 = X * sx, x1 = x0 + sx;
        for (let x = Math.floor(x0); x < Math.min(w, Math.ceil(x1)); x++) {
          const wgt = wy * (Math.min(x1, x + 1) - Math.max(x0, x)), o = (y * w + x) * ch;
          acc[X * 3] += wgt * src[o]; acc[X * 3 + 1] += wgt * src[o + 1]; acc[X * 3 + 2] += wgt * src[o + 2];
        }
      }
    }
    for (let i = 0; i < W * 3; i++) out[Y * W * 3 + i] = Math.round(acc[i] / area);
  }
  return { w: W, h: H, data: out, ch: 3 };
}

/* ---------------------------------------------------------------- finding boards */
/* Every strong 8x8 checkerboard of whole-pixel cells of lo..hi pixels: [{score, x, y, c}], score being the mean
   light/dark grey gap. watchchess3d's checkerSearch, keeping a few peaks per cell size instead of the single best. */
function checkerPeaks(img, lo, hi, perSize) {
  const { w: W, h: H, data: px, ch } = img, W1 = W + 1, ii = new Float64Array((H + 1) * W1);
  for (let y = 0; y < H; y++) {
    let row = 0;
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * ch;
      row += grey(px[o], px[o + 1], px[o + 2]);
      ii[(y + 1) * W1 + x + 1] = ii[y * W1 + x + 1] + row;
    }
  }
  const out = [], B = new Float64Array(H * W1), C = new Float64Array(H * W1), V = new Float32Array(H * W1);
  for (let c = lo; c <= hi; c++) {
    // sum of every c x c box, indexed by its top-left corner
    const Bh = H + 1 - c, Bw = W + 1 - c, ny = Bh - 7 * c, nx = Bw - 7 * c;
    if (ny <= 0 || nx <= 0) break;
    for (let y = 0; y < Bh; y++) {
      const a = y * W1, b = (y + c) * W1, o = y * Bw;
      for (let x = 0; x < Bw; x++) B[o + x] = ii[b + x + c] - ii[a + x + c] - ii[b + x] + ii[a + x];
    }
    // the +-1 pattern is (-1)^row * (-1)^file: sum along the files first, then down the rows
    for (let y = 0; y < Bh; y++) {
      const o = y * Bw, q = y * nx;
      for (let x = 0; x < nx; x++) {
        let s = 0;
        for (let f = 0; f < 8; f++) s += (f & 1 ? -1 : 1) * B[o + x + f * c];
        C[q + x] = s;
      }
    }
    const norm = 64 * c * c;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        let s = 0;
        for (let r = 0; r < 8; r++) s += (r & 1 ? -1 : 1) * C[(y + r * c) * nx + x];
        V[y * nx + x] = Math.abs(s) / norm;
      }
    }
    // the best few, each at least half a board away from the ones before (a board shifted by a cell scores nearly as well)
    const taken = [];
    for (let k = 0; k < perSize; k++) {
      let bi = -1, bv = 0;
      for (let i = 0; i < ny * nx; i++) if (V[i] > bv) { bv = V[i]; bi = i; }
      if (bi < 0) break;
      const x0 = bi % nx, y0 = Math.floor(bi / nx);
      taken.push({ score: bv, x: x0, y: y0, c });
      for (let y = Math.max(0, y0 - 4 * c); y < Math.min(ny, y0 + 4 * c); y++)
        for (let x = Math.max(0, x0 - 4 * c); x < Math.min(nx, x0 + 4 * c); x++) V[y * nx + x] = 0;
    }
    out.push(...taken);
  }
  return out;
}

const overlap = (a, b) => {
  const ix = Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]));
  const iy = Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]));
  return ix * iy / Math.min(a[2] * a[3], b[2] * b[3]);
};
const MIN_SCORE = 6;  // a candidate: half watchchess3d's bar, as a book's faint hatching is a weaker pattern than a screen's

/* Places on a page that may hold a diagram, plainest first: [{score, box: [x, y, w, h]}] in image pixels, at most `max`.
   Boards from 15% of the shorter side up are searched, in a pyramid of shrunk copies whose cells are 10 to 20 pixels:
   each copy covers a doubling of board sizes, and none is bigger than it needs to be. Each box is then searched again
   more closely (searchNear). */
function findBoards(img, { max = 8 } = {}) {
  const M = Math.min(img.w, img.h), found = [];
  for (let k = Math.min(1, 533 / M); ; k /= 2) {
    const w = Math.max(1, Math.round(img.w * k)), h = Math.max(1, Math.round(img.h * k));
    if (Math.min(w, h) < 64) break;
    const small = k < 1 ? resizeArea(img, w, h) : img, kx = w / img.w, ky = h / img.h;
    const lo = k === Math.min(1, 533 / M) ? Math.max(6, Math.floor(0.15 * Math.min(w, h) / 8)) : 10;
    for (const p of checkerPeaks(small, lo, Math.min(20, Math.floor(Math.min(w, h) / 8)), 4))
      found.push({ score: p.score, box: [p.x / kx, p.y / ky, 8 * p.c / kx, 8 * p.c / ky] });
    if (Math.min(w, h) <= 160) break;  // 20-pixel cells fill it: no bigger board fits
  }
  found.sort((a, b) => b.score - a.score);
  const out = [];
  for (const f of found) {
    if (f.score < MIN_SCORE) break;
    if (out.some(o => overlap(o.box, f.box) > 0.3)) continue;
    out.push(f);
    if (out.length >= max) break;
  }
  return out.map(f => ({ score: f.score, box: searchNear(img, f.box) }));
}

/* A shrunk copy's whole-pixel cells can leave the box a fifth of a square off: search again around it, at about 40
   pixels a square, over cell sizes within 10% of the first guess */
function searchNear(img, box) {
  const k = Math.min(1, 320 / Math.max(box[2], box[3])), pad = 0.12 * Math.max(box[2], box[3]);
  const x0 = Math.max(0, Math.floor(box[0] - pad)), y0 = Math.max(0, Math.floor(box[1] - pad));
  const x1 = Math.min(img.w, Math.ceil(box[0] + box[2] + pad)), y1 = Math.min(img.h, Math.ceil(box[1] + box[3] + pad));
  const area = { w: x1 - x0, h: y1 - y0, ch: img.ch, data: new Uint8Array((x1 - x0) * (y1 - y0) * img.ch) };
  for (let y = y0; y < y1; y++) area.data.set(img.data.subarray((y * img.w + x0) * img.ch, (y * img.w + x1) * img.ch), (y - y0) * area.w * img.ch);
  const w = Math.max(8, Math.round(area.w * k)), h = Math.max(8, Math.round(area.h * k));
  const small = k < 1 ? resizeArea(area, w, h) : area, c0 = box[2] * w / area.w / 8;
  const [p] = checkerPeaks(small, Math.max(4, Math.floor(c0 * 0.9)), Math.ceil(c0 * 1.1), 1).sort((a, b) => b.score - a.score);
  if (!p) return box;
  const kx = w / area.w, ky = h / area.h;
  return [x0 + p.x / kx, y0 + p.y / ky, 8 * p.c / kx, 8 * p.c / ky];
}

/* ---------------------------------------------------------------- fitting the board's corners */
/* separable Gaussian blur of a w x h grey plane (edges repeated) */
function blurPlane(src, w, h, sigma) {
  const r = Math.ceil(3 * sigma), k = new Float32Array(2 * r + 1);
  let ks = 0;
  for (let i = -r; i <= r; i++) ks += k[i + r] = Math.exp(-i * i / (2 * sigma * sigma));
  for (let i = 0; i <= 2 * r; i++) k[i] /= ks;
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0;
    for (let i = -r; i <= r; i++) s += k[i + r] * src[y * w + Math.min(w - 1, Math.max(0, x + i))];
    tmp[y * w + x] = s;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0;
    for (let i = -r; i <= r; i++) s += k[i + r] * tmp[Math.min(h - 1, Math.max(0, y + i)) * w + x];
    out[y * w + x] = s;
  }
  return out;
}
/* The perspective map taking the unit square to the quad [[x, y] x 4: top-left, top-right, bottom-right, bottom-left] */
function homography(q) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = den ? (dx3 * dy2 - dx2 * dy3) / den : 0, hh = den ? (dx1 * dy3 - dx3 * dy1) / den : 0;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  return (u, v) => { const z = g * u + hh * v + 1; return [(a * u + b * v + x0) / z, (d * u + e * v + y0) / z]; };
}
const boxQuad = ([x, y, w, h]) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

/* How much the grey varies along every cell's rim when the quad is mapped to 256x256: low when each rim sits inside
   one square. watchchess3d's ringVariance, through a perspective map. */
const RIM = (() => {
  const pts = [];
  for (let j = 1; j < 31; j++) pts.push([1, j], [30, j]);
  for (let i = 1; i < 31; i++) pts.push([i, 1], [i, 30]);
  return pts;
})();
function ringVariance(sample, q) {
  const H = homography(q), vals = new Float64Array(RIM.length);
  let total = 0;
  for (let cr = 0; cr < 8; cr++) for (let cc = 0; cc < 8; cc++) {
    let m = 0;
    RIM.forEach(([i, j], n) => { const [x, y] = H((cc * 32 + j) / CROP, (cr * 32 + i) / CROP); m += vals[n] = sample(x, y); });
    m /= RIM.length;
    let s = 0;
    for (const v of vals) s += (v - m) * (v - m);
    total += s / RIM.length;
  }
  return total;
}

/* The grey of the area x0..x1, y0..y1, shrunk by k and blurred: what the corners are fitted on */
function fitImage(img, x0, y0, x1, y1, k, sigma) {
  const area = { w: x1 - x0, h: y1 - y0, ch: img.ch, data: new Uint8Array((x1 - x0) * (y1 - y0) * img.ch) };
  for (let y = y0; y < y1; y++) area.data.set(img.data.subarray((y * img.w + x0) * img.ch, (y * img.w + x1) * img.ch), (y - y0) * area.w * img.ch);
  const small = k < 1 ? resizeArea(area, Math.max(8, Math.round(area.w * k)), Math.max(8, Math.round(area.h * k))) : area;
  const { w, h } = small, g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = grey(small.data[i * small.ch], small.data[i * small.ch + 1], small.data[i * small.ch + 2]);
  return { w, h, data: blurPlane(g, w, h, sigma), kx: w / area.w, ky: h / area.h };
}
/* bilinear sample of a grey plane, black outside */
const planeSampler = ({ w, h, data }) => (x, y) => {
  const fx = x - 0.5, fy = y - 0.5, x0 = Math.floor(fx), y0 = Math.floor(fy), ax = fx - x0, ay = fy - y0;
  const at = (xx, yy) => xx < 0 || yy < 0 || xx >= w || yy >= h ? 0 : data[yy * w + xx];
  return (1 - ay) * ((1 - ax) * at(x0, y0) + ax * at(x0 + 1, y0)) + ay * ((1 - ax) * at(x0, y0 + 1) + ax * at(x0 + 1, y0 + 1));
};

/* Fit the board's corners, starting from a box found by findBoards: first its edges and position as watchchess3d does
   (each edge nudged, sub-pixel, while that lowers the rim variance, up to 5% of the board), then each corner on its own,
   up to a square, which takes up a photo's tilt and perspective. It works on the board's area shrunk to about 40 pixels
   a square and blurred by a twelfth of one: a book's hatching then reads as the flat grey it stands for, so the rims
   tell squares apart rather than hatch lines. Returns the quad, in image pixels. */
function fitCorners(img, box, { free = true } = {}) {
  const size0 = Math.max(box[2], box[3]), k = Math.min(1, 320 / size0), pad = 0.1 * size0;
  const x0 = Math.max(0, Math.floor(box[0] - pad)), y0 = Math.max(0, Math.floor(box[1] - pad));
  const x1 = Math.min(img.w, Math.ceil(box[0] + box[2] + pad)), y1 = Math.min(img.h, Math.ceil(box[1] + box[3] + pad));
  const F = fitImage(img, x0, y0, x1, y1, k, Math.max(0.8, size0 * k / 96)), sample = planeSampler(F);
  const b0 = [(box[0] - x0) * F.kx, (box[1] - y0) * F.ky, box[2] * F.kx, box[3] * F.ky], size = Math.max(b0[2], b0[3]);
  let r = b0.slice(), best = ringVariance(sample, boxQuad(r));
  const inside = q => q.every(([x, y]) => x >= -1 && y >= -1 && x <= F.w + 1 && y <= F.h + 1);
  for (const frac of [0.02, 0.01, 0.005, 0.0025]) {
    const step = Math.max(0.1, frac * size);
    for (let improved = true; improved;) {
      improved = false;
      for (const edge of 'lrtbxy') for (const s of [-1, 1]) {
        let [x, y, w, h] = r;
        const d = s * step;
        if (edge === 'l') { x += d; w -= d; } else if (edge === 'r') w += d;
        else if (edge === 't') { y += d; h -= d; } else if (edge === 'b') h += d;
        else if (edge === 'x') x += d; else y += d;
        const t = [x, y, w, h];
        if (Math.max(...t.map((v, i) => Math.abs(v - b0[i]))) > 0.05 * size || !inside(boxQuad(t))) continue;
        const v = ringVariance(sample, boxQuad(t));
        if (v < best * 0.998) { best = v; r = t; improved = true; }
      }
    }
  }
  let q = boxQuad(r);
  if (free) {
    const start = q.map(p => p.slice()), cell = size / 8;
    for (const frac of [0.01, 0.005, 0.0025]) {
      const step = Math.max(0.1, frac * size);
      for (let improved = true, rounds = 0; improved && rounds < 40; rounds++) {
        improved = false;
        for (let c = 0; c < 4; c++) for (let a = 0; a < 2; a++) for (const s of [-1, 1]) {
          const t = q.map(p => p.slice());
          t[c][a] += s * step;
          if (Math.abs(t[c][a] - start[c][a]) > cell || !inside(t)) continue;
          const v = ringVariance(sample, t);
          if (v < best * 0.998) { best = v; q = t; improved = true; }
        }
      }
    }
  }
  return q.map(([x, y]) => [x0 + x / F.kx, y0 + y / F.ky]);
}

/* The quad mapped to 256x256 RGB, each output pixel averaging a few samples (about one per source pixel it covers, so a
   big board is shrunk the way watchchess3d's area scaling shrinks it) */
function warp(img, q) {
  const H = homography(q), { w: W, h: Hh, data: px, ch } = img;
  const side = Math.max(...[0, 1, 2, 3].map(k => Math.hypot(q[k][0] - q[(k + 1) % 4][0], q[k][1] - q[(k + 1) % 4][1])));
  const n = Math.max(1, Math.min(4, Math.round(side / CROP))), out = new Uint8Array(CROP * CROP * 3);
  for (let Y = 0; Y < CROP; Y++) for (let X = 0; X < CROP; X++) {
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < n; sy++) for (let sx = 0; sx < n; sx++) {
      const [x, y] = H((X + (sx + 0.5) / n) / CROP, (Y + (sy + 0.5) / n) / CROP);
      // bilinear, edge pixels repeated outside
      const fx = Math.min(W - 1, Math.max(0, x - 0.5)), fy = Math.min(Hh - 1, Math.max(0, y - 0.5));
      const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(W - 1, x0 + 1), y1 = Math.min(Hh - 1, y0 + 1);
      const ax = fx - x0, ay = fy - y0;
      const o00 = (y0 * W + x0) * ch, o01 = (y0 * W + x1) * ch, o10 = (y1 * W + x0) * ch, o11 = (y1 * W + x1) * ch;
      const w00 = (1 - ax) * (1 - ay), w01 = ax * (1 - ay), w10 = (1 - ax) * ay, w11 = ax * ay;
      r += w00 * px[o00] + w01 * px[o01] + w10 * px[o10] + w11 * px[o11];
      g += w00 * px[o00 + 1] + w01 * px[o01 + 1] + w10 * px[o10 + 1] + w11 * px[o11 + 1];
      b += w00 * px[o00 + 2] + w01 * px[o01 + 2] + w10 * px[o10 + 2] + w11 * px[o11 + 2];
    }
    const o = (Y * CROP + X) * 3, nn = n * n;
    out[o] = Math.round(r / nn); out[o + 1] = Math.round(g / nn); out[o + 2] = Math.round(b / nn);
  }
  return out;
}

/* How plainly a 256x256 crop shows a board: the mean grey gap between light and dark squares, read near each cell's
   corners, where pieces seldom reach (watchchess3d's boardGap). A board that is really there, and fitted, reads its
   full contrast; a stretch of text or a picture reads next to nothing. */
function boardGap(img) {
  let s = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    let m = 0;
    for (const y0 of [4, 24]) for (const x0 of [4, 24])
      for (let y = y0; y < y0 + 4; y++) for (let x = x0; x < x0 + 4; x++) {
        const o = ((r * 32 + y) * CROP + c * 32 + x) * 3;
        m += grey(img[o], img[o + 1], img[o + 2]);
      }
    s += ((r + c) & 1 ? -1 : 1) * m / 64;
  }
  return Math.abs(s) / 64;
}
const MIN_GAP = 10;     // a fitted board must show at least this much light/dark contrast
const MIN_SHARE = 0.35; // and a second diagram on the page at least this share of the plainest one's

/* The diagrams on a page: [{score, quad, crop}], score being the fitted board's light/dark gap. Every candidate from
   findBoards is fitted, and kept if it shows a board plainly enough and isn't one already kept. */
function locateBoards(img, opts) {
  const out = [];
  for (const f of findBoards(img, opts)) {
    const quad = fitCorners(img, f.box), crop = warp(img, quad), score = boardGap(crop);
    if (score < MIN_GAP) continue;
    const box = quadBox(quad);
    if (out.some(o => overlap(quadBox(o.quad), box) > 0.3)) continue;
    out.push({ score, quad, crop });
  }
  out.sort((a, b) => b.score - a.score);
  return out.filter(o => o.score >= MIN_SHARE * out[0].score);
}
const quadBox = q => {
  const xs = q.map(p => p[0]), ys = q.map(p => p[1]), x = Math.min(...xs), y = Math.min(...ys);
  return [x, y, Math.max(...xs) - x, Math.max(...ys) - y];
};

/* ---------------------------------------------------------------- reading the squares */
/* (256x256 RGB) -> 64 tiles of 32x32 RGB, top-left cell first (watchchess3d's boardTiles) */
function boardTiles(img) {
  const out = new Uint8Array(64 * TILE * TILE * 3);
  let o = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++)
    for (let i = 0; i < TILE; i++) {
      const s = ((r * TILE + i) * CROP + c * TILE) * 3;
      out.set(img.subarray(s, s + TILE * 3), o);
      o += TILE * 3;
    }
  return out;
}

/* model.json's weights (float16, base64) -> Float32Arrays, in TensorFlow's layout (HWIO kernels) */
function decodeWeights(m) {
  const bin = Uint8Array.from(atob(m.data), c => c.charCodeAt(0));
  const half = new Uint16Array(bin.buffer, bin.byteOffset, bin.byteLength / 2), flat = new Float32Array(half.length);
  for (let i = 0; i < half.length; i++) {
    const h = half[i], s = h & 0x8000 ? -1 : 1, e = (h >> 10) & 31, f = h & 1023;
    flat[i] = e === 0 ? s * 2 ** -14 * (f / 1024) : e === 31 ? (f ? NaN : s * Infinity) : s * 2 ** (e - 15) * (1 + f / 1024);
  }
  let off = 0;
  return m.shapes.map(shape => { const n = shape.reduce((a, b) => a * b, 1), w = flat.subarray(off, off + n); off += n; return w; });
}

/* 3x3 convolution, 'same' padding, + bias and ReLU, on one S x S x C tile (channels last) */
function conv(inp, S, C, k, b, F, out) {
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const o = (y * S + x) * F;
    for (let f = 0; f < F; f++) out[o + f] = b[f];
    for (let ky = 0; ky < 3; ky++) {
      const yy = y + ky - 1;
      if (yy < 0 || yy >= S) continue;
      for (let kx = 0; kx < 3; kx++) {
        const xx = x + kx - 1;
        if (xx < 0 || xx >= S) continue;
        const i0 = (yy * S + xx) * C, k0 = (ky * 3 + kx) * C * F;
        for (let c = 0; c < C; c++) {
          const v = inp[i0 + c];
          if (v === 0) continue;  // after a ReLU, most are
          const kk = k0 + c * F;
          for (let f = 0; f < F; f++) out[o + f] += v * k[kk + f];
        }
      }
    }
    for (let f = 0; f < F; f++) if (out[o + f] < 0) out[o + f] = 0;
  }
}
function pool(inp, S, C, out) {
  const h = S >> 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < h; x++) for (let c = 0; c < C; c++) {
    const a = (2 * y * S + 2 * x) * C + c;
    out[(y * h + x) * C + c] = Math.max(inp[a], inp[a + C], inp[a + S * C], inp[a + S * C + C]);
  }
}

/* The square classifier: two 3x3 convs, pool, two convs, pool, conv, pool, dense 96, dense 13 + softmax (watchchess3d's
   cnn.js). Returns predict(tiles, n): n tiles of 32x32 RGB bytes -> n x 13 probabilities, in CLASSES order. */
function makeClassifier(model) {
  const w = decodeWeights(model);
  const x0 = new Float32Array(32 * 32 * 3), a = new Float32Array(32 * 32 * 16), b = new Float32Array(32 * 32 * 16);
  const p1 = new Float32Array(16 * 16 * 16), c = new Float32Array(16 * 16 * 32), d = new Float32Array(16 * 16 * 32);
  const p2 = new Float32Array(8 * 8 * 32), e = new Float32Array(8 * 8 * 64), p3 = new Float32Array(4 * 4 * 64);
  const hid = new Float32Array(96), z = new Float64Array(13);
  return (tiles, n) => {
    const out = new Float32Array(n * 13);
    for (let t = 0; t < n; t++) {
      for (let i = 0; i < 3072; i++) x0[i] = tiles[t * 3072 + i] / 255;
      conv(x0, 32, 3, w[0], w[1], 16, a); conv(a, 32, 16, w[2], w[3], 16, b); pool(b, 32, 16, p1);
      conv(p1, 16, 16, w[4], w[5], 32, c); conv(c, 16, 32, w[6], w[7], 32, d); pool(d, 16, 32, p2);
      conv(p2, 8, 32, w[8], w[9], 64, e); pool(e, 8, 64, p3);
      hid.set(w[11]);
      for (let i = 0; i < 1024; i++) {
        const v = p3[i];
        if (v === 0) continue;
        for (let j = 0; j < 96; j++) hid[j] += v * w[10][i * 96 + j];
      }
      let m = -Infinity, sum = 0;
      for (let k = 0; k < 13; k++) {
        let s = w[13][k];
        for (let j = 0; j < 96; j++) if (hid[j] > 0) s += hid[j] * w[12][j * 13 + k];
        z[k] = s; if (s > m) m = s;
      }
      for (let k = 0; k < 13; k++) sum += z[k] = Math.exp(z[k] - m);
      for (let k = 0; k < 13; k++) out[t * 13 + k] = z[k] / sum;
    }
    return out;
  };
}

/* ---------------------------------------------------------------- readings -> a position */
/* probs: 64 x 13, top-left cell first. The likeliest reading with at most one king of each colour, and exactly one when
   some square makes it at all likely (a book diagram nearly always has both, and a black king on a dark square is the
   piece the CNN most often takes for something else); never a pawn on the top or bottom row. Returns cells (64 class
   letters, top-left first) and conf (the probability of each square's letter). */
const FORCE_KING = Math.log(0.02);
function decode(probs) {
  const L = Array.from({ length: 64 }, (_, i) => Array.from({ length: 13 }, (_, k) => {
    const row = i >> 3;
    return (k === 1 || k === 7) && (row === 0 || row === 7) ? -Infinity : Math.log(probs[i * 13 + k] + 1e-7);
  }));
  const plain = L.map(l => { let k = 0; for (let j = 1; j < 13; j++) if (j !== 6 && j !== 12 && l[j] > l[k]) k = j; return k; });
  const gain = K => L.map((l, i) => l[K] - l[plain[i]]);
  const gK = gain(6), gk = gain(12);
  // the best squares for the two kings, on different squares
  let best = { v: -Infinity, K: -1, k: -1 };
  const consider = (K, k) => {
    const v = (K >= 0 ? gK[K] : 0) + (k >= 0 ? gk[k] : 0);
    if (v > best.v) best = { v, K, k };
  };
  const okK = [...Array(64).keys()].filter(i => gK[i] >= FORCE_KING), okk = [...Array(64).keys()].filter(i => gk[i] >= FORCE_KING);
  if (!okK.length && !okk.length) consider(-1, -1);
  for (const K of okK.length ? okK : [-1]) for (const k of okk.length ? okk : [-1]) if (K < 0 || K !== k) consider(K, k);
  const cells = plain.map(k => CLASSES[k]);
  if (best.K >= 0) cells[best.K] = 'K';
  if (best.k >= 0) cells[best.k] = 'k';
  const conf = new Float32Array(64);
  cells.forEach((c, i) => { conf[i] = probs[i * 13 + CLASSES.indexOf(c)]; });
  return { cells, conf };
}

/* cells (top-left first) -> true if White looks to be at the bottom, false if at the top. Books nearly always print
   White at the bottom, so only plain evidence turns it: pawns of both colours on a file with White's above Black's
   (they can't pass each other, short of captures), each such file counting twice, and the kings near the edges they
   started from. */
function whiteAtBottom(cells) {
  let votes = 0;
  for (let c = 0; c < 8; c++) {
    let lowP = -1, highP = 8, lowp = -1, highp = 8;
    for (let r = 0; r < 8; r++) {
      const v = cells[r * 8 + c];
      if (v === 'P') { lowP = Math.max(lowP, r); highP = Math.min(highP, r); }
      if (v === 'p') { lowp = Math.max(lowp, r); highp = Math.min(highp, r); }
    }
    if (lowP < 0 || lowp < 0) continue;
    if (highP > lowp) votes += 2; else if (lowP < highp) votes -= 2;
  }
  const K = cells.indexOf('K'), k = cells.indexOf('k');
  if (K >= 0 && k >= 0) {
    const kr = K >> 3, br = k >> 3;
    if (kr >= 6 && br <= 1) votes++;
    else if (kr <= 1 && br >= 6) votes--;
  }
  return votes > -3;
}

/* cells (top-left first) -> FEN piece placement, read with White at the bottom or not */
function placement(cells, whiteBottom) {
  const rows = [];
  for (let r = 0; r < 8; r++) {
    let s = '', gap = 0;
    for (let f = 0; f < 8; f++) {
      const v = whiteBottom ? cells[r * 8 + f] : cells[(7 - r) * 8 + 7 - f];
      if (v === '.') { gap++; continue; }
      if (gap) { s += gap; gap = 0; }
      s += v;
    }
    rows.push(s + (gap || ''));
  }
  return rows.join('/');
}

/* ---------------------------------------------------------------- a whole page */
const blur = (src, sigma) => blurPlane(src, CROP, CROP, sigma);

/* Books often shade the dark squares with fine hatching, which the CNN (taught on screen boards) misreads pieces on; on
   flat grey squares it reads them as well as anywhere. So a hatched board's dark squares are flattened to their mean
   grey wherever the hatching shows, which is where the blurred image is close to that mean: a piece's white or black
   body, far from it, is left sharp. A board without hatching (fine texture on the dark squares, not on the light ones)
   comes back unchanged. */
const HATCH_SIGMA = 1.2, HATCH_BAND = 35;
function flattenHatching(crop) {
  const g = new Float32Array(CROP * CROP);
  for (let i = 0; i < CROP * CROP; i++) g[i] = grey(crop[i * 3], crop[i * 3 + 1], crop[i * 3 + 2]);
  const B = blur(g, HATCH_SIGMA);
  // rims (2 to 5 pixels in from each cell's edge), where pieces seldom reach: their texture and mean, per parity
  const rim = [[], []], tex = [0, 0], n = [0, 0];
  for (let y = 0; y < CROP; y++) for (let x = 0; x < CROP; x++) {
    const iy = y & 31, ix = x & 31, d = Math.min(iy, ix, 31 - iy, 31 - ix);
    if (d < 2 || d > 5) continue;
    const par = ((y >> 5) + (x >> 5)) & 1, i = y * CROP + x;
    rim[par].push(B[i]); tex[par] += Math.abs(g[i] - B[i]); n[par]++;
  }
  const med = a => { const s = Float32Array.from(a).sort(); return s[s.length >> 1]; };
  const m = [med(rim[0]), med(rim[1])], dark = m[1] <= m[0] ? 1 : 0, td = tex[dark] / n[dark], tl = tex[1 - dark] / n[1 - dark];
  if (!(td > 6 && td > 2.5 * tl)) return crop;
  // the flat colour: the dark rims' median, per channel (blurred alike)
  const flat = [0, 1, 2].map(c => {
    const ch = new Float32Array(CROP * CROP);
    for (let i = 0; i < CROP * CROP; i++) ch[i] = crop[i * 3 + c];
    const Bc = blur(ch, HATCH_SIGMA), vals = [];
    for (let y = 0; y < CROP; y++) for (let x = 0; x < CROP; x++) {
      const iy = y & 31, ix = x & 31, d = Math.min(iy, ix, 31 - iy, 31 - ix);
      if (d >= 2 && d <= 5 && (((y >> 5) + (x >> 5)) & 1) === dark) vals.push(Bc[y * CROP + x]);
    }
    return med(vals);
  });
  const out = crop.slice();
  for (let y = 0; y < CROP; y++) for (let x = 0; x < CROP; x++) {
    if ((((y >> 5) + (x >> 5)) & 1) !== dark) continue;
    const i = y * CROP + x, w = Math.max(0, 1 - Math.abs(B[i] - m[dark]) / HATCH_BAND);
    for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(w * flat[c] + (1 - w) * crop[i * 3 + c]);
  }
  return out;
}
/* Reads one board, given its quad (and its crop, if already warped): the CNN's readings and their decoding */
function readQuad(img, quad, predict, crop = warp(img, quad)) {
  const probs = predict(boardTiles(flattenHatching(crop)), 64), { cells, conf } = decode(probs);
  return { quad, crop, probs, cells, conf, whiteBottom: whiteAtBottom(cells) };
}
/* Finds and reads every diagram on a page: [{score, quad, crop, probs, cells, conf, whiteBottom}], top to bottom, then
   left to right (the reading order of a page; a column's diagrams come before the next column's when they don't
   overlap vertically). */
function readPage(img, predict, opts = {}) {
  const boards = locateBoards(img, opts).map(b => ({ score: b.score, ...readQuad(img, b.quad, predict, b.crop) }));
  const top = d => Math.min(...d.quad.map(p => p[1])), bottom = d => Math.max(...d.quad.map(p => p[1])), left = d => Math.min(...d.quad.map(p => p[0]));
  return boards.sort((a, b) => (bottom(a) < top(b) ? -1 : bottom(b) < top(a) ? 1 : left(a) - left(b)));
}

const api = { CLASSES, TILE, CROP, resizeArea, checkerPeaks, findBoards, locateBoards, boardGap, flattenHatching, fitCorners, homography, warp, boardTiles, decodeWeights, makeClassifier,
  decode, whiteAtBottom, placement, readQuad, readPage };

/* ---------------------------------------------------------------- as a Web Worker */
/* Messages: {id, op: 'page', img} finds and reads every diagram; {id, op: 'quad', quad} reads one board on the same page
   with its corners where they were placed (by hand); answers {id, result} or {id, error}. The page's pixels stay here
   between the two. */
if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
  let predict = null, page = null;
  const ready = fetch('diagram-model.json').then(r => { if (!r.ok) throw new Error('model ' + r.status); return r.json(); })
    .then(m => { predict = makeClassifier(m); });
  const pack = d => ({ score: d.score, quad: d.quad, crop: d.crop, probs: d.probs, cells: d.cells, conf: d.conf, whiteBottom: d.whiteBottom });
  self.onmessage = async e => {
    const { id, op } = e.data;
    try {
      await ready;
      let result;
      if (op === 'page') { page = e.data.img; result = readPage(page, predict).map(pack); }
      else if (op === 'quad') result = pack({ score: 0, ...readQuad(page, e.data.quad, predict) });
      self.postMessage({ id, result });
    } catch (err) { self.postMessage({ id, error: String(err && err.message || err) }); }
  };
}
return api;
}));
