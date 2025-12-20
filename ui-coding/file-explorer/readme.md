Given an array of file objects, build a component that displays them in a hierarchical tree format.

There are two types of objects – files and directories:

Files are essentially leaf nodes of the tree, they do not have children.
Directories can contain other objects – either files or directories.
You may assume that the IDs and names within the same directory are unique.

Requirements
The names of the directories/files should be displayed.
Directories
Contents of the directory should be displayed in a manner that indicates it belongs within the directory. The recommended approach is to indent the contents to the right.
Directories can be expanded and collapsed. Clicking on a directory should toggle its expanded/collapsed state.
Directories should appear before files. All the items should be sorted alphabetically within their respective categories.
You may style the expand/collapse functionality in a way you prefer as long as it is clear that the item is a directory and whether it is in the expanded or collapsed state.
Directories can be empty.
Files
Files are not expandable and cannot be interacted with.
The focus of the exercise is on the functionality and not the styling.
Data format

interface FileObject {
  id: number;
  name: string;
  children?: FileObject[];
}
Example data:


const fileData = [
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
];