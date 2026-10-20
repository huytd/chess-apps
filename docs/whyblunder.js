/*! WhyBlunder analysis modules (https://github.com/huytd/whyblunder), bundled by scripts/build.js from vendor/whyblunder.
 *  Includes chess.js 0.10.3 (BSD-2-Clause, https://github.com/jhlywa/chess.js). */
var WhyBlunder=(function(){var module,exports,define,require,global,window;var self={};var ChessEvaluator,OpeningDetector,SituationRecognizer,MoveDiagnostics;
var Chess=function(r){var u="b",s="w",l=-1,_="p",A="n",S="b",m="r",y="q",p="k",t="pnbrqkPNBRQK",e="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",g=["1-0","0-1","1/2-1/2","*"],C={b:[16,32,17,15],w:[-16,-32,-17,-15]},T={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},c=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],v=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],h={p:0,n:1,b:2,r:3,q:4,k:5},o={NORMAL:"n",CAPTURE:"c",BIG_PAWN:"b",EP_CAPTURE:"e",PROMOTION:"p",KSIDE_CASTLE:"k",QSIDE_CASTLE:"q"},I={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64},P=7,w=6,L=1,R=0,N={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},E={w:[{square:N.a1,flag:I.QSIDE_CASTLE},{square:N.h1,flag:I.KSIDE_CASTLE}],b:[{square:N.a8,flag:I.QSIDE_CASTLE},{square:N.h8,flag:I.KSIDE_CASTLE}]},O=new Array(128),k={w:l,b:l},q=s,D={w:0,b:0},K=l,d=0,b=1,Q=[],U={};function x(r){void 0===r&&(r=!1),O=new Array(128),k={w:l,b:l},q=s,D={w:0,b:0},K=l,d=0,b=1,Q=[],r||(U={}),F(M())}function j(){B(e)}function B(r,e){void 0===e&&(e=!1);var n=r.split(/\s+/),t=n[0],o=0;if(!$(r).valid)return!1;x(e);for(var i=0;i<t.length;i++){var f=t.charAt(i);if("/"===f)o+=8;else if(-1!=="0123456789".indexOf(f))o+=parseInt(f,10);else{var a=f<"a"?s:u;W({type:f.toLowerCase(),color:a},fr(o)),o++}}return q=n[1],-1<n[2].indexOf("K")&&(D.w|=I.KSIDE_CASTLE),-1<n[2].indexOf("Q")&&(D.w|=I.QSIDE_CASTLE),-1<n[2].indexOf("k")&&(D.b|=I.KSIDE_CASTLE),-1<n[2].indexOf("q")&&(D.b|=I.QSIDE_CASTLE),K="-"===n[3]?l:N[n[3]],d=parseInt(n[4],10),b=parseInt(n[5],10),F(M()),!0}function $(r){var e="No errors.",n="FEN string must contain six space-delimited fields.",t="6th field (move number) must be a positive integer.",o="5th field (half move counter) must be a non-negative integer.",i="4th field (en-passant square) is invalid.",f="3rd field (castling availability) is invalid.",a="2nd field (side to move) is invalid.",l="1st field (piece positions) does not contain 8 '/'-delimited rows.",u="1st field (piece positions) is invalid [consecutive numbers].",s="1st field (piece positions) is invalid [invalid piece].",p="1st field (piece positions) is invalid [row too large].",c="Illegal en-passant square",v=r.split(/\s+/);if(6!==v.length)return{valid:!1,error_number:1,error:n};if(isNaN(v[5])||parseInt(v[5],10)<=0)return{valid:!1,error_number:2,error:t};if(isNaN(v[4])||parseInt(v[4],10)<0)return{valid:!1,error_number:3,error:o};if(!/^(-|[abcdefgh][36])$/.test(v[3]))return{valid:!1,error_number:4,error:i};if(!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(v[2]))return{valid:!1,error_number:5,error:f};if(!/^(w|b)$/.test(v[1]))return{valid:!1,error_number:6,error:a};var g=v[0].split("/");if(8!==g.length)return{valid:!1,error_number:7,error:l};for(var h=0;h<g.length;h++){for(var E=0,d=!1,b=0;b<g[h].length;b++)if(isNaN(g[h][b])){if(!/^[prnbqkPRNBQK]$/.test(g[h][b]))return{valid:!1,error_number:9,error:s};E+=1,d=!1}else{if(d)return{valid:!1,error_number:8,error:u};E+=parseInt(g[h][b],10),d=!0}if(8!==E)return{valid:!1,error_number:10,error:p}}return"3"==v[3][1]&&"w"==v[1]||"6"==v[3][1]&&"b"==v[1]?{valid:!1,error_number:11,error:c}:{valid:!0,error_number:0,error:e}}function M(){for(var r=0,e="",n=N.a8;n<=N.h1;n++){if(null==O[n])r++;else{0<r&&(e+=r,r=0);var t=O[n].color,o=O[n].type;e+=t===s?o.toUpperCase():o.toLowerCase()}n+1&136&&(0<r&&(e+=r),n!==N.h1&&(e+="/"),r=0,n+=8)}var i="";D[s]&I.KSIDE_CASTLE&&(i+="K"),D[s]&I.QSIDE_CASTLE&&(i+="Q"),D[u]&I.KSIDE_CASTLE&&(i+="k"),D[u]&I.QSIDE_CASTLE&&(i+="q"),i=i||"-";var f=K===l?"-":fr(K);return[e,q,i,f,d,b].join(" ")}function G(r){for(var e=0;e<r.length;e+=2)"string"==typeof r[e]&&"string"==typeof r[e+1]&&(U[r[e]]=r[e+1]);return U}function F(r){0<Q.length||(r!==e?(U.SetUp="1",U.FEN=r):(delete U.SetUp,delete U.FEN))}function i(r){var e=O[N[r]];return e?{type:e.type,color:e.color}:null}function W(r,e){if(!("type"in r&&"color"in r))return!1;if(-1===t.indexOf(r.type.toLowerCase()))return!1;if(!(e in N))return!1;var n=N[e];return(r.type!=p||k[r.color]==l||k[r.color]==n)&&(O[n]={type:r.type,color:r.color},r.type===p&&(k[r.color]=n),F(M()),!0)}function H(r,e,n,t,o){var i={color:q,from:e,to:n,flags:t,piece:r[e].type};return o&&(i.flags|=I.PROMOTION,i.promotion=o),r[n]?i.captured=r[n].type:t&I.EP_CAPTURE&&(i.captured=_),i}function Z(r){function e(r,e,n,t,o){if(r[n].type!==_||or(t)!==R&&or(t)!==P)e.push(H(r,n,t,o));else for(var i=[y,m,S,A],f=0,a=i.length;f<a;f++)e.push(H(r,n,t,o,i[f]))}var n=[],t=q,o=ar(t),i={b:L,w:w},f=N.a8,a=N.h1,l=!1,u=!(void 0!==r&&"legal"in r)||r.legal;if(void 0!==r&&"square"in r){if(!(r.square in N))return[];f=a=N[r.square],l=!0}for(var s=f;s<=a;s++)if(136&s)s+=7;else{var p=O[s];if(null!=p&&p.color===t)if(p.type===_){var c=s+C[t][0];if(null==O[c]){e(O,n,s,c,I.NORMAL);c=s+C[t][1];i[t]===or(s)&&null==O[c]&&e(O,n,s,c,I.BIG_PAWN)}for(v=2;v<4;v++){136&(c=s+C[t][v])||(null!=O[c]&&O[c].color===o?e(O,n,s,c,I.CAPTURE):c===K&&e(O,n,s,K,I.EP_CAPTURE))}}else for(var v=0,g=T[p.type].length;v<g;v++){var h=T[p.type][v];for(c=s;!(136&(c+=h));){if(null!=O[c]){if(O[c].color===t)break;e(O,n,s,c,I.CAPTURE);break}if(e(O,n,s,c,I.NORMAL),"n"===p.type||"k"===p.type)break}}}if(!l||a===k[t]){if(D[t]&I.KSIDE_CASTLE){var E=(d=k[t])+2;null!=O[d+1]||null!=O[E]||V(o,k[t])||V(o,d+1)||V(o,E)||e(O,n,k[t],E,I.KSIDE_CASTLE)}if(D[t]&I.QSIDE_CASTLE){var d;E=(d=k[t])-2;null!=O[d-1]||null!=O[d-2]||null!=O[d-3]||V(o,k[t])||V(o,d-1)||V(o,E)||e(O,n,k[t],E,I.QSIDE_CASTLE)}}if(!u)return n;var b=[];for(s=0,g=n.length;s<g;s++)er(n[s]),X(t)||b.push(n[s]),nr();return b}function z(r,e){var n="";if(r.flags&I.KSIDE_CASTLE)n="O-O";else if(r.flags&I.QSIDE_CASTLE)n="O-O-O";else{var t=function(r,e){for(var n=Z({legal:!e}),t=r.from,o=r.to,i=r.piece,f=0,a=0,l=0,u=0,s=n.length;u<s;u++){var p=n[u].from,c=n[u].to,v=n[u].piece;i===v&&t!==p&&o===c&&(f++,or(t)===or(p)&&a++,ir(t)===ir(p)&&l++)}if(0<f)return 0<a&&0<l?fr(t):0<l?fr(t).charAt(1):fr(t).charAt(0);return""}(r,e);r.piece!==_&&(n+=r.piece.toUpperCase()+t),r.flags&(I.CAPTURE|I.EP_CAPTURE)&&(r.piece===_&&(n+=fr(r.from)[0]),n+="x"),n+=fr(r.to),r.flags&I.PROMOTION&&(n+="="+r.promotion.toUpperCase())}return er(r),f()&&(a()?n+="#":n+="+"),nr(),n}function J(r){return r.replace(/=/,"").replace(/[+#]?[?!]*$/,"")}function V(r,e){for(var n=N.a8;n<=N.h1;n++)if(136&n)n+=7;else if(null!=O[n]&&O[n].color===r){var t=O[n],o=n-e,i=119+o;if(c[i]&1<<h[t.type]){if(t.type===_){if(0<o){if(t.color===s)return!0}else if(t.color===u)return!0;continue}if("n"===t.type||"k"===t.type)return!0;for(var f=v[i],a=n+f,l=!1;a!==e;){if(null!=O[a]){l=!0;break}a+=f}if(!l)return!0}}return!1}function X(r){return V(ar(r),k[r])}function f(){return X(q)}function a(){return f()&&0===Z().length}function n(){return!f()&&0===Z().length}function Y(){for(var r={},e=[],n=0,t=0,o=N.a8;o<=N.h1;o++)if(t=(t+1)%2,136&o)o+=7;else{var i=O[o];i&&(r[i.type]=i.type in r?r[i.type]+1:1,i.type===S&&e.push(t),n++)}if(2===n)return!0;if(3===n&&(1===r[S]||1===r[A]))return!0;if(n===r[S]+2){var f=0,a=e.length;for(o=0;o<a;o++)f+=e[o];if(0===f||f===a)return!0}return!1}function rr(){for(var r=[],e={},n=!1;;){var t=nr();if(!t)break;r.push(t)}for(;;){var o=M().split(" ").slice(0,4).join(" ");if(e[o]=o in e?e[o]+1:1,3<=e[o]&&(n=!0),!r.length)break;er(r.pop())}return n}function er(r){var e,n=q,t=ar(n);if(e=r,Q.push({move:e,kings:{b:k.b,w:k.w},turn:q,castling:{b:D.b,w:D.w},ep_square:K,half_moves:d,move_number:b}),O[r.to]=O[r.from],O[r.from]=null,r.flags&I.EP_CAPTURE&&(q===u?O[r.to-16]=null:O[r.to+16]=null),r.flags&I.PROMOTION&&(O[r.to]={type:r.promotion,color:n}),O[r.to].type===p){if(k[O[r.to].color]=r.to,r.flags&I.KSIDE_CASTLE){var o=r.to-1,i=r.to+1;O[o]=O[i],O[i]=null}else if(r.flags&I.QSIDE_CASTLE){o=r.to+1,i=r.to-2;O[o]=O[i],O[i]=null}D[n]=""}if(D[n])for(var f=0,a=E[n].length;f<a;f++)if(r.from===E[n][f].square&&D[n]&E[n][f].flag){D[n]^=E[n][f].flag;break}if(D[t])for(f=0,a=E[t].length;f<a;f++)if(r.to===E[t][f].square&&D[t]&E[t][f].flag){D[t]^=E[t][f].flag;break}K=r.flags&I.BIG_PAWN?"b"===q?r.to-16:r.to+16:l,r.piece===_||r.flags&(I.CAPTURE|I.EP_CAPTURE)?d=0:d++,q===u&&b++,q=ar(q)}function nr(){var r=Q.pop();if(null==r)return null;var e=r.move;k=r.kings,q=r.turn,D=r.castling,K=r.ep_square,d=r.half_moves,b=r.move_number;var n,t,o=q,i=ar(q);if(O[e.from]=O[e.to],O[e.from].type=e.piece,O[e.to]=null,e.flags&I.CAPTURE)O[e.to]={type:e.captured,color:i};else if(e.flags&I.EP_CAPTURE){var f;f=o===u?e.to-16:e.to+16,O[f]={type:_,color:i}}e.flags&(I.KSIDE_CASTLE|I.QSIDE_CASTLE)&&(e.flags&I.KSIDE_CASTLE?(n=e.to+1,t=e.to-1):e.flags&I.QSIDE_CASTLE&&(n=e.to-2,t=e.to+1),O[n]=O[t],O[t]=null);return e}function tr(r,e){var n=J(r);if(e){var t=n.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);if(t)var o=t[1],i=t[2],f=t[3],a=t[4]}for(var l=Z(),u=0,s=l.length;u<s;u++){if(n===J(z(l[u]))||e&&n===J(z(l[u],!0)))return l[u];if(t&&(!o||o.toLowerCase()==l[u].piece)&&N[i]==l[u].from&&N[f]==l[u].to&&(!a||a.toLowerCase()==l[u].promotion))return l[u]}return null}function or(r){return r>>4}function ir(r){return 15&r}function fr(r){var e=ir(r),n=or(r);return"abcdefgh".substring(e,e+1)+"87654321".substring(n,n+1)}function ar(r){return r===s?u:s}function lr(r){var e=function r(e){var n=e instanceof Array?[]:{};for(var t in e)n[t]="object"==typeof t?r(e[t]):e[t];return n}(r);e.san=z(e,!1),e.to=fr(e.to),e.from=fr(e.from);var n="";for(var t in I)I[t]&e.flags&&(n+=o[t]);return e.flags=n,e}function ur(r){return r.replace(/^\s+|\s+$/g,"")}return B(void 0===r?e:r),{WHITE:s,BLACK:u,PAWN:_,KNIGHT:A,BISHOP:S,ROOK:m,QUEEN:y,KING:p,SQUARES:function(){for(var r=[],e=N.a8;e<=N.h1;e++)136&e?e+=7:r.push(fr(e));return r}(),FLAGS:o,load:function(r){return B(r)},reset:function(){return j()},moves:function(r){for(var e=Z(r),n=[],t=0,o=e.length;t<o;t++)void 0!==r&&"verbose"in r&&r.verbose?n.push(lr(e[t])):n.push(z(e[t],!1));return n},in_check:function(){return f()},in_checkmate:function(){return a()},in_stalemate:function(){return n()},in_draw:function(){return 100<=d||n()||Y()||rr()},insufficient_material:function(){return Y()},in_threefold_repetition:function(){return rr()},game_over:function(){return 100<=d||a()||n()||Y()||rr()},validate_fen:function(r){return $(r)},fen:function(){return M()},board:function(){for(var r=[],e=[],n=N.a8;n<=N.h1;n++)null==O[n]?e.push(null):e.push({type:O[n].type,color:O[n].color}),n+1&136&&(r.push(e),e=[],n+=8);return r},pgn:function(r){var e="object"==typeof r&&"string"==typeof r.newline_char?r.newline_char:"\n",n="object"==typeof r&&"number"==typeof r.max_width?r.max_width:0,t=[],o=!1;for(var i in U)t.push("["+i+' "'+U[i]+'"]'+e),o=!0;o&&Q.length&&t.push(e);for(var f=[];0<Q.length;)f.push(nr());for(var a=[],l="";0<f.length;){var u=f.pop();Q.length||"b"!==u.color?"w"===u.color&&(l.length&&a.push(l),l=b+"."):l=b+". ...",l=l+" "+z(u,!1),er(u)}if(l.length&&a.push(l),void 0!==U.Result&&a.push(U.Result),0===n)return t.join("")+a.join(" ");var s=0;for(i=0;i<a.length;i++)s+a[i].length>n&&0!==i?(" "===t[t.length-1]&&t.pop(),t.push(e),s=0):0!==i&&(t.push(" "),s++),t.push(a[i]),s+=a[i].length;return t.join("")},load_pgn:function(r,e){var n=void 0!==e&&"sloppy"in e&&e.sloppy;function l(r){return r.replace(/\\/g,"\\")}var t="object"==typeof e&&"string"==typeof e.newline_char?e.newline_char:"\r?\n",o=new RegExp("^(\\[((?:"+l(t)+")|.)*\\])(?:"+l(t)+"){2}"),i=o.test(r)?o.exec(r)[1]:"";j();var f=function(r,e){for(var n="object"==typeof e&&"string"==typeof e.newline_char?e.newline_char:"\r?\n",t={},o=r.split(new RegExp(l(n))),i="",f="",a=0;a<o.length;a++)i=o[a].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/,"$1"),f=o[a].replace(/^\[[A-Za-z]+\s"(.*)"\]$/,"$1"),0<ur(i).length&&(t[i]=f);return t}(i,e);for(var a in f)G([a,f[a]]);if("1"===f.SetUp&&!("FEN"in f&&B(f.FEN,!0)))return!1;var u=r.replace(i,"").replace(new RegExp(l(t),"g")," ");u=u.replace(/(\{[^}]+\})+?/g,"");for(var s=/(\([^\(\)]+\))+?/g;s.test(u);)u=u.replace(s,"");var p=ur(u=(u=(u=u.replace(/\d+\.(\.\.)?/g,"")).replace(/\.\.\./g,"")).replace(/\$\d+/g,"")).split(new RegExp(/\s+/));p=p.join(",").replace(/,,+/g,",").split(",");for(var c="",v=0;v<p.length-1;v++){if(null==(c=tr(p[v],n)))return!1;er(c)}if(c=p[p.length-1],-1<g.indexOf(c))!function(r){for(var e in r)return 1}(U)||void 0!==U.Result||G(["Result",c]);else{if(null==(c=tr(c,n)))return!1;er(c)}return!0},header:function(){return G(arguments)},ascii:function(){return function(){for(var r="   +------------------------+\n",e=N.a8;e<=N.h1;e++){if(0===ir(e)&&(r+=" "+"87654321"[or(e)]+" |"),null==O[e])r+=" . ";else{var n=O[e].type;r+=" "+(O[e].color===s?n.toUpperCase():n.toLowerCase())+" "}e+1&136&&(r+="|\n",e+=8)}return r+="   +------------------------+\n",r+="     a  b  c  d  e  f  g  h\n"}()},turn:function(){return q},move:function(r,e){var n=void 0!==e&&"sloppy"in e&&e.sloppy,t=null;if("string"==typeof r)t=tr(r,n);else if("object"==typeof r)for(var o=Z(),i=0,f=o.length;i<f;i++)if(!(r.from!==fr(o[i].from)||r.to!==fr(o[i].to)||"promotion"in o[i]&&r.promotion!==o[i].promotion)){t=o[i];break}if(!t)return null;var a=lr(t);return er(t),a},undo:function(){var r=nr();return r?lr(r):null},clear:function(){return x()},put:function(r,e){return W(r,e)},get:function(r){return i(r)},remove:function(r){return n=i(e=r),O[N[e]]=null,n&&n.type===p&&(k[n.color]=l),F(M()),n;var e,n},perft:function(r){return function r(e){for(var n=Z({legal:!1}),t=0,o=q,i=0,f=n.length;i<f;i++)er(n[i]),X(o)||(0<e-1?t+=r(e-1):t++),nr();return t}(r)},square_color:function(r){if(r in N){var e=N[r];return(or(e)+ir(e))%2==0?"light":"dark"}return null},history:function(r){for(var e=[],n=[],t=(void 0!==r&&"verbose"in r&&r.verbose);0<Q.length;)e.push(nr());for(;0<e.length;){var o=e.pop();t?n.push(lr(o)):n.push(z(o)),er(o)}return n}}};"undefined"!=typeof exports&&(exports.Chess=Chess),"undefined"!=typeof define&&define(function(){return Chess});
/**
 * chess-evaluator.js - Score evaluation, win probability, and move classification for WhyBlunder.
 * Compatible with Browser and Node.js.
 */
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ChessEvaluator = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    const MATE_SCORE_CP = 10000;

    /**
     * Safely convert a score object or value to centipawns.
     * Handles mate scores: positive mate -> +10000 - dist*10, negative mate -> -10000 - dist*10.
     * @param {number|object} score - centipawn number or { cp, mate } object
     * @returns {number} centipawns
     */
    function scoreToCp(score) {
        if (score === null || score === undefined) return 0;
        if (typeof score === 'number') return score;
        if (typeof score === 'object') {
            if (score.mate !== undefined && score.mate !== null) {
                const m = score.mate;
                if (m === 0) return 0;
                return m > 0 ? (MATE_SCORE_CP - m * 10) : (-MATE_SCORE_CP - m * 10);
            }
            if (score.cp !== undefined && score.cp !== null) {
                return score.cp;
            }
        }
        return 0;
    }

    /**
     * Convert centipawns to win probability (0.0 to 1.0) using logistic model.
     * WP = 1 / (1 + 10^(-cp / 400))
     * @param {number} cp
     * @returns {number}
     */
    function cpToWinProb(cp) {
        const clamped = Math.max(-MATE_SCORE_CP, Math.min(MATE_SCORE_CP, cp));
        return 1.0 / (1.0 + Math.pow(10.0, -clamped / 400.0));
    }

    /**
     * Format a score object or CP number into readable notation (+1.25, -0.40, M2, -M4).
     * @param {number|object} score
     * @param {string} pov - 'w' or 'b'
     * @returns {string}
     */
    function formatScore(score, pov = 'w') {
        let isWhitePov = (pov === 'w' || pov === 'white');
        if (typeof score === 'object' && score !== null) {
            if (score.mate !== undefined && score.mate !== null) {
                const m = isWhitePov ? score.mate : -score.mate;
                return m > 0 ? `M${m}` : `-M${Math.abs(m)}`;
            }
            const cpVal = score.cp !== undefined ? score.cp : 0;
            const signedCp = isWhitePov ? cpVal : -cpVal;
            const sign = signedCp >= 0 ? '+' : '';
            return `${sign}${(signedCp / 100.0).toFixed(2)}`;
        }
        if (typeof score === 'number') {
            const signedCp = isWhitePov ? score : -score;
            const sign = signedCp >= 0 ? '+' : '';
            return `${sign}${(signedCp / 100.0).toFixed(2)}`;
        }
        return '+0.00';
    }

    // ---------------------------------------------------------------------
    // Phase 3 - adaptive classification (see docs/move-diagnostics-improvement-plan.md F3)
    // Everything below is pure and side-effect free. The legacy constants stay
    // the default so existing call sites are untouched.
    // ---------------------------------------------------------------------

    /** Legacy (context-free) classification bands. */
    const DEFAULT_THRESHOLDS = Object.freeze({ inaccuracy: 0.04, mistake: 0.10, blunder: 0.22 });
    const BRILLIANT_THRESHOLDS = Object.freeze({ maxSecondBestWp: 0.90, minWpGap: 0.05 });

    const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

    /** Home squares of the minor pieces, used by gamePhase() as a development proxy. */
    const MINOR_HOME_SQUARES = {
        w: ['b1', 'c1', 'f1', 'g1'],
        b: ['b8', 'c8', 'f8', 'g8']
    };

    function clamp(value, lo, hi) {
        if (!(typeof value === 'number') || !isFinite(value)) return lo;
        return value < lo ? lo : (value > hi ? hi : value);
    }

    function round4(value) {
        return Math.round(value * 10000) / 10000;
    }

    /**
     * Parse the board field of a FEN into a { square: pieceChar } map.
     * Tolerates a bare board field ("rnbq.../...") as well as a full FEN.
     * @param {string} fen
     * @returns {object} map from algebraic square to piece char ('' when unparseable)
     */
    function parseFenBoard(fen) {
        const board = {};
        if (!fen || typeof fen !== 'string') return board;
        const boardPart = fen.trim().split(/\s+/)[0];
        const ranks = boardPart.split('/');
        if (ranks.length !== 8) return board;
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let r = 0; r < 8; r++) {
            const rankNumber = 8 - r;
            let fileIndex = 0;
            for (const ch of ranks[r]) {
                if (ch >= '1' && ch <= '8') {
                    fileIndex += parseInt(ch, 10);
                    continue;
                }
                if (fileIndex > 7) break;
                if (PIECE_VALUES[ch.toLowerCase()] === undefined) return {};
                board[files[fileIndex] + rankNumber] = ch;
                fileIndex++;
            }
        }
        return board;
    }

    function colorOfPiece(pieceChar) {
        return pieceChar === pieceChar.toUpperCase() ? 'w' : 'b';
    }

    /**
     * Determine the game phase from a FEN. Side agnostic.
     * Uses total non-king material, queen presence, piece count and how many
     * minor pieces have left their home squares.
     * @param {string} fen
     * @returns {'opening'|'middlegame'|'endgame'}
     */
    function gamePhase(fen) {
        if (!fen || fen === 'start') return 'opening';
        const board = parseFenBoard(fen);
        const squares = Object.keys(board);
        if (squares.length === 0) return 'middlegame';

        let material = 0;
        let queens = 0;
        let pieces = 0;            // non-pawn, non-king units on the board
        let developedMinors = 0;

        for (const sq of squares) {
            const ch = board[sq];
            const type = ch.toLowerCase();
            const value = PIECE_VALUES[type];
            if (value === undefined) continue;
            material += value;
            if (type === 'q') queens++;
            if (type !== 'p' && type !== 'k') pieces++;
            if (type === 'n' || type === 'b') {
                const home = MINOR_HOME_SQUARES[colorOfPiece(ch)];
                if (home.indexOf(sq) === -1) developedMinors++;
            }
        }

        // Endgame: little material left, or a queenless simplified position,
        // or at most one piece per side beyond the pawns.
        if (material <= 20) return 'endgame';
        if (queens === 0 && material <= 26) return 'endgame';
        if (pieces <= 2) return 'endgame';

        // Opening: still close to the full army and most minors at home.
        if (material >= 62 && developedMinors <= 4) return 'opening';

        return 'middlegame';
    }

    /**
     * Normalise a MultiPV lines object ({1:{cp,mate,pv}, 2:{...}}) into an
     * ordered array. Missing / malformed entries are dropped.
     * @param {object} lines
     * @returns {Array<{index:number, cp:number, line:object}>}
     */
    function normalizeLines(lines) {
        if (!lines || typeof lines !== 'object') return [];
        const out = [];
        Object.keys(lines).forEach(key => {
            const index = parseInt(key, 10);
            if (!isFinite(index)) return;
            const line = lines[key];
            if (!line || typeof line !== 'object') return;
            if ((line.cp === undefined || line.cp === null) &&
                (line.mate === undefined || line.mate === null)) return;
            out.push({ index, cp: scoreToCp({ cp: line.cp, mate: line.mate }), line });
        });
        out.sort((a, b) => a.index - b.index);
        return out;
    }

    /** Win-probability gap between two centipawn scores, mapped onto 0..1. */
    function gapToSharpness(topCp, otherCp, scale) {
        const gap = cpToWinProb(topCp) - cpToWinProb(otherCp);
        return clamp(gap / scale, 0, 1);
    }

    /**
     * How sharp / forcing a position is, from its MultiPV spread.
     * 1.0 -> line 1 dominates line 2 by a wide margin (only-move territory).
     * 0.0 -> the top lines sit within a few centipawns of each other.
     * 0.5 -> indeterminate (no or a single line supplied); the neutral value
     *        that leaves classificationThresholds at the legacy constants.
     * @param {object} lines - MultiPV lines keyed 1..N
     * @returns {number} 0..1
     */
    function positionSharpness(lines) {
        const ordered = normalizeLines(lines);
        if (ordered.length < 2) return 0.5;
        const top = ordered[0].cp;
        const s12 = gapToSharpness(top, ordered[1].cp, 0.25);
        if (ordered.length < 3) return round4(s12);
        const s13 = gapToSharpness(top, ordered[2].cp, 0.35);
        return round4(clamp(0.8 * s12 + 0.2 * s13, 0, 1));
    }

    /**
     * Adaptive classification bands. Every input is optional; with no inputs
     * (or an empty object) this returns exactly the legacy 0.04/0.10/0.22.
     *
     * @param {object} [ctx]
     * @param {'opening'|'middlegame'|'endgame'} [ctx.phase]
     * @param {number} [ctx.sharpness] - 0..1 from positionSharpness(); 0.5 is neutral
     * @param {number} [ctx.wpBefore]  - win probability before the move (mover POV)
     * @param {number} [ctx.depth]     - search depth behind the evaluation
     * @param {number} [ctx.playerElo] - rating of the player being judged
     * @returns {{ inaccuracy: number, mistake: number, blunder: number }}
     */
    function classificationThresholds(ctx) {
        const opts = (ctx && typeof ctx === 'object') ? ctx : {};

        // --- sharpness: sharp -> tighter bands, quiet -> looser -------------
        const sharpness = (typeof opts.sharpness === 'number' && isFinite(opts.sharpness))
            ? clamp(opts.sharpness, 0, 1) : 0.5;
        const sharpFactor = 1 + 0.7 * (0.5 - sharpness);   // 0.65 .. 1.35

        // --- phase: endgames punish small losses, openings forgive ---------
        let phaseFactor = 1.0;
        if (opts.phase === 'opening') phaseFactor = 1.15;
        else if (opts.phase === 'endgame') phaseFactor = 0.85;

        // --- search reliability: shallow search is noisy --------------------
        let depthFactor = 1.0;
        if (typeof opts.depth === 'number' && isFinite(opts.depth)) {
            depthFactor = 1 + 0.4 * clamp((18 - opts.depth) / 10, 0, 1);
        }

        // --- decided positions: smooth replacement for the 0.95/0.90 cliff --
        // decisiveness is 0 at wp 0.5 and 1 at wp 0 or 1. The widening is
        // applied in full to the inaccuracy band and progressively less to the
        // mistake / blunder bands, so throwing a won game away is still a
        // blunder while shuffling in a won position is not an "inaccuracy".
        let decisiveness = 0;
        if (typeof opts.wpBefore === 'number' && isFinite(opts.wpBefore)) {
            decisiveness = clamp(Math.abs(clamp(opts.wpBefore, 0, 1) - 0.5) * 2, 0, 1);
        }
        const decidedWiden = 1.5 * decisiveness * decisiveness;   // 0 .. 1.5
        const decidedFactor = {
            inaccuracy: 1 + decidedWiden,
            mistake: 1 + 0.6 * decidedWiden,
            blunder: 1 + 0.3 * decidedWiden
        };

        const base = sharpFactor * phaseFactor * depthFactor;
        let inaccuracy = DEFAULT_THRESHOLDS.inaccuracy * base * decidedFactor.inaccuracy;
        let mistake = DEFAULT_THRESHOLDS.mistake * base * decidedFactor.mistake;
        let blunder = DEFAULT_THRESHOLDS.blunder * base * decidedFactor.blunder;

        // --- player rating: raise the inaccuracy floor for beginners --------
        if (typeof opts.playerElo === 'number' && isFinite(opts.playerElo) && opts.playerElo < 1800) {
            const floor = clamp(0.08 - (opts.playerElo - 800) * 0.00004, 0.04, 0.08);
            inaccuracy = Math.max(inaccuracy, floor);
        }

        inaccuracy = round4(clamp(inaccuracy, 0.005, 0.90));
        mistake = round4(clamp(mistake, 0.005, 0.92));
        blunder = round4(clamp(blunder, 0.005, 0.95));

        // keep the bands strictly ordered whatever the inputs did
        if (mistake <= inaccuracy) mistake = round4(inaccuracy * 1.5);
        if (blunder <= mistake) blunder = round4(mistake * 1.5);

        return { inaccuracy, mistake, blunder };
    }

    /**
     * Confidence in a classification: 'low' when the loss sits on a band
     * boundary or the search was shallow, 'medium' for mid-depth searches,
     * 'high' otherwise.
     * @param {number} wpLoss
     * @param {object} thresholds
     * @param {object|null} ctx
     * @returns {'low'|'medium'|'high'}
     */
    function classificationConfidence(wpLoss, thresholds, ctx) {
        const opts = (ctx && typeof ctx === 'object') ? ctx : {};
        const margin = (typeof opts.boundaryMargin === 'number' && isFinite(opts.boundaryMargin))
            ? opts.boundaryMargin : 0.02;
        if (thresholds) {
            const bands = [thresholds.inaccuracy, thresholds.mistake, thresholds.blunder];
            for (const band of bands) {
                if (Math.abs(wpLoss - band) <= margin) return 'low';
            }
        }
        if (typeof opts.depth === 'number' && isFinite(opts.depth)) {
            if (opts.depth < 12) return 'low';
            if (opts.depth < 16) return 'medium';
        }
        return 'high';
    }

    // ---------------------------------------------------------------------
    // Derivations from engine evidence for the currently-dead classifyMove
    // options (F2). These are exported for a later phase to wire in; no call
    // site uses them yet.
    // ---------------------------------------------------------------------

    /** Forced mate distance for the side to move, or null. */
    function mateDistance(score) {
        if (score === null || score === undefined) return null;
        if (typeof score === 'object') {
            if (score.mate !== undefined && score.mate !== null) return score.mate;
            if (score.cp !== undefined && score.cp !== null) return mateDistance(score.cp);
            return null;
        }
        if (typeof score === 'number') {
            if (score >= MATE_SCORE_CP - 1000) return 1;
            if (score <= -MATE_SCORE_CP + 1000) return -1;
            return null;
        }
        return null;
    }

    /**
     * Was the top line effectively the only move?
     * True when the engine reported a single line (only legal move under a
     * MultiPV > 1 search) or when line 1 dominates the rest.
     * @param {object} lines - MultiPV lines keyed 1..N
     * @param {object} [options] - { threshold: 0..1 sharpness cutoff, default 0.8 }
     * @returns {boolean}
     */
    function deriveIsOnlyMove(lines, options = {}) {
        const ordered = normalizeLines(lines);
        if (ordered.length === 0) return false;
        if (ordered.length === 1) return true;
        if (ordered.length >= 2 && cpToWinProb(ordered[1].cp) > 0.60) {
            return false;
        }
        const threshold = (typeof options.threshold === 'number' && isFinite(options.threshold))
            ? options.threshold : 0.8;
        return positionSharpness(lines) >= threshold;
    }

    /**
     * Did the played move throw away a forced mate the engine had found?
     * @param {number|object} bestScore   - engine score of the best move (mover POV)
     * @param {number|object} playedScore - engine score of the played move (mover POV)
     * @returns {boolean}
     */
    function deriveMateMissed(bestScore, playedScore) {
        const bestMate = mateDistance(bestScore);
        if (bestMate === null || bestMate <= 0) return false;
        const playedMate = mateDistance(playedScore);
        return playedMate === null || playedMate <= 0;
    }

    /** Material balance (in pawns) from one side's point of view. */
    function materialBalance(board, side) {
        let balance = 0;
        for (const sq in board) {
            const ch = board[sq];
            const value = PIECE_VALUES[ch.toLowerCase()];
            if (!value) continue;
            balance += (colorOfPiece(ch) === side) ? value : -value;
        }
        return balance;
    }

    /**
     * Apply a UCI move to a parsed board in place (handles captures, promotion,
     * en passant and castling). Returns false when the move cannot be applied.
     */
    function applyUciMove(board, uci) {
        if (!uci || typeof uci !== 'string' || uci.length < 4) return false;
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const promo = uci.length > 4 ? uci[4].toLowerCase() : '';
        const piece = board[from];
        if (!piece) return false;
        const type = piece.toLowerCase();
        const side = colorOfPiece(piece);

        // en passant: a pawn changing file onto an empty square
        if (type === 'p' && from[0] !== to[0] && !board[to]) {
            const capturedSquare = to[0] + from[1];
            delete board[capturedSquare];
        }

        // castling: king moving two files
        if (type === 'k' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2) {
            const rank = from[1];
            if (to[0] === 'g') {
                const rook = board['h' + rank];
                if (rook) { delete board['h' + rank]; board['f' + rank] = rook; }
            } else if (to[0] === 'c') {
                const rook = board['a' + rank];
                if (rook) { delete board['a' + rank]; board['d' + rank] = rook; }
            }
        }

        delete board[from];
        if (promo && PIECE_VALUES[promo] !== undefined) {
            board[to] = (side === 'w') ? promo.toUpperCase() : promo;
        } else {
            board[to] = piece;
        }
        return true;
    }

    /**
     * Did the played move give material up along the engine's line and not get
     * it back? (The "is it sound?" half of brilliancy lives in classifyMove,
     * which also requires playedIsBest and a healthy wpAfter.)
     * @param {string} fenBefore - position before the played move
     * @param {string} playedMove - UCI of the played move (e.g. 'f3e5', 'e7e8q')
     * @param {Array<string>} pv - engine principal variation in UCI. It may
     *        start with the played move or continue after it.
     * @param {object} [options] - { minMaterial: pawns given up, default 1; maxPlies: default 8 }
     * @returns {boolean}
     */
    function deriveIsSacrifice(fenBefore, playedMove, pv, options = {}) {
        const board = parseFenBoard(fenBefore);
        if (Object.keys(board).length === 0) return false;
        if (!playedMove || typeof playedMove !== 'string' || playedMove.length < 4) return false;
        const mover = board[playedMove.slice(0, 2)] ? colorOfPiece(board[playedMove.slice(0, 2)]) : null;
        if (!mover) return false;

        const minMaterial = (typeof options.minMaterial === 'number') ? options.minMaterial : 1;
        const maxPlies = (typeof options.maxPlies === 'number') ? options.maxPlies : 8;

        const pvMoves = Array.isArray(pv) ? pv.filter(m => typeof m === 'string') : [];
        if (pvMoves.length === 0 || pvMoves[0] !== playedMove) {
            return false;
        }

        const line = pvMoves.slice(0, maxPlies);
        if (line.length < 2) return false;

        const before = materialBalance(board, mover);
        let current = before;
        let applied = 0;
        let opponentCapturedNonPawn = false;
        let settledSamples = [];

        for (let i = 0; i < line.length; i++) {
            const move = line[i];
            const isOpponentPly = (i % 2 === 1);

            if (isOpponentPly) {
                const toSq = move.slice(2, 4);
                const targetPiece = board[toSq];
                if (targetPiece) {
                    const type = targetPiece.toLowerCase();
                    const val = PIECE_VALUES[type];
                    if (val >= 3 && colorOfPiece(targetPiece) === mover) {
                        opponentCapturedNonPawn = true;
                    }
                }
            }

            if (!applyUciMove(board, move)) break;
            applied++;
            
            current = materialBalance(board, mover);
            
            if (i >= 2 && i % 2 === 0) {
                settledSamples.push(current);
            }
        }
        
        if (applied < 2) return false;

        let settled;
        if (settledSamples.length > 0) {
            settled = Math.min(...settledSamples);
        } else {
            settled = current;
        }

        return opponentCapturedNonPawn && (settled <= before - minMaterial) && (current <= before - 1);
    }


    /**
     * Legacy classification - the exact bands and ordering shipped before
     * Phase 3. Used whenever no `context` is supplied, so existing call sites
     * are bit-for-bit unchanged.
     */
    function classifyMoveLegacy(wpBefore, wpAfter, flags) {
        const { playedIsBest, isBook, isSacrifice, isOnlyMove, mateMissed, secondBestWp } = flags;

        if (isBook) {
            return { uiQuality: 'good move', detailedQuality: 'book', wpLoss: 0.0 };
        }

        const wpLoss = Math.max(0.0, wpBefore - wpAfter);

        if (playedIsBest) {
            if (isSacrifice && wpAfter >= 0.60 &&
                secondBestWp !== undefined && secondBestWp !== null &&
                secondBestWp < BRILLIANT_THRESHOLDS.maxSecondBestWp &&
                (wpAfter - secondBestWp) >= BRILLIANT_THRESHOLDS.minWpGap) {
                return { uiQuality: 'good move', detailedQuality: 'brilliant', wpLoss };
            }
            if (isOnlyMove && (wpAfter >= 0.20 || wpLoss <= 0.01)) {
                return { uiQuality: 'good move', detailedQuality: 'great', wpLoss };
            }
            if (wpLoss <= 0.01) {
                return { uiQuality: 'good move', detailedQuality: 'best', wpLoss };
            }
            return { uiQuality: 'good move', detailedQuality: 'excellent', wpLoss };
        }

        // Heavy winning simplification safeguard
        if (wpBefore >= 0.95 && wpAfter >= 0.90) {
            if (wpLoss < 0.15) {
                return { uiQuality: 'good move', detailedQuality: 'good', wpLoss };
            } else {
                return { uiQuality: 'inaccuracy', detailedQuality: 'inaccuracy', wpLoss };
            }
        }

        // Missed win
        if ((wpBefore >= 0.85 && wpAfter < 0.55) || mateMissed) {
            return { uiQuality: 'blunder', detailedQuality: 'missed win', wpLoss };
        }

        if (wpLoss >= 0.22) {
            return { uiQuality: 'blunder', detailedQuality: 'blunder', wpLoss };
        } else if (wpLoss >= 0.10) {
            return { uiQuality: 'mistake', detailedQuality: 'mistake', wpLoss };
        } else if (wpLoss >= 0.04) {
            return { uiQuality: 'inaccuracy', detailedQuality: 'inaccuracy', wpLoss };
        } else if (wpLoss <= 0.015) {
            return { uiQuality: 'good move', detailedQuality: 'excellent', wpLoss };
        } else {
            return { uiQuality: 'good move', detailedQuality: 'good', wpLoss };
        }
    }

    /**
     * Context-aware classification: same ladder, but the bands come from
     * classificationThresholds() and the hard 0.95/0.90 "winning simplification"
     * cliff is replaced by the smooth widening those thresholds already apply
     * as wpBefore approaches 0 or 1.
     */
    function classifyMoveAdaptive(wpBefore, wpAfter, flags, thresholds) {
        const { playedIsBest, isBook, isSacrifice, isOnlyMove, mateMissed, secondBestWp } = flags;

        if (isBook) {
            return { uiQuality: 'good move', detailedQuality: 'book', wpLoss: 0.0 };
        }

        const wpLoss = Math.max(0.0, wpBefore - wpAfter);

        if (playedIsBest) {
            if (isSacrifice && wpAfter >= 0.60 &&
                secondBestWp !== undefined && secondBestWp !== null &&
                secondBestWp < BRILLIANT_THRESHOLDS.maxSecondBestWp &&
                (wpAfter - secondBestWp) >= BRILLIANT_THRESHOLDS.minWpGap) {
                return { uiQuality: 'good move', detailedQuality: 'brilliant', wpLoss };
            }
            if (isOnlyMove && (wpAfter >= 0.20 || wpLoss <= 0.01)) {
                return { uiQuality: 'good move', detailedQuality: 'great', wpLoss };
            }
            if (wpLoss <= 0.01) {
                return { uiQuality: 'good move', detailedQuality: 'best', wpLoss };
            }
            return { uiQuality: 'good move', detailedQuality: 'excellent', wpLoss };
        }

        // Missed win (a found-then-thrown-away forced mate always counts)
        if ((wpBefore >= 0.85 && wpAfter < 0.55) || mateMissed) {
            return { uiQuality: 'blunder', detailedQuality: 'missed win', wpLoss };
        }

        const excellentCutoff = thresholds.inaccuracy * 0.375;   // 0.015 at the legacy 0.04

        if (wpLoss >= thresholds.blunder) {
            return { uiQuality: 'blunder', detailedQuality: 'blunder', wpLoss };
        } else if (wpLoss >= thresholds.mistake) {
            return { uiQuality: 'mistake', detailedQuality: 'mistake', wpLoss };
        } else if (wpLoss >= thresholds.inaccuracy) {
            return { uiQuality: 'inaccuracy', detailedQuality: 'inaccuracy', wpLoss };
        } else if (wpLoss <= excellentCutoff) {
            return { uiQuality: 'good move', detailedQuality: 'excellent', wpLoss };
        } else {
            return { uiQuality: 'good move', detailedQuality: 'good', wpLoss };
        }
    }

    /**
     * Classify move based on win probability difference and tactical context.
     * @param {number} wpBefore - Win probability before the move (from mover's perspective)
     * @param {number} wpAfter - Win probability after the move (from mover's perspective)
     * @param {object} options
     * @param {boolean} [options.playedIsBest]
     * @param {boolean} [options.isBook]
     * @param {boolean} [options.isSacrifice] - see deriveIsSacrifice()
     * @param {boolean} [options.isOnlyMove]  - see deriveIsOnlyMove()
     * @param {boolean} [options.mateMissed]  - see deriveMateMissed()
     * @param {object} [options.context] - OPT-IN adaptive classification:
     *        { phase, sharpness, depth, playerElo }. When omitted the legacy
     *        0.04 / 0.10 / 0.22 bands and the legacy ladder are used verbatim.
     * @returns {{ uiQuality: string, detailedQuality: string, wpLoss: number, confidence: string }}
     */
    function classifyMove(wpBefore, wpAfter, options = {}) {
        const {
            playedIsBest = false,
            isBook = false,
            isSacrifice = false,
            isOnlyMove = false,
            mateMissed = false,
            secondBestWp = null,
            context = null
        } = options;

        const flags = { playedIsBest, isBook, isSacrifice, isOnlyMove, mateMissed, secondBestWp };
        const ctx = (context && typeof context === 'object') ? context : null;

        let result;
        let thresholds;
        if (ctx) {
            thresholds = classificationThresholds({
                phase: ctx.phase,
                sharpness: ctx.sharpness,
                wpBefore: wpBefore,
                depth: ctx.depth,
                playerElo: ctx.playerElo
            });
            result = classifyMoveAdaptive(wpBefore, wpAfter, flags, thresholds);
        } else {
            thresholds = DEFAULT_THRESHOLDS;
            result = classifyMoveLegacy(wpBefore, wpAfter, flags);
        }

        // Additive only: never removes or renames an existing field.
        // A book move is certain; a best move can only be doubted by search depth.
        result.confidence = isBook
            ? 'high'
            : classificationConfidence(result.wpLoss, playedIsBest ? null : thresholds, ctx);
        return result;
    }

    /**
     * Determine if a move is a key moment in the game (blunder, missed win, miss, brilliant, great).
     * Skips mistakes and inaccuracies to focus on major turning points.
     * @param {object} move
     * @returns {boolean}
     */
    function isKeyMoment(move) {
        if (!move) return false;
        const q = (move.detailed_quality || move.quality || '').toLowerCase();
        // Skip mistakes and inaccuracies to focus on game-defining moments
        if (q === 'mistake' || q === 'inaccuracy') {
            return false;
        }
        if (['blunder', 'missed win', 'miss', 'brilliant', 'great'].includes(q)) {
            return true;
        }
        if (typeof move.win_prob_loss === 'number' && move.win_prob_loss >= 0.20) {
            return true;
        }
        if (Array.isArray(move.tags) && move.tags.length > 0) {
            const keyTag = move.tags.some(tag => {
                const t = tag.toLowerCase();
                return t.includes('missed win') || t.includes('missed mate') || t.includes('checkmate');
            });
            if (keyTag) return true;
        }
        return false;
    }

    /**
     * Calculate material counts and advantage difference from a FEN string.
     * @param {string} fen
     * @returns {{
     *   whiteScore: number,
     *   blackScore: number,
     *   scoreDiff: number,
     *   whitePieces: Array<{ type: string, count: number }>,
     *   blackPieces: Array<{ type: string, count: number }>
     * }}
     */
    function calculateMaterialDifference(fen) {
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
        const counts = {
            w: { p: 0, n: 0, b: 0, r: 0, q: 0, total: 0 },
            b: { p: 0, n: 0, b: 0, r: 0, q: 0, total: 0 }
        };

        if (!fen || fen === 'start') {
            return {
                whiteScore: 39,
                blackScore: 39,
                scoreDiff: 0,
                whitePieces: [],
                blackPieces: []
            };
        }

        const boardPart = fen.split(' ')[0];
        for (const char of boardPart) {
            if ((char >= '1' && char <= '8') || char === '/') continue;
            const isWhite = (char === char.toUpperCase());
            const type = char.toLowerCase();
            if (pieceValues[type] !== undefined) {
                const side = isWhite ? 'w' : 'b';
                counts[side][type]++;
                counts[side].total += pieceValues[type];
            }
        }

        const pieceTypes = ['p', 'n', 'b', 'r', 'q'];
        const whitePieces = [];
        const blackPieces = [];

        pieceTypes.forEach(type => {
            const diff = counts.w[type] - counts.b[type];
            if (diff > 0) {
                whitePieces.push({ type, count: diff });
            } else if (diff < 0) {
                blackPieces.push({ type, count: Math.abs(diff) });
            }
        });

        const scoreDiff = counts.w.total - counts.b.total;

        return {
            whiteScore: counts.w.total,
            blackScore: counts.b.total,
            scoreDiff,
            whitePieces,
            blackPieces
        };
    }

    /**
     * Per-move accuracy (0-100) from win-probability loss (0.0-1.0), using the
     * exponential curve popularised by Lichess/chess.com accuracy scores.
     * @param {number} wpLoss - win probability lost by the mover (0.0 to 1.0)
     * @returns {number} accuracy percentage
     */
    function moveAccuracy(wpLoss) {
        const lossPct = Math.max(0, Math.min(1, Number(wpLoss) || 0)) * 100;
        const acc = 103.1668 * Math.exp(-0.04354 * lossPct) - 3.1669;
        return Math.max(0, Math.min(100, acc));
    }

    function aggregateAccuracy(values) {
        if (!values.length) return null;
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        // Harmonic mean punishes isolated blunders the way players expect.
        const harmonic = values.length / values.reduce((a, v) => a + 1 / Math.max(v, 1), 0);
        return Math.round(((mean + harmonic) / 2) * 10) / 10;
    }

    function isBookMove(move) {
        return (move.detailed_quality || '').toLowerCase() === 'book';
    }

    /**
     * Game accuracy per side from analyzed moves (output-contract objects).
     * Book moves count as perfect. Deterministic for a given move list.
     * @param {Array} moves - analyzed moves with is_white and win_prob_loss
     * @returns {{white: number|null, black: number|null}}
     */
    function gameAccuracy(moves) {
        const white = [];
        const black = [];
        (moves || []).forEach(move => {
            if (!move) return;
            const acc = isBookMove(move) ? 100 : moveAccuracy(move.win_prob_loss);
            (move.is_white ? white : black).push(acc);
        });
        return { white: aggregateAccuracy(white), black: aggregateAccuracy(black) };
    }

    /**
     * Accuracy per side for each game phase.
     * @param {Array} moves - analyzed moves
     * @param {Array<string>} fens - pre-move FEN for each move (same indexing)
     * @returns {{opening: object, middlegame: object, endgame: object}}
     */
    function phaseAccuracy(moves, fens) {
        const buckets = { opening: [], middlegame: [], endgame: [] };
        (moves || []).forEach((move, i) => {
            if (!move) return;
            const phase = gamePhase(fens && fens[i]);
            buckets[phase].push(move);
        });
        return {
            opening: gameAccuracy(buckets.opening),
            middlegame: gameAccuracy(buckets.middlegame),
            endgame: gameAccuracy(buckets.endgame)
        };
    }

    return {
        MATE_SCORE_CP,
        DEFAULT_THRESHOLDS,
        BRILLIANT_THRESHOLDS,
        scoreToCp,
        cpToWinProb,
        formatScore,
        classifyMove,
        isKeyMoment,
        calculateMaterialDifference,
        // Phase 3 / F8 additions
        gamePhase,
        positionSharpness,
        classificationThresholds,
        classificationConfidence,
        deriveIsOnlyMove,
        deriveMateMissed,
        deriveIsSacrifice,
        // Game Review accuracy
        moveAccuracy,
        gameAccuracy,
        phaseAccuracy
    };
}));
ChessEvaluator=self.ChessEvaluator;
/**
 * opening-detector.js - Opening classification, ECO recognition, and opening principles for WhyBlunder.
 * Compatible with Browser and Node.js.
 */
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.OpeningDetector = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    const COMMON_OPENINGS = {
        "e4 e5 Nf3 Nc6 Bc4": ["C50", "Italian Game"],
        "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d3 d6 O-O O-O": ["C53", "Italian Game: Giuoco Piano"],
        "e4 e5 Nf3 Nc6 Bc4 Nf6 d3 Bc5 O-O O-O": ["C55", "Two Knights Defense"],
        "e4 e5 Nf3 Nc6 Bb5": ["C60", "Ruy Lopez"],
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O": ["C88", "Ruy Lopez: Closed"],
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1": ["C84", "Ruy Lopez: Closed"],
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4 d4 b5 Bb3 d5 dxe5 Be6": ["C80", "Ruy Lopez: Open"],
        "e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4 Nd6 Bxc6 dxc6 dxe5 Nf5 Qxd8+ Kxd8": ["C67", "Ruy Lopez: Berlin Defense"],
        "e4 e5 Nf3 Nc6 d4": ["C44", "Scotch Game"],
        "e4 e5 Nf3 Nf6": ["C42", "Petrov's Defense"],
        "e4 e5 f4": ["C30", "King's Gambit"],
        "e4 c5": ["B20", "Sicilian Defense"],
        "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6": ["B90", "Sicilian Defense: Najdorf Variation"],
        "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6": ["B70", "Sicilian Defense: Dragon Variation"],
        "e4 c5 Nf3 e6": ["B40", "Sicilian Defense: French Variation"],
        "e4 c5 Nf3 Nc6": ["B30", "Sicilian Defense: Old Sicilian"],
        "e4 e6": ["C00", "French Defense"],
        "e4 e6 d4 d5": ["C01", "French Defense: Normal"],
        "e4 c6": ["B10", "Caro-Kann Defense"],
        "e4 c6 d4 d5": ["B12", "Caro-Kann Defense: Main Line"],
        "e4 d5": ["B01", "Scandinavian Defense"],
        "e4 d6": ["B07", "Pirc Defense"],
        "e4 g6": ["B06", "Modern Defense"],
        "e4 Nf6": ["B02", "Alekhine's Defense"],
        "d4 d5 c4": ["D06", "Queen's Gambit"],
        "d4 d5 c4 e6": ["D30", "Queen's Gambit Declined"],
        "d4 d5 c4 e6 Nc3": ["D31", "Queen's Gambit Declined: 3.Nc3"],
        "d4 d5 c4 e6 Nf3": ["D30", "Queen's Gambit Declined: 3.Nf3"],
        "d4 d5 c4 dxc4": ["D20", "Queen's Gambit Accepted"],
        "d4 d5 c4 c6": ["D10", "Slav Defense"],
        "d4 d5 Bf4": ["D00", "London System"],
        "d4 Nf6 c4 g6": ["E60", "King's Indian Defense"],
        "d4 Nf6 c4 e6 Nc3 Bb4": ["E20", "Nimzo-Indian Defense"],
        "d4 Nf6 c4 e6 Nf3 b6": ["E12", "Queen's Indian Defense"],
        "d4 Nf6 c4 c5": ["A56", "Benoni Defense"],
        "d4 f5": ["A80", "Dutch Defense"],
        "d4 g6": ["A40", "Queen's Pawn Game: Modern Defense"],
        "c4": ["A10", "English Opening"],
        "c4 e5": ["A20", "English Opening: King's English"],
        "c4 e6 d4 d5": ["D30", "Queen's Gambit Declined (via English)"],
        "c4 e6 d4 d5 Nc3": ["D31", "Queen's Gambit Declined (via English)"],
        "Nf3": ["A04", "Réti Opening"],
        "b3": ["A01", "Nimzo-Larsen Attack"],
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6": ["E70", "King's Indian: Normal"],
        "d4 Nf6 c4 g6 Nc3 d5": ["D80", "Grünfeld Defense"],
        "d4 Nf6 c4 e6 g3 d5 Bg2": ["E00", "Catalan Opening"],
        "d4 d5 c4 c6 Nf3 Nf6 Nc3 e6": ["D43", "Semi-Slav Defense"],
        "e4 e5 Nf3 Nc6 Bc4 Bc5 b4": ["C51", "Evans Gambit"],
        "e4 e5 Nf3 Nc6 Nc3 Nf6": ["C47", "Four Knights Game"],
        "e4 e5 Nc3": ["C25", "Vienna Game"],
        "e4 c5 c3": ["B22", "Sicilian Defense: Alapin Variation"],
        "e4 c5 Nc3": ["B23", "Sicilian Defense: Closed"],
        "e4 e6 d4 d5 e5": ["C02", "French Defense: Advance Variation"],
        "e4 e6 d4 d5 Nc3 Bb4": ["C15", "French Defense: Winawer Variation"],
        "e4 c6 d4 d5 e5": ["B12", "Caro-Kann: Advance Variation"]
    };

    function getChessConstructor() {
        if (typeof Chess !== 'undefined') return Chess;
        if (typeof window !== 'undefined' && window.Chess) return window.Chess;
        if (typeof global !== 'undefined' && global.Chess) return global.Chess;
        try {
            const c = require('./chess.min.js');
            return c.Chess || c;
        } catch (e) {
            return null;
        }
    }

    /**
     * Precomputed position-keyed table: { [fenBoardKey]: { eco, name, depth } }
     * Enables O(1) book lookup that automatically recognizes transpositions.
     */
    const BOOK_POSITION_MAP = {};

    function initBookPositions() {
        const ChessCtor = getChessConstructor();
        if (!ChessCtor) return;
        for (const [seq, [eco, name]] of Object.entries(COMMON_OPENINGS)) {
            // Clean move string of any stray move numbers (e.g. "2. d4")
            const rawTokens = seq.split(/\s+/);
            const moves = rawTokens.filter(t => !/^\d+\.?$/.test(t));
            try {
                const game = new ChessCtor();
                for (let i = 0; i < moves.length; i++) {
                    const m = game.move(moves[i]);
                    if (!m) break;
                    const boardKey = game.fen().split(' ')[0];
                    if (!BOOK_POSITION_MAP[boardKey]) {
                        BOOK_POSITION_MAP[boardKey] = { eco, name, depth: i + 1 };
                    }
                }
            } catch (e) {}
        }
    }
    initBookPositions();

    /**
     * Identify opening and ECO code from SAN moves or board FEN.
     * @param {string[]} sanMoves
     * @param {string} [fen]
     * @returns {{ eco: string, name: string }}
     */
    function identifyOpening(sanMoves, fen) {
        // 1. Direct sequence match
        if (sanMoves && sanMoves.length > 0) {
            for (let length = Math.min(16, sanMoves.length); length > 0; length--) {
                const subSeq = sanMoves.slice(0, length).join(' ');
                if (COMMON_OPENINGS[subSeq]) {
                    const [eco, name] = COMMON_OPENINGS[subSeq];
                    return { eco, name };
                }
            }
        }

        // 2. Position key lookup
        if (fen && typeof fen === 'string') {
            const boardKey = fen.split(' ')[0];
            if (BOOK_POSITION_MAP[boardKey]) {
                return { eco: BOOK_POSITION_MAP[boardKey].eco, name: BOOK_POSITION_MAP[boardKey].name };
            }
        }

        return { eco: 'A00', name: 'Irregular Opening' };
    }

    /**
     * Determine if a board position is in the book transposition table.
     * @param {string} fen
     * @returns {boolean}
     */
    function isBookPosition(fen) {
        if (!fen || typeof fen !== 'string') return false;
        const boardKey = fen.split(' ')[0];
        return Boolean(BOOK_POSITION_MAP[boardKey]);
    }

    /**
     * Determine if a move at `ply` is part of recognized book opening theory.
     * Supports both prefix matching and transpositional position lookup.
     * @param {string[]} sanMoves
     * @param {number} ply - 1-indexed ply
     * @param {string} [fen] - optional FEN of resulting position
     * @returns {boolean}
     */
    function isBookMove(sanMoves, ply, fen) {
        if (ply > 16) {
            return false;
        }

        // 1. Explicit board FEN check
        if (fen && typeof fen === 'string') {
            const boardKey = fen.split(' ')[0];
            if (BOOK_POSITION_MAP[boardKey]) return true;
        }

        // 2. Sequence prefix match
        if (sanMoves && Array.isArray(sanMoves) && sanMoves.length > 0) {
            const currentSeq = sanMoves.slice(0, ply).join(' ');
            for (const openingSeq of Object.keys(COMMON_OPENINGS)) {
                if (openingSeq.startsWith(currentSeq)) {
                    return true;
                }
            }

            // 3. Transposition support via board position simulation
            const ChessCtor = getChessConstructor();
            if (ChessCtor && sanMoves.length >= ply) {
                try {
                    const sim = new ChessCtor();
                    for (let i = 0; i < ply; i++) {
                        if (!sim.move(sanMoves[i])) break;
                    }
                    const simKey = sim.fen().split(' ')[0];
                    if (BOOK_POSITION_MAP[simKey]) return true;
                } catch (e) {}
            }
        }

        return false;
    }

    /**
     * Detect opening principle violations on moves 1-10:
     * 1. Early queen sorties.
     * 2. Moving the same minor piece twice without development.
     * 3. Flank pawn pushes before minor piece development.
     * 4. Blocking central pawns with bishops.
     * @param {object} boardBefore - chess.js instance before the move
     * @param {object} move - move object { from, to, piece, ... }
     * @param {number} ply - 1-indexed ply
     * @param {object} [options] - { bestUci }
     * @returns {string|null}
     */
    function detectOpeningPrincipleViolation(boardBefore, move, ply, options = {}) {
        if (ply > 16 || !move) return null;

        // If played move matches the engine's best move, it is an acceptable exception
        if (options.bestUci && options.bestUci === (move.from + move.to)) {
            return null;
        }

        const piece = boardBefore.get(move.from);
        if (!piece) return null;

        const color = boardBefore.turn();
        const homeRank = (color === 'w' ? 1 : 8);
        const fromRank = parseInt(move.from.charAt(1), 10);
        const isCapture = Boolean(boardBefore.get(move.to));
        const inCheck = boardBefore.in_check();

        // 1. Early Queen development (ply <= 8)
        if (piece.type === 'q' && ply <= 8) {
            if (!isCapture && !inCheck) {
                return "developing the Queen too early, leaving it vulnerable to minor piece harassment";
            }
        }

        // 2. Moving the same minor piece twice in first 12 plies
        if ((piece.type === 'n' || piece.type === 'b') && ply <= 12) {
            if (fromRank !== homeRank && !isCapture) {
                // Check if piece was attacked on from square; retreating or moving is NOT a violation
                const oppColor = (color === 'w' ? 'b' : 'w');
                let wasAttacked = false;
                if (typeof SituationRecognizer !== 'undefined' && typeof SituationRecognizer.isSquareAttackedBy === 'function') {
                    wasAttacked = SituationRecognizer.isSquareAttackedBy(boardBefore, oppColor, move.from);
                }
                if (!wasAttacked) {
                    const pieceName = (piece.type === 'n' ? 'knight' : 'bishop');
                    return `moving the same ${pieceName} twice in the opening instead of developing other pieces`;
                }
            }
        }

        // 3. Early flank pawn push before minor development (ply <= 8)
        if (piece.type === 'p' && (move.from[0] === 'a' || move.from[0] === 'h') && ply <= 8) {
            if (!isCapture && !inCheck) {
                const bKnight = boardBefore.get(color === 'w' ? 'b1' : 'b8');
                const gKnight = boardBefore.get(color === 'w' ? 'g1' : 'g8');
                if (bKnight && bKnight.type === 'n' && gKnight && gKnight.type === 'n') {
                    return "pushing flank pawns early instead of developing central pieces and controlling the center";
                }
            }
        }

        // 4. Blocking central pawn with bishop in the opening (ply <= 10)
        if (piece.type === 'b' && ply <= 10) {
            const centralPawnsBlocked = (color === 'w')
                ? ((move.to === 'd3' && boardBefore.get('d2')?.type === 'p') || (move.to === 'e3' && boardBefore.get('e2')?.type === 'p'))
                : ((move.to === 'd6' && boardBefore.get('d7')?.type === 'p') || (move.to === 'e6' && boardBefore.get('e7')?.type === 'p'));
            if (centralPawnsBlocked && !isCapture) {
                return "blocking the central pawn with the bishop, hindering central development";
            }
        }

        return null;
    }

    return {
        COMMON_OPENINGS,
        BOOK_POSITION_MAP,
        identifyOpening,
        isBookPosition,
        isBookMove,
        detectOpeningPrincipleViolation
    };
}));
OpeningDetector=self.OpeningDetector;
/**
 * situation-recognizer.js - Tactical and positional pattern recognition for WhyBlunder.
 * Compatible with Browser and Node.js.
 */
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.SituationRecognizer = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    const PIECE_VALUES = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 100
    };

    const PIECE_NAMES = {
        p: 'pawn',
        n: 'knight',
        b: 'bishop',
        r: 'rook',
        q: 'queen',
        k: 'king'
    };

    function getChessConstructor() {
        if (typeof Chess !== 'undefined') return Chess;
        if (typeof window !== 'undefined' && window.Chess) return window.Chess;
        if (typeof global !== 'undefined' && global.Chess) return global.Chess;
        try {
            const c = require('./chess.min.js');
            return c.Chess || c;
        } catch (e) {
            return null;
        }
    }

    function squareToFile(sq) {
        return sq.charCodeAt(0) - 97; // 0..7
    }

    function squareToRank(sq) {
        return parseInt(sq.charAt(1)) - 1; // 0..7 (0-indexed)
    }

    function fileRankToSquare(file, rank) {
        return String.fromCharCode(97 + file) + (rank + 1);
    }

    /**
     * Compute squares attacked by a piece on `square`.
     * @param {object} chess - chess.js instance
     * @param {string} square - e.g. 'e4'
     * @returns {string[]} attacked squares
     */
    function getPieceAttacks(chess, square) {
        const p = chess.get(square);
        if (!p) return [];
        const file = squareToFile(square);
        const rank = squareToRank(square);
        const attacked = [];
        const color = p.color;

        if (p.type === 'p') {
            const dir = (color === 'w') ? 1 : -1;
            for (const df of [-1, 1]) {
                const nf = file + df;
                const nr = rank + dir;
                if (nf >= 0 && nf <= 7 && nr >= 0 && nr <= 7) {
                    attacked.push(fileRankToSquare(nf, nr));
                }
            }
        } else if (p.type === 'n') {
            const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
            for (const [df, dr] of offsets) {
                const nf = file + df;
                const nr = rank + dr;
                if (nf >= 0 && nf <= 7 && nr >= 0 && nr <= 7) {
                    attacked.push(fileRankToSquare(nf, nr));
                }
            }
        } else if (p.type === 'k') {
            for (let df = -1; df <= 1; df++) {
                for (let dr = -1; dr <= 1; dr++) {
                    if (df === 0 && dr === 0) continue;
                    const nf = file + df;
                    const nr = rank + dr;
                    if (nf >= 0 && nf <= 7 && nr >= 0 && nr <= 7) {
                        attacked.push(fileRankToSquare(nf, nr));
                    }
                }
            }
        } else {
            // Sliding pieces: b, r, q
            const dirs = [];
            if (p.type === 'b' || p.type === 'q') {
                dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
            }
            if (p.type === 'r' || p.type === 'q') {
                dirs.push([-1,0],[1,0],[0,-1],[0,1]);
            }
            for (const [df, dr] of dirs) {
                let nf = file + df;
                let nr = rank + dr;
                while (nf >= 0 && nf <= 7 && nr >= 0 && nr <= 7) {
                    const targetSq = fileRankToSquare(nf, nr);
                    attacked.push(targetSq);
                    if (chess.get(targetSq)) break; // blocked by piece
                    nf += df;
                    nr += dr;
                }
            }
        }
        return attacked;
    }

    /**
     * Check if a square is attacked by pieces of `color`.
     */
    function isSquareAttackedBy(chess, color, targetSq) {
        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                const sq = fileRankToSquare(f, r);
                const piece = chess.get(sq);
                if (piece && piece.color === color) {
                    const attacks = getPieceAttacks(chess, sq);
                    if (attacks.includes(targetSq)) return true;
                }
            }
        }
        return false;
    }

    /**
     * Get all attacking piece squares of `color` targeting `targetSq`.
     */
    function getAttackers(chess, color, targetSq) {
        const attackers = [];
        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                const sq = fileRankToSquare(f, r);
                const piece = chess.get(sq);
                if (piece && piece.color === color) {
                    const attacks = getPieceAttacks(chess, sq);
                    if (attacks.includes(targetSq)) attackers.push(sq);
                }
            }
        }
        return attackers;
    }

    function findKingSquare(chess, color) {
        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                const sq = fileRankToSquare(f, r);
                const p = chess.get(sq);
                if (p && p.type === 'k' && p.color === color) {
                    return sq;
                }
            }
        }
        return null;
    }

    /**
     * Detect direct attacks and threats created by the moved piece.
     */
    function detectThreatsCreated(boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece) return [];

        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');
        const threats = [];

        const attackedSquares = getPieceAttacks(boardAfter, move.to);
        const attackerVal = PIECE_VALUES[piece.type] || 1;

        for (const sq of attackedSquares) {
            const target = boardAfter.get(sq);
            if (!target || target.color !== oppColor) continue;

            const targetVal = PIECE_VALUES[target.type] || 1;
            const isDefended = isSquareAttackedBy(boardAfter, oppColor, sq);
            const targetName = PIECE_NAMES[target.type] || 'piece';

            if (target.type === 'k') {
                threats.push({
                    from: move.to,
                    to: sq,
                    target: targetName,
                    is_check: true,
                    is_undefended: true,
                    description: 'checks the enemy King'
                });
            } else if (!isDefended) {
                threats.push({
                    from: move.to,
                    to: sq,
                    target: targetName,
                    is_check: false,
                    is_undefended: true,
                    description: `attacks undefended ${targetName} on ${sq}`
                });
            } else if (targetVal >= attackerVal) {
                threats.push({
                    from: move.to,
                    to: sq,
                    target: targetName,
                    is_check: false,
                    is_defended: true,
                    description: `attacks the ${targetName} on ${sq}`
                });
            }
        }
        return threats;
    }

    // ------------------------------------------------------------------
    // Static Exchange Evaluation (SEE)
    // ------------------------------------------------------------------
    // A real iterative swap-off on a lightweight occupancy map. Because the
    // attacker set is recomputed from the *current* occupancy after every
    // capture, x-ray / battery attackers hiding behind a captured piece are
    // revealed automatically (rook or queen behind a rook on a file/rank,
    // bishop or queen behind a bishop on a diagonal). Absolutely pinned
    // defenders are excluded (a pinned piece may only capture along its own
    // pin ray), the king may only capture when the square is left undefended,
    // and either side may stand pat when continuing the exchange loses
    // material - that last rule is what makes SEE correct rather than a
    // count of attackers versus defenders.

    const SEE_MAX_PLY = 32;

    function oppositeColor(color) {
        return color === 'w' ? 'b' : 'w';
    }

    /**
     * Snapshot a chess.js board into a plain { square: {type, color} } map.
     * The caller's board is only read, never mutated.
     */
    function buildOccupancy(board) {
        const occ = Object.create(null);
        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                const sq = fileRankToSquare(f, r);
                const p = board.get(sq);
                if (p) occ[sq] = { type: p.type, color: p.color };
            }
        }
        return occ;
    }

    function cloneOccupancy(occ) {
        return Object.assign(Object.create(null), occ);
    }

    function findKingInOccupancy(occ, color) {
        for (const sq in occ) {
            const p = occ[sq];
            if (p.type === 'k' && p.color === color) return sq;
        }
        return null;
    }

    const SLIDE_DIAGONAL = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    const SLIDE_ORTHOGONAL = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const KNIGHT_OFFSETS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

    /**
     * All squares holding a `color` piece that pseudo-legally attacks `sq`
     * in the given occupancy map (pins ignored - this is raw control, which
     * is also what decides whether a king may step onto the square).
     */
    function rawAttackersTo(occ, sq, color) {
        const file = squareToFile(sq);
        const rank = squareToRank(sq);
        const out = [];

        // Pawns: a white pawn attacking `sq` stands one rank below it.
        const pawnRankOffset = (color === 'w') ? -1 : 1;
        for (const df of [-1, 1]) {
            const nf = file + df;
            const nr = rank + pawnRankOffset;
            if (nf < 0 || nf > 7 || nr < 0 || nr > 7) continue;
            const from = fileRankToSquare(nf, nr);
            const p = occ[from];
            if (p && p.color === color && p.type === 'p') out.push(from);
        }

        for (const [df, dr] of KNIGHT_OFFSETS) {
            const nf = file + df;
            const nr = rank + dr;
            if (nf < 0 || nf > 7 || nr < 0 || nr > 7) continue;
            const from = fileRankToSquare(nf, nr);
            const p = occ[from];
            if (p && p.color === color && p.type === 'n') out.push(from);
        }

        for (let df = -1; df <= 1; df++) {
            for (let dr = -1; dr <= 1; dr++) {
                if (df === 0 && dr === 0) continue;
                const nf = file + df;
                const nr = rank + dr;
                if (nf < 0 || nf > 7 || nr < 0 || nr > 7) continue;
                const from = fileRankToSquare(nf, nr);
                const p = occ[from];
                if (p && p.color === color && p.type === 'k') out.push(from);
            }
        }

        // Sliders: walk outwards until the first occupied square. Re-running
        // this after a capture is what exposes batteries / x-rays.
        const rays = [
            [SLIDE_DIAGONAL, 'b'],
            [SLIDE_ORTHOGONAL, 'r']
        ];
        for (const [dirs, sliderType] of rays) {
            for (const [df, dr] of dirs) {
                let nf = file + df;
                let nr = rank + dr;
                while (nf >= 0 && nf <= 7 && nr >= 0 && nr <= 7) {
                    const cur = fileRankToSquare(nf, nr);
                    const p = occ[cur];
                    if (p) {
                        if (p.color === color && (p.type === sliderType || p.type === 'q')) {
                            out.push(cur);
                        }
                        break;
                    }
                    nf += df;
                    nr += dr;
                }
            }
        }
        return out;
    }

    /**
     * If the piece on `sq` is absolutely pinned against `kingSq`, return the
     * pin direction [df, dr] pointing from the king outwards; otherwise null.
     */
    function pinDirection(occ, sq, kingSq) {
        const piece = occ[sq];
        if (!piece || !kingSq || sq === kingSq) return null;

        const kf = squareToFile(kingSq);
        const kr = squareToRank(kingSq);
        const df = squareToFile(sq) - kf;
        const dr = squareToRank(sq) - kr;

        let dirF;
        let dirR;
        if (df === 0 && dr === 0) return null;
        if (df === 0) {
            dirF = 0;
            dirR = dr > 0 ? 1 : -1;
        } else if (dr === 0) {
            dirR = 0;
            dirF = df > 0 ? 1 : -1;
        } else if (Math.abs(df) === Math.abs(dr)) {
            dirF = df > 0 ? 1 : -1;
            dirR = dr > 0 ? 1 : -1;
        } else {
            return null;
        }

        // Nothing may stand between the king and the candidate pinned piece.
        let f = kf + dirF;
        let r = kr + dirR;
        while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
            const cur = fileRankToSquare(f, r);
            if (cur === sq) break;
            if (occ[cur]) return null;
            f += dirF;
            r += dirR;
        }
        if (f < 0 || f > 7 || r < 0 || r > 7) return null;

        // Look for an enemy slider behind the piece along the same ray.
        const diagonal = (dirF !== 0 && dirR !== 0);
        f += dirF;
        r += dirR;
        while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
            const cur = fileRankToSquare(f, r);
            const p = occ[cur];
            if (p) {
                if (p.color !== piece.color) {
                    if (diagonal && (p.type === 'b' || p.type === 'q')) return [dirF, dirR];
                    if (!diagonal && (p.type === 'r' || p.type === 'q')) return [dirF, dirR];
                }
                return null;
            }
            f += dirF;
            r += dirR;
        }
        return null;
    }

    /** Is `targetSq` on the ray that starts at `kingSq` and runs along `dir`? */
    function onPinRay(kingSq, dir, targetSq) {
        const df = squareToFile(targetSq) - squareToFile(kingSq);
        const dr = squareToRank(targetSq) - squareToRank(kingSq);
        const [dirF, dirR] = dir;
        if (dirF === 0) return df === 0 && dr !== 0 && (dr > 0 ? 1 : -1) === dirR;
        if (dirR === 0) return dr === 0 && df !== 0 && (df > 0 ? 1 : -1) === dirF;
        if (Math.abs(df) !== Math.abs(dr) || df === 0) return false;
        return (df > 0 ? 1 : -1) === dirF && (dr > 0 ? 1 : -1) === dirR;
    }

    /**
     * Attackers of `sq` belonging to `color` that could *legally* capture
     * there: absolutely pinned pieces are dropped unless the capture happens
     * on their own pin ray, and the king is only offered when the square is
     * not defended once the capture is made.
     */
    function legalAttackersTo(occ, sq, color) {
        const kingSq = findKingInOccupancy(occ, color);
        const raw = rawAttackersTo(occ, sq, color);
        const out = [];
        let kingAttacker = null;

        for (const from of raw) {
            const p = occ[from];
            if (!p) continue;
            if (p.type === 'k') {
                kingAttacker = from;
                continue;
            }
            if (kingSq) {
                const dir = pinDirection(occ, from, kingSq);
                if (dir && !onPinRay(kingSq, dir, sq)) continue;
            }
            out.push(from);
        }

        // The king is the most valuable capturer, so it is only ever used
        // when nothing else is left - and only if the square is then safe.
        if (out.length === 0 && kingAttacker) {
            const probe = cloneOccupancy(occ);
            delete probe[sq];
            delete probe[kingAttacker];
            probe[sq] = { type: 'k', color: color };
            if (rawAttackersTo(probe, sq, oppositeColor(color)).length === 0) {
                out.push(kingAttacker);
            }
        }
        return out;
    }

    function seeSwapOff(occ, sq, side, ply) {
        if (ply > SEE_MAX_PLY) return 0;
        const target = occ[sq];
        if (!target || target.color === side) return 0;
        if (target.type === 'k') return 0; // kings are never actually captured

        const attackers = legalAttackersTo(occ, sq, side);
        if (attackers.length === 0) return 0;

        let bestFrom = null;
        let bestVal = Infinity;
        for (const from of attackers) {
            const val = PIECE_VALUES[occ[from].type] || 0;
            if (val < bestVal) {
                bestVal = val;
                bestFrom = from;
            }
        }
        if (!bestFrom) return 0;

        const mover = occ[bestFrom];
        let gain = PIECE_VALUES[target.type] || 0;
        let landing = { type: mover.type, color: mover.color };

        const promotionRank = (side === 'w') ? 7 : 0;
        if (mover.type === 'p' && squareToRank(sq) === promotionRank) {
            landing = { type: 'q', color: side };
            gain += (PIECE_VALUES.q - PIECE_VALUES.p);
        }

        const next = cloneOccupancy(occ);
        delete next[bestFrom];
        next[sq] = landing;

        // Stand pat: never continue an exchange that loses material.
        return Math.max(0, gain - seeSwapOff(next, sq, oppositeColor(side), ply + 1));
    }

    /**
     * Static Exchange Evaluation for the square `square`.
     *
     * @param {object} board - chess.js instance (read only, never mutated)
     * @param {string} square - the contested square, e.g. 'e5'
     * @param {string} sideToCapture - 'w' | 'b', the side that initiates
     * @returns {number} net material, in pawn units, that `sideToCapture`
     *          wins by starting the capture sequence. Either side may stop
     *          capturing at any point, so the result is never negative: 0
     *          means "the exchange is not worth starting / is balanced".
     */
    function staticExchangeEval(board, square, sideToCapture) {
        if (!board || !square || !sideToCapture) return 0;
        const target = board.get(square);
        if (!target || target.color === sideToCapture) return 0;
        if (target.type === 'k') return 0;
        return seeSwapOff(buildOccupancy(board), square, sideToCapture, 0);
    }

    /** Same as staticExchangeEval, on an already-built occupancy map. */
    function seeOnOccupancy(occ, square, sideToCapture) {
        const target = occ[square];
        if (!target || target.color === sideToCapture || target.type === 'k') return 0;
        return seeSwapOff(occ, square, sideToCapture, 0);
    }

    /**
     * Check if a piece of `color` on `square` is safe from being captured
     * profitably. Backed by a real static exchange evaluation, so sound
     * exchanges and pieces defended through a battery are no longer flagged,
     * and defenders that are absolutely pinned no longer count.
     *
     * @param {object} board - chess.js instance
     * @param {string} color - colour of the piece we are asking about
     * @param {string} square - its square
     * @param {number|null} oppAttackerVal - optional cap: if the piece is
     *        attacked and worth more than this, treat it as unsafe
     *        (preserved from the previous heuristic implementation).
     * @returns {boolean}
     */
    function isPieceSafe(board, color, square, oppAttackerVal = null) {
        const piece = board.get(square);
        if (!piece) return true;

        const ownColor = piece.color || color;
        const oppColor = oppositeColor(ownColor);

        if (!isSquareAttackedBy(board, oppColor, square)) {
            return true;
        }

        // A king is "safe" only when the square is not attacked at all.
        if (piece.type === 'k') return false;

        if (staticExchangeEval(board, square, oppColor) > 0) {
            return false;
        }

        const val = PIECE_VALUES[piece.type] || 0;
        if (oppAttackerVal !== null && val > oppAttackerVal) {
            return false;
        }

        return true;
    }

    /**
     * Detect genuine, unavoidable fork / double attack.
     */
    function detectFork(boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece) return null;

        const attackerVal = PIECE_VALUES[piece.type] || 0;
        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');

        // Check 1: Is the attacker itself en prise / easily capturable?
        const isAttackerDefended = isSquareAttackedBy(boardAfter, color, move.to);
        const oppAttackers = getAttackers(boardAfter, oppColor, move.to);
        if (oppAttackers.length > 0) {
            if (!isAttackerDefended) return null;
            let minOppVal = 999;
            for (const a of oppAttackers) {
                const p = boardAfter.get(a);
                if (p) {
                    const aVal = PIECE_VALUES[p.type] || 0;
                    if (aVal < minOppVal) minOppVal = aVal;
                }
            }
            if (minOppVal <= attackerVal) return null;
        }

        // Check 2: Identify valuable targets
        const attackedSquares = getPieceAttacks(boardAfter, move.to);
        const valuableTargets = [];

        for (const sq of attackedSquares) {
            const target = boardAfter.get(sq);
            if (!target || target.color !== oppColor) continue;

            const targetVal = PIECE_VALUES[target.type] || 0;
            const isDefended = isSquareAttackedBy(boardAfter, oppColor, sq);

            if (target.type === 'k') {
                valuableTargets.push({
                    square: sq,
                    type: target.type,
                    val: targetVal,
                    name: PIECE_NAMES[target.type] || 'piece',
                    is_defended: isDefended
                });
            } else if (targetVal > attackerVal) {
                valuableTargets.push({
                    square: sq,
                    type: target.type,
                    val: targetVal,
                    name: PIECE_NAMES[target.type] || 'piece',
                    is_defended: isDefended
                });
            } else if (!isDefended) {
                valuableTargets.push({
                    square: sq,
                    type: target.type,
                    val: targetVal,
                    name: PIECE_NAMES[target.type] || 'piece',
                    is_defended: false
                });
            }
        }

        if (valuableTargets.length < 2) return null;

        // At least one target must be a piece (not both pawns)
        if (!valuableTargets.some(t => t.type !== 'p')) return null;

        valuableTargets.sort((a, b) => b.val - a.val);
        const t1 = valuableTargets[0];
        const t2 = valuableTargets[1];

        // Check 3: Can opponent resolve both threats in a single legal move?
        const legalMoves = boardAfter.moves({ verbose: true });
        for (const oppMove of legalMoves) {
            boardAfter.move(oppMove);

            // Case 3a: Counter-check
            if (boardAfter.in_check && boardAfter.in_check()) {
                const chkSafe = isPieceSafe(boardAfter, oppColor, oppMove.to);
                boardAfter.undo();
                if (chkSafe) return null;
                continue;
            }

            // Case 3b: Opponent captures attacker
            if (oppMove.to === move.to) {
                const capturer = oppMove.piece;
                const capturerVal = PIECE_VALUES[capturer] || 1;
                boardAfter.undo();
                if (!isAttackerDefended || capturerVal <= attackerVal) {
                    return null;
                }
                continue;
            }

            // Case 3c: Check safety of both targets after oppMove
            const sq1 = (oppMove.from === t1.square) ? oppMove.to : t1.square;
            const sq2 = (oppMove.from === t2.square) ? oppMove.to : t2.square;

            const attacksFromForker = getPieceAttacks(boardAfter, move.to);
            const t1AttackedByForker = attacksFromForker.includes(sq1);
            const t1Defended = isSquareAttackedBy(boardAfter, oppColor, sq1);
            let t1Safe = !t1AttackedByForker || (t1Defended && t1.val <= attackerVal);
            if (oppMove.from === t1.square) {
                t1Safe = t1Safe && isPieceSafe(boardAfter, oppColor, sq1);
            }

            const t2AttackedByForker = attacksFromForker.includes(sq2);
            const t2Defended = isSquareAttackedBy(boardAfter, oppColor, sq2);
            let t2Safe = !t2AttackedByForker || (t2Defended && t2.val <= attackerVal);
            if (oppMove.from === t2.square) {
                t2Safe = t2Safe && isPieceSafe(boardAfter, oppColor, sq2);
            }

            boardAfter.undo();

            if (t1Safe && t2Safe) {
                return null;
            }
        }

        const names = [t1.name, t2.name];
        return {
            type: 'fork',
            attacker: PIECE_NAMES[piece.type] || 'piece',
            attackerSquare: move.to,
            targets: names,
            targetSquares: [t1.square, t2.square],
            description: `forking the ${names[0]} and ${names[1]}`
        };
    }

    /**
     * Detect pin created by the moved piece.
     */
    function detectPin(boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece || (piece.type !== 'b' && piece.type !== 'r' && piece.type !== 'q')) {
            return null;
        }

        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');

        // Check if pinning piece is safe (not hanging / en prise)
        const isAttackerDefended = isSquareAttackedBy(boardAfter, color, move.to);
        const oppAttackers = getAttackers(boardAfter, oppColor, move.to);
        if (oppAttackers.length > 0) {
            if (!isAttackerDefended) return null;
            let minOppVal = 999;
            for (const a of oppAttackers) {
                const p = boardAfter.get(a);
                if (p) {
                    const aVal = PIECE_VALUES[p.type] || 0;
                    if (aVal < minOppVal) minOppVal = aVal;
                }
            }
            const attackerVal = PIECE_VALUES[piece.type] || 0;
            if (minOppVal < attackerVal) return null;
        }
        const kingSq = findKingSquare(boardAfter, oppColor);
        if (!kingSq) return null;

        const f1 = squareToFile(move.to);
        const r1 = squareToRank(move.to);
        const f2 = squareToFile(kingSq);
        const r2 = squareToRank(kingSq);

        const df = f2 - f1;
        const dr = r2 - r1;

        // Must be on the same rank, file, or diagonal
        const stepF = df === 0 ? 0 : (df > 0 ? 1 : -1);
        const stepR = dr === 0 ? 0 : (dr > 0 ? 1 : -1);

        const isDiagonal = Math.abs(df) === Math.abs(dr) && df !== 0;
        const isStraight = (df === 0 && dr !== 0) || (df !== 0 && dr === 0);

        if (piece.type === 'b' && !isDiagonal) return null;
        if (piece.type === 'r' && !isStraight) return null;
        if (piece.type === 'q' && !isDiagonal && !isStraight) return null;

        // Trace squares between move.to and kingSq
        let currF = f1 + stepF;
        let currR = r1 + stepR;
        let pinnedPiece = null;
        let pinnedSquare = null;
        let pieceCount = 0;
        const line = [];

        while (currF !== f2 || currR !== r2) {
            const sq = fileRankToSquare(currF, currR);
            line.push(sq);
            const p = boardAfter.get(sq);
            if (p) {
                pieceCount++;
                if (p.color === oppColor) {
                    pinnedPiece = p;
                    pinnedSquare = sq;
                }
            }
            currF += stepF;
            currR += stepR;
        }
        line.push(kingSq);

        // Exactly one piece between slider and king, and that piece is an opponent piece
        if (pieceCount === 1 && pinnedPiece) {
            const name = PIECE_NAMES[pinnedPiece.type] || 'piece';
            return {
                type: 'pin',
                pinned: name,
                pinnedSquare: pinnedSquare,
                behindSquare: kingSq,
                line: line,
                description: `pinning the enemy ${name} to the King`
            };
        }
        return null;
    }

    /**
     * Detect skewer created by the moved piece.
     */
    function detectSkewer(boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece || (piece.type !== 'b' && piece.type !== 'r' && piece.type !== 'q')) {
            return null;
        }

        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');

        // Check if attacker is safe
        const isAttackerDefended = isSquareAttackedBy(boardAfter, color, move.to);
        const oppAttackers = getAttackers(boardAfter, oppColor, move.to);
        if (oppAttackers.length > 0) {
            if (!isAttackerDefended) return null;
            let minOppVal = 999;
            for (const a of oppAttackers) {
                const p = boardAfter.get(a);
                if (p) {
                    const aVal = PIECE_VALUES[p.type] || 0;
                    if (aVal < minOppVal) minOppVal = aVal;
                }
            }
            if (minOppVal < (PIECE_VALUES[piece.type] || 0)) return null;
        }

        const dirs = [];
        if (piece.type === 'b' || piece.type === 'q') {
            dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
        }
        if (piece.type === 'r' || piece.type === 'q') {
            dirs.push([-1,0],[1,0],[0,-1],[0,1]);
        }

        const f0 = squareToFile(move.to);
        const r0 = squareToRank(move.to);

        for (const [df, dr] of dirs) {
            let f = f0 + df;
            let r = r0 + dr;
            let firstTarget = null;
            let secondTarget = null;

            while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
                const sq = fileRankToSquare(f, r);
                const p = boardAfter.get(sq);
                if (p) {
                    if (p.color === color) break;
                    if (!firstTarget) {
                        firstTarget = { piece: p, square: sq };
                    } else {
                        secondTarget = { piece: p, square: sq };
                        break;
                    }
                }
                f += df;
                r += dr;
            }

            if (firstTarget && secondTarget) {
                const v1 = PIECE_VALUES[firstTarget.piece.type] || 0;
                const v2 = PIECE_VALUES[secondTarget.piece.type] || 0;
                if (v1 >= v2 && v2 >= 3 && (firstTarget.piece.type === 'k' || firstTarget.piece.type === 'q' || (firstTarget.piece.type === 'r' && v2 >= 3))) {
                    const n1 = PIECE_NAMES[firstTarget.piece.type];
                    const n2 = PIECE_NAMES[secondTarget.piece.type];
                    return {
                        type: 'skewer',
                        front: n1,
                        back: n2,
                        frontSquare: firstTarget.square,
                        backSquare: secondTarget.square,
                        description: `skewering the ${n1} and ${n2}`
                    };
                }
            }
        }
        return null;
    }

    /**
     * Detect discovered attack or discovered check.
     */
    function detectDiscoveredAttack(boardBefore, boardAfter, move) {
        const color = boardBefore.turn();
        const oppColor = (color === 'w' ? 'b' : 'w');
        const fromSq = move.from;
        const fromF = squareToFile(fromSq);
        const fromR = squareToRank(fromSq);

        const dirs = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
        for (const [df, dr] of dirs) {
            let backF = fromF - df;
            let backR = fromR - dr;
            let friendlySlider = null;
            let friendlySliderSquare = null;

            while (backF >= 0 && backF <= 7 && backR >= 0 && backR <= 7) {
                const sq = fileRankToSquare(backF, backR);
                const p = boardBefore.get(sq);
                if (p) {
                    if (p.color === color) {
                        const isDiag = Math.abs(df) === 1 && Math.abs(dr) === 1;
                        const isStraight = (df === 0 && dr !== 0) || (df !== 0 && dr === 0);
                        if ((isDiag && (p.type === 'b' || p.type === 'q')) ||
                            (isStraight && (p.type === 'r' || p.type === 'q'))) {
                            friendlySlider = p;
                            friendlySliderSquare = sq;
                        }
                    }
                    break;
                }
                backF -= df;
                backR -= dr;
            }

            if (!friendlySlider) continue;

            let fwdF = fromF + df;
            let fwdR = fromR + dr;
            let targetPiece = null;
            let targetSq = null;

            while (fwdF >= 0 && fwdF <= 7 && fwdR >= 0 && fwdR <= 7) {
                const sq = fileRankToSquare(fwdF, fwdR);
                const p = boardAfter.get(sq);
                if (p) {
                    if (p.color === oppColor) {
                        targetPiece = p;
                        targetSq = sq;
                    }
                    break;
                }
                fwdF += df;
                fwdR += dr;
            }

            if (targetPiece) {
                const targetName = PIECE_NAMES[targetPiece.type] || 'piece';
                if (targetPiece.type === 'k') {
                    return {
                        type: 'discovered_check',
                        target: 'king',
                        blockerSquare: move.from,
                        sliderSquare: friendlySliderSquare,
                        targetSquare: targetSq,
                        description: `unleashing a discovered check against the King`
                    };
                } else if (targetPiece.type === 'q' || targetPiece.type === 'r' || !isSquareAttackedBy(boardAfter, oppColor, targetSq) || PIECE_VALUES[targetPiece.type] > PIECE_VALUES[friendlySlider.type]) {
                    return {
                        type: 'discovered_attack',
                        target: targetName,
                        blockerSquare: move.from,
                        sliderSquare: friendlySliderSquare,
                        targetSquare: targetSq,
                        description: `unleashing a discovered attack on the ${targetName}`
                    };
                }
            }
        }
        return null;
    }

    /**
     * Detect center pawn strike or center push.
     */
    function detectCenterStrike(boardBefore, move) {
        const piece = boardBefore.get(move.from);
        if (!piece || piece.type !== 'p') return null;
        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');
        const toSq = move.to;

        const isCoreCenter = (toSq === 'd4' || toSq === 'e4' || toSq === 'd5' || toSq === 'e5');
        const isFlankCenter = (toSq === 'c4' || toSq === 'f4' || toSq === 'c5' || toSq === 'f5');

        if (!isCoreCenter && !isFlankCenter) return null;

        const file = squareToFile(toSq);
        const rank = squareToRank(toSq);
        const dir = (color === 'w') ? 1 : -1;
        const attacks = [];
        for (const df of [-1, 1]) {
            const nf = file + df;
            const nr = rank + dir;
            if (nf >= 0 && nf <= 7 && nr >= 0 && nr <= 7) {
                attacks.push(fileRankToSquare(nf, nr));
            }
        }
        const attackedPieces = attacks.map(sq => boardBefore.get(sq)).filter(p => p && p.color === oppColor);

        if (attackedPieces.length > 0) {
            const names = attackedPieces.map(p => PIECE_NAMES[p.type] || 'pawn');
            return {
                type: 'center_strike',
                action: `strike at the center with ${toSq} and challenge the ${names[0]}`,
                description: `strikes at the center with ${toSq} and challenges the ${names[0]}`
            };
        }

        if (isCoreCenter) {
            return {
                type: 'center_seize',
                action: `seize the center with ${toSq}`,
                description: `seizes the center with ${toSq}`
            };
        }
        return {
            type: 'center_advance',
            action: `advance in the center with ${toSq}`,
            description: `advances in the center with ${toSq}`
        };
    }

    /**
     * Detect defensive evacuation or defending an attacked piece.
     */
    function detectDefensiveMove(boardBefore, boardAfter, move) {
        const color = boardBefore.turn();
        const oppColor = (color === 'w' ? 'b' : 'w');
        const movedPiece = boardBefore.get(move.from);
        if (!movedPiece) return null;

        // 1. Was the moved piece itself under direct, profitable attack?
        const isAttackedBefore = isSquareAttackedBy(boardBefore, oppColor, move.from);
        if (isAttackedBefore && !isPieceSafe(boardBefore, color, move.from)) {
            const isSafeNow = isPieceSafe(boardAfter, color, move.to);
            if (isSafeNow && !isSquareAttackedBy(boardAfter, oppColor, move.to)) {
                const name = PIECE_NAMES[movedPiece.type] || 'piece';
                return {
                    type: 'escape',
                    description: `retreats the attacked ${name} to safety`
                };
            }
        }

        // 2. Does this move defend a friendly piece that was under attack in boardBefore?
        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                const sq = fileRankToSquare(f, r);
                if (sq === move.from || sq === move.to) continue;
                const p = boardBefore.get(sq);
                if (p && p.color === color && p.type !== 'k') {
                    const attackedBefore = isSquareAttackedBy(boardBefore, oppColor, sq);
                    const safeBefore = isPieceSafe(boardBefore, color, sq);

                    if (attackedBefore && !safeBefore) {
                        const attacksAfter = getPieceAttacks(boardAfter, move.to);
                        const safeNow = isPieceSafe(boardAfter, color, sq);
                        if (attacksAfter.includes(sq) && safeNow) {
                            const name = PIECE_NAMES[p.type] || 'piece';
                            const isHome = squareToRank(move.from) === (color === 'w' ? 0 : 7);
                            if (isHome && (movedPiece.type === 'n' || movedPiece.type === 'b')) {
                                return {
                                    type: 'defend_piece',
                                    isDevelopment: true,
                                    description: `develops the ${PIECE_NAMES[movedPiece.type]} to defend the attacked ${name} on ${sq}`
                                };
                            }
                            return {
                                type: 'defend_piece',
                                isDevelopment: false,
                                description: `defends the attacked ${name} on ${sq}`
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Detect minor piece development from starting rank.
     */
    function detectMinorDevelopment(boardBefore, move) {
        const piece = boardBefore.get(move.from);
        if (!piece || (piece.type !== 'n' && piece.type !== 'b')) return null;
        const color = piece.color;
        const homeRank = (color === 'w' ? 0 : 7);

        if (squareToRank(move.from) !== homeRank) return null;

        const toSq = move.to;
        if (piece.type === 'n') {
            if (['c3', 'f3', 'c6', 'f6'].includes(toSq)) {
                return `develops the knight to an active square contesting the center`;
            }
            return `develops the knight into active play`;
        } else {
            if (['c4', 'b5', 'g5', 'f4', 'c5', 'b4', 'g4', 'f5'].includes(toSq)) {
                return `develops the bishop along an active diagonal`;
            }
            return `develops the bishop and prepares castling`;
        }
    }

    /**
     * Simulate principal variation moves to detect net material gain or checkmate.
     */
    function detectMaterialGainInPv(board, pvMoves, moverColor) {
        if (!pvMoves || !Array.isArray(pvMoves) || pvMoves.length === 0) return null;
        const ChessCtor = getChessConstructor();
        if (!ChessCtor) return null;

        try {
            const sim = new ChessCtor(board.fen());
            function evalMaterial(b) {
                let moverMat = 0;
                let oppMat = 0;
                for (let f = 0; f < 8; f++) {
                    for (let r = 0; r < 8; r++) {
                        const p = b.get(fileRankToSquare(f, r));
                        if (!p || p.type === 'k') continue;
                        const v = PIECE_VALUES[p.type] || 0;
                        if (p.color === moverColor) moverMat += v;
                        else oppMat += v;
                    }
                }
                return moverMat - oppMat;
            }

            const initialDiff = evalMaterial(sim);
            const maxPlies = Math.min(pvMoves.length, 6);
            let capturedMajorOrMinor = null;

            for (let i = 0; i < maxPlies; i++) {
                const uci = pvMoves[i];
                if (!uci || uci.length < 4) break;
                const from = uci.substring(0, 2);
                const to = uci.substring(2, 4);
                const promotion = uci.length > 4 ? uci[4] : undefined;

                const target = sim.get(to);
                if (sim.turn() === moverColor && target && target.type !== 'p') {
                    if (!capturedMajorOrMinor || (PIECE_VALUES[target.type] > (PIECE_VALUES[capturedMajorOrMinor] || 0))) {
                        capturedMajorOrMinor = target.type;
                    }
                }

                const res = sim.move({ from, to, promotion });
                if (!res) break;
                if (sim.in_checkmate && sim.in_checkmate()) {
                    if (sim.turn() !== moverColor) {
                        return { type: 'checkmate', description: 'forces checkmate' };
                    }
                }
            }

            const finalDiff = evalMaterial(sim);
            const gain = finalDiff - initialDiff;

            if (gain >= 9 || capturedMajorOrMinor === 'q') {
                return { type: 'win_queen', gain, description: 'wins the enemy Queen' };
            } else if (gain >= 5 || capturedMajorOrMinor === 'r') {
                return { type: 'win_rook', gain, description: 'wins a Rook' };
            } else if (gain >= 3 || (capturedMajorOrMinor === 'b' || capturedMajorOrMinor === 'n')) {
                return { type: 'win_piece', gain, description: `wins a ${PIECE_NAMES[capturedMajorOrMinor] || 'minor piece'}` };
            } else if (gain >= 1) {
                return { type: 'win_pawn', gain, description: 'wins a pawn and opens winning lines' };
            }
        } catch (e) {
            // Ignore simulation errors
        }
        return null;
    }

    /**
     * Detect prophylactic prevention of opponent's refutation move.
     */
    function detectProphylaxis(boardBefore, boardAfterBest, bestMove, refutationMove, sanRef) {
        if (!refutationMove) return null;
        const color = boardBefore.turn();
        const oppName = (color === 'w' ? 'Black' : 'White');

        if (bestMove.to === refutationMove.to) {
            return `prevents ${oppName} from playing ${sanRef || 'a counter-strike'} by occupying ${refutationMove.to}`;
        }
        const attacks = getPieceAttacks(boardAfterBest, bestMove.to);
        if (attacks.includes(refutationMove.to)) {
            return `controls ${refutationMove.to} to discourage ${oppName}'s ${sanRef || 'advance'}`;
        }
        return null;
    }

    /**
     * Normalise a single refutation ply into { from, to } or { san }.
     */
    function normalizeRefutationPly(m) {
        if (!m) return null;
        if (typeof m === 'string') {
            const s = m.trim();
            if (/^[a-h][1-8][a-h][1-8][qrbnQRBN]?$/.test(s)) {
                return {
                    from: s.slice(0, 2),
                    to: s.slice(2, 4),
                    promotion: s.length > 4 ? s.charAt(4).toLowerCase() : undefined
                };
            }
            return s ? { san: s } : null;
        }
        if (m.from && m.to) return { from: m.from, to: m.to, promotion: m.promotion };
        if (m.san) return { san: m.san };
        return null;
    }

    /**
     * Accepts a refutation move object, a UCI/SAN string, an array of plies,
     * or an object carrying a `pv` array; returns up to the first 3 plies.
     */
    function normalizeRefutationPlies(refutation) {
        if (!refutation) return [];
        let raw;
        if (Array.isArray(refutation)) {
            raw = refutation.slice();
        } else if (Array.isArray(refutation.pv) && refutation.pv.length > 0) {
            raw = refutation.pv.slice();
            if (refutation.from && refutation.to) {
                const head = normalizeRefutationPly(raw[0]);
                if (!head || head.from !== refutation.from || head.to !== refutation.to) {
                    raw.unshift(refutation);
                }
            }
        } else {
            raw = [refutation];
        }
        return raw.slice(0, 3).map(normalizeRefutationPly).filter(function(p) { return !!p; });
    }

    /**
     * Does the engine's refutation actually win the piece standing on
     * `square`? Returns true / false, or null when the refutation could not
     * be replayed (caller should then fall back to pure SEE).
     */
    function refutationWinsPiece(boardAfter, square, color, refutation) {
        const plies = normalizeRefutationPlies(refutation);
        if (plies.length === 0) return null;

        const ChessCtor = getChessConstructor();
        if (!ChessCtor) return null;

        let sim;
        try {
            sim = new ChessCtor(boardAfter.fen());
        } catch (e) {
            return null;
        }

        const oppColor = oppositeColor(color);
        let playedPlies = 0;
        let lastOppTo = null;

        for (const ply of plies) {
            let res = null;
            try {
                res = ply.san
                    ? sim.move(ply.san, { sloppy: true })
                    : sim.move({ from: ply.from, to: ply.to, promotion: ply.promotion || 'q' });
            } catch (e) {
                res = null;
            }
            if (!res) break;
            playedPlies++;
            if (res.color === oppColor) {
                lastOppTo = res.to;
                // The refutation captures the piece outright.
                if (res.to === square && res.captured) return true;
            } else if (res.from === square) {
                // We saved the piece inside the given line.
                return false;
            }
        }

        if (playedPlies === 0) return null; // unreplayable -> unknown

        // Not captured yet: it still counts if the refutation attacks the
        // piece and winning it is only a capture away.
        const still = sim.get(square);
        if (still && still.color === color && lastOppTo) {
            const attacks = getPieceAttacks(sim, lastOppTo);
            if (attacks.indexOf(square) !== -1 && staticExchangeEval(sim, square, oppColor) > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Detect hanging piece blunder, using static exchange evaluation rather
     * than an attacker/defender count, and - when the engine's refutation is
     * supplied - only claiming the piece when that refutation really wins it.
     *
     * @param {object} boardBefore - position before the played move
     * @param {object} boardAfter - position after the played move
     * @param {object} playedMove - { from, to, ... }
     * @param {object|string|Array} [refutationMove] - OPTIONAL engine
     *        refutation (move object, UCI/SAN string, PV array, or an object
     *        with a `pv` array). When omitted, pure SEE decides.
     * @returns {{type, piece, square, description}|null}
     */
    function detectHangingPieceBlunder(boardBefore, boardAfter, playedMove, refutationMove) {
        const color = boardBefore.turn();
        const oppColor = oppositeColor(color);
        const movedPiece = boardBefore.get(playedMove.from);
        if (!movedPiece) return null;

        const toSq = playedMove.to;
        const pieceNow = boardAfter.get(toSq);

        if (pieceNow && pieceNow.color === color && pieceNow.type !== 'k') {
            const loss = staticExchangeEval(boardAfter, toSq, oppColor);

            // Net out whatever the played move itself captured: a knight that
            // takes a Queen and is recaptured is not a hanging knight, and a
            // sound exchange is not a blunder.
            let gained = 0;
            if (playedMove.captured) {
                gained = PIECE_VALUES[playedMove.captured] || 0;
            } else {
                const capturedBefore = boardBefore.get(toSq);
                if (capturedBefore && capturedBefore.color === oppColor) {
                    gained = PIECE_VALUES[capturedBefore.type] || 0;
                }
            }

            if (loss - gained > 0) {
                const corroborated = refutationMove
                    ? refutationWinsPiece(boardAfter, toSq, color, refutationMove)
                    : null;
                if (corroborated !== false) {
                    const name = PIECE_NAMES[pieceNow.type] || 'piece';
                    return {
                        type: 'hanging_piece',
                        piece: name,
                        square: toSq,
                        description: `leaves the ${name} hanging on ${toSq}`
                    };
                }
            }
        }

        // Check if the move removed the defense of another friendly piece.
        const occAfter = buildOccupancy(boardAfter);
        let occBefore = null;
        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                const sq = fileRankToSquare(f, r);
                if (sq === toSq) continue;
                const p = occAfter[sq];
                if (!p || p.color !== color || p.type === 'k') continue;
                if (rawAttackersTo(occAfter, sq, oppColor).length === 0) continue;

                const before = boardBefore.get(sq);
                if (!before || before.color !== color || before.type !== p.type) continue;

                if (!occBefore) occBefore = buildOccupancy(boardBefore);
                const safeBefore = seeOnOccupancy(occBefore, sq, oppColor) <= 0;
                const lossNow = seeOnOccupancy(occAfter, sq, oppColor);
                if (safeBefore && lossNow > 0) {
                    if (refutationMove
                        && refutationWinsPiece(boardAfter, sq, color, refutationMove) === false) {
                        continue;
                    }
                    const name = PIECE_NAMES[p.type] || 'piece';
                    return {
                        type: 'removed_defender',
                        piece: name,
                        square: sq,
                        description: `removes the defense of the ${name} on ${sq}`
                    };
                }
            }
        }
        return null;
    }

    /**
     * Check if square is an outpost.
     */
    function isTrueOutpost(board, square, color) {
        const rank = squareToRank(square);
        const file = squareToFile(square);

        if (color === 'w') {
            if (rank !== 3 && rank !== 4 && rank !== 5) return false;
        } else {
            if (rank !== 2 && rank !== 3 && rank !== 4) return false;
        }

        // Defended by friendly pawn?
        const defenders = getAttackers(board, color, square);
        const pawnDefended = defenders.some(sq => {
            const p = board.get(sq);
            return p && p.type === 'p';
        });
        if (!pawnDefended) return false;

        // Can enemy pawns on adjacent files ever challenge it?
        const oppColor = (color === 'w' ? 'b' : 'w');
        const adjFiles = [file - 1, file + 1].filter(f => f >= 0 && f <= 7);

        for (const af of adjFiles) {
            for (let r = 0; r < 8; r++) {
                const p = board.get(fileRankToSquare(af, r));
                if (p && p.type === 'p' && p.color === oppColor) {
                    if (color === 'w' && r > rank) return false;
                    if (color === 'b' && r < rank) return false;
                }
            }
        }
        return true;
    }

    /**
     * Detect open file or 7th rank control.
     */
    function detectFileControl(boardBefore, move) {
        const piece = boardBefore.get(move.from);
        if (!piece || (piece.type !== 'r' && piece.type !== 'q')) return null;

        const color = piece.color;
        const file = squareToFile(move.to);
        const rank = squareToRank(move.to);

        // 7th rank for rook (rank index 6 for white, rank index 1 for black)
        if (piece.type === 'r') {
            if ((color === 'w' && rank === 6) || (color === 'b' && rank === 1)) {
                return 'placing the rook on the 7th rank';
            }
        }

        let friendlyPawns = 0;
        let oppPawns = 0;
        for (let r = 0; r < 8; r++) {
            const p = boardBefore.get(fileRankToSquare(file, r));
            if (p && p.type === 'p') {
                if (p.color === color) friendlyPawns++;
                else oppPawns++;
            }
        }

        if (friendlyPawns === 0 && oppPawns === 0) {
            return (piece.type === 'r') ? 'activating the rook on the open file' : 'taking control of the open file';
        } else if (friendlyPawns === 0 && oppPawns > 0) {
            return (piece.type === 'r') ? 'activating the rook on the semi-open file' : 'controlling the semi-open file';
        }
        return null;
    }

    /**
     * Detect passed pawn creation or advance.
     */
    function detectPassedPawn(boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece || piece.type !== 'p') return false;

        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');
        const file = squareToFile(move.to);
        const rank = squareToRank(move.to);

        const files = [file - 1, file, file + 1].filter(f => f >= 0 && f <= 7);

        for (const f of files) {
            for (let r = 0; r < 8; r++) {
                if (color === 'w' && r > rank) {
                    const p = boardAfter.get(fileRankToSquare(f, r));
                    if (p && p.type === 'p' && p.color === oppColor) return false;
                } else if (color === 'b' && r < rank) {
                    const p = boardAfter.get(fileRankToSquare(f, r));
                    if (p && p.type === 'p' && p.color === oppColor) return false;
                }
            }
        }
        return true;
    }

    /**
     * Check if a color has castling rights available in the board position.
     * @param {object} board - chess.js instance
     * @param {string} color - 'w' or 'b'
     * @returns {boolean}
     */
    function hasCastlingRights(board, color) {
        if (!board || typeof board.fen !== 'function') return false;
        const fen = board.fen();
        const castling = (fen.split(' ')[2]) || '';
        if (color === 'w') {
            return castling.includes('K') || castling.includes('Q');
        } else if (color === 'b') {
            return castling.includes('k') || castling.includes('q');
        }
        return false;
    }

    function isKingAndPawnEnding(board) {
        if (!board) return false;
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const p = board.get(fileRankToSquare(f, r));
                if (p && p.type !== 'k' && p.type !== 'p') return false;
            }
        }
        return true;
    }

    /**
     * Detect king safety flaw.
     */
    function detectKingSafetyFlaw(boardBefore, boardAfter, move) {
        const color = boardBefore.turn();
        const piece = boardBefore.get(move.from);
        if (!piece) return null;

        // King moves without castling when castling rights were available
        if (piece.type === 'k') {
            const homeSquare = (color === 'w' ? 'e1' : 'e8');
            const fromFile = squareToFile(move.from);
            const toFile = squareToFile(move.to);
            const isCastling = Math.abs(toFile - fromFile) === 2;

            if (!isCastling && move.from === homeSquare && hasCastlingRights(boardBefore, color)) {
                // If king stepped away forfeiting castling rights
                if (boardBefore.in_check && boardBefore.in_check()) {
                    return 'losing castling rights by moving the King under check';
                }
                return 'forfeiting castling rights and leaving the king in the center';
            }
        }

        // Weakening pawn shield in front of castled king
        if (piece.type === 'p') {
            const kingSq = findKingSquare(boardAfter, color);
            if (kingSq) {
                const kingFile = squareToFile(kingSq);
                const moveFile = squareToFile(move.from);
                if (Math.abs(kingFile - moveFile) <= 1) {
                    if ((color === 'w' && (kingSq === 'g1' || kingSq === 'h1' || kingSq === 'c1' || kingSq === 'b1')) ||
                        (color === 'b' && (kingSq === 'g8' || kingSq === 'h8' || kingSq === 'c8' || kingSq === 'b8'))) {
                        return 'weakening the defensive pawn shield around your King';
                    }
                }
            }
        }
        return null;
    }

    /**
     * Detect attacks on valuable pieces or multiple threats.
     */
    function detectAttacksOnPieces(boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece) return [];

        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');
        const attacks = getPieceAttacks(boardAfter, move.to);
        const attackerVal = PIECE_VALUES[piece.type] || 1;
        const results = [];

        for (const sq of attacks) {
            const target = boardAfter.get(sq);
            if (!target || target.color !== oppColor) continue;

            const targetVal = PIECE_VALUES[target.type] || 1;
            const isDefended = isSquareAttackedBy(boardAfter, oppColor, sq);
            const targetName = PIECE_NAMES[target.type] || 'piece';

            if (target.type === 'q') {
                results.push({
                    type: 'attack_queen',
                    target: 'Queen',
                    targetType: 'q',
                    square: sq,
                    isDefended,
                    description: `attacks the enemy Queen on ${sq}`
                });
            } else if (target.type === 'r') {
                if (!isDefended || attackerVal <= 3) {
                    results.push({
                        type: 'attack_rook',
                        target: 'Rook',
                        targetType: 'r',
                        square: sq,
                        isDefended,
                        description: `attacks the Rook on ${sq}`
                    });
                }
            } else if (!isDefended && target.type !== 'p') {
                results.push({
                    type: 'attack_undefended',
                    target: targetName,
                    targetType: target.type,
                    square: sq,
                    isDefended: false,
                    description: `attacks the undefended ${targetName} on ${sq}`
                });
            } else if (targetVal > attackerVal) {
                results.push({
                    type: 'attack_tempo',
                    target: targetName,
                    targetType: target.type,
                    square: sq,
                    isDefended,
                    description: `attacks the ${targetName} on ${sq} with tempo`
                });
            }
        }
        return results;
    }

    /**
     * Detect if an enemy major or minor piece is trapped with no safe escape squares.
     */
    function detectTrappedPiece(boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece) return null;

        const color = piece.color;
        const oppColor = (color === 'w' ? 'b' : 'w');
        const attacks = getPieceAttacks(boardAfter, move.to);
        const attackerVal = PIECE_VALUES[piece.type] || 1;

        for (const sq of attacks) {
            const target = boardAfter.get(sq);
            if (!target || target.color !== oppColor) continue;
            if (target.type !== 'q' && target.type !== 'r' && target.type !== 'b' && target.type !== 'n') continue;

            const targetVal = PIECE_VALUES[target.type] || 0;
            const isDefended = isSquareAttackedBy(boardAfter, oppColor, sq);
            if (isDefended && targetVal <= attackerVal) continue;

            const targetAttacks = getPieceAttacks(boardAfter, sq);
            let hasSafeEscape = false;
            for (const escSq of targetAttacks) {
                const occ = boardAfter.get(escSq);
                if (occ && occ.color === oppColor) continue;
                if (escSq === move.to) {
                    if (isSquareAttackedBy(boardAfter, color, escSq) && targetVal > attackerVal) {
                        continue;
                    }
                    hasSafeEscape = true;
                    break;
                }
                if (!isSquareAttackedBy(boardAfter, color, escSq)) {
                    hasSafeEscape = true;
                    break;
                }
            }

            if (!hasSafeEscape) {
                const name = PIECE_NAMES[target.type] || 'piece';
                return {
                    target: name,
                    square: sq,
                    description: `traps the enemy ${name} on ${sq}`
                };
            }
        }
        return null;
    }

    /**
     * Detect board control dominance (center duo, open file, 7th rank, outposts, diagonal).
     */
    function detectBoardControlDominance(boardBefore, boardAfter, move) {
        const piece = boardAfter.get(move.to);
        if (!piece) return null;

        const color = piece.color;
        const oppName = (color === 'w' ? 'Black' : 'White');
        const toSq = move.to;
        const rank = squareToRank(toSq);

        // 1. Classical pawn center duo (e.g. e4 + d4 or e5 + d5)
        if (piece.type === 'p') {
            if ((color === 'w' && ((toSq === 'd4' && boardAfter.get('e4')?.type === 'p' && boardAfter.get('e4')?.color === 'w') ||
                                   (toSq === 'e4' && boardAfter.get('d4')?.type === 'p' && boardAfter.get('d4')?.color === 'w'))) ||
                (color === 'b' && ((toSq === 'd5' && boardAfter.get('e5')?.type === 'p' && boardAfter.get('e5')?.color === 'b') ||
                                   (toSq === 'e5' && boardAfter.get('d5')?.type === 'p' && boardAfter.get('d5')?.color === 'b')))) {
                return {
                    type: 'pawn_center_duo',
                    tags: ['Center Control', 'Pawn Center'],
                    description: `establishes a commanding pawn center with ${toSq}, dominating the central squares`
                };
            }
        }

        // 2. Queen centralization
        if (piece.type === 'q' && (toSq === 'd4' || toSq === 'd5' || toSq === 'e4' || toSq === 'e5')) {
            return {
                type: 'queen_centralization',
                tags: ['Center Control', 'Queen Centralization'],
                description: `centralizes the Queen on ${toSq} to dominate key diagonals and central squares`
            };
        }

        // 3. 7th rank infiltration for Rook / Queen
        if (piece.type === 'r' || piece.type === 'q') {
            if ((color === 'w' && rank === 6) || (color === 'b' && rank === 1)) {
                return {
                    type: 'seventh_rank',
                    tags: ['File Control', '7th Rank Infiltration'],
                    description: `infiltrates the 7th rank to terrorize ${oppName}'s pawns and restrict the King`
                };
            }
        }

        // 3. Open file control
        if (piece.type === 'r' || piece.type === 'q') {
            const fc = detectFileControl(boardBefore, move);
            if (fc && fc.includes('open file')) {
                return {
                    type: 'open_file',
                    tags: ['File Control', 'Open File'],
                    description: fc
                };
            }
        }

        // 4. Knight / Bishop outpost
        if ((piece.type === 'n' || piece.type === 'b') && isTrueOutpost(boardAfter, toSq, color)) {
            return {
                type: 'outpost',
                tags: ['Outpost', 'Board Control'],
                description: `anchors the ${PIECE_NAMES[piece.type]} on a dominant outpost on ${toSq}`
            };
        }

        // 5. Bishop diagonal control
        if (piece.type === 'b') {
            const attacks = getPieceAttacks(boardAfter, toSq);
            if (attacks.length >= 7) {
                return {
                    type: 'diagonal_control',
                    tags: ['Diagonal Control', 'Board Control'],
                    description: `places the bishop on an expansive diagonal controlling key squares`
                };
            }
        }

        return null;
    }

    /**
     * Detects if a rook is placed behind a passed pawn (Tarrasch rule).
     * @param {object} board - chess.js instance
     * @param {object} move - { from, to }
     * @returns {object|null}
     */
    function detectRookBehindPassedPawn(board, move) {
        if (!move || !move.to) return null;
        const piece = board.get(move.to);
        if (!piece || piece.type !== 'r') return null;
        const color = piece.color;
        const file = move.to[0];
        const rank = parseInt(move.to[1], 10);
        // Scan the file for passed pawns
        for (let r = 1; r <= 8; r++) {
            if (r === rank) continue;
            const sq = file + r;
            const p = board.get(sq);
            if (p && p.type === 'p') {
                const isPassed = detectPassedPawn(board, { from: sq, to: sq });
                if (isPassed) {
                    const isFriendly = (p.color === color);
                    const isBehind = (color === 'w' ? (rank < r) : (rank > r));
                    if (isBehind) {
                        return {
                            isFriendly,
                            square: sq,
                            description: isFriendly
                                ? `places the Rook behind the passed pawn on ${sq} to support its advance`
                                : `places the Rook behind the enemy passed pawn on ${sq} to control its path`
                        };
                    }
                }
            }
        }
        return null;
    }

    /**
     * Phase 2: Evidence-Ranked Narration for blunder, mistake, or miss.
     * Executes in 3 separable stages:
     * 1. Collect: runs all candidate detectors for best move and played move flaws
     * 2. Rank & Corroborate: scores candidates by weight * confidence * engineAgreement
     * 3. Compose: deterministic phrase bank scaled by severity, phase, and framing
     */
    function explainBlunderOrMistake(options) {
        const {
            boardBefore,
            boardAfter,
            playedMove,
            bestMove,
            refutationMove = null,
            sanPlayed,
            sanBest,
            sanRef = null,
            bestScore = null,
            playedScore = null,
            bestPv = [],
            refPv = [],
            bestPvFormatted = null,
            refPvFormatted = null,
            quality = null,
            detailedQuality = null,
            wpLoss = null,
            ply = null,
            phase = null,
            openingPrincipleViolation = null,
            isOnlyMove = false,
            isSacrifice = false,
            depthDial = null,
            personaId = null,
            playerElo = null
        } = options;

        const color = boardBefore.turn();
        const oppColor = (color === 'w' ? 'b' : 'w');
        const oppName = (color === 'w' ? 'Black' : 'White');

        const ChessCtor = getChessConstructor();

        // 1. Board after recommended best move
        let boardAfterBest = null;
        if (bestMove && ChessCtor) {
            try {
                boardAfterBest = new ChessCtor(boardBefore.fen());
                boardAfterBest.move({
                    from: bestMove.from,
                    to: bestMove.to,
                    promotion: bestMove.promotion
                });
            } catch (e) {
                boardAfterBest = null;
            }
        }

        // 2. Board after opponent refutation move
        let boardAfterRef = null;
        if (refutationMove && ChessCtor) {
            try {
                boardAfterRef = new ChessCtor(boardAfter.fen());
                boardAfterRef.move({
                    from: refutationMove.from,
                    to: refutationMove.to,
                    promotion: refutationMove.promotion
                });
            } catch (e) {
                boardAfterRef = null;
            }
        }

        // =====================================================================
        // STAGE 1: COLLECT CANDIDATES
        // =====================================================================
        const bestCandidates = [];
        const flawCandidates = [];

        // --- Collect Best Move Achievements ---
        if (bestMove && boardAfterBest) {
            // A1: Immediate Checkmate
            if (boardAfterBest.in_checkmate && boardAfterBest.in_checkmate()) {
                bestCandidates.push({
                    kind: 'immediate_mate',
                    weight: 100,
                    baseConfidence: 1.0,
                    tags: ['Missed Mate', 'Checkmate'],
                    reason: 'delivers checkmate immediately',
                    missedChance: 'misses immediate checkmate',
                    isMissedTactic: true
                });
            } else if (bestScore && bestScore.mate && bestScore.mate > 0) {
                bestCandidates.push({
                    kind: 'mate_in_n',
                    weight: 96,
                    baseConfidence: 0.95,
                    tags: ['Missed Mate'],
                    reason: `forces checkmate in ${bestScore.mate} moves`,
                    missedChance: `misses a forced checkmate in ${bestScore.mate} moves`,
                    isMissedTactic: true
                });
            }

            // A2: Material Gain or Checkmate in Engine PV
            if (bestPv && bestPv.length > 0) {
                const matGain = detectMaterialGainInPv(boardBefore, bestPv, color);
                if (matGain) {
                    if (matGain.type === 'checkmate') {
                        bestCandidates.push({
                            kind: 'pv_checkmate',
                            weight: 95,
                            baseConfidence: 0.95,
                            tags: ['Missed Mate', 'Checkmate'],
                            reason: 'forces checkmate through a tactical sequence',
                            missedChance: 'misses a forced checkmate sequence',
                            isMissedTactic: true
                        });
                    } else if (matGain.type === 'win_queen') {
                        bestCandidates.push({
                            kind: 'pv_win_queen',
                            weight: 92,
                            baseConfidence: 0.92,
                            tags: ['Missed Tactic', 'Winning Material'],
                            reason: boardBefore.get(bestMove.to)
                                ? `captures on ${bestMove.to} and wins the enemy Queen`
                                : 'wins the enemy Queen through a tactical sequence',
                            missedChance: 'misses winning the enemy Queen',
                            isMissedTactic: true
                        });
                    } else if (matGain.type === 'win_rook') {
                        bestCandidates.push({
                            kind: 'pv_win_rook',
                            weight: 86,
                            baseConfidence: 0.88,
                            tags: ['Missed Tactic', 'Winning Material'],
                            reason: boardBefore.get(bestMove.to)
                                ? `captures on ${bestMove.to} and wins a Rook`
                                : 'wins a Rook through a tactical sequence',
                            missedChance: 'misses winning a Rook',
                            isMissedTactic: true
                        });
                    } else if (matGain.type === 'win_piece') {
                        bestCandidates.push({
                            kind: 'pv_win_piece',
                            weight: 78,
                            baseConfidence: 0.85,
                            tags: ['Missed Tactic', 'Winning Material'],
                            reason: boardBefore.get(bestMove.to)
                                ? `captures on ${bestMove.to} and ${matGain.description}`
                                : matGain.description,
                            missedChance: 'misses winning a minor piece',
                            isMissedTactic: true
                        });
                    }
                }
            }

            // A3: Tactical Fork
            const fork = detectFork(boardAfterBest, bestMove);
            if (fork) {
                bestCandidates.push({
                    kind: 'fork',
                    weight: 84,
                    baseConfidence: 0.88,
                    tags: ['Missed Tactic', 'Tactical Fork', 'Missed Fork'],
                    reason: `forks the enemy ${fork.targets[0]} and ${fork.targets[1]}`,
                    missedChance: `misses a tactical fork against the ${fork.targets[0]} and ${fork.targets[1]}`,
                    isMissedTactic: true
                });
            }

            // A4: Pin
            const pin = detectPin(boardAfterBest, bestMove);
            if (pin) {
                bestCandidates.push({
                    kind: 'pin',
                    weight: 81,
                    baseConfidence: 0.85,
                    tags: ['Missed Tactic', 'Pin', 'Missed Pin'],
                    reason: pin.description,
                    missedChance: `misses pinning the enemy ${pin.pinned}`,
                    isMissedTactic: true
                });
            }

            // A5: Skewer
            const skewer = detectSkewer(boardAfterBest, bestMove);
            if (skewer) {
                bestCandidates.push({
                    kind: 'skewer',
                    weight: 81,
                    baseConfidence: 0.85,
                    tags: ['Missed Tactic', 'Skewer', 'Missed Skewer'],
                    reason: skewer.description,
                    missedChance: `misses skewering the ${skewer.front} and ${skewer.back}`,
                    isMissedTactic: true
                });
            }

            // A6: Discovered Attack
            const disc = detectDiscoveredAttack(boardBefore, boardAfterBest, bestMove);
            if (disc) {
                bestCandidates.push({
                    kind: 'discovered_attack',
                    weight: 79,
                    baseConfidence: 0.83,
                    tags: ['Missed Tactic', 'Discovered Attack', 'Missed Discovery'],
                    reason: disc.description,
                    missedChance: `misses a discovered attack on the ${disc.target}`,
                    isMissedTactic: true
                });
            }

            // A7: Trapped Piece
            const trapped = detectTrappedPiece(boardAfterBest, bestMove);
            if (trapped) {
                bestCandidates.push({
                    kind: 'trapped_piece',
                    weight: 75,
                    baseConfidence: 0.82,
                    tags: ['Missed Tactic', 'Trapped Piece'],
                    reason: trapped.description,
                    missedChance: `misses the chance to trap ${oppName}'s ${trapped.target}`,
                    isMissedTactic: true
                });
            }

            // A8: Direct Attack on Valuable Pieces
            const attacks = detectAttacksOnPieces(boardAfterBest, bestMove);
            if (attacks.length > 0) {
                const attQ = attacks.find(a => a.type === 'attack_queen');
                const attR = attacks.find(a => a.type === 'attack_rook');
                const attU = attacks.find(a => a.type === 'attack_undefended');

                if (attQ) {
                    bestCandidates.push({
                        kind: 'attack_queen',
                        weight: 73,
                        baseConfidence: 0.85,
                        tags: ['Missed Attack', 'Attack on Queen'],
                        reason: `attacks the enemy Queen on ${attQ.square} with tempo`,
                        missedChance: `misses a chance to attack the enemy Queen on ${attQ.square}`,
                        isMissedTactic: true
                    });
                } else if (attR) {
                    bestCandidates.push({
                        kind: 'attack_rook',
                        weight: 70,
                        baseConfidence: 0.82,
                        tags: ['Missed Attack', 'Attack on Rook'],
                        reason: `attacks the Rook on ${attR.square}`,
                        missedChance: `misses a chance to attack ${oppName}'s Rook on ${attR.square}`,
                        isMissedTactic: true
                    });
                } else if (attU) {
                    bestCandidates.push({
                        kind: 'attack_undefended',
                        weight: 68,
                        baseConfidence: 0.80,
                        tags: ['Missed Attack', 'Attacking Piece'],
                        reason: attU.description,
                        missedChance: `misses an opportunity to attack the undefended ${attU.target} on ${attU.square}`,
                        isMissedTactic: true
                    });
                } else if (attacks[0]) {
                    bestCandidates.push({
                        kind: 'attack_tempo',
                        weight: 62,
                        baseConfidence: 0.75,
                        tags: ['Attack'],
                        reason: attacks[0].description,
                        missedChance: `misses attacking the ${attacks[0].target} with tempo`,
                        isMissedTactic: true
                    });
                }
            }

            // A9: Direct Capture of Free / Higher-Value Piece
            if (boardBefore.get(bestMove.to)) {
                const captured = boardBefore.get(bestMove.to);
                const capturedName = PIECE_NAMES[captured.type] || 'piece';
                const movingPiece = boardBefore.get(bestMove.from);
                const isDefended = isSquareAttackedBy(boardBefore, oppColor, bestMove.to);

                if (!isDefended) {
                    bestCandidates.push({
                        kind: 'capture_free',
                        weight: 76,
                        baseConfidence: 0.86,
                        tags: ['Missed Capture', 'Winning Material', 'Hanging Piece'],
                        reason: `wins the undefended ${capturedName} on ${bestMove.to}`,
                        missedChance: `misses capturing the free ${capturedName} on ${bestMove.to}`,
                        isMissedTactic: true
                    });
                } else if (PIECE_VALUES[captured.type] > (PIECE_VALUES[movingPiece?.type] || 0)) {
                    const isExchange = (captured.type === 'r' && (movingPiece?.type === 'b' || movingPiece?.type === 'n'));
                    bestCandidates.push({
                        kind: 'capture_material_gain',
                        weight: 74,
                        baseConfidence: 0.84,
                        tags: isExchange ? ['Winning Exchange', 'Missed Capture', 'Winning Material'] : ['Missed Capture', 'Winning Material'],
                        reason: isExchange ? `wins the exchange on ${bestMove.to}` : `wins the ${capturedName} on ${bestMove.to}`,
                        missedChance: isExchange ? `misses winning the exchange on ${bestMove.to}` : `misses winning the ${capturedName} on ${bestMove.to}`,
                        isMissedTactic: true
                    });
                } else {
                    bestCandidates.push({
                        kind: 'capture_equal',
                        weight: 60,
                        baseConfidence: 0.70,
                        tags: ['Missed Capture'],
                        reason: `captures the ${capturedName} on ${bestMove.to}`,
                        missedChance: `misses capturing the ${capturedName} on ${bestMove.to}`,
                        isMissedTactic: false
                    });
                }
            }

            // A10: Defensive Need
            const defMove = detectDefensiveMove(boardBefore, boardAfterBest, bestMove);
            if (defMove) {
                bestCandidates.push({
                    kind: 'defense',
                    weight: 65,
                    baseConfidence: 0.80,
                    tags: ['Defense'],
                    reason: defMove.description,
                    missedChance: null,
                    isMissedTactic: false
                });
            }

            // A11: Castling & King Safety
            if (sanBest === 'O-O' || sanBest === 'O-O-O') {
                bestCandidates.push({
                    kind: 'castling',
                    weight: 61,
                    baseConfidence: 0.85,
                    tags: ['King Safety'],
                    reason: 'castles to bring the King to safety and connect the rooks',
                    missedChance: null,
                    isMissedTactic: false
                });
            }

            // A12: Rook behind passed pawn
            const rookBehind = detectRookBehindPassedPawn(boardAfterBest, bestMove);
            if (rookBehind) {
                bestCandidates.push({
                    kind: 'rook_behind_passer',
                    weight: 59,
                    baseConfidence: 0.82,
                    tags: ['Rook Activity', 'Passed Pawn'],
                    reason: rookBehind.description,
                    missedChance: null,
                    isMissedTactic: false
                });
            }

            // A13: Board Control Dominance
            const bcd = detectBoardControlDominance(boardBefore, boardAfterBest, bestMove);
            if (bcd) {
                bestCandidates.push({
                    kind: 'board_control',
                    weight: 56,
                    baseConfidence: 0.78,
                    tags: bcd.tags,
                    reason: bcd.description,
                    missedChance: null,
                    isMissedTactic: false
                });
            }

            // A14: Center Strike / Center Control
            const cs = detectCenterStrike(boardBefore, bestMove);
            if (cs) {
                bestCandidates.push({
                    kind: 'center_strike',
                    weight: 52,
                    baseConfidence: 0.76,
                    tags: ['Center Control'],
                    reason: cs.description,
                    missedChance: null,
                    isMissedTactic: false
                });
            }

            // A15: Passed Pawn
            if (detectPassedPawn(boardAfterBest, bestMove)) {
                bestCandidates.push({
                    kind: 'passed_pawn',
                    weight: 51,
                    baseConfidence: 0.75,
                    tags: ['Passed Pawn'],
                    reason: 'creates a dangerous passed pawn',
                    missedChance: null,
                    isMissedTactic: false
                });
            }

            // A16: Minor Piece Development
            if (phase !== 'endgame') {
                const dev = detectMinorDevelopment(boardBefore, bestMove);
                if (dev) {
                    bestCandidates.push({
                        kind: 'minor_development',
                        weight: 48,
                        baseConfidence: 0.78,
                        tags: ['Development'],
                        reason: dev,
                        missedChance: null,
                        isMissedTactic: false
                    });
                }
            }

            // A17: Prophylaxis vs opponent's refutation
            if (refutationMove) {
                const proph = detectProphylaxis(boardBefore, boardAfterBest, bestMove, refutationMove, sanRef);
                if (proph) {
                    bestCandidates.push({
                        kind: 'prophylaxis',
                        weight: 42,
                        baseConfidence: 0.72,
                        tags: ['Prophylaxis'],
                        reason: proph,
                        missedChance: null,
                        isMissedTactic: false
                    });
                }
            }

            // A18: Positional Fallback
            const p = boardBefore.get(bestMove.from);
            let fallbackReason = 'improves piece activity and central coordination';
            if (phase === 'endgame') {
                if (p && p.type === 'k') fallbackReason = 'activates the King for the endgame';
                else if (p && p.type === 'r') fallbackReason = 'activates the Rook to control open lines and support the pawns';
                else if (p && p.type === 'p') fallbackReason = 'advances the pawn toward promotion';
                else fallbackReason = 'improves piece activity in the endgame';
            } else {
                if (p && p.type === 'p') fallbackReason = 'solidifies pawn structure and central control';
                else if (p && p.type === 'k') fallbackReason = 'moves the King to a safer square';
                else if (p && (p.type === 'r' || p.type === 'q')) fallbackReason = 'activates the piece to control open lines';
            }
            bestCandidates.push({
                kind: 'fallback',
                weight: 15,
                baseConfidence: 0.50,
                tags: [],
                reason: fallbackReason,
                missedChance: null,
                isMissedTactic: false
            });
        }

        // --- Collect Flaw & Refutation Candidates ---
        // Stalemate
        if (boardAfter.in_stalemate && boardAfter.in_stalemate()) {
            flawCandidates.push({
                kind: 'stalemate',
                weight: 100,
                baseConfidence: 1.0,
                tags: ['Stalemate'],
                blunderReason: 'allows stalemate, throwing away the win',
                refutationEffect: 'allows stalemate, turning a win into a draw',
                flawText: 'allows stalemate, throwing away the win'
            });
        }

        // Endgame Technique & Opposition
        if (phase === 'endgame' && isKingAndPawnEnding(boardBefore)) {
            const playedP = boardBefore.get(playedMove.from);
            const bestP = bestMove ? boardBefore.get(bestMove.from) : null;
            if (playedP && playedP.type === 'p' && bestP && bestP.type === 'k') {
                flawCandidates.push({
                    kind: 'opposition',
                    weight: 88,
                    baseConfidence: 0.92,
                    tags: ['Opposition', 'Endgame Technique'],
                    blunderReason: 'pushes the pawn prematurely and concedes the opposition',
                    refutationEffect: null,
                    flawText: 'pushes the pawn prematurely and concedes the opposition',
                    bestReasonOverride: 'maintains the opposition with the King before advancing the pawn'
                });
            }
        }

        // Hanging Piece Blunder
        const isLowSeverity = (quality === 'inaccuracy' || (typeof wpLoss === 'number' && wpLoss < 0.10));
        const hanging = (!isLowSeverity) ? detectHangingPieceBlunder(boardBefore, boardAfter, playedMove, refutationMove) : null;
        if (hanging) {
            flawCandidates.push({
                kind: 'hanging_piece',
                weight: 85,
                baseConfidence: 0.90,
                tags: ['Hanging Piece'],
                blunderReason: hanging.description,
                refutationEffect: null,
                flawText: hanging.description
            });
        }

        // King Safety Flaw
        const ks = detectKingSafetyFlaw(boardBefore, boardAfter, playedMove);
        if (ks) {
            flawCandidates.push({
                kind: 'king_safety',
                weight: 65,
                baseConfidence: 0.80,
                tags: ['King Safety'],
                blunderReason: ks,
                refutationEffect: null,
                flawText: ks
            });
        }

        // Refutation Move Analysis
        if (refutationMove) {
            const isCheckmate = Boolean(options.refutationIsCheckmate) || Boolean(boardAfterRef && boardAfterRef.in_checkmate && boardAfterRef.in_checkmate());
            if (isCheckmate) {
                const checkmateSan = sanRef ? (sanRef.endsWith('#') ? sanRef : (sanRef.replace(/\+$/, '') + '#')) : 'refutation#';
                flawCandidates.push({
                    kind: 'ref_checkmate',
                    weight: 100,
                    baseConfidence: 1.0,
                    tags: ['Checkmate', 'Tactical Blunder'],
                    refutationEffect: `allows ${checkmateSan} delivering checkmate`,
                    flawText: `allows ${checkmateSan} delivering checkmate`
                });
            } else if (boardAfterRef) {
                if (refPv && refPv.length > 0) {
                    const refGain = detectMaterialGainInPv(boardAfter, refPv, oppColor);
                    if (refGain && (refGain.type === 'win_queen' || refGain.type === 'win_rook' || refGain.type === 'win_piece' || refGain.type === 'checkmate')) {
                        let refEffectText = '';
                        if (refGain.type === 'checkmate') {
                            refEffectText = `allows ${sanRef || 'the refutation'}, leading to a forced checkmate`;
                        } else if (boardAfter.get(refutationMove.to)) {
                            const lossName = (refGain.type === 'win_queen' ? 'your Queen' : (refGain.type === 'win_rook' ? 'a Rook' : 'a piece'));
                            refEffectText = `allows ${sanRef || 'refutation'} capturing on ${refutationMove.to} and winning ${lossName}`;
                        } else {
                            const cleanDesc = refGain.description.replace(/^wins\s+/i, '');
                            refEffectText = `allows ${sanRef || 'the punishment line'}, winning ${cleanDesc}`;
                        }
                        flawCandidates.push({
                            kind: 'ref_pv_gain',
                            weight: (refGain.type === 'win_queen' ? 92 : (refGain.type === 'win_rook' ? 88 : 80)),
                            baseConfidence: 0.90,
                            tags: ['Tactical Blunder', 'Losing Material'],
                            refutationEffect: refEffectText,
                            flawText: refEffectText
                        });
                    }
                }

                // Tactical Fork by refutation
                const forkRef = detectFork(boardAfterRef, refutationMove);
                if (forkRef) {
                    flawCandidates.push({
                        kind: 'ref_fork',
                        weight: 82,
                        baseConfidence: 0.85,
                        tags: ['Tactical Fork'],
                        refutationEffect: `allows ${sanRef || 'refutation'} ${forkRef.description}`,
                        flawText: `allows ${sanRef || 'refutation'} ${forkRef.description}`
                    });
                }

                // Pin by refutation
                if (detectPin(boardAfterRef, refutationMove)) {
                    flawCandidates.push({
                        kind: 'ref_pin',
                        weight: 78,
                        baseConfidence: 0.82,
                        tags: ['Pin'],
                        refutationEffect: `allows ${sanRef || 'refutation'} pinning your piece to the King`,
                        flawText: `allows ${sanRef || 'refutation'} pinning your piece to the King`
                    });
                }

                // Skewer by refutation
                const skRef = detectSkewer(boardAfterRef, refutationMove);
                if (skRef) {
                    flawCandidates.push({
                        kind: 'ref_skewer',
                        weight: 78,
                        baseConfidence: 0.82,
                        tags: ['Skewer'],
                        refutationEffect: `allows ${sanRef || 'refutation'} ${skRef.description}`,
                        flawText: `allows ${sanRef || 'refutation'} ${skRef.description}`
                    });
                }

                // Discovered attack by refutation
                const discRef = detectDiscoveredAttack(boardAfter, boardAfterRef, refutationMove);
                if (discRef) {
                    flawCandidates.push({
                        kind: 'ref_discovery',
                        weight: 76,
                        baseConfidence: 0.80,
                        tags: ['Discovered Attack'],
                        refutationEffect: `allows ${sanRef || 'refutation'} ${discRef.description}`,
                        flawText: `allows ${sanRef || 'refutation'} ${discRef.description}`
                    });
                }

                // Direct capture on refutation
                if (boardAfter.get(refutationMove.to)) {
                    const capturedPiece = boardAfter.get(refutationMove.to);
                    const capName = PIECE_NAMES[capturedPiece.type] || 'piece';
                    const isHangCapture = (refutationMove.to === playedMove.to);
                    flawCandidates.push({
                        kind: 'ref_capture',
                        weight: isHangCapture ? 75 : 72,
                        baseConfidence: 0.82,
                        tags: ['Hanging Piece'],
                        refutationEffect: isHangCapture
                            ? `allows ${sanRef || 'refutation'} capturing the exposed ${capName}`
                            : `allows ${sanRef || 'refutation'} capturing your undefended ${capName} on ${refutationMove.to}`,
                        flawText: isHangCapture
                            ? `allows ${sanRef || 'refutation'} capturing the exposed ${capName}`
                            : `allows ${sanRef || 'refutation'} capturing your undefended ${capName} on ${refutationMove.to}`
                    });
                }

                // Center strike by refutation
                const csRef = detectCenterStrike(boardAfter, refutationMove);
                if (csRef) {
                    flawCandidates.push({
                        kind: 'ref_center',
                        weight: 55,
                        baseConfidence: 0.78,
                        tags: ['Center Control'],
                        refutationEffect: `allows ${oppName} to ${csRef.action || csRef.description}`,
                        flawText: `allows ${oppName} to ${csRef.action || csRef.description}`
                    });
                }

                // Attacks on valuable pieces by refutation
                const refAttacks = detectAttacksOnPieces(boardAfterRef, refutationMove);
                if (refAttacks.length > 0) {
                    const refMajor = refAttacks.find(a => a.type === 'attack_queen' || a.type === 'attack_rook') || refAttacks[0];
                    flawCandidates.push({
                        kind: 'ref_attack',
                        weight: 50,
                        baseConfidence: 0.74,
                        tags: [],
                        refutationEffect: `allows ${sanRef} attacking your ${refMajor.target} with tempo`,
                        flawText: `allows ${sanRef} attacking your ${refMajor.target} with tempo`
                    });
                }

                // 7th rank infiltration by refutation
                const refPiece = boardAfter.get(refutationMove.from);
                const refRank = squareToRank(refutationMove.to);
                if (refPiece && refPiece.type === 'r' && ((oppColor === 'w' && refRank === 6) || (oppColor === 'b' && refRank === 1))) {
                    flawCandidates.push({
                        kind: 'ref_seventh_rank',
                        weight: 52,
                        baseConfidence: 0.75,
                        tags: ['File Control', '7th Rank Infiltration'],
                        refutationEffect: `allows ${sanRef} penetrating to the 7th rank`,
                        flawText: `allows ${sanRef} penetrating to the 7th rank`
                    });
                }

                // Check by refutation
                if (sanRef && sanRef.includes('+')) {
                    flawCandidates.push({
                        kind: 'ref_check',
                        weight: 42,
                        baseConfidence: 0.70,
                        tags: [],
                        refutationEffect: `allows a disruptive check with ${sanRef}`,
                        flawText: `allows a disruptive check with ${sanRef}`
                    });
                }

                // Activation fallback
                const pName = refPiece ? (PIECE_NAMES[refPiece.type] || 'piece') : 'piece';
                flawCandidates.push({
                    kind: 'ref_activation',
                    weight: 30,
                    baseConfidence: 0.60,
                    tags: [],
                    refutationEffect: `allows ${oppName} to play ${sanRef || 'an active reply'}, activating the ${pName}`,
                    flawText: `allows ${oppName} to play ${sanRef || 'an active reply'}`
                });
            } else {
                flawCandidates.push({
                    kind: 'ref_initiative',
                    weight: 25,
                    baseConfidence: 0.50,
                    tags: [],
                    refutationEffect: `gives ${oppName} the initiative with ${sanRef || 'threats'}`,
                    flawText: `gives ${oppName} the initiative`
                });
            }
        }

        // General fallback flaw
        flawCandidates.push({
            kind: 'general_fallback',
            weight: 10,
            baseConfidence: 0.40,
            tags: [],
            blunderReason: null,
            refutationEffect: `concedes the advantage to ${oppName}`,
            flawText: `concedes the advantage to ${oppName}`
        });

        // =====================================================================
        // STAGE 2: RANK & CORROBORATE (Engine Agreement Check)
        // =====================================================================
        // Score bestCandidates
        for (const c of bestCandidates) {
            let engineAgreement = 1.0;
            if (c.kind === 'immediate_mate' || c.kind === 'mate_in_n' || c.kind === 'pv_checkmate') {
                const hasMateScore = (bestScore && bestScore.mate && bestScore.mate > 0);
                const hasMateOnBoard = (boardAfterBest && boardAfterBest.in_checkmate && boardAfterBest.in_checkmate());
                engineAgreement = (hasMateScore || hasMateOnBoard) ? 1.0 : 0.1;
            } else if (c.kind === 'pv_win_queen' || c.kind === 'attack_queen') {
                if (bestScore && (bestScore.mate || bestScore.cp >= 180 || (bestPv && bestPv.length > 0))) {
                    engineAgreement = 1.0;
                } else if (bestScore && bestScore.cp < 80) {
                    engineAgreement = 0.3;
                }
            } else if (c.kind === 'minor_development' && phase === 'endgame') {
                engineAgreement = 0.0;
            }
            c.score = c.weight * c.baseConfidence * engineAgreement;
        }
        bestCandidates.sort((a, b) => b.score - a.score);

        // Score flawCandidates
        for (const c of flawCandidates) {
            let engineAgreement = 1.0;
            if (c.kind === 'hanging_piece') {
                if (refutationMove && (refutationMove.to === playedMove.to || (boardAfter.get(refutationMove.to) && boardAfter.get(refutationMove.to).type === boardBefore.get(playedMove.from)?.type))) {
                    engineAgreement = 1.0;
                } else if (refPv && refPv.length > 0) {
                    engineAgreement = 0.9;
                } else {
                    engineAgreement = 0.5;
                }
            } else if (c.kind === 'opposition' && phase !== 'endgame') {
                engineAgreement = 0.0;
            }
            c.score = c.weight * c.baseConfidence * engineAgreement;
        }
        flawCandidates.sort((a, b) => b.score - a.score);

        // Collect all verified tags from candidates with score >= 35
        const tags = [];
        for (const c of bestCandidates) {
            if (c.score >= 35 && c.tags) {
                tags.push(...c.tags);
            }
        }
        for (const c of flawCandidates) {
            if (c.score >= 35 && c.tags) {
                tags.push(...c.tags);
            }
        }

        const primaryBest = bestCandidates[0] || null;
        const primaryFlaw = flawCandidates[0] || null;

        let bestReason = primaryBest ? primaryBest.reason : 'maintains an active position';
        if (primaryFlaw && primaryFlaw.bestReasonOverride) {
            bestReason = primaryFlaw.bestReasonOverride;
        }

        let isMissedTactic = Boolean(primaryBest && primaryBest.isMissedTactic);
        let missedChance = primaryBest ? primaryBest.missedChance : null;
        let blunderReason = primaryFlaw ? primaryFlaw.blunderReason : null;
        
        // Find top refutation effect from candidates
        const refCandidate = flawCandidates.find(c => c.refutationEffect && c.kind !== 'general_fallback' && c.score >= 25);
        let refutationEffect = refCandidate ? refCandidate.refutationEffect : (isMissedTactic ? 'hands over the initiative' : (primaryFlaw?.refutationEffect || null));
        let flaw = primaryFlaw ? (primaryFlaw.flawText || primaryFlaw.blunderReason || refutationEffect) : null;
        if (!flaw) {
            flaw = `concedes the advantage to ${oppName}`;
        }

        // Clean up redundant "allows allows" phrasing
        let cleanRefEffect = refutationEffect;
        if (blunderReason && cleanRefEffect && blunderReason.includes('allows') && cleanRefEffect.startsWith('allows ')) {
            cleanRefEffect = cleanRefEffect.replace(/^allows\s+/, 'allowing ');
        }

        // =====================================================================
        // STAGE 3: COMPOSE NARRATIVE
        // Deterministic template selection scaled by severity and MultiPV spread
        // =====================================================================
        let explanation = '';

        if (isMissedTactic) {
            if (tags.includes('Missed Mate')) {
                if (boardAfter.in_stalemate && boardAfter.in_stalemate()) {
                    explanation = `${sanPlayed} misses checkmate! ${sanBest} would have finished the game immediately. Instead, ${sanPlayed} allows stalemate, throwing away the win.`;
                } else {
                    explanation = `${sanPlayed} misses checkmate! ${sanBest} would have finished the game immediately. Instead, ${sanPlayed} lets ${oppName} stay in the game.`;
                }
            } else {
                const missExtra = missedChance ? ` and ${missedChance}` : '';
                explanation = `${sanPlayed} overlooks a tactical opportunity${missExtra}. ${sanBest} was winning because it ${bestReason}. Instead, ${sanPlayed} ${cleanRefEffect || 'hands over the initiative'}.`;
            }
        } else if (blunderReason) {
            if (cleanRefEffect) {
                explanation = `${sanPlayed} ${blunderReason}, which ${cleanRefEffect}. ${sanBest} was much better because it ${bestReason}.`;
            } else {
                explanation = `${sanPlayed} blunders by ${blunderReason}. ${sanBest} was necessary because it ${bestReason}.`;
            }
        } else if (tags.includes('Tactical Fork') || tags.includes('Pin') || tags.includes('Skewer') || tags.includes('Hanging Piece') || tags.includes('Checkmate') || tags.includes('Tactical Blunder') || tags.includes('Losing Material')) {
            explanation = `${sanPlayed} runs into tactical trouble: it ${cleanRefEffect}. ${sanBest} was much safer because it ${bestReason}.`;
        } else if (openingPrincipleViolation) {
            explanation = `${sanPlayed} violates opening principles by ${openingPrincipleViolation}. ${sanBest} was stronger because it ${bestReason}.`;
        } else if (tags.includes('Center Control')) {
            explanation = `${sanPlayed} is passive and ${cleanRefEffect}. A stronger alternative was ${sanBest}, which ${bestReason}.`;
        } else {
            explanation = `${sanPlayed} ${cleanRefEffect || ('concedes the advantage to ' + oppName)}. ${sanBest} was better because it ${bestReason}.`;
        }

        // Persona-scaled explanation tuning
        if (depthDial === 'concise' || personaId === 'mcmarty' || (playerElo !== null && playerElo <= 900)) {
            const firstSentence = explanation.split('. ')[0];
            explanation = firstSentence.endsWith('.') ? firstSentence : firstSentence + '.';
        } else if ((depthDial === 'deep' || personaId === 'mangoose' || (playerElo !== null && playerElo >= 2000)) && bestPvFormatted && !explanation.includes(bestPvFormatted)) {
            explanation = `${explanation} Better continuation: ${bestPvFormatted}`;
        }

        return {
            explanation,
            tags: Array.from(new Set(tags)),
            flaw,
            missedChance,
            betterLine: bestReason
        };
    }

    /**
     * Explanation for good, great, or brilliant move (Phase 2 evidence-aware).
     */
    function explainGoodMove(options) {
        const {
            boardBefore,
            boardAfter,
            move,
            san,
            isBest = false
        } = options;

        const phase = options.phase || (typeof ChessEvaluator !== 'undefined' && ChessEvaluator.gamePhase ? ChessEvaluator.gamePhase(boardBefore.fen()) : 'middlegame');
        const detailedQuality = options.detailedQuality || null;
        const isOnlyMove = Boolean(options.isOnlyMove);
        const isSacrifice = Boolean(options.isSacrifice);

        const color = boardBefore.turn();
        const tags = [];
        const reasons = [];

        if (boardAfter.in_checkmate && boardAfter.in_checkmate()) {
            tags.push('Checkmate');
            return {
                explanation: `Checkmate! ${san} delivers mate and finishes the game.`,
                tags,
                flaw: null,
                missedChance: null,
                betterLine: 'delivers checkmate immediately'
            };
        }

        if (san === 'O-O' || san === 'O-O-O') {
            tags.push('King Safety');
            reasons.push('castles to bring the King to safety and connect the rooks');
        }

        if (san.includes('+')) {
            tags.push('Check');
            reasons.push('gives a forcing check');
        }

        if (move.promotion || (san && san.includes('='))) {
            tags.push('Pawn Promotion', 'Promotion');
            const promoChar = move.promotion || (san.includes('=') ? san.split('=')[1].charAt(0).toLowerCase() : 'q');
            const promoName = PIECE_NAMES[promoChar] || 'queen';
            reasons.push(`promotes the pawn to a ${promoName}`);
        }

        const p = boardBefore.get(move.from);
        if (p && p.type === 'k' && phase === 'endgame') {
            if (isKingAndPawnEnding(boardBefore)) {
                tags.push('Opposition', 'King Activity');
                reasons.push('seizes the opposition and activates the king');
            } else {
                tags.push('King Activity');
                reasons.push('activates the king for the endgame');
            }
        }

        if (p && p.type === 'r' && phase === 'endgame') {
            tags.push('Rook Activity');
            const rookBehind = detectRookBehindPassedPawn(boardAfter, move);
            if (rookBehind) {
                tags.push('Passed Pawn');
                reasons.push(rookBehind.description);
            } else {
                reasons.push('activates the rook to prepare the winning bridge');
            }
        }

        if (p && p.type === 'p') {
            const file = move.to[0];
            const rank = move.to[1];
            if ((file === 'a' || file === 'h') && (rank === '3' || rank === '6')) {
                const targetFile = (file === 'a') ? 'b' : 'g';
                const targetRank = (rank === '3') ? '4' : '5';
                tags.push('Prophylaxis');
                reasons.push(`controls ${targetFile}${targetRank} to prevent enemy piece infiltration and create an escape square`);
            }
        }

        // Only call it a sacrifice when the classifier agreed it was sound (brilliant).
        // Otherwise describe what the line actually does with the material.
        const lineSummary = options.lineSummary || null;
        const ledgerText = (lineSummary && lineSummary.ledgerText) || '';
        if (isSacrifice && detailedQuality === 'brilliant') {
            tags.push('Sacrifice');
            reasons.push(ledgerText
                ? `${ledgerText}, a sound sacrifice the opponent cannot exploit`
                : 'offers a sound sacrifice the opponent cannot exploit');
        } else if (ledgerText) {
            reasons.push(ledgerText);
        }
        if (isOnlyMove) {
            tags.push('Only Move');
            reasons.push('finds the only move that maintains the balance and holds the position');
        }

        const captured = boardBefore.get(move.to);
        if (captured && !ledgerText) {
            reasons.push(`captures the ${PIECE_NAMES[captured.type] || 'piece'}`);
        }

        const fork = detectFork(boardAfter, move);
        if (fork) {
            tags.push('Fork');
            reasons.push(fork.description);
        }

        const pin = detectPin(boardAfter, move);
        if (pin) {
            tags.push('Pin');
            reasons.push(pin.description);
        }

        const skewer = detectSkewer(boardAfter, move);
        if (skewer) {
            tags.push('Skewer');
            reasons.push(skewer.description);
        }

        const disc = detectDiscoveredAttack(boardBefore, boardAfter, move);
        if (disc) {
            tags.push('Discovered Attack');
            reasons.push(disc.description);
        }

        const attacks = detectAttacksOnPieces(boardAfter, move);
        if (attacks.length > 0) {
            const attQ = attacks.find(a => a.type === 'attack_queen');
            if (attQ) {
                tags.push('Attack on Queen');
                reasons.push(attQ.description);
            } else if (attacks[0].type === 'attack_rook') {
                tags.push('Attack on Rook');
                reasons.push(attacks[0].description);
            } else if (attacks[0].type === 'attack_undefended') {
                reasons.push(attacks[0].description);
            }
        }

        const bcd = detectBoardControlDominance(boardBefore, boardAfter, move);
        if (bcd && phase !== 'endgame') {
            tags.push(...bcd.tags);
            reasons.push(bcd.description);
        }

        const fileCtrl = detectFileControl(boardBefore, move);
        if (fileCtrl) {
            tags.push('File Control');
            reasons.push(fileCtrl);
        }

        if (isTrueOutpost(boardAfter, move.to, color)) {
            tags.push('Outpost');
            reasons.push('anchors a strong outpost');
        }

        if (detectPassedPawn(boardAfter, move)) {
            tags.push('Passed Pawn');
            reasons.push('advances a passed pawn toward promotion');
        }

        if (p && (p.type === 'n' || p.type === 'b') && phase !== 'endgame') {
            const homeRank = (color === 'w' ? 0 : 7);
            if (squareToRank(move.from) === homeRank) {
                tags.push('Development');
                reasons.push(`develops the ${PIECE_NAMES[p.type]} to an active square`);
            }
        }

        let prefix = isBest ? 'Best move! ' : 'Strong move. ';
        if (detailedQuality === 'brilliant') {
            prefix = 'Brilliant move! ';
        } else if (detailedQuality === 'great') {
            prefix = 'Great move! ';
        }

        const reasonsDedup = Array.from(new Set(reasons));
        const depthDial = options.depthDial || null;
        const personaId = options.personaId || null;
        const playerElo = options.playerElo || null;

        let explanationText = (reasonsDedup.length > 0)
            ? `${prefix}${san} ${reasonsDedup.join(', and ')}.`
            : `${prefix}${san} maintains a solid position and harmonious coordination.`;

        if ((depthDial === 'deep' || personaId === 'mangoose' || (playerElo !== null && playerElo >= 2000)) && options.bestPvFormatted && !explanationText.includes(options.bestPvFormatted)) {
            explanationText = `${explanationText} Strongest line: ${options.bestPvFormatted}`;
        }

        return {
            explanation: explanationText,
            tags: Array.from(new Set(tags)),
            flaw: null,
            missedChance: null,
            betterLine: reasonsDedup.length > 0 ? reasonsDedup.join(', and ') : 'maintains solid piece coordination'
        };
    }

    /**
     * Classifies the primary tactical or positional motif of a candidate move.
     * Evaluates candidate move on a cloned board to run detectors in priority order.
     * @param {object|string} boardBefore - Chess instance or FEN string before the move
     * @param {object|string} move - Move object ({from, to, promotion}) or SAN/UCI string
     * @returns {object} { motif, keySquares, description }
     */
    function classifyTacticalMotif(boardBefore, move) {
        if (!boardBefore || !move) {
            return { motif: 'positional', keySquares: { targets: [] }, description: 'repositions piece for harmony' };
        }

        const ChessCtor = getChessConstructor();
        if (!ChessCtor) {
            return { motif: 'positional', keySquares: { targets: [] }, description: 'piece movement' };
        }

        const simBefore = (typeof boardBefore === 'string')
            ? new ChessCtor(boardBefore)
            : new ChessCtor(boardBefore.fen());

        const color = simBefore.turn();
        const oppColor = oppositeColor(color);

        let moveObj = null;
        if (typeof move === 'string') {
            // Try as SAN first, then UCI
            moveObj = simBefore.move(move);
            if (!moveObj && move.length >= 4) {
                moveObj = simBefore.move({
                    from: move.slice(0, 2),
                    to: move.slice(2, 4),
                    promotion: move[4] || undefined
                });
            }
        } else {
            moveObj = simBefore.move(move);
        }

        if (!moveObj) {
            return { motif: 'positional', keySquares: { targets: [] }, description: 'maintains solid coordination' };
        }

        const simAfter = new ChessCtor(simBefore.fen());
        // Restore simBefore
        simBefore.undo();

        // 1. Checkmate or Mate Threat
        if (simAfter.in_checkmate && simAfter.in_checkmate()) {
            const kingSq = findKingSquare(simAfter, oppColor);
            return {
                motif: 'mateThreat',
                keySquares: { targets: kingSq ? [kingSq] : [], weakSquare: moveObj.to },
                description: 'delivering checkmate'
            };
        }

        // 2. Fork / Double Attack
        const fork = detectFork(simAfter, moveObj);
        if (fork) {
            return {
                motif: 'fork',
                keySquares: {
                    targets: fork.targetSquares || [],
                    attackerSquare: fork.attackerSquare || moveObj.to
                },
                description: fork.description
            };
        }

        // 3. Pin
        const pin = detectPin(simAfter, moveObj);
        if (pin) {
            return {
                motif: 'pin',
                keySquares: {
                    targets: [pin.pinnedSquare].filter(Boolean),
                    pinnedSquare: pin.pinnedSquare,
                    behindSquare: pin.behindSquare,
                    line: pin.line || []
                },
                description: pin.description
            };
        }

        // 4. Skewer
        const skewer = detectSkewer(simAfter, moveObj);
        if (skewer) {
            return {
                motif: 'skewer',
                keySquares: {
                    targets: [skewer.frontSquare, skewer.backSquare].filter(Boolean),
                    frontSquare: skewer.frontSquare,
                    backSquare: skewer.backSquare
                },
                description: skewer.description
            };
        }

        // 5. Discovered Attack / Discovered Check
        const disc = detectDiscoveredAttack(simBefore, simAfter, moveObj);
        if (disc) {
            return {
                motif: 'discovered',
                keySquares: {
                    targets: disc.targetSquare ? [disc.targetSquare] : (disc.target === 'king' ? [findKingSquare(simAfter, oppColor)].filter(Boolean) : []),
                    blockerSquare: disc.blockerSquare,
                    sliderSquare: disc.sliderSquare,
                    targetSquare: disc.targetSquare
                },
                description: disc.description
            };
        }

        // 6. Tactical Capture / Hanging piece (verified by SEE > 0)
        if (moveObj.captured || simBefore.get(moveObj.to)) {
            const seeGain = staticExchangeEval(simBefore, moveObj.to, color);
            if (seeGain > 0) {
                return {
                    motif: 'hanging',
                    keySquares: {
                        targets: [moveObj.to]
                    },
                    description: `capturing loose material on ${moveObj.to}`
                };
            }
        }

        // 7. Forcing Check
        if (simAfter.in_check && simAfter.in_check()) {
            const kingSq = findKingSquare(simAfter, oppColor);
            return {
                motif: 'check',
                keySquares: {
                    targets: kingSq ? [kingSq] : []
                },
                description: 'checking the enemy King'
            };
        }

        // 8. Trapped Piece
        if (typeof detectTrappedPiece === 'function') {
            const trapped = detectTrappedPiece(simAfter, moveObj);
            if (trapped) {
                return {
                    motif: 'trapped',
                    keySquares: {
                        targets: trapped.targetSquare ? [trapped.targetSquare] : []
                    },
                    description: trapped.description || 'trapping an enemy piece'
                };
            }
        }

        // 9. Positional Fallback
        return {
            motif: 'positional',
            keySquares: {
                targets: []
            },
            description: 'improving piece placement and coordination'
        };
    }

    return {
        PIECE_VALUES,
        PIECE_NAMES,
        getPieceAttacks,
        isSquareAttackedBy,
        getAttackers,
        staticExchangeEval,
        isPieceSafe,
        detectThreatsCreated,
        detectAttacksOnPieces,
        detectTrappedPiece,
        detectBoardControlDominance,
        detectFork,
        detectPin,
        detectSkewer,
        detectDiscoveredAttack,
        classifyTacticalMotif,
        detectCenterStrike,
        detectDefensiveMove,
        detectMinorDevelopment,
        detectMaterialGainInPv,
        detectProphylaxis,
        detectHangingPieceBlunder,
        isTrueOutpost,
        detectFileControl,
        detectPassedPawn,
        detectRookBehindPassedPawn,
        hasCastlingRights,
        detectKingSafetyFlaw,
        explainBlunderOrMistake,
        explainGoodMove
    };
}));
SituationRecognizer=self.SituationRecognizer;
/**
 * move-diagnostics.js - Unified move diagnosis engine for WhyBlunder.
 *
 * Exposes MoveDiagnostics.diagnose(options) which gathers engine evidence,
 * computes adaptive classification, evaluates tactical patterns, and
 * returns structured narrative and diagnostic evidence.
 *
 * Compatible with Browser and Node.js (UMD).
 */
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.MoveDiagnostics = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    function getChessConstructor() {
        if (typeof Chess !== 'undefined') return Chess;
        if (typeof window !== 'undefined' && window.Chess) return window.Chess;
        if (typeof global !== 'undefined' && global.Chess) return global.Chess;
        try {
            const c = require('./chess.min.js');
            return c.Chess || c;
        } catch (e) {
            return null;
        }
    }

    function getEvaluator() {
        if (typeof ChessEvaluator !== 'undefined') return ChessEvaluator;
        if (typeof window !== 'undefined' && window.ChessEvaluator) return window.ChessEvaluator;
        if (typeof global !== 'undefined' && global.ChessEvaluator) return global.ChessEvaluator;
        try { return require('./chess-evaluator.js'); } catch (e) { return null; }
    }

    function getDetector() {
        if (typeof OpeningDetector !== 'undefined') return OpeningDetector;
        if (typeof window !== 'undefined' && window.OpeningDetector) return window.OpeningDetector;
        if (typeof global !== 'undefined' && global.OpeningDetector) return global.OpeningDetector;
        try { return require('./opening-detector.js'); } catch (e) { return null; }
    }

    function getRecognizer() {
        if (typeof SituationRecognizer !== 'undefined') return SituationRecognizer;
        if (typeof window !== 'undefined' && window.SituationRecognizer) return window.SituationRecognizer;
        if (typeof global !== 'undefined' && global.SituationRecognizer) return global.SituationRecognizer;
        try { return require('./situation-recognizer.js'); } catch (e) { return null; }
    }

    function uciToSan(chessInstance, uciMove) {
        if (!uciMove || typeof uciMove !== 'string' || uciMove.length < 4) return '';
        const from = uciMove.substring(0, 2);
        const to = uciMove.substring(2, 4);
        const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
        try {
            const m = chessInstance.move({ from, to, promotion });
            if (m) {
                const san = m.san;
                chessInstance.undo();
                return san;
            }
        } catch (e) {}
        return uciMove;
    }

    function formatPv(chessInstance, uciMoves, maxMoves) {
        maxMoves = maxMoves || 5;
        if (!uciMoves || !Array.isArray(uciMoves) || uciMoves.length === 0) return '';
        const ChessCtor = getChessConstructor();
        if (!ChessCtor) return uciMoves.slice(0, maxMoves).join(' ');
        const temp = new ChessCtor(chessInstance.fen());
        const tokens = [];
        for (let i = 0; i < Math.min(maxMoves, uciMoves.length); i++) {
            const uci = uciMoves[i];
            if (!uci || typeof uci !== 'string' || uci.length < 4) break;
            try {
                const isWhite = (temp.turn() === 'w');
                const moveNum = parseInt(temp.fen().split(' ')[5], 10) || 1;
                const m = temp.move({
                    from: uci.substring(0, 2),
                    to: uci.substring(2, 4),
                    promotion: uci.length > 4 ? uci[4] : undefined
                });
                if (!m) break;
                if (isWhite) tokens.push(`${moveNum}. ${m.san}`);
                else if (i === 0) tokens.push(`${moveNum}... ${m.san}`);
                else tokens.push(m.san);
            } catch (e) {
                break;
            }
        }
        return tokens.join(' ');
    }

    function detectOfferedPiece(boardBefore, boardAfter, moveObj, Recognizer) {
        if (!Recognizer || !Recognizer.staticExchangeEval) return false;
        if (!moveObj || !moveObj.to) return false;

        const oppTurn = boardAfter.turn();
        const moverTurn = oppTurn === 'w' ? 'b' : 'w';

        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
        let capturedValue = 0;
        if (moveObj.captured) {
            capturedValue = pieceValues[moveObj.captured] || 0;
        }

        const fenBeforeTokens = boardBefore.fen().split(' ');
        fenBeforeTokens[1] = oppTurn;
        fenBeforeTokens[3] = '-'; 
        const ChessCtor = getChessConstructor();
        const boardBeforeFlipped = new ChessCtor(fenBeforeTokens.join(' '));

        const moves = boardAfter.moves({ verbose: true });
        let maxSee = 0;
        let offeredPieceSquare = null;
        let offeredPieceType = null;

        for (const m of moves) {
            if (m.flags.includes('c') || m.flags.includes('e')) {
                const targetSq = m.to;
                const targetPiece = boardAfter.get(targetSq);
                if (!targetPiece) continue; 
                
                const type = targetPiece.type;
                const val = pieceValues[type] || 0;
                
                if (val >= 3 && targetPiece.color === moverTurn) {
                    let wasEnPrise = false;
                    if (targetSq !== moveObj.to) {
                        const seeBefore = Recognizer.staticExchangeEval(boardBeforeFlipped, targetSq, oppTurn);
                        if (seeBefore > 0) {
                            wasEnPrise = true;
                        }
                    }

                    if (!wasEnPrise) {
                        const seeAfter = Recognizer.staticExchangeEval(boardAfter, targetSq, oppTurn);
                        if (seeAfter > maxSee) {
                            maxSee = seeAfter;
                            offeredPieceSquare = targetSq;
                            offeredPieceType = type;
                        }
                    }
                }
            }
        }

        if (maxSee - capturedValue >= 2) {
            return {
                isOffered: true,
                piece: offeredPieceType,
                square: offeredPieceSquare
            };
        }
        return false;
    }

    // =====================================================================
    // "WHY" BUILDERS
    // Engine-free, deterministic helpers that turn MultiPV lines into the
    // four answers a student needs: situation, threat, idea, alternatives.
    // =====================================================================

    const WHY_PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    const WHY_PIECE_NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
    const WHY_ABOUT_EQUAL_WP = 0.02;
    const WHY_SLIGHTLY_WORSE_WP = 0.08;
    const WHY_THREAT_MIN_WP = 0.05;
    const WHY_THREAT_MIN_CP = 120;

    function sideName(color) {
        return color === 'w' ? 'White' : 'Black';
    }

    function pieceLabel(type, square) {
        if (type === 'p') return square ? `the ${square[0]}-pawn` : 'a pawn';
        return `the ${WHY_PIECE_NAMES[type] || 'piece'}`;
    }

    function joinWords(items) {
        if (items.length <= 1) return items.join('');
        if (items.length === 2) return `${items[0]} and ${items[1]}`;
        return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
    }

    const WHY_COUNT_WORDS = { 2: 'two', 3: 'three', 4: 'four', 5: 'five' };

    /** Describe a list of captured pieces: "the f-pawn", "two pawns", "the bishop and a pawn". */
    function describePieces(list) {
        if (list.length === 0) return 'nothing';
        const order = ['q', 'r', 'b', 'n', 'p'];
        const parts = [];
        order.forEach(type => {
            const ofType = list.filter(c => c.type === type);
            if (ofType.length === 0) return;
            if (ofType.length > 1) {
                parts.push(`${WHY_COUNT_WORDS[ofType.length] || ofType.length} ${WHY_PIECE_NAMES[type]}s`);
            } else if (type === 'p') {
                parts.push(list.length === 1 ? pieceLabel('p', ofType[0].square) : 'a pawn');
            } else {
                parts.push(pieceLabel(type));
            }
        });
        return joinWords(parts);
    }

    /** Remove like-for-like pairs (queen for queen, pawn for pawn) so only the real imbalance is described. */
    function cancelEqualTrades(gained, lost) {
        const g = gained.slice();
        const l = lost.slice();
        for (let i = g.length - 1; i >= 0; i--) {
            const j = l.findIndex(c => c.type === g[i].type);
            if (j >= 0) {
                g.splice(i, 1);
                l.splice(j, 1);
            }
        }
        return { gained: g, lost: l };
    }

    function isPassedPawn(board, square, color) {
        const file = square.charCodeAt(0);
        const rank = parseInt(square[1], 10);
        const dir = color === 'w' ? 1 : -1;
        for (let f = file - 1; f <= file + 1; f++) {
            if (f < 97 || f > 104) continue;
            for (let r = rank + dir; r >= 1 && r <= 8; r += dir) {
                const p = board.get(String.fromCharCode(f) + r);
                if (p && p.type === 'p' && p.color !== color) return false;
            }
        }
        return true;
    }

    function squareDistance(a, b) {
        return Math.max(Math.abs(a.charCodeAt(0) - b.charCodeAt(0)), Math.abs(parseInt(a[1], 10) - parseInt(b[1], 10)));
    }

    /**
     * Play a UCI principal variation and summarize what actually happens in it,
     * from the point of view of the side to move in `fen`.
     * @returns {object} { events, gained, lost, net, promotions, kingBlock, ledgerText, text }
     */
    function summarizeLine(fen, pvUci, options = {}) {
        const ChessCtor = getChessConstructor();
        const empty = { events: [], gained: [], lost: [], net: 0, promotions: [], kingBlock: null, ledgerText: '', text: '' };
        if (!ChessCtor || !fen || !Array.isArray(pvUci) || pvUci.length === 0) return empty;

        const maxPlies = options.maxPlies || 8;
        const board = new ChessCtor(fen);
        const mover = board.turn();
        const events = [];
        const gained = [];
        const lost = [];
        const promotions = [];
        let net = 0;
        let kingBlock = null;

        for (let i = 0; i < Math.min(maxPlies, pvUci.length); i++) {
            const uci = pvUci[i];
            if (!uci || typeof uci !== 'string' || uci.length < 4) break;
            const color = board.turn();
            const moveNum = parseInt(board.fen().split(' ')[5], 10) || 1;
            let m = null;
            try {
                m = board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined });
            } catch (e) { m = null; }
            if (!m) break;

            const label = color === 'w' ? `${moveNum}.${m.san}` : `${moveNum}...${m.san}`;
            const sign = color === mover ? 1 : -1;
            const ev = { ply: i, color, san: m.san, label, from: m.from, to: m.to, piece: m.piece };

            if (m.captured) {
                const capSquare = (m.flags && m.flags.includes('e')) ? (m.to[0] + m.from[1]) : m.to;
                ev.captured = m.captured;
                (color === mover ? gained : lost).push({ type: m.captured, square: capSquare, label });
                net += sign * WHY_PIECE_VALUES[m.captured];
            }
            if (m.promotion) {
                ev.promotion = m.promotion;
                promotions.push({ color, label, square: m.to });
                net += sign * (WHY_PIECE_VALUES[m.promotion] - 1);
            }
            if (m.san.includes('+') || m.san.includes('#')) ev.check = true;
            if (m.san.includes('#')) ev.mate = true;

            if (!kingBlock && m.piece === 'k' && color === mover && i <= 4) {
                const enemy = color === 'w' ? 'b' : 'w';
                const squares = board.SQUARES || [];
                for (const sq of squares) {
                    const p = board.get(sq);
                    if (!p || p.type !== 'p' || p.color !== enemy) continue;
                    const ahead = enemy === 'w' ? parseInt(m.to[1], 10) >= parseInt(sq[1], 10) : parseInt(m.to[1], 10) <= parseInt(sq[1], 10);
                    if (ahead && squareDistance(m.to, sq) <= 1 && isPassedPawn(board, sq, enemy)) {
                        kingBlock = { label, square: m.to, pawnSquare: sq };
                        break;
                    }
                }
            }
            events.push(ev);
            if (board.game_over && board.game_over()) break;
        }

        // Material ledger, from the mover's point of view.
        // A promoted piece that is captured again counts as the pawn it was.
        const promotedLost = [];
        const adjGained = gained.slice();
        const adjLost = lost.slice();
        promotions.forEach(pr => {
            const list = pr.color === mover ? adjLost : adjGained;
            const idx = list.findIndex(c => c.square === pr.square && WHY_PIECE_VALUES[c.type] > 1);
            if (idx >= 0) {
                list.splice(idx, 1, { type: 'p', square: pr.square, label: pr.label });
                promotedLost.push(pr);
            }
        });

        const cancelled = cancelEqualTrades(adjGained, adjLost);
        adjGained.length = 0; adjGained.push(...cancelled.gained);
        adjLost.length = 0; adjLost.push(...cancelled.lost);

        let ledgerText = '';
        const lostNonPawn = adjLost.some(c => c.type !== 'p');
        if (net <= -1 && lostNonPawn) {
            ledgerText = adjGained.length
                ? `gives up ${describePieces(adjLost)} for ${describePieces(adjGained)}`
                : `gives up ${describePieces(adjLost)}`;
        } else if (net <= -1) {
            ledgerText = `loses ${describePieces(adjLost)}`;
        } else if (net >= 1 && adjGained.length) {
            ledgerText = adjLost.length
                ? `wins ${describePieces(adjGained)} for ${describePieces(adjLost)}`
                : `wins ${describePieces(adjGained)}`;
        } else if (adjGained.length && adjLost.length) {
            ledgerText = `trades ${describePieces(adjGained)} for ${describePieces(adjLost)}`;
        }

        const parts = [];
        if (ledgerText) parts.push(ledgerText);
        const oppPromo = promotions.find(pr => pr.color !== mover && !promotedLost.includes(pr));
        const ownPromo = promotions.find(pr => pr.color === mover && !promotedLost.includes(pr));
        if (ownPromo) parts.push(`promotes a pawn (${ownPromo.label})`);
        if (oppPromo) parts.push(`${sideName(oppPromo.color)} promotes (${oppPromo.label})`);
        if (kingBlock) parts.push(`the king steps in front of the ${kingBlock.pawnSquare[0]}-pawn (${kingBlock.label})`);
        const mateEv = events.find(e => e.mate);
        if (mateEv) parts.unshift(mateEv.color === mover ? `ends in checkmate (${mateEv.label})` : `gets mated (${mateEv.label})`);

        return { events, gained: adjGained, lost: adjLost, net, promotions, kingBlock, ledgerText, text: parts.join('; ') };
    }

    function scoreCp(score) {
        const Evaluator = getEvaluator();
        return Evaluator ? Evaluator.scoreToCp(score || {}) : ((score && score.cp) || 0);
    }

    function winProb(cp) {
        const Evaluator = getEvaluator();
        return Evaluator ? Evaluator.cpToWinProb(cp) : 0.5;
    }

    function formatWhiteEval(score, moverColor) {
        const Evaluator = getEvaluator();
        const s = score || {};
        const white = moverColor === 'w' ? s : {
            cp: s.cp !== undefined && s.cp !== null ? -s.cp : undefined,
            mate: s.mate !== undefined && s.mate !== null ? -s.mate : undefined
        };
        return Evaluator ? Evaluator.formatScore(white, 'w') : '';
    }

    /**
     * How does the position stand before the move? (mover-POV score in, text out)
     */
    function describeSituation(bestScore, moverColor) {
        const s = bestScore || {};
        const mover = sideName(moverColor);
        const opp = sideName(moverColor === 'w' ? 'b' : 'w');
        const evalText = formatWhiteEval(s, moverColor);

        if (s.mate !== undefined && s.mate !== null) {
            if (s.mate > 0) return { band: 'winning', text: `${mover} has a forced mate (${evalText}).` };
            return { band: 'losing', text: `${opp} has a forced mate (${evalText}). ${mover} can only make it as hard as possible.` };
        }
        const wp = winProb(scoreCp(s));
        if (wp >= 0.90) return { band: 'winning', text: `${mover} is winning (${evalText}). The job is to convert without allowing counterplay.` };
        if (wp >= 0.70) return { band: 'better', text: `${mover} is clearly better (${evalText}).` };
        if (wp >= 0.57) return { band: 'slightly-better', text: `${mover} is slightly better (${evalText}).` };
        if (wp > 0.43) return { band: 'equal', text: `The position is roughly equal (${evalText}).` };
        if (wp > 0.30) return { band: 'slightly-worse', text: `${opp} is slightly better (${evalText}).` };
        if (wp > 0.10) return { band: 'worse', text: `${opp} is clearly better (${evalText}). ${mover} needs to find the most stubborn defence.` };
        return { band: 'losing', text: `${mover} is losing (${evalText}). The task is to make ${opp}'s win as hard as possible.` };
    }

    const WHY_BAND_RANK = { 'losing': 0, 'worse': 1, 'slightly-worse': 2, 'equal': 3, 'slightly-better': 4, 'better': 5, 'winning': 6 };

    function countPieces(list) {
        const order = ['q', 'r', 'b', 'n', 'p'];
        const parts = [];
        order.forEach(type => {
            const n = list.filter(t => t === type).length;
            if (n === 0) return;
            parts.push(n === 1 ? `a ${WHY_PIECE_NAMES[type]}` : `${WHY_COUNT_WORDS[n] || n} ${WHY_PIECE_NAMES[type]}s`);
        });
        return joinWords(parts);
    }

    /**
     * Who is ahead on material, in words: "Material is level", "White is up a knight",
     * "Black has a rook for a bishop and a pawn".
     */
    function materialBalance(fen) {
        if (!fen) return { diff: 0, text: '' };
        const white = [];
        const black = [];
        for (const ch of fen.split(' ')[0]) {
            const lower = ch.toLowerCase();
            if (!WHY_PIECE_VALUES[lower]) continue;
            (ch === lower ? black : white).push(lower);
        }
        const diff = white.reduce((s, t) => s + WHY_PIECE_VALUES[t], 0) - black.reduce((s, t) => s + WHY_PIECE_VALUES[t], 0);
        if (diff === 0) return { diff, text: 'Material is level' };
        const w = white.slice();
        const b = black.slice();
        for (let i = w.length - 1; i >= 0; i--) {
            const j = b.indexOf(w[i]);
            if (j >= 0) { w.splice(i, 1); b.splice(j, 1); }
        }
        const ahead = diff > 0 ? 'White' : 'Black';
        const plus = diff > 0 ? w : b;
        const minus = diff > 0 ? b : w;
        const text = minus.length
            ? `${ahead} has ${countPieces(plus)} for ${countPieces(minus)}`
            : `${ahead} is up ${countPieces(plus)}`;
        return { diff, text };
    }

    function bandRank(situation) {
        const r = WHY_BAND_RANK[situation && situation.band];
        return r === undefined ? 3 : r;
    }

    /** "slightly better", "clearly better", "winning" for the side that is ahead in this band. */
    function bandAdjective(band) {
        if (band === 'winning' || band === 'losing') return 'winning';
        if (band === 'better' || band === 'worse') return 'clearly better';
        if (band === 'slightly-better' || band === 'slightly-worse') return 'slightly better';
        return 'equal';
    }

    /** Short "who stands how" label for one side of the before/after strip. */
    function standingLabel(situation, moverColor) {
        const band = situation && situation.band;
        const rank = bandRank(situation);
        if (band === 'equal') return 'Roughly equal';
        const leader = sideName(rank > 3 ? moverColor : (moverColor === 'w' ? 'b' : 'w'));
        return `${leader} ${bandAdjective(band) === 'winning' ? 'is winning' : `is ${bandAdjective(band)}`}`;
    }

    /**
     * Bottom line up front: where the game stood before the move, where it stands
     * after it, and one sentence that ties the two together.
     * Scores are mover-POV, as everywhere else in diagnose().
     */
    function buildBluf(options) {
        const {
            fenBefore, san, moverColor, bestScore, playedScore,
            isBad, playedIsBest, bestSan, refSan, playedSummary, quality
        } = options;
        const mover = sideName(moverColor);
        const opp = sideName(moverColor === 'w' ? 'b' : 'w');
        const before = describeSituation(bestScore, moverColor);
        const after = describeSituation(playedScore, moverColor);
        const rb = bandRank(before);
        const ra = bandRank(after);
        const bestMates = bestScore && bestScore.mate !== undefined && bestScore.mate !== null && bestScore.mate > 0;
        const playedMates = playedScore && playedScore.mate !== undefined && playedScore.mate !== null && playedScore.mate > 0;
        const oppStanding = (band) => `${opp} is now ${bandAdjective(band)}`;

        let text;
        if (bestMates && !playedMates) {
            text = ra === 6
                ? `${san} misses a forced mate, but ${mover} is still winning.`
                : `${san} lets a forced mate slip: ${ra > 3 ? `${mover} is now only ${bandAdjective(after.band)}` : (ra === 3 ? 'the position is now roughly equal' : oppStanding(after.band))}.`;
        } else if (ra >= rb || !isBad) {
            if (bestMates) text = `${san} keeps the forced mate on track.`;
            else if (ra === 6) text = `${san} keeps ${mover} winning.`;
            else if (ra >= 4) text = `${san} keeps ${mover}'s edge.`;
            else if (ra === 3) text = `${san} keeps the balance.`;
            else if (ra >= 1) text = `${san} holds on: ${opp} keeps ${ra === 2 ? 'a small' : 'a clear'} edge, but nothing more.`;
            else text = `${san} is ${playedIsBest ? 'the most stubborn try' : 'a fighting try'}, but ${mover} is still losing.`;
        } else if (rb >= 4 && ra < 3) {
            text = `${san} throws away ${mover}'s advantage: ${oppStanding(after.band)}.`;
        } else if (rb >= 4 && ra === 3) {
            text = `${san} lets ${mover}'s advantage slip; the position is now level.`;
        } else if (rb >= 4) {
            text = `${san} gives back part of the advantage: ${mover} is now ${bandAdjective(after.band)} instead of ${bandAdjective(before.band)}.`;
        } else if (rb === 3) {
            text = `${san} hands the advantage to ${opp}, who is now ${bandAdjective(after.band)}.`;
        } else {
            text = `${san} makes a difficult position worse: ${oppStanding(after.band)}.`;
        }

        // The concrete outcome of a bad move, then the better choice
        if (isBad) {
            let consequence = '';
            if (playedSummary) {
                const mateEv = playedSummary.events.find(e => e.mate);
                const oppPromo = playedSummary.promotions.find(p => p.color !== moverColor);
                if (mateEv && mateEv.color !== moverColor) consequence = `${mover} gets mated (${mateEv.label})`;
                else if (playedSummary.net <= -1 && playedSummary.ledgerText) consequence = `${mover} ${playedSummary.ledgerText}`;
                else if (oppPromo) consequence = `${opp} promotes a pawn (${oppPromo.label})`;
            }
            const reply = playedSummary && playedSummary.events[1];
            const replyLabel = reply ? reply.label : refSan;
            if (consequence && replyLabel) text += ` After ${replyLabel}, ${consequence}.`;
            else if (consequence) text += ` In the main line, ${consequence}.`;
            if (bestSan && !playedIsBest) text += ` Better was ${bestSan}.`;
        }

        const material = materialBalance(fenBefore);
        return {
            before: {
                band: before.band,
                label: standingLabel(before, moverColor),
                evaluation: formatWhiteEval(bestScore, moverColor),
                material: material.text
            },
            after: {
                band: after.band,
                label: standingLabel(after, moverColor),
                evaluation: formatWhiteEval(playedScore, moverColor)
            },
            move: san,
            quality: quality || null,
            shift: ra > rb ? 'up' : (ra < rb ? 'down' : 'same'),
            text
        };
    }

    /**
     * Build a null-move FEN (the mover "passes"), or null when that is illegal.
     */
    function nullMoveFen(fenBefore) {
        const ChessCtor = getChessConstructor();
        if (!ChessCtor || !fenBefore) return null;
        const board = new ChessCtor(fenBefore);
        if (board.in_check()) return null;
        const tokens = fenBefore.split(' ');
        if (tokens.length < 4) return null;
        tokens[1] = tokens[1] === 'w' ? 'b' : 'w';
        tokens[3] = '-';
        const fen = tokens.join(' ');
        const probe = new ChessCtor(fen);
        if (probe.fen().split(' ')[0] !== tokens[0]) return null;
        if (probe.moves().length === 0) return null;
        return fen;
    }

    /**
     * What was the opponent threatening? Compares a null-move search (opponent
     * to move in the same position) with the real best evaluation.
     * @param {string} fenBefore
     * @param {object} nullEval - engine result on nullMoveFen(fenBefore): { lines: {1: {cp|mate, pv}} }
     * @param {object} bestScore - mover-POV score of the best move
     */
    function describeThreat(fenBefore, nullEval, bestScore) {
        const nullFen = nullMoveFen(fenBefore);
        const line = nullEval && nullEval.lines && nullEval.lines[1];
        if (!nullFen || !line || !Array.isArray(line.pv) || line.pv.length === 0) return null;

        const ChessCtor = getChessConstructor();
        const board = new ChessCtor(fenBefore);
        const mover = board.turn();
        const oppColor = mover === 'w' ? 'b' : 'w';

        const oppNullCp = scoreCp(line);
        const oppActualCp = -scoreCp(bestScore);
        const gainWp = winProb(oppNullCp) - winProb(oppActualCp);
        // WP flattens near the tails, so a big centipawn jump also counts as a real threat
        if (gainWp < WHY_THREAT_MIN_WP && (oppNullCp - oppActualCp) < WHY_THREAT_MIN_CP) return null;

        const summary = summarizeLine(nullFen, line.pv, { maxPlies: 6 });
        const oppMoves = summary.events.filter(e => e.color === oppColor);
        if (oppMoves.length === 0) return null;

        const first = oppMoves[0];
        const follow = oppMoves[1] && oppMoves[1].ply <= 2 ? oppMoves[1] : null;
        let text = `${sideName(oppColor)} was threatening ${first.san}`;
        if (follow) text += ` followed by ${follow.san}`;
        if (summary.net >= 2 && summary.ledgerText) text += ` (${summary.ledgerText.replace(/^wins /, 'winning ')})`;
        else if (summary.events.some(e => e.mate && e.color === oppColor)) text += ' with checkmate';

        const nullEvalWhite = formatWhiteEval(line, oppColor);
        const actualEvalWhite = formatWhiteEval(bestScore, mover);
        text += `. If ${sideName(mover)} ignored it, the evaluation would be ${nullEvalWhite} instead of ${actualEvalWhite}.`;

        return {
            san: first.san,
            from: first.from,
            to: first.to,
            fen: nullFen,
            pv: line.pv.slice(),
            evaluation: nullEvalWhite,
            gainCp: oppNullCp - oppActualCp,
            text
        };
    }

    /**
     * The other engine candidates, each with a verdict relative to the played
     * move and a one-line reason drawn from its own continuation.
     */
    function buildAlternatives(fenBefore, lines, playedUci, playedScore) {
        const ChessCtor = getChessConstructor();
        if (!ChessCtor || !fenBefore || !lines) return [];
        const board = new ChessCtor(fenBefore);
        const mover = board.turn();
        const opp = sideName(mover === 'w' ? 'b' : 'w');
        const playedWp = winProb(scoreCp(playedScore));
        const out = [];

        for (let m = 1; m <= 5 && out.length < 3; m++) {
            const line = lines[m];
            if (!line || !Array.isArray(line.pv) || line.pv.length === 0) continue;
            const uci = line.pv[0];
            if (uci === playedUci) continue;
            const san = uciToSan(board, uci);
            if (!san || san === uci) continue;

            const score = { cp: line.cp, mate: line.mate };
            const cp = scoreCp(score);
            const wp = winProb(cp);
            const deltaWp = playedWp - wp;
            let verdict;
            if (deltaWp <= -WHY_ABOUT_EQUAL_WP) verdict = 'better';
            else if (deltaWp < WHY_ABOUT_EQUAL_WP) verdict = 'about equal';
            else if (deltaWp < WHY_SLIGHTLY_WORSE_WP) verdict = 'slightly worse';
            else verdict = 'worse';

            const summary = summarizeLine(fenBefore, line.pv, { maxPlies: 10 });
            const playedMates = playedScore && playedScore.mate !== undefined && playedScore.mate !== null && playedScore.mate > 0;
            const altMates = score.mate !== undefined && score.mate !== null && score.mate > 0;
            if (playedMates && !altMates) {
                summary.text = `lets ${opp} escape the forced mate` + (summary.text ? ` (${summary.text})` : '');
            }
            const reply = summary.events[1];
            let reason = reply ? `${reply.label}` : '';
            const keyEv = summary.events.find(e => e.ply >= 2 && (e.promotion || e.mate || (e.captured && e.captured !== 'p')));
            if (keyEv && reason) reason += ` … ${keyEv.label}`;
            if (summary.text) {
                reason += (reason ? ' — ' : '') + summary.text;
            } else if (verdict === 'worse' || verdict === 'slightly worse') {
                reason += (reason ? ' — ' : '') + `gives ${opp} an easier game`;
            } else if (verdict === 'about equal') {
                reason += (reason ? ' — ' : '') + 'also holds a similar position';
            }

            out.push({
                san,
                uci,
                from: uci.slice(0, 2),
                to: uci.slice(2, 4),
                evaluation: formatWhiteEval(score, mover),
                cp,
                wp,
                deltaWp,
                verdict,
                reason,
                pv: line.pv.slice(),
                pvFormatted: formatPv(board, line.pv, 8),
                lostTypes: summary.lost.filter(c => c.type !== 'p').map(c => c.type)
            });
        }
        return out;
    }

    function buildVerdict(san, playedIsBest, alternatives, isBad) {
        if (!playedIsBest) {
            if (isBad) return null;
            const better = alternatives.filter(a => a.verdict === 'better');
            if (better.length === 0) {
                return { nearTie: true, text: `${san} is as good as the engine's top choices.` };
            }
            return {
                nearTie: false,
                text: `${san} is a decent move, but ${better[0].san} (${better[0].evaluation}) was more accurate.`
            };
        }
        const ties = alternatives.filter(a => a.verdict === 'about equal' || a.verdict === 'better');
        if (ties.length > 0) {
            const names = joinWords(ties.map(a => a.san));
            return {
                nearTie: true,
                text: `${san} is the engine's top choice, but ${names} ${ties.length > 1 ? 'are' : 'is'} about as good.`
            };
        }
        if (alternatives.length > 0 && alternatives.every(a => a.verdict === 'worse')) {
            return { nearTie: false, text: `${san} is clearly the best move. Every alternative is significantly worse.` };
        }
        return { nearTie: false, text: `${san} is the engine's top choice.` };
    }

    /**
     * Unified move diagnosis function.
     *
     * @param {object} params
     * @param {string} params.fenBefore
     * @param {string} [params.fenAfter]
     * @param {object|string} params.playedMove - move object or UCI string
     * @param {object} [params.engine] - MultiPV root search and post search
     * @param {object} [params.context] - game context: ply, sanHistory, phase, playerElo, mode
     * @returns {object} unified diagnosis with classification and narrative
     */
    function diagnose(params) {
        const ChessCtor = getChessConstructor();
        const Evaluator = getEvaluator();
        const Detector = getDetector();
        const Recognizer = getRecognizer();

        const {
            fenBefore,
            fenAfter: passedFenAfter,
            playedMove,
            engine = {},
            context = {}
        } = params;

        if (!fenBefore || !ChessCtor) {
            throw new Error('MoveDiagnostics.diagnose requires fenBefore and a valid Chess constructor');
        }

        const boardBefore = new ChessCtor(fenBefore);
        let moveObj = null;
        let playedUci = '';

        if (typeof playedMove === 'string') {
            const trimmed = playedMove.trim();
            if (/^[a-h][1-8][a-h][1-8][qrbnQRBN]?$/.test(trimmed)) {
                playedUci = trimmed.toLowerCase();
                const testBoard = new ChessCtor(fenBefore);
                moveObj = testBoard.move({
                    from: playedUci.slice(0, 2),
                    to: playedUci.slice(2, 4),
                    promotion: playedUci.length > 4 ? playedUci[4] : undefined
                });
            } else {
                const testBoard = new ChessCtor(fenBefore);
                moveObj = testBoard.move(trimmed, { sloppy: true });
                if (moveObj) {
                    playedUci = moveObj.from + moveObj.to + (moveObj.promotion || '');
                }
            }
        } else if (playedMove && typeof playedMove === 'object') {
            playedUci = (playedMove.from || '') + (playedMove.to || '') + (playedMove.promotion || '');
            if (playedMove.san && playedMove.piece) {
                moveObj = playedMove;
            } else {
                const testBoard = new ChessCtor(fenBefore);
                moveObj = testBoard.move({
                    from: playedMove.from,
                    to: playedMove.to,
                    promotion: playedMove.promotion
                });
            }
        }

        if (!moveObj && playedUci.length >= 4) {
            const testBoard = new ChessCtor(fenBefore);
            moveObj = testBoard.move({
                from: playedUci.slice(0, 2),
                to: playedUci.slice(2, 4),
                promotion: playedUci.length > 4 ? playedUci[4] : undefined
            });
        }

        const fenAfter = passedFenAfter || (() => {
            const tb = new ChessCtor(fenBefore);
            if (moveObj) tb.move(moveObj);
            return tb.fen();
        })();
        const boardAfter = new ChessCtor(fenAfter);

        // Normalize engine data
        const preEval = engine || {};
        const lines = preEval.lines || {};
        const bestLine = lines[1] || { cp: 0, pv: [] };
        const bestUci = preEval.bestUci || preEval.bestMove || (bestLine.pv && bestLine.pv[0]) || '';
        const bestScoreObj = { cp: bestLine.cp, mate: bestLine.mate };
        const bestSan = uciToSan(boardBefore, bestUci);
        const bestPvFormatted = formatPv(boardBefore, bestLine.pv);

        const playedIsBest = (playedUci === bestUci) || Boolean(context.verifiedBest && context.verifiedBest.uci === playedUci);

        let playedScoreObj = bestScoreObj;
        let refUci = null;
        let refSan = null;
        let refFrom = null;
        let refTo = null;
        let refPv = [];
        let refPvFormatted = '';

        const postEval = preEval.post || { bestMove: '', lines: preEval.postLines || {} };

        if (playedIsBest) {
            playedScoreObj = bestScoreObj;
            if (bestLine.pv && bestLine.pv.length > 1) {
                refUci = bestLine.pv[1];
                refPv = bestLine.pv.slice(1);
            }
        } else {
            let foundInMultipv = false;
            for (let m = 1; m <= 5; m++) {
                if (lines[m] && lines[m].pv && lines[m].pv[0] === playedUci) {
                    playedScoreObj = { cp: lines[m].cp, mate: lines[m].mate };
                    foundInMultipv = true;
                    break;
                }
            }

            const postBest = (postEval.lines && postEval.lines[1]) || {};
            refUci = postEval.bestMove || (postBest.pv && postBest.pv[0]) || '';

            if (!foundInMultipv) {
                if (postBest.mate !== undefined) {
                    playedScoreObj = { mate: -postBest.mate };
                } else {
                    playedScoreObj = { cp: -(postBest.cp || 0) };
                }
            }
            if (postBest.pv) {
                refPv = postBest.pv;
                refPvFormatted = formatPv(boardAfter, postBest.pv);
            }
            if (!refUci && foundInMultipv) {
                for (let m = 1; m <= 5; m++) {
                    if (lines[m] && lines[m].pv && lines[m].pv[0] === playedUci && lines[m].pv.length > 1) {
                        refUci = lines[m].pv[1];
                        refPv = lines[m].pv.slice(1);
                        refPvFormatted = formatPv(boardAfter, refPv);
                        break;
                    }
                }
            }
        }

        if (refUci && refUci.length >= 4) {
            refSan = uciToSan(boardAfter, refUci);
            refFrom = refUci.substring(0, 2);
            refTo = refUci.substring(2, 4);
        }

        const bestCp = Evaluator ? Evaluator.scoreToCp(bestScoreObj) : (bestScoreObj.cp || 0);
        const playedCp = Evaluator ? Evaluator.scoreToCp(playedScoreObj) : (playedScoreObj.cp || 0);
        const wpBefore = Evaluator ? Evaluator.cpToWinProb(bestCp) : 0.5;
        const wpAfter = Evaluator ? Evaluator.cpToWinProb(playedCp) : 0.5;

        const ply = context.ply || (parseInt(fenBefore.split(' ')[5], 10) * 2 - (boardBefore.turn() === 'w' ? 1 : 0)) || 1;
        const sanHistory = context.sanHistory || [];
        const phase = context.phase || (Evaluator && Evaluator.gamePhase ? Evaluator.gamePhase(fenBefore) : 'middlegame');

        const isBook = (Detector && Detector.isBookMove) ? Detector.isBookMove(sanHistory, ply, fenAfter) : false;

        let secondBestWp = null;
        if (playedIsBest && lines[1] && lines[1].pv && lines[1].pv[0] !== playedUci) {
            // The played move was verified as best later, but the shallow search preferred lines[1].
            // So lines[1] is the alternative.
            if (lines[1]) {
                const cp1 = Evaluator ? Evaluator.scoreToCp(lines[1]) : (lines[1].cp || 0);
                secondBestWp = Evaluator ? Evaluator.cpToWinProb(cp1) : null;
            }
        } else if (lines[2]) {
            const cp2 = Evaluator ? Evaluator.scoreToCp(lines[2]) : (lines[2].cp || 0);
            secondBestWp = Evaluator ? Evaluator.cpToWinProb(cp2) : null;
        }

        let isSacrifice = false;
        let offeredObj = false;
        if (playedIsBest && Evaluator) {
            let pvSacrifice = false;
            let playedLinePv = null;
            if (lines[1] && lines[1].pv && lines[1].pv[0] === playedUci) {
                playedLinePv = lines[1].pv;
            }
            if (playedLinePv && Evaluator.deriveIsSacrifice) {
                pvSacrifice = Evaluator.deriveIsSacrifice(fenBefore, playedUci, playedLinePv);
            }
            offeredObj = detectOfferedPiece(boardBefore, boardAfter, moveObj, Recognizer);
            isSacrifice = !!(pvSacrifice || offeredObj);
        }

        const isOnlyMove = (Evaluator && Evaluator.deriveIsOnlyMove)
            ? Evaluator.deriveIsOnlyMove(lines)
            : false;

        const mateMissed = (Evaluator && Evaluator.deriveMateMissed)
            ? Evaluator.deriveMateMissed(bestScoreObj, playedScoreObj)
            : false;

        const sharpness = (Evaluator && Evaluator.positionSharpness)
            ? Evaluator.positionSharpness(lines)
            : 0.5;

        const evalContext = {
            phase,
            sharpness,
            depth: context.depth || preEval.depthPre || 16,
            playerElo: context.playerElo
        };

        const classification = Evaluator
            ? Evaluator.classifyMove(wpBefore, wpAfter, {
                playedIsBest,
                isBook,
                isSacrifice,
                isOnlyMove,
                mateMissed,
                secondBestWp,
                context: context.adaptive ? evalContext : null
            })
            : { uiQuality: 'good move', detailedQuality: 'good', wpLoss: 0, confidence: 'medium' };

        // What actually happens after the played move (material ledger, promotions, king blockades)
        let playedPv = null;
        for (let m = 1; m <= 5; m++) {
            if (lines[m] && Array.isArray(lines[m].pv) && lines[m].pv[0] === playedUci) {
                playedPv = lines[m].pv;
                break;
            }
        }
        if (!playedPv && playedUci) playedPv = [playedUci].concat(refPv || []);
        const playedSummary = playedPv ? summarizeLine(fenBefore, playedPv, { maxPlies: 8 }) : null;

        let explanation = '';
        let tags = [];
        let flaw = null;
        let missedChance = null;
        let betterLine = null;
        const evidence = [];

        const isBad = (classification.uiQuality === 'blunder'
            || classification.uiQuality === 'mistake'
            || classification.uiQuality === 'inaccuracy');

        if (Recognizer) {
            if (isBad) {
                const opViolation = (Detector && Detector.detectOpeningPrincipleViolation)
                    ? Detector.detectOpeningPrincipleViolation(boardBefore, moveObj, ply, { bestUci })
                    : null;
                const refMoveObj = (refFrom && refTo) ? { from: refFrom, to: refTo } : null;

                const res = Recognizer.explainBlunderOrMistake({
                    boardBefore,
                    boardAfter,
                    playedMove: moveObj,
                    bestMove: bestUci ? {
                        from: bestUci.substring(0, 2),
                        to: bestUci.substring(2, 4),
                        promotion: bestUci.length > 4 ? bestUci[4] : undefined
                    } : null,
                    refutationMove: refMoveObj,
                    sanPlayed: (moveObj && moveObj.san) || playedUci,
                    sanBest: bestSan,
                    sanRef: refSan,
                    bestScore: bestScoreObj,
                    playedScore: playedScoreObj,
                    bestPv: bestLine.pv || [],
                    refPv,
                    bestPvFormatted,
                    refPvFormatted,
                    quality: classification.uiQuality,
                    detailedQuality: classification.detailedQuality,
                    wpLoss: classification.wpLoss,
                    ply,
                    phase,
                    openingPrincipleViolation: opViolation,
                    isOnlyMove,
                    isSacrifice,
                    personaId: context.personaId,
                    playerElo: context.playerElo,
                    depthDial: context.depthDial
                });

                explanation = res.explanation;
                tags = res.tags || [];
                flaw = res.flaw;
                missedChance = res.missedChance;
                betterLine = res.betterLine;
                if (opViolation && !tags.includes('Opening Principle')) {
                    tags.push('Opening Principle');
                }
            } else {
                const refMoveObj = (refFrom && refTo) ? { from: refFrom, to: refTo } : null;
                const res = Recognizer.explainGoodMove({
                    boardBefore,
                    boardAfter,
                    move: moveObj,
                    san: (moveObj && moveObj.san) || playedUci,
                    isBest: playedIsBest,
                    detailedQuality: classification.detailedQuality,
                    isOnlyMove,
                    isSacrifice,
                    lineSummary: playedSummary,
                    bestScore: bestScoreObj,
                    engineLines: lines,
                    refutationMove: refMoveObj,
                    sanRef: refSan,
                    phase,
                    ply,
                    personaId: context.personaId,
                    playerElo: context.playerElo,
                    depthDial: context.depthDial
                });

                explanation = res.explanation;
                tags = res.tags || [];
                flaw = res.flaw;
                missedChance = res.missedChance;
                betterLine = res.betterLine;
            }
        }

        const moverColor = boardBefore.turn();
        const sanPlayedForWhy = (moveObj && moveObj.san) || playedUci;
        const alternatives = buildAlternatives(fenBefore, lines, playedUci, playedScoreObj);
        // "…gives up the bishop anyway": the alternative does not save what the played move gave
        const playedLostTypes = playedSummary ? playedSummary.lost.filter(c => c.type !== 'p').map(c => c.type) : [];
        alternatives.forEach(alt => {
            if (alt.lostTypes.length && alt.lostTypes.some(t => playedLostTypes.includes(t)) && /gives up/.test(alt.reason)) {
                alt.reason += ' anyway';
            }
        });
        const verdict = buildVerdict(sanPlayedForWhy, playedIsBest, alternatives, isBad);
        let ideaText = '';
        if (playedSummary && playedSummary.text) {
            ideaText = `${sanPlayedForWhy} ${playedSummary.text}.`;
        } else if (!isBad && betterLine) {
            ideaText = `${sanPlayedForWhy} ${betterLine}.`;
        }
        const why = {
            verdict: verdict ? verdict.text : null,
            nearTie: Boolean(verdict && verdict.nearTie),
            situation: describeSituation(bestScoreObj, moverColor),
            threat: null,
            idea: (ideaText || (playedPv && playedPv.length > 1)) ? {
                text: ideaText,
                pv: playedPv ? playedPv.slice() : [],
                pvFormatted: playedPv ? formatPv(boardBefore, playedPv, 8) : ''
            } : null,
            alternatives,
            bluf: buildBluf({
                fenBefore,
                san: sanPlayedForWhy,
                moverColor,
                bestScore: bestScoreObj,
                playedScore: playedScoreObj,
                isBad,
                playedIsBest,
                bestSan,
                refSan,
                playedSummary,
                quality: classification.uiQuality
            })
        };
        if (engine.threat) {
            why.threat = describeThreat(fenBefore, engine.threat, bestScoreObj);
        }

        evidence.push({
            kind: 'classification',
            claim: `${classification.detailedQuality} (${classification.uiQuality})`,
            confidence: classification.confidence || 'high',
            source: 'engine'
        });

        return {
            classification,
            narrative: {
                explanation,
                flaw,
                missedChance,
                betterLine,
                tags
            },
            evidence,
            explanation,
            tags,
            flaw,
            missedChance,
            betterLine,
            isBook,
            playedIsBest,
            wpBefore,
            wpAfter,
            wpLoss: classification.wpLoss,
            bestSan,
            refSan,
            bestScore: bestScoreObj,
            playedScore: playedScoreObj,
            sanPlayed: (moveObj && moveObj.san) || playedUci,
            bestUci,
            refUci,
            refPv,
            refPvFormatted,
            bestPvFormatted,
            phase,
            sharpness,
            why,
            sacrificedPiece: offeredObj ? offeredObj.piece : undefined,
            sacrificeSquare: offeredObj ? offeredObj.square : undefined
        };
    }

    /**
     * Compute an adaptive search budget based on game phase, position sharpness, mode, and wall-clock time.
     * @param {object} options
     * @param {string} [options.phase='middlegame'] - 'opening' | 'middlegame' | 'endgame'
     * @param {number} [options.sharpness=0.5] - 0.0 to 1.0
     * @param {string} [options.mode='analysis'] - 'analysis' | 'coach'
     * @param {number} [options.elapsedMs=0] - milliseconds spent on this turn
     * @param {number} [options.baseDepth=18] - base depth for analysis mode
     * @returns {object} { depthPre, depthPost, multipv }
     */
    function searchBudget(options = {}) {
        const {
            phase = 'middlegame',
            sharpness = 0.5,
            mode = 'analysis',
            elapsedMs = 0,
            baseDepth = (mode === 'coach' ? 12 : 18)
        } = options;

        if (mode === 'coach') {
            let depthPre = 12;
            let depthPost = 12;
            let multipv = 3;

            // Gracefully degrade search depth under wall-clock time pressure
            if (elapsedMs > 3500) {
                depthPre = 8;
                depthPost = 8;
            } else if (elapsedMs > 1800) {
                depthPre = 10;
                depthPost = 10;
            } else if (phase === 'endgame') {
                depthPre = 14;
                depthPost = 12;
            }

            return { depthPre, depthPost, multipv };
        }

        // Analysis mode
        let depthPre = baseDepth;
        let depthPost = Math.max(8, baseDepth - 2);
        let multipv = 3;

        if (phase === 'endgame') {
            // Endgames have fewer pieces; allow deeper tactical/conversion search
            depthPre = Math.min(22, baseDepth + 2);
            depthPost = Math.min(20, baseDepth);
        } else if (sharpness > 0.75) {
            // Razor-sharp tactical positions benefit from +1 ply
            depthPre = Math.min(22, baseDepth + 1);
            depthPost = Math.max(8, baseDepth - 1);
        }

        return { depthPre, depthPost, multipv };
    }

    function isBrilliantCandidate(fenBefore, lines) {
        const Evaluator = getEvaluator();
        const Recognizer = getRecognizer();
        const ChessCtor = getChessConstructor();
        if (!Evaluator || !Recognizer || !ChessCtor || !lines) return false;

        let bestLine = null;
        let secondBestLine = null;
        if (lines[1]) bestLine = lines[1];
        if (lines[2]) secondBestLine = lines[2];
        if (!bestLine || !bestLine.pv || bestLine.pv.length === 0) return false;

        const bestUci = bestLine.pv[0];
        const bestCp = Evaluator.scoreToCp(bestLine);
        const wpAfter = Evaluator.cpToWinProb(bestCp);

        let secondBestWp = null;
        if (secondBestLine) {
            const cp2 = Evaluator.scoreToCp(secondBestLine);
            secondBestWp = Evaluator.cpToWinProb(cp2);
        }

        const BRILLIANT = Evaluator.BRILLIANT_THRESHOLDS || { maxSecondBestWp: 0.90, minWpGap: 0.05 };

        if (wpAfter < 0.60) return false;
        if (secondBestWp === null) return false;
        if (secondBestWp >= BRILLIANT.maxSecondBestWp) return false;
        if ((wpAfter - secondBestWp) < BRILLIANT.minWpGap) return false;

        let isSacrifice = false;
        if (Evaluator.deriveIsSacrifice && Evaluator.deriveIsSacrifice(fenBefore, bestUci, bestLine.pv)) {
            isSacrifice = true;
        } else {
            const boardBefore = new ChessCtor(fenBefore);
            const boardAfter = new ChessCtor(fenBefore);
            const moveObj = boardAfter.move({
                from: bestUci.slice(0, 2),
                to: bestUci.slice(2, 4),
                promotion: bestUci.length > 4 ? bestUci[4] : undefined
            });
            if (moveObj) {
                const offeredObj = detectOfferedPiece(boardBefore, boardAfter, moveObj, Recognizer);
                if (offeredObj) isSacrifice = true;
            }
        }

        return isSacrifice ? { bestUci, wpAfter, secondBestWp } : false;
    }

    return {
        diagnose,
        uciToSan,
        formatPv,
        searchBudget,
        isBrilliantCandidate,
        summarizeLine,
        buildAlternatives,
        describeSituation,
        buildBluf,
        materialBalance,
        describeThreat,
        nullMoveFen,
        _detectOfferedPiece: detectOfferedPiece
    };
}));
MoveDiagnostics=self.MoveDiagnostics;
return {Chess:Chess,ChessEvaluator:ChessEvaluator,OpeningDetector:OpeningDetector,SituationRecognizer:SituationRecognizer,MoveDiagnostics:MoveDiagnostics};})();
if(typeof module==='object'&&module.exports)module.exports=WhyBlunder;
