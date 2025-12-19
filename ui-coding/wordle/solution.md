State
The code uses several state variables to manage the game state and user interactions. Here's an explanation of each state variable and its purpose:

wordOfTheDay: This state variable stores the randomly selected word that the player needs to guess. It is initialized with a random word from the predefined list WORDS. It is used to compare the player's guesses and determine if they have guessed the word correctly.
gameState: This state variable represents the overall state of the game. It can have three possible values:
GAME_STATE.IN_PROGRESS: The game is still in progress, and the player can continue making guesses.
GAME_STATE.GUESSED_CORRECTLY: The player has guessed the word correctly within the allowed attempts.
GAME_STATE.NO_MORE_GUESSES: The player has used all the attempts without guessing the word correctly.
gridState: This state variable is a 2D array that represents the state of the grid, where each cell represents a letter in the word. It stores an object with two properties: char (the letter) and state (the state of the letter guess). The gridState is initialized using the getInitialGridState function.
position: This state variable represents the current position of the cursor in the grid. It is a 2-element array with the row and column index. The initial position is set to INITIAL_CURSOR_POSITION, which is [0, -1] (before the first cell).
letterGuessState: This state variable is an object that tracks the state of each letter guess made by the player. The keys of the object are the guessed letters, and the values are the corresponding guess states (LETTER_GUESS_STATE). The getInitialLetterGuessState function initializes it. This value is used by the virtual keyboard to determine which color to render the keys.

Rendering
The solution heavily uses CSS variables to render the letters in the guesses and the virtual keyboard using the relevant state colors. CSS variables are used since the color values are used in multiple parts of the UI.

addLetter
This function is called when a letter key is pressed. It adds the pressed letter to the grid at the current cursor position if there is space available in the row.

deleteLetter
This function is called when the backspace key is pressed. It deletes the letter at the current cursor position in the grid. If there are no letters in the current row, calling this function does nothing.

checkWord
This function is the most complex function among all the functions. It is called when the enter key is pressed to check if the word in the current row is correct. There are a few main parts to this function:

Firstly, check each letter for exact matches. The states of the grid and letter guesses are updated to be 'CORRECT'. If all the letters match, we can terminate the function and end the game.
Next, we update the states of the remaining characters. The remaining characters can be one of the following:
Present: If a character is present in letterFreq and letterFreq.get(char) is 0, it means that it has already been marked as 'CORRECT' in the previous step. A positive value means that the character is present but not in the correct position. We need to use a frequency instead of simply checking the existence of the character because a word can use the same character multiple times. These characters will be marked as 'PRESENT'.
Absent: The character is not present in letterFreq at all, or has a value of 0 (the same letter was used in another position correctly), we can mark it as 'ABSENT'.
Lastly, if all the guesses were used up without finding the correct word, the game ends and the correct word is shown. Otherwise, the cursor moves to the next row.
resetGame
This function resets the game state to its initial values when called. It sets a new word of the day, resets the letter grid, the cursor position, the game state, and the letter guess state.


Test cases
Basic User Input
Typing letters anywhere on the screen will add letters.
Hitting "Enter"
Checks the word when the row is full.
Does nothing when the row is not full.
Hitting "Backspace"
Erases a letter for the current row.
Does nothing when the row is empty.
Virtual keyboard can be used.
Word Checking
Target word = "FEAST", correct on first try:
Guess "FEAST". All letters should be green.
Target word = "FEAST", multiple tries:
Guess "TASTY". "A", "S", "T" should be yellow, "Y" should be dark gray.
Guess "BEAST". "E", "A", "S", "T" should be green, "B" should be dark gray.
Guess "FEAST". All letters should be green.
Target word = "PAINT, multiple tries:
Guess "TOWER". "T" should be yellow, the other letters should be dark gray.
Guess "PLANT". "P", "N" and "T" should be green, "A" should be yellow, "L" should be dark gray. The "T" in the keyboard should now be green.
Target word = "APPLE", multiple tries:
Guess "PLANT". "P", "L", "A" should be yellow, the other letters should be dark gray.
Guess "PAPER". The first "P", "A", "E" should be yellow, the second "P" should be green, "R" should be dark gray. The "P" in the keyboard should now be green.
Target word = "APPLE", guess a word that has multiple "L"s:
Guess "HELLO". The second "L" should be green, "E" should be yellow, the other letters should be dark gray. The first "L" should be dark gray because "APPLE" only has one "L" and the second "L" is in the correct position.
Game End
If guessed correctly, a congratulatory message is shown.
If all guesses were used up, the word of the day is shown.
"Reset" button is shown.
Reset
Grid and keyboard states are cleared and a new game session is started.

