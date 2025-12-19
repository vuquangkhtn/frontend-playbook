Solution
The following explanation assumes you have a good understanding of Tic-tac-toe's React solution.

The standard tic-tac-toe game uses N = 3 and M = 3. In general it is a good practice to parameterize the app/components you're building, however the general version of tic-tac-toe takes significantly longer to implement. If you are sure you don't need to build a general version, then it's recommended to stick with the basic Tic-tac-toe implementation.

Rendering
Since the dimensions of the board is not fixed and can only be determined at runtime, we have to use inline styles to generate the required grid-template-columns property value.

State
Other than the two core pieces of state as per 3 x 3 Tic-tac-toe, we now include a new winner state to track the state of the winning mark of the board. Strictly speaking, the winner is derived state and can be determined by processing the board, which is the approach taken by the 3 x 3 version. However, for N x N boards where N and M can be very large, we determine the winner only after every turn and store it in state, which is a more efficient approach as compared to determining on every render.

determineWinner
In the 3 x 3 version, we call this function for every render. But for an N x N board, we'll call this function after every turn as a winner can only emerge after a turn.

The determineWinner function takes four parameters: board (the current state of the game board), i (the index of the last marked cell), n (the size of the board), and m (the number of consecutive marks required to win).

It firstly generates four arrays representing the winning lines:

rowLine: Contains the indices of all the cells in the same row as the last marked cell.
colLine: Contains the indices of all the cells in the same column as the last marked cell.
leftToRightDiagonalLine: Contains the indices of all the cells in the left-to-right diagonal that includes the last marked cell.
rightToLeftDiagonalLine: Contains the indices of all the cells in the right-to-left diagonal that includes the last marked cell.
For each line in lines, it then counts if there are m consecutive cells with the same mark and returns the mark if there is, otherwise it returns null, indicating there's no winner for the board yet.

Test cases
Initial Board State
Verify that the game board is displayed correctly with N x N empty cells.
Verify that the status message indicates it's player X's turn.
Marking Cells
Click on an empty cell.
Verify that the cell is marked with an "X" and the turn switches to player O.
Click on another empty cell.
Verify that the second cell is marked with an "O" and the turn switches back to player X.
Repeat this process for a few more cells to ensure the marks are placed correctly and the turn alternates between players.
Winning Conditions
Create a winning line for player X or player O by marking M cells in a row, column, or diagonal.
Verify that the status message displays the winning player's message correctly.
Verify that no further marks can be made after the game is won.
Click on the "Reset" button.
Verify that the board is cleared and the game restarts with player X's turn.
Draw Condition
Fill all the cells on the board without creating a winning line.
Verify that the status message displays a draw message correctly.
Verify that no further marks can be made after the draw.
Click on the "Reset" button.
Verify that the board is cleared, and the game restarts with player X's turn.
Accessibility
Use a screen reader to navigate and interact with the game.
Verify that the status message, cell markings, and buttons are announced correctly by the screen reader.
Verify that the game can be played and reset using only keyboard navigation.
Responsive Design
Test the game on different screen sizes, such as desktop, tablet, and mobile devices.
Verify that the game board and cells adjust correctly to different screen sizes.
Ensure that the game remains playable and visually appealing on smaller screens.

