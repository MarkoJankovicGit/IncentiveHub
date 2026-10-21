// Incentive Hub - statični pregled za analizu (alati koji ne izvršavaju JavaScript, npr. GPT, mogu da pročitaju sve ekrane).
// Pokretanje iz foldera demo:  node tools/analiza.js
// Rezultat: analiza/index.html (spisak ekrana po roli), analiza/<rola>/*.html, analiza/scenario/*.html, analiza/uputstvo.html, llms.txt
const fs = require('fs'), path = require('path'), vm = require('vm');
const DEMO = path.resolve(__dirname, '..'), OUT = path.join(DEMO, 'analiza');
const UPUTSTVO = path.join(DEMO, '..', 'Uputstvo - Incentive Hub.md');

/* ---------- učitavanje aplikacije bez browsera ---------- */
function load() {
  const noop = () => {};
  const el = () => ({ classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, style: {}, setAttribute: noop, getAttribute: () => null, appendChild: noop, querySelector: () => null, querySelectorAll: () => [], addEventListener: noop, removeAttribute: noop, focus: noop, innerHTML: '', dataset: {} });
  const store = {};
  const ctx = {
    console, setTimeout: (f) => 0, clearTimeout: noop, Date, Math, JSON, Intl, URLSearchParams,
    document: { addEventListener: noop, getElementById: el, querySelector: () => null, querySelectorAll: () => [], documentElement: el(), createElement: el, body: el(), title: '' },
    localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    location: { hash: '#/pocetna', search: '', reload: noop }, history: { replaceState: noop },
    matchMedia: () => ({ matches: false, addEventListener: noop }), addEventListener: noop, requestAnimationFrame: f => f(), navigator: { language: 'sr' }, scrollTo: noop
  };
  ctx.window = ctx; vm.createContext(ctx);
  const html = fs.readFileSync(path.join(DEMO, 'index.html'), 'utf8');
  [...html.matchAll(/src="js\/([^"?]+)/g)].map(m => m[1]).forEach(f => vm.runInContext(fs.readFileSync(path.join(DEMO, 'js', f), 'utf8'), ctx, { filename: f }));
  const IH = ctx.IH;
  IH.state.data = IH.state.data || {};
  IH.snapSize = 50;
  return { IH, ctx };
}
const { IH, ctx } = load();
const D = IH.data;

/* ---------- pomoćne ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ROLES = { admin: 'Administrator', manager: 'Menadžer ekspoziture', employee: 'Zaposleni (savetnik)', viewer: 'Posmatrač' };
const fileOf = route => route.replace(/[\/|]/g, '__') + '.html';
/* polja forme postaju tekst (vrednost, izabrana opcija, štikla), da se čitaju i bez HTML atributa */
const strip = h => h.replace(/<svg[\s\S]*?<\/svg>/g, '')
  .replace(/<select[^>]*>([\s\S]*?)<\/select>/g, (m, o) => { const sel = o.match(/<option[^>]*selected[^>]*>([\s\S]*?)<\/option>/) || o.match(/<option[^>]*>([\s\S]*?)<\/option>/); return '<span class="snapv">' + (sel ? sel[1].replace(/</g, '&lt;').replace(/>/g, '&gt;') : '') + '</span>'; })
  .replace(/<input([^>]*)>/g, (m, a) => { if (/type="(checkbox|radio)"/.test(a)) return /checked/.test(a) ? '☑ ' : '☐ '; const v = a.match(/value="([^"]*)"/), ph = a.match(/placeholder="([^"]*)"/); return '<span class="snapv">' + (v && v[1] ? v[1] : ph ? ph[1] : '') + '</span>'; })
  .replace(/<textarea[^>]*>([\s\S]*?)<\/textarea>/g, '<span class="snapv">$1</span>')
  .replace(/ data-[a-z0-9-]+="[^"]*"/g, '');
function wrap(title, meta, body, depth) {
  const up = '../'.repeat(depth);
  return `<!doctype html>
<html lang="sr-Latn" data-tenant="unicredit-rs" data-mode="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Incentive Hub (statični pregled)</title>
<link rel="stylesheet" href="${up}css/tokens.css"><link rel="stylesheet" href="${up}css/app.css">
<style>body{background:var(--bg);padding:20px 28px}.snap{font-size:13px;color:var(--ink-2);border:1px solid var(--line);background:var(--card);border-radius:10px;padding:10px 14px;margin:0 0 18px}.snap b{color:var(--ink)}.snap a{margin-right:12px}.pop,.ovl{display:none!important}.snapv{display:inline-block;min-width:40px;border:1px solid var(--line);border-radius:6px;padding:3px 8px;background:var(--card)}</style>
</head><body>
<div class="snap">${meta}</div>
<main class="wrap">${body}</main>
</body></html>`;
}
const pages = [];   // { role, route, title, file }
function render(role, route) {
  const parts = route.split('/'), id = parts[0], params = parts.slice(1);
  const def = IH.routes[id]; if (!def || !def.render) return null;
  IH.state.role = role; ctx.location.hash = '#/' + route;
  let html;
  try { html = def.render(params); } catch (e) { return { err: e.message }; }
  let title; try { title = def.title ? def.title() : IH.t('nav.' + id); } catch (e) { title = id; }
  return { html, title };
}
const TABS = [];
const _rtabs = IH.ui.rtabs;
IH.ui.rtabs = function (base, tabs, cur) { tabs.forEach(x => TABS.push(base + (x.id ? '/' + x.id : ''))); return _rtabs.apply(this, arguments); };

