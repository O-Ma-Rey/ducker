// SELECT ELEMENTS FROM HTML
const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameTxt = document.querySelector('.end-game-text');
const playAgainBtn = document.querySelector('.play-again');

const gridMatrix = [
  ['', '', '', '', '' ,'', '', '', ''],
  ['river', 'wood', 'wood', 'river', 'wood', 'river','river', 'river', 'river'],
  ['river', 'river', 'river', 'wood', 'wood', 'river', 'wood', 'wood', 'river'],
  ['', '', '', '', '', '', '', '', ''],
  ['road', 'bus', 'road', 'road', 'road', 'car', 'road', 'road', 'road'],
  ['road', 'road', 'road', 'car', 'road', 'road', 'road', 'road', 'bus'],
  ['road', 'road', 'car', 'road', 'road', 'road', 'bus', 'road', 'road'],
  ['', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '', '']
];

// Initialise variables that control game settings.
const victoryRow = 0;
const riverRows = [1,2];
const roadRows = [4,5,6];
const duckPosition = {x: 4, y: 8};

let contentBeforeDuck = '';
let time = 15;

// FUNCTIONS
function drawGrid() {
  grid.innerHTML = '';

  // for each row, need to know what needs to be displayed
  gridMatrix.forEach(function(gridRow, gridRowIndex) {
    gridRow.forEach(function(cellContent, cellContentIndex) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      
      if (riverRows.includes(gridRowIndex)) {
        cell.classList.add('river');
      }

      if (roadRows.includes(gridRowIndex)) {
        cell.classList.add('road');
      }

      if (cellContent) {
        cell.classList.add(cellContent);
      }

      grid.appendChild(cell);
    });
  });
}

function placeDuck() {
  contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
  gridMatrix[duckPosition.y][duckPosition.x] = 'duck';

}

function moveDuck(e) {
  const key = e.key;
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

  switch(key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (duckPosition.y > 0) duckPosition.y--;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (duckPosition.y < 8) duckPosition.y++;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (duckPosition.x > 0) duckPosition.x--;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (duckPosition.x < 8) duckPosition.x++;
      break;
  }

  render();
}

// ANIMATION
function moveRight(gridRowIndex) {
  const currentRow = gridMatrix[gridRowIndex];
  
  const last = currentRow.pop()
  currentRow.unshift(last);
}

function moveLeft(gridRowIndex) {
  const currentRow = gridMatrix[gridRowIndex];
  
  const first = currentRow.shift();
  currentRow.push(first);
}

function animateGame() {
  // animate river
  moveRight(1);
  moveLeft(2);

  // animate road
  moveRight(4);
  moveRight(5);
  moveRight(6);
}

function updateDuckPosition() {
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

  if (contentBeforeDuck === 'wood') {
    if (duckPosition.y === 1 && duckPosition.x < 8) duckPosition.x++;
    else if (duckPosition.y === 2 && duckPosition.x > 0) duckPosition.x--;
  }
}

function checkPosition() {
  if (duckPosition.y === victoryRow) endGame('duck-arrived');
  else if (contentBeforeDuck === 'river') endGame('duck-drowned');
  else if (contentBeforeDuck === 'car' || contentBeforeDuck === 'bus') endGame('duck-hit');

}

function endGame(reason) {
  if (reason === 'duck-arrived') {
    endGameTxt.innerHTML = 'YOU<br>WON';
    endGameScreen.classList.add('win');
  }

  gridMatrix[duckPosition.y][duckPosition.x] = reason;

  // stop countdown timer
  clearInterval(countdownLoop);
  // stop game
  clearInterval(renderLoop);
  // stop the player
  document.removeEventListener('keyup', moveDuck);
  // display game over
  endGameScreen.classList.remove('hidden');
}

function countdown() {
  if (time !== 0) {
    time--;
    timer.innerText = time.toString().padStart(5,0);
  }

  if (time === 0) {
    // end the game
    endGame();
  }
}

// RENDERING
function render() {
  placeDuck();
  checkPosition();
  drawGrid();
}

const renderLoop = setInterval(() => {
  updateDuckPosition();
  animateGame();
  render();
}, 600);

const countdownLoop = setInterval(countdown, 1000);

// EVENT LISTENERS
document.addEventListener('keyup', moveDuck);
playAgainBtn.addEventListener('click', () => {
  location.reload();
});
