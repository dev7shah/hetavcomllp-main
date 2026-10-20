"use client";

import { useEffect, useRef } from "react";
import EnquiryForm from "./components/EnquiryForm";

/* ─── SVG world helpers ─────────────────────────────────────────────── */
const R = (x: number, y: number, w: number, h: number, f: string, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${extra}/>`;
const C = (cx: number, cy: number, r: number, f: string) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/>`;

/* Striped awning helper */
function awning(x: number, y: number, w: number, h: number, c1: string, c2: string) {
  const stripes = Math.ceil(w / 38);
  let s = `<g>`;
  for (let i = 0; i < stripes; i++) {
    s += R(x + i * 38, y, 19, h, i % 2 === 0 ? c1 : c2);
  }
  s += `</g>`;
  return s;
}

/* Shelf row helper */
function shelfRow(x: number, y: number, count: number) {
  const cols = ["#254B7A", "#B8963F", "#EEECE8", "#C8553D", "#6B8F4E", "#254B7A", "#B8963F"];
  let s = "";
  for (let i = 0; i < count; i++) {
    s += R(x + i * 28, y, 20, 36, cols[i % cols.length], 'rx="1"');
  }
  return s;
}

/* Window with pane lines */
function window_(x: number, y: number, w: number, h: number) {
  return `
    ${R(x, y, w, h, "#7BA3CC", 'rx="2"')}
    <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#5585A8" stroke-width="1.5"/>
    <line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="#5585A8" stroke-width="1.5"/>
  `;
}

/* Roller shutter bay */
function bay(x: number, y: number, w: number, h: number) {
  let s = R(x, y, w, h, "#C0C8D4", 'rx="2"');
  const lines = 6;
  for (let i = 1; i < lines; i++) {
    const ly = y + (h / lines) * i;
    s += `<line x1="${x}" y1="${ly}" x2="${x + w}" y2="${ly}" stroke="#9BA6B2" stroke-width="1.2"/>`;
  }
  return s;
}

/* Lamp post */
function lampPost(x: number) {
  return `
    <rect x="${x - 3}" y="340" width="6" height="180" fill="#8899AA" rx="3"/>
    <rect x="${x - 24}" y="330" width="48" height="8" fill="#8899AA" rx="4"/>
    ${C(x, 325, 8, "#FFE09A")}
    ${C(x, 325, 12, "rgba(255,224,154,0.2)")}
  `;
}

/* Autorickshaw */
function auto(x: number) {
  return `
    <g>
      <!-- body -->
      ${R(x, 440, 100, 55, "#E8A020", 'rx="6"')}
      <!-- roof -->
      ${R(x + 10, 420, 80, 24, "#CC8A10", 'rx="4"')}
      <!-- windshield -->
      ${R(x + 60, 443, 28, 38, "#A8D0E8", 'rx="3"')}
      <!-- cabin stripe -->
      ${R(x, 440, 55, 55, "#D49018", 'rx="6"')}
      <!-- wheels -->
      ${C(x + 18, 498, 14, "#222")}
      ${C(x + 18, 498, 7, "#888")}
      ${C(x + 82, 498, 14, "#222")}
      ${C(x + 82, 498, 7, "#888")}
      <!-- headlight -->
      ${C(x + 98, 460, 5, "#FFFBC8")}
    </g>
  `;
}

/* Generic shop front */
function shopFront(
  x: number,
  w: number,
  label: string,
  awningC1: string,
  awningC2: string,
  shelfY: number,
  isKirana = false
) {
  const wallColor = isKirana ? "#EDE8DF" : "#D8D4CB";
  const shutterY = 420;
  const shutterH = 100;
  return `
    <!-- ${label} x=${x} w=${w} -->
    ${R(x, 280, w, 240, wallColor)}
    <!-- awning -->
    ${awning(x, 265, w, 48, awningC1, awningC2)}
    <!-- fascia -->
    ${R(x, 308, w, 34, "#1A3558")}
    <text x="${x + w / 2}" y="330" text-anchor="middle" font-family="sans-serif"
      font-size="16" font-weight="bold" fill="#EEECE8" letter-spacing="2">${label}</text>
    <!-- shutter (open) -->
    ${R(x + 10, shutterY, w - 20, shutterH, "#BABFC8", 'rx="2"')}
    ${Array.from({ length: 6 }, (_, i) =>
      `<line x1="${x + 10}" y1="${shutterY + (shutterH / 6) * i}" x2="${x + w - 10}" y2="${shutterY + (shutterH / 6) * i}" stroke="#9BA6B2" stroke-width="1"/>`
    ).join("")}
    <!-- shelves -->
    ${R(x + 6, shelfY, w - 12, 10, "#9A8870")}
    ${shelfRow(x + 8, shelfY - 38, Math.floor((w - 16) / 28))}
    ${R(x + 6, shelfY - 46, w - 12, 8, "#9A8870")}
    ${shelfRow(x + 8, shelfY - 80, Math.floor((w - 16) / 28))}
    <!-- door step -->
    ${R(x + w / 2 - 20, 520, 40, 8, "#C8C0B0")}
  `;
}


/* Build the entire world SVG markup */
function buildWorldSVG() {
  const VW = 5300;
  const VH = 520;
  const SKY = "#8BAFC8";
  const GND = "#C8C4BC"; // unused (band covers it)

  return `<svg id="world" viewBox="0 0 ${VW} ${VH}" height="100%" preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

    <!-- sky fill -->
    ${R(0, 0, VW, VH, "#D9E6F0")}

    <!-- ── SCENE 1: Brand Warehouse  x 0–820 ──────────────────────── -->
    <g id="s1-warehouse">
      <!-- ground -->
      ${R(0, 470, 820, 50, "#B8B4AC")}
      <!-- main building -->
      ${R(20, 200, 780, 320, "#D0CEC8")}
      <!-- roof detail -->
      ${R(20, 180, 780, 30, "#B8B4AC")}
      <!-- rooftop ridge -->
      ${R(0, 170, 820, 18, "#A0A09A")}
      <!-- sign board -->
      ${R(200, 220, 400, 56, "#254B7A", 'rx="4"')}
      <text x="400" y="252" text-anchor="middle" font-family="sans-serif"
        font-size="22" font-weight="bold" fill="#EEECE8" letter-spacing="3">BRAND WAREHOUSE</text>
      <!-- bays -->
      ${bay(30, 330, 210, 140)}
      ${bay(285, 330, 210, 140)}
      ${bay(540, 330, 210, 140)}
      <!-- bay labels -->
      <text x="135" y="326" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#8899AA">BAY 1</text>
      <text x="390" y="326" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#8899AA">BAY 2</text>
      <text x="645" y="326" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#8899AA">BAY 3</text>
      <!-- windows -->
      ${window_(760, 220, 32, 56)}
      <!-- dock ledge -->
      ${R(0, 460, 820, 12, "#A09C98")}
      <!-- forklift silhouette -->
      ${R(750, 390, 50, 70, "#8899AA", 'rx="3"')}
      ${R(800, 370, 10, 90, "#8899AA")}
      <!-- crates at dock -->
      ${R(50, 440, 60, 28, "white", 'rx="2"')}
      ${R(58, 420, 60, 28, "white", 'rx="2"')}
      ${R(66, 400, 60, 28, "white", 'rx="2"')}
    </g>

    <!-- ── SCENE 2: Mumbai Street  x 820–1900 ───────────────────── -->
    <g id="s2-street">
      <!-- road surface -->
      ${R(820, 460, 1080, 60, "#BCBAB4")}
      <!-- road markings -->
      ${R(820, 488, 1080, 6, "#E8E4DC")}
      <!-- buildings background -->
      ${R(820, 240, 240, 280, "#C8C4BC")}
      ${R(1100, 200, 300, 320, "#D0CCBC")}
      ${R(1460, 260, 280, 260, "#C0BEB8")}
      ${R(1720, 220, 180, 300, "#CCCCB8")}
      <!-- windows on buildings -->
      ${window_(840, 260, 28, 40)}
      ${window_(880, 260, 28, 40)}
      ${window_(840, 320, 28, 40)}
      ${window_(880, 320, 28, 40)}
      ${window_(1120, 220, 32, 44)}
      ${window_(1170, 220, 32, 44)}
      ${window_(1220, 220, 32, 44)}
      ${window_(1120, 280, 32, 44)}
      ${window_(1170, 280, 32, 44)}
      ${window_(1220, 280, 32, 44)}
      ${window_(1120, 340, 32, 44)}
      ${window_(1170, 340, 32, 44)}
      ${window_(1220, 340, 32, 44)}
      ${window_(1480, 280, 30, 40)}
      ${window_(1520, 280, 30, 40)}
      ${window_(1560, 280, 30, 40)}
      ${window_(1480, 340, 30, 40)}
      ${window_(1520, 340, 30, 40)}
      ${window_(1560, 340, 30, 40)}
      ${window_(1740, 250, 28, 38)}
      ${window_(1780, 250, 28, 38)}
      ${window_(1740, 310, 28, 38)}
      ${window_(1780, 310, 28, 38)}
      <!-- lamp posts -->
      ${lampPost(900)}
      ${lampPost(1100)}
      ${lampPost(1350)}
      ${lampPost(1600)}
      ${lampPost(1850)}
      <!-- parked autorickshaws -->
      ${auto(920)}
      ${auto(1420)}
    </g>

    <!-- ── SCENE 3: Wholesale Market  x 1900–3700 ───────────────── -->
    <g id="s3-market">
      <!-- banner pole left -->
      ${R(1908, 240, 8, 200, "#8899AA")}
      <!-- banner pole right -->
      ${R(3684, 240, 8, 200, "#8899AA")}
      <!-- banner rope -->
      <path d="M 1916 242 Q 2800 200 3684 242" stroke="#888" stroke-width="3" fill="none"/>
      <!-- banner cloth -->
      ${R(2200, 205, 1200, 54, "#254B7A", 'rx="4"')}
      <text x="2800" y="238" text-anchor="middle" font-family="sans-serif"
        font-size="24" font-weight="bold" fill="#EEECE8" letter-spacing="3">WHOLESALE MARKET</text>
      <!-- 6 stalls -->
      <!-- Stall A: navy/cream -->
      ${R(1920, 290, 280, 230, "#E8E4DC")}
      ${awning(1920, 272, 280, 38, "#254B7A", "#EEECE8")}
      ${R(1930, 370, 260, 10, "#9A8870")}
      ${shelfRow(1932, 334, 8)}
      ${R(1930, 416, 260, 10, "#9A8870")}
      ${shelfRow(1932, 380, 8)}
      <!-- crates under counter -->
      ${R(1940, 445, 55, 40, "white", 'rx="2"')} 
      ${R(2005, 445, 55, 40, "white", 'rx="2"')}
      ${R(2070, 445, 55, 40, "white", 'rx="2"')}
      <!-- hanging bulbs -->
      <line x1="1960" y1="268" x2="1960" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(1960, 300, 7, "#FFE09A")}
      <line x1="2060" y1="268" x2="2060" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2060, 300, 7, "#FFE09A")}
      <line x1="2160" y1="268" x2="2160" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2160, 300, 7, "#FFE09A")}

      <!-- Stall B: gold/cream -->
      ${R(2240, 290, 280, 230, "#E8E4DC")}
      ${awning(2240, 272, 280, 38, "#B8963F", "#EEECE8")}
      ${R(2250, 370, 260, 10, "#9A8870")}
      ${shelfRow(2252, 334, 8)}
      ${R(2250, 416, 260, 10, "#9A8870")}
      ${shelfRow(2252, 380, 8)}
      ${R(2260, 445, 55, 40, "white", 'rx="2"')}
      ${R(2325, 445, 55, 40, "white", 'rx="2"')}
      ${R(2390, 445, 55, 40, "white", 'rx="2"')}
      <line x1="2280" y1="268" x2="2280" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2280, 300, 7, "#FFE09A")}
      <line x1="2380" y1="268" x2="2380" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2380, 300, 7, "#FFE09A")}
      <line x1="2480" y1="268" x2="2480" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2480, 300, 7, "#FFE09A")}

      <!-- Stall C: navy/cream -->
      ${R(2560, 290, 280, 230, "#E8E4DC")}
      ${awning(2560, 272, 280, 38, "#254B7A", "#EEECE8")}
      ${R(2570, 370, 260, 10, "#9A8870")}
      ${shelfRow(2572, 334, 8)}
      ${R(2570, 416, 260, 10, "#9A8870")}
      ${shelfRow(2572, 380, 8)}
      ${R(2580, 445, 55, 40, "white", 'rx="2"')}
      ${R(2645, 445, 55, 40, "white", 'rx="2"')}
      ${R(2710, 445, 55, 40, "white", 'rx="2"')}
      <line x1="2600" y1="268" x2="2600" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2600, 300, 7, "#FFE09A")}
      <line x1="2700" y1="268" x2="2700" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2700, 300, 7, "#FFE09A")}
      <line x1="2800" y1="268" x2="2800" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2800, 300, 7, "#FFE09A")}

      <!-- Stall D: gold/navy -->
      ${R(2880, 290, 280, 230, "#E8E4DC")}
      ${awning(2880, 272, 280, 38, "#B8963F", "#254B7A")}
      ${R(2890, 370, 260, 10, "#9A8870")}
      ${shelfRow(2892, 334, 8)}
      ${R(2890, 416, 260, 10, "#9A8870")}
      ${shelfRow(2892, 380, 8)}
      ${R(2900, 445, 55, 40, "white", 'rx="2"')}
      ${R(2965, 445, 55, 40, "white", 'rx="2"')}
      ${R(3030, 445, 55, 40, "white", 'rx="2"')}
      <line x1="2920" y1="268" x2="2920" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(2920, 300, 7, "#FFE09A")}
      <line x1="3020" y1="268" x2="3020" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(3020, 300, 7, "#FFE09A")}
      <line x1="3120" y1="268" x2="3120" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(3120, 300, 7, "#FFE09A")}

      <!-- Stall E: navy/cream -->
      ${R(3200, 290, 280, 230, "#E8E4DC")}
      ${awning(3200, 272, 280, 38, "#254B7A", "#EEECE8")}
      ${R(3210, 370, 260, 10, "#9A8870")}
      ${shelfRow(3212, 334, 8)}
      ${R(3210, 416, 260, 10, "#9A8870")}
      ${shelfRow(3212, 380, 8)}
      ${R(3220, 445, 55, 40, "white", 'rx="2"')}
      ${R(3285, 445, 55, 40, "white", 'rx="2"')}
      ${R(3350, 445, 55, 40, "white", 'rx="2"')}
      <line x1="3240" y1="268" x2="3240" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(3240, 300, 7, "#FFE09A")}
      <line x1="3340" y1="268" x2="3340" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(3340, 300, 7, "#FFE09A")}
      <line x1="3440" y1="268" x2="3440" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(3440, 300, 7, "#FFE09A")}

      <!-- Stall F: gold/cream -->
      ${R(3520, 290, 180, 230, "#E8E4DC")}
      ${awning(3520, 272, 180, 38, "#B8963F", "#EEECE8")}
      ${R(3528, 370, 164, 10, "#9A8870")}
      ${shelfRow(3530, 334, 5)}
      ${R(3528, 416, 164, 10, "#9A8870")}
      ${shelfRow(3530, 380, 5)}
      ${R(3540, 445, 48, 40, "white", 'rx="2"')}
      ${R(3598, 445, 48, 40, "white", 'rx="2"')}
      <line x1="3560" y1="268" x2="3560" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(3560, 300, 7, "#FFE09A")}
      <line x1="3650" y1="268" x2="3650" y2="295" stroke="#AAA" stroke-width="1.5"/>
      ${C(3650, 300, 7, "#FFE09A")}
    </g>

    <!-- ── SCENE 4: Shops  x 3760–5120 ─────────────────────────── -->
    <g id="s4-shops">
      <!-- road -->
      ${R(3760, 460, 1360, 60, "#BCBAB4")}

      <!-- PROVISIONS (380 wide, x=3760) -->
      ${shopFront(3760, 380, "PROVISIONS", "#254B7A", "#EEECE8", 412)}

      <!-- GENERAL STORE (380 wide, x=4180) -->
      ${shopFront(4180, 380, "GENERAL STORE", "#B8963F", "#254B7A", 412)}

      <!-- KIRANA STORE (560 wide, centred at 4840, so x=4560) -->
      ${shopFront(4560, 560, "KIRANA STORE", "#254B7A", "#B8963F", 412, true)}

      <!-- kirana porch / step -->
      ${R(4600, 508, 480, 20, "#D0C8B8")}

      <!-- lamp post beside kirana -->
      ${lampPost(4520)}
      ${lampPost(5100)}

      <!-- photo slot placeholder outlines -->
      <!-- NOTE: Replace <g id="photo-provisions"> with a <image> tag pointing to a photo PNG -->
      <!-- NOTE: Replace <g id="photo-general"> with a <image> tag pointing to a photo PNG -->
      <!-- NOTE: Replace <g id="photo-kirana"> with a <image> tag pointing to a photo PNG -->
    </g>

    <!-- ground line (covered by band) -->
    ${R(0, 510, VW, 10, "#A8A49C")}
  </svg>`;
}

/* Skyline SVG */
function buildSkylineSVG() {
  const buildings = [
    [0, 120, 90, 200],
    [85, 160, 70, 160],
    [150, 80, 100, 240],
    [245, 130, 80, 190],
    [320, 60, 120, 260],
    [435, 110, 90, 210],
    [520, 150, 70, 170],
    [585, 90, 110, 230],
    [690, 70, 80, 250],
    [765, 120, 90, 200],
    [850, 100, 60, 220],
    [905, 140, 100, 180],
    [1000, 80, 90, 240],
    [1085, 110, 70, 210],
    [1150, 60, 110, 260],
    [1255, 130, 80, 190],
    [1330, 90, 100, 230],
    [1425, 120, 80, 200],
    [1500, 70, 90, 250],
    [1585, 140, 80, 180],
    [1660, 100, 70, 220],
    [1725, 80, 110, 240],
    [1830, 120, 90, 200],
    [1915, 60, 100, 260],
    [2010, 110, 80, 210],
    [2085, 90, 90, 230],
    [2170, 130, 70, 190],
    [2235, 80, 110, 240],
    [2340, 100, 80, 220],
    [2415, 70, 90, 250],
  ] as [number, number, number, number][];

  let markup = `<svg id="skyline" viewBox="0 0 2500 320" preserveAspectRatio="xMinYMax meet"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
  buildings.forEach(([x, y, w, h]) => {
    const numWin = Math.floor(w / 22);
    const numRows = Math.floor(h / 28);
    markup += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#254B7A" opacity="0.13"/>`;
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numWin; c++) {
        markup += `<rect x="${x + 6 + c * 22}" y="${y + 8 + r * 28}" width="10" height="12"
          fill="#B8963F" opacity="${Math.random() > 0.4 ? 0.5 : 0.1}" rx="1"/>`;
      }
    }
  });
  markup += `</svg>`;
  return markup;
}

