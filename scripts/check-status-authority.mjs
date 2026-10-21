// Local documentation guard; no other repository or network is needed to build.
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const statusUrl = 'https://github.com/AndrewLamSingapore/orqevia/blob/main/STATUS.md';
const sourceUrl = 'https://github.com/AndrewLamSingapore/orqevia/blob/main/governance/operational-manifest.json';
const entries = await readdir(root);
for (const name of ['SSOT.json', 'SSOT.md']) assert.ok(!entries.includes(name), 'Retired status pointer must stay removed');
for (const name of ['AGENTS.md', 'README.md']) {
  const text = await readFile(join(root, name), 'utf8');
  assert.ok(text.includes(statusUrl), `${name} must name the portfolio status reference`);
  assert.ok(text.includes(sourceUrl), `${name} must name the component reference`);
  assert.ok(text.includes('Each product owns'), `${name} must preserve product domain ownership`);
}
async function checkMarkdown(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'public', 'test-results', 'playwright-report'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await checkMarkdown(path);
    else if (entry.isFile() && entry.name.endsWith('.md')) {
      const text = await readFile(path, 'utf8');
      assert.ok(!text.includes('https://github.com/AndrewLamSingapore/prime/blob/main/STATUS.md'), `${relative(root, path)} links the retired status location`);
      assert.ok(!text.includes('one current JARVIS SSOT'), `${relative(root, path)} reinstates a retired portfolio banner`);
      assert.ok(!text.includes('single current status source of truth'), `${relative(root, path)} overstates status authority`);
    }
  }
}
await checkMarkdown(root);
console.log('Portfolio STATUS reference and product ownership: PASS; runtime freshness is independently assessed');
