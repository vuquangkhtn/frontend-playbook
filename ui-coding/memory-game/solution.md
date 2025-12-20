Solution
Props
The default memory game shown in the diagram is 4 x 4 and the goal is to match pairs. In order to make the game customizable, we can introduce the following props:

rows: Number of rows.
cols: Number of columns.
matchCount: How many of the same images there are. The default is 2 but making it a parameter is a positive signal.
delay: Delay before selected non-matching cards are flipped back over.
Since these parameters can be combined in ways that make the game unplayable, we can do a basic check of whether the total number of cells is divisible by the match count.

State
cards: The game board can be represented as a one-dimensional array called cards, containing the correct number of groups of unique emojis. On a 4 x 4 board, the array has a length of 16 and cards[4] will correspond to row 2 column 1. This array is generated during initialization and not modified throughout the duration of the game. It's only regenerated when the user chooses to play again.
flipped: An array of indices to track which cards are flipped. This array excludes matched cards.
matched: A set of images (emojis) that have been matched.
waitTimer: A ref to track the timer ID for whether to automatically flip back the cards after delay duration.
gameCompleted: Boolean value to represent whether the game is completed.
Rendering
CSS grid is used to render the cards in a 2-dimensional format. It's a great choice because you can render the cards as a single list of DOM elements but with the right CSS grid settings, they can be displayed in a rows x cols layout.

Card Generation
The following process can be used for generating the cards:

Make N groups of matchCount emojis where N = total cells / matchCount in a single array.
Shuffle the array.
onFlip
For the most part, onFlip adds cards to the selected array. If there aren't enough cards to make a decision whether there's a match yet, the function terminates. When enough cards are selected, check whether all the selected cards are similar. If so, we can add the selected emoji to the matched set and reset selected to be empty so that the player can continue with the game. If there isn't a match, we wait for delay duration to pass before flipping the selected cards back over. We use a useRef for waitTimer so that we can access the same timerID value in the setTimeout callback. If we used useState, we could be accessing stale timer ID value due to closures. This is an extremely common source of bugs when using setTimeout or setInterval within React components, read this post by Dan Abramov to learn more.

Another scenario we have to handle is when the user selects more cards before the delay has passed. waitTimer has to be cleared and the currently unmatched open cards have to be flipped back.

Test cases
Initial Display
Open the game and verify that the grid of faced-down cards is displayed correctly.
Check that the number of cards in the grid is as expected.
Ensure that all cards are facedown and not revealing their images.
Card Flipping
Click on a card and verify that it reveals its image.
Click on another card and verify that it also reveals the image.
Ensure that the selected cards remain face-up if they match.
Verify that the selected cards flip back if they don't match after a short delay.
Matching Pairs
Select two cards that have the same image and verify that they remain face-up.
Non-Matching Pairs
Select two cards that have different images and verify that they flip back after a short delay if no new cards are selected.
Select two cards that have different images and select a new card, the first two selected cards should be flipped back.
Game Completion
Play the game until all pairs are successfully matched.
Verify that the "Play Again" button is displayed and clicking on it resets the game.
New Game/Reset
Start a new game or reset the current game.
Verify that the grid is reset, with all cards facedown.


