# Watch Chess in 3D square classifier (vendored)

`model.json` is the square classifier from [huytd/watchchess3d](https://github.com/huytd/watchchess3d) (`static/model.json`), unmodified, at commit `92d7f59a120f263a77058d024eb2f6610e8937b4`: a small CNN that reads a 32x32 tile of one square as empty or one of the 12 pieces (float16 weights, base64, in TensorFlow's layout). BSD 3-Clause, see `LICENSE`.

Book Reader uses it through `src/diagrams.js`, which ports the parts of watchchess3d's `static/engine.js` and `static/cnn.js` it needs (the checkerboard search, the edge fitting, the tiles and the CNN's forward pass) to plain JavaScript. The build copies this file to `docs/diagram-model.json`.

To update, copy `static/model.json` from a newer watchchess3d checkout and change the commit above.
