Solution
The most widely-supported solution is a Flexbox-based one. It has great browser support and is easiest to understand. A Grid-based approach is also getting popular these days but isn't as well-supported as Flexbox.

There are a few main parts to achieving the specifications using flexbox. Let's dive into each.

Sticky footer
The Holy Grail layout problem also encompasses another classic problem: making a footer stick to the bottom of the screen when there is not enough content to fill up the page.

This can be solved by adding min-height: 100vh to the container of the page's contents. Since the direct children will be laid out in a vertical fashion, we add display: flex and flex-direction: column to that element as well.

The header and footers are fixed heights and the columns are variable height and is meant to fill up any remaining space. To achieve this, flex-grow: 1 is added to the <div> wrapping the columns.

Columns
The requirement to make all the columns equal-height is also trivially solved with Flexbox. By adding display: flex to the div wrapper of the columns, this requirement is met.

Like before, the flexible-width <main> content section can be achieved using flex-grow: 1 and it will fill up any horizontal space available.

flex-shrink: 0 has to be added to <nav> and <aside> so that they don't shrink when the content in <main> is too wide.

Test cases
Test variable width: the navigation and sidebar columns should be fixed width and the middle column is fluid and fills up any remaining space.
Test variable height: the header and footer rows should be fixed width and the footer should always be at the bottom of the window.
Test lots of content within main. It should not cause the nav and aside to shrink.
Notes
There are multiple ways to implement the Holy Grail layout. It'd be good practice to try out a Grid-based approach as well as it might become the de facto solution in future.

```js
export default function App() {
  return (
    <>
      <header>Header</header>
      <div className="columns">
        <nav>Navigation</nav>
        <main>Main</main>
        <aside>Sidebar</aside>
      </div>
      <footer>Footer</footer>
    </>
  );
}

```

```css
body {
  font-family: sans-serif;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  min-height: 100vh;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

header,
nav,
main,
aside,
footer {
  padding: 12px;
  text-align: center;
}

header {
  background-color: tomato;
  height: 60px;
}

.columns {
  display: flex;
  flex-grow: 1;
}

nav {
  background-color: coral;
  flex-shrink: 0;
  width: 100px;
}

main {
  background-color: moccasin;
  flex-grow: 1;
}

aside {
  background-color: sandybrown;
  flex-shrink: 0;
  width: 100px;
}

footer {
  background-color: slategray;
  height: 100px;
}

```