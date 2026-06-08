let noise = new SimplexNoise();

/*  SYRA hero — DNA-wave variant
    - Pure black backdrop (heavy black overlay each frame kills colored haze)
    - Cyan + teal-green palette (no pink/blue swap)
    - Slow, premium cadence — time scaled ~3.5x slower than the original    */
function draw(e) {
  let xCount = 40;
  let yCount = 60;
  let iXCount = 1 / (xCount - 1);
  let iYCount = 1 / (yCount - 1);
  let time = e * 0.00015;       // very slow, premium cadence
  let timeStep = 0.0045;         // slow cascade between rows
  let grad = ctx.createLinearGradient(-width, 0, width, height);
  let t = time % 1;
  let tSide = floor(time % 2) === 0;
  // Cyan <-> teal-green, muted so it never reads as neon
  let hueA = tSide ? 175 : 150;
  let hueB = !tSide ? 175 : 150;
  let colorA = hsl(hueA, 55, 35);
  let colorB = hsl(hueB, 50, 30);
  grad.addColorStop(map(t, 0, 1, THIRD, ZERO), colorA);
  grad.addColorStop(map(t, 0, 1, TWO_THIRDS, THIRD), colorB);
  grad.addColorStop(map(t, 0, 1, ONE, TWO_THIRDS), colorA);
  // Heavy opaque-black overlay each frame — wipes color haze, keeps pure-black background
  ctx.globalAlpha = 0.55;
  background(hsl(0, 0, 0));
  ctx.globalAlpha = 1;
  beginPath();
  for (let j = 0; j < yCount; j++) {
    let tj = j * iYCount;
    let c = cos(tj * TAU + time) * 0.1;
    for (let i = 0; i < xCount; i++) {
      let t = i * iXCount;
      let n = noise.noise3D(t, time, c);
      let y = n * height_half;
      let x = t * (width + 20) - width_half - 10;
      (i ? lineTo : moveTo)(x, y);
    }
    time += timeStep;
  }
  compositeOperation(compOper.lighter);
  ctx.filter = 'blur(8px)';
  stroke(grad, 2.8);
  ctx.filter = 'none';
  stroke(hsl(170, 30, 72, 0.20), 0.8);
}