Solution
The solution consist of two parts: (1) Canvas and (2) Toolbar.

State
We'll need the following states within the application:

Mode: Whether the app is in drawing or erasing mode.
Selected color: Active color for drawing.
Canvas colors: A 2-d array of color values, representing the pixel art canvas.
Dragging: Whether the cursor is in the dragging state.
The current mode and selected color state can reside within the top-level component while the canvas colors and dragging state is only needed within the canvas.

Toolbar
Rendering the toolbar component is pretty straightforward. The various buttons within the toolbar will update the mode and the selected color.

The only thing to note is to use a non-transparent border for white-color cells and a non-black border when black color is selected.

Canvas
There are many ways to render the canvas, and we have opted to use rows of flexboxes instead of CSS grid (which uses a linear array of cells) here because it's easier to render the alternating background for the empty cells.

We'll add a mousedown listener to the top-level DOM element within the canvas and change the state to be dragging when that happens. When the mouseup even is fired, the dragging state is reset.

The canvas contains many cells and each cell is a pixel that is either empty or filled with a color. The cell listens for two events:

mousedown: Trigger the drawing/erasing of the cell. We want the selected action to be triggered immediately when the mouse is pressed, hence the mousedown event is used as opposed to click.
mouseenter: Trigger the drawing/erasing of the cell. This event is only needed when the canvas is in the dragging state.
Depending on the current mode, the cells grid will be updated with the new color, or the color is erased from the cell.

Inline styles are used for the background color of the cells to allow for easy changing of the hex values without having to create CSS classes for each possible color.

Test cases
Canvas should contain a 15 x 15 grid of cells.
Canvas should not have any colors applied on initial load.
Toolbar should render the mode picker and colorpicker.
Mode picker allows selection of modes.
Colorpicker allows selection of colors. Black and white are rendered fine.
Drawing mode
Clicking once on a Cell while drawing should color that cell.
Dragging over cells while drawing should color those cells with the selected color
Drawing over an already-colored cell with a different color should update the cell with that color.
Erasing mode
Clicking once on a cell while erasing should erase that cell's color.
Clicking and dragging over multiple cells while erasing should remove those cell's colors.
Accessibility
Use <button>s for interactive elements such as the "Draw"/"Erase" buttons, and colorpicker options.
Add aria-labels to the color options button since they have no visible labels.
Since each canvas cell is a <button>, you can Tab through them and use Space to trigger the currently selected action on them. For extra credit, you can add keyboard navigation (up, down, left, right) to easily navigate through the cells, draw with Enter and erase with Backspace.


App
```js
import { useState } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import { Color, Mode } from './colors';

export default function App() {
  const [mode, setMode] = useState<Mode>('draw');
  const [selectedColor, setColor] =
    useState<Color>('black');

  return (
    <div className="app">
      <Canvas selectedColor={selectedColor} mode={mode} />
      <Toolbar
        selectedColor={selectedColor}
        onColorChange={setColor}
        mode={mode}
        onModeChange={setMode}
      />
    </div>
  );
}
```

Canvas
```js
import { useState } from 'react';

import Cell from './Cell';
import { Color, Mode } from './colors';

type Props = Readonly<{
  selectedColor: Color;
  initialRows?: number;
  initialColumns?: number;
  mode: Mode;
}>;

export default function Canvas({
  selectedColor,
  mode,
  initialRows = 15,
  initialColumns = 15,
}: Props) {
  const [grid, setGrid] = useState<(Color | null)[][]>(
    Array.from({ length: initialRows }, () =>
      Array(initialColumns).fill(null),
    ),
  );
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className="grid"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}>
      {grid.map((row, rowIndex) => (
        <div
          className={[
            'grid__row',
            rowIndex % 2 === 0
              ? 'grid__row--even'
              : 'grid__row--odd',
          ].join(' ')}
          key={rowIndex}>
          {row.map((cellColor, cellIndex) => (
            <Cell
              key={cellIndex}
              color={cellColor}
              isDragging={isDragging}
              onMark={() => {
                const newGrid = grid.map((row) => [...row]);
                newGrid[rowIndex][cellIndex] =
                  mode === 'erase' ? null : selectedColor;
                setGrid(newGrid);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

```