/* priprema stanja pre iscrtavanja (npr. izabrani nosioci u čarobnjaku dodele) */
const PREP = {};
function snapRole(role, extra, folder, label, only) {
  const nav = only ? [] : (IH.NAV[role] || []).filter(x => x.id).map(x => x.id);
  const done = {}, queue = nav.concat(extra || []);
  while (queue.length) {
    const route = queue.shift(); if (done[route]) continue; done[route] = 1;
    TABS.length = 0; IH.form = {}; if (PREP[route]) try { PREP[route](); } catch (e) { }
    const r = render(role, route);
    if (!r || r.err) { if (r && r.err) console.log('preskočeno', role, route, '-', r.err); continue; }
    if (!only) TABS.slice().forEach(t => { if (!done[t] && queue.indexOf(t) < 0 && t.split('/')[0] === route.split('/')[0]) queue.push(t); });
    const file = path.join(folder, fileOf(route));
    const meta = `<b>${esc(r.title)}</b> · rola: <b>${esc(label || ROLES[role])}</b> · ruta u aplikaciji: <code>#/${esc(route)}</code><br><a href="../index.html">Svi ekrani</a><a href="../../index.html?role=${role}#/${esc(route)}">Otvori u aplikaciji</a><a href="../uputstvo.html">Uputstvo</a>`;
    fs.mkdirSync(path.join(OUT, folder), { recursive: true });
    fs.writeFileSync(path.join(OUT, file), wrap(r.title, meta, strip(r.html), 2));
    pages.push({ role: folder, route, title: r.title, file: file.replace(/\\/g, '/') });
  }
}

/* ---------- 1. početno stanje demo-a, po rolama ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
const DET = {
  admin: ['targeti/TG-102', 'targeti/TG-201', 'targeti/TG-301', 'targeti/novi/1', 'targeti/novi/2', 'targeti/novi/3',
    'seme/S-M1', 'seme/S-M1P', 'seme/S-M2', 'seme/S-M3', 'seme/nova/1', 'seme/nova/2', 'seme/nova/3',
    'dodela-targeta/nova/1', 'dodela-targeta/nova/2', 'dodela-targeta/nova/3', 'dodela-targeta/raspodela/B01|2026-Q4', 'dodela-targeta/regija/R1|2026-Q4',
    'ostvarenje/B01', 'ostvarenje/B01/E1002', 'ostvarenje/B05', 'katalog/P16', 'katalog/P07', 'ucitavanje/tabele'],
  manager: ['ostvarenje/B01/E1002'], employee: [], viewer: []
};
Object.keys(ROLES).forEach(role => snapRole(role, DET[role], role));

/* ---------- 2. scenario: gotovinski kredit za 2027 (periodi → target → dodela → šema) ---------- */
let scen = false;
try {
  IH.state.role = 'admin';
  IH.act['pe-gen'](); IH.act['pe-gen-go']();
  IH.form = {}; IH.act['tg-new'](); IH.act['tg-save']({ dataset: {} });
  IH.act['tg-new'](); IH.act['tg-save']({ dataset: {} });
  IH.form = {}; IH.act['sch-new'](); IH.routes.seme.render(['nova', '3']); IH.act['w-save']({ dataset: {} });
  scen = !!D.scheme('S-N1');
} catch (e) { console.log('scenario nije napravljen:', e.message); }
if (scen) {
  const sn = ['periodi', 'targeti', 'targeti/TG-404', 'targeti/TG-405', 'dodela-targeta/nova/1', 'dodela-targeta/nova/2', 'dodela-targeta/nova/3', 'seme', 'seme/S-N1', 'seme/nova/3', 'dodela-targeta/raspodela/B01|2027-Q1'];
  IH.v('asg').per = '2027-Q1';
  const pick = () => { IH.state.role = 'admin'; IH.routes['dodela-targeta'].render(['nova', '1']); IH.form.aw.sel = D.branchStaff('B01', 'licni').map(e => e.id); };
  PREP['dodela-targeta/nova/2'] = pick; PREP['dodela-targeta/nova/3'] = pick;
  snapRole('admin', sn, 'scenario', 'Administrator - scenario gotovinski kredit 2027', true);
}

