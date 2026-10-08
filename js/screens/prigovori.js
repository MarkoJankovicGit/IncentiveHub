/* Incentive Hub — saglasnost na obračun i prigovori (zajedničko) + Prigovori tima (Menadžer)
   Tok: obračunski list → saglasnost ili prigovor (obavezan opis i prilog) → menadžer usvaja (automatska korekcija,
   ponovni obračun, ponovna saglasnost) ili odbija uz obrazloženje. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'cs.agree': 'Saglasan sam', 'cs.complain': 'Uloži prigovor', 'cs.agreeT': 'Saglasnost na obračun — {p}', 'cs.agreeTxt': 'Potvrđujem da sam pregledao obračunski list za {p} i da sam saglasan sa iznosom od {a}.', 'cs.agreeKor': 'Novi iznos posle korekcije: {b} → {a}.', 'cs.agreed': 'Saglasnost za {p} je evidentirana',
    'cs.wait': 'Obračun za {p} čeka vašu saglasnost do {d} (još {x} dana).', 'cs.kor': 'Obračun za {p} je korigovan: {b} → {a}. Potvrdite novi iznos.', 'cs.inCompl': 'Prigovor {c} je kod menadžera {m} od {d}.',
    'cs.ok': 'Saglasni ste sa obračunom od {d}.', 'cs.auto': 'Automatska saglasnost po isteku roka ({d}).', 'cs.appr': 'Obračun je odobren za isplatu.', 'cs.paid': 'Isplaćeno {d} kroz obračun zarada.', 'cs.run': 'Period je u toku — preliminarni obračun na osnovu projekcije.', 'cs.rej': 'Prigovor {c} je odbijen ({d}) — obrazloženje je u prepisci. Saglasnost ili novi prigovor do {r}',
    'pc.title': 'Prigovor na obračun — {p}', 'pc.reason': 'Tema prigovora', 'pc.contract': 'Broj ugovora', 'pc.prod': 'Proizvod', 'pc.amount': 'Iznos (RSD)', 'pc.date': 'Datum prodaje', 'pc.text': 'Opis', 'pc.att': 'Prilog', 'pc.attach': 'Priloži dokument', 'pc.send': 'Pošalji prigovor', 'pc.sent': 'Prigovor {c} je poslat menadžeru {m}', 'pc.need': 'Opis i prilog su obavezni',
    'pc.textSug': 'Gotovinski kredit klijenta ••2210 (650.000 RSD) isplaćen je 29.09, a ne vidim ga u obračunu za Q3. Ugovor je u prilogu.', 'pc.to': 'Prigovor rešava',
    'pt.title': 'Prigovori tima', 'pt.colId': 'Prigovor', 'pt.colEmp': 'Zaposleni', 'pt.colTopic': 'Tema', 'pt.colReason': 'Razlog', 'pt.colAt': 'Podnet', 'pt.colDue': 'Rok za odluku', 'pt.colDecided': 'Odlučeno', 'pt.data': 'Podaci o prigovoru',
    'pst2.otvoren': 'Otvoren', 'pst2.usvojen': 'Usvojen', 'pst2.odbijen': 'Odbijen',
    'pt.facts': 'Provera u sistemu', 'pt.found': 'Stavka za ugovor {u} postoji u {p}: {s} · {a}', 'pt.notFound': 'U sistemu nema stavke za ugovor {u} ni u jednom periodu.', 'pt.stmt': 'Obračunski list', 'pt.thread': 'Prepiska', 'pt.reply': 'Odgovori', 'pt.replyPh': 'Poruka zaposlenom', 'pt.send': 'Pošalji poruku',
    'pt.accept': 'Usvoji', 'pt.reject': 'Odbij', 'pt.decision': 'Odluka', 'pt.accT': 'Usvajanje prigovora {c}', 'pt.accTxt': 'Usvajanjem se pravi korekcija (razlog: usvojen prigovor), obračun zaposlenog se ponovo računa i vraća na ponovnu saglasnost.', 'pt.corr': 'Korekcija koja se pravi',
    'pt.kLine': 'Dodaj prodaju', 'pt.kAmt': 'Iznos na bonus', 'pt.rejT': 'Odbijanje prigovora {c}', 'pt.rejNote': 'Obrazloženje (vidi zaposleni)', 'pt.accDone': 'Prigovor {c} usvojen — korekcija {k}, obračun vraćen na ponovnu saglasnost', 'pt.rejDone': 'Prigovor {c} je odbijen', 'pt.decided': '{m}, {d}',
    'pt.rejSug': 'Kredit je isplaćen {d} i uračunat je u Q4 2026 — period određuje datum isplate, ne datum ugovora. Za Q3 nema promene; kredit ulazi u target Krediti za Q4.', 'pt.sys': 'Sistem', 'pt.corrLink': 'Korekcija'
  }, {
    'cs.agree': 'I agree', 'cs.complain': 'File a complaint', 'cs.agreeT': 'Consent to statement — {p}', 'cs.agreeTxt': 'I confirm that I reviewed the {p} statement and agree with the amount of {a}.', 'cs.agreeKor': 'New amount after correction: {b} → {a}.', 'cs.agreed': 'Consent for {p} recorded',
    'cs.wait': 'Your {p} statement awaits consent until {d} ({x} days left).', 'cs.kor': 'Your {p} statement was adjusted: {b} → {a}. Confirm the new amount.', 'cs.inCompl': 'Complaint {c} is with manager {m} since {d}.',
    'cs.ok': 'You agreed with the statement on {d}.', 'cs.auto': 'Auto-consent after the deadline ({d}).', 'cs.appr': 'The statement is approved for payout.', 'cs.paid': 'Paid on {d} through payroll.', 'cs.run': 'The period is in progress — preliminary statement based on the projection.', 'cs.rej': 'Complaint {c} was rejected ({d}) — see the thread. Consent or file a new complaint by {r}',
    'pc.title': 'Complaint on statement — {p}', 'pc.reason': 'Complaint topic', 'pc.contract': 'Contract number', 'pc.prod': 'Product', 'pc.amount': 'Amount (RSD)', 'pc.date': 'Sale date', 'pc.text': 'Description', 'pc.att': 'Attachment', 'pc.attach': 'Attach document', 'pc.send': 'Send complaint', 'pc.sent': 'Complaint {c} sent to manager {m}', 'pc.need': 'Description and attachment are required',
    'pc.textSug': 'A cash loan for client ••2210 (RSD 650,000) was disbursed on Sep 29, but I cannot see it in my Q3 statement. The contract is attached.', 'pc.to': 'Decided by',
    'pt.title': 'Team complaints', 'pt.colId': 'Complaint', 'pt.colEmp': 'Employee', 'pt.colTopic': 'Topic', 'pt.colReason': 'Reason', 'pt.colAt': 'Filed', 'pt.colDue': 'Decision due', 'pt.colDecided': 'Decided', 'pt.data': 'Complaint data',
    'pst2.otvoren': 'Open', 'pst2.usvojen': 'Accepted', 'pst2.odbijen': 'Rejected',
    'pt.facts': 'System check', 'pt.found': 'An item for contract {u} exists in {p}: {s} · {a}', 'pt.notFound': 'The system has no item for contract {u} in any period.', 'pt.stmt': 'Statement', 'pt.thread': 'Thread', 'pt.reply': 'Reply', 'pt.replyPh': 'Message to the employee', 'pt.send': 'Send message',
    'pt.accept': 'Accept', 'pt.reject': 'Reject', 'pt.decision': 'Decision', 'pt.accT': 'Accept complaint {c}', 'pt.accTxt': 'Accepting creates a correction (reason: complaint accepted), recalculates the employee statement and returns it for re-consent.', 'pt.corr': 'Correction to be created',
    'pt.kLine': 'Add sale', 'pt.kAmt': 'Bonus amount', 'pt.rejT': 'Reject complaint {c}', 'pt.rejNote': 'Explanation (visible to the employee)', 'pt.accDone': 'Complaint {c} accepted — correction {k}, statement returned for re-consent', 'pt.rejDone': 'Complaint {c} rejected', 'pt.decided': '{m}, {d}',
    'pt.rejSug': 'The loan was disbursed on {d} and counts in Q4 2026 — the disbursement date sets the period, not the contract date. No change for Q3; the loan counts toward your Q4 Loans target.', 'pt.sys': 'System', 'pt.corrLink': 'Correction'
  });

  /* ---------- početni podaci ---------- */
  /* C-0412 (config): kredit ugovoren u septembru, isplaćen u oktobru — placeholderi se pune iz stvarne stavke (itemRef) */
  function refItem(c) {
    if (!c.itemRef) return null;
    var its = D.itemsOf(c.itemRef.emp, c.itemRef.period).filter(function (i) { return i.ptype === c.itemRef.ptype && i.type === 'nova' && i.product; });
    return its[0] || null;
  }
  function fillText(s, m) {
    if (!s) return s;
    if (typeof s === 'string') return s.replace(/\{(\w+)\}/g, function (_, k) { return m[k] != null ? m[k] : '{' + k + '}'; });
    return { sr: fillText(s.sr, m), en: fillText(s.en, m) };
  }
  function hydrate(c) {
    var it = refItem(c); if (!it) return c;
    var m = { client: it.client, amount: F.rsd(it.amount), contract: it.contract, date: F.date(it.date) };
    return Object.assign({}, c, {
      subject: fillText(c.subject, m), text: fillText(c.text, m), facts: fillText(c.facts, m), attach: (c.attach || []).map(function (a) { return fillText(a, m); }),
      reason: c.reason || 'STAVKA_NEDOSTAJE', contract: it.contract, item: it,
      proposal: c.proposal || { kind: 'linija', prod: it.product, code: it.code, amount: it.amount, date: it.date, contract: it.contract, client: it.client }
    });
  }
  if (!D.complaints.some(function (c) { return c.id === 'C-0413'; })) D.complaints.push({
    id: 'C-0413', emp: 'E1005', period: '2026-Q3', status: 'otvoren', at: '2026-10-16T09:48', reason: 'STAVKA_NEDOSTAJE', contract: 'UG-2659981',
    subject: L('Kreditna kartica izdata 30.09. nije u obračunu', 'Credit card issued Sep 30 not in the statement'),
    text: L('Klijentu ••7781 izdao sam Flexia kreditnu karticu 30.09. (ugovor UG-2659981). Kartice su mi na 82%, a ova kartica nije u listi. Prilažem zahtev sa potpisom klijenta.', 'I issued a Flexia credit card to client ••7781 on Sep 30 (contract UG-2659981). My Cards are at 82% and this card is missing. Signed application attached.'),
    attach: ['Zahtev_kartica_UG-2659981.pdf'], facts: L('Kartični sistem potvrđuje izdavanje 30.09; zapis nije stigao u DWH (incident CARD-118).', 'The card system confirms issuance on Sep 30; the record did not reach DWH (incident CARD-118).'),
    proposal: { kind: 'linija', prod: 'P13', code: 'CC-FLX-01', amount: 0, date: '2026-09-30', contract: 'UG-2659981', client: 'Klijent ••7781' }, thread: []
  });
  D.approvalSeed['2026-Q3'].E1005 = { status: 'prigovor', complaint: 'C-0413' };

  /* ---------- model ---------- */
  function st() { return IH.map('complaints'); }
  IH.complaints = function () {
    return D.complaints.concat(IH.list('newComplaints')).map(function (c) { var h = hydrate(c), s = st()[c.id]; return s ? Object.assign({}, h, s) : h; });
  };
  function getC(id) { return IH.complaints().filter(function (c) { return c.id === id; })[0]; }
  IH.complaintFor = function (empId, pid) { return IH.complaints().filter(function (c) { return c.emp === empId && c.period === pid; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; })[0]; };
  function thread(c) {
    var out = [{ at: c.at, by: c.emp, text: c.text, att: c.attach }];
    return out.concat(c.thread || []).concat(IH.map('cthread')[c.id] || []).sort(function (a, b) { return a.at < b.at ? -1 : 1; });
  }
  function addMsg(id, by, text, sys) { var m = IH.map('cthread'); (m[id] = m[id] || []).push({ at: IH.now(), by: by, text: { sr: text, en: text }, sys: !!sys }); }
  function decider(c) { return D.emp(D.emp(c.emp).mgr); }
  function due(c) { var d = new Date(c.at.slice(0, 10) + 'T00:00:00Z'), n = 0; while (n < 5) { d.setUTCDate(d.getUTCDate() + 1); var w = d.getUTCDay(); if (w && w !== 6) n++; } return d.toISOString().slice(0, 10); }
  function prName(id) { var r = IH.codeItems('RAZLOG_PRIGOVORA').filter(function (x) { return x.id === id; })[0]; return r ? IH.L(r.name) : id; }
  function daysLeft(iso) { return Math.max(0, Math.round((Date.parse(iso) - Date.parse(D.TODAY)) / 864e5)); }
  function notify(role, text, go, icon) { var ex = IH.state.data.extraNotif = IH.state.data.extraNotif || {}; (ex[role] = ex[role] || []).push({ id: 'N-' + role + Date.now() + Math.floor(Math.random() * 999), at: IH.now(), icon: icon || 'msg', text: text, go: go }); }
  IH.notify = notify;
  function pay(empId, pid) { var r = EN.result(empId, pid, { project: D.period(pid).status === 'u_toku' }); return r ? r.payout : 0; }
  function prodsFor(empId) { var e = D.emp(empId); return IH.products().filter(function (p) { return p.status === 'aktivan' && (e.pos !== 'licni' || p.seg === 'FL'); }); }

  /* provera u sistemu: traži ugovor u prodajama zaposlenog */
  function facts(c) {
    var out = '';
    if (c.contract) {
      var hit = null;
      EN.periodsFor(c.emp).forEach(function (p) { if (hit) return; IH.itemRows(c.emp, p.id).forEach(function (r) { if (!hit && r.it.contract === c.contract) hit = { r: r, p: p.id }; }); });
      out += hit ? '<div class="note">' + t('pt.found', { u: c.contract, p: D.periodLabel(hit.p), s: IH.esc(D.productName(hit.r.it.product)) + ' ' + F.date(hit.r.it.date), a: IH.ui.itemSt(hit.r.st) }) + '</div>'
        : '<div class="note warn">' + t('pt.notFound', { u: c.contract }) + '</div>';
    }
    if (c.facts) out += '<div class="note" style="margin-top:8px">' + IH.esc(IH.L(c.facts)) + '</div>';
    return out;
  }

  /* ---------- baner saglasnosti (zaposleni i menadžer za sopstveni obračun) ---------- */
  IH.consentBanner = function (empId, pid) {
    var p = D.period(pid), ap = EN.approval(empId, pid), c = IH.complaintFor(empId, pid);
    var btns = ui.btn(t('cs.complain'), { icon: 'msg', act: 'cs-compl', arg: empId + '|' + pid }) + ui.btn(t('cs.agree'), { cls: 'primary', icon: 'check', act: 'cs-ok', arg: empId + '|' + pid });
    function box(tone, icon, txt, acts) { return '<section class="card" style="border-color:var(--' + tone + '-line);background:var(--' + tone + '-soft)"><div class="cb" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span class="ai" style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--card);color:var(--' + tone + ')">' + ic(icon) + '</span><div style="flex:1;min-width:260px">' + txt + '</div>' + (acts || '') + '</div></section>'; }
    if (p.status === 'u_toku') return box('accent', 'clock', t('cs.run'));
    if (ap.status === 'ceka') return box('warning', 'clock', (c && c.status === 'odbijen' ? t('cs.rej', { c: c.id, d: F.date(c.decidedAt), r: F.date(p.deadline) }) : t('cs.wait', { p: D.periodLabel(pid), d: F.date(p.deadline || p.to), x: daysLeft(p.deadline || p.to) })), btns);
    if (ap.status === 'korigovano') return box('accent', 'refresh', t('cs.kor', { p: D.periodLabel(pid), b: '<b>' + F.rsd(ap.prev) + '</b>', a: '<b>' + F.rsd(ap.now) + '</b>' }), btns);
    if (ap.status === 'prigovor') { var cc = c || getC(ap.complaint) || {}; return box('danger', 'msg', t('cs.inCompl', { c: cc.id || '', m: IH.esc((decider(cc.emp ? cc : { emp: empId }) || {}).name || ''), d: F.date(cc.at || IH.now()) })); }
    if (ap.status === 'saglasan') return box('success', 'checkc', t('cs.ok', { d: F.dt(ap.at || IH.now()) }));
    if (ap.status === 'auto') return box('success', 'checkc', t('cs.auto', { d: F.dt(ap.at || IH.now()) }));
    if (ap.status === 'odobreno') return box('success', 'checkc', t('cs.appr'));
    if (ap.status === 'isplaceno') return box('success', 'wallet', t('cs.paid', { d: F.date(ap.at || p.paidAt) }));
    return '';
  };
  IH.act['cs-ok'] = function (el) {
    var p = el.dataset.arg.split('|'), ap = EN.approval(p[0], p[1]), a = pay(p[0], p[1]);
    IH.modal({ title: t('cs.agreeT', { p: D.periodLabel(p[1]) }), body: '<p style="margin-top:0">' + t('cs.agreeTxt', { p: D.periodLabel(p[1]), a: '<b>' + F.rsd(a) + '</b>' }) + '</p>' + (ap.status === 'korigovano' ? '<div class="note">' + t('cs.agreeKor', { b: F.rsd(ap.prev), a: F.rsd(ap.now) }) + '</div>' : ''),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('cs.agree'), { cls: 'primary', icon: 'check', act: 'cs-ok-go', arg: el.dataset.arg }) });
  };
  IH.act['cs-ok-go'] = function (el) {
    var p = el.dataset.arg.split('|'), e = D.emp(p[0]), now = IH.now();
    EN.setApproval(p[0], p[1], { status: 'saglasan', at: now });
    IH.audit('consent', p[0] + '|' + p[1], { sr: 'Saglasnost na obračun ' + D.periodLabel(p[1]), en: 'Consent to ' + D.periodLabel(p[1]) + ' statement' }, { sr: F.rsd(pay(p[0], p[1])), en: F.rsd(pay(p[0], p[1])) });
    if (e.mgr === D.personas.manager.emp) notify('manager', { sr: e.name + ' je dao saglasnost na obračun ' + D.periodLabel(p[1]), en: e.name + ' consented to the ' + D.periodLabel(p[1]) + ' statement' }, 'saglasnosti-tima', 'checkc');
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('cs.agreed', { p: D.periodLabel(p[1]) }));
  };

  /* ---------- prigovor (zaposleni) ---------- */
  function PC() { return IH.form.pc; }
  function pcBody() {
    var f = PC(), m = D.emp(D.emp(f.emp).mgr), rs = IH.codeItems('RAZLOG_PRIGOVORA'), prods = prodsFor(f.emp);
    var sale = f.reason === 'STAVKA_NEDOSTAJE' || f.reason === 'POGRESAN_PERIOD' || f.reason === 'POGRESAN_IZNOS', pr = D.product(f.prod);
    return '<div class="form-grid"><div class="field"><label class="lab">' + t('pc.reason') + '</label><select class="in" data-pc="reason">' + rs.map(function (r) { return '<option value="' + r.id + '"' + (r.id === f.reason ? ' selected' : '') + '>' + IH.esc(IH.L(r.name)) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label class="lab">' + t('pc.to') + '</label><div class="in ro" style="display:flex;gap:8px;align-items:center">' + ui.avatar(m.name) + IH.esc(m.name) + '</div></div>' +
      (sale ? '<div class="field"><label class="lab">' + t('pc.contract') + '</label><input class="in" data-pc="contract" value="' + IH.esc(f.contract || '') + '"></div>' +
        '<div class="field"><label class="lab">' + t('pc.prod') + '</label><select class="in" data-pc="prod">' + prods.map(function (p) { return '<option value="' + p.id + '"' + (p.id === f.prod ? ' selected' : '') + '>' + IH.esc(D.productName(p)) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label class="lab">' + t('pc.amount') + '</label><input class="in tnum" data-pc="amount" value="' + (pr && pr.unit === 'RSD' && f.amount ? F.num(f.amount) : '') + '"' + (pr && pr.unit === 'RSD' ? '' : ' disabled') + '></div>' +
        '<div class="field"><label class="lab">' + t('pc.date') + '</label><input class="in" data-pc="date" value="' + F.date(f.date) + '"></div>' : '') +
      '<div class="field full"><label class="lab">' + t('pc.text') + ' <span class="req">*</span></label><textarea class="in" rows="3" data-pc="text">' + IH.esc(f.text || '') + '</textarea></div>' +
      '<div class="field full"><label class="lab">' + t('pc.att') + ' <span class="req">*</span></label>' + (f.att ? '<span class="filechip">' + ic('paperclip') + IH.esc(f.att) + '</span>' : ui.btn(t('pc.attach'), { cls: 'sm', icon: 'paperclip', act: 'pc-att' })) + '</div></div>';
  }
  IH.act['cs-compl'] = function (el) {
    var p = el.dataset.arg.split('|'), isMe = p[0] === 'E1002' && p[1] === '2026-Q3';
    IH.form = { pc: { emp: p[0], pid: p[1], reason: 'STAVKA_NEDOSTAJE', contract: isMe ? 'UG-2697710' : '', prod: 'P16', amount: isMe ? 650000 : 0, date: D.period(p[1]).to.slice(0, 8) + '29', text: isMe ? t('pc.textSug') : '', att: null } };
    IH.modal({ title: t('pc.title', { p: D.periodLabel(p[1]) }), wide: true, body: '<div id="pc-body">' + pcBody() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('pc.send'), { cls: 'primary', icon: 'send', act: 'pc-send' }) });
  };
  IH.act['pc-att'] = function () { var f = PC(); f.att = (f.contract ? 'Ugovor_' + f.contract : 'Prilog_prigovor') + '.pdf'; IH.swap('pc-body', pcBody()); };
  document.addEventListener('input', function (e) { var d = e.target.dataset || {}; if (d.pc === 'text' && PC()) PC().text = e.target.value; });
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}, f = PC(); if (!d.pc || !f) return;
    var v = e.target.value;
    if (d.pc === 'amount') f.amount = parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0;
    else if (d.pc === 'date') { var m = String(v).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/); if (m) f.date = m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2); }
    else f[d.pc] = v;
    if (d.pc === 'reason' || d.pc === 'prod') IH.swap('pc-body', pcBody());
  });
  IH.act['pc-send'] = function () {
    var f = PC(); if (!f.text || !f.att) { IH.toast(t('pc.need')); return; }
    var e = D.emp(f.emp), m = D.emp(e.mgr), id = 'C-0' + (414 + IH.list('newComplaints').length), pr = D.product(f.prod);
    var c = { id: id, emp: f.emp, period: f.pid, status: 'otvoren', at: IH.now(), reason: f.reason, contract: f.contract || null, subject: { sr: prName(f.reason) + (f.contract ? ' · ' + f.contract : ''), en: prName(f.reason) + (f.contract ? ' · ' + f.contract : '') }, text: { sr: f.text, en: f.text }, attach: [f.att], thread: [] };
    if (f.contract && pr) c.proposal = { kind: 'linija', prod: pr.id, code: pr.codes[0], amount: pr.unit === 'RSD' ? f.amount : 0, date: f.date, contract: f.contract, client: 'Klijent ••' + f.contract.slice(-4) };
    IH.list('newComplaints').push(c);
    EN.setApproval(f.emp, f.pid, { status: 'prigovor', complaint: id, at: c.at });
    IH.audit('complaint', id, { sr: 'Prigovor uložen', en: 'Complaint filed' }, c.subject);
    if (m && m.id === D.personas.manager.emp) notify('manager', { sr: e.name + ' je uložio prigovor na obračun ' + D.periodLabel(f.pid), en: e.name + ' filed a complaint on the ' + D.periodLabel(f.pid) + ' statement' }, 'prigovori-tima/' + id, 'msg');
    IH.save(); IH.form = {}; IH.closeModal(); IH.render(); IH.toast(t('pc.sent', { c: id, m: IH.esc(m ? m.name : '') }));
  };

  /* ---------- prepiska ---------- */
  IH.threadHtml = function (c, canReply) {
    var me = IH.me();
    var list = thread(c).map(function (m) {
      var who = m.sys ? t('pt.sys') : D.emp(m.by) ? D.emp(m.by).name : '', mine = m.by === me.id;
      return '<div style="display:flex;gap:10px;margin-bottom:12px;' + (mine ? 'flex-direction:row-reverse;' : '') + '">' + (m.sys ? '<span class="av" style="background:var(--accent-soft);color:var(--accent)">' + ic('info') + '</span>' : ui.avatar(who)) +
        '<div style="max-width:78%;background:' + (m.sys ? 'var(--accent-soft)' : mine ? 'var(--subtle)' : 'var(--card)') + ';border:1px solid var(--line);border-radius:10px;padding:9px 12px"><div class="mut" style="font-size:11.5px;margin-bottom:3px">' + IH.esc(who) + ' · ' + F.dt(m.at) + '</div><div>' + IH.esc(IH.L(m.text)) + '</div>' +
        (m.att ? '<div style="margin-top:6px">' + m.att.map(function (a) { return '<span class="filechip" style="padding:3px 8px">' + ic('paperclip') + IH.esc(a) + '</span>'; }).join(' ') + '</div>' : '') + '</div></div>';
    }).join('');
    var reply = canReply && c.status === 'otvoren' ? '<div style="display:flex;gap:8px;margin-top:6px"><input class="in" id="pt-msg" placeholder="' + t('pt.replyPh') + '" style="flex:1">' + ui.btn(t('pt.send'), { icon: 'send', act: 'pt-msg', arg: c.id }) + '</div>' : '';
    return list + reply;
  };
  IH.act['pt-msg'] = function (el) {
    var inp = document.getElementById('pt-msg'), v = inp && inp.value.trim(); if (!v) return;
    var c = getC(el.dataset.arg), me = IH.me();
    addMsg(c.id, me.id, v);
    if (me.id === c.emp) notify('manager', { sr: D.emp(c.emp).name + ' — nova poruka u prigovoru ' + c.id, en: D.emp(c.emp).name + ' — new message in complaint ' + c.id }, 'prigovori-tima/' + c.id);
    else if (c.emp === D.personas.employee.emp) notify('employee', { sr: 'Nova poruka menadžera u prigovoru ' + c.id, en: 'New message from your manager in complaint ' + c.id }, 'moj-obracun');
    IH.save(); IH.render();
  };

  /* ================= MENADŽER: PRIGOVORI TIMA ================= */
  function mine() { var me = IH.me(); return IH.complaints().filter(function (c) { return D.emp(c.emp).mgr === me.id; }); }
  function cst(s) { return ui.pill(t('pst2.' + s), s === 'otvoren' ? 'warning' : s === 'usvojen' ? 'success' : 'gray'); }
  function listPage() {
    var grid = IH.grid({
      id: 'pt', exportName: 'Prigovori_tima.xlsx', searchLabel: IH.L(L('Zaposleni ili tema', 'Employee or topic')),
      rows: function () { return mine().sort(function (a, b) { return (a.status === 'otvoren' ? 0 : 1) - (b.status === 'otvoren' ? 0 : 1) || (a.at < b.at ? 1 : -1); }); }, key: function (c) { return c.id; }, label: function (c) { return c.id; }, searchKeys: ['e', 's', 'id'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (c) { return t('pst2.' + c.status); }, fval: function (c) { return c.status; }, render: function (c) { return cst(c.status); }, filter: function () { return ['otvoren', 'usvojen', 'odbijen'].map(function (k) { return { v: k, l: t('pst2.' + k) }; }); } },
        { key: 'id', label: t('pt.colId'), val: function (c) { return c.id; }, render: function (c) { return '<b>' + c.id + '</b>'; } },
        { key: 'per', label: t('c.period'), val: function (c) { return D.periodLabel(c.period); }, fval: function (c) { return c.period; }, filter: function () { var u = {}; mine().forEach(function (c) { u[c.period] = 1; }); return Object.keys(u).map(function (p) { return { v: p, l: D.periodLabel(p) }; }); } },
        { key: 'e', label: t('pt.colEmp'), val: function (c) { return D.emp(c.emp).name; }, render: function (c) { return '<b>' + IH.esc(D.emp(c.emp).name) + '</b>'; } },
        { key: 's', label: t('pt.colTopic'), nw: false, val: function (c) { return IH.L(c.subject); }, render: function (c) { return '<div style="min-width:220px;max-width:340px">' + IH.esc(IH.L(c.subject)) + '</div>'; } },
        { key: 'r', label: t('pt.colReason'), val: function (c) { return prName(c.reason); }, filter: function () { return IH.codeItems('RAZLOG_PRIGOVORA').map(function (x) { return { v: IH.L(x.name), l: IH.L(x.name) }; }); } },
        { key: 'at', label: t('pt.colAt'), search: false, val: function (c) { return c.at; }, render: function (c) { return F.dt(c.at); } },
        { key: 'due', label: t('pt.colDue'), search: false, val: function (c) { return due(c); }, render: function (c) { if (c.status !== 'otvoren') return '<span class="mut">—</span>'; var d = daysLeft(due(c)); return '<span style="color:' + (d <= 1 ? 'var(--danger)' : 'inherit') + '">' + F.date(due(c)) + '</span>'; } },
        { key: 'dec', label: t('pt.colDecided'), search: false, val: function (c) { return c.decidedAt || ''; }, render: function (c) { return c.decidedAt ? F.date(c.decidedAt) : '<span class="mut">—</span>'; } }
      ],
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (c) { return 'prigovori-tima/' + c.id; } }]
    });
    return ui.header(t('pt.title')) + grid;
  }
  function dataForm(c) {
    var e = D.emp(c.emp);
    return ui.form([
      { k: 'cd_e', label: t('pt.colEmp'), value: e.name }, { k: 'cd_p', label: t('c.position'), value: D.posName(e.pos) },
      { k: 'cd_per', label: t('c.period'), value: D.periodLabel(c.period) }, { k: 'cd_r', label: t('pt.colReason'), value: prName(c.reason) },
      { k: 'cd_u', label: t('pc.contract'), value: c.contract || '' }, { k: 'cd_at', label: t('pt.colAt'), value: F.dt(c.at) },
      { k: 'cd_s', label: t('pt.colTopic'), value: IH.L(c.subject), full: true }, { k: 'cd_a', label: t('pc.att'), value: (c.attach || []).join(', '), full: true }
    ], { readonly: true });
  }
  function detailPage(id) {
    var c = getC(id); if (!c) return listPage();
    var e = D.emp(c.emp), ap = EN.approval(c.emp, c.period);
    var head = ui.header(c.id + ' · ' + IH.esc(IH.L(c.subject)), '', cst(c.status), '<a href="#/prigovori-tima">' + t('pt.title') + '</a> ' + ic('chevr') + ' ' + c.id + ' · ' + IH.esc(e.name) + ' · ' + D.periodLabel(c.period));
    var dec = c.status === 'otvoren' ? '<div style="display:flex;gap:8px;flex-wrap:wrap">' + ui.btn(t('pt.reject'), { cls: 'danger', icon: 'x', act: 'pt-rej', arg: c.id }) + ui.btn(t('pt.accept'), { cls: 'primary', icon: 'check', act: 'pt-acc', arg: c.id }) + '</div>'
      : '<div>' + cst(c.status) + ' ' + t('pt.decided', { m: IH.esc(D.emp(c.decidedBy).name), d: F.dt(c.decidedAt) }) + (c.corrId ? '<div style="margin-top:6px">' + t('pt.corrLink') + ' <a href="#/korekcije/istorija">' + c.corrId + '</a></div>' : '') + '</div>';
    var r = EN.result(c.emp, c.period);
    var side = ui.card(t('pt.decision'), dec) + ui.card(t('pt.facts'), facts(c)) +
      ui.card(t('pt.stmt'), ui.form([{ k: 'cs_p', label: t('c.period'), value: D.periodLabel(c.period) }, { k: 'cs_a', label: IH.L(L('Iznos', 'Amount')), value: F.rsd(r ? r.payout : 0) }, { k: 'cs_s', label: t('c.status'), display: t('st.' + ap.status), value: ap.status }], { readonly: true }), { actions: ui.btn(t('pt.stmt'), { cls: 'sm', icon: 'calc', go: 'saglasnosti-tima/' + c.period + '/' + c.emp }) });
    return head + '<div class="grid g-main"><div>' + ui.card(t('pt.data'), dataForm(c)) + ui.card(t('pt.thread'), IH.threadHtml(c, true)) + '</div><div>' + side + '</div></div>';
  }
  /* usvajanje: korekcija + ponovni obračun zaposlenog + ponovna saglasnost */
  function PA() { return IH.form.pa; }
  function propRec(c, f) {
    var e = D.emp(c.emp), pr = D.product(f.prod);
    if (f.kind === 'iznos') return { kind: 'iznos', emp: c.emp, period: c.period, amount: f.amount || 0, reason: 'USVOJEN_PRIGOVOR', note: { sr: 'Usvojen prigovor ' + c.id, en: 'Complaint ' + c.id + ' accepted' }, doc: (c.attach || [])[0], at: IH.now(), by: IH.me().id, complaint: c.id };
    return { kind: 'linija', emp: c.emp, period: c.period, reason: 'USVOJEN_PRIGOVOR', note: { sr: 'Usvojen prigovor ' + c.id, en: 'Complaint ' + c.id + ' accepted' }, doc: (c.attach || [])[0], at: IH.now(), by: IH.me().id, complaint: c.id,
      item: { id: 'TX-PRG-' + c.id, date: f.date, emp: c.emp, branch: e.branch, period: c.period, product: pr.id, code: f.code || pr.codes[0], seg: pr.seg, ptype: pr.ptype, cat: pr.cat, type: 'nova', amount: pr.unit === 'RSD' ? f.amount || 0 : 0, client: f.client || '', contract: f.contract || '', source: 'KOREKCIJA', status: 'priznato' } };
  }
  function simAccept(c, f) {
    var before = pay(c.emp, c.period), rec = propRec(c, f), st2 = IH.list('corrections'), rc = IH.map('recalc'), saved = JSON.stringify(rc), after;
    try { st2.push(rec); rc[c.period + '|' + c.emp] = rec.at; EN.invalidate(); after = pay(c.emp, c.period); }
    finally { st2.pop(); IH.state.data.recalc = JSON.parse(saved); EN.invalidate(); }
    return { b: before, a: after };
  }
  function paBody() {
    var f = PA(), c = getC(f.id), pr = D.product(f.prod), s = simAccept(c, f), prods = prodsFor(c.emp);
    return '<p style="margin-top:0">' + t('pt.accTxt') + '</p><div class="lab">' + t('pt.corr') + '</div>' + ui.segForm('pa_kind', [{ v: 'linija', l: t('pt.kLine') }, { v: 'iznos', l: t('pt.kAmt') }], f.kind).replace(/data-act="segform"/g, 'data-act="pa-kind"') +
      '<div class="form-grid" style="margin-top:10px">' + (f.kind === 'linija' ? '<div class="field"><label class="lab">' + t('pc.prod') + '</label><select class="in" data-pa="prod">' + prods.map(function (p) { return '<option value="' + p.id + '"' + (p.id === f.prod ? ' selected' : '') + '>' + IH.esc(D.productName(p)) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label class="lab">' + t('pc.amount') + '</label><input class="in tnum" data-pa="amount" value="' + (pr.unit === 'RSD' && f.amount ? F.num(f.amount) : '') + '"' + (pr.unit === 'RSD' ? '' : ' disabled') + '></div>' +
        '<div class="field"><label class="lab">' + t('pc.contract') + '</label><input class="in" data-pa="contract" value="' + IH.esc(f.contract || '') + '"></div><div class="field"><label class="lab">' + t('pc.date') + '</label><input class="in" disabled value="' + F.date(f.date) + '"></div>'
        : '<div class="field"><label class="lab">' + t('km.amount') + '</label><input class="in tnum" data-pa="amount" value="' + F.num(f.amount || 0) + '"></div>') + '</div>' +
      '<div class="lab">' + t('kc.effect') + '</div>' + ui.table([{ key: 'e', label: t('c.employee') }, { key: 'b', label: t('kc.before'), num: true }, { key: 'a', label: t('kc.after'), num: true }, { key: 'd', label: t('kc.diff'), num: true }], [{ e: IH.esc(D.emp(c.emp).name), b: F.num(s.b), a: '<b>' + F.num(s.a) + '</b>', d: '<b style="color:' + (s.a >= s.b ? 'var(--success)' : 'var(--danger)') + '">' + (s.a >= s.b ? '+' : '−') + F.num(Math.abs(s.a - s.b)) + '</b>' }], { compact: true });
  }
  IH.act['pt-acc'] = function (el) {
    var c = getC(el.dataset.arg), pp = c.proposal || { kind: 'iznos', amount: 5000 };
    IH.form = { pa: { id: c.id, kind: pp.kind, prod: pp.prod || 'P16', code: pp.code, amount: pp.amount || 0, date: pp.date || D.period(c.period).to, contract: pp.contract, client: pp.client } };
    IH.modal({ title: t('pt.accT', { c: c.id }), wide: true, body: '<div id="pa-body">' + paBody() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('pt.accept'), { cls: 'primary', icon: 'check', act: 'pt-acc-go', arg: c.id }) });
  };
  IH.act['pa-kind'] = function (el) { var p = el.dataset.arg.split('|'); PA().kind = p[1]; if (p[1] === 'iznos' && !PA().amount) PA().amount = 5000; IH.swap('pa-body', paBody()); };
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}, f = PA(); if (!d.pa || !f) return;
    var v = e.target.value;
    if (d.pa === 'amount') f.amount = parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0;
    else if (d.pa === 'prod') { f.prod = v; f.code = D.product(v).codes[0]; }
    else f[d.pa] = v;
    IH.swap('pa-body', paBody());
  });
  IH.act['pt-acc-go'] = function (el) {
    var c = getC(el.dataset.arg), f = PA(), me = IH.me(), before = pay(c.emp, c.period);
    var rec = IH.saveCorrection(propRec(c, f));
    IH.map('recalc')[c.period + '|' + c.emp] = rec.at; EN.invalidate();
    var after = pay(c.emp, c.period);
    EN.setApproval(c.emp, c.period, { status: 'korigovano', at: rec.at, prev: before, now: after, complaint: c.id });
    IH.list('calcRuns').push({ pid: c.period, at: rec.at, by: me.id, scope: D.emp(c.emp).name + ' · ' + c.id, n: 1, delta: after - before });
    st()[c.id] = { status: 'usvojen', decidedAt: rec.at, decidedBy: me.id, corrId: rec.id };
    addMsg(c.id, me.id, IH.L({ sr: 'Prigovor je usvojen. Napravljena je korekcija ' + rec.id + '; novi iznos ' + F.rsd(after) + ' čeka vašu ponovnu saglasnost.', en: 'Complaint accepted. Correction ' + rec.id + ' was created; the new amount ' + F.rsd(after) + ' awaits your re-consent.' }), true);
    IH.audit('complaint', c.id, { sr: 'Prigovor usvojen', en: 'Complaint accepted' }, { sr: 'Korekcija ' + rec.id + ' · ' + F.num(before) + ' → ' + F.num(after), en: 'Correction ' + rec.id + ' · ' + F.num(before) + ' → ' + F.num(after) });
    if (c.emp === D.personas.employee.emp) notify('employee', { sr: 'Prigovor ' + c.id + ' je usvojen — novi iznos ' + F.rsd(after) + ' čeka saglasnost', en: 'Complaint ' + c.id + ' accepted — new amount ' + F.rsd(after) + ' awaits consent' }, 'moj-obracun', 'checkc');
    notify('admin', { sr: me.name + ' je usvojio prigovor ' + c.id + ' (' + D.emp(c.emp).name + ') — korekcija ' + rec.id, en: me.name + ' accepted complaint ' + c.id + ' — correction ' + rec.id }, 'korekcije/istorija', 'edit');
    IH.save(); IH.form = {}; IH.closeModal(); IH.go('prigovori-tima'); IH.toast(t('pt.accDone', { c: c.id, k: rec.id }));
  };
  IH.act['pt-rej'] = function (el) {
    var c = getC(el.dataset.arg); IH.form = {};
    var sug = c.item ? t('pt.rejSug', { d: F.date(c.item.date) }) : IH.L(L('Stavka ne ispunjava uslove targeta za ovaj period.', 'The item does not meet the target conditions for this period.'));
    IH.modal({ title: t('pt.rejT', { c: c.id }), body: ui.field('pt_rn', t('pt.rejNote'), sug, { type: 'textarea' }),
      foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('pt.reject'), { cls: 'danger', icon: 'x', act: 'pt-rej-go', arg: c.id }) });
  };
  IH.act['pt-rej-go'] = function (el) {
    var c = getC(el.dataset.arg), me = IH.me(), v = (document.getElementById('fld-pt_rn') || {}).value;
    if (!v) { IH.toast(t('pt.rejNote')); return; }
    st()[c.id] = { status: 'odbijen', decidedAt: IH.now(), decidedBy: me.id };
    addMsg(c.id, me.id, v);
    EN.setApproval(c.emp, c.period, { status: 'ceka', at: IH.now(), complaint: c.id });
    IH.audit('complaint', c.id, { sr: 'Prigovor odbijen', en: 'Complaint rejected' }, { sr: v, en: v });
    if (c.emp === D.personas.employee.emp) notify('employee', { sr: 'Prigovor ' + c.id + ' je odbijen — obrazloženje u prepisci', en: 'Complaint ' + c.id + ' rejected — see the thread' }, 'moj-obracun', 'msg');
    IH.save(); IH.closeModal(); IH.go('prigovori-tima'); IH.toast(t('pt.rejDone', { c: c.id }));
  };

  IH.route('prigovori-tima', { title: function () { return t('pt.title'); }, render: function (p) { return p[0] ? detailPage(p[0]) : listPage(); } });

  /* statistika za meni i početne strane */
  IH.stats.openComplaints = function (mgrId) { return IH.complaints().filter(function (c) { return c.status === 'otvoren' && (!mgrId || D.emp(c.emp).mgr === mgrId); }); };
})();
