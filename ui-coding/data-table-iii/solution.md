Solution
We'll build on top of Data Table II's solution.

While a refactoring question will probably not be asked verbatim during interviews, there is a lot of learning value from this exercise.

You can also build your data tables in a similar fashion from the start so that it can be easily extended for the new requirements.

Decoupling the component
Notice that the header columns have already been declared as an array. We can use that as a base. Let's look at which parts of the DataTable are still coupled to user data:

sortUsers function
paginateUsers function
Rendering table cells
An important concept to be aware of in order to refactor is first-class functions – the idea of writing functions as variables to be passed around and called from elsewhere. This enables data-specific logic to live outside of the DataTable component.

sortUsers function
The sortUsers function is extremely coupled to the user data. However, upon a closer look, notice that the branches in the function correspond to each column and the only unique thing about each column is the comparator function.

We can define a comparator function for each column and have the sortData function (renamed from sortUsers) call into the column's comparator function. The comparator function returns a number that is used to determine the relative position of two items in the data array. Each column can define custom sorting logic within it, be it comparing numbers or strings.

paginateUsers function
This function is not coupled to user data at all. It does not care about the shape of the data, only the total size and the page size. Generalizing this function is straightforward.

Rendering table cells
At the current stage, rendering each row's data is straightforward – just textual/numerical data that needs no special formatting. However, in future there could be other types of data like images, or special formatting requirements.

Like the comparator function, a renderCell() first-class function can be defined for each column, that determines how to render the cell data for that column.

Extracting the data and columns and configuration
Now that we have managed to generalize the necessary portions of DataTable, we can move the data and columns out of the component and pass them in as props.

If the users data contains a new field, we simply have to add in a new item into the columns configuration to enable displaying within the table and sorting by that column.

To demonstrate the flexibility of the DataTable component, we have also used it to render houses data.

Follow up
Now that we have a generalized data table that supports paginating and sorting, take a moment to consider how the following features can be implemented:

Filtering on each column/field
Fetching sorted, paginated, and filtered data from a remote API
Have a look at TanStack Table to get a sense of what features goes into production-ready data table libraries and how complex data tables can be.

Test cases
Ensure that all the existing features still work as usual.
Test with housing data and check that the table can be rendered, pagination and sorting functionality works correctly.

App
```js
import DataTable, {
  Columns,
  SortDirection,
} from './DataTable';
import users from './data/users';
import houses from './data/houses';

type User = (typeof users)[number];
const userColumns: Columns<User> = [
  {
    label: 'ID',
    key: 'id',
    renderCell: (user: User) => user.id,
    comparator: (
      a: User,
      b: User,
      direction: SortDirection,
    ) => (direction === 'asc' ? a.id - b.id : b.id - a.id),
  },
  {
    label: 'Name',
    key: 'name',
    renderCell: (user: User) => user.name,
    comparator: (
      a: User,
      b: User,
      direction: SortDirection,
    ) =>
      direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
  },
  {
    label: 'Age',
    key: 'age',
    renderCell: (user: User) => user.age,
    comparator: (
      a: User,
      b: User,
      direction: SortDirection,
    ) =>
      direction === 'asc' ? a.age - b.age : b.age - a.age,
  },
  {
    label: 'Occupation',
    key: 'occupation',
    renderCell: (user: User) => user.occupation,
    comparator: (
      a: User,
      b: User,
      direction: SortDirection,
    ) =>
      direction === 'asc'
        ? a.occupation.localeCompare(b.occupation)
        : b.occupation.localeCompare(a.occupation),
  },
];

type House = (typeof houses)[number];
const houseColumns: Columns<House> = [
  {
    label: 'ID',
    key: 'id',
    renderCell: (house: House) => house.id,
    comparator: (
      a: House,
      b: House,
      direction: SortDirection,
    ) => (direction === 'asc' ? a.id - b.id : b.id - a.id),
  },
  {
    label: 'Street',
    key: 'street',
    renderCell: (house: House) => house.street,
    comparator: (
      a: House,
      b: House,
      direction: SortDirection,
    ) =>
      direction === 'asc'
        ? a.street.localeCompare(b.street)
        : b.street.localeCompare(a.street),
  },
  {
    label: 'City',
    key: 'city',
    renderCell: (house: House) => house.city,
    comparator: (
      a: House,
      b: House,
      direction: SortDirection,
    ) =>
      direction === 'asc'
        ? a.city.localeCompare(b.city)
        : b.city.localeCompare(a.city),
  },
  {
    label: 'State',
    key: 'state',
    renderCell: (house: House) => house.state,
    comparator: (
      a: House,
      b: House,
      direction: SortDirection,
    ) =>
      direction === 'asc'
        ? a.state.localeCompare(b.state)
        : b.state.localeCompare(a.state),
  },
  {
    label: 'Built Year',
    key: 'built_year',
    renderCell: (house: House) => house.built_year,
    comparator: (
      a: House,
      b: House,
      direction: SortDirection,
    ) =>
      direction === 'asc'
        ? a.built_year - b.built_year
        : b.built_year - a.built_year,
  },
];

export default function App() {
  return (
    <div>
      <h2>Users</h2>
      <DataTable data={users} columns={userColumns} />
      <br />
      <h2>Houses</h2>
      <DataTable data={houses} columns={houseColumns} />
    </div>
  );
}

```

DataTable
```js
import { useState } from 'react';

export type SortDirection = 'asc' | 'desc';
type ColumnDef<T> = Readonly<{
  label: string;
  key: string;
  renderCell: (row: T) => React.ReactNode;
  comparator: (
    a: T,
    b: T,
    sortDirection: SortDirection,
  ) => number;
}>;
export type Columns<T> = ReadonlyArray<ColumnDef<T>>;

function sortData<T>(
  data: Array<T>,
  columns: Columns<T>,
  field: string | null,
  direction: SortDirection,
) {
  const dataClone = data.slice();
  const comparator = columns.find(
    (column) => column.key === field,
  )?.comparator;

  if (comparator == null) {
    return dataClone;
  }

  return dataClone.sort((a, b) =>
    comparator(a, b, direction),
  );
}

function paginateData<T>(
  data: Array<T>,
  page: number,
  pageSize: number,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const pageData = data.slice(start, end);
  const maxPages = Math.ceil(data.length / pageSize);
  return { pageData, maxPages };
}

export default function DataTable<
  T extends { id: number },
>({
  data,
  columns,
}: Readonly<{
  data: Array<T>;
  columns: Columns<T>;
}>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<string | null>(
    null,
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc');

  // Processing of data.
  const sortedData = sortData(
    data,
    columns,
    sortField,
    sortDirection,
  );
  const { maxPages, pageData } = paginateData(
    sortedData,
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
          {pageData.map((item) => (
            <tr key={item.id}>
              {columns.map(({ key, renderCell }) => (
                <td key={key}>{renderCell(item)}</td>
              ))}
            </tr>
          ))}
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
          {maxPages === 0 ? (
            <span>0 pages</span>
          ) : (
            <span aria-label="Page number">
              Page {page} of {maxPages}
            </span>
          )}
          <button
            disabled={page === maxPages}
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