/* ---------- 3. uputstvo (markdown → html) ---------- */
function md(src) {
  const inl = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '<code>$1</code>');
  const L = src.split(/\r?\n/), out = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (/^#{1,4} /.test(l)) { const n = l.match(/^#+/)[0].length; out.push(`<h${n}>${inl(l.slice(n + 1))}</h${n}>`); i++; continue; }
    if (/^\|/.test(l)) { const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]); const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim()); const h = cells(rows[0]); out.push('<table class="t compact"><thead><tr>' + h.map(c => `<th>${inl(c)}</th>`).join('') + '</tr></thead><tbody>' + rows.slice(2).map(r => '<tr>' + cells(r).map(c => `<td>${inl(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>'); continue; }
    if (/^\s*[-*] /.test(l)) { const it = []; while (i < L.length && /^\s*[-*] /.test(L[i])) it.push(L[i++].replace(/^\s*[-*] /, '')); out.push('<ul>' + it.map(x => `<li>${inl(x)}</li>`).join('') + '</ul>'); continue; }
    if (/^\d+\. /.test(l)) { const it = []; while (i < L.length && /^\d+\. /.test(L[i])) it.push(L[i++].replace(/^\d+\. /, '')); out.push('<ol>' + it.map(x => `<li>${inl(x)}</li>`).join('') + '</ol>'); continue; }
    if (/^---+$/.test(l.trim())) { out.push('<hr>'); i++; continue; }
    if (!l.trim()) { i++; continue; }
    const para = []; while (i < L.length && L[i].trim() && !/^(#|\||\s*[-*] |\d+\. |---)/.test(L[i])) para.push(L[i++]);
    out.push(`<p>${inl(para.join(' '))}</p>`);
  }
  return out.join('\n');
}
let hasDoc = false;
if (fs.existsSync(UPUTSTVO)) {
  fs.writeFileSync(path.join(OUT, 'uputstvo.html'), wrap('Uputstvo', '<b>Uputstvo - Incentive Hub</b> · <a href="index.html">Svi ekrani</a><a href="../index.html">Aplikacija</a>', '<article class="card" style="padding:20px 28px">' + md(fs.readFileSync(UPUTSTVO, 'utf8')) + '</article>', 1));
  hasDoc = true;
}

/* ---------- 4. spisak ekrana ---------- */
const groups = Object.keys(ROLES).concat(scen ? ['scenario'] : []);
const nameOf = g => g === 'scenario' ? 'Scenario: gotovinski kredit 2027 (Administrator)' : ROLES[g];
const index = `<h1 style="margin:0 0 8px">Incentive Hub - statični pregled za analizu</h1>
<p>Demo aplikacija za upravljanje incentive (bonus) šemama prodajnog osoblja banke (UniCredit Bank Srbija). Aplikacija se iscrtava JavaScript-om, pa ova stranica sadrži iste ekrane kao čist HTML, da bi mogli da se čitaju bez browsera. Generisano ${new Date().toISOString().slice(0, 10)} iz verzije ${(fs.readFileSync(path.join(DEMO, 'index.html'), 'utf8').match(/\?v=([0-9.]+)/) || [])[1] || ''}.</p>
<p>Tok rada: Obračunski periodi → Katalog proizvoda → Targeti → Dodela i raspodela targeta → Bonus šeme (Osnovno, Targeti, Kreiranje modela) → Dnevno ostvarenje → Obračun → Saglasnost → Isplata. Role: administrator, menadžer ekspoziture, zaposleni (savetnik), posmatrač. Tabele prikazuju do 50 redova.</p>
${hasDoc ? '<p><a href="uputstvo.html"><b>Uputstvo</b></a> - opis svih pojmova, pravila i primera obračuna.</p>' : ''}
${groups.map(g => `<section class="card" style="padding:14px 18px;margin:0 0 14px"><h2 style="margin:0 0 8px">${esc(nameOf(g))}</h2><ul style="margin:0;columns:2">${pages.filter(p => p.role === g).map(p => `<li><a href="${p.file}">${esc(p.title)}</a> <span class="mut">#/${esc(p.route)}</span></li>`).join('')}</ul></section>`).join('\n')}`;
fs.writeFileSync(path.join(OUT, 'index.html'), wrap('Svi ekrani', '<b>Statični pregled</b> · <a href="../index.html">Otvori aplikaciju</a>', index, 1));

/* ---------- 5. llms.txt ---------- */
fs.writeFileSync(path.join(DEMO, 'llms.txt'), `# Incentive Hub (demo)

> Demo aplikacija za upravljanje incentive (bonus) šemama prodajnog osoblja banke (UniCredit Bank Srbija): targeti, dodela i raspodela targeta, bonus šeme i modeli isplate, dnevno ostvarenje, obračun, saglasnost i isplata. Aplikacija se iscrtava JavaScript-om; za čitanje bez browsera koristite statični pregled.

- [Statični pregled svih ekrana](analiza/index.html): svi ekrani po roli (administrator, menadžer, zaposleni, posmatrač) i scenario gotovinskog kredita za 2027, kao čist HTML
- [Uputstvo](analiza/uputstvo.html): pojmovi, tok rada, pravila i primeri obračuna
- [Aplikacija](index.html): interaktivni demo (potreban browser sa JavaScript-om)
`);
console.log('stranica:', pages.length, '· scenario:', scen, '· uputstvo:', hasDoc, '→', OUT);
