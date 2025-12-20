Solution
We'll build on top of Data Table III's solution.

In Data Table III, the DataTable implementation was generalized and no longer contains any code that is specific to users data. We need to preserve this generalization when extending the component with filtering functionality.

There are a few things that need to be done:

Add column-specific filter input UI in the header cell
Store the filter input state
Allow the DataTable component to read the filter inputs state and use it when filtering data. Filtering has to be done before sorting and pagination occurs.
There are a few ways to design the new fields to be added to the column definitions to enable filtering:

Simple configuration, but not as flexible
More configuration needed, but more flexible
Provide default configuration but also allow flexibility
1. Simple configuration, but not as flexible
This method involves adding a filterType string property to the column definitions that is either string or range. That is all that is needed from an external API perspective. The complexity will be within the DataTable component – it has to render the various filters inputs and use them when processing the data for presentation.

The header cells are rendered by iterating over the column definitions. The addition here is to render the appropriate filter input depending on the filterType value.
When the filter input value changes, store the filter values as state within the DataTable component in an object called filters. The key of the filters object is a unique identifier of the column (we can use the key field of the column) and the value is filter data associated with that column's filter input. Each filter type has its own format:
string: Stores a single value representing the string to filter: { type: 'string'; value: string | null; }
range: Store two numeric values, the max and min value of the range: { type: 'range'; max?: number | null; min?: number | null; }
Create a filterData function that takes in the data and filters state. For each row of data, iterate through the filters object and only keep the rows that pass all the filter checks.
This approach is very easy to use as the API surface is small, but notice that there's more code baked into DataTable:

We're rendering the same filter input UI depending on filterType; the filter inputs cannot be customized. Customization is sometimes useful, e.g. if the placeholder has to be customized, or using your own input UI components.
The filtering logic is also contained within DataTable, which is a case-insensitive substring match for strings, and a range match for numbers. The filtering logic cannot be customized.
The solution uses this approach, and it is probably robust enough for interviews. Next, we can look at an alternative approach that is more flexible, but requires more configuration.

2. More configuration needed, but more flexible
This method involves adding a few function fields to the column definition that contains filtering logic. The DataTable component will call these function when rendering the filter inputs and filtering the matching rows. The filter value state can be the same as per approach 1 – filters object with keys as column keys and value as the column-specific filter data.

renderFilter(filterValue, setFilterValue): A function that renders the filter input. It takes in the current filterValue and a setFilterValue function. The function should return UI that displays the filterValue and responds to user inputs by calling setFilterValue, which will persist the filter state for that column within DataTable.
matchesFilter(value, filterValue): A function that determines if the value matches the filter. It takes in the column's value for the row and the filterValue and the developer is left to implement their own matching logic.
With this approach, maximum flexibility is given – the developer is given full control over the rendering and the matching logic. However, there can be quite a bit of repetition if a similar matching logic is used for all string-based fields. This approach is similar to the comparator function used for sorting.

3. Default configuration, with flexibility
A hybrid solution is to allow for both simple and advanced configuration options. For each column, if the renderFilter and/or matchesFilter field is defined, invoke them for rendering/filtering, otherwise use the default as per the simple approach.

If you're interested, modify the solution to use this hybrid approach.

Follow up
Now that we have a generalized data table that supports paginating, sorting, and filtering. The next logical extension is to fetch the data from a remote API.

When fetching data from a remote API, the server will be in-charge of doing the paginating, sorting, filtering, so the DataTable component does not need to include these processing logic anymore. The only thing the component needs to do is to collect user input (current page, page size, sorting field, sorting direction, filters state), call the API with these options, then present the results.

Have a look at TanStack Table to get a sense of what features goes into production-ready data table libraries and how complex data tables can be.

Test cases
Filtering
Text inputs
Enter some strings in lower case, check that results match the search string
Delete the entered values, check that the full results are displayed again
Range inputs
Enter only a min value, check that the results are all larger
Enter only a max value, check that the results are all smaller
Enter both min and max values, check that the results are within the min/max boundaries
Ensure that all the existing features (pagination and sorting) still work as usual, with and without filters
Test with housing data and check that the table can be rendered, pagination, sorting, and filtering functionality works correctly


