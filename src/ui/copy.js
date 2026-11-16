// Every word on the page. The portfolio is told as one walk through a Kyoto house, from the gate before dawn to
// the pond at night: each stop of journey.js is a chapter. Every stop has a word as it would be brushed on a plan,
// its reading, an English title, a chapter label, a line in English and one in Japanese, and optionally an
// `extra` block (stats, tools, services, films, contact) that the chapter card sets beneath the text.
export const SITE = {
  name: 'Pavan',
  handle: 'renderedby.pk',
  email: 'pavankch29@gmail.com',
  instagram: 'https://instagram.com/renderedby.pk',
  igHandle: '@renderedby.pk',
  // a ready-made brief in Gmail, as on the previous site
  brief: 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=pavankch29%40gmail.com&su=Project%20enquiry%20%E2%80%94%20renderedby.pk&body=Hi%20Pavan%2C%0A%0AProject%3A%20%0ADeliverable%20%26%20ratios%3A%20%0ADeadline%3A%20%0ABudget%3A%20%0AReference%20links%3A%20%0A%0AThanks%2C%0A',
};

export const TITLE = {
  jp: '映像作家',
  mark: '映',
  kana: 'えいぞうさっか',
  en: 'Pavan',
  sub: 'Every frame is a decision.',
  subJa: '一コマごとに、決断がある。',
  roles: 'Video Editor · Motion Designer · 3D Artist',
  gloss: 'Reels, product films and key art for brands and founders.',
};

// The films are offline for now: their files are kept in assets/videos/ at the repo root, outside public/, so they
// are not deployed. To bring them back, move that folder to public/media/video/ and add a films chapter again.
const V = './media/video/';
// each film: a 1080p master, a 720p cut for phones, previews and slow connections, and a poster frame
// (scripts/media.mjs)
const film = (id, f) => ({ ...f, src: `${V}${id}.mp4`, lo: `${V}${id}-720.mp4`, poster: `${V}${id}.jpg` });
// the films, strongest first
export const FILMS = {
  ssv: film('ssv-founder', { title: 'Founder Reel', client: 'Real estate · Talking head', dur: '00:40', ar: '9/16', year: '2026', isNew: true,
    note: 'Seven questions to ask before paying an advance on a plot, told by the founder to camera. Hook-first structure, kinetic captions, animated checklist cards and a progress tracker, graded and mixed.' }),
  raw: film('raw-edited', { title: 'Raw → Edited', client: 'Founder series · Breakdown', dur: '00:32', ar: '9/16', year: '2026', isNew: true,
    note: 'The founder series side by side with its raw footage: reframing, captions, grade and pacing — what each pass adds.' }),
  orchid: film('orchid', { title: 'Orchid', client: 'AI platform · Launch film', dur: '01:09', ar: '16/9', year: '2026',
    note: 'A launch film for an AI agent orchestration platform: direction, motion design, animated UI and typography, Resolve grade, sound design and the final mix.' }),
  nw3: film('norwood-03', { title: 'The Art of Diesel', client: 'Norwood Gulf · Campaign master', dur: '00:15', ar: '16/9', year: '2026',
    note: 'The landscape master of the Norwood Gulf campaign: glitch kinetic type into a cinematic workshop cut, with a filmic grade.' }),
  atcozy: film('atcozy', { title: 'The New Season', client: 'AtCozy · Store launch', dur: '00:29', ar: '9/16', year: '2026',
    note: 'A vertical launch film for AtCozy’s new season: offline edit, motion design, a warm grade with skin tones protected, sound design and mix.' }),
  nw2: film('norwood-02', { title: 'The Art of Diesel', client: 'Norwood Gulf · Square cut', dur: '00:25', ar: '1/1', year: '2026',
    note: 'A square social cutdown of the campaign with a vintage film-gate treatment and a typographic build.' }),
  nw1: film('norwood-01', { title: 'How Customers See Us', client: 'Norwood Gulf · Trend reel', dur: '00:11', ar: '9/16', year: '2026',
    note: 'A character-swap trend format for the workshop’s social channels: captions, cut-on-action transitions and timing.' }),
  nw4: film('norwood-04', { title: 'AI Will Take Your Jobs', client: 'Norwood Gulf · Trend reel', dur: '00:10', ar: '9/16', year: '2026',
    note: 'A short vertical loop on a trending format, cut for the paid social ad set.' }),
  fit: film('fit-secrets', { title: 'Fit Secrets', client: 'Fit Secrets · Store film', dur: '00:26', ar: '9/16', year: '2026',
    note: 'A store walkthrough for a supplements retailer: offline edit, kinetic captions, pacing pass and sound design.' }),
};

