Solution
We'll build on top of Data Table's solution.

A common follow up question to a paginated data table is to add sorting features, sort the data by the available columns.

State
The new data needed for a data table that allows for sorting is the column to be sorted by and the direction to sort. There are two approaches to represent this configuration:

Single value: Encapsulated within one value (e.g. name-asc, name-desc, etc.).
Two values: Separate out the sort field (e.g. name, age, etc.) and sort direction (asc and desc).
Both approaches are viable but it is probably clearer to have two separate fields.

These state values are set/toggled by clicking on the table headers.

Sorting
We implement a function sortUsers that takes in the the list of users, the current sort field, and sort direction. It will return the list of users sorted by the specified field in that order.

A basic way to do the sorting is to use a switch-case statement for each possible field and implement the sorting logic within the case. Recall that there are two values types within the table – strings for name and occupation, and numbers of id and age. Sorting strings has to be done via String.prototype.toLocaleCompare() and should not be done using the > and < operators.

Just like for pagination where the page number is set to 1 when the page size changes, the page size should also be reset when the sorting field or direction changes.

Integrating with pagination
Sorting has to be done before pagination. Integration is simply sorting the users before passing the sorted user list to paginateUsers().

Both sorting and paginating functions will be called in the render path and the returned users pageUsers is the current page of users to be rendered after taking into account sorting. The rendering code doesn't need to be changed much.

Follow up
Paginating and sorting are just the initial steps of a data table. Data tables can also support:

Filtering on each column/field
Fetching sorted, paginated, and filtered data from a remote API
Consider how easy it is to add new fields:
How many places do you need to change if a new field is to be displayed?
The current component is very coupled to the fields of a user, how can you modify the component to be data agnostic?
What if there are non-textual fields to be displayed?
If you have the time, have a look at TanStack Table to get a sense of what features goes into production-ready data table libraries and how complex data tables can be.

Test cases
Initial data sorting
Test that clicking on a column header sorts the table by that column in ascending order.
Test that clicking on a column header that is already sorted toggles the sorting order.
Sorting by different columns
Test that sorting by various columns works correctly.
Integration with pagination
Test that sorting works correctly with pagination. Clicking on the next button should show next page of results while in the current sorted order.
Changing the sort column should reset the page to the first.

