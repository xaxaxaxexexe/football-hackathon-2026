// Download the public schedule and its visible brand/poster assets.
const fs = require('node:fs/promises');
const path = require('node:path');
const {load} = require('../schedule-source.js');
const root = path.resolve(__dirname, '..');
async function download(url, relative) {
  const response = await fetch(url, {signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error('Asset HTTP ' + response.status);
  await fs.writeFile(path.join(root, relative), Buffer.from(await response.arrayBuffer()));
}
async function main() {
  const data = await load();
  await fs.mkdir(path.join(root, 'assets/posters'), {recursive:true});
  await download('https://kinostar-groznymall.com/img/logo.svg', 'assets/kinostar-logo.svg');
  const failures = [];
  for (let i = 0; i < data.films.length; i += 4) {
    await Promise.all(data.films.slice(i,i+4).map(async film => {
      const relative = 'assets/posters/' + film.id + '.jpg';
      try { await download(film.poster, relative); film.localPoster = relative; }
      catch (e) { failures.push(film.title + ': ' + e.message); }
    }));
  }
  await fs.writeFile(path.join(root, 'schedule-data.js'), 'window.KINOSTAR_SNAPSHOT = ' + JSON.stringify(data, null, 2) + ';\n');
  console.log(JSON.stringify({dates:data.dates, films:data.films.length, sessions:data.films.reduce((n,f)=>n+f.sessions.length,0), failures},null,2));
}
main().catch(e => {console.error(e.message);process.exitCode=1;});