Cell
```js
import { COLORS, Color } from './colors';

type Props = Readonly<{
  color: Color | null;
  isDragging: boolean;
  onMark: () => void;
}>;

export default function Cell({
  color,
  isDragging,
  onMark,
}: Props) {
  return (
    <button
      onClick={onMark}
      onMouseDown={onMark}
      onMouseEnter={isDragging ? onMark : undefined}
      style={{
        backgroundColor:
          color != null ? COLORS[color] : undefined,
      }}
      className="grid__cell"
    />
  );
}

```

color
```js
export const COLORS = {
  white: '#fff',
  gray: '#e9ecef',
  black: '#000',
  red: '#cc0001',
  orange: '#fb940b',
  yellow: '#ffff01',
  green: '#01cc00',
  teal: '#38d9a9',
  blue: '#228be6',
  purple: '#7950f2',
  beige: '#ff8787',
} as const;
export type Color = keyof typeof COLORS;

export type Mode = 'draw' | 'erase';
```
toolbar
```js
import { COLORS, Color, Mode } from './colors';

type Props = Readonly<{
  selectedColor: Color;
  onColorChange: (color: Color) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}>;

export default function Toolbar({
  selectedColor,
  onColorChange,
  mode,
  onModeChange,
}: Props) {
  function onColorClick(color: Color) {
    onModeChange('draw');
    onColorChange(color);
  }

  return (
    <div className="toolbar">
      <div>
        <button
          onClick={() => onModeChange('draw')}
          className={[
            'toolbar__mode',
            mode === 'draw' && 'toolbar__mode--selected',
          ]
            .filter(Boolean)
            .join(' ')}>
          Draw
        </button>
        <button
          onClick={() => onModeChange('erase')}
          className={[
            'toolbar__mode',
            mode === 'erase' && 'toolbar__mode--selected',
          ]
            .filter(Boolean)
            .join(' ')}>
          Erase
        </button>
      </div>
      <div className="toolbar__color-picker">
        {Object.entries(COLORS).map(([color, hex]) => (
          <button
            key={color}
            aria-label={color}
            className={[
              'toolbar__color',
              color === selectedColor &&
                'toolbar__color--selected',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              borderColor: (() => {
                if (
                  color !== selectedColor &&
                  color === 'white'
                ) {
                  return '#ccc';
                }

                if (
                  color === selectedColor &&
                  color === 'black'
                ) {
                  return '#fff';
                }
              })(),
              backgroundColor: hex as string,
            }}
            onClick={() => onColorClick(color as Color)}
          />
        ))}
      </div>
    </div>
  );
}
```

```css
body {
  font-family: sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid {
  display: flex;
  flex-direction: column;
}

.grid__row {
  display: flex;
  flex-shrink: 0;
}

.grid__cell {
  --cell-size: 20px;

  height: var(--cell-size);
  width: var(--cell-size);
  border: 0;
  flex-shrink: 0;
  background-color: transparent;
}

.grid__row--even .grid__cell:nth-child(odd),
.grid__row--odd .grid__cell:nth-child(even) {
  background-color: #e9ecef;
}

.toolbar {
  display: flex;
  gap: 20px;
}

.toolbar .toolbar__mode {
  height: 36px;
  background-color: transparent;
  border: 2px solid black;
  font-size: 14px;
}

.toolbar .toolbar__mode--selected {
  background-color: black;
  color: white;
}

.toolbar .toolbar__color-picker {
  display: flex;
}

.toolbar .toolbar__color {
  --size: 20px;

  width: var(--size);
  height: var(--size);
  border: 2px solid transparent;
}

.toolbar .toolbar__color--selected {
  border: 2px solid black;
}

```