/* Incentive Hub — Bonus šeme (Administrator)
   Tabovi: Šeme · Raspoređeni zaposleni · Kampanjski dodaci.
   Jedna forma u sekcijama (Osnovno · Targeti · Isplata po targetu · Pravila između targeta · Ostala pravila · Primer isplate) — ista za kreiranje, novu verziju i pregled.
   Tri tipa: bonus za ostvaren target, provizija po prodaji i bonus + provizija iznad targeta (osnovica do 100% + provizija iznad 100%).
   Verzija šeme nosi sve parametre koji menjaju obračun; planirana verzija važi od svog datuma, a pregled i primer obračuna mogu da se gledaju za svaku verziju. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2, V = IH.veze;

  IH.addStrings({
    'sc.title': 'Bonus šeme', 'sc.new': 'Nova šema', 'sc.search': 'Naziv šeme', 'sc.back': 'Nazad', 'sc.tabSchemes': 'Šeme', 'sc.tabAddons': 'Kampanjski dodaci',
    'sc.colName': 'Šema', 'sc.colType': 'Tip', 'sc.colPos': 'Pozicija', 'sc.colPer': 'Period', 'sc.colTg': 'Targeti', 'sc.colBase': 'Osnovica', 'sc.colLimit': 'Limit', 'sc.colStaff': 'Zaposlenih', 'sc.colCost': 'Trošak', 'sc.colVer': 'Verzija', 'sc.colPlanned': 'Planirana verzija',
    'sc.tExample': 'Primer obračuna', 'sc.tStaff': 'Raspoređeni zaposleni', 'sc.kCap': 'Na limitu',
    'sc.type.scorecard': 'Bonus za ostvaren target', 'sc.type.provizija': 'Provizija po prodaji', 'sc.type.kombinovana': 'Bonus + provizija iznad targeta',
    'sc.colTarget': 'Target', 'sc.colShare': 'Udeo', 'sc.colAt100': 'Bonus na 100%', 'sc.colVal': 'Provizija po prodaji', 'sc.colOver': 'Provizija iznad targeta', 'sc.colUnitV': 'Jedinica', 'sc.colEx': 'Primer', 'sc.colKind': 'Vrsta', 'sc.colPt': 'Vrsta proizvoda', 'sc.colSeg': 'Grupa klijenata', 'sc.colMode': 'Meri se',
    'sc.scaleTitle': 'Skala isplate', 'sc.from': 'Ostvarenje od', 'sc.to': 'do', 'sc.pay': 'Isplata', 'sc.addBand': 'Dodaj prag', 'sc.scaleTxt': 'Ispod {a} nema isplate', 'sc.scaleBand': 'od {a} do {b}: {f}', 'sc.scaleTop': 'preko {a}: {f}',
    'sc.scaleType': 'Vrsta skale', 'sc.scStep': 'Stepenasta', 'sc.scLin': 'Linearna', 'sc.linMin': 'Prag (ispod nema isplate)', 'sc.linCap': 'Plafon', 'sc.linEq': 'isplata = ostvarenje',
    'sc.cont': 'Kontinuitet', 'sc.contTxt': '{a} dodatno kada je {k} ≥ {m} u {n} uzastopna perioda', 'sc.contOn': 'Uključi kontinuitet', 'sc.contTarget': 'Target', 'sc.contMin': 'Uslov ≥', 'sc.contN': 'Uzastopnih perioda', 'sc.contAmt': 'Iznos (RSD)', 'sc.contOff': 'Bez kontinuiteta',
    'sc.carry': 'Negativan saldo se prenosi u sledeći obračun', 'sc.noCarry': 'Negativan saldo se ne prenosi', 'sc.limit': 'Limit po periodu', 'sc.base': 'Osnovica po periodu', 'sc.baseM3': 'Osnovica po članu tima', 'sc.teamF': 'Timski faktor', 'sc.split': 'Podela bonusa tima', 'sc.splitEq': 'Na jednake delove', 'sc.splitMgr': 'Po odluci menadžera',
    'sc.tfM2': 'Udeo zaposlenih ({p}) sa targetom {t} najmanje {m}', 'sc.tfM3': 'Broj targeta tima sa ostvarenjem najmanje {m}', 'sc.tfPos': 'Pozicije', 'sc.tfTarget': 'Target', 'sc.tfMin': 'Na targetu od', 'sc.tfShare': 'Udeo zaposlenih', 'sc.tfCount': 'Broj targeta',
    'sc.rule': 'Pravilo', 'sc.value': 'Vrednost', 'sc.other': 'Ostala pravila',
    'sc.exTotal': 'Isplata', 'sc.exAch': 'Ostvarenje {a} od {t} = {p}', 'sc.exItems': '{n} prodaja', 'sc.exScore': 'osnovica {b} × udeo {s} = {v} × isplata {p}', 'sc.exProv': '{n} prodaja · vrednost {v} × isplata {p}', 'sc.exDep': ' × pravila {d}', 'sc.exKap': ' · kap {k}',
    'sc.exOver': ' + iznad targeta {o} × {v} = {e}', 'sc.exSt': 'Storno', 'sc.exClosed': 'zatvoreno {n}', 'sc.exWait': 'čeka uslov {n}', 'sc.exCont': 'Kontinuitet', 'sc.exCorr': 'Korekcije', 'sc.exCarry': 'Prenos negativnog salda', 'sc.exPrior': 'Ispravka isplaćenog perioda',
    'sc.exLimit': 'Limit {l} — iznos iznad limita se ne isplaćuje', 'sc.exNoLimit': 'Limit {l} nije dostignut', 'sc.exAddon': 'Kampanjski dodatak', 'sc.exAddonTxt': '{n} prodaja · {v}', 'sc.exAddonCap': ' · limit {l}', 'sc.exVer': 'Šema {s} v{v} · targeti: {t}',
    'sc.exTeamShare': 'Na targetu: {a} od {b}', 'sc.exPayPct': 'Isplata u odnosu na osnovicu', 'sc.exBase': 'Osnovica', 'sc.exProrata': 'proracija', 'sc.noScheme': 'Bez raspoređene šeme — bonus se ne obračunava',
    'sc.vActive': 'važeća', 'sc.vOld': 'prethodna', 'sc.vPlanned': 'planirana od {d}', 'sc.verSel': 'Verzija', 'sc.sim': 'Simulacija: verzija v{v} nad podacima za {p}', 'sc.cmp': 'Važeća v{a}: {x} · v{b}: {y} · razlika {d}',
    'sc.newVer': 'Nova verzija', 'sc.example': 'Primer obračuna', 'sc.archive': 'Arhiviraj', 'sc.archUsed': 'Šema je raspoređena na {n} zaposlenih. Arhiviranje je moguće tek kada se zaposlenima rasporedi druga šema.', 'sc.archTxt': 'Šema nema raspoređenih zaposlenih i biće arhivirana.',
    'sc.sBasic': 'Osnovno', 'sc.sTargets': 'Targeti', 'sc.sPay': 'Isplata po targetu', 'sc.sRules': 'Pravila između targeta', 'sc.sExample': 'Primer isplate',
    'sc.exAll': 'Ostvarenje svih targeta', 'sc.exPay': 'Isplata', 'sc.exNote': 'Napomena', 'sc.exCap': 'ograničeno limitom', 'sc.exCondOn': 'aktivno pravilo', 'sc.exTeam': 'uz timski faktor ×1,0',
    'w.s1': 'Osnovno', 'w.s2': 'Targeti', 'w.s3': 'Isplata po targetu', 'w.s4': 'Pravila', 'w.s5': 'Pregled i aktivacija',
    'w.type': 'Tip šeme', 'w.name': 'Naziv šeme', 'w.code': 'Oznaka', 'w.pos': 'Pozicija', 'w.perType': 'Period obračuna', 'w.from': 'Važi od', 'w.to': 'Važi do', 'w.note': 'Napomena verzije', 'w.ver': 'Verzija', 'w.base': 'Osnovica — bonus na 100% (RSD)', 'w.limit': 'Limit po periodu (RSD)', 'w.status': 'Status',
    'w.calc': 'Način obračuna', 'w.calcTeam': 'Timski (zajednički bonus tima)', 'w.calcInd': 'Individualni (bonus po zaposlenom)',
    'w.selCount': 'U šemi: {n} targeta', 'w.newTarget': 'Novi target', 'w.noTargets': 'Nema aktivnih targeta za izabranu poziciju i period.', 'w.shareSum': 'Zbir udela', 'w.shareWarn': 'Zbir udela mora biti 100%',
    'w.exPct': '{v} prodaje vredi {r}', 'w.exKom': '1 prodaja vredi {r}', 'w.exBod': '1 bod vredi {r}',
    'w.chk1': 'Osnovni podaci su popunjeni', 'w.chk2': 'Bar dva targeta u šemi', 'w.chk3': 'Skala pokriva ostvarenje od 0% naviše', 'w.chk4': 'Zbir udela je 100%', 'w.chk5': 'Svaki target ima proviziju po prodaji', 'w.chk6': 'Važi od {d} — tekući obračun se ne menja', 'w.chk7': 'Pravila se odnose samo na targete iz šeme',
    'w.activate': 'Aktiviraj šemu', 'w.saveDraft': 'Sačuvaj nacrt', 'w.saveVer': 'Sačuvaj verziju', 'w.saved': 'Šema „{n}“ je sačuvana', 'w.activated': 'Šema „{n}“ je aktivna od {d}', 'w.verSaved': 'Verzija v{v} šeme „{n}“ važi od {d}',
    'w.editDraft': 'Nastavi uređivanje', 'w.titleNew': 'Nova bonus šema', 'w.titleCopy': 'Kopija šeme', 'w.titleVer': 'Nova verzija šeme', 'w.titleEdit': 'Izmena nacrta',
    'm.M1': 'Individualni', 'm.M2': 'Menadžerski', 'm.M3': 'Timski', 'role.primarni': 'Primarni', 'role.sekundarni': 'Sekundarni', 'role.informativni': 'Informativni',
    'ad.title': 'Kampanjski dodaci', 'ad.new': 'Novi dodatak', 'ad.search': 'Naziv dodatka', 'ad.colName': 'Dodatak', 'ad.colProd': 'Proizvodi', 'ad.colVal': 'Vrednost po prodaji', 'ad.colLimit': 'Limit po zaposlenom', 'ad.colFrom': 'Važi od', 'ad.colTo': 'Važi do', 'ad.colSch': 'Šeme', 'ad.colCost': 'Trošak (proj.)',
    'ad.fName': 'Naziv dodatka', 'ad.fPt': 'Vrsta proizvoda', 'ad.fSegs': 'Grupa klijenata', 'ad.fProds': 'Proizvodi', 'ad.fKind': 'Vrednost se računa', 'ad.kRsd': 'RSD po prodaji', 'ad.kPct': '% iznosa', 'ad.fVal': 'Vrednost', 'ad.fLimit': 'Limit po zaposlenom u periodu (RSD)', 'ad.fFrom': 'Važi od', 'ad.fTo': 'Važi do', 'ad.fSch': 'Važi za šeme',
    'ad.s1': 'Osnovno', 'ad.s2': 'Šta se nagrađuje', 'ad.s3': 'Iznos i šeme', 'ad.save': 'Aktiviraj dodatak', 'ad.saved': 'Dodatak „{n}“ važi od {d}', 'ad.end': 'Završi dodatak', 'ad.endTxt': 'Dodatak prestaje da važi danas. Prodaje do danas ostaju u obračunu.', 'ad.ended': 'Dodatak „{n}“ je završen',
    'ad.chk1': 'Naziv i period su popunjeni', 'ad.chk2': 'Dodatak ima limit po zaposlenom', 'ad.chk3': 'Dodatak obuhvata više od jednog proizvoda', 'ad.chk4': 'Izabrana je bar jedna šema', 'ad.one': 'samo jedan proizvod'
  }, {
    'sc.title': 'Bonus schemes', 'sc.new': 'New scheme', 'sc.search': 'Scheme name', 'sc.back': 'Back', 'sc.tabSchemes': 'Schemes', 'sc.tabAddons': 'Campaign add-ons',
    'sc.colName': 'Scheme', 'sc.colType': 'Type', 'sc.colPos': 'Position', 'sc.colPer': 'Period', 'sc.colTg': 'Targets', 'sc.colBase': 'Base', 'sc.colLimit': 'Limit', 'sc.colStaff': 'Staff', 'sc.colCost': 'Cost', 'sc.colVer': 'Version', 'sc.colPlanned': 'Planned version',
    'sc.tExample': 'Calculation example', 'sc.tStaff': 'Assigned employees', 'sc.kCap': 'At limit',
    'sc.type.scorecard': 'Bonus for achieved target', 'sc.type.provizija': 'Commission per sale', 'sc.type.kombinovana': 'Bonus + commission above target',
    'sc.colTarget': 'Target', 'sc.colShare': 'Share', 'sc.colAt100': 'Bonus at 100%', 'sc.colVal': 'Commission per sale', 'sc.colOver': 'Commission above target', 'sc.colUnitV': 'Unit', 'sc.colEx': 'Example', 'sc.colKind': 'Type', 'sc.colPt': 'Product type', 'sc.colSeg': 'Client group', 'sc.colMode': 'Measured',
    'sc.scaleTitle': 'Payout scale', 'sc.from': 'Achievement from', 'sc.to': 'to', 'sc.pay': 'Payout', 'sc.addBand': 'Add threshold', 'sc.scaleTxt': 'Below {a} no payout', 'sc.scaleBand': 'from {a} to {b}: {f}', 'sc.scaleTop': 'above {a}: {f}',
    'sc.scaleType': 'Scale type', 'sc.scStep': 'Stepped', 'sc.scLin': 'Linear', 'sc.linMin': 'Threshold (no payout below)', 'sc.linCap': 'Cap', 'sc.linEq': 'payout = achievement',
    'sc.cont': 'Continuity', 'sc.contTxt': '{a} extra when {k} ≥ {m} for {n} consecutive periods', 'sc.contOn': 'Enable continuity', 'sc.contTarget': 'Target', 'sc.contMin': 'Condition ≥', 'sc.contN': 'Consecutive periods', 'sc.contAmt': 'Amount (RSD)', 'sc.contOff': 'No continuity',
    'sc.carry': 'Negative balance carries into the next calculation', 'sc.noCarry': 'Negative balance is not carried', 'sc.limit': 'Limit per period', 'sc.base': 'Base per period', 'sc.baseM3': 'Base per team member', 'sc.teamF': 'Team factor', 'sc.split': 'Team bonus split', 'sc.splitEq': 'Equal shares', 'sc.splitMgr': 'Decided by the manager',
    'sc.tfM2': 'Share of employees ({p}) with target {t} at least {m}', 'sc.tfM3': 'Number of team targets with achievement at least {m}', 'sc.tfPos': 'Positions', 'sc.tfTarget': 'Target', 'sc.tfMin': 'On target from', 'sc.tfShare': 'Share of employees', 'sc.tfCount': 'Number of targets',
    'sc.rule': 'Rule', 'sc.value': 'Value', 'sc.other': 'Other rules',
    'sc.exTotal': 'Payout', 'sc.exAch': 'Achievement {a} of {t} = {p}', 'sc.exItems': '{n} sales', 'sc.exScore': 'base {b} × share {s} = {v} × payout {p}', 'sc.exProv': '{n} sales · value {v} × payout {p}', 'sc.exDep': ' × rules {d}', 'sc.exKap': ' · cap {k}',
    'sc.exOver': ' + above target {o} × {v} = {e}', 'sc.exSt': 'Reversal', 'sc.exClosed': 'closed {n}', 'sc.exWait': 'awaiting condition {n}', 'sc.exCont': 'Continuity', 'sc.exCorr': 'Adjustments', 'sc.exCarry': 'Negative balance carried', 'sc.exPrior': 'Paid period fix',
    'sc.exLimit': 'Limit {l} — the amount above the limit is not paid', 'sc.exNoLimit': 'Limit {l} not reached', 'sc.exAddon': 'Campaign add-on', 'sc.exAddonTxt': '{n} sales · {v}', 'sc.exAddonCap': ' · limit {l}', 'sc.exVer': 'Scheme {s} v{v} · targets: {t}',
    'sc.exTeamShare': 'On target: {a} of {b}', 'sc.exPayPct': 'Payout relative to base', 'sc.exBase': 'Base', 'sc.exProrata': 'prorated', 'sc.noScheme': 'No scheme assigned — no bonus is calculated',
    'sc.vActive': 'current', 'sc.vOld': 'previous', 'sc.vPlanned': 'planned from {d}', 'sc.verSel': 'Version', 'sc.sim': 'Simulation: version v{v} on data for {p}', 'sc.cmp': 'Current v{a}: {x} · v{b}: {y} · difference {d}',
    'sc.newVer': 'New version', 'sc.example': 'Calculation example', 'sc.archive': 'Archive', 'sc.archUsed': 'The scheme is assigned to {n} employees. It can be archived only after they are assigned another scheme.', 'sc.archTxt': 'The scheme has no assigned employees and will be archived.',
    'sc.sBasic': 'Basics', 'sc.sTargets': 'Targets', 'sc.sPay': 'Payout per target', 'sc.sRules': 'Rules between targets', 'sc.sExample': 'Payout example',
    'sc.exAll': 'Achievement of all targets', 'sc.exPay': 'Payout', 'sc.exNote': 'Note', 'sc.exCap': 'capped by the limit', 'sc.exCondOn': 'rule active', 'sc.exTeam': 'with team factor ×1.0',
    'w.s1': 'Basics', 'w.s2': 'Targets', 'w.s3': 'Payout per target', 'w.s4': 'Rules', 'w.s5': 'Review and activation',
    'w.type': 'Scheme type', 'w.name': 'Scheme name', 'w.code': 'Code', 'w.pos': 'Position', 'w.perType': 'Calculation period', 'w.from': 'Valid from', 'w.to': 'Valid to', 'w.note': 'Version note', 'w.ver': 'Version', 'w.base': 'Base — bonus at 100% (RSD)', 'w.limit': 'Limit per period (RSD)', 'w.status': 'Status',
    'w.calc': 'Calculation', 'w.calcTeam': 'Team (shared team bonus)', 'w.calcInd': 'Individual (bonus per employee)',
    'w.selCount': 'In scheme: {n} targets', 'w.newTarget': 'New target', 'w.noTargets': 'No active targets for the chosen position and period.', 'w.shareSum': 'Sum of shares', 'w.shareWarn': 'The sum of shares must be 100%',
    'w.exPct': 'A {v} sale is worth {r}', 'w.exKom': '1 sale is worth {r}', 'w.exBod': '1 point is worth {r}',
    'w.chk1': 'Basic data is filled', 'w.chk2': 'At least two targets in the scheme', 'w.chk3': 'The scale covers achievement from 0% upwards', 'w.chk4': 'The sum of shares is 100%', 'w.chk5': 'Every target has a commission per sale', 'w.chk6': 'Valid from {d} — the current calculation is not changed', 'w.chk7': 'Rules refer only to targets in the scheme',
    'w.activate': 'Activate scheme', 'w.saveDraft': 'Save draft', 'w.saveVer': 'Save version', 'w.saved': 'Scheme "{n}" saved', 'w.activated': 'Scheme "{n}" active from {d}', 'w.verSaved': 'Version v{v} of scheme "{n}" valid from {d}',
    'w.editDraft': 'Continue editing', 'w.titleNew': 'New bonus scheme', 'w.titleCopy': 'Copy of scheme', 'w.titleVer': 'New scheme version', 'w.titleEdit': 'Edit draft',
    'm.M1': 'Individual', 'm.M2': 'Manager', 'm.M3': 'Team', 'role.primarni': 'Primary', 'role.sekundarni': 'Secondary', 'role.informativni': 'Informative',
    'ad.title': 'Campaign add-ons', 'ad.new': 'New add-on', 'ad.search': 'Add-on name', 'ad.colName': 'Add-on', 'ad.colProd': 'Products', 'ad.colVal': 'Value per sale', 'ad.colLimit': 'Limit per employee', 'ad.colFrom': 'Valid from', 'ad.colTo': 'Valid to', 'ad.colSch': 'Schemes', 'ad.colCost': 'Cost (proj.)',
    'ad.fName': 'Add-on name', 'ad.fPt': 'Product type', 'ad.fSegs': 'Client group', 'ad.fProds': 'Products', 'ad.fKind': 'Value is calculated', 'ad.kRsd': 'RSD per sale', 'ad.kPct': '% of amount', 'ad.fVal': 'Value', 'ad.fLimit': 'Limit per employee per period (RSD)', 'ad.fFrom': 'Valid from', 'ad.fTo': 'Valid to', 'ad.fSch': 'Applies to schemes',
    'ad.s1': 'Basics', 'ad.s2': 'What is rewarded', 'ad.s3': 'Amount and schemes', 'ad.save': 'Activate add-on', 'ad.saved': 'Add-on "{n}" valid from {d}', 'ad.end': 'End add-on', 'ad.endTxt': 'The add-on ends today. Sales up to today stay in the calculation.', 'ad.ended': 'Add-on "{n}" ended',
    'ad.chk1': 'Name and period are filled', 'ad.chk2': 'The add-on has a limit per employee', 'ad.chk3': 'The add-on covers more than one product', 'ad.chk4': 'At least one scheme is selected', 'ad.one': 'one product only'
  });

  function deep(o) { return JSON.parse(JSON.stringify(o)); }
  function num(s) { var x = String(s == null ? '' : s).trim(); if (!x) return null; x = IH.state.lang === 'sr' ? x.replace(/\./g, '').replace(',', '.') : x.replace(/,/g, ''); var n = parseFloat(x.replace(/[^\d.\-]/g, '')); return isNaN(n) ? null : n; }
  IH.schemes = function () { return D.schemes.concat(IH.list('newSchemes')); };
  var baseScheme = D.scheme;
  D.scheme = function (id) { return baseScheme(id) || IH.list('newSchemes').filter(function (s) { return s.id === id; })[0] || IH.schemes().filter(function (s) { return s.code === id; })[0]; };
  /* tekući period vrste šeme (ako ga nema: prvi planirani) i poslednji zaključeni */
  function nowPid(s) { var c = D.allPeriods().filter(function (p) { return p.type === s.periodType && p.status === 'u_toku'; })[0] || D.plannedOf(s.periodType)[0]; return c ? c.id : '2026-Q4'; }
  function lastPid(s) { var c = D.periods.filter(function (p) { return p.type === s.periodType && p.status !== 'u_toku'; }).sort(function (a, b) { return a.from < b.from ? 1 : -1; })[0]; return c ? c.id : nowPid(s); }
  /* verzija koja važi danas; sve verzije; stanje verzije */
  function curVer(s) { return D.schemeVersion(s, nowPid(s)); }
  function vers(s) { return D.schemeVersions(s); }
  function planned(s) { return vers(s).filter(function (v) { return v.from > D.DATA_AS_OF; }); }
  function verLabel(s, v) { var c = curVer(s); return 'v' + v.v + ' · ' + (v.v === c.v ? t('sc.vActive') : v.from > D.DATA_AS_OF ? t('sc.vPlanned', { d: F.date(v.from) }) : t('sc.vOld')); }
  function verByNo(s, n) { return vers(s).filter(function (v) { return String(v.v) === String(n); })[0]; }
  /* parametri šeme za verziju */
  function sAt(s, v) { return EN.schemeIn(s, null, { ver: v }); }
  function tgOf(s, tc) { return EN.targetOf(tc, s); }
  function staffOf(s, pid) { pid = pid || lastPid(s); return D.employees.filter(function (e) { if (!e.branch) return false; var x = EN.schemeFor(e.id, pid); return x && x.id === s.id; }); }
  var costCache = {};
  function cost(s) {
    if (!s.versions || s.status === 'nacrt') return null;
    var k = s.id + '|' + JSON.stringify(IH.state.data.vals || {}).length + '|' + (IH.state.data.newAssignments || []).length;
    if (costCache[k]) return costCache[k];
    var pid = lastPid(s), rs = staffOf(s).filter(function (e) { return e.since <= D.period(pid).to; }).map(function (e) { return EN.result(e.id, pid); }).filter(Boolean);
    var c = { sum: rs.reduce(function (a, r) { return a + r.payout; }, 0), n: rs.length, cap: rs.filter(function (r) { return r.capped; }).length, zero: rs.filter(function (r) { return !r.payout; }).length };
    c.avg = c.n ? c.sum / c.n : 0;
    costCache[k] = c; return c;
  }
  function typeName(s) { return t('sc.type.' + (s.type || 'scorecard')); }
  function fmtVal(x, unit) { if (!x) return '—'; return x.k === 'pct' ? F.num(x.v * 100, 2) + '% ' + IH.L(L('iznosa', 'of amount')) : F.rsd(x.v) + ' / ' + (unit === 'bod' ? t('u.bod1') : t('u.kom')); }
  function limitOf(v) { return v.limit || (v.base * (v.capFactor || 1.5)) || 0; }
  function tgName(s, key) { return V.nameOf(s, key); }
  function branchTargets(s) { return IH.targets().filter(function (x) { return x.kind === 'timski' && x.status === 'aktivan' && x.periodType === s.periodType && (x.team || []).length > 1; }); }
  /* skala */
  function scaleHtml(sc, cur) {
    if (sc.type === 'linear') {
      var on0 = cur != null && cur < sc.min, on2 = cur != null && cur >= sc.cap, on1 = cur != null && !on0 && !on2;
      return '<div class="scale"><div class="sc' + (on0 ? ' on' : '') + '"><b>0%</b>&lt; ' + F.pct(sc.min) + '</div><div class="sc' + (on1 ? ' on' : '') + '"><b>' + (on1 ? F.pct(cur) : '=') + '</b>' + F.pct(sc.min) + ' – ' + F.pct(sc.cap) + '</div><div class="sc' + (on2 ? ' on' : '') + '"><b>' + F.pct(sc.cap) + '</b>≥ ' + F.pct(sc.cap) + '</div></div>';
    }
    var lo = 0;
    return '<div class="scale">' + sc.map(function (b) { var on = cur != null && cur >= lo && (b.to == null || cur < b.to); var l = b.to == null ? '≥ ' + F.pct(lo) : F.pct(lo) + ' – ' + F.pct(b.to - 0.0001); lo = b.to; return '<div class="sc' + (on ? ' on' : '') + '"><b>' + F.pct(b.f) + '</b>' + l + '</div>'; }).join('') + '</div>';
  }
  function scaleText(sc) {
    if (sc.type === 'linear') return t('sc.scaleTxt', { a: F.pct(sc.min) }) + '; ' + F.pct(sc.min) + ' – ' + F.pct(sc.cap) + ': ' + t('sc.linEq') + '; ' + t('sc.scaleTop', { a: F.pct(sc.cap), f: F.pct(sc.cap) }) + '.';
    var lo = 0, parts = [];
    sc.forEach(function (b, i) {
      if (i === 0 && b.f === 0) parts.push(t('sc.scaleTxt', { a: F.pct(b.to) }));
      else if (b.to == null) parts.push(t('sc.scaleTop', { a: F.pct(lo), f: F.pct(b.f) }));
      else parts.push(t('sc.scaleBand', { a: F.pct(lo), b: F.pct(b.to), f: F.pct(b.f) }));
      lo = b.to;
    });
    return parts.join('; ') + '.';
  }
  IH.schemeScaleText = scaleText;
  IH.schemeCondText = function (s, d) { return V.text(s, d, true); };
  function tfText(s) {
    var tf = s.teamFactor; if (!tf) return '';
    if (tf.bands) {
      var tg = D.target(tf.target), lo = 0;
      return t('sc.tfM2', { p: (tf.pos || ['licni']).map(D.posName).join(', ').toLowerCase(), t: '<b>' + IH.esc(tg ? IH.L(tg.name) : '—') + '</b>', m: F.pct(tf.min != null ? tf.min : 1) }) + ': ' + tf.bands.map(function (b) { var l = (b.to == null ? '≥ ' + F.pct(lo) : F.pct(lo) + '–' + F.pct(b.to)) + ' → ×' + F.num(b.f, 1); lo = b.to; return l; }).join(', ');
    }
    return t('sc.tfM3', { m: F.pct(tf.min != null ? tf.min : 1) }) + ': ' + tf.byCount.map(function (f, i) { return i + ' → ×' + F.num(f, 1); }).join(', ');
  }

  /* ================= LISTA ================= */
  function tabs(cur) { return ui.rtabs('seme', [{ id: '', label: t('sc.tabSchemes'), icon: 'layers' }, { id: 'rasporedi', label: t('ra.title'), icon: 'calendar' }, { id: 'dodaci', label: t('sc.tabAddons'), icon: 'trend', cnt: IH.addons().filter(function (a) { return a.status === 'aktivan'; }).length }], cur); }
  IH.semeTabs = tabs;
  function listPage() {
    var grid = IH.grid({
      id: 'sch', exportName: 'Bonus_seme.xlsx', create: { label: t('sc.new'), act: 'sch-new' }, hidden: ['per', 'ver'], searchLabel: t('sc.search'),
      rows: IH.schemes, key: function (s) { return s.id; }, label: function (s) { return IH.L(s.name); }, searchKeys: ['n'],
      rowCls: function (s) { return s.status === 'arhiviran' ? 'muted' : ''; },
      cols: [
        { key: 'st', label: t('c.status'), val: function (s) { return s.status; }, render: function (s) { return ui.st2(s.status) + (s.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); }, filter: function () { return ['aktivan', 'nacrt', 'arhiviran'].map(function (k) { return { v: k, l: t('st2.' + k) }; }); } },
        { key: 'n', label: t('sc.colName'), val: function (s) { return IH.L(s.name); }, render: function (s) { return '<b>' + IH.esc(IH.L(s.name)) + '</b>'; } },
        { key: 'ty', label: t('sc.colType'), val: function (s) { return typeName(sAt(s, curVer(s))); }, fval: function (s) { return sAt(s, curVer(s)).type || 'scorecard'; }, filter: function () { return D.schemeTypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'pos', label: t('sc.colPos'), val: function (s) { return D.posName(s.pos); }, fval: function (s) { return s.pos; }, filter: function () { return ['licni', 'univerzalni', 'menadzer'].map(function (k) { return { v: k, l: D.posName(k) }; }); } },
        { key: 'per', label: t('sc.colPer'), val: function (s) { return t('per.' + s.periodType); } },
        { key: 'tg', label: t('sc.colTg'), num: true, search: false, val: function (s) { return sAt(s, curVer(s)).targets.length; } },
        { key: 'base', label: t('sc.colBase'), num: true, search: false, val: function (s) { return curVer(s).base || 0; }, render: function (s) { var v = curVer(s); return v.base && sAt(s, v).type !== 'provizija' ? F.num(v.base) : '<span class="mut">—</span>'; } },
        { key: 'lim', label: t('sc.colLimit'), num: true, search: false, val: function (s) { return limitOf(curVer(s)); }, render: function (s) { return F.num(limitOf(curVer(s))); } },
        { key: 'e', label: t('sc.colStaff'), num: true, search: false, val: function (s) { return s.status === 'nacrt' ? 0 : staffOf(s).length; } },
        { key: 'c', label: t('sc.colCost') + ' · ' + 'Q3', num: true, search: false, val: function (s) { var c = cost(s); return c ? c.sum : 0; }, render: function (s) { var c = cost(s); return c ? F.num(c.sum) : '<span class="mut">—</span>'; } },
        { key: 'ver', label: t('sc.colVer'), num: true, search: false, val: function (s) { return curVer(s).v; }, render: function (s) { return 'v' + curVer(s).v; } },
        { key: 'pl', label: t('sc.colPlanned'), search: false, val: function (s) { var p = planned(s); return p.length ? p[p.length - 1].from : ''; }, render: function (s) { var p = planned(s); return p.length ? ui.pill('v' + p[p.length - 1].v + ' · ' + F.date(p[p.length - 1].from), 'warning') : '<span class="mut">—</span>'; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (s) { return 'seme/' + s.id; } },
        { type: 'edit', title: t('w.editDraft'), act: 'sch-edit', kind: 'acc', show: function (s) { return s.status === 'nacrt' && s.isNew; } },
        { type: 'edit', title: t('sc.newVer'), act: 'sch-ver', kind: 'acc', show: function (s) { return s.status !== 'nacrt'; } },
        { icon: 'calc', title: t('sc.example'), act: 'g-go', arg: function (s) { return 'seme/' + s.id + '/primer'; }, show: function (s) { return s.status !== 'nacrt'; } },
        { icon: 'users', title: t('sc.tStaff'), act: 'g-go', arg: function (s) { return 'seme/' + s.id + '/zaposleni'; }, show: function (s) { return s.status !== 'nacrt'; } },
        { type: 'history', title: t('g.aHistory'), act: 'sch-hist' },
        { type: 'copy', title: t('g.aCopy'), act: 'sch-copy' },
        { type: 'delete', title: t('sc.archive'), act: 'sch-arch', kind: 'dan', show: function (s) { return s.status !== 'arhiviran'; } }
      ]
    });
    return ui.header(t('sc.title')) + tabs('') + (IH.rasBanner ? IH.rasBanner() : '') + grid;
  }
  function schHist(s) {
    var h = IH.auditFor('scheme', s.id), c = curVer(s);
    vers(s).slice().reverse().forEach(function (v) {
      if (v.from > D.DATA_AS_OF) h.push({ at: (v.at || IH.now()), by: 'A001', action: { sr: 'Planirana verzija v' + v.v + ' od ' + F.date(v.from), en: 'Planned version v' + v.v + ' from ' + F.date(v.from) }, detail: v.note });
      else h.push({ at: v.from + 'T08:00', by: 'A001', action: { sr: (v.v === c.v ? 'Važi verzija v' : 'Važila verzija v') + v.v + (v.to ? ' do ' + F.date(v.to) : ''), en: 'Version v' + v.v + ' in force' + (v.to ? ' to ' + F.date(v.to) : '') }, detail: v.note });
    });
    return h;
  }
  IH.act['sch-hist'] = function (el) { var s = D.scheme(el.dataset.arg); IH.showHistory(IH.L(s.name), schHist(s)); };
  IH.act['sch-arch'] = function (el) {
    var s = D.scheme(el.dataset.arg), n = s.status === 'nacrt' ? 0 : staffOf(s).length;
    IH.modal({ title: t('sc.archive') + ' — ' + IH.esc(IH.L(s.name)), body: n ? '<div class="note warn">' + t('sc.archUsed', { n: n }) + '</div>' : '<p style="margin:0">' + t('sc.archTxt') + '</p>', foot: ui.btn(t('c.close'), { act: 'modal-close' }) + (n ? '' : ui.btn(t('sc.archive'), { cls: 'danger', icon: 'trash', act: 'sch-arch-ok', arg: s.id })) });
  };
  IH.act['sch-arch-ok'] = function (el) { var s = IH.list('newSchemes').filter(function (x) { return x.id === el.dataset.arg; })[0]; if (s) s.status = 'arhiviran'; IH.audit('scheme', el.dataset.arg, { sr: 'Šema arhivirana', en: 'Scheme archived' }); IH.save(); IH.closeModal(); IH.render(); };

  /* ================= FORMA ŠEME (pregled i korak „Pregled i aktivacija“) ================= */
  function section(title, body) { return '<div class="fsec"><h3>' + title + '</h3>' + body + '</div>'; }
  function basicView(s, v) {
    var prov = s.type === 'provizija';
    return ui.form([
      { k: 'sv_ty', label: t('w.type'), value: typeName(s) }, { k: 'sv_n', label: t('w.name'), value: IH.L(s.name), full: true },
      { k: 'sv_c', label: t('w.code'), value: s.code }, { k: 'sv_p', label: t('w.pos'), value: D.posName(s.pos) }, { k: 'sv_pt', label: t('w.perType'), value: t('per.' + s.periodType) },
      { k: 'sv_f', label: t('w.from'), value: F.date(v.from) }, { k: 'sv_t', label: t('w.to'), value: v.to ? F.date(v.to) : IH.L(L('Bez kraja', 'Open-ended')) }, { k: 'sv_v', label: t('w.ver'), value: s.versions ? verLabel(s, v) : 'v' + v.v },
      prov ? { k: 'sv_b', label: t('w.base'), value: '—' } : { k: 'sv_b', label: s.pos === 'univerzalni' && s.model !== 'M1' ? t('sc.baseM3') : t('w.base'), value: F.num(v.base || 0) },
      { k: 'sv_l', label: t('w.limit'), value: F.num(limitOf(v)) }, { k: 'sv_s', label: t('w.status'), value: t('st2.' + s.status) },
      { k: 'sv_note', label: t('w.note'), value: IH.L(v.note) || '', full: true }
    ], { readonly: true, cols: 3 });
  }
  function modeTxt(tg) { return tg.mode === 'neto' ? IH.L(L('Neto (otvoreni − zatvoreni)', 'Net (opened − closed)')) : tg.dir === 'opadajuci' ? IH.L(L('Manje je bolje', 'Lower is better')) : IH.L(L('Prodaja u periodu', 'Sales in the period')); }
  function targetsView(s) {
    return ui.table([{ key: 'n', label: t('sc.colTarget') }, { key: 'k', label: t('sc.colKind') }, { key: 'pt', label: t('sc.colPt') }, { key: 'sg', label: t('sc.colSeg') }, { key: 'u', label: t('sc.colUnitV') }],
      s.targets.map(function (tc) { var tg = tgOf(s, tc); if (!tg) return null; return { n: '<b>' + IH.esc(IH.L(tg.name)) + '</b>', k: tg.kind === 'timski' ? t('k.team') : t('k.ind'), pt: D.subjPtypeName(tg.subject), sg: (tg.subject.segs || []).length === D.segments.length ? IH.L(L('Sve grupe', 'All groups')) : (tg.subject.segs || []).map(D.segName).join(', '), u: IH.unitTxt(tg.unit) }; }).filter(Boolean), { compact: true });
  }
  function shareOf(s, v, tc) { return v.shares && v.shares[tc.key] != null ? v.shares[tc.key] : (tc.share || 0); }
  function payTable(s, v) {
    var ty = s.type || 'scorecard', prov = ty === 'provizija', komb = ty === 'kombinovana';
    var rows = s.targets.map(function (tc) {
      var tg = tgOf(s, tc); if (!tg) return null;
      var r = { n: '<b>' + IH.esc(IH.L(tg.name)) + '</b>', u: IH.unitTxt(tg.unit) };
      if (prov || komb) { r.v = fmtVal(tc.val, tg.unit); r.ex = tc.val ? (tc.val.k === 'pct' ? t('w.exPct', { v: F.rsd(1000000), r: F.rsd(Math.round(1000000 * tc.val.v)) }) : t(tg.unit === 'bod' ? 'w.exBod' : 'w.exKom', { r: F.rsd(tc.val.v) })) : '—'; }
      if (!prov) { var sh = shareOf(s, v, tc); r.s = F.pct(sh); r.b = F.rsd(Math.round((v.base || 0) * sh)); }
      return r;
    }).filter(Boolean);
    var cols = prov ? [{ key: 'n', label: t('sc.colTarget') }, { key: 'v', label: t('sc.colVal'), num: true }, { key: 'ex', label: t('sc.colEx') }]
      : komb ? [{ key: 'n', label: t('sc.colTarget') }, { key: 's', label: t('sc.colShare'), num: true }, { key: 'b', label: t('sc.colAt100'), num: true }, { key: 'v', label: t('sc.colOver'), num: true }]
      : [{ key: 'n', label: t('sc.colTarget') }, { key: 's', label: t('sc.colShare'), num: true }, { key: 'b', label: t('sc.colAt100'), num: true }];
    var foot = prov ? null : { n: t('c.total'), s: F.pct(s.targets.reduce(function (a, tc) { return a + shareOf(s, v, tc); }, 0)), b: F.rsd(v.base || 0) };
    return ui.table(cols, rows, { compact: true, foot: foot });
  }
  function scaleView(sc) {
    if (sc.type === 'linear') return ui.table([{ key: 'a', label: t('sc.from'), num: true }, { key: 'b', label: t('sc.to'), num: true }, { key: 'f', label: t('sc.pay'), num: true }], [{ a: '0%', b: F.pct(sc.min), f: '<b>0%</b>' }, { a: F.pct(sc.min), b: F.pct(sc.cap), f: '<b>' + t('sc.linEq') + '</b>' }, { a: F.pct(sc.cap), b: '∞', f: '<b>' + F.pct(sc.cap) + '</b>' }], { compact: true });
    var lo = 0; return ui.table([{ key: 'a', label: t('sc.from'), num: true }, { key: 'b', label: t('sc.to'), num: true }, { key: 'f', label: t('sc.pay'), num: true }], sc.map(function (b) { var r = { a: F.pct(lo), b: b.to == null ? '∞' : F.pct(b.to), f: '<b>' + F.pct(b.f) + '</b>' }; lo = b.to; return r; }), { compact: true });
  }
  function otherView(s, v) {
    var rows = [];
    rows.push({ r: t('sc.cont'), v: s.continuity && v.contAmount ? t('sc.contTxt', { a: F.rsd(v.contAmount), k: '<b>' + IH.esc(tgName(s, s.continuity.target)) + '</b>', m: F.pct(s.continuity.min), n: s.continuity.periods }) : '<span class="mut">' + t('sc.contOff') + '</span>' });
    if (s.teamFactor) rows.push({ r: t('sc.teamF'), v: tfText(s) });
    if (s.model === 'M3') rows.push({ r: t('sc.split'), v: s.teamSplit === 'menadzer' ? t('sc.splitMgr') : t('sc.splitEq') });
    rows.push({ r: t('sc.limit'), v: '<b>' + F.rsd(limitOf(v)) + '</b>' });
    rows.push({ r: IH.L(L('Negativan saldo', 'Negative balance')), v: s.carryNegative ? t('sc.carry') : t('sc.noCarry') });
    return ui.table([{ key: 'r', label: t('sc.rule'), w: '190px' }, { key: 'v', label: t('sc.value') }], rows, { compact: true });
  }
  /* primer isplate: isto ostvarenje za sve targete (hipotetički, bez veze sa tekućim obračunom) */
  function exampleRows(s, v) {
    var ty = s.type || 'scorecard', prov = ty === 'provizija', komb = ty === 'kombinovana', lim = limitOf(v);
    return [0.8, 0.9, 1.0, 1.2].map(function (pct) {
      var byKey = {};
      s.targets.forEach(function (tc) {
        var tg = tgOf(s, tc); if (!tg) return;
        var r = { key: tc.key, pct: pct, ponder: EN.band(tc.scale || s.scale, komb ? Math.min(pct, 1) : pct), dep: 1, inCalc: true };
        if (prov) r.value = tc.val ? (tc.val.k === 'pct' ? (tg.base || 0) * pct * tc.val.v : Math.round((tg.base || 0) * pct) * tc.val.v) : 0;
        else { r.value = (v.base || 0) * shareOf(s, v, tc); if (komb && tc.val && pct > 1) r.extra = tc.val.k === 'pct' ? (tg.base || 0) * (pct - 1) * tc.val.v : Math.floor((tg.base || 0) * (pct - 1)) * tc.val.v; }
        byKey[tc.key] = r;
      });
      var res = EN.applyRules(s, byKey, null, lastPid(s), {});
      var sum = Object.keys(byKey).reduce(function (a, k) { return a + EN.payOf(byKey[k]); }, 0);
      var pay = Math.min(Math.round(sum), lim), on = res.some(function (x) { return x.active && x.r.tpl !== 'kap'; });
      return { p: '<b>' + F.pct(pct) + '</b>', a: F.rsd(pay), n: [sum > lim ? t('sc.exCap') : '', on ? t('sc.exCondOn') : '', s.teamFactor ? t('sc.exTeam') : ''].filter(Boolean).join(' · ') || '<span class="mut">—</span>' };
    });
  }
  function exampleView(s, v) { return ui.table([{ key: 'p', label: t('sc.exAll'), num: true }, { key: 'a', label: t('sc.exPay'), num: true }, { key: 'n', label: t('sc.exNote') }], exampleRows(s, v), { compact: true }); }
  function schemeForm(s, v) {
    return section(t('sc.sBasic'), basicView(s, v)) + section(t('sc.sTargets'), targetsView(s)) +
      section(t('sc.sPay'), payTable(s, v) + '<div class="lab" style="margin-top:14px">' + t('sc.scaleTitle') + '</div>' + scaleView(s.scale)) +
      section(t('sc.sRules'), V.view(s)) + section(t('sc.other'), otherView(s, v)) + section(t('sc.sExample'), exampleView(s, v));
  }
  function verPick(s, scope) {
    var vs = vers(s); if (vs.length < 2) return '';
    return '<div style="margin-bottom:14px">' + ui.segf(scope, 'ver', vs.map(function (v) { return { v: String(v.v), l: verLabel(s, v) }; })) + '</div>';
  }
  function detailPage(id) {
    var s = D.scheme(id); if (!s) return '<div class="empty">' + t('c.empty') + '</div>';
    var sc = IH.v('scv-' + s.id); if (!sc.ver) sc.ver = String(curVer(s).v);
    IH.refreshers['scv-' + s.id] = function () { IH.render(); };
    var v = deep(verByNo(s, sc.ver) || curVer(s)), draft = s.status === 'nacrt' && s.isNew;
    var acts = (draft ? '' : ui.btn(t('sc.example'), { icon: 'calc', go: 'seme/' + id + '/primer' }) + ui.btn(t('sc.tStaff'), { icon: 'users', go: 'seme/' + id + '/zaposleni' })) + ui.btn(t('g.aCopy'), { icon: 'copy', act: 'sch-copy', arg: id }) +
      (draft ? ui.btn(t('w.editDraft'), { cls: 'primary', icon: 'edit', act: 'sch-edit', arg: id }) : ui.btn(t('sc.newVer'), { cls: 'primary', icon: 'edit', act: 'sch-ver', arg: id }));
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('sc.back'), { icon: 'chevl', go: 'seme' }) + (draft ? ui.btn(t('w.editDraft'), { cls: 'primary', icon: 'edit', act: 'sch-edit', arg: id }) : ui.btn(t('sc.newVer'), { cls: 'primary', icon: 'edit', act: 'sch-ver', arg: id })) + '</div>';
    return ui.header(IH.esc(IH.L(s.name)), '', acts, '<a href="#/seme">' + t('sc.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(IH.L(s.name))) + verPick(s, 'scv-' + s.id) +
      '<section class="card"><div class="cb">' + schemeForm(sAt(s, v), v) + '</div>' + foot + '</section>';
  }
  function subPage(s, title, body) { return ui.header(title + ' · ' + IH.esc(IH.L(s.name)), '', '', '<a href="#/seme">' + t('sc.title') + '</a> ' + ic('chevr') + ' <a href="#/seme/' + s.id + '">' + IH.esc(IH.L(s.name)) + '</a> ' + ic('chevr') + ' ' + title) + body; }

  /* ---------- obračunski list (koristi se i u Obračunu, Mom obračunu, Timu) ---------- */
  function corrNote(emp, per, prior) { return EN.corrections(emp, per).filter(function (c) { return c.kind === 'iznos' && (prior == null || !!c.refPeriod === prior); }).map(function (c) { return c.id + (c.refPeriod ? ' (' + D.periodLabel(c.refPeriod) + ')' : ''); }).join(', '); }
  function ruleRows(s, r) { return (r.condRes || []).filter(function (x) { return x.r.tpl !== 'kap'; }).map(function (x) { return '<tr><td colspan="2">' + V.resText(s, x) + '</td><td></td></tr>'; }).join(''); }
  function addonRows(r) {
    return (r.addons || []).map(function (a) {
      return '<tr class="lvl-0"><td>' + t('sc.exAddon') + ' · ' + IH.esc(IH.L(a.name)) + '</td><td class="mut">' + t('sc.exAddonTxt', { n: a.n, v: F.rsd(a.raw) }) + (a.capped ? t('sc.exAddonCap', { l: F.rsd(a.limit) }) : '') + '</td><td class="num">' + F.num(a.amount) + '</td></tr>';
    }).join('');
  }
  function verLine(r) { if (!r.versions) return ''; return '<div class="mut" style="font-size:12px;padding:8px 14px">' + t('sc.exVer', { s: IH.esc(r.versions.scheme), v: r.versions.v, t: r.versions.targets.map(function (x) { return IH.esc(IH.L(x.name)) + ' v' + x.v; }).join(', ') }) + '</div>'; }
  function achTxt(x) {
    var extra = [];
    if (x.nStorno) extra.push(t('sc.exSt').toLowerCase() + ' ' + x.nStorno);
    if (x.nClosed) extra.push(t('sc.exClosed', { n: x.nClosed }));
    if (x.nWait) extra.push(t('sc.exWait', { n: x.nWait }));
    return t('sc.exAch', { a: F.unit(Math.round(x.ach), x.unit), t: F.unit(x.target, x.unit), p: '<b>' + F.pct(x.pct) + '</b>' }) + (extra.length ? ' <span class="mut">(' + extra.join(', ') + ')</span>' : '');
  }
  function stmtBody(s0, emp, per, proj, ver) {
    var opts = { project: proj, sch: s0 }; if (ver) { opts.ver = ver; opts.simKey = 'v' + ver.v; }
    var r = EN.result(emp, per, opts); if (r.noScheme) return '<div class="empty">' + t('sc.noScheme') + '</div>';
    var s = ver ? sAt(s0, ver) : D.schemeAt(s0, per), body = '';
    if (r.model !== 'M3') {
      var ty = r.type, prov = ty === 'provizija', rows = '';
      r.targets.forEach(function (x) {
        rows += '<tr class="lvl-0"><td>' + IH.esc(IH.L(x.name)) + '</td><td>' + achTxt(x) + '</td><td class="num">' + F.num(x.bonus) + '</td></tr>';
        var expl = prov ? t('sc.exProv', { n: x.n, v: F.rsd(x.value), p: F.pct(x.ponder) }) : t('sc.exScore', { b: F.num(r.base), s: F.pct(x.share), v: F.num(x.value), p: F.pct(x.ponder) });
        if (x.dep !== 1) expl += t('sc.exDep', { d: '×' + F.num(x.dep, 2) });
        if (x.capT) expl += t('sc.exKap', { k: F.pct(x.kap) });
        if (x.extra) expl += t('sc.exOver', { o: F.unit(Math.round(x.over), x.unit), v: fmtVal(x.val, x.unit), e: F.num(x.extra) });
        rows += '<tr><td style="padding-left:28px" class="mut">' + expl + '</td><td>' + scaleHtml(s.scale, x.pct) + '</td><td></td></tr>';
      });
      rows += ruleRows(s, r);
      if (r.model === 'M2') {
        var team = (r.team || []).map(function (x) { return '<span class="tag' + (x.on ? ' acc' : '') + '">' + IH.esc(D.emp(x.emp).name.split(' ')[0]) + ' ' + F.pct(x.pct) + '</span>'; }).join('');
        rows += '<tr class="lvl-0"><td>' + t('sc.teamF') + '</td><td>' + t('sc.exTeamShare', { a: (r.team || []).filter(function (x) { return x.on; }).length, b: (r.team || []).length }) + '<div style="margin-top:4px">' + team + '</div></td><td class="num">×' + F.num(r.teamFactor, 1) + '</td></tr>';
      }
      if (prov && r.stornoN) rows += '<tr class="lvl-0"><td>' + t('sc.exSt') + '</td><td class="mut">' + t('sc.exItems', { n: r.stornoN }) + '</td><td class="num" style="color:var(--danger)">' + F.num(r.storno) + '</td></tr>';
      if (s.continuity && r.contHistory) {
        var ch = r.contHistory.map(function (hh) { return D.periodLabel(hh.period) + ' ' + F.pct(hh.pct) + (hh.pct >= s.continuity.min ? ' ✓' : ' ✗'); }).join(' · ');
        var t1 = r.targets.filter(function (x) { return x.key === s.continuity.target; })[0];
        rows += '<tr class="lvl-0"><td>' + t('sc.exCont') + '</td><td class="mut">' + ch + ' · ' + D.periodLabel(per) + ' ' + F.pct(t1 ? t1.pct : 0) + (t1 && t1.pct >= s.continuity.min ? ' ✓' : ' ✗') + '</td><td class="num">' + F.num(r.continuity) + '</td></tr>';
      }
      if (r.corrections) rows += '<tr class="lvl-0"><td>' + t('sc.exCorr') + '</td><td class="mut">' + corrNote(emp, per, false) + '</td><td class="num">' + (r.corrections > 0 ? '+' : '') + F.num(r.corrections) + '</td></tr>';
      if (r.carryIn) rows += '<tr class="lvl-0"><td>' + t('sc.exCarry') + '</td><td></td><td class="num" style="color:var(--danger)">' + F.num(-r.carryIn) + '</td></tr>';
      rows += '<tr><td colspan="2" class="mut">' + (r.capped ? '<span class="sum-bad">' + t('sc.exLimit', { l: F.rsd(r.limit) }) + '</span>' : t('sc.exNoLimit', { l: F.rsd(r.limit) })) + '</td><td class="num" style="color:var(--danger)">' + (r.capped ? F.num(r.limit - r.beforeCap) : '') + '</td></tr>';
      if (r.priorAdj) rows += '<tr class="lvl-0"><td>' + t('sc.exPrior') + '</td><td class="mut">' + corrNote(emp, per, true) + '</td><td class="num">' + (r.priorAdj > 0 ? '+' : '') + F.num(r.priorAdj) + '</td></tr>';
      rows += addonRows(r);
      body = '<div class="tbl-wrap"><table class="t compact"><tbody>' + rows + '</tbody><tfoot><tr><td>' + t('sc.exTotal') + '</td><td class="mut">' + (r.model === 'M2' ? F.num(r.targetsTotal) + ' × ' + F.num(r.teamFactor, 1) : '') + '</td><td class="num" style="font-size:16px">' + F.rsd(r.payout) + '</td></tr></tfoot></table></div>' + verLine(r);
    } else {
      var kr = r.kpis.map(function (k) { return { k: '<b>' + IH.esc(IH.L(k.name)) + '</b>', a: F.unit(Math.round(k.ach), k.unit) + ' / ' + F.unit(k.target, k.unit), p: ui.pcell(k.pct, { max: 1.6 }), s: F.pct(k.share), w: F.pct(k.weight) + (k.dep !== 1 ? ' <span class="mut">×' + F.num(k.dep, 2) + '</span>' : ''), c: F.pct(k.contrib) }; });
      var rr = (r.condRes || []).filter(function (x) { return x.r.tpl !== 'kap'; }).map(function (x) { return '<div style="margin:4px 0">' + V.resText(s, x) + '</div>'; }).join('');
      var me = r.me;
      body = ui.table([{ key: 'k', label: t('c.target') }, { key: 'a', label: t('c.ach'), num: true }, { key: 'p', label: t('c.pct'), w: '170px' }, { key: 's', label: t('sc.colShare'), num: true }, { key: 'w', label: t('sc.pay'), num: true }, { key: 'c', label: IH.L(L('Doprinos', 'Contribution')), num: true }], kr, { compact: true, foot: { k: t('sc.exPayPct'), c: F.pct(r.payoutPct) } }) +
        (rr ? '<div class="cb" style="padding-bottom:0">' + rr + '</div>' : '') +
        '<div class="cb"><dl class="kv"><dt>' + t('sc.teamF') + '</dt><dd>×' + F.num(r.teamFactor, 1) + ' (' + r.onTarget + '/' + r.kpis.length + ')</dd><dt>' + t('sc.exBase') + '</dt><dd>' + F.rsd(me ? me.baseEff : 0) + (me && me.presence < 1 ? ' · ' + t('sc.exProrata') + ' ' + F.pct(me.presence) : '') + '</dd>' +
        (me && me.corrections ? '<dt>' + t('sc.exCorr') + '</dt><dd>' + (me.corrections > 0 ? '+' : '') + F.num(me.corrections) + ' · ' + corrNote(emp, per) + '</dd>' : '') + '<dt>' + t('sc.limit') + '</dt><dd>' + F.rsd(me ? me.cap : 0) + (me && me.capped ? ' · ' + ui.pill(t('sc.kCap'), 'warning') : '') + '</dd>' +
        (me && me.addons ? me.addons.map(function (a) { return '<dt>' + t('sc.exAddon') + '</dt><dd>' + IH.esc(IH.L(a.name)) + ' · ' + t('sc.exAddonTxt', { n: a.n, v: F.rsd(a.raw) }) + (a.capped ? t('sc.exAddonCap', { l: F.rsd(a.limit) }) : '') + ' = <b>' + F.num(a.amount) + '</b></dd>'; }).join('') : '') +
        '<dt>' + t('sc.exTotal') + '</dt><dd><b style="font-size:16px">' + F.rsd(r.payout) + '</b></dd></dl></div>' + verLine(r);
    }
    return body;
  }
  IH.stmtBody = function (empId, pid, opts) { var s = EN.schemeFor(empId, pid); return s ? stmtBody(s, empId, pid, !!(opts && opts.project)) : '<div class="empty">' + t('sc.noScheme') + '</div>'; };
  function examplePage(s) {
    var v = IH.v('ex-' + s.id), staff = staffOf(s);
    if (!staff.length) staff = D.employees.filter(function (e) { return e.pos === s.pos && e.branch; });
    var emp = v.emp || (staff.filter(function (e) { return e.branch === 'B01'; })[0] || staff[0]).id;
    var pall = D.periods.filter(function (p) { return p.type === s.periodType; }).sort(function (a, b) { return a.from < b.from ? 1 : -1; }), plast = pall.filter(function (p) { return p.status !== 'u_toku'; })[0];
    var pers = (plast ? [plast] : []).concat(pall.filter(function (p) { return p !== plast; })).slice(0, 3).map(function (p) { return p.id; });
    if (!pers.length) return '<div class="empty">' + t('sc.exNone') + '</div>';
    var per = v.per || pers[0], proj = D.period(per).status === 'u_toku';
    var inPer = D.schemeVersion(s, per), vs = vers(s), selV = v.ver ? verByNo(s, v.ver) : inPer, sim = selV && selV.v !== inPer.v ? selV : null;
    var sel = '<div class="toolbar" style="border:0;padding:0 0 14px;flex-wrap:wrap;gap:10px"><select class="in" data-f="emp" data-scope="ex-' + s.id + '" style="max-width:340px">' + staff.map(function (e) { return '<option value="' + e.id + '"' + (e.id === emp ? ' selected' : '') + '>' + IH.esc(e.name + ' · ' + D.branchShort(e.branch)) + '</option>'; }).join('') + '</select>' +
      ui.segf('ex-' + s.id, 'per', pers.map(function (p) { return { v: p, l: D.periodLabel(p) + (D.period(p).status === 'u_toku' ? ' · ' + t('c.projection').toLowerCase() : '') }; })) +
      (vs.length > 1 ? '<select class="in" data-f="ver" data-scope="ex-' + s.id + '" style="max-width:300px">' + vs.map(function (x) { return '<option value="' + x.v + '"' + (x.v === (selV || inPer).v ? ' selected' : '') + '>' + IH.esc(t('sc.verSel') + ' ' + verLabel(s, x)) + '</option>'; }).join('') + '</select>' : '') + '</div>';
    IH.refreshers['ex-' + s.id] = function () { IH.render(); };
    var cmp = '';
    if (sim) {
      var a = EN.result(emp, per, { project: proj, sch: s }), b = EN.result(emp, per, { project: proj, sch: s, ver: sim, simKey: 'v' + sim.v }), d = b.payout - a.payout;
      cmp = '<div class="note" style="margin-bottom:14px">' + ui.pill(t('sc.sim', { v: sim.v, p: D.periodLabel(per) }), 'warning') + ' ' + t('sc.cmp', { a: inPer.v, x: '<b>' + F.rsd(a.payout) + '</b>', b: sim.v, y: '<b>' + F.rsd(b.payout) + '</b>', d: '<b>' + (d > 0 ? '+' : d < 0 ? '−' : '') + F.rsd(Math.abs(d)) + '</b>' }) + '</div>';
    }
    return sel + cmp + ui.card(IH.esc(D.emp(emp).name) + ' · ' + D.periodLabel(per) + (proj ? ' · ' + t('c.projection').toLowerCase() : '') + (sim ? ' · v' + sim.v : ''), stmtBody(s, emp, per, proj, sim), { flush: true });
  }

  /* ================= ČAROBNJAK (5 koraka) ================= */
  function W() { return IH.form.wiz; }
  /* način obračuna: savetnik — individualni; menadžer — timski (cela ekspozitura); univerzalni — timski ili individualni */
  function kindOf(s) { return s.model === 'M1' ? 'individualni' : 'timski'; }
  var SKEYS = ['type', 'targets', 'scale', 'rules', 'continuity', 'teamFactor', 'carryNegative', 'teamSplit'];
  /* nacrt = identitet šeme + parametri verzije (s) i iznosi verzije (v) */
  function draftFrom(src, baseV) {
    var sa = sAt(src, baseV), d = deep(src);
    SKEYS.forEach(function (k) { if (sa[k] !== undefined) d[k] = deep(sa[k]); });
    d.rules = deep(EN.rulesOf(sa)); delete d.conds; delete d.ver;
    d.targets.forEach(function (tc) { if (!tc.id) tc.id = tgOf(src, tc).id; if (tc.share == null && baseV.shares && baseV.shares[tc.key] != null) tc.share = baseV.shares[tc.key]; });
    var v = { v: baseV.v, from: baseV.from, to: baseV.to, base: baseV.base, limit: baseV.limit, contAmount: baseV.contAmount, capFactor: baseV.capFactor, shares: baseV.shares ? deep(baseV.shares) : undefined, note: baseV.note };
    return { s: d, v: v };
  }
  function nextFromFor(s) {
    var used = vers(s).map(function (v) { return v.from; });
    var opts = D.plannedOf(s.periodType).map(function (p) { return p.from; }); if (!opts.length) return null;
    return opts.filter(function (o) { return used.indexOf(o) < 0; })[0] || opts[opts.length - 1];
  }
  function makeDraft(mode, srcId) {
    if (mode === 'edit') { var ex = D.scheme(srcId), de = draftFrom(ex, ex.versions[ex.versions.length - 1]); return { mode: 'edit', src: ex.id, s: de.s, v: de.v, rev: 0 }; }
    var src = D.scheme(srcId || 'S-M1'), all = vers(src), last = mode === 'ver' ? all[all.length - 1] : curVer(src), dr = draftFrom(src, last), d = dr.s, v = dr.v;
    var nextFrom = nextFromFor(src);
    if (mode === 'ver') {
      var maxV = Math.max.apply(null, all.map(function (x) { return x.v; }));
      v.v = maxV + 1; v.from = nextFrom; v.to = null; v.note = L('Usklađivanje sa planom', 'Alignment with the plan');
      if (v.base) v.base = Math.round(v.base * 1.05 / 1000) * 1000;
      if (v.limit) v.limit = Math.round(v.limit * 1.05 / 1000) * 1000;
    } else {
      d.id = 'S-N' + (IH.list('newSchemes').length + 1);
      d.code = mode === 'copy' ? src.code.replace('2026', '2027') + '-K' : (src.pos === 'licni' ? 'BS-LB-2027' : src.pos === 'menadzer' ? 'BS-ME-2027' : 'BS-TU-2027');
      d.name = mode === 'copy' ? { sr: IH.L(src.name) + ' — kopija', en: IH.L(src.name) + ' — copy' } : (src.pos === 'licni' ? L('Savetnik – fizička lica 2027', 'Advisor – private individuals 2027') : src.pos === 'menadzer' ? L('Menadžer ekspoziture 2027', 'Branch manager 2027') : L('Tim ekspoziture 2027', 'Branch team 2027'));
      d.status = 'nacrt'; d.isNew = true;
      v = Object.assign(v, { v: 1, from: (D.plannedOf(src.periodType)[0] || {}).from || null, to: null, note: L('Početna verzija', 'Initial version') });
      d.versions = [v];
    }
    return { mode: mode, src: src.id, s: d, v: v, rev: 0 };
  }
  function setType(ty) {
    var w = W(), s = w.s, v = w.v; if ((s.type || 'scorecard') === ty) return;
    s.type = ty;
    if (ty !== 'scorecard') s.targets.forEach(function (tc) { var tg = tgOf(s, tc); tc.val = tc.val || (tg && tg.unit === 'bod' ? { k: 'rsd', v: ty === 'kombinovana' ? 300 : 600 } : tg && tg.unit === 'RSD' ? { k: 'pct', v: ty === 'kombinovana' ? 0.002 : 0.006 } : { k: 'rsd', v: ty === 'kombinovana' ? 600 : 1200 }); });
    if (ty !== 'provizija') { var n = s.targets.length || 1; s.targets.forEach(function (tc) { if (tc.share == null) tc.share = Math.round(100 / n) / 100; }); if (!v.base) v.base = 60000; }
    w.rev++;
  }
  function inp(sp, val, opts) { opts = opts || {}; return '<input class="in cell" style="width:' + (opts.w || 110) + 'px" data-sp="' + sp + '" data-kind="' + (opts.kind || 'num') + '" value="' + IH.esc(val) + '">'; }
  function wseg(act, list, cur) { return '<div class="seg">' + list.map(function (o) { return '<button type="button" data-act="' + act + '" data-arg="' + o.v + '" class="' + (o.v === cur ? 'on' : '') + '">' + o.l + '</button>'; }).join('') + '</div>'; }
  function fromOpts(s) { return D.plannedOf(s.periodType).map(function (p) { return { v: p.from, l: IH.L(p.label) }; }); }
  function step1() {
    var w = W(), s = w.s, v = w.v, isNew = w.mode !== 'ver';
    var typePick = '<div class="field full"><label class="lab">' + t('w.type') + '</label><div class="opts">' + D.schemeTypes.map(function (ty) { return '<button type="button" class="opt' + ((s.type || 'scorecard') === ty.id ? ' on' : '') + '" data-act="w-type" data-arg="' + ty.id + '"><span class="ri"></span><span><b>' + IH.esc(IH.L(ty.name)) + '</b><small>' + IH.esc(IH.L(ty.d)) + '</small></span></button>'; }).join('') + '</div></div>';
    var fo = fromOpts(s); if (v.from && !fo.some(function (o) { return o.v === v.from; })) fo.unshift({ v: v.from, l: F.date(v.from) });
    return '<div class="form-grid g3">' + typePick +
      '<div class="field full"><label class="lab">' + t('w.name') + ' <span class="req">*</span></label><input class="in" data-sp="name" data-kind="l" value="' + IH.esc(IH.L(s.name)) + '"></div>' +
      '<div class="field"><label class="lab">' + t('w.code') + ' <span class="req">*</span></label>' + (isNew ? '<input class="in" data-sp="code" data-kind="str" value="' + IH.esc(s.code) + '">' : '<div class="in ro">' + IH.esc(s.code) + '</div>') + '</div>' +
      '<div class="field"><label class="lab">' + t('w.pos') + '</label>' + (isNew ? '<select class="in" data-sp="pos" data-kind="str">' + ['licni', 'univerzalni', 'menadzer'].map(function (k) { return '<option value="' + k + '"' + (k === s.pos ? ' selected' : '') + '>' + D.posName(k) + '</option>'; }).join('') + '</select>' : '<div class="in ro">' + D.posName(s.pos) + '</div>') + '</div>' +
      (s.pos === 'univerzalni' ? '<div class="field"><label class="lab">' + t('w.calc') + '</label>' + (isNew ? wseg('w-model', [{ v: 'M3', l: t('w.calcTeam') }, { v: 'M1', l: t('w.calcInd') }], s.model) : '<div class="in ro">' + (s.model === 'M1' ? t('w.calcInd') : t('w.calcTeam')) + '</div>') + '</div>' : '') +
      '<div class="field"><label class="lab">' + t('w.perType') + '</label>' + (isNew ? wseg('w-per', D.activePeriodTypes().map(function (x) { return { v: x.id, l: t('per.' + x.id) }; }), s.periodType) : '<div class="in ro">' + t('per.' + s.periodType) + '</div>') + '</div>' +
      '<div class="field"><label class="lab">' + t('w.from') + '</label>' + (fo.length ? '<select class="in" data-sp="v.from" data-kind="str">' + fo.map(function (o) { return '<option value="' + o.v + '"' + (o.v === v.from ? ' selected' : '') + '>' + IH.esc(o.l) + ' (' + F.date(o.v) + ')</option>'; }).join('') + '</select>' : IH.noPeriodsNote()) + '</div>' +
      '<div class="field"><label class="lab">' + t('w.to') + '</label><input class="in" data-sp="v.to" data-kind="str" value="' + (v.to ? IH.esc(F.date(v.to)) : '') + '" placeholder="' + IH.L(L('Bez kraja', 'Open-ended')) + '"></div>' +
      '<div class="field"><label class="lab">' + t('w.ver') + '</label><div class="in ro">v' + v.v + '</div></div>' +
      (s.type === 'provizija' ? '<div></div>' : '<div class="field"><label class="lab">' + (s.pos === 'univerzalni' && s.model !== 'M1' ? t('sc.baseM3') : t('w.base')) + '</label><input class="in cell" style="text-align:left" data-sp="v.base" data-kind="num" value="' + F.num(v.base || 0) + '"></div>') +
      '<div class="field"><label class="lab">' + t('w.limit') + '</label><input class="in cell" style="text-align:left" data-sp="v.limit" data-kind="num" value="' + F.num(limitOf(v)) + '"></div>' +
      '<div class="field full"><label class="lab">' + t('w.note') + '</label><input class="in" data-sp="v.note" data-kind="l" value="' + IH.esc(IH.L(v.note)) + '"></div></div>';
  }
  function candTargets() {
    var w = W(), s = w.s, ids = s.targets.map(function (x) { return x.id; }), kind = kindOf(s);
    return IH.targets().filter(function (x) {
      if (ids.indexOf(x.id) >= 0) return true;
      if (x.status !== 'aktivan' || x.periodType !== s.periodType || x.kind !== kind || !x.subject) return false;
      if (kind === 'individualni' && (x.pos || 'licni') !== s.pos) return false;
      if (kind === 'timski' && s.pos === 'univerzalni' && (x.team || []).length !== 1) return false;
      if (kind === 'timski' && s.pos === 'menadzer' && (x.team || []).length < 2) return false;
      return true;
    });
  }
  function nextKey(s) { var used = s.targets.map(function (q) { return q.key; }), p = s.pos === 'univerzalni' && s.model !== 'M1' ? 'K' : 'T', i = 1; while (used.indexOf(p + i) >= 0) i++; return p + i; }
  function schemesTxt(x) { var l = D.schemesOf(x.id); return l.length ? l.map(function (q) { return q.code; }).join(', ') : t('tg.free'); }
  function step2() {
    var w = W(), s = w.s, cands = candTargets();
    var bar = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><span class="pill p-accent">' + t('w.selCount', { n: s.targets.length }) + '</span><span class="sp" style="flex:1"></span>' + ui.btn(t('w.newTarget'), { cls: 'sm', icon: 'plus', act: 'tg-new' }) + '</div>';
    if (!cands.length) return bar + '<div class="empty">' + t('w.noTargets') + '</div>';
    return bar + IH.grid({
      id: 'w-tg', exportName: 'Targeti_seme.xlsx', searchLabel: t('tg.search'), actions: [],
      rows: function () { return cands; }, key: function (x) { return x.id; }, label: function (x) { return IH.L(x.name); }, searchKeys: ['n'],
      select: { get: function () { return s.targets.map(function (q) { return q.id; }); }, set: function (l) {
        s.targets = s.targets.filter(function (q) { return l.indexOf(q.id) >= 0; });
        l.forEach(function (id) { if (!s.targets.some(function (q) { return q.id === id; })) { var x = D.target(id), tc = { key: nextKey(s), id: x.id, role: 'primarni', inCalc: true }; if (s.type && s.type !== 'scorecard') tc.val = x.unit === 'bod' ? { k: 'rsd', v: s.type === 'kombinovana' ? 300 : 600 } : x.unit === 'RSD' ? { k: 'pct', v: s.type === 'kombinovana' ? 0.002 : 0.006 } : { k: 'rsd', v: s.type === 'kombinovana' ? 600 : 1200 }; if (s.type !== 'provizija') tc.share = 0; s.targets.push(tc); } });
        if (s.type !== 'provizija') { var n = s.targets.length || 1; s.targets.forEach(function (tc) { tc.share = Math.round(100 / n) / 100; }); var sum = s.targets.reduce(function (a, tc) { return a + tc.share; }, 0); if (s.targets.length) s.targets[0].share = +(s.targets[0].share + 1 - sum).toFixed(2); }
        var keys = s.targets.map(function (q) { return q.key; });
        s.rules = (s.rules || []).filter(function (r) { return [r.cond, r.a, r.b].filter(Boolean).every(function (k) { return keys.indexOf(k) >= 0; }); }).map(function (r) { if (r.affects) r.affects = r.affects.filter(function (k) { return keys.indexOf(k) >= 0; }); if (r.keys) r.keys = r.keys.filter(function (k) { return keys.indexOf(k) >= 0; }); return r; });
        if (s.continuity && keys.indexOf(s.continuity.target) < 0) s.continuity.target = keys[0];
        w.rev++; }, onChange: function () { IH.render(); } },
      cols: [
        { key: 'n', label: t('c.target'), val: function (x) { return IH.L(x.name); }, render: function (x) { return '<b>' + IH.esc(IH.L(x.name)) + '</b>'; } },
        { key: 'car', label: t('tg.colCarrier'), val: function (x) { return IH.targetCarrier ? IH.targetCarrier(x) : ''; } },
        { key: 'pt', label: t('tg.colPt'), val: function (x) { return D.subjPtypeName(x.subject); }, fval: function (x) { return x.subject.ptype || 'mix'; }, filter: function () { return D.ptypes.map(function (p) { return { v: p.id, l: IH.L(p.name) }; }); } },
        { key: 'seg', label: t('tg.colSeg'), val: function (x) { return (x.subject.segs || []).length === 3 ? IH.L(L('Sve grupe', 'All groups')) : (x.subject.segs || []).map(D.segName).join(', '); } },
        { key: 'u', label: t('c.unit'), val: function (x) { return IH.unitTxt(x.unit); } },
        { key: 's', label: t('c.scheme'), val: function (x) { return schemesTxt(x); } }
      ]
    });
  }
  function scaleEditor(s) {
    var typeSel = '<div class="field" style="margin-bottom:10px"><label class="lab">' + t('sc.scaleType') + '</label>' + wseg('w-sctype', [{ v: 'step', l: t('sc.scStep') }, { v: 'linear', l: t('sc.scLin') }], s.scale.type === 'linear' ? 'linear' : 'step') + '</div>';
    if (s.scale.type === 'linear') return typeSel + '<div class="form-grid g3"><div class="field"><label class="lab">' + t('sc.linMin') + '</label>' + inp('scale.min', F.num(s.scale.min * 100), { kind: 'pct', w: 90 }) + ' %</div><div class="field"><label class="lab">' + t('sc.linCap') + '</label>' + inp('scale.cap', F.num(s.scale.cap * 100), { kind: 'pct', w: 90 }) + ' %</div></div>';
    var lo = 0, rows = s.scale.map(function (b, i) {
      var r = '<tr><td class="num">' + F.pct(lo) + '</td><td>' + (b.to == null ? '<span class="mut">∞</span>' : inp('scale.' + i + '.to', F.num(b.to * 100), { kind: 'pct', w: 80 }) + ' %') + '</td><td>' + inp('scale.' + i + '.f', F.num(b.f * 100), { kind: 'pct', w: 80 }) + ' %</td><td class="num">' + (s.scale.length > 2 && b.to != null ? '<button class="gab dan" data-act="w-band-rm" data-arg="' + i + '">' + ic('trash') + '</button>' : '') + '</td></tr>';
      lo = b.to; return r;
    }).join('');
    return typeSel + '<div class="tbl-wrap"><table class="t compact"><thead><tr><th class="num">' + t('sc.from') + '</th><th>' + t('sc.to') + '</th><th>' + t('sc.pay') + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div><div style="margin-top:8px">' + ui.btn(t('sc.addBand'), { cls: 'sm', icon: 'plus', act: 'w-band-add' }) + '</div>';
  }
  function valCell(i, tc) { var pct = tc.val.k === 'pct'; return inp('targets.' + i + '.val.v', pct ? F.num(tc.val.v * 100, 2) : F.num(tc.val.v), { kind: pct ? 'pct' : 'num', w: 90 }) + (pct ? ' %' : ' RSD'); }
  function step3() {
    var w = W(), s = w.s, v = w.v, ty = s.type || 'scorecard', prov = ty === 'provizija', komb = ty === 'kombinovana';
    var rows = s.targets.map(function (tc, i) {
      var tg = tgOf(s, tc); if (!tg) return '';
      if (prov) { var pct = tc.val.k === 'pct'; return '<tr><td><b>' + IH.esc(IH.L(tg.name)) + '</b></td><td class="mut">' + (pct ? IH.L(L('% iznosa', '% of amount')) : tg.unit === 'bod' ? IH.L(L('RSD po bodu', 'RSD per point')) : IH.L(L('RSD po komadu', 'RSD per piece'))) + '</td><td class="num">' + valCell(i, tc) + '</td><td class="mut">' + (pct ? t('w.exPct', { v: F.rsd(1000000), r: '<b>' + F.rsd(Math.round(1000000 * tc.val.v)) + '</b>' }) : t(tg.unit === 'bod' ? 'w.exBod' : 'w.exKom', { r: '<b>' + F.rsd(tc.val.v) + '</b>' })) + '</td></tr>'; }
      return '<tr><td><b>' + IH.esc(IH.L(tg.name)) + '</b></td><td class="num">' + inp('targets.' + i + '.share', F.num((tc.share || 0) * 100), { kind: 'pct', w: 80 }) + ' %</td><td class="num">' + F.rsd(Math.round((v.base || 0) * (tc.share || 0))) + '</td>' + (komb ? '<td class="num">' + (tc.val ? valCell(i, tc) : '') + '</td>' : '') + '</tr>';
    }).join('');
    var sum = s.targets.reduce(function (a, tc) { return a + (tc.share || 0); }, 0);
    var head = prov ? '<tr><th>' + t('sc.colTarget') + '</th><th>' + t('sc.colUnitV') + '</th><th class="num">' + t('sc.colVal') + '</th><th>' + t('sc.colEx') + '</th></tr>' : '<tr><th>' + t('sc.colTarget') + '</th><th class="num">' + t('sc.colShare') + '</th><th class="num">' + t('sc.colAt100') + '</th>' + (komb ? '<th class="num">' + t('sc.colOver') + '</th>' : '') + '</tr>';
    var foot = prov ? '' : '<tfoot><tr><td>' + t('w.shareSum') + '</td><td class="num ' + (Math.abs(sum - 1) < 0.005 ? 'sum-ok' : 'sum-bad') + '">' + F.pct(sum) + '</td><td class="num">' + F.rsd(v.base || 0) + '</td>' + (komb ? '<td></td>' : '') + '</tr></tfoot>';
    return (!prov && Math.abs(sum - 1) >= 0.005 ? '<div class="note warn">' + t('w.shareWarn') + '</div>' : '') +
      '<div class="tbl-wrap"><table class="t compact"><thead>' + head + '</thead><tbody>' + rows + '</tbody>' + foot + '</table></div>' +
      '<div class="lab" style="margin-top:16px">' + t('sc.scaleTitle') + '</div>' + scaleEditor(s);
  }
  /* zajednički bonus tima (šema tima): podela na jednake delove ili po odluci menadžera */
  function splitEditor(s) {
    if (s.model !== 'M3') return '';
    var cur = s.teamSplit || 'jednako';
    return '<div class="fsec"><h3>' + t('sc.split') + '</h3><div class="seg">' + [{ v: 'jednako', l: t('sc.splitEq') }, { v: 'menadzer', l: t('sc.splitMgr') }].map(function (o) { return '<button type="button" data-act="w-split" data-arg="' + o.v + '" class="' + (cur === o.v ? 'on' : '') + '">' + o.l + '</button>'; }).join('') + '</div></div>';
  }
  function tfEditor(s) {
    var tf = s.teamFactor; if (!tf) return '';
    if (tf.bands) {
      var lo = 0, pos = tf.pos || ['licni'];
      var tops = IH.targets().filter(function (x) { return x.kind !== 'timski' && x.status === 'aktivan' && pos.indexOf(x.pos || 'licni') >= 0 && x.periodType === s.periodType; });
      var head = '<div class="form-grid g3"><div class="field"><label class="lab">' + t('sc.tfPos') + '</label><span class="chks">' + ['licni', 'univerzalni'].map(function (p) { return '<label class="chk" style="margin:0"><input type="checkbox" data-wtfpos="' + p + '"' + (pos.indexOf(p) >= 0 ? ' checked' : '') + '><span>' + D.posName(p) + '</span></label>'; }).join(' ') + '</span></div>' +
        '<div class="field"><label class="lab">' + t('sc.tfTarget') + '</label><select class="in" data-sp="teamFactor.target" data-kind="str">' + tops.map(function (x) { return '<option value="' + x.id + '"' + (x.id === tf.target ? ' selected' : '') + '>' + IH.esc(IH.L(x.name)) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label class="lab">' + t('sc.tfMin') + '</label>' + inp('teamFactor.min', F.num((tf.min != null ? tf.min : 1) * 100), { kind: 'pct', w: 80 }) + ' %</div></div>';
      return '<div class="fsec"><h3>' + t('sc.teamF') + '</h3>' + head + '<div class="tbl-wrap" style="margin-top:10px"><table class="t compact"><thead><tr><th class="num">' + t('sc.tfShare') + ' ' + t('sc.from').toLowerCase().split(' ').pop() + '</th><th>' + t('sc.to') + '</th><th>' + t('sc.teamF') + '</th></tr></thead><tbody>' + tf.bands.map(function (b, i) { var r = '<tr><td class="num">' + F.pct(lo) + '</td><td>' + (b.to == null ? '<span class="mut">∞</span>' : inp('teamFactor.bands.' + i + '.to', F.num(b.to * 100), { kind: 'pct', w: 70 }) + ' %') + '</td><td>× ' + inp('teamFactor.bands.' + i + '.f', F.num(b.f, 1), { kind: 'num2', w: 64 }) + '</td></tr>'; lo = b.to; return r; }).join('') + '</tbody></table></div></div>';
    }
    return '<div class="fsec"><h3>' + t('sc.teamF') + '</h3><div class="form-grid g3"><div class="field"><label class="lab">' + t('sc.tfMin') + '</label>' + inp('teamFactor.min', F.num((tf.min != null ? tf.min : 1) * 100), { kind: 'pct', w: 80 }) + ' %</div></div><div class="tbl-wrap" style="margin-top:10px"><table class="t compact"><thead><tr><th>' + t('sc.tfCount') + '</th><th>' + t('sc.teamF') + '</th></tr></thead><tbody>' + tf.byCount.map(function (f, i) { return '<tr><td>' + i + '</td><td>× ' + inp('teamFactor.byCount.' + i, F.num(f, 1), { kind: 'num2', w: 64 }) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  }
  function setCtx() { V.ctx = { get: function () { return W() && W().s; }, branchTargets: function () { return kindOf(W().s) === 'timski' ? [] : branchTargets(W().s); }, changed: function () { W().rev++; IH.render(); } }; }
  function step4() {
    var w = W(), s = w.s, v = w.v, keys = s.targets.map(function (tc) { return { v: tc.key, l: tgName(s, tc.key) }; });
    setCtx(); s.rules = s.rules || [];
    function sel(sp, cur) { return '<select class="in" style="width:auto;min-width:200px;display:inline-block" data-sp="' + sp + '" data-kind="str">' + keys.map(function (k) { return '<option value="' + k.v + '"' + (k.v === cur ? ' selected' : '') + '>' + IH.esc(k.l) + '</option>'; }).join('') + '</select>'; }
    var h = '<div class="fsec"><h3>' + t('sc.sRules') + '</h3>' + V.editor(s, kindOf(s) === 'timski' ? [] : branchTargets(s)) + '</div>';
    var cont = s.continuity ? '<div class="form-grid g3" style="margin-top:10px"><div class="field"><label class="lab">' + t('sc.contTarget') + '</label>' + sel('continuity.target', s.continuity.target) + '</div><div class="field"><label class="lab">' + t('sc.contMin') + '</label>' + inp('continuity.min', F.num(s.continuity.min * 100), { kind: 'pct', w: 80 }) + ' %</div><div class="field"><label class="lab">' + t('sc.contN') + '</label>' + inp('continuity.periods', String(s.continuity.periods), { kind: 'int', w: 60 }) + '</div><div class="field"><label class="lab">' + t('sc.contAmt') + '</label>' + inp('v.contAmount', F.num(v.contAmount || 0), { kind: 'num', w: 120 }) + '</div></div>' : '';
    h += '<div class="fsec"><h3>' + t('sc.cont') + '</h3><button type="button" class="tg' + (s.continuity ? ' on' : '') + '" data-act="w-cont" aria-pressed="' + !!s.continuity + '"><i></i></button> <span style="margin-left:8px">' + t('sc.contOn') + '</span>' + cont + '</div>';
    h += splitEditor(s) + tfEditor(s);
    h += '<div class="fsec"><h3>' + t('sc.limit') + '</h3><div class="form-grid g3"><div class="field"><label class="lab">' + t('w.limit') + '</label>' + inp('v.limit', F.num(v.limit || 0), { w: 140 }) + '</div><div class="field full" style="display:flex;align-items:center;gap:10px;padding-top:22px"><button type="button" class="tg' + (s.carryNegative ? ' on' : '') + '" data-act="w-carry" aria-pressed="' + !!s.carryNegative + '"><i></i></button><span>' + t('sc.carry') + '</span></div></div></div>';
    return h;
  }
  function rulesOk(s) { var keys = s.targets.map(function (q) { return q.key; }); return (s.rules || []).every(function (r) { return [r.cond, r.a, r.b].filter(Boolean).concat(r.affects || []).concat(r.keys || []).every(function (k) { return keys.indexOf(k) >= 0; }) && (r.tpl !== 'timski' || !!r.target); }); }
  function step5() {
    var w = W(), s = w.s, v = w.v, prov = s.type === 'provizija';
    var sum = s.targets.reduce(function (a, tc) { return a + (tc.share || 0); }, 0);
    var scOk = s.scale.type === 'linear' ? s.scale.min > 0 && s.scale.cap >= 1 : s.scale.length && s.scale[s.scale.length - 1].to == null;
    var checks = ui.checks([{ label: t('w.chk1'), state: IH.L(s.name) && s.code ? 'ok' : 'no' }, { label: t('w.chk2'), state: s.targets.length > 1 ? 'ok' : s.targets.length ? 'warn' : 'no' }, { label: t('w.chk3'), state: scOk ? 'ok' : 'no' }, prov ? { label: t('w.chk5'), state: s.targets.every(function (tc) { return tc.val && tc.val.v > 0; }) ? 'ok' : 'no' } : { label: t('w.chk4'), state: Math.abs(sum - 1) < 0.005 ? 'ok' : 'no' }, { label: t('w.chk7'), state: rulesOk(s) ? 'ok' : 'no' }, { label: t('w.chk6', { d: F.date(v.from) }) }]);
    var vv = deep(v); if (!prov) { vv.shares = {}; s.targets.forEach(function (tc) { vv.shares[tc.key] = tc.share || 0; }); }
    var view = Object.assign({}, s, { versions: null });
    return checks + '<div class="hr"></div>' + schemeForm(view, vv) + '<div style="margin-top:14px">' + ui.btn(t('w.saveDraft'), { act: 'w-save', arg: 'nacrt' }) + '</div>';
  }
  function wizardPage(mode, srcId, step) {
    var w = W();
    if (!w || w.mode !== mode || (srcId && w.src !== srcId && mode !== 'new')) { w = makeDraft(mode, srcId); IH.form = { wiz: w }; }
    var cur = Math.max(0, Math.min(4, (+step || 1) - 1)), s = w.s;
    var base = mode === 'new' ? 'seme/nova' : mode === 'copy' ? 'seme/kopija/' + w.src : mode === 'ver' ? 'seme/' + w.src + '/verzija' : 'seme/izmena/' + w.src;
    var steps = ['w.s1', 'w.s2', 'w.s3', 'w.s4', 'w.s5'].map(function (k) { return { label: t(k) }; });
    var body = [step1, step2, step3, step4, step5][cur]();
    var title = mode === 'new' ? t('w.titleNew') : mode === 'copy' ? t('w.titleCopy') : mode === 'ver' ? t('w.titleVer') : t('w.titleEdit');
    return ui.header(title + (mode !== 'new' ? ' · ' + IH.esc(IH.L(D.scheme(w.src).name)) : ''), '', '', '<a href="#/seme">' + t('sc.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(IH.L(s.name))) +
      ui.wizard({ base: base, steps: steps, cur: cur, body: body, finishLabel: mode === 'ver' ? t('w.saveVer') : t('w.activate'), finishAct: 'w-save', cancelGo: mode === 'new' ? 'seme' : 'seme/' + w.src });
  }
  function setPath(o, path, val) { var p = path.split('.'), x = o; for (var i = 0; i < p.length - 1; i++) x = x[p[i]]; x[p[p.length - 1]] = val; }
  function defaultTF(pos, model) { return model === 'M2' || pos === 'menadzer' ? { by: 'udeo', target: 'TG-101', min: 1.0, pos: ['licni'], bands: [{ to: 0.4, f: 0.8 }, { to: 0.6, f: 0.9 }, { to: 0.8, f: 1.0 }, { to: null, f: 1.1 }] } : model === 'M3' ? { by: 'broj', min: 1.0, byCount: [0.8, 0.9, 1.0, 1.1] } : undefined; }
  document.addEventListener('change', function (e) {
    var el = e.target, sp = el.dataset && el.dataset.sp, w = W(); if (!sp || !w) return;
    var kind = el.dataset.kind, v = el.value, val;
    if (kind === 'l') val = { sr: v, en: v };
    else if (kind === 'str') val = v;
    else if (kind === 'date') { var m = v.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/); val = m ? m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : v; }
    else if (kind === 'pct') { var n = num(v); val = n == null ? 0 : n / 100; }
    else if (kind === 'int') val = parseInt(v, 10) || 1;
    else if (kind === 'num2') { var n2 = parseFloat(String(v).replace(',', '.')); val = isNaN(n2) ? 0 : n2; }
    else { var n3 = num(v); val = n3 == null ? 0 : n3; }
    var root = sp.indexOf('v.') === 0 ? w.v : w.s, path = sp.indexOf('v.') === 0 ? sp.slice(2) : sp;
    if (path === 'pos') { w.s.pos = val; w.s.model = val === 'licni' ? 'M1' : val === 'menadzer' ? 'M2' : 'M3'; w.s.targets = []; w.s.rules = []; w.s.teamFactor = defaultTF(val, w.s.model); w.rev++; IH.render(); return; }
    setPath(root, path, val);
    if (/^scale\.\d/.test(path)) { w.s.scale.sort(function (a, b) { return a.to == null ? 1 : b.to == null ? -1 : a.to - b.to; }); }
    w.rev++;
    if (/^(targets|scale|continuity|teamFactor)/.test(path) || path === 'base') IH.render();
  });
  document.addEventListener('change', function (e) {
    var el = e.target, w = W(); if (!w || !el.dataset || !el.dataset.wtfpos) return;
    var tf = w.s.teamFactor, p = el.dataset.wtfpos; tf.pos = tf.pos || ['licni'];
    if (el.checked) { if (tf.pos.indexOf(p) < 0) tf.pos.push(p); } else if (tf.pos.length > 1) tf.pos = tf.pos.filter(function (x) { return x !== p; });
    w.rev++; IH.render();
  });
  IH.act['w-split'] = function (el) { var w = W(); w.s.teamSplit = el.dataset.arg; w.rev++; IH.render(); };
  IH.act['w-type'] = function (el) { if (el.disabled) return; setType(el.dataset.arg); IH.render(); };
  IH.act['w-model'] = function (el) { var w = W(); if (w.s.model !== el.dataset.arg) { w.s.model = el.dataset.arg; w.s.targets = []; w.s.rules = []; w.s.teamFactor = defaultTF(w.s.pos, w.s.model); w.rev++; } IH.render(); };
  IH.act['w-per'] = function (el) { var w = W(); if (w.s.periodType !== el.dataset.arg) { w.s.periodType = el.dataset.arg; w.s.targets = []; w.s.rules = []; w.v.from = (D.plannedOf(el.dataset.arg)[0] || {}).from || null; w.rev++; } IH.render(); };
  IH.act['w-sctype'] = function (el) { var w = W(); if (el.dataset.arg === 'linear') { if (w.s.scale.type !== 'linear') { w._step = w.s.scale; w.s.scale = { type: 'linear', min: 0.8, cap: 1.2 }; } } else if (w.s.scale.type === 'linear') w.s.scale = w._step || deep(D.SCALES[w.s.periodType === 'M' ? 'M' : 'Q']); w.rev++; IH.render(); };
  IH.act['w-band-add'] = function () { var w = W(), sc = w.s.scale, last = sc[sc.length - 1], prev = sc[sc.length - 2]; var to = prev && prev.to != null ? +(prev.to + 0.2).toFixed(2) : 1.5; sc.splice(sc.length - 1, 0, { to: to, f: last.f }); last.f = +(last.f + 0.2).toFixed(2); w.rev++; IH.render(); };
  IH.act['w-band-rm'] = function (el) { var w = W(); w.s.scale.splice(+el.dataset.arg, 1); w.rev++; IH.render(); };
  IH.act['w-cont'] = function () { var w = W(); if (w.s.continuity) { w.s.continuity = null; } else { w.s.continuity = { target: w.s.targets[0] ? w.s.targets[0].key : 'T1', min: 1.0, periods: 3 }; w.v.contAmount = w.v.contAmount || 10000; } w.rev++; IH.render(); };
  IH.act['w-carry'] = function () { var w = W(); w.s.carryNegative = !w.s.carryNegative; w.rev++; IH.render(); };
  IH.act['sch-new'] = function () { IH.form = {}; IH.go('seme/nova/1'); };
  IH.act['sch-ver'] = function (el) { IH.form = {}; IH.go('seme/' + (el.dataset.arg || 'S-M1') + '/verzija/1'); };
  IH.act['sch-copy'] = function (el) { IH.form = {}; IH.go('seme/kopija/' + el.dataset.arg + '/1'); };
  IH.act['sch-edit'] = function (el) { IH.form = {}; IH.go('seme/izmena/' + el.dataset.arg + '/1'); };
  IH.act['w-save'] = function (el) {
    if (W() && !W().v.from) { IH.toast(t('pe.noPlanned')); return; }
    var w = W(); if (!w) return;
    var s = deep(w.s), v = deep(w.v), draft = el.dataset.arg === 'nacrt';
    if (s.type !== 'provizija') { v.shares = {}; s.targets.forEach(function (tc) { v.shares[tc.key] = tc.share || 0; }); }
    if (s.pos === 'univerzalni' && s.model !== 'M1' && v.base) v.capFactor = v.limit ? +(v.limit / v.base).toFixed(2) : 1.5;
    if (w.mode === 'ver') {
      var rec = { scheme: w.src, v: v.v, from: v.from, to: v.to, at: IH.now(), base: v.base, limit: v.limit, contAmount: v.contAmount, capFactor: v.capFactor, shares: v.shares, note: v.note };
      SKEYS.forEach(function (k) { if (s[k] !== undefined) rec[k] = s[k]; });
      IH.list('schemeVersions').push(rec);
      IH.audit('scheme', w.src, { sr: 'Kreirana verzija v' + v.v, en: 'Version v' + v.v + ' created' }, { sr: 'Važi od ' + F.date(v.from) + ' · ' + IH.L(v.note), en: 'Valid from ' + F.date(v.from) + ' · ' + IH.L(v.note) });
      IH.v('scv-' + w.src).ver = String(v.v);
      EN.invalidate(); IH.form = {}; IH.save(); IH.go('seme'); IH.toast(t('w.verSaved', { v: v.v, n: IH.esc(IH.L(D.scheme(w.src).name)), d: F.date(v.from) })); return;
    }
    s.versions = [v]; s.status = draft ? 'nacrt' : 'aktivan'; s.isNew = true;
    var list = IH.list('newSchemes'), idx = -1; list.forEach(function (x, i) { if (x.id === s.id) idx = i; });
    if (idx >= 0) list[idx] = s; else list.push(s);
    IH.audit('scheme', s.id, draft ? { sr: 'Sačuvan nacrt šeme', en: 'Scheme draft saved' } : { sr: 'Šema kreirana i aktivirana', en: 'Scheme created and activated' }, { sr: s.code + ' · važi od ' + F.date(v.from), en: s.code + ' · valid from ' + F.date(v.from) });
    EN.invalidate(); costCache = {}; IH.form = {}; IH.save(); IH.go('seme'); IH.toast(draft ? t('w.saved', { n: IH.esc(IH.L(s.name)) }) : t('w.activated', { n: IH.esc(IH.L(s.name)), d: F.date(v.from) }));
  };

  /* ================= KAMPANJSKI DODACI ================= */
  IH.addons = function () { var ed = IH.map('addonEdits'); return (D.addons || []).concat(IH.list('newAddons')).map(function (a) { return ed[a.id] ? Object.assign({}, a, ed[a.id]) : a; }); };
  function addonById(id) { return IH.addons().filter(function (a) { return a.id === id; })[0]; }
  function addonCost(a) {
    var tot = 0;
    a.schemes.forEach(function (sid) {
      var s = D.scheme(sid); if (!s) return;
      var pid = nowPid(s), p = D.period(pid); if (a.from > p.to || a.to < p.from) return;
      staffOf(s, pid).forEach(function (e) { var r = EN.result(e.id, pid, { project: true }); (r.addons || []).forEach(function (x) { if (x.id === a.id) tot += x.amount; }); });
    });
    return tot;
  }
  function prodNames(a) { var p = a.subject.products || []; return p.length ? p.map(function (id) { return D.productName(id); }).join(', ') : D.ptypeName(a.subject.ptype); }
  function addonsPage() {
    var grid = IH.grid({
      id: 'adl', exportName: 'Kampanjski_dodaci.xlsx', create: { label: t('ad.new'), act: 'ad-new' }, searchLabel: t('ad.search'),
      rows: IH.addons, key: function (a) { return a.id; }, label: function (a) { return IH.L(a.name); }, searchKeys: ['n'],
      rowCls: function (a) { return a.status === 'aktivan' ? '' : 'muted'; },
      cols: [
        { key: 'st', label: t('c.status'), val: function (a) { return a.status; }, render: function (a) { return ui.st2(a.status) + (a.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); }, filter: function () { return ['aktivan', 'zavrsen', 'nacrt'].map(function (k) { return { v: k, l: t('st2.' + k) }; }); } },
        { key: 'n', label: t('ad.colName'), val: function (a) { return IH.L(a.name); }, render: function (a) { return '<b>' + IH.esc(IH.L(a.name)) + '</b>'; } },
        { key: 'p', label: t('ad.colProd'), val: prodNames },
        { key: 'v', label: t('ad.colVal'), num: true, search: false, val: function (a) { return a.val.v; }, render: function (a) { return fmtVal(a.val); } },
        { key: 'l', label: t('ad.colLimit'), num: true, search: false, val: function (a) { return a.limit || 0; }, render: function (a) { return F.num(a.limit || 0); } },
        { key: 'f', label: t('ad.colFrom'), search: false, val: function (a) { return a.from; }, render: function (a) { return F.date(a.from); } },
        { key: 'to', label: t('ad.colTo'), search: false, val: function (a) { return a.to; }, render: function (a) { return F.date(a.to); } },
        { key: 's', label: t('ad.colSch'), val: function (a) { return a.schemes.map(function (x) { return D.scheme(x) ? D.scheme(x).code : x; }).join(', '); } },
        { key: 'c', label: t('ad.colCost'), num: true, search: false, val: function (a) { return a.status === 'aktivan' ? addonCost(a) : 0; }, render: function (a) { return a.status === 'aktivan' ? F.num(addonCost(a)) : '<span class="mut">—</span>'; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (a) { return 'seme/dodaci/' + a.id; } },
        { type: 'history', title: t('g.aHistory'), act: 'ad-hist' },
        { type: 'copy', title: t('g.aCopy'), act: 'ad-copy' },
        { type: 'delete', title: t('ad.end'), act: 'ad-end', kind: 'dan', show: function (a) { return a.status === 'aktivan'; } }
      ]
    });
    return ui.header(t('sc.title')) + tabs('dodaci') + grid;
  }
  /* forma dodatka: ista za pregled i kreiranje */
  function AD() { return IH.form.ad; }
  var AQ = [
    { name: L('Božićna akcija – kreditne kartice', 'Christmas campaign – credit cards'), from: '2026-12-01', to: '2026-12-31', schemes: ['S-M1', 'S-M1P'], subject: { ptype: 'kartica', segs: ['FL'], products: ['P13', 'P14'] }, val: { k: 'rsd', v: 1000 }, limit: 10000 },
    { name: L('Zimska akcija – stambeni krediti', 'Winter campaign – housing loans'), from: '2027-01-01', to: '2027-02-28', schemes: ['S-M1', 'S-M1P'], subject: { ptype: 'kredit', segs: ['FL'], products: ['P24', 'P25', 'P26'] }, val: { k: 'pct', v: 0.001 }, limit: 20000 }
  ];
  function initAD(src) {
    var q = deep(src || AQ[IH.list('newAddons').length % AQ.length]);
    q.id = 'KD-' + String(3 + IH.list('newAddons').length).padStart(2, '0'); q.status = 'nacrt'; q.isNew = true;
    if (src) { q.name = { sr: IH.L(src.name) + ' – kopija', en: IH.L(src.name) + ' – copy' }; q.from = '2026-12-01'; q.to = '2026-12-31'; }
    IH.form = { ad: q };
  }
  function adChecks(a) {
    return [
      { label: t('ad.chk1'), state: IH.L(a.name) && a.from && a.to && a.from <= a.to ? 'ok' : 'no' },
      { label: t('ad.chk2'), state: a.limit > 0 ? 'ok' : 'no' },
      { label: t('ad.chk3'), state: (a.subject.products || []).length === 1 ? 'warn' : 'ok', sub: (a.subject.products || []).length === 1 ? t('ad.one') : null },
      { label: t('ad.chk4'), state: a.schemes.length ? 'ok' : 'no' }
    ];
  }
  function adForm(a, ro) {
    function fld(label, ctl, full) { return '<div class="field' + (full ? ' full' : '') + '"><label class="lab">' + label + '</label>' + ctl + '</div>'; }
    function rov(v) { return '<div class="in ro">' + (v === '' || v == null ? '<span class="mut">—</span>' : IH.esc(v)) + '</div>'; }
    function segb(act, list, cur, multi) { return '<div class="seg">' + list.map(function (o) { var on = multi ? cur.indexOf(o.v) >= 0 : o.v === cur; return '<button type="button" data-act="' + act + '" data-arg="' + o.v + '" class="' + (on ? 'on' : '') + '">' + IH.esc(o.l) + '</button>'; }).join('') + '</div>'; }
    var sj = a.subject, active = IH.schemes().filter(function (s) { return s.status === 'aktivan'; });
    var s1 = '<div class="form-grid g3">' + fld(t('ad.fName'), ro ? rov(IH.L(a.name)) : '<input class="in" data-ad="name" value="' + IH.esc(IH.L(a.name)) + '">', true) +
      fld(t('ad.fFrom'), ro ? rov(F.date(a.from)) : '<input class="in" data-ad="from" value="' + F.date(a.from) + '">') + fld(t('ad.fTo'), ro ? rov(F.date(a.to)) : '<input class="in" data-ad="to" value="' + F.date(a.to) + '">') + fld(t('c.status'), rov(t('st2.' + a.status))) + '</div>';
    var s2 = '<div class="form-grid g3">' + fld(t('ad.fPt'), ro ? rov(D.ptypeName(sj.ptype)) : segb('ad-pt', D.ptypes.map(function (p) { return { v: p.id, l: IH.L(p.name) }; }), sj.ptype)) +
      fld(t('ad.fSegs'), ro ? rov((sj.segs || []).map(D.segName).join(', ')) : segb('ad-seg', D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }), sj.segs || [], true)) +
      fld(t('ad.fProds'), rov(prodNames(a)), ro) + '</div>' + (ro ? '' : IH.grid({ id: 'ad-prod', exportName: 'Proizvodi.xlsx', searchLabel: t('k.search'), actions: [], rows: function () { return IH.products().filter(function (p) { return p.status === 'aktivan' && p.ptype === sj.ptype && (!sj.segs.length || sj.segs.indexOf(p.seg) >= 0); }); }, key: function (p) { return p.id; }, label: function (p) { return D.productName(p); }, searchKeys: ['n'],
      select: { get: function () { return AD().subject.products; }, set: function (l) { AD().subject.products = l; }, onChange: function () { IH.render(); } },
      cols: [{ key: 'n', label: t('k.colProd'), val: function (p) { return D.productName(p); }, render: function (p) { return '<b>' + IH.esc(D.productName(p)) + '</b>'; } }, { key: 'seg', label: t('k.colSeg'), val: function (p) { return D.segName(p.seg); } }, { key: 'sub', label: t('k.colSub'), val: function (p) { return IH.L(p.sub); } }] }));
    var s3 = '<div class="form-grid g3">' + fld(t('ad.fKind'), ro ? rov(a.val.k === 'pct' ? t('ad.kPct') : t('ad.kRsd')) : segb('ad-k', [{ v: 'rsd', l: t('ad.kRsd') }, { v: 'pct', l: t('ad.kPct') }], a.val.k)) +
      fld(t('ad.fVal'), ro ? rov(fmtVal(a.val)) : '<input class="in tnum" data-ad="val" value="' + (a.val.k === 'pct' ? F.num(a.val.v * 100, 2) : F.num(a.val.v)) + '">') +
      fld(t('ad.fLimit'), ro ? rov(F.num(a.limit)) : '<input class="in tnum" data-ad="limit" value="' + F.num(a.limit) + '">') +
      fld(t('ad.fSch'), ro ? rov(a.schemes.map(function (x) { return D.scheme(x) ? IH.L(D.scheme(x).name) : x; }).join(', ')) : '<span class="chks">' + active.map(function (s) { return '<label class="chk" style="margin:0"><input type="checkbox" data-adsch="' + s.id + '"' + (a.schemes.indexOf(s.id) >= 0 ? ' checked' : '') + '><span>' + IH.esc(IH.L(s.name)) + '</span></label>'; }).join('') + '</span>', true) + '</div>';
    return section(t('ad.s1'), s1) + section(t('ad.s2'), s2) + section(t('ad.s3'), s3);
  }
  function addonDetail(id) {
    var a = addonById(id); if (!a) return addonsPage();
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('sc.back'), { icon: 'chevl', go: 'seme/dodaci' }) + (a.status === 'aktivan' ? ui.btn(t('ad.end'), { cls: 'danger', icon: 'trash', act: 'ad-end', arg: a.id }) : '') + '</div>';
    return ui.header(IH.esc(IH.L(a.name)), '', ui.btn(t('g.aCopy'), { icon: 'copy', act: 'ad-copy', arg: a.id }), '<a href="#/seme/dodaci">' + t('ad.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(IH.L(a.name))) + '<section class="card"><div class="cb">' + adForm(a, true) + '</div>' + foot + '</section>';
  }
  function addonNew() {
    if (!AD()) initAD();
    var a = AD(), foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('c.cancel'), { go: 'seme/dodaci' }) + ui.btn(t('ad.save'), { cls: 'primary', icon: 'check', act: 'ad-save' }) + '</div>';
    return ui.header(t('ad.new'), '', '', '<a href="#/seme/dodaci">' + t('ad.title') + '</a> ' + ic('chevr') + ' ' + t('ad.new')) + '<section class="card"><div class="cb">' + adForm(a, false) + '<div class="hr"></div>' + ui.checks(adChecks(a)) + '</div>' + foot + '</section>';
  }
  function isoOf(v, def) { var m = String(v || '').match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/); return m ? m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : def; }
  document.addEventListener('change', function (e) {
    var el = e.target, a = AD(); if (!a || !el.dataset) return;
    var k = el.dataset.ad;
    if (k === 'name') a.name = { sr: el.value, en: el.value };
    else if (k === 'from' || k === 'to') a[k] = isoOf(el.value, a[k]);
    else if (k === 'val') { var n = num(el.value); if (n != null) a.val.v = a.val.k === 'pct' ? n / 100 : n; }
    else if (k === 'limit') { var n2 = num(el.value); if (n2 != null) a.limit = n2; }
    else if (el.dataset.adsch) { var id = el.dataset.adsch; if (el.checked) { if (a.schemes.indexOf(id) < 0) a.schemes.push(id); } else a.schemes = a.schemes.filter(function (x) { return x !== id; }); }
    else return;
    IH.render();
  });
  IH.act['ad-pt'] = function (el) { var a = AD(); if (a.subject.ptype !== el.dataset.arg) { a.subject.ptype = el.dataset.arg; a.subject.products = []; } IH.render(); };
  IH.act['ad-seg'] = function (el) { var a = AD(), s = el.dataset.arg, l = a.subject.segs, i = l.indexOf(s); if (i >= 0) { if (l.length > 1) l.splice(i, 1); } else l.push(s); a.subject.products = []; IH.render(); };
  IH.act['ad-k'] = function (el) { var a = AD(); if (a.val.k !== el.dataset.arg) a.val = el.dataset.arg === 'pct' ? { k: 'pct', v: 0.001 } : { k: 'rsd', v: 1000 }; IH.render(); };
  IH.act['ad-new'] = function () { IH.form = {}; initAD(); IH.go('seme/dodaci/novi'); };
  IH.act['ad-copy'] = function (el) { IH.form = {}; initAD(addonById(el.dataset.arg)); IH.go('seme/dodaci/novi'); };
  IH.act['ad-save'] = function () {
    var a = AD(); if (!a) return;
    var bad = adChecks(a).filter(function (c) { return c.state === 'no'; });
    if (bad.length) { IH.toast(bad.map(function (c) { return c.label; }).join('; ')); return; }
    var rec = deep(a); rec.status = 'aktivan'; rec.by = IH.me().id; rec.at = IH.now();
    IH.list('newAddons').push(rec);
    IH.audit('addon', rec.id, { sr: 'Kampanjski dodatak aktiviran', en: 'Campaign add-on activated' }, { sr: F.date(rec.from) + ' – ' + F.date(rec.to), en: F.date(rec.from) + ' – ' + F.date(rec.to) });
    EN.invalidate(); IH.form = {}; IH.save(); IH.go('seme/dodaci'); IH.toast(t('ad.saved', { n: IH.esc(IH.L(rec.name)), d: F.date(rec.from) }));
  };
  IH.act['ad-end'] = function (el) { var a = addonById(el.dataset.arg); IH.modal({ title: t('ad.end') + ' — ' + IH.esc(IH.L(a.name)), body: '<p style="margin:0">' + t('ad.endTxt') + '</p>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('ad.end'), { cls: 'danger', icon: 'trash', act: 'ad-end-ok', arg: a.id }) }); };
  IH.act['ad-end-ok'] = function (el) {
    var id = el.dataset.arg; IH.map('addonEdits')[id] = Object.assign({}, IH.map('addonEdits')[id], { status: 'zavrsen', to: D.DATA_AS_OF });
    IH.audit('addon', id, { sr: 'Kampanjski dodatak završen', en: 'Campaign add-on ended' }, { sr: 'Važi do ' + F.date(D.DATA_AS_OF), en: 'Valid until ' + F.date(D.DATA_AS_OF) });
    EN.invalidate(); IH.save(); IH.closeModal(); IH.go('seme/dodaci'); IH.toast(t('ad.ended', { n: IH.esc(IH.L(addonById(id).name)) }));
  };
  IH.act['ad-hist'] = function (el) { var a = addonById(el.dataset.arg); IH.showHistory(IH.L(a.name), IH.auditFor('addon', a.id).concat([{ at: a.at || a.from + 'T08:00', by: a.by || 'A001', action: { sr: 'Dodatak kreiran', en: 'Add-on created' }, detail: { sr: F.date(a.from) + ' – ' + F.date(a.to), en: F.date(a.from) + ' – ' + F.date(a.to) } }])); };

  IH.route('seme', {
    title: function () { return t('sc.title'); },
    render: function (p) {
      if (!p[0]) return listPage();
      if (p[0] === 'rasporedi') return ui.header(t('sc.title')) + tabs('rasporedi') + (IH.rasBanner ? IH.rasBanner() : '') + IH.rasGrid({});
      if (p[0] === 'dodaci') return p[1] === 'novi' ? addonNew() : p[1] ? addonDetail(p[1]) : addonsPage();
      if (p[0] === 'nova') return wizardPage('new', null, p[1]);
      if (p[0] === 'kopija') return wizardPage('copy', p[1], p[2]);
      if (p[0] === 'izmena') return wizardPage('edit', p[1], p[2]);
      if (p[1] === 'verzija') return wizardPage('ver', p[0], p[2]);
      var s = D.scheme(p[0]); if (!s) return listPage();
      if (p[1] === 'primer') return subPage(s, t('sc.tExample'), examplePage(s));
      if (p[1] === 'zaposleni') return subPage(s, t('sc.tStaff'), IH.rasGrid({ scheme: s.id }));
      return detailPage(p[0]);
    }
  });
})();
