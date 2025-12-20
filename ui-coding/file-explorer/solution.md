Solution
File explorers are usually implemented in a tree-like navigation fashion and are hierarchical and recursive in nature.

Components
In terms of front end components, recursion means that the components can be rendering itself, or render a component that renders itself. Hence it's important to design the recursive components well to allow for reusability.

There are two distinct types of components here:

FileObject: It accepts a FileData prop and renders the item name. Depending on whether the item is a directory, based on the presence of the children field, it can render the FileList component. If the item is a directory, the item can be toggled. The state of whether the children items are shown will also be contained within this file.
FileList: It accepts an array of FileDatas and maps each of them to render FileObject components. This component also sorts the list of items alphabetically and for the directories to come first.
Strictly speaking, we could combine FileList into FileObject so there is no need for two different components, but that'd make FileObject quite complicated as it will also contain the ordering logic.

Rendering
There are two common ways to render tree-like structures:

1. Nested structure
The most intuitive approach is to use a nested elements approach where each parent node renders left paddings so that child items are indented. It is similar to having nested <ul>s and <li>s.


<ul>
  <li>
    <div>docs</div>
    <ul>
      <li>foo.md</li>
      <li>bar.md</li>
    </ul>
  </li>
  <li>
    <div>README.md</div>
  </li>
</ul>
The advantage of this approach is that indentation for children is simpler to implement. Each level's indentation is a result of the sum of the previous level's left padding. Additionally, if there's a need to remove a directory and all its descendants, the removal can be done by deleting a single node for that directory, as its descendants are contained within it.

However, if there are DOM operations needed, then traversing the DOM will be more troublesome due to the need to traverse among inner components.

This nested approach is used by Figma's workspace layers panel and [GitHub's file explorer view](https://github.com/yangshun/top-javascript-interview-questions/tree/main/questions).

2. Flat structure
The other possible structure is having a single flat list of items and add the right amount of padding for descendant items. While recursing, the current level will need to be passed as an argument so that the descendant items know what how much padding to render.


<!-- The bullets will have to be hidden as 
 they will still be flushed to the left. -->
<ul>
  <li>docs</li>
  <li style="padding-left: 16px">foo.md</li>
  <li style="padding-left: 16px">bar.md</li>
  <li>README.md</li>
</ul>
A single flat list of DOM elements is easier to traverse. Also, this flat approach provides the most control over the rendering and allows for virtualized items in large directories that contain many files. Virtualization is not easy to achieve using a nested structure because in order for items to be indented by the right amount, their parents have to be rendered as well – a nested structure makes it hard or even impossible to render only the minimal items that need to be displayed.

However, if there's a need to remove a directory and all its descendants, the right nodes have to be selected for removal.

This flat approach is used by VS Code because of the need to handle large amount of files. In fact, VS Code uses position: absolute; left: Xpx; top: Ypx; along with a flat list for positioning and it only renders the visible file items.

Choosing the approach
The approach to use depends on the apps' technology stack and amount of items to be rendered. If the component is built for small directories and using vanilla JavaScript with lots of manual DOM manipulation, then the nested structure could be easier to implement. Otherwise, the flat structure is recommended for the reasons of flexibility and scalability.

The official solution implements the nested structure since it is the most commonly found. During interviews, it is expected that candidates implement the nested structure version. However, you should know about the benefits and limitations of each approach so that you can elaborate when asked.

Regardless of nested or flat structure, an important thing that should not be missed is accessibility of the component. To stand out in your interviews, you should discuss the accessibility aspects of the file explorer. They are covered in the File Explorer II question.

Test cases
Rendering:
Verify that the component renders without errors
Check that all file and directory names are displayed correctly
Ensure directories are displayed before files
Confirm that items within each directory are sorted alphabetically
Directory expansion/collapse:
Test expanding a directory by clicking on it
Test collapsing an expanded directory by clicking on it again
Verify that the expand/collapse indicator changes appropriately
Test expanding/collapsing nested directories
Indentation:
Check that contents of directories are indented correctly
Verify that nested directories have appropriate levels of indentation
File interaction:
Confirm that files are not expandable or interactive
Empty directories:
Test rendering of empty directories
Verify that empty directories can still be expanded/collapsed
Sorting:
Confirm that directories appear before files in each level
Verify alphabetical sorting within directories and files separately
State persistence:
Check if expanded/collapsed state of directories persists when re-rendering

Accessibility
Accessibility is important for a good File Explorer component. The [ARIA Authoring Practices Guide for Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview) has a long list of guidelines for the ARIA roles, states, and properties to add to the various elements of a Tree View. We recommend working on File Explorer II and get to know about the accessibility criteria of a Tree View component.

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
    <div>
      <FileList fileList={data} level={1} />
    </div>
  );
}

export function FileObject({
  file,
  level,
}: Readonly<{ file: FileData; level: number }>) {
  const [expanded, setExpanded] = useState(false);
  const { children: fileChildren, name: fileName } = file;
  // If the children field is present, the item is a directory.
  const isDirectory = Boolean(fileChildren);

  return (
    <li className="file-item">
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
      {fileChildren &&
        fileChildren.length > 0 &&
        expanded && (
          <FileList
            fileList={fileChildren}
            level={level + 1}
          />
        )}
    </li>
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
    <ul className="file-list">
      {items.map((file) => (
        <FileObject
          key={file.id}
          file={file}
          level={level}
        />
      ))}
    </ul>
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
  padding-left: 16px;
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