const P = './media/posters/';
export const POSTERS = [
  { id: 'new-arrival', ar: '16/9', title: 'New Arrival', client: 'Cardinelle Collections' },
  { id: 'modern-essential', ar: '4/5', title: 'Modern Essential', client: 'Cardinelle Collections' },
  { id: 'essential-classics', ar: '4/5', title: 'Essential Classics', client: 'AtCozy' },
  { id: 'leather-pump', ar: '5/7', title: 'Leather Pump', client: 'AtCozy' },
  { id: 'new-collection-atcozy', ar: '4/5', title: 'New Collection', client: 'AtCozy' },
  { id: 'handbag-collection', ar: '6/5', title: 'Handbag Collection', client: 'Cardinelle Collections' },
  { id: 'new-shop-now', ar: '4/5', title: 'New — Shop Now', client: 'Cardinelle Collections' },
  { id: 'love-for-elegance', ar: '4/5', title: 'A Love For Elegance', client: 'Cardinelle Collections' },
  { id: 'style-on-the-go', ar: '4/5', title: 'Style On The Go', client: 'Cardinelle Collections' },
  { id: 'new-collection', ar: '4/5', title: 'New Collection', client: 'Cardinelle Collections' },
  { id: 'timeless-elegance', ar: '4/5', title: 'Timeless Elegance', client: 'Cardinelle Collections' },
  { id: 'velvet-rouge', ar: '4/5', title: 'Velvet Rouge', client: 'Cardinelle Collections' },
  { id: 'bellara', ar: '4/5', title: 'Bellara', client: 'Cardinelle Collections' },
  { id: 'nocturne-majeste', ar: '4/5', title: 'Nocturne Majeste', client: 'Cardinelle Collections' },
  { id: 'editorial-campaign', ar: '4/5', title: 'Editorial Campaign', client: 'Cardinelle Collections' },
].map((p) => ({ ...p, src: `${P}${p.id}.jpg`, thumb: `${P}thumb/${p.id}.jpg` }));

// the four sections, for the header: each opens at its stop
export const NAV = [
  { en: 'About', jp: '机', stop: 1 },
  { en: 'Work', jp: '作品', stop: 2 },
  { en: 'Services', jp: '仕事', stop: 3 },
  { en: 'Contact', jp: '便り', stop: 4 },
];
// which header section a stop belongs to
export const SECTION_OF = [-1, 0, 1, 2, 3, 3];

export const COPY = [
  { id: 'gate', nav: 'Welcome', jp: '映像作家', kana: 'えいぞうさっか', en: 'Every frame is a decision.', label: 'Available for projects — 2026',
    body: 'I edit, animate and grade short-form films for brands and founders: reels that hold attention, product films that explain, key art that sells.',
    ja: '一コマごとに、決断がある。',
    extra: { type: 'hero' } },
  { id: 'genkan', nav: 'About', jp: '机', kana: 'つくえ', en: 'Editor, designer, finisher', label: '01 — About',
    body: 'Four years in post-production, working where editing meets design. Pacing, kinetic typography, motion graphics and colour are handled by one person, from raw footage to final export in every ratio the campaign needs.',
    ja: '素材から納品まで、ひとりで責任を持つ。',
    extra: { type: 'about', src: './media/pavan.jpg', caption: 'Pavan · Remote',
      stats: [['04', '', 'Years in post'], ['15', '+', 'Projects delivered'], ['06', '', 'Brands']],
      tools: ['After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Blender', 'Photoshop'] } },
  { id: 'kare', nav: 'Work', jp: '絵', kana: 'え', en: 'Key art & posters', label: '02 — Work',
    body: 'Campaign posters and product key art for Cardinelle Collections and AtCozy: composition, typography and retouching, delivered for print and social.',
    ja: 'ポスターとキーアート、十五点。',
    extra: { type: 'posters' } },
  { id: 'bedroom', nav: 'Services', jp: '仕事', kana: 'しごと', en: 'Services', label: '03 — Services',
    body: 'One workflow for every project: a short discovery call, a first cut, focused revisions, and delivery in every ratio the campaign needs.',
    ja: '目的を共有し、組み、整え、納める。',
    extra: { type: 'services', items: [
      ['01', 'Reels, Product Demos & Launch Films', 'Hook-first edits, kinetic UI, captions, cutdowns for every platform.', '5–8 working days'],
      ['02', 'VFX & Compositing', 'Camera tracking, object removal, compositing, particle and light passes.', '3–10 days per sequence'],
      ['03', 'Colour Grading', 'Shot matching, custom LUTs, skin-tone protection, broadcast QC.', '2–5 working days'],
      ['04', '3D Artwork & Poster Design', 'Lit Blender scenes, key art, print-ready posters, logo stings.', '4–12 working days'],
    ] } },
  { id: 'night', nav: 'Contact', jp: '便り', kana: 'たより', en: 'Let’s work together', label: '04 — Contact',
    body: 'Send the brief, the footage or just the idea. You will get a straight answer on scope, timeline and cost.',
    ja: 'ご依頼、ご相談はお気軽に。',
    extra: { type: 'contact' } },
  { id: 'above', nav: 'The plan', jp: '間取り', kana: 'まどり', en: 'The whole house', label: 'From above',
    body: 'Every chapter on one plan. Choose a room to return to it.',
    ja: '部屋を選べば、そこへ戻る。',
    extra: { type: 'end' } },
];