/* ─── Main Page Component ───────────────────────────────────────────── */
export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<SVGSVGElement | null>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const servicesBandRef = useRef<HTMLDivElement>(null);
  const groundLineRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Get live DOM refs
    const stage = document.getElementById("stage")!;
    const truck = truckRef.current!;
    const wheels = Array.from(
      truck.querySelectorAll<HTMLElement>(".wh")
    );
    const worldEl = document.getElementById("world") as SVGSVGElement | null;
    const skylineEl = skylineRef.current!;
    const heroEl = heroRef.current!;
    const captionEl = captionRef.current!;
    const servicesBandEl = servicesBandRef.current!;
    const groundLineEl = groundLineRef.current!;
    const speedEl = speedRef.current!;
    const crateEls = [
      document.getElementById("crate0"),
      document.getElementById("crate1"),
      document.getElementById("crate2"),
    ];

    /* ── scroll engine ── */
    const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const sg = (p: number, a: number, b: number) => cl((p - a) / (b - a));
    const lp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ez = (t: number) => t * t * (3 - 2 * t);

    let sp = 0;
    let prevDist = 0;
    let velocity = 0;
    let rafId: number;

    function update(p: number) {
      const iw = window.innerWidth;
      const ih = window.innerHeight;
      const k = (ih * 0.5) / 520; // world scale
      const tw = Math.min(iw * 0.6, 540); // truck width
      const x0 = -tw * 1.1; // off-screen left

      /* truck X */
      const tx = lp(x0, iw * 0.18, ez(sg(p, 0, 0.12)));

      /* world offset — stops when kirana centre is at 74% of viewport */
      const KIRANA_CENTER = 4840;
      const worldT =
        (iw * 0.74 - KIRANA_CENTER * k) * sg(p, 0.12, 0.82);

      /* distance travelled (truck relative to world origin) */
      const dist = tx - x0 - worldT;

      /* truck bounce */
      truck.style.transform = `translate(${tx}px, ${Math.sin(dist / 38) * 1.3}px)`;

      /* wheel rotation: circumference ≈ π × 142 px ≈ 446 px per rev */
      const rot = (dist / 446) * 360;
      wheels.forEach((w) => {
        w.style.transform = `rotate(${rot}deg)`;
      });

      /* world translate */
      if (worldEl)
        worldEl.style.transform = `translateX(${worldT}px)`;

      /* skyline parallax */
      skylineEl.style.transform = `translateX(${worldT * 0.25}px)`;

      /* ghost text — moves opposite direction */
      const ghostEl = document.getElementById("ghost-text");
      if (ghostEl)
        ghostEl.style.transform = `translateY(-50%) translateX(${worldT * 0.15}px)`;

      /* ground dashed line scrolls with the world */
      groundLineEl.style.transform = `translateX(${-dist * 0.5}px)`;

      /* ── hero headline ── */
      const heroT = 1 - ez(sg(p, 0.08, 0.16));
      heroEl.style.opacity = String(heroT);
      heroEl.style.pointerEvents = heroT < 0.05 ? "none" : "auto";

      /* ── services band ── */
      const svcT =
        ez(sg(p, 0.12, 0.22)) * (1 - ez(sg(p, 0.75, 0.85)));
      servicesBandEl.style.opacity = String(svcT);

      /* ── captions ── */
      const capTexts = [
        { a: 0.30, b: 0.46, text: "Route optimised, tracked live." },
        { a: 0.46, b: 0.64, text: "Through Mumbai's markets." },
        { a: 0.64, b: 0.82, text: "To the shop door." },
        { a: 0.87, b: 1.00, text: "Shelf-ready in 48 hours." },
      ];
      let capText = "";
      let capAlpha = 0;
      capTexts.forEach(({ a, b, text }) => {
        const mid = (a + b) / 2;
        const inT = ez(sg(p, a, a + 0.05));
        const outT = p > mid ? ez(sg(p, b - 0.05, b)) : 0;
        const alpha = inT - outT;
        if (alpha > capAlpha) { capAlpha = alpha; capText = text; }
      });
      captionEl.style.opacity = String(Math.max(0, capAlpha));
      if (capText) captionEl.textContent = capText;

      /* ── crate drop animation ── */
      const crateConfigs = [
        { p0: 0.84, p1: 0.88, x: 0, finalY: 0 },
        { p0: 0.87, p1: 0.91, x: 80, finalY: 0 },
        { p0: 0.90, p1: 0.94, x: 160, finalY: 0 },
      ];
      crateEls.forEach((el, i) => {
        if (!el) return;
        const cfg = crateConfigs[i];
        const t = ez(sg(p, cfg.p0, cfg.p1));
        const dropY = lp(-80, 0, t);
        const alpha = t;
        el.style.opacity = String(alpha);
        el.style.transform = `translate(0px, ${dropY}px)`;
      });

      /* ── speed counter ── */
      velocity = lp(velocity, Math.min(60, Math.abs(dist - prevDist) * 6), 0.15);
      prevDist = dist;
      if (speedEl) {
        const kmh = Math.round(velocity);
        speedEl.textContent = `${String(kmh).padStart(2, "0")} km/h`;
      }
    }

    function frame() {
      if (!track) return;
      const r = track.getBoundingClientRect();
      const rawT = -r.top / (r.height - window.innerHeight);
      const target = Math.min(1, Math.max(0, rawT));

      if (prefersReduced) {
        sp = target;
      } else {
        sp += (target - sp) * 0.14;
        if (Math.abs(target - sp) < 0.0002) sp = target;
      }

      update(sp);
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* Wheel position calculations (truck image 1100×541 when at full size 540px wide):
     Scale factor = 540/1100 = 0.4909
     Wheel diameter in original = 142 / 0.4909 * 0.4909 = 142px at 540px width = 12.93% of 1100
     rear wheel centre original px: (302.7, 467.4)
       left% = (302.7 - 71) / 1100 * 100 = 21.06%
       top%  = (467.4 - 71) / 541  * 100 = 73.27%  (top of wheel = centre - radius)
     front wheel centre original px: (878.2, 467.4)
       left% = (878.2 - 71) / 1100 * 100 = 73.38%
       top%  = same = 73.27%
     The wheel.png has TWO wheels side by side; we use background-position to show only left.
  */
  const wheelSize = "12.93%";
  const wheelStyle = (leftPct: string, topPct: string): React.CSSProperties => ({
    width: wheelSize,
    left: leftPct,
    top: topPct,
    transformOrigin: "center center",
    backgroundImage: "url('/wheel.png')",
    backgroundSize: "200% 100%",   // show only left half (left wheel)
    backgroundPosition: "0% 50%",
    backgroundRepeat: "no-repeat",
    backgroundColor: "transparent",
  });

  return (
    <>
      {/* ── Fixed header ─────────────────────────────────────────── */}
      <header id="header" role="banner">
        <a href="/" className="logo-wrap" aria-label="Hetav Group home">
          {/* SVG logo mark */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="4" fill="#254B7A"/>
            <rect x="9" y="6" width="7" height="24" rx="3.5" fill="#EEECE8"/>
            <rect x="20" y="6" width="7" height="24" rx="3.5" fill="#EEECE8"/>
            <rect x="6" y="15" width="24" height="6" rx="3" fill="#B8963F"/>
          </svg>
          <span className="logo-name">Hetav Group</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#contact" className="btn-quote">Get a quote</a>
        </nav>
      </header>

      {/* ── Scroll track ─────────────────────────────────────────── */}
      <div id="track" ref={trackRef} aria-hidden="true">
        <div id="stage">
          {/* Ghost text */}
          <div id="ghost-text" aria-hidden="true">OUR SERVICES</div>

          {/* Skyline */}
          <div
            id="skyline"
            ref={skylineRef}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: buildSkylineSVG() }}
          />

          {/* World */}
          <div id="world-wrap" aria-label="Scroll to see the delivery journey">
            <div dangerouslySetInnerHTML={{ __html: buildWorldSVG() }} />
          </div>

          {/* Delivered crates — positioned on stage, animated in by scroll engine */}
          <div
            id="crate0"
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "calc(var(--band) + 0px)",
              left: "60vw",
              width: 72,
              opacity: 0,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <svg width="72" height="56" viewBox="0 0 72 56">
              <rect width="72" height="56" rx="4" fill="white" stroke="#D8D4CB" strokeWidth="2"/>
              <line x1="0" y1="18" x2="72" y2="18" stroke="#D8D4CB" strokeWidth="1.5"/>
              <line x1="0" y1="38" x2="72" y2="38" stroke="#D8D4CB" strokeWidth="1.5"/>
              <rect x="0" y="24" width="72" height="8" fill="#B8963F" opacity="0.85"/>
              <text x="36" y="15" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#5B6B7C">HETAV</text>
            </svg>
          </div>
          <div
            id="crate1"
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "calc(var(--band) + 0px)",
              left: "calc(60vw + 80px)",
              width: 72,
              opacity: 0,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <svg width="72" height="56" viewBox="0 0 72 56">
              <rect width="72" height="56" rx="4" fill="white" stroke="#D8D4CB" strokeWidth="2"/>
              <line x1="0" y1="18" x2="72" y2="18" stroke="#D8D4CB" strokeWidth="1.5"/>
              <line x1="0" y1="38" x2="72" y2="38" stroke="#D8D4CB" strokeWidth="1.5"/>
              <rect x="0" y="24" width="72" height="8" fill="#B8963F" opacity="0.85"/>
              <text x="36" y="15" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#5B6B7C">HETAV</text>
            </svg>
          </div>
          <div
            id="crate2"
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "calc(var(--band) + 0px)",
              left: "calc(60vw + 160px)",
              width: 72,
              opacity: 0,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <svg width="72" height="56" viewBox="0 0 72 56">
              <rect width="72" height="56" rx="4" fill="white" stroke="#D8D4CB" strokeWidth="2"/>
              <line x1="0" y1="18" x2="72" y2="18" stroke="#D8D4CB" strokeWidth="1.5"/>
              <line x1="0" y1="38" x2="72" y2="38" stroke="#D8D4CB" strokeWidth="1.5"/>
              <rect x="0" y="24" width="72" height="8" fill="#B8963F" opacity="0.85"/>
              <text x="36" y="15" textAnchor="middle" fontFamily="sans-serif" fontSize="8" fill="#5B6B7C">HETAV</text>
            </svg>
          </div>

          {/* Ground band */}
          <div id="ground" aria-hidden="true">
            <div id="ground-line" ref={groundLineRef} />
            {/* Services */}
            <div id="services-band" ref={servicesBandRef} aria-label="Our services">
              <div className="service-card">
                {/* Warehouse icon */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path d="M2 14 L14 4 L26 14 V26H2V14Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="10" y="18" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                <h3>Warehousing</h3>
                <p>Organised storage with monitored stock movement</p>
              </div>
              <div className="service-card">
                {/* Truck icon */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <rect x="2" y="8" width="18" height="14" stroke="currentColor" strokeWidth="2" fill="none" rx="2"/>
                  <path d="M20 12H24L26 16V22H20V12Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="7" cy="23" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="21" cy="23" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <h3>Retail Distribution</h3>
                <p>A reliable delivery network for wholesalers and retailers</p>
              </div>
              <div className="service-card">
                {/* Fleet icon */}
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M14 4 L14 14 L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3>Fleet Operations</h3>
                <p>Commercial vehicles on routes built for speed and cost</p>
              </div>
            </div>
          </div>

          {/* Truck */}
          <div id="truck" ref={truckRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tb"
              src="/truck.png"
              alt="Hetav Group delivery truck"
              draggable="false"
            />
            {/* Rear wheel overlay */}
            <div
              className="wh"
              style={wheelStyle("21.06%", "73.27%")}
              aria-hidden="true"
            />
            {/* Front wheel overlay */}
            <div
              className="wh"
              style={wheelStyle("73.38%", "73.27%")}
              aria-hidden="true"
            />
          </div>

          {/* Hero headline */}
          <div id="hero-hl" ref={heroRef}>
            <h1>Rooted in values.<br />Built for growth.</h1>
            <p className="sub">Hetav Commerce LLP · Jogeshwari West, Mumbai</p>
          </div>

          {/* Caption */}
          <div id="caption" ref={captionRef} aria-live="polite" />

          {/* Speed counter */}
          <div id="speed" ref={speedRef} aria-hidden="true">00 km/h</div>
        </div>
      </div>

      {/* ── About section ────────────────────────────────────────── */}
      <section id="about" className="section dm" aria-labelledby="about-heading">
        <h2 id="about-heading">
          Built for velocity,<br />engineered for scale.
        </h2>
        <p className="tagline">
          Small retailers couldn&apos;t get reliable, fairly priced FMCG supply.
          Hetav Commerce was built to change that — connecting authorised brand
          warehouses directly to businesses across Mumbai, with GPS-tracked vehicles,
          cold-chain logistics, and a single point of contact from order to handover.
        </p>
        <div className="cards-row">
          <div className="value-card">
            <svg className="vc-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M20 4 L36 12 V24 C36 31 28 36 20 38 C12 36 4 31 4 24V12L20 4Z"
                stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <path d="M13 20 L18 25 L27 15" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Quality assurance</h3>
            <p>
              Direct from authorised brand warehouses. Cold-chain maintained from
              pick-up to documented handover.
            </p>
          </div>
          <div className="value-card">
            <svg className="vc-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <path d="M20 10 L20 20 L27 25" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>On-time delivery</h3>
            <p>
              48-hour delivery window. GPS-tracked vehicles on every route, so you
              always know where your order is.
            </p>
          </div>
          <div className="value-card">
            <svg className="vc-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path d="M8 20 C8 13 13 8 20 8 S32 13 32 20 27 32 20 32" stroke="currentColor"
                strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M20 16 L20 24 M16 20 L24 20" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round"/>
            </svg>
            <h3>Dedicated support</h3>
            <p>
              One point of contact. Support responds within the hour, every business
              day.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact section ───────────────────────────────────────── */}
      <section id="contact" className="section" aria-labelledby="contact-heading">
        <p className="contact-sub">Get in touch</p>
        <h2 id="contact-heading">Ready to stock smarter?</h2>
        <div className="contact-grid">
          {/* Details */}
          <div className="contact-details">
            <div className="contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.1 1.2 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z"/>
              </svg>
              <div>
                <a href="tel:+918976434940">+91 89764 34940</a>
                <br />
                <span style={{ fontSize: 12, opacity: 0.5 }}>Responds within the hour</span>
              </div>
            </div>
            <div className="contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href="mailto:hetavgroup@gmail.com">hetavgroup@gmail.com</a>
            </div>
            <div className="contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <address style={{ fontStyle: "normal" }}>
                Hetav Commerce LLP,<br />
                Jogeshwari West,<br />
                Mumbai – 400102
              </address>
            </div>
            <div className="contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <div>
                <strong style={{ color: "var(--gold)" }}>48-hour delivery</strong>
                <br />
                <span style={{ fontSize: 12, opacity: 0.5 }}>GPS-tracked · Cold chain · Documented handover</span>
              </div>
            </div>
          </div>

          {/* Enquiry form */}
          <EnquiryForm />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer role="contentinfo">
        <p>© Hetav Commerce LLP · Registered in India</p>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="tel:+918976434940">+91 89764 34940</a>
          <a href="mailto:hetavgroup@gmail.com">hetavgroup@gmail.com</a>
        </div>
      </footer>

      {/* ── WhatsApp FAB ─────────────────────────────────────────── */}
      <a
        id="wa-fab"
        href="https://wa.me/918976434940"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
