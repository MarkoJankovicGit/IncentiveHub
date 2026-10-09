/* Incentive Hub — Audit trag: ko, kada, šta i zašto, kroz sve module */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'au.title': 'Audit trag', 'au.desc': 'Svaka izmena podešavanja i svaka odluka u procesu — ko, kada, šta i zašto. Zapisi se ne mogu menjati ni brisati; izvoz služi internoj reviziji.',
    'au.colAt': 'Vreme', 'au.colUser': 'Korisnik', 'au.colMod': 'Modul', 'au.colObj': 'Objekat', 'au.colAct': 'Radnja', 'au.colWhy': 'Detalj / razlog', 'au.colCh': 'Kanal', 'au.sys': 'Sistem', 'au.det': 'Audit zapis',
    'au.d1': 'Danas', 'au.d7': 'Poslednjih 7 dana', 'au.d30': 'Poslednjih 30 dana', 'au.k1': 'Zapisa danas', 'au.k2': 'Izmena podešavanja (30 dana)', 'au.k3': 'Odluka u procesu (30 dana)', 'au.k4': 'Korisnika sa aktivnošću',
    'am.catalog': 'Katalog', 'am.codelist': 'Šifarnici', 'am.target': 'Targeti', 'am.scheme': 'Bonus šeme', 'am.assignment': 'Raspoređivanje', 'am.load': 'Učitavanje', 'am.calc': 'Obračun', 'am.correction': 'Korekcije', 'am.consent': 'Saglasnosti', 'am.complaint': 'Prigovori', 'am.payout': 'Isplata', 'am.org': 'Organizacija', 'am.user': 'Korisnici i role', 'am.template': 'Šabloni', 'am.login': 'Prijava'
  }, {
    'au.title': 'Audit trail', 'au.desc': 'Every settings change and every process decision — who, when, what and why. Records cannot be changed or deleted; the export serves internal audit.',
    'au.colAt': 'Time', 'au.colUser': 'User', 'au.colMod': 'Module', 'au.colObj': 'Object', 'au.colAct': 'Action', 'au.colWhy': 'Detail / reason', 'au.colCh': 'Channel', 'au.sys': 'System', 'au.det': 'Audit record',
    'au.d1': 'Today', 'au.d7': 'Last 7 days', 'au.d30': 'Last 30 days', 'au.k1': 'Records today', 'au.k2': 'Settings changes (30 days)', 'au.k3': 'Process decisions (30 days)', 'au.k4': 'Users with activity',
    'am.catalog': 'Catalogue', 'am.codelist': 'Code lists', 'am.target': 'Targets', 'am.scheme': 'Bonus schemes', 'am.assignment': 'Assignment', 'am.load': 'Data loads', 'am.calc': 'Calculation', 'am.correction': 'Corrections', 'am.consent': 'Consents', 'am.complaint': 'Complaints', 'am.payout': 'Payout', 'am.org': 'Organisation', 'am.user': 'Users and roles', 'am.template': 'Templates', 'am.login': 'Sign-in'
  });

  var MOD = { product: 'catalog', catalog: 'catalog', mapping: 'catalog', codelist: 'codelist', target: 'target', cascade: 'target', scheme: 'scheme', teamSplit: 'scheme', pointList: 'catalog', period: 'period', assignment: 'assignment', load: 'load', source: 'load', calc: 'calc', correction: 'correction', consent: 'consent', complaint: 'complaint', payout: 'payout', org: 'org', user: 'user', role: 'user', template: 'template', login: 'login' };
  var CONFIG = ['period', 'catalog', 'codelist', 'target', 'scheme', 'assignment', 'org', 'user', 'template'];
  IH.auditConfigModules = CONFIG;
  function L2(sr, en) { return { sr: sr, en: en }; }
  function s(at, by, entity, ref, a, d) { return { at: at, by: by, entity: entity, ref: ref, action: a, detail: d || null, seed: true }; }
  var SEED = [
    s('2026-10-20T08:14', 'E1001', 'login', 'E1001', L2('Prijava (SSO)', 'Sign-in (SSO)')), s('2026-10-20T07:52', 'A001', 'login', 'A001', L2('Prijava (SSO)', 'Sign-in (SSO)')),
    s('2026-10-20T06:14', null, 'load', 'LD-20261020-01', L2('Noćni uvoz završen', 'Nightly import completed'), L2('1.284 stavke · 3 odbijene', '1,284 items · 3 rejected')),
    s('2026-10-20T05:05', null, 'org', 'HR', L2('Uvoz organizacije iz HR mastera', 'Organisation import from HR master'), L2('3 promene: novi zaposleni, premeštaj, odlazak', '3 changes: new hire, transfer, leaver')),
    s('2026-10-19T16:30', D.branchManager('B02').id, 'cascade', 'Q1 2027 · B02', L2('Raspodela targeta poslata na odobrenje', 'Target split submitted for approval')),
    s('2026-10-18T23:59', null, 'consent', '2026-09', L2('Automatska saglasnost po isteku roka', 'Auto-consent after deadline'), L2('9 obračuna · rok 18.10.2026.', '9 statements · deadline Oct 18, 2026')),
    s('2026-10-17T14:05', 'A001', 'assignment', 'RS-P001', L2('Raspored poslat na odobrenje', 'Assignment submitted for approval'), L2('Milica Kostić · ukidanje izuzetka Q3 ×2/3 od Q4', 'Milica Kostić · Q3 exception ×2/3 lifted from Q4')),
    s('2026-10-16T09:48', 'E1005', 'complaint', 'C-0413', L2('Prigovor uložen', 'Complaint filed'), L2('Kreditna kartica izdata 30.09. nije u obračunu', 'Credit card issued Sep 30 not in the statement')),
    s('2026-10-16T07:42', 'A001', 'load', 'LD-20261016-02', L2('Ručno ponovljeno učitavanje posle greške', 'Load re-run manually after an error'), L2('LD-20261016-01: timeout veze ka DWH_PROD', 'LD-20261016-01: DWH_PROD connection timeout')),
    s('2026-10-15T11:22', 'E1003', 'complaint', 'C-0412', L2('Prigovor uložen', 'Complaint filed'), L2('Keš kredit nije uračunat u T1 za Q3', 'Cash loan not counted in Q3 T1')),
    s('2026-10-14T16:02', 'E1005', 'consent', 'E1005|2026-Q3', L2('Saglasnost na obračun Q3 2026', 'Consent to Q3 2026 statement')),
    s('2026-10-13T08:41', 'E1004', 'consent', 'E1004|2026-Q3', L2('Saglasnost na obračun Q3 2026', 'Consent to Q3 2026 statement')),
    s('2026-10-12T10:00', 'A001', 'calc', '2026-Q3', L2('Obračunski listovi poslati zaposlenima', 'Statements sent to employees'), L2('39 obračuna · rok za saglasnost 22.10.2026.', '39 statements · consent deadline Oct 22, 2026')),
    s('2026-10-09T09:00', 'A001', 'calc', '2026-Q3', L2('Kontrola odstupanja završena', 'Variance review completed'), L2('19 kontrola pregledano', '19 checks reviewed')),
    s('2026-10-08T13:10', 'A001', 'correction', 'KOR-0101', L2('Korekcija uneta: ispravka isplaćenog perioda', 'Correction entered: paid period fix'), L2('Kreditna kartica iz juna — razlika kroz Q4', 'Credit card from June — difference through Q4')),
    s('2026-10-06T09:14', 'A001', 'calc', '2026-Q3', L2('Obračun #1 pokrenut', 'Calculation run #1'), L2('BS-LB-2026 v2, BS-ME-2026 v1 · katalog v2026.09', 'BS-LB-2026 v2, BS-ME-2026 v1 · catalogue v2026.09')),
    s('2026-10-05T18:00', null, 'calc', '2026-Q3', L2('Period zaključan', 'Period locked'), L2('Nove stavke idu u Q4 ili kroz korekciju', 'New items go to Q4 or through a correction')),
    s('2026-10-05T16:40', 'A001', 'correction', 'KOR-0098', L2('Korekcija uneta: dodata stavka', 'Correction entered: added item'), L2('Stambeni kredit 7.200.000 — kasni podaci', 'Mortgage 7,200,000 — late data')),
    s('2026-10-04T11:05', 'A001', 'correction', 'KOR-0099', L2('Korekcija uneta: duplikat isključen', 'Correction entered: duplicate excluded'), L2('Incident DWH-2214', 'Incident DWH-2214')),
    s('2026-10-01T07:30', null, 'target', 'Q4 2026', L2('Targeti aktivirani i obaveštenja poslata', 'Targets activated and notifications sent'), L2('39 zaposlenih', '39 employees')),
    s('2026-09-30T15:20', 'D001', 'cascade', 'Q4 2026 · R1', L2('Kaskada regiona odobrena', 'Region cascade approved')),
    s('2026-09-26T08:15', null, 'catalog', 'KK-RSD-PROMO-Q3', L2('Nova nemapirana šifra u feed-u', 'New unmapped code in the feed'), L2('Keš kredit — jesenja akcija', 'Cash loan — autumn promo')),
    s('2026-09-15T10:00', 'A001', 'payout', 'ISP-2026-08', L2('Potvrđen prijem u sistemu zarada', 'Payroll receipt confirmed'), L2('ZAR-2026-0911', 'ZAR-2026-0911')),
    s('2026-09-02T10:15', 'A001', 'template', 'OBRACUN_SPREMAN', L2('Izmenjen šablon', 'Template changed'), L2('Dodat rok za saglasnost u tekst', 'Consent deadline added to the text')),
    s('2026-07-28T11:20', 'A001', 'assignment', 'E1006', L2('Izuzetak u rasporedu', 'Assignment exception'), L2('Milica Kostić · Q3 ×2/3 · premeštaj iz Dorćola 01.08.', 'Milica Kostić · Q3 ×2/3 · transfer from Dorćol Aug 1')),
    s('2026-07-21T09:40', 'D001', 'product', 'P06', L2('Izmenjen opis proizvoda (privremeno pravo TP-001)', 'Product description changed (temporary right TP-001)')),
    s('2026-06-25T14:30', 'A001', 'scheme', 'S-M1', L2('Aktivirana verzija v2 od 01.07.2026.', 'Version v2 activated from Jul 1, 2026'), L2('Limit 220.000 → 250.000 · kontinuitet 10.000', 'Limit 220,000 → 250,000 · continuity 10,000')),
    s('2026-06-25T14:10', 'A001', 'scheme', 'S-M3', L2('Aktivirana verzija v2 od 01.07.2026.', 'Version v2 activated from Jul 1, 2026'), L2('Plafon ×1,5 baze', 'Cap ×1.5 of base')),
    s('2026-05-13T09:05', 'A001', 'product', 'P06', L2('Novi proizvod: Paket račun Prime', 'New product: Prime package account'), L2('Kategorija RAC-3 · šifra PKG-PRM-01', 'Category RAC-3 · code PKG-PRM-01')),
    s('2026-05-12T17:20', 'A001', 'product', 'P39', L2('Proizvod deaktiviran', 'Product deactivated'), L2('Zamenjen proizvodom P06; istorija ostaje', 'Replaced by P06; history kept')),
    s('2026-03-01T10:00', 'A001', 'codelist', 'TIP_STAVKE', L2('Dodata stavka šifarnika: obnova', 'Code list item added: renewal')),
    s('2025-12-15T09:00', 'A001', 'user', 'A001', L2('Uvođenje sistema — role i permisije podešene', 'Go-live — roles and permissions set'))
  ];
  IH.auditAll = function () { return (IH.state.data.audit || []).concat(SEED).slice().sort(function (a, b) { return a.at < b.at ? 1 : a.at > b.at ? -1 : 0; }); };
  function modOf(a) { return MOD[a.entity] || 'catalog'; }
  function age(a) { return Math.round((Date.parse(D.TODAY) - Date.parse(a.at.slice(0, 10))) / 864e5); }
  function buckets(a) { var d = age(a), out = []; if (d <= 0) out.push('d1'); if (d <= 7) out.push('d7'); if (d <= 30) out.push('d30'); return out; }
  function who(a) { var e = a.by && D.emp(a.by); return e ? e.name : t('au.sys'); }
  IH.auditGrid = function (id, rowsFn) {
    return IH.grid({
      id: id, exportName: 'Audit_trag.xlsx', searchLabel: IH.L({ sr: 'Objekat, radnja, korisnik', en: 'Object, action, user' }), hidden: ['ch'],
      rows: rowsFn, key: function (a) { return a.at + '|' + a.entity + '|' + a.ref + '|' + IH.L(a.action); }, label: function (a) { return IH.L(a.action); }, searchKeys: ['o', 'a', 'u', 'w'],
      cols: [
        { key: 'd', label: t('au.colAt'), val: function (a) { return a.at; }, fval: buckets, render: function (a) { return F.dt(a.at); }, filter: function () { return [{ v: 'd1', l: t('au.d1') }, { v: 'd7', l: t('au.d7') }, { v: 'd30', l: t('au.d30') }]; } },
        { key: 'u', label: t('au.colUser'), val: function (a) { return who(a); }, fval: function (a) { return a.by || 'SYS'; }, render: function (a) { var e = a.by && D.emp(a.by); return e ? IH.esc(e.name) : '<span class="mut">' + t('au.sys') + '</span>'; }, filter: function () { var m = {}; rowsFn().forEach(function (a) { m[a.by || 'SYS'] = 1; }); return Object.keys(m).map(function (k) { return { v: k, l: k === 'SYS' ? t('au.sys') : D.emp(k).name }; }); } },
        { key: 'm', label: t('au.colMod'), val: function (a) { return t('am.' + modOf(a)); }, fval: modOf, render: function (a) { return '<span class="tag' + (CONFIG.indexOf(modOf(a)) >= 0 ? ' acc' : '') + '">' + t('am.' + modOf(a)) + '</span>'; }, filter: function () { return Object.keys(MOD).map(function (k) { return MOD[k]; }).filter(function (v, i, arr) { return arr.indexOf(v) === i; }).map(function (k) { return { v: k, l: t('am.' + k) }; }); } },
        { key: 'o', label: t('au.colObj'), val: function (a) { return a.ref || ''; }, render: function (a) { return IH.esc(String(a.ref || '—')); } },
        { key: 'a', label: t('au.colAct'), nw: false, val: function (a) { return IH.L(a.action); }, render: function (a) { return '<div style="min-width:180px;max-width:260px"><b style="font-weight:600">' + IH.esc(IH.L(a.action)) + '</b></div>'; } },
        { key: 'w', label: t('au.colWhy'), nw: false, sort: false, val: function (a) { return a.detail ? IH.L(a.detail) : ''; }, render: function (a) { return a.detail ? '<div class="mut" style="min-width:180px;max-width:280px">' + IH.esc(IH.L(a.detail)) + '</div>' : '<span class="mut">—</span>'; } },
        { key: 'ch', label: t('au.colCh'), val: function (a) { return a.by ? 'Web · 10.12.' + (4 + (a.by.charCodeAt(a.by.length - 1) % 40)) + '.' + (20 + (a.by.length * 7) % 200) : 'Batch'; } }
      ],
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'au-det', arg: function (a) { return a.at + '|' + a.entity + '|' + a.ref; } }]
    });
  };
  IH.act['au-det'] = function (el) {
    var p = el.dataset.arg.split('|'), a = IH.auditAll().filter(function (x) { return x.at === p[0] && x.entity === p[1] && String(x.ref) === p.slice(2).join('|'); })[0]; if (!a) return;
    IH.modal({ title: t('au.det'), body: '<dl class="kv"><dt>' + t('au.colAt') + '</dt><dd>' + F.dt(a.at) + '</dd><dt>' + t('au.colUser') + '</dt><dd>' + IH.esc(who(a)) + '</dd><dt>' + t('au.colMod') + '</dt><dd>' + t('am.' + modOf(a)) + '</dd><dt>' + t('au.colObj') + '</dt><dd>' + IH.esc(String(a.ref)) + '</dd><dt>' + t('au.colAct') + '</dt><dd>' + IH.esc(IH.L(a.action)) + '</dd><dt>' + t('au.colWhy') + '</dt><dd>' + (a.detail ? IH.esc(IH.L(a.detail)) : '—') + '</dd><dt>' + t('au.colCh') + '</dt><dd>' + (a.by ? 'Web · SSO' : 'Batch') + '</dd></dl>',
      foot: ui.btn(t('c.close'), { act: 'modal-close' }) });
  };
  function page() {
    var all = IH.auditAll(), d30 = all.filter(function (a) { return age(a) <= 30; });
    var kp = '<div class="kpis">' + ui.kpi(t('au.k1'), all.filter(function (a) { return age(a) <= 0; }).length) + ui.kpi(t('au.k2'), d30.filter(function (a) { return CONFIG.indexOf(modOf(a)) >= 0; }).length) + ui.kpi(t('au.k3'), d30.filter(function (a) { return CONFIG.indexOf(modOf(a)) < 0 && a.entity !== 'login'; }).length) + ui.kpi(t('au.k4'), Object.keys(d30.reduce(function (m, a) { if (a.by) m[a.by] = 1; return m; }, {})).length) + '</div>';
    return ui.header(t('au.title')) + kp + IH.auditGrid('au', IH.auditAll);
  }
  IH.route('audit', { title: function () { return t('au.title'); }, render: page });
})();
