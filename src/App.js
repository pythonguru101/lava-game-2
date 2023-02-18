import React, { useState, useEffect } from "react";
import "./App.css";

const GRID_SIZE = 100;

const HEALTH_MAP = {
  Blank: 0,
  Speeder: -5,
  Lava: -50,
  Mud: -10,
};

const MOVES_MAP = {
  Blank: -1,
  Speeder: 0,
  Lava: -10,
  Mud: -5,
};

const GameBoard = () => {
  const [grid, setGrid] = useState(generateRandomGrid());
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [health, setHealth] = useState(200);
  const [moves, setMoves] = useState(450);
  const [win, setWin] = useState(false);

  // Handle arrow key events to move the player on the grid
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (playerPosition[0] > 0) {
          movePlayer([playerPosition[0] - 1, playerPosition[1]]);
        }
        break;
      case "ArrowDown":
        if (playerPosition[0] < GRID_SIZE - 1) {
          movePlayer([playerPosition[0] + 1, playerPosition[1]]);
        }
        break;
      case "ArrowLeft":
        if (playerPosition[1] > 0) {
          movePlayer([playerPosition[0], playerPosition[1] - 1]);
        }
        break;
      case "ArrowRight":
        if (playerPosition[1] < GRID_SIZE - 1) {
          movePlayer([playerPosition[0], playerPosition[1] + 1]);
        }
        break;
      default:
        break;
    }
  };

  // Move the player to the given position and update health/moves based on the state of the cell they land on
  const movePlayer = (position) => {
    const [x, y] = position;
    const cell = grid[x][y];
    const newHealth = health + HEALTH_MAP[cell];
    const newMoves = moves + MOVES_MAP[cell];

    if (newHealth <= 0) {
      alert("Game Over: You ran out of health!");
      resetGame();
    } else if (newMoves <= 0) {
      alert("Game Over: You ran out of moves!");
      resetGame();
    } else {
      setPlayerPosition(position);
      setHealth(newHealth);
      setMoves(newMoves);
      if (cell === "WIN") {
        setWin(true);
      }
    }
  };
  // create random grid
  function generateRandomGrid() {
    const cells = ["Blank", "Speeder", "Lava", "Mud"];
    let blankCount = 0;
    const grid = [];

    for (let i = 0; i < 100; i++) {
      const row = [];
      for (let j = 0; j < 100; j++) {
        const randomCell = cells[Math.floor(Math.random() * cells.length)];
        if (randomCell === "Blank") {
          blankCount++;
        }
        row.push(randomCell);
      }
      grid.push(row);
    }

    while (blankCount < 7300) {
      const randomRow = Math.floor(Math.random() * 100);
      const randomCol = Math.floor(Math.random() * 100);
      if (grid[randomRow][randomCol] !== "Blank") {
        grid[randomRow][randomCol] = "Blank";
        blankCount++;
      }
    }

    // Add a single "WIN" cell to the grid
    const randomWinRow = Math.floor(Math.random() * 100);
    const randomWinCol = Math.floor(Math.random() * 100);
    grid[randomWinRow][randomWinCol] = "WIN";

    return grid;
  }

  // Reset the game to its initial state
  const resetGame = () => {
    const randomGrid = generateRandomGrid();
    setGrid(randomGrid);
    setPlayerPosition([0, 0]);
    setHealth(200);
    setMoves(450);
  };

  // Listen for arrow key events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (win) {
      alert("You Won!");
      setWin(false);
      resetGame();
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition, win]);

  // Render the game board
  return (
    <div className="game-board">
      <div className="stats">
        <div>Health: {health}</div>
        <div>Moves: {moves}</div>
      </div>
      <div className="grid-container">
        {console.log("grid", grid)}
        {grid.map((row, rowIndex) => (
          <div className="grid-row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                className={`grid-cell ${
                  playerPosition[0] === rowIndex &&
                  playerPosition[1] === cellIndex
                    ? "player"
                    : ""
                } ${cell.toLowerCase()}`}
                key={`${rowIndex}-${cellIndex}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div class="legend">
        <div class="legend-item">
          <div class="legend-color player"></div>
          <div class="legend-name">Player</div>
        </div>
        <div class="legend-item">
          <div class="legend-color mud"></div>
          <div class="legend-name">Mud</div>
        </div>
        <div class="legend-item">
          <div class="legend-color lava"></div>
          <div class="legend-name">Lava</div>
        </div>
        <div class="legend-item">
          <div class="legend-color speeder"></div>
          <div class="legend-name">Speeder</div>
        </div>
        <div class="legend-item">
          <div class="legend-color blank"></div>
          <div class="legend-name">Blank</div>
        </div>
        <div class="legend-item">
          <div class="legend-color win"></div>
          <div class="legend-name">Finish Point</div>
        </div>
      </div>

      <button onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default GameBoard;