```js
import { useCallback, useState, useEffect } from 'react';

export default function App() {
  return <TicTacToe n={5} m={4} />;
}

function Cell({ index, disabled, mark, turn, onClick }) {
  return (
    <button
      aria-label={
        mark == null
          ? `Mark cell ${index} as ${turn}`
          : undefined
      }
      className="cell"
      disabled={disabled}
      onClick={onClick}>
      <span aria-hidden={true}>{mark}</span>
    </button>
  );
}

function TicTacToe({ n, m }) {
  const [board, setBoard] = useState(
    Array(n * n).fill(null),
  );
  const [xIsPlaying, setIsXPlaying] = useState(true);
  const [winner, setWinner] = useState(null);

  const onReset = useCallback(() => {
    setBoard(Array(n * n).fill(null));
    setIsXPlaying(true);
    setWinner(null);
  }, [n]);

  useEffect(() => {
    onReset();
  }, [n, m, onReset]);

  if (m > n) {
    throw Error('Invalid props. `m` must be <= `n`.');
  }

  function getStatusMessage() {
    if (winner != null) {
      return `Player ${winner} wins!`;
    }

    // All cells have been filled up.
    if (!board.includes(null)) {
      return `It's a draw!`;
    }

    return `Player ${xIsPlaying ? 'X' : 'O'} turn`;
  }

  return (
    <div className="app">
      <div aria-live="polite">{getStatusMessage()}</div>
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${n}, 1fr)`,
        }}>
        {Array(n * n)
          .fill(null)
          .map((_, index) => index)
          .map((cellIndex) => {
            const turn = xIsPlaying ? 'X' : 'O';
            return (
              <Cell
                key={cellIndex}
                disabled={
                  board[cellIndex] != null || winner != null
                }
                index={cellIndex}
                mark={board[cellIndex]}
                turn={turn}
                onClick={() => {
                  const newBoard = board.slice();
                  newBoard[cellIndex] = turn;
                  setBoard(newBoard);
                  setIsXPlaying(!xIsPlaying);
                  setWinner(
                    determineWinner(
                      newBoard,
                      cellIndex,
                      n,
                      m,
                    ),
                  );
                }}
              />
            );
          })}
      </div>
      <button
        onClick={() => {
          if (winner == null) {
            // Confirm whether to reset the game.
            const confirm = window.confirm(
              'Are you sure you want to reset the game?',
            );
            if (!confirm) {
              return;
            }
          }

          onReset();
        }}>
        Reset
      </button>
    </div>
  );
}

function determineWinner(board, i, n, m) {
  const row = Math.floor(i / n);
  const col = i % n;

  // Get row
  const rowLine = [];
  for (let i = 0; i < n; i++) {
    rowLine.push(row * n + i);
  }

  // Get column
  const colLine = [];
  for (let i = 0; i < n; i++) {
    colLine.push(i * n + col);
  }

  const leftToRightDiagonalLine = getLeftToRightDiagonal(
    i,
    n,
  );
  const rightToLeftDiagonalLine = getRightToLeftDiagonal(
    i,
    n,
  );

  const lines = [
    rowLine,
    colLine,
    leftToRightDiagonalLine,
    rightToLeftDiagonalLine,
  ];

  for (const line of lines) {
    let currentWinner = null;
    let currentCountInARow = 0;
    for (const i of line) {
      if (board[i] == null) {
        currentWinner = null;
        currentCountInARow = 0;
        continue;
      }
      if (board[i] === currentWinner) {
        currentCountInARow++;
      } else {
        currentWinner = board[i];
        currentCountInARow = 1;
      }
      if (currentCountInARow >= m) {
        return currentWinner;
      }
    }
  }

  return null;
}

function getLeftToRightDiagonal(i, n) {
  const row = Math.floor(i / n);
  const col = i % n;

  const stepsToStart = Math.min(col, row);
  const startRow = row - stepsToStart;
  const startCol = col - stepsToStart;
  const line = [];

  for (let i = 0; i < n; i++) {
    const currentRow = startRow + i;
    const currentCol = startCol + i;
    if (currentRow >= n || currentCol >= n) {
      break;
    }
    line.push(currentRow * n + currentCol);
  }

  return line;
}

function getRightToLeftDiagonal(i, n) {
  const row = Math.floor(i / n);
  const col = i % n;

  const stepsToStart = Math.min(n - col - 1, row);
  const startRow = row - stepsToStart;
  const startCol = col + stepsToStart;
  const line = [];

  for (let i = 0; i < n; i++) {
    const currentRow = startRow + i;
    const currentCol = startCol - i;
    if (currentRow >= n || currentCol < 0) {
      break;
    }
    line.push(currentRow * n + currentCol);
  }

  return line;
}

```