```ts
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const emojis = [
  '🐵',
  '🐶',
  '🦊',
  '🐱',
  '🦁',
  '🐯',
  '🐴',
  '🦄',
  '🦓',
  '🦌',
  '🐮',
  '🐷',
  '🐭',
  '🐹',
  '🐻',
  '🐨',
  '🐼',
  '🐽',
  '🐸',
  '🐰',
  '🐙',
];

function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generate cards configuration with the required groups of emojis.
function generateCards(totalCount, matchCount) {
  const numGroups = totalCount / matchCount;
  if (numGroups > emojis.length) {
    throw new Error('Not enough emojis');
  }

  const emojisList = emojis.slice(0, numGroups);
  const cards = Array.from(
    { length: numGroups },
    () => null,
  )
    .map((_, idx) => idx)
    .map((idx) =>
      Array.from(
        { length: matchCount },
        () => emojisList[idx],
      ),
    )
    .flat();

  shuffle(cards);
  return cards;
}

function MemoryGame({
  cols = 4,
  rows = 4,
  delay = 2000,
  matchCount = 2,
}) {
  // Total number of cells.
  const totalCount = rows * cols;
  // An array of emojis to represent the cards.
  const [cards, setCards] = useState(
    generateCards(totalCount, matchCount),
  );
  // Currently flipped cards.
  const [flipped, setFlipped] = useState([]);
  // Identifier of matched cards.
  const [matched, setMatched] = useState(new Set());
  // Delay before cards are flipped back.
  const waitTimer = useRef(null);
  // Whether the game has completed.
  const [gameCompleted, setGameCompleted] = useState(false);

  const resetGame = useCallback(() => {
    waitTimer.current = null;
    setCards(generateCards(totalCount, matchCount));
    setFlipped([]);
    setMatched(new Set());
    setGameCompleted(false);
  }, [matchCount, totalCount]);

  useEffect(() => {
    resetGame();
  }, [cols, rows, matchCount, resetGame]);

  if (matchCount < 2) {
    throw new Error(`${matchCount} should be 2 or more`);
  }

  if (totalCount % matchCount !== 0) {
    throw new Error(
      `Cannot divide total cells of ${totalCount} by ${matchCount}`,
    );
  }

  function onFlip(index) {
    let currFlipped = flipped;

    // Player flips more cards while there are
    // unmatched cards flipped open.
    if (waitTimer.current != null) {
      clearTimeout(waitTimer.current);
      waitTimer.current = null;
      currFlipped = [];
    }

    const newflipped = [...currFlipped, index];
    setFlipped(newflipped);

    // Not enough cards are flipped.
    if (newflipped.length < matchCount) {
      return;
    }

    const allFlippedAreSame = newflipped.every(
      (index) => cards[newflipped[0]] === cards[index],
    );

    if (allFlippedAreSame) {
      const newMatchedSet = new Set(matched);
      newMatchedSet.add(cards[newflipped[0]]);
      setMatched(newMatchedSet);
      setFlipped([]);

      if (newMatchedSet.size * matchCount === totalCount) {
        setGameCompleted(true);
      }

      return;
    }

    const timer = setTimeout(() => {
      // After a delay if no new cards were flipped,
      // flip all cards back.
      setFlipped([]);
      waitTimer.current = null;
    }, delay);

    waitTimer.current = timer;
  }

  return (
    <div className="app">
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${rows}, var(--size))`,
          gridTemplateColumns: `repeat(${cols}, var(--size))`,
        }}>
        {cards.map((card, index) => {
          const isMatched = matched.has(cards[index]);
          const isFlipped = flipped.includes(index);

          return (
            <button
              key={index}
              className={[
                'card',
                matched.has(cards[index]) &&
                  'card--revealed',
              ]
                .filter(Boolean)
                .join(' ')}
              disabled={isMatched || isFlipped}
              onClick={() => {
                onFlip(index);
              }}>
              {(isMatched || isFlipped) && card}
            </button>
          );
        })}
      </div>
      {gameCompleted && (
        <button onClick={resetGame}>Play Again</button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <MemoryGame
      rows={4}
      cols={4}
      delay={2000}
      matchCount={2}
    />
  );
}

```

```css
body {
  font-family: sans-serif;
}

* {
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 10px;
}

.grid {
  --size: 60px;

  display: grid;
  gap: 8px;
  justify-content: center;
  border: 2px solid black;
  border-radius: 8px;
  padding: 8px;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  border-radius: 6px;
  font-size: 30px;
  cursor: pointer;
  background-color: #eee;
  overflow: hidden;
  position: relative;
}

.card:disabled {
  color: #000;
}

.card--revealed {
  background: transparent;
  border-color: transparent;
}

```