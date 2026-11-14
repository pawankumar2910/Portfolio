// The interface. A loader of shoji doors and a brush-painted ensō while the world loads; then
// the chrome of the walk: a header with the four sections, chapter cards that come in as you come to rest (each one
// a chapter of the portfolio), a day ruler on the right that is the sun's path from five in the morning to nine at
// night, the four seasons, sound, a photo mode that also prints a postcard, a viewer for the films and the posters,
// from above the rooms as places to go back to, and a colophon naming whose work the house is made of.
import './ui.css';
import { SITE, TITLE, COPY, SEASONS, PLACES, CREDITS, COLOPHON, REPO, NAV, SECTION_OF, FILMS, POSTERS } from './copy.js';
import { TIER, REDUCED, TOUCH } from '../core/device.js';

// phones, and anyone saving data, get the 720p cut of a film; everyone else the 1080p master
const conn = navigator.connection || {};
const LIGHT = TIER === 'mobile' || conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '');

const $ = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad2 = (n) => String(n).padStart(2, '0');
const clockOf = (h) => { const m = Math.round(h * 60); return `${pad2(Math.floor(m / 60) % 24)}:${pad2(m % 60)}`; };
// characters that rise into place one after another
const chars = (s, d0 = 0, step = 0.045) => [...s].map((c, i) => `<span class="ch" style="--d:${(d0 + i * step).toFixed(3)}s">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
// words that rise into place, for long lines that must still wrap
const words = (s, d0 = 0, step = 0.08) => s.split(' ').map((w, i) => `<span class="wd"><span class="ch" style="--d:${(d0 + i * step).toFixed(3)}s">${w}</span></span>`).join(' ');
const H0 = 4.5, H1 = 21.0;
const EXT = 'target="_blank" rel="noopener"';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.5v9l7.5-4.5z" fill="currentColor"/></svg>';
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
const sectionOf = (i) => SECTION_OF[i] ?? -1;

export class UI {
  constructor() {
    this.root = $('div', 'ut pre');
    this.root.id = 'ui';
    document.body.appendChild(this.root);
    document.documentElement.classList.add('locked');
    this.buildLoader();
    this.buildColophon();
    this.buildViewer();
    this.cardStop = -1;
    this.cardOn = false;
    this.photo = false;
    this.opened = false;
    this.modal = false;
  }

  // ------------------------------------------------------------------ loader: shoji doors, an ensō, a seal
  // The screen opens as a pair of closed shoji lit from behind. A brush circle (ensō) is painted as the world
  // loads; when it closes, a red seal is stamped beside the name; entering slides the doors apart onto the house.
  buildLoader() {
    const L = document.getElementById('load');
    L.innerHTML = `
      <div class="shoji l" aria-hidden="true"></div><div class="shoji r" aria-hidden="true"></div>
      <div class="lglow" aria-hidden="true"></div>
      <div class="lcore">
        <svg class="enso" viewBox="0 0 200 200" aria-hidden="true">
          <defs><filter id="brush" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter></defs>
          <g filter="url(#brush)">
            <path class="e1" pathLength="1" d="M81.4 30.5 A72 72 0 1 1 41 58.7"/>
            <path class="e2" pathLength="1" d="M84 35 A67 67 0 1 1 46 61"/>
          </g>
        </svg>
        <span class="kanji">${TITLE.mark}</span>
      </div>
      <div class="lname">
        <b>${TITLE.en.toUpperCase()}</b><i>${TITLE.sub}</i>
        <span class="lrow"><span class="pct">000</span><span class="hanko" aria-hidden="true">${TITLE.mark}</span></span>
        <div class="lenter">
          <button class="go" type="button"><span class="jp">入る</span><span class="en">Enter</span></button>
          <button class="quiet" type="button">Enter without sound</button>
        </div>
      </div>
      <span class="lcol jp v" aria-hidden="true">${TITLE.jp}</span>
      <div class="lfoot"><span>${TITLE.roles}</span><button class="colo-open" type="button">Credits</button></div>`;
    L.querySelector('.colo-open').addEventListener('click', () => this.setColophon(true));
    this.pct = L.querySelector('.pct');
    this.enso = L.querySelectorAll('.enso path');
    this.goEl = L.querySelector('.lenter');
    this.loader = L;
    this.target = 0;
    this.shown = 0;
  }

  // loading can finish in a blink; the brush still takes its time
  progress(p) {
    this.target = Math.max(this.target, clamp(p, 0, 1));
    if (this.drawing) return;
    this.drawing = true;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.shown = Math.min(this.target, this.shown + dt / 2.2);
      const k = this.shown, e = 1 - Math.pow(1 - k, 2.2);
      this.enso[0].style.strokeDashoffset = (1 - e).toFixed(4);
      this.enso[1].style.strokeDashoffset = (1 - clamp(e * 1.15 - 0.15, 0, 1)).toFixed(4);
      this.loader.style.setProperty('--k', e.toFixed(3));
      this.pct.textContent = String(Math.round(k * 100)).padStart(3, '0');
      if (this.shown >= 1 && this.onDrawn) { this.onDrawn(); this.onDrawn = null; }
      if (this.shown < this.target) requestAnimationFrame(step);
      else this.drawing = false;
    };
    requestAnimationFrame(step);
  }

  // resolves with whether to start with sound
  async ready() {
    if (this.shown < 1) await new Promise((r) => { this.onDrawn = r; this.progress(1); });
    await wait(200);
    this.loader.classList.add('ready');
    return new Promise((res) => {
      const done = (sound) => { removeEventListener('keydown', key); res(sound); };
      const key = (e) => { if (!this.colo && (e.code === 'Enter' || e.code === 'Space')) { e.preventDefault(); done(true); } };
      this.goEl.querySelector('.go').addEventListener('click', () => done(true), { once: true });
      this.goEl.querySelector('.quiet').addEventListener('click', () => done(false), { once: true });
      addEventListener('keydown', key);
    });
  }

  // straight into the walk, for tools and deep links
  skip() {
    this.loader.remove();
    this.root.classList.remove('pre');
    document.documentElement.classList.remove('locked');
    this.opened = true;
    this.skipped = true;
    this.t0 = performance.now();
  }

  // the ink lifts, then the doors slide apart onto the house
  async open() {
    this.loader.classList.add('leaving');
    await wait(450);
    this.root.classList.remove('pre');
    document.documentElement.classList.remove('locked');
    this.opened = true;
    this.t0 = performance.now();
    await wait(1250);
    this.loader.classList.add('gone');
    if (scrollY < 40) this.hint.classList.add('in');
    this.loader.remove();
  }

  // ------------------------------------------------------------------ colophon: a schedule of whose work the house is made of
  // a scan this build does not carry is not credited
  uncredit(models) {
    for (const m of models) document.querySelectorAll(`.colo-row[data-model="${m}"]`).forEach((e) => e.remove());
  }

  buildColophon() {
    const c = $('div', 'colophon');
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-modal', 'true');
    c.setAttribute('aria-labelledby', 'colo-h');
    const rows = CREDITS.map((g) => `<li class="colo-group"><span class="jp">${g.jp}</span>${g.group}</li>` + g.items.map((r) => `
      <li class="colo-row"${r.model ? ` data-model="${r.model}"` : ''}><span class="use"><span class="jp">${r.jp}</span><span class="en">${r.use}</span></span>
        <a class="work" href="${r.url}" ${EXT}>${r.work}</a><span class="by">${r.by}</span><a class="lic" href="${r.lic[1]}" ${EXT}>${r.lic[0]}</a></li>`).join('')).join('');
    c.innerHTML = `
      <div class="colo-sheet">
        <header class="colo-head"><span class="jp v">奥付</span>
          <div class="colo-title"><h2 id="colo-h">Colophon</h2><p>${COLOPHON.en}</p><p class="ja">${COLOPHON.ja}</p>
            <a class="colo-link colo-src" href="${REPO}" ${EXT}><span class="jp">ソース</span>github.com/billpwchan/utsuroi</a></div>
          <button class="colo-close" type="button">Close · Esc</button></header>
        <ul class="colo-list">${rows}</ul>
      </div>`;
    document.body.appendChild(c);
    c.addEventListener('click', (e) => { if (e.target === c) this.setColophon(false); });
    c.querySelector('.colo-close').addEventListener('click', () => this.setColophon(false));
    // ahead of the walk's own keys: while it is open, Escape closes it, Tab stays inside it, nothing else moves
    addEventListener('keydown', (e) => {
      if (!this.colo) return;
      if (e.key === 'Escape') { e.stopImmediatePropagation(); this.setColophon(false); }
      else if (e.key === 'Tab') this.trapTab(e, c);
    }, true);
    this.coloEl = c;
  }

  trapTab(e, root) {
    const f = [...root.querySelectorAll('a, button, video')].filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  setColophon(on) {
    if (on === !!this.colo) return;
    this.colo = on;
    this.coloEl.classList.toggle('in', on);
    document.documentElement.classList.toggle('reading', on || this.modal);
    if (on) {
      this.coloBack = document.activeElement;
      this.coloEl.querySelector('.colo-list').scrollTop = 0;
      this.coloEl.querySelector('.colo-close').focus({ preventScroll: true });
    } else this.coloBack?.focus?.({ preventScroll: true });
  }

  // ------------------------------------------------------------------ the viewer: films and posters, on a dark sheet
  buildViewer() {
    const v = $('div', 'viewer');
    v.setAttribute('role', 'dialog');
    v.setAttribute('aria-modal', 'true');
    v.setAttribute('aria-labelledby', 'v-h');
    v.innerHTML = `
      <div class="v-sheet">
        <header class="v-head">
          <span class="jp v v-jp"></span>
          <div class="v-title"><span class="v-meta"></span><h2 id="v-h"></h2><p class="v-note"></p></div>
          <button class="v-close" type="button">Close · Esc</button>
        </header>
        <nav class="v-tabs"></nav>
        <div class="v-body"></div>
      </div>
      <div class="v-zoom" aria-hidden="true">
        <button class="z-prev" type="button" aria-label="Previous poster">${ARROW}</button>
        <figure><img alt=""><figcaption></figcaption></figure>
        <button class="z-next" type="button" aria-label="Next poster">${ARROW}</button>
        <button class="z-close" type="button">Back · Esc</button>
      </div>`;
    document.body.appendChild(v);
    v.addEventListener('click', (e) => { if (e.target === v) this.closeViewer(); });
    v.querySelector('.v-close').addEventListener('click', () => this.closeViewer());
    const z = v.querySelector('.v-zoom');
    z.querySelector('.z-close').addEventListener('click', () => this.zoom(-1));
    z.querySelector('.z-prev').addEventListener('click', () => this.zoom((this.zoomI + POSTERS.length - 1) % POSTERS.length));
    z.querySelector('.z-next').addEventListener('click', () => this.zoom((this.zoomI + 1) % POSTERS.length));
    z.addEventListener('click', (e) => { if (e.target === z) this.zoom(-1); });
    addEventListener('keydown', (e) => {
      if (!this.modal) return;
      if (e.key === 'Escape') { e.stopImmediatePropagation(); if (this.zoomI >= 0) this.zoom(-1); else this.closeViewer(); }
      else if (this.zoomI >= 0 && e.key === 'ArrowRight') { e.stopImmediatePropagation(); this.zoom((this.zoomI + 1) % POSTERS.length); }
      else if (this.zoomI >= 0 && e.key === 'ArrowLeft') { e.stopImmediatePropagation(); this.zoom((this.zoomI + POSTERS.length - 1) % POSTERS.length); }
      else if (e.key === 'Tab') this.trapTab(e, this.zoomI >= 0 ? z : v.querySelector('.v-sheet'));
    }, true);
    this.viewer = v;
    this.zoomI = -1;
  }

  openViewer() {
    this.modal = true;
    this.viewerBack = document.activeElement;
    this.viewer.classList.add('in');
    document.documentElement.classList.add('reading');
    this.hideCard();
    // the house's own sound steps aside for the film's
    this.soundWas = !!this.app?.sound.on;
    if (this.soundWas) this.setSound(false);
    requestAnimationFrame(() => this.viewer.querySelector('.v-close').focus({ preventScroll: true }));
  }

  closeViewer() {
    if (!this.modal) return;
    this.zoom(-1);
    const vid = this.viewer.querySelector('video');
    if (vid) vid.pause();
    this.viewer.classList.remove('in');
    this.modal = false;
    document.documentElement.classList.toggle('reading', !!this.colo);
    if (this.soundWas) this.setSound(true);
    setTimeout(() => { if (!this.modal) this.viewer.querySelector('.v-body').innerHTML = ''; }, 700);
    this.viewerBack?.focus?.({ preventScroll: true });
    this.cardStop = -1;
  }

  // a film, or one of a set of films with tabs to move between them
  playFilm(ids, k = 0) {
    const v = this.viewer;
    const play = (i) => {
      const f = FILMS[ids[i]];
      v.querySelector('.v-jp').textContent = '映';
      v.querySelector('.v-meta').textContent = `${f.dur}  ·  ${f.ar.replace('/', ':')}  ·  ${f.year}`;
      v.querySelector('#v-h').textContent = f.title;
      v.querySelector('.v-note').textContent = `${f.client} — ${f.note}`;
      const tall = f.ar === '9/16', sq = f.ar === '1/1';
      v.querySelector('.v-body').innerHTML = `<div class="v-film${tall ? ' tall' : sq ? ' square' : ''}" style="--ar:${f.ar}">
        <video src="${LIGHT ? f.lo : f.src}" poster="${f.poster}" controls autoplay playsinline preload="auto"></video></div>`;
      v.querySelectorAll('.v-tab').forEach((t, j) => t.classList.toggle('on', j === i));
    };
    const tabs = v.querySelector('.v-tabs');
    const cuts = ids.every((id) => FILMS[id].title === FILMS[ids[0]].title);
    tabs.innerHTML = ids.length > 1 ? ids.map((id, i) => `<button type="button" class="v-tab"><span class="n">${pad2(i + 1)}</span>${cuts ? FILMS[id].client.split(' · ').pop() : FILMS[id].title}<span class="d">${FILMS[id].dur}</span></button>`).join('') : '';
    tabs.querySelectorAll('.v-tab').forEach((t, i) => t.addEventListener('click', () => play(i)));
    v.classList.remove('gallery');
    v.classList.add('film');
    play(k);
    this.openViewer();
  }

  // the posters, hung as a wall; any one opens on its own
  openGallery(k = -1) {
    const v = this.viewer;
    v.querySelector('.v-jp').textContent = '絵';
    v.querySelector('.v-meta').textContent = `${POSTERS.length} pieces  ·  Key art & print`;
    v.querySelector('#v-h').textContent = 'Key art & posters';
    v.querySelector('.v-note').textContent = 'For Cardinelle Collections and AtCozy — product key art, print typography and editorial campaigns.';
    v.querySelector('.v-tabs').innerHTML = '';
    v.querySelector('.v-body').innerHTML = `<div class="v-wall">${POSTERS.map((p, i) => `
      <button type="button" class="v-poster" style="--ar:${p.ar}; --d:${(i * 0.04).toFixed(2)}s">
        <span class="frame"><img src="${p.thumb}" alt="${p.title}, ${p.client}" loading="lazy" decoding="async"></span>
        <span class="cap"><b>${p.title}</b><i>${p.client}</i></span></button>`).join('')}</div>`;
    v.querySelectorAll('.v-poster').forEach((b, i) => b.addEventListener('click', () => this.zoom(i)));
    v.classList.remove('film');
    v.classList.add('gallery');
    this.openViewer();
    if (k >= 0) this.zoom(k);
  }

  zoom(i) {
    const z = this.viewer.querySelector('.v-zoom');
    this.zoomI = i;
    z.classList.toggle('in', i >= 0);
    z.setAttribute('aria-hidden', i >= 0 ? 'false' : 'true');
    if (i < 0) return;
    const p = POSTERS[i];
    const img = z.querySelector('img');
    img.classList.remove('loaded');
    img.onload = () => img.classList.add('loaded');
    img.src = p.src;
    img.alt = `${p.title}, ${p.client}`;
    z.querySelector('figcaption').innerHTML = `<span class="n">${pad2(i + 1)} / ${pad2(POSTERS.length)}</span><b>${p.title}</b><i>${p.client}</i>`;
    z.querySelector('.z-close').focus({ preventScroll: true });
  }

  // ------------------------------------------------------------------ chrome
  attach(app) {
    this.app = app;
    const { STOPS } = app;
    const R = this.root;

    // wordmark
    const wm = $('a', 'wordmark', `<span class="jp">${TITLE.mark}</span><span class="rule"></span><span class="en">${TITLE.en.toUpperCase()}</span><span class="sub">${SITE.handle}</span>`);
    wm.href = '#';
    wm.setAttribute('aria-label', `${TITLE.en} — back to the start`);
    wm.addEventListener('click', (e) => { e.preventDefault(); this.goTo(0); });
    R.appendChild(wm);

    // the four sections
    const nav = $('nav', 'nav');
    nav.setAttribute('aria-label', 'Sections');
    this.navEls = NAV.map((n, i) => {
      const a = $('a', 'nav-item', `<span class="n">${pad2(i + 1)}</span><span class="en">${n.en}</span><span class="jp">${n.jp}</span>`);
      a.href = `#${n.en.toLowerCase()}`;
      a.addEventListener('click', (e) => { e.preventDefault(); this.goTo(n.stop); });
      nav.appendChild(a);
      return a;
    });
    this.navBar = $('span', 'bar');
    nav.appendChild(this.navBar);
    R.appendChild(nav);

    // seasons, sound, photo
    const ctl = $('div', 'controls');
    const seasons = $('div', 'seasons');
    seasons.setAttribute('role', 'radiogroup');
    seasons.setAttribute('aria-label', 'Season');
    this.seasonBtns = SEASONS.map((s, i) => {
      const b = $('button', 'season', `<span class="jp">${s.jp}</span><span class="tip">${s.en}</span>`);
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-label', s.en);
      b.addEventListener('click', () => this.setSeason(i));
      seasons.appendChild(b);
      return b;
    });
    this.seasonBar = $('span', 'bar');
    seasons.appendChild(this.seasonBar);
    ctl.appendChild(seasons);
    this.soundBtn = $('button', 'icon sound', '<span class="jp">音</span><span class="eq"><i></i><i></i><i></i><i></i></span><span class="tip">Sound · M</span>');
    this.soundBtn.type = 'button';
    this.soundBtn.setAttribute('aria-label', 'Sound');
    this.soundBtn.addEventListener('click', () => this.setSound(!app.sound.on));
    ctl.appendChild(this.soundBtn);
    const photoBtn = $('button', 'icon photo', '<span class="jp">写</span><span class="tip">Photo · P</span>');
    photoBtn.type = 'button';
    photoBtn.setAttribute('aria-label', 'Photo mode');
    photoBtn.addEventListener('click', () => this.setPhoto(true));
    ctl.appendChild(photoBtn);
    R.appendChild(ctl);

    // the day ruler
    const ruler = $('nav', 'ruler');
    ruler.setAttribute('aria-label', 'Chapters');
    const track = $('div', 'track');
    for (let h = 5; h <= 21; h++) {
      const t = $('span', h % 3 === 0 ? 'tick major' : 'tick');
      t.style.top = `${((h - H0) / (H1 - H0)) * 100}%`;
      if (h % 3 === 0) t.dataset.h = pad2(h);
      track.appendChild(t);
    }
    this.stopEls = STOPS.map((s, i) => {
      const b = $('button', 'mark', `<span class="dot"></span><span class="lbl"><span class="jp">${COPY[i].jp}</span><span class="en">${COPY[i].nav}</span></span>`);
      b.type = 'button';
      b.style.top = `${((s.h - H0) / (H1 - H0)) * 100}%`;
      b.setAttribute('aria-label', `${pad2(i + 1)} ${COPY[i].nav}`);
      b.addEventListener('click', () => this.goTo(i));
      track.appendChild(b);
      return b;
    });
    this.sunEl = $('div', 'sun', '<span class="disc"></span><span class="clock">05:06</span>');
    track.appendChild(this.sunEl);
    ruler.appendChild(track);
    R.appendChild(ruler);
    this.clockEl = this.sunEl.querySelector('.clock');

    // the chapter card
    this.scrim = $('div', 'scrim');
    R.appendChild(this.scrim);
    this.card = $('section', 'card');
    this.card.setAttribute('aria-live', 'polite');
    this.card.addEventListener('click', (e) => this.cardAction(e));
    R.appendChild(this.card);
    // with a mouse, a film previews itself silently while the pointer rests on it
    if (!TOUCH && !LIGHT) {
      const hover = (on) => (e) => {
        const f = e.target.closest('.film');
        if (!f || f.contains(e.relatedTarget) || f.closest('.l-feature')) return;
        this.preview(f.querySelector('video'), on);
      };
      this.card.addEventListener('pointerover', hover(true));
      this.card.addEventListener('pointerout', hover(false));
    }

    // a camera-style readout: timecode since you entered, the frame rate held, and the render scale in use
    this.hud = $('div', 'hud', '<span class="dot"></span><span class="tc">00:00:00:00</span><span class="fps">60 FPS</span><span class="gl">WEBGL2 · 1.00×</span>');
    this.hud.setAttribute('aria-hidden', 'true');
    R.appendChild(this.hud);
    this.hudTc = this.hud.querySelector('.tc');
    this.hudFps = this.hud.querySelector('.fps');
    this.hudGl = this.hud.querySelector('.gl');
    this.fpsAvg = 60;
    this.hudLast = 0;

    // the first hint
    this.hint = $('div', 'hint', '<span class="line"></span><span class="en">Scroll to walk through the house</span><span class="jp">スクロールで、家の中へ</span>');
    R.appendChild(this.hint);
    if (this.skipped) this.hint.remove();

    // the rooms, from above
    this.places = PLACES.map((p) => {
      const b = $('button', 'place', `<span class="jp">${p.jp}</span><span class="en">${p.en}</span>`);
      b.type = 'button';
      b.addEventListener('click', () => this.goTo(p.stop));
      R.appendChild(b);
      return { ...p, el: b };
    });

    // photo mode: everything steps away; a single quiet bar to print a postcard or come back
    this.photoBar = $('div', 'photobar', '<button type="button" class="print"><span class="jp">刷</span><span class="en">Postcard</span></button><button type="button" class="back"><span class="en">Back</span><span class="k">Esc</span></button>');
    this.photoBar.querySelector('.print').addEventListener('click', () => this.postcard());
    this.photoBar.querySelector('.back').addEventListener('click', () => this.setPhoto(false));
    R.appendChild(this.photoBar);

    // the veil for cuts between distant stops, and the dissolve the walk itself draws over long stretches
    this.veil = $('div', 'veil');
    R.appendChild(this.veil);
    this.dissolve = $('div', 'dissolve');
    R.prepend(this.dissolve);

    // the corner: where to find me, and whose work the house is made of
    const corner = $('div', 'corner');
    corner.innerHTML = `
      <a class="colo-link" href="${SITE.instagram}" ${EXT}><span class="jp">写真</span>Instagram</a>
      <a class="colo-link" href="mailto:${SITE.email}"><span class="jp">便り</span>Email</a>`;
    const colo = $('button', 'colo-link', '<span class="jp">奥付</span>Credits');
    colo.type = 'button';
    colo.addEventListener('click', () => this.setColophon(true));
    corner.append(colo);
    R.appendChild(corner);

    this.bindInput();
    this.setSeason(app.env.season, true);
    addEventListener('resize', () => {
      this.setSeason(this.seasonI, true);
      this.lastSection = null;
    });
    this.syncSound();
    this.bindIdle();
  }

  bindInput() {
    const { journey } = this.app;
    const canvas = document.getElementById('c');
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      journey.parallaxT.set((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * 2);
      // the poster wall leans a few degrees toward the pointer
      this.root.style.setProperty('--px', ((e.clientX / innerWidth - 0.5) * 2).toFixed(3));
      this.root.style.setProperty('--py', ((e.clientY / innerHeight - 0.5) * 2).toFixed(3));
    });
    // drag to look further; let go and the view settles back
    let drag = null;
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      this.root.classList.add('dragging');
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      journey.dragT.set(clamp((e.clientX - drag.x) * 0.0032, -1.1, 1.1), clamp((e.clientY - drag.y) * 0.0026, -0.45, 0.45));
    });
    const up = () => { if (!drag) return; drag = null; journey.dragT.set(0, 0); this.root.classList.remove('dragging'); };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    addEventListener('keydown', (e) => {
      if (!this.opened || this.colo || this.modal || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest && e.target.closest('a, button') && (e.key === ' ' || e.key === 'Enter')) return;
      const here = Math.round(journey.target);
      if (this.photo && e.key === 'Escape') return this.setPhoto(false);
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); this.goTo(here + 1); }
      else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); this.goTo(here - 1); }
      else if (e.key === 'Home') { e.preventDefault(); this.goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); this.goTo(this.app.STOPS.length - 1); }
      else if (e.key >= '1' && e.key <= '4') this.setSeason(+e.key - 1);
      else if (e.key === 'm' || e.key === 'M') this.setSound(!this.app.sound.on);
      else if (e.key === 'p' || e.key === 'P') this.setPhoto(!this.photo);
    });
    addEventListener('scroll', () => { if (scrollY > 40) this.hint.classList.remove('in'); }, { passive: true });
    // left between two rooms, the walk eases on to the nearer one, so every pause lands on a chapter
    let settle = 0;
    addEventListener('scroll', () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (!this.opened || this.modal || this.colo || this.cutting || this.photo) return;
        const max = document.documentElement.scrollHeight - innerHeight;
        if (max <= 0) return;
        const p = (scrollY / max) * (this.app.STOPS.length - 1);
        const f = p - Math.floor(p), d = journey.dwell;
        if (f > d * 0.85 && f < 1 - d * 0.85) scrollTo({ top: this.scrollYFor(Math.round(p)), behavior: 'smooth' });
      }, journey.veilK > 0.02 ? 280 : 650);
    }, { passive: true });
  }

  // with a mouse, the chrome steps back after a few still seconds and returns on the slightest movement
  bindIdle() {
    let timer = 0;
    const wake = (e) => {
      this.root.classList.remove('idle');
      clearTimeout(timer);
      if (e && e.pointerType && e.pointerType !== 'mouse') return;
      timer = setTimeout(() => this.root.classList.add('idle'), 6000);
    };
    addEventListener('pointermove', wake);
    addEventListener('keydown', wake);
    addEventListener('scroll', wake, { passive: true });
  }

  // ------------------------------------------------------------------ actions
  scrollYFor(i) {
    const max = document.documentElement.scrollHeight - innerHeight;
    return (i / (this.app.STOPS.length - 1)) * max;
  }

  // a neighbour is walked to; anything further is a cut through a veil of paper-dark
  async goTo(i) {
    const { journey, STOPS, env } = this.app;
    i = clamp(i, 0, STOPS.length - 1);
    if (this.cutting) return;
    if (Math.abs(i - journey.progress) <= 1.25) {
      scrollTo({ top: this.scrollYFor(i), behavior: 'smooth' });
      return;
    }
    this.cutting = true;
    this.veil.classList.add('on');
    await wait(420);
    scrollTo({ top: this.scrollYFor(i), behavior: 'instant' });
    journey.progress = journey.target = i;
    journey.vel = 0;
    journey.snap = true;
    env.setHours(STOPS[i].h, true);
    await wait(140);
    this.veil.classList.remove('on');
    this.cutting = false;
  }

  // buttons inside a chapter card
  cardAction(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'film') this.playFilm(b.dataset.set.split(','), +b.dataset.k);
    else if (act === 'gallery') this.openGallery(b.dataset.k != null ? +b.dataset.k : -1);
    else if (act === 'go') this.goTo(+b.dataset.stop);
    else if (act === 'credits') this.setColophon(true);
    else if (act === 'copy') {
      navigator.clipboard?.writeText(SITE.email).then(() => this.toast('写　Copied', SITE.email), () => {});
    }
  }

  setSeason(i, quiet = false) {
    this.app.env.setSeason(i);
    this.seasonBtns.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-checked', k === i ? 'true' : 'false'); });
    const b = this.seasonBtns[i];
    this.seasonBar.style.transform = `translateX(${(b.offsetLeft + b.offsetWidth / 2 - 7).toFixed(1)}px)`;
    this.seasonI = i;
    if (!quiet) this.toast(`${SEASONS[i].jp}　${SEASONS[i].en}`, SEASONS[i].note);
  }

  setSound(on) {
    const s = this.app.sound;
    if (on) s.start(); else s.setOn(false);
    this.syncSound();
  }
  syncSound() { this.soundBtn?.classList.toggle('on', !!this.app.sound.on); }

  setPhoto(on) {
    this.photo = on;
    this.root.classList.toggle('photo', on);
  }

  toast(title, note) {
    if (!this.toastEl) { this.toastEl = $('div', 'toast'); this.root.appendChild(this.toastEl); }
    const t = this.toastEl;
    t.innerHTML = `<b>${title}</b><i>${note}</i>`;
    t.classList.remove('in');
    void t.offsetWidth;
    t.classList.add('in');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => t.classList.remove('in'), 2600);
  }

  // the next rendered frame, set on a card with the place, the hour and the season, saved as a PNG
  async postcard() {
    const { env, journey } = this.app;
    const src = await this.app.capture();
    const c = COPY[journey.stop];
    const W = 2400, ph = Math.round((W - 160) * (src.height / src.width)), H = ph + 360;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#efe8dc';
    g.fillRect(0, 0, W, H);
    g.drawImage(src, 80, 80, W - 160, ph);
    await document.fonts.ready;
    g.fillStyle = '#1b1713';
    g.font = '500 88px "Shippori Mincho B1", serif';
    g.fillText(c.jp, 80, ph + 210);
    const jw = g.measureText(c.jp).width;
    g.font = 'italic 500 64px "Cormorant Garamond", serif';
    g.fillText(c.nav, 80 + jw + 40, ph + 205);
    g.font = '500 26px "IBM Plex Mono", monospace';
    g.fillStyle = '#6b6156';
    const meta = `${clockOf(env.hours)}   ${SEASONS[env.season].en.toUpperCase()}   ${TITLE.en.toUpperCase()} · ${SITE.handle.toUpperCase()}`;
    g.fillText(meta, 80, ph + 280);
    g.fillStyle = '#c4452b';
    g.fillRect(W - 80 - 96, ph + 140, 96, 96);
    g.fillStyle = '#efe8dc';
    g.font = '700 58px "Shippori Mincho B1", serif';
    g.textAlign = 'center';
    g.fillText(TITLE.mark, W - 80 - 48, ph + 210);
    const a = document.createElement('a');
    a.download = `pavan-${c.id}-${clockOf(env.hours).replace(':', '')}.png`;
    a.href = cv.toDataURL('image/png');
    a.click();
  }

  // ------------------------------------------------------------------ per frame
  update() {
    if (!this.app) return;
    const { journey, env, camera, STOPS } = this.app;
    // the readout, at timecode's own 24 frames a second, refreshed a few times a second
    const now = performance.now();
    if (this.prevNow) this.fpsAvg += (1000 / Math.max(1, now - this.prevNow) - this.fpsAvg) * 0.05;
    this.prevNow = now;
    if (now - this.hudLast > 120) {
      this.hudLast = now;
      const t = Math.max(0, (now - (this.t0 || 0)) / 1000), f = Math.floor(t * 24);
      this.hudTc.textContent = `${pad2(Math.floor(t / 3600))}:${pad2(Math.floor(t / 60) % 60)}:${pad2(Math.floor(t) % 60)}:${pad2(f % 24)}`;
      this.hudFps.textContent = `${Math.min(60, Math.round(this.fpsAvg))} FPS`;
      this.hudGl.textContent = `WEBGL2 · ${(this.app.pipe?.scale ?? 1).toFixed(2)}×`;
    }
    // ruler: the sun (or the moon) at the hour
    const y = clamp((env.hours - H0) / (H1 - H0), 0, 1);
    this.sunEl.style.top = `${(y * 100).toFixed(3)}%`;
    this.sunEl.classList.toggle('night', env.night > 0.5);
    const clock = clockOf(env.hours);
    if (clock !== this.lastClock) { this.clockEl.textContent = clock; this.lastClock = clock; }
    const here = journey.stop;
    if (here !== this.lastHere) {
      this.stopEls.forEach((b, i) => { b.classList.toggle('here', i === here); b.classList.toggle('past', i < here); });
      this.lastHere = here;
    }
    // the header follows the chapter you are in
    const sec = sectionOf(here);
    if (sec !== this.lastSection) {
      this.navEls.forEach((a, i) => a.classList.toggle('on', i === sec));
      const a = this.navEls[sec];
      this.navBar.style.opacity = a ? '1' : '0';
      if (a) this.navBar.style.transform = `translateX(${(a.offsetLeft + a.offsetWidth / 2 - 9).toFixed(1)}px)`;
      this.lastSection = sec;
    }

    const vk = journey.veilK.toFixed(3);
    if (vk !== this.lastVeil) { this.dissolve.style.opacity = vk; this.lastVeil = vk; }

    // the card arrives once you have come to rest, and leaves as soon as you move on
    const rest = journey.restK;
    const want = this.opened && !this.photo && !this.modal && rest > 0.9 && Math.abs(journey.progress - journey.target) < 0.08;
    if (want && (!this.cardOn || this.cardStop !== here)) this.showCard(here);
    else if (!want && this.cardOn && (rest < 0.8 || this.modal)) this.hideCard();

    // from above: the rooms become places to go back to
    const above = this.opened && !this.photo && journey.progress > STOPS.length - 1.35;
    this.root.classList.toggle('above', above);
    if (above) {
      const v = this._v || (this._v = camera.position.clone());
      const k = clamp((journey.progress - (STOPS.length - 1.35)) / 0.3, 0, 1);
      for (const p of this.places) {
        v.set(p.x, 0.4, p.z).project(camera);
        const cw = this.app.pipe?.cssW || innerWidth, ch = this.app.pipe?.cssH || innerHeight;
        const sx = (v.x * 0.5 + 0.5) * cw, sy = (-v.y * 0.5 + 0.5) * ch;
        p.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%)`;
        p.el.style.opacity = k.toFixed(3);
      }
    }
  }

  // what sits beneath a chapter's text; reveals are short and close together, so a card lands in under a second
  extra(c) {
    const x = c.extra;
    if (!x) return '';
    const d = (i, base = 0.4, step = 0.06) => `style="--d:${(base + i * step).toFixed(2)}s"`;
    switch (x.type) {
      case 'hero':
        return `<div class="extra x-hero">
          <p class="roles" ${d(0)}>${TITLE.roles}</p>
          <div class="acts" ${d(1)}>
            <button type="button" class="btn solid" data-act="film" data-set="ssv,raw" data-k="0"><span>Watch the latest reel</span>${ARROW}</button>
            <a class="btn" href="${SITE.brief}" ${EXT}><span>Start a project</span>${ARROW}</a>
          </div></div>`;
      case 'about':
        return `<div class="extra x-about">
          <dl class="x-stats">${x.stats.map(([v, sup, l], i) => `<div ${d(i)}><dt>${v}<sup>${sup}</sup></dt><dd>${l}</dd></div>`).join('')}</dl>
          <p class="tools" ${d(3)}><span class="k">Tools</span>${x.tools.map((t) => `<span>${t}</span>`).join('')}</p></div>`;
      case 'films': {
        const layout = x.layout || 'list';
        return `<div class="extra x-films l-${layout}">${x.items.map((id, i) => {
          const f = FILMS[id];
          return `<button type="button" class="film" data-act="film" data-set="${x.items.join(',')}" data-k="${i}" ${d(i)} aria-label="Play ${f.title}">
            <span class="thumb" style="--ar:${f.ar}"><img src="${f.poster}" alt="" decoding="async">
              <video muted loop playsinline preload="none" data-src="${f.lo}" aria-hidden="true"></video><span class="tc">${f.dur}</span></span>
            <span class="t">${f.isNew ? '<em class="new">New</em>' : ''}<b>${f.title}</b><i>${f.client}</i></span></button>`;
        }).join('')}</div>`;
      }
      case 'posters': {
        const pick = [13, 3, 12, 7];
        return `<div class="extra x-posters">
            <button type="button" class="btn" data-act="gallery" ${d(0)}><span>View all ${POSTERS.length} posters</span>${ARROW}</button></div>
          <div class="rail">${pick.map((k, i) => `<button type="button" class="rp" data-act="gallery" data-k="${k}" style="--i:${i}" aria-label="${POSTERS[k].title}, ${POSTERS[k].client}">
            <span class="fr"><img src="${POSTERS[k].thumb}" alt="" decoding="async"></span><span class="cap"><b>${POSTERS[k].title}</b><i>${POSTERS[k].client}</i></span></button>`).join('')}</div>`;
      }
      case 'services':
        return `<div class="extra x-services">${x.items.map(([n, t, s, tt], i) => `<article ${d(i)}>
          <header><span class="n">${n}</span><h4>${t}</h4></header><p class="s">${s}</p><p class="tt">${tt}</p></article>`).join('')}</div>`;
      case 'contact':
        return `<div class="extra x-contact">
          <dl>
            <div ${d(0)}><dt>Email</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a><button type="button" class="copy" data-act="copy">Copy</button></dd></div>
            <div ${d(1)}><dt>Instagram</dt><dd><a href="${SITE.instagram}" ${EXT}>${SITE.igHandle}</a></dd></div>
            <div ${d(2)}><dt>Status</dt><dd><span class="live"></span>Open for projects · Remote, worldwide</dd></div>
          </dl>
          <div class="acts" ${d(3)}><a class="btn solid" href="${SITE.brief}" ${EXT}><span>Start a project</span>${ARROW}</a></div></div>`;
      case 'end':
        return `<div class="extra x-end">
          <div class="links" ${d(0)}>
            <button type="button" data-act="go" data-stop="0">Back to the gate${ARROW}</button>
            <a href="${SITE.brief}" ${EXT}>Start a project${ARROW}</a>
          </div>
          <p class="foot" ${d(1)}>© 2026 ${TITLE.en} — ${SITE.handle}<button type="button" data-act="credits">Credits</button></p></div>`;
      default:
        return '';
    }
  }

  showCard(i) {
    const c = COPY[i];
    const n = this.app.STOPS.length;
    const hero = c.extra?.type === 'hero';
    const portrait = c.extra?.type === 'about'
      ? `<figure class="portrait"><span class="rec"><i></i>REC</span><img src="${c.extra.src}" alt="Portrait of ${TITLE.en}"><figcaption>${c.extra.caption}</figcaption></figure>` : '';
    // one quick rise per word, not a letter-by-letter performance
    const head = hero
      ? c.en.split(' is ').map((s, k) => words(k ? 'is ' + s : s, 0.08 + k * 0.12, 0.05)).join('<br>')
      : words(c.en, 0.08, 0.04);
    this.card.className = `card t-${c.extra?.type || 'plain'}`;
    this.card.innerHTML = `
      <div class="num"><span>${pad2(i + 1)}</span><span class="of">/ ${pad2(n)}</span><span class="time">${c.label}</span></div>
      <div class="body">
        <h2 class="name"><span class="jp v">${chars(c.jp, 0, 0.05)}</span><span class="kana v">${c.kana}</span></h2>
        <div class="text">
          ${hero ? `<p class="who">${TITLE.en}<span>${SITE.handle}</span></p>` : ''}
          <h3 class="en">${head}</h3>
          <p class="line">${c.body}</p>
          <p class="ja">${c.ja}</p>
          ${this.extra(c)}
        </div>
        ${portrait}
      </div>`;
    void this.card.offsetWidth;
    this.card.classList.add('in');
    this.scrim.classList.add('in');
    this.scrim.classList.toggle('wide', !!c.extra);
    this.cardStop = i;
    this.cardOn = true;
    // the featured reels play silently in place on screens that can afford it; the rest preview on hover
    if (c.extra?.layout === 'feature' && !LIGHT && !REDUCED) this.card.querySelectorAll('.film video').forEach((v) => this.preview(v, true));
  }

  hideCard() {
    this.card.classList.remove('in');
    this.scrim.classList.remove('in');
    this.cardOn = false;
    this.card.querySelectorAll('.film video').forEach((v) => this.preview(v, false));
  }

  // a muted loop of the 720p cut over the poster; it fades in only once frames are actually playing
  preview(v, on) {
    if (on) {
      if (!v.src) { v.src = v.dataset.src; v.addEventListener('playing', () => v.classList.add('on'), { once: true }); }
      v.play().catch(() => {});
    } else {
      v.pause();
      v.classList.remove('on');
      if (v.src) { v.removeAttribute('src'); v.load(); }
    }
  }
}
