import {build} from 'esbuild';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist/assets',{recursive:true});
await build({entryPoints:['src/main.js'],bundle:true,minify:true,format:'iife',target:'es2020',outfile:'dist/assets/main.js',legalComments:'eof'});
await copyFile('src/style.css','dist/assets/style.css');
await copyFile('src/index.html','dist/index.html');
await copyFile('src/favicon.svg','dist/favicon.svg');
console.log('Built dist/ — ready for GitHub Pages.');
