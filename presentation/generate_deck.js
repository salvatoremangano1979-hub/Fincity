'use strict';
const pptxgen = require('pptxgenjs');
const path = require('path');

const SKILL_DIR = 'C:\\Users\\salvatore.mangano\\AppData\\Roaming\\Claude\\local-agent-mode-sessions\\skills-plugin\\990c5a80-1c14-4444-9de9-b2fb93471422\\c412777a-d1a7-4b1b-8633-6497839ef7fc\\skills\\pptx';
const OUTPUT = path.resolve(__dirname, 'FinCity_Deck.pptx');

// ── Colors (no #, no alpha) ──────────────────────────────────
const PURPLE   = 'A100FF';
const DARK_BG  = '08080F';
const DARK_S   = '12122A';
const WHITE    = 'FFFFFF';
const OFFWHITE = 'F8F8F8';
const TEXT_D   = '111111';
const TEXT_M   = '555555';
const TEXT_DIM = '888888';
const TEXT_L   = 'DDDDDD';
const AMETHYST = 'CC88FF';
const TEAL     = '00D4A3';

const THEME = {
  name: 'FinCity',
  headFontFace: 'Cambria',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '0A0A14', lt1: 'FFFFFF',
    dk2: '1A1A2E', lt2: 'F4F4F8',
    accent1: 'A100FF', accent2: '6B00AA',
    accent3: '00D4A3', accent4: 'F59E0B',
    accent5: 'EF4444', accent6: '94A3B8',
    hlink: 'A100FF', folHlink: '6B00AA'
  }
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

const W = 10;
const H = 5.625;

// ── Helpers ──────────────────────────────────────────────────

function darkBg(slide) {
  slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: DARK_BG }, line: { color: DARK_BG } });
}
function lightBg(slide) {
  slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: OFFWHITE }, line: { color: OFFWHITE } });
}
function glow(slide, x, y, r, t = 88) {
  slide.addShape(pres.ShapeType.ellipse, { x: x - r / 2, y: y - r / 2, w: r, h: r, fill: { color: PURPLE, transparency: t }, line: { color: PURPLE, transparency: t } });
}
function badge(slide, text, x, y, w = 1.5, h = 0.36) {
  slide.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: PURPLE }, line: { color: PURPLE } });
  slide.addText(text, { isTextBox: true, x, y, w, h, align: 'center', valign: 'middle', fontSize: 9, bold: true, color: WHITE, charSpacing: 1, margin: 0 });
}
function lbl(slide, text, x, y, w, color = PURPLE) {
  slide.addText(text, { isTextBox: true, x, y, w, h: 0.28, fontSize: 10, bold: true, charSpacing: 3, color, margin: 0 });
}
function iconCircle(slide, emoji, x, y, d = 0.52) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: '2A0060' }, line: { color: PURPLE, pt: 1.5 } });
  slide.addText(emoji, { isTextBox: true, x, y, w: d, h: d, fontSize: Math.round(d * 26), align: 'center', valign: 'middle', margin: 0 });
}
function pill(slide, text, x, y, w = 2.1, h = 0.36) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: DARK_S }, line: { color: PURPLE, pt: 1.2 }, rectRadius: 0.1 });
  slide.addText(text, { isTextBox: true, x, y, w, h, fontSize: 11, bold: true, color: AMETHYST, align: 'center', valign: 'middle', margin: 0 });
}

// ─────────────────────────────────────────────────────────────
// SLIDE 1 — COVER (dark)
// ─────────────────────────────────────────────────────────────
const s1 = pres.addSlide();
darkBg(s1);
glow(s1, 9.2, 1.2, 4.5, 90);
glow(s1, 8.8, 4.8, 3.2, 86);
glow(s1, 0.5, 5.2, 2.0, 90);

badge(s1, 'ACCENTURE ›', 8.2, 0.28);

lbl(s1, 'AI HACKATHON 2026  ·  EDUCAZIONE FINANZIARIA', 0.5, 0.78, 8);

iconCircle(s1, '🏙️', 0.5, 1.15, 0.75);

