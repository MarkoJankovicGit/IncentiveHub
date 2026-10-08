/* Incentive Hub — Saglasnosti (Administrator) i Isplata: batch za sistem zarada, izvoz, potvrda prijema, zaključavanje perioda */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'sg.title': 'Saglasnosti', 'sg.desc': 'Statusi obračunskih listova po periodu. Zaposleni daje saglasnost ili prigovor (prigovor rešava menadžer); po isteku roka obračun dobija automatsku saglasnost. Obračune sa saglasnošću odobravate za isplatu.',
    'sg.deadline': 'Rok za saglasnost {d}', 'sg.left': 'još {x} dana', 'sg.passed': 'rok istekao', 'sg.remind': 'Pošalji podsetnik ({n})', 'sg.auto': 'Primeni automatsku saglasnost ({n})', 'sg.autoOff': 'Dostupno po isteku roka {d}', 'sg.approve': 'Odobri za isplatu ({n})',
    'sg.reminded': 'Podsetnik poslat za {n} obračuna', 'sg.autoDone': '{n} obračuna dobilo je automatsku saglasnost', 'sg.apprT': 'Odobravanje za isplatu — {p}', 'sg.apprTxt': '{n} obračuna sa saglasnošću (ukupno {a}) biće odobreno i spremno za batch isplate. Obračuni sa prigovorom ili bez odgovora ne ulaze.', 'sg.apprDone': '{n} obračuna odobreno za isplatu',
    'sg.byBr': 'Po ekspozituri', 'sg.colEmp': 'Zaposleni', 'sg.colBr': 'Ekspozitura', 'sg.colPay': 'Iznos', 'sg.colSt': 'Status', 'sg.colAt': 'Odgovor', 'sg.colMgr': 'Menadžer', 'sg.pctOk': 'Saglasnih',
    'ip.title': 'Isplata', 'ip.desc': 'Odobreni iznosi idu u sistem zarada banke kao batch: svaka linija ima šifru vrste primanja i mesto troška. Posle potvrde prijema period se trajno zaključava. Negativan iznos se nikad ne šalje — prenosi se u sledeći obračun.',
    'ip.colPer': 'Period', 'ip.colReady': 'Spremno', 'ip.colAmt': 'Iznos (RSD)', 'ip.colBatch': 'Batch', 'ip.colPaid': 'Isplaćeno', 'ip.colPend': 'Ne ulazi još',
    'ips.spremno': 'Spremno za batch', 'ips.delimicno': 'Delimično spremno', 'ips.ceka': 'Čeka saglasnosti', 'ips.batch': 'Batch u toku', 'ips.isplaceno': 'Isplaćeno', 'ips.u_toku': 'Period u toku',
    'bs.kreiran': 'Kreiran', 'bs.izvezen': 'Izvezen u sistem zarada', 'bs.potvrdjen': 'Potvrđen prijem',
    'ip.fAppr': 'Odobreno', 'ip.fBatch': 'Batch', 'ip.fExp': 'Izvoz', 'ip.fConf': 'Potvrda prijema', 'ip.fLock': 'Zaključan period',
    'ip.create': 'Kreiraj batch ({n})', 'ip.apprCreate': 'Odobri i kreiraj batch ({n})', 'ip.apprInfo': '{n} obračuna ima saglasnost zaposlenog — kreiranjem batch-a odobravaju se za isplatu u istom koraku.', 'ip.export': 'Izvezi fajl za sistem zarada', 'ip.confirm': 'Potvrdi prijem', 'ip.approveFirst': '{n} obračuna ima saglasnost, ali nije odobreno', 'ip.goAppr': 'Odobri u Saglasnostima',
    'ip.lines': 'Linije za isplatu', 'ip.colWage': 'Vrsta primanja', 'ip.colCc': 'Mesto troška', 'ip.excl': 'Ne ulazi u batch', 'ip.exclWhy': 'Razlog', 'ip.zero': '0 RSD — ne šalje se', 'ip.carry': 'negativan saldo {a} prenet u sledeći obračun',
    'ip.created': 'Batch {b} kreiran: {n} linija, {a}', 'ip.exported': 'Fajl {f} izvezen', 'ip.confT': 'Potvrda prijema — {b}', 'ip.confNo': 'Broj potvrde iz sistema zarada', 'ip.confDate': 'Datum isplate', 'ip.confTxt': 'Posle potvrde obračuni dobijaju status Isplaćeno, a period se trajno zaključava: korekcije idu samo kroz tekući period.', 'ip.confDone': 'Batch {b} potvrđen — {p} je isplaćen i zaključan',
    'ip.batches': 'Batch-evi', 'ip.file': 'Fajl', 'ip.confirmNo': 'Potvrda', 'ip.total': 'Ukupno'
  }, {
    'sg.title': 'Consents', 'sg.desc': 'Statement statuses per period. The employee consents or files a complaint (the manager decides); after the deadline the statement is auto-consented. You approve consented statements for payout.',
    'sg.deadline': 'Consent deadline {d}', 'sg.left': '{x} days left', 'sg.passed': 'deadline passed', 'sg.remind': 'Send reminder ({n})', 'sg.auto': 'Apply auto-consent ({n})', 'sg.autoOff': 'Available after the deadline {d}', 'sg.approve': 'Approve for payout ({n})',
    'sg.reminded': 'Reminder sent for {n} statements', 'sg.autoDone': '{n} statements auto-consented', 'sg.apprT': 'Approve for payout — {p}', 'sg.apprTxt': '{n} consented statements (total {a}) will be approved and ready for the payout batch. Statements with a complaint or no reply are not included.', 'sg.apprDone': '{n} statements approved for payout',
    'sg.byBr': 'By branch', 'sg.colEmp': 'Employee', 'sg.colBr': 'Branch', 'sg.colPay': 'Amount', 'sg.colSt': 'Status', 'sg.colAt': 'Reply', 'sg.colMgr': 'Manager', 'sg.pctOk': 'Consented',
    'ip.title': 'Payout', 'ip.desc': 'Approved amounts go to the bank payroll as a batch: each line has an earnings type code and a cost centre. After receipt is confirmed the period is permanently locked. A negative amount is never sent — it carries over to the next statement.',
    'ip.colPer': 'Period', 'ip.colReady': 'Ready', 'ip.colAmt': 'Amount (RSD)', 'ip.colBatch': 'Batch', 'ip.colPaid': 'Paid', 'ip.colPend': 'Not yet included',
    'ips.spremno': 'Ready for batch', 'ips.delimicno': 'Partly ready', 'ips.ceka': 'Awaiting consents', 'ips.batch': 'Batch in progress', 'ips.isplaceno': 'Paid', 'ips.u_toku': 'Period in progress',
    'bs.kreiran': 'Created', 'bs.izvezen': 'Exported to payroll', 'bs.potvrdjen': 'Receipt confirmed',
    'ip.fAppr': 'Approved', 'ip.fBatch': 'Batch', 'ip.fExp': 'Export', 'ip.fConf': 'Receipt', 'ip.fLock': 'Period locked',
    'ip.create': 'Create batch ({n})', 'ip.apprCreate': 'Approve and create batch ({n})', 'ip.apprInfo': '{n} statements have employee consent — creating the batch approves them for payout in the same step.', 'ip.export': 'Export payroll file', 'ip.confirm': 'Confirm receipt', 'ip.approveFirst': '{n} statements are consented but not approved', 'ip.goAppr': 'Approve in Consents',
    'ip.lines': 'Payout lines', 'ip.colWage': 'Earnings type', 'ip.colCc': 'Cost centre', 'ip.excl': 'Not in the batch', 'ip.exclWhy': 'Reason', 'ip.zero': 'RSD 0 — not sent', 'ip.carry': 'negative balance {a} carried to the next statement',
    'ip.created': 'Batch {b} created: {n} lines, {a}', 'ip.exported': 'File {f} exported', 'ip.confT': 'Confirm receipt — {b}', 'ip.confNo': 'Payroll confirmation number', 'ip.confDate': 'Payment date', 'ip.confTxt': 'After confirmation statements become Paid and the period is permanently locked: corrections go only through the current period.', 'ip.confDone': 'Batch {b} confirmed — {p} is paid and locked',
    'ip.batches': 'Batches', 'ip.file': 'File', 'ip.confirmNo': 'Confirmation', 'ip.total': 'Total'
  });

  /* ---------- trajne promene statusa perioda ---------- */
  function applyPeriodSt() { var m = IH.map('periodSt'); Object.keys(m).forEach(function (pid) { var p = D.period(pid); if (p) Object.assign(p, m[pid]); }); }
  applyPeriodSt();

  var CONS = ['saglasan', 'auto', 'odobreno'];
  function staff(pid) { return EN.staffForPeriod(pid); }
  function pay(e, pid) { var r = EN.result(e.id, pid); return r ? r.payout : 0; }
  function daysLeft(iso) { return Math.round((Date.parse(iso) - Date.parse(D.TODAY)) / 864e5); }

  /* ================= SAGLASNOSTI ================= */
  function sgPage() {
    var v = IH.v('sg'), pid = v.per === '2026-09' ? '2026-09' : '2026-Q3', p = D.period(pid);
    IH.refreshers.sg = function () { IH.render(); };
    var st = staff(pid), cnt = {}; st.forEach(function (e) { var s = EN.approval(e.id, pid).status; cnt[s] = (cnt[s] || 0) + 1; });
    var open = st.filter(function (e) { var s = EN.approval(e.id, pid).status; return s === 'ceka' || s === 'korigovano'; });
    var appr = st.filter(function (e) { var s = EN.approval(e.id, pid).status; return s === 'saglasan' || s === 'auto'; });
    var dl = p.deadline ? daysLeft(p.deadline) : 0, passed = p.deadline && dl < 0;
    var paid = p.status === 'isplaceno';
    var acts = paid ? '' : '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">' + (open.length ? ui.btn(t('sg.remind', { n: open.length }), { cls: 'sm', icon: 'bell', act: 'sg-rem', arg: pid }) : '') +
      (passed && open.length ? ui.btn(t('sg.auto', { n: open.length }), { cls: 'sm', icon: 'clock', act: 'sg-auto', arg: pid }) : !passed ? '<span class="btn sm" style="opacity:.55;cursor:default" title="' + t('sg.autoOff', { d: F.date(p.deadline) }) + '">' + ic('clock') + t('sg.auto', { n: open.length }) + '</span>' : '') +
      (appr.length ? ui.btn(t('sg.approve', { n: appr.length }), { cls: 'sm primary', icon: 'checkc', act: 'sg-appr', arg: pid }) : '') + '</div>';
    var tot = st.length || 1, ok = (cnt.saglasan || 0) + (cnt.auto || 0) + (cnt.odobreno || 0) + (cnt.isplaceno || 0);
    var bar = '<div class="stackbar" style="height:12px;margin:10px 0 4px">' + [['saglasan', 'var(--success)'], ['auto', 'var(--info)'], ['odobreno', 'var(--c3)'], ['korigovano', 'var(--accent)'], ['ceka', 'var(--warning)'], ['prigovor', 'var(--danger)']].map(function (x) { return '<i style="width:' + ((cnt[x[0]] || 0) / tot * 100) + '%;background:' + x[1] + '" title="' + t('st.' + x[0]) + '"></i>'; }).join('') + '</div>';
    var head = ui.card('', '<div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap"><div style="flex:1;min-width:300px"><b style="font-size:15px">' + (paid ? t('st.isplaceno') + ' · ' + F.date(p.paidAt) : t('sg.deadline', { d: F.date(p.deadline) }) + ' · ' + (passed ? t('sg.passed') : t('sg.left', { x: dl }))) + '</b>' + bar + '<div class="mut">' + t('sg.pctOk') + ': <b>' + F.pct(ok / tot) + '</b> (' + ok + ' / ' + st.length + ')</div>' + acts + '</div>' +
      '<div class="kpis" style="flex:2;min-width:420px;margin:0">' + ['ceka', 'korigovano', 'prigovor', 'saglasan', 'auto', 'odobreno'].map(function (k) { return ui.kpi(t('st.' + k), cnt[k] || 0); }).join('') + '</div></div>');
    var byBr = D.branches.map(function (b) {
      var es = st.filter(function (e) { return e.branch === b.id; }), c2 = {}; es.forEach(function (e) { var s = EN.approval(e.id, pid).status; c2[s] = (c2[s] || 0) + 1; });
      var ok2 = (c2.saglasan || 0) + (c2.auto || 0) + (c2.odobreno || 0) + (c2.isplaceno || 0);
      return { b: '<b>' + IH.esc(D.branchShort(b)) + '</b>', m: IH.esc(D.branchManager(b.id).name), n: es.length, ok: ui.pcell(es.length ? ok2 / es.length : 0, { cls: 'neutral', max: 1, marker: null }), w: (c2.ceka || 0) + (c2.korigovano || 0), c: c2.prigovor ? ui.pill(c2.prigovor, 'danger') : '<span class="mut">0</span>' };
    });
    var grid = IH.grid({
      id: 'sg-' + pid, exportName: 'Saglasnosti_' + pid + '.xlsx', searchLabel: IH.L({ sr: 'Ime ili HR broj', en: 'Name or HR number' }), hidden: ['mgr'],
      rows: function () { return staff(pid); }, key: function (e) { return e.id; }, label: function (e) { return e.name; }, searchKeys: ['e'],
      cols: [
        { key: 'st', label: t('sg.colSt'), val: function (e) { return t('st.' + EN.approval(e.id, pid).status); }, fval: function (e) { return EN.approval(e.id, pid).status; }, render: function (e) { return IH.ui.status(EN.approval(e.id, pid).status); }, filter: function () { return ['ceka', 'korigovano', 'prigovor', 'saglasan', 'auto', 'odobreno', 'isplaceno'].map(function (k) { return { v: k, l: t('st.' + k) }; }); } },
        { key: 'e', label: t('sg.colEmp'), val: function (e) { return e.name + ' ' + e.hr; }, render: function (e) { return '<b>' + IH.esc(e.name) + '</b>'; } },
        { key: 'pos', label: t('c.position'), val: function (e) { return D.posName(e.pos); } },
        { key: 'b', label: t('sg.colBr'), val: function (e) { return D.branchShort(e.branch); }, fval: function (e) { return e.branch; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }); } },
        { key: 'mgr', label: t('sg.colMgr'), val: function (e) { return (D.emp(e.mgr) || {}).name || ''; } },
        { key: 'pay', label: t('sg.colPay'), num: true, search: false, val: function (e) { return pay(e, pid); }, render: function (e) { var a = EN.approval(e.id, pid); return F.num(pay(e, pid)) + (a.prev != null ? ' <span class="mut">(' + IH.L({ sr: 'bilo ', en: 'was ' }) + F.num(a.prev) + ')</span>' : ''); } },
        { key: 'at', label: t('sg.colAt'), search: false, val: function (e) { return EN.approval(e.id, pid).at || ''; }, render: function (e) { var a = EN.approval(e.id, pid); return a.at ? F.dt(a.at) : '<span class="mut">—</span>'; } },
        { key: 'cp', label: t('st.prigovor'), search: false, val: function (e) { var c = IH.complaintFor(e.id, pid); return c ? c.id : ''; }, render: function (e) { var c = IH.complaintFor(e.id, pid); return c ? c.id + ' <span class="mut">· ' + t('pst2.' + c.status) + '</span>' : '<span class="mut">—</span>'; } }
      ],
      actions: [
        { icon: 'calc', title: t('pt.stmt'), act: 'g-go', arg: function (e) { return 'obracun/' + pid + '/' + e.id; } },
        { icon: 'bell', title: t('sgt.remind'), act: 'sg-rem1', kind: 'acc', arg: function (e) { return e.id + '|' + pid; }, show: function (e) { var s = EN.approval(e.id, pid).status; return s === 'ceka' || s === 'korigovano'; } },
        { type: 'history', title: t('g.aHistory'), act: 'sg-hist', arg: function (e) { return e.id + '|' + pid; } }
      ]
    });
    return ui.header(t('sg.title'), '', ui.segf('sg', 'per', [{ v: '2026-Q3', l: 'Q3 2026' }, { v: '2026-09', l: D.periodLabel('2026-09') }])) + head +
      ui.card(t('sg.byBr'), ui.table([{ key: 'b', label: t('c.branch') }, { key: 'm', label: t('sg.colMgr') }, { key: 'n', label: IH.L({ sr: 'Obračuna', en: 'Statements' }), num: true }, { key: 'ok', label: t('sg.pctOk'), w: '180px' }, { key: 'w', label: t('st.ceka'), num: true }, { key: 'c', label: t('st.prigovor'), num: true }], byBr, { compact: true }), { flush: true }) + grid;
  }
  function remind(e, pid) {
    IH.audit('consent', e.id + '|' + pid, { sr: 'Podsetnik za saglasnost', en: 'Consent reminder' }, { sr: 'Poslao administrator', en: 'Sent by the administrator' });
    if (e.id === D.personas.employee.emp) IH.notify('employee', { sr: 'Podsetnik: saglasnost na obračun ' + D.periodLabel(pid) + ' do ' + F.date(D.period(pid).deadline), en: 'Reminder: consent to the ' + D.periodLabel(pid) + ' statement by ' + F.date(D.period(pid).deadline) }, 'moj-obracun', 'clock');
  }
  IH.act['sg-rem1'] = function (el) { var p = el.dataset.arg.split('|'); remind(D.emp(p[0]), p[1]); IH.save(); IH.toast(t('sgt.reminded', { n: IH.esc(D.emp(p[0]).name) })); };
  IH.act['sg-rem'] = function (el) { var pid = el.dataset.arg, l = staff(pid).filter(function (e) { var s = EN.approval(e.id, pid).status; return s === 'ceka' || s === 'korigovano'; }); l.forEach(function (e) { remind(e, pid); }); IH.save(); IH.toast(t('sg.reminded', { n: l.length })); };
  IH.act['sg-auto'] = function (el) { var pid = el.dataset.arg, l = staff(pid).filter(function (e) { var s = EN.approval(e.id, pid).status; return s === 'ceka' || s === 'korigovano'; }); l.forEach(function (e) { EN.setApproval(e.id, pid, { status: 'auto', at: IH.now() }); }); IH.audit('consent', pid, { sr: 'Automatska saglasnost po isteku roka', en: 'Auto-consent after deadline' }, { sr: l.length + ' obračuna', en: l.length + ' statements' }); IH.render(); IH.toast(t('sg.autoDone', { n: l.length })); };
  IH.act['sg-appr'] = function (el) {
    var pid = el.dataset.arg, l = staff(pid).filter(function (e) { var s = EN.approval(e.id, pid).status; return s === 'saglasan' || s === 'auto'; });
    IH.modal({ title: t('sg.apprT', { p: D.periodLabel(pid) }), body: '<p style="margin-top:0">' + t('sg.apprTxt', { n: l.length, a: '<b>' + F.rsd(l.reduce(function (a, e) { return a + pay(e, pid); }, 0)) + '</b>' }) + '</p>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('sg.approve', { n: l.length }), { cls: 'primary', icon: 'checkc', act: 'sg-appr-go', arg: pid }) });
  };
  IH.act['sg-appr-go'] = function (el) {
    var pid = el.dataset.arg, now = IH.now(), l = staff(pid).filter(function (e) { var s = EN.approval(e.id, pid).status; return s === 'saglasan' || s === 'auto'; });
    l.forEach(function (e) { var a = EN.approval(e.id, pid); EN.setApproval(e.id, pid, { status: 'odobreno', at: now, consentAt: a.at, consent: a.status }); });
    IH.audit('consent', pid, { sr: 'Odobreno za isplatu: ' + D.periodLabel(pid), en: 'Approved for payout: ' + D.periodLabel(pid) }, { sr: l.length + ' obračuna', en: l.length + ' statements' });
    IH.closeModal(); IH.render(); IH.toast(t('sg.apprDone', { n: l.length }));
  };
  IH.act['sg-hist'] = function (el) {
    var p = el.dataset.arg.split('|'), e = D.emp(p[0]), pp = D.period(p[1]), a = EN.approval(p[0], p[1]);
    var h = IH.auditFor('consent', p[0] + '|' + p[1]).slice();
    if (a.at && a.status !== 'ceka') h.push({ at: a.at, by: a.status === 'auto' ? null : p[0], action: { sr: t('st.' + a.status), en: t('st.' + a.status) } });
    if (pp.sentAt) h.push({ at: pp.sentAt, by: 'A001', action: { sr: 'Obračunski list poslat', en: 'Statement sent' } });
    IH.showHistory(e.name + ' · ' + D.periodLabel(p[1]), h.sort(function (x, y) { return x.at < y.at ? 1 : -1; }));
  };
  IH.route('saglasnosti', { title: function () { return t('sg.title'); }, render: sgPage });

  /* ================= ISPLATA ================= */
  function wageOf(e, kind) { var w = IH.codeItems('VRSTA_PRIMANJA').filter(function (x) { return x.id === kind; })[0]; return w ? w.x.wage : '—'; }
  function linesOf(e, pid) {
    var r = EN.result(e.id, pid); if (!r) return [];
    var prior = r.priorAdj || 0, main = r.payout - Math.max(0, prior), kind = e.pos === 'licni' ? 'BON_PROD' : 'BON_TIM', out = [];
    if (main > 0) out.push({ e: e, kind: kind, wage: wageOf(e, kind), amt: main, cc: D.branch(e.branch).code });
    if (prior > 0) out.push({ e: e, kind: 'BON_KOR', wage: wageOf(e, 'BON_KOR'), amt: prior, cc: D.branch(e.branch).code });
    return out;
  }
  var PAIDSEED = { '2026-Q1': ['ISP-2026-Q1', '2026-04-20T10:00', '2026-04-21T09:00', 'ZAR-2026-0418'], '2026-Q2': ['ISP-2026-Q2', '2026-07-20T10:00', '2026-07-21T09:00', 'ZAR-2026-0712'], '2026-07': ['ISP-2026-07', '2026-08-11T10:00', '2026-08-12T09:00', 'ZAR-2026-0809'], '2026-08': ['ISP-2026-08', '2026-09-11T10:00', '2026-09-12T09:00', 'ZAR-2026-0911'] };
  function batches(pid) {
    var out = [], s = PAIDSEED[pid];
    if (s && D.period(pid).paidAt && !IH.map('periodSt')[pid]) out.push({ id: s[0], pid: pid, status: 'potvrdjen', createdAt: s[1], exportedAt: s[2], confirm: s[3], paidAt: D.period(pid).paidAt, emps: staff(pid).filter(function (e) { return pay(e, pid) > 0; }).map(function (e) { return e.id; }), file: 'PAYROLL_UC_' + pid.replace('-', '') + '_B1.csv', seed: true });
    return out.concat(IH.list('batches').filter(function (b) { return b.pid === pid; }));
  }
  function inBatch(pid) { var m = {}; batches(pid).forEach(function (b) { b.emps.forEach(function (x) { m[x] = b; }); }); return m; }
  function stateOf(pid) {
    var p = D.period(pid); if (p.status === 'u_toku') return 'u_toku'; if (p.status === 'isplaceno') return 'isplaceno';
    var ib = inBatch(pid), st = staff(pid).filter(function (e) { return !ib[e.id]; });
    if (batches(pid).some(function (b) { return b.status !== 'potvrdjen'; })) return 'batch';
    var ready = st.filter(function (e) { return EN.approval(e.id, pid).status === 'odobreno'; }).length, cons = st.filter(function (e) { return CONS.indexOf(EN.approval(e.id, pid).status) >= 0; }).length;
    if (cons && cons === st.length) return 'spremno';
    if (ready || cons) return 'delimicno';
    return 'ceka';
  }
  function ipPill(s) { return ui.pill(t('ips.' + s), { spremno: 'success', delimicno: 'warning', ceka: 'warning', batch: 'accent', isplaceno: 'gray', u_toku: 'gray' }[s]); }
  function ipList() {
    var grid = IH.grid({
      id: 'ip', exportName: 'Isplate.xlsx', searchLabel: IH.L({ sr: 'Period', en: 'Period' }),
      rows: function () { var o = { spremno: 0, batch: 1, delimicno: 2, ceka: 3, u_toku: 4, isplaceno: 5 }; return D.periods.slice().sort(function (a, b) { return (o[stateOf(a.id)] - o[stateOf(b.id)]) || (a.from < b.from ? 1 : -1); }); }, key: function (p) { return p.id; }, label: function (p) { return D.periodLabel(p.id); }, searchKeys: ['p'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (p) { return t('ips.' + stateOf(p.id)); }, fval: function (p) { return stateOf(p.id); }, render: function (p) { return ipPill(stateOf(p.id)); }, filter: function () { return ['spremno', 'delimicno', 'ceka', 'batch', 'isplaceno', 'u_toku'].map(function (k) { return { v: k, l: t('ips.' + k) }; }); } },
        { key: 'p', label: t('ip.colPer'), val: function (p) { return D.periodLabel(p.id); }, render: function (p) { return '<b>' + D.periodLabel(p.id) + '</b>'; } },
        { key: 'ty', label: t('c.type'), search: false, val: function (p) { return p.type === 'Q' ? t('ob.q') : t('ob.m'); } },
        { key: 'r', label: t('ip.colReady'), num: true, search: false, val: function (p) { var ib = inBatch(p.id); return staff(p.id).filter(function (e) { return !ib[e.id] && EN.approval(e.id, p.id).status === 'odobreno'; }).length; }, render: function (p) { if (stateOf(p.id) === 'u_toku' || stateOf(p.id) === 'isplaceno') return '<span class="mut">—</span>'; var ib = inBatch(p.id), st = staff(p.id).filter(function (e) { return !ib[e.id]; }); return st.filter(function (e) { return EN.approval(e.id, p.id).status === 'odobreno'; }).length + ' / ' + st.length; } },
        { key: 'a', label: t('ip.colAmt'), num: true, search: false, val: function (p) { return staff(p.id).reduce(function (a, e) { return a + pay(e, p.id); }, 0); }, render: function (p) { return stateOf(p.id) === 'u_toku' ? '<span class="mut">—</span>' : F.num(staff(p.id).reduce(function (a, e) { return a + pay(e, p.id); }, 0)); } },
        { key: 'b', label: t('ip.colBatch'), search: false, val: function (p) { return batches(p.id).map(function (b) { return b.id; }).join(' '); }, render: function (p) { var bs = batches(p.id); return bs.length ? bs.map(function (b) { return b.id + ' <span class="mut">(' + t('bs.' + b.status) + ')</span>'; }).join(', ') : '<span class="mut">—</span>'; } },
        { key: 'pd', label: t('ip.colPaid'), search: false, val: function (p) { return p.paidAt || ''; }, render: function (p) { return p.paidAt ? F.date(p.paidAt) : '<span class="mut">—</span>'; } }
      ],
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (p) { return 'isplata/' + p.id; }, show: function (p) { return stateOf(p.id) !== 'u_toku'; } }]
    });
    return ui.header(t('ip.title')) + grid;
  }
  function ipDetail(pid) {
    var p = D.period(pid), s = stateOf(pid), bs = batches(pid), ib = inBatch(pid), rest = staff(pid).filter(function (e) { return !ib[e.id]; });
    var ready = rest.filter(function (e) { return EN.approval(e.id, pid).status === 'odobreno'; }), consNotAppr = rest.filter(function (e) { var x = EN.approval(e.id, pid).status; return x === 'saglasan' || x === 'auto'; });
    var open = bs.filter(function (b) { return b.status !== 'potvrdjen'; })[0];
    var fl = ui.flow([
      { label: t('ip.fAppr'), sub: (ready.length + Object.keys(ib).length) + ' / ' + staff(pid).length, state: ready.length || bs.length ? 'done' : 'run' },
      { label: t('ip.fBatch'), sub: bs.length ? bs[bs.length - 1].id : '—', state: bs.length ? 'done' : ready.length ? 'run' : '' },
      { label: t('ip.fExp'), sub: open ? (open.exportedAt ? F.dt(open.exportedAt) : '—') : bs.length ? F.dt(bs[bs.length - 1].exportedAt) : '—', state: open ? (open.status === 'kreiran' ? 'run' : 'done') : bs.length ? 'done' : '' },
      { label: t('ip.fConf'), sub: open ? '—' : bs.length ? bs[bs.length - 1].confirm : '—', state: open ? (open.status === 'izvezen' ? 'run' : '') : bs.length ? 'done' : '' },
      { label: t('ip.fLock'), sub: p.status === 'isplaceno' ? F.date(p.paidAt) : '—', state: p.status === 'isplaceno' ? 'done' : '' }
    ]);
    var acts = '';
    if (open && open.status === 'kreiran') acts = ui.btn(t('ip.export'), { cls: 'primary', icon: 'download', act: 'ip-exp', arg: open.id });
    else if (open && open.status === 'izvezen') acts = ui.btn(t('ip.confirm'), { cls: 'primary', icon: 'checkc', act: 'ip-conf', arg: open.id });
    else if (ready.length || consNotAppr.length) acts = ui.btn(consNotAppr.length ? t('ip.apprCreate', { n: ready.length + consNotAppr.length }) : t('ip.create', { n: ready.length }), { cls: 'primary', icon: 'wallet', act: 'ip-create', arg: pid });
    var warn = '';
    var showEmps = open ? open.emps.map(D.emp) : (ready.length || consNotAppr.length) ? ready.concat(consNotAppr) : bs.length ? bs[bs.length - 1].emps.map(D.emp) : [];
    var lines = []; showEmps.forEach(function (e) { lines = lines.concat(linesOf(e, pid)); });
    var tot = lines.reduce(function (a, l) { return a + l.amt; }, 0);
    var lt = ui.card(t('ip.lines') + ' · ' + lines.length, ui.table([{ key: 'e', label: t('sg.colEmp') }, { key: 'h', label: 'HR' }, { key: 'w', label: t('ip.colWage') }, { key: 'c', label: t('ip.colCc') }, { key: 'a', label: t('ip.colAmt'), num: true }],
      lines.map(function (l) { return { e: IH.esc(l.e.name), h: l.e.hr, w: l.wage + ' · ' + IH.esc(IH.L((IH.codeItems('VRSTA_PRIMANJA').filter(function (x) { return x.id === l.kind; })[0] || {}).name || l.kind)), c: l.cc, a: F.num(l.amt) }; }), { compact: true, foot: { e: t('ip.total'), a: F.num(tot) } }), { flush: true });
    var excl = rest.filter(function (e) { return showEmps.indexOf(e) < 0; }).map(function (e) { var r = EN.result(e.id, pid), a = EN.approval(e.id, pid); return { e: IH.esc(e.name), w: !r || !r.payout ? t('ip.zero') + (r && r.carryOut ? ' · ' + t('ip.carry', { a: F.rsd(r.carryOut) }) : '') : IH.ui.status(a.status), a: F.num(r ? r.payout : 0) }; });
    var ex = excl.length ? ui.card(t('ip.excl') + ' · ' + excl.length, ui.table([{ key: 'e', label: t('sg.colEmp') }, { key: 'w', label: t('ip.exclWhy') }, { key: 'a', label: t('ip.colAmt'), num: true }], excl, { compact: true }), { flush: true }) : '';
    var bt = bs.length ? ui.card(t('ip.batches'), ui.table([{ key: 'b', label: 'Batch' }, { key: 'k', label: t('bs.kreiran') }, { key: 's', label: t('c.status') }, { key: 'n', label: IH.L({ sr: 'Linija', en: 'Lines' }), num: true }, { key: 'f', label: t('ip.file') }, { key: 'c', label: t('ip.confirmNo') }, { key: 'd', label: t('ip.colPaid') }],
      bs.map(function (b) { return { b: '<b>' + b.id + '</b>', k: F.dt(b.createdAt), s: ui.pill(t('bs.' + b.status), b.status === 'potvrdjen' ? 'success' : 'accent'), n: b.emps.length, f: b.exportedAt ? b.file : '—', c: b.confirm || '—', d: b.paidAt ? F.date(b.paidAt) : '—' }; }), { compact: true }), { flush: true }) : '';
    return ui.header(t('ip.title') + ' — ' + D.periodLabel(pid) + ' ' + ipPill(s), '', acts, '<a href="#/isplata">' + t('ip.title') + '</a> ' + ic('chevr') + ' ' + D.periodLabel(pid)) + ui.card('', fl) + warn + bt + '<div class="grid g-main">' + lt + '<div>' + ex + '</div></div>';
  }
  IH.act['ip-go-sg'] = function (el) { IH.v('sg').per = el.dataset.arg; IH.go('saglasnosti'); };
  IH.act['ip-create'] = function (el) {
    var pid0 = el.dataset.arg, ib0 = inBatch(pid0), now0 = IH.now();
    staff(pid0).forEach(function (e) { var a = EN.approval(e.id, pid0); if (!ib0[e.id] && (a.status === 'saglasan' || a.status === 'auto')) EN.setApproval(e.id, pid0, { status: 'odobreno', at: now0, consentAt: a.at, consent: a.status }); });
    var pid = el.dataset.arg, ib = inBatch(pid), ready = staff(pid).filter(function (e) { return !ib[e.id] && EN.approval(e.id, pid).status === 'odobreno' && pay(e, pid) > 0; });
    var n = batches(pid).length + 1, id = 'ISP-' + pid + '-B' + n, now = IH.now();
    IH.list('batches').push({ id: id, pid: pid, status: 'kreiran', createdAt: now, emps: ready.map(function (e) { return e.id; }), file: 'PAYROLL_UC_' + pid.replace('-', '') + '_B' + n + '.csv' });
    var tot = ready.reduce(function (a, e) { return a + pay(e, pid); }, 0);
    IH.audit('payout', id, { sr: 'Batch kreiran', en: 'Batch created' }, { sr: ready.length + ' zaposlenih · ' + F.rsd(tot), en: ready.length + ' employees · ' + F.rsd(tot) });
    IH.render(); IH.toast(t('ip.created', { b: id, n: ready.length, a: F.rsd(tot) }));
  };
  function findB(id) { return IH.list('batches').filter(function (b) { return b.id === id; })[0]; }
  IH.act['ip-exp'] = function (el) { var b = findB(el.dataset.arg); b.status = 'izvezen'; b.exportedAt = IH.now(); IH.audit('payout', b.id, { sr: 'Izvezeno u sistem zarada', en: 'Exported to payroll' }, { sr: b.file, en: b.file }); IH.save(); IH.render(); IH.toast(t('ip.exported', { f: b.file })); };
  IH.act['ip-conf'] = function (el) {
    var b = findB(el.dataset.arg); IH.form = {};
    IH.modal({ title: t('ip.confT', { b: b.id }), body: '<p style="margin-top:0">' + t('ip.confTxt') + '</p><div class="form-grid">' + ui.field('ip_no', t('ip.confNo'), 'ZAR-2026-1043') + ui.field('ip_dt', t('ip.confDate'), '20.10.2026.') + '</div>',
      foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('ip.confirm'), { cls: 'primary', icon: 'checkc', act: 'ip-conf-go', arg: b.id }) });
  };
  IH.act['ip-conf-go'] = function (el) {
    var b = findB(el.dataset.arg), pid = b.pid, no = (document.getElementById('fld-ip_no') || {}).value || 'ZAR-2026-1043', dv = (document.getElementById('fld-ip_dt') || {}).value || '', dm = dv.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/), dt = dm ? dm[3] + '-' + ('0' + dm[2]).slice(-2) + '-' + ('0' + dm[1]).slice(-2) : D.TODAY;
    b.status = 'potvrdjen'; b.confirm = no; b.paidAt = dt;
    b.emps.forEach(function (x) { EN.setApproval(x, pid, { status: 'isplaceno', at: dt + 'T10:00', batch: b.id }); });
    var ib = inBatch(pid), left = staff(pid).filter(function (e) { return !ib[e.id] && pay(e, pid) > 0; });
    if (!left.length) { IH.map('periodSt')[pid] = { status: 'isplaceno', paidAt: dt }; applyPeriodSt(); EN.invalidate(); }
    IH.audit('payout', b.id, { sr: 'Potvrđen prijem u sistemu zarada', en: 'Payroll receipt confirmed' }, { sr: no, en: no });
    if (b.emps.indexOf(D.personas.employee.emp) >= 0) IH.notify('employee', { sr: 'Bonus za ' + D.periodLabel(pid) + ' isplaćen je kroz obračun zarada', en: 'Your ' + D.periodLabel(pid) + ' bonus was paid through payroll' }, 'moj-obracun', 'wallet');
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('ip.confDone', { b: b.id, p: D.periodLabel(pid) }));
  };
  IH.route('isplata', { title: function () { return t('ip.title'); }, render: function (p) { return p[0] && D.period(p[0]) ? ipDetail(p[0]) : ipList(); } });
})();
