import {statSync} from 'node:fs';

const budgets = [
  {file: 'dist/assets/main.js', maxBytes: 700 * 1024},
  {file: 'dist/assets/style.css', maxBytes: 50 * 1024},
  {file: 'dist/index.html', maxBytes: 20 * 1024},
];

let failed = false;
for (const {file, maxBytes} of budgets) {
  let bytes;
  try {
    bytes = statSync(file).size;
  } catch {
    console.error(`Missing production asset: ${file}. Run npm run build first.`);
    failed = true;
    continue;
  }
  const size = `${(bytes / 1024).toFixed(1)} KiB`;
  const limit = `${(maxBytes / 1024).toFixed(0)} KiB`;
  const withinBudget = bytes <= maxBytes;
  console.log(`${withinBudget ? 'PASS' : 'FAIL'} ${file}: ${size} / ${limit}`);
  if (!withinBudget) failed = true;
}

if (failed) process.exitCode = 1;