s1.addText('FinCity', {
  isTextBox: true, x: 1.42, y: 1.05, w: 7.5, h: 1.45,
  fontSize: 80, bold: true, color: WHITE, fontFace: 'Cambria', margin: 0
});

s1.addText('Costruisci il tuo futuro finanziario,\nun mese alla volta.', {
  isTextBox: true, x: 0.5, y: 2.65, w: 7.5, h: 0.85,
  fontSize: 18, color: TEXT_L, lineSpacingMultiple: 1.35, margin: 0
});

pill(s1, '🎮  City Builder',     0.5,  3.65);
pill(s1, '🤖  Claude AI Coach',  2.75, 3.65);
pill(s1, '📊  Agentic Coding',   5.0,  3.65);

s1.addText('Salvatore Mangano  ·  Accenture', {
  isTextBox: true, x: 0.5, y: 5.18, w: 9, h: 0.28,
  fontSize: 10, color: '444444', margin: 0
});

s1.addNotes('COVER – 30 sec. Presentate FinCity: un city builder educativo per insegnare finanza personale di base. Sviluppato con Claude Code e un\'architettura agentica. Passate subito al problema.');

// ─────────────────────────────────────────────────────────────
// SLIDE 2 — IL PROBLEMA (light)
// ─────────────────────────────────────────────────────────────
const s2 = pres.addSlide();
lightBg(s2);

lbl(s2, 'IL PROBLEMA', 0.5, 0.28, 9, PURPLE);

s2.addText("L'Italia ha un problema\ndi alfabetizzazione finanziaria.", {
  isTextBox: true, x: 0.5, y: 0.62, w: 9, h: 1.1,
  fontSize: 34, bold: true, color: TEXT_D, fontFace: 'Cambria', margin: 0
});

s2.addText('Corsi e libri non bastano. Serve un approccio esperienziale, concreto, coinvolgente.', {
  isTextBox: true, x: 0.5, y: 1.76, w: 9, h: 0.38,
  fontSize: 14, color: TEXT_M, margin: 0
});

// 3 stat cards
const statsData = [
  { num: '37°',  sub: 'su 39 Paesi OCSE', desc: 'Posizione dell\'Italia per alfabetizzazione finanziaria adulta (OCSE 2023)' },
  { num: '58%',  sub: 'degli italiani',    desc: 'Non ha un fondo emergenza adeguato pari a 3 mesi di spese' },
  { num: '76%',  sub: 'degli italiani',    desc: 'Non ha mai investito i propri risparmi in strumenti a lungo termine' },
];

statsData.forEach((st, i) => {
  const cx = 0.48 + i * 3.15;
  slide2card(s2, st, cx, 2.3, 2.97);
});

function slide2card(slide, st, x, y, w) {
  slide.addShape(pres.ShapeType.rect, { x, y, w, h: 2.95, fill: { color: DARK_BG }, line: { color: DARK_BG } });
  slide.addText(st.num, {
    isTextBox: true, x: x + 0.15, y: y + 0.12, w: w - 0.2, h: 1.0,
    fontSize: 56, bold: true, color: PURPLE, fontFace: 'Cambria', margin: 0
  });
  slide.addText(st.sub, {
    isTextBox: true, x: x + 0.15, y: y + 1.14, w: w - 0.2, h: 0.3,
    fontSize: 11, bold: true, color: AMETHYST, margin: 0
  });
  slide.addText(st.desc, {
    isTextBox: true, x: x + 0.15, y: y + 1.48, w: w - 0.2, h: 1.3,
    fontSize: 12, color: TEXT_DIM, lineSpacingMultiple: 1.3, margin: 0
  });
}

s2.addText('Fonte: OCSE PISA Financial Literacy 2023, Banca d\'Italia 2024', {
  isTextBox: true, x: 0.5, y: 5.3, w: 9, h: 0.22,
  fontSize: 9, color: 'AAAAAA', margin: 0
});

s2.addNotes('IL PROBLEMA – 1 min. L\'Italia è terzultima in Europa. Milioni di persone non sanno costruire un budget, un fondo emergenza o investire. La formazione tradizionale non funziona: serve un approccio che faccia sentire le conseguenze delle scelte, in modo sicuro.');

