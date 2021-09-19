"use strict";
var gameStart = null,
  gameSpeed = null,
  gameArea = null,
  ctx = null,
  gameAreaWidth = 0,
  gameAreaHeight = 0,
  cellWidth = 0,
  playerScore = 0,
  snake = null,
  snakeFood = null,
  snakeDirection = null,
  speedSize = 0,
  timer = null;

function init() {
  gameStart = document.querySelector("#gameStart");
  gameSpeed = document.querySelector("#gameSpeed");
  gameArea = document.querySelector("#gameArea");
  ctx = gameArea.getContext("2d");
  gameAreaWidth = 400;
  gameAreaHeight = 600;
  cellWidth = 20;
  gameArea.width = gameAreaWidth;
  gameArea.height = gameAreaHeight;

  gameStart.onclick = function () {
    this.disabled = true;
    startGame();
  }
}

function startGame() {
  playerScore = 0;
  snakeDirection = "right";
  speedSize = parseInt(gameSpeed.value);

  if (speedSize > 9) {
    speedSize = 9;
  } else if (speedSize < 0) {
    speedSize = 1;
  }

  snake = [];
  snake.push({ x: 0, y: cellWidth });

  createFood();

  clearInterval(timer);
  timer = setInterval(createGameArea, 500 / speedSize);
}

function createFood() {
  snakeFood = {
    x: Math.round(Math.random() * (gameAreaWidth - cellWidth*2) / cellWidth),
    y: Math.round(Math.random() * (gameAreaHeight - cellWidth*2) / cellWidth),
  };
}

function createGameArea() {
  var snakeX = snake[0].x;
  var snakeY = snake[0].y;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, gameAreaWidth, gameAreaHeight);
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(0, 0, gameAreaWidth, gameAreaHeight);

  if (snakeDirection == "right") {
    snakeX++;
  } else if (snakeDirection == "left") {
    snakeX--;
  } else if (snakeDirection == "down") {
    snakeY++;
  } else if (snakeDirection == "up") {
    snakeY--;
  }

  if ((snakeX == -1) || (snakeX == gameAreaWidth / cellWidth) || (snakeY == -1) || (snakeY == gameAreaHeight / cellWidth) || Control(snakeX, snakeY, snake)) {
    writeScore();
    clearInterval(timer);
    gameStart.disabled = false;
    return;
  }

  if (snakeX == snakeFood.x && snakeY == snakeFood.y) {
    var newHead = { x: snakeX, y: snakeY };
    playerScore += speedSize;
    createFood();
  } else {
    var newHead = snake.pop();
    newHead.x = snakeX;
    newHead.y = snakeY;
  }

  snake.unshift(newHead);

  for (var i = 0; i < snake.length; i++) {
    createSquare(snake[i].x, snake[i].y);
  }

  createSquare(snakeFood.x, snakeFood.y);
}

function Control(x, y, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].x == x && array[i].y == y) return true;
  }
  return false;
}

function writeScore() {
  ctx.font = "50px sans-serif";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("Score: " + playerScore, (gameAreaWidth / 2) - 100, gameAreaHeight / 2);
}

function createSquare(x, y) {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
}

function changeDir(e) {
  var keys = e.which;
  if ((keys == "83" || keys == "40") && snakeDirection != "up") snakeDirection = "down";
  else if ((keys == "68" || keys == "39") && snakeDirection != "left") snakeDirection = "right";
  else if ((keys == "87" || keys == "38") && snakeDirection != "down") snakeDirection = "up";
  else if (keys == "65" || (keys == "37") && snakeDirection != "right") snakeDirection = "left";
}

window.onkeydown = changeDir;
window.onload = init;