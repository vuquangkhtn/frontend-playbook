Solution
With most data fetching and display problems, the solution can be broken down into:

Fetching data.
Processing the data, if necessary.
Displaying the data.
Fetching data
The API end point returns a list of years in a text format:


1996
1966
1973
1975
1985
2006
2004
...
It's returned as a single string, so we need to split the data up into an array and turn them into numbers.

Processing the data
The requirement is to show a histogram of birth years grouped by decades. Now that we have a list of numbers, we need to do some processing with them to turn a year value into it's corresponding bucket. E.g. 1955 -> 1950, 1967 -> 1960.

This can be done via:

Dividing by 10, removing the decimal place with Math.floor(), and multiplying by 10 again.
Modulo by 10 and remove the result.
Both approaches will correctly calculate the decade for a year.

This is done for every year value and we can use an object to tally the count for each decade bucket.

Displaying the data
This is possibly the trickiest part of this problem as we have to draw bars that are proportionate to the value it's supposed to represent. The bucket with the biggest value will be the tallest bar.

We can divide the histogram into three rectangles:

Y-axis: This renders the count for each bucket. Since there are 200 data points spread across 7 decades, there's an average of 30+ points for each bucket, and a scale of 10 points would give enough details to be useful. The maximum y-axis value is the maximum bucket count value rounded up to the nearest 10.
X-axis: This renders the decade labels, spaced apart.
Data series: This renders the vertical bars, spaced apart. We also need to draw the left and bottom borders for the lines on the y-axis and x-axis respectively. The vertical bars are sized using a percentage height of the maximum y-axis value.
Note that the space between the x-axis and data series should be consistent so that the labels of the x-axis are directly aligned with the data bars.

Race conditions
As with all data fetching questions, take care of handling race conditions and handle errors if the request fails.

Test cases
Data should be fetched from an endpoint
Data should be displayed in a histogram
Axes should be labeled with the correct numbers
Bars should be rendered correctly

```js
import { useEffect, useState } from 'react';

const COUNT = 200;
const MIN = 1950;
const MAX = 2019;
const BUCKET_SIZE = 10;
const Y_AXIS_SCALE = 10;

// Extract out the fetching of numbers.
async function fetchYearsData() {
  const response = await fetch(
    `https://www.random.org/integers/?num=${COUNT}&min=${MIN}&max=${MAX}&col=1&base=10&format=plain&rnd=new`,
  );

  const numbersString = await response.text();
  return (
    numbersString
      .split('\n')
      .filter(Boolean)
      // Converts strings into numbers.
      .map((number) => +number)
  );
}

// Group array of years into decade buckets.
function groupIntoBuckets(years) {
  const frequency = {};

  years.forEach((year) => {
    const bucket =
      Math.floor(year / BUCKET_SIZE) * BUCKET_SIZE;
    frequency[bucket] ||= 0; // Initialize to 0 if undefined or falsy
    frequency[bucket]++;
  });

  return frequency;
}

export default function App() {
  // Object of year bucket to number of data points in that bucket.
  const [bucketFrequency, setBucketFrequency] = useState(
    {},
  );

  async function fetchData() {
    const yearsData = await fetchYearsData();
    const frequency = groupIntoBuckets(yearsData);

    setBucketFrequency(frequency);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const maxBucketFrequency = Math.max(
    0,
    ...Object.values(bucketFrequency),
  );
  const maxYAxisValue = Math.min(
    Math.ceil(maxBucketFrequency / Y_AXIS_SCALE) *
      Y_AXIS_SCALE,
    COUNT,
  );

  const bucketLabels = Array.from({
    length: Math.ceil((MAX - MIN) / BUCKET_SIZE),
  }).map((_, index) => MIN + index * BUCKET_SIZE);

  return (
    <div className="wrapper">
      <div className="chart">
        <div className="chart__y-axis">
          <div className="chart__y-axis__items">
            {Array.from({
              length: maxYAxisValue / Y_AXIS_SCALE,
            }).map((_, index) => (
              <div
                key={index}
                className="chart__y-axis__item">
                {(index + 1) * Y_AXIS_SCALE}
              </div>
            ))}
          </div>
          <div className="chart__y-axis__zero">0</div>
        </div>
        <div className="chart__main">
          <div className="chart__main__bars">
            {bucketLabels.map((bucket) => (
              <div
                key={bucket}
                className="chart__main__bars__item"
                style={{
                  height: `${
                    ((bucketFrequency[bucket] ?? 0) /
                      maxYAxisValue) *
                    100
                  }%`,
                }}
              />
            ))}
          </div>
          <div className="chart__x-axis">
            {bucketLabels.map((bucket) => (
              <div
                className="chart__x-axis__item"
                key={bucket}>
                {bucket}
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={fetchData}>Refresh</button>
    </div>
  );
}

```


```css
body {
  font-family: sans-serif;
  margin: 0;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.chart {
  --chart-width: 100%;
  --chart-height: 300px;
  --axis-color: #000;
  --bar-color: rebeccapurple;
  --bars-gap: 16px;

  display: flex;
  max-width: 600px;
  width: var(--chart-width);
  height: var(--chart-height);
}

.chart__y-axis {
  width: 40px;
  display: flex;
  flex-direction: column;
}

.chart__y-axis__items {
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  border-right: 1px solid var(--axis-color);
  margin-bottom: 8px;
  align-items: center;
}

.chart__y-axis__item {
  flex-grow: 1;
  transform: translateY(-8px);
}

.chart__y-axis__zero {
  text-align: center;
  transform: translateY(-16px);
}

.chart__main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart__main__bars {
  display: flex;
  flex-grow: 1;
  align-items: flex-end;
  border-bottom: 1px solid var(--axis-color);
  gap: var(--bars-gap);
  padding: 0 var(--bars-gap);
}

.chart__main__bars__item {
  background-color: var(--bar-color);
  flex-grow: 1;
}

.chart__x-axis {
  display: flex;
  gap: var(--bars-gap);
  justify-content: space-around;
  padding: 0 var(--bars-gap);
}

.chart__x-axis__item {
  flex-grow: 1;
  flex-basis: 0%;
  text-align: center;
}

```