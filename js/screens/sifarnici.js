/* Incentive Hub — Šifarnici (Administrator): master tabela šifarnika → stavke šifarnika (DEX standard tabelarnog ekrana) */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, R = IH.rules, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;

  IH.addStrings({
    's.title': 'Šifarnici', 's.desc': 'Parametri koje administrator održava, a koje targeti, šeme i procesi koriste. Svaki šifarnik ima stavke; stavka koja se koristi ne može da se obriše, samo da se deaktivira.',
    's.colName': 'Naziv', 's.colCode': 'Kod', 's.colDesc': 'Opis', 's.colItems': 'Stavki', 's.colStatus': 'Status', 's.colUsed': 'Koristi se', 's.newCl': 'Kreiraj novi šifarnik', 's.newItem': 'Kreiraj novu stavku',
    's.items': 'Stavke šifarnika', 's.back': 'Šifarnici', 's.clSaved': 'Šifarnik {c} je kreiran', 's.itemSaved': 'Stavka {c} je sačuvana', 's.edited': 'Izmene su sačuvane',
    's.clHasItems': 'Šifarnik ima {n} stavki — ne može da se obriše. Deaktivacijom se sakriva iz izbora u formama.', 's.inCatalog': 'Stavke ovog šifarnika održavaju se u Katalogu proizvoda',
    's.colType': 'Tip', 's.colSrc': 'Polje u feed-u', 's.colBasis': 'Osnova datuma', 's.colValues': 'Vrednosti', 's.colPreset': 'Podrazumevani parametri', 's.colEff': 'Vrsta uslova', 's.colSign': 'Smer', 's.colDef': 'Podrazumevano ulazi',
    's.colLen': 'Trajanje', 's.colCutoff': 'Cut-off (dana)', 's.colConsent': 'Rok za saglasnost (dana)', 's.colFrom': 'Od', 's.colTo': 'Do', 's.colPerSt': 'Stanje', 's.colUnit': 'Jedinica', 's.colScheme': 'Šema',
    's.colRule': 'Pravilo', 's.colDef': 'Šta znači', 's.colPt': 'Vrsta proizvoda', 's.fCheck': 'Provera', 's.fData': 'Podatak o prodaji', 's.fVal': 'Vrednost', 's.fWin': 'Rok (dana)',
    's.colWage': 'Šifra vrste primanja', 's.colTax': 'Poreski tretman', 's.colReqDoc': 'Obavezan prilog', 's.colGroup': 'Grupa', 's.colProducts': 'Proizvoda',
    's.attrHint': 'Posle dodavanja atributa, DWH feed mora da popunjava ovo polje. Dok se ne popunjava, uslovi nad njim ne prolaze.'
  }, {
    's.title': 'Code lists', 's.desc': 'Parameters maintained by the administrator and used by targets, schemes and processes. Each code list has items; an item in use cannot be deleted, only deactivated.',
    's.colName': 'Name', 's.colCode': 'Code', 's.colDesc': 'Description', 's.colItems': 'Items', 's.colStatus': 'Status', 's.colUsed': 'Used', 's.newCl': 'Create new code list', 's.newItem': 'Create new item',
    's.items': 'Code list items', 's.back': 'Code lists', 's.clSaved': 'Code list {c} created', 's.itemSaved': 'Item {c} saved', 's.edited': 'Changes saved',
    's.clHasItems': 'The code list has {n} items — it cannot be deleted. Deactivation hides it from form choices.', 's.inCatalog': 'Items of this code list are maintained in the Product catalogue',
    's.colType': 'Type', 's.colSrc': 'Feed field', 's.colBasis': 'Date basis', 's.colValues': 'Values', 's.colPreset': 'Default parameters', 's.colEff': 'Condition type', 's.colSign': 'Sign', 's.colDef': 'Counts by default',
    's.colLen': 'Length', 's.colCutoff': 'Cut-off (days)', 's.colConsent': 'Consent deadline (days)', 's.colFrom': 'From', 's.colTo': 'To', 's.colPerSt': 'State', 's.colUnit': 'Unit', 's.colScheme': 'Scheme',
    's.colRule': 'Rule', 's.colDef': 'What it means', 's.colPt': 'Product type', 's.fCheck': 'Check', 's.fData': 'Sale data', 's.fVal': 'Value', 's.fWin': 'Window (days)',
    's.colWage': 'Earnings type code', 's.colTax': 'Tax treatment', 's.colReqDoc': 'Attachment required', 's.colGroup': 'Group', 's.colProducts': 'Products',
    's.attrHint': 'After adding an attribute, the DWH feed must populate the field. Until it does, conditions on it do not pass.'
  });

  /* ---------- stanje (aktivno/obrisano) ---------- */
  function st() { return IH.map('cl'); }
  function itemOn(code, id) { var x = st()[code + '|' + id]; return x == null ? true : !!x; }
  function delMap() { return IH.map('clDel'); }
  function clOn(code) { var x = IH.map('clStatus')[code]; return x == null ? true : !!x; }
  function pill(c) { return '<span class="pill p-' + R.effects[c.effect].pill + '">' + IH.L(R.effects[c.effect]) + '</span>'; }
  function usedTargets(fn) { return IH.targets().filter(fn).length; }

  /* ---------- definicije šifarnika ---------- */
  var REASONS = {
    RAZLOG_IZUZETKA: [
      { id: 'PREMESTAJ', name: { sr: 'Premeštaj u toku perioda', en: 'Transfer during the period' }, doc: false },
      { id: 'NOVO_ZAPOSLENJE', name: { sr: 'Zaposlenje u toku perioda', en: 'Hired during the period' }, doc: false },
      { id: 'BOLOVANJE', name: { sr: 'Duže odsustvo (bolovanje, porodiljsko)', en: 'Long absence (sick, parental leave)' }, doc: true },
      { id: 'PROMENA_POZICIJE', name: { sr: 'Promena pozicije', en: 'Position change' }, doc: false },
      { id: 'NOVA_EKSPOZITURA', name: { sr: 'Otvaranje nove ekspoziture', en: 'New branch opening' }, doc: false }
    ],
    RAZLOG_KOREKCIJE: [
      { id: 'NEMAPIRANA_SIFRA', name: { sr: 'Stavka sa nemapiranom šifrom', en: 'Item with unmapped code' }, doc: false },
      { id: 'POGRESAN_PRODAVAC', name: { sr: 'Stavka pripisana pogrešnom prodavcu', en: 'Item attributed to the wrong seller' }, doc: true },
      { id: 'KASNI_PODACI', name: { sr: 'Podaci stigli posle zaključavanja', en: 'Data arrived after lock' }, doc: false },
      { id: 'USVOJEN_PRIGOVOR', name: { sr: 'Usvojen prigovor zaposlenog', en: 'Employee complaint accepted' }, doc: true },
      { id: 'GRESKA_U_IZVORU', name: { sr: 'Greška u izvornom sistemu', en: 'Error in source system' }, doc: true }
    ],
    RAZLOG_PRESTANKA: [
      { id: 'ODLAZAK', name: { sr: 'Odlazak iz banke', en: 'Leaving the bank' }, doc: true },
      { id: 'PROMENA_POZICIJE', name: { sr: 'Promena pozicije', en: 'Position change' }, doc: false },
      { id: 'PREMESTAJ', name: { sr: 'Premeštaj u drugu ekspozituru', en: 'Transfer to another branch' }, doc: false },
      { id: 'NOVA_SEMA', name: { sr: 'Prelazak na drugu šemu', en: 'Move to another scheme' }, doc: false }
    ],
    RAZLOG_VRACANJA: [
      { id: 'POGRESNA_VREDNOST', name: { sr: 'Pogrešna vrednost targeta ili izuzetka', en: 'Wrong target or exception value' }, doc: false },
      { id: 'POGRESAN_PERIOD', name: { sr: 'Pogrešan period važenja', en: 'Wrong validity period' }, doc: false },
      { id: 'NEDOSTAJE_PRILOG', name: { sr: 'Nedostaje prilog', en: 'Attachment missing' }, doc: false },
      { id: 'POGRESNA_SEMA', name: { sr: 'Pogrešna šema za poziciju', en: 'Wrong scheme for the position' }, doc: false }
    ],
    RAZLOG_PRIGOVORA: [
      { id: 'STAVKA_NEDOSTAJE', name: { sr: 'Prodaja nije uračunata', en: 'Sale not counted' }, doc: true },
      { id: 'POGRESAN_PERIOD', name: { sr: 'Stavka u pogrešnom periodu', en: 'Item in the wrong period' }, doc: true },
      { id: 'POGRESAN_IZNOS', name: { sr: 'Pogrešan iznos ili vrednost', en: 'Wrong amount or value' }, doc: true },
      { id: 'TARGET', name: { sr: 'Primedba na target', en: 'Objection to target' }, doc: false },
      { id: 'OSTALO', name: { sr: 'Ostalo', en: 'Other' }, doc: true }
    ]
  };
  var WAGE = [
    { id: 'BON_PROD', name: { sr: 'Bonus za prodaju', en: 'Sales bonus' }, wage: 'Z-310', tax: { sr: 'Zarada (porez + doprinosi)', en: 'Salary (tax + contributions)' } },
    { id: 'BON_TIM', name: { sr: 'Timski bonus', en: 'Team bonus' }, wage: 'Z-311', tax: { sr: 'Zarada (porez + doprinosi)', en: 'Salary (tax + contributions)' } },
    { id: 'BON_KOR', name: { sr: 'Korekcija bonusa iz prethodnog perioda', en: 'Bonus correction from previous period' }, wage: 'Z-319', tax: { sr: 'Zarada (porez + doprinosi)', en: 'Salary (tax + contributions)' } }
  ];

  function defs() { return [
    {
      code: 'ATRIBUT_STAVKE', name: { sr: 'Atributi stavke', en: 'Item attributes' }, desc: { sr: 'Rečnik polja koja DWH feed donosi uz svaku prodajnu stavku; osnova za uslove priznavanja', en: 'Dictionary of fields the DWH feed delivers with each sales item; basis for recognition conditions' },
      items: function () { return R.allAttrs().map(function (a) { return { id: a.id, name: a.name, a: a }; }); },
      cols: [
        { key: 'type', label: t('s.colType'), val: function (r) { return IH.L(R.types[r.a.type]); }, filter: function () { return Object.keys(R.types).map(function (k) { return { v: IH.L(R.types[k]), l: IH.L(R.types[k]) }; }); } },
        { key: 'basis', label: t('s.colBasis'), val: function (r) { return r.a.basis ? t('c.yes') : t('c.no'); }, render: function (r) { return r.a.basis ? ui.pill(t('c.yes'), 'accent') : '<span class="mut">—</span>'; }, filter: function () { return [{ v: t('c.yes'), l: t('c.yes') }, { v: t('c.no'), l: t('c.no') }]; } },
        { key: 'values', label: t('s.colValues'), sort: false, nw: false, val: function (r) { return (r.a.values || []).map(function (x) { return IH.L(x.l); }).join(', '); }, render: function (r) { return r.a.values ? r.a.values.map(function (x) { return '<span class="tag">' + IH.esc(IH.L(x.l)) + '</span>'; }).join('') : r.a.type === 'bool' ? t('c.yes') + ' / ' + t('c.no') : '<span class="mut">—</span>'; } }
      ],
      used: function (r) { return usedTargets(function (x) { return (x.conds || []).some(function (c) { return c.attr === r.id; }) || (x.formula && x.formula.basis === r.id); }); },
      create: 'attr-item-new'
    },
    {
      code: 'SABLON_USLOVA', name: { sr: 'Šabloni uslova', en: 'Condition templates' }, desc: { sr: 'Uslovi priznavanja prodaje koje administrator bira u targetu: rečenica, definicija i posledica', en: 'Sale recognition conditions the administrator picks in a target: sentence, definition and consequence' },
      items: function () { return R.allTemplates().map(function (x) { return { id: x.id, name: x.name, tpl: x }; }); },
      cols: [
        { key: 'preset', label: t('s.colRule'), val: function (r) { return R.condText(Object.assign({ tpl: r.id }, r.tpl.c)); }, render: function (r) { var x = R.condText(Object.assign({ tpl: r.id }, r.tpl.c)); return '<span class="cell-clip" title="' + IH.esc(x) + '">' + IH.esc(x) + '</span>'; } },
        { key: 'def', label: t('s.colDef'), val: function (r) { return r.tpl.def ? IH.L(r.tpl.def) : ''; }, render: function (r) { var x = r.tpl.def ? IH.L(r.tpl.def) : ''; return x ? '<span class="cell-clip" title="' + IH.esc(x) + '">' + IH.esc(x) + '</span>' : '<span class="mut">—</span>'; } },
        { key: 'pt', label: t('s.colPt'), val: function (r) { return r.tpl.pt ? r.tpl.pt.map(D.ptypeName).join(', ') : IH.L({ sr: 'Sve', en: 'All' }); } },
        { key: 'eff', label: t('s.colEff'), val: function (r) { return IH.L(R.effects[r.tpl.c.effect]); }, render: function (r) { return pill(r.tpl.c); }, filter: function () { return Object.keys(R.effects).map(function (k) { return { v: IH.L(R.effects[k]), l: IH.L(R.effects[k]) }; }); } }
      ],
      used: function (r) { return usedTargets(function (x) { return (x.conds || []).some(function (c) { return c.tpl === r.id; }); }); },
      create: 'tpl-new'
    },
    {
      code: 'TIP_STAVKE', name: { sr: 'Tipovi stavki', en: 'Item types' }, desc: { sr: 'Vrsta prodajne stavke iz feed-a: smer (+/−) i da li podrazumevano ulazi u ostvarenje', en: 'Sales item kind from the feed: sign (+/−) and whether it counts by default' },
      items: function () { return R.itemTypes.concat(IH.list('newItemTypes')).map(function (x) { return { id: x.id, name: x.name, desc: x.d, ty: x }; }); },
      cols: [
        { key: 'sign', label: t('s.colSign'), val: function (r) { return r.ty.sign; }, render: function (r) { return r.ty.sign === '+' ? ui.pill('+', 'success') : ui.pill('−', 'danger'); } },
        { key: 'def', label: t('s.colDef'), val: function (r) { return r.ty.def ? t('c.yes') : t('c.no'); } }
      ],
      used: function (r) { return usedTargets(function (x) { return (x.counted || []).indexOf(r.id) >= 0; }); },
      create: 'type-new'
    },
    {
      code: 'MERA', name: { sr: 'Mere', en: 'Measures' }, desc: { sr: 'Polje koje se agregira u formuli merenja targeta', en: 'Field aggregated in the target measurement formula' },
      items: function () { return R.measures.map(function (m) { return { id: m.id, name: m.name, m: m }; }); },
      cols: [{ key: 'unit', label: t('s.colUnit'), val: function (r) { return r.m.unit; } }],
      used: function (r) { return usedTargets(function (x) { return x.formula && x.formula.measure === r.id; }); }
    },
    {
      code: 'JEDINICA', name: { sr: 'Jedinice', en: 'Units' }, desc: { sr: 'Način izražavanja ciljne vrednosti targeta', en: 'How a target value is expressed' },
      items: function () { return R.units.map(function (u) { return { id: u.id, name: u.name }; }); }, cols: [],
      used: function (r) { return usedTargets(function (x) { return x.unit === r.id; }); }
    },
    {
      code: 'AGREGACIJA', name: { sr: 'Agregacije', en: 'Aggregations' }, desc: { sr: 'Funkcija nad merom u formuli merenja', en: 'Function over the measure in the measurement formula' },
      items: function () { return Object.keys(R.aggs).map(function (k) { return { id: k, name: R.aggs[k] }; }); }, cols: [],
      used: function (r) { return usedTargets(function (x) { return x.formula && x.formula.agg === r.id; }); }
    },
    {
      code: 'SEGMENT', name: { sr: 'Grupe klijenata', en: 'Client groups' }, desc: { sr: 'Grupa klijenata kojoj proizvod pripada', en: 'Client group a product belongs to' },
      items: function () { return D.segments.map(function (s) { return { id: s.id, name: s.name, seg: s.id }; }); },
      cols: [{ key: 'np', label: t('s.colProducts'), num: true, val: function (r) { return IH.products().filter(function (p) { return p.seg === r.seg; }).length; } }],
      used: function (r) { return IH.products().filter(function (p) { return p.seg === r.seg; }).length; }
    },
    {
      code: 'POZICIJA', name: { sr: 'Pozicije', en: 'Positions' }, desc: { sr: 'Radna mesta iz HR sistema i podrazumevana bonus šema', en: 'Job positions from HR and the default bonus scheme' },
      items: function () { return Object.keys(D.positions).map(function (k) { return { id: k.toUpperCase(), name: D.positions[k].name, pos: D.positions[k], k: k }; }); },
      cols: [{ key: 'sch', label: t('s.colScheme'), val: function (r) { return r.pos.scheme ? D.scheme(r.pos.scheme).code : '—'; } }],
      used: function (r) { return D.employees.filter(function (e) { return e.pos === r.k; }).length; }
    },
    {
      code: 'RAZLOG_IZUZETKA', name: { sr: 'Razlozi izuzetka u rasporedu', en: 'Assignment exception reasons' }, desc: { sr: 'Šifrirani razlozi za odstupanje targeta pojedinca od šeme', en: 'Coded reasons for an individual target deviating from the scheme' },
      items: function () { return REASONS.RAZLOG_IZUZETKA.concat(IH.list('newReasons').filter(function (x) { return x.cl === 'RAZLOG_IZUZETKA'; })).map(function (x) { return { id: x.id, name: x.name, x: x }; }); },
      cols: [{ key: 'doc', label: t('s.colReqDoc'), val: function (r) { return r.x.doc ? t('c.yes') : t('c.no'); } }],
      used: function (r) { return r.id === 'PREMESTAJ' ? 1 : 0; }
    },
    {
      code: 'RAZLOG_PRESTANKA', name: { sr: 'Razlozi prestanka rasporeda', en: 'Assignment end reasons' }, desc: { sr: 'Šifrirani razlozi kada se zaposlenom ukida raspoređena šema', en: 'Coded reasons when an employee scheme assignment ends' },
      items: function () { return REASONS.RAZLOG_PRESTANKA.map(function (x) { return { id: x.id, name: x.name, x: x }; }); },
      cols: [{ key: 'doc', label: t('s.colReqDoc'), val: function (r) { return r.x.doc ? t('c.yes') : t('c.no'); } }],
      used: function () { return 0; }
    },
    {
      code: 'RAZLOG_VRACANJA', name: { sr: 'Razlozi vraćanja rasporeda na doradu', en: 'Assignment return reasons' }, desc: { sr: 'Šifrirani razlozi kada menadžer vrati raspored administratoru', en: 'Coded reasons when a manager returns an assignment to the administrator' },
      items: function () { return REASONS.RAZLOG_VRACANJA.map(function (x) { return { id: x.id, name: x.name, x: x }; }); },
      cols: [],
      used: function () { return 0; }
    },
    {
      code: 'RAZLOG_KOREKCIJE', name: { sr: 'Razlozi korekcija', en: 'Correction reasons' }, desc: { sr: 'Šifrirani razlozi za ručnu korekciju ostvarenja ili bonusa', en: 'Coded reasons for manual achievement or bonus corrections' },
      items: function () { return REASONS.RAZLOG_KOREKCIJE.map(function (x) { return { id: x.id, name: x.name, x: x }; }); },
      cols: [{ key: 'doc', label: t('s.colReqDoc'), val: function (r) { return r.x.doc ? t('c.yes') : t('c.no'); } }],
      used: function () { return 0; }
    },
    {
      code: 'RAZLOG_PRIGOVORA', name: { sr: 'Razlozi prigovora', en: 'Complaint reasons' }, desc: { sr: 'Kategorije prigovora zaposlenog na obračun', en: 'Categories of employee complaints on a statement' },
      items: function () { return REASONS.RAZLOG_PRIGOVORA.map(function (x) { return { id: x.id, name: x.name, x: x }; }); },
      cols: [{ key: 'doc', label: t('s.colReqDoc'), val: function (r) { return r.x.doc ? t('c.yes') : t('c.no'); } }],
      used: function (r) { return r.id === 'STAVKA_NEDOSTAJE' ? 1 : 0; }
    },
    {
      code: 'VRSTA_PRIMANJA', name: { sr: 'Vrste primanja za isplatu', en: 'Payroll earnings types' }, desc: { sr: 'Mapiranje isplate bonusa na šifru vrste primanja u sistemu zarada banke', en: 'Mapping of bonus payouts to the earnings type code in the bank payroll' },
      items: function () { return WAGE.map(function (x) { return { id: x.id, name: x.name, x: x }; }); },
      cols: [{ key: 'wage', label: t('s.colWage'), val: function (r) { return r.x.wage; } }, { key: 'tax', label: t('s.colTax'), val: function (r) { return IH.L(r.x.tax); } }],
      used: function (r) { return r.id === 'BON_PROD' || r.id === 'BON_TIM' ? 1 : 0; }
    },
    {
      code: 'OBRACUNSKA_KATEGORIJA', name: { sr: 'Obračunske kategorije', en: 'Calculation categories' }, desc: { sr: 'Grupa klijenata × vrsta proizvoda; osnova za predmet targeta', en: 'Client group × product type; basis for a target subject' },
      items: function () { return D.categories.concat(IH.list('newCats')).map(function (c) { return { id: c.id, name: c.name, c: c }; }); },
      cols: [{ key: 'sg', label: IH.L({ sr: 'Grupa klijenata', en: 'Client group' }), val: function (r) { return D.segName(r.c.seg); } }, { key: 'pt', label: t('s.colType'), val: function (r) { return D.ptypeName(r.c.ptype); } }, { key: 'np', label: t('s.colProducts'), num: true, val: function (r) { return IH.products().filter(function (p) { return p.cat === r.id; }).length; } }],
      used: function (r) { return IH.products().filter(function (p) { return p.cat === r.id; }).length; }, catalog: true
    }
  ]; }
  function allCL() { return defs().concat(IH.list('newCL').map(function (x) { return Object.assign({ items: function () { return IH.list('newReasons').filter(function (r) { return r.cl === x.code; }).map(function (r) { return { id: r.id, name: r.name }; }); }, cols: [], used: function () { return 0; } }, x); })).filter(function (c) { return !delMap()['CL|' + c.code]; }); }
  function cl(code) { return allCL().filter(function (c) { return c.code === code; })[0]; }
  function seedHist(name) { return [{ at: '2025-12-18T14:40', by: 'A001', action: { sr: 'Usklađeno sa katalogom 2026', en: 'Aligned with 2026 catalogue' } }, { at: '2024-03-04T09:10', by: 'A001', action: { sr: 'Kreirano', en: 'Created' }, detail: name }]; }

  /* ---------- master tabela ---------- */
  function masterPage() {
    var grid = IH.grid({
      id: 'sif', exportName: 'Sifarnici.xlsx', create: { label: t('s.newCl'), act: 'cl-new' },
      rows: allCL, key: function (r) { return r.code; }, label: function (r) { return IH.L(r.name); },
      cols: [
        { key: 'st', label: t('s.colStatus'), type: 'status', val: function (r) { return clOn(r.code); }, fval: function (r) { return clOn(r.code) ? 'on' : 'off'; }, filter: function () { return [{ v: 'on', l: t('g.on') }, { v: 'off', l: t('g.off') }]; } },
        { key: 'name', label: t('s.colName'), val: function (r) { return IH.L(r.name); }, render: function (r) { return '<a href="#/sifarnici/' + r.code + '"><b>' + IH.esc(IH.L(r.name)) + '</b></a>'; } },
        { key: 'code', label: t('s.colCode'), val: function (r) { return r.code; } },
        { key: 'desc', label: t('s.colDesc'), nw: false, val: function (r) { return IH.L(r.desc); }, render: function (r) { return '<div style="min-width:280px;max-width:520px">' + IH.esc(IH.L(r.desc)) + '</div>'; } },
        { key: 'n', label: t('s.colItems'), num: true, search: false, val: function (r) { return r.items().length; } }
      ],
      onStatus: function (r, on) { IH.map('clStatus')[r.code] = on; IH.audit('codelist', r.code, on ? { sr: 'Šifarnik aktiviran', en: 'Code list activated' } : { sr: 'Šifarnik deaktiviran', en: 'Code list deactivated' }); },
      actions: [
        { type: 'items', title: t('g.aItems'), act: 'g-go', arg: function (r) { return 'sifarnici/' + r.code; } },
        { type: 'history', title: t('g.aHistory'), act: 'cl-hist' },
        { type: 'edit', title: t('g.aEdit'), act: 'cl-edit', kind: 'acc' },
        { type: 'delete', title: t('g.aDelete'), act: 'cl-del', kind: 'dan' }
      ]
    });
    return ui.header(t('s.title')) + grid;
  }
  IH.act['g-go'] = function (el) { IH.go(el.dataset.arg); };
  IH.act['cl-hist'] = function (el) { var c = cl(el.dataset.arg); IH.showHistory(IH.L(c.name), IH.auditFor('codelist', c.code).concat(seedHist(c.code))); };
  IH.act['cl-edit'] = function (el) {
    var c = cl(el.dataset.arg); IH.form = {};
    IH.modal({ title: t('g.aEdit') + ' — ' + c.code, body: '<div class="form-grid">' + ui.field('cl_name', t('s.colName'), IH.L(c.name), { value: IH.L(c.name) }) + ui.field('cl_code', t('s.colCode'), c.code, { value: c.code }) + ui.field('cl_desc', t('s.colDesc'), IH.L(c.desc), { type: 'textarea', full: true, value: IH.L(c.desc) }) + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', act: 'cl-edit-save', arg: c.code }) });
  };
  IH.act['cl-edit-save'] = function (el) { IH.audit('codelist', el.dataset.arg, { sr: 'Izmenjen opis šifarnika', en: 'Code list description changed' }); IH.closeModal(); IH.toast(t('s.edited')); };
  IH.act['cl-del'] = function (el) {
    var c = cl(el.dataset.arg), n = c.items().length;
    if (n) { IH.modal({ title: t('g.delTitle'), body: '<div class="note warn">' + t('s.clHasItems', { n: n }) + '</div>', foot: ui.btn(t('c.close'), { act: 'modal-close' }) }); return; }
    IH.modal({ title: t('g.delTitle'), body: '<p>' + t('g.delTxt', { n: IH.esc(IH.L(c.name)) }) + '</p>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('g.aDelete'), { cls: 'danger', icon: 'trash', act: 'cl-del-ok', arg: c.code }) });
  };
  IH.act['cl-del-ok'] = function (el) { delMap()['CL|' + el.dataset.arg] = true; IH.audit('codelist', el.dataset.arg, { sr: 'Šifarnik obrisan', en: 'Code list deleted' }); IH.closeModal(); IH.render(); IH.toast(t('g.deleted', { n: el.dataset.arg })); };
  IH.act['cl-new'] = function () {
    IH.form = {};
    IH.modal({
      title: t('s.newCl'),
      body: '<div class="form-grid">' + ui.field('cn_name', t('s.colName'), IH.L({ sr: 'Tipovi kampanja', en: 'Campaign types' }), { req: true }) + ui.field('cn_code', t('s.colCode'), 'TIP_KAMPANJE', { req: true }) + ui.field('cn_desc', t('s.colDesc'), IH.L({ sr: 'Vrste vremenski ograničenih prodajnih kampanja', en: 'Kinds of time-limited sales campaigns' }), { type: 'textarea', full: true }) + '</div>',
      foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', act: 'cl-new-save' })
    });
  };
  IH.act['cl-new-save'] = function () {
    if (!IH.list('newCL').some(function (x) { return x.code === 'TIP_KAMPANJE'; })) {
      IH.list('newCL').push({ code: 'TIP_KAMPANJE', name: { sr: 'Tipovi kampanja', en: 'Campaign types' }, desc: { sr: 'Vrste vremenski ograničenih prodajnih kampanja', en: 'Kinds of time-limited sales campaigns' }, isNew: true });
      IH.audit('codelist', 'TIP_KAMPANJE', { sr: 'Kreiran šifarnik', en: 'Code list created' });
    }
    IH.closeModal(); IH.go('sifarnici/TIP_KAMPANJE'); IH.toast(t('s.clSaved', { c: 'TIP_KAMPANJE' }));
  };

  /* ---------- stavke šifarnika ---------- */
  function itemsPage(code) {
    var c = cl(code);
    if (!c) return '<div class="empty">' + t('c.empty') + '</div>';
    var cols = [
      { key: 'st', label: t('s.colStatus'), type: 'status', val: function (r) { return itemOn(code, r.id); }, fval: function (r) { return itemOn(code, r.id) ? 'on' : 'off'; }, filter: function () { return [{ v: 'on', l: t('g.on') }, { v: 'off', l: t('g.off') }]; }, locked: c.locked ? function () { return true; } : null },
      { key: 'name', label: t('s.colName'), val: function (r) { return IH.L(r.name); }, render: function (r) { return '<b>' + IH.esc(IH.L(r.name)) + '</b>'; } },
      { key: 'code', label: t('s.colCode'), val: function (r) { return r.id; } },
      { key: 'desc', label: t('s.colDesc'), nw: false, val: function (r) { return r.desc ? IH.L(r.desc) : ''; } }
    ].concat(c.cols).concat([{ key: 'used', label: t('s.colUsed'), num: true, search: false, val: function (r) { return c.used(r); } }]);
    var grid = IH.grid({
      id: 'sif-' + code, exportName: 'Sifarnik_' + code + '.xlsx', hidden: c.items().some(function (r) { return r.desc; }) ? [] : ['desc'], create: c.catalog ? null : { label: t('s.newItem'), act: c.create || 'cli-new', arg: code },
      rows: function () { return c.items().filter(function (r) { return !delMap()[code + '|' + r.id]; }); }, key: function (r) { return r.id; }, label: function (r) { return IH.L(r.name); },
      rowCls: function (r) { return itemOn(code, r.id) ? '' : 'muted'; },
      cols: cols,
      onStatus: function (r, on) { st()[code + '|' + r.id] = on; IH.audit('codelist', code + '|' + r.id, on ? { sr: 'Stavka aktivirana', en: 'Item activated' } : { sr: 'Stavka deaktivirana', en: 'Item deactivated' }); },
      actions: [
        { type: 'history', title: t('g.aHistory'), act: 'cli-hist', arg: function (r) { return code + '|' + r.id; } },
        { type: 'edit', title: t('g.aEdit'), act: 'cli-edit', kind: 'acc', arg: function (r) { return code + '|' + r.id; } },
        { type: 'delete', title: t('g.aDelete'), act: 'cli-del', kind: 'dan', arg: function (r) { return code + '|' + r.id; } }
      ]
    });
    var crumb = '<a href="#/sifarnici">' + t('s.back') + '</a> ' + ic('chevr') + ' ' + code;
    return ui.header(IH.esc(IH.L(c.name)), '', c.catalog ? ui.btn(IH.L({ sr: 'Katalog proizvoda', en: 'Product catalogue' }), { cls: 'sm', icon: 'box', go: 'katalog' }) : '', crumb) + grid;
  }
  function itemOf(arg) { var p = arg.split('|'), c = cl(p[0]); return { c: c, r: c.items().filter(function (x) { return x.id === p[1]; })[0] }; }
  IH.act['cli-hist'] = function (el) { var o = itemOf(el.dataset.arg); IH.showHistory(IH.L(o.r.name), IH.auditFor('codelist', el.dataset.arg).concat(seedHist(o.r.id))); };
  IH.act['cli-edit'] = function (el) {
    var o = itemOf(el.dataset.arg); IH.form = {};
    IH.modal({ title: t('g.aEdit') + ' — ' + o.r.id, body: '<div class="form-grid">' + ui.field('ci_name', t('s.colName'), IH.L(o.r.name), { value: IH.L(o.r.name) }) + ui.field('ci_code', t('s.colCode'), o.r.id, { value: o.r.id }) + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', act: 'cli-edit-save', arg: el.dataset.arg }) });
  };
  IH.act['cli-edit-save'] = function (el) { IH.audit('codelist', el.dataset.arg, { sr: 'Izmenjen naziv stavke', en: 'Item name changed' }); IH.closeModal(); IH.toast(t('s.edited')); };
  IH.act['cli-del'] = function (el) {
    var o = itemOf(el.dataset.arg), n = o.c.used(o.r);
    if (n) { IH.modal({ title: t('g.delTitle'), body: '<div class="note warn">' + t('g.delUsed', { n: n }) + '</div>', foot: ui.btn(t('c.close'), { act: 'modal-close' }) }); return; }
    IH.modal({ title: t('g.delTitle'), body: '<p>' + t('g.delTxt', { n: IH.esc(IH.L(o.r.name)) }) + '</p>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('g.aDelete'), { cls: 'danger', icon: 'trash', act: 'cli-del-ok', arg: el.dataset.arg }) });
  };
  IH.act['cli-del-ok'] = function (el) { delMap()[el.dataset.arg] = true; IH.audit('codelist', el.dataset.arg, { sr: 'Stavka obrisana', en: 'Item deleted' }); IH.closeModal(); IH.render(); IH.toast(t('g.deleted', { n: el.dataset.arg.split('|')[1] })); };
  /* generička nova stavka (razlozi i novi šifarnici) */
  var ITEM_Q = {
    RAZLOG_IZUZETKA: { id: 'SPECIJALNI_PROJEKAT', name: { sr: 'Angažovanje na projektu banke', en: 'Assigned to a bank project' } },
    RAZLOG_KOREKCIJE: { id: 'DUPLA_STAVKA', name: { sr: 'Duplirana stavka u feed-u', en: 'Duplicate item in feed' } },
    RAZLOG_PRIGOVORA: { id: 'KAMPANJA', name: { sr: 'Primedba na kampanju', en: 'Objection to campaign' } },
    VRSTA_PRIMANJA: { id: 'BON_KAMP', name: { sr: 'Bonus iz kampanje', en: 'Campaign bonus' } },
    TIP_KAMPANJE: { id: 'AKVIZICIJA', name: { sr: 'Akvizicija novih klijenata', en: 'New client acquisition' } },
    RAZLOG_VRACANJA: { id: 'NEUSKLADJENO_SA_BUDZETOM', name: { sr: 'Neusklađeno sa budžetom', en: 'Not aligned with budget' } },
    RAZLOG_PRESTANKA: { id: 'PENZIJA', name: { sr: 'Odlazak u penziju', en: 'Retirement' } }
  };
  IH.act['cli-new'] = function (el) {
    var code = el.dataset.arg, q = ITEM_Q[code] || { id: 'NOVA_STAVKA', name: { sr: 'Nova stavka', en: 'New item' } }; IH.form = {};
    IH.modal({ title: t('s.newItem') + ' — ' + code, body: '<div class="form-grid">' + ui.field('ni_code', t('s.colCode'), q.id, { req: true }) + ui.field('ni_name', t('s.colName'), IH.L(q.name), { req: true }) + '</div>' + ui.toggle('ni_doc', t('s.colReqDoc'), true), foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', act: 'cli-new-save', arg: code }) });
  };
  IH.act['cli-new-save'] = function (el) {
    var code = el.dataset.arg, q = ITEM_Q[code] || { id: 'NOVA_STAVKA', name: { sr: 'Nova stavka', en: 'New item' } };
    if (REASONS[code]) { if (!REASONS[code].some(function (x) { return x.id === q.id; })) REASONS[code].push({ id: q.id, name: q.name, doc: true }); }
    else if (code === 'VRSTA_PRIMANJA') { if (!WAGE.some(function (x) { return x.id === q.id; })) WAGE.push({ id: q.id, name: q.name, wage: 'Z-312', tax: { sr: 'Zarada (porez + doprinosi)', en: 'Salary (tax + contributions)' } }); }
    else if (!IH.list('newReasons').some(function (x) { return x.cl === code && x.id === q.id; })) IH.list('newReasons').push({ cl: code, id: q.id, name: q.name, doc: true });
    IH.audit('codelist', code + '|' + q.id, { sr: 'Kreirana stavka', en: 'Item created' });
    IH.closeModal(); IH.render(); IH.toast(t('s.itemSaved', { c: q.id }));
  };

  /* ---------- modali za specijalne šifarnike (atribut, šablon, tip stavke) ---------- */
  IH.act['attr-item-new'] = function () {
    IH.form = {};
    IH.modal({
      title: t('s.newItem') + ' — ATRIBUT_STAVKE',
      body: '<div class="form-grid">' + ui.field('ia_name', t('s.colName'), IH.L({ sr: 'Broj POS transakcija u roku', en: 'POS transactions within window' }), { req: true }) + ui.field('ia_id', t('s.colCode'), 'broj_pos_tx', { req: true }) +
        ui.field('ia_type', t('s.colType'), 'number', { options: Object.keys(R.types).map(function (k) { return { v: k, l: IH.L(R.types[k]) }; }) }) + '</div>' +
        ui.toggle('ia_basis', t('s.colBasis'), false),
      foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', act: 'attr-item-save' })
    });
  };
  IH.act['attr-item-save'] = function () {
    if (!R.attr('broj_pos_tx')) IH.list('newAttrsItem').push({ id: 'broj_pos_tx', name: { sr: 'Broj POS transakcija u roku', en: 'POS transactions within window' }, type: 'number', src: 'DWH.POS_TX_CNT' });
    IH.audit('codelist', 'ATRIBUT_STAVKE|broj_pos_tx', { sr: 'Kreirana stavka', en: 'Item created' });
    IH.closeModal(); IH.render(); IH.toast(t('s.itemSaved', { c: 'broj_pos_tx' }));
  };
  IH.act['tpl-new'] = function () {
    IH.form = {};
    IH.modal({
      title: t('s.newItem') + ' — SABLON_USLOVA',
      body: '<div class="form-grid">' + ui.field('tp_name', t('s.colName'), IH.L({ sr: 'Minimalan broj POS transakcija', en: 'Minimum POS transactions' }), { req: true, full: true }) +
        ui.field('tp_def', t('s.colDef'), IH.L({ sr: 'Klijent je karticom obavio najmanje zadati broj plaćanja na POS terminalima u roku od ugovaranja.', en: 'The client made at least the given number of POS card payments within the window from the contract.' }), { type: 'textarea', full: true }) +
        ui.field('tp_attr', t('s.fData'), 'broj_pos_tx', { options: R.allAttrs().map(function (a) { return { v: a.id, l: IH.L(a.name) }; }).concat(R.attr('broj_pos_tx') ? [] : [{ v: 'broj_pos_tx', l: IH.L({ sr: 'Broj POS transakcija u roku', en: 'POS transactions within window' }) }]) }) +
        ui.field('tp_op', t('s.fCheck'), 'gte', { options: Object.keys(R.ops).map(function (k) { return { v: k, l: IH.L(R.ops[k]) }; }) }) +
        ui.field('tp_val', t('s.fVal'), '10', { num: true }) + ui.field('tp_win', t('s.fWin'), '60', { num: true }) +
        ui.field('tp_eff', t('s.colEff'), 'odlozeno', { options: Object.keys(R.effects).map(function (k) { return { v: k, l: IH.L(R.effects[k]) }; }) }) + '</div>',
      foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', act: 'tpl-save' })
    });
  };
  IH.act['tpl-save'] = function () {
    if (!R.attr('broj_pos_tx')) IH.list('newAttrsItem').push({ id: 'broj_pos_tx', name: { sr: 'Broj POS transakcija u roku', en: 'POS transactions within window' }, type: 'number', src: 'DWH.POS_TX_CNT' });
    if (!R.template('T-MIN-POS')) IH.list('newTemplates').push({ id: 'T-MIN-POS', pt: ['kartica'], name: { sr: 'Minimalan broj POS transakcija', en: 'Minimum POS transactions' }, txt: { sr: 'Računa se ako klijent obavi najmanje {v} POS transakcija u roku od {w} od ugovaranja', en: 'Counts if the client makes at least {v} POS transactions within {w} of the contract' }, def: { sr: 'Klijent je karticom obavio najmanje zadati broj plaćanja na POS terminalima u roku od ugovaranja.', en: 'The client made at least the given number of POS card payments within the window from the contract.' }, c: { attr: 'broj_pos_tx', op: 'gte', value: 10, window: { n: 60, unit: 'd', from: 'datum_prodaje' }, effect: 'odlozeno' } });
    IH.audit('codelist', 'SABLON_USLOVA|T-MIN-POS', { sr: 'Kreirana stavka', en: 'Item created' });
    IH.closeModal(); IH.render(); IH.toast(t('s.itemSaved', { c: 'T-MIN-POS' }));
  };
  IH.act['type-new'] = function () {
    IH.form = {};
    IH.modal({ title: t('s.newItem') + ' — TIP_STAVKE', body: '<div class="form-grid">' + ui.field('ty_id', t('s.colCode'), 'migracija', { req: true }) + ui.field('ty_name', t('s.colName'), IH.L({ sr: 'Migracija (prelazak sa starog paketa)', en: 'Migration (from legacy package)' }), { req: true }) + '<div class="field"><label class="lab">' + t('s.colSign') + '</label>' + ui.segForm('ty_sign', [{ v: '+', l: '+' }, { v: '-', l: '−' }], '+') + '</div>' + ui.toggle('ty_def', t('s.colDef'), false) + '</div>', foot: ui.btn(t('c.fill'), { act: 'fill-form' }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', act: 'type-save' }) });
  };
  IH.act['type-save'] = function () {
    if (!IH.list('newItemTypes').length) IH.list('newItemTypes').push({ id: 'migracija', name: { sr: 'Migracija (prelazak sa starog paketa)', en: 'Migration (from legacy package)' }, sign: '+', def: false });
    IH.audit('codelist', 'TIP_STAVKE|migracija', { sr: 'Kreirana stavka', en: 'Item created' });
    IH.closeModal(); IH.render(); IH.toast(t('s.itemSaved', { c: 'migracija' }));
  };

  /* aktivne stavke šifarnika za forme drugih ekrana */
  IH.codeItems = function (code) {
    var c = cl(code); if (!c) return [];
    return c.items().filter(function (r) { return itemOn(code, r.id) && !delMap()[code + '|' + r.id]; });
  };

  IH.route('sifarnici', {
    title: function () { return t('s.title'); },
    render: function (p) { return p[0] ? itemsPage(p[0]) : masterPage(); }
  });
})();
