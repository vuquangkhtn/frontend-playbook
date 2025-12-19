Solution
In the spirit of good software engineering, let's devise a solution that is as customizable as possible. We will build a Connect Four game that works with any numbers of rows, columns, and players. Let these be constants ROWS, COLUMNS, and PLAYERS respectively.

Connect Four example

Setting up the playground
From the example image, we see that we need at least three main sections:

1. The disc-drop area
This is where a player will drop their disc. It is a single row of COLUMNS cells, each representing a column in the game grid. The color of the disc shown will be the current player's.

2. The game grid
This is where all the discs will be placed. It is a ROWS-by-COLUMNS grid. More specifically, it is a div of ROWS number of divs. Each of these divs contains COLUMNS number of divs.

Each cell has two states:

empty: which displays a transparent (or the app's background color) circle, and
occupied: which displays a circle colored with the player's disc color.
Tip: Use border-radius: 100%; to make a div a circle. This will apply a border radius of half of the width/height of the div in each corner.

3. The controls area
This is where the reset button and game state (winning player, draw, errors, etc.) elements will be placed.

States
As with any games, we need to keep track of some states throughout one game session.

grid, which is a ROWS-by-COLUMNS array that represents the current grid of discs.
currentPlayer, which is the current player's identifier, so we know whose disc to drop into the grid.
winner, which is the winning player's identifier, so we know who to congratulate! It is null at first. This state also doubles as a flag to indicate if the game has ended.
Names may vary, and you may need other states to support your implementation. These are the minimum.

Binding the interactions
At this point, you'd probably be thinking of the actual Connect Four game. To keep things simple, let's not worry about the animations of the discs dropping into the grid.

Choosing a column to drop a disc
In the disc-drop area, think of each cell as a button. When a button at index i is clicked, it triggers an event to drop a disc into column i.

We will need to pass the current player's color to color these buttons.

Notably, we want to only show a disc where the player is hovering; they are planning their move! There are many ways to detect if a button at index i is hovered.

We can use the :hover CSS pseudo-class to detect if the button is currently hovered.

We can use the mouseenter or mousemove event listeners on the buttons to set a state (maybe some currentColumn) to i.

Once we know if a button i is hovered, we can then modify background-color, opacity, or visibility to show or hide the button.

Dropping a disc
We trigger this interaction by binding a click event listener to each button in the disc-drop area. This function will receive the column index i as an argument.

The general algorithm for dropping a player player's disc into column i is as follows.

Find the cell cell such that it is the first empty row in column i.
We do this by iterating through the elements (rows) of grid and finding the first element at index i (cell in each row) that is null.

Set cell to player.

After dropping a disc, we check if the game has ended.

If yes, we update winner to the winning player's identifier.
If not, we update currentPlayer to the next player in PLAYERS.
Remember that if we cannot find an empty cell in column i, we should not allow any disc to drop there. We could either:

Show an error message with alert or some other UI element, or
Completely disable the button at index i and not allow interactions with unavailable columns.
Checking for the winning condition
The naive way is to go through every cell in grid and check that for every cell cell, if it is a part of any one of the valid winning segments.

A more optimal approach is to only check the cell cell where the player dropped their disc. We can do this because the fact that we are able to drop a disc means there mustn't be a winner yet, so the game continues. This means if a player wins now, it is specifically caused by this one mutation: the placement at cell. So, it suffices to only check around cell.

At cell, we check if it is a part of any one of the valid winning segments. We check the four directions: ─, │, ╲, and ╱ that crosses cell. Each direction is a 7 elements-long array of coordinates relative to cell.

It is length 7 because each winning segment is 4 elements-long. So, combining the north and south directions, for example, we get 7 elements.

In the spirit of good software engineering, we will generalize this algorithm by extracting 4 out as a constant COUNT_TO_WIN. This way, we can easily change the winning condition in the future!

For each direction, count the maximum number of consecutive discs of the current player's color. If there are at least COUNT_TO_WIN of them, the player has won.

The naive algorithm will take O(ROWS * COLUMNS) time, while the optimal algorithm will take O(COUNT_TO_WIN) time, which is effectively O(1) constant time.

Tip: You can use the optional chaining operator to safely grab a cell at a coordinate, even if it may be out of bounds. For example, grid?.[r]?.[c] will return undefined if r or c are out of bounds in grid.

Checking for a draw
There are many ways to achieve this. One way is to check if after a disc drop, there is no winner, and every cell in grid is occupied.

A more optimal approach is to keep track of the number of discs dropped as we drop them. If it reaches ROWS * COLUMNS, then we know that the game has ended in a draw. Then we don't have to incur that extra O(ROWS * COLUMNS) time to check if every cell is occupied. Neat!

However, keeping track of the number of discs is considered duplicated state since it can be derived from the grid state. Since the number of cells is considered small, it is optional to do such an optimization.

Resetting the game
This is as easy as setting the states back to their initial values, i.e.,

grid to a ROWS-by-COLUMNS array of nulls,
currentPlayer to the first player in PLAYERS, and
winner to null.
React-specific notes
useState and grid mutations
Since we are using useState as the grid state, we should not mutate grid when we drop a disc. We need to make a deep copy the grid state, mutate the copy, and then set the state to the copy with setGrid. We can also use Immer's produce if third-party libraries are allowed.

Using indices as keys
When we map the rows and cells in grid, we use their indices as keys. If you are a student of React, you'd probably realize that React warns against it. But in this case, it's perfectly fine to use indices as keys because they are the correct identifiers of the rows and cells in grid, do not contain state and the grid dimensions do not change while the game is in-progress. Therefore, it will not cause any "subtle and confusing bugs" as React warns.

Test cases
Let the game be configured with PLAYERS players and the winning condition be COUNT_TO_WIN consecutive discs of the same color.

For a given ROWS-by-COLUMNS grid grid and a given player,

For any given column i:
If there is at least one empty cell cell, dropping a disc will result in cell being filled with player's disc color.
Dropping a disc in a column will fill spaces from the bottom.
If there is no empty cell, a disc cannot be placed in the column. If you have other behaviors for this case, expect it to happen too.
When a disc is dropped into some cell cell, for each of the four directions: ─, │, ╲, and ╱ that crosses cell,
If there are at least COUNT_TO_WIN consecutive cells filled with player's disc color, there's an indicator for the winning player.
Otherwise, the color of the disc to drop in the next turn is the next player in PLAYERS's.
Game progress:
Players can take turns to drop the discs until a player wins or a there's a draw.
If all cells are filled and no player has won, a draw indicator appears.
Game conclusion
When the winning or a draw indicator appears, no more discs can be dropped.
Clicking on the "Reset" button will turn all cells grid to its base color, and clear any winning or draw indicators.

```js
import React, { useState } from 'react';

const ROWS = 6;
const COLS = 7;
const COUNT_TO_WIN = 4;

const PLAYERS = ['red', 'yellow'] as const;
type Player = (typeof PLAYERS)[number];
type CurrentPlayerIndex = number;

const EMPTY_CELL = '#fff';

const PLAYER_TOKENS: Record<Player, string> = {
  red: '#d9313d',
  yellow: '#fdc601',
};

// Direction deltas for horizontal, vertical and diagonal
// directions.
// The first value is the row delta, second value is the column delta.
// These will be used to check if there are N consecutive tokens
// in each direction for winning condition.
const DIRECTION_DELTAS = [
  [0, 1], // Horizontal
  [1, 0], // Vertical
  [1, -1], // Diagonal (bottom left to top right)
  [1, 1], // Diagonal (top left to bottom right)
];

// Game grid data structure.
type GameGridCellValue = Player | null;
type GameGridType = Array<Array<GameGridCellValue>>;

// Generate initial game grid.
function getInitialGrid(): GameGridType {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
}

// Check if a player has won.
function checkIfPlayerWon(
  grid: GameGridType,
  row: number,
  col: number,
  player: Player,
): boolean {
  return DIRECTION_DELTAS.some(([deltaRow, deltaCol]) => {
    // Count the maximum consecutive discs for the
    // player in the 4 different directions.
    let consecutiveDiscs = 0;
    let maxConsecutiveDiscs = 0;

    for (
      let i = -COUNT_TO_WIN + 1;
      i <= COUNT_TO_WIN - 1;
      i++
    ) {
      const currRow = row + deltaRow * i;
      const currCol = col + deltaCol * i;

      if (grid?.[currRow]?.[currCol] === player) {
        consecutiveDiscs += 1;
        maxConsecutiveDiscs = Math.max(
          consecutiveDiscs,
          maxConsecutiveDiscs,
        );
      } else {
        consecutiveDiscs = 0;
      }
    }

    return maxConsecutiveDiscs >= COUNT_TO_WIN;
  });
}

// Player section component where player can
// select a column to drop their piece.
function PlayerMoveSection({
  availableColumns,
  currentColumn,
  currentPlayer,
  gameHasEnded,
  onColumnHover,
  onPlayerMove,
}: {
  availableColumns: Set<number>;
  currentColumn: number | null;
  currentPlayer: Player;
  gameHasEnded: boolean;
  onColumnHover: (column: number) => void;
  onPlayerMove: (column: number) => void;
}): React.ReactElement {
  return (
    <div className="player-move-section">
      {Array.from({ length: COLS }).map((_, index) => (
        <button
          aria-label={`Column ${index + 1}`}
          disabled={
            !availableColumns.has(index) || gameHasEnded
          }
          key={index}
          style={{
            backgroundColor:
              currentColumn === index && !gameHasEnded
                ? PLAYER_TOKENS[currentPlayer]
                : undefined,
          }}
          className="player-move-column"
          onMouseEnter={() => onColumnHover(index)}
          onClick={() => onPlayerMove(index)}
        />
      ))}
    </div>
  );
}

function GameGrid({
  grid,
}: {
  grid: GameGridType;
}): React.ReactElement {
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: `repeat(${ROWS}, var(--grid-item-size))`,
        gridTemplateColumns: `repeat(${COLS}, var(--grid-item-size)`,
      }}>
      {grid.map((rows, rowIndex) =>
        rows.map((cellValue, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              backgroundColor:
                cellValue != null
                  ? PLAYER_TOKENS[cellValue]
                  : EMPTY_CELL,
            }}
            className="grid-item"
          />
        )),
      )}
    </div>
  );
}

// Winner details component.
function WinnerSection({
  winner,
}: {
  winner: Player;
}): React.ReactElement {
  return (
    <div
      className="winner-token"
      style={{ backgroundColor: PLAYER_TOKENS[winner] }}>
      WON
    </div>
  );
}

export default function App() {
  // State to handle game grid state.
  const [grid, setGrid] = useState<GameGridType>(() =>
    getInitialGrid(),
  );
  // Current player index.
  const [currentPlayerIndex, setCurrentPlayerIndex] =
    useState<CurrentPlayerIndex>(0);
  // Winner state. It will be player's index if there's a winner.
  const [winner, setWinner] = useState<Player | null>(null);

  // State to handle current column selected by the current player.
  const [currentColumn, setCurrentColumn] = useState<
    number | null
  >(null);

  function onPlayerMove(column: number) {
    // Make a deep clone of the grid.
    const newGrid = grid.map((row) => [...row]);

    let rowToPlace = ROWS - 1;
    // Find lowest row in current column that is empty.
    while (newGrid[rowToPlace][column] != null) {
      rowToPlace--;
    }

    const player = PLAYERS[currentPlayerIndex];
    newGrid[rowToPlace][column] = player;
    if (
      checkIfPlayerWon(newGrid, rowToPlace, column, player)
    ) {
      setWinner(player);
    }

    // Go to the next player.
    setCurrentPlayerIndex(
      (currentPlayerIndex + 1) % PLAYERS.length,
    );
    setGrid(newGrid);
  }

  function onColumnHover(index: number) {
    setCurrentColumn(index);
  }

  function onRestart() {
    setGrid(getInitialGrid());
    setCurrentColumn(null);
    setCurrentPlayerIndex(0);
    setWinner(null);
  }

  const movesSoFar = grid.reduce(
    (count, row) => count + row.filter(Boolean).length,
    0,
  );
  const isDraw =
    movesSoFar === ROWS * COLS && winner == null;
  const gameHasEnded = isDraw || winner != null;
  const availableColumns = new Set(
    grid[0]
      .map((piece, index) => (piece == null ? index : -1))
      .filter((item) => item !== -1),
  );

  return (
    <div className="app">
      <PlayerMoveSection
        availableColumns={availableColumns}
        currentColumn={currentColumn}
        currentPlayer={PLAYERS[currentPlayerIndex]}
        gameHasEnded={gameHasEnded}
        onColumnHover={onColumnHover}
        onPlayerMove={onPlayerMove}
      />
      <GameGrid grid={grid} />
      <button onClick={onRestart} className="reset-button">
        Reset
      </button>
      {isDraw && <h2>DRAW</h2>}
      {winner != null && <WinnerSection winner={winner} />}
    </div>
  );
}

```