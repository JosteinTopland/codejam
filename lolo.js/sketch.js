// lolo.js
// jostein.topland@gmail.com

const width = 320;
const height = 200;
const fps = 30;

const gridSize = 10;
const level = {
  width: 11,
  height: 11,
  map: [
    0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x00, 0x10, 0x10, 0x11, 0x11,
    0x10, 0x11, 0x11, 0x10, 0x00, 0x00, 0x00, 0x10, 0x10, 0x11, 0x11,
    0x00, 0x11, 0x11, 0x10, 0x10, 0x10, 0x00, 0x10, 0x10, 0x10, 0x11,
    0x00, 0x00, 0x11, 0x11, 0x10, 0x10, 0x00, 0x10, 0x10, 0x10, 0x11,
    0x01, 0x00, 0x00, 0x00, 0x10, 0x10, 0x00, 0x10, 0x10, 0x11, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00,
    0x00, 0x11, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x11, 0x11, 0x11, 0x11, 0x00, 0x00, 0x00, 0x11, 0x11, 0x00, 0x00,
    0x11, 0x11, 0x11, 0x11, 0x00, 0x00, 0x00, 0x11, 0x11, 0x11, 0x00,
    0x10, 0x11, 0x11, 0x10, 0x00, 0x00, 0x00, 0x00, 0x11, 0x11, 0x00,
    0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00
  ]
};
const player = { x: 0, y: 0, direction: 'Stop' };

function setup() {
  createCanvas(width, height);
  frameRate(fps);
  setLevel();
  // noStroke();
}

function setLevel() {
  const playerIdx = level.map.indexOf(0x01);
  player.x = playerIdx % level.width * gridSize;
  player.y = Math.floor(playerIdx / level.width) * gridSize;
}

function hitTest(x, y) {
  const px1 = Math.floor(x / gridSize);
  const py1 = Math.floor(y / gridSize) * level.width;
  const px2 = Math.floor((x + gridSize - 1) / gridSize);
  const py2 = Math.floor((y + gridSize - 1) / gridSize) * level.width;
  const ignore = [0, 9];
  const idx1 = level.map[px1 + py1] >= 0x10;
  const idx2 = level.map[px2 + py1] >= 0x10;
  const idx3 = level.map[px2 + py2] >= 0x10;
  const idx4 = level.map[px1 + py2] >= 0x10;
  return x < 0 || x > (level.width - 1) * gridSize ||
         y < 0 || y > (level.height - 1) * gridSize ||
         idx1 || idx2 || idx3 || idx4;
}

function inputKeys() {
  // if (player.direction !== 'Stop') return;
  if (keyIsDown(LEFT_ARROW)) player.direction = 'Left';
  if (keyIsDown(RIGHT_ARROW)) player.direction = 'Right';
  if (keyIsDown(UP_ARROW)) player.direction = 'Up';
  if (keyIsDown(DOWN_ARROW)) player.direction = 'Down';
}

function updateGame() {
  let x = 0;
  let y = 0;
  if (player.direction === 'Left') x--;
  if (player.direction === 'Right') x++;
  if (player.direction === 'Up') y--;
  if (player.direction === 'Down') y++;
  if (hitTest(player.x + x, player.y + y)) {
    player.direction = 'Stop';
  } else {
    player.x += x;
    player.y += y;
    if (['Left', 'Right'].includes(player.direction) && player.x % (gridSize / 2) === 0 ||
        ['Up', 'Down'].includes(player.direction) && player.y % (gridSize / 2) === 0) {
          // player.direction = 'Stop';
    }
  }
}

function draw() {
  inputKeys();
  updateGame();
  background(50, 50, 100);
  drawLevel();
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;
  fill('red');
  rect(x, y, gridSize, gridSize);
  
  // debug
  if (player.direction === 'Stop') return;
  fill('white');
  push();
  translate(x + gridSize / 2, y + gridSize / 2);
  const r =
    player.direction === 'Left' ? 0.5 :
    player.direction === 'Right' ? 1.5 :
    player.direction === 'Up' ? 1.0 : 0.0;
  rotate(PI * r);
  triangle(-2, -2, 2, -2, 0, 2);
  pop();
}

function drawLevel() {
  translate(20, 20);
  fill('blue');
  rect(0, 0, level.width * gridSize, level.height * gridSize);
  for (let i = 0; i < level.width * level.height; i++) {
    const o = level.map[i];
    if (o < 0x10) continue;
    const x = i % level.width * gridSize;
    const y = Math.floor(i / level.width) * gridSize;
    if (o === 0x10) fill('yellow');
    if (o === 0x11) fill('green');
    rect(x, y, gridSize, gridSize);
  }
  drawPlayer();
}
