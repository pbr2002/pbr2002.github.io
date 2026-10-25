import {build} from 'esbuild';
import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/assets',{recursive:true});
await build({entryPoints:['src/main.js','src/globe.js'],bundle:true,minify:true,format:'iife',target:'es2020',outdir:'dist/assets',legalComments:'eof'});
await copyFile('src/style.css','dist/assets/style.css');
await copyFile('src/index.html','dist/index.html');
await copyFile('src/favicon.svg','dist/favicon.svg');
console.log('Built dist/ — ready for GitHub Pages.');