// ─────────────────────────────────────────────────────────────
// SLIDE 3 — LA SOLUZIONE (dark)
// ─────────────────────────────────────────────────────────────
const s3 = pres.addSlide();
darkBg(s3);
glow(s3, 9.2, 4.5, 3.5, 87);

lbl(s3, 'LA SOLUZIONE', 0.5, 0.28, 9, PURPLE);

s3.addText('Imparare giocando.', {
  isTextBox: true, x: 0.5, y: 0.62, w: 5.3, h: 0.75,
  fontSize: 36, bold: true, color: WHITE, fontFace: 'Cambria', margin: 0
});

// Left feature list
const features = [
  { emoji: '🏙️', title: 'City Builder Finanziario', desc: 'Ogni edificio = una scelta reale. Risparmio, investimento, protezione dagli imprevisti.' },
  { emoji: '🤖', title: 'Coach AI — Claude', desc: 'Spiega ogni decisione in modo semplice e contestuale. Tono mai giudicante.' },
  { emoji: '⚡', title: 'Scenari Realistici', desc: 'Guasti, bonus, crolli di mercato: la vita finanziaria simulata in ambiente sicuro.' },
];

features.forEach((f, i) => {
  const fy = 1.58 + i * 1.12;
  iconCircle(s3, f.emoji, 0.45, fy, 0.52);
  s3.addText(f.title, { isTextBox: true, x: 1.1, y: fy + 0.02, w: 4.4, h: 0.34, fontSize: 14, bold: true, color: WHITE, margin: 0 });
  s3.addText(f.desc, { isTextBox: true, x: 1.1, y: fy + 0.38, w: 4.4, h: 0.6, fontSize: 12, color: TEXT_DIM, lineSpacingMultiple: 1.2, margin: 0 });
});

// Right: game panel
s3.addShape(pres.ShapeType.rect, { x: 5.82, y: 0.72, w: 3.92, h: 4.35, fill: { color: '0D1117' }, line: { color: '1E2D45', pt: 1 } });
s3.addText('🏙️  FinCity — Gen 2025  |  Score: 72/100', { isTextBox: true, x: 5.97, y: 0.80, w: 3.6, h: 0.30, fontSize: 10, color: '94A3B8', margin: 0 });

const cityEmojis = [['🏠','💼','🏦','🛡️'],['📈','🎓','🌳','➕']];
cityEmojis.forEach((row, ri) => row.forEach((em, ci) => {
  const bx = 5.97 + ci * 0.88;
  const by = 1.22 + ri * 0.93;
  const placed = ri === 0 || (ri === 1 && ci === 0);
  s3.addShape(pres.ShapeType.rect, { x: bx, y: by, w: 0.8, h: 0.8, fill: { color: placed ? '1A2235' : '111827' }, line: { color: placed ? TEAL : '1E2D45', pt: 1 } });
  s3.addText(em, { isTextBox: true, x: bx, y: by + 0.1, w: 0.8, h: 0.5, fontSize: 20, align: 'center', margin: 0 });
}));

s3.addShape(pres.ShapeType.rect, { x: 5.97, y: 3.14, w: 3.6, h: 0.34, fill: { color: '111827' }, line: { color: '1E2D45', pt: 1 } });
s3.addText('💰 €3.250   🛡️ €2.400   📈 €5.100   💳 €0', { isTextBox: true, x: 5.97, y: 3.14, w: 3.6, h: 0.34, fontSize: 9, color: TEAL, align: 'center', valign: 'middle', margin: 0 });

s3.addShape(pres.ShapeType.rect, { x: 5.97, y: 3.58, w: 3.6, h: 1.35, fill: { color: '180030' }, line: { color: '5000A0', pt: 1 } });
s3.addText([
  { text: '🤖  Coach AI  ', options: { bold: true, fontSize: 10, color: AMETHYST } },
  { text: '\n"Hai fatto il primo investimento! €200/mese per 10 anni a rendimento del 7% diventano circa €34.000. La pazienza è il superpotere dell\'investitore."', options: { fontSize: 10, color: TEXT_L } }
], { isTextBox: true, x: 6.07, y: 3.65, w: 3.4, h: 1.22, lineSpacingMultiple: 1.3, margin: 0 });

