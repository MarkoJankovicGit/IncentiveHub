/* Incentive Hub — Obračunski periodi (Podešavanja)
   Kalendar perioda (mesečni, kvartalni, polugodišnji, godišnji) i vrste perioda sa podrazumevanim rokovima.
   Na periode se oslanjaju: targeti i šeme (vrsta perioda, važi od), dodela i raspodela (izbor perioda), bodovne liste (važi od),
   timski target kao zbir (kraći periodi unutar dužeg), obračun, saglasnosti, isplata i obaveštenja (rokovi).
   Status perioda menja proces (obračun, saglasnost, isplata), ne ručna izmena. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'nav.periodi': 'Obračunski periodi', 'pe.title': 'Obračunski periodi', 'pe.tCal': 'Kalendar perioda', 'pe.tTypes': 'Vrste perioda',
    'pe.gen': 'Generiši periode', 'pe.search': 'Period', 'pe.colPer': 'Period', 'pe.colType': 'Vrsta', 'pe.colYear': 'Godina', 'pe.colFrom': 'Od', 'pe.colTo': 'Do',
    'pe.colLock': 'Zaključavanje podataka', 'pe.colDeadline': 'Rok za saglasnost', 'pe.colPay': 'Isplata', 'pe.colUsed': 'Šeme', 'pe.colNote': 'Napomena', 'pe.colCalc': 'Obračun poslat',
    'pe.genT': 'Generisanje perioda', 'pe.year': 'Godina', 'pe.types': 'Vrste perioda', 'pe.genN': 'Novi periodi: {n}', 'pe.genSkip': 'Već postoji: {n}', 'pe.genGo': 'Generiši ({n})', 'pe.genNone': 'Svi periodi izabranih vrsta za ovu godinu već postoje',
    'pe.genDone': 'Kreirano {n} perioda za {y}', 'pe.genRules': 'Rokovi i isplata — dana posle kraja perioda', 'pe.days': 'dana', 'pe.genShift': 'Rok za saglasnost i isplata koji padnu na vikend pomeraju se na ponedeljak', 'pe.colFromTo': 'Od – do', 'pe.badRow': 'Datumi nisu u ispravnom redosledu', 'pe.genBad': 'Ispravite datume označenih perioda', 'pe.weekend': 'Pada na vikend', 'pe.editT': 'Rokovi perioda — {p}', 'pe.viewT': 'Period — {p}', 'pe.saved': 'Rokovi perioda {p} su sačuvani', 'pe.bad': 'Rokovi nisu sačuvani: {r}',
    'pe.badOrder': 'redosled mora biti: kraj perioda ≤ zaključavanje podataka ≤ rok za saglasnost ≤ isplata', 'pe.badPast': 'rok za saglasnost ne može biti pre današnjeg dana',
    'pe.del': 'Obriši period', 'pe.delT': 'Brisanje perioda {p}', 'pe.delTxt': 'Period se briše iz kalendara.', 'pe.delWarn': 'Za ovaj period važe šeme: {s}. Posle brisanja za njega neće biti dodele ni obračuna.',
    'pe.deleted': 'Period {p} je obrisan', 'pe.delUsed': 'Period se ne može obrisati: ima dodeljene vrednosti targeta',
    'pe.tyLen': 'Trajanje', 'pe.tyMonths': '{n} mes.', 'pe.tyDays': '+{n} dana', 'pe.tyActive': 'U upotrebi', 'pe.tyUsed': 'Šeme · targeti', 'pe.tyEditT': 'Vrsta perioda — {n}',
    'pe.tyLock': 'Zaključavanje podataka (dana posle kraja)', 'pe.tyDeadline': 'Rok za saglasnost (dana posle kraja)', 'pe.tyPay': 'Isplata (dana posle kraja)', 'pe.tyHint': 'Važi za nove periode; postojeći periodi zadržavaju svoje rokove',
    'pe.tySaved': 'Vrsta perioda „{n}“ je sačuvana', 'pe.tyNoOff': 'Vrsta se koristi u aktivnim šemama ili targetima i ne može se isključiti', 'pe.tyBad': 'mora važiti: zaključavanje ≤ rok za saglasnost ≤ isplata',
    'pe.noPlanned': 'Nema planiranih perioda ove vrste', 'pe.toCal': 'Obračunski periodi', 'sc.exNone': 'Primer obračuna je dostupan kada postoji tekući ili zaključen period ove vrste',
    'pst.planiran': 'Planiran', 'ob.h': 'Polugodište', 'ob.y': 'Godina', 'am.period': 'Obračunski periodi'
  }, {
    'nav.periodi': 'Calculation periods', 'pe.title': 'Calculation periods', 'pe.tCal': 'Period calendar', 'pe.tTypes': 'Period types',
    'pe.gen': 'Generate periods', 'pe.search': 'Period', 'pe.colPer': 'Period', 'pe.colType': 'Type', 'pe.colYear': 'Year', 'pe.colFrom': 'From', 'pe.colTo': 'To',
    'pe.colLock': 'Data lock', 'pe.colDeadline': 'Consent deadline', 'pe.colPay': 'Payout', 'pe.colUsed': 'Schemes', 'pe.colNote': 'Note', 'pe.colCalc': 'Statement sent',
    'pe.genT': 'Generate periods', 'pe.year': 'Year', 'pe.types': 'Period types', 'pe.genN': 'New periods: {n}', 'pe.genSkip': 'Already exist: {n}', 'pe.genGo': 'Generate ({n})', 'pe.genNone': 'All periods of the selected types already exist for this year',
    'pe.genDone': '{n} periods created for {y}', 'pe.genRules': 'Deadlines and payout — days after period end', 'pe.days': 'days', 'pe.genShift': 'A consent deadline or payout falling on a weekend moves to Monday', 'pe.colFromTo': 'From – to', 'pe.badRow': 'Dates are not in the correct order', 'pe.genBad': 'Fix the dates of the marked periods', 'pe.weekend': 'Falls on a weekend', 'pe.editT': 'Period deadlines — {p}', 'pe.viewT': 'Period — {p}', 'pe.saved': 'Deadlines of period {p} saved', 'pe.bad': 'Deadlines not saved: {r}',
    'pe.badOrder': 'the order must be: period end ≤ data lock ≤ consent deadline ≤ payout', 'pe.badPast': 'the consent deadline cannot be before today',
    'pe.del': 'Delete period', 'pe.delT': 'Delete period {p}', 'pe.delTxt': 'The period is removed from the calendar.', 'pe.delWarn': 'Schemes apply to this period: {s}. After deletion there will be no assignment or calculation for it.',
    'pe.deleted': 'Period {p} deleted', 'pe.delUsed': 'The period cannot be deleted: it has assigned target values',
    'pe.tyLen': 'Length', 'pe.tyMonths': '{n} mo.', 'pe.tyDays': '+{n} days', 'pe.tyActive': 'In use', 'pe.tyUsed': 'Schemes · targets', 'pe.tyEditT': 'Period type — {n}',
    'pe.tyLock': 'Data lock (days after end)', 'pe.tyDeadline': 'Consent deadline (days after end)', 'pe.tyPay': 'Payout (days after end)', 'pe.tyHint': 'Applies to new periods; existing periods keep their deadlines',
    'pe.tySaved': 'Period type “{n}” saved', 'pe.tyNoOff': 'The type is used by active schemes or targets and cannot be switched off', 'pe.tyBad': 'must hold: data lock ≤ consent deadline ≤ payout',
    'pe.noPlanned': 'No planned periods of this type', 'pe.toCal': 'Calculation periods', 'sc.exNone': 'The calculation example is available once there is a current or closed period of this type',
    'pst.planiran': 'Planned', 'ob.h': 'Half-year', 'ob.y': 'Year', 'am.period': 'Calculation periods'
  });

  var ORD = { Y: 0, H: 1, Q: 2, M: 3 }, YEARS = ['2027', '2028'];
  function yearOf(p) { return p.from.slice(0, 4); }
  function lockOf(p) { return p.lockedAt ? p.lockedAt.slice(0, 10) : p.lockBy; }
  function payOf(p) { return p.paidAt || p.payDate; }
  function dOr(v) { return v ? F.date(String(v).slice(0, 10)) : '<span class="mut">—</span>'; }
  function pill(p) { return ui.pill(t('pst.' + p.status), { planiran: 'gray', u_toku: 'accent', saglasnost: 'warning', zakljucan: 'info', isplaceno: 'success' }[p.status] || 'gray'); }
  function canEdit(p) { return p.status === 'planiran' || p.status === 'u_toku' || p.status === 'saglasnost'; }
  /* šeme koje važe za period: aktivne, iste vrste perioda, prva verzija počinje najkasnije sa periodom */
  function schemesFor(p) { return IH.schemes().filter(function (s) { if (s.status !== 'aktivan' || s.periodType !== p.type) return false; var vs = D.schemeVersions(s); return vs.length && vs[0].from <= p.from; }); }
  function valsFor(pid) { var n = 0; Object.keys(IH.state.data.vals || {}).forEach(function (k) { if (k.split('|')[1] === pid) n++; }); return n; }
  function typeUse(id) { return { s: IH.schemes().filter(function (s) { return s.status === 'aktivan' && s.periodType === id; }).length, tg: IH.targets().filter(function (x) { return x.status === 'aktivan' && x.periodType === id; }).length }; }
  function bump() { IH.state.data._pv = (IH.state.data._pv || 0) + 1; EN.invalidate(); IH.save(); }
  function header() { return ui.header(t('pe.title')); }
  function tabs(cur) { return ui.rtabs('periodi', [{ id: '', label: t('pe.tCal'), cnt: D.allPeriods().length }, { id: 'vrste', label: t('pe.tTypes'), cnt: D.activePeriodTypes().length }], cur); }

  /* ---------- kalendar ---------- */
  function calPage() {
    var grid = IH.grid({
      id: 'pe-cal', exportName: 'Obracunski_periodi.xlsx', searchLabel: t('pe.search'), create: { label: t('pe.gen'), act: 'pe-gen' },
      rows: function () { return D.allPeriods().slice().sort(function (a, b) { return yearOf(b) - yearOf(a) || (a.from < b.from ? -1 : a.from > b.from ? 1 : 0) || ORD[a.type] - ORD[b.type]; }); },
      key: function (p) { return p.id; }, label: function (p) { return IH.L(p.label); }, searchKeys: ['n'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (p) { return p.status; }, render: pill, filter: function () { return ['planiran', 'u_toku', 'saglasnost', 'isplaceno'].map(function (k) { return { v: k, l: t('pst.' + k) }; }); } },
        { key: 'n', label: t('pe.colPer'), val: function (p) { return IH.L(p.label); }, render: function (p) { return '<b>' + IH.esc(IH.L(p.label)) + '</b>'; } },
        { key: 'ty', label: t('pe.colType'), val: function (p) { return t('per.' + p.type); }, fval: function (p) { return p.type; }, filter: function () { return D.periodTypes.map(function (x) { return { v: x.id, l: t('per.' + x.id) }; }); } },
        { key: 'y', label: t('pe.colYear'), val: yearOf, fval: yearOf, filter: function () { var o = {}; D.allPeriods().forEach(function (p) { o[yearOf(p)] = 1; }); return Object.keys(o).sort().reverse().map(function (y) { return { v: y, l: y }; }); } },
        { key: 'from', label: t('pe.colFrom'), search: false, val: function (p) { return p.from; }, render: function (p) { return F.date(p.from); } },
        { key: 'to', label: t('pe.colTo'), search: false, val: function (p) { return p.to; }, render: function (p) { return F.date(p.to); } },
        { key: 'lock', label: t('pe.colLock'), search: false, val: lockOf, render: function (p) { return dOr(lockOf(p)); } },
        { key: 'dl', label: t('pe.colDeadline'), search: false, val: function (p) { return p.deadline || ''; }, render: function (p) { return dOr(p.deadline); } },
        { key: 'pay', label: t('pe.colPay'), search: false, val: payOf, render: function (p) { return dOr(payOf(p)); } },
        { key: 'sc', label: t('pe.colUsed'), val: function (p) { return schemesFor(p).map(function (s) { return s.code; }).join(', '); }, render: function (p) { var l = schemesFor(p); return l.length ? '<span title="' + IH.esc(l.map(function (s) { return IH.L(s.name); }).join(', ')) + '">' + l.length + '</span>' : '<span class="mut">—</span>'; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'pe-view' },
        { type: 'edit', title: t('g.aEdit'), act: 'pe-edit', kind: 'acc', show: canEdit },
        { type: 'history', title: t('g.aHistory'), act: 'pe-hist' },
        { type: 'delete', title: t('pe.del'), act: 'pe-del', kind: 'dan', show: function (p) { return !!p.gen && p.status === 'planiran'; } }
      ]
    });
    return header() + tabs('') + grid;
  }
  function viewFields(p) {
    return [
      { k: 'pv_n', label: t('pe.colPer'), value: IH.L(p.label) }, { k: 'pv_t', label: t('pe.colType'), value: t('per.' + p.type) }, { k: 'pv_s', label: t('c.status'), value: t('pst.' + p.status) },
      { k: 'pv_f', label: t('pe.colFrom'), value: F.date(p.from) }, { k: 'pv_to', label: t('pe.colTo'), value: F.date(p.to) }, { k: 'pv_sc', label: t('pe.colUsed'), value: schemesFor(p).map(function (s) { return IH.L(s.name); }).join(', ') || '—' }
    ];
  }
  IH.act['pe-view'] = function (el) {
    var p = D.period(el.dataset.arg); if (!p) return;
    var f = viewFields(p).concat([
      { k: 'pv_l', label: t('pe.colLock'), value: lockOf(p) ? F.date(lockOf(p).slice(0, 10)) : '—' }, { k: 'pv_d', label: t('pe.colDeadline'), value: p.deadline ? F.date(p.deadline) : '—' },
      { k: 'pv_p', label: t('pe.colPay'), value: payOf(p) ? F.date(payOf(p)) : '—' }, { k: 'pv_no', label: t('pe.colNote'), value: p.note ? IH.L(p.note) : '', full: true }
    ]);
    IH.modal({ title: t('pe.viewT', { p: IH.esc(IH.L(p.label)) }), wide: true, body: ui.form(f, { readonly: true, cols: 3 }), foot: (canEdit(p) ? ui.btn(t('c.edit'), { icon: 'edit', act: 'pe-edit', arg: p.id }) : '') + ui.btn(t('c.close'), { act: 'modal-close' }) });
  };
  /* izmena rokova: planiran i tekući — svi rokovi; saglasnost u toku — produženje roka i datum isplate */
  IH.act['pe-edit'] = function (el) {
    var p = D.period(el.dataset.arg); if (!p || !canEdit(p)) return;
    IH.closeModal(); IH.form = {};
    var sag = p.status === 'saglasnost';
    var f = viewFields(p).concat([
      sag ? { k: 'pe_l', label: t('pe.colLock'), type: 'static', value: lockOf(p) ? F.date(lockOf(p).slice(0, 10)) : '—' } : { k: 'pe_l', label: t('pe.colLock'), type: 'date', value: lockOf(p) || '' },
      { k: 'pe_d', label: t('pe.colDeadline'), type: 'date', value: p.deadline || '' }, { k: 'pe_p', label: t('pe.colPay'), type: 'date', value: p.payDate || '' },
      { k: 'pe_no', label: t('pe.colNote'), value: p.note ? IH.L(p.note) : '', full: true }
    ]).map(function (x) { if (/^pv_/.test(x.k)) x.type = 'static'; return x; });
    IH.modal({ title: t('pe.editT', { p: IH.esc(IH.L(p.label)) }), wide: true, body: ui.form(f, { cols: 3 }), foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'pe-save', arg: p.id }) });
  };
  IH.act['pe-save'] = function (el) {
    var p = D.period(el.dataset.arg); if (!p) return;
    var sag = p.status === 'saglasnost', fv = IH.form || {};
    var lock = sag ? lockOf(p).slice(0, 10) : (fv.pe_l || lockOf(p)), dl = fv.pe_d || p.deadline, pay = fv.pe_p || p.payDate, note = fv.pe_no != null ? fv.pe_no : (p.note ? IH.L(p.note) : '');
    var bad = [];
    if (!(p.to <= lock && lock <= dl && dl <= pay)) bad.push(t('pe.badOrder'));
    if ((sag || p.status === 'u_toku') && dl < D.TODAY) bad.push(t('pe.badPast'));
    if (bad.length) { IH.toast(t('pe.bad', { r: bad.join('; ') })); return; }
    var ch = { deadline: dl, payDate: pay, note: note ? { sr: note, en: note } : undefined };
    if (!sag) ch.lockBy = lock;
    var old = { l: lockOf(p), d: p.deadline, p: p.payDate };
    IH.map('periodEdits')[p.id] = Object.assign({}, IH.map('periodEdits')[p.id], ch);
    var txt = [old.l !== lock && !sag ? IH.L(L('zaključavanje ', 'data lock ')) + F.date(lock) : null, old.d !== dl ? IH.L(L('rok za saglasnost ', 'consent deadline ')) + F.date(dl) : null, old.p !== pay ? IH.L(L('isplata ', 'payout ')) + F.date(pay) : null].filter(Boolean).join(' · ') || IH.L(L('napomena', 'note'));
    IH.audit('period', p.id, { sr: 'Izmenjeni rokovi perioda ' + IH.L(p.label), en: 'Period deadlines changed — ' + IH.L(p.label) }, { sr: txt, en: txt });
    bump(); IH.closeModal(); IH.render(); IH.toast(t('pe.saved', { p: IH.esc(IH.L(p.label)) }));
  };
  IH.act['pe-hist'] = function (el) {
    var p = D.period(el.dataset.arg); if (!p) return;
    var h = IH.auditFor('period', p.id).slice();
    if (p.gen) h.push({ at: p.genAt || IH.now(), by: p.genBy || 'A001', action: { sr: 'Period generisan', en: 'Period generated' } });
    if (p.lockedAt) h.push({ at: p.lockedAt, by: 'A001', action: { sr: 'Podaci zaključani', en: 'Data locked' } });
    if (p.calcAt) h.push({ at: p.calcAt, by: 'A001', action: { sr: 'Obračun pokrenut', en: 'Calculation run' } });
    if (p.sentAt) h.push({ at: p.sentAt, by: 'A001', action: { sr: 'Obračun poslat na saglasnost', en: 'Statements sent for consent' } });
    if (p.paidAt) h.push({ at: p.paidAt + 'T12:00', by: 'A001', action: { sr: 'Isplaćeno', en: 'Paid' } });
    h.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    IH.showHistory(IH.L(p.label), h);
  };
  IH.act['pe-del'] = function (el) {
    var p = D.period(el.dataset.arg); if (!p || !p.gen || p.status !== 'planiran') return;
    if (valsFor(p.id)) { IH.toast(t('pe.delUsed')); return; }
    var sl = schemesFor(p);
    IH.modal({ title: t('pe.delT', { p: IH.esc(IH.L(p.label)) }), body: '<p style="margin:0 0 10px">' + t('pe.delTxt') + '</p>' + (sl.length ? '<div class="note warn">' + t('pe.delWarn', { s: IH.esc(sl.map(function (s) { return IH.L(s.name); }).join(', ')) }) + '</div>' : ''),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('pe.del'), { cls: 'danger', icon: 'trash', act: 'pe-del-ok', arg: p.id }) });
  };
  IH.act['pe-del-ok'] = function (el) {
    var id = el.dataset.arg, p = D.period(id), l = IH.list('newPeriods'), i = -1;
    l.forEach(function (x, k) { if (x.id === id) i = k; }); if (i < 0) return;
    l.splice(i, 1);
    IH.audit('period', id, { sr: 'Period obrisan', en: 'Period deleted' }, { sr: IH.L(p.label), en: IH.L(p.label) });
    bump(); IH.closeModal(); IH.render(); IH.toast(t('pe.deleted', { p: IH.esc(IH.L(p.label)) }));
  };

  /* ---------- generisanje perioda za godinu ----------
     rokovi i isplata: po vrsti perioda (dana posle kraja perioda, popunjeno iz Vrsta perioda) i pojedinačno po periodu (datum u tabeli);
     izmena pravila vrste poništava pojedinačne izmene tog datuma za tu vrstu; rok i isplata koji padnu na vikend mogu se pomeriti na ponedeljak */
  var FIELDS = ['lockBy', 'deadline', 'payDate'], RULEF = { lock: 'lockBy', deadline: 'deadline', pay: 'payDate' };
  function toWorkday(iso) { var d = new Date(iso + 'T00:00:00Z'), w = d.getUTCDay(); if (w === 6) d.setUTCDate(d.getUTCDate() + 2); else if (w === 0) d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); }
  function isWeekend(iso) { var w = new Date(iso + 'T00:00:00Z').getUTCDay(); return w === 0 || w === 6; }
  function typeOfId(id) { return /^\d{4}$/.test(id) ? 'Y' : /-H\d$/.test(id) ? 'H' : /-Q\d$/.test(id) ? 'Q' : 'M'; }
  function genList() {
    var g = IH.form.pg;
    return D.genPeriods(g.y, g.types, g.rules).map(function (p) {
      if (g.shift) { p.deadline = toWorkday(p.deadline); p.payDate = toWorkday(p.payDate); }
      var o = g.ov[p.id] || {}; FIELDS.forEach(function (f) { if (o[f]) p[f] = o[f]; });
      p.bad = !(p.to <= p.lockBy && p.lockBy <= p.deadline && p.deadline <= p.payDate);
      return p;
    }).sort(function (a, b) { return (a.from < b.from ? -1 : a.from > b.from ? 1 : 0) || ORD[a.type] - ORD[b.type]; });
  }
  function genBody() {
    var g = IH.form.pg, list = genList(), exist = 0;
    g.types.forEach(function (ty) { exist += 12 / D.typeLen(ty); }); exist -= list.length;
    var h = '<div class="form-grid g3"><div class="field"><label class="lab">' + t('pe.year') + '</label><select class="in" data-pg="y">' + YEARS.map(function (y) { return '<option' + (y === g.y ? ' selected' : '') + '>' + y + '</option>'; }).join('') + '</select></div>' +
      '<div class="field" style="grid-column:span 2"><label class="lab">' + t('pe.types') + '</label><span class="chks">' + D.activePeriodTypes().map(function (x) { return '<label class="chk" style="margin:0"><input type="checkbox" data-pgt="' + x.id + '"' + (g.types.indexOf(x.id) >= 0 ? ' checked' : '') + '><span>' + t('per.' + x.id) + '</span></label>'; }).join(' ') + '</span></div></div>';
    if (!list.length) return h + '<div class="note">' + t('pe.genNone') + '</div>';
    var tys = g.types.filter(function (ty) { return list.some(function (p) { return p.type === ty; }); }).sort(function (a, b) { return ORD[a] - ORD[b]; });
    var num = function (ty, k) { return '<span class="nw" style="display:inline-flex;align-items:center;gap:6px"><input class="in cell tnum" style="width:64px" data-pgr="' + ty + '|' + k + '" value="' + g.rules[ty][k] + '"><span class="mut">' + t('pe.days') + '</span></span>'; };
    h += '<div class="fsec" style="margin-top:4px"><h3>' + t('pe.genRules') + '</h3>' +
      ui.table([{ key: 'ty', label: t('pe.colType') }, { key: 'l', label: t('pe.colLock') }, { key: 'd', label: t('pe.colDeadline') }, { key: 'p', label: t('pe.colPay') }],
        tys.map(function (ty) { return { ty: '<b>' + t('per.' + ty) + '</b>', l: num(ty, 'lock'), d: num(ty, 'deadline'), p: num(ty, 'pay') }; }), { compact: true }) +
      '<label class="chk" style="margin:10px 0 0"><input type="checkbox" data-pgs="1"' + (g.shift ? ' checked' : '') + '><span>' + t('pe.genShift') + '</span></label></div>';
    var date = function (p, f) { return '<input type="date" class="in cell" style="width:150px' + (isWeekend(p[f]) && f !== 'lockBy' ? ';border-color:var(--warning)' : '') + '" data-pgo="' + p.id + '|' + f + '" value="' + p[f] + '"' + (isWeekend(p[f]) && f !== 'lockBy' ? ' title="' + IH.esc(t('pe.weekend')) + '"' : '') + '>'; };
    h += '<div class="fsec"><h3>' + t('pe.genN', { n: list.length }) + (exist > 0 ? ' · ' + t('pe.genSkip', { n: exist }) : '') + '</h3>' +
      ui.table([{ key: 'n', label: t('pe.colPer') }, { key: 'ft', label: t('pe.colFromTo') }, { key: 'l', label: t('pe.colLock') }, { key: 'd', label: t('pe.colDeadline') }, { key: 'p', label: t('pe.colPay') }],
        list.map(function (p) { return { n: '<b>' + IH.esc(IH.L(p.label)) + '</b>' + (p.bad ? '<div class="sum-bad" style="font-size:11.5px;font-weight:500">' + t('pe.badRow') + '</div>' : ''), ft: '<span class="nw">' + F.date(p.from) + ' – ' + F.date(p.to) + '</span>', l: date(p, 'lockBy'), d: date(p, 'deadline'), p: date(p, 'payDate') }; }), { compact: true }) + '</div>';
    return h;
  }
  function genFoot() {
    var list = genList(), bad = list.some(function (p) { return p.bad; });
    return ui.btn(t('c.cancel'), { act: 'modal-close' }) + (list.length && !bad ? ui.btn(t('pe.genGo', { n: list.length }), { cls: 'primary', icon: 'check', act: 'pe-gen-go' }) : '<button class="btn primary" disabled title="' + (bad ? IH.esc(t('pe.genBad')) : '') + '">' + t('pe.genGo', { n: list.length }) + '</button>');
  }
  function genRefresh() { IH.swap('pe-gen-body', genBody()); IH.swap('pe-gen-foot', genFoot()); }
  IH.act['pe-gen'] = function () {
    var types = D.activePeriodTypes().map(function (x) { return x.id; }), rules = {};
    D.periodTypes.forEach(function (x) { var ty = D.periodType(x.id); rules[x.id] = { lock: ty.lock, deadline: ty.deadline, pay: ty.pay }; });
    var y = YEARS.filter(function (yy) { return D.genPeriods(yy, types).length; })[0] || YEARS[0];
    IH.form = { pg: { y: y, types: types, rules: rules, ov: {}, shift: true } };
    IH.modal({ title: t('pe.genT'), wide: true, body: '<div id="pe-gen-body">' + genBody() + '</div>', foot: '<span id="pe-gen-foot" style="display:flex;gap:8px">' + genFoot() + '</span>' });
  };
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}, g = IH.form && IH.form.pg; if (!g) return;
    if (d.pg === 'y') { g.y = e.target.value; g.ov = {}; genRefresh(); }
    if (d.pgt) { var i = g.types.indexOf(d.pgt); if (e.target.checked && i < 0) g.types.push(d.pgt); if (!e.target.checked && i >= 0) g.types.splice(i, 1); genRefresh(); }
    if (d.pgr) {
      var q = d.pgr.split('|'), n = parseInt(e.target.value, 10);
      if (!isNaN(n) && n >= 0) { g.rules[q[0]][q[1]] = n; Object.keys(g.ov).forEach(function (id) { if (typeOfId(id) === q[0]) delete g.ov[id][RULEF[q[1]]]; }); }
      genRefresh();
    }
    if (d.pgs) { g.shift = e.target.checked; genRefresh(); }
    if (d.pgo) { var o = d.pgo.split('|'); if (e.target.value) (g.ov[o[0]] = g.ov[o[0]] || {})[o[1]] = e.target.value; genRefresh(); }
  });
  IH.act['pe-gen-go'] = function () {
    var g = IH.form.pg, list = genList(); if (!list.length) return;
    if (list.some(function (p) { return p.bad; })) { IH.toast(t('pe.genBad')); return; }
    var now = IH.now(), me = IH.me().id;
    list.forEach(function (p) { delete p.bad; p.genAt = now; p.genBy = me; IH.list('newPeriods').push(p); });
    var by = {}; list.forEach(function (p) { by[p.type] = (by[p.type] || 0) + 1; });
    var txt = Object.keys(by).sort(function (a, b) { return ORD[a] - ORD[b]; }).map(function (k) { var r = g.rules[k]; return t('per.' + k) + ': ' + by[k] + ' (+' + r.lock + ' / +' + r.deadline + ' / +' + r.pay + ')'; }).join(' · ') +
      (g.shift ? ' · ' + IH.L(L('vikend → ponedeljak', 'weekend → Monday')) : '') + (Object.keys(g.ov).length ? ' · ' + IH.L(L('pojedinačno izmenjeno: ', 'individually changed: ')) + Object.keys(g.ov).length : '');
    IH.audit('period', g.y, { sr: 'Generisani periodi za ' + g.y, en: 'Periods generated for ' + g.y }, { sr: txt, en: txt });
    bump(); IH.form = {}; IH.closeModal(); IH.render(); IH.toast(t('pe.genDone', { n: list.length, y: g.y }));
  };

  /* ---------- vrste perioda ---------- */
  function typesPage() {
    var grid = IH.grid({
      id: 'pe-ty', exportName: 'Vrste_perioda.xlsx', searchLabel: t('pe.colType'), rows: function () { return D.periodTypes.map(function (x) { return D.periodType(x.id); }); },
      key: function (x) { return x.id; }, label: function (x) { return t('per.' + x.id); }, searchKeys: ['n'],
      cols: [
        { key: 'act', label: t('pe.tyActive'), val: function (x) { return x.active ? 1 : 0; }, render: function (x) { return x.active ? ui.pill(t('c.yes'), 'success') : ui.pill(t('c.no'), 'gray'); } },
        { key: 'n', label: t('pe.colType'), val: function (x) { return t('per.' + x.id); }, render: function (x) { return '<b>' + t('per.' + x.id) + '</b>'; } },
        { key: 'len', label: t('pe.tyLen'), num: true, search: false, val: function (x) { return x.months; }, render: function (x) { return t('pe.tyMonths', { n: x.months }); } },
        { key: 'lock', label: t('pe.colLock'), num: true, search: false, val: function (x) { return x.lock; }, render: function (x) { return t('pe.tyDays', { n: x.lock }); } },
        { key: 'dl', label: t('pe.colDeadline'), num: true, search: false, val: function (x) { return x.deadline; }, render: function (x) { return t('pe.tyDays', { n: x.deadline }); } },
        { key: 'pay', label: t('pe.colPay'), num: true, search: false, val: function (x) { return x.pay; }, render: function (x) { return t('pe.tyDays', { n: x.pay }); } },
        { key: 'used', label: t('pe.tyUsed'), num: true, search: false, val: function (x) { var u = typeUse(x.id); return u.s + u.tg; }, render: function (x) { var u = typeUse(x.id); return u.s + ' · ' + u.tg; } },
        { key: 'cnt', label: t('pe.tCal'), num: true, search: false, val: function (x) { return D.allPeriods().filter(function (p) { return p.type === x.id; }).length; } }
      ],
      actions: [{ type: 'edit', title: t('g.aEdit'), act: 'pe-ty-edit', kind: 'acc' }]
    });
    return header() + tabs('vrste') + grid;
  }
  IH.act['pe-ty-edit'] = function (el) {
    var x = D.periodType(el.dataset.arg); if (!x) return;
    IH.form = {};
    var f = [
      { k: 'ty_n', label: t('pe.colType'), type: 'static', value: t('per.' + x.id) }, { k: 'ty_len', label: t('pe.tyLen'), type: 'static', value: t('pe.tyMonths', { n: x.months }) },
      { k: 'ty_act', label: t('pe.tyActive'), type: 'toggle', value: x.active },
      { k: 'ty_l', label: t('pe.tyLock'), type: 'number', value: String(x.lock), hint: t('pe.tyHint') }, { k: 'ty_d', label: t('pe.tyDeadline'), type: 'number', value: String(x.deadline) }, { k: 'ty_p', label: t('pe.tyPay'), type: 'number', value: String(x.pay) }
    ];
    IH.modal({ title: t('pe.tyEditT', { n: t('per.' + x.id) }), wide: true, body: ui.form(f, { cols: 3 }), foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'pe-ty-save', arg: x.id }) });
  };
  IH.act['pe-ty-save'] = function (el) {
    var x = D.periodType(el.dataset.arg), fv = IH.form || {}, n = function (v, d) { var k = parseInt(v, 10); return isNaN(k) || k < 0 ? d : k; };
    var act = fv.ty_act != null ? !!fv.ty_act : x.active, lock = n(fv.ty_l, x.lock), dl = n(fv.ty_d, x.deadline), pay = n(fv.ty_p, x.pay), u = typeUse(x.id);
    if (!act && x.active && (u.s || u.tg)) { IH.toast(t('pe.tyNoOff')); return; }
    if (!(lock <= dl && dl <= pay)) { IH.toast(t('pe.bad', { r: t('pe.tyBad') })); return; }
    IH.map('periodTypeEdits')[x.id] = { active: act, lock: lock, deadline: dl, pay: pay };
    var txt = (act ? IH.L(L('u upotrebi', 'in use')) : IH.L(L('isključena', 'switched off'))) + ' · +' + lock + ' / +' + dl + ' / +' + pay;
    IH.audit('period', 'TYPE-' + x.id, { sr: 'Izmenjena vrsta perioda ' + t('per.' + x.id), en: 'Period type changed — ' + t('per.' + x.id) }, { sr: txt, en: txt });
    bump(); IH.closeModal(); IH.render(); IH.toast(t('pe.tySaved', { n: t('per.' + x.id) }));
  };

  /* poruka kada za izabranu vrstu nema planiranih perioda (targeti, šeme, dodela) */
  IH.noPeriodsNote = function () { return '<div class="in ro"><span class="mut">' + t('pe.noPlanned') + ' — </span><a href="#/periodi">' + t('pe.toCal') + '</a></div>'; };

  IH.route('periodi', { title: function () { return t('pe.title'); }, render: function (p) { return p[0] === 'vrste' ? typesPage() : calPage(); } });
})();
