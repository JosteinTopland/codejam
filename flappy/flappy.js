/*
  Flappy JS
  jostein.topland@gmail.com
*/

let x, y, v;
let px = [];
let py = [];
let score;
let highScore = 0;
let pipes = 4;
let synth;

function setup() {
  getAudioContext().suspend();
  createCanvas(320, 200);
  synth = new p5.MonoSynth();
  noStroke();
  frameRate(20);
  restart();
}

function restart() {
  x = 100;
  y = 150;
  v = -10;
  score = 0;
  for (let i = 0; i < pipes; i++) {
    px[i] = i * (width + 20) / pipes + 400;
    py[i] = 100 * Math.random() + 10;
  }
}

function keyPressed() {
  jump();
}

function mousePressed() {
  userStartAudio();
  jump();
}

function jump() {
  v = -5;
  mySynth.play('A6');
}

function draw() {
  background('darkblue');
  ball();
  pipe();
  info();
}

function info() {
  fill('white');
  textSize(12);
  textFont('Helvetica');
  text(score + ' / ' + highScore, 10, 15);
  if (score > highScore) highScore = score;
  score++;
}

function hitTest(i) {
  return x > px[i] - 20 && x < px[i] + 20 &&
        (y < py[i] || y > py[i] + 30);
}

function pipe() {
  colorMode(HSB);
  for (let i = 0; i < pipes; i++) {
    let x = px[i];
    let y = py[i];
    fill(x + i, 100, 100);
    rect(x, 0, 20, y);
    rect(x, y + 50, 20, height - y);
    px[i] -= 3;
    if (hitTest(i)) restart();
    if (px[i] < -20) {
      px[i] = width;
      py[i] = 100 * Math.random() + 10;
    }
  }
}

function ball() {
  colorMode(HSB);
  fill(360 * Math.random(), 100, 100);
  rect(x, y, 20, 20);
  y += v;
  v += 0.6;
  if (y < - 30 || y - 60 > height) restart();
}
