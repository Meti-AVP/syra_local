/*  Minimal local replacement for https://codepen.io/Alca/pen/XeZBab.js
    Provides the canvas, the requestAnimationFrame loop, and all of the
    math/colour/drawing globals that cascading-waves/dist/script.js calls.
    Vendored so the hero never depends on Cloudflare letting a CDN-blocked
    CodePen URL through. */
(function (global) {
  var opts = global.canvasOptions || {};

  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: true });

  var DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    global.width = w;
    global.height = h;
    global.width_half = w / 2;
    global.height_half = h / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  global.ctx = ctx;

  /* Math + constants the wave script reads from the global scope. */
  global.TAU = Math.PI * 2;
  global.PI = Math.PI;
  global.HALF_PI = Math.PI / 2;
  global.QUARTER_PI = Math.PI / 4;
  global.ZERO = 0;
  global.ONE = 1;
  global.TWO = 2;
  global.HALF = 0.5;
  global.THIRD = 1 / 3;
  global.TWO_THIRDS = 2 / 3;
  global.QUARTER = 0.25;
  global.cos = Math.cos;
  global.sin = Math.sin;
  global.tan = Math.tan;
  global.floor = Math.floor;
  global.ceil = Math.ceil;
  global.round = Math.round;
  global.abs = Math.abs;
  global.min = Math.min;
  global.max = Math.max;
  global.pow = Math.pow;
  global.sqrt = Math.sqrt;
  global.random = Math.random;

  global.map = function (v, a, b, c, d) {
    return c + (d - c) * ((v - a) / (b - a));
  };

  global.hsl = function (h, s, l, a) {
    if (a == null) return 'hsl(' + h + ',' + s + '%,' + l + '%)';
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  };
  global.rgb = function (r, g, b, a) {
    if (a == null) return 'rgb(' + r + ',' + g + ',' + b + ')';
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  };

  /* Path/draw primitives. The translate to canvas center (when
     canvasOptions.centered is true) is applied inside the rAF loop, so
     these can use raw coords with center as origin. */
  global.beginPath = function () { ctx.beginPath(); };
  global.closePath = function () { ctx.closePath(); };
  global.moveTo = function (x, y) { ctx.moveTo(x, y); };
  global.lineTo = function (x, y) { ctx.lineTo(x, y); };
  global.arc = function () { ctx.arc.apply(ctx, arguments); };
  global.rect = function (x, y, w, h) { ctx.rect(x, y, w, h); };

  global.stroke = function (color, weight) {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight != null ? weight : 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };
  global.fill = function (color) {
    ctx.fillStyle = color;
    ctx.fill();
  };

  /* Fill the entire canvas. Honours the centered transform when active. */
  global.background = function (color) {
    ctx.fillStyle = color;
    if (opts.centered) {
      ctx.fillRect(-global.width_half, -global.height_half, global.width, global.height);
    } else {
      ctx.fillRect(0, 0, global.width, global.height);
    }
  };

  global.compOper = {
    lighter:    'lighter',
    multiply:   'multiply',
    screen:     'screen',
    overlay:    'overlay',
    darken:     'darken',
    lighten:    'lighten',
    'normal':   'source-over',
    'source-over': 'source-over'
  };
  global.compositeOperation = function (op) {
    ctx.globalCompositeOperation = op;
  };

  /* requestAnimationFrame loop. Calls global.draw(elapsedMs) every frame.
     - autoClear:    clear canvas at the start of each frame
     - centered:     translate origin to canvas center
     - autoPushPop:  wrap the draw call in save()/restore()                */
  var t0 = performance.now();
  function loop() {
    if (typeof global.draw === 'function') {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';

      if (opts.autoClear) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      var push = opts.autoPushPop !== false;
      if (push) ctx.save();
      if (opts.centered) ctx.translate(global.width_half, global.height_half);

      try { global.draw(performance.now() - t0); }
      catch (err) { console.error('cascading-waves draw error', err); }

      if (push) ctx.restore();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})(window);
