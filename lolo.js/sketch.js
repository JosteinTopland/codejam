// Jump'n Run
// jostein.topland@gmail.com

const width = 320;
const height = 200;
const fps = 30;

const gridSize = 20;
const level = {
  width: 11,
  height: 8,
  playerStart: { x: 2, y: 2 },
  map: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ]
};
const player = { x: 0, y: 0, xVel: 0, yVel: 0 };

function setup() {
  createCanvas(width, height);
  frameRate(fps);
  player.x = level.playerStart.x * gridSize;
  player.y = level.playerStart.y * gridSize;
  noStroke();
}

function hitTest(x, y) {
  const px1 = Math.floor(x / gridSize);
  const py1 = Math.floor(y / gridSize) * level.width;
  const px2 = Math.floor((x + gridSize - 1) / gridSize);
  const py2 = Math.floor((y + gridSize - 1) / gridSize) * level.width;
  return level.map[px1 + py1] || level.map[px2 + py1] ||
         level.map[px2 + py2] || level.map[px1 + py2];
}

function inputKeys() {
  player.xVel = 0;
  if (keyIsDown(LEFT_ARROW)) player.xVel = -1;
  if (keyIsDown(RIGHT_ARROW)) player.xVel = 1;
  if (keyIsDown(UP_ARROW)) player.yVel = -4;

  if (hitTest(player.x + player.xVel, player.y + player.yVel)) {
    player.yVel = 0;
  } else {
    player.yVel += 1;
  }
  player.x += player.xVel;
  player.y += player.yVel;
}

function draw() {
  inputKeys();
  background(50, 50, 100);
  translate(20, 20);
  drawMap();
  drawPlayer();
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;
  fill('red');
  rect(x, y, gridSize, gridSize);
}

function drawMap() {
  for (let i = 0; i < level.width * level.height; i++) {
    if (level.map[i] === 0) continue;
    const x = i % level.width * gridSize;
    const y = Math.floor(i / level.width) * gridSize;
    fill('green');
    rect(x, y, gridSize, gridSize);
  }
}
