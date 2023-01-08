// Prime Music & Colors
// jostein.topland@gmail.com

const w = 320;
const h = 200;
let audioWave, audioOut;
let x, y;
let prime = 2;

const fps = 3;
const boxSize = 8;
const inc = 10;
const pitch = {
	A: 220.00,
	B: 246.94,
	C: 261.63,
	D: 293.66,
	E: 329.63,
	F: 349.23,
	G: 392.00,
	A2: 440,
	A9: 2732,
	B9: 3625,
	C9: 3290,
	D9: 2343
};

function setup() {
  createCanvas(w, h);
  x = w / 2;
  y = h / 2;

  audioWave = new p5.Oscillator();
  audioWave.setType('triangle');
  audioWave.start();

  const sfx = new p5.Delay();
  sfx.process(audioWave);
  sfx.delayTime(0.2);
  sfx.feedback(0.2);

  audioOut = new p5.Env();
  audioOut.setADSR(0.01, 0.01, 0.2, 0.2);

  colorMode(HSB);
  background(240, 50, 255);
  frameRate(fps);
}

function draw() {
  colorMode(RGB);
  var c = max(0, hue(get(x, y)) - inc);
  colorMode(HSB);
  stroke(c, 255, 255);
  fill(c, 255, 255);
  rect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);
  switch (prime % 5) {
    case 1:
      x -= boxSize;
      audioWave.freq(pitch[h > 150 ? 'A' : h > 10 ? 'B' : 'A9']);
      break;
    case 2:
      x += boxSize;
      audioWave.freq(pitch[h > 150 ? 'C' : h > 10 ? 'D' : 'B9']);
      break;
    case 3:
      y -= boxSize;
      audioWave.freq(pitch[h > 150 ? 'E' : h > 10 ? 'F' : 'C9']);
      break;
    case 4:
      y += boxSize;
      audioWave.freq(pitch[h > 150 ? 'G' : h > 10 ? 'A2' : 'D9']);
      break;
  }
  audioOut.play(audioWave);

  prime = nextPrime(prime);
}

function nextPrime(number) {
  number++;
  do {
    var start = 2;
    var found = true;
    while (start <= sqrt(number)) {
      if (number % start++ < 1) {
        number++;
        found = false;
        break;
      }
    }
    if (found) return number;
  } while (true);
}
