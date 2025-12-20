Solution
Props
The default whack-a-mole game shown in the diagram is 3 x 3 with predefined durations for the round and how long the mole appears for. In order to make the game customizable, we can introduce the following props:

rows: Number of rows.
cols: Number of columns.
roundDuration: How long the round lasts.
molesAtOnce: How many moles appear at once. In arcades, there could be multiple moles appearing at the same time for increased difficulty levels.
molesAppearingInterval: How long the moles show up for.
State
The game board can be represented as a one-dimensional array of indices. On a 3 x 3 board, the array has a length of 9 and index 3 will correspond to row 2 column 1.

visible: A set of indices determining the positions of the visible moles. This is generated every molesAppearingInterval.
score: Current score.
running: Whether the game is in progress.
timeLeft: Time left for the current round, in seconds.
Rendering
CSS grid is used to render the cells in a 2-dimensional format. It's a great choice because you can render the cells as a single list of DOM elements but with the right CSS grid settings, they can be displayed in a rows x cols layout.

Generating Moles
Every molesAppearingInterval, regardless of how many moles are visible on the page, we should generate positions for the next set of molesAtOnce moles. We can can randomly generate indices molesAtOnce times, but when molesAtOnce > 1, there's a slim chance that that the generated indices are repeated and you need to randomly generate again.

An elegant way to generate unique indices is to create an array of indices, shuffling the array, and taking the first molesAtOnce values. It requires O(N) space but this approach is arguably simpler to understand and implement correctly.

When using setInterval within React components, an extremely common source of bugs is accessing stale prop/state values. Hence the dependent variables are used in the useEffect dependency array to re-run the intervals when dependent variables are updated. Read this post by Dan Abramov to learn more.

startGame
This function is called at the start of a new round and a countdown timer is started. It starts an interval timer that runs every second, decrementing the currTimeLeft by 1 every second until currTimeLeft reaches 0.

Note that the timer should also be cleared upon unmounting, hence we can assign the timerId to a countdownTimerId ref and clear it when the component unmounts. Otherwise the timer could be still running and attempting to update component state even when the component is no longer on-screen.

whackMole
This function removes indices from the visible set when the correct cells are clicked, if they are present in the set, and increments the score by 1.

Test cases
Game Start
Verify that the round starts when the "Start" button is clicked.
Check that the timer starts counting down from the specified time limit.
Ensure that moles start appearing randomly in the holes.
Whacking Moles
Test that molesAtOnce moles appear every molesAppearingInterval.
Click on a visible mole and verify that the mole disappears.
Confirm that the score increases by one when a mole is successfully "whacked".
Ensure that clicking a hole that is not visible does not affect the score.
Game End
Verify that the round ends when the timer reaches zero.
Check that the moles stop appearing once the game ends.
Ensure that the final score is displayed correctly.
Test that the "Play Again" button shows up after the game ends and clicking on it starts a new round.
Game Logic
Verify that moles appear and disappear randomly from different holes.
Test the time limit functionality by setting different time limits and verifying that the game ends accordingly.
Verify that hitting a mole adds one to the score and missing a mole does not affect the score.
Edge Cases
Test the game behavior when unexpected input or invalid actions occur, such as clicking rapidly on multiple holes.
Notes
Timers created by setInterval and setTimeout are not precise. If the main thread is busy, the callback's execution can be delayed. However, these approaches are likely sufficient for the purpose of the interview. You can score brownie points for mentioning this.


