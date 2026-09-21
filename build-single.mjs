import {readFileSync, writeFileSync} from 'fs';
const dist = new URL('./dist/', import.meta.url).pathname;
const mime = {png:'image/png', mp4:'video/mp4', mp3:'audio/mpeg', ttf:'font/ttf'};
const data = f => `data:${mime[f.split('.').pop()]};base64,` + readFileSync(dist + 'assets/' + f).toString('base64');

let html = readFileSync(dist + 'index.html', 'utf8');
let css = readFileSync(dist + 'style.css', 'utf8');
let js = readFileSync(dist + 'app.js', 'utf8');

// CSS: background, fonts
css = css.replace(/url\('assets\/([^']+)'\)/g, (m, f) => `url('${data(f)}')`);

// JS: flower images via inlined map
const flowers = ['sunflower','rose','lily','hydrangea','dahlia','jasmine','chrysanthemum','forgetmenot','magnolia','gerbera'];
const assetsMap = 'const ASSETS={' + flowers.map(f => `${f}:'${data(f + '.png')}'`).join(',') + '};';
js = js.replace("'use strict';", "'use strict';\n" + assetsMap);
js = js.replace('im.src=`assets/${s.file}.png`', 'im.src=ASSETS[s.file]');

// HTML: audio + video
html = html.replace('src="assets/yellow.mp3"', `src="${data('yellow.mp3')}"`);
html = html.replace('src="assets/para-karen.mp4"', `src="${data('para-karen.mp4')}"`);

// Inline css + js
html = html.replace('<link rel="stylesheet" href="style.css"><script src="app.js" defer></script>', `<style>${css}</style>`);
html = html.replace('</body></html>', `<script>${js}</script></body></html>`);

const out = new URL('./', import.meta.url).pathname + 'TE AMO MUCHO MI PEQUEÑA Mort.html';
writeFileSync(out, html);
console.log('OK →', out, (html.length / 1048576).toFixed(1) + ' MB');
