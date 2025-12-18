const fs = require('fs').promises;
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'pages');
const TEMPLATE_PATH = path.join(PAGES_DIR, 'mean', 'readme.md');

const names = [
  'Unique Array',
  'Type Utilities',
  'Singleton',
  'Range Right',
  'Range',
  'Once',
  'Object Map',
  'Min By',
  'Max By',
  'Intersection',
  'In Range',
  'Get',
  'Function prototype call',
  'Function.prototype.apply',
  'From Pairs',
  'Find Last Index',
  'Find Index',
  'Fill'
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
    const solutionPath = path.join(dir, 'solution.md');

    await fs.writeFile(tsPath, '');
    await fs.writeFile(testPath, '');
    await fs.writeFile(solutionPath, '');
    await fs.writeFile(readmePath, '');

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
