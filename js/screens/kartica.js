/* Incentive Hub — Moja kartica (Zaposleni): lični i organizacioni podaci, raspored šeme, dokumenti, obaveštenja, istorija */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'mk.title': 'Moja kartica', 'mk.desc': 'Vaši podaci iz HR-a, raspored bonus šeme, dokumenti i podešavanja obaveštenja. Podatke iz HR-a menja služba ljudskih resursa.',
    'mk.personal': 'Lični i organizacioni podaci', 'mk.hr': 'HR broj', 'mk.phone': 'Telefon', 'mk.email': 'E-mail', 'mk.docSt': 'Status', 'mk.user': 'Korisničko ime', 'mk.pos': 'Pozicija', 'mk.branch': 'Ekspozitura', 'mk.region': 'Region', 'mk.mgr': 'Menadžer', 'mk.since': 'U organizaciji od', 'mk.cc': 'Mesto troška', 'mk.lang': 'Jezik obaveštenja',
    'mk.asg': 'Raspored bonus šeme', 'mk.scheme': 'Šema', 'mk.from': 'Važi od', 'mk.ver': 'Verzija', 'mk.exc': 'Izuzeci', 'mk.noExc': 'bez izuzetaka', 'mk.targets': 'Moji targeti',
    'mk.docs': 'Dokumenti', 'mk.doc': 'Obračunski list {p}', 'mk.docPay': 'Potvrda o isplati {p}', 'mk.dl': 'Preuzmi', 'mk.notif': 'Obaveštenja', 'mk.notifSub': 'Šta i kako želite da primate. Obaveštenja o roku i odluci uvek stižu u aplikaciji.', 'mk.saved': 'Podešavanje obaveštenja je sačuvano',
    'mk.hist': 'Istorija promena', 'mk.e1': 'Obračun spreman', 'mk.e2': 'Podsetnik za saglasnost', 'mk.e3': 'Odluka o prigovoru', 'mk.e4': 'Novi targeti', 'mk.e5': 'Isplata bonusa', 'mk.mail': 'Mejl', 'mk.app': 'U aplikaciji', 'mk.req': 'uvek'
  }, {
    'mk.title': 'My profile', 'mk.desc': 'Your HR data, bonus scheme assignment, documents and notification settings. HR data is maintained by Human Resources.',
    'mk.personal': 'Personal and organisation data', 'mk.hr': 'HR number', 'mk.phone': 'Phone', 'mk.email': 'Email', 'mk.docSt': 'Status', 'mk.user': 'Username', 'mk.pos': 'Position', 'mk.branch': 'Branch', 'mk.region': 'Region', 'mk.mgr': 'Manager', 'mk.since': 'In organisation since', 'mk.cc': 'Cost centre', 'mk.lang': 'Notification language',
    'mk.asg': 'Bonus scheme assignment', 'mk.scheme': 'Scheme', 'mk.from': 'Valid from', 'mk.ver': 'Version', 'mk.exc': 'Exceptions', 'mk.noExc': 'no exceptions', 'mk.targets': 'My targets',
    'mk.docs': 'Documents', 'mk.doc': 'Statement {p}', 'mk.docPay': 'Payout confirmation {p}', 'mk.dl': 'Download', 'mk.notif': 'Notifications', 'mk.notifSub': 'What you want to receive and how. Deadline and decision notices always arrive in the app.', 'mk.saved': 'Notification settings saved',
    'mk.hist': 'Change history', 'mk.e1': 'Statement ready', 'mk.e2': 'Consent reminder', 'mk.e3': 'Complaint decision', 'mk.e4': 'New targets', 'mk.e5': 'Bonus paid', 'mk.mail': 'Email', 'mk.app': 'In app', 'mk.req': 'always'
  });

  function uname(e) { var p = e.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj').split(' '); return p[0] + '.' + p[p.length - 1]; }
  function prefs() { return IH.map('notifPrefs'); }
  function pref(k, ch) { var p = prefs()[k + '|' + ch]; return p == null ? (ch === 'app' || k !== 'e4') : p; }
  function page() {
    var e = IH.me(), b = D.branch(e.branch), m = D.emp(e.mgr), a = IH.assignments().filter(function (x) { return x.emp === e.id && x.status === 'aktivan'; })[0], s = a ? D.scheme(a.scheme) : null;
    var head = '<section class="card"><div class="cb" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' + ui.avatar(e.name, true) + '<div style="flex:1"><b style="font-size:17px">' + IH.esc(e.name) + '</b><div class="mut">' + D.posName(e.pos) + ' · ' + IH.esc(D.branchName(b)) + '</div></div>' + ui.pill(t('ur.employee'), 'gray') + '</div></section>';
    var pers = ui.card(t('mk.personal'), ui.form([{ k: 'mk_hr', label: t('mk.hr'), value: e.hr }, { k: 'mk_u', label: t('mk.user'), value: uname(e) }, { k: 'mk_ph', label: t('mk.phone'), value: e.phone || '' }, { k: 'mk_em', label: t('mk.email'), value: D.email(e) }, { k: 'mk_p', label: t('mk.pos'), value: D.posName(e.pos) }, { k: 'mk_b', label: t('mk.branch'), value: D.branchName(b) }, { k: 'mk_r', label: t('mk.region'), value: IH.L(D.region(b.region).name) }, { k: 'mk_m', label: t('mk.mgr'), value: m ? m.name : '' }, { k: 'mk_s', label: t('mk.since'), value: F.date(e.since) }, { k: 'mk_cc', label: t('mk.cc'), value: b.code }], { readonly: true }));
    var asg = ui.card(t('mk.asg'), s ? ui.form([{ k: 'mk_sc', label: t('mk.scheme'), value: IH.L(s.name), full: true }, { k: 'mk_v', label: t('mk.ver'), value: 'v' + D.schemeVersion(s, EN.currentPeriod(e.id)).v }, { k: 'mk_f', label: t('mk.from'), value: F.date(a.from) }, { k: 'mk_x', label: t('mk.exc'), value: t('mk.noExc'), full: true }], { readonly: true }) : '—', { actions: ui.btn(t('mk.targets'), { cls: 'sm', icon: 'target', go: 'moji-targeti' }) });
    var docs = EN.periodsFor(e.id).filter(function (p) { return p.status !== 'u_toku'; }).slice().reverse();
    var dt = ui.table([{ key: 'd', label: t('c.period') }, { key: 's', label: t('mk.docSt') }, { key: 'x', label: '' }], docs.map(function (p) { return { d: '<span style="display:inline-flex;gap:8px;align-items:center">' + ic('file') + '<b style="font-weight:600">' + t('mk.doc', { p: D.periodLabel(p.id) }) + '</b></span>', s: p.status === 'isplaceno' ? t('st.isplaceno') + ' · ' + F.date(p.paidAt) : t('pst.saglasnost'), x: ui.btn(t('mk.dl'), { cls: 'sm', icon: 'download', act: 'export', arg: 'Obracunski_list_' + e.hr + '_' + p.id + '.pdf' }) }; }), { compact: true });
    var ev = ['e1', 'e2', 'e3', 'e4', 'e5'];
    var nt = '<table class="t compact"><thead><tr><th></th><th>' + t('mk.mail') + '</th><th>' + t('mk.app') + '</th></tr></thead><tbody>' + ev.map(function (k) {
      var lockApp = k === 'e2' || k === 'e3';
      return '<tr><td>' + t('mk.' + k) + '</td><td><input type="checkbox" data-np="' + k + '|mail"' + (pref(k, 'mail') ? ' checked' : '') + ' style="accent-color:var(--accent)"></td><td>' + (lockApp ? '<span class="mut">' + t('mk.req') + '</span>' : '<input type="checkbox" data-np="' + k + '|app"' + (pref(k, 'app') ? ' checked' : '') + ' style="accent-color:var(--accent)">') + '</td></tr>';
    }).join('') + '</tbody></table>';
    var hist = [].concat(IH.assignments().filter(function (x) { return x.emp === e.id; }).map(function (x) { return { at: (x.approvedAt || x.submittedAt || x.from + 'T08:00'), by: x.approvedBy || 'A001', action: { sr: 'Raspored ' + D.scheme(x.scheme).code + ' od ' + F.date(x.from), en: 'Assignment ' + D.scheme(x.scheme).code + ' from ' + F.date(x.from) } }; }))
      .concat(EN.periodsFor(e.id).filter(function (p) { return p.status === 'isplaceno'; }).map(function (p) { return { at: p.paidAt + 'T10:00', by: null, action: { sr: 'Isplaćen bonus ' + D.periodLabel(p.id) + ' · ' + F.rsd(EN.result(e.id, p.id).payout), en: D.periodLabel(p.id) + ' bonus paid · ' + F.rsd(EN.result(e.id, p.id).payout) } }; }))
      .concat(IH.complaints().filter(function (c) { return c.emp === e.id; }).map(function (c) { return { at: c.at, by: e.id, action: { sr: 'Prigovor ' + c.id + ' — ' + t('pst2.' + c.status), en: 'Complaint ' + c.id + ' — ' + t('pst2.' + c.status) }, detail: c.subject }; }))
      .concat(IH.auditFor('consent', e.id + '|2026-Q3')).concat([{ at: e.since + 'T08:00', by: null, action: { sr: 'Zaposlenje · ' + D.posName(e.pos), en: 'Hired · ' + D.posName(e.pos) } }])
      .sort(function (x, y) { return x.at < y.at ? 1 : -1; });
    return ui.header(t('mk.title')) + head + '<div class="grid g2">' + pers + asg + '</div><div class="grid g2">' + ui.card(t('mk.docs'), dt, { flush: true }) + ui.card(t('mk.notif'), nt, { flush: true }) + '</div>' + ui.card(t('mk.hist'), ui.hist(hist.slice(0, 12)));
  }
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}; if (!d.np) return;
    prefs()[d.np] = e.target.checked; IH.audit('user', IH.me().id, { sr: 'Izmenjena podešavanja obaveštenja', en: 'Notification settings changed' }, { sr: d.np + ' → ' + (e.target.checked ? 'da' : 'ne'), en: d.np + ' → ' + (e.target.checked ? 'yes' : 'no') });
    IH.save(); IH.toast(t('mk.saved'));
  });
  IH.route('moja-kartica', { title: function () { return t('mk.title'); }, render: page });
})();