```js
import { useState } from 'react';
import users from './data/users';

type SortField = 'id' | 'name' | 'age' | 'occupation';
type SortDirection = 'asc' | 'desc';
type User = (typeof users)[number];

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Occupation', key: 'occupation' },
] as const;

function sortUsers(
  usersList: Array<User>,
  field: SortField | null,
  direction: SortDirection,
) {
  const usersClone = usersList.slice();

  switch (field) {
    case 'id':
    case 'age': {
      return usersClone.sort((a, b) =>
        direction === 'asc'
          ? a[field] - b[field]
          : b[field] - a[field],
      );
    }
    case 'name':
    case 'occupation': {
      return usersClone.sort((a, b) =>
        direction === 'asc'
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]),
      );
    }
    default: {
      return usersClone;
    }
  }
}

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

  const [sortField, setSortField] =
    useState<SortField | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc');

  const sortedUsers = sortUsers(
    users,
    sortField,
    sortDirection,
  );
  const { totalPages, pageUsers } = paginateUsers(
    sortedUsers,
    page,
    pageSize,
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map(({ label, key }) => (
              <th key={key}>
                <button
                  onClick={() => {
                    if (sortField !== key) {
                      setSortField(key);
                      setSortDirection('asc');
                    } else {
                      setSortDirection(
                        sortDirection === 'asc'
                          ? 'desc'
                          : 'asc',
                      );
                    }
                    setPage(1);
                  }}>
                  {label}
                </button>
              </th>
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

style
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

```js
const users = [
  {
    id: 1,
    name: 'Emily Chen',
    age: 28,
    occupation: 'Software Engineer',
  },
  {
    id: 2,
    name: 'Ryan Thompson',
    age: 32,
    occupation: 'Marketing Manager',
  },
  {
    id: 3,
    name: 'Sophia Patel',
    age: 25,
    occupation: 'Data Analyst',
  },
  {
    id: 4,
    name: 'Michael Lee',
    age: 41,
    occupation: 'CEO',
  },
  {
    id: 5,
    name: 'Olivia Brown',
    age: 29,
    occupation: 'Graphic Designer',
  },
  {
    id: 6,
    name: 'Alexander Hall',
    age: 38,
    occupation: 'Sales Representative',
  },
  {
    id: 7,
    name: 'Isabella Davis',
    age: 26,
    occupation: 'Teacher',
  },
  {
    id: 8,
    name: 'Ethan White',
    age: 35,
    occupation: 'Lawyer',
  },
  {
    id: 9,
    name: 'Lily Tran',
    age: 30,
    occupation: 'Nurse',
  },
  {
    id: 10,
    name: 'Julian Sanchez',
    age: 39,
    occupation: 'Engineer',
  },
  {
    id: 11,
    name: 'Ava Martin',
    age: 27,
    occupation: 'Journalist',
  },
  {
    id: 12,
    name: 'Benjamin Walker',
    age: 42,
    occupation: 'Doctor',
  },
  {
    id: 13,
    name: 'Charlotte Brooks',
    age: 31,
    occupation: 'HR Manager',
  },
  {
    id: 14,
    name: 'Gabriel Harris',
    age: 36,
    occupation: 'IT Consultant',
  },
  {
    id: 15,
    name: 'Hannah Taylor',
    age: 24,
    occupation: 'Student',
  },
  {
    id: 16,
    name: 'Jackson Brown',
    age: 40,
    occupation: 'Business Owner',
  },
  {
    id: 17,
    name: 'Kayla Lewis',
    age: 33,
    occupation: 'Event Planner',
  },
  {
    id: 18,
    name: 'Logan Mitchell',
    age: 37,
    occupation: 'Architect',
  },
  {
    id: 19,
    name: 'Mia Garcia',
    age: 29,
    occupation: 'Artist',
  },
  {
    id: 20,
    name: 'Natalie Hall',
    age: 34,
    occupation: 'Teacher',
  },
  {
    id: 21,
    name: 'Oliver Patel',
    age: 38,
    occupation: 'Software Developer',
  },
  {
    id: 22,
    name: 'Penelope Martin',
    age: 26,
    occupation: 'Writer',
  },
  {
    id: 23,
    name: 'Quinn Lee',
    age: 35,
    occupation: 'Entrepreneur',
  },
  {
    id: 24,
    name: 'Rachel Kim',
    age: 30,
    occupation: 'Dentist',
  },
  {
    id: 25,
    name: 'Samuel Jackson',
    age: 42,
    occupation: 'Lawyer',
  },
  {
    id: 26,
    name: 'Tessa Hall',
    age: 28,
    occupation: 'Graphic Designer',
  },
  {
    id: 27,
    name: 'Uma Patel',
    age: 39,
    occupation: 'Marketing Manager',
  },
  {
    id: 28,
    name: 'Vincent Brooks',
    age: 36,
    occupation: 'IT Consultant',
  },
  {
    id: 29,
    name: 'Walter White',
    age: 41,
    occupation: 'Engineer',
  },
  {
    id: 30,
    name: 'Xavier Sanchez',
    age: 33,
    occupation: 'Sales Representative',
  },
  {
    id: 31,
    name: 'Yvonne Martin',
    age: 29,
    occupation: 'Teacher',
  },
  {
    id: 32,
    name: 'Zoe Lee',
    age: 27,
    occupation: 'Data Analyst',
  },
  {
    id: 33,
    name: 'Abigail Brown',
    age: 34,
    occupation: 'Nurse',
  },
  {
    id: 34,
    name: 'Caleb Harris',
    age: 38,
    occupation: 'Business Owner',
  },
  {
    id: 35,
    name: 'Diana Taylor',
    age: 31,
    occupation: 'Event Planner',
  },
  {
    id: 36,
    name: 'Eleanor Walker',
    age: 40,
    occupation: 'CEO',
  },
];

export default users;

```