```js
import { useCallback, useEffect, useState } from 'react';

const LETTER_GUESS_STATE = Object.freeze({
  INDETERMINATE: 'INDETERMINATE',
  ABSENT: 'ABSENT',
  PRESENT: 'PRESENT',
  CORRECT: 'CORRECT',
});

const LETTER_GUESS_STATE_PRIORITY = Object.freeze({
  INDETERMINATE: 1,
  ABSENT: 2,
  PRESENT: 3,
  CORRECT: 4,
});

const GAME_STATE = Object.freeze({
  IN_PROGRESS: 'IN_PROGRESS',
  GUESSED_CORRECTLY: 'GUESSED_CORRECTLY',
  NO_MORE_GUESSES: 'NO_MORE_GUESSES',
});

const GUESS_CLASSES = Object.freeze({
  CORRECT: 'guess--correct',
  PRESENT: 'guess--present',
  ABSENT: 'guess--absent',
});

const KEYBOARD_LAYOUT = Object.freeze([
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
]);

const WORDS = Object.freeze([
  'APPLE',
  'BEAST',
  'FAINT',
  'FEAST',
  'FRUIT',
  'GAMES',
  'PAINT',
  'PASTE',
  'TOWER',
  'REACT',
]);

const A_KEYCODE = 65;
const Z_KEYCODE = 90;

function isValidKey(key) {
  return (
    key === 'Enter' ||
    key === 'Backspace' ||
    (key.length === 1 &&
      key.toUpperCase().charCodeAt() >= A_KEYCODE &&
      key.toUpperCase().charCodeAt() <= Z_KEYCODE)
  );
}

// Utility to conditionally concatenate classnames.
function clsx(...args) {
  return args.filter(Boolean).join(' ');
}

// Count the frequency of letters in a word.
function countLetterFreqInWord(word) {
  const freq = new Map();

  for (let i = 0; i < word.length; ++i) {
    if (!freq.has(word[i])) {
      freq.set(word[i], 0);
    }

    freq.set(word[i], freq.get(word[i]) + 1);
  }

  return freq;
}

function getInitialGridState(maxAttempts, lettersPerWord) {
  return Array.from({ length: maxAttempts }, () =>
    Array.from({ length: lettersPerWord }, () => ({
      char: '',
      state: LETTER_GUESS_STATE.INDETERMINATE,
    })),
  );
}

function getInitialLetterGuessState() {
  return {};
}

function Keyboard({ onPressKey, letterGuessState }) {
  return (
    <section className="keyboard-section">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => {
        return (
          <div className="keyboard-row" key={rowIndex}>
            {row.map((char) => (
              <button
                key={char}
                onClick={() => {
                  onPressKey(char);
                }}
                className={clsx(
                  'keyboard-row__button',
                  GUESS_CLASSES[letterGuessState[char]],
                )}>
                {(() => {
                  switch (char) {
                    case 'Enter':
                      return 'ENTER';
                    case 'Backspace':
                      return 'DEL';
                    default:
                      return char;
                  }
                })()}
              </button>
            ))}
          </div>
        );
      })}
    </section>
  );
}

function LetterGrid({ letters }) {
  return (
    <section
      className="grid-section"
      style={{
        gridTemplateColumns: `repeat(${letters[0].length}, var(--size))`,
        gridTemplateRows: `repeat(${letters.length}, var(--size))`,
      }}>
      {letters.map((lettersRow, rowIndex) =>
        lettersRow.map(({ char, state }, colIndex) => (
          <div
            className={clsx(
              'grid-cell',
              Boolean(char) && 'grid-cell--filled',
              state !== LETTER_GUESS_STATE.INDETERMINATE &&
                clsx(
                  'grid-cell--final',
                  GUESS_CLASSES[state],
                ),
            )}
            style={{
              transitionDelay:
                state !== LETTER_GUESS_STATE.INDETERMINATE
                  ? `${colIndex * 50}ms`
                  : undefined,
            }}
            key={rowIndex + '-' + colIndex}>
            {char}
          </div>
        )),
      )}
    </section>
  );
}

function GameResult({
  gameState,
  wordOfTheDay,
  onResetClick,
}) {
  if (gameState === GAME_STATE.IN_PROGRESS) {
    return null;
  }

  return (
    <div className="result-row">
      <strong>
        <>
          {gameState === GAME_STATE.GUESSED_CORRECTLY &&
            'Congratulations 🎉'}
        </>
        <>
          {gameState === GAME_STATE.NO_MORE_GUESSES &&
            `Word: ${wordOfTheDay}`}
        </>
      </strong>
      <button
        type="button"
        className="reset-button"
        onClick={onResetClick}>
        Reset
      </button>
    </div>
  );
}

function generateRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

const INITIAL_CURSOR_POSITION = [0, -1];

function Wordle({ maxAttempts, lettersPerWord }) {
  // Initialize word of the day.
  const [wordOfTheDay, setWordOfTheDay] = useState(
    generateRandomWord(),
  );
  // Represent overall game state.
  const [gameState, setGameState] = useState(
    GAME_STATE.IN_PROGRESS,
  );

  // User attempts and the states of each letter guess.
  const [gridState, setGridState] = useState(() =>
    getInitialGridState(maxAttempts, lettersPerWord),
  );
  // Current position in the grid.
  const [position, setPosition] = useState(
    INITIAL_CURSOR_POSITION,
  );
  // Tracks the state of letter guesses.
  const [letterGuessState, setLetterGuessState] = useState(
    () => getInitialLetterGuessState(),
  );

  useEffect(() => {
    // Print out word of the day in console for debugging purposes.
    console.log(
      `[DEBUG]: Word of the day is: ${wordOfTheDay}`,
    );
  }, [wordOfTheDay]);

  const resetGame = useCallback(() => {
    setWordOfTheDay(generateRandomWord());
    setGridState(
      getInitialGridState(maxAttempts, lettersPerWord),
    );
    setPosition(INITIAL_CURSOR_POSITION);
    setGameState(GAME_STATE.IN_PROGRESS);
    setLetterGuessState(getInitialLetterGuessState());
  }, [maxAttempts, lettersPerWord]);

  useEffect(() => {
    resetGame();
  }, [maxAttempts, lettersPerWord, resetGame]);

  function addLetter(char) {
    const [row, col] = position;

    // Row is already fully filled.
    if (col + 1 === lettersPerWord) {
      return;
    }

    // Clone the grid to avoid mutating the existing one.
    const newGridState = Array.from(gridState);
    newGridState[row][col + 1].char = char.toUpperCase();
    setPosition([row, col + 1]);
    setGridState(newGridState);
  }

  function deleteLetter() {
    const [row, col] = position;
    const newGridState = Array.from(gridState);

    if (col === -1) {
      return;
    }

    newGridState[row][col].char = '';
    setPosition([row, col - 1]);
    setGridState(newGridState);
  }

  function checkWord() {
    const [row, col] = position;

    // Not enough letters in the row yet.
    if (col + 1 < lettersPerWord) {
      return;
    }

    const newGridState = Array.from(gridState);
    const newLetterGuessState = { ...letterGuessState };
    const word = gridState[row]
      .map(({ char }) => char)
      .join('');
    // Create a map of count of letters in original word to compare
    // with the word entered by user.
    const letterFreq = countLetterFreqInWord(wordOfTheDay);
    const nonMatchingIndices = [];
    let matchCount = 0;

    // Update state for matching chars first.
    for (let i = 0; i < word.length; i++) {
      const currentChar = word[i];
      const currentActualChar = wordOfTheDay[i];

      if (currentChar === currentActualChar) {
        newGridState[row][i].state =
          LETTER_GUESS_STATE.CORRECT;
        newLetterGuessState[currentChar] =
          LETTER_GUESS_STATE.CORRECT;
        letterFreq.set(
          currentChar,
          letterFreq.get(currentChar) - 1,
        );
        matchCount++;
      } else {
        nonMatchingIndices.push(i);
      }
    }

    // Guessed correctly.
    if (matchCount === lettersPerWord) {
      setLetterGuessState(newLetterGuessState);
      setGridState(newGridState);
      setGameState(GAME_STATE.GUESSED_CORRECTLY);
      return;
    }

    // Update state for rest of the chars.
    nonMatchingIndices.forEach((idx) => {
      const char = word[idx];
      if (
        letterFreq.has(char) &&
        letterFreq.get(char) > 0
      ) {
        letterFreq.set(char, letterFreq.get(char) - 1);
        newGridState[row][idx].state =
          LETTER_GUESS_STATE.PRESENT;
        // Only change state if the new state is higher priority
        // than the current state.
        if (
          LETTER_GUESS_STATE_PRIORITY[
            LETTER_GUESS_STATE.PRESENT
          ] >
          LETTER_GUESS_STATE_PRIORITY[
            newLetterGuessState[char] ??
              LETTER_GUESS_STATE.INDETERMINATE
          ]
        ) {
          newLetterGuessState[char] =
            LETTER_GUESS_STATE.PRESENT;
        }
      } else {
        newGridState[row][idx].state =
          LETTER_GUESS_STATE.ABSENT;
        // Only change state if the new state is higher priority
        // than the current state.
        if (
          LETTER_GUESS_STATE_PRIORITY[
            LETTER_GUESS_STATE.ABSENT
          ] >
          LETTER_GUESS_STATE_PRIORITY[
            newLetterGuessState[char] ??
              LETTER_GUESS_STATE.INDETERMINATE
          ]
        ) {
          newLetterGuessState[char] =
            LETTER_GUESS_STATE.ABSENT;
        }
      }
    });

    setLetterGuessState(newLetterGuessState);
    setGridState(newGridState);

    // User did not manage to guess the correct answer.
    if (row + 1 === maxAttempts) {
      setGameState(GAME_STATE.NO_MORE_GUESSES);
      return;
    }

    // Move to next row.
    setPosition([row + 1, -1]);
  }

  function onPressKey(key) {
    // Game has a conclusion.
    if (gameState !== GAME_STATE.IN_PROGRESS) {
      return;
    }

    // Ignore invalid input from user.
    if (!isValidKey(key)) {
      return;
    }

    switch (key) {
      case 'Enter':
        checkWord();
        break;
      case 'Backspace':
        deleteLetter();
        break;
      default:
        addLetter(key);
    }
  }

  useEffect(() => {
    function onKeyDown(event) {
      // Only respond to single key presses.
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      // Ignore enter and space events not triggered on the page level
      // as there could be lower level elements handling them
      // and we don't want to double-handle them.
      if (
        event.target !== document.body &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        return;
      }

      onPressKey(event.key);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <main className="root">
      <h1 className="title">Wordle</h1>
      <GameResult
        gameState={gameState}
        wordOfTheDay={wordOfTheDay}
        onResetClick={() => resetGame()}
      />
      <LetterGrid letters={gridState} />
      <Keyboard
        onPressKey={onPressKey}
        letterGuessState={letterGuessState}
      />
    </main>
  );
}

export default function App() {
  return <Wordle maxAttempts={6} lettersPerWord={5} />;
}

```