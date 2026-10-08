/* Incentive Hub — Moji targeti (Zaposleni): koliko sam od targeta, kako se meri, šta vredi */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, R = IH.rules, L = D.L2;

  IH.addStrings({
    'mt.title': 'Moji targeti', 'mt.asg': 'Šema {s} · v{v} · važi od {d}', 'mt.measure': 'Kako se meri', 'mt.cond': 'Priznaje se ako', 'mt.subj': 'Proizvodi koji ulaze',
    'mt.scale': 'Skala isplate', 'mt.value': 'Vrednost za bonus', 'mt.share': 'Udeo u bonusu', 'mt.at100': 'Bonus na 100%', 'mt.perSale': 'Provizija po prodaji', 'mt.now': 'Sada', 'mt.proj': 'Projekcija', 'mt.final': 'Konačno',
    'mt.exc': 'Izuzetak: {r}', 'mt.rules': 'Ostala pravila šeme', 'mt.limit': 'Najviši iznos isplate po periodu: {l}.', 'mt.carry': 'Negativan saldo ne ide u isplatu, već se oduzima od sledećeg pozitivnog obračuna.',
    'mt.cont': 'Kontinuitet: +{a} ako je {k} ≥ {m} {n} perioda zaredom.', 'mt.team': 'Timski targeti — {p}', 'mt.myShare': 'Moje prodaje'
  }, {
    'mt.title': 'My targets', 'mt.asg': 'Scheme {s} · v{v} · valid from {d}', 'mt.measure': 'How it is measured', 'mt.cond': 'Recognised if', 'mt.subj': 'Products included',
    'mt.scale': 'Payout scale', 'mt.value': 'Value for bonus', 'mt.share': 'Share of bonus', 'mt.at100': 'Bonus at 100%', 'mt.perSale': 'Commission per sale', 'mt.now': 'Now', 'mt.proj': 'Projection', 'mt.final': 'Final',
    'mt.exc': 'Exception: {r}', 'mt.rules': 'Other scheme rules', 'mt.limit': 'Maximum payout per period: {l}.', 'mt.carry': 'A negative balance is not paid out; it is deducted from the next positive calculation.',
    'mt.cont': 'Continuity: +{a} if {k} ≥ {m} for {n} periods in a row.', 'mt.team': 'Team targets — {p}', 'mt.myShare': 'My sales'
  });

  function fmtVal(x, unit) { return !x ? '—' : x.k === 'pct' ? F.num(x.v * 100, 2) + '% ' + IH.L(L('iznosa', 'of amount')) : F.rsd(x.v) + ' / ' + (unit === 'bod' ? t('u.bod1') : t('u.kom')); }
  function scaleHtml(sc, cur) {
    if (sc.type === 'linear') { var a0 = cur != null && cur < sc.min, a2 = cur != null && cur >= sc.cap, a1 = cur != null && !a0 && !a2; return '<div class="scale"><div class="sc' + (a0 ? ' on' : '') + '"><b>0%</b>&lt; ' + F.pct(sc.min) + '</div><div class="sc' + (a1 ? ' on' : '') + '"><b>' + (a1 ? F.pct(cur) : '=') + '</b>' + F.pct(sc.min) + '–' + F.pct(sc.cap) + '</div><div class="sc' + (a2 ? ' on' : '') + '"><b>' + F.pct(sc.cap) + '</b>≥ ' + F.pct(sc.cap) + '</div></div>'; }
    var lo = 0; return '<div class="scale">' + sc.map(function (b) { var on = cur != null && cur >= lo && (b.to == null || cur < b.to); var lbl = b.to == null ? '≥ ' + F.pct(lo) : F.pct(lo) + '–' + F.pct(b.to - 0.0001); lo = b.to; return '<div class="sc' + (on ? ' on' : '') + '"><b>' + F.pct(b.f) + '</b>' + lbl + '</div>'; }).join('') + '</div>'; }
  function prodsOf(tg) { return D.subjProducts(tg.subject); }

  function page() {
    var me = IH.me(), v = IH.v('mt');
    if (me.pos === 'univerzalni') return teamPage(me);
    var per = v.per || EN.currentPeriod(me.id), p = D.period(per), running = p.status === 'u_toku';
    var now = EN.result(me.id, per), pr = running ? EN.result(me.id, per, { project: true }) : now;
    if (now.noScheme) return ui.header(t('mt.title')) + '<div class="empty">' + IH.L(L('Bez raspoređene šeme', 'No scheme assigned')) + '</div>';
    var s = D.schemeAt(D.scheme(now.scheme), per), ver = s.ver;
    var a = EN.assignmentFor(me.id, per);
    var h = ui.header(t('mt.title'), '', ui.segf('mt', 'per', ['2026-Q4', '2026-Q3', '2026-Q2'].map(function (x) { return { v: x, l: D.periodLabel(x) + (x === '2026-Q4' ? ' · ' + t('st.u_toku').toLowerCase() : '') }; })), IH.esc(IH.L(s.name)) + ' · v' + ver.v + (a ? ' · ' + IH.L(L('važi od ', 'valid from ')) + F.date(a.from) : '') + (running ? ' · ' + t('c.day', { d: D.daysInfo(per).done, t: D.daysInfo(per).total }) : ''));
    h += '<div class="tcards">' + now.targets.map(function (x) { var nb = EN.nextBand(s.scale, x.pct); return ui.targetCard({ name: IH.L(x.name), ach: Math.round(x.ach), target: x.target, unit: x.unit, pct: x.pct, next: nb, nextNone: !nb }); }).join('') + '</div>';
    now.targets.forEach(function (x, i) {
      var tg = D.targetAt(x.id, per), pp = pr.targets[i], cur = running ? pp.pct : x.pct;
      var left = '<div class="lab">' + t('mt.measure') + '</div><div style="margin-bottom:10px">' + IH.esc(R.formulaText(tg.formula, tg.subject)) + '</div>' +
        ((tg.conds || []).length ? '<div class="lab">' + t('mt.cond') + '</div><ul class="rulelist" style="margin:0 0 10px">' + tg.conds.map(function (c) { return '<li>' + IH.esc(R.condText(c)) + '</li>'; }).join('') + '</ul>' : '') +
        (tg.unit === 'bod' ? '<div class="lab">' + IH.L(L('Komadi i bodovi', 'Pieces and points')) + '</div>' + IH.ptsBreakdown(tg, me.id, per) : '<div class="lab">' + t('mt.subj') + '</div><div>' + prodsOf(tg).map(function (q) { return '<span class="tag">' + IH.esc(D.productName(q)) + '</span>'; }).join('') + '</div>');
      var mid = '<div style="display:flex;align-items:baseline;gap:6px"><b style="font-size:22px">' + F.unitShort(x.ach, x.unit) + '</b><span class="mut">' + t('h.of') + ' ' + F.unit(x.target, x.unit) + '</span></div>' +
        ui.bar(x.pct, { max: 1, marker: running ? D.elapsed(per) : null, cls: running ? (x.pct >= D.elapsed(per) ? 'ok' : 'warn') : undefined }) +
        '<div class="mini-kv" style="margin-top:8px"><span>' + t('mt.now') + ': <b>' + F.pct(x.pct) + '</b></span>' + (running ? '<span>' + t('mt.proj') + ': <b>' + F.pct(pp.pct) + '</b></span>' : '<span>' + t('mt.final') + ': <b>' + F.pct(x.pct) + '</b></span>') + '</div>' +
        (x.nWait ? '<div class="mut" style="margin-top:6px">' + IH.L(L('Čeka uslov priznavanja: ', 'Awaiting recognition condition: ')) + '<b>' + x.nWait + '</b></div>' : '') +
        (x.exception ? '<div class="note warn" style="margin:8px 0 0">' + t('mt.exc', { r: IH.esc(IH.L(x.exception.reason)) }) + '</div>' : '') +
        '<div class="lab" style="margin-top:12px">' + t('mt.scale') + '</div>' + scaleHtml(s.scale, cur) + '<div class="hint" style="margin-top:6px">' + IH.schemeScaleText(s.scale) + '</div>';
      var right = '<div class="lab">' + t('mt.value') + '</div>' + (s.type === 'provizija' ? '<dl class="kv"><dt>' + t('mt.perSale') + '</dt><dd>' + fmtVal(x.val, x.unit) + '</dd><dt>' + t('mt.now') + '</dt><dd>' + F.rsd(x.value) + ' × ' + F.pct(x.ponder) + '</dd></dl>' : '<dl class="kv"><dt>' + t('mt.share') + '</dt><dd>' + F.pct(x.share) + '</dd><dt>' + t('mt.at100') + '</dt><dd>' + F.rsd(x.value) + '</dd><dt>' + t('mt.now') + '</dt><dd>' + F.rsd(x.value) + ' × ' + F.pct(x.ponder) + (x.dep < 1 ? ' × ' + F.num(x.dep, 1) : '') + ' = <b>' + F.rsd(x.bonus) + '</b></dd></dl>');
      ((running ? pr : now).condRes || []).filter(function (c) { var r = c.r || c.d; return [r.cond, r.a, r.b].indexOf(x.key) >= 0 || (r.affects || []).indexOf(x.key) >= 0 || (r.keys || []).indexOf(x.key) >= 0; }).forEach(function (c) {
        right += '<div class="note' + (c.active && c.r.tpl !== 'pojacanje' ? ' warn' : '') + '" style="margin:10px 0 0">' + IH.veze.resText(s, c) + '</div>';
      });
      h += ui.card(IH.esc(IH.L(x.name)), '<div class="grid" style="grid-template-columns:1.1fr 1fr 0.9fr;gap:24px"><div>' + left + '</div><div>' + mid + '</div><div>' + right + '</div></div>');
    });
    var rules = '<ul class="rulelist" style="margin:0">' + (s.continuity && ver.contAmount ? '<li>' + t('mt.cont', { a: F.rsd(ver.contAmount), k: IH.esc(IH.L(EN.targetOf(s.targets.filter(function (q) { return q.key === s.continuity.target; })[0], s).name)), m: F.pct(s.continuity.min), n: s.continuity.periods }) + '</li>' : '') + '<li>' + t('mt.limit', { l: F.rsd(ver.limit) }) + '</li>' + (s.carryNegative ? '<li>' + t('mt.carry') + '</li>' : '') + '</ul>';
    h += ui.card(t('mt.rules'), rules);
    if ((now.addons || []).length) h += ui.card(IH.L(L('Kampanjski dodaci', 'Campaign add-ons')), ui.table([{ key: 'n', label: IH.L(L('Dodatak', 'Add-on')) }, { key: 'c', label: IH.L(L('Prodaja', 'Sales')), num: true }, { key: 'a', label: IH.L(L('Iznos', 'Amount')), num: true }], now.addons.map(function (a) { return { n: IH.esc(IH.L(a.name)), c: a.n, a: F.rsd(a.amount) + (a.capped ? ' ' + ui.pill(IH.L(L('na limitu', 'at limit')), 'warning') : '') }; }), { compact: true }), { flush: true });
    return h;
  }
  function teamPage(me) {
    var r = EN.m3(me.branch, '2026-10'), mine = EN.effItems(me.id, '2026-10');
    if (r.noScheme) return ui.header(t('mt.title')) + '<div class="empty">' + IH.L(L('Bez raspoređene šeme', 'No scheme assigned')) + '</div>';
    var h = ui.header(t('mt.title'), '', '', IH.esc(IH.L(D.scheme(r.scheme).name)));
    h += '<div class="tcards">' + r.kpis.map(function (k) { var nb = EN.nextBand(D.SCALES.M, k.pct); return ui.targetCard({ name: IH.L(k.name), ach: Math.round(k.ach), target: k.target, unit: k.unit, pct: k.pct, next: nb, nextNone: !nb }); }).join('') + '</div>';
    h += ui.card(t('mt.team', { p: D.periodLabel('2026-10') }), ui.table([{ key: 'k', label: t('c.target') }, { key: 't', label: t('c.target'), num: true }, { key: 'a', label: t('c.ach'), num: true }, { key: 'p', label: t('c.pct'), w: '180px' }, { key: 's', label: t('mt.share'), num: true }, { key: 'm', label: t('mt.myShare'), num: true }], r.kpis.map(function (k) { var tg = D.target(k.id), my = mine.filter(function (i) { return EN.matches(tg, i) && i.type !== 'storno'; }); var myv = tg.unit === 'RSD' ? my.reduce(function (a, i) { return a + i.amount; }, 0) : my.length; return { k: IH.esc(IH.L(k.name)), t: F.unit(k.target, k.unit), a: F.unit(Math.round(k.ach), k.unit), p: ui.pcell(k.pct, { max: 1.6 }), s: F.pct(k.share), m: F.unit(myv, k.unit) }; })), { flush: true });
    /* moj deo zajedničkog bonusa tima */
    var meM = r.members.filter(function (m) { return m.emp === me.id; })[0];
    if (meM) h += ui.card(IH.L(L('Zajednički bonus tima', 'Shared team bonus')), '<dl class="kv"><dt>' + IH.L(L('Podela', 'Split')) + '</dt><dd>' + IH.L(r.pool && r.pool.manual ? L('Odredio menadžer', 'Set by the manager') : L('Na jednake delove', 'Equal shares')) + '</dd><dt>' + IH.L(L('Moj udeo', 'My share')) + '</dt><dd><b>' + F.pct(meM.share) + '</b></dd><dt>' + IH.L(L('Bonus tima do sada', 'Team bonus so far')) + '</dt><dd>' + F.rsd(r.pool ? r.pool.pay : 0) + '</dd><dt>' + IH.L(L('Moj bonus do sada', 'My bonus so far')) + '</dt><dd><b>' + F.rsd(meM.payout) + '</b></dd></dl>');
    h += ui.card(t('mt.scale'), scaleHtml(D.scheme(r.scheme).scale) + '<div class="hint" style="margin-top:6px">' + IH.schemeScaleText(D.scheme(r.scheme).scale) + '</div>');
    return h;
  }

  IH.route('moji-targeti', { title: function () { return t('mt.title'); }, render: page });
  IH.refreshers.mt = function () { IH.render(); };
})();
