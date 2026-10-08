/* Incentive Hub — Targeti (Administrator)
   Jedna forma u tri sekcije (Osnovno · Šta se meri · Uslovi priznavanja) — ista za kreiranje (čarobnjak), izmenu (nova verzija) i pregled.
   Vrsta targeta menja formu: individualni (meri se prodaja jednog zaposlenog, vrednost se dodeljuje po zaposlenom)
   ili timski (meri se zbir prodaja tima ekspoziture, vrednost se dodeljuje po ekspozituri).
   Novi target i nova verzija važe tek od početka sledećeg perioda — tekući obračun se ne menja. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, R = IH.rules, L = D.L2;

  IH.addStrings({
    'tg.title': 'Targeti', 'tg.new': 'Novi target', 'tg.search': 'Naziv targeta', 'tg.free': 'Nije u šemi',
    'tg.colName': 'Target', 'tg.colSeg': 'Grupa klijenata', 'tg.colPt': 'Vrsta proizvoda', 'tg.colKind': 'Vrsta targeta', 'tg.colCarrier': 'Nosilac', 'tg.colPer': 'Period', 'tg.colUnit': 'Jedinica', 'tg.colBase': 'Podrazumevana vrednost', 'tg.colScheme': 'Šema', 'tg.colVer': 'Verzija', 'tg.colFrom': 'Važi od',
    'k.ind': 'Individualni', 'k.team': 'Timski', 'per.M': 'Mesec', 'per.Q': 'Kvartal', 'per.H': 'Polugodište', 'per.Y': 'Godina', 'un.kom': 'Količina', 'un.RSD': 'Novac',
    'tg.s1': 'Osnovno', 'tg.s2': 'Šta se meri', 'tg.s3': 'Uslovi priznavanja', 'tg.s4': 'Pregled i aktivacija',
    'tg.fName': 'Naziv targeta', 'tg.fKind': 'Vrsta targeta', 'tg.fPos': 'Nosilac targeta', 'tg.fTeam': 'Tim čine', 'tg.fAsg': 'Vrednost se dodeljuje', 'tg.asgEmp': 'Po zaposlenom', 'tg.asgBr': 'Po ekspozituri (timu)', 'tg.fPer': 'Period merenja',
    'tg.fFrom': 'Važi od', 'tg.fTo': 'Važi do', 'tg.open': 'Bez kraja', 'tg.fVer': 'Verzija', 'tg.fBase': 'Podrazumevana vrednost za dodelu', 'tg.fScheme': 'Bonus šema', 'tg.fReason': 'Razlog izmene', 'tg.teamOf': 'Tim ekspoziture: {p}',
    'tg.fSegs': 'Grupa klijenata', 'tg.fPt': 'Vrsta proizvoda', 'tg.fProds': 'Proizvodi', 'tg.allProds': 'Svi proizvodi: {t} – {g}', 'tg.prodsN': '{n} proizvoda',
    'tg.chk1': 'Obavezna polja su popunjena', 'tg.chk2': 'Predmet ima aktivne proizvode u katalogu', 'tg.chk3': 'Nosilac prodaje proizvode iz predmeta', 'tg.chk3no': '{p} ne prodaje proizvode za grupu: {g}', 'tg.chk4': 'Uslovi odgovaraju vrsti proizvoda', 'tg.chk5': 'Važi od {d} — tekući obračun se ne menja', 'tg.chk6': 'Sledeći korak: dodela vrednosti nosiocima', 'tg.blocked': 'Target ne može da se aktivira: {r}',
    'tg.activate': 'Aktiviraj target', 'tg.saveDraft': 'Sačuvaj kao nacrt', 'tg.created': 'Target „{n}“ je kreiran i važi od {d}', 'tg.draftOk': 'Nacrt targeta „{n}“ je sačuvan',
    'tg.toAssign': 'Dodeli vrednosti', 'tg.editT': 'Izmena targeta', 'tg.saveVer': 'Sačuvaj novu verziju', 'tg.verDone': 'Verzija v{v} targeta „{n}“ važi od {d}', 'tg.planned': 'Planirana',
    'tg.archive': 'Arhiviraj', 'tg.archived': 'Target „{n}“ je arhiviran', 'tg.inUse': 'Target je uključen u šemu {s}. Arhiviranje je moguće tek kada se izbaci iz šeme.', 'tg.archTxt': 'Target će biti arhiviran i neće biti dostupan za nove dodele. Istorija i postojeći obračuni ostaju.',
    'tg.kom': 'kom', 'tg.rsd': 'RSD', 'tg.back': 'Nazad',
    'tg.fDir': 'Smer', 'tg.dirUp': 'Više je bolje', 'tg.dirDown': 'Manje je bolje', 'tg.fMode': 'Način merenja', 'tg.mSale': 'Prodaja u periodu', 'tg.mNet': 'Neto: otvoreni − zatvoreni',
    'tg.fVal': 'Vrednost ekspoziture', 'tg.vSet': 'Zadaje regija', 'tg.vSum': 'Zbir targeta zaposlenih i tima', 'tg.fOf': 'Sabiraju se', 'tg.chk7': 'Izabrani su targeti koji se sabiraju', 'tg.fUnit': 'Jedinica merenja', 'tg.colPts': 'Bodovi', 'tg.ptsSel': '{n} proizvoda · {t}', 'tg.chk9': 'Izabrana je bodovna lista', 'tg.fPlist': 'Bodovna lista', 'tg.chk8': 'Izabrani proizvodi imaju iznos', 'tg.chk8no': 'Računi i kartice nemaju iznos u podacima banke — target bi uvek bio 0'
  }, {
    'tg.title': 'Targets', 'tg.new': 'New target', 'tg.search': 'Target name', 'tg.free': 'Not in a scheme',
    'tg.colName': 'Target', 'tg.colSeg': 'Client group', 'tg.colPt': 'Product type', 'tg.colKind': 'Target type', 'tg.colCarrier': 'Carrier', 'tg.colPer': 'Period', 'tg.colUnit': 'Unit', 'tg.colBase': 'Default value', 'tg.colScheme': 'Scheme', 'tg.colVer': 'Version', 'tg.colFrom': 'Valid from',
    'k.ind': 'Individual', 'k.team': 'Team', 'per.M': 'Month', 'per.Q': 'Quarter', 'per.H': 'Half-year', 'per.Y': 'Year', 'un.kom': 'Quantity', 'un.RSD': 'Money',
    'tg.s1': 'Basics', 'tg.s2': 'What is measured', 'tg.s3': 'Recognition conditions', 'tg.s4': 'Review and activation',
    'tg.fName': 'Target name', 'tg.fKind': 'Target type', 'tg.fPos': 'Target carrier', 'tg.fTeam': 'Team consists of', 'tg.fAsg': 'Value is assigned', 'tg.asgEmp': 'Per employee', 'tg.asgBr': 'Per branch (team)', 'tg.fPer': 'Measurement period',
    'tg.fFrom': 'Valid from', 'tg.fTo': 'Valid to', 'tg.open': 'Open-ended', 'tg.fVer': 'Version', 'tg.fBase': 'Default value for assignment', 'tg.fScheme': 'Bonus scheme', 'tg.fReason': 'Reason for change', 'tg.teamOf': 'Branch team: {p}',
    'tg.fSegs': 'Client group', 'tg.fPt': 'Product type', 'tg.fProds': 'Products', 'tg.allProds': 'All products: {t} – {g}', 'tg.prodsN': '{n} products',
    'tg.chk1': 'Mandatory fields are filled', 'tg.chk2': 'The subject has active products in the catalogue', 'tg.chk3': 'The carrier sells products in the subject', 'tg.chk3no': '{p} does not sell products for group: {g}', 'tg.chk4': 'Conditions match the product type', 'tg.chk5': 'Valid from {d} — the current calculation is not changed', 'tg.chk6': 'Next step: assign values to carriers', 'tg.blocked': 'The target cannot be activated: {r}',
    'tg.activate': 'Activate target', 'tg.saveDraft': 'Save as draft', 'tg.created': 'Target "{n}" created, valid from {d}', 'tg.draftOk': 'Draft of target "{n}" saved',
    'tg.toAssign': 'Assign values', 'tg.editT': 'Edit target', 'tg.saveVer': 'Save new version', 'tg.verDone': 'Version v{v} of target "{n}" valid from {d}', 'tg.planned': 'Planned',
    'tg.archive': 'Archive', 'tg.archived': 'Target "{n}" archived', 'tg.inUse': 'The target is part of scheme {s}. It can be archived only after removal from the scheme.', 'tg.archTxt': 'The target will be archived and unavailable for new assignments. History and existing calculations remain.',
    'tg.kom': 'pcs', 'tg.rsd': 'RSD', 'tg.back': 'Back',
    'tg.fDir': 'Direction', 'tg.dirUp': 'Higher is better', 'tg.dirDown': 'Lower is better', 'tg.fMode': 'Measurement', 'tg.mSale': 'Sales in the period', 'tg.mNet': 'Net: opened − closed',
    'tg.fVal': 'Branch value', 'tg.vSet': 'Set by the region', 'tg.vSum': 'Sum of employee and team targets', 'tg.fOf': 'Summed targets', 'tg.chk7': 'The summed targets are selected', 'tg.fUnit': 'Unit of measure', 'tg.colPts': 'Points', 'tg.ptsSel': '{n} products · {t}', 'tg.chk9': 'A points list is selected', 'tg.fPlist': 'Points list', 'tg.chk8': 'The selected products have an amount', 'tg.chk8no': 'Accounts and cards have no amount in bank data — the target would always be 0'
  });

  /* ---------- efektivna lista targeta ---------- */
  var baseTarget = D.target;
  D.target = function (id) {
    var b = baseTarget(id) || IH.list('newTargets').filter(function (x) { return x.id === id; })[0];
    if (!b) return null;
    var e = (IH.state.data.targetEdits || {})[id];
    return e ? Object.assign({}, b, e) : b;
  };
  IH.targets = function () { return D.targets.map(function (x) { return D.target(x.id); }).concat(IH.list('newTargets').map(function (x) { return D.target(x.id); })); };
  function verOf(x) { var vs = IH.list('targetVersions').filter(function (v) { return v.id === x.id; }); return vs.length ? vs[vs.length - 1] : null; }
  function unitLbl(u) { return u === 'RSD' ? t('tg.rsd') : t('tg.kom'); }
  function segsTxt(x) { var s = x.subject.segs || []; return s.length === D.segments.length ? IH.L(L('Sve grupe', 'All groups')) : s.map(D.segName).join(', '); }
  function prodsOfSubject(x) { if (x.unit === 'bod' && !x.subject.plist) return []; return D.subjProducts(x.subject); }
  function prodsTxt(x) { var p = x.subject.products || []; if (x.unit === 'bod') { var pl = x.subject.plist && D.pointList(x.subject.plist); return pl ? IH.L(pl.name) + ' · ' + t('tg.ptsSel', { n: D.subjProducts(x.subject).length, t: D.subjPtypeName(x.subject) }) : '—'; } return p.length ? p.map(function (id) { return D.productName(id); }).join(', ') : t('tg.allProds', { t: D.ptypeName(x.subject.ptype).toLowerCase(), g: segsTxt(x).toLowerCase() }) + ' (' + prodsOfSubject(x).length + ')'; }
  function carrierTxt(x) { return x.kind === 'timski' ? t('tg.teamOf', { p: (x.team || []).map(D.posName).join(' + ') }) : D.posName(x.pos || 'licni'); }
  IH.targetCarrier = carrierTxt;
  function schemesOfT(x) { return D.schemesOf(x.id); }
  function schemesTxt(x) { var l = schemesOfT(x); return l.length ? l.map(function (q) { return q.code; }).join(', ') : t('tg.free'); }
  IH.subjTags = function (x) { return IH.esc(D.subjPtypeName(x.subject)) + ' · ' + IH.esc(segsTxt(x)); };

  /* periodi od sledećeg (novi target i nova verzija ne diraju tekući obračun) */
  var NEXT = {
    Q: [{ v: '2027-01-01', to: '2027-03-31', l: 'Q1 2027' }, { v: '2027-04-01', to: '2027-06-30', l: 'Q2 2027' }, { v: '2027-07-01', to: '2027-09-30', l: 'Q3 2027' }, { v: '2027-10-01', to: '2027-12-31', l: 'Q4 2027' }],
    M: [{ v: '2026-11-01', to: '2026-11-30', l: L('Novembar 2026', 'Nov 2026') }, { v: '2026-12-01', to: '2026-12-31', l: L('Decembar 2026', 'Dec 2026') }, { v: '2027-01-01', to: '2027-01-31', l: L('Januar 2027', 'Jan 2027') }, { v: '2027-02-01', to: '2027-02-28', l: L('Februar 2027', 'Feb 2027') }]
  };
  function perOpts(type) { return NEXT[type === 'M' ? 'M' : 'Q'].map(function (o) { return { v: o.v, to: o.to, l: IH.L(o.l) }; }); }
  function firstFrom(type) { return perOpts(type)[0].v; }

  /* ---------- lista ---------- */
  function listPage() {
    var grid = IH.grid({
      id: 'tg-l', exportName: 'Targeti.xlsx', hidden: ['ver', 'from'], searchLabel: t('tg.search'), create: { label: t('tg.new'), act: 'tg-new' },
      rows: IH.targets, key: function (x) { return x.id; }, label: function (x) { return IH.L(x.name); }, searchKeys: ['n'],
      rowCls: function (x) { return x.status === 'aktivan' ? '' : 'muted'; },
      cols: [
        { key: 'st', label: t('c.status'), val: function (x) { return x.status; }, render: function (x) { return ui.st2(x.status) + (x.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); }, filter: function () { return ['aktivan', 'nacrt', 'arhiviran'].map(function (k) { return { v: k, l: t('st2.' + k) }; }); } },
        { key: 'n', label: t('tg.colName'), val: function (x) { return IH.L(x.name); }, render: function (x) { var nv = verOf(x); return '<b>' + IH.esc(IH.L(x.name)) + '</b>' + (nv ? ' ' + ui.pill(t('tg.planned') + ' v' + nv.v, 'warning') : ''); } },
        { key: 'kind', label: t('tg.colKind'), val: function (x) { return x.kind === 'timski' ? t('k.team') : t('k.ind'); }, fval: function (x) { return x.kind; }, filter: function () { return [{ v: 'individualni', l: t('k.ind') }, { v: 'timski', l: t('k.team') }]; } },
        { key: 'car', label: t('tg.colCarrier'), val: carrierTxt },
        { key: 'pt', label: t('tg.colPt'), val: function (x) { return D.subjPtypeName(x.subject); }, fval: function (x) { return x.subject.ptype || 'mix'; }, filter: function () { return D.ptypes.map(function (p) { return { v: p.id, l: IH.L(p.name) }; }).concat([{ v: 'mix', l: D.ptypeName(null) }]); } },
        { key: 'u', label: t('tg.fUnit'), val: function (x) { return R.measureText(x.subject.ptype, (x.formula || {}).measure); }, fval: function (x) { return (x.formula || {}).measure; }, filter: function () { return R.measureOptions(); } },
        { key: 'seg', label: t('tg.colSeg'), val: function (x) { return segsTxt(x); }, fval: function (x) { return x.subject.segs || []; }, filter: function () { return D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'per', label: t('tg.colPer'), val: function (x) { return t('per.' + x.periodType); }, fval: function (x) { return x.periodType; }, filter: function () { return ['M', 'Q'].map(function (p) { return { v: p, l: t('per.' + p) }; }); } },
        { key: 'sc', label: t('tg.colScheme'), val: function (x) { return schemesTxt(x); }, fval: function (x) { var l = schemesOfT(x); return l.length ? l.map(function (q) { return q.id; }) : ['-']; }, render: function (x) { var l = schemesOfT(x); return l.length ? IH.esc(l.map(function (q) { return q.code; }).join(', ')) : '<span class="mut">' + t('tg.free') + '</span>'; }, filter: function () { return D.schemes.map(function (s2) { return { v: s2.id, l: s2.code }; }).concat([{ v: '-', l: t('tg.free') }]); } },
        { key: 'from', label: t('tg.colFrom'), search: false, val: function (x) { return x.from; }, render: function (x) { return F.date(x.from); } },
        { key: 'ver', label: t('tg.colVer'), num: true, search: false, val: function (x) { return x.ver; }, render: function (x) { return 'v' + x.ver; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (x) { return 'targeti/' + x.id; } },
        { type: 'edit', title: t('g.aEdit'), act: 'g-go', kind: 'acc', arg: function (x) { return 'targeti/' + x.id + '/izmena'; } },
        { icon: 'share', title: t('tg.toAssign'), act: 'asg-new-for', show: function (x) { return x.status === 'aktivan'; } },
        { type: 'history', title: t('g.aHistory'), act: 'tg-hist' },
        { type: 'copy', title: t('g.aCopy'), act: 'tg-copy' },
        { type: 'delete', title: t('tg.archive'), act: 'tg-arch', kind: 'dan', show: function (x) { return x.status !== 'arhiviran'; } }
      ]
    });
    return ui.header(t('tg.title')) + grid;
  }
  function histOf(x) {
    var h = IH.auditFor('target', x.id).slice();
    IH.list('targetVersions').filter(function (q) { return q.id === x.id; }).forEach(function (q) { h.push({ at: (q.at || IH.now()), by: 'A001', action: { sr: 'Planirana verzija v' + q.v + ' od ' + F.date(q.from), en: 'Planned version v' + q.v + ' from ' + F.date(q.from) }, detail: q.note }); });
    h.push({ at: x.from + 'T08:00', by: 'A001', action: { sr: 'Važi verzija v' + x.ver, en: 'Version v' + x.ver + ' in force' } });
    if (x.ver > 1) h.push({ at: '2026-01-01T08:00', by: 'A001', action: { sr: 'Važila verzija v' + (x.ver - 1), en: 'Version v' + (x.ver - 1) + ' in force' } });
    return h;
  }
  IH.act['tg-hist'] = function (el) { var x = D.target(el.dataset.arg); IH.showHistory(IH.L(x.name), histOf(x)); };
  IH.act['tg-arch'] = function (el) {
    var x = D.target(el.dataset.arg), used = schemesOfT(x).length > 0;
    IH.modal({ title: t('tg.archive') + ' — ' + IH.esc(IH.L(x.name)), body: used ? '<div class="note warn">' + t('tg.inUse', { s: schemesTxt(x) }) + '</div>' : '<p style="margin:0">' + t('tg.archTxt') + '</p>', foot: ui.btn(t('c.close'), { act: 'modal-close' }) + (used ? '' : ui.btn(t('tg.archive'), { cls: 'danger', icon: 'trash', act: 'tg-arch-ok', arg: x.id })) });
  };
  IH.act['tg-arch-ok'] = function (el) {
    IH.map('targetEdits')[el.dataset.arg] = Object.assign({}, IH.map('targetEdits')[el.dataset.arg], { status: 'arhiviran' });
    IH.audit('target', el.dataset.arg, { sr: 'Target arhiviran', en: 'Target archived' }); IH.save(); IH.closeModal(); IH.render(); IH.toast(t('tg.archived', { n: IH.esc(IH.L(D.target(el.dataset.arg).name)) }));
  };

  /* ---------- forma: sekcije ---------- */
  /* m: { ro: pregled, lock: izmena postojećeg (vrsta, vrsta proizvoda i period se ne menjaju) } */
  function fld(label, ctl, o) { o = o || {}; return '<div class="field' + (o.full ? ' full' : '') + '"><label class="lab">' + label + (o.req ? ' <span class="req">*</span>' : '') + '</label>' + ctl + '</div>'; }
  function rov(v) { return '<div class="in ro">' + (v === '' || v == null ? '<span class="mut">—</span>' : IH.esc(v)) + '</div>'; }
  function seg(act, list, cur, multi) { return '<div class="seg">' + list.map(function (o) { var on = multi ? cur.indexOf(o.v) >= 0 : o.v === cur; return '<button type="button" data-act="' + act + '" data-arg="' + o.v + '" class="' + (on ? 'on' : '') + '">' + IH.esc(o.l) + '</button>'; }).join('') + '</div>'; }
  function sel(key, opts, cur) { return '<select class="in" data-tw="' + key + '">' + opts.map(function (o) { return '<option value="' + IH.esc(o.v) + '"' + (String(o.v) === String(cur) ? ' selected' : '') + '>' + IH.esc(o.l) + '</option>'; }).join('') + '</select>'; }
  function perLabel(type, from) { var o = perOpts(type).filter(function (x) { return x.v === from; })[0]; return o ? o.l + ' (' + F.date(from) + ')' : F.date(from); }
  function toLabel(type, to) { if (!to) return t('tg.open'); var o = perOpts(type).filter(function (x) { return x.to === to; })[0]; return o ? o.l + ' (' + F.date(to) + ')' : F.date(to); }
  var KINDS = function () { return [{ v: 'individualni', l: t('k.ind') }, { v: 'timski', l: t('k.team') }]; };
  var SELLERS = function () { return ['licni', 'univerzalni'].map(function (k) { return { v: k, l: D.posName(k) }; }); };

  function secBasic(q, m) {
    var ro = m.ro, h = '<div class="form-grid g3">';
    h += fld(t('tg.fName'), ro ? rov(IH.L(q.name)) : '<input class="in" data-tw="name" value="' + IH.esc(IH.L(q.name)) + '">', { full: true, req: !ro });
    h += fld(t('tg.fKind'), ro || m.lock ? rov(q.kind === 'timski' ? t('k.team') : t('k.ind')) : seg('tw-kind', KINDS(), q.kind));
    if (q.kind === 'timski') h += fld(t('tg.fTeam'), ro || m.lock ? rov((q.team || []).map(D.posName).join(' + ')) : seg('tw-team', SELLERS(), q.team || [], true));
    else h += fld(t('tg.fPos'), ro || m.lock ? rov(D.posName(q.pos || 'licni')) : sel('pos', SELLERS(), q.pos || 'licni'));
    h += fld(t('tg.fAsg'), rov(q.kind === 'timski' ? t('tg.asgBr') : t('tg.asgEmp')));
    h += fld(t('tg.fPer'), ro || m.lock ? rov(t('per.' + q.periodType)) : seg('tw-per', [{ v: 'M', l: t('per.M') }, { v: 'Q', l: t('per.Q') }], q.periodType));
    h += fld(t('tg.fFrom'), ro ? rov(F.date(q.from)) : sel('from', perOpts(q.periodType).map(function (o) { return { v: o.v, l: o.l + ' (' + F.date(o.v) + ')' }; }), q.from), { req: !ro });
    h += fld(t('tg.fTo'), ro ? rov(q.to ? F.date(q.to) : t('tg.open')) : sel('to', [{ v: '', l: t('tg.open') }].concat(perOpts(q.periodType).map(function (o) { return { v: o.to, l: o.l + ' (' + F.date(o.to) + ')' }; })), q.to || ''));
    h += fld(t('tg.fVer'), rov('v' + (q.ver || 1)));
    if (ro) { h += fld(t('c.status'), rov(t('st2.' + (q.status || 'nacrt')))); var sl = q.id ? schemesOfT(q) : []; h += fld(t('tg.fScheme'), rov(sl.length ? sl.map(function (x) { return IH.L(x.name); }).join(', ') : t('tg.free'))); }
    if (m.lock && !ro) h += fld(t('tg.fReason'), '<input class="in" data-tw="reason" value="' + IH.esc(q.reason || '') + '">', { full: true, req: true });
    return h + '</div>';
  }
  function secMeasure(q, m) {
    var ro = m.ro, sj = q.subject, h = '<div class="form-grid g3">';
    if (ro) { h += fld(t('tg.fPt'), rov(D.subjPtypeName(sj))); h += fld(t('tg.fSegs'), rov(segsTxt(q))); }
    h += fld(t('tg.fUnit'), ro ? rov(R.measureText(sj.ptype, q.formula.measure)) : seg('tw-meas', R.measureOptions(), q.formula.measure));
    if (q.kind === 'timski') {
      var vm = q.value || {}, sumOf = vm.mode === 'zbir';
      h += fld(t('tg.fVal'), ro ? rov(sumOf ? t('tg.vSum') : t('tg.vSet')) : seg('tw-vmode', [{ v: 'zadaje', l: t('tg.vSet') }, { v: 'zbir', l: t('tg.vSum') }], sumOf ? 'zbir' : 'zadaje'));
      if (sumOf) {
        var opts = IH.targets().filter(function (x) { return x.id !== q.id && x.status !== 'arhiviran' && x.subject && x.subject.ptype === sj.ptype && x.unit === q.unit && (x.kind !== 'timski' || (x.team || []).length === 1); });
        h += fld(t('tg.fOf'), ro ? rov((vm.of || []).map(function (id) { var x = D.target(id); return x ? IH.L(x.name) : id; }).join(' + ')) : '<span class="chks">' + opts.map(function (x) { return '<label class="chk" style="margin:0"><input type="checkbox" data-twof="' + x.id + '"' + ((vm.of || []).indexOf(x.id) >= 0 ? ' checked' : '') + '><span>' + IH.esc(IH.L(x.name)) + '</span></label>'; }).join('') + '</span>', { full: true });
      }
    }
    if (q.unit === 'bod') {
      var pl = sj.plist && D.pointList(sj.plist), plv = pl && D.pointListAt(pl.id);
      h += fld(t('tg.fPlist'), ro ? (pl ? '<div class="in ro"><a href="#/katalog/bodovi/' + pl.id + '">' + IH.esc(IH.L(pl.name)) + '</a> <span class="mut">· v' + plv.v + '</span></div>' : rov(''))
        : '<select class="in" data-tw="plist">' + plists().map(function (x) { return '<option value="' + x.id + '"' + (x.id === sj.plist ? ' selected' : '') + '>' + IH.esc(IH.L(x.name)) + '</option>'; }).join('') + '</select>', { req: !ro });
      h += fld(t('tg.fProds'), ptsTable(q), { full: true });
      return h + '</div>';
    }
    h += fld(t('tg.fProds'), ro ? rov(prodsTxt(q)) : '<div class="in ro" id="tw-sel">' + IH.esc(prodsTxt(q)) + '</div>', { full: true });
    h += '</div>';
    if (!ro) h += prodGrid(q, m);
    return h;
  }
  /* izabrani proizvodi: prazna lista u predmetu znači „svi proizvodi te vrste i grupe“ (uključuje i nove iz kataloga).
     Bodovni target ne bira proizvode i ne unosi bodove: proizvode i bodove daje bodovna lista (Katalog proizvoda → Bodovne liste). */
  function allOf(pt, segs) { return IH.products().filter(function (p) { return p.status === 'aktivan' && p.ptype === pt && (!segs || !segs.length || segs.indexOf(p.seg) >= 0); }); }
  function selectedIds(q) { var sj = q.subject; return sj.products && sj.products.length ? sj.products.slice() : allOf(sj.ptype, sj.segs).map(function (p) { return p.id; }); }
  function sortSegs(l) { return l.sort(function (a, b) { return ['FL', 'PR', 'PO'].indexOf(a) - ['FL', 'PR', 'PO'].indexOf(b); }); }
  function setSelection(l, lock) {
    var q = TW(), sj = q.subject, prev = selectedIds(q), ptChanged = false;
    var added = l.filter(function (id) { return prev.indexOf(id) < 0; }).map(D.product).filter(Boolean);
    var np = added.filter(function (p) { return p.ptype !== sj.ptype; })[0];
    if (np && !lock) { setPtype(np.ptype); ptChanged = true; l = l.filter(function (id) { var p = D.product(id); return p && p.ptype === np.ptype; }); }
    l = l.filter(function (id) { var p = D.product(id); return p && p.ptype === sj.ptype; });
    if (!l.length) { sj.products = []; return ptChanged; }
    var segs = []; l.forEach(function (id) { var sg = D.product(id).seg; if (segs.indexOf(sg) < 0) segs.push(sg); });
    sj.segs = sortSegs(segs);
    var all = allOf(sj.ptype, segs).map(function (p) { return p.id; });
    sj.products = all.length === l.length && all.every(function (id) { return l.indexOf(id) >= 0; }) ? [] : l;
    return ptChanged;
  }
  function plists() { return D.pointLists().filter(function (x) { return x.status === 'aktivan'; }); }
  /* uslovi bodovnog targeta: podrazumevani uslovi svake vrste proizvoda iz liste; uslovi vrste koja više nije u listi se brišu */
  function syncConds(prev, next) {
    var c = (IH.form.conds || []).filter(function (x) { var p = x.pt || (R.template(x.tpl) || {}).pt; return !p || p.some(function (pp) { return next.indexOf(pp) >= 0; }); });
    c.forEach(function (x) { if (x.pt) x.pt = x.pt.filter(function (pp) { return next.indexOf(pp) >= 0; }); });
    IH.form.conds = D.mixConds(next.filter(function (p) { return prev.indexOf(p) < 0; }), c);
  }
  function setPlist(id) {
    var q = TW(), sj = q.subject, prev = D.subjPtypes(sj), r = D.resolveSubj({ plist: id });
    sj.plist = id; sj.products = []; sj.segs = (r.segs || []).slice(); sj.ptype = r.ptype || null; delete sj.points;
    syncConds(prev, D.subjPtypes(sj));
  }
  /* jedinica merenja: Bodovi → bira se bodovna lista; povratak na komade ili iznos zadržava jednu vrstu proizvoda */
  function setMeasure(v) {
    var q = TW(), sj = q.subject; if (q.formula.measure === v) return;
    if (v === 'bodovi') {
      var pt0 = D.subjPtypes(sj), l = plists(), first = l.filter(function (x) { return D.subjPtypes({ plist: x.id }).some(function (p) { return pt0.indexOf(p) >= 0; }); })[0] || l[0];
      (IH.form.conds || []).forEach(function (c) { c.pt = pt0.slice(); });
      q.unit = 'bod'; q.formula = { agg: 'zbir', measure: 'bodovi', basis: q.formula.basis }; q.base = 120;
      if (first) setPlist(first.id);
      return;
    }
    if (q.unit === 'bod') {
      var keep = D.subjPtypes(sj)[0] || 'racun', ids = D.subjProducts(sj).filter(function (p) { return p.ptype === keep; }).map(function (p) { return p.id; });
      delete sj.plist; sj.ptype = keep; sj.products = ids;
      IH.form.conds = (IH.form.conds || []).filter(function (c) { return !c.pt || c.pt.indexOf(keep) >= 0; }).map(function (c) { delete c.pt; return c; });
    }
    q.formula = { agg: v === 'iznos' ? 'zbir' : 'broj', measure: v, basis: q.formula.basis };
    q.unit = v === 'iznos' ? 'RSD' : 'kom'; q.base = v === 'iznos' ? 6000000 : sj.ptype === 'kredit' ? 15 : sj.ptype === 'racun' ? 24 : 12;
  }
  function prodGrid(q, m) {
    var lock = m && m.lock;
    return IH.grid({
      id: 'tw-prod', exportName: 'Proizvodi.xlsx', searchLabel: t('k.search'), actions: [],
      rows: function () { return IH.products().filter(function (p) { return p.status === 'aktivan' && (!lock || p.ptype === TW().subject.ptype); }); },
      key: function (p) { return p.id; }, label: function (p) { return D.productName(p); }, searchKeys: ['n'],
      select: { get: function () { return selectedIds(TW()); }, set: function (l) { TW()._ptc = setSelection(l, lock); }, onChange: function () { TW()._ptc = false; IH.render(); } },
      cols: [
        { key: 'n', label: t('k.colProd'), val: function (p) { return D.productName(p); }, render: function (p) { return '<b>' + IH.esc(D.productName(p)) + '</b>'; } },
        { key: 'pt', label: t('tg.fPt'), val: function (p) { return D.ptypeName(p.ptype); }, fval: function (p) { return p.ptype; }, filter: function () { return D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'seg', label: t('k.colSeg'), val: function (p) { return D.segName(p.seg); }, fval: function (p) { return p.seg; }, filter: function () { return D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'sub', label: t('k.colSub'), val: function (p) { return IH.L(p.sub); } }
      ]
    });
  }
  /* bodovni target: proizvodi i bodovi iz bodovne liste (samo za čitanje; menjaju se u bodovnoj listi) */
  function ptsTable(q) {
    var sj = D.resolveSubj(q.subject);
    return ui.table([{ key: 'n', label: t('k.colProd') }, { key: 'pt', label: t('tg.fPt') }, { key: 'sg', label: t('k.colSeg') }, { key: 'b', label: t('tg.colPts'), num: true }],
      (sj.products || []).map(function (id) { var p = D.product(id); return { n: IH.esc(D.productName(id)), pt: IH.esc(p ? D.ptypeName(p.ptype) : ''), sg: IH.esc(p ? D.segName(p.seg) : ''), b: '<b>' + F.num(D.ptsOf(q, id)) + '</b>' }; }), { compact: true });
  }
  function secConds(q, m) { return R.builderHtml(m.ro ? q.conds : IH.form.conds, { ro: m.ro, ptype: D.subjPtypes(q.subject) }); }
  function section(title, body) { return '<div class="fsec"><h3>' + title + '</h3>' + body + '</div>'; }
  function fullForm(q, m) { return section(t('tg.s1'), secBasic(q, m)) + section(t('tg.s2'), secMeasure(q, m)) + section(t('tg.s3'), secConds(q, m)); }
  IH.targetForm = function (id) { var x = D.target(id); return x ? fullForm(x, { ro: true }) : ''; };

  /* ---------- pregled: ista forma, samo za čitanje ---------- */
  function detailPage(id) {
    var x = D.target(id);
    if (!x) return '<div class="empty">' + t('c.empty') + '</div>';
    var acts = ui.btn(t('c.copy'), { icon: 'copy', act: 'tg-copy', arg: id }) + (x.status === 'aktivan' ? ui.btn(t('tg.toAssign'), { icon: 'share', act: 'asg-new-for', arg: id }) : '') + ui.btn(t('c.edit'), { icon: 'edit', cls: 'primary', go: 'targeti/' + id + '/izmena' });
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('tg.back'), { icon: 'chevl', go: 'targeti' }) + ui.btn(t('c.edit'), { cls: 'primary', icon: 'edit', go: 'targeti/' + id + '/izmena' }) + '</div>';
    return ui.header(IH.esc(IH.L(x.name)), '', acts, '<a href="#/targeti">' + t('tg.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(IH.L(x.name))) +
      '<section class="card"><div class="cb">' + fullForm(x, { ro: true }) + '</div>' + foot + '</section>';
  }
  IH.act['asg-new-for'] = function (el) { IH.form = {}; IH.form.aw = null; if (IH.startAssignFor) IH.startAssignFor(el.dataset.arg); else IH.go('dodela-targeta/nova/1'); };

  /* ---------- nacrt (čarobnjak i izmena) ---------- */
  var QUEUE = [
    { name: L('Stambeni krediti – fizička lica', 'Housing loans – private individuals'), kind: 'individualni', pos: 'licni', periodType: 'Q', subject: { segs: ['FL'], ptype: 'kredit', products: ['P24', 'P25', 'P26'] }, base: 6000000 },
    { name: L('Računi – preduzetnici', 'Accounts – entrepreneurs'), kind: 'individualni', pos: 'univerzalni', periodType: 'Q', subject: { segs: ['PR'], ptype: 'racun', products: [] }, base: 8 },
    { name: L('Kartice – poljoprivrednici (tim)', 'Cards – farmers (team)'), kind: 'timski', team: ['univerzalni'], periodType: 'M', subject: { segs: ['PO'], ptype: 'kartica', products: [] }, base: 6 }
  ];
  function nextId() { var n = 404 + IH.list('newTargets').length; while (D.target('TG-' + n)) n++; return 'TG-' + n; }
  function TW() { return IH.form.tw; }
  function initTW(src, mode) {
    var q = src ? JSON.parse(JSON.stringify(src)) : JSON.parse(JSON.stringify(QUEUE[IH.list('newTargets').length % QUEUE.length]));
    var pre = R.presetFor(q.subject.ptype) || { unit: q.unit, formula: q.formula, conds: q.conds || [] };
    var tw = Object.assign({ unit: pre.unit, formula: pre.formula, conds: pre.conds, status: 'nacrt', ver: 1, counted: ['nova'], dir: 'rastuci', team: q.kind === 'timski' ? ['univerzalni'] : null, pos: q.kind === 'timski' ? null : 'licni' }, q);
    if (mode === 'edit') {
      tw.ver = src.ver + 1 + IH.list('targetVersions').filter(function (v) { return v.id === src.id; }).length; tw.from = firstFrom(src.periodType); tw.to = null; tw.reason = '';
      IH.form = { tw: tw, conds: JSON.parse(JSON.stringify(src.conds || [])), _mode: 'edit', _for: src.id };
      return;
    }
    Object.assign(tw, { id: nextId(), isNew: true, from: firstFrom(q.periodType), to: null, ver: 1, status: 'nacrt' });
    if (src) tw.name = { sr: IH.L(src.name) + ' – kopija', en: IH.L(src.name) + ' – copy' };
    IH.form = { tw: tw, conds: JSON.parse(JSON.stringify(tw.conds)), _mode: 'new' };
  }
  function setPtype(pt) {
    var q = TW(), pre = R.presetFor(pt);
    q.subject.ptype = pt; q.subject.products = []; if (pt !== 'racun') q.mode = undefined;
    q.unit = pre.unit; q.formula = pre.formula; IH.form.conds = JSON.parse(JSON.stringify(pre.conds));
    q.base = pt === 'kredit' ? 6000000 : pt === 'racun' ? 24 : 12;
  }
  function num(v) { var n = parseFloat(String(v).replace(/\./g, '').replace(',', '.')); return isNaN(n) ? null : n; }
  IH.act['tw-kind'] = function (el) { var q = TW(); q.kind = el.dataset.arg; if (q.kind === 'timski') { q.team = q.team || ['univerzalni']; q.pos = null; } else { q.pos = q.pos || 'licni'; q.team = null; } IH.render(); };
  IH.act['tw-team'] = function (el) { var q = TW(), l = q.team = q.team || [], i = l.indexOf(el.dataset.arg); if (i >= 0) { if (l.length > 1) l.splice(i, 1); } else l.push(el.dataset.arg); IH.render(); };
  IH.act['tw-per'] = function (el) { var q = TW(); if (q.periodType !== el.dataset.arg) { q.periodType = el.dataset.arg; q.from = firstFrom(q.periodType); q.to = null; } IH.render(); };
  IH.act['tw-pt'] = function (el) { if (TW().subject.ptype !== el.dataset.arg) setPtype(el.dataset.arg); IH.render(); };
  IH.act['tw-meas'] = function (el) { setMeasure(el.dataset.arg); IH.render(); };
  IH.act['tw-vmode'] = function (el) { var q = TW(); q.value = el.dataset.arg === 'zbir' ? { mode: 'zbir', of: (q.value && q.value.of) || [] } : { mode: 'zadaje' }; IH.render(); };
  document.addEventListener('change', function (e) { var d = e.target.dataset || {}, q = IH.form && IH.form.tw; if (!d.twof || !q) return; q.value = q.value || { mode: 'zbir', of: [] }; var l = q.value.of = q.value.of || []; if (e.target.checked) { if (l.indexOf(d.twof) < 0) l.push(d.twof); } else q.value.of = l.filter(function (x) { return x !== d.twof; }); IH.render(); });
  IH.act['tw-seg'] = function (el) { var q = TW(), s = el.dataset.arg, i = q.subject.segs.indexOf(s); if (i >= 0) { if (q.subject.segs.length > 1) q.subject.segs.splice(i, 1); } else q.subject.segs.push(s); q.subject.products = []; IH.render(); };
  function onTw(e, final) {
    var d = e.target.dataset || {}, q = TW(); if (!d.tw || !q) return;
    var v = e.target.value;
    if (d.tw === 'name') q.name = { sr: v, en: v };
    else if (d.tw === 'reason') q.reason = v;
    else if (d.tw === 'base') { var n = num(v); if (n != null) q.base = n; }
    else if (!final) return;
    else if (d.tw === 'plist') { setPlist(v); IH.render(); }
    else if (d.tw === 'measure') { q.formula.measure = v; q.formula.agg = v === 'iznos' ? 'zbir' : 'broj'; q.unit = v === 'iznos' ? 'RSD' : 'kom'; q.base = v === 'iznos' ? 6000000 : (q.subject.ptype === 'kredit' ? 15 : q.base); IH.render(); }
    else if (d.tw === 'basis') q.formula.basis = v;
    else if (d.tw === 'pos') q.pos = v;
    else if (d.tw === 'from') q.from = v;
    else if (d.tw === 'to') q.to = v || null;
  }
  document.addEventListener('input', function (e) { onTw(e, false); });
  document.addEventListener('change', function (e) { onTw(e, true); });
  IH.refreshers.conds = function () { var el = document.getElementById('cond-builder'), q = TW(); if (!el || !q) return; el.outerHTML = R.builderHtml(IH.form.conds, { ptype: D.subjPtypes(q.subject) }); };

  /* provere pre aktivacije */
  function checks(q) {
    var prods = prodsOfSubject(q), segs = q.subject.segs || [];
    var sellers = q.kind === 'timski' ? (q.team || []) : [q.pos || 'licni'], sold = {};
    sellers.forEach(function (p) { (D.positions[p].segs || []).forEach(function (s) { sold[s] = 1; }); });
    var missing = segs.filter(function (s) { return !sold[s]; });
    var qp = D.subjPtypes(q.subject), condOk = (IH.form.conds || []).every(function (c) { var tp = R.template(c.tpl); return !tp || !tp.pt || tp.pt.some(function (x) { return qp.indexOf(x) >= 0; }); });
    return [
      { label: t('tg.chk1'), state: IH.L(q.name) && q.from && (!q.reason && IH.form._mode === 'edit' ? false : true) ? 'ok' : 'no' },
      { label: t('tg.chk2'), state: prods.length ? 'ok' : 'no', sub: t('tg.prodsN', { n: prods.length }) },
      { label: t('tg.chk3'), state: missing.length === segs.length ? 'no' : missing.length ? 'warn' : 'ok', sub: missing.length ? t('tg.chk3no', { p: sellers.map(D.posName).join(' + '), g: missing.map(D.segName).join(', ') }) : null },
      { label: t('tg.chk4'), state: condOk ? 'ok' : 'no' },
      q.kind === 'timski' && q.value && q.value.mode === 'zbir' ? { label: t('tg.chk7'), state: (q.value.of || []).length ? 'ok' : 'no' } : null,
      q.formula.measure === 'iznos' ? { label: t('tg.chk8'), state: q.subject.ptype === 'kredit' ? 'ok' : 'no', sub: q.subject.ptype === 'kredit' ? null : t('tg.chk8no') } : null,
      q.unit === 'bod' ? { label: t('tg.chk9'), state: q.subject.plist ? 'ok' : 'no' } : null,
      { label: t('tg.chk5', { d: F.date(q.from) }) },
      { label: t('tg.chk6'), state: 'warn' }
    ].filter(Boolean);
  }

  /* ---------- čarobnjak: novi target ---------- */
  function wizardPage(step) {
    if (!TW() || IH.form._mode !== 'new') initTW();
    var q = TW(), cur = Math.max(0, Math.min(3, (+step || 1) - 1)), m = { ro: false };
    var steps = ['tg.s1', 'tg.s2', 'tg.s3', 'tg.s4'].map(function (k) { return { label: t(k) }; });
    var body;
    if (cur === 0) body = secBasic(q, m);
    else if (cur === 1) body = secMeasure(q, m);
    else if (cur === 2) body = secConds(q, m);
    else { q.conds = JSON.parse(JSON.stringify(IH.form.conds || [])); body = ui.checks(checks(q)) + '<div class="hr"></div>' + fullForm(q, { ro: true }) + '<div style="margin-top:14px">' + ui.btn(t('tg.saveDraft'), { act: 'tg-save', arg: 'nacrt' }) + '</div>'; }
    return ui.header(t('tg.new'), '', '', '<a href="#/targeti">' + t('tg.title') + '</a> ' + ic('chevr') + ' ' + t('tg.new')) +
      ui.wizard({ base: 'targeti/novi', steps: steps, cur: cur, body: body, finishLabel: t('tg.activate'), finishAct: 'tg-save', cancelGo: 'targeti' });
  }
  IH.act['tg-new'] = function () { initTW(); IH.go('targeti/novi/1'); };
  IH.act['tg-copy'] = function (el) { initTW(D.target(el.dataset.arg)); IH.go('targeti/novi/1'); };
  IH.act['tg-save'] = function (el) {
    var q = TW(); if (!q) return;
    q.conds = JSON.parse(JSON.stringify(IH.form.conds || []));
    var draft = el.dataset.arg === 'nacrt', bad = checks(q).filter(function (c) { return c.state === 'no'; });
    if (!draft && bad.length) { IH.toast(t('tg.blocked', { r: bad.map(function (c) { return c.sub || c.label; }).join('; ') })); return; }
    var rec = Object.assign({}, q, { status: draft ? 'nacrt' : 'aktivan', measure: q.formula.measure, basis: q.formula.basis });
    IH.list('newTargets').push(rec);
    IH.audit('target', rec.id, draft ? { sr: 'Kreiran nacrt targeta', en: 'Target draft created' } : { sr: 'Kreiran i aktiviran target', en: 'Target created and activated' }, { sr: 'Važi od ' + F.date(rec.from), en: 'Valid from ' + F.date(rec.from) });
    IH.form = {}; IH.save(); IH.go('targeti'); IH.toast(draft ? t('tg.draftOk', { n: IH.esc(IH.L(rec.name)) }) : t('tg.created', { n: IH.esc(IH.L(rec.name)), d: F.date(rec.from) }));
  };

  /* ---------- izmena = nova verzija od sledećeg perioda (ista forma, prepopunjena) ---------- */
  function editPage(id) {
    var x = D.target(id); if (!x) return listPage();
    if (IH.form._mode !== 'edit' || IH.form._for !== id) initTW(x, 'edit');
    var q = TW();
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('c.cancel'), { go: 'targeti/' + id }) + ui.btn(t('tg.saveVer'), { cls: 'primary', icon: 'check', act: 'tg-ver-save', arg: id }) + '</div>';
    return ui.header(t('tg.editT') + ' · ' + IH.esc(IH.L(x.name)), '', '', '<a href="#/targeti">' + t('tg.title') + '</a> ' + ic('chevr') + ' <a href="#/targeti/' + id + '">' + IH.esc(IH.L(x.name)) + '</a> ' + ic('chevr') + ' ' + t('c.edit')) +
      '<section class="card"><div class="cb">' + fullForm(q, { ro: false, lock: true }) + '</div>' + foot + '</section>';
  }
  IH.act['tg-ver-save'] = function (el) {
    var id = el.dataset.arg, x = D.target(id), q = TW();
    if (!q.reason) q.reason = IH.L(L('Godišnje usklađivanje sa budžetom za 2027.', 'Annual alignment with the 2027 budget'));
    IH.list('targetVersions').push({ id: id, v: q.ver, from: q.from, to: q.to, at: IH.now(), note: { sr: q.reason, en: q.reason }, base: q.base, subject: q.subject, formula: q.formula, dir: q.dir, mode: q.mode, value: q.value, conds: JSON.parse(JSON.stringify(IH.form.conds || [])) });
    EN.invalidate();
    if (IH.L(q.name) !== IH.L(x.name)) IH.map('targetEdits')[id] = Object.assign({}, IH.map('targetEdits')[id], { name: q.name });
    IH.audit('target', id, { sr: 'Kreirana verzija v' + q.ver, en: 'Version v' + q.ver + ' created' }, { sr: 'Važi od ' + F.date(q.from) + ' · ' + q.reason, en: 'Valid from ' + F.date(q.from) + ' · ' + q.reason });
    IH.form = {}; IH.save(); IH.go('targeti'); IH.toast(t('tg.verDone', { v: q.ver, n: IH.esc(IH.L(D.target(id).name)), d: F.date(q.from) }));
  };

  IH.route('targeti', {
    title: function () { return t('tg.title'); },
    render: function (p) {
      if (!p[0]) return listPage();
      if (p[0] === 'novi') return wizardPage(p[1]);
      if (p[1] === 'izmena' || p[1] === 'verzija') return editPage(p[0]);
      return detailPage(p[0]);
    }
  });
})();