s3.addNotes('LA SOLUZIONE – 1.5 min. Tre elementi: la città (ogni edificio è una scelta finanziaria), il coach Claude (spiega senza giudicare), gli scenari (guasti, bonus, cali di mercato). Demo live: aprire app/index.html e fare 3-4 turni.');

// ─────────────────────────────────────────────────────────────
// SLIDE 4 — STRUTTURA AGENTICA (light)
// ─────────────────────────────────────────────────────────────
const s4 = pres.addSlide();
lightBg(s4);

lbl(s4, 'STRUTTURA AGENTICA', 0.5, 0.28, 9, PURPLE);

s4.addText('Sviluppato con Claude Code\ne Agentic Coding.', {
  isTextBox: true, x: 0.5, y: 0.62, w: 9, h: 0.92,
  fontSize: 28, bold: true, color: TEXT_D, fontFace: 'Cambria', margin: 0
});

// 4 skill cards (2×2)
const skills = [
  { n: '1', emoji: '🎯', name: 'financial-scenario-generator', desc: 'Genera eventi finanziari realistici con impatti calcolati e messaggi educativi incorporati.' },
  { n: '2', emoji: '🤖', name: 'financial-coach',              desc: 'Feedback personalizzato in base allo stato del giocatore. Mock offline o Claude API reale.' },
  { n: '3', emoji: '📊', name: 'evaluate-player-decision',     desc: 'Analizza ogni scelta: impatto immediato, proiezione a 12 mesi e 5 anni, score 0–100.' },
  { n: '4', emoji: '✍️', name: 'game-content-creator',         desc: 'Genera tutti i testi di gioco seguendo linee guida di accessibilità linguistica.' },
];

skills.forEach((sk, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const cx = 0.45 + col * 4.8;
  const cy = 1.72 + row * 1.6;

  s4.addShape(pres.ShapeType.rect, { x: cx, y: cy, w: 4.55, h: 1.42, fill: { color: OFFWHITE }, line: { color: 'E0BBFF', pt: 1 } });

  // Purple number circle (top-left inside card)
  s4.addShape(pres.ShapeType.ellipse, { x: cx + 0.12, y: cy + 0.12, w: 0.42, h: 0.42, fill: { color: PURPLE }, line: { color: PURPLE } });
  s4.addText(sk.n, { isTextBox: true, x: cx + 0.12, y: cy + 0.12, w: 0.42, h: 0.42, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0 });

  // Emoji + skill name (monospace to look like code)
  s4.addText(sk.emoji + '  ' + sk.name, { isTextBox: true, x: cx + 0.65, y: cy + 0.1, w: 3.75, h: 0.52, fontSize: 12, bold: true, color: TEXT_D, fontFace: 'Courier New', lineSpacingMultiple: 1.1, margin: 0 });

  // Description
  s4.addText(sk.desc, { isTextBox: true, x: cx + 0.65, y: cy + 0.68, w: 3.75, h: 0.68, fontSize: 11, color: TEXT_M, lineSpacingMultiple: 1.2, margin: 0 });
});

// Workflow strip
const wfItems  = ['Turno\nmensile', 'Scenario\nGen.', 'Decisione\nplayer', 'Evaluate\nDecision', 'Financial\nCoach'];
const wfColors = [DARK_BG, PURPLE, DARK_BG, PURPLE, PURPLE];