HeaderFilterInput
```js
import { useState } from 'react';
import HeaderFilterInput, {
  Filters,
} from './HeaderFilterInput';

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
  filterType: 'string' | 'range' | null;
}>;
export type Columns<T> = ReadonlyArray<ColumnDef<T>>;

function filterData<T>(data: Array<T>, filters: Filters) {
  return data.filter((row) =>
    Object.entries(filters)
      .map(([key, filterPayload]) => {
        // Note: Admittedly this is not-typesafe.
        const value = (row as any)[key];

        switch (filterPayload.type) {
          case 'string': {
            if (
              filterPayload.value == null ||
              filterPayload.value === ''
            ) {
              return true;
            }

            return (
              (value as string)
                .toLocaleLowerCase()
                .indexOf(
                  filterPayload.value.toLocaleLowerCase(),
                ) !== -1
            );
          }
          case 'range': {
            // Smaller than min value.
            if (
              filterPayload.min != null &&
              value < filterPayload.min
            ) {
              return false;
            }

            // Larger than max value.
            if (
              filterPayload.max != null &&
              value > filterPayload.max
            ) {
              return false;
            }

            return true;
          }
        }
      })
      .every((result) => result),
  );
}

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
  const [filters, setFilters] = useState<Filters>({});

  // Processing of data.
  const filteredData = filterData(data, filters);
  const sortedData = sortData(
    filteredData,
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
            {columns.map(({ label, key, filterType }) => (
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
                {/* Filter inputs */}
                {filterType && (
                  <HeaderFilterInput
                    field={key}
                    filterType={filterType}
                    filters={filters}
                    onFilterChange={(newFilters) => {
                      setFilters(newFilters);
                      setPage(1);
                    }}
                  />
                )}
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
      {/* Filters state to help visualize */}
      <pre className="filter__debug">
        {JSON.stringify(filters, null, 2)}
      </pre>
    </div>
  );
}

```

DataTable.ts
```ts
import { useState } from 'react';
import HeaderFilterInput, {
  Filters,
} from './HeaderFilterInput';

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
  filterType: 'string' | 'range' | null;
}>;
export type Columns<T> = ReadonlyArray<ColumnDef<T>>;

function filterData<T>(data: Array<T>, filters: Filters) {
  return data.filter((row) =>
    Object.entries(filters)
      .map(([key, filterPayload]) => {
        // Note: Admittedly this is not-typesafe.
        const value = (row as any)[key];

        switch (filterPayload.type) {
          case 'string': {
            if (
              filterPayload.value == null ||
              filterPayload.value === ''
            ) {
              return true;
            }

            return (
              (value as string)
                .toLocaleLowerCase()
                .indexOf(
                  filterPayload.value.toLocaleLowerCase(),
                ) !== -1
            );
          }
          case 'range': {
            // Smaller than min value.
            if (
              filterPayload.min != null &&
              value < filterPayload.min
            ) {
              return false;
            }

            // Larger than max value.
            if (
              filterPayload.max != null &&
              value > filterPayload.max
            ) {
              return false;
            }

            return true;
          }
        }
      })
      .every((result) => result),
  );
}

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
  const [filters, setFilters] = useState<Filters>({});

  // Processing of data.
  const filteredData = filterData(data, filters);
  const sortedData = sortData(
    filteredData,
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
            {columns.map(({ label, key, filterType }) => (
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
                {/* Filter inputs */}
                {filterType && (
                  <HeaderFilterInput
                    field={key}
                    filterType={filterType}
                    filters={filters}
                    onFilterChange={(newFilters) => {
                      setFilters(newFilters);
                      setPage(1);
                    }}
                  />
                )}
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
      {/* Filters state to help visualize */}
      <pre className="filter__debug">
        {JSON.stringify(filters, null, 2)}
      </pre>
    </div>
  );
}

```

App.ts
```ts
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
    filterType: null,
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
    filterType: 'string',
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
    filterType: 'range',
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
    filterType: 'string',
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
    filterType: null,
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
    filterType: 'string',
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
    filterType: 'string',
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
    filterType: 'string',
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
    filterType: 'range',
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

.filter-input {
  margin-top: 4px;
}

.filter-input input {
  width: 100px;
}

.filter-input--range {
  display: flex;
  gap: 8px;
}

.filter-input--range input {
  width: 40px;
}

.filter__debug {
  background-color: #eaeaea;
  padding: 8px;
  font-family: monospace;
}

```