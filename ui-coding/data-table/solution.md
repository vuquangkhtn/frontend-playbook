Solution
Data tables are frequently asked during front end interviews as displaying paginated data with filtering functionality is a UI built at almost every company.

Since the table skeleton has been provided, we can focus on the state and data manipulation aspects of the data table.

State
State is straightforward. Only two state values are needed, the current page and the page size. Since the data does not change in this case, there's no need for the users data to be part of state.

These state values are manipulated by the page size <select> and prev/next buttons.

The maximum number of pages can be derived from the number of users divided by the page size, hence it does not need to be part of state.

Pagination
We implement a function paginateUsers that takes in the the list of users, the page number, and the page size. It will return the list of users for the current page and the total number of pages.

To determine the list of users for the current page, we can determine the start and end indices, then use Array.prototype.slice() to extract the appropriate slice out of the users list:

Start index: Take the page number multiplied by the page size. Since the page numbers start from 1, we have to subtract 1 from the page number first. This value will the starting index of the users to be sliced.
End index: Add the page size to the calculated start index. Since we'll be using Array.prototype.slice(), it doesn't matter if the end index exceeds the size of the list.
paginateUsers() will be called in the render path and the returned users pageUsers is the current page of users to be rendered. The rendering code doesn't need to be changed much.

User experience
Some other user experience improvements we can make:

Reset the page number to the first page when the page size changes. Otherwise it can be confusing when the user changes the page size and the current page exceeds the total pages and nothing is shown.
Disable the Prev/Next buttons when it is not possible to navigate to the previous or next page.
Test cases
Table
Test that the table displays the following columns: Id, Name, Age, Occupation.
Test that each row in the table represents a single user.
The table updates to display users on the next page.
Pagination
Test that the pagination control allows navigation to the previous page.
Test that the pagination control allows navigation to the next page.
Test that the pagination controls display the current page number and the total number of pages.
Test that the page buttons are disabled appropriately.
Dynamic table updates
Test that the table updates dynamically when the user navigates to a different page.
Navigate to a different page using the pagination controls. The table should reflect the users for the selected page.
Change the selection to 5, 10, and 20 users per page. The table should update to display the selected number of users per page.

```js
import { useState } from 'react';
import users from './data/users';

type User = (typeof users)[number];

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Occupation', key: 'occupation' },
] as const;

function paginateUsers(
  usersList: Array<User>,
  page: number,
  pageSize: number,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pageUsers = usersList.slice(start, end);
  const totalPages = Math.ceil(usersList.length / pageSize);
  return { pageUsers, totalPages };
}

export default function DataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { totalPages, pageUsers } = paginateUsers(
    users,
    page,
    pageSize,
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageUsers.map(
            ({ id, name, age, occupation }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{age}</td>
                <td>{occupation}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <hr />
      <div className="pagination">
        <select
          aria-label="Page size"
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}>
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        <div className="pages">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
            }}>
            Prev
          </button>
          <span aria-label="Page number">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => {
              setPage(page + 1);
            }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

```

```css
body {
  font-family: sans-serif;
}

table {
  border-collapse: collapse;
  font-size: 14px;
}

td,
th {
  padding: 4px;
  border-bottom: 1px solid #ddd;
  text-align: start;
}

th {
  vertical-align: top;
}

th button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.pagination {
  display: flex;
  font-size: 14px;
  gap: 12px;
}

.pages {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

```