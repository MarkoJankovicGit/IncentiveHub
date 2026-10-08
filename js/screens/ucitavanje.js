/* Incentive Hub — Učitavanje podataka: registar, nemapirane stavke, gotove KPI vrednosti, izvori, ručni upload */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'ld.title': 'Učitavanje podataka', 'ld.desc': 'Svako učitavanje prolazi istu validaciju — automatsko noćno, API ili ručni upload. Ništa se ne gubi: stavka je prihvaćena, odbijena uz razlog ili čeka mapiranje šifre.',
    'ld.tReg': 'Registar učitavanja', 'ld.tUnm': 'Nemapirane stavke', 'ld.tKpi': 'Gotove KPI vrednosti', 'ld.tSrc': 'Izvori podataka', 'ld.upload': 'Ručni upload',
    'ld.colId': 'Učitavanje', 'ld.colSrc': 'Izvor', 'ld.colPer': 'Period', 'ld.colRows': 'Primljeno', 'ld.colAcc': 'Prihvaćeno', 'ld.colUnm': 'Nemapirano', 'ld.colRej': 'Odbijeno', 'ld.colDur': 'Trajanje', 'ld.colBy': 'Pokrenuo', 'ld.system': 'Sistem (raspored)',
    'lst.ok': 'Uspešno', 'lst.upozorenje': 'Delimično', 'lst.greska': 'Greška', 'lst.ponovljeno': 'Ponovljeno',
    'ld.det': 'Učitavanje {id}', 'ld.rules': 'Validacija', 'ld.rule': 'Pravilo', 'ld.pass': 'Prošlo', 'ld.fail': 'Nije prošlo', 'ld.action': 'Postupak', 'ld.rejRows': 'Odbijeni redovi', 'ld.row': 'Red', 'ld.err': 'Greška', 'ld.dlRej': 'Preuzmi odbijene redove', 'ld.rerun': 'Ponovi učitavanje', 'ld.log': 'Dnevnik izvršavanja',
    'v.V1': 'Format i obavezna polja', 'v.V2': 'Duplikat (ugovor + tip + datum)', 'v.V3': 'Prodavac postoji u organizaciji na datum prodaje', 'v.V4': 'Šifra proizvoda postoji u katalogu', 'v.V5': 'Datum u otvorenom periodu', 'v.V6': 'Iznos u dozvoljenom opsegu',
    'va.rej': 'Red se odbija', 'va.queue': 'Stavka čeka mapiranje (ne odbija se)',
    'ld.unmBanner': '{n} stavki čeka mapiranje šifre', 'ld.unmBannerS': 'Stavke nisu izgubljene. U tekućem periodu ulaze u ostvarenje odmah posle mapiranja; u zaključenom Q3 — pri ponovnom obračunu.', 'ld.map': 'Mapiraj', 'ld.code': 'Šifra', 'ld.items': '{n} stavki', 'ld.open': '{n} otvoreno',
    'ust.nemapirano': 'Čeka mapiranje', 'ust.mapirano': 'Mapirano — u obračunu', 'ust.ceka': 'Mapirano — čeka ponovni obračun',
    'kp.desc': 'Vrednosti koje drugi sistemi isporučuju kao gotov zbir (stanje, broj korisnika). Ne mogu se spustiti do transakcije, zato se koriste za izveštaje i informativne targete, a ne za bonus po stavkama.',
    'kp.colKpi': 'KPI', 'kp.colLvl': 'Nivo', 'kp.colPer': 'Poslednji period', 'kp.colCov': 'Pokrivenost', 'kp.colUse': 'Koristi se u', 'kp.vals': 'Vrednosti — {k}', 'kp.prev': 'Prethodna isporuka', 'kp.delta': 'Promena', 'kp.lvlE': 'Zaposleni', 'kp.lvlB': 'Ekspozitura',
    'sr.colKind': 'Vrsta podataka', 'sr.colMethod': 'Način prenosa', 'sr.colSched': 'Raspored', 'sr.colFmt': 'Format', 'sr.colLast': 'Poslednje učitavanje', 'sr.colOwner': 'Vlasnik', 'sk.stavke': 'Prodajne stavke', 'sk.organizacija': 'Organizacija', 'sk.kpi': 'Gotove KPI vrednosti',
    'sr.edit': 'Podešavanje izvora — {n}', 'sr.thr': 'Upozorenje ako je odbijeno više od (%)', 'sr.notify': 'Obavesti vlasnika izvora o grešci', 'sr.saved': 'Podešavanje izvora {n} je sačuvano',
    'up.title': 'Ručni upload', 'up.desc': 'Prodajne stavke iz Excel šablona prolaze istu validaciju kao noćni uvoz. Pre potvrde vidite tačno šta ulazi, a šta se odbija i zašto.',
    'up.s1': 'Izvor i fajl', 'up.s1s': 'Šablon, period i fajl', 'up.s2': 'Validacija i pregled', 'up.s2s': 'Red po red, pre upisa', 'up.s3': 'Potvrda', 'up.s3s': 'Upis i obaveštenja',
    'up.src': 'Šablon', 'up.per': 'Period', 'up.file': 'Fajl', 'up.drop': 'Prevucite Excel fajl ovde ili', 'up.choose': 'Izaberi fajl', 'up.tpl': 'Preuzmi prazan šablon', 'up.note': 'Razlog ručnog unosa', 'up.noteSug': 'Prodaja na sajmu u Čačku (vikend) — ugovori nisu prošli kroz core do noćnog uvoza',
    'up.rows': 'Redova u fajlu', 'up.ok': 'Ispravno', 'up.rej': 'Odbija se', 'up.okRow': 'Ulazi', 'up.dup': 'Duplikat reda {r}', 'up.noEmp': 'Prodavac {h} ne postoji u organizaciji', 'up.seller': 'Prodavac', 'up.noFile': 'Izaberite fajl u prvom koraku',
    'up.confirmTxt': '{n} stavki ulazi u ostvarenje za {p} odmah po potvrdi. {r} odbijena reda možete ispraviti u fajlu i ponovo učitati — upis je idempotentan po broju ugovora.', 'up.notifyMgr': 'Obavesti menadžera ekspoziture', 'up.go': 'Učitaj u sistem', 'up.done': 'Učitavanje {id}: {n} stavki prihvaćeno, {r} odbijeno'
  }, {
    'ld.title': 'Data loads', 'ld.desc': 'Every load passes the same validation — nightly, API or manual upload. Nothing is lost: an item is accepted, rejected with a reason or waits for code mapping.',
    'ld.tReg': 'Load register', 'ld.tUnm': 'Unmapped items', 'ld.tKpi': 'Ready KPI values', 'ld.tSrc': 'Data sources', 'ld.upload': 'Manual upload',
    'ld.colId': 'Load', 'ld.colSrc': 'Source', 'ld.colPer': 'Period', 'ld.colRows': 'Received', 'ld.colAcc': 'Accepted', 'ld.colUnm': 'Unmapped', 'ld.colRej': 'Rejected', 'ld.colDur': 'Duration', 'ld.colBy': 'Started by', 'ld.system': 'System (schedule)',
    'lst.ok': 'Successful', 'lst.upozorenje': 'Partial', 'lst.greska': 'Error', 'lst.ponovljeno': 'Re-run',
    'ld.det': 'Load {id}', 'ld.rules': 'Validation', 'ld.rule': 'Rule', 'ld.pass': 'Passed', 'ld.fail': 'Failed', 'ld.action': 'Handling', 'ld.rejRows': 'Rejected rows', 'ld.row': 'Row', 'ld.err': 'Error', 'ld.dlRej': 'Download rejected rows', 'ld.rerun': 'Re-run load', 'ld.log': 'Execution log',
    'v.V1': 'Format and mandatory fields', 'v.V2': 'Duplicate (contract + type + date)', 'v.V3': 'Seller exists in the organisation on the sale date', 'v.V4': 'Product code exists in the catalogue', 'v.V5': 'Date in an open period', 'v.V6': 'Amount within allowed range',
    'va.rej': 'Row is rejected', 'va.queue': 'Item waits for mapping (not rejected)',
    'ld.unmBanner': '{n} items wait for code mapping', 'ld.unmBannerS': 'Items are not lost. In the current period they count right after mapping; in locked Q3 — at recalculation.', 'ld.map': 'Map', 'ld.code': 'Code', 'ld.items': '{n} items', 'ld.open': '{n} open',
    'ust.nemapirano': 'Awaiting mapping', 'ust.mapirano': 'Mapped — counted', 'ust.ceka': 'Mapped — awaiting recalculation',
    'kp.desc': 'Values other systems deliver as ready totals (balances, user counts). They cannot be drilled to a transaction, so they are used for reports and informative targets, not for item-based bonus.',
    'kp.colKpi': 'KPI', 'kp.colLvl': 'Level', 'kp.colPer': 'Last period', 'kp.colCov': 'Coverage', 'kp.colUse': 'Used in', 'kp.vals': 'Values — {k}', 'kp.prev': 'Previous delivery', 'kp.delta': 'Change', 'kp.lvlE': 'Employee', 'kp.lvlB': 'Branch',
    'sr.colKind': 'Data type', 'sr.colMethod': 'Transfer method', 'sr.colSched': 'Schedule', 'sr.colFmt': 'Format', 'sr.colLast': 'Last load', 'sr.colOwner': 'Owner', 'sk.stavke': 'Sales items', 'sk.organizacija': 'Organisation', 'sk.kpi': 'Ready KPI values',
    'sr.edit': 'Source settings — {n}', 'sr.thr': 'Warn if rejected rows exceed (%)', 'sr.notify': 'Notify the source owner on error', 'sr.saved': 'Settings for {n} saved',
    'up.title': 'Manual upload', 'up.desc': 'Sales items from the Excel template pass the same validation as the nightly import. Before confirming you see exactly what is accepted, what is rejected and why.',
    'up.s1': 'Source and file', 'up.s1s': 'Template, period and file', 'up.s2': 'Validation and preview', 'up.s2s': 'Row by row, before writing', 'up.s3': 'Confirmation', 'up.s3s': 'Write and notifications',
    'up.src': 'Template', 'up.per': 'Period', 'up.file': 'File', 'up.drop': 'Drop an Excel file here or', 'up.choose': 'Choose file', 'up.tpl': 'Download empty template', 'up.note': 'Reason for manual entry', 'up.noteSug': 'Sales at the Čačak fair (weekend) — contracts did not reach core before the nightly import',
    'up.rows': 'Rows in file', 'up.ok': 'Valid', 'up.rej': 'Rejected', 'up.okRow': 'Accepted', 'up.dup': 'Duplicate of row {r}', 'up.noEmp': 'Seller {h} does not exist in the organisation', 'up.seller': 'Seller', 'up.noFile': 'Choose a file in the first step',
    'up.confirmTxt': '{n} items enter {p} achievement immediately on confirmation. You can fix the {r} rejected rows in the file and load again — writing is idempotent by contract number.', 'up.notifyMgr': 'Notify the branch manager', 'up.go': 'Load into the system', 'up.done': 'Load {id}: {n} items accepted, {r} rejected'
  });

  /* ---------- izvori ---------- */
  var SRC = [
    { id: 'SRC-DWH', name: { sr: 'DWH — prodajne stavke', en: 'DWH — sales items' }, kind: 'stavke', method: { sr: 'DB pogled (Oracle)', en: 'DB view (Oracle)' }, sched: { sr: 'Svaki dan 05:30', en: 'Daily 05:30' }, fmt: 'UC_SALES_V3', owner: { sr: 'DWH tim', en: 'DWH team' }, thr: 1 },
    { id: 'SRC-HR', name: { sr: 'HR master — organizacija', en: 'HR master — organisation' }, kind: 'organizacija', method: { sr: 'SFTP, CSV', en: 'SFTP, CSV' }, sched: { sr: 'Svaki dan 05:00', en: 'Daily 05:00' }, fmt: 'HR_ORG_V2', owner: { sr: 'Ljudski resursi', en: 'Human resources' }, thr: 0 },
    { id: 'SRC-DIG', name: { sr: 'Digitalna platforma — aktivacije', en: 'Digital platform — activations' }, kind: 'stavke', method: { sr: 'REST API', en: 'REST API' }, sched: { sr: 'Svaki dan 05:45', en: 'Daily 05:45' }, fmt: 'DIG_ACT_V1', owner: { sr: 'Digitalno bankarstvo', en: 'Digital banking' }, thr: 2 },
    { id: 'SRC-KPI', name: { sr: 'DWH — gotove KPI vrednosti', en: 'DWH — ready KPI values' }, kind: 'kpi', method: { sr: 'SFTP, Excel', en: 'SFTP, Excel' }, sched: { sr: 'Mesečno, 3. radni dan', en: 'Monthly, 3rd working day' }, fmt: 'KPI_AGG_V1', owner: { sr: 'Kontroling', en: 'Controlling' }, thr: 0 },
    { id: 'SRC-MAN', name: { sr: 'Ručni upload — prodajne stavke', en: 'Manual upload — sales items' }, kind: 'stavke', method: { sr: 'Excel šablon', en: 'Excel template' }, sched: { sr: 'Po potrebi', en: 'On demand' }, fmt: 'SALES_TEMPLATE_V3', owner: { sr: 'Administrator prodajnog učinka', en: 'Sales performance administrator' }, thr: 5 }
  ];
  function src(id) { return SRC.filter(function (s) { return s.id === id; })[0]; }

  /* ---------- registar (seed) ---------- */
  var SEED = null;
  function ymd(d) { return d.replace(/-/g, ''); }
  function addDays(d, n) { return new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10); }
  function unmByDate() {
    var m = {};
    ['2026-Q4', '2026-10'].forEach(function (pid) { D.allItems(pid).forEach(function (i) { if (i.status === 'nemapirano') m[i.date] = (m[i.date] || 0) + 1; }); });
    return m;
  }
  function seed() {
    if (SEED) return SEED;
    var out = [], r = D.rng('loads'), um = unmByDate();
    for (var k = 9; k >= 0; k--) {
      var d = addDays('2026-10-20', -k), prev = addDays(d, -1), wd = new Date(d + 'T00:00:00Z').getUTCDay();
      var low = wd === 0 || wd === 1;
      var rows = d === '2026-10-20' ? 1284 : Math.round((low ? 380 : 1050) + r() * 320);
      var rej = d === '2026-10-20' ? 3 : Math.floor(r() * 4), unm = um[prev] || 0;
      var per = '2026-Q4 · 2026-10';
      if (d === '2026-10-16') {
        out.push({ id: 'LD-' + ymd(d) + '-01', src: 'SRC-DWH', at: d + 'T06:10', end: d + 'T06:15', status: 'greska', rows: 0, acc: 0, unm: 0, rej: 0, per: per, by: null, err: { sr: 'Veza ka DWH_PROD prekinuta posle 300 s (timeout); automatski pokušaj u 06:20 takođe neuspešan', en: 'Connection to DWH_PROD dropped after 300 s (timeout); automatic retry at 06:20 also failed' }, rerunBy: 'LD-' + ymd(d) + '-02' });
        out.push({ id: 'LD-' + ymd(d) + '-02', src: 'SRC-DWH', at: d + 'T07:42', end: d + 'T07:49', status: rej ? 'upozorenje' : 'ok', rows: rows, acc: rows - rej - unm, unm: unm, rej: rej, per: per, by: 'A001', rerunOf: 'LD-' + ymd(d) + '-01' });
      } else out.push({ id: 'LD-' + ymd(d) + '-01', src: 'SRC-DWH', at: d + 'T06:1' + (2 + Math.floor(r() * 6)), end: d + 'T06:2' + Math.floor(r() * 6), status: rej ? 'upozorenje' : 'ok', rows: rows, acc: rows - rej - unm, unm: unm, rej: rej, per: per, by: null });
      var hc = d === '2026-10-20' ? 3 : Math.floor(r() * 2);
      out.push({ id: 'LD-' + ymd(d) + '-H', src: 'SRC-HR', at: d + 'T05:04', end: d + 'T05:05', status: 'ok', rows: 418, acc: 418, unm: 0, rej: 0, per: F ? null : null, changes: hc, by: null });
      var dg = Math.round((low ? 90 : 260) + r() * 90);
      out.push({ id: 'LD-' + ymd(d) + '-D', src: 'SRC-DIG', at: d + 'T05:47', end: d + 'T05:48', status: 'ok', rows: dg, acc: dg, unm: 0, rej: 0, per: per, by: null });
    }
    out.push({ id: 'LD-20261009-M1', src: 'SRC-MAN', at: '2026-10-09T14:22', end: '2026-10-09T14:23', status: 'upozorenje', rows: 14, acc: 12, unm: 0, rej: 2, per: '2026-Q4', by: 'A001', file: 'Sajam_Kragujevac_oktobar.xlsx' });
    out.push({ id: 'LD-20261005-K', src: 'SRC-KPI', at: '2026-10-05T09:02', end: '2026-10-05T09:02', status: 'ok', rows: 47, acc: 47, unm: 0, rej: 0, per: '2026-09', by: null, file: 'KPI_AGG_2026-09.xlsx' });
    SEED = out; return out;
  }
  IH.loads = function () { return IH.list('newLoads').concat(seed()).slice().sort(function (a, b) { return a.at < b.at ? 1 : a.at > b.at ? -1 : 0; }); };
  function findLoad(id) { return IH.loads().filter(function (l) { return l.id === id; })[0]; }
  function lst(s) { return ui.pill(t('lst.' + s), { ok: 'success', upozorenje: 'warning', greska: 'danger' }[s] || 'gray'); }
  function perTxt(l) { return l.per ? l.per.split(' · ').map(D.periodLabel).join(' · ') : '—'; }

  /* ručno učitane stavke ulaze u stavke zaposlenog */
  var _itemsOf = D.itemsOf;
  D.itemsOf = function (empId, pid) {
    var up = IH.list('uploadedItems').filter(function (i) { return i.emp === empId && i.period === pid; });
    return up.length ? _itemsOf(empId, pid).concat(up) : _itemsOf(empId, pid);
  };

  /* ---------- validacija (raspodela odbijenih po pravilima) ---------- */
  function rules(l) {
    if (l.status === 'greska') return [];
    var dup = Math.ceil(l.rej / 2), emp = l.rej - dup;
    return [
      { k: 'V1', p: l.rows, f: 0, a: 'rej' }, { k: 'V2', p: l.rows - dup, f: dup, a: 'rej' }, { k: 'V3', p: l.rows - dup - emp, f: emp, a: 'rej' },
      { k: 'V4', p: l.rows - l.rej - l.unm, f: l.unm, a: 'queue' }, { k: 'V5', p: l.rows - l.rej, f: 0, a: 'rej' }, { k: 'V6', p: l.rows - l.rej, f: 0, a: 'rej' }
    ];
  }
  function rejRows(l) {
    var r = D.rng('rej|' + l.id), out = [], dup = Math.ceil(l.rej / 2);
    for (var i = 0; i < l.rej; i++) {
      var row = 2 + Math.floor(r() * (l.rows - 2));
      out.push({ r: row, c: 'UG-' + (2600000 + Math.floor(r() * 899999)), s: i < dup ? 'KK-RSD-60' : 'PKG-STD-01', e: i < dup ? t('up.dup', { r: row - 1 - Math.floor(r() * 40) }) : t('up.noEmp', { h: 'HR-' + (60000 + Math.floor(r() * 9999)) }) });
    }
    return out;
  }
  IH.act['ld-det'] = function (el) {
    var l = findLoad(el.dataset.arg), s = src(l.src);
    var head = '<dl class="kv" style="grid-template-columns:max-content 1fr max-content 1fr;margin-bottom:14px"><dt>' + t('ld.colSrc') + '</dt><dd>' + IH.esc(IH.L(s.name)) + '</dd><dt>' + t('sr.colMethod') + '</dt><dd>' + IH.esc(IH.L(s.method)) + '</dd>' +
      '<dt>' + t('c.status') + '</dt><dd>' + lst(l.status) + '</dd><dt>' + t('ld.colPer') + '</dt><dd>' + perTxt(l) + '</dd><dt>' + IH.L({ sr: 'Početak / kraj', en: 'Start / end' }) + '</dt><dd>' + F.dt(l.at) + ' – ' + l.end.slice(11) + '</dd><dt>' + t('ld.colBy') + '</dt><dd>' + (l.by ? IH.esc(D.emp(l.by).name) : t('ld.system')) + '</dd>' +
      (l.file ? '<dt>' + t('up.file') + '</dt><dd><span class="filechip" style="padding:3px 8px">' + ic('file') + IH.esc(l.file) + '</span></dd><dt></dt><dd></dd>' : '') + '</dl>';
    var body;
    if (l.status === 'greska') {
      body = '<div class="note warn"><b>' + t('lst.greska') + ':</b> ' + IH.esc(IH.L(l.err)) + '</div><div class="lab" style="margin-top:12px">' + t('ld.log') + '</div>' +
        ui.hist([{ at: l.at.slice(0, 11) + '06:10', action: { sr: 'Pokrenuto po rasporedu', en: 'Started by schedule' } }, { at: l.at.slice(0, 11) + '06:15', action: { sr: 'Timeout posle 300 s', en: 'Timeout after 300 s' } }, { at: l.at.slice(0, 11) + '06:20', action: { sr: 'Automatski ponovni pokušaj — neuspešno; obavešteni DWH tim i administrator', en: 'Automatic retry — failed; DWH team and administrator notified' } }, { at: l.at.slice(0, 11) + '07:42', by: 'A001', action: { sr: 'Ručno ponovljeno kao ' + l.rerunBy, en: 'Manually re-run as ' + l.rerunBy } }].reverse());
    } else if (l.src === 'SRC-HR') {
      body = '<div class="note">' + IH.L({ sr: '418 zaposlenih u HR masteru; promena u organizaciji: ', en: '418 employees in HR master; organisation changes: ' }) + '<b>' + l.changes + '</b>' + (l.changes ? ' — <a href="#/organizacija" data-act="modal-close">' + IH.L({ sr: 'pregled promena', en: 'review changes' }) + '</a>' : '') + '</div>';
    } else {
      var rr = rules(l).map(function (x) { return { k: t('v.' + x.k), p: F.num(x.p), f: x.f ? '<b style="color:' + (x.a === 'rej' ? 'var(--danger)' : 'var(--warning)') + '">' + F.num(x.f) + '</b>' : '<span class="mut">0</span>', a: '<span class="mut">' + t('va.' + x.a) + '</span>' }; });
      body = '<div class="kpis" style="margin-bottom:12px">' + ui.kpi(t('ld.colRows'), F.num(l.rows)) + ui.kpi(t('ld.colAcc'), F.num(l.acc), null, { hl: true }) + ui.kpi(t('ld.colUnm'), l.unm, l.unm ? IH.L({ sr: 'čeka mapiranje', en: 'awaiting mapping' }) : null) + ui.kpi(t('ld.colRej'), l.rej) + '</div>' +
        ui.table([{ key: 'k', label: t('ld.rule') }, { key: 'p', label: t('ld.pass'), num: true }, { key: 'f', label: t('ld.fail'), num: true }, { key: 'a', label: t('ld.action') }], rr, { compact: true }) +
        (l.rej ? '<div class="lab" style="margin-top:14px">' + t('ld.rejRows') + '</div>' + ui.table([{ key: 'r', label: t('ld.row'), num: true }, { key: 'c', label: t('it.contract') }, { key: 's', label: t('ld.code') }, { key: 'e', label: t('ld.err') }], (l.rejList || rejRows(l)).map(function (x) { return { r: x.r, c: x.c, s: x.s, e: IH.esc(x.e) }; }), { compact: true }) : '');
    }
    IH.modal({ title: t('ld.det', { id: l.id }), wide: true, body: head + body, foot: (l.rej ? ui.btn(t('ld.dlRej'), { icon: 'download', act: 'export', arg: 'Odbijeni_' + l.id + '.xlsx' }) : '') + ui.btn(t('c.close'), { act: 'modal-close' }) });
  };

  function regTab() {
    return IH.grid({
      id: 'ld', exportName: 'Registar_ucitavanja.xlsx', searchLabel: IH.L({ sr: 'ID učitavanja ili fajl', en: 'Load ID or file' }), hidden: ['dur', 'by', 'per', 'm'],
      rows: IH.loads, key: function (l) { return l.id; }, label: function (l) { return l.id; }, searchKeys: ['id'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (l) { return t('lst.' + l.status); }, fval: function (l) { return l.status; }, render: function (l) { return lst(l.status) + (l.rerunBy ? ' <span class="mut">→ ' + l.rerunBy + '</span>' : ''); }, filter: function () { return ['ok', 'upozorenje', 'greska'].map(function (k) { return { v: k, l: t('lst.' + k) }; }); } },
        { key: 'id', label: t('ld.colId'), val: function (l) { return l.id + ' ' + (l.file || ''); }, render: function (l) { return '<b>' + l.id + '</b>'; } },
        { key: 'at', label: t('c.date'), search: false, val: function (l) { return l.at; }, render: function (l) { return F.dt(l.at); } },
        { key: 'src', label: t('ld.colSrc'), val: function (l) { return IH.L(src(l.src).name); }, fval: function (l) { return l.src; }, filter: function () { return SRC.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'm', label: t('sr.colMethod'), val: function (l) { return IH.L(src(l.src).method); } },
        { key: 'per', label: t('ld.colPer'), search: false, val: function (l) { return perTxt(l); } },
        { key: 'f', label: t('up.file'), val: function (l) { return l.file || ''; }, render: function (l) { return l.file ? IH.esc(l.file) : '<span class="mut">—</span>'; } },
        { key: 'rows', label: t('ld.colRows'), num: true, search: false, val: function (l) { return l.rows; }, render: function (l) { return F.num(l.rows); } },
        { key: 'acc', label: t('ld.colAcc'), num: true, search: false, val: function (l) { return l.acc; }, render: function (l) { return F.num(l.acc); } },
        { key: 'unm', label: t('ld.colUnm'), num: true, search: false, val: function (l) { return l.unm; }, render: function (l) { return l.unm ? '<b style="color:var(--warning)">' + l.unm + '</b>' : '<span class="mut">0</span>'; } },
        { key: 'rej', label: t('ld.colRej'), num: true, search: false, val: function (l) { return l.rej; }, render: function (l) { return l.rej ? '<b style="color:var(--danger)">' + l.rej + '</b>' : '<span class="mut">0</span>'; } },
        { key: 'dur', label: t('ld.colDur'), search: false, val: function (l) { return (Date.parse(l.end) - Date.parse(l.at)) / 6e4; }, render: function (l) { return Math.max(1, Math.round((Date.parse(l.end) - Date.parse(l.at)) / 6e4)) + ' min'; } },
        { key: 'by', label: t('ld.colBy'), val: function (l) { return l.by ? D.emp(l.by).name : t('ld.system'); } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'ld-det' },
        { icon: 'download', title: t('ld.dlRej'), act: 'export', arg: function (l) { return 'Odbijeni_' + l.id + '.xlsx'; }, show: function (l) { return l.rej > 0; } }
      ]
    });
  }

  /* ---------- nemapirane stavke ---------- */
  function unmRows() {
    var out = [], mapped = IH.map('mapped');
    ['2026-Q3', '2026-Q4', '2026-10'].forEach(function (pid) {
      D.allItems(pid).forEach(function (i) {
        if (i.status !== 'nemapirano') return;
        var st = EN.mappedView(i) ? 'mapirano' : mapped[i.code] ? 'ceka' : 'nemapirano';
        out.push({ i: i, st: st });
      });
    });
    return out.sort(function (a, b) { return a.i.date < b.i.date ? 1 : -1; });
  }
  function unmTab() {
    var rows = unmRows(), open = rows.filter(function (r) { return r.st === 'nemapirano'; });
    var codes = D.unmappedCodes.map(function (u) {
      var all = rows.filter(function (r) { return r.i.code === u.code; }), op = all.filter(function (r) { return r.st === 'nemapirano'; }).length, m = IH.map('mapped')[u.code];
      return '<div class="att" style="cursor:default"><span class="ai ' + (op ? 'o' : 'g') + '">' + ic(op ? 'alert' : 'checkc') + '</span><span class="at"><b>' + u.code + '</b><small>' + IH.esc(IH.L(u.desc)) + ' · ' + t('ld.items', { n: all.length }) + (m ? ' · → ' + IH.esc(D.productName(m.product)) : '') + '</small></span>' + (op ? ui.btn(t('ld.map'), { cls: 'sm primary', icon: 'share', act: 'map-open', arg: u.code }) : ui.pill(t('k.mapped'), 'success')) + '</div>';
    }).join('');
    var banner = '<section class="card"><div class="ch"><h2>' + t('ld.unmBanner', { n: open.length }) + '</h2></div><div class="cb flush">' + codes + '</div></section>';
    return banner + IH.grid({
      id: 'unm', exportName: 'Nemapirane_stavke.xlsx', searchLabel: IH.L({ sr: 'Šifra, zaposleni, ugovor', en: 'Code, employee, contract' }),
      rows: unmRows, key: function (r) { return r.i.id; }, label: function (r) { return r.i.id; }, searchKeys: ['code', 'e', 'id'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (r) { return t('ust.' + r.st); }, fval: function (r) { return r.st; }, render: function (r) { return ui.pill(t('ust.' + r.st), { nemapirano: 'warning', mapirano: 'success', ceka: 'accent' }[r.st]); }, filter: function () { return ['nemapirano', 'ceka', 'mapirano'].map(function (k) { return { v: k, l: t('ust.' + k) }; }); } },
        { key: 'd', label: t('c.date'), search: false, val: function (r) { return r.i.date; }, render: function (r) { return F.date(r.i.date); } },
        { key: 'id', label: t('it.contract'), val: function (r) { return r.i.contract; } },
        { key: 'code', label: t('ld.code'), val: function (r) { return r.i.code; }, filter: function () { return D.unmappedCodes.map(function (u) { return { v: u.code, l: u.code }; }); } },
        { key: 'e', label: t('c.employee'), val: function (r) { return D.emp(r.i.emp).name; } },
        { key: 'b', label: t('c.branch'), val: function (r) { return D.branchShort(r.i.branch); } },
        { key: 'p', label: t('ld.colPer'), val: function (r) { return D.periodLabel(r.i.period); }, fval: function (r) { return r.i.period; }, filter: function () { return ['2026-Q3', '2026-Q4', '2026-10'].map(function (p) { return { v: p, l: D.periodLabel(p) }; }); } },
        { key: 'a', label: t('os.colAmt'), num: true, search: false, val: function (r) { return r.i.amount || 0; }, render: function (r) { return r.i.amount ? F.num(r.i.amount) : '<span class="mut">—</span>'; } }
      ],
      actions: [
        { icon: 'share', title: t('ld.map'), act: 'map-open', kind: 'acc', arg: function (r) { return r.i.code; }, show: function (r) { return r.st === 'nemapirano'; } },
        { type: 'details', title: t('g.aDetails'), act: 'it-det', arg: function (r) { return r.i.emp + '|' + r.i.period + '|' + r.i.id; } }
      ]
    });
  }

  /* ---------- gotove KPI vrednosti ---------- */
  var KPIS = [
    { id: 'KPI-STD-NET', name: { sr: 'Neto priliv štednje (stanje portfolija)', en: 'Net savings inflow (portfolio balance)' }, lvl: 'E', per: '2026-09', unit: 'RSD', use: { sr: 'Izveštaji — portfolio bankara', en: 'Reports — banker portfolio' } },
    { id: 'KPI-MB-AKT', name: { sr: 'Aktivni korisnici mBanking (30 dana)', en: 'Active mBanking users (30 days)' }, lvl: 'B', per: '2026-09', unit: 'kom', use: { sr: 'Izveštaji — digitalizacija', en: 'Reports — digitalisation' } },
    { id: 'KPI-PKG-PEN', name: { sr: 'Penetracija paket računa', en: 'Package account penetration' }, lvl: 'B', per: '2026-09', unit: '%', use: { sr: 'Informativni KPI ekspoziture', en: 'Informative branch KPI' } }
  ];
  function kpiVals(k) {
    var r = D.rng('kpi|' + k.id);
    var ents = k.lvl === 'E' ? D.employees.filter(function (e) { return e.pos === 'licni'; }).map(function (e) { return { n: e.name, s: D.branchShort(e.branch) }; }) : D.branches.map(function (b) { return { n: D.branchName(b), s: b.code }; });
    return ents.map(function (x) {
      var v = k.unit === 'RSD' ? Math.round((2e6 + r() * 18e6) / 1e4) * 1e4 : k.unit === 'kom' ? Math.round(1800 + r() * 4200) : 0.38 + r() * 0.3;
      var pv = k.unit === '%' ? v - 0.04 + r() * 0.06 : Math.round(v * (0.85 + r() * 0.25));
      return { n: x.n, s: x.s, v: v, pv: pv };
    });
  }
  function fmtK(k, v) { return k.unit === '%' ? F.pct(v, 1) : F.unit(v, k.unit); }
  IH.act['kpi-vals'] = function (el) {
    var k = KPIS.filter(function (x) { return x.id === el.dataset.arg; })[0], vals = kpiVals(k);
    IH.modal({ title: t('kp.vals', { k: IH.esc(IH.L(k.name)) }), wide: true, body: '<p class="mut" style="margin-top:0">' + D.periodLabel(k.per) + ' · ' + (k.lvl === 'E' ? t('kp.lvlE') : t('kp.lvlB')) + ' · LD-20261005-K</p>' +
      ui.table([{ key: 'n', label: k.lvl === 'E' ? t('c.employee') : t('c.branch') }, { key: 's', label: k.lvl === 'E' ? t('c.branch') : t('ld.code') }, { key: 'v', label: D.periodLabel(k.per), num: true }, { key: 'p', label: t('kp.prev'), num: true }, { key: 'd', label: t('kp.delta'), num: true }], vals.map(function (x) { var d = x.v - x.pv; return { n: IH.esc(x.n), s: IH.esc(x.s), v: fmtK(k, x.v), p: fmtK(k, x.pv), d: '<span style="color:' + (d >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + (d >= 0 ? '+' : '−') + fmtK(k, Math.abs(d)) + '</span>' }; }), { compact: true }),
      foot: ui.btn(t('c.export'), { icon: 'download', act: 'export', arg: k.id + '_2026-09.xlsx' }) + ui.btn(t('c.close'), { act: 'modal-close' }) });
  };
  function kpiTab() {
    return IH.grid({
      id: 'kpi', exportName: 'Gotove_KPI_vrednosti.xlsx', rows: function () { return KPIS; }, key: function (k) { return k.id; }, label: function (k) { return IH.L(k.name); },
      cols: [
        { key: 'st', label: t('c.status'), val: function () { return 'ok'; }, render: function () { return lst('ok'); }, sort: false },
        { key: 'n', label: t('kp.colKpi'), val: function (k) { return IH.L(k.name); }, render: function (k) { return '<b>' + IH.esc(IH.L(k.name)) + '</b>'; } },
        { key: 'lvl', label: t('kp.colLvl'), val: function (k) { return k.lvl === 'E' ? t('kp.lvlE') : t('kp.lvlB'); }, filter: function () { return [{ v: t('kp.lvlE'), l: t('kp.lvlE') }, { v: t('kp.lvlB'), l: t('kp.lvlB') }]; } },
        { key: 'per', label: t('kp.colPer'), val: function (k) { return D.periodLabel(k.per); } },
        { key: 'ld', label: t('ld.colId'), val: function () { return 'LD-20261005-K'; } },
        { key: 'cov', label: t('kp.colCov'), search: false, val: function (k) { return kpiVals(k).length; }, render: function (k) { var n = kpiVals(k).length; return n + ' / ' + n; } },
        { key: 'use', label: t('kp.colUse'), val: function (k) { return IH.L(k.use); } }
      ],
      actions: [{ type: 'items', title: IH.L({ sr: 'Vrednosti', en: 'Values' }), act: 'kpi-vals' }, { type: 'history', title: t('g.aHistory'), act: 'kpi-hist' }]
    });
  }
  IH.act['kpi-hist'] = function (el) {
    var k = KPIS.filter(function (x) { return x.id === el.dataset.arg; })[0];
    IH.showHistory(IH.L(k.name), [{ at: '2026-10-05T09:02', action: { sr: 'Isporuka za Septembar 2026 (LD-20261005-K)', en: 'Delivery for Sep 2026 (LD-20261005-K)' } }, { at: '2026-09-03T09:01', action: { sr: 'Isporuka za Avgust 2026', en: 'Delivery for Aug 2026' } }, { at: '2026-08-05T09:04', action: { sr: 'Isporuka za Jul 2026', en: 'Delivery for Jul 2026' } }]);
  };

  /* ---------- izvori ---------- */
  function lastOf(s) { return IH.loads().filter(function (l) { return l.src === s.id; })[0]; }
  function srcOn(s) { var x = IH.map('srcOff')[s.id]; return !x; }
  function srcTab() {
    return IH.grid({
      id: 'src', exportName: 'Izvori_podataka.xlsx', rows: function () { return SRC; }, key: function (s) { return s.id; }, label: function (s) { return IH.L(s.name); }, hidden: ['fmt'],
      cols: [
        { key: 'st', label: t('c.status'), type: 'status', val: function (s) { return srcOn(s); }, fval: function (s) { return srcOn(s) ? 'on' : 'off'; }, filter: function () { return [{ v: 'on', l: t('g.on') }, { v: 'off', l: t('g.off') }]; } },
        { key: 'n', label: t('ld.colSrc'), val: function (s) { return IH.L(s.name); }, render: function (s) { return '<b>' + IH.esc(IH.L(s.name)) + '</b>'; } },
        { key: 'k', label: t('sr.colKind'), val: function (s) { return t('sk.' + s.kind); }, filter: function () { return ['stavke', 'organizacija', 'kpi'].map(function (k) { return { v: t('sk.' + k), l: t('sk.' + k) }; }); } },
        { key: 'm', label: t('sr.colMethod'), val: function (s) { return IH.L(s.method); } },
        { key: 'sch', label: t('sr.colSched'), val: function (s) { return IH.L((IH.map('srcCfg')[s.id] || {}).sched || s.sched); } },
        { key: 'fmt', label: t('sr.colFmt'), val: function (s) { return s.fmt; } },
        { key: 'l', label: t('sr.colLast'), search: false, val: function (s) { var l = lastOf(s); return l ? l.at : ''; }, render: function (s) { var l = lastOf(s); return l ? lst(l.status) + ' <span class="mut">' + F.dt(l.at) + '</span>' : '—'; } },
        { key: 'o', label: t('sr.colOwner'), val: function (s) { return IH.L(s.owner); } }
      ],
      onStatus: function (s, on) { IH.map('srcOff')[s.id] = !on; IH.audit('source', s.id, on ? { sr: 'Izvor aktiviran', en: 'Source activated' } : { sr: 'Izvor deaktiviran — raspored zaustavljen', en: 'Source deactivated — schedule stopped' }); },
      actions: [{ type: 'edit', title: t('g.aEdit'), act: 'src-edit', kind: 'acc' }, { type: 'history', title: t('g.aHistory'), act: 'src-hist' }]
    });
  }
  IH.act['src-edit'] = function (el) {
    var s = src(el.dataset.arg); IH.form = {};
    var opts = [{ v: 'd0530', l: IH.L({ sr: 'Svaki dan 05:30', en: 'Daily 05:30' }) }, { v: 'd0500', l: IH.L({ sr: 'Svaki dan 05:00', en: 'Daily 05:00' }) }, { v: 'd0545', l: IH.L({ sr: 'Svaki dan 05:45', en: 'Daily 05:45' }) }, { v: 'm3', l: IH.L({ sr: 'Mesečno, 3. radni dan', en: 'Monthly, 3rd working day' }) }, { v: 'man', l: IH.L({ sr: 'Po potrebi', en: 'On demand' }) }];
    var cur = opts.filter(function (o) { return o.l === IH.L(s.sched); })[0];
    IH.modal({ title: t('sr.edit', { n: IH.esc(IH.L(s.name)) }), body: '<div class="form-grid">' + ui.field('sr_s', t('sr.colSched'), cur ? cur.v : 'd0530', { options: opts }) + ui.field('sr_t', t('sr.thr'), String(s.thr)) + '</div>' + ui.toggle('sr_n', t('sr.notify'), true),
      foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'src-save', arg: s.id }) });
  };
  IH.act['src-save'] = function (el) {
    var s = src(el.dataset.arg), sel = document.getElementById('fld-sr_s');
    var l = sel ? sel.options[sel.selectedIndex].text : IH.L(s.sched);
    IH.map('srcCfg')[s.id] = { sched: { sr: l, en: l } };
    IH.audit('source', s.id, { sr: 'Izmenjen raspored: ' + l, en: 'Schedule changed: ' + l });
    IH.closeModal(); IH.render(); IH.toast(t('sr.saved', { n: IH.esc(IH.L(s.name)) }));
  };
  IH.act['src-hist'] = function (el) {
    var s = src(el.dataset.arg);
    IH.showHistory(IH.L(s.name), IH.auditFor('source', s.id).concat([{ at: '2026-03-02T10:15', by: 'A001', action: { sr: 'Format ažuriran na ' + s.fmt, en: 'Format updated to ' + s.fmt } }, { at: '2025-12-15T09:00', by: 'A001', action: { sr: 'Izvor registrovan', en: 'Source registered' } }]));
  };

  /* ---------- ručni upload (3 koraka) ---------- */
  function upRows() {
    var L = D.branchStaff('B08', 'licni');
    function row(n, e, code, amt, date, ug, err) { var p = D.product(D.codeIdx[code]); return { r: n, e: e, hr: e ? e.hr : 'HR-99999', code: code, p: p, amt: amt, date: date, ug: ug, err: err || null }; }
    return [
      row(2, L[0], 'KK-RSD-60', 450000, '2026-10-17', 'UG-2691001'), row(3, L[1], 'KK-OSG-RSD', 600000, '2026-10-17', 'UG-2691002'), row(4, L[2], 'KK-REF-01', 350000, '2026-10-18', 'UG-2691003'),
      row(5, L[0], 'PKG-STD-01', 0, '2026-10-18', 'UG-2691004'), row(6, L[1], 'CC-FLX-01', 0, '2026-10-17', 'UG-2691005'), row(7, L[2], 'DC-MC-01', 0, '2026-10-18', 'UG-2691006'),
      row(8, L[0], 'KK-RSD-60', 450000, '2026-10-17', 'UG-2691001', t('up.dup', { r: 2 })), row(9, null, 'KK-RSD-36', 700000, '2026-10-18', 'UG-2691008', t('up.noEmp', { h: 'HR-99999' }))
    ];
  }
  function U() { IH.form.up = IH.form.up || {}; return IH.form.up; }
  function upStep1() {
    var u = U();
    return '<div class="form-grid">' + ui.field('up_src', t('up.src'), 'SRC-MAN', { options: [{ v: 'SRC-MAN', l: IH.L(src('SRC-MAN').name) + ' · SALES_TEMPLATE_V3' }] }) + ui.field('up_per', t('up.per'), '2026-Q4', { options: [{ v: '2026-Q4', l: 'Q4 2026' }, { v: '2026-10', l: D.periodLabel('2026-10') }] }) + '</div>' +
      '<div class="field"><label class="lab">' + t('up.file') + ' <span class="req">*</span></label>' + (u.file ? '<div class="filechip">' + ic('file') + '<b>' + IH.esc(u.file) + '</b><span class="mut">· 8 ' + IH.L({ sr: 'redova', en: 'rows' }) + ' · 14 KB</span><button class="gab dan" data-act="up-clear" style="margin-left:8px">' + ic('trash') + '</button></div>' :
        '<div class="drop">' + ic('upload') + '<div>' + t('up.drop') + ' ' + ui.btn(t('up.choose'), { cls: 'sm', act: 'up-file' }) + '</div><small class="mut">.xlsx · SALES_TEMPLATE_V3</small></div>') + '</div>' +
      ui.btn(t('up.tpl'), { cls: 'sm', icon: 'download', act: 'export', arg: 'Sablon_prodajne_stavke_V3.xlsx' }) + '<div style="height:12px"></div>' + ui.field('up_note', t('up.note'), t('up.noteSug'), { type: 'textarea' });
  }
  function upStep2() {
    if (!U().file) return '<div class="note warn" style="display:flex;align-items:center;gap:12px"><span style="flex:1">' + t('up.noFile') + '</span>' + ui.btn(t('up.choose'), { cls: 'sm primary', icon: 'file', act: 'up-file' }) + '</div>';
    var rows = upRows(), ok = rows.filter(function (r) { return !r.err; });
    return '<div class="kpis" style="margin-bottom:12px">' + ui.kpi(t('up.rows'), rows.length) + ui.kpi(t('up.ok'), ok.length, null, { hl: true }) + ui.kpi(t('up.rej'), rows.length - ok.length) + ui.kpi(t('ld.colUnm'), 0) + '</div>' +
      ui.table([{ key: 'r', label: t('ld.row'), num: true }, { key: 's', label: t('c.status') }, { key: 'e', label: t('up.seller') }, { key: 'p', label: t('c.product') }, { key: 'c', label: t('ld.code') }, { key: 'd', label: t('c.date') }, { key: 'u', label: t('it.contract') }, { key: 'a', label: t('os.colAmt'), num: true }, { key: 'x', label: t('ld.err') }],
        rows.map(function (x) { return { r: x.r, s: x.err ? ui.pill(t('up.rej'), 'danger') : ui.pill(t('up.okRow'), 'success'), e: x.e ? IH.esc(x.e.name) : x.hr, p: IH.esc(D.productName(x.p)), c: x.code, d: F.date(x.date), u: x.ug, a: x.amt ? F.num(x.amt) : '<span class="mut">—</span>', x: x.err ? '<span style="color:var(--danger)">' + IH.esc(x.err) + '</span>' : '<span class="mut">—</span>' }; }), { compact: true }) +
      '<div class="lab" style="margin-top:14px">' + t('ld.rules') + '</div>' + ui.checks([{ label: t('v.V1') }, { label: t('v.V2'), state: 'warn', sub: t('up.dup', { r: 2 }) + ' — ' + IH.L({ sr: 'red 8', en: 'row 8' }) }, { label: t('v.V3'), state: 'warn', sub: t('up.noEmp', { h: 'HR-99999' }) + ' — ' + IH.L({ sr: 'red 9', en: 'row 9' }) }, { label: t('v.V4') }, { label: t('v.V5') }, { label: t('v.V6') }]);
  }
  function upStep3() {
    if (!U().file) return '<div class="note warn" style="display:flex;align-items:center;gap:12px"><span style="flex:1">' + t('up.noFile') + '</span>' + ui.btn(t('up.choose'), { cls: 'sm primary', icon: 'file', act: 'up-file' }) + '</div>';
    var rows = upRows(), ok = rows.filter(function (r) { return !r.err; }), mg = D.branchManager('B08');
    return '<div class="note">' + t('up.confirmTxt', { n: ok.length, p: 'Q4 2026', r: rows.length - ok.length }) + '</div>' + ui.toggle('up_n', t('up.notifyMgr') + ' — ' + IH.esc(mg.name), true) +
      ui.flow([{ label: IH.L({ sr: 'Validacija', en: 'Validation' }), sub: ok.length + ' / ' + rows.length, state: 'done' }, { label: IH.L({ sr: 'Upis stavki', en: 'Write items' }), sub: 'Q4 2026', state: 'run' }, { label: t('os.title'), sub: IH.L({ sr: 'odmah', en: 'immediately' }) }, { label: t('nav.obracun'), sub: IH.L({ sr: 'pri zaključavanju', en: 'at lock' }) }]);
  }
  IH.act['up-file'] = function () { U().file = 'Sajam_Cacak_oktobar.xlsx'; IH.render(); };
  IH.act['up-clear'] = function () { U().file = null; IH.render(); };
  IH.act['up-go'] = function () {
    if (!U().file) { IH.toast(t('up.noFile')); return; }
    var rows = upRows(), ok = rows.filter(function (r) { return !r.err; }), n = IH.list('newLoads').length + 1, id = 'LD-20261020-M' + n, now = IH.now();
    ok.forEach(function (x, i) {
      IH.list('uploadedItems').push({ id: 'TX-UP' + n + '-' + String(i + 1).padStart(3, '0'), date: x.date, emp: x.e.id, branch: x.e.branch, period: '2026-Q4', product: x.p.id, code: x.code, seg: x.p.seg, ptype: x.p.ptype, cat: x.p.cat, type: 'nova', amount: x.amt, client: 'Klijent ••' + (5100 + i * 37), contract: x.ug, source: 'RUCNO', load: id, status: 'priznato' });
    });
    IH.list('newLoads').push({ id: id, src: 'SRC-MAN', at: now, end: now, status: 'upozorenje', rows: rows.length, acc: ok.length, unm: 0, rej: rows.length - ok.length, per: '2026-Q4', by: IH.me().id, file: U().file, rejList: rows.filter(function (r) { return r.err; }).map(function (r) { return { r: r.r, c: r.ug, s: r.code, e: r.err }; }) });
    IH.audit('load', id, { sr: 'Ručni upload ' + U().file, en: 'Manual upload ' + U().file }, { sr: ok.length + ' prihvaćeno, ' + (rows.length - ok.length) + ' odbijeno', en: ok.length + ' accepted, ' + (rows.length - ok.length) + ' rejected' });
    if (IH.form.up_n !== false) {
      IH.state.data.extraNotif = IH.state.data.extraNotif || {};
      (IH.state.data.extraNotif.manager = IH.state.data.extraNotif.manager || []).push({ id: 'N-UP' + n, at: now, icon: 'upload', text: { sr: 'Ručno učitano ' + ok.length + ' stavki za ekspozituru Čačak (sajam)', en: ok.length + ' items manually loaded for the Čačak branch (fair)' }, go: 'izvestaji' });
    }
    EN.invalidate(); IH.save(); IH.form = {}; IH.v('ld').page = 1;
    IH.go('ucitavanje'); IH.toast(t('up.done', { id: id, n: ok.length, r: rows.length - ok.length }));
  };
  function uploadPage(step) {
    var cur = Math.max(0, Math.min(2, (+step || 1) - 1));
    var steps = [{ label: t('up.s1'), sub: t('up.s1s') }, { label: t('up.s2'), sub: t('up.s2s') }, { label: t('up.s3'), sub: t('up.s3s') }];
    return ui.header(t('up.title'), '', '', '<a href="#/ucitavanje">' + t('ld.title') + '</a> ' + ic('chevr') + ' ' + t('up.title')) +
      ui.wizard({ base: 'ucitavanje/upload', steps: steps, cur: cur, body: [upStep1, upStep2, upStep3][cur](), finishLabel: t('up.go'), finishAct: 'up-go', cancelGo: 'ucitavanje' });
  }

  /* ---------- stranica ---------- */
  IH.route('ucitavanje', {
    title: function () { return t('ld.title'); },
    render: function (p) {
      if (p[0] === 'upload') return uploadPage(p[1]);
      var tab = ['nemapirano', 'kpi', 'izvori'].indexOf(p[0]) >= 0 ? p[0] : '';
      var nU = unmRows().filter(function (r) { return r.st === 'nemapirano'; }).length;
      var tabs = ui.rtabs('ucitavanje', [{ id: '', label: t('ld.tReg'), icon: 'upload' }, { id: 'nemapirano', label: t('ld.tUnm'), icon: 'alert', cnt: nU || null, warn: true }, { id: 'kpi', label: t('ld.tKpi'), icon: 'chart' }, { id: 'izvori', label: t('ld.tSrc'), icon: 'gear' }], tab);
      var body = tab === 'nemapirano' ? unmTab() : tab === 'kpi' ? kpiTab() : tab === 'izvori' ? srcTab() : regTab();
      return ui.header(t('ld.title'), '', ui.btn(t('ld.upload'), { cls: 'primary', icon: 'upload', act: 'up-start' })) + tabs + body;
    }
  });
  IH.act['up-start'] = function () { IH.form = { up: {} }; IH.go('ucitavanje/upload/1'); };
})();