wfItems.forEach((item, i) => {
  const wx = 0.45 + i * 1.85;
  s4.addShape(pres.ShapeType.rect, { x: wx, y: 4.88, w: 1.6, h: 0.4, fill: { color: wfColors[i] }, line: { color: wfColors[i] } });
  s4.addText(item, { isTextBox: true, x: wx, y: 4.88, w: 1.6, h: 0.4, fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle', lineSpacingMultiple: 1.1, margin: 0 });
  if (i < wfItems.length - 1) {
    s4.addText('›', { isTextBox: true, x: wx + 1.6, y: 4.88, w: 0.25, h: 0.4, fontSize: 14, bold: true, color: PURPLE, align: 'center', valign: 'middle', margin: 0 });
  }
});

s4.addNotes('ARCHITETTURA – 1 min. 4 skill definite in Claude Code: ognuna ha un ruolo preciso e può evolversi indipendentemente. Il workflow in fondo mostra come collaborano ogni turno. Mostrare la cartella agents/skills/ nel repo.');

// ─────────────────────────────────────────────────────────────
// SLIDE 5 — IMPATTO & CLOSING (dark)
// ─────────────────────────────────────────────────────────────
const s5 = pres.addSlide();
darkBg(s5);
glow(s5, 8.8, 1.2, 4.2, 87);
glow(s5, 9.2, 4.8, 3.0, 85);

lbl(s5, 'IMPATTO & NEXT STEPS', 0.5, 0.28, 9, PURPLE);

s5.addText('Un gioco.\nUn cambiamento reale.', {
  isTextBox: true, x: 0.5, y: 0.62, w: 5.8, h: 1.45,
  fontSize: 38, bold: true, color: WHITE, fontFace: 'Cambria', margin: 0
});

// 4 impact numbers
const impacts = [
  { n: '120', label: 'Mesi simulati\nin 10 anni' },
  { n: '7+',  label: 'Concetti finanziari\ninsegnati' },
  { n: '0',   label: 'Dipendenze\nesterne' },
  { n: '1',   label: 'Funzione per\nattivare Claude' },
];

impacts.forEach((imp, i) => {
  const ix = 0.45 + i * 2.35;
  s5.addShape(pres.ShapeType.rect, { x: ix, y: 2.3, w: 2.15, h: 1.7, fill: { color: '0E0025' }, line: { color: '3A0070', pt: 1 } });
  s5.addText(imp.n, { isTextBox: true, x: ix, y: 2.38, w: 2.15, h: 0.85, fontSize: 48, bold: true, color: PURPLE, align: 'center', fontFace: 'Cambria', margin: 0 });
  s5.addText(imp.label, { isTextBox: true, x: ix, y: 3.25, w: 2.15, h: 0.65, fontSize: 11, color: TEXT_DIM, align: 'center', lineSpacingMultiple: 1.2, margin: 0 });
});

// CTA button
s5.addShape(pres.ShapeType.rect, { x: 0.45, y: 4.2, w: 5.65, h: 0.75, fill: { color: PURPLE }, line: { color: PURPLE } });
s5.addText('🎮   Prova ora  →  apri app/index.html', { isTextBox: true, x: 0.45, y: 4.2, w: 5.65, h: 0.75, fontSize: 15, bold: true, color: WHITE, align: 'center', valign: 'middle', margin: 0 });

// Next steps (right column)
const nextSteps = ['📱 Mobile app + notifiche mensili', '🏦 Integrazione dati bancari reali', '🎓 Curriculum per scuole superiori', '🌍 Versione multilingua'];
s5.addText('Next steps', { isTextBox: true, x: 6.4, y: 0.65, w: 3.3, h: 0.35, fontSize: 13, bold: true, color: AMETHYST, margin: 0 });
nextSteps.forEach((ns, i) => {
  s5.addText(ns, { isTextBox: true, x: 6.4, y: 1.1 + i * 0.58, w: 3.3, h: 0.5, fontSize: 13, color: TEXT_DIM, margin: 0 });
});

s5.addText('Accenture ›   AI Hackathon 2026', { isTextBox: true, x: 0.5, y: 5.22, w: 9, h: 0.25, fontSize: 10, bold: true, color: '444444', align: 'right', margin: 0 });

s5.addNotes('CHIUSURA – 30 sec. 4 numeri chiave. CTA: demo live su app/index.html. Next steps: mobile, integrazione bancaria, scuole. Grazie!');

// ─────────────────────────────────────────────────────────────
// Write + Apply Theme
// ─────────────────────────────────────────────────────────────
(async () => {
  await pres.writeFile({ fileName: OUTPUT });
  console.log('✓ PPTX written:', OUTPUT);
  const { applyTheme } = require(path.join(SKILL_DIR, 'scripts', 'apply_theme.js'));
  await applyTheme(OUTPUT, THEME);
  console.log('✓ Theme applied.');
})();
