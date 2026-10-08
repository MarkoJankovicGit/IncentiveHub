/* Incentive Hub — rasporedi šema (ko je na kojoj šemi): tabela, modal „Rasporedi“, izmena, kraj važenja; odobravanje (Menadžer) */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  /* novi zaposleni iz noćnog uvoza (OC1) — još nema raspoređenu šemu */
  if (!D.emp('E3001')) {
    var mina = { id: 'E3001', hr: 'HR-53904', name: 'Mina Krstić', pos: 'univerzalni', branch: 'B01', since: '2026-10-20', mgr: D.branchManager('B01').id, isNew: true, phone: '+381 64 509 7731', born: '1999-02-17' };
    D.employees.push(mina); D._empIdx[mina.id] = mina;
  }
  /* bez odobrenog rasporeda zaposleni ne ulazi u obračun ni u timske kvote */
  function held(e) { return e.hold && !(IH.state.data.assignDecisions && Object.keys(IH.state.data.assignDecisions).some(function (k) { var d = IH.state.data.assignDecisions[k]; return d.emp === e.id && d.status === 'odobren'; })); }
  D.emp('E3001').hold = true;
  var _bs = D.branchStaff; D.branchStaff = function (bid, pos) { return _bs(bid, pos).filter(function (e) { return !held(e); }); };
  var _sp = EN.staffForPeriod; EN.staffForPeriod = function (pid) { return _sp(pid).filter(function (e) { return !held(e); }); };
  D.assignments = D.assignments.filter(function (a) { return a.id !== 'RS-P002'; });
  D.assignments.forEach(function (a) { if (a.id === 'RS-P001') { a.change = { kind: 'ukidanje_izuzetka', exc: 'PREMESTAJ', from: '2026-Q3', to: '2026-Q4' }; } });

  IH.addStrings({
    'ra.title': 'Raspoređivanje šema', 'ra.assign': 'Rasporedi', 'ra.assignTitle': 'Raspoređivanje šeme', 'ra.noScheme': '{n} zaposleni bez raspoređene šeme', 'ra.noSchemeS': '{l} — bez šeme se bonus ne obračunava',
    'ra.colEmp': 'Zaposleni', 'ra.colPos': 'Pozicija', 'ra.colBranch': 'Ekspozitura', 'ra.colScheme': 'Šema', 'ra.colFrom': 'Važi od', 'ra.colTo': 'Važi do', 'ra.colExc': 'Izuzeci', 'ra.colAppr': 'Odobrava', 'ra.open': 'bez kraja', 'ra.mgr': 'Menadžer', 'ra.since': 'U organizaciji od', 'ra.cur': 'Trenutna šema',
    'st2.bez_seme': 'Bez šeme', 'st2.vracen': 'Vraćen na doradu', 'st2.zamenjen': 'Zamenjen', 'st2.zavrsen': 'Završen',
    'ra.find': 'Ime zaposlenog', 'ra.pick': 'Izaberite bar jednog zaposlenog', 'ra.posOnly': 'Šema važi za poziciju {p} — prikazani su zaposleni te pozicije',
    'ra.overlapOk': 'Nema postojećeg rasporeda u periodu — jedan zaposleni ima jednu šemu', 'ra.overlap': 'Postojeći raspored {s} važi od {d} — novi ga zamenjuje', 'ra.gOverlap': '{n} postojećih rasporeda biće zamenjeno od {d}',
    'ex.factor': 'Faktor (×)', 'ex.fixed': 'Fiksna vrednost', 'ex.prorata': 'Proracija po danima', 'ra.excNone': 'Bez izuzetaka',
    'ra.comment': 'Napomena za menadžera', 'ra.send': 'Pošalji na odobrenje', 'ra.sent': 'Raspored za {n} poslat na odobrenje — {m}', 'ra.sentG': 'Rasporedi za {n} zaposlenih poslati na odobrenje — {m}',
    'ra.editTitle': 'Izmena rasporeda', 'ra.apply': 'Primena', 'ra.reasonChange': 'Razlog promene',
    'ra.endTitle': 'Kraj važenja rasporeda', 'ra.endDate': 'Važi do', 'ra.endReason': 'Razlog prestanka', 'ra.ended': 'Raspored za {n} važi do {d}',
    'ra.detTitle': 'Raspored', 'ra.resend': 'Pošalji ponovo',
    'ro.title': 'Rasporedi na odobravanju', 'ro.colChange': 'Promena', 'ro.colSent': 'Poslao', 'ro.approve': 'Odobri', 'ro.return': 'Vrati na doradu', 'ro.review': 'Pregled rasporeda', 'ro.approved': 'Raspored za {n} je odobren i aktivan od {d}', 'ro.returned': 'Raspored za {n} vraćen administratoru',
    'ro.before': 'Pre', 'ro.after': 'Posle', 'ro.element': 'Element', 'ro.reason': 'Razlog vraćanja', 'ro.excEnd': 'Ukidanje izuzetka „{r}“ od {p}', 'ro.newAsg': 'Novi raspored od {d}', 'ro.replace': 'Zamena šeme od {d}', 'ro.change': 'Izmena rasporeda od {d}', 'ro.end': 'Kraj važenja {d}'
  }, {
    'ra.title': 'Scheme assignment', 'ra.assign': 'Assign', 'ra.assignTitle': 'Assign scheme', 'ra.noScheme': '{n} employee without a scheme', 'ra.noSchemeS': '{l} — no bonus is calculated without a scheme',
    'ra.colEmp': 'Employee', 'ra.colPos': 'Position', 'ra.colBranch': 'Branch', 'ra.colScheme': 'Scheme', 'ra.colFrom': 'Valid from', 'ra.colTo': 'Valid to', 'ra.colExc': 'Exceptions', 'ra.colAppr': 'Approver', 'ra.open': 'open-ended', 'ra.mgr': 'Manager', 'ra.since': 'In organisation since', 'ra.cur': 'Current scheme',
    'st2.bez_seme': 'No scheme', 'st2.vracen': 'Returned', 'st2.zamenjen': 'Replaced', 'st2.zavrsen': 'Ended',
    'ra.find': 'Employee name', 'ra.pick': 'Choose at least one employee', 'ra.posOnly': 'The scheme applies to position {p} — employees of that position are shown',
    'ra.overlapOk': 'No existing assignment in the period — one scheme per employee', 'ra.overlap': 'Existing assignment {s} valid from {d} — the new one replaces it', 'ra.gOverlap': '{n} existing assignments will be replaced from {d}',
    'ex.factor': 'Factor (×)', 'ex.fixed': 'Fixed value', 'ex.prorata': 'Pro rata by days', 'ra.excNone': 'No exceptions',
    'ra.comment': 'Note for the manager', 'ra.send': 'Submit for approval', 'ra.sent': 'Assignment for {n} submitted for approval — {m}', 'ra.sentG': 'Assignments for {n} employees submitted for approval — {m}',
    'ra.editTitle': 'Edit assignment', 'ra.apply': 'Apply', 'ra.reasonChange': 'Reason for change',
    'ra.endTitle': 'End assignment', 'ra.endDate': 'Valid to', 'ra.endReason': 'End reason', 'ra.ended': 'Assignment for {n} valid until {d}',
    'ra.detTitle': 'Assignment', 'ra.resend': 'Resubmit',
    'ro.title': 'Assignments to approve', 'ro.colChange': 'Change', 'ro.colSent': 'Submitted by', 'ro.approve': 'Approve', 'ro.return': 'Return', 'ro.review': 'Review assignment', 'ro.approved': 'Assignment for {n} approved and active from {d}', 'ro.returned': 'Assignment for {n} returned to the administrator',
    'ro.before': 'Before', 'ro.after': 'After', 'ro.element': 'Element', 'ro.reason': 'Return reason', 'ro.excEnd': 'Exception "{r}" lifted from {p}', 'ro.newAsg': 'New assignment from {d}', 'ro.replace': 'Scheme replacement from {d}', 'ro.change': 'Assignment change from {d}', 'ro.end': 'Ends {d}'
  });

  /* ---------- efektivni rasporedi ---------- */
  function dec() { return IH.map('assignDecisions'); }
  IH.assignments = function () {
    var out = D.assignments.concat(IH.list('newAssignments')).map(function (a) {
      var x = Object.assign({}, a), d = dec()[a.id];
      if (d) { x.status = d.status === 'odobren' ? 'aktivan' : d.status === 'vracen' ? 'vracen' : x.status; x.decision = d; }
      var end = IH.map('assignEnds')[a.id]; if (end) { x.to = end.to; x.endReason = end.reason; }
      return x;
    });
    out.forEach(function (x) { if (x.replaces && x.status === 'aktivan') out.forEach(function (y) { if (y.id === x.replaces && y.status === 'aktivan') { y.status = 'zamenjen'; y.to = x.fromPrev; } }); });
    out.forEach(function (x) { if (x.change && x.change.kind === 'ukidanje_izuzetka' && x.status === 'aktivan') out.forEach(function (y) { if (y.emp === x.emp && y.id !== x.id && y.status === 'aktivan' && !y.replaces) { y.status = 'zamenjen'; y.to = '2026-09-30'; } }); });
    return out;
  };
  IH.stats.pendingAssignments = function () { var me = IH.state.role === 'manager' ? IH.me() : null; return IH.assignments().filter(function (a) { return a.status === 'na_odobravanju' && (!me || D.emp(a.emp).mgr === me.id); }); };
  function approverOf(empId) { var e = D.emp(empId); return D.emp(e.mgr); }
  function excOf(a) { if (a.change || a.isNew) return a.exceptions || []; return D.exceptions.filter(function (x) { return x.emp === a.emp; }).concat(a.exceptions || []); }
  function noScheme() { return D.employees.filter(function (e) { return D.positions[e.pos] && D.positions[e.pos].scheme && !IH.assignments().some(function (a) { return a.emp === e.id && (a.status === 'aktivan' || a.status === 'na_odobravanju'); }); }); }
  IH.noSchemeStaff = noScheme;
  function findA(id) { return IH.assignments().filter(function (a) { return a.id === id; })[0]; }
  function curAsg(id) { return IH.assignments().filter(function (a) { return a.emp === id && a.status === 'aktivan'; })[0]; }
  function reasonName(code, id) { var r = IH.codeItems(code).filter(function (x) { return x.id === id; })[0]; return r ? IH.L(r.name) : id || ''; }
  function reasonOpts(code) { return IH.codeItems(code).map(function (r) { return { v: r.id, l: IH.L(r.name) }; }); }
  function changeText(a) {
    if (a.change && a.change.kind === 'ukidanje_izuzetka') { return t('ro.excEnd', { r: IH.esc(reasonName('RAZLOG_IZUZETKA', a.change.exc)), p: D.periodLabel(a.change.to) }); }
    if (a.replaces) { var pr = findA(a.replaces); return pr && pr.scheme !== a.scheme ? t('ro.replace', { d: F.date(a.from) }) + ': ' + D.scheme(pr.scheme).code + ' → ' + D.scheme(a.scheme).code : t('ro.change', { d: F.date(a.from) }); }
    return t('ro.newAsg', { d: F.date(a.from) });
  }
  function excText(x) {
    var el = x.target === 'BAZA' ? IH.L(L('Osnova', 'Base')) : (x.targets || [x.target]).map(function (k) { var tg = D.target(k) || D.targetByKey('S-M1', k); return tg ? IH.L(tg.name) : k; }).join(', ');
    var val = x.type === 'prorata' ? x.num + '/' + x.den : x.type === 'fixed' ? F.num(x.value) : '×' + F.num(x.factor != null ? x.factor : x.value, 2);
    return el + ' · ' + t('ex.' + (x.type || 'factor')) + ' ' + val + ' · ' + D.periodLabel(x.period) + ' — ' + reasonName('RAZLOG_IZUZETKA', x.reasonCode || 'PREMESTAJ');
  }
  function dateIn(id, def) { var el = document.getElementById(id), m = el && String(el.value).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/); return m ? m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : def; }
  function prevDay(iso) { var d = new Date(Date.parse(iso) - 864e5); return d.toISOString().slice(0, 10); }

  /* ---------- tabela rasporeda (sve šeme ili jedna) ---------- */
  IH.rasGrid = function (opts) {
    opts = opts || {};
    var ns = noScheme().filter(function (e) { return !opts.scheme || D.positions[e.pos].scheme === opts.scheme || (D.scheme(opts.scheme) || {}).pos === e.pos; });
    var gid = opts.scheme ? 'ras-' + opts.scheme : 'ras';
    return IH.grid({
      id: gid, exportName: 'Raspored_sema.xlsx', searchLabel: t('ra.find'), create: { label: t('ra.assign'), act: 'ras-assign', arg: opts.scheme || '' }, hidden: opts.scheme ? ['s', 'pos'] : ['pos'],
      rows: function () {
        return IH.assignments().filter(function (a) { return !opts.scheme || a.scheme === opts.scheme; }).concat(ns.map(function (e) { return { id: 'NS-' + e.id, emp: e.id, scheme: null, from: e.since, status: 'bez_seme' }; }))
          .sort(function (a, b) { var o = { bez_seme: 0, na_odobravanju: 1, vracen: 2, aktivan: 3, zavrsen: 4, zamenjen: 5 }; return (o[a.status] - o[b.status]) || (a.emp < b.emp ? -1 : 1); });
      },
      key: function (a) { return a.id; }, label: function (a) { return D.emp(a.emp).name; }, searchKeys: ['e'],
      rowCls: function (a) { return a.status === 'zamenjen' || a.status === 'zavrsen' ? 'muted' : ''; },
      cols: [
        { key: 'st', label: t('c.status'), val: function (a) { return a.status; }, render: function (a) { return ui.st2(a.status) + (a.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); }, filter: function () { return ['aktivan', 'na_odobravanju', 'vracen', 'zamenjen', 'zavrsen', 'bez_seme'].map(function (k) { return { v: k, l: t('st2.' + k) }; }); } },
        { key: 'e', label: t('ra.colEmp'), val: function (a) { return D.emp(a.emp).name; }, render: function (a) { return '<b>' + IH.esc(D.emp(a.emp).name) + '</b>'; } },
        { key: 'pos', label: t('ra.colPos'), val: function (a) { return D.posName(D.emp(a.emp).pos); }, fval: function (a) { return D.emp(a.emp).pos; }, filter: function () { return ['licni', 'univerzalni', 'menadzer'].map(function (k) { return { v: k, l: D.posName(k) }; }); } },
        { key: 'b', label: t('ra.colBranch'), val: function (a) { return D.branchShort(D.emp(a.emp).branch); }, fval: function (a) { return D.emp(a.emp).branch; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }); } },
        { key: 's', label: t('ra.colScheme'), val: function (a) { return a.scheme ? D.scheme(a.scheme).code : ''; }, fval: function (a) { return a.scheme || '-'; }, render: function (a) { if (!a.scheme) return '<span class="mut">—</span>'; var s = D.scheme(a.scheme); return '<a href="#/seme/' + s.id + '">' + IH.esc(IH.L(s.name)) + '</a>'; }, filter: function () { return D.schemes.map(function (s) { return { v: s.id, l: s.code }; }).concat([{ v: '-', l: t('st2.bez_seme') }]); } },
        { key: 'f', label: t('ra.colFrom'), val: function (a) { return a.from; }, render: function (a) { return F.date(a.from); } },
        { key: 'to', label: t('ra.colTo'), val: function (a) { return a.to || ''; }, render: function (a) { return a.to ? F.date(a.to) : '<span class="mut">' + t('ra.open') + '</span>'; } },
        { key: 'x', label: t('ra.colExc'), num: true, search: false, val: function (a) { return excOf(a).length; } },
        { key: 'ap', label: t('ra.colAppr'), val: function (a) { var m = approverOf(a.emp); return m ? m.name : ''; } }
      ],
      actions: [
        { icon: 'calendar', title: t('ra.assign'), act: 'ras-assign', kind: 'acc', arg: function (a) { return (opts.scheme || D.positions[D.emp(a.emp).pos].scheme) + '|' + a.emp; }, show: function (a) { return a.status === 'bez_seme'; } },
        { icon: 'send', title: t('ra.resend'), act: 'ras-resend', kind: 'acc', show: function (a) { return a.status === 'vracen'; } },
        { type: 'details', title: t('g.aDetails'), act: 'ras-det', show: function (a) { return a.status !== 'bez_seme'; } },
        { type: 'history', title: t('g.aHistory'), act: 'ras-hist', show: function (a) { return a.status !== 'bez_seme'; } },
        { type: 'edit', title: t('g.aEdit'), act: 'ras-edit', kind: 'acc', show: function (a) { return a.status === 'aktivan'; } },
        { type: 'delete', title: t('ra.endTitle'), act: 'ras-end', kind: 'dan', show: function (a) { return a.status === 'aktivan' && !a.to; } }
      ]
    });
  };
  function banner() {
    var ns = noScheme(); if (!ns.length) return '';
    return '<section class="card" style="border-color:var(--warning-line);background:var(--warning-soft)"><div class="cb" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><span class="ai" style="width:36px;height:36px;border-radius:9px;display:grid;place-items:center;background:var(--card);color:var(--warning)">' + ic('alert') + '</span><div style="flex:1;min-width:240px"><b>' + t('ra.noScheme', { n: ns.length }) + '</b><div class="mut">' + t('ra.noSchemeS', { l: ns.map(function (e) { return IH.esc(e.name) + ' · ' + D.posName(e.pos) + ' · ' + IH.esc(D.branchShort(e.branch)) + ' · ' + F.date(e.since); }).join('; ') }) + '</div></div>' + ui.btn(t('ra.assign'), { cls: 'primary', icon: 'calendar', act: 'ras-assign', arg: D.positions[ns[0].pos].scheme + '|' + ns[0].id }) + '</div></section>';
  }
  IH.rasBanner = banner;
  function listPage() { return ui.header(t('ra.title')) + banner() + IH.rasGrid({}); }

  /* ---------- pregled rasporeda (ista forma, samo za čitanje) ---------- */
  function asgFields(a) {
    var e = D.emp(a.emp), s = a.scheme ? D.scheme(a.scheme) : null, m = approverOf(a.emp), ex = excOf(a);
    return [
      { k: 'rv_e', label: t('ra.colEmp'), type: 'static', value: e.name }, { k: 'rv_p', label: t('ra.colPos'), type: 'static', value: D.posName(e.pos) },
      { k: 'rv_b', label: t('ra.colBranch'), type: 'static', value: D.branchName(e.branch) }, { k: 'rv_m', label: t('ra.mgr'), type: 'static', value: m ? m.name : '' },
      { k: 'rv_s', label: t('ra.colScheme'), type: 'static', value: s ? IH.L(s.name) : '' }, { k: 'rv_st', label: t('c.status'), type: 'static', value: t('st2.' + a.status) },
      { k: 'rv_f', label: t('ra.colFrom'), type: 'static', value: F.date(a.from) }, { k: 'rv_t', label: t('ra.colTo'), type: 'static', value: a.to ? F.date(a.to) : t('ra.open') },
      { k: 'rv_x', label: t('ra.colExc'), type: 'static', value: ex.length ? ex.map(excText).join('; ') : t('ra.excNone'), full: true }
    ];
  }
  IH.act['ras-det'] = function (el) { var a = findA(el.dataset.arg); IH.modal({ title: t('ra.detTitle') + ' · ' + IH.esc(D.emp(a.emp).name), wide: true, body: (a.decision && a.decision.status === 'vracen' ? '<div class="note warn"><b>' + t('st2.vracen') + ':</b> ' + IH.esc(reasonName('RAZLOG_VRACANJA', a.decision.reason)) + ' · ' + IH.esc(D.emp(a.decision.by).name) + ', ' + F.dt(a.decision.at) + '</div>' : '') + ui.form(asgFields(a), { readonly: true }), foot: ui.btn(t('c.close'), { act: 'modal-close' }) }); };
  function rasHist(a) {
    var h = IH.auditFor('assignment', a.id);
    if (a.approvedAt) h.push({ at: a.approvedAt, by: a.approvedBy, action: { sr: 'Raspored odobren', en: 'Assignment approved' } });
    if (a.submittedAt) h.push({ at: a.submittedAt, by: a.submittedBy || 'A001', action: { sr: 'Poslato na odobrenje', en: 'Submitted for approval' } });
    return h;
  }
  IH.act['ras-hist'] = function (el) { var a = findA(el.dataset.arg); IH.showHistory(D.emp(a.emp).name, rasHist(a)); };
  IH.act['ras-resend'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp), base = D.assignments.concat(IH.list('newAssignments')).filter(function (x) { return x.id === a.id; })[0];
    delete dec()[a.id]; base.submittedAt = IH.now(); base.submittedBy = IH.me().id; base.status = 'na_odobravanju';
    IH.audit('assignment', a.id, { sr: 'Ponovo poslato na odobrenje', en: 'Resubmitted for approval' }, { sr: 'Posle dorade', en: 'After rework' });
    IH.save(); IH.render(); IH.toast(t('ra.sent', { n: IH.esc(e.name), m: IH.esc(approverOf(a.emp).name) }));
  };
  IH.act['ras-edit'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp); IH.form = {};
    var opts = IH.schemes().filter(function (s) { return s.pos === e.pos && s.status !== 'arhiviran'; }).map(function (s) { return { v: s.id, l: IH.L(s.name) }; });
    var alt = opts.filter(function (o) { return o.v !== a.scheme; })[0];
    IH.modal({ title: t('ra.editTitle') + ' · ' + IH.esc(e.name), body: ui.form([
      { k: 're_e', label: t('ra.colEmp'), type: 'static', value: e.name }, { k: 're_cur', label: t('ra.cur'), type: 'static', value: IH.L(D.scheme(a.scheme).name) + ' · ' + F.date(a.from) },
      { k: 're_s', label: t('ra.colScheme'), type: 'select', value: alt ? alt.v : a.scheme, options: opts }, { k: 're_from', label: t('ra.colFrom'), value: alt ? '01.01.2027.' : '01.11.2026.' },
      { k: 're_r', label: t('ra.reasonChange'), type: 'select', value: 'PROMENA_POZICIJE', options: reasonOpts('RAZLOG_IZUZETKA') }, { k: 're_apply', label: t('ra.apply'), type: 'select', value: 'next', options: [{ v: 'now', l: t('c.now') }, { v: 'next', l: t('c.nextPeriod') }] }
    ]), foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('ra.send'), { cls: 'primary', icon: 'send', act: 'ras-edit-save', arg: a.id }) });
  };
  IH.act['ras-edit-save'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp), s = IH.form.re_s || (document.getElementById('fld-re_s') || {}).value || a.scheme;
    var from = dateIn('fld-re_from', s !== a.scheme ? '2027-01-01' : '2026-11-01');
    var rec = { id: 'RS-N' + (IH.list('newAssignments').length + 1), emp: a.emp, scheme: s, from: from, to: null, status: 'na_odobravanju', submittedBy: IH.me().id, submittedAt: IH.now(), replaces: a.id, fromPrev: prevDay(from), isNew: true };
    IH.list('newAssignments').push(rec);
    IH.audit('assignment', rec.id, { sr: 'Zahtev za zamenu rasporeda', en: 'Assignment replacement request' }, { sr: e.name + ' · ' + D.scheme(a.scheme).code + ' → ' + D.scheme(s).code + ' od ' + F.date(from), en: e.name + ' · ' + D.scheme(a.scheme).code + ' → ' + D.scheme(s).code + ' from ' + F.date(from) });
    IH.closeModal(); IH.render(); IH.toast(t('ra.sent', { n: IH.esc(e.name), m: IH.esc(approverOf(a.emp).name) }));
  };
  IH.act['ras-end'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp); IH.form = {};
    IH.modal({ title: t('ra.endTitle') + ' · ' + IH.esc(e.name), body: ui.form([{ k: 'rx_e', label: t('ra.colEmp'), type: 'static', value: e.name }, { k: 'rx_s', label: t('ra.colScheme'), type: 'static', value: IH.L(D.scheme(a.scheme).name) }, { k: 'rx_to', label: t('ra.endDate'), value: '31.10.2026.' }, { k: 'rx_r', label: t('ra.endReason'), type: 'select', value: 'ODLAZAK', options: reasonOpts('RAZLOG_PRESTANKA') }]),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.confirm'), { cls: 'danger', icon: 'check', act: 'ras-end-ok', arg: a.id }) });
  };
  IH.act['ras-end-ok'] = function (el) {
    var a = findA(el.dataset.arg), to = dateIn('fld-rx_to', '2026-10-31'), r = IH.form.rx_r || 'ODLAZAK';
    IH.map('assignEnds')[a.id] = { to: to, reason: r };
    IH.audit('assignment', a.id, { sr: 'Kraj važenja ' + F.date(to), en: 'Ends ' + F.date(to) }, { sr: 'Razlog: ' + reasonName('RAZLOG_PRESTANKA', r), en: 'Reason: ' + reasonName('RAZLOG_PRESTANKA', r) });
    IH.closeModal(); IH.render(); IH.toast(t('ra.ended', { n: IH.esc(D.emp(a.emp).name), d: F.date(to) }));
  };

  /* ---------- modal „Rasporedi“: tabela zaposlenih pozicije + datum ---------- */
  function RA() { return IH.form.ra; }
  IH.act['ras-assign'] = function (el) {
    var p = (el.dataset.arg || '').split('|'), sid = p[0] || 'S-M1', pre = p[1] || null, s = D.scheme(sid);
    var ns = noScheme().filter(function (e) { return e.pos === s.pos; });
    IH.form = { ra: { scheme: sid, sel: pre ? [pre] : ns.map(function (e) { return e.id; }), from: null } };
    openAssign();
  };
  function openAssign() {
    var r = RA(), s = D.scheme(r.scheme);
    var grid = IH.grid({
      id: 'ras-pick', exportName: 'Zaposleni.xlsx', searchLabel: t('ra.find'), actions: [],
      rows: function () { return D.employees.filter(function (e) { return e.branch && e.pos === s.pos; }).sort(function (a, b) { return (curAsg(b.id) ? 0 : 1) - (curAsg(a.id) ? 0 : 1); }); },
      key: function (e) { return e.id; }, label: function (e) { return e.name; }, searchKeys: ['e'],
      select: { get: function () { return RA().sel; }, set: function (l) { RA().sel = l; }, onChange: function () { IH.swap('ras-note', noteHtml()); } },
      cols: [
        { key: 'st', label: t('ra.cur'), val: function (e) { var a = curAsg(e.id); return a ? D.scheme(a.scheme).code : t('st2.bez_seme'); }, render: function (e) { var a = curAsg(e.id); return a ? IH.esc(D.scheme(a.scheme).code) : ui.st2('bez_seme'); } },
        { key: 'e', label: t('ra.colEmp'), val: function (e) { return e.name; }, render: function (e) { return '<b>' + IH.esc(e.name) + '</b>' + (e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } },
        { key: 'b', label: t('ra.colBranch'), val: function (e) { return D.branchShort(e.branch); }, fval: function (e) { return e.branch; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }); } },
        { key: 'm', label: t('ra.mgr'), val: function (e) { var m = approverOf(e.id); return m ? m.name : ''; } },
        { key: 'f', label: t('ra.since'), val: function (e) { return e.since; }, render: function (e) { return F.date(e.since); } }
      ]
    });
    var sug = r.sel.length === 1 && D.emp(r.sel[0]).since > '2026-10-01' ? F.date(D.emp(r.sel[0]).since) : '01.11.2026.';
    IH.modal({
      title: t('ra.assignTitle') + ' · ' + IH.esc(IH.L(s.name)), wide: true,
      body: '<div class="note">' + t('ra.posOnly', { p: D.posName(s.pos) }) + '</div>' + grid + '<div class="form-grid" style="margin-top:14px">' + ui.field('ra_from', t('ra.colFrom'), sug, { req: true }) + ui.field('ra_note', t('ra.comment'), IH.L(L('Prelazak na šemu od početka perioda.', 'Move to the scheme from the start of the period.'))) + '</div><div id="ras-note">' + noteHtml() + '</div>',
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('ra.send'), { cls: 'primary', icon: 'send', act: 'ras-send' })
    });
  }
  function noteHtml() {
    var r = RA(), n = r.sel.filter(function (id) { return curAsg(id); }).length;
    return n ? '<div class="note warn" style="margin:0">' + t('ra.gOverlap', { n: n, d: '—' }) + '</div>' : '<div class="note" style="margin:0">' + t('ra.overlapOk') + '</div>';
  }
  IH.act['ras-send'] = function () {
    var r = RA(), s = D.scheme(r.scheme); if (!r.sel.length) { IH.toast(t('ra.pick')); return; }
    var from = dateIn('fld-ra_from', '2026-11-01'), n0 = IH.list('newAssignments').length, mgrs = {};
    r.sel.forEach(function (id, i) {
      var e = D.emp(id), ex = curAsg(id);
      var rec = { id: 'RS-N' + (n0 + i + 1), emp: id, scheme: s.id, from: e.since > from ? e.since : from, to: null, status: 'na_odobravanju', submittedBy: IH.me().id, submittedAt: IH.now(), exceptions: [], replaces: ex ? ex.id : null, fromPrev: ex ? prevDay(from) : null, isNew: true };
      IH.list('newAssignments').push(rec);
      var m = approverOf(id); if (m) mgrs[m.id] = m.name;
      if (id === 'E3001') IH.map('orgDone').OC1 = true;
      IH.audit('assignment', rec.id, { sr: 'Raspored poslat na odobrenje', en: 'Assignment submitted for approval' }, { sr: e.name + ' · ' + s.code + ' od ' + F.date(rec.from), en: e.name + ' · ' + s.code + ' from ' + F.date(rec.from) });
    });
    var ms = Object.keys(mgrs).map(function (k) { return mgrs[k]; }).join(', ');
    IH.form = {}; IH.closeModal(); IH.render();
    IH.toast(r.sel.length === 1 ? t('ra.sent', { n: IH.esc(D.emp(r.sel[0]).name), m: IH.esc(ms) }) : t('ra.sentG', { n: r.sel.length, m: IH.esc(ms) }));
  };

  IH.route('rasporedi', { title: function () { return t('ra.title'); }, nav: 'seme', render: function () { return listPage(); } });

  /* ================= MENADŽER: odobravanje ================= */
  function mgrRows() {
    var me = IH.me();
    return IH.assignments().filter(function (a) { var e = D.emp(a.emp); return e && e.mgr === me.id && (a.status === 'na_odobravanju' || (a.decision && a.decision.by === me.id) || a.status === 'vracen'); });
  }
  function compare(a) {
    var e = D.emp(a.emp), rows = [];
    if (a.change && a.change.kind === 'ukidanje_izuzetka') {
      var exc = D.exceptions.filter(function (x) { return x.emp === e.id; })[0];
      rows.push({ el: t('ra.colExc'), b: IH.esc(exc ? excText(Object.assign({ type: 'factor', targets: exc.targets, value: exc.factor, period: exc.period, reasonCode: 'PREMESTAJ' })) : '—'), a: '<span class="mut">' + t('ra.excNone') + '</span>' });
      D.TKEYS.forEach(function (k) { var x = D.targetByKey('S-M1', k); rows.push({ el: IH.esc(IH.L(x.name)), b: F.unit(D.targetFor(e.id, '2026-Q3', k), x.unit) + ' <span class="mut">(Q3)</span>', a: '<b>' + F.unit(D.targetFor(e.id, '2026-Q4', k), x.unit) + '</b> <span class="mut">(Q4)</span>' }); });
    } else {
      var prev = a.replaces ? findA(a.replaces) : null;
      rows.push({ el: t('ra.colScheme'), b: prev ? IH.esc(IH.L(D.scheme(prev.scheme).name)) : '—', a: '<b>' + IH.esc(IH.L(D.scheme(a.scheme).name)) + '</b>' });
      rows.push({ el: t('ra.colFrom'), b: prev ? F.date(prev.from) : '—', a: '<b>' + F.date(a.from) + '</b>' });
      rows.push({ el: t('ra.colExc'), b: '—', a: (a.exceptions || []).map(excText).map(IH.esc).join('; ') || '—' });
    }
    return ui.table([{ key: 'el', label: t('ro.element') }, { key: 'b', label: t('ro.before') }, { key: 'a', label: t('ro.after') }], rows, { compact: true });
  }
  function mgrPage() {
    var grid = IH.grid({
      id: 'ro', exportName: 'Rasporedi_na_odobravanju.xlsx', searchLabel: t('ra.find'),
      rows: mgrRows, key: function (a) { return a.id; }, label: function (a) { return D.emp(a.emp).name; }, searchKeys: ['e'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (a) { return a.status; }, render: function (a) { return ui.st2(a.status); }, filter: function () { return ['na_odobravanju', 'aktivan', 'vracen'].map(function (k) { return { v: k, l: t('st2.' + k) }; }); } },
        { key: 'e', label: t('ra.colEmp'), val: function (a) { return D.emp(a.emp).name; }, render: function (a) { return '<b>' + IH.esc(D.emp(a.emp).name) + '</b>'; } },
        { key: 'p', label: t('ra.colPos'), val: function (a) { return D.posName(D.emp(a.emp).pos); } },
        { key: 's', label: t('ra.colScheme'), val: function (a) { return IH.L(D.scheme(a.scheme).name); } },
        { key: 'c', label: t('ro.colChange'), nw: false, val: function (a) { return changeText(a); } },
        { key: 'v', label: t('ra.colFrom'), val: function (a) { return a.from; }, render: function (a) { return F.date(a.from); } },
        { key: 'sb', label: t('ro.colSent'), val: function (a) { return D.emp(a.submittedBy || 'A001').name; } },
        { key: 'sa', label: t('c.date'), val: function (a) { return a.submittedAt || ''; }, render: function (a) { return F.date(a.submittedAt || IH.now()); } }
      ],
      actions: [
        { type: 'details', title: t('ro.review'), act: 'ro-review' },
        { icon: 'check', title: t('ro.approve'), act: 'ro-ok', kind: 'acc', show: function (a) { return a.status === 'na_odobravanju'; } },
        { icon: 'x', title: t('ro.return'), act: 'ro-ret', kind: 'dan', show: function (a) { return a.status === 'na_odobravanju'; } },
        { type: 'history', title: t('g.aHistory'), act: 'ras-hist' }
      ]
    });
    return ui.header(t('ro.title')) + grid;
  }
  IH.act['ro-review'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp);
    IH.modal({ title: t('ro.review') + ' · ' + IH.esc(e.name), wide: true, body: '<p class="mut" style="margin-top:0">' + changeText(a) + ' · ' + IH.esc(D.emp(a.submittedBy || 'A001').name) + ', ' + F.dt(a.submittedAt || IH.now()) + '</p>' + compare(a),
      foot: a.status === 'na_odobravanju' ? ui.btn(t('ro.return'), { cls: 'danger', icon: 'x', act: 'ro-ret', arg: a.id }) + ui.btn(t('ro.approve'), { cls: 'primary', icon: 'check', act: 'ro-ok', arg: a.id }) : ui.btn(t('c.close'), { act: 'modal-close' }) });
  };
  IH.act['ro-ok'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp), me = IH.me();
    dec()[a.id] = { status: 'odobren', by: me.id, at: IH.now(), emp: a.emp };
    EN.invalidate(); D.resetRuntime();
    var base = D.assignments.concat(IH.list('newAssignments')).filter(function (x) { return x.id === a.id; })[0]; base.approvedBy = me.id; base.approvedAt = IH.now();
    IH.audit('assignment', a.id, { sr: 'Raspored odobren', en: 'Assignment approved' }, { sr: e.name + ' · aktivan od ' + F.date(a.from), en: e.name + ' · active from ' + F.date(a.from) });
    IH.state.data.extraNotif = IH.state.data.extraNotif || {};
    (IH.state.data.extraNotif.admin = IH.state.data.extraNotif.admin || []).push({ id: 'N-RA' + Date.now(), at: IH.now(), icon: 'checkc', text: { sr: me.name + ' je odobrio raspored za ' + e.name, en: me.name + ' approved the assignment for ' + e.name }, go: 'seme/' + a.scheme + '/zaposleni' });
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('ro.approved', { n: IH.esc(e.name), d: F.date(a.from) }));
  };
  IH.act['ro-ret'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp); IH.form = {};
    IH.modal({ title: t('ro.return') + ' · ' + IH.esc(e.name), body: ui.form([{ k: 'ro_r', label: t('ro.reason'), type: 'select', value: 'POGRESNA_VREDNOST', options: reasonOpts('RAZLOG_VRACANJA'), full: true }, { k: 'ro_n', label: t('ra.comment'), type: 'textarea', value: '', sug: IH.L(L('Molim proveru datuma početka važenja.', 'Please check the start date.')), full: true }]),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('ro.return'), { cls: 'danger', icon: 'x', act: 'ro-ret-ok', arg: a.id }) });
  };
  IH.act['ro-ret-ok'] = function (el) {
    var a = findA(el.dataset.arg), e = D.emp(a.emp), me = IH.me(), r = IH.form.ro_r || 'POGRESNA_VREDNOST';
    dec()[a.id] = { status: 'vracen', by: me.id, at: IH.now(), reason: r };
    IH.audit('assignment', a.id, { sr: 'Vraćeno na doradu', en: 'Returned' }, { sr: 'Razlog: ' + reasonName('RAZLOG_VRACANJA', r), en: 'Reason: ' + reasonName('RAZLOG_VRACANJA', r) });
    IH.state.data.extraNotif = IH.state.data.extraNotif || {};
    (IH.state.data.extraNotif.admin = IH.state.data.extraNotif.admin || []).push({ id: 'N-RV' + Date.now(), at: IH.now(), icon: 'alert', text: { sr: me.name + ' je vratio raspored za ' + e.name + ' na doradu', en: me.name + ' returned the assignment for ' + e.name }, go: 'seme/' + a.scheme + '/zaposleni' });
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('ro.returned', { n: IH.esc(e.name) }));
  };
  IH.route('rasporedi-odobravanje', { title: function () { return t('ro.title'); }, render: mgrPage });
})();
