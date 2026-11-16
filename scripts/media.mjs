// Web encodes for the films: for each source, a 1080p master, a lighter 720p cut for phones and slow networks, and a
// poster frame, all small enough to live in git (GitHub refuses files over 100 MB; every output here is far below).
//   node scripts/media.mjs <source.mp4> <name> [<source.mp4> <name> ...]
// writes assets/videos/<name>.mp4, <name>-720.mp4 and <name>.jpg (outside public/ while the films are offline;
// move the folder to public/media/video/ to serve them again)
import { spawnSync } from 'node:child_process';
import { statSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import ffmpeg from 'ffmpeg-static';

const OUT = 'assets/videos';
mkdirSync(OUT, { recursive: true });

function probe(src) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-i', src], { encoding: 'utf8' });
  const t = r.stderr;
  const d = /Duration: (\d+):(\d+):([\d.]+)/.exec(t);
  const v = /Video: .*?, (\d{2,5})x(\d{2,5})[^,]*,.*? ([\d.]+) fps/.exec(t);
  if (!d || !v) throw new Error(`cannot read ${src}`);
  return { dur: +d[1] * 3600 + +d[2] * 60 + +d[3], w: +v[1], h: +v[2], fps: +v[3], audio: /Audio:/.test(t) };
}

function run(args) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg failed: ' + args.join(' '));
}

// the short side capped at `s`, the long side following with even dimensions
const fit = (s) => `scale='if(lt(iw,ih),min(${s},iw),-2)':'if(lt(iw,ih),-2,min(${s},ih))':flags=lanczos`;
const mb = (f) => (statSync(f).size / 1048576).toFixed(1) + ' MB';

function encode(src, name) {
  const p = probe(src);
  const audio = p.audio ? ['-map', '0:a:0', '-c:a', 'aac', '-b:a', '128k', '-ac', '2'] : [];
  const common = ['-map', '0:v:0', ...audio, '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level', '4.2',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-map_metadata', '-1'];
  // master: the cut as made, at up to 60 fps
  const hi = join(OUT, `${name}.mp4`);
  run(['-i', src, ...common, '-vf', fit(1080), '-fpsmax', '60', '-crf', '23', '-maxrate', '5M', '-bufsize', '10M', hi]);
  // a source that was already lean stays as it was, only made to stream from the first byte
  if (statSync(hi).size > statSync(src).size) run(['-i', src, '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-movflags', '+faststart', '-map_metadata', '-1', hi]);
  // phones: 720p, and 50/60 fps halved to 25/30 so the motion stays even
  const lo = join(OUT, `${name}-720.mp4`);
  const fps = p.fps > 31 ? p.fps / 2 : p.fps;
  run(['-i', src, ...common, '-vf', `${fit(720)},fps=${fps}`, '-crf', '25', '-maxrate', '2.2M', '-bufsize', '4.4M', lo]);
  // poster: a frame from early in the film, past any fade from black
  const jpg = join(OUT, `${name}.jpg`);
  run(['-ss', String(Math.min(p.dur * 0.15, 4)), '-i', src, '-frames:v', '1', '-vf', fit(720), '-q:v', '4', jpg]);
  console.log(`${name.padEnd(14)} ${p.w}x${p.h} ${p.fps}fps ${p.dur.toFixed(1)}s  source ${mb(src)} -> ${mb(hi)} / 720p ${mb(lo)}`);
}

const a = process.argv.slice(2);
if (!a.length || a.length % 2) { console.error('usage: node scripts/media.mjs <source.mp4> <name> [...]'); process.exit(1); }
for (let i = 0; i < a.length; i += 2) encode(a[i], a[i + 1]);