```js
import { useEffect, useRef, useState } from 'react';

// Fisher-Yates shuffle.
function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateMolePositions(molesAtOnce, totalCount) {
  // Generate an array containing values [0, totalCount].
  const indices = Array.from({ length: totalCount }).map(
    (_, index) => index,
  );
  shuffle(indices);
  // Take the first `totalCount` items
  // from the shuffled array.
  const shuffledIndices = indices.slice(0, molesAtOnce);

  return new Set(shuffledIndices);
}

function WhackAMole({
  rows = 3,
  cols = 3,
  roundDuration = 30,
  molesAtOnce = 1,
  molesAppearingInterval = 1500,
}) {
  const totalCount = rows * cols;

  // Set of indices for currently visible moles.
  const [visible, setVisible] = useState(new Set());
  // Current player score.
  const [score, setScore] = useState(null);
  // Whether the game is in progress.
  const [running, setRunning] = useState(false);
  // Time left for the current round.
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const countdownTimerId = useRef(null);

  useEffect(() => {
    let timerId;

    if (running) {
      // Generate moles at fixed intervals.
      timerId = setInterval(() => {
        setVisible(
          generateMolePositions(molesAtOnce, totalCount),
        );
      }, molesAppearingInterval);
    }

    return () => {
      clearInterval(timerId);
      setVisible(new Set());
    };
  }, [
    running,
    molesAtOnce,
    molesAppearingInterval,
    totalCount,
  ]);

  function startGame() {
    // Reset variables to default values.
    setRunning(true);
    setTimeLeft(roundDuration);
    setScore(0);

    // Interval to decrement the timer to 0.
    countdownTimerId.current = setInterval(() => {
      setTimeLeft((currTimeLeft) => {
        if (currTimeLeft <= 0) {
          clearInterval(countdownTimerId.current);
          setRunning(false);
          return 0;
        }

        return currTimeLeft - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      // Clear countdown timer on unmount if it's running.
      clearInterval(countdownTimerId.current);
    };
  }, []);

  function whackMole(index) {
    // Whacking on an empty cell, no-op.
    if (!visible.has(index)) {
      return;
    }

    const newVisible = new Set(visible);
    newVisible.delete(index);
    setVisible(newVisible);
    setScore((score ?? 0) + 1);
  }

  return (
    <div className="app">
      <div className="header">
        {score == null ? (
          <button
            className="start-button"
            type="button"
            onClick={startGame}>
            Start Game
          </button>
        ) : (
          <div className="round-information">
            <p>Score: {score}</p>
            {!running && (
              <button
                className="start-button"
                type="button"
                onClick={startGame}>
                Play again
              </button>
            )}
            <p>Time Left: {timeLeft}</p>
          </div>
        )}
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${rows}, 1fr)`,
          gridTemplateRows: `repeat(${cols}, 1fr)`,
        }}>
        {Array(totalCount)
          .fill(null)
          .map((_, index) => {
            return (
              <button
                className="grid__cell"
                key={index}
                onClick={() => whackMole(index)}>
                <img
                  src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-head.png"
                  alt="Mole head"
                  className={[
                    'grid__cell-contents',
                    'mole-head',
                    visible.has(index) &&
                      'mole-head--visible',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                <img
                  src="https://www.greatfrontend.com/img/questions/whack-a-mole/mole-hill.png"
                  alt="Mole hill"
                  className="grid__cell-contents mole-hill"
                />
              </button>
            );
          })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WhackAMole
      rows={3}
      cols={3}
      roundDuration={15}
      molesAtOnce={2}
      molesAppearingInterval={1500}
    />
  );
}

```


```css
* {
  margin: 0;
  padding: 0;
}

body {
  --background-color: salmon;

  background-color: var(--background-color);
  font-family: sans-serif;
  padding: 2rem;
}

.app {
  box-sizing: border-box;
  padding-block: 16px;
  margin: 0 auto;
  max-width: 480px;
}

.header {
  display: flex;
  height: 30px;
  align-items: center;
  padding: 1rem 0;
  justify-content: center;
}

.round-information {
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  font-weight: bold;
}

.start-button {
  background-color: #fff;
  border: none;
  border-radius: 4px;
  color: #000;
  cursor: pointer;
  font-weight: bold;
  padding: 0.5rem 1rem;
}

.grid {
  aspect-ratio: 1 / 1;
  display: grid;
  justify-content: center;
}

.grid__cell {
  border: none;
  background-color: var(--background-color);
  position: relative;
  overflow: hidden;
}

.grid__cell-contents {
  --width: 0;
  --height: 0;
  object-fit: contain;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: var(--width);
  height: var(--height);
  user-select: none;
}

.mole-hill {
  --width: 100%;
  --height: 30%;
  transform: translate(-50%, 10px);
}

.mole-head {
  --width: 100%;
  --height: 70%;

  transform: translate(-50%, 100%);
  transition: transform 0.1s ease-in;
  cursor: pointer;
}

.mole-head--visible {
  transform: translate(-50%, 0%);
}

```