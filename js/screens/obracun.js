/* Incentive Hub — Obračun bonusa: periodi, tok obrade, ponovni obračun, kontrola odstupanja, verzije, obračunski list */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'ob.title': 'Obračun bonusa', 'ob.desc': 'Tok po periodu: zaključavanje → obračun → kontrola odstupanja → slanje zaposlenima. Svaki obračun pamti verziju šeme, targeta i kataloga sa kojom je urađen.',
    'ob.colPer': 'Period', 'ob.colSch': 'Šeme', 'ob.colN': 'Zaposlenih', 'ob.colTot': 'Ukupno (RSD)', 'ob.colAvg': 'Prosečno', 'ob.colPend': 'Izmene na čekanju', 'ob.colStage': 'Faza',
    'ob.q': 'Kvartal · savetnici i menadžeri', 'ob.m': 'Mesec · univerzalni bankari', 'ob.lockOn': 'Zaključavanje {d}', 'ob.consTo': 'Saglasnosti do {d}', 'ob.paidOn': 'Isplaćeno {d}', 'ob.prelim': 'preliminarno',
    'ob.tOv': 'Pregled', 'ob.tSt': 'Obračunski listovi', 'ob.tCtl': 'Kontrola odstupanja', 'ob.tVer': 'Verzije i istorija',
    'ob.fLock': 'Zaključavanje', 'ob.fCalc': 'Obračun', 'ob.fCtl': 'Kontrola', 'ob.fSend': 'Slanje', 'ob.fCons': 'Saglasnost', 'ob.fPay': 'Isplata',
    'ob.runNote': 'Period je u toku — iznosi su preliminarni, na osnovu projekcije do kraja perioda. Zaključavanje {d}.',
    'ob.pend': '{n} izmena čeka ponovni obračun', 'ob.pendS': 'Period je zaključen; izmene ulaze u obračun tek posle ponovnog obračuna. Zaposleni čiji se iznos promeni dobijaju obračunski list ponovo na saglasnost.',
    'ob.pMap': 'Šifra {c} mapirana {d} — {n} stavki kod {e} zaposlenih', 'ob.pCorr': 'Korekcija {k} · {e} · {r}', 'ob.recalc': 'Ponovni obračun', 'ob.recalcT': 'Ponovni obračun — {p}',
    'ob.scope': 'Obuhvat', 'ob.scChanged': 'Zaposleni sa izmenama', 'ob.scChangedS': '{n} zaposlenih — preporučeno', 'ob.scEmp': 'Pojedinačno', 'ob.scEmpS': 'Jedan zaposleni', 'ob.scBranch': 'Ekspozitura', 'ob.scBranchS': 'Svi u ekspozituri', 'ob.scAll': 'Ceo period', 'ob.scAllS': 'Svi zaposleni u periodu',
    'ob.preview': 'Razlike pre potvrde', 'ob.before': 'Sada', 'ob.after': 'Posle', 'ob.diff': 'Razlika', 'ob.noDiff': 'U izabranom obuhvatu nema promena iznosa — obračun se ipak beleži sa novom verzijom.', 'ob.why': 'Uzrok',
    'ob.reCons': 'Zaposleni sa promenom dobijaju obračunski list ponovo na saglasnost (status „Korigovano“).', 'ob.run': 'Pokreni ponovni obračun', 'ob.done': 'Ponovni obračun {p}: {n} zaposlenih sa promenom, ukupno {d}',
    'ob.kTot': 'Ukupno za isplatu', 'ob.kN': 'Zaposlenih', 'ob.kAvg': 'Prosečna isplata', 'ob.kCap': 'Na limitu', 'ob.kZero': 'Bez bonusa', 'ob.kCarry': 'Prenos salda', 'ob.kCorr': 'Ručne korekcije',
    'ob.bySch': 'Po šemi', 'ob.byBr': 'Po ekspozituri', 'ob.prevPer': 'Prethodni period', 'ob.colPay': 'Isplata', 'ob.colPrev': 'Prethodni', 'ob.colFlags': 'Oznake', 'ob.colCons': 'Saglasnost',
    'fl.cap': 'Limit', 'fl.carry': 'Prenos salda', 'fl.corr': 'Korekcija', 'fl.zero': 'Bez bonusa', 'fl.reCalc': 'Korigovano',
    'ctl.R1': 'Promena veća od 50% u odnosu na prethodni period', 'ctl.R2': 'Isplata ograničena limitom šeme', 'ctl.R3': 'Bez bonusa u periodu', 'ctl.R4': 'Negativan saldo prenet u naredni period', 'ctl.R5': 'Ručne korekcije u periodu', 'ctl.R6': 'Stavke čekaju mapiranje ili ponovni obračun',
    'ctl.colRule': 'Kontrolno pravilo', 'ctl.colVal': 'Vrednost', 'ctl.open': 'Otvoreno', 'ctl.ok': 'Pregledano', 'ctl.mark': 'Označi kao pregledano', 'ctl.markAll': 'Označi sve kao pregledano', 'ctl.sum': '{a} od {b} pregledano', 'ctl.marked': '{n} kontrola označeno kao pregledano',
    'ver.run': 'Pokretanje', 'ver.type': 'Vrsta', 'ver.t1': 'Obračun', 'ver.t2': 'Ponovni obračun', 'ver.scope': 'Obuhvat', 'ver.sch': 'Verzija šeme', 'ver.tg': 'Targeti', 'ver.cat': 'Katalog', 'ver.tot': 'Ukupno', 'ver.delta': 'Promena',
    'st.title': 'Obračunski list', 'st.calcInfo': 'Podaci o obračunu', 'st.items': 'Stavke ostvarenja', 'st.corr': 'Iznos na bonus', 'st.recalc1': 'Ponovni obračun zaposlenog'
  }, {
    'ob.title': 'Bonus calculation', 'ob.desc': 'Per-period flow: lock → calculate → variance review → send to employees. Every run keeps the scheme, target and catalogue versions it used.',
    'ob.colPer': 'Period', 'ob.colSch': 'Schemes', 'ob.colN': 'Staff', 'ob.colTot': 'Total (RSD)', 'ob.colAvg': 'Average', 'ob.colPend': 'Pending changes', 'ob.colStage': 'Stage',
    'ob.q': 'Quarter · advisors and managers', 'ob.m': 'Month · universal bankers', 'ob.lockOn': 'Lock {d}', 'ob.consTo': 'Consents until {d}', 'ob.paidOn': 'Paid {d}', 'ob.prelim': 'preliminary',
    'ob.tOv': 'Overview', 'ob.tSt': 'Statements', 'ob.tCtl': 'Variance review', 'ob.tVer': 'Versions and history',
    'ob.fLock': 'Lock', 'ob.fCalc': 'Calculate', 'ob.fCtl': 'Review', 'ob.fSend': 'Send', 'ob.fCons': 'Consent', 'ob.fPay': 'Payout',
    'ob.runNote': 'The period is in progress — amounts are preliminary, based on the projection to period end. Lock on {d}.',
    'ob.pend': '{n} changes await recalculation', 'ob.pendS': 'The period is locked; changes count only after recalculation. Employees whose amount changes receive the statement again for consent.',
    'ob.pMap': 'Code {c} mapped {d} — {n} items for {e} employees', 'ob.pCorr': 'Correction {k} · {e} · {r}', 'ob.recalc': 'Recalculate', 'ob.recalcT': 'Recalculation — {p}',
    'ob.scope': 'Scope', 'ob.scChanged': 'Employees with changes', 'ob.scChangedS': '{n} employees — recommended', 'ob.scEmp': 'Single', 'ob.scEmpS': 'One employee', 'ob.scBranch': 'Branch', 'ob.scBranchS': 'Everyone in a branch', 'ob.scAll': 'Whole period', 'ob.scAllS': 'All employees in the period',
    'ob.preview': 'Differences before confirming', 'ob.before': 'Now', 'ob.after': 'After', 'ob.diff': 'Difference', 'ob.noDiff': 'No amount changes in the chosen scope — the run is still recorded with a new version.', 'ob.why': 'Cause',
    'ob.reCons': 'Employees with a change receive the statement again for consent (status "Adjusted").', 'ob.run': 'Run recalculation', 'ob.done': 'Recalculation {p}: {n} employees changed, total {d}',
    'ob.kTot': 'Total payout', 'ob.kN': 'Staff', 'ob.kAvg': 'Average payout', 'ob.kCap': 'At limit', 'ob.kZero': 'No bonus', 'ob.kCarry': 'Balance carried', 'ob.kCorr': 'Manual corrections',
    'ob.bySch': 'By scheme', 'ob.byBr': 'By branch', 'ob.prevPer': 'Previous period', 'ob.colPay': 'Payout', 'ob.colPrev': 'Previous', 'ob.colFlags': 'Flags', 'ob.colCons': 'Consent',
    'fl.cap': 'Limit', 'fl.carry': 'Balance carried', 'fl.corr': 'Correction', 'fl.zero': 'No bonus', 'fl.reCalc': 'Adjusted',
    'ctl.R1': 'Change over 50% vs the previous period', 'ctl.R2': 'Payout capped by the scheme limit', 'ctl.R3': 'No bonus in the period', 'ctl.R4': 'Negative balance carried to the next period', 'ctl.R5': 'Manual corrections in the period', 'ctl.R6': 'Items await mapping or recalculation',
    'ctl.colRule': 'Control rule', 'ctl.colVal': 'Value', 'ctl.open': 'Open', 'ctl.ok': 'Reviewed', 'ctl.mark': 'Mark as reviewed', 'ctl.markAll': 'Mark all as reviewed', 'ctl.sum': '{a} of {b} reviewed', 'ctl.marked': '{n} checks marked as reviewed',
    'ver.run': 'Run', 'ver.type': 'Type', 'ver.t1': 'Calculation', 'ver.t2': 'Recalculation', 'ver.scope': 'Scope', 'ver.sch': 'Scheme version', 'ver.tg': 'Targets', 'ver.cat': 'Catalogue', 'ver.tot': 'Total', 'ver.delta': 'Change',
    'st.title': 'Statement', 'st.calcInfo': 'Calculation details', 'st.items': 'Achievement items', 'st.corr': 'Bonus amount', 'st.recalc1': 'Recalculate employee'
  });

  var LOCK = { '2026-Q4': '2027-01-05', '2026-10': '2026-11-03' };
  function run(pid) { return D.period(pid).status === 'u_toku'; }
  function staff(pid) { return EN.staffForPeriod(pid); }
  function res(e, pid) { return EN.result(e.id, pid, { project: run(pid) }) || { payout: 0 }; }
  function schemesOf(pid) { var seen = {}, out = []; staff(pid).forEach(function (e) { var x = schemeOf(e, pid); if (x && !seen[x.id]) { seen[x.id] = 1; out.push(x.id); } }); return out; }
  function schemeOf(e, pid) { return EN.schemeFor(e.id, pid) || D.scheme(D.positions[e.pos].scheme); }
  function total(pid) { return staff(pid).reduce(function (a, e) { return a + res(e, pid).payout; }, 0); }
  function prevPid(pid) { return EN.prevPeriods(pid, 1)[0] || null; }
  function corrAmt(r) { return r.corrections || (r.me && r.me.corrections) || 0; }
  function flags(r) { var f = []; if (r.capped || (r.me && r.me.capped)) f.push('cap'); if (r.carryOut) f.push('carry'); if (corrAmt(r)) f.push('corr'); if (!r.payout) f.push('zero'); return f; }
  function flagPills(r, e, pid) {
    var f = flags(r).map(function (k) { return ui.pill(t('fl.' + k), k === 'zero' || k === 'carry' ? 'danger' : k === 'cap' ? 'warning' : 'accent'); });
    if (e && EN.approval(e.id, pid).status === 'korigovano') f.push(ui.pill(t('fl.reCalc'), 'accent'));
    return f.join(' ') || '<span class="mut">—</span>';
  }

  /* ---------- izmene koje čekaju ponovni obračun ---------- */
  function pending(pid) {
    if (D.period(pid).status !== 'saglasnost') return { list: [], emps: [] };
    var mapped = IH.map('mapped'), byCode = {}, list = [], emps = {};
    D.allItems(pid).forEach(function (i) {
      if (i.status !== 'nemapirano' || !mapped[i.code] || EN.mappedView(i)) return;
      byCode[i.code] = byCode[i.code] || { n: 0, e: {} }; byCode[i.code].n++; byCode[i.code].e[i.emp] = 1; emps[i.emp] = 1;
    });
    Object.keys(byCode).forEach(function (c) { list.push({ kind: 'map', txt: t('ob.pMap', { c: c, d: F.dt(mapped[c].at), n: byCode[c].n, e: Object.keys(byCode[c].e).length }) }); });
    EN.allCorr().forEach(function (c) {
      if (c.period !== pid || EN.applies(c)) return;
      var who = c.kind === 'izmena' ? [c.item.emp].concat(c.changes.emp ? [c.changes.emp] : []) : [c.emp];
      who.forEach(function (x) { emps[x] = 1; });
      list.push({ kind: 'corr', txt: t('ob.pCorr', { k: c.id, e: who.map(function (x) { return IH.esc(D.emp(x).name); }).join(' → '), r: IH.esc(IH.L(reasonName(c.reason))) }) });
    });
    return { list: list, emps: Object.keys(emps) };
  }
  IH.pendingRecalc = pending;
  function reasonName(id) { var r = IH.codeItems('RAZLOG_KOREKCIJE').filter(function (x) { return x.id === id; })[0]; return r ? r.name : id; }

  /* ---------- simulacija ponovnog obračuna ---------- */
  function keysFor(pid, scope, arg) {
    if (scope === 'all') return ['*'];
    if (scope === 'emp') return [arg];
    if (scope === 'branch') return staff(pid).filter(function (e) { return e.branch === arg; }).map(function (e) { return e.id; });
    return pending(pid).emps;
  }
  function simulate(pid, keys) {
    var saved = JSON.stringify(IH.map('recalc')), stamp = IH.now(), rc = IH.map('recalc'), st = staff(pid);
    var before = {}; st.forEach(function (e) { before[e.id] = res(e, pid).payout; });
    var out = [];
    try {
      keys.forEach(function (k) { if (k === '*') rc[pid] = stamp; else rc[pid + '|' + k] = stamp; });
      EN.invalidate();
      st.forEach(function (e) { var a = res(e, pid).payout; if (a !== before[e.id]) out.push({ e: e, b: before[e.id], a: a }); });
    } finally { IH.state.data.recalc = JSON.parse(saved); EN.invalidate(); }
    return out;
  }
  function scopeState() { var f = IH.form; return { s: f.rc_scope || 'changed', emp: f.rc_emp, br: f.rc_br }; }
  function previewHtml(pid) {
    var sc = scopeState(), arg = sc.s === 'emp' ? (sc.emp || pending(pid).emps[0] || staff(pid)[0].id) : sc.s === 'branch' ? (sc.br || 'B01') : null;
    var diff = simulate(pid, keysFor(pid, sc.s, arg)), pend = pending(pid);
    if (!diff.length) return '<div class="note">' + t('ob.noDiff') + '</div>';
    var tb = diff.reduce(function (a, x) { return a + x.b; }, 0), ta = diff.reduce(function (a, x) { return a + x.a; }, 0);
    return ui.table([{ key: 'e', label: t('c.employee') }, { key: 'w', label: t('ob.why') }, { key: 'b', label: t('ob.before'), num: true }, { key: 'a', label: t('ob.after'), num: true }, { key: 'd', label: t('ob.diff'), num: true }],
      diff.map(function (x) {
        var why = x.e.pos === 'menadzer' ? IH.L({ sr: 'rezultat tima', en: 'team result' }) : pend.emps.indexOf(x.e.id) >= 0 ? IH.L({ sr: 'izmena stavki', en: 'item changes' }) : '—';
        return { e: IH.esc(x.e.name) + ' <span class="mut">· ' + IH.esc(D.branchShort(x.e.branch)) + '</span>', w: '<span class="mut">' + why + '</span>', b: F.num(x.b), a: '<b>' + F.num(x.a) + '</b>', d: '<b style="color:' + (x.a > x.b ? 'var(--success)' : 'var(--danger)') + '">' + (x.a > x.b ? '+' : '−') + F.num(Math.abs(x.a - x.b)) + '</b>' };
      }), { compact: true, foot: { e: t('c.total'), b: F.num(tb), a: F.num(ta), d: (ta >= tb ? '+' : '−') + F.num(Math.abs(ta - tb)) } }) + '<div class="hint" style="margin-top:8px">' + t('ob.reCons') + '</div>';
  }
  IH.act['rc-open'] = function (el) {
    var p = (el.dataset.arg || '').split('|'), pid = p[0];
    IH.form = { rc_scope: p[1] ? 'emp' : (pending(pid).emps.length ? 'changed' : 'all'), rc_emp: p[1] || null };
    IH.optHooks = IH.optHooks || {};
    IH.optHooks.rc_scope = function () { rcRefresh(pid); };
    var pe = pending(pid).emps;
    var body = '<div class="lab">' + t('ob.scope') + '</div>' + ui.opts('rc_scope', [{ v: 'changed', l: t('ob.scChanged'), s: t('ob.scChangedS', { n: pe.length }) }, { v: 'emp', l: t('ob.scEmp'), s: t('ob.scEmpS') }, { v: 'branch', l: t('ob.scBranch'), s: t('ob.scBranchS') }, { v: 'all', l: t('ob.scAll'), s: t('ob.scAllS') }], IH.form.rc_scope) +
      '<div class="form-grid" style="margin-top:10px"><div class="field"><label class="lab">' + t('c.employee') + '</label><select class="in" data-rcsel="emp">' + staff(pid).map(function (e) { var on = e.id === (IH.form.rc_emp || pe[0]); return '<option value="' + e.id + '"' + (on ? ' selected' : '') + '>' + IH.esc(e.name + ' · ' + D.branchShort(e.branch)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('c.branch') + '</label><select class="in" data-rcsel="br">' + D.branches.map(function (b) { return '<option value="' + b.id + '">' + IH.esc(D.branchName(b)) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="lab" style="margin-top:14px">' + t('ob.preview') + '</div><div id="rc-prev">' + previewHtml(pid) + '</div>';
    IH.modal({ title: t('ob.recalcT', { p: D.periodLabel(pid) }), wide: true, body: body, foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('ob.run'), { cls: 'primary', icon: 'refresh', act: 'rc-run', arg: pid }) });
  };
  function rcRefresh(pid) { IH.swap('rc-prev', previewHtml(pid)); }
  document.addEventListener('change', function (e) {
    var k = e.target.dataset && e.target.dataset.rcsel; if (!k) return;
    if (k === 'emp') { IH.form.rc_emp = e.target.value; IH.form.rc_scope = 'emp'; } else { IH.form.rc_br = e.target.value; IH.form.rc_scope = 'branch'; }
    document.querySelectorAll('[data-arg^="rc_scope|"]').forEach(function (o) { o.classList.toggle('on', o.dataset.arg === 'rc_scope|' + IH.form.rc_scope); });
    var btn = document.querySelector('[data-act="rc-run"]'); if (btn) rcRefresh(btn.dataset.arg);
  });
  IH.act['rc-run'] = function (el) {
    var pid = el.dataset.arg, sc = scopeState(), arg = sc.s === 'emp' ? (sc.emp || pending(pid).emps[0] || staff(pid)[0].id) : sc.s === 'branch' ? (sc.br || 'B01') : null;
    var keys = keysFor(pid, sc.s, arg), diff = simulate(pid, keys), stamp = IH.now(), rc = IH.map('recalc');
    keys.forEach(function (k) { if (k === '*') rc[pid] = stamp; else rc[pid + '|' + k] = stamp; });
    EN.invalidate();
    diff.forEach(function (x) { EN.setApproval(x.e.id, pid, { status: 'korigovano', at: stamp, prev: x.b, now: x.a }); });
    var delta = diff.reduce(function (a, x) { return a + x.a - x.b; }, 0);
    var scTxt = sc.s === 'emp' ? D.emp(arg).name : sc.s === 'branch' ? D.branchName(arg) : sc.s === 'all' ? t('ob.scAll') : t('ob.scChanged') + ' (' + keys.length + ')';
    IH.list('calcRuns').push({ pid: pid, at: stamp, by: IH.me().id, scope: scTxt, n: diff.length, delta: delta });
    IH.audit('calc', pid, { sr: 'Ponovni obračun ' + D.periodLabel(pid), en: 'Recalculation ' + D.periodLabel(pid) }, { sr: scTxt + ' · promena ' + F.num(delta) + ' RSD kod ' + diff.length + ' zaposlenih', en: scTxt + ' · change RSD ' + F.num(delta) + ' for ' + diff.length + ' employees' });
    var ex = IH.state.data.extraNotif = IH.state.data.extraNotif || {};
    diff.forEach(function (x) {
      if (x.e.id === D.personas.employee.emp) (ex.employee = ex.employee || []).push({ id: 'N-RC' + Date.now(), at: stamp, icon: 'calc', text: { sr: 'Obračun za ' + D.periodLabel(pid) + ' je korigovan: ' + F.num(x.b) + ' → ' + F.num(x.a) + ' RSD. Potrebna je ponovna saglasnost.', en: 'Your ' + D.periodLabel(pid) + ' statement was adjusted: RSD ' + F.num(x.b) + ' → ' + F.num(x.a) + '. Please consent again.' }, go: 'moj-obracun' });
      if (x.e.mgr === D.personas.manager.emp || x.e.id === D.personas.manager.emp) (ex.manager = ex.manager || []).push({ id: 'N-RCM' + x.e.id + Date.now(), at: stamp, icon: 'calc', text: { sr: 'Korigovan obračun ' + D.periodLabel(pid) + ': ' + x.e.name, en: 'Adjusted ' + D.periodLabel(pid) + ' statement: ' + x.e.name }, go: 'saglasnosti-tima' });
    });
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('ob.done', { p: D.periodLabel(pid), n: diff.length, d: (delta >= 0 ? '+' : '−') + F.rsd(Math.abs(delta)) }));
  };

  /* ================= LISTA PERIODA ================= */
  function stage(p) {
    if (p.status === 'u_toku') return t('ob.lockOn', { d: F.date(LOCK[p.id]) });
    if (p.status === 'saglasnost') return t('ob.consTo', { d: F.date(p.deadline) });
    return t('ob.paidOn', { d: F.date(p.paidAt) });
  }
  function pstPill(p) { return ui.pill(t('pst.' + p.status), p.status === 'u_toku' ? 'accent' : p.status === 'saglasnost' ? 'warning' : 'gray'); }
  function listPage() {
    var order = { u_toku: 0, saglasnost: 1, isplaceno: 2 };
    var rows = D.periods.slice().sort(function (a, b) { return (order[a.status] - order[b.status]) || (a.from < b.from ? 1 : -1); });
    var grid = IH.grid({
      id: 'obr', exportName: 'Obracun_po_periodima.xlsx', searchLabel: IH.L({ sr: 'Period', en: 'Period' }),
      rows: function () { return rows; }, key: function (p) { return p.id; }, label: function (p) { return D.periodLabel(p.id); }, searchKeys: ['p'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (p) { return t('pst.' + p.status); }, fval: function (p) { return p.status; }, render: function (p) { return pstPill(p); }, filter: function () { return ['u_toku', 'saglasnost', 'isplaceno'].map(function (k) { return { v: k, l: t('pst.' + k) }; }); } },
        { key: 'p', label: t('ob.colPer'), val: function (p) { return D.periodLabel(p.id); }, fval: function (p) { return p.type; }, render: function (p) { return '<b>' + D.periodLabel(p.id) + '</b>'; }, filter: function () { return [{ v: 'Q', l: t('per.Q') }, { v: 'M', l: t('per.M') }]; } },
        { key: 'ty', label: t('c.type'), search: false, val: function (p) { return t('ob.' + p.type.toLowerCase()); } },
        { key: 'stg', label: t('ob.colStage'), search: false, val: function (p) { return stage(p); } },
        { key: 's', label: t('ob.colSch'), search: false, val: function (p) { return schemesOf(p.id).map(function (s) { return D.scheme(s).code; }).join(', '); } },
        { key: 'n', label: t('ob.colN'), num: true, search: false, val: function (p) { return staff(p.id).length; } },
        { key: 'tot', label: t('ob.colTot'), num: true, search: false, val: function (p) { return total(p.id); }, render: function (p) { return F.num(total(p.id)) + (run(p.id) ? ' <span class="mut">(' + t('ob.prelim') + ')</span>' : ''); } },
        { key: 'pend', label: t('ob.colPend'), num: true, search: false, val: function (p) { return pending(p.id).list.length; }, render: function (p) { var n = pending(p.id).list.length; return n ? ui.pill(n, 'warning') : '<span class="mut">0</span>'; } },
      ],
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (p) { return 'obracun/' + p.id; } }, { icon: 'refresh', title: t('ob.recalc'), act: 'rc-open', kind: 'acc', arg: function (p) { return p.id; }, show: function (p) { return p.status === 'saglasnost'; } }]
    });
    return ui.header(t('ob.title')) + grid;
  }

  /* ================= DETALJ PERIODA ================= */
  function flowFor(p) {
    if (p.status === 'u_toku') return ui.flow([{ label: t('ob.fLock'), sub: F.date(LOCK[p.id]), state: 'run' }, { label: t('ob.fCalc') }, { label: t('ob.fCtl') }, { label: t('ob.fSend') }, { label: t('ob.fCons') }, { label: t('ob.fPay') }]);
    var paid = p.status === 'isplaceno';
    var lock = p.lockedAt || p.to + 'T18:00', calc = p.calcAt || p.to, sent = p.sentAt || p.to;
    var ctlOk = ctlRows(p.id).filter(function (r) { return r.ok; }).length, ctlN = ctlRows(p.id).length;
    return ui.flow([{ label: t('ob.fLock'), sub: F.date(lock), state: 'done' }, { label: t('ob.fCalc'), sub: F.date(calc), state: 'done' }, { label: t('ob.fCtl'), sub: t('ctl.sum', { a: ctlOk, b: ctlN }), state: paid || ctlOk === ctlN ? 'done' : 'run' }, { label: t('ob.fSend'), sub: F.date(sent), state: 'done' }, { label: t('ob.fCons'), sub: paid ? '100%' : t('ob.consTo', { d: F.date(p.deadline) }), state: paid ? 'done' : 'run' }, { label: t('ob.fPay'), sub: paid ? F.date(p.paidAt) : '—', state: paid ? 'done' : '' }]);
  }
  function overviewTab(pid) {
    var st = staff(pid), rs = st.map(function (e) { return { e: e, r: res(e, pid) }; }), tot = rs.reduce(function (a, x) { return a + x.r.payout; }, 0);
    var cap = rs.filter(function (x) { return flags(x.r).indexOf('cap') >= 0; }).length, zero = rs.filter(function (x) { return !x.r.payout; }).length;
    var carry = rs.filter(function (x) { return x.r.carryOut; }), corr = rs.reduce(function (a, x) { return a + corrAmt(x.r); }, 0);
    var kp = '<div class="kpis">' + ui.kpi(t('ob.kTot'), F.num(tot) + '<span class="u">RSD</span>', (run(pid) ? t('ob.prelim') + ' · ' : '') + st.length + ' ' + t('ob.kN').toLowerCase(), { hl: true }) + ui.kpi(t('ob.kAvg'), F.num(st.length ? tot / st.length : 0) + '<span class="u">RSD</span>') +
      ui.kpi(t('ob.kCap'), cap) + ui.kpi(t('ob.kZero'), zero) + ui.kpi(t('ob.kCarry'), carry.length, carry.length ? F.rsd(carry.reduce(function (a, x) { return a + x.r.carryOut; }, 0)) : null) + ui.kpi(t('ob.kCorr'), (corr >= 0 ? '' : '−') + F.num(Math.abs(corr)) + '<span class="u">RSD</span>', null, { go: 'korekcije' }) + '</div>';
    var pp = prevPid(pid);
    var bySch = schemesOf(pid).map(function (sid) {
      var x = D.scheme(sid), mine = rs.filter(function (q) { return schemeOf(q.e, pid).id === sid; }), s = mine.reduce(function (a, q) { return a + q.r.payout; }, 0);
      return { s: '<b>' + IH.esc(IH.L(x.name)) + '</b> <span class="mut">v' + D.schemeVersion(x, pid).v + '</span>', n: mine.length, t: F.num(s), a: F.num(mine.length ? s / mine.length : 0), c: mine.filter(function (q) { return flags(q.r).indexOf('cap') >= 0; }).length };
    });
    var byBr = D.branches.map(function (b) {
      var mine = rs.filter(function (q) { return q.e.branch === b.id; }), s = mine.reduce(function (a, q) { return a + q.r.payout; }, 0);
      var ps = pp ? staff(pp).filter(function (e) { return e.branch === b.id; }).reduce(function (a, e) { return a + res(e, pp).payout; }, 0) : 0;
      var d = ps ? s / ps - 1 : 0;
      return { b: '<b>' + IH.esc(D.branchShort(b)) + '</b>', n: mine.length, t: F.num(s), p: ps ? F.num(ps) : '—', d: ps ? '<span style="color:' + (Math.abs(d) > 0.25 ? 'var(--warning)' : 'var(--ink-2)') + '">' + (d >= 0 ? '+' : '') + F.pct(d, 1) + '</span>' : '—', _go: 'obracun/' + pid + '/listovi' };
    });
    return kp + ui.card(t('ob.bySch'), ui.table([{ key: 's', label: t('c.scheme') }, { key: 'n', label: t('ob.colN'), num: true }, { key: 't', label: t('ob.colTot'), num: true }, { key: 'a', label: t('ob.colAvg'), num: true }, { key: 'c', label: t('ob.kCap'), num: true }], bySch, { compact: true }), { flush: true }) + ui.card(t('ob.byBr'), ui.table([{ key: 'b', label: t('c.branch') }, { key: 'n', label: t('ob.colN'), num: true }, { key: 't', label: D.periodLabel(pid), num: true }, { key: 'p', label: pp ? D.periodLabel(pp) : t('ob.prevPer'), num: true }, { key: 'd', label: t('ob.diff'), num: true }], byBr, { compact: true }), { flush: true });
  }
  function stTab(pid) {
    var pp = prevPid(pid);
    return IH.grid({
      id: 'obl-' + pid, exportName: 'Obracunski_listovi_' + pid + '.xlsx', searchLabel: IH.L({ sr: 'Ime ili HR broj', en: 'Name or HR number' }), hidden: ['hr'],
      rows: function () { return staff(pid); }, key: function (e) { return e.id; }, label: function (e) { return e.name; }, searchKeys: ['e', 'hr'],
      cols: [
        { key: 'e', label: t('c.employee'), val: function (e) { return e.name; }, render: function (e) { return '<b>' + IH.esc(e.name) + '</b>'; } },
        { key: 'pos', label: t('c.position'), val: function (e) { return D.posName(e.pos); } },
        { key: 'hr', label: 'HR', val: function (e) { return e.hr; } },
        { key: 'b', label: t('c.branch'), val: function (e) { return D.branchShort(e.branch); }, fval: function (e) { return e.branch; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchName(b) }; }); } },
        { key: 's', label: t('c.scheme'), val: function (e) { return schemeOf(e, pid).code; }, filter: function () { return schemesOf(pid).map(function (s) { return { v: D.scheme(s).code, l: D.scheme(s).code }; }); } },
        { key: 'pay', label: t('ob.colPay'), num: true, search: false, val: function (e) { return res(e, pid).payout; }, render: function (e) { return '<b>' + F.num(res(e, pid).payout) + '</b>'; } },
        { key: 'prev', label: pp ? D.periodLabel(pp) : t('ob.colPrev'), num: true, search: false, val: function (e) { return pp ? res(e, pp).payout : 0; }, render: function (e) { if (!pp || e.since > D.period(pp).to) return '<span class="mut">—</span>'; var a = res(e, pid).payout, b = res(e, pp).payout; return F.num(b) + (b ? ' <span style="color:' + (a >= b ? 'var(--success)' : 'var(--danger)') + '">' + (a >= b ? '+' : '') + F.pct(a / b - 1, 0) + '</span>' : ''); } },
        { key: 'fl', label: t('ob.colFlags'), search: false, sort: false, val: function (e) { return flags(res(e, pid)).join(' '); }, fval: function (e) { return flags(res(e, pid)); }, render: function (e) { return flagPills(res(e, pid), e, pid); }, filter: function () { return ['cap', 'carry', 'corr', 'zero'].map(function (k) { return { v: k, l: t('fl.' + k) }; }); } },
        { key: 'c', label: t('ob.colCons'), val: function (e) { return t('st.' + EN.approval(e.id, pid).status); }, fval: function (e) { return EN.approval(e.id, pid).status; }, render: function (e) { return IH.ui.status(EN.approval(e.id, pid).status); }, filter: function () { return ['ceka', 'saglasan', 'auto', 'prigovor', 'korigovano', 'isplaceno', 'u_toku'].map(function (k) { return { v: k, l: t('st.' + k) }; }); } }
      ],
      actions: [
        { type: 'details', title: t('st.title'), act: 'g-go', arg: function (e) { return 'obracun/' + pid + '/' + e.id; } },
        { icon: 'refresh', title: t('st.recalc1'), act: 'rc-open', kind: 'acc', arg: function (e) { return pid + '|' + e.id; }, show: function () { return D.period(pid).status === 'saglasnost'; } }
      ]
    });
  }

  /* ---------- kontrola odstupanja ---------- */
  function ctlRows(pid) {
    var out = [], pp = prevPid(pid), ok = IH.map('ctrlOk');
    staff(pid).forEach(function (e) {
      var r = res(e, pid);
      if (pp && e.since <= D.period(pp).from) { var b = res(e, pp).payout; if (b > 0 && Math.abs(r.payout / b - 1) > 0.5) out.push({ k: 'R1', e: e, v: F.num(b) + ' → ' + F.num(r.payout) + ' (' + (r.payout >= b ? '+' : '') + F.pct(r.payout / b - 1, 0) + ')' }); }
      if (flags(r).indexOf('cap') >= 0) out.push({ k: 'R2', e: e, v: F.num(r.beforeCap || (r.me && r.me.raw) || 0) + ' → ' + F.num(r.payout) });
      if (!r.payout) out.push({ k: 'R3', e: e, v: '0' });
      if (r.carryOut) out.push({ k: 'R4', e: e, v: F.rsd(r.carryOut) });
      if (corrAmt(r)) out.push({ k: 'R5', e: e, v: (corrAmt(r) > 0 ? '+' : '') + F.num(corrAmt(r)) });
      if (e.pos !== 'menadzer') { var w = IH.itemRows(e.id, pid).filter(function (x) { return x.st === 'nemapirano' || x.st === 'ceka'; }).length; if (w) out.push({ k: 'R6', e: e, v: IH.L({ sr: w + ' stavki', en: w + ' items' }) }); }
    });
    out.forEach(function (x) { x.id = pid + '|' + x.k + '|' + x.e.id; x.ok = ok[x.id] || null; });
    return out;
  }
  function ctlTab(pid) {
    var rows = ctlRows(pid), open = rows.filter(function (r) { return !r.ok; }).length;
    return IH.sech(t('ob.tCtl') + ' — ' + t('ctl.sum', { a: rows.length - open, b: rows.length }), '', open ? ui.btn(t('ctl.markAll'), { cls: 'sm', icon: 'checkc', act: 'ctl-all', arg: pid }) : '') + IH.grid({
      id: 'ctl-' + pid, exportName: 'Kontrola_odstupanja_' + pid + '.xlsx', searchLabel: IH.L({ sr: 'Zaposleni', en: 'Employee' }),
      rows: function () { return ctlRows(pid); }, key: function (r) { return r.id; }, label: function (r) { return r.e.name; }, searchKeys: ['e'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (r) { return r.ok ? 1 : 0; }, fval: function (r) { return r.ok ? 'ok' : 'open'; }, render: function (r) { return r.ok ? ui.pill(t('ctl.ok'), 'success') : ui.pill(t('ctl.open'), 'warning'); }, filter: function () { return [{ v: 'open', l: t('ctl.open') }, { v: 'ok', l: t('ctl.ok') }]; } },
        { key: 'k', label: t('ctl.colRule'), val: function (r) { return t('ctl.' + r.k); }, fval: function (r) { return r.k; }, filter: function () { return ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map(function (k) { return { v: k, l: t('ctl.' + k) }; }); } },
        { key: 'e', label: t('c.employee'), val: function (r) { return r.e.name; } },
        { key: 'b', label: t('c.branch'), val: function (r) { return D.branchShort(r.e.branch); } },
        { key: 'v', label: t('ctl.colVal'), num: true, search: false, val: function (r) { return r.v; } }
      ],
      actions: [{ type: 'details', title: t('st.title'), act: 'g-go', arg: function (r) { return 'obracun/' + pid + '/' + r.e.id; } }, { icon: 'check', title: t('ctl.mark'), act: 'ctl-ok', kind: 'acc', show: function (r) { return !r.ok; } }]
    });
  }
  IH.act['ctl-ok'] = function (el) { IH.map('ctrlOk')[el.dataset.arg] = { at: IH.now(), by: IH.me().id }; IH.save(); IH.render(); };
  IH.act['ctl-all'] = function (el) {
    var pid = el.dataset.arg, rows = ctlRows(pid).filter(function (r) { return !r.ok; }), ok = IH.map('ctrlOk'), now = IH.now();
    rows.forEach(function (r) { ok[r.id] = { at: now, by: IH.me().id }; });
    IH.audit('calc', pid, { sr: 'Kontrola odstupanja završena', en: 'Variance review completed' }, { sr: rows.length + ' kontrola', en: rows.length + ' checks' });
    IH.render(); IH.toast(t('ctl.marked', { n: rows.length }));
  };

  /* ---------- verzije ---------- */
  function verTab(pid) {
    var p = D.period(pid), runs = IH.list('calcRuns').filter(function (r) { return r.pid === pid; });
    var sum = runs.reduce(function (a, r) { return a + r.delta; }, 0), cur = total(pid);
    var schTxt = schemesOf(pid).map(function (s) { var x = D.scheme(s); return x.code + ' v' + D.schemeVersion(x, pid).v; }).join(', ');
    var tgTxt = p.type === 'Q' ? IH.L({ sr: 'Dodela ' + D.periodLabel(pid) + ' · v1', en: D.periodLabel(pid) + ' assignment · v1' }) : IH.L({ sr: 'Timski targeti ' + D.periodLabel(pid), en: 'Team targets ' + D.periodLabel(pid) });
    var catTxt = 'v' + p.to.slice(0, 7).replace('-', '.') + ' · ' + D.products.filter(function (x) { return x.status === 'aktivan'; }).length + IH.L({ sr: ' proizvoda', en: ' products' });
    var rows = [{ r: '#1', at: F.dt(p.calcAt || p.to + 'T09:00'), ty: t('ver.t1'), sc: t('ob.scAll'), s: schTxt, tg: tgTxt, c: catTxt, by: IH.esc(D.emp('A001').name), t: F.num(cur - sum), d: '—' }]
      .concat(runs.map(function (r, i) { return { r: '#' + (i + 2), at: F.dt(r.at), ty: t('ver.t2'), sc: IH.esc(r.scope), s: schTxt, tg: tgTxt, c: catTxt + IH.L({ sr: ' (mapiranja do ', en: ' (mappings to ' }) + F.date(r.at) + ')', by: IH.esc(D.emp(r.by).name), t: F.num(cur - runs.slice(i + 1).reduce(function (a, q) { return a + q.delta; }, 0)), d: '<b style="color:' + (r.delta >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + (r.delta >= 0 ? '+' : '−') + F.num(Math.abs(r.delta)) + '</b> <span class="mut">(' + r.n + IH.L({ sr: ' zaposl.', en: ' staff' }) + ')</span>' }; }));
    return ui.card(t('ob.tVer'), ui.table([{ key: 'r', label: t('ver.run') }, { key: 'at', label: t('c.date') }, { key: 'ty', label: t('ver.type') }, { key: 'sc', label: t('ver.scope') }, { key: 's', label: t('ver.sch') }, { key: 'tg', label: t('ver.tg') }, { key: 'c', label: t('ver.cat') }, { key: 'by', label: t('ld.colBy') }, { key: 't', label: t('ver.tot'), num: true }, { key: 'd', label: t('ver.delta'), num: true }], rows.reverse(), { compact: true }), { flush: true }) +
      ui.card(t('c.history'), ui.hist(IH.auditFor('calc', pid).concat(p.sentAt ? [{ at: p.sentAt, by: 'A001', action: { sr: 'Obračunski listovi poslati zaposlenima', en: 'Statements sent to employees' } }] : []).concat(p.calcAt ? [{ at: p.calcAt, by: 'A001', action: { sr: 'Obračun pokrenut (run #1)', en: 'Calculation run #1' } }] : []).concat(p.lockedAt ? [{ at: p.lockedAt, by: 'A001', action: { sr: 'Period zaključan — nove stavke idu u naredni period ili kroz korekciju', en: 'Period locked — new items go to the next period or via correction' } }] : [])));
  }

  function periodPage(pid, tab) {
    var p = D.period(pid);
    var pend = pending(pid);
    var acts = (p.status === 'saglasnost' ? ui.btn(t('ob.recalc'), { cls: pend.list.length ? 'primary' : '', icon: 'refresh', act: 'rc-open', arg: pid }) : '') + ui.btn(t('c.export'), { icon: 'download', act: 'export', arg: 'Obracun_' + pid + '.xlsx' });
    var head = ui.header(D.periodLabel(pid) + ' ' + pstPill(p) + ' <span class="mut" style="font-size:13px;font-weight:400">' + stage(p) + '</span>', '', acts, '<a href="#/obracun">' + t('ob.title') + '</a> ' + ic('chevr') + ' ' + D.periodLabel(pid));
    var banner = '';
    if (run(pid)) banner = '<div class="note" style="margin-bottom:14px">' + t('ob.runNote', { d: F.date(LOCK[pid]) }) + '</div>';
    if (pend.list.length) banner = '<section class="card" style="border-color:var(--warning-line);background:var(--warning-soft)"><div class="cb" style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap"><span class="ai" style="width:36px;height:36px;border-radius:9px;display:grid;place-items:center;background:var(--card);color:var(--warning)">' + ic('alert') + '</span><div style="flex:1;min-width:260px"><b>' + t('ob.pend', { n: pend.list.length }) + '</b><div class="mut" style="margin:2px 0 6px">' + t('ob.pendS') + '</div><ul style="margin:0;padding-left:18px">' + pend.list.map(function (x) { return '<li>' + x.txt + '</li>'; }).join('') + '</ul></div>' + ui.btn(t('ob.recalc'), { cls: 'primary', icon: 'refresh', act: 'rc-open', arg: pid }) + '</div></section>';
    var ctlOpen = ctlRows(pid).filter(function (r) { return !r.ok; }).length;
    var tabs = ui.rtabs('obracun/' + pid, [{ id: '', label: t('ob.tOv') }, { id: 'listovi', label: t('ob.tSt'), cnt: staff(pid).length }].concat(run(pid) ? [] : [{ id: 'kontrola', label: t('ob.tCtl'), cnt: ctlOpen || null, warn: true }, { id: 'verzije', label: t('ob.tVer') }]), tab);
    var body = tab === 'listovi' ? stTab(pid) : tab === 'kontrola' ? ctlTab(pid) : tab === 'verzije' ? verTab(pid) : overviewTab(pid);
    return head + ui.card('', flowFor(p)) + banner + tabs + body;
  }

  function stmtHist(pid, empId) {
    var p = D.period(pid), ap = EN.approval(empId, pid), h = [];
    if (ap.status === 'korigovano') h.push({ at: ap.at, by: 'A001', action: { sr: 'Ponovni obračun: ' + F.num(ap.prev) + ' → ' + F.num(ap.now) + ' RSD — čeka ponovnu saglasnost', en: 'Recalculation: RSD ' + F.num(ap.prev) + ' → ' + F.num(ap.now) + ' — awaiting re-consent' } });
    else if (ap.at && ap.status !== 'isplaceno') h.push({ at: ap.at, by: ap.status === 'auto' ? null : empId, action: { sr: 'Saglasnost: ' + t('st.' + ap.status), en: 'Consent: ' + t('st.' + ap.status) } });
    EN.allCorr().filter(function (c) { return c.period === pid && (c.emp === empId || (c.changes && c.changes.emp === empId)); }).forEach(function (c) { h.push({ at: c.at, by: c.by, action: { sr: 'Korekcija ' + c.id, en: 'Correction ' + c.id }, detail: c.note }); });
    if (p.paidAt) h.push({ at: p.paidAt + 'T10:00', by: 'A001', action: { sr: 'Isplaćeno kroz obračun zarada', en: 'Paid through payroll' } });
    if (p.sentAt) h.push({ at: p.sentAt, by: 'A001', action: { sr: 'Obračunski list poslat zaposlenom', en: 'Statement sent to the employee' } });
    if (p.calcAt) h.push({ at: p.calcAt, by: 'A001', action: { sr: 'Obračun #1', en: 'Calculation run #1' } });
    if (run(pid)) h.push({ at: D.LAST_LOAD, by: null, action: { sr: 'Preliminarni obračun posle noćnog uvoza', en: 'Preliminary calculation after nightly import' } });
    return h.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  }
  /* ---------- obračunski list ---------- */
  function stmtPage(pid, empId) {
    var e = D.emp(empId), p = D.period(pid), r = res(e, pid), ap = EN.approval(empId, pid), s = schemeOf(e, pid);
    var crumb = '<a href="#/obracun">' + t('ob.title') + '</a> ' + ic('chevr') + ' <a href="#/obracun/' + pid + '/listovi">' + D.periodLabel(pid) + '</a> ' + ic('chevr') + ' ' + IH.esc(e.name);
    var acts = (e.pos !== 'menadzer' ? ui.btn(t('st.items'), { icon: 'activity', go: 'ostvarenje/' + e.branch + '/' + e.id }) : '') + (p.status !== 'isplaceno' ? ui.btn(t('st.corr'), { icon: 'edit', act: 'kor-new-for', arg: empId + '|' + pid }) : '') + (p.status === 'saglasnost' ? ui.btn(t('st.recalc1'), { cls: 'primary', icon: 'refresh', act: 'rc-open', arg: pid + '|' + empId }) : '');
    var runs = IH.list('calcRuns').filter(function (x) { return x.pid === pid; });
    var lastRun = runs.length ? runs[runs.length - 1] : null;
    var info = '<dl class="kv"><dt>' + t('c.scheme') + '</dt><dd>' + s.code + ' · v' + D.schemeVersion(s, pid).v + '</dd><dt>' + t('ver.tg') + '</dt><dd>' + (p.type === 'Q' ? IH.L({ sr: 'Dodela ' + D.periodLabel(pid) + ' · v1', en: D.periodLabel(pid) + ' assignment · v1' }) : IH.L({ sr: 'Timski targeti', en: 'Team targets' })) + '</dd><dt>' + t('ver.cat') + '</dt><dd>v' + p.to.slice(0, 7).replace('-', '.') + '</dd>' +
      '<dt>' + t('ver.run') + '</dt><dd>' + (run(pid) ? t('ob.prelim') : lastRun && EN.recalcAt(pid, empId) ? '#' + (runs.length + 1) + ' · ' + F.dt(EN.recalcAt(pid, empId)) : '#1 · ' + F.dt(p.calcAt || p.to + 'T09:00')) + '</dd><dt>' + t('ob.colCons') + '</dt><dd>' + IH.ui.status(ap.status) + (ap.prev != null ? ' <span class="mut">' + F.num(ap.prev) + ' → ' + F.num(ap.now) + '</span>' : '') + '</dd></dl>';
    var kp = '<div class="kpis" style="margin-bottom:14px">' + ui.kpi(run(pid) ? IH.L({ sr: 'Projektovano', en: 'Projected' }) : t('ob.colPay'), F.num(r.payout) + '<span class="u">RSD</span>', D.periodLabel(pid), { hl: true }) + ui.kpi(t('ob.colFlags'), flagPills(r, e, pid)) + ui.kpi(t('ob.colCons'), IH.ui.status(ap.status), ap.at ? F.dt(ap.at) : null) + '</div>';
    return ui.header(t('st.title') + ' — ' + IH.esc(e.name), '', acts, crumb) + kp +
      '<div class="grid g-main">' + ui.card(IH.esc(IH.L(s.name)) + ' · ' + D.periodLabel(pid), IH.stmtBody(empId, pid, { project: run(pid) }), { flush: true }) + '<div>' + ui.card(t('st.calcInfo'), info) + ui.card(t('c.history'), ui.hist(stmtHist(pid, empId))) + '</div></div>';
  }

  IH.route('obracun', {
    title: function () { return t('ob.title'); },
    render: function (p) {
      if (!p[0] || !D.period(p[0])) return listPage();
      if (p[1] && D.emp(p[1])) return stmtPage(p[0], p[1]);
      return periodPage(p[0], ['listovi', 'kontrola', 'verzije'].indexOf(p[1]) >= 0 ? p[1] : '');
    }
  });
})();
