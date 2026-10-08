/* Incentive Hub — Šabloni obaveštenja: tekst, okidači (kada se šalje) i kanali (u aplikaciji, e-mail)
   Okidač je rečenica: „odmah kada se desi“, „N dana pre roka“, „na dan roka“, „N dana posle, ako nije rešeno“ ili „jednom dnevno, zbirno“ — uz vreme slanja.
   Tehnički: događaji iz procesa šalju odmah; dnevni planer (npr. u 08:00) proverava rokove i nerešene stavke. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'tp2.title': 'Šabloni obaveštenja', 'tp2.colTpl': 'Šablon', 'tp2.colEvent': 'Događaj', 'tp2.colTo': 'Primaoci', 'tp2.colCh': 'Kanali', 'tp2.colTrig': 'Okidači', 'tp2.colCond': 'Uslov', 'tp2.colSent': 'Poslato (30 dana)', 'tp2.colMod': 'Izmenjen', 'tp2.new': 'Novi šablon', 'tp2.search': 'Naziv šablona',
    'ch.mail': 'E-mail', 'ch.app': 'U aplikaciji', 'tp2.edit': 'Izmena šablona — {n}', 'tp2.view': 'Šablon — {n}', 'tp2.name': 'Naziv šablona', 'tp2.triggers': 'Okidači slanja', 'tp2.addTrig': 'Dodaj okidač', 'tp2.subject': 'Naslov', 'tp2.body': 'Tekst', 'tp2.fields': 'Polja', 'tp2.preview': 'Pregled za {n}', 'tp2.saved': 'Šablon „{n}“ je sačuvan', 'tp2.lang': 'Jezik', 'tp2.needName': 'Unesite naziv šablona', 'tp2.needTrig': 'Šablon mora imati bar jedan okidač',
    'tr.when': 'Kada se šalje', 'tr.days': 'Dana', 'tr.time': 'U', 'tr.w.odmah': 'Odmah kada se desi', 'tr.w.pre': 'Pre roka', 'tr.w.dan': 'Na dan roka', 'tr.w.posle': 'Ako nije rešeno', 'tr.w.dnevno': 'Jednom dnevno, zbirno',
    'tr.sOdmah': 'Odmah kada se desi', 'tr.sPre': '{n} dana pre {r}, u {h}', 'tr.sDan': 'Na dan {r}, u {h}', 'tr.sPosle': '{n} dana posle događaja ako nije rešeno, u {h}', 'tr.sDnevno': 'Jednom dnevno u {h}, zbirno', 'tr.daysPre': 'dana pre {r}', 'tr.daysPosle': 'dana posle događaja',
    'rok.deadline': 'roka za saglasnost', 'rok.complaint': 'roka za odluku', 'rok.x': 'roka',
    'ev.sent': 'Obračunski listovi poslati', 'ev.deadline': 'Rok za saglasnost', 'ev.auto': 'Rok za saglasnost istekao', 'ev.complaint': 'Uložen prigovor', 'ev.decision': 'Odluka o prigovoru', 'ev.corrected': 'Obračun korigovan', 'ev.assign': 'Raspored poslat na odobrenje', 'ev.targets': 'Targeti aktivirani', 'ev.paid': 'Potvrđena isplata', 'ev.loadErr': 'Greška u učitavanju', 'ev.unmapped': 'Nove nemapirane šifre',
    'cd.all': 'Uvek', 'cd.noReply': 'Samo zaposleni bez odgovora', 'cd.changed': 'Samo ako se iznos promenio', 'cd.gt0': 'Ako ima bar jedne nove šifre', 'cd.paid': 'Samo zaposleni u batch-u'
  }, {
    'tp2.title': 'Notification templates', 'tp2.colTpl': 'Template', 'tp2.colEvent': 'Event', 'tp2.colTo': 'Recipients', 'tp2.colCh': 'Channels', 'tp2.colTrig': 'Triggers', 'tp2.colCond': 'Condition', 'tp2.colSent': 'Sent (30 days)', 'tp2.colMod': 'Modified', 'tp2.new': 'New template', 'tp2.search': 'Template name',
    'ch.mail': 'Email', 'ch.app': 'In-app', 'tp2.edit': 'Edit template — {n}', 'tp2.view': 'Template — {n}', 'tp2.name': 'Template name', 'tp2.triggers': 'Sending triggers', 'tp2.addTrig': 'Add trigger', 'tp2.subject': 'Subject', 'tp2.body': 'Text', 'tp2.fields': 'Fields', 'tp2.preview': 'Preview for {n}', 'tp2.saved': 'Template "{n}" saved', 'tp2.lang': 'Language', 'tp2.needName': 'Enter the template name', 'tp2.needTrig': 'The template needs at least one trigger',
    'tr.when': 'When it is sent', 'tr.days': 'Days', 'tr.time': 'At', 'tr.w.odmah': 'Immediately when it happens', 'tr.w.pre': 'Before the deadline', 'tr.w.dan': 'On the deadline day', 'tr.w.posle': 'If not resolved', 'tr.w.dnevno': 'Once a day, summarised',
    'tr.sOdmah': 'Immediately when it happens', 'tr.sPre': '{n} days before {r}, at {h}', 'tr.sDan': 'On the day of {r}, at {h}', 'tr.sPosle': '{n} days after the event if not resolved, at {h}', 'tr.sDnevno': 'Once a day at {h}, summarised', 'tr.daysPre': 'days before {r}', 'tr.daysPosle': 'days after the event',
    'rok.deadline': 'the consent deadline', 'rok.complaint': 'the decision deadline', 'rok.x': 'the deadline',
    'ev.sent': 'Statements sent', 'ev.deadline': 'Consent deadline', 'ev.auto': 'Consent deadline passed', 'ev.complaint': 'Complaint filed', 'ev.decision': 'Complaint decision', 'ev.corrected': 'Statement adjusted', 'ev.assign': 'Assignment submitted for approval', 'ev.targets': 'Targets activated', 'ev.paid': 'Payout confirmed', 'ev.loadErr': 'Load error', 'ev.unmapped': 'New unmapped codes',
    'cd.all': 'Always', 'cd.noReply': 'Only employees without a reply', 'cd.changed': 'Only if the amount changed', 'cd.gt0': 'If there is at least one new code', 'cd.paid': 'Only employees in the batch'
  });

  var EVENTS = ['sent', 'deadline', 'auto', 'complaint', 'decision', 'corrected', 'assign', 'targets', 'paid', 'loadErr', 'unmapped'];
  var CONDS = ['all', 'noReply', 'changed', 'gt0', 'paid'];
  function TR(when, days, time) { return { when: when, days: days || 0, time: time || '08:00' }; }
  /* događaji sa rokom nude „pre roka“ i „na dan roka“; ostali „odmah“, „ako nije rešeno“ i „jednom dnevno“ */
  var ROK = { deadline: 'deadline', complaint: 'complaint' };
  function whenOpts(ev) { return ev === 'deadline' ? ['pre', 'dan'] : ev === 'complaint' ? ['odmah', 'pre', 'dan'] : ['odmah', 'posle', 'dnevno']; }
  /* stari zapisi (pomak/ponavljanje) → novi oblik */
  function norm(tr, ev) {
    if (!tr.when) { var w = tr.on === 'deadline' ? (tr.offset < 0 ? 'pre' : 'dan') : tr.repeat === 'digest' ? 'dnevno' : tr.offset > 0 ? 'posle' : 'odmah'; tr = { when: w, days: Math.abs(tr.offset || 0), time: tr.time || '08:00' }; }
    var ok = whenOpts(ev); if (ok.indexOf(tr.when) < 0) tr = { when: ok[0], days: ok[0] === 'pre' || ok[0] === 'posle' ? 2 : 0, time: tr.time || '08:00' };
    return tr;
  }
  var TPL = [
    { id: 'OBRACUN_SPREMAN', ev: 'sent', to: 'employee', ch: ['mail', 'app'], cond: 'all', trig: [TR('odmah')], mod: '2026-09-02T10:15', sent: 39, name: L('Obračunski list je spreman', 'Statement ready'),
      subj: L('Vaš obračun za {period} je spreman', 'Your {period} statement is ready'), body: L('Poštovani {ime},\n\nvaš obračunski list za {period} je spreman. Iznos za isplatu je {iznos}.\nPregledajte obračun i dajte saglasnost ili uložite prigovor do {rok}.\n\n{link}', 'Dear {ime},\n\nyour {period} statement is ready. The payout amount is {iznos}.\nReview it and consent or file a complaint by {rok}.\n\n{link}') },
    { id: 'PODSETNIK_SAGLASNOST', ev: 'deadline', to: 'employee', ch: ['mail', 'app'], cond: 'noReply', trig: [TR('pre', 5), TR('pre', 2), TR('dan')], mod: '2026-09-02T10:18', sent: 21, name: L('Podsetnik za saglasnost', 'Consent reminder'),
      subj: L('Podsetnik: saglasnost na obračun {period} do {rok}', 'Reminder: consent to the {period} statement by {rok}'), body: L('Poštovani {ime},\n\nobračun za {period} ({iznos}) još čeka vaš odgovor. Rok je {rok}.\n\n{link}', 'Dear {ime},\n\nyour {period} statement ({iznos}) still awaits your reply. The deadline is {rok}.\n\n{link}') },
    { id: 'AUTO_SAGLASNOST', ev: 'auto', to: 'employee', ch: ['app'], cond: 'noReply', trig: [TR('odmah')], mod: '2026-09-02T10:20', sent: 9, name: L('Automatska saglasnost', 'Auto-consent'),
      subj: L('Obračun {period} je automatski prihvaćen', 'Statement {period} auto-consented'), body: L('Rok za odgovor je istekao {rok}; obračun za {period} ({iznos}) je automatski prihvaćen i ide u isplatu.', 'The reply deadline passed on {rok}; the {period} statement ({iznos}) was auto-consented and goes to payout.') },
    { id: 'PRIGOVOR_ULOZEN', ev: 'complaint', to: 'manager', ch: ['mail', 'app'], cond: 'all', trig: [TR('odmah'), TR('pre', 1)], mod: '2026-09-02T10:22', sent: 4, name: L('Novi prigovor u timu', 'New team complaint'),
      subj: L('{zaposleni} je uložio prigovor na obračun {period}', '{zaposleni} filed a complaint on the {period} statement'), body: L('Poštovani {ime},\n\n{zaposleni} je uložio prigovor {prigovor}. Odluku donosite u roku od 5 radnih dana.\n\n{link}', 'Dear {ime},\n\n{zaposleni} filed complaint {prigovor}. Please decide within 5 working days.\n\n{link}') },
    { id: 'PRIGOVOR_ODLUKA', ev: 'decision', to: 'employee', ch: ['mail', 'app'], cond: 'all', trig: [TR('odmah')], mod: '2026-09-02T10:25', sent: 3, name: L('Odluka o prigovoru', 'Complaint decision'),
      subj: L('Odluka o prigovoru {prigovor}', 'Decision on complaint {prigovor}'), body: L('Poštovani {ime},\n\nmenadžer {menadzer} je doneo odluku o vašem prigovoru {prigovor}. Obrazloženje i eventualni novi iznos vidite u obračunu.\n\n{link}', 'Dear {ime},\n\nmanager {menadzer} decided on your complaint {prigovor}. See the explanation and any new amount in your statement.\n\n{link}') },
    { id: 'OBRACUN_KORIGOVAN', ev: 'corrected', to: 'employee', ch: ['mail', 'app'], cond: 'changed', trig: [TR('odmah')], mod: '2026-09-02T10:27', sent: 2, name: L('Korigovan obračun — ponovna saglasnost', 'Adjusted statement — re-consent'),
      subj: L('Obračun {period} je korigovan', 'Your {period} statement was adjusted'), body: L('Poštovani {ime},\n\nobračun za {period} je korigovan: novi iznos je {iznos}. Potvrdite novi iznos do {rok}.\n\n{link}', 'Dear {ime},\n\nyour {period} statement was adjusted: the new amount is {iznos}. Please confirm it by {rok}.\n\n{link}') },
    { id: 'RASPORED_ODOBRENJE', ev: 'assign', to: 'manager', ch: ['app'], cond: 'all', trig: [TR('odmah'), TR('posle', 3, '09:00')], mod: '2026-08-11T09:00', sent: 6, name: L('Raspored čeka odobrenje', 'Assignment awaits approval'),
      subj: L('Raspored za {zaposleni} čeka vaše odobrenje', 'Assignment for {zaposleni} awaits your approval'), body: L('Administrator je pripremio raspored šeme za {zaposleni}. Raspored postaje aktivan kada ga odobrite.\n\n{link}', 'The administrator prepared a scheme assignment for {zaposleni}. It becomes active when you approve it.\n\n{link}') },
    { id: 'TARGETI_POSTAVLJENI', ev: 'targets', to: 'employee', ch: ['mail', 'app'], cond: 'all', trig: [TR('odmah')], mod: '2026-06-20T14:00', sent: 39, name: L('Postavljeni targeti', 'Targets set'),
      subj: L('Vaši targeti za {period}', 'Your targets for {period}'), body: L('Poštovani {ime},\n\npostavljeni su vaši targeti za {period}. Definicije, uslove i skalu vidite u Moji targeti.\n\n{link}', 'Dear {ime},\n\nyour targets for {period} are set. See definitions, conditions and the scale in My targets.\n\n{link}') },
    { id: 'ISPLATA_IZVRSENA', ev: 'paid', to: 'employee', ch: ['app'], cond: 'paid', trig: [TR('odmah')], mod: '2026-06-20T14:05', sent: 28, name: L('Bonus isplaćen', 'Bonus paid'),
      subj: L('Bonus za {period} je isplaćen', 'Your {period} bonus was paid'), body: L('Bonus za {period} u iznosu od {iznos} isplaćen je kroz obračun zarada.', 'Your {period} bonus of {iznos} was paid through payroll.') },
    { id: 'UVOZ_GRESKA', ev: 'loadErr', to: 'admin', ch: ['mail', 'app'], cond: 'all', trig: [TR('odmah')], mod: '2026-05-04T08:30', sent: 1, name: L('Greška u učitavanju', 'Load error'),
      subj: L('Učitavanje {ucitavanje} nije uspelo', 'Load {ucitavanje} failed'), body: L('Učitavanje {ucitavanje} iz izvora {izvor} nije uspelo. Automatski ponovni pokušaj je urađen; proverite dnevnik izvršavanja.\n\n{link}', 'Load {ucitavanje} from {izvor} failed. An automatic retry was made; check the execution log.\n\n{link}') },
    { id: 'NEMAPIRANE_SIFRE', ev: 'unmapped', to: 'admin', ch: ['app'], cond: 'gt0', trig: [TR('dnevno', 0, '08:00')], mod: '2026-05-04T08:32', sent: 6, name: L('Nove nemapirane šifre', 'New unmapped codes'),
      subj: L('{broj} stavki čeka mapiranje šifre', '{broj} items await code mapping'), body: L('Noćni uvoz je doneo stavke sa šiframa koje nisu u katalogu. Stavke ulaze u obračun posle mapiranja.\n\n{link}', 'The nightly import brought items with codes not in the catalogue. They count after mapping.\n\n{link}') }
  ];
  var FIELDS = ['ime', 'period', 'iznos', 'rok', 'link', 'zaposleni', 'menadzer', 'prigovor', 'ucitavanje', 'izvor', 'broj'];
  function all() { return TPL.concat(IH.list('newTpls')).map(function (x) { var e = IH.map('tplEdits')[x.id]; return e ? Object.assign({}, x, e) : x; }); }
  function tpl(id) { return all().filter(function (x) { return x.id === id; })[0]; }
  function onT(id) { var x = IH.map('tplOff')[id]; return !x; }
  function rolePill(r) { return ui.pill(t('ur.' + r), { admin: 'danger', manager: 'accent', employee: 'gray', viewer: 'info' }[r]); }
  function chPills(ch) { return ch.map(function (c) { return '<span class="tag' + (c === 'mail' ? ' acc' : '') + '">' + t('ch.' + c) + '</span>'; }).join(' '); }
  function rokTxt(ev) { return t(ROK[ev] ? 'rok.' + ROK[ev] : 'rok.x'); }
  function trigText(tr, ev) {
    tr = norm(tr, ev);
    if (tr.when === 'odmah') return t('tr.sOdmah');
    if (tr.when === 'pre') return t('tr.sPre', { n: tr.days, r: rokTxt(ev), h: tr.time });
    if (tr.when === 'dan') return t('tr.sDan', { r: rokTxt(ev), h: tr.time });
    if (tr.when === 'posle') return t('tr.sPosle', { n: tr.days, h: tr.time });
    return t('tr.sDnevno', { h: tr.time });
  }
  function trigSummary(x) { return (x.trig || []).map(function (tr) { return trigText(tr, x.ev); }).join('; '); }
  function sample(s) {
    var v = { ime: 'Ana', zaposleni: 'Marko Ilić', menadzer: 'Nikola Stanković', period: 'Q3 2026', iznos: F.rsd(62800), rok: F.date('2026-10-22'), link: 'https://incentivehub/moj-obracun', prigovor: 'C-0412', ucitavanje: 'LD-20261016-01', izvor: 'DWH', broj: '11' };
    return IH.esc(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? '<b style="color:var(--accent)">' + IH.esc(v[k]) + '</b>' : m; }).replace(/\n/g, '<br>');
  }

  /* ---------- lista ---------- */
  function listPage() {
    return IH.grid({
      id: 'tpl', exportName: 'Sabloni_obavestenja.xlsx', hidden: ['m', 'cd'], searchLabel: t('tp2.search'), create: { label: t('tp2.new'), act: 'ntf-new' },
      rows: all, key: function (x) { return x.id; }, label: function (x) { return IH.L(x.name); }, searchKeys: ['n'],
      cols: [
        { key: 'st', label: t('c.status'), type: 'status', val: function (x) { return onT(x.id); }, fval: function (x) { return onT(x.id) ? 'on' : 'off'; }, filter: function () { return [{ v: 'on', l: t('g.on') }, { v: 'off', l: t('g.off') }]; } },
        { key: 'n', label: t('tp2.colTpl'), val: function (x) { return IH.L(x.name); }, render: function (x) { return '<b>' + IH.esc(IH.L(x.name)) + '</b>' + (x.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } },
        { key: 'e', label: t('tp2.colEvent'), val: function (x) { return t('ev.' + x.ev); }, fval: function (x) { return x.ev; }, filter: function () { return EVENTS.map(function (k) { return { v: k, l: t('ev.' + k) }; }); } },
        { key: 'to', label: t('tp2.colTo'), val: function (x) { return t('ur.' + x.to); }, fval: function (x) { return x.to; }, render: function (x) { return rolePill(x.to); }, filter: function () { return ['admin', 'manager', 'employee'].map(function (k) { return { v: k, l: t('ur.' + k) }; }); } },
        { key: 'ch', label: t('tp2.colCh'), search: false, val: function (x) { return x.ch.join(' '); }, render: function (x) { return chPills(x.ch); } },
        { key: 'tr', label: t('tp2.colTrig'), search: false, val: function (x) { return trigSummary(x); }, render: function (x) { return '<span class="cell-clip" title="' + IH.esc(trigSummary(x)) + '">' + IH.esc(trigSummary(x)) + '</span>'; } },
        { key: 'cd', label: t('tp2.colCond'), val: function (x) { return t('cd.' + (x.cond || 'all')); } },
        { key: 's', label: t('tp2.colSent'), num: true, search: false, val: function (x) { return x.sent || 0; } },
        { key: 'm', label: t('tp2.colMod'), search: false, val: function (x) { return x.mod; }, render: function (x) { return F.date(x.mod); } }
      ],
      onStatus: function (x, on) { IH.map('tplOff')[x.id] = !on; if (on) delete IH.map('tplOff')[x.id]; IH.audit('template', x.id, on ? { sr: 'Šablon aktiviran', en: 'Template activated' } : { sr: 'Šablon isključen', en: 'Template switched off' }); IH.save(); },
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'ntf-view' }, { type: 'edit', title: t('g.aEdit'), act: 'ntf-edit', kind: 'acc' }, { type: 'history', title: t('g.aHistory'), act: 'ntf-hist' }]
    });
  }

  /* ---------- forma (pregled, izmena, novi) ---------- */
  function TF() { return IH.form.tpl; }
  function headFields(f) {
    return [
      { k: 'tp_name', label: t('tp2.name'), value: f.name, req: true }, { k: 'tp_ev', label: t('tp2.colEvent'), type: 'select', options: EVENTS.map(function (k) { return { v: k, l: t('ev.' + k) }; }), value: f.ev },
      { k: 'tp_to', label: t('tp2.colTo'), type: 'select', options: ['admin', 'manager', 'employee'].map(function (k) { return { v: k, l: t('ur.' + k) }; }), value: f.to }, { k: 'tp_cond', label: t('tp2.colCond'), type: 'select', options: CONDS.map(function (k) { return { v: k, l: t('cd.' + k) }; }), value: f.cond },
      { k: 'tp_app', label: t('ch.app'), type: 'toggle', value: f.ch.indexOf('app') >= 0 }, { k: 'tp_mail', label: t('ch.mail'), type: 'toggle', value: f.ch.indexOf('mail') >= 0 }
    ];
  }
  function trigRows() {
    var f = TF();
    var seen = {};
    f.trig = f.trig.map(function (tr) { return norm(tr, f.ev); }).filter(function (tr) { var k = tr.when + '|' + tr.days + '|' + tr.time; if (seen[k]) return false; seen[k] = 1; return true; });
    if (f.ro) return ui.table([{ key: 'n', label: '#', num: true }, { key: 's', label: t('tr.when') }], f.trig.map(function (tr, i) { return { n: i + 1, s: IH.esc(trigText(tr, f.ev)) }; }), { compact: true });
    return f.trig.map(function (tr, i) {
      var days = tr.when === 'pre' || tr.when === 'posle', timed = tr.when !== 'odmah';
      return '<div class="trg"><select class="in" data-tr="' + i + '|when">' + whenOpts(f.ev).map(function (k) { return '<option value="' + k + '"' + (k === tr.when ? ' selected' : '') + '>' + t('tr.w.' + k) + '</option>'; }).join('') + '</select>' +
        (days ? '<input class="in tnum" style="width:64px" data-tr="' + i + '|days" value="' + tr.days + '"><span class="mut">' + (tr.when === 'pre' ? t('tr.daysPre', { r: rokTxt(f.ev) }) : t('tr.daysPosle')) + '</span>' : '<span></span><span></span>') +
        (timed ? '<span class="mut">' + t('tr.time') + '</span><input class="in" style="width:76px" data-tr="' + i + '|time" value="' + IH.esc(tr.time) + '">' : '<span></span><span></span>') +
        '<button type="button" class="gab dan" data-act="ntf-tr-del" data-arg="' + i + '" title="' + t('g.aDelete') + '">' + ic('trash') + '</button></div>';
    }).join('') + ui.btn(t('tp2.addTrig'), { cls: 'sm', icon: 'plus', act: 'ntf-tr-add' });
  }
  function textPart() {
    var f = TF(), lg = f.lg;
    var txt = f.ro ? '<div class="field"><label class="lab">' + t('tp2.subject') + '</label><div class="in ro">' + IH.esc(f.subj[lg]) + '</div></div><div class="field"><label class="lab">' + t('tp2.body') + '</label><div class="in ro ta">' + IH.esc(f.body[lg]).replace(/\n/g, '<br>') + '</div></div>'
      : '<div class="field"><label class="lab">' + t('tp2.subject') + '</label><input class="in" id="tpl-s" data-tpl="s" value="' + IH.esc(f.subj[lg]) + '"></div><div class="field"><label class="lab">' + t('tp2.body') + '</label><textarea class="in" id="tpl-b" data-tpl="b" rows="8">' + IH.esc(f.body[lg]) + '</textarea></div>' +
      '<div class="lab">' + t('tp2.fields') + '</div><div style="display:flex;gap:6px;flex-wrap:wrap">' + FIELDS.map(function (k) { return '<button type="button" class="tag acc" style="cursor:pointer;border:0" data-act="ntf-ins" data-arg="' + k + '">{' + k + '}</button>'; }).join('') + '</div>';
    return '<div style="display:flex;gap:10px;align-items:center;margin:14px 0 10px"><span class="lab" style="margin:0">' + t('tp2.lang') + '</span><div class="seg">' + ['sr', 'en'].map(function (l) { return '<button type="button" data-act="ntf-lg" data-arg="' + l + '" class="' + (l === lg ? 'on' : '') + '">' + l.toUpperCase() + '</button>'; }).join('') + '</div></div>' +
      '<div class="grid g2"><div>' + txt + '</div><div><div class="lab">' + t('tp2.preview', { n: 'Ana Jovanović' }) + '</div><div id="tpl-prev" style="border:1px solid var(--line);border-radius:10px;padding:14px;background:var(--subtle)">' + prevHtml() + '</div></div></div>';
  }
  function prevHtml() { var f = TF(); return '<div class="mut" style="font-size:12px;margin-bottom:6px">' + t('tp2.subject') + '</div><b>' + sample(f.subj[f.lg]) + '</b><div class="hr"></div><div style="line-height:1.6">' + sample(f.body[f.lg]) + '</div>'; }
  function edBody() {
    var f = TF();
    return ui.form(headFields(f), { readonly: f.ro }) + '<div class="fsec" style="margin-top:14px"><h3>' + t('tp2.triggers') + '</h3><div id="tpl-trig">' + trigRows() + '</div></div><div id="tpl-text">' + textPart() + '</div>';
  }
  function openTpl(x, mode) {
    IH.form = { tpl: { id: x ? x.id : null, ro: mode === 'view', lg: IH.state.lang, name: x ? IH.L(x.name) : '', ev: x ? x.ev : 'sent', to: x ? x.to : 'employee', cond: x ? (x.cond || 'all') : 'all', ch: x ? x.ch.slice() : ['app'], trig: x ? JSON.parse(JSON.stringify(x.trig || [])) : [TR('odmah')], subj: x ? Object.assign({}, x.subj) : { sr: '', en: '' }, body: x ? Object.assign({}, x.body) : { sr: '', en: '' } } };
    var title = mode === 'view' ? t('tp2.view', { n: IH.esc(IH.L(x.name)) }) : mode === 'edit' ? t('tp2.edit', { n: IH.esc(IH.L(x.name)) }) : t('tp2.new');
    IH.modal({ title: title, wide: true, body: '<div id="tpl-body">' + edBody() + '</div>', foot: mode === 'view' ? ui.btn(t('g.aEdit'), { icon: 'edit', act: 'ntf-edit', arg: x.id }) + ui.btn(t('c.close'), { act: 'modal-close' }) : ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'ntf-save' }) });
  }
  IH.act['ntf-new'] = function () { openTpl(null, 'new'); };
  IH.act['ntf-view'] = function (el) { var x = tpl(el.dataset.arg); if (x) openTpl(x, 'view'); };
  IH.act['ntf-edit'] = function (el) { var x = tpl(el.dataset.arg); if (x) openTpl(x, 'edit'); };
  IH.act['ntf-lg'] = function (el) { TF().lg = el.dataset.arg; IH.swap('tpl-text', textPart()); };
  IH.act['ntf-ins'] = function (el) {
    var ta = document.getElementById('tpl-b'), f = TF(), k = '{' + el.dataset.arg + '}';
    var pos = ta && ta.selectionStart != null ? ta.selectionStart : f.body[f.lg].length;
    f.body[f.lg] = f.body[f.lg].slice(0, pos) + k + f.body[f.lg].slice(pos);
    IH.swap('tpl-text', textPart());
  };
  IH.act['ntf-tr-add'] = function () { var f = TF(), w = whenOpts(f.ev); f.trig.push(TR(w.indexOf('pre') >= 0 ? 'pre' : w.indexOf('posle') >= 0 ? 'posle' : w[0], 2)); IH.swap('tpl-trig', trigRows()); };
  IH.act['ntf-tr-del'] = function (el) { TF().trig.splice(+el.dataset.arg, 1); IH.swap('tpl-trig', trigRows()); };
  document.addEventListener('input', function (e) { var d = e.target.dataset || {}, f = TF(); if (!f) return; if (d.tpl === 's') { f.subj[f.lg] = e.target.value; IH.swap('tpl-prev', prevHtml()); } else if (d.tpl === 'b') { f.body[f.lg] = e.target.value; IH.swap('tpl-prev', prevHtml()); } });
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}, f = TF(); if (!f) return;
    if (d.k === 'tp_ev') { f.ev = e.target.value; IH.swap('tpl-trig', trigRows()); return; }
    if (!d.tr) return;
    var p = d.tr.split('|'), tr = f.trig[+p[0]]; if (!tr) return;
    if (p[1] === 'days') tr.days = Math.max(0, parseInt(e.target.value, 10) || 0); else tr[p[1]] = e.target.value;
    if (p[1] === 'when' && (tr.when === 'pre' || tr.when === 'posle') && !tr.days) tr.days = 2;
    IH.swap('tpl-trig', trigRows());
  });
  IH.act['ntf-save'] = function () {
    var f = TF(), g = function (k, dflt) { return IH.form[k] != null ? IH.form[k] : dflt; };
    var name = String(g('tp_name', f.name) || '').trim(); if (!name) { IH.toast(t('tp2.needName')); return; }
    if (!f.trig.length) { IH.toast(t('tp2.needTrig')); return; }
    var ch = []; if (g('tp_app', f.ch.indexOf('app') >= 0)) ch.push('app'); if (g('tp_mail', f.ch.indexOf('mail') >= 0)) ch.push('mail');
    var ev = g('tp_ev', f.ev), rec = { name: { sr: name, en: name }, ev: ev, to: g('tp_to', f.to), cond: g('tp_cond', f.cond), ch: ch, trig: f.trig.map(function (tr) { return norm(tr, ev); }), subj: f.subj, body: f.body, mod: IH.now() };
    if (f.id) { IH.map('tplEdits')[f.id] = rec; IH.audit('template', f.id, { sr: 'Izmenjen šablon', en: 'Template changed' }, { sr: name, en: name }); }
    else { var id = 'TPL-' + (100 + IH.list('newTpls').length); IH.list('newTpls').push(Object.assign({ id: id, sent: 0, isNew: true }, rec)); IH.audit('template', id, { sr: 'Kreiran šablon', en: 'Template created' }, { sr: name, en: name }); }
    IH.save(); IH.form = {}; IH.closeModal(); IH.render(); IH.toast(t('tp2.saved', { n: IH.esc(name) }));
  };
  IH.act['ntf-hist'] = function (el) { var x = tpl(el.dataset.arg); IH.showHistory(IH.L(x.name), IH.auditFor('template', x.id).concat(x.isNew ? [] : [{ at: x.mod, by: 'A001', action: L('Šablon izmenjen', 'Template changed') }, { at: '2025-12-10T09:00', by: 'A001', action: L('Šablon kreiran', 'Template created') }])); };

  IH.route('sabloni', { title: function () { return t('tp2.title'); }, render: function () { return ui.header(t('tp2.title')) + listPage(); } });
})();
