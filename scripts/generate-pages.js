const fs = require('fs').promises;
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'pages');
const TEMPLATE_PATH = path.join(PAGES_DIR, 'mean', 'readme.md');

const names = [
  'number of arguments',
  'sleep',
  'prototype square',
  'cancellable interval',
  'cancellable timeout',
  'chunk',
  'compact',
  'difference',
  'drop right while',
  'drop while',
  'fill',
  'find index',
  'find last index',
  'from pairs',
  'prototype apply',
  'prototype call',
  'get',
  'in range',
  'intersection',
  'max by',
  'min by',
  'object map',
  'once',
  'promise reject',
  'range',
  'range right',
  'singleton',
  'type Utilities',
  'Unique Array',
  'use boolean',
  'use counter',
  'Arccordion',
  'Array prototype at',
  'array prototype filter',
  'array prototype map',
  'array prototype reduce',
  'compose',
  'contact form',
  'cycle',
  'flight booker',
  'function prototype bind',
  'generate table',
  'progress bars',
  'promise race',
  'use boolean ii',
  'use click anywhere',
  'use counter ii',
  'use cycle',
  'use default',
  'use effect once',
  'use focus',
  'use previous',
  'use state with reset',
  'use toggle',
  'debounce',
  'promise merge',
  'promise timeout',
  'promise resolve',
  'promise with resolvers',
  'promisify',
  'promisify ii',
  'throttle',
  'use array',
  'use breakpoint',
  'use click outside',
  'use count down',
  'use debounce',
  'use event listener',
  'use hover',
  'use interval',
  'use key press',
  'use map',
  'use object',
  'use set',
  'use step',
  'use throttle',
  'use timeout',
  'use window size',
  'analog clock',
  'debounce ii',
  'grid lights',
  'like buttion',
  'map async',
  'middlewares',
  'progress bars ii',
  'promise all',
  'promise allSettled',
  'promise any',
  'resumable interval',
  'traffic light',
  'use idle',
  'use input control',
  'use media query',
  'use mediated state',
  'use query',
  'digital clock',
  'map async limit',
  'progress bars iii',
  'stopwatch',
  'progress bars iv'
];

function toKebab(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[A-Z]/g, (m) => m.toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-');
}

function titleCase(s) {
  return s
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
}

async function run() {
  const templateRaw = await fs.readFile(TEMPLATE_PATH, 'utf8');
  const unique = Array.from(new Set(names.map((n) => n.trim())));
  let created = 0;

  for (const raw of unique) {
    const kebab = toKebab(raw);
    const dir = path.join(PAGES_DIR, kebab);
    await fs.mkdir(dir, { recursive: true });

    const tsPath = path.join(dir, `${kebab}.ts`);
    const testPath = path.join(dir, `${kebab}.test.ts`);
    const readmePath = path.join(dir, 'readme.md');

    await fs.writeFile(tsPath, '// empty\n');
    await fs.writeFile(testPath, '// empty\n');

    // replace first markdown title in template with the new title
    const title = titleCase(kebab);
    const readme = templateRaw.replace(/^#.*$/m, `# ${title}`);
    await fs.writeFile(readmePath, readme, 'utf8');

    created++;
  }

  console.log(`Created ${created} pages under ${PAGES_DIR}`);
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
