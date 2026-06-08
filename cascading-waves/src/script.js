let noise = new SimplexNoise();

function draw(e) {
	let xCount = 40;
	let yCount = 60;
	let iXCount = 1 / (xCount - 1);
	let iYCount = 1 / (yCount - 1);
	let time = e * 0.001;
	let timeStep = 0.01;
	let grad = ctx.createLinearGradient(-width, 0, width, height);
	let t = time % 1;
	let tSide = floor(time % 2) === 0;
	let hueA = tSide ? 340 : 210;
	let hueB = !tSide ? 340 : 210;
	let colorA = hsl(hueA, 100, 50);
	let colorB = hsl(hueB, 100, 50);
	grad.addColorStop(map(t, 0, 1, THIRD, ZERO), colorA);
	grad.addColorStop(map(t, 0, 1, TWO_THIRDS, THIRD), colorB);
	grad.addColorStop(map(t, 0, 1, ONE, TWO_THIRDS), colorA);
	ctx.globalAlpha = map(cos(time), -1, 1, 0.15, 0.3);
	background(grad);
	ctx.globalAlpha = 1;
	beginPath();
	for(let j = 0; j < yCount; j++) {
		let tj = j * iYCount;
		let c = cos(tj * TAU + time) * 0.1;
		for(let i = 0; i < xCount; i++) {
			let t = i * iXCount;
			let n = noise.noise3D(t, time, c);
			let y = n * height_half;
			let x = t * (width + 20) - width_half - 10;
			(i ? lineTo : moveTo)(x, y);
		}
		time += timeStep;
	}
	compositeOperation(compOper.lighter);
	ctx.filter = 'blur(10px)';
	stroke(grad, 5);
	ctx.filter = 'none';
	stroke(hsl(0, 0, 100, 0.8), 2);
}