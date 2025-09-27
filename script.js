class TicTacToe {
  constructor() {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.currentPlayer = "X";
    this.gameActive = true;
    this.gameMode = "pvp";
    this.difficulty = "medium";
    this.score = { x: 0, o: 0, draw: 0 };
    this.isComputerTurn = false;

    this.winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    this.initializeGame();
  }

  initializeGame() {
    this.bindEvents();
    this.updateDisplay();
    this.updateDifficultyVisibility();
  }

  bindEvents() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("click", (e) => this.handleCellClick(e));
    });

    document
      .getElementById("pvp-btn")
      .addEventListener("click", () => this.setGameMode("pvp"));
    document
      .getElementById("pvc-btn")
      .addEventListener("click", () => this.setGameMode("pvc"));

    document
      .getElementById("reset-btn")
      .addEventListener("click", () => this.resetCurrentGame());
    document
      .getElementById("new-game-btn")
      .addEventListener("click", () => this.newGame());

    document
      .getElementById("difficulty-select")
      .addEventListener("change", (e) => {
        this.difficulty = e.target.value;
      });
  }

  handleCellClick(e) {
    const index = parseInt(e.target.getAttribute("data-index"));

    if (!this.gameActive || this.board[index] !== "" || this.isComputerTurn) {
      return;
    }

    this.makeMove(index, this.currentPlayer);

    if (
      this.gameActive &&
      this.gameMode === "pvc" &&
      this.currentPlayer === "O"
    ) {
      this.isComputerTurn = true;
      setTimeout(() => this.makeComputerMove(), 500);
    }
  }

  makeMove(index, player) {
    this.board[index] = player;
    this.updateCellDisplay(index, player);

    if (this.checkWinner()) {
      this.endGame(`Player ${player} wins!`);
      this.score[player.toLowerCase()]++;
      this.updateScoreDisplay();
      return;
    }

    if (this.checkDraw()) {
      this.endGame("It's a draw!");
      this.score.draw++;
      this.updateScoreDisplay();
      return;
    }

    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.updateDisplay();
  }

  makeComputerMove() {
    let moveIndex;

    switch (this.difficulty) {
      case "easy":
        moveIndex = this.getRandomMove();
        break;
      case "medium":
        moveIndex = this.getMediumMove();
        break;
      case "hard":
        moveIndex = this.getBestMove();
        break;
    }

    if (moveIndex !== -1) {
      this.makeMove(moveIndex, "O");
    }

    this.isComputerTurn = false;
  }

  getRandomMove() {
    const availableMoves = this.board
      .map((cell, index) => (cell === "" ? index : null))
      .filter((index) => index !== null);

    return availableMoves.length > 0
      ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
      : -1;
  }

  getMediumMove() {
    if (Math.random() < 0.5) {
      return this.getBestMove();
    } else {
      return this.getRandomMove();
    }
  }

  getBestMove() {
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === "") {
        this.board[i] = "O";
        if (this.checkWinner()) {
          this.board[i] = "";
          return i;
        }
        this.board[i] = "";
      }
    }

    for (let i = 0; i < 9; i++) {
      if (this.board[i] === "") {
        this.board[i] = "X";
        if (this.checkWinner()) {
          this.board[i] = "";
          return i;
        }
        this.board[i] = "";
      }
    }

    if (this.board[4] === "") {
      return 4;
    }

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(
      (index) => this.board[index] === ""
    );
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    return this.getRandomMove();
  }

  checkWinner() {
    let winningCombination = null;

    for (const condition of this.winConditions) {
      const [a, b, c] = condition;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        winningCombination = condition;
        break;
      }
    }

    if (winningCombination) {
      this.highlightWinningCells(winningCombination);
      return true;
    }

    return false;
  }

  checkDraw() {
    return this.board.every((cell) => cell !== "");
  }

  highlightWinningCells(combination) {
    combination.forEach((index) => {
      document
        .querySelector(`[data-index="${index}"]`)
        .classList.add("winning-cell");
    });
  }

  endGame(message) {
    this.gameActive = false;
    document.getElementById("game-status").textContent = message;

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.disabled = true;
    });
  }

  updateCellDisplay(index, player) {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    cell.disabled = true;
  }

  updateDisplay() {
    document.getElementById("current-player").textContent = this.currentPlayer;

    if (this.gameActive) {
      if (this.gameMode === "pvc" && this.currentPlayer === "O") {
        document.getElementById("game-status").textContent =
          "Computer is thinking...";
      } else {
        document.getElementById("game-status").textContent =
          "Game in progress...";
      }
    }
  }

  updateScoreDisplay() {
    document.getElementById("score-x").textContent = this.score.x;
    document.getElementById("score-o").textContent = this.score.o;
    document.getElementById("score-draw").textContent = this.score.draw;
  }

  updateDifficultyVisibility() {
    const difficultySection = document.getElementById("difficulty-section");
    if (this.gameMode === "pvc") {
      difficultySection.style.display = "block";
    } else {
      difficultySection.style.display = "none";
    }
  }

  setGameMode(mode) {
    this.gameMode = mode;

    document
      .querySelectorAll(".mode-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .getElementById(mode === "pvp" ? "pvp-btn" : "pvc-btn")
      .classList.add("active");

    this.updateDifficultyVisibility();
    this.resetCurrentGame();
  }

  resetCurrentGame() {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.currentPlayer = "X";
    this.gameActive = true;
    this.isComputerTurn = false;

    document.querySelectorAll(".cell").forEach((cell) => {
      cell.textContent = "";
      cell.disabled = false;
      cell.classList.remove("x", "o", "winning-cell");
    });

    this.updateDisplay();
  }

  newGame() {
    this.resetCurrentGame();
    this.score = { x: 0, o: 0, draw: 0 };
    this.updateScoreDisplay();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
