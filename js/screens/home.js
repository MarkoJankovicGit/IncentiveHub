/* Incentive Hub — Početna za sve role: dijagrami i „koliko sam od targeta“, projekcije na dnu */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'h.morning': 'Dobar dan, {n}', 'h.hello': 'Zdravo, {n}',
    'h.kQ3': 'Obračun Q3 2026', 'h.kQ3s': '{n} obračunskih listova', 'h.kSep': 'Obračun septembar', 'h.kSeps': '{n} obračunskih listova', 'h.kCons': 'Saglasnosti Q3', 'h.kConss': 'rok {d} · još {x} dana', 'h.kCompl': 'Otvoreni prigovori', 'h.kCompls': 'odlučuje menadžer',
    'h.kUnm': 'Nemapirane prodaje', 'h.kUnms': '{n} nove šifre iz DWH-a', 'h.kQ4': 'Projekcija Q4 2026', 'h.kQ4s': 'dan {d} od {t} · tekući tempo',
    'h.att': 'Zahteva pažnju', 'h.aUnm': '{n} nemapiranih prodaja', 'h.aUnmS': 'Šifre: {c}', 'h.aOrg': '{n} promene u organizaciji', 'h.aOrgS': 'Iz noćnog uvoza', 'h.aCons': '{n} obračuna bez saglasnosti', 'h.aConsS': 'Rok {d}',
    'h.aPay': 'Septembar spreman za isplatu', 'h.aPayS': '{n} obračuna, {a} automatskih saglasnosti', 'h.aAssign': '{n} rasporeda čeka odobrenje', 'h.aAssignS': 'Odobrava menadžer', 'h.aLoad': 'Noćni uvoz završen', 'h.aLoadS': '1.284 prodaje · 06:12',
    'h.consTitle': 'Saglasnosti Q3 2026', 'h.flowTitle': 'Tok obračuna', 'h.qTitle': 'Q3 2026 — savetnici i menadžeri', 'h.mTitle': 'Septembar 2026 — timovi univerzalnih bankara',
    'h.fLock': 'Zaključan', 'h.fCalc': 'Obračunat', 'h.fCtrl': 'Kontrola', 'h.fSend': 'Poslat', 'h.fCons': 'Saglasnosti', 'h.fPay': 'Isplata',
    'h.salesNet': 'Prodaja savetnika po mesecu', 'h.salesTeam': 'Prodaja ekspoziture po mesecu', 'h.salesMy': 'Moja prodaja po mesecu', 'h.loans': 'Krediti (RSD)', 'h.accs': 'Računi', 'h.cards': 'Kartice', 'h.toDate': 'do {d}',
    'h.achBranch': 'Ostvarenje po ekspozituri — Q3 2026', 'h.achBanker': 'Ostvarenje po bankaru — Q4 2026', 'h.achDist': 'Raspodela bankara po ostvarenju kredita — Q3 2026', 'h.bankers': 'Bankara', 'h.costQ': 'Trošak bonusa po kvartalu',
    'h.top': 'Najbolji savetnici — projekcija Q4', 'h.struct': 'Struktura obračuna Q3', 'h.sTargets': 'Bonus po targetima', 'h.sCont': 'Kontinuitet', 'h.sStorno': 'Storno', 'h.sCarry': 'Prenos negativnog salda', 'h.sCap': 'Iznad limita',
    'h.byBranch': 'Pregled po ekspozituri — Q3 2026', 'h.colStaff': 'Zaposlenih', 'h.colAvgT1': 'Krediti', 'h.colAccs': 'Računi', 'h.colCards': 'Kartice', 'h.colOnT': 'Na targetu', 'h.colPaid': 'Bonus', 'h.colCons': 'Saglasnosti', 'h.colCompl': 'Prigovori',
    'h.proj': 'Projekcije', 'h.projNote': 'Projekcija je procena na tekućem tempu i nije obaveza',
    'h.mK1': 'Krediti ekspoziture', 'h.mK2': 'Računi ekspoziture', 'h.mK3': 'Kartice ekspoziture', 'h.mK4': 'Projekcija mog bonusa Q4', 'h.mK5': 'Za vašu odluku', 'h.mK5s': '{c} prigovora · {r} rasporeda',
    'h.teamTbl': 'Savetnici — Q4 2026', 'h.colProj': 'Projekcija bonusa', 'h.onPace': 'Na tempu', 'h.behind': 'Zaostaje', 'h.below': 'Ispod praga',
    'h.decide': 'Za vašu odluku', 'h.dCompl': 'Prigovor — {n}', 'h.dAssign': 'Raspored — {n}', 'h.dCons': '{n} obračuna bez saglasnosti u timu',
    'h.uTeam': 'Univerzalni bankari — oktobar 2026', 'h.payPct': 'Isplata u odnosu na osnovu', 'h.teamF': 'Timski faktor',
    'h.near': 'Blizu sledećeg praga', 'h.nearTxt': '{p} · do {th} još {g}', 'h.attn': 'Zahteva pažnju', 'h.attnTxt': 'Ostvarenje {p}', 'h.depWarn': 'ispod {m} — isplata za {a} × {f}', 'h.belowWarn': 'ispod 80% — bez isplate za target',
    'h.consNeeded': 'Obračun {p} čeka vašu saglasnost', 'h.consNeededS': 'Rok {d} · bonus {v} RSD', 'h.consOpen': 'Otvori obračun',
    'h.eK1': 'Projekcija bonusa {p}', 'h.eK1s': 'na tekućem tempu', 'h.eK2': 'Limit po periodu', 'h.eK3': 'Bonus {p}', 'h.eK4': 'Targeti na 100%',
    'h.myTargets': 'Koliko sam od targeta — {p}', 'h.bonusHist': 'Bonus po kvartalu', 'h.recent': 'Poslednje prodaje', 'h.breakdown': 'Razlaganje projektovanog bonusa', 'h.paid': 'Isplaćeno', 'h.projected': 'Projekcija',
    'h.vNet': 'Mreža po ekspozituri — Q3 2026', 'h.vCons': 'Saglasnosti po periodu',
    'h.ofTarget': 'od {v}', 'h.infoT': 'Informativni — ne ulazi u obračun', 'h.customize': 'Prilagodi'
  }, {
    'h.morning': 'Good day, {n}', 'h.hello': 'Hello, {n}',
    'h.kQ3': 'Q3 2026 calculation', 'h.kQ3s': '{n} statements', 'h.kSep': 'September calculation', 'h.kSeps': '{n} statements', 'h.kCons': 'Q3 consents', 'h.kConss': 'due {d} · {x} days left', 'h.kCompl': 'Open complaints', 'h.kCompls': 'decided by the manager',
    'h.kUnm': 'Unmapped sales', 'h.kUnms': '{n} new DWH codes', 'h.kQ4': 'Q4 2026 projection', 'h.kQ4s': 'day {d} of {t} · current pace',
    'h.att': 'Needs attention', 'h.aUnm': '{n} unmapped sales', 'h.aUnmS': 'Codes: {c}', 'h.aOrg': '{n} organisation changes', 'h.aOrgS': 'From the nightly import', 'h.aCons': '{n} statements without consent', 'h.aConsS': 'Due {d}',
    'h.aPay': 'September ready for payout', 'h.aPayS': '{n} statements, {a} auto-consents', 'h.aAssign': '{n} assignments await approval', 'h.aAssignS': 'Approved by the manager', 'h.aLoad': 'Nightly import done', 'h.aLoadS': '1,284 sales · 06:12',
    'h.consTitle': 'Q3 2026 consents', 'h.flowTitle': 'Calculation flow', 'h.qTitle': 'Q3 2026 — advisors and managers', 'h.mTitle': 'September 2026 — universal banker teams',
    'h.fLock': 'Locked', 'h.fCalc': 'Calculated', 'h.fCtrl': 'Checked', 'h.fSend': 'Sent', 'h.fCons': 'Consents', 'h.fPay': 'Payout',
    'h.salesNet': 'Advisor sales per month', 'h.salesTeam': 'Branch sales per month', 'h.salesMy': 'My sales per month', 'h.loans': 'Loans (RSD)', 'h.accs': 'Accounts', 'h.cards': 'Cards', 'h.toDate': 'to {d}',
    'h.achBranch': 'Achievement per branch — Q3 2026', 'h.achBanker': 'Achievement per banker — Q4 2026', 'h.achDist': 'Bankers by loan achievement — Q3 2026', 'h.bankers': 'Bankers', 'h.costQ': 'Bonus cost per quarter',
    'h.top': 'Top advisors — Q4 projection', 'h.struct': 'Q3 calculation structure', 'h.sTargets': 'Bonus per targets', 'h.sCont': 'Continuity', 'h.sStorno': 'Reversals', 'h.sCarry': 'Negative balance carried', 'h.sCap': 'Above limit',
    'h.byBranch': 'Branch overview — Q3 2026', 'h.colStaff': 'Staff', 'h.colAvgT1': 'Loans', 'h.colAccs': 'Accounts', 'h.colCards': 'Cards', 'h.colOnT': 'On target', 'h.colPaid': 'Bonus', 'h.colCons': 'Consents', 'h.colCompl': 'Complaints',
    'h.proj': 'Projections', 'h.projNote': 'A projection is an estimate at the current pace, not a commitment',
    'h.mK1': 'Branch loans', 'h.mK2': 'Branch accounts', 'h.mK3': 'Branch cards', 'h.mK4': 'My projected bonus Q4', 'h.mK5': 'Awaiting your decision', 'h.mK5s': '{c} complaints · {r} assignments',
    'h.teamTbl': 'Advisors — Q4 2026', 'h.colProj': 'Bonus projection', 'h.onPace': 'On pace', 'h.behind': 'Behind', 'h.below': 'Below threshold',
    'h.decide': 'Awaiting your decision', 'h.dCompl': 'Complaint — {n}', 'h.dAssign': 'Assignment — {n}', 'h.dCons': '{n} team statements without consent',
    'h.uTeam': 'Universal bankers — October 2026', 'h.payPct': 'Payout relative to base', 'h.teamF': 'Team factor',
    'h.near': 'Close to the next threshold', 'h.nearTxt': '{p} · {g} to {th}', 'h.attn': 'Needs attention', 'h.attnTxt': 'Achievement {p}', 'h.depWarn': 'below {m} — payout for {a} × {f}', 'h.belowWarn': 'below 80% — no payout for the target',
    'h.consNeeded': 'The {p} statement awaits your consent', 'h.consNeededS': 'Due {d} · bonus {v} RSD', 'h.consOpen': 'Open statement',
    'h.eK1': 'Bonus projection {p}', 'h.eK1s': 'at the current pace', 'h.eK2': 'Limit per period', 'h.eK3': 'Bonus {p}', 'h.eK4': 'Targets at 100%',
    'h.myTargets': 'How far from target — {p}', 'h.bonusHist': 'Bonus per quarter', 'h.recent': 'Latest sales', 'h.breakdown': 'Projected bonus breakdown', 'h.paid': 'Paid', 'h.projected': 'Projection',
    'h.vNet': 'Network per branch — Q3 2026', 'h.vCons': 'Consents per period',
    'h.ofTarget': 'of {v}', 'h.infoT': 'Informative — not in calculation', 'h.customize': 'Customise'
  });

  var STCLS = { ceka: 'warning', saglasan: 'success', auto: 'info', prigovor: 'danger', korigovano: 'warning', odobreno: 'success', isplaceno: 'success', u_toku: 'gray' };
  IH.ui.status = function (s) { return ui.pill(t('st.' + s), STCLS[s] || 'gray'); };
  function first(n) { return n.split(' ')[0]; }
  function daysLeft(iso) { return Math.max(0, Math.round((Date.parse(iso) - Date.parse(D.TODAY)) / 864e5)); }
  var MON = { sr: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
  function mLabel(m) { return MON[IH.state.lang === 'en' ? 'en' : 'sr'][+m.slice(5, 7) - 1]; }
  /* prodaja po mesecu: krediti (RSD) i računi / kartice (kom) */
  function salesCharts(empIds, months, title) {
    var s = EN.salesByMonth(empIds, months), labels = months.map(mLabel);
    var loans = ui.chartBars({ labels: labels, series: [{ name: t('h.loans'), values: s.map(function (x) { return x.kredit; }), color: 'var(--c1)' }], h: 190, legend: false });
    var cnt = ui.chartBars({ labels: labels, series: [{ name: t('h.accs'), values: s.map(function (x) { return x.racun; }), color: 'var(--c2)' }, { name: t('h.cards'), values: s.map(function (x) { return x.kartica; }), color: 'var(--c3)' }], h: 190, fmt: function (v) { return F.num(v); } });
    return '<div class="cardgrid">' + ui.card(title + ' — ' + t('h.loans'), loans, { sub: t('h.toDate', { d: F.date(D.DATA_AS_OF) }) }) + ui.card(title + ' — ' + t('h.accs') + ' / ' + t('h.cards'), cnt, { sub: t('h.toDate', { d: F.date(D.DATA_AS_OF) }) }) + '</div>';
  }
  function tNames() { return D.TKEYS.map(function (k) { return IH.L(D.targetByKey('S-M1', k).name).split(' – ')[0]; }); }
  function targetCards(res, go) {
    return '<div class="tcards">' + res.targets.map(function (x) {
      var nb = EN.nextBand(D.SCALES.Q, x.pct);
      return ui.targetCard({ name: IH.L(x.name), ach: Math.round(x.ach), target: x.target, unit: x.unit, pct: x.pct, next: nb, nextNone: !nb, go: go });
    }).join('') + '</div>';
  }

  /* ================= ADMIN ================= */
  function branchRows() {
    return D.branches.map(function (b) {
      var lic = D.branchStaff(b.id, 'licni'), mg = D.branchManager(b.id), m2 = EN.m2(mg.id, '2026-Q3');
      var res = lic.map(function (e) { return EN.m1(e.id, '2026-Q3'); });
      var on = res.filter(function (r) { return r.targets[0].pct >= 1; }).length;
      var paid = res.reduce(function (a, r) { return a + r.payout; }, 0) + m2.payout;
      var staff = lic.concat([mg]);
      var ap = staff.map(function (e) { return EN.approval(e.id, '2026-Q3').status; });
      return { b: b, n: D.branchStaff(b.id).length, p1: m2.targets[0].pct, p2: m2.targets[1].pct, p3: m2.targets[2].pct, on: on, nl: lic.length, paid: paid, agreed: ap.filter(function (s) { return s === 'saglasan' || s === 'auto' || s === 'odobreno'; }).length, ns: staff.length, compl: ap.filter(function (s) { return s === 'prigovor'; }).length };
    });
  }
  function admin() {
    var me = IH.me();
    var q3 = EN.staffForPeriod('2026-Q3'), sep = EN.staffForPeriod('2026-09');
    var q3tot = IH.stats.periodTotal('2026-Q3'), septot = IH.stats.periodTotal('2026-09');
    var ac = IH.stats.approvalCounts('2026-Q3'), acSep = IH.stats.approvalCounts('2026-09');
    var unm = IH.stats.unmapped(), codes = {}; unm.forEach(function (i) { codes[i.code] = 1; });
    var compl = IH.stats.openComplaints().length + q3.filter(function (e) { return e.branch !== 'B01' && EN.approval(e.id, '2026-Q3').status === 'prigovor'; }).length;
    var p3 = D.period('2026-Q3');
    var h = ui.header(t('h.morning', { n: first(me.name) }), '', ui.btn(t('nav.izvestaji'), { icon: 'chart', go: 'izvestaji' }));
    h += '<div class="kpis">' +
      ui.kpi(t('h.kQ3'), F.num(q3tot) + '<span class="u">RSD</span>', t('h.kQ3s', { n: q3.length }), { go: 'obracun' }) +
      ui.kpi(t('h.kSep'), F.num(septot) + '<span class="u">RSD</span>', t('h.kSeps', { n: sep.length }), { go: 'obracun' }) +
      ui.kpi(t('h.kCons'), (ac.total - ac.ceka - ac.prigovor) + ' / ' + ac.total, t('h.kConss', { d: F.date(p3.deadline), x: daysLeft(p3.deadline) }), { go: 'saglasnosti' }) +
      ui.kpi(t('h.kCompl'), compl, t('h.kCompls'), { go: 'saglasnosti' }) +
      ui.kpi(t('h.kUnm'), unm.length, t('h.kUnms', { n: Object.keys(codes).length }), { go: 'ucitavanje' }) + '</div>';
    /* dijagrami */
    var lic = D.employees.filter(function (e) { return e.pos === 'licni'; });
    h += salesCharts(lic.map(function (e) { return e.id; }), ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'], t('h.salesNet'));
    var rows = branchRows(), names = tNames();
    var achB = ui.chartBars({ labels: rows.map(function (r) { return D.branchShort(r.b); }), series: [{ name: names[0], values: rows.map(function (r) { return r.p1; }) }, { name: names[1], values: rows.map(function (r) { return r.p2; }) }, { name: names[2], values: rows.map(function (r) { return r.p3; }) }], h: 210, fmt: function (v) { return F.pct(v); }, max: 1.5, marker: 1, markerLabel: '100%' });
    var buckets = [0, 0, 0, 0]; lic.forEach(function (e) { var p = EN.m1(e.id, '2026-Q3').targets[0].pct; buckets[p < 0.8 ? 0 : p < 1 ? 1 : p < 1.2 ? 2 : 3]++; });
    var dist = ui.chartBars({ labels: ['< 80%', '80–100%', '100–120%', '> 120%'], series: [{ name: t('h.bankers'), values: buckets, color: 'var(--c4)' }], h: 210, fmt: function (v) { return F.num(v); }, legend: false });
    h += '<div class="cardgrid">' + ui.card(t('h.achBranch'), achB) + ui.card(t('h.achDist'), dist) + '</div>';
    /* pažnja + saglasnosti */
    var att = '';
    att += ui.att({ tone: 'o', icon: 'alert', title: t('h.aUnm', { n: unm.length }), sub: t('h.aUnmS', { c: Object.keys(codes).join(', ') }), go: 'ucitavanje' });
    att += ui.att({ tone: 'b', icon: 'org', title: t('h.aOrg', { n: IH.orgOpenChanges ? IH.orgOpenChanges().length : D.orgChanges.length }), sub: t('h.aOrgS'), go: 'organizacija' });
    att += ui.att({ tone: 'o', icon: 'clock', title: t('h.aCons', { n: ac.ceka }), sub: t('h.aConsS', { d: F.date(p3.deadline) }), go: 'saglasnosti' });
    att += ui.att({ tone: 'g', icon: 'wallet', title: t('h.aPay'), sub: t('h.aPayS', { n: acSep.total, a: acSep.auto }), go: 'isplata' });
    var pa = IH.stats.pendingAssignments().length;
    if (pa) att += ui.att({ tone: 'a', icon: 'calendar', title: t('h.aAssign', { n: pa }), sub: t('h.aAssignS'), go: 'seme/rasporedi' });
    att += ui.att({ tone: 'b', icon: 'upload', title: t('h.aLoad'), sub: t('h.aLoadS'), go: 'ucitavanje' });
    var segs = [['saglasan', 'var(--success)'], ['auto', 'var(--info)'], ['ceka', 'var(--warning)'], ['prigovor', 'var(--danger)']];
    var sb = '<div class="stackbar" style="margin:4px 0 14px">' + segs.map(function (s) { return '<i style="width:' + (ac[s[0]] / ac.total * 100) + '%;background:' + s[1] + '" title="' + t('st.' + s[0]) + '"></i>'; }).join('') + '</div>';
    var lst = '<table class="t compact"><tbody>' + segs.map(function (s) { return '<tr><td><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:' + s[1] + ';margin-right:8px"></span>' + t('st.' + s[0]) + '</td><td class="num"><b>' + (ac[s[0]] || 0) + '</b></td><td class="num mut">' + F.pct((ac[s[0]] || 0) / ac.total) + '</td></tr>'; }).join('') + '</tbody></table>';
    h += '<div class="grid g-main" style="margin-bottom:16px">' + ui.card(t('h.att'), att, { flush: true }) + ui.card(t('h.consTitle'), '<div class="big-amt">' + F.pct((ac.saglasan + ac.auto) / ac.total) + '</div><div class="mut" style="margin-bottom:6px">' + (ac.saglasan + ac.auto) + ' / ' + ac.total + '</div>' + sb + lst, { actions: ui.btn(t('c.open'), { cls: 'sm', go: 'saglasnosti' }) }) + '</div>';
    /* tok obračuna */
    var q = ui.flow([{ label: t('h.fLock'), sub: F.date(p3.lockedAt), state: 'done' }, { label: t('h.fCalc'), sub: F.date(p3.calcAt), state: 'done' }, { label: t('h.fCtrl'), sub: F.date('2026-10-09'), state: 'done' }, { label: t('h.fSend'), sub: F.date(p3.sentAt), state: 'done' }, { label: t('h.fCons'), sub: F.pct((ac.saglasan + ac.auto) / ac.total), state: 'run' }, { label: t('h.fPay'), sub: '—' }]);
    var ps = D.period('2026-09');
    var m = ui.flow([{ label: t('h.fLock'), sub: F.date(ps.lockedAt), state: 'done' }, { label: t('h.fCalc'), sub: F.date(ps.calcAt), state: 'done' }, { label: t('h.fCtrl'), sub: F.date('2026-10-07'), state: 'done' }, { label: t('h.fSend'), sub: F.date(ps.sentAt), state: 'done' }, { label: t('h.fCons'), sub: '100%', state: 'done' }, { label: t('h.fPay'), sub: t('st.odobreno'), state: 'run' }]);
    h += ui.card(t('h.flowTitle'), '<div class="mut" style="font-weight:600;margin-bottom:8px">' + t('h.qTitle') + '</div>' + q + '<div class="hr"></div><div class="mut" style="font-weight:600;margin-bottom:8px">' + t('h.mTitle') + '</div>' + m, { actions: ui.btn(t('nav.obracun'), { cls: 'sm', go: 'obracun' }) });
    /* po ekspozituri */
    var tot2 = { n: 0, paid: 0, on: 0, nl: 0, agreed: 0, ns: 0, compl: 0 };
    var trs = rows.map(function (r) {
      ['n', 'paid', 'on', 'nl', 'agreed', 'ns', 'compl'].forEach(function (k) { tot2[k] += r[k]; });
      return { _go: 'ostvarenje/' + r.b.id, br: '<b>' + IH.esc(D.branchShort(r.b)) + '</b>', reg: IH.L(D.region(r.b.region).name), n: r.n, p1: ui.pcell(r.p1, { max: 1.3 }), p2: ui.pcell(r.p2, { max: 1.3 }), p3: ui.pcell(r.p3, { max: 1.3 }), on: r.on + ' / ' + r.nl, paid: F.num(r.paid), cons: F.pct(r.agreed / r.ns), compl: r.compl ? ui.pill(r.compl, 'danger') : '<span class="mut">0</span>' };
    });
    h += ui.card(t('h.byBranch'), ui.table([{ key: 'br', label: t('c.branch') }, { key: 'reg', label: t('c.region') }, { key: 'n', label: t('h.colStaff'), num: true }, { key: 'p1', label: t('h.colAvgT1'), w: '130px' }, { key: 'p2', label: t('h.colAccs'), w: '130px' }, { key: 'p3', label: t('h.colCards'), w: '130px' }, { key: 'on', label: t('h.colOnT'), num: true }, { key: 'paid', label: t('h.colPaid') + ' (RSD)', num: true }, { key: 'cons', label: t('h.colCons'), num: true }, { key: 'compl', label: t('h.colCompl'), num: true }], trs, { foot: { br: t('c.total'), n: tot2.n, on: tot2.on + ' / ' + tot2.nl, paid: F.num(tot2.paid), cons: F.pct(tot2.agreed / tot2.ns), compl: tot2.compl } }), { flush: true, actions: ui.btn(t('c.export'), { cls: 'sm', icon: 'download', act: 'export', arg: 'Pregled_po_ekspozituri_Q3_2026.xlsx' }) });
    /* projekcije na kraju */
    var q4 = D.daysInfo('2026-Q4');
    var q4proj = lic.reduce(function (a, e) { return a + EN.m1(e.id, '2026-Q4', { project: true }).payout; }, 0) + D.branches.reduce(function (a, b) { return a + EN.m2(D.branchManager(b.id).id, '2026-Q4', { project: true }).payout; }, 0);
    var cq = ['2026-Q1', '2026-Q2', '2026-Q3'].map(function (p) { return IH.stats.periodTotal(p); });
    var costChart = ui.chartBars({ labels: ['Q1', 'Q2', 'Q3', 'Q4 · ' + t('h.projected').toLowerCase()], series: [{ name: t('h.paid'), values: cq.concat([0]), color: 'var(--c1)' }, { name: t('h.projected'), values: [0, 0, 0, q4proj], color: 'var(--c5)' }], h: 190, stacked: true });
    var top = lic.map(function (e) { return { e: e, r: EN.m1(e.id, '2026-Q4', { project: true }) }; }).sort(function (a, b) { return b.r.payout - a.r.payout; }).slice(0, 8);
    h += IH.sech(t('h.proj'), '', '<span class="mut">' + t('h.projNote') + '</span>') + '<div class="kpis">' + ui.kpi(t('h.kQ4'), F.mio(q4proj) + '<span class="u">RSD</span>', t('h.kQ4s', { d: q4.done, t: q4.total }), { go: 'ostvarenje' }) + '</div>' +
      '<div class="cardgrid">' + ui.card(t('h.costQ'), costChart) + ui.card(t('h.top'), ui.hbars(top.map(function (x) { return { label: x.e.name + ' · ' + D.branch(x.e.branch).city, v: x.r.payout, fmt: F.num(x.r.payout), c: x.r.capped ? 4 : 1 }; }), { max: 100000 })) + '</div>';
    return h;
  }

  /* ================= MENADŽER ================= */
  function paceStatus(pct) { if (pct >= 1) return ui.pill(t('h.onPace'), 'success'); if (pct >= 0.8) return ui.pill(t('h.behind'), 'warning'); return ui.pill(t('h.below'), 'danger'); }
  function manager() {
    var me = IH.me(), bid = me.branch, el = D.elapsed('2026-Q4');
    var lic = D.branchStaff(bid, 'licni'), uni = D.branchStaff(bid, 'univerzalni');
    var m2 = EN.m2(me.id, '2026-Q4', { project: true }), m2now = EN.m2(me.id, '2026-Q4');
    var complaints = IH.stats.openComplaints(me.id), pend = IH.stats.pendingAssignments();
    var proj = lic.map(function (e) { return { e: e, p: EN.m1(e.id, '2026-Q4', { project: true }), n: EN.m1(e.id, '2026-Q4') }; });
    var h = ui.header(D.branchName(bid), '', ui.btn(t('nav.tim'), { icon: 'users', go: 'tim' }) + ui.btn(t('nav.moj-bonus'), { icon: 'wallet', go: 'moj-bonus' }), IH.esc(D.bank[IH.state.tenant].short) + ' · ' + IH.L(D.region(D.branch(bid).region).name));
    h += IH.sech(t('h.myTargets', { p: 'Q4 2026' })) + targetCards(m2now, 'tim');
    h += salesCharts(lic.concat(uni).map(function (e) { return e.id; }), ['2026-07', '2026-08', '2026-09', '2026-10'], t('h.salesTeam'));
    var names = tNames();
    var achB = ui.chartBars({ labels: proj.map(function (x) { return first(x.e.name) + ' ' + x.e.name.split(' ')[1].slice(0, 1) + '.'; }), series: [0, 1, 2].map(function (i) { return { name: names[i], values: proj.map(function (x) { return x.n.targets[i].pct; }) }; }), h: 210, fmt: function (v) { return F.pct(v); }, max: 1.5, marker: el, markerLabel: t('c.day', { d: D.daysInfo('2026-Q4').done, t: D.daysInfo('2026-Q4').total }) });
    var dec = '';
    complaints.forEach(function (c) { dec += ui.att({ tone: 'r', icon: 'msg', title: t('h.dCompl', { n: D.emp(c.emp).name }), sub: IH.esc(IH.L(c.subject)) + ' · ' + F.date(c.at), go: 'prigovori-tima' }); });
    pend.forEach(function (a) { dec += ui.att({ tone: 'a', icon: 'calendar', title: t('h.dAssign', { n: D.emp(a.emp).name }), sub: IH.esc(IH.L(a.note)), go: 'rasporedi-odobravanje' }); });
    var waiting = D.team(me.id).filter(function (e) { var s = EN.approval(e.id, e.pos === 'univerzalni' ? '2026-09' : '2026-Q3').status; return s === 'ceka' || s === 'korigovano'; }).length;
    if (waiting) dec += ui.att({ tone: 'o', icon: 'clock', title: t('h.dCons', { n: waiting }), sub: t('h.kConss', { d: F.date(D.period('2026-Q3').deadline), x: daysLeft(D.period('2026-Q3').deadline) }), go: 'saglasnosti-tima' });
    h += '<div class="cardgrid">' + ui.card(t('h.achBanker'), achB) + ui.card(t('h.decide'), dec || '<div class="empty">' + t('c.empty') + '</div>', { flush: true }) + '</div>';
    /* tabela tima */
    var cols = [{ key: 'n', label: t('c.employee') }];
    D.TKEYS.forEach(function (k, i) { cols.push({ key: k, label: names[i], w: '112px' }); });
    cols.push({ key: 'st', label: t('c.status') });
    var rows = proj.map(function (x) {
      var r = { _go: 'tim/' + x.e.id, n: '<b>' + IH.esc(x.e.name) + '</b>' };
      x.n.targets.forEach(function (tt) { r[tt.key] = ui.pcell(tt.pct, { marker: el, max: 1.2, cls: tt.pct >= el ? 'ok' : tt.pct >= el * 0.8 ? 'warn' : 'bad' }); });
      r.st = paceStatus(x.p.targets[0].pct);
      return r;
    });
    var m3 = EN.m3(bid, '2026-10');
    var m3b = '<table class="t compact"><tbody>' + m3.kpis.map(function (k) { return '<tr><td>' + IH.esc(IH.L(k.name)) + '</td><td style="width:150px">' + ui.pcell(k.pct, { max: 1.6 }) + '</td></tr>'; }).join('') + '</tbody></table><div class="hr"></div><div class="kv"><dt>' + t('h.payPct') + '</dt><dd>' + F.pct(m3.payoutPct) + '</dd><dt>' + t('h.teamF') + '</dt><dd>×' + F.num(m3.teamFactor, 1) + ' (' + m3.onTarget + '/' + m3.kpis.length + ' ≥ 100%)</dd></div>';
    h += '<div class="grid g-main" style="margin-bottom:16px">' + ui.card(t('h.teamTbl'), ui.table(cols, rows), { flush: true }) + ui.card(t('h.uTeam'), m3b, { actions: ui.btn(t('nav.tim'), { cls: 'sm', go: 'tim' }) }) + '</div>';
    /* blizu praga / pažnja */
    var near = [], attn = [];
    proj.forEach(function (x) {
      x.n.targets.forEach(function (tt) {
        var nb = EN.nextBand(D.SCALES.Q, tt.pct), title = IH.esc(x.e.name) + ' · ' + IH.esc(IH.L(tt.name));
        if (nb && nb.at - tt.pct <= 0.1) near.push({ g: nb.at - tt.pct, title: title, sub: t('h.nearTxt', { p: F.pct(tt.pct), th: F.pct(nb.at), g: F.unit(Math.round((nb.at - tt.pct) * tt.target), tt.unit) }) });
        var dr = (x.p.condRes || []).filter(function (c) { return c.active && c.r.tpl === 'umanjenje' && c.r.cond === tt.key; })[0];
        if (dr) attn.push({ title: title, sub: t('h.attnTxt', { p: F.pct(dr.pct) }) + ' — ' + t('h.depWarn', { m: F.pct(dr.r.min), a: IH.esc(dr.r.affects.map(function (k) { return IH.veze.nameOf(D.schemeAt(D.scheme(x.p.scheme), x.p.period), k).split(' – ')[0]; }).join(', ')), f: F.num(dr.r.factor, 1) }) });
        else if (x.p.targets.filter(function (q) { return q.key === tt.key; })[0].pct < 0.8) attn.push({ title: title, sub: t('h.attnTxt', { p: F.pct(x.p.targets.filter(function (q) { return q.key === tt.key; })[0].pct) }) + ' — ' + t('h.belowWarn') });
      });
    });
    near.sort(function (a, b) { return a.g - b.g; });
    var li = function (arr, tone) { return arr.length ? arr.map(function (x) { return ui.att({ tone: tone, icon: tone === 'g' ? 'trend' : 'alert', title: x.title, sub: x.sub }); }).join('') : '<div class="empty">' + t('c.empty') + '</div>'; };
    h += '<div class="cardgrid">' + ui.card(t('h.near'), li(near.slice(0, 5), 'g'), { flush: true }) + ui.card(t('h.attn'), li(attn.slice(0, 5), 'o'), { flush: true }) + '</div>';
    /* projekcije */
    h += IH.sech(t('h.proj'), '', '<span class="mut">' + t('h.projNote') + '</span>') + '<div class="kpis">' + ui.kpi(t('h.mK4'), F.num(m2.payout) + '<span class="u">RSD</span>', t('h.teamF') + ' ×' + F.num(m2.teamFactor, 1), { hl: true, go: 'moj-bonus' }) + ui.kpi(t('h.mK5'), complaints.length + pend.length, t('h.mK5s', { c: complaints.length, r: pend.length }), { go: complaints.length ? 'prigovori-tima' : 'rasporedi-odobravanje' }) + '</div>' +
      ui.card(t('h.colProj') + ' — Q4 2026', ui.hbars(proj.sort(function (a, b) { return b.p.payout - a.p.payout; }).map(function (x) { return { label: x.e.name, v: x.p.payout, fmt: F.num(x.p.payout), c: x.p.capped ? 4 : 1 }; }), { max: 100000 }));
    return h;
  }

  /* ================= ZAPOSLENI ================= */
  function employee() {
    var me = IH.me(), cur = EN.currentPeriod(me.id), last = EN.lastClosed(me.id), di = D.daysInfo(cur);
    var now = EN.result(me.id, cur), pr = EN.result(me.id, cur, { project: true }), lr = EN.result(me.id, last), ap = EN.approval(me.id, last);
    var h = ui.header(t('h.hello', { n: first(me.name) }), '', ui.btn(t('nav.moje-ostvarenje'), { icon: 'activity', go: 'moje-ostvarenje' }), D.posName(me.pos) + ' · ' + IH.esc(D.branchName(me.branch)));
    if (ap.status === 'ceka' || ap.status === 'korigovano') h += '<div class="card" style="border-color:var(--accent-line);background:var(--accent-soft)"><div class="cb" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><span class="ai" style="width:40px;height:40px;border-radius:10px;display:grid;place-items:center;background:var(--accent);color:var(--on-accent)">' + ic('calc') + '</span><div style="flex:1;min-width:240px"><b style="font-size:15px">' + t('h.consNeeded', { p: D.periodLabel(last) }) + '</b><div class="mut">' + t('h.consNeededS', { d: F.date(D.period(last).deadline), v: F.num(lr.payout) }) + '</div></div>' + ui.btn(t('h.consOpen'), { cls: 'primary', icon: 'arrow', go: 'moj-obracun' }) + '</div></div>';
    h += IH.sech(t('h.myTargets', { p: D.periodLabel(cur) }), '', '<span class="mut">' + t('c.day', { d: di.done, t: di.total }) + '</span>') + targetCards(now, 'moji-targeti');
    var months = me.pos === 'univerzalni' ? ['2026-07', '2026-08', '2026-09', '2026-10'] : ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
    h += salesCharts([me.id], months, t('h.salesMy'));
    /* bonus po kvartalu + poslednje prodaje */
    var pers = EN.periodsFor(me.id).filter(function (p) { return p.status !== 'u_toku'; }).map(function (p) { return p.id; }).slice(-4);
    var hist = ui.chartBars({ labels: pers.map(D.periodLabel).concat([D.periodLabel(cur) + ' · ' + t('h.projected').toLowerCase()]), series: [{ name: t('h.paid'), values: pers.map(function (p) { return EN.result(me.id, p).payout; }).concat([0]), color: 'var(--c1)' }, { name: t('h.projected'), values: pers.map(function () { return 0; }).concat([pr.payout]), color: 'var(--c5)' }], h: 190, stacked: true });
    var its = IH.itemRows ? IH.itemRows(me.id, cur).slice(0, 8) : [];
    var recent = its.length ? ui.table([{ key: 'd', label: t('c.date') }, { key: 'p', label: t('c.product') }, { key: 'a', label: t('c.amount'), num: true }, { key: 's', label: t('c.status') }], its.map(function (r) { return { d: F.date(r.it.date), p: IH.esc(r.it.product ? D.productName(r.it.product) : r.it.code), a: r.it.amount ? F.num(r.it.amount) : '—', s: IH.ui.itemSt(r.st) }; }), { compact: true }) : '<div class="empty">' + t('c.empty') + '</div>';
    h += '<div class="cardgrid">' + ui.card(t('h.bonusHist'), hist) + ui.card(t('h.recent'), recent, { flush: true, actions: ui.btn(t('nav.moje-ostvarenje'), { cls: 'sm', go: 'moje-ostvarenje' }) }) + '</div>';
    /* projekcije */
    var inCalc = pr.targets.filter(function (x) { return x.inCalc; });
    h += IH.sech(t('h.proj'), '', '<span class="mut">' + t('h.projNote') + '</span>') + '<div class="kpis">' +
      ui.kpi(t('h.eK1', { p: D.periodLabel(cur) }), F.num(pr.payout) + '<span class="u">RSD</span>', t('h.eK1s'), { hl: true }) +
      ui.kpi(t('h.eK4'), inCalc.filter(function (x) { return x.pct >= 1; }).length + ' / ' + inCalc.length) +
      ui.kpi(t('h.eK3', { p: D.periodLabel(last) }), F.num(lr.payout) + '<span class="u">RSD</span>', IH.ui.status(ap.status), { go: 'moj-obracun' }) +
      ui.kpi(t('h.eK2'), F.num(pr.limit) + '<span class="u">RSD</span>') + '</div>' +
      ui.card(t('h.breakdown') + ' — ' + D.periodLabel(cur), IH.stmtBody(me.id, cur, { project: true }), { flush: true });
    return h;
  }

  /* ================= POSMATRAČ ================= */
  function viewer() {
    var rows = branchRows();
    var h = ui.header(t('nav.pocetna'), '', ui.btn(t('nav.izvestaji'), { icon: 'chart', go: 'izvestaji' }));
    h += ui.card(t('h.vNet'), ui.table([{ key: 'br', label: t('c.branch') }, { key: 'reg', label: t('c.region') }, { key: 'n', label: t('h.colStaff'), num: true }, { key: 'p1', label: t('h.colAvgT1'), num: true }, { key: 'p2', label: t('h.colAccs'), num: true }, { key: 'p3', label: t('h.colCards'), num: true }, { key: 'on', label: t('h.colOnT'), num: true }, { key: 'paid', label: t('h.colPaid') + ' (RSD)', num: true }], rows.map(function (r) { return { br: IH.esc(D.branchShort(r.b)), reg: IH.L(D.region(r.b.region).name), n: r.n, p1: F.pct(r.p1), p2: F.pct(r.p2), p3: F.pct(r.p3), on: r.on + ' / ' + r.nl, paid: F.num(r.paid) }; }), { compact: true }), { flush: true });
    var cons = ['2026-Q3', '2026-09'].map(function (p) { var ac = IH.stats.approvalCounts(p); return { p: D.periodLabel(p), t: ac.total, s: ac.saglasan, a: ac.auto, c: ac.ceka, pr: ac.prigovor }; });
    h += ui.card(t('h.vCons'), ui.table([{ key: 'p', label: t('c.period') }, { key: 't', label: t('c.total'), num: true }, { key: 's', label: t('st.saglasan'), num: true }, { key: 'a', label: t('st.auto'), num: true }, { key: 'c', label: t('st.ceka'), num: true }, { key: 'pr', label: t('st.prigovor'), num: true }], cons, { compact: true }), { flush: true });
    return h;
  }

  IH.route('pocetna', {
    title: function () { return t('nav.pocetna'); },
    render: function () { var r = IH.state.role; return r === 'admin' ? admin() : r === 'manager' ? manager() : r === 'employee' ? employee() : viewer(); }
  });
})();
