/* Incentive Hub — Korekcije podataka iz DWH-a
   Tok: pronađi prodaju → Koriguj (DWH vrednost pored ispravke) → razlog → efekat → sačuvaj.
   Propuštena prodaja: Dodaj prodaju. Iznos direktno na bonus: sa obračunskog lista zaposlenog. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'kr.title': 'Korekcije', 'kr.tItems': 'Prodaje iz DWH-a', 'kr.tHist': 'Istorija korekcija', 'kr.add': 'Dodaj prodaju koja nedostaje', 'kr.edit': 'Koriguj',
    'kr.paidNote': 'Isplaćeni periodi se ne menjaju — prodaja koja nedostaje u isplaćenom periodu dodaje se kao nova, a razlika ide kroz tekući period.',
    'kr.colId': 'Korekcija', 'kr.colKind': 'Vrsta', 'kr.colEmp': 'Zaposleni', 'kr.colPer': 'Period', 'kr.colWhat': 'Šta je ispravljeno', 'kr.colEff': 'Efekat na bonus', 'kr.colReason': 'Razlog', 'kr.colBy': 'Uneo', 'kr.colSeller': 'Prodavac', 'kr.colAt': 'Datum',
    'kk.izmena': 'Ispravka prodaje', 'kk.linija': 'Dodata prodaja', 'kk.iznos': 'Iznos na bonus', 'kk.kroz': 'Dodata prodaja (isplaćen period)',
    'ks.primenjena': 'Primenjena', 'ks.ceka': 'Čeka ponovni obračun', 'ks.stornirana': 'Stornirana', 'kr.via': 'kroz {p}',
    'kc.title': 'Korekcija prodaje', 'kc.field': 'Polje', 'kc.dwh': 'Iz DWH-a', 'kc.fix': 'Ispravka', 'kc.seller': 'Prodavac', 'kc.type': 'Vrsta prodaje', 'kc.amount': 'Iznos (RSD)', 'kc.count': 'Uračunavanje', 'kc.in': 'Uračunaj', 'kc.out': 'Isključi',
    'kc.reason': 'Razlog', 'kc.note': 'Obrazloženje', 'kc.doc': 'Prilog', 'kc.docReq': 'obavezan za ovaj razlog', 'kc.attach': 'Priloži', 'kc.effect': 'Efekat na bonus', 'kc.noChange': 'Izmenite bar jedno polje u koloni Ispravka',
    'kc.pRun': 'Period je u toku — ispravka važi odmah.', 'kc.pLocked': 'Period je zaključen — ispravka ulazi pri ponovnom obračunu, a zaposleni ponovo daje saglasnost.', 'kc.pPaid': 'Period je isplaćen — razlika se obračunava i isplaćuje kao posebna stavka u {c}.',
    'kc.effRun': 'projekcija do kraja perioda', 'kc.effLock': 'posle ponovnog obračuna', 'kc.effPaid': 'Razlika za {p}: {b} → {a} — iznos {d} ulazi u {c} kao posebna stavka, van limita.',
    'kc.save': 'Sačuvaj korekciju', 'kc.saved': 'Korekcija {k} je sačuvana', 'kc.before': 'Pre', 'kc.after': 'Posle', 'kc.diff': 'Razlika',
    'ka.title': 'Dodavanje prodaje koja nedostaje', 'ka.emp': 'Prodavac', 'ka.per': 'Period', 'ka.prod': 'Proizvod', 'ka.code': 'Šifra', 'ka.date': 'Datum prodaje', 'ka.contract': 'Ugovor', 'ka.client': 'Klijent',
    'km.title': 'Iznos na bonus', 'km.amount': 'Iznos (RSD, minus za umanjenje)',
    'kr.det': 'Korekcija {k}', 'kr.rev': 'Storniraj korekciju', 'kr.revTxt': 'Korekcija {k} biće poništena; zapis i istorija ostaju. Efekat se uklanja iz obračuna perioda {p}.', 'kr.revNote': 'Razlog storniranja', 'kr.revSug': 'Pogrešno uneta korekcija', 'kr.revDone': 'Korekcija {k} je stornirana',
    'kr.sum': '{n} korekcija u otvorenim periodima · neto efekat {d}', 'kr.ref': 'odnosi se na {p}', 'kr.added': 'Dodata prodaja'
  }, {
    'kr.title': 'Corrections', 'kr.tItems': 'DWH sales', 'kr.tHist': 'Correction history', 'kr.add': 'Add a missing sale', 'kr.edit': 'Correct',
    'kr.paidNote': 'Paid periods are never changed — a sale missing from a paid period is added as new and the difference goes through the current period.',
    'kr.colId': 'Correction', 'kr.colKind': 'Type', 'kr.colEmp': 'Employee', 'kr.colPer': 'Period', 'kr.colWhat': 'What was fixed', 'kr.colEff': 'Bonus effect', 'kr.colReason': 'Reason', 'kr.colBy': 'Entered by', 'kr.colSeller': 'Seller', 'kr.colAt': 'Date',
    'kk.izmena': 'Sale fix', 'kk.linija': 'Added sale', 'kk.iznos': 'Bonus amount', 'kk.kroz': 'Added sale (paid period)',
    'ks.primenjena': 'Applied', 'ks.ceka': 'Awaiting recalculation', 'ks.stornirana': 'Reversed', 'kr.via': 'via {p}',
    'kc.title': 'Correct sale', 'kc.field': 'Field', 'kc.dwh': 'From DWH', 'kc.fix': 'Correction', 'kc.seller': 'Seller', 'kc.type': 'Sale type', 'kc.amount': 'Amount (RSD)', 'kc.count': 'Counting', 'kc.in': 'Count', 'kc.out': 'Exclude',
    'kc.reason': 'Reason', 'kc.note': 'Explanation', 'kc.doc': 'Attachment', 'kc.docReq': 'required for this reason', 'kc.attach': 'Attach', 'kc.effect': 'Bonus effect', 'kc.noChange': 'Change at least one field in the Correction column',
    'kc.pRun': 'The period is in progress — the fix applies immediately.', 'kc.pLocked': 'The period is locked — the fix counts at recalculation and the employee consents again.', 'kc.pPaid': 'The period is paid — the difference is calculated and paid as a separate line in {c}.',
    'kc.effRun': 'projection to period end', 'kc.effLock': 'after recalculation', 'kc.effPaid': 'Difference for {p}: {b} → {a} — amount {d} goes into {c} as a separate line, outside the limit.',
    'kc.save': 'Save correction', 'kc.saved': 'Correction {k} saved', 'kc.before': 'Before', 'kc.after': 'After', 'kc.diff': 'Difference',
    'ka.title': 'Add a missing sale', 'ka.emp': 'Seller', 'ka.per': 'Period', 'ka.prod': 'Product', 'ka.code': 'Code', 'ka.date': 'Sale date', 'ka.contract': 'Contract', 'ka.client': 'Client',
    'km.title': 'Bonus amount', 'km.amount': 'Amount (RSD, minus to reduce)',
    'kr.det': 'Correction {k}', 'kr.rev': 'Reverse correction', 'kr.revTxt': 'Correction {k} will be cancelled; the record and history remain. The effect is removed from period {p}.', 'kr.revNote': 'Reversal reason', 'kr.revSug': 'Correction entered by mistake', 'kr.revDone': 'Correction {k} reversed',
    'kr.sum': '{n} corrections in open periods · net effect {d}', 'kr.ref': 'refers to {p}', 'kr.added': 'Added sale'
  });

  /* ---------- istorijske korekcije ---------- */
  (function seed() {
    var a = D.branchStaff('B03', 'licni')[1], b = D.branchStaff('B04', 'licni')[0], c = D.branchStaff('B02', 'univerzalni')[0], d = D.branchStaff('B02', 'licni')[0];
    var dup = D.itemsOf(b.id, '2026-Q3').filter(function (i) { return i.ptype === 'kredit' && i.type === 'nova'; })[0];
    D.corrSeed = [
      { id: 'KOR-0098', kind: 'linija', emp: a.id, period: '2026-Q3', seed: true, at: '2026-10-05T16:40', by: 'A001', reason: 'KASNI_PODACI', note: L('Kredit isplaćen 30.09. stigao u DWH 03.10. — uključen pre obračuna Q3', 'Loan disbursed Sep 30 reached DWH on Oct 3 — included before the Q3 run'),
        item: { id: 'TX-K0098', date: '2026-09-30', emp: a.id, branch: a.branch, period: '2026-Q3', product: 'P16', code: 'KK-OSG-RSD', seg: 'FL', ptype: 'kredit', cat: 'FL-KRD', type: 'nova', amount: 850000, client: 'Klijent ••6120', contract: 'UG-2698812', source: 'KOREKCIJA', status: 'priznato' } },
      { id: 'KOR-0099', kind: 'izmena', emp: b.id, period: '2026-Q3', seed: true, at: '2026-10-04T11:05', by: 'A001', reason: 'GRESKA_U_IZVORU', note: L('Isti kredit dva puta u feed-u (incident DWH-2214) — duplikat isključen', 'Same loan twice in the feed (incident DWH-2214) — duplicate excluded'), item: dup, changes: { status: 'iskljuceno' } },
      { id: 'KOR-0100', kind: 'iznos', emp: c.id, period: '2026-09', seed: true, at: '2026-10-04T09:30', by: 'A001', reason: 'GRESKA_U_IZVORU', amount: -4000, note: L('Dvostruko evidentiran račun (dve šifre za isti ugovor)', 'Account recorded twice (two codes for one contract)') },
      { id: 'KOR-0101', kind: 'iznos', emp: d.id, period: '2026-Q4', refPeriod: '2026-Q2', seed: true, at: '2026-10-08T13:10', by: 'A001', reason: 'KASNI_PODACI', amount: 6250, note: L('Kreditna kartica iz juna stigla posle isplate Q2 — razlika obračunata kroz Q4', 'Credit card from June arrived after the Q2 payout — difference paid through Q4'),
        line: { id: 'TX-K0101', date: '2026-06-29', emp: d.id, branch: d.branch, period: '2026-Q2', product: 'P13', code: 'CC-FLX-01', seg: 'FL', ptype: 'kartica', cat: 'FL-KRT', type: 'nova', amount: 0, client: 'Klijent ••3307', contract: 'UG-2647730', source: 'KOREKCIJA', status: 'priznato' } }
    ];
  })();

  function allRecs() { return (D.corrSeed || []).concat(IH.list('corrections')); }
  function rev() { return IH.map('corrRev'); }
  function find(id) { return allRecs().filter(function (c) { return c.id === id; })[0]; }
  function kindOf(c) { return c.refPeriod ? 'kroz' : c.kind; }
  function stOf(c) { return rev()[c.id] ? 'stornirana' : EN.applies(c) ? 'primenjena' : 'ceka'; }
  function reasons() { return IH.codeItems('RAZLOG_KOREKCIJE'); }
  function reason(id) { return reasons().filter(function (r) { return r.id === id; })[0]; }
  function needDoc(id) { var r = reason(id); return !!(r && r.x && r.x.doc); }
  function who(c) { return c.kind === 'izmena' && c.changes.emp ? [c.item.emp, c.changes.emp] : [c.emp]; }
  function curPid(empId) { return EN.currentPeriod(empId); }
  function proj(pid) { return D.period(pid).status === 'u_toku'; }
  function pay(empId, pid) { var r = EN.result(empId, pid, { project: proj(pid) }); return r ? r.payout : 0; }
  function sgn(d) { return (d >= 0 ? '+' : '−') + F.num(Math.abs(d)); }
  function dcol(d) { return d >= 0 ? 'var(--success)' : 'var(--danger)'; }
  IH.corrReason = function (id) { var r = reason(id); return r ? IH.L(r.name) : id; };
  function whatTxt(c) {
    var it = c.item || c.line;
    if (c.kind === 'izmena') {
      var ch = c.changes, w = [];
      if (ch.emp) w.push(t('kc.seller') + ' → ' + D.emp(ch.emp).name);
      if (ch.type) w.push(t('kc.type') + ' → ' + t('ct.' + ch.type));
      if (ch.amount != null) w.push(t('kc.amount') + ' ' + F.num(it.amount) + ' → ' + F.num(ch.amount));
      if (ch.status === 'iskljuceno') w.push(t('kc.out'));
      return IH.esc((it.product ? D.productName(it.product) : it.code) + (it.amount ? ' ' + F.num(it.amount) : '') + ' · ' + w.join(', '));
    }
    if (it) return IH.esc(D.productName(it.product) + (it.amount ? ' ' + F.num(it.amount) : '')) + (c.refPeriod ? ' <span class="mut">· ' + t('kr.ref', { p: D.periodLabel(c.refPeriod) }) + '</span>' : '');
    return sgn(c.amount) + ' RSD';
  }

  /* ---------- efekat: sa korekcijom i bez nje ---------- */
  var EFF = {};
  function effect(c) {
    if (EFF[c.id]) return EFF[c.id];
    var emps = who(c), pid = c.period, r = rev(), orig = r[c.id], on = !orig;
    var now = {}, other = {}; emps.forEach(function (e) { now[e] = pay(e, pid); });
    try {
      if (on) r[c.id] = { tmp: true }; else delete r[c.id];
      EN.invalidate();
      emps.forEach(function (e) { other[e] = pay(e, pid); });
    } finally { if (on) delete r[c.id]; else r[c.id] = orig; EN.invalidate(); }
    var out = emps.map(function (e) { return on ? { e: e, b: other[e], a: now[e] } : { e: e, b: now[e], a: other[e] }; });
    EFF[c.id] = out; return out;
  }
  function effTxt(c) {
    var ef = effect(c).filter(function (x) { return x.a !== x.b; });
    if (!ef.length) return '<span class="mut">0</span>';
    return ef.map(function (x) { return '<span style="color:' + dcol(x.a - x.b) + '">' + sgn(x.a - x.b) + '</span>' + (effect(c).length > 1 ? ' <span class="mut">' + IH.esc(D.emp(x.e).name.split(' ')[0]) + '</span>' : ''); }).join(' · ');
  }
  function preview(rec) {
    var emps = who(rec), pid = rec.period, before = {}, after = {};
    emps.forEach(function (e) { before[e] = pay(e, pid); });
    var st = IH.list('corrections'), rc = IH.map('recalc'), saved = JSON.stringify(rc);
    try {
      st.push(rec); if (D.period(pid).status === 'saglasnost') emps.forEach(function (e) { rc[pid + '|' + e] = rec.at; });
      EN.invalidate();
      emps.forEach(function (e) { after[e] = pay(e, pid); });
    } finally { st.pop(); IH.state.data.recalc = JSON.parse(saved); EN.invalidate(); }
    return emps.map(function (e) { return { e: e, b: before[e], a: after[e] }; });
  }
  function effTable(rows, pid, rec) {
    var lbl = proj(pid) ? t('kc.effRun') : D.period(pid).status === 'saglasnost' ? t('kc.effLock') : '';
    return '<div class="lab">' + t('kc.effect') + (lbl ? ' · ' + lbl : '') + '</div>' + (rec && rec.refPeriod ? '<div class="note" style="margin-bottom:8px">' + t('kc.effPaid', { p: D.periodLabel(rec.refPeriod), b: F.num(rec.refB), a: F.num(rec.refA), d: '<b>' + sgn(rec.amount) + ' RSD</b>', c: D.periodLabel(rec.period) }) + '</div>' : '') +
      ui.table([{ key: 'e', label: t('c.employee') }, { key: 'b', label: t('kc.before'), num: true }, { key: 'a', label: t('kc.after'), num: true }, { key: 'd', label: t('kc.diff'), num: true }], rows.map(function (x) { var d = x.a - x.b; return { e: IH.esc(D.emp(x.e).name), b: F.num(x.b), a: '<b>' + F.num(x.a) + '</b>', d: '<b style="color:' + dcol(d) + '">' + sgn(d) + '</b>' }; }), { compact: true });
  }
  function nextId() { return 'KOR-0' + (200 + IH.list('corrections').length + 1); }
  function perNote(pid, empId) {
    var p = D.period(pid);
    if (p.status === 'u_toku') return '<div class="note">' + t('kc.pRun') + '</div>';
    if (p.status === 'saglasnost') return '<div class="note warn">' + t('kc.pLocked') + '</div>';
    return '<div class="note warn">' + t('kc.pPaid', { c: D.periodLabel(curPid(empId)) }) + '</div>';
  }
  function reasonBlock(f) {
    var nd = needDoc(f.reason);
    return '<div class="form-grid"><div class="field"><label class="lab">' + t('kc.reason') + '</label><select class="in" data-kc="reason">' + reasons().map(function (x) { return '<option value="' + x.id + '"' + (x.id === f.reason ? ' selected' : '') + '>' + IH.esc(IH.L(x.name)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('kc.doc') + (nd ? ' <span class="req">*</span> <span class="mut" style="font-weight:400">' + t('kc.docReq') + '</span>' : '') + '</label>' + (f.doc ? '<span class="filechip">' + ic('paperclip') + IH.esc(f.doc) + '</span>' : ui.btn(t('kc.attach'), { cls: 'sm', icon: 'paperclip', act: 'kc-doc' })) + '</div>' +
      '<div class="field full"><label class="lab">' + t('kc.note') + '</label><textarea class="in" rows="2" data-kc="note">' + IH.esc(f.note || '') + '</textarea></div></div>';
  }
  function F_() { return IH.form.kc; }

  /* ================= KORIGUJ PRODAJU ================= */
  function itemRow(empId, pid, id) { return IH.itemRows(empId, pid).filter(function (r) { return r.id === id; })[0]; }
  function editChanges(f, raw) {
    var ch = {};
    if (f.sel && f.sel !== raw.emp) ch.emp = f.sel;
    if (f.type && f.type !== raw.type) ch.type = f.type;
    if (f.amount != null && f.amount !== raw.amount) ch.amount = f.amount;
    if (f.excl) ch.status = 'iskljuceno';
    return ch;
  }
  function suggestReason(ch) { return ch.emp ? 'POGRESAN_PRODAVAC' : ch.status ? 'GRESKA_U_IZVORU' : (ch.amount != null || ch.type) ? 'GRESKA_U_IZVORU' : null; }
  function editRec(f) {
    var r = itemRow(f.emp, f.pid, f.itemId), ch = editChanges(f, r.raw);
    return { id: f.id || 'KOR-NEW', kind: 'izmena', emp: r.raw.emp, period: f.pid, item: r.raw, changes: ch, reason: f.reason, note: f.note ? { sr: f.note, en: f.note } : null, doc: f.doc, at: IH.now(), by: IH.me().id };
  }
  function editBody() {
    var f = F_(), r = itemRow(f.emp, f.pid, f.itemId), raw = r.raw, ch = editChanges(f, raw), e = D.emp(raw.emp);
    var mates = D.branchStaff(e.branch, e.pos);
    function cell(on, html) { return '<td' + (on ? ' style="background:var(--accent-soft)"' : '') + '>' + html + '</td>'; }
    var rows = '<tr><td>' + t('kc.seller') + '</td><td>' + IH.esc(e.name) + '</td>' + cell(ch.emp, '<select class="in" data-kc="sel">' + mates.map(function (m) { return '<option value="' + m.id + '"' + (m.id === (f.sel || raw.emp) ? ' selected' : '') + '>' + IH.esc(m.name) + '</option>'; }).join('') + '</select>') + '</tr>' +
      '<tr><td>' + t('kc.type') + '</td><td>' + t('ct.' + raw.type) + '</td>' + cell(ch.type, '<select class="in" data-kc="type">' + ['nova', 'storno'].map(function (x) { return '<option value="' + x + '"' + (x === (f.type || raw.type) ? ' selected' : '') + '>' + t('ct.' + x) + '</option>'; }).join('') + '</select>') + '</tr>' +
      (raw.amount ? '<tr><td>' + t('kc.amount') + '</td><td>' + F.num(raw.amount) + '</td>' + cell(ch.amount != null, '<input class="in tnum" data-kc="amount" value="' + F.num(f.amount != null ? f.amount : raw.amount) + '">') + '</tr>' : '') +
      '<tr><td>' + t('kc.count') + '</td><td>' + t('kc.in') + '</td>' + cell(f.excl, '<div class="seg"><button type="button" data-act="kc-excl" data-arg="0" class="' + (!f.excl ? 'on' : '') + '">' + t('kc.in') + '</button><button type="button" data-act="kc-excl" data-arg="1" class="' + (f.excl ? 'on' : '') + '">' + t('kc.out') + '</button></div>') + '</tr>';
    var head = '<div class="mut" style="margin-bottom:10px">' + IH.esc(D.productName(raw.product)) + ' · ' + IH.esc(raw.contract) + ' · ' + IH.esc(raw.client) + ' · ' + F.date(raw.date) + ' · ' + D.periodLabel(f.pid) + '</div>';
    var has = Object.keys(ch).length;
    return head + '<div class="tbl-wrap"><table class="t compact"><thead><tr><th style="width:150px">' + t('kc.field') + '</th><th>' + t('kc.dwh') + '</th><th style="width:50%">' + t('kc.fix') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div style="margin:12px 0">' + perNote(f.pid, raw.emp) + '</div>' + reasonBlock(f) +
      (has ? effTable(preview(editRec(f)), f.pid) : '<div class="hint">' + t('kc.noChange') + '</div>');
  }
  IH.openItemCorrection = function (empId, pid, itemId) {
    var r = itemRow(empId, pid, itemId); if (!r) return;
    if (D.period(pid).status === 'isplaceno') { IH.toast(t('kr.paidNote')); return; }
    var c = r.corr && r.corr.kind === 'izmena' ? r.corr.changes : {};
    IH.form = { kc: { mode: 'edit', emp: empId, pid: pid, itemId: itemId, sel: c.emp || r.raw.emp, type: c.type || r.raw.type, amount: c.amount != null ? c.amount : r.raw.amount, excl: c.status === 'iskljuceno', reason: 'POGRESAN_PRODAVAC', note: '', doc: null, auto: true } };
    IH.modal({ title: t('kc.title') + ' · ' + IH.esc(D.productName(r.raw.product) || r.raw.code), wide: true, body: '<div id="kc-body">' + editBody() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('kc.save'), { cls: 'primary', icon: 'check', act: 'kc-save' }) });
  };
  IH.act['kc-edit'] = function (el) { var p = el.dataset.arg.split('|'); IH.openItemCorrection(p[0], p[1], p[2]); };
  IH.act['kor-from-item'] = function (el) { IH.closeModal(); var p = el.dataset.arg.split('|'); IH.openItemCorrection(p[0], p[1], p[2]); };
  IH.act['kc-excl'] = function (el) { F_().excl = el.dataset.arg === '1'; autoReason(); refresh(); };
  IH.act['kc-doc'] = function () { var f = F_(); f.doc = f.mode === 'edit' ? 'Potvrda_menadzera_' + D.emp(f.emp).hr + '.pdf' : f.mode === 'add' ? 'Ugovor_' + (f.contract || 'scan') + '.pdf' : 'Dokaz_' + f.pid + '.pdf'; refresh(); };
  function autoReason() { var f = F_(); if (f.mode !== 'edit' || !f.auto) return; var r = itemRow(f.emp, f.pid, f.itemId), s = suggestReason(editChanges(f, r.raw)); if (s) f.reason = s; }
  function refresh() { var f = F_(); IH.swap('kc-body', f.mode === 'edit' ? editBody() : f.mode === 'add' ? addBody() : amtBody()); }
  function num(v) { var x = String(v).trim(), neg = /^[-−]/.test(x); x = x.replace(/[^\d,]/g, '').replace(',', '.'); var n = parseFloat(x) || 0; return neg ? -n : n; }
  function isoDate(v, def) { var m = String(v).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/); return m ? m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : def; }
  document.addEventListener('input', function (e) { var d = e.target.dataset || {}; if (d.kc === 'note' && F_()) F_().note = e.target.value; });
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}, f = F_(); if (!d.kc || !f) return;
    var k = d.kc, v = e.target.value;
    if (k === 'note') { f.note = v; return; }
    if (k === 'reason') { f.reason = v; f.auto = false; f.doc = null; }
    else if (k === 'amount') f.amount = num(v);
    else if (k === 'date') f.date = isoDate(v, f.date);
    else if (k === 'prod') { f.prod = v; f.code = D.product(v).codes[0]; }
    else if (k === 'emp') { f.emp = v; if (EN.periodsFor(v).map(function (p) { return p.id; }).indexOf(f.pid) < 0) f.pid = EN.currentPeriod(v); }
    else if (k === 'pid') { f.pid = v; var pp = D.period(v); f.date = pp.status === 'u_toku' ? D.DATA_AS_OF : pp.to; }
    else f[k] = v;
    if (k === 'sel' || k === 'type' || k === 'amount') autoReason();
    refresh();
  });

  /* ================= DODAJ PRODAJU ================= */
  function addRec(f) {
    var e = D.emp(f.emp), pr = D.product(f.prod), id = f.id || 'KOR-NEW';
    var item = { id: 'TX-' + id.replace('KOR-', 'K'), date: f.date, emp: f.emp, branch: e.branch, period: f.pid, product: pr.id, code: f.code, seg: pr.seg, ptype: pr.ptype, cat: pr.cat, type: f.type, amount: pr.unit === 'RSD' ? f.amount || 0 : 0, client: f.client, contract: f.contract, source: 'KOREKCIJA', status: 'priznato' };
    var base = { id: id, at: IH.now(), by: IH.me().id, reason: f.reason, note: f.note ? { sr: f.note, en: f.note } : null, doc: f.doc };
    if (D.period(f.pid).status === 'isplaceno') {
      var b = EN.result(f.emp, f.pid).payout, a = EN.m1(f.emp, f.pid, { extra: [item], simKey: 'add' + id + item.amount + f.prod + f.type }).payout;
      return Object.assign(base, { kind: 'iznos', emp: f.emp, period: curPid(f.emp), refPeriod: f.pid, amount: a - b, line: item, refB: b, refA: a });
    }
    return Object.assign(base, { kind: 'linija', emp: f.emp, period: f.pid, item: item });
  }
  function addBody() {
    var f = F_(), pr = D.product(f.prod);
    var emps = D.employees.filter(function (x) { return x.pos === 'licni' || x.pos === 'univerzalni'; });
    var prods = IH.products().filter(function (p) { return p.status === 'aktivan'; });
    var rec = addRec(f);
    return '<div class="form-grid g3">' +
      '<div class="field"><label class="lab">' + t('ka.emp') + '</label><select class="in" data-kc="emp">' + emps.map(function (x) { return '<option value="' + x.id + '"' + (x.id === f.emp ? ' selected' : '') + '>' + IH.esc(x.name + ' · ' + D.branchShort(x.branch)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('ka.per') + '</label><select class="in" data-kc="pid">' + EN.periodsFor(f.emp).map(function (p) { return p.id; }).reverse().map(function (p) { return '<option value="' + p + '"' + (p === f.pid ? ' selected' : '') + '>' + D.periodLabel(p) + ' · ' + t('pst.' + D.period(p).status) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('ka.date') + '</label><input class="in" data-kc="date" value="' + F.date(f.date) + '"></div>' +
      '<div class="field full"><label class="lab">' + t('ka.prod') + '</label><select class="in" data-kc="prod">' + prods.map(function (p) { return '<option value="' + p.id + '"' + (p.id === f.prod ? ' selected' : '') + '>' + IH.esc(D.productName(p) + ' · ' + D.segName(p.seg)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('ka.code') + '</label><select class="in" data-kc="code">' + pr.codes.map(function (c) { return '<option' + (c === f.code ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('kc.type') + '</label><select class="in" data-kc="type">' + ['nova'].map(function (x) { return '<option value="' + x + '"' + (x === f.type ? ' selected' : '') + '>' + t('ct.' + x) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('kc.amount') + '</label><input class="in tnum" data-kc="amount" value="' + (pr.unit === 'RSD' && f.amount ? F.num(f.amount) : '') + '"' + (pr.unit === 'RSD' ? '' : ' disabled placeholder="— (' + t('u.kom') + ')"') + '></div>' +
      '<div class="field"><label class="lab">' + t('ka.contract') + '</label><input class="in" data-kc="contract" value="' + IH.esc(f.contract) + '"></div>' +
      '<div class="field"><label class="lab">' + t('ka.client') + '</label><input class="in" data-kc="client" value="' + IH.esc(f.client) + '"></div></div>' +
      perNote(f.pid, f.emp) + '<div style="height:10px"></div>' + reasonBlock(f) + effTable(rec.refPeriod ? [{ e: f.emp, b: pay(f.emp, rec.period), a: pay(f.emp, rec.period) + rec.amount }] : preview(rec), rec.period, rec);
  }
  IH.openAddItem = function (preset) {
    IH.form = { kc: Object.assign({ mode: 'add', emp: 'E1002', pid: '2026-Q2', prod: 'P16', code: 'KK-OSG-RSD', type: 'nova', amount: 740000, date: '2026-06-30', contract: 'UG-2649917', client: 'Klijent ••8812', reason: 'KASNI_PODACI', note: IH.L(L('Kredit isplaćen 30.06, u DWH stigao 02.07. — posle zaključavanja Q2.', 'Loan disbursed Jun 30, reached DWH on Jul 2 — after the Q2 lock.')), doc: null }, preset || {}) };
    IH.modal({ title: t('ka.title'), wide: true, body: '<div id="kc-body">' + addBody() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('kc.save'), { cls: 'primary', icon: 'check', act: 'kc-save' }) });
  };
  IH.act['kc-add'] = function () { IH.openAddItem(); };

  /* ================= IZNOS NA BONUS (sa obračunskog lista) ================= */
  function amtRec(f) { return { id: f.id || 'KOR-NEW', kind: 'iznos', emp: f.emp, period: f.pid, amount: f.amount || 0, reason: f.reason, note: f.note ? { sr: f.note, en: f.note } : null, doc: f.doc, at: IH.now(), by: IH.me().id }; }
  function amtBody() {
    var f = F_();
    return '<div class="form-grid"><div class="field"><label class="lab">' + t('km.amount') + '</label><input class="in tnum" data-kc="amount" value="' + (f.amount < 0 ? '-' : '') + F.num(Math.abs(f.amount || 0)) + '"></div><div class="field"><label class="lab">' + t('c.period') + '</label><div class="in ro">' + D.periodLabel(f.pid) + '</div></div></div>' +
      perNote(f.pid, f.emp) + '<div style="height:10px"></div>' + reasonBlock(f) + effTable(preview(amtRec(f)), f.pid);
  }
  IH.act['kor-new-for'] = function (el) {
    var p = el.dataset.arg.split('|');
    IH.form = { kc: { mode: 'amt', emp: p[0], pid: p[1], amount: 5000, reason: 'KASNI_PODACI', note: '', doc: null } };
    IH.modal({ title: t('km.title') + ' · ' + IH.esc(D.emp(p[0]).name), wide: true, body: '<div id="kc-body">' + amtBody() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('kc.save'), { cls: 'primary', icon: 'check', act: 'kc-save' }) });
  };

  /* ---------- čuvanje ---------- */
  IH.saveCorrection = function (rec) {
    rec.id = nextId();
    if (rec.item && rec.kind === 'linija') rec.item.id = 'TX-' + rec.id.replace('KOR-', 'K');
    IH.list('corrections').push(rec);
    var KS = { izmena: ['Ispravka prodaje', 'Sale fix'], linija: ['Dodata prodaja', 'Added sale'], iznos: ['Iznos na bonus', 'Bonus amount'], kroz: ['Dodata prodaja (isplaćen period)', 'Added sale (paid period)'] }[kindOf(rec)];
    IH.audit('correction', rec.id, { sr: 'Korekcija sačuvana: ' + KS[0], en: 'Correction saved: ' + KS[1] }, rec.note);
    EN.invalidate(); EFF = {}; IH.save();
    return rec;
  };
  IH.act['kc-save'] = function () {
    var f = F_(); if (!f) return;
    if (f.mode === 'edit' && !Object.keys(editChanges(f, itemRow(f.emp, f.pid, f.itemId).raw)).length) { IH.toast(t('kc.noChange')); return; }
    if (needDoc(f.reason) && !f.doc) { IH.toast(t('kc.doc') + ': ' + t('kc.docReq')); return; }
    var rec = IH.saveCorrection(f.mode === 'edit' ? editRec(f) : f.mode === 'add' ? addRec(f) : amtRec(f));
    IH.form = {}; IH.closeModal(); IH.render(); IH.toast(t('kc.saved', { k: rec.id }));
  };

  /* ================= LISTA PRODAJA ================= */
  var PERS0 = ['2026-Q4', '2026-10', '2026-Q3', '2026-09'], PERS = PERS0;
  function openPers() { return PERS0.filter(function (p) { return D.period(p).status !== 'isplaceno'; }); }
  function pidSel() { PERS = openPers(); var v = IH.v('kc').per; return PERS.indexOf(v) >= 0 ? v : PERS[0]; }
  function itemsOf(pid) {
    var pos = D.period(pid).type === 'Q' ? 'licni' : 'univerzalni', out = [];
    D.employees.filter(function (e) { return e.pos === pos; }).forEach(function (e) {
      IH.itemRows(e.id, pid).forEach(function (r) { if (!r.movedIn) { r.emp0 = e.id; out.push(r); } });
    });
    return out.sort(function (a, b) { return a.it.date < b.it.date ? 1 : a.it.date > b.it.date ? -1 : (a.id < b.id ? 1 : -1); });
  }
  var ROWS = {};
  function rows(pid) {
    var sig = JSON.stringify([IH.list('corrections').length, Object.keys(rev()).length, Object.keys(IH.map('mapped')).length, JSON.stringify(IH.map('recalc')), IH.list('uploadedItems').length, IH.state.lang, IH.state.tenant]);
    if (ROWS.pid !== pid || ROWS.sig !== sig) ROWS = { pid: pid, sig: sig, rows: itemsOf(pid) };
    return ROWS.rows;
  }
  function itemsTab() {
    var pid = pidSel();
    IH.refreshers.kc = function () { IH.render(); };
    var grid = IH.grid({
      id: 'kc-' + pid, exportName: 'Prodaje_' + pid + '.xlsx', searchLabel: IH.L(L('Ugovor, klijent, proizvod, prodavac', 'Contract, client, product, seller')), hidden: ['cl', 'code'],
      toolbarExtra: ui.segf('kc', 'per', PERS.map(function (p) { return { v: p, l: D.periodLabel(p) }; })),
      rows: function () { return rows(pid); }, key: function (r) { return r.id; }, label: function (r) { return r.id; }, searchKeys: ['s', 'p', 'cl', 'q', 'code'],
      rowCls: function (r) { return r.st === 'iskljuceno' ? 'muted' : ''; },
      cols: [
        { key: 'st', label: t('c.status'), val: function (r) { return t('it.' + r.st); }, fval: function (r) { return r.st; }, render: function (r) { return IH.ui.itemSt(r.st); }, filter: function () { return ['priznato', 'storno', 'nemapirano', 'ceka', 'korigovano', 'premesteno', 'iskljuceno', 'rucno', 'mapirano'].map(function (k) { return { v: k, l: t('it.' + k) }; }); } },
        { key: 'd', label: t('os.colDate'), val: function (r) { return r.it.date; }, render: function (r) { return F.date(r.it.date); } },
        { key: 's', label: t('kr.colSeller'), val: function (r) { return D.emp(r.it.emp).name + ' ' + D.emp(r.emp0).name; }, fval: function (r) { return D.emp(r.emp0).branch; }, render: function (r) { var e0 = D.emp(r.emp0), e1 = D.emp(r.it.emp); return '<b>' + (e0.id !== e1.id ? '<s class="mut" style="font-weight:400">' + IH.esc(e0.name) + '</s> → ' : '') + IH.esc(e1.name) + '</b>'; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }); } },
        { key: 'b', label: t('c.branch'), val: function (r) { return D.branchShort(D.emp(r.emp0).branch); } },
        { key: 'p', label: t('os.colItem'), nw: false, val: function (r) { return r.it.product ? D.productName(r.it.product) : r.it.code; }, render: function (r) { return r.it.product ? IH.esc(D.productName(r.it.product)) : '<span class="mut">' + IH.esc(r.it.code) + '</span>'; } },
        { key: 'pt', label: t('os.colPt'), val: function (r) { return r.it.ptype ? D.ptypeName(r.it.ptype) : ''; }, fval: function (r) { return r.it.ptype || ''; }, filter: function () { return D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'ty', label: t('kc.type'), val: function (r) { return t('ct.' + r.it.type); }, fval: function (r) { return r.it.type; }, filter: function () { return ['nova', 'storno'].map(function (k) { return { v: k, l: t('ct.' + k) }; }); } },
        { key: 'a', label: t('os.colAmt'), num: true, search: false, val: function (r) { return r.it.amount || 0; }, render: function (r) { return r.it.amount ? (r.corr && r.corr.changes && r.corr.changes.amount != null ? '<s class="mut">' + F.num(r.raw.amount) + '</s> ' : '') + F.num(r.it.amount) : '<span class="mut">—</span>'; } },
        { key: 'q', label: t('ka.contract'), val: function (r) { return r.it.contract || ''; }, sort: false },
        { key: 'cl', label: t('ka.client'), val: function (r) { return r.it.client || ''; } },
        { key: 'code', label: t('it.code'), val: function (r) { return r.it.code; } },
        { key: 'k', label: t('kr.colId'), val: function (r) { return r.corr ? r.corr.id : ''; }, render: function (r) { return r.corr ? IH.esc(r.corr.id) : '<span class="mut">—</span>'; } }
      ],
      actions: [
        { type: 'edit', title: t('kr.edit'), act: 'kc-edit', kind: 'acc', arg: function (r) { return r.emp0 + '|' + pid + '|' + r.id; }, show: function (r) { return r.raw.source !== 'KOREKCIJA' && r.st !== 'nemapirano'; } },
        { type: 'details', title: t('g.aDetails'), act: 'it-det', arg: function (r) { return r.emp0 + '|' + pid + '|' + r.id; } },
        { type: 'history', title: t('g.aHistory'), act: 'kor-hist', arg: function (r) { return r.corr ? r.corr.id : ''; }, show: function (r) { return !!r.corr; } }
      ]
    });
    return grid;
  }

  /* ================= ISTORIJA ================= */
  function histTab() {
    EFF = {};
    var cur = allRecs().filter(function (c) { return D.period(c.period).status !== 'isplaceno' && !rev()[c.id]; });
    var net = cur.reduce(function (a, c) { return a + effect(c).reduce(function (q, x) { return q + x.a - x.b; }, 0); }, 0);
    var grid = IH.grid({
      id: 'kor', exportName: 'Korekcije.xlsx', searchLabel: IH.L(L('Korekcija, zaposleni, proizvod', 'Correction, employee, product')), hidden: ['by', 'r'],
      rows: function () { return allRecs().slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; }); }, key: function (c) { return c.id; }, label: function (c) { return c.id; }, searchKeys: ['id', 'e', 'w'],
      rowCls: function (c) { return rev()[c.id] ? 'muted' : ''; },
      cols: [
        { key: 'st', label: t('c.status'), val: function (c) { return t('ks.' + stOf(c)); }, fval: function (c) { return stOf(c); }, render: function (c) { var s = stOf(c); return ui.pill(t('ks.' + s), s === 'primenjena' ? 'success' : s === 'ceka' ? 'warning' : 'gray'); }, filter: function () { return ['primenjena', 'ceka', 'stornirana'].map(function (k) { return { v: k, l: t('ks.' + k) }; }); } },
        { key: 'id', label: t('kr.colId'), val: function (c) { return c.id; } },
        { key: 'at', label: t('kr.colAt'), val: function (c) { return c.at; }, render: function (c) { return F.date(c.at); } },
        { key: 'k', label: t('kr.colKind'), val: function (c) { return t('kk.' + kindOf(c)); }, fval: function (c) { return kindOf(c); }, filter: function () { return ['izmena', 'linija', 'kroz', 'iznos'].map(function (k) { return { v: k, l: t('kk.' + k) }; }); } },
        { key: 'e', label: t('kr.colEmp'), val: function (c) { return who(c).map(function (x) { return D.emp(x).name; }).join(' '); }, render: function (c) { return '<b>' + who(c).map(function (x) { return IH.esc(D.emp(x).name); }).join(' → ') + '</b>'; } },
        { key: 'p', label: t('kr.colPer'), val: function (c) { return D.periodLabel(c.refPeriod || c.period); }, fval: function (c) { return c.period; }, render: function (c) { return c.refPeriod ? D.periodLabel(c.refPeriod) + ' <span class="mut">· ' + t('kr.via', { p: D.periodLabel(c.period) }) + '</span>' : D.periodLabel(c.period); }, filter: function () { return PERS.map(function (p) { return { v: p, l: D.periodLabel(p) }; }); } },
        { key: 'w', label: t('kr.colWhat'), nw: false, val: function (c) { var it = c.item || c.line; return it ? D.productName(it.product) : ''; }, render: function (c) { return whatTxt(c); } },
        { key: 'ef', label: t('kr.colEff'), num: true, search: false, val: function (c) { return effect(c).reduce(function (a, x) { return a + x.a - x.b; }, 0); }, render: function (c) { return effTxt(c); } },
        { key: 'r', label: t('kr.colReason'), val: function (c) { return IH.corrReason(c.reason); }, fval: function (c) { return c.reason; }, filter: function () { return reasons().map(function (r) { return { v: r.id, l: IH.L(r.name) }; }); } },
        { key: 'by', label: t('kr.colBy'), val: function (c) { return D.emp(c.by).name; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'kor-det' },
        { type: 'history', title: t('g.aHistory'), act: 'kor-hist' },
        { type: 'delete', title: t('kr.rev'), act: 'kor-rev', kind: 'dan', show: function (c) { return !c.seed && !rev()[c.id] && D.period(c.period).status !== 'isplaceno'; } }
      ]
    });
    return '<div class="note" style="margin-bottom:14px">' + t('kr.sum', { n: cur.length, d: (net >= 0 ? '+' : '−') + F.rsd(Math.abs(net)) }) + '</div>' + grid;
  }
  function detBody(c) {
    var it = c.item || c.line, ef = effect(c), s = stOf(c);
    var h = ui.form([
      { k: 'kd_k', label: t('kr.colKind'), type: 'static', value: t('kk.' + kindOf(c)) }, { k: 'kd_s', label: t('c.status'), type: 'static', value: t('ks.' + s) },
      { k: 'kd_e', label: t('kr.colEmp'), type: 'static', value: who(c).map(function (x) { return D.emp(x).name; }).join(' → ') }, { k: 'kd_p', label: t('kr.colPer'), type: 'static', value: c.refPeriod ? D.periodLabel(c.refPeriod) + ' · ' + t('kr.via', { p: D.periodLabel(c.period) }) : D.periodLabel(c.period) },
      { k: 'kd_r', label: t('kr.colReason'), type: 'static', value: IH.corrReason(c.reason) }, { k: 'kd_b', label: t('kr.colBy'), type: 'static', value: D.emp(c.by).name + ', ' + F.dt(c.at) },
      { k: 'kd_d', label: t('kc.doc'), type: 'static', value: c.doc || '' }, { k: 'kd_n', label: t('kc.note'), type: 'static', value: c.note ? IH.L(c.note) : '', full: true }
    ], { readonly: true });
    if (c.kind === 'izmena') {
      var nw = Object.assign({}, c.item, c.changes);
      var rr = [['kc.seller', D.emp(c.item.emp).name, D.emp(nw.emp).name], ['kc.type', t('ct.' + c.item.type), t('ct.' + nw.type)], ['kc.amount', F.num(c.item.amount), F.num(nw.amount)], ['kc.count', t('kc.in'), nw.status === 'iskljuceno' ? t('kc.out') : t('kc.in')]];
      h += '<div class="lab" style="margin-top:8px">' + IH.esc(D.productName(c.item.product)) + ' · ' + F.date(c.item.date) + '</div>' +
        ui.table([{ key: 'f', label: t('kc.field') }, { key: 'b', label: t('kc.dwh') }, { key: 'a', label: t('kc.fix') }], rr.map(function (x) { return { f: t(x[0]), b: IH.esc(x[1]), a: x[1] !== x[2] ? '<b style="color:var(--accent)">' + IH.esc(x[2]) + '</b>' : IH.esc(x[2]) }; }), { compact: true });
    } else if (it) {
      h += '<div class="lab" style="margin-top:8px">' + t('kr.added') + '</div>' + ui.table([{ key: 'd', label: t('c.date') }, { key: 'p', label: t('c.product') }, { key: 'ty', label: t('kc.type') }, { key: 'a', label: t('os.colAmt'), num: true }, { key: 'u', label: t('ka.contract') }],
        [{ d: F.date(it.date), p: IH.esc(D.productName(it.product)), ty: t('ct.' + it.type), a: it.amount ? F.num(it.amount) : '—', u: IH.esc(it.contract) }], { compact: true });
    }
    return h + '<div style="height:12px"></div>' + effTable(ef, c.period);
  }
  IH.act['kor-det'] = function (el) { var c = find(el.dataset.arg); IH.modal({ title: t('kr.det', { k: c.id }), wide: true, body: detBody(c), foot: ui.btn(t('c.close'), { act: 'modal-close' }) }); };
  IH.act['kor-hist'] = function (el) {
    var c = find(el.dataset.arg); if (!c) return;
    var h = IH.auditFor('correction', c.id).slice();
    if (c.seed) h.push({ at: c.at, by: c.by, action: { sr: 'Korekcija uneta', en: 'Correction entered' }, detail: c.note });
    IH.showHistory(c.id, h);
  };
  IH.act['kor-rev'] = function (el) {
    var c = find(el.dataset.arg); IH.form = {};
    IH.modal({ title: t('kr.rev') + ' — ' + c.id, body: '<p style="margin-top:0">' + t('kr.revTxt', { k: c.id, p: D.periodLabel(c.period) }) + '</p>' + ui.field('kr_rn', t('kr.revNote'), t('kr.revSug'), { type: 'textarea' }),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('kr.rev'), { cls: 'danger', icon: 'trash', act: 'kor-rev-ok', arg: c.id }) });
  };
  IH.act['kor-rev-ok'] = function (el) {
    var c = find(el.dataset.arg), n = (document.getElementById('fld-kr_rn') || {}).value || t('kr.revSug');
    rev()[c.id] = { at: IH.now(), by: IH.me().id, note: { sr: n, en: n } };
    IH.audit('correction', c.id, { sr: 'Korekcija stornirana', en: 'Correction reversed' }, { sr: n, en: n });
    EN.invalidate(); EFF = {}; IH.save(); IH.closeModal(); IH.render(); IH.toast(t('kr.revDone', { k: c.id }));
  };
  IH.act['kor-new'] = function () { IH.openAddItem(); };

  IH.route('korekcije', {
    title: function () { return t('kr.title'); },
    render: function (p) {
      var tab = p[0] === 'istorija' ? 'istorija' : '';
      return ui.header(t('kr.title'), '', ui.btn(t('kr.add'), { cls: 'primary', icon: 'plus', act: 'kc-add' })) +
        ui.rtabs('korekcije', [{ id: '', label: t('kr.tItems'), icon: 'list' }, { id: 'istorija', label: t('kr.tHist'), icon: 'history', cnt: allRecs().length }], tab) +
        (tab ? histTab() : itemsTab());
    }
  });
})();
