import { cp, mkdir, copyFile, rm, readFile, writeFile } from 'node:fs/promises';
const pages = ['index.html', 'experience.html', 'interpretation-lens.html', 'base-60.html', 'royal-game-of-ur.html', 'sources.html', 'notes.html', 'scored-shell.html'];
await rm('public', {recursive:true, force:true});
await mkdir('public/vendor', {recursive:true});
for (const file of [...pages, 'cinematic-score.js', 'cinematic-score-loader.js', 'authority-family.css', 'experience.css', 'sky-atmosphere.webp']) await copyFile(file, `public/${file}`);
await cp('assets', 'public/assets', {recursive:true});
for (const file of ['three.module.js', 'three.core.js']) await copyFile(`node_modules/three/build/${file}`, `public/vendor/${file}`);
await copyFile('node_modules/three/LICENSE', 'public/vendor/THREE-LICENSE.txt');
console.log('Built static site with locally served, locked Three.js modules.');
