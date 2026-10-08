/* Incentive Hub — pravila merenja i uslovi priznavanja (parametarski)
   Uslov u targetu = šablon iz šifarnika (rečenica + definicija + posledica) sa parametrima (rok u danima, iznos, vrednost).
   Posledica (šta se dešava ako uslov nije ispunjen) je deo šablona i ne bira se u targetu. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;
  var R = IH.rules = {};
  var L = D.L2;

  /* ---------- rečnik podataka o prodaji (polja koja stižu iz izvornih sistema) ---------- */
  R.attrs = [
    { id: 'datum_prodaje', name: L('Datum ugovaranja', 'Contract date'), type: 'date', basis: true, pt: ['racun', 'kartica', 'kredit'] },
    { id: 'datum_isplate', name: L('Datum isplate', 'Disbursement date'), type: 'date', basis: true, pt: ['kredit'] },
    { id: 'datum_aktivacije', name: L('Datum aktivacije', 'Activation date'), type: 'date', basis: true, pt: ['kartica', 'racun'] },
    { id: 'datum_naknade', name: L('Datum naplate prve naknade', 'First fee date'), type: 'date', pt: ['racun', 'kartica'] },
    { id: 'datum_priliva', name: L('Datum prvog priliva zarade', 'First salary inflow date'), type: 'date', pt: ['racun'] },
    { id: 'datum_prve_tx', name: L('Datum prve transakcije', 'First transaction date'), type: 'date', pt: ['kartica', 'racun'] },
    { id: 'datum_otkaza', name: L('Otkaz / zatvaranje', 'Cancellation / closure'), type: 'event', pt: ['racun', 'kartica'] },
    { id: 'datum_prevremene_otplate', name: L('Prevremena otplata', 'Early repayment'), type: 'event', pt: ['kredit'] },
    { id: 'broj_priliva', name: L('Broj priliva zarade', 'Number of salary inflows'), type: 'number', pt: ['racun'] },
    { id: 'iznos_priliva', name: L('Prosečan mesečni priliv', 'Average monthly inflow'), type: 'amount', pt: ['racun'] },
    { id: 'broj_tx', name: L('Broj transakcija', 'Number of transactions'), type: 'number', pt: ['kartica', 'racun'] },
    { id: 'dpd', name: L('Dani docnje', 'Days past due'), type: 'number', pt: ['kredit', 'kartica'] },
    { id: 'rocnost', name: L('Ročnost (meseci)', 'Tenor (months)'), type: 'number', pt: ['kredit'] },
    { id: 'status_ugovora', name: L('Status ugovora', 'Contract status'), type: 'list', pt: ['kredit', 'kartica', 'racun'], values: [{ v: 'odobren', l: L('Odobren', 'Approved') }, { v: 'isplacen', l: L('Isplaćen', 'Disbursed') }, { v: 'aktivan', l: L('Aktivan', 'Active') }, { v: 'zatvoren', l: L('Zatvoren', 'Closed') }] },
    { id: 'kanal', name: L('Kanal ugovaranja', 'Channel'), type: 'list', pt: ['racun', 'kartica', 'kredit'], values: [{ v: 'ekspozitura', l: L('Ekspozitura', 'Branch') }, { v: 'digitalno', l: L('Mobilna aplikacija', 'Mobile app') }, { v: 'kontakt_centar', l: L('Kontakt centar', 'Contact centre') }] },
    { id: 'izvor_refi', name: L('Izvor refinansiranja', 'Refinancing source'), type: 'list', pt: ['kredit'], values: [{ v: 'eksterni', l: L('Druga banka', 'Other bank') }, { v: 'interni', l: L('Ista banka', 'Same bank') }] },
    { id: 'valuta', name: L('Valuta', 'Currency'), type: 'list', pt: ['kredit', 'racun'], values: [{ v: 'RSD', l: 'RSD' }, { v: 'EUR', l: 'EUR' }] },
    { id: 'ntb', name: L('Novi klijent banke', 'New-to-bank client'), type: 'bool', pt: ['racun', 'kartica', 'kredit'] },
    { id: 'naknada_naplacena', name: L('Naplaćena prva naknada', 'First fee charged'), type: 'bool', date: 'datum_naknade', pt: ['racun', 'kartica'] },
    { id: 'iznos', name: L('Iznos prodaje', 'Sale amount'), type: 'amount', pt: ['kredit'] },
    { id: 'hipoteka_potrebna', name: L('Kredit sa hipotekom', 'Mortgage-backed loan'), type: 'bool', pt: ['kredit'] },
    { id: 'datum_hipoteke', name: L('Datum upisa hipoteke', 'Mortgage registration date'), type: 'date', pt: ['kredit'] },
    { id: 'klijent_zaposleni', name: L('Klijent je zaposleni banke ili član porodice', 'Client is a bank employee or family member'), type: 'bool', pt: ['racun', 'kartica', 'kredit'] }
  ];
  R.attr = function (id) { return R.attrs.concat(IH.list('newAttrsItem')).filter(function (a) { return a.id === id; })[0]; };
  R.allAttrs = function () { return R.attrs.concat(IH.list('newAttrsItem')); };
  R.attrsFor = function (ptype) { return R.allAttrs().filter(function (a) { return !ptype || !a.pt || a.pt.indexOf(ptype) >= 0; }); };
  R.types = { date: L('Datum', 'Date'), event: L('Događaj', 'Event'), number: L('Broj', 'Number'), amount: L('Iznos', 'Amount'), list: L('Lista', 'List'), bool: L('Da / Ne', 'Yes / No') };
  /* kako se podatak proverava (koristi se u šifarniku pri definisanju novog šablona) */
  R.ops = {
    within: { sr: 'mora se desiti u roku', en: 'must occur within', types: ['date', 'event'] },
    not_within: { sr: 'ne sme se desiti u roku', en: 'must not occur within', types: ['date', 'event'] },
    gte: { sr: 'najmanje', en: 'at least', types: ['number', 'amount'] }, lte: { sr: 'najviše', en: 'at most', types: ['number', 'amount'] },
    eq: { sr: 'mora biti', en: 'must be', types: ['number', 'amount', 'list', 'bool'] }, ne: { sr: 'ne sme biti', en: 'must not be', types: ['list'] },
    in: { sr: 'jedno od', en: 'one of', types: ['list'] }
  };
  R.opsFor = function (type) { return Object.keys(R.ops).filter(function (k) { return R.ops[k].types.indexOf(type) >= 0; }); };
  /* posledica ako uslov nije ispunjen */
  R.effects = {
    uslov: { sr: 'Mora da važi', en: 'Must hold', pill: 'accent' },
    odlozeno: { sr: 'Čeka se u roku', en: 'Awaited within window', pill: 'info' },
    iskljucenje: { sr: 'Isključuje prodaju', en: 'Excludes the sale', pill: 'gray' },
    storno: { sr: 'Poništava prodaju', en: 'Reverses the sale', pill: 'danger' }
  };
  R.aggs = { zbir: L('Zbir', 'Sum'), broj: L('Broj', 'Count') };
  R.measures = [
    { id: 'iznos', name: L('Iznos (RSD)', 'Amount (RSD)'), unit: 'RSD' },
    { id: 'broj', name: L('Broj (kom)', 'Count (pcs)'), unit: 'kom' }
  ];
  R.measure = function (id) { return R.measures.filter(function (m) { return m.id === id; })[0]; };
  R.itemTypes = [
    { id: 'nova', name: L('Nova prodaja', 'New sale'), sign: '+', def: true },
    { id: 'storno', name: L('Storno', 'Reversal'), sign: '−', def: false, d: L('Povlačenje priznate prodaje', 'Withdrawal of a recognised sale') }
  ];
  R.periodTypes = [
    { id: 'M', name: L('Mesec', 'Month'), len: L('1 mesec', '1 month'), cutoff: 3, consent: 10 },
    { id: 'Q', name: L('Kvartal', 'Quarter'), len: L('3 meseca', '3 months'), cutoff: 5, consent: 10 },
    { id: 'Y', name: L('Godina', 'Year'), len: L('12 meseci', '12 months'), cutoff: 10, consent: 15 }
  ];
  R.units = [{ id: 'kom', name: L('Količina (kom)', 'Quantity (pcs)') }, { id: 'RSD', name: L('Novac (RSD)', 'Money (RSD)') }];

  /* ---------- šabloni uslova ----------
     Rečenica sama kaže šta se dešava sa prodajom ({w} = rok, {v} = vrednost); posledica je deo šablona i ne prikazuje se posebno. */
  R.templates = [
    { id: 'T-STATUS', name: L('Kredit isplaćen', 'Loan disbursed'), pt: ['kredit'],
      txt: L('Računa se samo kredit koji je isplaćen klijentu', 'Only a loan disbursed to the client counts'),
      def: L('Odobren, a još neisplaćen kredit ne ulazi u ostvarenje. Ulazi kada bude isplaćen.', 'An approved but not yet disbursed loan does not count. It counts once disbursed.'),
      c: { attr: 'status_ugovora', op: 'eq', value: 'isplacen', effect: 'uslov' } },
    { id: 'T-EXCLUDE', name: L('Refinansiranje iste banke', 'Same-bank refinancing'), pt: ['kredit'],
      txt: L('Ne računa se refinansiranje kredita naše banke', 'Refinancing of our own bank\'s loan does not count'),
      def: L('Prebacivanje postojećeg kredita naše banke u novi kredit nije nova prodaja. Refinansiranje kredita druge banke se računa.', 'Moving an existing loan of our bank into a new loan is not a new sale. Refinancing another bank\'s loan counts.'),
      c: { attr: 'izvor_refi', op: 'ne', value: 'interni', effect: 'iskljucenje' } },
    { id: 'T-MIN-AMT', name: L('Minimalan iznos kredita', 'Minimum loan amount'), pt: ['kredit'],
      txt: L('Računa se kredit od najmanje {v}', 'A loan of at least {v} counts'),
      def: L('Krediti manjeg iznosa ne ulaze u ostvarenje. Sprečava da se target ispunjava velikim brojem malih kredita.', 'Smaller loans do not count. Prevents the target from being met with many small loans.'),
      c: { attr: 'iznos', op: 'gte', value: 300000, effect: 'uslov' } },
    { id: 'T-MORTGAGE', name: L('Upisana hipoteka', 'Mortgage registered'), pt: ['kredit'],
      txt: L('Stambeni kredit se računa kada se upiše hipoteka, najkasnije {w} od isplate', 'A housing loan counts once the mortgage is registered, at the latest {w} after disbursement'),
      def: L('Stambeni kredit je završen posao tek kada je hipoteka upisana. Odnosi se samo na kredite sa hipotekom; ostali krediti nisu obuhvaćeni.', 'A housing loan is complete only once the mortgage is registered. Applies only to mortgage-backed loans; other loans are not affected.'),
      c: { attr: 'datum_hipoteke', op: 'within', window: { n: 90, unit: 'd', from: 'datum_isplate' }, when: 'hipoteka_potrebna', effect: 'odlozeno' } },
    { id: 'T-NO-PREPAY', name: L('Prevremena otplata', 'Early repayment'), pt: ['kredit'],
      txt: L('Poništava se ako klijent vrati ceo kredit u roku od {w} od isplate', 'Reversed if the client repays the whole loan within {w} of disbursement'),
      def: L('Ako klijent vrati ceo kredit pre isteka roka, prodaja se poništava u periodu u kom je kredit vraćen.', 'If the client repays the whole loan before the window ends, the sale is reversed in the period of repayment.'),
      c: { attr: 'datum_prevremene_otplate', op: 'not_within', window: { n: 90, unit: 'd', from: 'datum_isplate' }, effect: 'storno' } },
    { id: 'T-ACTIVATION', name: L('Aktivacija kartice', 'Card activation'), pt: ['kartica'],
      txt: L('Računa se kada klijent aktivira karticu, najkasnije {w} od izdavanja', 'Counts once the client activates the card, at the latest {w} after issue'),
      def: L('Kartica ulazi u ostvarenje kada je klijent aktivira (prva upotreba ili PIN). Ako je ne aktivira u roku, ne računa se.', 'The card counts once the client activates it (first use or PIN). If not activated in time, it does not count.'),
      c: { attr: 'datum_aktivacije', op: 'within', window: { n: 30, unit: 'd', from: 'datum_prodaje' }, effect: 'odlozeno' } },
    { id: 'T-FIRST-TX', name: L('Prva kupovina karticom', 'First card purchase'), pt: ['kartica'],
      txt: L('Računa se kada klijent prvi put plati karticom, najkasnije {w} od izdavanja', 'Counts once the client first pays with the card, at the latest {w} after issue'),
      def: L('Strože od aktivacije: kartica ulazi u ostvarenje tek kada je klijent upotrebi za plaćanje. Ako ne plati u roku, ne računa se.', 'Stricter than activation: the card counts only once the client uses it to pay. If not used in time, it does not count.'),
      c: { attr: 'datum_prve_tx', op: 'within', window: { n: 30, unit: 'd', from: 'datum_prodaje' }, effect: 'odlozeno' } },
    { id: 'T-NO-CANCEL', name: L('Otkaz proizvoda', 'Product cancellation'), pt: ['racun', 'kartica'],
      txt: L('Poništava se ako klijent zatvori račun ili otkaže karticu u roku od {w}', 'Reversed if the client closes the account or cancels the card within {w}'),
      def: L('Ako klijent zatvori račun ili otkaže karticu pre isteka roka, prodaja se poništava u periodu u kom je otkaz evidentiran.', 'If the client closes the account or cancels the card before the window ends, the sale is reversed in the period the cancellation is recorded.'),
      c: { attr: 'datum_otkaza', op: 'not_within', window: { n: 90, unit: 'd', from: 'datum_prodaje' }, effect: 'storno' } },
    { id: 'T-FLAG', name: L('Prva naknada', 'First fee'), pt: ['racun', 'kartica'],
      txt: L('Računa se kada banka naplati prvu naknadu, najkasnije {w} od otvaranja', 'Counts once the bank charges the first fee, at the latest {w} after opening'),
      def: L('Naplaćena prva mesečna naknada pokazuje da klijent stvarno koristi proizvod. Ako se naknada ne naplati u roku, prodaja se ne računa.', 'A charged first monthly fee shows the client actually uses the product. If no fee is charged in time, the sale does not count.'),
      c: { attr: 'naknada_naplacena', op: 'eq', value: true, window: { n: 45, unit: 'd', from: 'datum_prodaje' }, effect: 'odlozeno' } },
    { id: 'T-NTB', name: L('Novi klijent', 'New client'),
      txt: L('Računa se samo prodaja novom klijentu banke', 'Only a sale to a new bank client counts'),
      def: L('Novi klijent je onaj koji u poslednjih 12 meseci nije imao nijedan aktivan proizvod u banci.', 'A new client had no active product with the bank in the last 12 months.'),
      c: { attr: 'ntb', op: 'eq', value: true, effect: 'uslov' } },
    { id: 'T-STAFF', name: L('Prodaja zaposlenima banke', 'Sales to bank staff'),
      txt: L('Ne računa se prodaja zaposlenima banke i članovima njihove porodice', 'Sales to bank employees and their family members do not count'),
      def: L('Prodaja klijentu koji je zaposlen u banci ili je član porodice zaposlenog ne ulazi u ostvarenje. Najčešće pravilo protiv nameštanja prodaje.', 'A sale to a client employed by the bank or a family member of an employee does not count. The most common rule against staged sales.'),
      c: { attr: 'klijent_zaposleni', op: 'eq', value: false, effect: 'iskljucenje' } },
    { id: 'T-CHANNEL', name: L('Kanal prodaje', 'Sales channel'),
      txt: L('Računa se samo prodaja ugovorena u kanalu {v}', 'Only a sale contracted in channel {v} counts'),
      def: L('Prodaja koju je klijent sam ugovorio u mobilnoj aplikaciji ili preko kontakt centra ne pripisuje se bankaru.', 'A sale the client contracted alone in the mobile app or via the contact centre is not credited to the banker.'),
      c: { attr: 'kanal', op: 'eq', value: 'ekspozitura', effect: 'uslov' } }
  ];
  R.template = function (id) { return R.allTemplates().filter(function (x) { return x.id === id; })[0]; };
  R.allTemplates = function () { return R.templates.concat(IH.list('newTemplates')); };
  R.templatesFor = function (ptype) { var pts = ptype == null ? [] : [].concat(ptype); return R.allTemplates().filter(function (x) { return !pts.length || !x.pt || x.pt.some(function (p) { return pts.indexOf(p) >= 0; }); }); };
  /* podrazumevano pravilo merenja po vrsti proizvoda */
  R.presetFor = function (ptype) {
    var p = D.ptype(ptype); if (!p) return null;
    return { unit: p.unit, measure: p.measure, basis: p.basis, formula: { agg: p.measure === 'iznos' ? 'zbir' : 'broj', measure: p.measure, basis: p.basis }, conds: JSON.parse(JSON.stringify(p.conds)) };
  };
  /* jedinica merenja je ista za sve vrste proizvoda: komadi ili iznos */
  R.measureOptions = function () { return [{ v: 'broj', l: IH.L(L('Komadi', 'Pieces')) }, { v: 'iznos', l: IH.L(L('Iznos (RSD)', 'Amount (RSD)')) }, { v: 'bodovi', l: IH.L(L('Bodovi', 'Points')) }]; };
  /* po kom datumu prodaja ulazi u period */
  R.basisOptions = function (ptype) {
    if (ptype === 'kredit') return [{ v: 'datum_isplate', l: IH.L(L('Datumu isplate kredita', 'Loan disbursement date')) }, { v: 'datum_prodaje', l: IH.L(L('Datumu ugovaranja', 'Contract date')) }];
    if (ptype === 'racun') return [{ v: 'datum_prodaje', l: IH.L(L('Datumu otvaranja računa', 'Account opening date')) }, { v: 'datum_aktivacije', l: IH.L(L('Datumu aktivacije', 'Activation date')) }];
    return [{ v: 'datum_prodaje', l: IH.L(L('Datumu izdavanja kartice', 'Card issue date')) }, { v: 'datum_aktivacije', l: IH.L(L('Datumu aktivacije', 'Activation date')) }];
  };

  /* ---------- generisani tekst ---------- */
  function unitTxt(n, u) {
    if (IH.state.lang === 'en') return u === 'm' ? (n === 1 ? 'month' : 'months') : (n === 1 ? 'day' : 'days');
    return u === 'm' ? (n === 1 ? 'mesec' : n < 5 ? 'meseca' : 'meseci') : (n === 1 ? 'dan' : 'dana');
  }
  R.unitTxt = unitTxt;
  R.windowText = function (w) {
    if (!w || !w.n) return '';
    var from = R.attr(w.from);
    return (IH.state.lang === 'en' ? 'within ' : 'u roku od ') + w.n + ' ' + unitTxt(+w.n, w.unit) + (from ? (IH.state.lang === 'en' ? ' from ' : ' od: ') + IH.L(from.name).toLowerCase() : '');
  };
  R.valueText = function (c) {
    var a = R.attr(c.attr); if (!a) return String(c.value);
    if (a.type === 'bool') return c.value === true || c.value === 'true' ? t('c.yes') : t('c.no');
    if (a.type === 'list') { var v = (a.values || []).filter(function (x) { return x.v === c.value; })[0]; return v ? IH.L(v.l) : String(c.value); }
    if (a.type === 'amount') return F.rsd(+c.value);
    return F.num(+c.value);
  };
  /* rokovi koji se nude u izboru */
  R.WINS = [{ n: 15, unit: 'd' }, { n: 30, unit: 'd' }, { n: 45, unit: 'd' }, { n: 60, unit: 'd' }, { n: 90, unit: 'd' }, { n: 6, unit: 'm' }, { n: 12, unit: 'm' }];
  function winTxt(w) { return w && w.n ? w.n + ' ' + unitTxt(+w.n, w.unit) : '—'; }
  R.winTxt = winTxt;
  /* rečenica uslova; parametri su podebljani (html) */
  function fill(txt, c, html) {
    var w = c.window || {}, b = function (x) { return html ? '<b>' + IH.esc(x) + '</b>' : x; };
    return txt.replace(/\{(\w)\}/g, function (m, k) {
      if (k === 'w') return b(winTxt(w));
      if (k === 'n') return b(String(w.n || ''));
      if (k === 'u') return unitTxt(+w.n || 0, w.unit);
      if (k === 'v') return b(R.valueText(c));
      return m;
    });
  }
  function genericTxt(c) {
    var a = R.attr(c.attr); if (!a) return '—';
    if (c.op === 'within' || c.op === 'not_within') return IH.L(a.name) + ' ' + IH.L(R.ops[c.op]) + ' {w}';
    if (a.type === 'bool') return IH.L(a.name) + ': {v}';
    return IH.L(a.name) + ' ' + IH.L(R.ops[c.op]) + ' {v}' + (c.window && c.window.n ? (IH.state.lang === 'en' ? ' within {w}' : ' u roku od {w}') : '');
  }
  function sentence(c) { var tp = c.tpl && R.template(c.tpl); return tp && tp.txt ? IH.L(tp.txt) : genericTxt(c); }
  function hasWin(c) { return /\{(w|n)\}/.test(sentence(c)); }
  function hasVal(c) { return /\{v\}/.test(sentence(c)); }
  R.condText = function (c) { return fill(sentence(c), c, false); };
  R.condHtml = function (c) { return fill(IH.esc(sentence(c)), c, true); };
  /* izbor parametra: rok iz liste, vrednost iz liste ili broj */
  R.paramCtl = function (c, idx) {
    var out = [];
    if (hasVal(c)) {
      var a = R.attr(c.attr) || {};
      if (a.type === 'list') out.push('<select class="in" style="width:auto;min-width:150px" data-cr="' + idx + '" data-cf="value">' + (a.values || []).map(function (x) { return '<option value="' + IH.esc(x.v) + '"' + (x.v === c.value ? ' selected' : '') + '>' + IH.esc(IH.L(x.l)) + '</option>'; }).join('') + '</select>');
      else if (a.type === 'bool') out.push('<select class="in" style="width:auto" data-cr="' + idx + '" data-cf="value"><option value="true"' + (c.value === true || c.value === 'true' ? ' selected' : '') + '>' + t('c.yes') + '</option><option value="false"' + (c.value === false || c.value === 'false' ? ' selected' : '') + '>' + t('c.no') + '</option></select>');
      else out.push('<span style="display:inline-flex;align-items:center;gap:6px"><input class="in tnum" style="width:110px" data-cr="' + idx + '" data-cf="value" value="' + IH.esc(c.value == null ? '' : F.num(+c.value)) + '">' + (a.type === 'amount' ? 'RSD' : '') + '</span>');
    }
    if (hasWin(c)) {
      var w = c.window || {}, opts = R.WINS.slice();
      if (w.n && !opts.some(function (x) { return x.n === +w.n && x.unit === w.unit; })) opts.push({ n: +w.n, unit: w.unit });
      out.push('<select class="in" style="width:auto;min-width:120px" data-cr="' + idx + '" data-cf="win">' + opts.map(function (x) { return '<option value="' + x.n + '|' + x.unit + '"' + (x.n === +w.n && x.unit === w.unit ? ' selected' : '') + '>' + winTxt(x) + '</option>'; }).join('') + '</select>');
    }
    return out.length ? out.join(' ') : '<span class="mut">—</span>';
  };
  R.condName = function (c) { var tp = c.tpl && R.template(c.tpl); return tp ? IH.L(tp.name) : (R.attr(c.attr) ? IH.L(R.attr(c.attr).name) : '—'); };
  R.condDef = function (c) { var tp = c.tpl && R.template(c.tpl); return tp && tp.def ? IH.L(tp.def) : ''; };
  R.effectPill = function (eff) { var e = R.effects[eff || 'uslov']; return '<span class="pill p-' + e.pill + '">' + IH.L(e) + '</span>'; };
  R.measureText = function (ptype, measure) {
    var o = R.measureOptions(ptype).filter(function (x) { return x.v === measure; })[0];
    return o ? o.l : IH.L(measure === 'iznos' ? L('Iznos', 'Amount') : L('Broj', 'Count'));
  };
  R.basisText = function (ptype, basis) { var o = R.basisOptions(ptype).filter(function (x) { return x.v === basis; })[0]; return o ? o.l : ''; };
  R.subjectText = function (subj) {
    if (!subj) return '';
    var pt = D.ptype(subj.ptype), segs = (subj.segs || []).map(function (s) { return D.segName(s).toLowerCase(); });
    var s = pt ? IH.L(pt.name) : D.subjPtypeName(subj);
    if (segs.length && segs.length < D.segments.length) s += ' – ' + segs.join(', ');
    if (subj.products && subj.products.length) s += ' (' + subj.products.map(function (p) { return D.productName(p); }).join(', ') + ')';
    return s;
  };
  /* kratka rečenica pravila merenja */
  R.formulaText = function (f, subj) {
    if (!f) return '';
    var pt = subj && subj.ptype, b = R.basisText(pt, f.basis);
    return R.measureText(pt, f.measure);
  };

  /* ---------- atributi mock stavki (deterministički) ---------- */
  var AC = {};
  function addDays(iso, n) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function days(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 864e5); }
  /* redovne prodaje ispunjavaju podrazumevane uslove svoje vrste proizvoda (događaj je evidentiran najkasnije na dan podataka);
     stavka sa oznakom fail ne ispunjava navedeni uslov (prikaz razloga u Dnevnom ostvarenju) */
  R.itemAttrs = function (it) {
    if (AC[it.id]) return AC[it.id];
    var r = D.rng('attr|' + it.id), asOf = D.DATA_AS_OF, f = it.fail;
    function cl(iso) { return iso > asOf ? asOf : iso; }
    var a = { datum_prodaje: it.date, kanal: /MB|APP/.test(it.code || '') ? 'digitalno' : 'ekspozitura', ntb: r() < 0.4 };
    var pt = it.ptype, p = it.product ? D.product(it.product) : null;
    if (pt === 'kredit') {
      a.datum_isplate = cl(addDays(it.date, Math.floor(r() * 5))); a.status_ugovora = f === 'T-STATUS' ? 'odobren' : 'isplacen';
      a.dpd = r() < 0.95 ? 0 : 5 + Math.floor(r() * 50); a.rocnost = [24, 36, 48, 60, 71, 84, 120][Math.floor(r() * 7)]; a.valuta = /EUR/.test(it.code || '') ? 'EUR' : 'RSD';
      if (p && p.ref) a.izvor_refi = f === 'T-EXCLUDE' ? 'interni' : 'eksterni';
      a.iznos = it.amount || 0;
      a.hipoteka_potrebna = !!(p && /^SK-/.test(p.codes[0]));
      if (a.hipoteka_potrebna && f !== 'T-MORTGAGE') a.datum_hipoteke = cl(addDays(a.datum_isplate, 5 + Math.floor(r() * 35)));
    }
    if (pt === 'racun') {
      a.naknada_naplacena = f !== 'T-FLAG'; if (a.naknada_naplacena) a.datum_naknade = cl(addDays(it.date, 20 + Math.floor(r() * 25)));
      a.ntb = it.type === 'nova' ? r() < 0.75 : false; a.broj_tx = Math.floor(r() * 9); a.datum_prve_tx = cl(addDays(it.date, 1 + Math.floor(r() * 30))); a.datum_aktivacije = cl(addDays(it.date, Math.floor(r() * 3)));
      if (it.seg === 'FL' && r() < 0.6) { a.datum_priliva = cl(addDays(it.date, 10 + Math.floor(r() * 50))); a.broj_priliva = 1 + Math.floor(r() * 3); a.iznos_priliva = Math.round(45000 + r() * 140000); }
    }
    if (pt === 'kartica') {
      if (f !== 'T-ACTIVATION') { a.datum_aktivacije = cl(addDays(it.date, 1 + Math.floor(r() * 27))); a.datum_prve_tx = cl(addDays(a.datum_aktivacije, Math.floor(r() * 10))); }
      a.broj_tx = Math.floor(r() * 12); a.naknada_naplacena = r() < 0.9; if (a.naknada_naplacena) a.datum_naknade = cl(addDays(it.date, 25 + Math.floor(r() * 20))); a.dpd = 0;
    }
    a.klijent_zaposleni = f === 'T-STAFF';
    if (it.type === 'storno') { if (pt === 'kredit') a.datum_prevremene_otplate = it.date; else a.datum_otkaza = it.date; }
    if (it.type === 'zatvaranje') a.datum_otkaza = it.date;
    AC[it.id] = a;
    return a;
  };
  R.addDays = addDays;

  /* ---------- evaluacija ---------- */
  R.evalCond = function (c, a) {
    var v = a[c.attr], w = c.window, win = w && w.n ? +w.n * (w.unit === 'm' ? 30 : 1) : null;
    var from = w && w.from ? a[w.from] : null;
    if (c.op === 'within') { if (v == null) return false; if (win == null || !from) return true; var d = days(from, v); return d >= 0 && d <= win; }
    if (c.op === 'not_within') { if (v == null) return true; if (win == null || !from) return false; var d2 = days(from, v); return !(d2 >= 0 && d2 <= win); }
    if (v == null) return c.op === 'ne' || c.effect === 'iskljucenje';
    var val = c.value;
    if (c.op === 'eq') return String(v) === String(val);
    if (c.op === 'ne') return String(v) !== String(val);
    if (c.op === 'gte') return +v >= +val;
    if (c.op === 'lte') return +v <= +val;
    if (c.op === 'in') return String(val).split(',').map(function (x) { return x.trim(); }).indexOf(String(v)) >= 0;
    return true;
  };
  /* provera uslova na dan podataka: ok; ili nije ispunjen — pending ako se još može ispuniti u roku (until = poslednji dan roka) */
  R.evalAsOf = function (c, a, asOf) {
    if (c.when && !a[c.when]) return { ok: true };
    var at = R.attr(c.attr) || {}, w = c.window, win = w && w.n ? +w.n * (w.unit === 'm' ? 30 : 1) : null;
    var from = w && w.from ? a[w.from] : null, until = from && win != null ? addDays(from, win) : null, open = until ? asOf <= until : false;
    if (c.op === 'within') {
      var v = a[c.attr];
      if (v && v <= asOf) { if (win == null || !from) return { ok: true }; var d = days(from, v); return d >= 0 && d <= win ? { ok: true } : { ok: false, until: until }; }
      return { ok: false, pending: open, until: until };
    }
    if (c.op === 'not_within') {
      var x = a[c.attr];
      if (!x || x > asOf || win == null || !from) return { ok: true };
      var d2 = days(from, x); return { ok: !(d2 >= 0 && d2 <= win) };
    }
    if (at.type === 'bool' && at.date && (c.value === true || c.value === 'true')) {
      var dt = a[at.date];
      if (a[c.attr] === true && (!dt || dt <= asOf)) { if (win == null || !from || !dt) return { ok: true }; var d3 = days(from, dt); return d3 >= 0 && d3 <= win ? { ok: true } : { ok: false, until: until }; }
      return { ok: false, pending: open, until: until };
    }
    return { ok: R.evalCond(c, a) };
  };
  /* provera nad istorijom (koristi se u testu kombinacija, ne u formama) */
  R.simulate = function (tg, pid) {
    var items = D.allItems(pid).filter(function (i) { return i.status !== 'nemapirano' && EN.matches(tg, i); });
    var pos = items.filter(function (i) { return i.type !== 'storno'; });
    var res = { total: pos.length, priznato: 0, uslov: 0, iskljuceno: 0, storno: 0, perCond: (tg.conds || []).map(function () { return 0; }) };
    pos.forEach(function (i) {
      var a = R.itemAttrs(i), ok = true;
      (tg.conds || []).forEach(function (c, k) {
        if (c.effect === 'storno') return;
        if (!R.evalCond(c, a)) { res.perCond[k]++; if (ok) { ok = false; if (c.effect === 'iskljucenje') res.iskljuceno++; else res.uslov++; } }
      });
      if (ok) res.priznato++;
    });
    var st = items.filter(function (i) { return i.type === 'storno'; });
    if ((tg.conds || []).some(function (c) { return c.effect === 'storno'; })) res.storno = st.length;
    return res;
  };

  /* ---------- UI: uslovi u targetu ---------- */
  IH.addStrings({
    'r.measure': 'Meri se', 'r.basis': 'Prodaja ulazi u period po', 'r.conds': 'Uslovi priznavanja', 'r.colName': 'Uslov', 'r.colText': 'Pravilo', 'r.colEff': 'Vrsta uslova', 'r.colDef': 'Šta znači', 'r.colParam': 'Rok ili vrednost',
    'r.add': 'Dodaj uslov', 'r.none': 'Nema uslova — računa se svaka prodaja iz predmeta targeta', 'r.pickT': 'Dodaj uslove priznavanja', 'r.pickAdd': 'Dodaj izabrane ({n})', 'r.pickNone': 'Svi uslovi za ovu vrstu proizvoda su već dodati',
    'r.u.d': 'dana', 'r.u.m': 'meseci', 'r.attrType': 'Tip', 'r.isBasis': 'Osnova datuma', 'r.values': 'Vrednosti', 'r.forPt': 'Vrsta proizvoda'
  }, {
    'r.measure': 'Measured as', 'r.basis': 'Sale enters the period by', 'r.conds': 'Recognition conditions', 'r.colName': 'Condition', 'r.colText': 'Rule', 'r.colEff': 'Condition type', 'r.colDef': 'What it means', 'r.colParam': 'Window or value',
    'r.add': 'Add condition', 'r.none': 'No conditions — every sale in the target subject counts', 'r.pickT': 'Add recognition conditions', 'r.pickAdd': 'Add selected ({n})', 'r.pickNone': 'All conditions for this product type are already added',
    'r.u.d': 'days', 'r.u.m': 'months', 'r.attrType': 'Type', 'r.isBasis': 'Date basis', 'r.values': 'Values', 'r.forPt': 'Product type'
  });

  /* tabela uslova: ista za pregled (ro) i izmenu; u izmeni rok ili vrednost se bira u posebnoj koloni */
  /* kod targeta sa više vrsta proizvoda uz naziv uslova piše na koje vrste se odnosi */
  function ptSuffix(c, pts) {
    if (pts.length < 2) return '';
    var cp = c.pt || (R.template(c.tpl) || {}).pt; if (!cp) return '';
    cp = cp.filter(function (p) { return pts.indexOf(p) >= 0; });
    return cp.length && cp.length < pts.length ? ' <span class="mut">· ' + IH.esc(cp.map(D.ptypeName).join(', ')) + '</span>' : '';
  }
  R.builderHtml = function (conds, opts) {
    opts = opts || {};
    var ro = !!opts.ro, pts = [].concat(opts.ptype || []);
    if (!ro) IH.form._condPt = opts.ptype;
    var rows = (conds || []).map(function (c, i) {
      var def = R.condDef(c);
      return '<tr><td class="nw"><b>' + IH.esc(R.condName(c)) + '</b>' + ptSuffix(c, pts) + (def ? ' <span class="info-dot" title="' + IH.esc(def) + '">' + ic('info') + '</span>' : '') + '</td><td>' + R.condHtml(c) + '</td>' + (ro ? '' : '<td class="nw">' + R.paramCtl(c, i) + '</td><td class="num"><button class="gab dan" data-act="cond-rm" data-arg="' + i + '" title="' + t('c.cancel') + '">' + ic('trash') + '</button></td>') + '</tr>';
    }).join('');
    var tbl = (conds || []).length ? '<div class="tbl-wrap"><table class="t compact cond-t"><thead><tr><th>' + t('r.colName') + '</th><th>' + t('r.colText') + '</th>' + (ro ? '' : '<th>' + t('r.colParam') + '</th><th></th>') + '</tr></thead><tbody>' + rows + '</tbody></table></div>' : '<div class="empty" style="padding:14px">' + t('r.none') + '</div>';
    return '<div id="cond-builder">' + tbl + (ro ? '' : '<div style="margin-top:10px">' + ui.btn(t('r.add'), { cls: 'sm', icon: 'plus', act: 'cond-pick' }) + '</div>') + '</div>';
  };
  R.condTable = function (conds) { return R.builderHtml(conds, { ro: true }); };

  /* izbor uslova: kartice sa nazivom, rečenicom i definicijom */
  function pickList() {
    var used = (IH.form.conds || []).map(function (c) { return c.tpl; }), sel = IH.form._pick || [];
    var list = R.templatesFor(IH.form._condPt).filter(function (x) { return used.indexOf(x.id) < 0; });
    if (!list.length) return '<div class="empty">' + t('r.pickNone') + '</div>';
    return '<div class="opts pick-list">' + list.map(function (x) {
      var on = sel.indexOf(x.id) >= 0;
      return '<button type="button" class="opt chk-opt' + (on ? ' on' : '') + '" data-act="cond-pick-t" data-arg="' + x.id + '"><span class="ri sq">' + (on ? ic('check') : '') + '</span><span style="flex:1"><b>' + IH.esc(IH.L(x.name)) + '</b><small>' + IH.esc(R.condText(Object.assign({ tpl: x.id }, x.c))) + '</small><small>' + IH.esc(IH.L(x.def || '')) + '</small></span></button>';
    }).join('') + '</div>';
  }
  IH.act['cond-pick'] = function () {
    IH.form._pick = [];
    IH.modal({ title: t('r.pickT'), wide: true, body: '<div id="cond-pick-body">' + pickList() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + '<span id="cond-pick-btn">' + ui.btn(t('r.pickAdd', { n: 0 }), { cls: 'primary', icon: 'plus', act: 'cond-pick-go' }) + '</span>' });
  };
  IH.act['cond-pick-t'] = function (el) {
    var s = IH.form._pick = IH.form._pick || [], i = s.indexOf(el.dataset.arg);
    if (i >= 0) s.splice(i, 1); else s.push(el.dataset.arg);
    IH.swap('cond-pick-body', pickList()); IH.swap('cond-pick-btn', ui.btn(t('r.pickAdd', { n: s.length }), { cls: 'primary', icon: 'plus', act: 'cond-pick-go' }));
  };
  IH.act['cond-pick-go'] = function () {
    IH.form.conds = IH.form.conds || [];
    var pts = [].concat(IH.form._condPt || []);
    (IH.form._pick || []).forEach(function (id) { var tp = R.template(id); if (!tp) return; var c = JSON.parse(JSON.stringify(Object.assign({ tpl: tp.id }, tp.c))); if (pts.length > 1 && tp.pt) c.pt = tp.pt.filter(function (p) { return pts.indexOf(p) >= 0; }); IH.form.conds.push(c); });
    IH.form._pick = []; IH.closeModal(); rerender();
  };

  /* promene parametara: IH.form.conds je niz; osvežavanje preko IH.refreshers.conds */
  function rerender() { if (IH.refreshers.conds) IH.refreshers.conds(); }
  document.addEventListener('change', function (e) {
    var el = e.target; if (!el.dataset || el.dataset.cr == null || !IH.form.conds) return;
    var c = IH.form.conds[+el.dataset.cr], f = el.dataset.cf; if (!c) return;
    if (f === 'value') { var a = R.attr(c.attr) || {}; c.value = el.value === 'true' ? true : el.value === 'false' ? false : (a.type === 'amount' || a.type === 'number') ? (parseFloat(String(el.value).replace(/\./g, '').replace(',', '.')) || 0) : el.value; }
    else if (f === 'win') { var q = String(el.value).split('|'); c.window = c.window || { from: 'datum_prodaje' }; c.window.n = +q[0]; c.window.unit = q[1] || 'd'; }
    rerender();
  });
  IH.act['cond-rm'] = function (el) { IH.form.conds.splice(+el.dataset.arg, 1); rerender(); };
})();
