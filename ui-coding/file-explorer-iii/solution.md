Solution
We'll build on top of File Explorer's solution.

Returning fragments
The main change is to return fragments instead of <ul>. The root <ul> is rendered by the FileExplorer component and FileObject and FileList should return fragments and rendered as direct children of the <ul> in FileExplorer.

Rendering indentation
The amount of left padding to use for each indentation level can be determined by the level prop – multiply the level (subtract one first) by the indentation width.

Test cases
The resulting DOM should be similar to the following. Notice that there's a single <ul> with a flat layer of <li>.


<ul>
  <li style="padding-left: 0px;">
    <button><span>Documents</span> [-]</button>
  </li>
  <li style="padding-left: 16px;">
    <button>
      <span>Powerpoint.ppt</span>
    </button>
  </li>
  <li style="padding-left: 16px;">
    <button>
      <span>Word.doc</span>
    </button>
  </li>
  <li style="padding-left: 0px;">
    <button><span>Downloads</span> [-]</button>
  </li>
  <li style="padding-left: 16px;">
    <button><span>Misc</span> [-]</button>
  </li>
  <li style="padding-left: 32px;">
    <button>
      <span>bar.txt</span>
    </button>
  </li>
  <li style="padding-left: 32px;">
    <button>
      <span>foo.txt</span>
    </button>
  </li>
  <li style="padding-left: 16px;">
    <button>
      <span>unnamed.txt</span>
    </button>
  </li>
  <li style="padding-left: 0px;">
    <button>
      <span>README.md</span>
    </button>
  </li>
</ul>

Try out the solution

```js
import FileExplorer from './FileExplorer';

export default function App() {
  const data = [
    {
      id: 1,
      name: 'README.md',
    },
    {
      id: 2,
      name: 'Documents',
      children: [
        {
          id: 3,
          name: 'Word.doc',
        },
        {
          id: 4,
          name: 'Powerpoint.ppt',
        },
      ],
    },
    {
      id: 5,
      name: 'Downloads',
      children: [
        {
          id: 6,
          name: 'unnamed.txt',
        },
        {
          id: 7,
          name: 'Misc',
          children: [
            {
              id: 8,
              name: 'foo.txt',
            },
            {
              id: 9,
              name: 'bar.txt',
            },
          ],
        },
      ],
    },
  ];

  return <FileExplorer data={data} />;
}

```

```js
import { useState } from 'react';
import FileList from './FileList';

export type FileData = Readonly<{
  id: number;
  name: string;
  children?: ReadonlyArray<FileData>;
}>;

export default function FileExplorer({
  data,
}: Readonly<{ data: ReadonlyArray<FileData> }>) {
  return (
    <ul className="file-list">
      <FileList fileList={data} level={1} />
    </ul>
  );
}

export function FileObject({
  file,
  level,
}: Readonly<{
  file: FileData;
  level: number;
}>) {
  const [expanded, setExpanded] = useState(false);
  const { children: fileChildren, name: fileName } = file;
  // If the children field is present, the item is a directory.
  const isDirectory = Boolean(fileChildren);

  return (
    <>
      <li
        className="file-item"
        style={{
          paddingLeft: (level - 1) * 16,
        }}>
        <button
          className={[
            'file-item-button',
            isDirectory && 'file-item-button--directory',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            if (!isDirectory) {
              return;
            }

            setExpanded(!expanded);
          }}>
          <span>{fileName}</span>{' '}
          {isDirectory && <>[{expanded ? '-' : '+'}]</>}
        </button>
      </li>
      {fileChildren &&
        fileChildren.length > 0 &&
        expanded && (
          <FileList
            fileList={fileChildren}
            level={level + 1}
          />
        )}
    </>
  );
}

```

```js
import { FileObject, FileData } from './FileExplorer';

export default function FileList({
  fileList,
  level,
}: Readonly<{
  fileList: ReadonlyArray<FileData>;
  level: number;
}>) {
  const directories = fileList.filter(
    (fileItem) => fileItem.children,
  );
  directories.sort((a, b) => a.name.localeCompare(b.name));

  const nonDirectories = fileList.filter(
    (fileItem) => !fileItem.children,
  );
  nonDirectories.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const items = [...directories, ...nonDirectories];

  return (
    <>
      {items.map((file) => (
        <FileObject
          key={file.id}
          file={file}
          level={level}
        />
      ))}
    </>
  );
}

```

```css
body {
  font-family: sans-serif;
}

.file-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.file-item {
  padding: 0;
}

.file-item-button {
  background-color: transparent;
  border: none;
  line-height: 1.5;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}

.file-item-button--directory {
  display: flex;
  gap: 4px;
  font-weight: bold;
}

```