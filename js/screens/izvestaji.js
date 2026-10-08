/* Incentive Hub — Izveštaji: katalog, obuhvat po roli (menadžer: svoja ekspozitura; posmatrač: odobrene sekcije), izvoz */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'rp.title': 'Izveštaji', 'rp.desc': 'Katalog izveštaja nad istim podacima koje koristi obračun — isti zaposleni ima isti iznos u izveštaju, obračunskom listu i isplati. Svaki izveštaj se izvozi u Excel.',
    'rp.descMgr': 'Izveštaji za vašu ekspozituru i tim. Brojevi su isti kao u obračunu i isplati.', 'rp.descView': 'Izveštaji koje je administrator odobrio za Posmatrača — tabele samo za čitanje.',
    'rp.open': 'Otvori', 'rp.scope': 'Obuhvat: {s}', 'rp.scopeAll': 'cela banka', 'rp.readonly': 'samo za čitanje', 'rp.viewerOn': 'Odobreno za Posmatrača', 'rp.none': 'Administrator još nije odobrio nijednu sekciju za Posmatrača.', 'rp.asof': 'Podaci do {d}',
    'rg.g1': 'Ostvarenje i prodaja', 'rg.g2': 'Isplate i trošak', 'rg.g3': 'Proizvodi', 'rg.g4': 'Kontrola i audit',
    'r.r1': 'Ostvarenje po ekspozituri i targetu', 'r.r1d': 'Ostvarenje po targetu i ekspozituri, projekcija do kraja perioda i broj bankara na targetu.',
    'r.r2': 'Ostvarenje po zaposlenom', 'r.r2d': 'Svi targeti po savetniku sa projekcijom i bonusom.',
    'r.r3': 'Prodaja po proizvodu', 'r.r3d': 'Broj prodaja, iznos i storno po proizvodu iz kataloga.',
    'r.r4': 'Isplate po periodu', 'r.r4d': 'Ukupno, prosečno i najveće isplate po periodu, sa statusom isplate.',
    'r.r5': 'Trošak bonusa po komponenti', 'r.r5d': 'Od čega se sastoji trošak: targeti, kontinuitet, storno, limit, korekcije.',
    'r.r6': 'Korekcije i prigovori', 'r.r6d': 'Korekcije po razlogu i prigovori po temi i odluci.',
    'r.r7': 'Katalog proizvoda i šifre', 'r.r7d': 'Proizvodi sa kategorijom, brojem šifara iz core sistema i prodajom u periodu.',
    'r.r8': 'Izmene podešavanja (audit)', 'r.r8d': 'Ko je i kada menjao katalog, targete, šeme, rasporede, role i šablone.',
    'r.r9': 'Korisnici i pristupi', 'r.r9d': 'Korisnici po roli i deaktivacije.',
    'rc.comp': 'Komponenta', 'rc.amt': 'Iznos (RSD)', 'rc.share': 'Udeo', 'rc.c1': 'Bonus za targete', 'rc.c2': 'Prodaja van targeta', 'rc.c3': 'Kontinuitet', 'rc.c4': 'Storno umanjenja', 'rc.c5': 'Prenos negativnog salda', 'rc.c6': 'Odsečeno limitom', 'rc.c7': 'Ručne korekcije', 'rc.c8': 'Ispravke isplaćenih perioda', 'rc.m1': 'Savetnici', 'rc.m2': 'Menadžeri ekspozitura', 'rc.m3': 'Timovi univerzalnih bankara', 'rc.tot': 'Ukupno za isplatu',
    'rc.prod': 'Proizvod', 'rc.seg': 'Grupa klijenata', 'rc.pt': 'Vrsta', 'rc.sub': 'Podvrsta', 'rc.ty': 'Tip', 'rc.pdate': 'Datum isplate', 'rc.cnt': 'Prodaja (kom)', 'rc.st': 'Storno', 'rc.n': 'Zaposlenih', 'rc.tot2': 'Ukupno', 'rc.avg': 'Prosečno', 'rc.max': 'Najveća', 'rc.paid': 'Isplaćeno', 'rc.reason': 'Razlog', 'rc.count': 'Broj', 'rc.topic': 'Tema', 'rc.codes': 'Šifara', 'rc.role': 'Rola', 'rc.users': 'Korisnika', 'rc.active': 'Aktivnih'
  }, {
    'rp.title': 'Reports', 'rp.desc': 'A report catalogue over the same data the calculation uses — the same employee has the same amount in a report, a statement and the payout. Every report exports to Excel.',
    'rp.descMgr': 'Reports for your branch and team. Numbers match calculation and payout.', 'rp.descView': 'Reports the administrator approved for the Viewer — read-only tables.',
    'rp.open': 'Open', 'rp.scope': 'Scope: {s}', 'rp.scopeAll': 'whole bank', 'rp.readonly': 'read-only', 'rp.viewerOn': 'Approved for Viewer', 'rp.none': 'The administrator has not approved any section for the Viewer yet.', 'rp.asof': 'Data as of {d}',
    'rg.g1': 'Achievement and sales', 'rg.g2': 'Payout and cost', 'rg.g3': 'Products', 'rg.g4': 'Control and audit',
    'r.r1': 'Achievement by branch and target', 'r.r1d': 'Achievement by target and branch, projection to period end and bankers on target.',
    'r.r2': 'Achievement by employee', 'r.r2d': 'All targets per advisor with projection and bonus.',
    'r.r3': 'Sales by product', 'r.r3d': 'Number of sales, amount and reversals per catalogue product.',
    'r.r4': 'Payouts by period', 'r.r4d': 'Total, average and largest payouts per period, with payout status.',
    'r.r5': 'Bonus cost by component', 'r.r5d': 'What the cost consists of: targets, continuity, reversals, limit, corrections.',
    'r.r6': 'Corrections and complaints', 'r.r6d': 'Corrections by reason and complaints by topic and decision.',
    'r.r7': 'Product catalogue and codes', 'r.r7d': 'Products with category, number of core codes and sales in the period.',
    'r.r8': 'Settings changes (audit)', 'r.r8d': 'Who changed the catalogue, targets, schemes, assignments, roles and templates, and when.',
    'r.r9': 'Users and access', 'r.r9d': 'Users by role and deactivations.',
    'rc.comp': 'Component', 'rc.amt': 'Amount (RSD)', 'rc.share': 'Share', 'rc.c1': 'Target bonus', 'rc.c2': 'Out-of-target sales', 'rc.c3': 'Continuity', 'rc.c4': 'Reversal deductions', 'rc.c5': 'Negative balance carried', 'rc.c6': 'Cut by limit', 'rc.c7': 'Manual corrections', 'rc.c8': 'Paid period fixes', 'rc.m1': 'Advisors', 'rc.m2': 'Branch managers', 'rc.m3': 'Universal banker teams', 'rc.tot': 'Total payout',
    'rc.prod': 'Product', 'rc.seg': 'Client group', 'rc.pt': 'Type', 'rc.sub': 'Subtype', 'rc.ty': 'Kind', 'rc.pdate': 'Payment date', 'rc.cnt': 'Sales (pcs)', 'rc.st': 'Reversals', 'rc.n': 'Staff', 'rc.tot2': 'Total', 'rc.avg': 'Average', 'rc.max': 'Largest', 'rc.paid': 'Paid', 'rc.reason': 'Reason', 'rc.count': 'Count', 'rc.topic': 'Topic', 'rc.codes': 'Codes', 'rc.role': 'Role', 'rc.users': 'Users', 'rc.active': 'Active'
  });

  var REP = [
    { id: 'ostvarenje-ekspozitura', k: 'r1', g: 'g1', roles: ['admin', 'manager', 'viewer'], icon: 'activity' },
    { id: 'ostvarenje-zaposleni', k: 'r2', g: 'g1', roles: ['admin', 'manager'], icon: 'users' },
    { id: 'prodaja-proizvodi', k: 'r3', g: 'g1', roles: ['admin', 'manager', 'viewer'], icon: 'box' },
    { id: 'isplate', k: 'r4', g: 'g2', roles: ['admin', 'manager', 'viewer'], icon: 'wallet' },
    { id: 'trosak', k: 'r5', g: 'g2', roles: ['admin', 'viewer'], icon: 'chart' },
    { id: 'korekcije-prigovori', k: 'r6', g: 'g2', roles: ['admin', 'manager'], icon: 'edit' },
    { id: 'katalog', k: 'r7', g: 'g3', roles: ['admin', 'viewer'], icon: 'list' },
    { id: 'audit-podesavanja', k: 'r8', g: 'g4', roles: ['admin', 'viewer'], icon: 'history' },
    { id: 'pristupi', k: 'r9', g: 'g4', roles: ['admin'], icon: 'shield' }
  ];
  IH.reportCatalog = function (role) {
    return REP.filter(function (r) { return !role || r.roles.indexOf(role) >= 0; }).map(function (r) { return { id: r.id, name: { sr: t('r.' + r.k), en: t('r.' + r.k) }, grp: { sr: t('rg.' + r.g), en: t('rg.' + r.g) } }; });
  };
  function visible() {
    var role = IH.state.role, vs = IH.viewerSections ? IH.viewerSections() : [];
    return REP.filter(function (r) { return r.roles.indexOf(role) >= 0 && (role !== 'viewer' || vs.indexOf(r.id) >= 0); });
  }
  function mgrBranch() { return IH.state.role === 'manager' ? IH.me().branch : null; }
  function scopeTxt() { var b = mgrBranch(); return b ? D.branchShort(b) : t('rp.scopeAll'); }
  function inScope(e) { var b = mgrBranch(); return !b || e.branch === b; }
  function seg(id, opts) { IH.refreshers['rp-' + id] = function () { IH.render(); }; var v = IH.v('rp-' + id).per; return { v: opts.some(function (o) { return o.v === v; }) ? v : opts[0].v, html: ui.segf('rp-' + id, 'per', opts) }; }
  var QOPT = function () { return [{ v: '2026-Q4', l: 'Q4 2026 · ' + t('c.projection').toLowerCase() }, { v: '2026-Q3', l: 'Q3 2026' }, { v: '2026-Q2', l: 'Q2 2026' }]; };
  function grid(id, cfg) { return IH.grid(Object.assign({ id: 'rp-g-' + id, exportName: 'Izvestaj_' + id + '.xlsx', actions: [] }, cfg)); }
  function tName(k) { return IH.L(D.targetByKey('S-M1', k).name).split(' – ')[0]; }

  /* ---------- izveštaji ---------- */
  var R = {};
  R['ostvarenje-ekspozitura'] = function () {
    var s = seg('r1', QOPT()), pid = s.v, run = pid === '2026-Q4';
    var rows = D.branches.filter(function (b) { return !mgrBranch() || b.id === mgrBranch(); }).map(function (b) { return IH.branchStats(b.id, pid); });
    return s.html + grid('r1', {
      hidden: ['n'], rows: function () { return rows; }, key: function (r) { return r.b.id; }, label: function (r) { return r.b.code; }, searchKeys: ['b'],
      cols: [{ key: 'b', label: t('c.branch'), val: function (r) { return D.branchShort(r.b); }, fval: function (r) { return r.b.region; }, render: function (r) { return '<b>' + IH.esc(D.branchShort(r.b)) + '</b>'; }, filter: function () { return D.regions.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'rg', label: t('c.region'), val: function (r) { return IH.L(D.region(r.b.region).name); } },
        { key: 'n', label: t('rc.n'), num: true, search: false, val: function (r) { return r.n; } }]
        .concat(D.TKEYS.map(function (k) { return { key: k, label: tName(k), search: false, val: function (r) { return r[k]; }, render: function (r) { return '<div style="min-width:100px">' + ui.pcell(r[k]) + '</div>'; } }; }))
        .concat([{ key: 'p', label: t('os.colProj'), num: true, search: false, val: function (r) { return r.pT1; }, render: function (r) { return run ? F.pct(r.pT1) : '<span class="mut">—</span>'; } }, { key: 'on', label: t('os.colOn'), num: true, search: false, val: function (r) { return r.on; }, render: function (r) { return r.on + ' / ' + r.n; } }, { key: 'bn', label: 'Bonus', num: true, search: false, val: function (r) { return r.bonus; }, render: function (r) { return F.num(r.bonus); } }])
    });
  };
  R['ostvarenje-zaposleni'] = function () {
    var s = seg('r2', QOPT()), pid = s.v, run = pid === '2026-Q4';
    var rows = D.employees.filter(function (e) { return e.pos === 'licni' && inScope(e); }).map(function (e) { return { e: e, r: EN.m1(e.id, pid), p: run ? EN.m1(e.id, pid, { project: true }) : null }; });
    return s.html + grid('r2', {
      rows: function () { return rows; }, key: function (x) { return x.e.id; }, label: function (x) { return x.e.name; }, searchKeys: ['e'],
      cols: [{ key: 'e', label: t('c.employee'), val: function (x) { return x.e.name; }, render: function (x) { return '<b>' + IH.esc(x.e.name) + '</b>'; } }, { key: 'b', label: t('c.branch'), val: function (x) { return D.branchShort(x.e.branch); }, fval: function (x) { return x.e.branch; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }); } }]
        .concat(D.TKEYS.map(function (k, i) { return { key: k, label: tName(k), num: true, search: false, val: function (x) { return x.r.targets[i].pct; }, render: function (x) { var p = x.r.targets[i].pct; return '<span style="color:' + (p >= 1 ? 'var(--success)' : p >= 0.8 ? 'var(--warning)' : 'var(--ink-2)') + '">' + F.pct(p) + '</span>'; } }; }))
        .concat([{ key: 'b2', label: run ? t('os.colBonus') : 'Bonus', num: true, search: false, val: function (x) { return (x.p || x.r).payout; }, render: function (x) { return F.num((x.p || x.r).payout); } }]),
      hidden: mgrBranch() ? ['b'] : []
    });
  };
  R['prodaja-proizvodi'] = function () {
    var s = seg('r3', [{ v: '2026-Q4', l: 'Q4 2026 · ' + t('pst.u_toku').toLowerCase() }, { v: '2026-Q3', l: 'Q3 2026' }]), pid = s.v;
    var months = pid === '2026-Q4' ? ['2026-10'] : ['2026-07', '2026-08', '2026-09'], agg = {};
    function add(i) { if (!i.product || i.type === 'zatvaranje' || (i.type === 'nova' && EN.recogDefault(i).st !== 'ok')) return; var a = agg[i.product] = agg[i.product] || { n: 0, amt: 0, st: 0 }; if (i.type === 'storno') a.st++; else { a.n++; a.amt += i.amount || 0; } }
    D.employees.filter(function (e) { return inScope(e) && (e.pos === 'licni' || e.pos === 'univerzalni'); }).forEach(function (e) { (e.pos === 'licni' ? [pid] : months).forEach(function (p) { EN.effItems(e.id, p).forEach(add); }); });
    var tot = Object.keys(agg).reduce(function (a, k) { return a + agg[k].n; }, 0);
    var rows = Object.keys(agg).map(function (k) { return { p: D.product(k), a: agg[k] }; }).filter(function (x) { return x.p; });
    return s.html + grid('r3', {
      rows: function () { return rows.sort(function (x, y) { return y.a.n - x.a.n; }); }, key: function (x) { return x.p.id; }, label: function (x) { return x.p.id; }, searchKeys: ['p'],
      cols: [
        { key: 'p', label: t('rc.prod'), val: function (x) { return D.productName(x.p); }, render: function (x) { return '<b>' + IH.esc(D.productName(x.p)) + '</b>'; } },
        { key: 'sg', label: t('rc.seg'), val: function (x) { return D.segName(x.p.seg); }, fval: function (x) { return x.p.seg; }, filter: function () { return D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'pt', label: t('rc.pt'), val: function (x) { return D.ptypeName(x.p.ptype); }, fval: function (x) { return x.p.ptype; }, filter: function () { return D.ptypes.map(function (p) { return { v: p.id, l: IH.L(p.name) }; }); } },
        { key: 'n', label: t('rc.cnt'), num: true, search: false, val: function (x) { return x.a.n; } },
        { key: 'sh', label: t('rc.share'), num: true, search: false, val: function (x) { return x.a.n / (tot || 1); }, render: function (x) { return F.pct(x.a.n / (tot || 1), 1); } },
        { key: 'a', label: t('rc.amt'), num: true, search: false, val: function (x) { return x.a.amt; }, render: function (x) { return x.a.amt ? F.num(x.a.amt) : '<span class="mut">—</span>'; } },
        { key: 's', label: t('rc.st'), num: true, search: false, val: function (x) { return x.a.st; }, render: function (x) { return x.a.st ? '<span style="color:var(--danger)">' + x.a.st + '</span>' : '<span class="mut">0</span>'; } }
      ]
    });
  };
  R['isplate'] = function () {
    var rows = ['2026-Q1', '2026-Q2', '2026-Q3', '2026-07', '2026-08', '2026-09'].map(function (pid) {
      var st = EN.staffForPeriod(pid).filter(inScope), pays = st.map(function (e) { var r = EN.result(e.id, pid); return r ? r.payout : 0; });
      var tot = pays.reduce(function (a, x) { return a + x; }, 0);
      return { p: D.period(pid), n: st.length, tot: tot, avg: st.length ? tot / st.length : 0, max: Math.max.apply(null, pays.concat([0])) };
    });
    var paid = rows.filter(function (r) { return r.p.status === 'isplaceno'; }).reduce(function (a, r) { return a + r.tot; }, 0), pend = rows.filter(function (r) { return r.p.status !== 'isplaceno'; }).reduce(function (a, r) { return a + r.tot; }, 0);
    return '<div class="kpis">' + ui.kpi(t('rc.paid') + ' 2026', F.num(paid) + '<span class="u">RSD</span>', null, { hl: true }) + ui.kpi(t('pst.saglasnost'), F.num(pend) + '<span class="u">RSD</span>') + '</div>' + grid('r4', {
      rows: function () { return rows; }, key: function (r) { return r.p.id; }, label: function (r) { return r.p.id; },
      cols: [
        { key: 'p', label: t('c.period'), val: function (r) { return r.p.from; }, render: function (r) { return '<b>' + D.periodLabel(r.p.id) + '</b>'; } },
        { key: 'ty', label: t('rc.ty'), val: function (r) { return r.p.type === 'Q' ? t('ob.q') : t('ob.m'); } },
        { key: 'st', label: t('c.status'), val: function (r) { return r.p.status; }, render: function (r) { return ui.pill(t('pst.' + r.p.status), r.p.status === 'isplaceno' ? 'gray' : 'warning'); }, filter: function () { return ['isplaceno', 'saglasnost'].map(function (k) { return { v: k, l: t('pst.' + k) }; }); } },
        { key: 'n', label: t('rc.n'), num: true, search: false, val: function (r) { return r.n; } },
        { key: 't', label: t('rc.tot2'), num: true, search: false, val: function (r) { return r.tot; }, render: function (r) { return F.num(r.tot); } },
        { key: 'a', label: t('rc.avg'), num: true, search: false, val: function (r) { return r.avg; }, render: function (r) { return F.num(r.avg); } },
        { key: 'm', label: t('rc.max'), num: true, search: false, val: function (r) { return r.max; }, render: function (r) { return F.num(r.max); } },
        { key: 'pd', label: t('rc.pdate'), search: false, val: function (r) { return r.p.paidAt || ''; }, render: function (r) { return r.p.paidAt ? F.date(r.p.paidAt) : '<span class="mut">—</span>'; } }
      ]
    });
  };
  R['trosak'] = function () {
    var s = seg('r5', [{ v: '2026-Q3', l: 'Q3 2026' }, { v: '2026-Q2', l: 'Q2 2026' }]), pid = s.v;
    var lic = D.employees.filter(function (e) { return e.pos === 'licni'; }).map(function (e) { return EN.m1(e.id, pid); });
    function sum(f) { return lic.reduce(function (a, r) { return a + f(r); }, 0); }
    var months = pid === '2026-Q3' ? ['2026-07', '2026-08', '2026-09'] : [];
    var m2 = D.branches.reduce(function (a, b) { return a + EN.m2(D.branchManager(b.id).id, pid).payout; }, 0);
    var m3 = months.reduce(function (a, m) { return a + D.branches.reduce(function (q, b) { return q + EN.m3(b.id, m).total; }, 0); }, 0);
    var rows = [['rc.c1', sum(function (r) { return r.targets.reduce(function (a, x) { return a + x.bonus; }, 0); })], ['rc.c3', sum(function (r) { return r.continuity; })], ['rc.c4', sum(function (r) { return r.storno; })], ['rc.c5', -sum(function (r) { return r.carryIn; })], ['rc.c6', -sum(function (r) { return r.capped ? r.beforeCap - Math.min(r.beforeCap, r.limit) : 0; })], ['rc.c7', sum(function (r) { return r.corrections || 0; })], ['rc.c8', sum(function (r) { return r.priorAdj || 0; })]];
    var m1 = sum(function (r) { return r.payout; }), tot = m1 + m2 + m3;
    var tb = rows.map(function (x) { return { c: t(x[0]), a: '<span style="color:' + (x[1] < 0 ? 'var(--danger)' : 'var(--ink)') + '">' + F.num(x[1]) + '</span>', s: tot ? F.pct(x[1] / tot, 1) : '—' }; })
      .concat([{ c: '<b>' + t('rc.m1') + '</b>', a: '<b>' + F.num(m1) + '</b>', s: F.pct(m1 / (tot || 1), 1) }, { c: t('rc.m2'), a: F.num(m2), s: F.pct(m2 / (tot || 1), 1) }]).concat(months.length ? [{ c: t('rc.m3'), a: F.num(m3), s: F.pct(m3 / (tot || 1), 1) }] : []);
    var bar = '<div class="stackbar" style="height:16px;margin:4px 0 14px"><i style="width:' + (m1 / tot * 100) + '%;background:var(--c1)" title="' + t('rc.m1') + '"></i><i style="width:' + (m2 / tot * 100) + '%;background:var(--c2)" title="' + t('rc.m2') + '"></i><i style="width:' + (m3 / tot * 100) + '%;background:var(--c4)" title="' + t('rc.m3') + '"></i></div>';
    return s.html + '<div class="kpis">' + ui.kpi(t('rc.tot'), F.num(tot) + '<span class="u">RSD</span>', D.periodLabel(pid), { hl: true }) + ui.kpi(t('rc.m1'), F.num(m1)) + ui.kpi(t('rc.m2'), F.num(m2)) + ui.kpi(t('rc.m3'), months.length ? F.num(m3) : '—') + '</div>' +
      ui.card(t('r.r5'), bar + ui.table([{ key: 'c', label: t('rc.comp') }, { key: 'a', label: t('rc.amt'), num: true }, { key: 's', label: t('rc.share'), num: true }], tb, { compact: true, foot: { c: t('rc.tot'), a: F.num(tot), s: '100%' } }));
  };
  R['korekcije-prigovori'] = function () {
    var cs = EN.allCorr().filter(function (c) { var e = D.emp(c.emp); return e && inScope(e); }), byR = {};
    cs.forEach(function (c) { var k = c.reason; byR[k] = byR[k] || { n: 0, kinds: {} }; byR[k].n++; byR[k].kinds[c.kind] = 1; });
    var cps = IH.complaints().filter(function (c) { return inScope(D.emp(c.emp)); }), byT = {};
    cps.forEach(function (c) { var k = c.reason || 'OSTALO'; byT[k] = byT[k] || { otvoren: 0, usvojen: 0, odbijen: 0 }; byT[k][c.status]++; });
    var prn = function (id) { var r = IH.codeItems('RAZLOG_PRIGOVORA').filter(function (x) { return x.id === id; })[0]; return r ? IH.L(r.name) : id; };
    return '<div class="kpis">' + ui.kpi(IH.L({ sr: 'Korekcija', en: 'Corrections' }), cs.length) + ui.kpi(IH.L({ sr: 'Prigovora', en: 'Complaints' }), cps.length) + ui.kpi(t('pst2.usvojen'), cps.filter(function (c) { return c.status === 'usvojen'; }).length) + ui.kpi(t('pst2.otvoren'), cps.filter(function (c) { return c.status === 'otvoren'; }).length) + '</div><div class="grid g2">' +
      ui.card(IH.L({ sr: 'Korekcije po razlogu', en: 'Corrections by reason' }), ui.table([{ key: 'r', label: t('rc.reason') }, { key: 'n', label: t('rc.count'), num: true }], Object.keys(byR).map(function (k) { return { r: IH.esc(IH.corrReason(k)), n: byR[k].n }; }), { compact: true }), { flush: true }) +
      ui.card(IH.L({ sr: 'Prigovori po temi', en: 'Complaints by topic' }), ui.table([{ key: 'r', label: t('rc.topic') }, { key: 'o', label: t('pst2.otvoren'), num: true }, { key: 'u', label: t('pst2.usvojen'), num: true }, { key: 'd', label: t('pst2.odbijen'), num: true }], Object.keys(byT).map(function (k) { return { r: IH.esc(prn(k)), o: byT[k].otvoren, u: byT[k].usvojen, d: byT[k].odbijen }; }), { compact: true }), { flush: true }) + '</div>';
  };
  R['katalog'] = function () {
    var cnt = {}; ['2026-Q3'].forEach(function (pid) { D.allItems(pid).forEach(function (i) { if (i.product && i.type === 'nova') cnt[i.product] = (cnt[i.product] || 0) + 1; }); });
    ['2026-07', '2026-08', '2026-09'].forEach(function (pid) { D.allItems(pid).forEach(function (i) { if (i.product && i.type === 'nova') cnt[i.product] = (cnt[i.product] || 0) + 1; }); });
    return grid('r7', {
      rows: IH.products, key: function (p) { return p.id; }, label: function (p) { return p.id; }, searchKeys: ['p'],
      cols: [
        { key: 'p', label: t('rc.prod'), val: function (p) { return D.productName(p); }, render: function (p) { return '<b>' + IH.esc(D.productName(p)) + '</b>'; } },
        { key: 'sg', label: t('rc.seg'), val: function (p) { return D.segName(p.seg); }, fval: function (p) { return p.seg; }, filter: function () { return D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'pt', label: t('rc.pt'), val: function (p) { return D.ptypeName(p.ptype); }, fval: function (p) { return p.ptype; }, filter: function () { return D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'sb', label: t('rc.sub'), val: function (p) { return IH.L(p.sub); } },
        { key: 'k', label: t('rc.codes'), num: true, search: false, val: function (p) { return p.codes.length; } },
        { key: 'st', label: t('c.status'), val: function (p) { return p.status; }, render: function (p) { return ui.st2(p.status); }, filter: function () { return ['aktivan', 'neaktivan'].map(function (k) { return { v: k, l: t('st2.' + k) }; }); } },
        { key: 'n', label: t('rc.cnt') + ' Q3', num: true, search: false, val: function (p) { return cnt[p.id] || 0; } }
      ]
    });
  };
  R['audit-podesavanja'] = function () { var cfg = IH.auditConfigModules; return IH.auditGrid('rp-audit', function () { return IH.auditAll().filter(function (a) { var m = { product: 'catalog', catalog: 'catalog', codelist: 'codelist', target: 'target', cascade: 'target', scheme: 'scheme', assignment: 'assignment', org: 'org', user: 'user', role: 'user', template: 'template' }[a.entity]; return m && cfg.indexOf(m) >= 0; }); }); };
  R['pristupi'] = function () {
    var RM = { admin: 'admin', menadzer: 'manager', regionalni: 'manager', licni: 'employee', univerzalni: 'employee', kontroling: 'viewer' };
    var us = D.employees.filter(function (e) { return RM[e.pos]; }), off = IH.map('userOff');
    var rows = ['admin', 'manager', 'employee', 'viewer'].map(function (r) { var l = us.filter(function (e) { return RM[e.pos] === r; }); return { r: '<b>' + t('ur.' + r) + '</b>', n: l.length, a: l.filter(function (e) { return !off[e.id]; }).length }; });
    return ui.card(t('r.r9'), ui.table([{ key: 'r', label: t('rc.role') }, { key: 'n', label: t('rc.users'), num: true }, { key: 'a', label: t('rc.active'), num: true }], rows, { compact: true, foot: { r: t('rc.tot2'), n: us.length, a: us.filter(function (e) { return !off[e.id]; }).length } }), { flush: true, actions: ui.btn(t('nav.korisnici'), { cls: 'sm', go: 'korisnici' }) });
  };

  /* ---------- stranice ---------- */
  function catalog() {
    var vis = visible(), role = IH.state.role, vs = IH.viewerSections ? IH.viewerSections() : [];
    if (!vis.length) return ui.header(t('rp.title')) + '<div class="empty">' + t('rp.none') + '</div>';
    var groups = ['g1', 'g2', 'g3', 'g4'].map(function (g) {
      var l = vis.filter(function (r) { return r.g === g; }); if (!l.length) return '';
      return IH.sech(t('rg.' + g)) + '<div class="grid g3" style="margin-bottom:6px">' + l.map(function (r) {
        return '<section class="card" style="margin:0"><div class="cb" style="display:flex;flex-direction:column;gap:8px;height:100%"><div style="display:flex;gap:10px;align-items:center"><span class="ai" style="width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:var(--accent-soft);color:var(--accent)">' + ic(r.icon) + '</span><b style="flex:1">' + t('r.' + r.k) + '</b></div><div class="mut" style="flex:1;font-size:12.5px">' + t('r.' + r.k + 'd') + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' + ui.btn(t('rp.open'), { cls: 'sm primary', icon: 'arrow', go: 'izvestaji/' + r.id }) + ui.btn('Excel', { cls: 'sm', icon: 'download', act: 'export', arg: 'Izvestaj_' + r.id + '.xlsx' }) + (role === 'admin' && vs.indexOf(r.id) >= 0 ? ui.pill(t('rp.viewerOn'), 'info') : '') + '</div></div></section>';
      }).join('') + '</div>';
    }).join('');
    return ui.header(t('rp.title'), '', '<span class="mut">' + t('rp.asof', { d: F.date(D.DATA_AS_OF) }) + '</span>') + groups;
  }
  function report(id) {
    var r = vis(id); if (!r) return catalog();
    var sub = t('rp.scope', { s: scopeTxt() }) + (IH.state.role === 'viewer' ? ' · ' + t('rp.readonly') : '') + ' · ' + t('rp.asof', { d: F.date(D.DATA_AS_OF) });
    return ui.header(t('r.' + r.k), '', '<span class="mut">' + sub + '</span>' + ui.btn(IH.L({ sr: 'Izvezi u Excel', en: 'Export to Excel' }), { icon: 'download', act: 'export', arg: 'Izvestaj_' + r.id + '.xlsx' }), '<a href="#/izvestaji">' + t('rp.title') + '</a> ' + ic('chevr') + ' ' + t('r.' + r.k)) + '<div style="margin-bottom:14px"></div>' + R[r.id]();
  }
  function vis(id) { return visible().filter(function (r) { return r.id === id; })[0]; }
  IH.route('izvestaji', { title: function () { return t('rp.title'); }, render: function (p) { return p[0] ? report(p[0]) : catalog(); } });
})();