export const SEASONS = [
  { jp: '春', en: 'Spring', note: 'Cherry in flower, maples in new leaf' },
  { jp: '夏', en: 'Summer', note: 'Deep green, fireflies over the stream at night' },
  { jp: '秋', en: 'Autumn', note: 'Momiji at their reddest' },
  { jp: '冬', en: 'Winter', note: 'Snow on the roofs and the lanterns' },
];

// the rooms on the plan, labelled with the chapter each one holds
export const PLACES = [
  { jp: '門', en: 'Welcome', x: -21.5, z: 17.0, stop: 0 },
  { jp: '玄関', en: 'About', x: -21.4, z: 0.4, stop: 1 },
  { jp: '枯山水', en: 'Work', x: 14.8, z: 4.0, stop: 2 },
  { jp: '寝室', en: 'Services', x: 10.5, z: -4.6, stop: 3 },
  { jp: '池', en: 'Contact', x: -1.5, z: 7.8, stop: 4 },
];

// whose work the house and garden are built from, as their licences ask: grouped as the colophon sets them
const SF = 'https://sketchfab.com/3d-models/';
const BY = ['CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'];
const STD = ['Sketchfab Standard', 'https://sketchfab.com/licenses'];
const CC0 = ['CC0', 'https://creativecommons.org/publicdomain/zero/1.0/'];
const MIT = ['MIT', 'https://github.com/billpwchan/utsuroi/blob/main/LICENSE'];
export const REPO = 'https://github.com/billpwchan/utsuroi';
export const COLOPHON = {
  en: 'The house this portfolio walks through is Utsuroi by Bill Chan, an open-source three.js world (MIT). Its garden is made of other people’s work: stones, trees and things scanned where they stand, surfaces photographed. Each is used under its licence, with thanks.',
  ja: 'この家は、ビル・チャン氏の「移ろい」をもとにしている。石も木も道具も、その場で測られ、写されたもの。感謝を込めて。',
};
export const CREDITS = [
  { group: 'The house', jp: '家', items: [
    { jp: '移ろい', use: 'Engine, house and garden', work: 'Utsuroi — a house in Kyoto, from first light to last', by: 'Bill Chan', lic: MIT, url: REPO },
  ] },
  { group: 'Trees', jp: '木', items: [
    { jp: '枝垂桜', use: 'The weeping cherry', work: 'Cherry tree', by: 'matousekfoto', lic: BY, url: SF + 'cherry-tree-232e1f60165342afb09a40230f7a469d' },
    { jp: '桜', use: 'The cherries', work: 'Japanese Cherry tree', by: 'Nice2meetU2', lic: BY, url: SF + 'japanese-cherry-tree-ca5a9449555e490cbe726671ed8f95a4' },
    { jp: '紅葉', use: 'The maples', work: 'Tree – Japanese Maple', by: 'CHEI – UC San Diego', lic: BY, url: SF + 'tree-japanese-maple-89cc344581d94991abce6f9fa0af8be3' },
    { jp: '紅葉', use: 'The maples', work: 'Japanese Maple', by: 'stickbone', lic: BY, url: SF + 'japanese-maple-d7ad35d2630f40638e93f43dbd5fd28e' },
    { jp: '刈込', use: 'The clipped shrubs', work: 'Hedge 01', by: 'Publicdomaintextures', lic: BY, url: SF + 'hedge-01-a4eff014b1a84d478d7297acf4eb6160' },
    { jp: '黒松', use: 'The black pines', work: 'Japanese Black Pine', by: 'matt z chan', lic: BY, url: SF + 'japanese-black-pine-f0cb4705f1c446c7bc393fdbfcdf024a' },
  ] },
  { group: 'Stone', jp: '石', items: [
    { jp: '石橋', use: 'The stream’s bridge', work: 'Men Scryfa Standing Stone', by: 'CISMAS', lic: BY, url: SF + 'men-scryfa-standing-stone-7729f4ead68e482cbc7669bf3488236b' },
    { jp: '飛石', use: 'Stepping stones', work: 'Nordic Nature – Natural Flagstone', by: 'Pixelodda', lic: BY, url: SF + 'nordic-nature-natural-flagstone-8f2237dabfe248559c6ed6dffebccb23' },
    { jp: '灯籠', use: 'Lanterns on the roji and by the basin', work: 'Miyajima Stone lantern 1', by: 'Dawnstar-Chronicles', lic: BY, url: SF + 'miyajima-stone-lantern-1-raw-scan-c0dbdb672b154a94a0c0ef20e017ad44' },
    { jp: '雪見灯籠', use: 'Lantern at the water', work: 'Stone lantern scans with iPhone12 Pro', by: 'seirogan', lic: BY, url: SF + 'stone-lantern-scans-with-iphone12-pro-trnio-76e2220436d74461a25e91f4d492c65c' },
    { jp: '角灯籠', model: 'kaku', use: 'Lantern on the far shore', work: 'Japanese stone lantern scan 2', by: 'JabRomich', lic: STD, url: SF + 'japanese-stone-lantern-scan-2-1e90e4f85f7b45e1bc7066ef082a9615' },
    { jp: '蹲踞', use: 'The basins', work: 'Tsukubai scans with iPhone12 Pro', by: 'seirogan', lic: BY, url: SF + 'tsukubai-scans-with-iphone12-pro-221c585db12b4b15be758b293f542975' },
  ] },
  { group: 'In the house', jp: '室内', items: [
    { jp: '茶碗', use: 'Tea bowl', work: 'Japanese Matcha Bowl', by: 'Vision Fountain', lic: BY, url: SF + 'japanese-matcha-bowl-938e05641929403cab1f0c77376e0d9b' },
    { jp: '鉄瓶', use: 'Iron kettle', work: 'Cast Iron Tetsubin', by: 'toomuchtea', lic: BY, url: SF + 'cast-iron-tetsubin-1a49b0714571487d9164b9ba13d03e3f' },
    { jp: '座布団', use: 'Cushions', work: 'Japanese Zabuton', by: 'Geraldo Pratama Wahyu Teddy', lic: BY, url: SF + 'japanese-zabuton-016627cce41a42cfb48db34becd7cbd8' },
    { jp: '下駄', use: 'Geta at the step', work: 'Japanese Geta', by: 'Takuma Nakata', lic: BY, url: SF + 'japanese-geta-f9785f6152484a44bbd73508655a9741' },
    { jp: '行灯', use: 'Paper lamps', work: 'Old Japanese Lamp : Andon', by: 'K', lic: BY, url: SF + 'old-japanese-lamp-andon-0f5cff9fb78b4657b26ddefff4e10fcf' },
  ] },
  { group: 'Paintings', jp: '書画', items: [
    { jp: '松林図屏風', use: 'The screen in the hall', work: 'Pine Trees – Shōrin-zu byōbu – Hasegawa Tōhaku', by: 'xorgol', lic: BY, url: SF + 'pine-trees-shorin-zu-byobu-hasegawa-tohaku-742d33c6904644f8a05b16099034dd55' },
    { jp: '八橋図屏風', use: 'The screen in the next room', work: 'Irises at Yatsuhashi, Ogata Kōrin', by: 'The Metropolitan Museum of Art', lic: CC0, url: 'https://www.metmuseum.org/art/collection/search/39664' },
    { jp: '山水図', use: 'The scroll in the zashiki', work: 'Landscape, Kusumi Morikage', by: 'The Metropolitan Museum of Art', lic: CC0, url: 'https://www.metmuseum.org/art/collection/search/45731' },
    { jp: '一休墨蹟', use: 'The scroll in the tea room', work: 'Naming Certificate for “Tagaku”, Ikkyū Sōjun', by: 'The Metropolitan Museum of Art', lic: CC0, url: 'https://www.metmuseum.org/art/collection/search/913871' },
  ] },
  { group: 'Libraries', jp: '素材', items: [
    { jp: '鯉・枝葉', use: 'Koi, leaf and blossom sprays', work: 'Specimen scans', by: 'ffish.asia / floraZia.com', lic: CC0, url: 'https://sketchfab.com/ffishAsia-and-floraZia' },
    { jp: '石・質感', use: 'Rocks and surfaces', work: 'Scanned models and textures', by: 'Poly Haven', lic: CC0, url: 'https://polyhaven.com' },
    { jp: '質感', use: 'Surfaces', work: 'Scanned materials', by: 'ambientCG', lic: CC0, url: 'https://ambientcg.com' },
  ] },
];
