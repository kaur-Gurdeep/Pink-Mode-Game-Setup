"use strict";

document.addEventListener("DOMContentLoaded", () => {
  class Player {
    constructor(name) {
      this.name = name;
      this.score = 0;
    }
    update(newName) {
      this.name = newName;
      document.getElementById(
        `player-${game.players.indexOf(this)}-name`
      ).textContent = this.name;
    }
    incrementScore() {
      this.score += 5;
      game.updatePlayerScore(game.players.indexOf(this));
    }
  }

  const game = {
    title: "Pink Mode Game",
    isRunning: false,
    players: [],
    activePlayerIndex: 0,
    scoreBoard: document.getElementById("scoreBoard"),
    gameBoard: document.getElementById("gameBoard"),
    playerNameInput: document.getElementById("playerNameInput"),
    joinButton: document.getElementById("joinButton"),
    startGameButton: document.getElementById("startGameButton"),
    switchPlayerButton: document.getElementById("switchPlayerButton"),
    scorePointsButton: document.getElementById("scorePointsButton"),
    restartButton: document.getElementById("restartButton"),
    heading: document.getElementById("heading"),
    toggleRunning() {
      this.isRunning = !this.isRunning;
      this.updateGameState();
    },

    updateGameState() {
      this.gameBoard.classList.toggle("game-running", this.isRunning);
      this.scorePointsButton.disabled = !this.isRunning;
      this.switchPlayerButton.disabled = !this.isRunning;
      this.restartButton.disabled = false;
      this.startGameButton.textContent = this.isRunning ? "Pause Game" : "Resume Game";
    
      // Remove active class from all players when the game pauses
      if (!this.isRunning) {
        this.players.forEach((_, index) => {
          document.getElementById(`player-${index}-name`).classList.remove("active");
          document.getElementById(`player-${index}-score`).classList.remove("active");
        });
      } else {
        // Update only the active player when game starts or resumes
        this.updateActivePlayer();
      }
    },

    addPlayer(player) {
      this.players.push(player);
      const playerScoreboard = document.createElement("div");
      playerScoreboard.classList.add("player-scoreboard");
      playerScoreboard.id = `player-${this.players.length - 1}-scoreboard`;
      playerScoreboard.innerHTML = `
        <div class="player-name" id="player-${this.players.length - 1}-name">${player.name}</div>
        <div class="player-score" id="player-${this.players.length - 1}-score">${player.score}</div>
      `;
      this.scoreBoard.appendChild(playerScoreboard);
      if (this.players.length === 1) {
        this.startGameButton.disabled = false;
      }
    },

    updateActivePlayer() {
      this.players.forEach((player, index) => {
        const playerNameElement = document.getElementById(`player-${index}-name`);
        const playerScoreElement = document.getElementById(`player-${index}-score`);
        const isActive = index === this.activePlayerIndex;
        
        playerNameElement.classList.toggle("active", isActive);
        playerScoreElement.classList.toggle("active", isActive);
      });
    },

    switchPlayer() {
      this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
      this.updateActivePlayer();
    },
    updatePlayerScore(playerIndex) {
      const playerScoreElement = document.getElementById(`player-${playerIndex}-score`);
      playerScoreElement.textContent = this.players[playerIndex].score;
    },
    resetGame(){
      location.reload();
    }
};

game.joinButton.addEventListener("click", () => {
  const playerName = game.playerNameInput.value.trim().toUpperCase();

  // Check if the player name is empty
  if (!playerName) {
    alert("Player name cannot be empty.");
    return;
  }

  // Check if the player name contains numbers
  if (/\d/.test(playerName)) {
    alert("Player name cannot contain numbers.");
    return;
  }

  // Check if the player name is unique
  if (game.players.some(player => player.name === playerName)) {
    alert("Player name must be unique.");
    return;
  }

  // If all checks pass, proceed to add the player
  game.heading.style.display = 'none';     
  const player = new Player(playerName);
  game.addPlayer(player);
  game.playerNameInput.value = '';
  game.playerNameInput.focus();
});

  // Start/Pause game
  game.startGameButton.addEventListener("click", () => {
    document.querySelectorAll(".input-container").forEach((inputGroup) => {
      inputGroup.style.display = "none";
    });
    game.toggleRunning();
    if (game.isRunning) {
      game.updateActivePlayer();
    }
  });

  // Switch player turn
  game.switchPlayerButton.addEventListener("click", () => {
    if (game.isRunning) {
      game.switchPlayer();
    }
  });

  // Score points for the active player
  game.scorePointsButton.addEventListener("click", () => {
    if (game.isRunning) {
      game.players[game.activePlayerIndex].incrementScore();
    }
  });

  //Restart Game
  game.restartButton.addEventListener("click", () => {
    game.resetGame();
  });
});
