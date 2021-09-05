let p1;
let p2;
let outcome;
let freeBlockCount;
const xoMatrix = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const getUIElements = () => {
  return {
    menu: document.getElementById("menu"),
    go: document.getElementById("go"),
    game: document.getElementById("game"),
    tictactoe: document.getElementById("ttt"),
    result: document.getElementById("result"),
    newGameBtn: document.getElementById("newgame"),
    resetBtn: document.getElementById("reset"),
    scoreLabel: document.getElementsByClassName("scorelabel"),
    score: document.getElementsByClassName("score"),
  };
};

const loadMenu = () => {
  const { go, game } = getUIElements();
  go.addEventListener("click", startGame);
  game.setAttribute("display", "none");
};

const createGameLogic = () => {
  p1 = {
    name: document.getElementById("p1name").value,
    score: 0,
  };
  p2 = {
    name: document.getElementById("p2name").value,
    score: 0,
  };
  outcome = "continue";
  freeBlockCount = 9;
};

const createGameUI = () => {
  const grid = document.createElement("div");
  grid.setAttribute("class", "grid");
  grid.setAttribute("id", "grid");
  grid.setAttribute("order", "0");
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.setAttribute("class", "row");
    row.setAttribute("id", "row" + i);
    for (let j = 0; j < 3; j++) {
      const block = document.createElement("div");
      block.setAttribute("class", "block");
      block.setAttribute("id", "block" + i + j);
      block.addEventListener("click", () => onBlockClick(i, j));
      row.appendChild(block);
    }
    grid.appendChild(row);
  }
  const { tictactoe, newGameBtn, resetBtn, scoreLabel, score } = getUIElements();
  tictactoe.appendChild(grid);
  newGameBtn.addEventListener("click", newGame);
  resetBtn.addEventListener("click", resetScores);
  scoreLabel[0].innerHTML = p1.name;
  scoreLabel[1].innerHTML = p2.name;
  score[0].innerHTML = p1.score;
  score[1].innerHTML = p2.score;
};

const startGame = () => {
  const { menu, game } = getUIElements();
  menu.setAttribute("class", "hide");
  game.setAttribute("style", "display:inline-flex;");
  createGameLogic();
  createGameUI();
};

window.onload = loadMenu;
// ---------------------------------------------------------

getCurrentTurn = () => {
  if (freeBlockCount % 2 === 0) return "O";
  return "X";
};

updateDS = (i, j, currentTurn) => {
  xoMatrix[i][j] = currentTurn;
  freeBlockCount -= 1;
};

updateUI = (block, currentTurn) => {
  block.innerHTML = currentTurn;
  if (currentTurn == "X") block.setAttribute("class", "block x-box");
  else block.setAttribute("class", "block o-box");
};

updateTurn = (i, j, block, currentTurn) => {
  updateDS(i, j, currentTurn);
  updateUI(block, currentTurn);
};

getBlock = (i, j) => {
  return document.getElementById("block" + i + j);
};

checkResult = () => {
  let winner;
  diag1 = xoMatrix[0][0] == xoMatrix[1][1] && xoMatrix[1][1] == xoMatrix[2][2] && xoMatrix[0][0] != 0;
  diag2 = xoMatrix[0][2] == xoMatrix[1][1] && xoMatrix[1][1] == xoMatrix[2][0] && xoMatrix[0][2] != 0;
  row = Array(3);
  col = Array(3);
  for (let i = 0; i < 3; i++) {
    row[i] = xoMatrix[i][0] == xoMatrix[i][1] && xoMatrix[i][1] == xoMatrix[i][2] && xoMatrix[i][0] != 0;
    col[i] = xoMatrix[0][i] == xoMatrix[1][i] && xoMatrix[1][i] == xoMatrix[2][i] && xoMatrix[0][i] != 0;
  }
  switch (true) {
    case diag1 || row[0] || col[0]:
      winner = xoMatrix[0][0];
      break;
    case diag2 || col[2]:
      winner = xoMatrix[0][2];
      break;
    case row[1] || col[1]:
      winner = xoMatrix[1][1];
      break;
    case row[2]:
      winner = xoMatrix[2][0];
      break;
    default:
      winner = false;
  }
  switch (true) {
    case winner === false && freeBlockCount === 0:
      return "DRAW...";
    case winner === "X":
      p1.score += 1;
      return p1.name + " won this round!";
    case winner === "O":
      p2.score += 1;
      return p2.name + " won this round!";
    default:
      return "continue";
  }
};

onBlockClick = (i, j) => {
  outcome = checkResult();
  if (outcome != "continue") return;
  const block = getBlock(i, j);
  if (outcome == "continue" && block.innerHTML == "" && xoMatrix[i][j] == 0) {
    const currentTurn = getCurrentTurn();
    updateTurn(i, j, block, currentTurn);
    outcome = checkResult();
    if (outcome != "continue") {
      const { result, score } = getUIElements();
      result.innerHTML = outcome;
      score[0].innerHTML = p1.score;
      score[1].innerHTML = p2.score;
    }
  }
};

resetDS = () => {
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      xoMatrix[i][j] = 0;
    }
  freeBlockCount = 9;
  outcome = "continue";
};

resetUI = () => {
  const blocks = document.getElementsByClassName("block");
  for (let i = 0; i < 9; i++) blocks.item(i).innerHTML = "";
  const { result } = getUIElements();
  result.innerHTML = "";
};

newGame = () => {
  resetDS();
  resetUI();
};

resetScores = () => {
  const { score } = getUIElements();
  p1.score = 0;
  p2.score = 0;
  score[0].innerHTML = 0;
  score[1].innerHTML = 0;
  newGame();
};
