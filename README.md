# Pavan — Every frame is a decision

The portfolio of **Pavan** ([renderedby.pk](https://instagram.com/renderedby.pk)): video editor, motion designer and 3D artist.

It is set in a Kyoto house that you walk through by scrolling. You start at the gate before dawn and finish at the koi pond at night, and the sun moves across the sky as you go. Each room you stop in holds one chapter of the portfolio. Everything is rendered live in the browser with three.js.

The world is built on **[Utsuroi](https://github.com/billpwchan/utsuroi)** by Bill Chan (MIT), which supplies the procedural house, the baked lighting, the sky, water, koi, seasons and synthesised sound. This project replaces Utsuroi's story and interface with the portfolio.

## The walk

| # | Room | Chapter |
|---|---|---|
| 01 | 門 Gate, before dawn | **Every frame is a decision.** Hero: "Watch the latest reel" / "Start a project" |
| 02 | 玄関 Genkan | **About:** portrait, stats, tools |
| 03 | 渡廊下 Bridge, noon | **Featured:** *Founder Reel* and *Raw → Edited*, playing silently in place |
| 04 | 囲炉裏 Hearth | **Selected films:** *Orchid*, *The Art of Diesel* |
| 05 | 縁側 Engawa | **Short form:** AtCozy, Norwood Gulf ×3, Fit Secrets |
| 06 | 枯山水 Dry garden | **Key art:** a poster wall beside the garden, plus a gallery of all 15 |
| 07 | 寝室 Bedroom | **Services** |
| 08 | 夜 Night | **Contact** |
| 09 | 間取り Plan | The whole house from above; pick a room to jump back to it |

The camera still walks through the other rooms of the house (roji, irigawa, zashiki, tea room, bath) on the way between chapters; it just doesn't stop in them. The chapters to rest in are set by `KEEP` in `src/journey/journey.js`, and they must match `COPY` in `copy.js`.

The header links (About · Work · Services · Contact) and the day ruler on the right both jump between chapters.

| Key | Action |
|---|---|
| Scroll, <kbd>↓</kbd> <kbd>→</kbd> <kbd>Space</kbd> | Next chapter |
| <kbd>↑</kbd> <kbd>←</kbd> | Previous chapter |
| <kbd>Home</kbd> / <kbd>End</kbd> | Gate / plan |
| <kbd>1</kbd>–<kbd>4</kbd> | Spring, summer, autumn, winter |
| <kbd>M</kbd> | Sound |
| <kbd>P</kbd> | Photo mode, which can also save a postcard |
| <kbd>Esc</kbd> | Close the film player or gallery |

While it loads, the screen is a pair of lit shoji doors with a brush ensō painting itself in a round window; a red seal is stamped when the house is ready, and the doors slide apart when you enter. Bottom left, a camera-style readout shows timecode, frame rate and the live render scale.

## Run it

You need Node 20.19+ or 22.12+ and a desktop browser with WebGL2.

```bash
npm install
npm run dev        # http://127.0.0.1:5195
```

```bash
npm run build      # static site in dist/
npm run preview    # serve the build at http://127.0.0.1:5196
```

`dist/` is a plain static site, so any static host will serve it (Netlify, Vercel, Cloudflare Pages, GitHub Pages). `.github/workflows/pages.yml` publishes to GitHub Pages when you push to `main`. `deploy/` holds a Caddy and Docker setup if you want to host it on your own server.

The first visit downloads about 160 MB of 3D assets plus the films. Any static host or CDN caches them after that.

## Editing the content

- **All text** is in [`src/ui/copy.js`](src/ui/copy.js): chapters, films, posters, services and contact details.
- **Films:** encode them with `npm run media -- "<path/to/source.mp4>" <name>`, which writes `public/media/video/<name>.mp4` (1080p), `<name>-720.mp4` (for phones and data-saver connections) and `<name>.jpg` (the poster frame). Then add the film to `FILMS` in `copy.js`. A 200 MB master comes out at around 10–15 MB, so every file stays well under GitHub's 100 MB limit. Keep the original masters outside the repo.
- **Posters** go in `public/media/posters/` (with a `thumb/` copy), and the **portrait** is `public/media/pavan.jpg`.
- **Layout and type** are in [`src/ui/ui.css`](src/ui/ui.css); the chapter cards are built in [`src/ui/ui.js`](src/ui/ui.js) (`showCard` and `extra`).
- **Camera stops and times of day** are in [`src/journey/journey.js`](src/journey/journey.js).
- **Pacing and comfort** (`src/journey/journey.js`):
  - **Scroll room:** each chapter gets 110vh of scroll (`#scroll` in `index.html`).
  - **Dissolves:** any stretch longer than 15 m (gate → about, about → featured, services → contact, contact → plan) is not walked; it drifts briefly, dissolves through ink and drifts into the next room (`this.cut` in `journey.js`).
  - **Follow:** the camera follows the scroll on a soft spring (`w`).
  - **Speed limit:** however fast someone scrolls, the camera never moves faster than a walking pace (`PACE`).
  - **Gaze:** the camera turns into bends gradually, like a head following the path, instead of swinging with every curve.
  - **Rests:** the camera holds still for the first and last 27% of each chapter's scroll (`dwell`), so there is time to read.
  - **Reduced motion:** with the OS setting on, everything is slower still and pointer sway is off.
- **Devices** (`src/core/device.js`): phones, tablets, modest laptops and desktops each get their own pixel-ratio cap, MSAA, resolution floor, shadow size and effects. FXAA runs after tone mapping on every tier, to smooth edges.
- **After changing any Japanese text**, re-cut the Japanese font so the new characters are included: `pip install fonttools brotli`, then `PYTHONUTF8=1 python scripts/subset_fonts.py`.

URL parameters for working on a single spot: `?stop=6` opens at that chapter (0–13), `?season=2` picks the season, and `?skip` skips the loader.

## Credits and licences

The code is MIT, inherited from Utsuroi (see [LICENSE](LICENSE)). The scanned assets under `public/assets/` keep their own licences, listed in [CREDITS.md](CREDITS.md) and in the site's colophon (奥付 · Credits). The one non-commercial scan in the original repository has been removed. The portfolio content (copy, films, posters, portrait) is © Pavan.
