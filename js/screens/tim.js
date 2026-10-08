/* Incentive Hub — Moj obračun (Zaposleni) · Moj tim, Saglasnosti tima, Moj bonus (Menadžer) */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'mo.title': 'Moj obračun', 'mo.desc': 'Obračunski list stavku po stavku — od targeta do pojedinačne prodaje. Saglasnost ili prigovor dajete ovde.', 'mo.items': 'Moje stavke', 'mo.thread': 'Prigovor {c}', 'mo.hist': 'Istorija obračuna',
    'mo.colPer': 'Period', 'mo.colPay': 'Isplata', 'mo.colSt': 'Status', 'mo.prelim': 'preliminarno',
    'tm.title': 'Moj tim', 'tm.desc': 'Zaposleni u vašoj liniji rukovođenja: ostvarenje tekućeg perioda, projekcija bonusa i status obračuna.', 'tm.colEmp': 'Zaposleni', 'tm.colAch': 'Ostvarenje (projekcija)', 'tm.colBonus': 'Bonus (proj.)', 'tm.colCons': 'Saglasnost', 'tm.colScheme': 'Šema',
    'tm.k1': 'Članova tima', 'tm.k2': 'Na putu ka targetu', 'tm.k3': 'Projektovani bonus tima', 'tm.k4': 'Čeka saglasnost', 'tm.k5': 'Otvoreni prigovori', 'tm.card': 'Kartica zaposlenog', 'tm.periods': 'Obračuni po periodima', 'tm.hist': 'Istorija', 'tm.new': 'počinje {d}',
    'sgt.title': 'Saglasnosti tima', 'sgt.desc': 'Obračuni članova tima po statusu saglasnosti. Pregledajte obračunski list, pošaljite podsetnik onima koji nisu odgovorili, a prigovore rešite u Prigovorima tima.',
    'sgt.remind': 'Podsetnik', 'sgt.remindAll': 'Pošalji podsetnik svima bez odgovora ({n})', 'sgt.reminded': 'Podsetnik poslat: {n}', 'sgt.deadline': 'Rok {d} · još {x} dana', 'sgt.toCompl': 'Otvori prigovor',
    'mb.title': 'Moj bonus', 'mb.desc': 'Vaš obračun iz rezultata tima: krediti i novi klijenti ekspoziture, pomnoženi timskim ponderom prema udelu bankara na targetu.', 'mb.team': 'Doprinos članova tima', 'mb.share': 'Udeo bankara sa targetom Krediti ≥ 100%', 'mb.onT': 'Na targetu', 'mb.to': 'Prigovor na sopstveni obračun rešava regionalni direktor ({n}).'
  }, {
    'mo.title': 'My statement', 'mo.desc': 'Statement item by item — from targets down to a single sale. You give consent or file a complaint here.', 'mo.items': 'My items', 'mo.thread': 'Complaint {c}', 'mo.hist': 'Statement history',
    'mo.colPer': 'Period', 'mo.colPay': 'Payout', 'mo.colSt': 'Status', 'mo.prelim': 'preliminary',
    'tm.title': 'My team', 'tm.desc': 'Employees in your management line: current period achievement, projected bonus and statement status.', 'tm.colEmp': 'Employee', 'tm.colAch': 'Achievement (projection)', 'tm.colBonus': 'Bonus (proj.)', 'tm.colCons': 'Consent', 'tm.colScheme': 'Scheme',
    'tm.k1': 'Team members', 'tm.k2': 'On track', 'tm.k3': 'Projected team bonus', 'tm.k4': 'Awaiting consent', 'tm.k5': 'Open complaints', 'tm.card': 'Employee card', 'tm.periods': 'Statements by period', 'tm.hist': 'History', 'tm.new': 'starts {d}',
    'sgt.title': 'Team consents', 'sgt.desc': 'Team statements by consent status. Review the statement, remind those who have not replied, and resolve complaints in Team complaints.',
    'sgt.remind': 'Reminder', 'sgt.remindAll': 'Remind everyone without a reply ({n})', 'sgt.reminded': 'Reminder sent: {n}', 'sgt.deadline': 'Due {d} · {x} days left', 'sgt.toCompl': 'Open complaint',
    'mb.title': 'My bonus', 'mb.desc': 'Your statement from team results: branch loans and new clients, multiplied by the team factor based on the share of bankers on target.', 'mb.team': 'Team member contribution', 'mb.share': 'Share of bankers with Loans ≥ 100%', 'mb.onT': 'On target', 'mb.to': 'A complaint on your own statement is decided by the regional director ({n}).'
  });

  function daysLeft(iso) { return Math.max(0, Math.round((Date.parse(iso) - Date.parse(D.TODAY)) / 864e5)); }
  function run(pid) { return D.period(pid).status === 'u_toku'; }
  function pay(empId, pid) { var r = EN.result(empId, pid, { project: run(pid) }); return r ? r.payout : 0; }
  function lastClosed(empId) { return EN.lastClosed(empId); }

  /* ================= ZAPOSLENI: MOJ OBRAČUN ================= */
  function periodsFor(empId) { var ps = EN.periodsFor(empId).map(function (p) { return p.id; }); var lc = lastClosed(empId); return [lc].concat(ps.filter(function (p) { return p !== lc; }).reverse()); }
  function stmtPanel(empId, scope, opts) {
    opts = opts || {};
    var pers = periodsFor(empId), v = IH.v(scope), pid = pers.indexOf(v.per) >= 0 ? v.per : pers[0], e = D.emp(empId), s = EN.schemeFor(empId, pid) || D.scheme(D.positions[e.pos].scheme);
    IH.refreshers[scope] = function () { IH.render(); };
    var seg = ui.segf(scope, 'per', pers.map(function (p) { return { v: p, l: D.periodLabel(p) + (run(p) ? ' · ' + t('mo.prelim') : '') }; }));
    var ap = EN.approval(empId, pid), c = IH.complaintFor(empId, pid);
    var kp = '<div class="kpis" style="margin-bottom:14px">' + ui.kpi(run(pid) ? IH.L({ sr: 'Projektovano', en: 'Projected' }) : t('mo.colPay'), F.num(pay(empId, pid)) + '<span class="u">RSD</span>', IH.esc(IH.L(s.name)) + ' · v' + D.schemeVersion(s, pid).v, { hl: true }) +
      ui.kpi(t('mo.colSt'), IH.ui.status(ap.status), ap.at ? F.dt(ap.at) : null) + (D.period(pid).deadline && D.period(pid).status === 'saglasnost' ? ui.kpi(IH.L({ sr: 'Rok za saglasnost', en: 'Consent deadline' }), F.date(D.period(pid).deadline), IH.L({ sr: 'još ', en: '' }) + daysLeft(D.period(pid).deadline) + IH.L({ sr: ' dana', en: ' days left' })) : '') + '</div>';
    var body = '<div class="toolbar" style="border:0;padding:0 0 14px">' + seg + '</div>' + (opts.noBanner ? '' : IH.consentBanner(empId, pid)) + kp;
    var stmt = ui.card(D.periodLabel(pid) + ' · ' + IH.esc(IH.L(s.name)), IH.stmtBody(empId, pid, { project: run(pid) }), { flush: true, actions: opts.itemsGo ? ui.btn(t('mo.items'), { cls: 'sm', icon: 'activity', go: opts.itemsGo }) : '' });
    var side = c ? ui.card(t('mo.thread', { c: c.id }), IH.threadHtml(c, IH.me().id === empId || D.emp(c.emp).mgr === IH.me().id), { sub: IH.esc(IH.L(c.subject)) }) : '';
    return { pid: pid, html: body + (side ? '<div class="grid g-main">' + stmt + '<div>' + side + '</div></div>' : stmt) };
  }
  IH.route('moj-obracun', { title: function () { return t('mo.title'); }, render: function () { var me = IH.me(), sp = stmtPanel(me.id, 'mo', { itemsGo: 'moje-ostvarenje' }); return ui.header(t('mo.title')) + sp.html; } });

  /* ================= MENADŽER: MOJ TIM ================= */
  function team() { var me = IH.me(); return D.employees.filter(function (e) { return e.mgr === me.id && D.positions[e.pos] && D.positions[e.pos].scheme; }); }
  function curP(e) { return e.pos === 'univerzalni' ? '2026-10' : '2026-Q4'; }
  function closedP(e) { return e.pos === 'univerzalni' ? '2026-09' : '2026-Q3'; }
  function achOf(e) {
    if (e.pos === 'licni') { var r = EN.m1(e.id, '2026-Q4', { project: true }); return { pct: r.targets[0].pct, l: IH.L(r.targets[0].name) }; }
    var m = EN.m3(e.branch, '2026-10', { project: true }); return { pct: m.payoutPct, l: IH.L({ sr: 'tim', en: 'team' }) };
  }
  /* zajednički bonus tima (tekući mesec): podela na jednake delove ili po odluci menadžera — važi odmah, beleži se u audit */
  var SPID = '2026-10';
  function TL(sr, en) { return IH.L({ sr: sr, en: en }); }
  function pctIn(s) { s = String(s == null ? '' : s).trim(); var n = parseFloat(s.indexOf(',') >= 0 ? s.replace(/\./g, '').replace(',', '.') : s); return isNaN(n) || n < 0 ? 0 : n; }
  /* jednaki delovi u procentima (srazmerno danima u timu), zaokruženo na 0,1 tako da je zbir 100 */
  function eqPct(r) {
    var tot = r.members.reduce(function (a, m) { return a + m.presence; }, 0), o = {}, acc = 0;
    r.members.forEach(function (m, i) { var v = i === r.members.length - 1 ? Math.round((100 - acc) * 10) / 10 : Math.round((tot ? m.presence / tot : 0) * 1000) / 10; o[m.emp] = v; acc += v; });
    return o;
  }
  function splitCard(bid) {
    var r = EN.m3(bid, SPID, { project: true }); if (r.noScheme || !r.members.length) return '';
    var s = D.scheme(r.scheme), canEdit = s.teamSplit === 'menadzer', man = r.pool && r.pool.manual, dt = D.daysInfo(SPID), pool = r.pool ? r.pool.pay : 0;
    var rows = r.members.map(function (m) { var e = D.emp(m.emp); return { n: '<b>' + IH.esc(e.name) + '</b>', d: Math.round(m.presence * dt.total) + ' / ' + dt.total, s: '<b>' + F.pct(m.share) + '</b>', p: F.num(Math.round(pool * m.share)), b: F.num(m.payout) }; });
    var acts = ui.pill(man ? TL('Odredio menadžer', 'Set by the manager') : TL('Na jednake delove', 'Equal shares'), man ? 'accent' : 'gray') + (canEdit ? ' ' + ui.btn(TL('Promeni podelu', 'Change split'), { cls: 'sm', icon: 'edit', act: 'tm-split', arg: bid }) : '');
    var tbl = ui.table([{ key: 'n', label: t('tm.colEmp') }, { key: 'd', label: TL('Dana u timu', 'Days in team'), num: true }, { key: 's', label: TL('Udeo', 'Share'), num: true }, { key: 'p', label: TL('Deo bonusa tima', 'Share of team bonus'), num: true }, { key: 'b', label: TL('Ukupna isplata (projekcija)', 'Total payout (projection)'), num: true }], rows, { compact: true, foot: { n: TL('Bonus tima (projekcija)', 'Team bonus (projection)'), p: '<b>' + F.num(pool) + '</b>' } });
    return ui.card(TL('Zajednički bonus tima', 'Shared team bonus') + ' — ' + D.periodLabel(SPID), tbl, { flush: true, actions: acts });
  }
  function splitBody(bid) {
    var r = EN.m3(bid, SPID, { project: true }), f = IH.form.split || {}, pool = r.pool ? r.pool.pay : 0, sum = 0;
    var rows = r.members.map(function (m) { var e = D.emp(m.emp), v = f[m.emp] || 0; sum += v; return '<tr><td><b>' + IH.esc(e.name) + '</b></td><td class="num"><input class="in cell tnum" style="width:90px;margin-left:auto;display:block" data-tsp="' + m.emp + '" value="' + F.num(v, 1) + '"></td><td class="num">' + F.num(Math.round(pool * v / 100)) + '</td></tr>'; }).join('');
    var ok = Math.abs(sum - 100) < 0.05;
    return '<div class="tbl-wrap"><table class="t compact"><thead><tr><th>' + t('tm.colEmp') + '</th><th class="num">' + TL('Udeo (%)', 'Share (%)') + '</th><th class="num">' + TL('Deo bonusa tima', 'Share of team bonus') + '</th></tr></thead><tbody>' + rows + '</tbody>' +
      '<tfoot><tr class="lvl-0"><td>' + t('c.total') + '</td><td class="num ' + (ok ? 'sum-ok' : 'sum-bad') + '">' + F.num(sum, 1) + ' %</td><td class="num">' + F.num(pool) + '</td></tr></tfoot></table></div>';
  }
  IH.act['tm-split'] = function (el) {
    var bid = el.dataset.arg, r = EN.m3(bid, SPID, { project: true }), eq = eqPct(r), man = r.pool && r.pool.manual;
    IH.form = { split: {}, _splitB: bid };
    r.members.forEach(function (m) { IH.form.split[m.emp] = man ? Math.round(m.share * 1000) / 10 : eq[m.emp]; });
    IH.modal({ title: TL('Podela bonusa tima', 'Team bonus split') + ' · ' + D.periodLabel(SPID), body: '<div id="tm-split-body">' + splitBody(bid) + '</div>',
      foot: ui.btn(TL('Na jednake delove', 'Equal shares'), { act: 'tm-split-eq', arg: bid }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'tm-split-save', arg: bid }) });
  };
  IH.act['tm-split-eq'] = function (el) { var bid = el.dataset.arg; IH.form.split = eqPct(EN.m3(bid, SPID, { project: true })); IH.swap('tm-split-body', splitBody(bid)); };
  document.addEventListener('change', function (e) { var d = e.target.dataset || {}; if (!d.tsp || !IH.form.split) return; IH.form.split[d.tsp] = pctIn(e.target.value); IH.swap('tm-split-body', splitBody(IH.form._splitB)); });
  IH.act['tm-split-save'] = function (el) {
    var bid = el.dataset.arg, f = IH.form.split || {}, r = EN.m3(bid, SPID, { project: true });
    var sum = r.members.reduce(function (a, m) { return a + (f[m.emp] || 0); }, 0);
    if (Math.abs(sum - 100) >= 0.05) { IH.toast(TL('Zbir udela mora biti 100%', 'Shares must add up to 100%')); return; }
    var eq = eqPct(r), same = r.members.every(function (m) { return Math.abs((f[m.emp] || 0) - eq[m.emp]) < 0.05; });
    var key = bid + '|' + SPID, map = IH.map('teamSplit');
    if (same) delete map[key]; else { var o = {}; r.members.forEach(function (m) { o[m.emp] = (f[m.emp] || 0) / 100; }); map[key] = o; }
    var txt = same ? null : r.members.map(function (m) { return D.emp(m.emp).name + ' ' + F.num(f[m.emp] || 0, 1) + '%'; }).join(', ');
    IH.audit('teamSplit', bid, { sr: 'Promenjena podela bonusa tima — ' + D.periodLabel(SPID), en: 'Team bonus split changed — ' + D.periodLabel(SPID) }, { sr: txt || 'Na jednake delove', en: txt || 'Equal shares' });
    EN.invalidate(); IH.form = {}; IH.save(); IH.closeModal(); IH.render(); IH.toast(TL('Podela bonusa tima je sačuvana i važi odmah', 'Team bonus split saved and applies immediately'));
  };

  function teamPage() {
    var tm = team(), me = IH.me();
    var lic = tm.filter(function (e) { return e.pos === 'licni'; }), onT = lic.filter(function (e) { return achOf(e).pct >= 1; }).length;
    var tot = tm.reduce(function (a, e) { return a + pay(e.id, curP(e)); }, 0);
    var wait = tm.filter(function (e) { var s = EN.approval(e.id, closedP(e)).status; return s === 'ceka' || s === 'korigovano'; }).length;
    var kp = '<div class="kpis">' + ui.kpi(t('tm.k1'), tm.length, IH.esc(D.branchName(me.branch))) + ui.kpi(t('tm.k2'), onT + ' / ' + lic.length, IH.L({ sr: 'savetnici, projekcija T1', en: 'advisors, T1 projection' })) + ui.kpi(t('tm.k3'), F.num(tot) + '<span class="u">RSD</span>', 'Q4 2026 + ' + D.periodLabel('2026-10'), { hl: true }) +
      ui.kpi(t('tm.k4'), wait, 'Q3 + ' + D.periodLabel('2026-09'), { go: 'saglasnosti-tima' }) + ui.kpi(t('tm.k5'), IH.stats.openComplaints(me.id).length, null, { go: 'prigovori-tima' }) + '</div>';
    var grid = IH.grid({
      id: 'tm', exportName: 'Moj_tim.xlsx', searchLabel: IH.L({ sr: 'Ime', en: 'Name' }),
      rows: team, key: function (e) { return e.id; }, label: function (e) { return e.name; }, searchKeys: ['e'],
      cols: [
        { key: 'e', label: t('tm.colEmp'), val: function (e) { return e.name; }, render: function (e) { return '<b>' + IH.esc(e.name) + '</b>' + (e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } },
        { key: 'pos', label: t('c.position'), val: function (e) { return D.posName(e.pos); } },
        { key: 's', label: t('tm.colScheme'), val: function (e) { var s = EN.schemeFor(e.id, curP(e)); return s ? s.code : ''; } },
        { key: 'a', label: t('tm.colAch'), search: false, val: function (e) { return e.since > D.DATA_AS_OF ? -1 : achOf(e).pct; }, render: function (e) { if (e.since > D.DATA_AS_OF) return '<span class="mut">' + t('tm.new', { d: F.date(e.since) }) + '</span>'; var a = achOf(e); return '<div style="min-width:150px" title="' + IH.esc(a.l) + '">' + ui.pcell(a.pct) + '</div>'; } },
        { key: 'b', label: t('tm.colBonus'), num: true, search: false, val: function (e) { return pay(e.id, curP(e)); }, render: function (e) { return F.num(pay(e.id, curP(e))); } },
        { key: 'c', label: t('tm.colCons'), val: function (e) { return EN.approval(e.id, closedP(e)).status; }, render: function (e) { return e.since > D.period(closedP(e)).to ? '<span class="mut">—</span>' : IH.ui.status(EN.approval(e.id, closedP(e)).status); }, filter: function () { return ['ceka', 'saglasan', 'auto', 'prigovor', 'korigovano'].map(function (k) { return { v: k, l: t('st.' + k) }; }); } }
      ],
      actions: [{ type: 'details', title: t('tm.card'), act: 'g-go', arg: function (e) { return 'tim/' + e.id; } }, { icon: 'calc', title: t('pt.stmt'), act: 'g-go', arg: function (e) { return 'saglasnosti-tima/' + closedP(e) + '/' + e.id; }, show: function (e) { return e.since <= D.period(closedP(e)).to; } }]
    });
    return ui.header(t('tm.title'), '', '', IH.esc(D.branchName(me.branch))) + kp + grid + splitCard(me.branch);
  }
  function memberCard(empId) {
    var e = D.emp(empId); if (!e || e.mgr !== IH.me().id) return teamPage();
    var pers = IH.empPeriods(empId), v = IH.v('tmc-' + empId), pid = pers.indexOf(v.per) >= 0 ? v.per : pers[0];
    IH.refreshers['tmc-' + empId] = function () { IH.render(); };
    var hist = IH.auditFor('assignment', empId).concat(IH.assignments().filter(function (a) { return a.emp === empId; }).map(function (a) { return { at: (a.approvedAt || a.submittedAt || a.from + 'T08:00'), by: a.approvedBy || a.submittedBy, action: { sr: 'Raspored ' + D.scheme(a.scheme).code + ' — ' + t('st2.' + a.status), en: 'Assignment ' + D.scheme(a.scheme).code + ' — ' + t('st2.' + a.status) } }; }))
      .concat(EN.allCorr().filter(function (c) { return c.emp === empId || (c.changes && c.changes.emp === empId); }).map(function (c) { return { at: c.at, by: c.by, action: { sr: 'Korekcija ' + c.id + ' (' + D.periodLabel(c.period) + ')', en: 'Correction ' + c.id + ' (' + D.periodLabel(c.period) + ')' }, detail: c.note }; }))
      .concat(IH.complaints().filter(function (c) { return c.emp === empId; }).map(function (c) { return { at: c.at, by: c.emp, action: { sr: 'Prigovor ' + c.id + ' — ' + t('pst2.' + c.status), en: 'Complaint ' + c.id + ' — ' + t('pst2.' + c.status) }, detail: c.subject }; }))
      .sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var crumb = '<a href="#/tim">' + t('tm.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(e.name);
    var top = '<div class="toolbar" style="border:0;padding:0 0 14px">' + ui.segf('tmc-' + empId, 'per', pers.map(function (p) { return { v: p, l: D.periodLabel(p) + (run(p) ? ' · ' + t('pst.u_toku').toLowerCase() : '') }; })) + '</div>';
    if (e.since > D.DATA_AS_OF) return ui.header(IH.esc(e.name), '', '', crumb + ' · ' + D.posName(e.pos)) + '<div class="note">' + t('tm.new', { d: F.date(e.since) }) + ' · ' + IH.L({ sr: 'prve stavke stižu sledećim noćnim uvozom', en: 'first items arrive with the next nightly import' }) + '</div>' + ui.card(t('tm.hist'), ui.hist(hist));
    return ui.header(IH.esc(e.name), '', ui.btn(t('pt.stmt'), { icon: 'calc', go: 'saglasnosti-tima/' + closedP(e) + '/' + e.id }), crumb + ' · ' + D.posName(e.pos)) + top +
      IH.empTargetsCard(empId, pid) + IH.empItemsGrid(empId, pid) + '<div style="margin-top:16px">' + ui.card(t('tm.hist'), ui.hist(hist.slice(0, 8))) + '</div>';
  }
  IH.route('tim', { title: function () { return t('tm.title'); }, render: function (p) { return p[0] ? memberCard(p[0]) : teamPage(); } });

  /* ================= MENADŽER: SAGLASNOSTI TIMA ================= */
  function sgtPage() {
    var v = IH.v('sgt'), pid = v.per === '2026-09' ? '2026-09' : '2026-Q3', p = D.period(pid);
    IH.refreshers.sgt = function () { IH.render(); };
    var rows = function () { return team().filter(function (e) { return EN.staffForPeriod(pid).indexOf(e) >= 0; }); };
    var cnt = {}; rows().forEach(function (e) { var s = EN.approval(e.id, pid).status; cnt[s] = (cnt[s] || 0) + 1; });
    var open = rows().filter(function (e) { var s = EN.approval(e.id, pid).status; return s === 'ceka' || s === 'korigovano'; });
    var kp = '<div class="kpis">' + ['ceka', 'korigovano', 'prigovor', 'saglasan', 'auto'].map(function (k) { return ui.kpi(t('st.' + k), cnt[k] || 0, null, k === 'prigovor' && cnt[k] ? { go: 'prigovori-tima' } : null); }).join('') + ui.kpi(IH.L({ sr: 'Rok', en: 'Deadline' }), F.date(p.deadline), IH.L({ sr: 'još ', en: '' }) + daysLeft(p.deadline) + IH.L({ sr: ' dana', en: ' days left' }), { hl: true }) + '</div>';
    var grid = IH.grid({
      id: 'sgt-' + pid, exportName: 'Saglasnosti_tima_' + pid + '.xlsx', searchLabel: IH.L({ sr: 'Ime', en: 'Name' }),
      rows: rows, key: function (e) { return e.id; }, label: function (e) { return e.name; }, searchKeys: ['e'],
      toolbarExtra: open.length ? ui.btn(t('sgt.remindAll', { n: open.length }), { cls: 'sm', icon: 'bell', act: 'sgt-rem-all', arg: pid }) : '',
      cols: [
        { key: 'st', label: t('c.status'), val: function (e) { return t('st.' + EN.approval(e.id, pid).status); }, fval: function (e) { return EN.approval(e.id, pid).status; }, render: function (e) { return IH.ui.status(EN.approval(e.id, pid).status); }, filter: function () { return ['ceka', 'korigovano', 'prigovor', 'saglasan', 'auto', 'odobreno'].map(function (k) { return { v: k, l: t('st.' + k) }; }); } },
        { key: 'e', label: t('tm.colEmp'), val: function (e) { return e.name; }, render: function (e) { return '<b>' + IH.esc(e.name) + '</b>'; } },
        { key: 'at', label: t('c.date'), search: false, val: function (e) { return EN.approval(e.id, pid).at || ''; }, render: function (e) { var a = EN.approval(e.id, pid); return a.at ? F.date(a.at) : '<span class="mut">—</span>'; } },
        { key: 'pay', label: t('mo.colPay'), num: true, search: false, val: function (e) { return pay(e.id, pid); }, render: function (e) { var a = EN.approval(e.id, pid); return '<b>' + F.num(pay(e.id, pid)) + '</b>' + (a.prev != null ? ' <span class="mut">(' + IH.L({ sr: 'bilo ', en: 'was ' }) + F.num(a.prev) + ')</span>' : ''); } },
        { key: 'c', label: t('pt.colId'), search: false, val: function (e) { var c = IH.complaintFor(e.id, pid); return c ? c.id : ''; }, render: function (e) { var c = IH.complaintFor(e.id, pid); return c ? '<a href="#/prigovori-tima/' + c.id + '">' + c.id + '</a> <span class="mut">· ' + t('pst2.' + c.status) + '</span>' : '<span class="mut">—</span>'; } }
      ],
      actions: [
        { icon: 'calc', title: t('pt.stmt'), act: 'g-go', arg: function (e) { return 'saglasnosti-tima/' + pid + '/' + e.id; } },
        { icon: 'bell', title: t('sgt.remind'), act: 'sgt-rem', kind: 'acc', arg: function (e) { return e.id + '|' + pid; }, show: function (e) { var s = EN.approval(e.id, pid).status; return s === 'ceka' || s === 'korigovano'; } },
        { icon: 'msg', title: t('sgt.toCompl'), act: 'g-go', arg: function (e) { var c = IH.complaintFor(e.id, pid); return 'prigovori-tima/' + (c ? c.id : ''); }, show: function (e) { return !!IH.complaintFor(e.id, pid); } }
      ]
    });
    return ui.header(t('sgt.title'), '', ui.segf('sgt', 'per', [{ v: '2026-Q3', l: 'Q3 2026 · ' + IH.L({ sr: 'savetnici', en: 'advisors' }) }, { v: '2026-09', l: D.periodLabel('2026-09') + ' · ' + IH.L({ sr: 'univerzalni', en: 'universal' }) }])) + kp + grid;
  }
  function sgtStmt(pid, empId) {
    var e = D.emp(empId); if (!e || e.mgr !== IH.me().id || !D.period(pid)) return sgtPage();
    var ap = EN.approval(empId, pid), c = IH.complaintFor(empId, pid), s = EN.schemeFor(empId, pid) || D.scheme(D.positions[e.pos].scheme);
    var crumb = '<a href="#/saglasnosti-tima">' + t('sgt.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(e.name) + ' · ' + D.periodLabel(pid);
    var acts = (ap.status === 'ceka' || ap.status === 'korigovano' ? ui.btn(t('sgt.remind'), { icon: 'bell', act: 'sgt-rem', arg: empId + '|' + pid }) : '') + (c ? ui.btn(t('sgt.toCompl'), { icon: 'msg', go: 'prigovori-tima/' + c.id }) : '') + ui.btn(t('tm.card'), { icon: 'user', go: 'tim/' + empId });
    var kp = '<div class="kpis" style="margin-bottom:14px">' + ui.kpi(t('mo.colPay'), F.num(pay(empId, pid)) + '<span class="u">RSD</span>', ap.prev != null ? IH.L({ sr: 'bilo ', en: 'was ' }) + F.num(ap.prev) : D.periodLabel(pid), { hl: true }) + ui.kpi(t('mo.colSt'), IH.ui.status(ap.status), ap.at ? F.dt(ap.at) : null) + '</div>';
    return ui.header(t('pt.stmt') + ' — ' + IH.esc(e.name), '', acts, crumb) + kp + ui.card(IH.esc(IH.L(s.name)) + ' · ' + D.periodLabel(pid), IH.stmtBody(empId, pid), { flush: true });
  }
  function remind(empId, pid) {
    var e = D.emp(empId);
    IH.audit('consent', empId + '|' + pid, { sr: 'Podsetnik za saglasnost', en: 'Consent reminder' }, { sr: 'Poslao ' + IH.me().name, en: 'Sent by ' + IH.me().name });
    if (empId === D.personas.employee.emp) IH.notify('employee', { sr: 'Podsetnik: saglasnost na obračun ' + D.periodLabel(pid) + ' do ' + F.date(D.period(pid).deadline), en: 'Reminder: consent to the ' + D.periodLabel(pid) + ' statement by ' + F.date(D.period(pid).deadline) }, 'moj-obracun', 'clock');
    return e;
  }
  IH.act['sgt-rem'] = function (el) { var p = el.dataset.arg.split('|'), e = remind(p[0], p[1]); IH.save(); IH.toast(t('sgt.reminded', { n: IH.esc(e.name) })); };
  IH.act['sgt-rem-all'] = function (el) {
    var pid = el.dataset.arg, list = team().filter(function (e) { var s = EN.approval(e.id, pid).status; return EN.staffForPeriod(pid).indexOf(e) >= 0 && (s === 'ceka' || s === 'korigovano'); });
    list.forEach(function (e) { remind(e.id, pid); }); IH.save(); IH.toast(t('sgt.reminded', { n: list.map(function (e) { return IH.esc(e.name); }).join(', ') }));
  };
  IH.route('saglasnosti-tima', { title: function () { return t('sgt.title'); }, render: function (p) { return p[0] && p[1] ? sgtStmt(p[0], p[1]) : sgtPage(); } });

  /* ================= MENADŽER: MOJ BONUS ================= */
  function mbPage() {
    var me = IH.me(), sp = stmtPanel(me.id, 'mb'), pid = sp.pid, m2 = EN.m2(me.id, pid, { project: run(pid) });
    var team3 = (m2.team || []).map(function (x) { var e = D.emp(x.emp); return { e: '<b>' + IH.esc(e.name) + '</b>', p: ui.pcell(x.pct), o: x.on ? ui.pill(t('mb.onT'), 'success') : '<span class="mut">—</span>' }; });
    var sch = EN.schemeFor(me.id, pid) || D.scheme('S-M2'), bands = (sch.teamFactor && sch.teamFactor.bands) || [{ to: null, f: 1 }], t1name = m2.targets[0] ? IH.L(m2.targets[0].name) : 'T1';
    var lo = 0, sc = '<div class="scale">' + bands.map(function (b) { var on = m2.share >= lo && (b.to == null || m2.share < b.to); var l = b.to == null ? '≥ ' + F.pct(lo) : F.pct(lo) + ' – ' + F.pct(b.to - 0.0001); lo = b.to; return '<div class="sc' + (on ? ' on' : '') + '"><b>×' + F.num(b.f, 1) + '</b>' + l + '</div>'; }).join('') + '</div>';
    return ui.header(t('mb.title')) + sp.html + '<div class="hint" style="margin:-6px 0 12px">' + t('mb.to', { n: IH.esc((D.emp(me.mgr) || {}).name || '') }) + '</div>' +
      ui.card(t('mb.team') + ' · ' + D.periodLabel(pid), ui.table([{ key: 'e', label: t('tm.colEmp') }, { key: 'p', label: t1name, w: '220px' }, { key: 'o', label: t('mb.onT') }], team3, { compact: true }) + '<div class="cb"><div class="lab">' + t('mb.share') + ': <b>' + F.pct(m2.share) + '</b> → ' + IH.L({ sr: 'ponder tima', en: 'team factor' }) + ' ×' + F.num(m2.teamFactor, 1) + '</div>' + sc + '</div>', { flush: true });
  }
  IH.route('moj-bonus', { title: function () { return t('mb.title'); }, render: mbPage });
})();
