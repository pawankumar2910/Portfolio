// What kind of device the house is drawn on, and how much of it each kind can carry at a steady 60 fps.
// Phones get fewer pixels (their screens are dense enough that 1.5x reads sharp), smaller shadow maps and no
// volumetric light or SSAO; tablets sit between; a desktop keeps everything. The render-scale governor still adapts
// within each tier, but never below the tier's floor, where edges start to break up.
const ua = navigator.userAgent || '';
const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
const short = Math.min(screen.width || innerWidth, screen.height || innerHeight);
const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPadOS reports itself as a Mac
const mobile = /Android.*Mobile|iPhone|iPod|Windows Phone/.test(ua) || (coarse && short < 600);
const tablet = !mobile && (/iPad|Tablet|Android/.test(ua) || touchMac || (coarse && short < 1100));
// a modest laptop: few cores or little memory
const lowDesktop = !mobile && !tablet && ((navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4);

export const TIER = mobile ? 'mobile' : tablet ? 'tablet' : lowDesktop ? 'laptop' : 'desktop';
export const TOUCH = coarse || mobile || tablet;
export const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const dpr = window.devicePixelRatio || 1;
const TABLE = {
  //        pixel ratio cap      MSAA  scale floor  shadow  far shadow  volumetric  ssao  visibility bake dirs
  desktop: { dpr: Math.min(dpr, 2), samples: dpr >= 1.5 ? 2 : 4, minScale: 0.66, shadow: 4096, farShadow: 4096, vol: true, ssao: true, dirs: 128 },
  laptop: { dpr: Math.min(dpr, 1.5), samples: 4, minScale: 0.62, shadow: 2048, farShadow: 2048, vol: true, ssao: true, dirs: 96 },
  tablet: { dpr: Math.min(dpr, 1.5), samples: 4, minScale: 0.6, shadow: 2048, farShadow: 2048, vol: true, ssao: false, dirs: 96 },
  mobile: { dpr: Math.min(dpr, 1.5), samples: 4, minScale: 0.58, shadow: 2048, farShadow: 1024, vol: false, ssao: false, dirs: 64 },
};
export const Q = TABLE[TIER];
document.documentElement.dataset.tier = TIER;
