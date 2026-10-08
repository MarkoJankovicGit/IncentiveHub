/* Incentive Hub — Katalog proizvoda (Administrator): proizvodi iz kataloga banke, mapiranje šifara, uvoz */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    'k.title': 'Katalog proizvoda', 'k.tProd': 'Proizvodi', 'k.tMap': 'Mapiranje šifara',
    'k.new': 'Novi proizvod', 'k.search': 'Naziv ili šifra',
    'k.colProd': 'Proizvod', 'k.colSeg': 'Grupa klijenata', 'k.colPt': 'Vrsta proizvoda', 'k.colSub': 'Podvrsta', 'k.colUnit': 'Jedinica', 'k.colCodes': 'Šifra', 'k.colFrom': 'Važi od', 'k.colVer': 'Verzija',
    'k.basic': 'Osnovni podaci', 'k.ucName': 'Naziv u banci', 'k.gName': 'Generički naziv', 'k.seg': 'Grupa klijenata', 'k.pt': 'Vrsta proizvoda', 'k.sub': 'Podvrsta',
    'k.bankAttrs': 'Karakteristike iz kataloga banke', 'k.attrs': 'Dodatni atributi', 'k.cat': 'Obračunska kategorija', 'k.unitM': 'Jedinica merenja', 'k.codes': 'Šifre iz core sistema', 'k.codeDesc': 'Opis', 'k.mappedFrom': 'Mapirano od',
    'k.usage': 'Gde se koristi', 'k.sales': 'Prodaja po kvartalu', 'k.items': 'prodaja', 'k.uTarget': 'Target', 'k.uScheme': 'Šema',
    'k.deactTitle': 'Deaktivacija proizvoda', 'k.deactCheck': 'Provera upotrebe', 'k.deactFrom': 'Deaktivacija važi od', 'k.deactDone': 'Proizvod {p} biće deaktiviran od {d}', 'k.deactPlanned': 'Deaktivacija od {d}',
    'k.uTargets': '{n} targeta obuhvata ovaj proizvod', 'k.uItems': '{n} prodaja u tekućim periodima', 'k.uOpen': 'Obračun Q3 je u saglasnostima — ne menja se',
    'k.formNew': 'Novi proizvod', 'k.formCopy': 'Kopija proizvoda', 'k.formEdit': 'Izmena proizvoda', 'k.view': 'Pregled proizvoda',
    'k.fCodes': 'Šifre iz core sistema', 'k.fCodesH': 'Više šifara odvojite zarezom', 'k.fFrom': 'Važi od', 'k.fTo': 'Važi do', 'k.fReason': 'Razlog izmene', 'k.fEff': 'Primena izmene',
    'k.created': 'Proizvod {p} je kreiran', 'k.updated': 'Proizvod {p} je izmenjen — nova verzija v{v}',
    'k.mAll': 'Sve', 'k.mOpen': 'Nemapirane', 'k.mDone': 'Mapirane', 'k.colSrcCode': 'Šifra iz izvora', 'k.colFirst': 'Prvo pojavljivanje', 'k.colItems': 'Prodaja', 'k.mapBtn': 'Mapiraj', 'k.mapped': 'Mapirano', 'k.waiting': 'Čeka mapiranje',
    'k.mapTitle': 'Mapiranje šifre {c}', 'k.mapProd': 'Proizvod', 'k.mapFrom': 'Mapiranje važi od', 'k.mapEffect': 'Efekat na obračun',
    'k.mapEffNow': '{n} prodaja iz tekućih perioda ulazi u ostvarenje odmah', 'k.mapEffClosed': '{n} prodaja iz zaključenog Q3 ulazi pri ponovnom obračunu Q3',
    'k.mapDone': 'Šifra {c} mapirana na {p} — {n} prodaja više nije na čekanju',
    'k.impTitle': 'Uvoz kataloga iz Excela', 'k.impS1': 'Fajl', 'k.impS2': 'Pregled promena', 'k.impS3': 'Potvrda',
    'k.impTemplate': 'Preuzmi šablon', 'k.impFile': 'Katalog_izmene_2026-10.xlsx', 'k.impRead': '6 redova pročitano · 1 list',
    'k.impRow': 'Red', 'k.impAction': 'Akcija', 'k.impChange': 'Promena', 'k.impRes': 'Rezultat',
    'k.aNew': 'Novi', 'k.aEdit': 'Izmena', 'k.aSkip': 'Bez promene', 'k.aErr': 'Greška', 'k.rOk': 'Spremno', 'k.rSkip': 'Preskače se', 'k.rErr': 'Odbijeno',
    'k.impSum': '{a} novih · {b} izmena · {c} bez promene · {d} sa greškom', 'k.impConfirm': 'Potvrdi uvoz ({n} redova)', 'k.impDone': 'Uvoz završen: {n} redova primenjeno, 1 odbijen red je u izveštaju o greškama',
    'k.impErr': 'Vrsta proizvoda „Lizing“ ne postoji', 'k.impNoChange': 'Vrednosti su iste kao u katalogu',
    'k.histCreated': 'Kreiran proizvod', 'k.histCode': 'Dodata šifra {c}', 'k.histCat': 'Usklađeno sa katalogom banke od 24.08.2026.', 'k.histDeact': 'Privremeno povučen iz ponude', 'k.histPrime': 'Novi Prime paket', 'k.histPrimeD': 'Uveden 13.05.2026.',
    'k.noTargets': 'Nijedan target ne obuhvata ovaj proizvod', 'k.back': 'Nazad', 'k.usageT': 'Gde se koristi — {p}'
  }, {
    'k.title': 'Product catalogue', 'k.tProd': 'Products', 'k.tMap': 'Code mapping',
    'k.new': 'New product', 'k.search': 'Name or code',
    'k.colProd': 'Product', 'k.colSeg': 'Client group', 'k.colPt': 'Product type', 'k.colSub': 'Subtype', 'k.colUnit': 'Unit', 'k.colCodes': 'Code', 'k.colFrom': 'Valid from', 'k.colVer': 'Version',
    'k.basic': 'Basic data', 'k.ucName': 'Bank name', 'k.gName': 'Generic name', 'k.seg': 'Client group', 'k.pt': 'Product type', 'k.sub': 'Subtype',
    'k.bankAttrs': 'Characteristics from the bank catalogue', 'k.attrs': 'Additional attributes', 'k.cat': 'Calculation category', 'k.unitM': 'Unit of measure', 'k.codes': 'Core system codes', 'k.codeDesc': 'Description', 'k.mappedFrom': 'Mapped since',
    'k.usage': 'Where used', 'k.sales': 'Sales per quarter', 'k.items': 'sales', 'k.uTarget': 'Target', 'k.uScheme': 'Scheme',
    'k.deactTitle': 'Deactivate product', 'k.deactCheck': 'Usage check', 'k.deactFrom': 'Deactivation effective from', 'k.deactDone': 'Product {p} will be deactivated from {d}', 'k.deactPlanned': 'Deactivation from {d}',
    'k.uTargets': '{n} targets cover this product', 'k.uItems': '{n} sales in current periods', 'k.uOpen': 'Q3 calculation is in consents — not changed',
    'k.formNew': 'New product', 'k.formCopy': 'Copy of product', 'k.formEdit': 'Edit product', 'k.view': 'Product',
    'k.fCodes': 'Core system codes', 'k.fCodesH': 'Separate multiple codes with commas', 'k.fFrom': 'Valid from', 'k.fTo': 'Valid to', 'k.fReason': 'Reason for change', 'k.fEff': 'Apply change',
    'k.created': 'Product {p} created', 'k.updated': 'Product {p} updated — new version v{v}',
    'k.mAll': 'All', 'k.mOpen': 'Unmapped', 'k.mDone': 'Mapped', 'k.colSrcCode': 'Source code', 'k.colFirst': 'First seen', 'k.colItems': 'Sales', 'k.mapBtn': 'Map', 'k.mapped': 'Mapped', 'k.waiting': 'Awaiting mapping',
    'k.mapTitle': 'Map code {c}', 'k.mapProd': 'Product', 'k.mapFrom': 'Mapping valid from', 'k.mapEffect': 'Effect on calculation',
    'k.mapEffNow': '{n} sales from current periods enter achievement immediately', 'k.mapEffClosed': '{n} sales from locked Q3 enter when Q3 is recalculated',
    'k.mapDone': 'Code {c} mapped to {p} — {n} sales no longer waiting',
    'k.impTitle': 'Catalogue import from Excel', 'k.impS1': 'File', 'k.impS2': 'Change preview', 'k.impS3': 'Confirm',
    'k.impTemplate': 'Download template', 'k.impFile': 'Katalog_izmene_2026-10.xlsx', 'k.impRead': '6 rows read · 1 sheet',
    'k.impRow': 'Row', 'k.impAction': 'Action', 'k.impChange': 'Change', 'k.impRes': 'Result',
    'k.aNew': 'New', 'k.aEdit': 'Change', 'k.aSkip': 'No change', 'k.aErr': 'Error', 'k.rOk': 'Ready', 'k.rSkip': 'Skipped', 'k.rErr': 'Rejected',
    'k.impSum': '{a} new · {b} changes · {c} unchanged · {d} with errors', 'k.impConfirm': 'Confirm import ({n} rows)', 'k.impDone': 'Import complete: {n} rows applied, 1 rejected row is in the error report',
    'k.impErr': 'Product type "Leasing" does not exist', 'k.impNoChange': 'Values are the same as in the catalogue',
    'k.histCreated': 'Product created', 'k.histCode': 'Code {c} added', 'k.histCat': 'Aligned with the bank catalogue of Aug 24, 2026', 'k.histDeact': 'Temporarily withdrawn from offer', 'k.histPrime': 'New Prime package', 'k.histPrimeD': 'Introduced May 13, 2026',
    'k.noTargets': 'No target covers this product', 'k.back': 'Back', 'k.usageT': 'Where used — {p}'
  });

  /* ---------- efektivni katalog (osnova + izmene iz demo-a) ---------- */
  var baseProduct = D.product;
  D.product = function (id) {
    var b = baseProduct(id) || IH.list('newProducts').filter(function (p) { return p.id === id; })[0];
    if (!b) return null;
    var e = (IH.state.data.prodEdits || {})[id];
    return e ? Object.assign({}, b, e) : b;
  };
  IH.products = function () {
    return D.products.map(function (p) { return D.product(p.id); }).concat(IH.list('newProducts').map(function (p) { return D.product(p.id); }));
  };
  function subName(p) { return IH.L(p.sub); }
  function subsOf() { var u = {}; IH.products().forEach(function (p) { u[IH.L(p.sub)] = 1; }); return Object.keys(u).sort(); }
  function historyOf(p) {
    var h = [];
    if (p.id === 'P04') h.push({ at: '2026-05-13T08:00', by: 'A001', action: t('k.histPrime'), detail: t('k.histPrimeD') });
    else if (p.isNew) h.push({ at: p.createdAt, by: 'A001', action: t('k.histCreated'), detail: null });
    else {
      h.push({ at: (p.from < '2023-02-01' ? p.from : '2023-02-01') + 'T09:00', by: 'A001', action: t('k.histCreated'), detail: null });
      if (p.codes[1]) h.push({ at: '2024-07-01T10:15', by: 'A001', action: t('k.histCode', { c: p.codes[1] }), detail: null });
      h.push({ at: '2026-08-24T14:40', by: 'A001', action: t('k.histCat'), detail: null });
      if (p.status === 'neaktivan') h.push({ at: '2026-07-01T17:00', by: 'A001', action: t('k.histDeact'), detail: null });
    }
    return IH.auditFor('product', p.id).concat(h.reverse());
  }
  /* broj prodaja po šifri (svi periodi) */
  var codeStats = null;
  function stats() {
    if (codeStats) return codeStats;
    codeStats = {};
    D.periods.forEach(function (pp) {
      D.allItems(pp.id).forEach(function (i) {
        var s = codeStats[i.code] = codeStats[i.code] || { n: 0, first: i.date, byP: {}, vol: 0, unm: 0, unmCur: 0, unmClosed: 0 };
        s.n++; if (i.date < s.first) s.first = i.date; s.byP[pp.id] = (s.byP[pp.id] || 0) + 1; s.vol += i.amount || 0;
        if (i.status === 'nemapirano') { s.unm++; if (pp.status === 'u_toku') s.unmCur++; else s.unmClosed++; }
      });
    });
    return codeStats;
  }
  function prodSales(p) {
    var out = {};
    p.codes.forEach(function (c) { var s = stats()[c]; if (!s) return; Object.keys(s.byP).forEach(function (k) { out[k] = (out[k] || 0) + s.byP[k]; }); });
    return out;
  }
  function usage(p) {
    return { targets: IH.targets().filter(function (x) { return x.status !== 'arhiviran' && EN.matches(x, { ptype: p.ptype, seg: p.seg, product: p.id }); }) };
  }

  function tabsHtml(cur) {
    var codes = {}; IH.stats.unmapped().forEach(function (i) { codes[i.code] = 1; });
    return ui.rtabs('katalog', [
      { id: '', label: t('k.tProd'), cnt: IH.products().filter(function (p) { return p.status === 'aktivan'; }).length },
      { id: 'mapiranje', label: t('k.tMap'), cnt: Object.keys(codes).length || null, warn: true },
      { id: 'bodovi', label: t('k.tPts'), cnt: D.pointLists().filter(function (x) { return x.status === 'aktivan'; }).length }
    ], cur);
  }
  function header() { return ui.header(t('k.title'), '', ui.btn(t('c.import'), { icon: 'upload', go: 'katalog/uvoz/1' })); }
  IH.katalogTabs = tabsHtml; IH.katalogHeader = header;

  /* ---------- lista proizvoda ---------- */
  function listPage() {
    var grid = IH.grid({
      id: 'kat-p', exportName: 'Katalog_proizvoda.xlsx', hidden: ['ver'], searchLabel: t('k.search'), create: { label: t('k.new'), act: 'prod-new' },
      rows: IH.products, key: function (p) { return p.id; }, label: function (p) { return D.productName(p); },
      searchKeys: ['n', 'codes'],
      rowCls: function (p) { return p.status === 'aktivan' ? '' : 'muted'; },
      cols: [
        { key: 'st', label: t('c.status'), type: 'status', val: function (p) { return p.status === 'aktivan'; }, fval: function (p) { return p.status === 'aktivan' ? 'on' : 'off'; }, filter: function () { return [{ v: 'on', l: t('c.active') }, { v: 'off', l: t('c.inactive') }]; } },
        { key: 'n', label: t('k.colProd'), nw: false, val: function (p) { return D.productName(p); }, render: function (p) { return '<b>' + IH.esc(D.productName(p)) + '</b>' + (p.deactFrom ? ' ' + ui.pill(t('k.deactPlanned', { d: F.date(p.deactFrom) }), 'warning') : '') + (p.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } },
        { key: 'seg', label: t('k.colSeg'), val: function (p) { return D.segName(p.seg); }, fval: function (p) { return p.seg; }, filter: function () { return D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'pt', label: t('k.colPt'), val: function (p) { return D.ptypeName(p.ptype); }, fval: function (p) { return p.ptype; }, filter: function () { return D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'sub', label: t('k.colSub'), val: function (p) { return subName(p); }, filter: function () { return subsOf().map(function (s) { return { v: s, l: s }; }); } },
        { key: 'unit', label: t('k.colUnit'), val: function (p) { return p.unit === 'RSD' ? 'RSD' : t('u.kom'); } },
        { key: 'codes', label: t('k.colCodes'), val: function (p) { return p.codes.join(' '); }, render: function (p) { return IH.esc(p.codes[0]) + (p.codes.length > 1 ? ' <span class="mut">+' + (p.codes.length - 1) + '</span>' : ''); } },
        { key: 'from', label: t('k.colFrom'), val: function (p) { return p.from; }, render: function (p) { return F.date(p.from); } },
        { key: 'ver', label: t('k.colVer'), num: true, search: false, val: function (p) { return p.ver; }, render: function (p) { return 'v' + p.ver; } }
      ],
      onStatus: function (p, on) {
        if (!on) { IH.act['prod-deact']({ dataset: { arg: p.id } }); return false; }
        IH.map('prodEdits')[p.id] = Object.assign({}, IH.map('prodEdits')[p.id], { status: 'aktivan', deactFrom: null });
        IH.audit('product', p.id, { sr: 'Proizvod ponovo aktiviran', en: 'Product reactivated' });
      },
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (p) { return 'katalog/' + p.id; } },
        { type: 'edit', title: t('g.aEdit'), act: 'g-go', kind: 'acc', arg: function (p) { return 'katalog/izmena/' + p.id; } },
        { icon: 'target', title: t('k.usage'), act: 'prod-usage' },
        { type: 'history', title: t('g.aHistory'), act: 'prod-hist' },
        { type: 'copy', title: t('g.aCopy'), act: 'g-go', arg: function (p) { return 'katalog/kopija/' + p.id; } },
        { type: 'deact', title: t('g.aDeact'), act: 'prod-deact', kind: 'dan', show: function (p) { return p.status === 'aktivan' && !p.deactFrom; } }
      ]
    });
    return header() + tabsHtml('') + grid;
  }
  IH.act['prod-hist'] = function (el) { var p = D.product(el.dataset.arg); IH.showHistory(D.productName(p), historyOf(p)); };
  IH.act['prod-usage'] = function (el) {
    var p = D.product(el.dataset.arg), u = usage(p);
    IH.modal({ title: t('k.usageT', { p: IH.esc(D.productName(p)) }), wide: true, body: u.targets.length ? ui.table([{ key: 'a', label: t('k.uTarget') }, { key: 'k', label: t('tg.colKind') }, { key: 'b', label: t('k.uScheme') }], u.targets.map(function (x) { var s = x.scheme ? D.scheme(x.scheme) : null; return { a: '<a href="#/targeti/' + x.id + '" data-act="modal-close">' + IH.esc(IH.L(x.name)) + '</a>', k: x.kind === 'timski' ? t('k.team') : t('k.ind'), b: s ? IH.esc(IH.L(s.name)) : '<span class="mut">—</span>' }; }), { compact: true }) : '<div class="empty">' + t('k.noTargets') + '</div>', foot: ui.btn(t('c.close'), { act: 'modal-close' }) });
  };

  /* ---------- forma proizvoda: ista za pregled, izmenu, kopiju i novi ---------- */
  function fields(q, mode) {
    var ro = mode === 'view', edit = mode === 'edit';
    var f = [
      { k: 'p_name', label: t('k.ucName'), value: q.name, req: true, full: true },
      { k: 'p_gname', label: t('k.gName'), value: IH.L(q.gname), full: true },
      { k: 'p_seg', label: t('k.seg'), type: 'select', value: q.seg, options: D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }) },
      { k: 'p_pt', label: t('k.pt'), type: 'select', value: q.ptype, options: D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }) },
      { k: 'p_sub', label: t('k.sub'), value: IH.L(q.sub) },
      { k: 'p_status', label: t('c.status'), type: 'select', value: q.status, options: [{ v: 'aktivan', l: t('st2.aktivan') }, { v: 'neaktivan', l: t('st2.neaktivan') }] },
      { k: 'p_from', label: t('k.fFrom'), value: F.date(q.from) },
      { k: 'p_to', label: t('k.fTo'), value: q.to ? F.date(q.to) : '' },
      { k: 'p_ver', label: t('k.colVer'), type: 'static', value: 'v' + q.ver }
    ];
    if (edit) f.push({ k: 'p_reason', label: t('k.fReason'), value: '', sug: IH.L({ sr: 'Usklađivanje sa novim katalogom banke', en: 'Alignment with the new bank catalogue' }), req: true, full: true });
    return f;
  }
  function attrFields(q) { return D.attrDefs.map(function (a) { return { k: 'a_' + a.k, label: IH.L(a.name), value: q.attrs && q.attrs[a.k] != null ? IH.L(q.attrs[a.k]) : '', full: a.k === 'kamata' || a.k === 'naknada' || a.k === 'obezbedjenje' }; }); }
  function extraFields(q) {
    var c = D.cat(q.cat);
    return [
      { k: 'x_unit', label: t('k.unitM'), type: 'select', value: q.unit, options: [{ v: 'kom', l: IH.L({ sr: 'Količina (kom)', en: 'Quantity (pcs)' }) }, { v: 'RSD', l: IH.L({ sr: 'Novac (RSD)', en: 'Money (RSD)' }) }] },
      { k: 'x_cat', label: t('k.cat'), type: 'static', value: c ? IH.L(c.name) : '' },
      { k: 'x_codes', label: t('k.fCodes'), value: q.codes.join(', '), hint: t('k.fCodesH'), full: true }
    ];
  }
  function formHtml(q, mode) {
    var o = { readonly: mode === 'view' };
    return '<div class="fsec"><h3>' + t('k.basic') + '</h3>' + ui.form(fields(q, mode), o) + '</div><div class="fsec"><h3>' + t('k.bankAttrs') + '</h3>' + ui.form(attrFields(q), o) + '</div><div class="fsec"><h3>' + t('k.attrs') + '</h3>' + ui.form(extraFields(q), o) + '</div>';
  }

  /* ---------- pregled proizvoda ---------- */
  function detailPage(id) {
    var p = D.product(id);
    if (!p) return '<div class="empty">' + t('c.empty') + '</div>';
    var acts = ui.btn(t('c.copy'), { icon: 'copy', go: 'katalog/kopija/' + id }) +
      (p.status === 'aktivan' && !p.deactFrom ? ui.btn(t('c.deactivate'), { icon: 'lock', cls: 'danger', act: 'prod-deact', arg: id }) : '') + ui.btn(t('c.edit'), { icon: 'edit', cls: 'primary', go: 'katalog/izmena/' + id });
    var h = ui.header(IH.esc(D.productName(p)), '', acts, '<a href="#/katalog">' + t('k.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(D.productName(p)));
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('k.back'), { icon: 'chevl', go: 'katalog' }) + ui.btn(t('c.edit'), { cls: 'primary', icon: 'edit', go: 'katalog/izmena/' + id }) + '</div>';
    return h + '<section class="card"><div class="cb">' + formHtml(p, 'view') + '</div>' + foot + '</section>';
  }
  IH.act['prod-deact'] = function (el) {
    var p = D.product(el.dataset.arg), u = usage(p);
    var curItems = 0; p.codes.forEach(function (c) { var s = stats()[c]; if (s) curItems += (s.byP['2026-Q4'] || 0) + (s.byP['2026-10'] || 0); });
    IH.form = {};
    IH.modal({
      title: t('k.deactTitle') + ' · ' + IH.esc(D.productName(p)),
      body: '<div class="lab">' + t('k.deactCheck') + '</div>' + ui.checks([
        { label: t('k.uTargets', { n: u.targets.length }), state: u.targets.length ? 'warn' : 'ok', sub: u.targets.map(function (x) { return IH.L(x.name); }).join(', ') },
        { label: t('k.uItems', { n: F.num(curItems) }), state: curItems ? 'warn' : 'ok' },
        { label: t('k.uOpen'), state: 'ok' }
      ]) + '<div class="form-grid" style="margin-top:14px">' + ui.field('d_from', t('k.deactFrom'), '01.11.2026.', {}) + ui.field('d_reason', t('k.fReason'), IH.L({ sr: 'Proizvod se povlači iz ponude', en: 'Product withdrawn from offer' }), {}) + '</div>',
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.deactivate'), { cls: 'primary', icon: 'lock', act: 'prod-deact-save', arg: p.id })
    });
  };
  IH.act['prod-deact-save'] = function (el) {
    var id = el.dataset.arg;
    IH.map('prodEdits')[id] = Object.assign({}, IH.map('prodEdits')[id], { deactFrom: '2026-11-01' });
    IH.audit('product', id, { sr: 'Zakazana deaktivacija od 01.11.2026.', en: 'Deactivation scheduled from Nov 1, 2026' }, { sr: 'Proizvod se povlači iz ponude', en: 'Product withdrawn from offer' });
    IH.closeModal(); IH.render(); IH.toast(t('k.deactDone', { p: IH.esc(D.productName(id)), d: F.date('2026-11-01') }));
  };

  /* ---------- novi / kopija / izmena ---------- */
  var L = D.L2;
  var QUEUE = [
    { name: 'Gotovinski kredit za klijente partnerskih kompanija', gname: L('Gotovinski kredit – partnerske kompanije', 'Cash loan – partner companies'), seg: 'FL', ptype: 'kredit', sub: L('Gotovinski', 'Cash'), unit: 'RSD', codes: ['KK-PRT-60', 'KK-PRT-84'], from: '2026-11-01', attrs: { valuta: 'RSD', rok: L('6–71 mesec', '6–71 months'), kamata: L('Fiksna 1,3–25% godišnje', 'Fixed 1.3–25% p.a.'), naknada: L('Obrada zahteva 0–3%', 'Processing 0–3%'), obezbedjenje: L('Menice, administrativna zabrana', 'Bills of exchange, salary assignment'), kanal: L('Ekspozitura', 'Branch'), klijenti: L('Zaposleni u partnerskim kompanijama', 'Employees of partner companies') }, w: 5, amt: [300000, 1200000] },
    { name: 'Zeleni stambeni kredit', gname: L('Zeleni stambeni kredit', 'Green housing loan'), seg: 'FL', ptype: 'kredit', sub: L('Stambeni', 'Housing'), unit: 'RSD', codes: ['SK-GRN-300'], from: '2027-01-01', attrs: { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('5–30 godina', '5–30 years'), kamata: L('EUR: 6M Euribor + 0,5–8%', 'EUR: 6M Euribor + 0.5–8%'), obezbedjenje: L('Hipoteka I reda, energetski pasoš A ili B', 'First-rank mortgage, energy certificate A or B'), kanal: L('Ekspozitura', 'Branch'), klijenti: L('Rezidenti', 'Residents') }, w: 1, amt: [3000000, 6000000] },
    { name: 'Mastercard Gold Business debitna kartica', gname: L('Mastercard Gold Business debitna kartica', 'Mastercard Gold Business debit card'), seg: 'PR', ptype: 'kartica', sub: L('Debitna', 'Debit'), unit: 'kom', codes: ['BC-MGB-01'], from: '2026-11-01', attrs: { valuta: L('RSD / EUR', 'RSD / EUR'), rok: L('5 godina', '5 years'), naknada: L('Članarina; ostale naknade 0–15.000 RSD', 'Membership; other fees 0–15,000 RSD'), kanal: L('Ekspozitura', 'Branch'), klijenti: L('Preduzetnici', 'Entrepreneurs') }, w: 5 }
  ];
  function nextId() { var n = D.products.length + IH.list('newProducts').length + 1; while (D.product('P' + n)) n++; return 'P' + n; }
  function draftFor(mode, srcId) {
    var src = srcId ? D.product(srcId) : null;
    if (mode === 'new') { var q = QUEUE[IH.list('newProducts').filter(function (p) { return !p.copyOf; }).length % QUEUE.length]; return Object.assign({ cat: D.catOf(q.seg, q.ptype), status: 'aktivan', ver: 1 }, q, { id: nextId() }); }
    if (mode === 'copy') return Object.assign({}, src, { id: nextId(), name: src.name + ' 2027', gname: { sr: IH.L(src.gname) + ' 2027', en: IH.L(src.gname) + ' 2027' }, codes: [src.codes[0] + '-27'], from: '2027-01-01', ver: 1, status: 'aktivan' });
    return src;
  }
  function formPage(mode, srcId) {
    var q = draftFor(mode, srcId);
    if (IH.form._prodFor !== mode + '|' + (srcId || '') + '|' + q.id) IH.form = { _prodFor: mode + '|' + (srcId || '') + '|' + q.id };
    var title = mode === 'new' ? t('k.formNew') : mode === 'copy' ? t('k.formCopy') + ' · ' + IH.esc(D.productName(srcId)) : t('k.formEdit') + ' · ' + IH.esc(D.productName(srcId));
    var h = ui.header(title, '', '', '<a href="#/katalog">' + t('k.title') + '</a> ' + ic('chevr') + ' ' + (srcId ? '<a href="#/katalog/' + srcId + '">' + IH.esc(D.productName(srcId)) + '</a> ' + ic('chevr') + ' ' : '') + (mode === 'edit' ? t('c.edit') : t('c.new')));
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('c.cancel'), { go: srcId ? 'katalog/' + srcId : 'katalog' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'prod-save', arg: mode + '|' + (srcId || '') + '|' + q.id }) + '</div>';
    return h + '<section class="card"><div class="cb">' + formHtml(q, mode) + '</div>' + foot + '</section>';
  }
  function readForm(q) {
    var v = ui.formValues(fields(q, 'edit').concat(attrFields(q)).concat(extraFields(q)));
    var out = { name: v.p_name || q.name, gname: { sr: v.p_gname || IH.L(q.gname), en: v.p_gname || IH.L(q.gname) }, seg: v.p_seg || q.seg, ptype: v.p_pt || q.ptype, sub: v.p_sub ? { sr: v.p_sub, en: v.p_sub } : q.sub, status: v.p_status || q.status, unit: v.x_unit || q.unit, codes: String(v.x_codes || q.codes.join(',')).split(',').map(function (s) { return s.trim(); }).filter(Boolean), attrs: {} };
    out.cat = D.catOf(out.seg, out.ptype);
    D.attrDefs.forEach(function (a) { var x = v['a_' + a.k]; if (x) out.attrs[a.k] = { sr: x, en: x }; else if (q.attrs && q.attrs[a.k] != null) out.attrs[a.k] = q.attrs[a.k]; });
    return out;
  }
  IH.act['prod-new'] = function () { IH.form = {}; IH.go('katalog/novi'); };
  IH.act['prod-save'] = function (el) {
    var a = el.dataset.arg.split('|'), mode = a[0], src = a[1], id = a[2];
    if (mode === 'edit') {
      var p = D.product(src), nv = p.ver + 1, ch = readForm(p);
      IH.map('prodEdits')[src] = Object.assign({}, IH.map('prodEdits')[src], ch, { ver: nv, from: '2026-11-01' });
      IH.audit('product', src, { sr: 'Nova verzija v' + nv, en: 'New version v' + nv }, { sr: (IH.form.p_reason || 'Usklađivanje sa novim katalogom banke') + ' · važi od 01.11.2026.', en: (IH.form.p_reason || 'Alignment with the new bank catalogue') + ' · valid from Nov 1, 2026' });
      codeStats = null; IH.form = {}; IH.go('katalog'); IH.toast(t('k.updated', { p: IH.esc(D.productName(src)), v: nv }));
      return;
    }
    var q = draftFor(mode, src), rec = Object.assign({}, q, readForm(q), { id: id, ver: 1, isNew: true, createdAt: IH.now(), copyOf: mode === 'copy' ? src : undefined });
    IH.list('newProducts').push(rec);
    IH.audit('product', id, mode === 'copy' ? { sr: 'Kreiran kopiranjem proizvoda ' + D.productName(src), en: 'Created as a copy of ' + D.productName(src) } : { sr: 'Kreiran proizvod', en: 'Product created' }, null);
    codeStats = null; IH.form = {}; IH.go('katalog'); IH.toast(t('k.created', { p: IH.esc(rec.name) }));
  };

  /* ---------- mapiranje šifara ---------- */
  function mapRowsData() {
    var mapped = IH.map('mapped'), rows = [];
    D.unmappedCodes.forEach(function (u) { var s2 = stats()[u.code] || { n: 0, first: u.first }; var m = mapped[u.code]; rows.push({ code: u.code, desc: IH.L(u.desc), prod: m ? m.product : null, first: s2.first, n: s2.n, open: !m, unm: true }); });
    IH.products().forEach(function (p) { p.codes.forEach(function (c) { var s3 = stats()[c] || { n: 0, first: p.from }; rows.push({ code: c, desc: D.productName(p), prod: p.id, first: s3.first || p.from, n: s3.n || 0, open: false }); }); });
    return rows;
  }
  function mapPage() {
    var v = IH.v('kat-m'); if (!v.f) v.f = { st: 'open' };
    var grid = IH.grid({
      id: 'kat-m', exportName: 'Mapiranje_sifara.xlsx', searchLabel: t('k.colSrcCode'),
      rows: mapRowsData, key: function (r) { return r.code; }, label: function (r) { return r.code; }, searchKeys: ['code', 'desc', 'prod'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (r) { return r.open ? 0 : 1; }, fval: function (r) { return r.open ? 'open' : 'done'; }, render: function (r) { return r.open ? ui.pill(t('k.waiting'), 'warning') : ui.pill(t('k.mapped'), 'success'); }, filter: function () { return [{ v: 'open', l: t('k.waiting') }, { v: 'done', l: t('k.mapped') }]; } },
        { key: 'code', label: t('k.colSrcCode'), val: function (r) { return r.code; } },
        { key: 'desc', label: t('k.codeDesc'), nw: false, val: function (r) { return r.desc; } },
        { key: 'prod', label: t('k.mapProd'), val: function (r) { return r.prod ? D.productName(r.prod) : ''; }, render: function (r) { return r.prod ? '<b>' + IH.esc(D.productName(r.prod)) + '</b>' : '<span class="mut">—</span>'; } },
        { key: 'seg', label: t('k.colSeg'), val: function (r) { return r.prod ? D.segName(D.product(r.prod).seg) : ''; }, fval: function (r) { return r.prod ? D.product(r.prod).seg : ''; }, filter: function () { return D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'pt', label: t('k.colPt'), val: function (r) { return r.prod ? D.ptypeName(D.product(r.prod).ptype) : ''; }, fval: function (r) { return r.prod ? D.product(r.prod).ptype : ''; }, filter: function () { return D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'first', label: t('k.colFirst'), val: function (r) { return r.first; }, render: function (r) { return F.date(r.first); } },
        { key: 'n', label: t('k.colItems'), num: true, search: false, val: function (r) { return r.n; } }
      ],
      actions: [
        { type: 'map', title: t('k.mapBtn'), act: 'map-open', kind: 'acc', show: function (r) { return !!r.unm; } },
        { type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (r) { return 'katalog/' + r.prod; }, show: function (r) { return !!r.prod; } },
        { type: 'history', title: t('g.aHistory'), act: 'map-hist' }
      ]
    });
    return header() + tabsHtml('mapiranje') + grid;
  }
  IH.act['map-hist'] = function (el) { var m = IH.map('mapped')[el.dataset.arg]; IH.showHistory(el.dataset.arg, m ? [{ at: m.at, by: m.by, action: { sr: 'Mapirano na ' + D.productName(m.product), en: 'Mapped to ' + D.productName(m.product) } }] : [{ at: '2023-02-01T09:00', by: 'A001', action: { sr: 'Šifra uvedena', en: 'Code introduced' } }]); };
  IH.act['map-open'] = function (el) {
    var code = el.dataset.arg, u = D.unmappedCodes.filter(function (x) { return x.code === code; })[0], s = stats()[code] || { n: 0, unmCur: 0, unmClosed: 0, first: u.first };
    IH.form = {};
    var opts = IH.products().filter(function (p) { return p.status === 'aktivan'; }).map(function (p) { return { v: p.id, l: D.productName(p) + ' · ' + D.segName(p.seg) }; });
    var eff = [];
    if (s.unmCur) eff.push({ label: t('k.mapEffNow', { n: s.unmCur }) });
    if (s.unmClosed) eff.push({ label: t('k.mapEffClosed', { n: s.unmClosed }), state: 'warn' });
    IH.modal({
      title: t('k.mapTitle', { c: code }),
      body: '<div class="kv" style="margin-bottom:16px"><dt>' + t('k.codeDesc') + '</dt><dd>' + IH.esc(IH.L(u.desc)) + '</dd><dt>' + t('k.colFirst') + '</dt><dd>' + F.date(s.first) + '</dd><dt>' + t('k.colItems') + '</dt><dd>' + s.n + '</dd></div>' +
        '<div class="form-grid">' + ui.field('m_prod', t('k.mapProd'), u.suggest, { options: opts, full: true }) + ui.field('m_from', t('k.mapFrom'), F.date(u.first), {}) + '</div>' +
        '<div class="lab" style="margin-top:6px">' + t('k.mapEffect') + '</div>' + ui.checks(eff),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.confirm'), { cls: 'primary', icon: 'check', act: 'map-save', arg: code })
    });
  };
  IH.act['map-save'] = function (el) {
    var code = el.dataset.arg, u = D.unmappedCodes.filter(function (x) { return x.code === code; })[0];
    var sel = document.getElementById('fld-m_prod'), pid = sel ? sel.value : u.suggest;
    var s = stats()[code] || { n: 0 };
    IH.map('mapped')[code] = { product: pid, at: IH.now(), by: IH.me().id };
    IH.audit('product', pid, { sr: 'Mapirana šifra ' + code, en: 'Code ' + code + ' mapped' }, { sr: s.n + ' prodaja povezano sa proizvodom', en: s.n + ' sales linked to the product' });
    EN.invalidate(); IH.save(); IH.closeModal(); IH.render();
    IH.toast(t('k.mapDone', { c: code, p: IH.esc(D.productName(pid)), n: s.n }));
  };

  /* ---------- uvoz iz Excela (3 koraka) ---------- */
  var IMP = [
    { r: 2, a: 'new', n: L('Kredit za energetsku efikasnost – preduzetnici', 'Energy efficiency loan – entrepreneurs'), ch: L('Preduzetnici · Krediti · PR-EE-60', 'Entrepreneurs · Loans · PR-EE-60'), res: 'ok' },
    { r: 3, a: 'new', n: L('Mastercard Gold Business debitna kartica', 'Mastercard Gold Business debit card'), ch: L('Preduzetnici · Kartice · BC-MGB-01', 'Entrepreneurs · Cards · BC-MGB-01'), res: 'ok' },
    { r: 4, a: 'edit', n: L('Gotovinski kredit u RSD bez osiguranja', 'RSD cash loan without insurance'), ch: L('Šifre: + KK-RSD-84', 'Codes: + KK-RSD-84'), old: 'KK-RSD-36, KK-RSD-60', res: 'ok', id: 'P17' },
    { r: 5, a: 'edit', n: L('Paket račun Pro Gold', 'Pro Gold package account'), ch: L('Šifre: + PRO-GLD-02', 'Codes: + PRO-GLD-02'), old: 'PRO-GLD-01', res: 'ok', id: 'P29' },
    { r: 6, a: 'edit', n: L('Dozvoljeno prekoračenje', 'Overdraft'), ch: L('Vrsta: Krediti', 'Type: Loans'), res: 'skip', id: 'P27' },
    { r: 7, a: 'err', n: L('Lizing vozila – preporuka', 'Vehicle leasing – referral'), ch: L('Vrsta proizvoda: Lizing', 'Product type: Leasing'), res: 'err' }
  ];
  function importPage(step) {
    var cur = Math.max(0, Math.min(2, (+step || 1) - 1));
    var steps = [{ label: t('k.impS1') }, { label: t('k.impS2') }, { label: t('k.impS3') }];
    var body;
    var loaded = IH.v('imp').file;
    if (cur === 0) {
      body = (loaded ? '<div class="filechip">' + ic('file') + '<div style="flex:1"><b>' + t('k.impFile') + '</b><div class="hint" style="margin:0">' + t('k.impRead') + '</div></div>' + ic('checkc') + '</div>'
        : '<div class="drop">' + ic('upload') + '<div>' + t('c.dropFile') + '</div><div style="margin-top:10px">' + ui.btn(t('c.chooseFile'), { cls: 'primary', act: 'imp-file' }) + '</div></div>') +
        '<div style="margin-top:12px">' + ui.btn(t('k.impTemplate'), { cls: 'ghost sm', icon: 'download', act: 'export', arg: 'Sablon_katalog.xlsx' }) + '</div>';
    } else if (cur === 1) {
      var cnt = { n: 0, e: 0, skip: 0, err: 0 };
      IMP.forEach(function (x) { if (x.res === 'ok' && x.a === 'new') cnt.n++; if (x.res === 'ok' && x.a === 'edit') cnt.e++; if (x.res === 'skip') cnt.skip++; if (x.res === 'err') cnt.err++; });
      body = '<div class="note">' + t('k.impSum', { a: cnt.n, b: cnt.e, c: cnt.skip, d: cnt.err }) + '</div>' + ui.table([{ key: 'r', label: t('k.impRow'), num: true }, { key: 'a', label: t('k.impAction') }, { key: 'n', label: t('k.colProd') }, { key: 'ch', label: t('k.impChange') }, { key: 'res', label: t('k.impRes') }],
        IMP.map(function (x) {
          return {
            r: x.r, a: ui.pill(t({ new: 'k.aNew', edit: 'k.aEdit', err: 'k.aErr' }[x.a] || 'k.aEdit'), { new: 'accent', edit: 'info', err: 'danger' }[x.a]), n: IH.esc(IH.L(x.n)),
            ch: IH.esc(IH.L(x.ch)) + (x.res === 'err' ? ' <span style="color:var(--danger)">· ' + t('k.impErr') + '</span>' : x.res === 'skip' ? ' <span class="mut">· ' + t('k.impNoChange') + '</span>' : ''),
            res: x.res === 'ok' ? ui.pill(t('k.rOk'), 'success') : x.res === 'skip' ? ui.pill(t('k.rSkip'), 'gray') : ui.pill(t('k.rErr'), 'danger')
          };
        }), { compact: true });
    } else {
      var n = IMP.filter(function (x) { return x.res === 'ok'; }).length;
      body = ui.checks([
        { label: IH.L({ sr: 'Struktura fajla i obavezne kolone', en: 'File structure and mandatory columns' }) },
        { label: IH.L({ sr: 'Grupe klijenata i vrste proizvoda postoje', en: 'Client groups and product types exist' }), state: 'warn', sub: t('k.impErr') + ' (red 7)' },
        { label: IH.L({ sr: 'Šifre iz core sistema nisu već dodeljene drugom proizvodu', en: 'Core codes are not assigned to another product' }) },
        { label: IH.L({ sr: 'Izmene važe od 01.11.2026. — obračuni Q3 se ne menjaju', en: 'Changes valid from Nov 1, 2026 — Q3 calculations do not change' }) }
      ]) + '<div class="hr"></div><div class="big-amt">' + n + '<span class="u">' + IH.L({ sr: 'redova za primenu', en: 'rows to apply' }) + '</span></div>';
    }
    var foot = '<div class="wz-foot"><span class="left">' + t('wz.step', { a: cur + 1, b: 3 }) + '</span>' + ui.btn(t('c.cancel'), { go: 'katalog' }) + (cur > 0 ? ui.btn(t('c.back'), { icon: 'chevl', go: 'katalog/uvoz/' + cur }) : '') +
      (cur < 2 ? ui.btn(t('c.next'), { cls: 'primary', icon: 'arrow', go: 'katalog/uvoz/' + (cur + 2) }).replace('data-go', loaded || cur > 0 ? 'data-go' : 'disabled data-x') : ui.btn(t('k.impConfirm', { n: IMP.filter(function (x) { return x.res === 'ok'; }).length }), { cls: 'primary', icon: 'check', act: 'imp-apply' })) + '</div>';
    var head = '<div class="pstep">' + steps.map(function (s, i) { return (i ? '<span class="sep">' + ic('chevr') + '</span>' : '') + '<span class="ps ' + (i < cur ? 'done' : i === cur ? 'on' : '') + '"><span class="pn">' + (i < cur ? '✓' : i + 1) + '</span>' + s.label + '</span>'; }).join('') + '</div>';
    return ui.header(t('k.impTitle'), '', '', '<a href="#/katalog">' + t('k.title') + '</a> ' + ic('chevr') + ' ' + t('c.import')) + head + '<section class="card"><div class="ch"><h2>' + (cur + 1) + '. ' + steps[cur].label + '</h2></div><div class="cb">' + body + '</div>' + foot + '</section>';
  }
  IH.act['imp-file'] = function () { IH.v('imp').file = true; IH.render(); };
  IH.act['imp-apply'] = function () {
    var np = IH.list('newProducts');
    if (!np.some(function (p) { return p.copyOf === 'import'; })) {
      var id1 = nextId();
      np.push({ id: id1, name: 'Kredit za energetsku efikasnost – preduzetnici', gname: L('Kredit za energetsku efikasnost – preduzetnici', 'Energy efficiency loan – entrepreneurs'), seg: 'PR', ptype: 'kredit', cat: 'PR-KRD', sub: L('Investicioni', 'Investment'), unit: 'RSD', codes: ['PR-EE-60'], from: '2026-11-01', ver: 1, status: 'aktivan', isNew: true, createdAt: IH.now(), copyOf: 'import', attrs: { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('Do 60 meseci', 'Up to 60 months') }, w: 3, amt: [1000000, 5000000] });
      np.push({ id: 'P' + (+id1.slice(1) + 1), name: 'Mastercard Gold Business debitna kartica', gname: L('Mastercard Gold Business debitna kartica', 'Mastercard Gold Business debit card'), seg: 'PR', ptype: 'kartica', cat: 'PR-KRT', sub: L('Debitna', 'Debit'), unit: 'kom', codes: ['BC-MGB-01'], from: '2026-11-01', ver: 1, status: 'aktivan', isNew: true, createdAt: IH.now(), copyOf: 'import', attrs: { valuta: L('RSD / EUR', 'RSD / EUR'), rok: L('5 godina', '5 years') }, w: 5 });
      var e = IH.map('prodEdits');
      e.P17 = Object.assign({}, e.P17, { codes: ['KK-RSD-36', 'KK-RSD-60', 'KK-RSD-84'], ver: 3 });
      e.P29 = Object.assign({}, e.P29, { codes: ['PRO-GLD-01', 'PRO-GLD-02'], ver: 3 });
      ['P17', 'P29'].forEach(function (id) { IH.audit('product', id, { sr: 'Izmena kroz uvoz iz Excela', en: 'Changed by Excel import' }, { sr: 'Katalog_izmene_2026-10.xlsx', en: 'Katalog_izmene_2026-10.xlsx' }); });
      IH.audit('catalog', 'import', { sr: 'Uvoz kataloga: 4 reda primenjena, 1 odbijen', en: 'Catalogue import: 4 rows applied, 1 rejected' });
    }
    IH.v('imp').file = false; codeStats = null;
    IH.go('katalog'); IH.toast(t('k.impDone', { n: 4 }));
  };

  IH.route('katalog', {
    title: function () { return t('k.title'); },
    render: function (p) {
      var a = p[0];
      if (!a) return listPage();
      if (a === 'mapiranje') return mapPage();
      if (a === 'bodovi') return IH.pointsPage(p.slice(1));
      if (a === 'uvoz') return importPage(p[1]);
      if (a === 'novi') return formPage('new');
      if (a === 'kopija') return formPage('copy', p[1]);
      if (a === 'izmena') return formPage('edit', p[1]);
      return detailPage(a);
    }
  });
})();
