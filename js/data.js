/* Incentive Hub — mock podaci v2
   Katalog: 3 grupe klijenata (fizička lica, preduzetnici, poljoprivrednici) × 3 vrste proizvoda (računi, kartice, krediti),
   iz Kataloga proizvoda UniCredit Bank Srbija u primeni od 24.08.2026. Generator prodaje je determinističan. */
(function () {
  'use strict';
  var IH = window.IH = window.IH || {};
  var D = IH.data = {};

  D.TODAY = '2026-10-20';
  D.DATA_AS_OF = '2026-10-19';
  D.LAST_LOAD = '2026-10-20T06:12';
  function L(sr, en) { return { sr: sr, en: en == null ? sr : en }; }
  D.L2 = L;

  /* ---------- banka i organizacija ---------- */
  D.bank = {
    'unicredit-rs': { name: 'UniCredit Bank Srbija a.d.', short: 'UniCredit Bank', mark: 'UC', logo: 'img/uc-logo.png', domain: 'unicreditgroup.rs' },
    'dex-neutral': { name: 'Demo banka a.d.', short: 'Demo banka', mark: 'DB', domain: 'demobanka.rs' }
  };
  D.levels = [
    { id: 'L1', name: L('Banka', 'Bank') }, { id: 'L2', name: L('Region', 'Region') }, { id: 'L3', name: L('Ekspozitura', 'Branch') }, { id: 'L4', name: L('Tim', 'Team') }
  ];
  D.regions = [
    { id: 'R1', name: L('Region Central', 'Central Region'), head: 'D001' },
    { id: 'R2', name: L('Region Sever', 'North Region'), head: 'D002' },
    { id: 'R3', name: L('Region Istok/Zapad/Jug', 'East/West/South Region'), head: 'D003' }
  ];
  /* f: interni parametar generatora demo podataka (veličina ekspoziture) — ne prikazuje se */
  D.branches = [
    { id: 'B01', code: 'EKS-1101', region: 'R1', city: 'Beograd', addr: 'Novi Beograd – Jurija Gagarina 12', anon: 'Ekspozitura Beograd 1', f: 1.0, focus: true, prime: true, nL: 5, nU: 4, phone: '011 3204 100' },
    { id: 'B02', code: 'EKS-1124', region: 'R1', city: 'Beograd', addr: 'Beograd – Dorćol, Višnjićeva 18', anon: 'Ekspozitura Beograd 2', f: 0.7, opened: '2026-03-16', nL: 3, nU: 3, phone: '011 3204 240' },
    { id: 'B03', code: 'EKS-1107', region: 'R1', city: 'Beograd', addr: 'Beograd – Voždovac, Vojvode Stepe 74', anon: 'Ekspozitura Beograd 3', f: 0.9, prime: true, nL: 4, nU: 4, phone: '011 3204 170' },
    { id: 'B04', code: 'EKS-2101', region: 'R2', city: 'Novi Sad', addr: 'Novi Sad – Narodnih heroja 3', anon: 'Ekspozitura Novi Sad 1', f: 1.0, prime: true, nL: 5, nU: 4, phone: '021 4895 100' },
    { id: 'B05', code: 'EKS-2203', region: 'R2', city: 'Subotica', addr: 'Subotica – Park Rajhl Ferenca 7', anon: 'Ekspozitura Subotica', f: 0.75, nL: 3, nU: 3, phone: '024 6710 300' },
    { id: 'B06', code: 'EKS-3101', region: 'R3', city: 'Niš', addr: 'Niš – Bulevar dr Zorana Đinđića 15', anon: 'Ekspozitura Niš 1', f: 0.85, prime: true, nL: 4, nU: 4, phone: '018 5042 100' },
    { id: 'B07', code: 'EKS-3205', region: 'R3', city: 'Kragujevac', addr: 'Kragujevac – Kralja Petra I 23', anon: 'Ekspozitura Kragujevac', f: 0.8, nL: 4, nU: 3, phone: '034 3368 200' },
    { id: 'B08', code: 'EKS-3311', region: 'R3', city: 'Čačak', addr: 'Čačak – Kursulina 1', anon: 'Ekspozitura Čačak', f: 0.7, nL: 3, nU: 3, phone: '032 3493 500' }
  ];
  D.branch = function (id) { return D.branches.filter(function (b) { return b.id === id; })[0]; };
  D.branchName = function (b) {
    if (typeof b === 'string') b = D.branch(b);
    if (!b) return '';
    return IH.state.tenant === 'unicredit-rs' ? b.addr : b.anon;
  };
  /* kratak naziv: grad, a gde u gradu ima više ekspozitura i deo grada */
  D.branchShort = function (b) {
    if (typeof b === 'string') b = D.branch(b);
    if (!b) return '';
    if (IH.state.tenant !== 'unicredit-rs') return b.anon;
    var p = b.addr.split(' – '), c = p[0];
    return D.branches.filter(function (x) { return x.addr.split(' – ')[0] === c; }).length > 1 ? c + ' – ' + p[1].split(',')[0] : c;
  };
  D.region = function (id) { return D.regions.filter(function (r) { return r.id === id; })[0]; };

  D.positions = {
    menadzer: { name: L('Menadžer ekspoziture', 'Branch manager'), scheme: 'S-M2', role: 'manager', segs: [] },
    licni: { name: L('Savetnik', 'Advisor'), scheme: 'S-M1', role: 'employee', segs: ['FL'], sells: true },
    univerzalni: { name: L('Univerzalni bankar', 'Universal banker'), scheme: 'S-M3', role: 'employee', segs: ['FL', 'PR', 'PO'], sells: true },
    regionalni: { name: L('Regionalni direktor', 'Regional director'), role: 'manager' },
    admin: { name: L('Administrator prodajnog učinka', 'Sales performance administrator'), role: 'admin' },
    kontroling: { name: L('Kontroling', 'Controlling'), role: 'viewer' }
  };

  /* ---------- zaposleni ---------- */
  var E = [];
  function emp(o) { E.push(o); return o; }
  emp({ id: 'E1001', hr: 'HR-40217', name: 'Nikola Stanković', pos: 'menadzer', branch: 'B01', since: '2019-03-01', mgr: 'D001', phone: '+381 63 214 7701', born: '1984-05-12' });
  emp({ id: 'E1002', hr: 'HR-45930', name: 'Ana Jovanović', pos: 'licni', branch: 'B01', since: '2021-06-14', mgr: 'E1001', phone: '+381 64 118 2235', born: '1993-09-03' });
  emp({ id: 'E1003', hr: 'HR-47102', name: 'Marko Ilić', pos: 'licni', branch: 'B01', since: '2022-02-01', mgr: 'E1001', phone: '+381 65 302 9918', born: '1995-01-27' });
  emp({ id: 'E1004', hr: 'HR-38841', name: 'Jelena Đorđević', pos: 'licni', branch: 'B01', since: '2018-09-10', mgr: 'E1001', phone: '+381 63 556 0140', born: '1988-11-15' });
  emp({ id: 'E1005', hr: 'HR-43378', name: 'Stefan Pavlović', pos: 'licni', branch: 'B01', since: '2020-11-02', mgr: 'E1001', phone: '+381 64 771 3382', born: '1991-06-30' });
  emp({
    id: 'E1006', hr: 'HR-49015', name: 'Milica Kostić', pos: 'licni', branch: 'B01', since: '2023-04-03', mgr: 'E1001', phone: '+381 66 409 2217', born: '1997-03-21',
    history: [{ from: '2023-04-03', to: '2026-07-31', branch: 'B02', pos: 'licni' }, { from: '2026-08-01', branch: 'B01', pos: 'licni' }]
  });
  emp({ id: 'E1007', hr: 'HR-41562', name: 'Ivana Nikolić', pos: 'univerzalni', branch: 'B01', since: '2020-01-15', mgr: 'E1001', phone: '+381 63 880 1456', born: '1990-08-08' });
  emp({ id: 'E1008', hr: 'HR-46288', name: 'Petar Marković', pos: 'univerzalni', branch: 'B01', since: '2021-09-01', mgr: 'E1001', phone: '+381 64 235 6670', born: '1994-12-02' });
  emp({ id: 'E1009', hr: 'HR-39904', name: 'Tamara Lazić', pos: 'univerzalni', branch: 'B01', since: '2019-05-20', mgr: 'E1001', phone: '+381 65 517 8803', born: '1989-04-19' });
  emp({ id: 'E1010', hr: 'HR-50731', name: 'Luka Popović', pos: 'univerzalni', branch: 'B01', since: '2026-09-01', mgr: 'E1001', isNew: true, phone: '+381 66 690 4421', born: '2000-10-05' });

  emp({ id: 'D001', hr: 'HR-30112', name: 'Gordana Ristić', pos: 'regionalni', region: 'R1', since: '2015-02-01', phone: '+381 63 101 2200', born: '1976-02-14' });
  emp({ id: 'D002', hr: 'HR-30455', name: 'Zoran Vuković', pos: 'regionalni', region: 'R2', since: '2016-05-16', phone: '+381 63 101 2310', born: '1978-07-22' });
  emp({ id: 'D003', hr: 'HR-31020', name: 'Branka Simić', pos: 'regionalni', region: 'R3', since: '2017-01-09', phone: '+381 63 101 2420', born: '1980-03-09' });
  emp({ id: 'A001', hr: 'HR-35671', name: 'Dragana Milošević', pos: 'admin', since: '2017-10-02', phone: '+381 63 101 3050', born: '1986-10-30' });
  emp({ id: 'V001', hr: 'HR-36190', name: 'Vladimir Tomić', pos: 'kontroling', since: '2018-04-23', phone: '+381 63 101 3140', born: '1983-12-11' });

  /* ostale ekspoziture — deterministički generisana imena */
  var FN = ['Aleksandar', 'Marija', 'Milan', 'Jovana', 'Dragan', 'Tijana', 'Nenad', 'Sanja', 'Ivan', 'Maja', 'Dejan', 'Katarina', 'Miloš', 'Nataša', 'Bojan', 'Sofija', 'Nemanja', 'Teodora', 'Uroš', 'Mina', 'Filip', 'Kristina', 'Vuk', 'Snežana', 'Dušan', 'Bojana', 'Lazar', 'Jasmina', 'Đorđe', 'Andrijana', 'Vladan', 'Ljiljana', 'Igor', 'Danijela', 'Goran', 'Aleksandra', 'Srđan', 'Vesna', 'Ognjen', 'Milena', 'Rade', 'Nevena', 'Saša', 'Gorana', 'Mihajlo', 'Ivona', 'Predrag', 'Zorana', 'Darko', 'Olivera', 'Stevan', 'Biljana', 'Marko', 'Svetlana', 'Pavle', 'Jelisaveta', 'Strahinja', 'Anđela'];
  var LN = ['Petrović', 'Stojanović', 'Todorović', 'Živković', 'Kovačević', 'Lukić', 'Mitrović', 'Radović', 'Vasić', 'Savić', 'Obradović', 'Gajić', 'Božić', 'Filipović', 'Perić', 'Babić', 'Antić', 'Mladenović', 'Stevanović', 'Milenković', 'Krstić', 'Lazarević', 'Đukić', 'Zorić', 'Nedeljković', 'Ćirić', 'Marić', 'Jovičić', 'Rakić', 'Ignjatović', 'Bogdanović', 'Pantić', 'Milovanović', 'Aleksić', 'Arsić', 'Dimitrijević', 'Spasić', 'Cvetković', 'Matić', 'Bošković', 'Grujić', 'Tasić', 'Veljković', 'Nešić', 'Đurić', 'Jakovljević', 'Mihajlović', 'Ristović', 'Stamenković', 'Zdravković', 'Pejić', 'Lalić', 'Sretenović', 'Vidović', 'Knežević', 'Mićić', 'Prodanović', 'Šarić'];
  var nameIdx = 0, hrNo = 52000;
  function nextName() { var n = FN[(nameIdx * 7) % FN.length] + ' ' + LN[(nameIdx * 11 + 3) % LN.length]; nameIdx++; return n; }
  function phoneOf(seq) { return '+381 6' + (1 + seq % 6) + ' ' + String(100 + (seq * 37) % 900) + ' ' + String(1000 + (seq * 731) % 9000); }
  function bornOf(seq) { return (1975 + seq % 25) + '-' + String(1 + seq % 12).padStart(2, '0') + '-' + String(1 + (seq * 7) % 28).padStart(2, '0'); }
  var seq = 2000;
  D.branches.forEach(function (b) {
    if (b.focus) return;
    var m = emp({ id: 'E' + (++seq), hr: 'HR-' + (hrNo += 137), name: nextName(), pos: 'menadzer', branch: b.id, since: '2018-0' + (1 + seq % 9) + '-01', mgr: D.region(b.region).head, phone: phoneOf(seq), born: bornOf(seq) });
    for (var i = 0; i < b.nL; i++) emp({ id: 'E' + (++seq), hr: 'HR-' + (hrNo += 211), name: nextName(), pos: 'licni', branch: b.id, since: (2017 + seq % 8) + '-0' + (1 + seq % 9) + '-1' + (seq % 9), mgr: m.id, phone: phoneOf(seq), born: bornOf(seq) });
    for (var j = 0; j < b.nU; j++) emp({ id: 'E' + (++seq), hr: 'HR-' + (hrNo += 173), name: nextName(), pos: 'univerzalni', branch: b.id, since: (2018 + seq % 7) + '-0' + (1 + seq % 9) + '-0' + (1 + seq % 9), mgr: m.id, phone: phoneOf(seq), born: bornOf(seq) });
  });
  D.employees = E;
  D.emp = function (id) { return D._empIdx[id]; };
  D._empIdx = {}; E.forEach(function (e) { D._empIdx[e.id] = e; });
  D.team = function (mgrId) { return E.filter(function (e) { return e.mgr === mgrId; }); };
  D.branchStaff = function (bid, pos) { return E.filter(function (e) { return e.branch === bid && (!pos || e.pos === pos); }); };
  D.branchManager = function (bid) { return D.branchStaff(bid, 'menadzer')[0]; };
  D.posName = function (p) { return IH.L(D.positions[p].name); };
  D.email = function (e) {
    var s = e.name.toLowerCase().replace(/č|ć/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj').replace(/\s+/g, '.');
    return s + '@' + D.bank[IH.state.tenant].domain;
  };

  /* noćne promene iz DWH (20.10.) */
  D.orgChanges = [
    { id: 'OC1', type: 'novi', name: 'Mina Krstić', pos: 'univerzalni', branch: 'B01', eff: '2026-10-20', note: L('Nema raspoređenu bonus šemu', 'No bonus scheme assigned'), open: true },
    { id: 'OC2', type: 'premestaj', name: 'Dejan Savić', pos: 'licni', branch: 'B07', to: 'B08', eff: '2026-11-01', note: L('Promena ekspoziture od narednog meseca', 'Branch change from next month'), open: true },
    { id: 'OC3', type: 'odlazak', name: 'Snežana Perić', pos: 'licni', branch: 'B04', eff: '2026-10-31', note: L('Poslednji radni dan; obračun Q4 do 31.10.', 'Last working day; Q4 calculated to Oct 31'), open: false }
  ];

  /* ---------- periodi ---------- */
  D.periods = [
    { id: '2026-Q1', type: 'Q', from: '2026-01-01', to: '2026-03-31', label: 'Q1 2026', status: 'isplaceno', paidAt: '2026-04-24' },
    { id: '2026-Q2', type: 'Q', from: '2026-04-01', to: '2026-06-30', label: 'Q2 2026', status: 'isplaceno', paidAt: '2026-07-24' },
    { id: '2026-Q3', type: 'Q', from: '2026-07-01', to: '2026-09-30', label: 'Q3 2026', status: 'saglasnost', lockedAt: '2026-10-05T18:00', calcAt: '2026-10-06T09:14', sentAt: '2026-10-12T10:00', deadline: '2026-10-22' },
    { id: '2026-Q4', type: 'Q', from: '2026-10-01', to: '2026-12-31', label: 'Q4 2026', status: 'u_toku' },
    { id: '2026-07', type: 'M', from: '2026-07-01', to: '2026-07-31', label: L('Jul 2026', 'Jul 2026'), status: 'isplaceno', paidAt: '2026-08-14' },
    { id: '2026-08', type: 'M', from: '2026-08-01', to: '2026-08-31', label: L('Avgust 2026', 'Aug 2026'), status: 'isplaceno', paidAt: '2026-09-15' },
    { id: '2026-09', type: 'M', from: '2026-09-01', to: '2026-09-30', label: L('Septembar 2026', 'Sep 2026'), status: 'saglasnost', lockedAt: '2026-10-03T18:00', calcAt: '2026-10-05T08:40', sentAt: '2026-10-08T09:00', deadline: '2026-10-18' },
    { id: '2026-10', type: 'M', from: '2026-10-01', to: '2026-10-31', label: L('Oktobar 2026', 'Oct 2026'), status: 'u_toku' }
  ];
  /* planirani periodi: za njih se dodeljuju targeti i važe nove verzije, ali još nema prodaja ni obračuna */
  D.planPeriods = [
    { id: '2026-11', type: 'M', from: '2026-11-01', to: '2026-11-30', label: L('Novembar 2026', 'Nov 2026'), status: 'planiran' },
    { id: '2026-12', type: 'M', from: '2026-12-01', to: '2026-12-31', label: L('Decembar 2026', 'Dec 2026'), status: 'planiran' },
    { id: '2027-01', type: 'M', from: '2027-01-01', to: '2027-01-31', label: L('Januar 2027', 'Jan 2027'), status: 'planiran' },
    { id: '2027-02', type: 'M', from: '2027-02-01', to: '2027-02-28', label: L('Februar 2027', 'Feb 2027'), status: 'planiran' },
    { id: '2027-03', type: 'M', from: '2027-03-01', to: '2027-03-31', label: L('Mart 2027', 'Mar 2027'), status: 'planiran' },
    { id: '2027-Q1', type: 'Q', from: '2027-01-01', to: '2027-03-31', label: 'Q1 2027', status: 'planiran' },
    { id: '2027-Q2', type: 'Q', from: '2027-04-01', to: '2027-06-30', label: 'Q2 2027', status: 'planiran' }
  ];
  /* ---------- vrste perioda (Podešavanja → Obračunski periodi → Vrste perioda) ----------
     months = trajanje; lock / deadline / pay = dana posle kraja perioda: zaključavanje podataka, rok za saglasnost, isplata.
     Pravila važe za nove periode; postojeći periodi čuvaju svoje rokove. */
  D.periodTypes = [
    { id: 'M', months: 1, lock: 3, deadline: 18, pay: 25, active: true },
    { id: 'Q', months: 3, lock: 5, deadline: 22, pay: 30, active: true },
    { id: 'H', months: 6, lock: 7, deadline: 25, pay: 35, active: true },
    { id: 'Y', months: 12, lock: 10, deadline: 30, pay: 45, active: true }
  ];
  D.periodType = function (id) {
    var b = D.periodTypes.filter(function (x) { return x.id === id; })[0]; if (!b) return null;
    var e = ((IH.state && IH.state.data && IH.state.data.periodTypeEdits) || {})[id];
    return e ? Object.assign({}, b, e) : b;
  };
  D.activePeriodTypes = function () { return D.periodTypes.map(function (x) { return D.periodType(x.id); }).filter(function (x) { return x.active; }); };
  D.typeLen = function (id) { var x = D.periodTypes.filter(function (y) { return y.id === id; })[0]; return x ? x.months : 0; };

  /* ---------- kalendar perioda ----------
     zaključeni i tekući periodi (D.periods), planirani iz podataka (D.planPeriods) i generisani u ekranu Obračunski periodi (state.newPeriods);
     izmene rokova (state.periodEdits) upisuju se u sam period, pa ih vide svi ekrani (obračun, saglasnosti, isplata, obaveštenja). */
  var MN = [['Januar', 'Jan'], ['Februar', 'Feb'], ['Mart', 'Mar'], ['April', 'Apr'], ['Maj', 'May'], ['Jun', 'Jun'], ['Jul', 'Jul'], ['Avgust', 'Aug'], ['Septembar', 'Sep'], ['Oktobar', 'Oct'], ['Novembar', 'Nov'], ['Decembar', 'Dec']];
  function addD(iso, n) { var d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function lastDay(y, m) { return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); }
  function pad(n) { return ('0' + n).slice(-2); }
  function planDates(p, r) { var ty = r || D.periodType(p.type) || {}; return { lockBy: addD(p.to, ty.lock || 0), deadline: addD(p.to, ty.deadline || 0), payDate: addD(p.to, ty.pay || 0) }; }
  D.planDates = planDates;
  var PMAP = null, PLIST = null, PSIG = null, PDATA = null, ORIG = {};
  function rebuild() {
    var d = (IH.state && IH.state.data) || {}, gen = d.newPeriods || [], ed = d.periodEdits || {};
    PLIST = D.periods.concat(D.planPeriods).concat(gen); PMAP = {};
    PLIST.forEach(function (p) {
      var base = gen.indexOf(p) < 0;
      if (base && !ORIG[p.id]) {
        var o = { lockBy: p.lockBy, deadline: p.deadline, payDate: p.payDate, note: p.note };
        if (p.status === 'planiran' || p.status === 'u_toku') { var pd = planDates(p); ['lockBy', 'deadline', 'payDate'].forEach(function (k) { if (!o[k]) o[k] = pd[k]; }); }
        if (p.status === 'saglasnost' && !o.payDate && !p.paidAt) o.payDate = planDates(p).payDate;
        ORIG[p.id] = o;
      }
      if (base) Object.assign(p, ORIG[p.id]);
      if (ed[p.id]) Object.assign(p, ed[p.id]);
      PMAP[p.id] = p;
    });
    PDATA = d; PSIG = gen.length + ':' + (d._pv || 0);
  }
  function ensure() { var d = (IH.state && IH.state.data) || {}; if (!PMAP || d !== PDATA || PSIG !== (d.newPeriods || []).length + ':' + (d._pv || 0)) rebuild(); }
  D.allPeriods = function () { ensure(); return PLIST; };
  D.period = function (id) { ensure(); return PMAP[id]; };
  D.isPlanned = function (id) { var p = D.period(id); return !!p && p.status === 'planiran'; };
  D.periodLabel = function (id) { var p = D.period(id); return p ? IH.L(p.label) : id; };
  /* planirani periodi vrste (za „važi od“, dodelu i raspodelu) */
  D.plannedOf = function (type) { return D.allPeriods().filter(function (p) { return p.type === type && p.status === 'planiran'; }).sort(function (a, b) { return a.from < b.from ? -1 : 1; }); };
  /* kraći periodi unutar dužeg (meseci kvartala, kvartali polugodišta…) */
  D.subPeriods = function (pid, type) { var p = D.period(pid); if (!p) return []; return D.allPeriods().filter(function (x) { return x.type === type && x.from >= p.from && x.to <= p.to; }).sort(function (a, b) { return a.from < b.from ? -1 : 1; }).map(function (x) { return x.id; }); };
  /* generisanje perioda za godinu (postojeći se preskaču; rokovi po pravilima vrste) */
  D.genPeriods = function (year, types, rules) {
    var out = [], have = {}, y = String(year);
    D.allPeriods().forEach(function (p) { have[p.id] = 1; });
    types.forEach(function (ty) {
      var len = D.typeLen(ty); if (!len) return;
      for (var i = 0; i < 12 / len; i++) {
        var m0 = i * len + 1, m1 = m0 + len - 1;
        var id = ty === 'M' ? y + '-' + pad(m0) : ty === 'Q' ? y + '-Q' + (i + 1) : ty === 'H' ? y + '-H' + (i + 1) : y;
        if (have[id]) continue;
        var label = ty === 'M' ? L(MN[m0 - 1][0] + ' ' + y, MN[m0 - 1][1] + ' ' + y) : ty === 'Q' ? 'Q' + (i + 1) + ' ' + y : ty === 'H' ? L((i + 1) + '. polugodište ' + y, 'H' + (i + 1) + ' ' + y) : L('Godina ' + y, 'Year ' + y);
        var np = { id: id, type: ty, from: y + '-' + pad(m0) + '-01', to: lastDay(+y, m1), label: label, status: 'planiran', gen: true };
        out.push(Object.assign(np, planDates(np, rules && rules[ty])));
      }
    });
    return out;
  };
  function days(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 864e5) + 1; }
  D.elapsed = function (pid) { /* udeo proteklog perioda (za tekuće periode) */
    var p = D.period(pid);
    if (p.status !== 'u_toku') return 1;
    return days(p.from, D.DATA_AS_OF) / days(p.from, p.to);
  };
  D.daysInfo = function (pid) { var p = D.period(pid); return { done: Math.min(days(p.from, D.DATA_AS_OF), days(p.from, p.to)), total: days(p.from, p.to) }; };
  /* meseci unutar perioda (samo zaključeni i tekući) */
  D.monthsIn = function (pid) { var p = D.period(pid); return D.periods.filter(function (x) { return x.type === 'M' && x.from >= p.from && x.to <= p.to; }).map(function (x) { return x.id; }); };
  /* svi meseci perioda, uključujući planirane */
  D.monthsOfQ = function (pid) { return D.subPeriods(pid, 'M'); };

  /* ---------- grupe klijenata, vrste proizvoda ---------- */
  D.segments = [
    { id: 'FL', name: L('Fizička lica', 'Private individuals'), short: L('Fizička lica', 'Individuals') },
    { id: 'PR', name: L('Preduzetnici', 'Entrepreneurs'), short: L('Preduzetnici', 'Entrepreneurs') },
    { id: 'PO', name: L('Poljoprivrednici', 'Farmers'), short: L('Poljoprivrednici', 'Farmers') }
  ];
  D.seg = function (id) { return D.segments.filter(function (s) { return s.id === id; })[0]; };
  D.segName = function (id) { var s = D.seg(id); return s ? IH.L(s.name) : id; };
  /* vrsta proizvoda nosi podrazumevano pravilo merenja (predlog u čarobnjaku targeta) */
  D.ptypes = [
    {
      id: 'racun', code: 'RAC', name: L('Računi', 'Accounts'), one: L('Račun', 'Account'), unit: 'kom', measure: 'broj', basis: 'datum_prodaje',
      conds: [
        { tpl: 'T-FLAG', attr: 'naknada_naplacena', op: 'eq', value: true, window: { n: 45, unit: 'd', from: 'datum_prodaje' }, effect: 'odlozeno' },
        { tpl: 'T-NO-CANCEL', attr: 'datum_otkaza', op: 'not_within', window: { n: 90, unit: 'd', from: 'datum_prodaje' }, effect: 'storno' },
        { tpl: 'T-STAFF', attr: 'klijent_zaposleni', op: 'eq', value: false, effect: 'iskljucenje' }
      ]
    },
    {
      id: 'kartica', code: 'KRT', name: L('Kartice', 'Cards'), one: L('Kartica', 'Card'), unit: 'kom', measure: 'broj', basis: 'datum_prodaje',
      conds: [
        { tpl: 'T-ACTIVATION', attr: 'datum_aktivacije', op: 'within', window: { n: 30, unit: 'd', from: 'datum_prodaje' }, effect: 'odlozeno' },
        { tpl: 'T-NO-CANCEL', attr: 'datum_otkaza', op: 'not_within', window: { n: 6, unit: 'm', from: 'datum_prodaje' }, effect: 'storno' },
        { tpl: 'T-STAFF', attr: 'klijent_zaposleni', op: 'eq', value: false, effect: 'iskljucenje' }
      ]
    },
    {
      id: 'kredit', code: 'KRD', name: L('Krediti', 'Loans'), one: L('Kredit', 'Loan'), unit: 'RSD', measure: 'iznos', basis: 'datum_isplate',
      conds: [
        { tpl: 'T-STATUS', attr: 'status_ugovora', op: 'eq', value: 'isplacen', effect: 'uslov' },
        { tpl: 'T-EXCLUDE', attr: 'izvor_refi', op: 'ne', value: 'interni', effect: 'iskljucenje' },
        { tpl: 'T-MORTGAGE', attr: 'datum_hipoteke', op: 'within', window: { n: 90, unit: 'd', from: 'datum_isplate' }, when: 'hipoteka_potrebna', effect: 'odlozeno' },
        { tpl: 'T-NO-PREPAY', attr: 'datum_prevremene_otplate', op: 'not_within', window: { n: 90, unit: 'd', from: 'datum_isplate' }, effect: 'storno' },
        { tpl: 'T-STAFF', attr: 'klijent_zaposleni', op: 'eq', value: false, effect: 'iskljucenje' }
      ]
    }
  ];
  D.ptype = function (id) { return D.ptypes.filter(function (p) { return p.id === id; })[0]; };
  D.ptypeName = function (id) { if (!id) return IH.L(L('Više vrsta proizvoda', 'Several product types')); var p = D.ptype(id); return p ? IH.L(p.name) : id; };
  /* jedinica: komadi, iznos (RSD) ili bodovi */
  IH.unitTxt = function (u) { return u === 'RSD' ? 'RSD' : u === 'bod' ? IH.t('u.bod') : IH.t('u.kom'); };
  /* predmet targeta: bodovni target može obuhvatiti više vrsta proizvoda (ptype prazan, proizvodi navedeni) */
  D.subjProducts = function (sj) {
    sj = D.resolveSubj(sj); if (!sj) return [];
    var ps = IH.products ? IH.products() : D.products;
    return ps.filter(function (p) { return p.status === 'aktivan' && (!sj.ptype || p.ptype === sj.ptype) && (!(sj.segs && sj.segs.length) || sj.segs.indexOf(p.seg) >= 0) && (!(sj.products && sj.products.length) || sj.products.indexOf(p.id) >= 0); });
  };
  D.subjPtypes = function (sj) {
    sj = D.resolveSubj(sj); if (!sj) return [];
    if (sj.ptype) return [sj.ptype];
    var o = {}; (sj.products || []).forEach(function (id) { var p = D.product(id); if (p) o[p.ptype] = 1; });
    return D.ptypes.map(function (x) { return x.id; }).filter(function (id) { return o[id]; });
  };
  D.subjPtypeName = function (sj) { var l = D.subjPtypes(sj); return l.length ? l.map(D.ptypeName).join(', ') : '—'; };
  /* bodovi proizvoda u bodovnom targetu */
  D.ptsOf = function (t, productId) { var sj = D.resolveSubj(t && t.subject), p = sj && sj.points; return p && p[productId] != null ? p[productId] : 0; };
  /* bodovna lista (Katalog proizvoda → Bodovne liste): verzija koja važi u periodu (bez perioda: na današnji dan; planirana lista: prva verzija) */
  D.pointListAt = function (id, pid) {
    var l = D.pointList ? D.pointList(id) : null; if (!l) return null;
    var at = pid && D.period(pid) ? D.period(pid).from : D.TODAY;
    var vs = l.versions.slice().sort(function (a, b) { return a.from < b.from ? -1 : a.from > b.from ? 1 : a.v - b.v; });
    var ok = vs.filter(function (v) { return v.from <= at; });
    return ok.length ? ok[ok.length - 1] : vs[0];
  };
  /* predmet bodovnog targeta: proizvodi, bodovi, grupe i vrsta proizvoda dolaze iz bodovne liste */
  var PLC = {};
  D.resolveSubj = function (sj, pid) {
    if (!sj || !sj.plist || sj._pl) return sj;
    var v = D.pointListAt(sj.plist, pid); if (!v) return sj;
    var k = sj.plist + '|' + v.v + '|' + v.from + '|' + v.items.map(function (i) { return i.p + ':' + i.b; }).join(','), c = PLC[k];
    if (!c) {
      var points = {}, segs = [], pts = {};
      v.items.forEach(function (i) { points[i.p] = i.b; var p = D.product(i.p); if (p) { if (segs.indexOf(p.seg) < 0) segs.push(p.seg); pts[p.ptype] = 1; } });
      segs.sort(function (a, b) { return ['FL', 'PR', 'PO'].indexOf(a) - ['FL', 'PR', 'PO'].indexOf(b); });
      var ptl = D.ptypes.map(function (x) { return x.id; }).filter(function (id) { return pts[id]; });
      c = PLC[k] = { products: v.items.map(function (i) { return i.p; }), points: points, segs: segs, ptype: ptl.length === 1 ? ptl[0] : null, _pl: k, _plv: v.v };
    }
    return Object.assign({}, sj, c);
  };
  /* uslovi priznavanja za više vrsta proizvoda: podrazumevani uslovi svake vrste, uslov važi za vrste u „pt“; isti uslov se spaja */
  function condKey(c) { var o = Object.assign({}, c); delete o.pt; return JSON.stringify(o); }
  D.mixConds = function (pts, base) {
    var out = (base || []).map(function (c) { return JSON.parse(JSON.stringify(c)); });
    pts.forEach(function (pt) {
      var p = D.ptype(pt); if (!p) return;
      p.conds.forEach(function (c0) {
        var c = JSON.parse(JSON.stringify(c0)), k = condKey(c), hit = out.filter(function (x) { return condKey(x) === k; })[0];
        if (hit) { if (hit.pt && hit.pt.indexOf(pt) < 0) hit.pt.push(pt); }
        else { c.pt = [pt]; out.push(c); }
      });
    });
    return out;
  };
  /* obračunska kategorija = grupa klijenata × vrsta proizvoda */
  D.categories = [];
  D.segments.forEach(function (s) { D.ptypes.forEach(function (p) { D.categories.push({ id: s.id + '-' + p.code, seg: s.id, ptype: p.id, group: p.id, name: { sr: p.name.sr + ' – ' + s.name.sr.toLowerCase(), en: p.name.en + ' – ' + s.name.en.toLowerCase() } }); }); });
  D.cat = function (id) { return D.categories.filter(function (c) { return c.id === id; })[0]; };
  D.catOf = function (seg, ptype) { return seg + '-' + D.ptype(ptype).code; };

  /* ---------- katalog proizvoda (UC katalog 24.08.2026) ---------- */
  /* atributi proizvoda koje banka objavljuje u katalogu */
  D.attrDefs = [
    { k: 'valuta', name: L('Valuta', 'Currency') }, { k: 'rok', name: L('Rok / period', 'Term / period') }, { k: 'iznos', name: L('Iznos / limit', 'Amount / limit') },
    { k: 'kamata', name: L('Kamatna stopa', 'Interest rate') }, { k: 'naknada', name: L('Naknade', 'Fees') }, { k: 'obezbedjenje', name: L('Sredstva obezbeđenja', 'Collateral') },
    { k: 'kanal', name: L('Kanal ugovaranja', 'Channel') }, { k: 'klijenti', name: L('Namenjeno', 'Intended for') }
  ];
  function pr(id, seg, ptype, sub, name, gname, codes, attrs, extra) {
    return Object.assign({ id: id, seg: seg, ptype: ptype, cat: D.catOf(seg, ptype), sub: sub, name: name, gname: gname, codes: codes, attrs: attrs || {}, unit: D.ptype(ptype).unit, status: 'aktivan', from: '2026-01-01', ver: 2, w: 10 }, extra || {});
  }
  var EKS = L('Ekspozitura', 'Branch'), EKSMB = L('Ekspozitura, mobilna aplikacija', 'Branch, mobile app'), RES = L('Rezidenti i nerezidenti', 'Residents and non-residents');
  var MEN = L('Menice, jemstvo, administrativna zabrana', 'Bills of exchange, guarantor, salary assignment');
  var KRD_FIZ = L('Promenljiva: 3M Belibor + 0,3–23% · fiksna 1,3–30% godišnje', 'Variable: 3M Belibor + 0.3–23% · fixed 1.3–30% p.a.');
  var NAK_KRD = L('Obrada zahteva 0–5%, održavanje 0–2%', 'Processing 0–5%, maintenance 0–2%');
  var PR_KAM = L('Promenljiva: 3M Belibor + 0,3–19% · fiksna RSD 2,9–29,99%', 'Variable: 3M Belibor + 0.3–19% · fixed RSD 2.9–29.99%');
  var PR_OBZ = L('Menice, hipoteka, zaloga, jemstvo, vinkulirana polisa', 'Bills of exchange, mortgage, pledge, guarantor, assigned policy');
  var PO_KAM = L('Promenljiva: 6M Belibor + 0,3–30% · fiksna 2,9–30% godišnje', 'Variable: 6M Belibor + 0.3–30% · fixed 2.9–30% p.a.');
  var PO_OBZ = L('Menice, administrativna zabrana, hipoteka, zaloga, jemstvo', 'Bills of exchange, salary assignment, mortgage, pledge, guarantor');
  var NAK_PR = L('Obrada zahteva 0–5%, održavanje 0–5%', 'Processing 0–5%, maintenance 0–5%');
  D.products = [
    /* fizička lica — računi */
    pr('P01', 'FL', 'racun', L('Osnovni', 'Basic'), 'Platni račun sa osnovnim uslugama', L('Platni račun sa osnovnim uslugama', 'Basic payment account'), ['RAC-OSN-01'],
      { valuta: 'RSD', naknada: L('Vođenje računa 0–500 RSD mesečno', 'Account fee 0–500 RSD monthly'), kanal: EKSMB, klijenti: RES }, { w: 10 }),
    pr('P02', 'FL', 'racun', L('Paket', 'Package'), 'Paket račun Standard', L('Paket račun Standard', 'Standard package account'), ['PKG-STD-01', 'PKG-STD-02'],
      { valuta: 'RSD', naknada: L('Vođenje računa 0–500 RSD mesečno', 'Account fee 0–500 RSD monthly'), kanal: EKSMB, klijenti: L('Rezidenti i studenti (do 26 g. bez naknade)', 'Residents and students (free up to age 26)') }, { w: 45 }),
    pr('P03', 'FL', 'racun', L('Paket', 'Package'), 'Paket račun Gold', L('Paket račun Gold', 'Gold package account'), ['PKG-GLD-01'],
      { valuta: 'RSD', naknada: L('Vođenje računa 0–1.000 RSD mesečno', 'Account fee 0–1,000 RSD monthly'), kanal: EKS, klijenti: RES }, { w: 25 }),
    pr('P04', 'FL', 'racun', L('Paket', 'Package'), 'Paket račun Prime', L('Paket račun Prime', 'Prime package account'), ['PKG-PRM-01'],
      { valuta: 'RSD', naknada: L('Vođenje računa 0–5.000 RSD mesečno', 'Account fee 0–5,000 RSD monthly'), kanal: EKS, klijenti: RES }, { w: 6, from: '2026-05-13', ver: 1 }),
    pr('P05', 'FL', 'racun', L('Paket', 'Package'), 'Paket račun Senior plus', L('Paket račun Senior plus', 'Senior plus package account'), ['PKG-SNR-01'],
      { valuta: 'RSD', naknada: L('Vođenje računa 0–500 RSD mesečno', 'Account fee 0–500 RSD monthly'), kanal: EKS, klijenti: L('Rezidenti, penzioneri', 'Residents, pensioners') }, { w: 14 }),
    pr('P06', 'FL', 'racun', L('Devizni', 'Foreign currency'), 'Devizni tekući račun', L('Devizni tekući račun', 'Foreign currency account'), ['RAC-DEV-01'],
      { valuta: 'EUR, USD, CHF, GBP, SEK, CAD, AUD, JPY, NOK, DKK', kamata: L('EUR 0,0–0,6% fiksna, godišnja', 'EUR 0.0–0.6% fixed p.a.'), naknada: L('0–45 RSD mesečno', '0–45 RSD monthly'), kanal: EKS, klijenti: RES }, { w: 10 }),
    /* fizička lica — kartice */
    pr('P07', 'FL', 'kartica', L('Debitna', 'Debit'), 'DinaCard debitna kartica', L('DinaCard debitna kartica', 'DinaCard debit card'), ['DC-DNA-01'],
      { valuta: 'RSD', rok: L('5 godina', '5 years'), naknada: L('Naknade za transakcije na ATM 0–5.000 RSD', 'ATM transaction fees 0–5,000 RSD'), kanal: EKSMB, klijenti: RES }, { w: 20 }),
    pr('P08', 'FL', 'kartica', L('Debitna', 'Debit'), 'Mastercard debitna kartica', L('Mastercard debitna kartica', 'Mastercard debit card'), ['DC-MC-01'],
      { valuta: L('RSD / EUR / USD / GBP / CHF', 'RSD / EUR / USD / GBP / CHF'), rok: L('5 godina', '5 years'), naknada: L('Članarina i ostale naknade 0–5.000 RSD', 'Membership and other fees 0–5,000 RSD'), kanal: EKSMB, klijenti: RES }, { w: 25 }),
    pr('P09', 'FL', 'kartica', L('Debitna', 'Debit'), 'Mastercard Gold debitna kartica', L('Mastercard Gold debitna kartica', 'Mastercard Gold debit card'), ['DC-MCG-01'],
      { valuta: L('RSD / EUR / USD / GBP / CHF', 'RSD / EUR / USD / GBP / CHF'), rok: L('5 godina', '5 years'), naknada: L('Članarina i ostale naknade 0–5.000 RSD', 'Membership and other fees 0–5,000 RSD'), kanal: EKS, klijenti: L('Korisnici paketa Gold', 'Gold package clients') }, { w: 8 }),
    pr('P10', 'FL', 'kartica', L('Debitna', 'Debit'), 'Mastercard World Elite debitna kartica', L('Mastercard World Elite debitna kartica', 'Mastercard World Elite debit card'), ['DC-MWE-01'],
      { valuta: L('RSD / EUR / USD / GBP / CHF', 'RSD / EUR / USD / GBP / CHF'), rok: L('5 godina', '5 years'), naknada: L('Članarina i ostale naknade 0–5.000 RSD', 'Membership and other fees 0–5,000 RSD'), kanal: EKS, klijenti: L('Korisnici paketa Prime', 'Prime package clients') }, { w: 3 }),
    pr('P11', 'FL', 'kartica', L('Debitna', 'Debit'), 'Visa Gold debitna kartica', L('Visa Gold debitna kartica', 'Visa Gold debit card'), ['DC-VG-01'],
      { valuta: 'RSD', rok: L('5 godina', '5 years'), naknada: L('0–250 RSD mesečno', '0–250 RSD monthly'), kanal: EKS, klijenti: L('Korisnici paketa Gold', 'Gold package clients') }, { w: 5 }),
    pr('P12', 'FL', 'kartica', L('Debitna', 'Debit'), 'Visa Platinum debitna kartica', L('Visa Platinum debitna kartica', 'Visa Platinum debit card'), ['DC-VP-01'],
      { valuta: 'RSD', rok: L('5 godina', '5 years'), naknada: L('0–1.200 RSD mesečno', '0–1,200 RSD monthly'), kanal: EKS, klijenti: L('Korisnici paketa Prime', 'Prime package clients') }, { w: 2 }),
    pr('P13', 'FL', 'kartica', L('Kreditna', 'Credit'), 'Flexia Mastercard kreditna kartica', L('Flexia Mastercard kreditna kartica', 'Flexia Mastercard credit card'), ['CC-FLX-01', 'CC-FLX-MB'],
      { valuta: 'RSD', rok: L('3 godine', '3 years'), iznos: L('Limit 50.000–1.000.000 RSD (mobilna aplikacija do 200.000)', 'Limit 50,000–1,000,000 RSD (mobile app up to 200,000)'), kamata: L('5–15% godišnje, fiksna', '5–15% p.a., fixed'), naknada: L('Otplata 5% ili min. 600 RSD; plaćanje na rate 0–2.000 RSD', 'Repayment 5% or min. 600 RSD; instalments 0–2,000 RSD'), obezbedjenje: L('Menica, depozit, jemstvo (u mobilnoj aplikaciji bez obezbeđenja)', 'Bill of exchange, deposit, guarantor (none in mobile app)'), kanal: EKSMB, klijenti: RES }, { w: 30 }),
    pr('P14', 'FL', 'kartica', L('Kreditna', 'Credit'), 'Mastercard Platinum kreditna kartica', L('Mastercard Platinum kreditna kartica', 'Mastercard Platinum credit card'), ['CC-PLT-01'],
      { valuta: 'RSD', rok: L('3 godine', '3 years'), iznos: L('Limit od 500.000 RSD, prema kreditnoj sposobnosti', 'Limit from 500,000 RSD, by creditworthiness'), kamata: L('5–15% godišnje, fiksna', '5–15% p.a., fixed'), naknada: L('Otplata 5% ili min. 5.000 RSD', 'Repayment 5% or min. 5,000 RSD'), obezbedjenje: L('Menica, depozit, jemstvo', 'Bill of exchange, deposit, guarantor'), kanal: EKS, klijenti: L('Korisnici paketa Prime', 'Prime package clients') }, { w: 5 }),
    pr('P15', 'FL', 'kartica', L('Kreditna', 'Credit'), 'DinaCard kreditna kartica', L('DinaCard kreditna kartica', 'DinaCard credit card'), ['CC-DNA-01'],
      { valuta: 'RSD', rok: L('3 godine', '3 years'), iznos: L('Limit od 50.000 RSD', 'Limit from 50,000 RSD'), kamata: L('5–15% godišnje, fiksna', '5–15% p.a., fixed'), naknada: L('Otplata 33,33%, 16,67%, 8,33% ili min. 500 RSD', 'Repayment 33.33%, 16.67%, 8.33% or min. 500 RSD'), kanal: EKS, klijenti: RES }, { w: 0, status: 'neaktivan', to: '2026-06-30', note: L('Privremeno nije u ponudi (izmena sistema za odobravanje)', 'Temporarily withdrawn (approval system change)') }),
    /* fizička lica — krediti */
    pr('P16', 'FL', 'kredit', L('Gotovinski', 'Cash'), 'Gotovinski kredit u RSD sa osiguranjem', L('Gotovinski kredit u RSD sa osiguranjem', 'RSD cash loan with insurance'), ['KK-OSG-RSD'],
      { valuta: 'RSD', rok: L('6–71 mesec', '6–71 months'), iznos: L('Prema kreditnoj sposobnosti i uslovima osiguravača', 'By creditworthiness and insurer terms'), kamata: KRD_FIZ, naknada: NAK_KRD, obezbedjenje: L('Menice, jemstvo, polisa osiguranja kredita, administrativna zabrana', 'Bills of exchange, guarantor, loan insurance policy, salary assignment'), kanal: EKSMB, klijenti: L('Zaposleni i penzioneri', 'Employees and pensioners') }, { w: 35, amt: [250000, 900000] }),
    pr('P17', 'FL', 'kredit', L('Gotovinski', 'Cash'), 'Gotovinski kredit u RSD bez osiguranja', L('Gotovinski kredit u RSD bez osiguranja', 'RSD cash loan without insurance'), ['KK-RSD-36', 'KK-RSD-60'],
      { valuta: 'RSD', rok: L('6–71 mesec', '6–71 months'), iznos: L('Prema kreditnoj sposobnosti', 'By creditworthiness'), kamata: KRD_FIZ, naknada: NAK_KRD, obezbedjenje: MEN, kanal: EKSMB, klijenti: L('Zaposleni i penzioneri do 65 g.', 'Employees and pensioners up to 65') }, { w: 25, amt: [200000, 800000] }),
    pr('P18', 'FL', 'kredit', L('Gotovinski', 'Cash'), 'Gotovinski kredit sa depozitom', L('Gotovinski kredit sa depozitom', 'Cash loan with deposit'), ['KK-DEP-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('6–71 mesec', '6–71 months'), kamata: L('Fiksna 0,6–20% godišnje', 'Fixed 0.6–20% p.a.'), naknada: NAK_KRD, obezbedjenje: L('Garantni depozit 100–200% iznosa kredita', 'Guarantee deposit 100–200% of the loan'), kanal: EKS, klijenti: RES }, { w: 2, amt: [400000, 2000000] }),
    pr('P19', 'FL', 'kredit', L('Refinansiranje', 'Refinancing'), 'Kredit za refinansiranje sa osiguranjem', L('Kredit za refinansiranje sa osiguranjem', 'Refinancing loan with insurance'), ['KK-REF-OSG'],
      { valuta: 'RSD', rok: L('6–71 mesec', '6–71 months'), kamata: KRD_FIZ, naknada: NAK_KRD, obezbedjenje: L('Menice, jemstvo, polisa osiguranja kredita', 'Bills of exchange, guarantor, loan insurance policy'), kanal: EKS, klijenti: L('Zaposleni i penzioneri', 'Employees and pensioners') }, { w: 15, amt: [400000, 1500000], ref: true }),
    pr('P20', 'FL', 'kredit', L('Refinansiranje', 'Refinancing'), 'Kredit za refinansiranje bez osiguranja', L('Kredit za refinansiranje bez osiguranja', 'Refinancing loan without insurance'), ['KK-REF-01'],
      { valuta: 'RSD', rok: L('6–71 mesec', '6–71 months'), kamata: L('Promenljiva: 3M Belibor + 0,3–19,5% · fiksna 1,5–30%', 'Variable: 3M Belibor + 0.3–19.5% · fixed 1.5–30%'), naknada: NAK_KRD, obezbedjenje: MEN, kanal: EKS, klijenti: L('Zaposleni i penzioneri do 65 g.', 'Employees and pensioners up to 65') }, { w: 8, amt: [300000, 1200000], ref: true }),
    pr('P21', 'FL', 'kredit', L('Potrošački', 'Consumer'), 'Potrošački kredit u RSD', L('Potrošački kredit u RSD', 'RSD consumer loan'), ['PK-RSD-01'],
      { valuta: 'RSD', rok: L('6–71 mesec', '6–71 months'), kamata: L('Promenljiva: 3M Belibor + 0,3–20% · fiksna prva 24 meseca 1,5–35%', 'Variable: 3M Belibor + 0.3–20% · fixed first 24 months 1.5–35%'), naknada: NAK_KRD, obezbedjenje: MEN, kanal: EKS, klijenti: L('Zaposleni i penzioneri', 'Employees and pensioners') }, { w: 6, amt: [100000, 500000] }),
    pr('P22', 'FL', 'kredit', L('Potrošački', 'Consumer'), 'Kredit za energetsku efikasnost', L('Kredit za energetsku efikasnost', 'Energy efficiency loan'), ['EE-RSD-01'],
      { valuta: 'RSD', rok: L('6–71 mesec', '6–71 months'), kamata: KRD_FIZ, naknada: NAK_KRD, obezbedjenje: MEN, kanal: EKS, klijenti: L('Zaposleni i penzioneri', 'Employees and pensioners') }, { w: 3, amt: [250000, 900000] }),
    pr('P23', 'FL', 'kredit', L('Auto', 'Car'), 'Auto kredit u RSD', L('Auto kredit u RSD', 'RSD car loan'), ['AK-RSD-01'],
      { valuta: 'RSD', rok: L('12–71 mesec', '12–71 months'), kamata: L('Promenljiva: 3M Belibor + 0,3–19,5%', 'Variable: 3M Belibor + 0.3–19.5%'), naknada: NAK_KRD, obezbedjenje: L('Menice, kasko osiguranje, zaloga nad vozilom, jemstvo', 'Bills of exchange, comprehensive insurance, vehicle pledge, guarantor'), kanal: EKS, klijenti: RES }, { w: 2, amt: [800000, 2500000] }),
    pr('P24', 'FL', 'kredit', L('Stambeni', 'Housing'), 'Stambeni kredit osiguran kod NKOSK', L('Stambeni kredit osiguran kod NKOSK', 'NKOSK-insured housing loan'), ['SK-NKOSK-EUR', 'SK-NKOSK-RSD'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('5–20 godina (RSD), 5–30 godina (EUR)', '5–20 years (RSD), 5–30 years (EUR)'), iznos: L('Do 90% kupoprodajne vrednosti', 'Up to 90% of the purchase price'), kamata: L('EUR: promenljiva 6M Euribor + 0,5–10% · fiksna 1–10%', 'EUR: variable 6M Euribor + 0.5–10% · fixed 1–10%'), naknada: L('Troškovi procene, osiguranja, NKOSK premije', 'Valuation, insurance and NKOSK premium costs'), obezbedjenje: L('Hipoteka I reda, osiguranje života i nepokretnosti, NKOSK', 'First-rank mortgage, life and property insurance, NKOSK'), kanal: EKS, klijenti: RES }, { w: 1, amt: [3000000, 6000000] }),
    pr('P25', 'FL', 'kredit', L('Stambeni', 'Housing'), 'Stambeni kredit bez osiguranja NKOSK', L('Stambeni kredit bez osiguranja NKOSK', 'Housing loan without NKOSK insurance'), ['SK-EUR-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('5–20 godina (RSD), 5–30 godina (EUR)', '5–20 years (RSD), 5–30 years (EUR)'), iznos: L('Do 90% kupoprodajne vrednosti', 'Up to 90% of the purchase price'), kamata: L('EUR: promenljiva 6M Euribor + 0,5–15% · fiksna 1–10%', 'EUR: variable 6M Euribor + 0.5–15% · fixed 1–10%'), obezbedjenje: L('Hipoteka I reda, osiguranje života i nepokretnosti', 'First-rank mortgage, life and property insurance'), kanal: EKS, klijenti: RES }, { w: 1, amt: [3000000, 5000000] }),
    pr('P26', 'FL', 'kredit', L('Stambeni', 'Housing'), 'Kredit za adaptaciju i rekonstrukciju', L('Kredit za adaptaciju i rekonstrukciju', 'Renovation loan'), ['SK-ADP-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('5–10 godina', '5–10 years'), iznos: L('Od 500.000 RSD / 5.000 EUR', 'From 500,000 RSD / 5,000 EUR'), kamata: L('Promenljiva: 6M Belibor + 1–20% (RSD), 6M Euribor + 0,5–10% (EUR)', 'Variable: 6M Belibor + 1–20% (RSD), 6M Euribor + 0.5–10% (EUR)'), obezbedjenje: L('Hipoteka I reda, osiguranje', 'First-rank mortgage, insurance'), kanal: EKS, klijenti: RES }, { w: 1, amt: [500000, 2000000] }),
    pr('P27', 'FL', 'kredit', L('Prekoračenje', 'Overdraft'), 'Dozvoljeno prekoračenje', L('Dozvoljeno prekoračenje', 'Overdraft'), ['OD-ZAP-01', 'OD-PEN-01'],
      { valuta: 'RSD', rok: L('Do 36 meseci', 'Up to 36 months'), iznos: L('Do visine jedne zarade ili penzije (digitalno do 200.000 RSD bez menice)', 'Up to one salary or pension (digital up to 200,000 RSD without a bill of exchange)'), kamata: L('Fiksna 0–19% godišnje', 'Fixed 0–19% p.a.'), obezbedjenje: L('Menice, jemstvo', 'Bills of exchange, guarantor'), kanal: EKSMB, klijenti: L('Zaposleni i penzioneri', 'Employees and pensioners') }, { w: 8, amt: [50000, 150000] }),
    /* preduzetnici — računi */
    pr('P28', 'PR', 'racun', L('Paket', 'Package'), 'Paket račun Pro Standard', L('Paket račun Pro Standard', 'Pro Standard package account'), ['PRO-STD-01'],
      { valuta: 'RSD', naknada: L('Promenljiva, 0–2.000 RSD mesečno', 'Variable, 0–2,000 RSD monthly'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 40 }),
    pr('P29', 'PR', 'racun', L('Paket', 'Package'), 'Paket račun Pro Gold', L('Paket račun Pro Gold', 'Pro Gold package account'), ['PRO-GLD-01'],
      { valuta: 'RSD', naknada: L('Promenljiva, 0–2.000 RSD mesečno', 'Variable, 0–2,000 RSD monthly'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 30 }),
    pr('P30', 'PR', 'racun', L('Paket', 'Package'), 'Paket račun Pro Prestige', L('Paket račun Pro Prestige', 'Pro Prestige package account'), ['PRO-PRS-01'],
      { valuta: 'RSD', naknada: L('Promenljiva, 0–2.000 RSD mesečno', 'Variable, 0–2,000 RSD monthly'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 10 }),
    pr('P31', 'PR', 'racun', L('Devizni', 'Foreign currency'), 'Devizni tekući račun za preduzetnike', L('Devizni tekući račun za preduzetnike', 'Entrepreneur foreign currency account'), ['PRO-DEV-01'],
      { valuta: 'EUR, USD, CHF, GBP, SEK, CAD, AUD', naknada: L('Održavanje samo ako klijent nema paket račun', 'Maintenance only without a package account'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 20 }),
    /* preduzetnici — kartice */
    pr('P32', 'PR', 'kartica', L('Debitna', 'Debit'), 'DinaCard poslovna debitna kartica', L('DinaCard poslovna debitna kartica', 'DinaCard business debit card'), ['BC-DNA-01'],
      { valuta: 'RSD', rok: L('5 godina', '5 years'), naknada: L('ATM UCB bez naknade; druge banke 2%, min. 150 RSD', 'UCB ATM free; other banks 2%, min. 150 RSD'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 25 }),
    pr('P33', 'PR', 'kartica', L('Debitna', 'Debit'), 'Mastercard Business debitna kartica', L('Mastercard Business debitna kartica', 'Mastercard Business debit card'), ['BC-MB-01'],
      { valuta: L('RSD / EUR / USD / GBP / CHF', 'RSD / EUR / USD / GBP / CHF'), rok: L('5 godina', '5 years'), naknada: L('ATM UCB bez naknade; druge banke 2%, min. 150 RSD / 4 EUR', 'UCB ATM free; other banks 2%, min. 150 RSD / 4 EUR'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 35 }),
    pr('P34', 'PR', 'kartica', L('Debitna', 'Debit'), 'Mastercard World Business debitna kartica', L('Mastercard World Business debitna kartica', 'Mastercard World Business debit card'), ['BC-MWB-01'],
      { valuta: L('RSD / EUR / USD / GBP / CHF', 'RSD / EUR / USD / GBP / CHF'), rok: L('5 godina', '5 years'), naknada: L('Članarina; ostale naknade 0–15.000 RSD', 'Membership; other fees 0–15,000 RSD'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 10 }),
    pr('P35', 'PR', 'kartica', L('Debitna', 'Debit'), 'Prepaid nedopunjiva kartica', L('Prepaid nedopunjiva kartica', 'Non-reloadable prepaid card'), ['BC-PRE-01'],
      { valuta: 'RSD', rok: L('Do 3 godine', 'Up to 3 years'), naknada: L('Zamena plastike, reklamacije', 'Card replacement, disputes'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 5 }),
    pr('P36', 'PR', 'kartica', L('Kreditna', 'Credit'), 'Mastercard Business charge kartica', L('Mastercard Business charge kartica', 'Mastercard Business charge card'), ['BCC-CHG-01'],
      { valuta: 'RSD', rok: L('Do 24 meseca', 'Up to 24 months'), iznos: L('Limit 20.000–2.300.000 RSD', 'Limit 20,000–2,300,000 RSD'), kamata: L('25% godišnje, fiksna', '25% p.a., fixed'), naknada: L('Otplata 100% u celosti; gotovina 2%, min. 250 RSD', 'Repayment 100%; cash 2%, min. 250 RSD'), obezbedjenje: L('Menica, depozit, jemstvo, solidarni dužnik', 'Bill of exchange, deposit, guarantor, co-debtor'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 15 }),
    pr('P37', 'PR', 'kartica', L('Kreditna', 'Credit'), 'Mastercard Business revolving kartica', L('Mastercard Business revolving kartica', 'Mastercard Business revolving card'), ['BCC-REV-01'],
      { valuta: 'RSD', rok: L('Do 24 meseca', 'Up to 24 months'), iznos: L('Limit 20.000–2.300.000 RSD', 'Limit 20,000–2,300,000 RSD'), kamata: L('25% godišnje, fiksna', '25% p.a., fixed'), naknada: L('Otplata 10% ili min. 10.000 RSD', 'Repayment 10% or min. 10,000 RSD'), obezbedjenje: L('Menica, depozit, jemstvo, solidarni dužnik', 'Bill of exchange, deposit, guarantor, co-debtor'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 10 }),
    /* preduzetnici — krediti */
    pr('P38', 'PR', 'kredit', L('Obrtna sredstva', 'Working capital'), 'Kredit za obrtna sredstva', L('Kredit za obrtna sredstva', 'Working capital loan'), ['PR-OBS-01'],
      { valuta: L('RSD ili RSD indeksiran u EUR', 'RSD or EUR-indexed RSD'), rok: L('Do 36 meseci, grejs do 6 meseci', 'Up to 36 months, grace up to 6 months'), iznos: L('Do 300.000 EUR / 36.000.000 RSD', 'Up to 300,000 EUR / 36,000,000 RSD'), kamata: PR_KAM, naknada: NAK_PR, obezbedjenje: PR_OBZ, kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 40, amt: [1000000, 6000000] }),
    pr('P39', 'PR', 'kredit', L('Obrtna sredstva', 'Working capital'), 'Kredit za trajna obrtna sredstva', L('Kredit za trajna obrtna sredstva', 'Permanent working capital loan'), ['PR-TOS-01'],
      { valuta: L('RSD ili RSD indeksiran u EUR', 'RSD or EUR-indexed RSD'), rok: L('Do 36 meseci, grejs do 6 meseci', 'Up to 36 months, grace up to 6 months'), iznos: L('Do 300.000 EUR / 36.000.000 RSD', 'Up to 300,000 EUR / 36,000,000 RSD'), kamata: PR_KAM, naknada: NAK_PR, obezbedjenje: PR_OBZ, kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 15, amt: [2000000, 8000000] }),
    pr('P40', 'PR', 'kredit', L('Investicioni', 'Investment'), 'Investicioni kredit za mašine i opremu', L('Investicioni kredit za mašine i opremu', 'Investment loan for machinery and equipment'), ['PR-INV-MO'],
      { valuta: L('RSD ili RSD indeksiran u EUR', 'RSD or EUR-indexed RSD'), rok: L('1–10 godina, grejs do 12 meseci', '1–10 years, grace up to 12 months'), iznos: L('Do 300.000 EUR', 'Up to 300,000 EUR'), kamata: L('Promenljiva: 3M Belibor + 0,3–19% · fiksna RSD 2,9–19%', 'Variable: 3M Belibor + 0.3–19% · fixed RSD 2.9–19%'), naknada: NAK_PR, obezbedjenje: PR_OBZ, kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 15, amt: [3000000, 15000000] }),
    pr('P41', 'PR', 'kredit', L('Investicioni', 'Investment'), 'Investicioni kredit za poslovni prostor', L('Investicioni kredit za poslovni prostor', 'Investment loan for business premises'), ['PR-INV-PP'],
      { valuta: L('RSD ili RSD indeksiran u EUR', 'RSD or EUR-indexed RSD'), rok: L('1–10 godina, grejs do 12 meseci', '1–10 years, grace up to 12 months'), iznos: L('Do 300.000 EUR', 'Up to 300,000 EUR'), kamata: L('Promenljiva: 3M Belibor + 0,3–19% · fiksna RSD 2,9–19%', 'Variable: 3M Belibor + 0.3–19% · fixed RSD 2.9–19%'), naknada: NAK_PR, obezbedjenje: PR_OBZ, kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 5, amt: [5000000, 20000000] }),
    pr('P42', 'PR', 'kredit', L('Sa depozitom', 'Deposit-backed'), 'Kredit sa 100% depozita', L('Kredit sa 100% depozita', '100% deposit-backed loan'), ['PR-DEP-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('Do 36 meseci', 'Up to 36 months'), kamata: L('Fiksna, prema depozitu', 'Fixed, per deposit'), obezbedjenje: L('Namenski depozit 100%', 'Dedicated 100% deposit'), kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 5, amt: [500000, 3000000] }),
    pr('P43', 'PR', 'kredit', L('Prekoračenje', 'Overdraft'), 'Dozvoljeno prekoračenje za preduzetnike', L('Dozvoljeno prekoračenje za preduzetnike', 'Entrepreneur overdraft'), ['PR-OD-BIZ', 'PR-OD-POS'],
      { valuta: 'RSD', rok: L('Do 12 meseci', 'Up to 12 months'), iznos: L('BIZ minus prema prometu zarada; POS minus do 1.000.000 RSD; do 40.000 EUR', 'BIZ minus by salary turnover; POS minus up to 1,000,000 RSD; up to 40,000 EUR'), kamata: L('Promenljiva: 3M Belibor + 0,3–19% · fiksna 2,9–19%', 'Variable: 3M Belibor + 0.3–19% · fixed 2.9–19%'), naknada: L('Obrada zahteva 0–5%', 'Processing 0–5%'), obezbedjenje: PR_OBZ, kanal: EKS, klijenti: L('Preduzetnici', 'Entrepreneurs') }, { w: 20, amt: [300000, 1500000] }),
    /* poljoprivrednici */
    pr('P44', 'PO', 'racun', L('Osnovni', 'Basic'), 'Tekući račun za poljoprivrednika', L('Tekući račun za poljoprivrednika', 'Farmer current account'), ['AGR-RAC-01'],
      { valuta: 'RSD', naknada: L('Vođenje računa prema tarifi', 'Account fee per tariff'), kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 100 }),
    pr('P45', 'PO', 'kartica', L('Debitna', 'Debit'), 'DinaCard debitna kartica za poljoprivrednike', L('DinaCard debitna kartica za poljoprivrednike', 'DinaCard farmer debit card'), ['AGR-DC-DNA'],
      { valuta: 'RSD', rok: L('5 godina', '5 years'), kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 60 }),
    pr('P46', 'PO', 'kartica', L('Debitna', 'Debit'), 'Mastercard debitna kartica za poljoprivrednike', L('Mastercard debitna kartica za poljoprivrednike', 'Mastercard farmer debit card'), ['AGR-DC-MC'],
      { valuta: L('RSD / EUR', 'RSD / EUR'), rok: L('5 godina', '5 years'), kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 40 }),
    pr('P47', 'PO', 'kredit', L('Obrtna sredstva', 'Working capital'), 'Kredit za obrtna sredstva – poljoprivreda', L('Kredit za obrtna sredstva – poljoprivreda', 'Agricultural working capital loan'), ['AGR-OBS-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('Do 36 meseci, grejs do 6 meseci', 'Up to 36 months, grace up to 6 months'), iznos: L('Od 2.000 EUR', 'From 2,000 EUR'), kamata: PO_KAM, naknada: NAK_PR, obezbedjenje: PO_OBZ, kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 35, amt: [500000, 3000000] }),
    pr('P48', 'PO', 'kredit', L('Obrtna sredstva', 'Working capital'), 'Kredit za trajno obrtna sredstva – poljoprivreda', L('Kredit za trajno obrtna sredstva – poljoprivreda', 'Agricultural permanent working capital loan'), ['AGR-TOS-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('25–36 meseci, grejs do 6 meseci', '25–36 months, grace up to 6 months'), iznos: L('Od 2.000 EUR', 'From 2,000 EUR'), kamata: PO_KAM, naknada: NAK_PR, obezbedjenje: PO_OBZ, kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 10, amt: [1000000, 4000000] }),
    pr('P49', 'PO', 'kredit', L('Investicioni', 'Investment'), 'Kredit za osnovna sredstva – poljoprivreda', L('Kredit za osnovna sredstva – poljoprivreda', 'Agricultural fixed assets loan'), ['AGR-OSN-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('Do 60 meseci, grejs do 6 meseci', 'Up to 60 months, grace up to 6 months'), iznos: L('Od 2.000 EUR', 'From 2,000 EUR'), kamata: PO_KAM, naknada: NAK_PR, obezbedjenje: PO_OBZ, kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 15, amt: [1000000, 6000000] }),
    pr('P50', 'PO', 'kredit', L('Investicioni', 'Investment'), 'Kredit za poljoprivrednu mehanizaciju', L('Kredit za poljoprivrednu mehanizaciju', 'Agricultural machinery loan'), ['AGR-MEH-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('Do 120 meseci, grejs do 6 meseci', 'Up to 120 months, grace up to 6 months'), iznos: L('Od 2.000 EUR', 'From 2,000 EUR'), kamata: PO_KAM, naknada: NAK_PR, obezbedjenje: PO_OBZ, kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 20, amt: [2000000, 10000000] }),
    pr('P51', 'PO', 'kredit', L('Investicioni', 'Investment'), 'Kredit za kupovinu poljoprivrednog zemljišta', L('Kredit za kupovinu poljoprivrednog zemljišta', 'Agricultural land purchase loan'), ['AGR-ZEM-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('Do 180 meseci, grejs do 6 meseci', 'Up to 180 months, grace up to 6 months'), iznos: L('Od 2.000 EUR', 'From 2,000 EUR'), kamata: L('Promenljiva: 6M Belibor / Euribor + 0,3–30% · fiksna EUR 0,14–30%', 'Variable: 6M Belibor / Euribor + 0.3–30% · fixed EUR 0.14–30%'), naknada: NAK_PR, obezbedjenje: PO_OBZ, kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 10, amt: [2000000, 8000000] }),
    pr('P52', 'PO', 'kredit', L('Investicioni', 'Investment'), 'Kredit za poljoprivredne objekte', L('Kredit za poljoprivredne objekte', 'Agricultural buildings loan'), ['AGR-OBJ-01'],
      { valuta: L('RSD ili EUR', 'RSD or EUR'), rok: L('Do 120 meseci, grejs do 6 meseci', 'Up to 120 months, grace up to 6 months'), iznos: L('Od 2.000 EUR', 'From 2,000 EUR'), kamata: L('Promenljiva: 6M Belibor / Euribor + 0,3–30% · fiksna EUR 0,14–30%', 'Variable: 6M Belibor / Euribor + 0.3–30% · fixed EUR 0.14–30%'), naknada: NAK_PR, obezbedjenje: PO_OBZ, kanal: EKS, klijenti: L('Registrovana poljoprivredna gazdinstva', 'Registered agricultural holdings') }, { w: 10, amt: [3000000, 12000000] })
  ];
  D.product = function (id) { return D.products.filter(function (p) { return p.id === id; })[0]; };
  D.productName = function (p) {
    if (typeof p === 'string') p = D.product(p);
    if (!p) return '';
    return IH.state.tenant === 'unicredit-rs' ? (IH.state.lang === 'en' ? IH.L(p.gname) : p.name) : IH.L(p.gname);
  };
  D.productsOf = function (seg, ptype) { return D.products.filter(function (p) { return (!seg || p.seg === seg) && (!ptype || p.ptype === ptype); }); };
  D.codeIdx = {};
  D.products.forEach(function (p) { p.codes.forEach(function (c) { D.codeIdx[c] = p.id; }); });
  /* šifre iz DWH-a koje nisu mapirane */
  D.unmappedCodes = [
    { code: 'KK-RSD-PROMO-Q3', first: '2026-09-26', desc: L('Gotovinski kredit – jesenja akcija (nova šifra u core sistemu)', 'Cash loan – autumn promo (new core code)'), suggest: 'P17' },
    { code: 'CC-FLX-APP', first: '2026-10-09', desc: L('Flexia kartica ugovorena u mobilnoj aplikaciji', 'Flexia card contracted in the mobile app'), suggest: 'P13' },
    { code: 'PRO-GLD-02', first: '2026-10-14', desc: L('Pro Gold paket – nova varijanta', 'Pro Gold package – new variant'), suggest: 'P29' }
  ];
  D.codeDesc = function (code) { var u = D.unmappedCodes.filter(function (x) { return x.code === code; })[0]; return u ? IH.L(u.desc) : code; };

  /* ---------- seeded RNG ---------- */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {
    var a = hash(seed);
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  D.rng = rng;

  /* ---------- planovi ostvarenja (predefinisani scenariji) ---------- */
  /* M1: procenat ostvarenja [krediti, računi, kartice]; za tekući period: procenat UKUPNOG targeta ostvaren do danas */
  D.plan = {
    M1: {
      E1002: { '2026-Q1': [1.06, 1.0, .92], '2026-Q2': [1.09, 1.0, .9], '2026-Q3': [1.12, 1.04, .95], '2026-Q4': [.27, .22, .17] },
      E1003: { '2026-Q1': [.94, .88, 1.0], '2026-Q2': [.9, .85, 1.0], '2026-Q3': [.78, .92, 1.10], '2026-Q4': [.15, .19, .24] },
      E1004: { '2026-Q1': [1.2, 1.3, 1.1], '2026-Q2': [1.3, 1.35, 1.2], '2026-Q3': [1.36, 1.42, 1.25], '2026-Q4': [.33, .30, .26] },
      E1005: { '2026-Q1': [.95, .9, .85], '2026-Q2': [.74, .78, .79], '2026-Q3': [1.01, .88, .82], '2026-Q4': [.21, .17, .16] },
      E1006: { '2026-Q1': [.9, .95, .8], '2026-Q2': [.92, 1.0, .85], '2026-Q3': [.96, 1.0, .70], '2026-Q4': [.19, .21, .12] }
    },
    /* M3: timski procenat po KPI [krediti, računi, kartice], po ekspozituri i mesecu */
    M3: {
      B01: { '2026-07': [1.02, .98, 1.15], '2026-08': [1.05, 1.10, 1.2], '2026-09': [1.12, .96, 1.35], '2026-10': [.66, .55, .8] }
    }
  };
  /* eksplicitni storno scenariji: [emp, period, vrsta, iznos, datum, opis] */
  D.stornoPlan = [
    ['E1002', '2026-Q3', 'kredit', 650000, '2026-08-21', L('Prevremena otplata u roku od 90 dana', 'Early repayment within 90 days')],
    ['E1002', '2026-Q3', 'racun', 0, '2026-09-11', L('Račun zatvoren u roku od 90 dana', 'Account closed within 90 days')],
    ['E1005', '2026-Q2', 'kredit', 900000, '2026-05-19', L('Prevremena otplata u roku od 90 dana', 'Early repayment within 90 days')],
    ['E1005', '2026-Q2', 'kredit', 600000, '2026-06-03', L('Prevremena otplata u roku od 90 dana', 'Early repayment within 90 days')],
    ['E1005', '2026-Q2', 'racun', 0, '2026-06-17', L('Račun zatvoren u roku od 90 dana', 'Account closed within 90 days')],
    ['E1005', '2026-Q2', 'racun', 0, '2026-06-24', L('Račun zatvoren u roku od 90 dana', 'Account closed within 90 days')],
    ['E1005', '2026-Q2', 'kartica', 0, '2026-06-26', L('Kartica otkazana u roku od 6 meseci', 'Card cancelled within 6 months')],
    ['E1003', '2026-Q3', 'kartica', 0, '2026-09-02', L('Kartica otkazana u roku od 6 meseci', 'Card cancelled within 6 months')],
    ['E1004', '2026-Q3', 'kredit', 400000, '2026-08-07', L('Prevremena otplata u roku od 90 dana', 'Early repayment within 90 days')]
  ];

  /* ---------- targeti po zaposlenom ---------- */
  D.M1_TARGETS = { T1: 7500000, T2: 24, T3: 12 };
  D.M3_TARGETS = { K1: 3000000, K2: 36, K3: 20 };
  D.TKEYS = ['T1', 'T2', 'T3'];
  D.KKEYS = ['K1', 'K2', 'K3'];
  function branchAt(e, date) {
    if (!e.history) return e.branch;
    for (var i = 0; i < e.history.length; i++) { var h = e.history[i]; if (date >= h.from && (!h.to || date <= h.to)) return h.branch; }
    return e.branch;
  }
  D.branchAt = branchAt;
  D.roundT = function (v, unit) { return unit === 'RSD' ? Math.round(v / 100000) * 100000 : Math.round(v); };
  /* ---------- vrednosti targeta (dodela) ----------
     Nosilac: zaposleni {emp}, ekspozitura {branch} ili regija {region}.
     Redosled: ručna/planska dodela (IH.state.data.vals) → početne vrednosti iz plana banke.
     Individualni target: ekspozitura = zbir zaposlenih, regija = zbir ekspozitura.
     Timski target: zadaje se ekspozituri, ili je zbir dodela drugih targeta (value.mode = 'zbir'). */
  D.SEED_IND = { 'TG-101': 7500000, 'TG-102': 24, 'TG-103': 12 };
  D.SEED_TEAM = { 'TG-301': 3000000, 'TG-302': 36, 'TG-303': 20 };
  D.M1_KEY = { 'TG-101': 'T1', 'TG-102': 'T2', 'TG-103': 'T3' };
  function ckey(c) { return c.emp ? 'E:' + c.emp : c.branch ? 'B:' + c.branch : 'R:' + c.region; }
  D.valKey = function (tid, pid, c) { return tid + '|' + pid + '|' + ckey(c); };
  D.valOv = function (tid, pid, c) { var m = IH.state.data && IH.state.data.vals, v = m && m[D.valKey(tid, pid, c)]; return v == null ? null : v; };
  D.val = function (tid, pid, c) {
    var ov = D.valOv(tid, pid, c); if (ov != null) return ov;
    var t = D.target(tid), p = D.period(pid); if (!t || !p) return 0;
    if (c.region) return D.branches.filter(function (b) { return b.region === c.region; }).reduce(function (a, b) { return a + D.val(tid, pid, { branch: b.id }); }, 0);
    if (c.branch) return branchVal(t, p, c.branch);
    return empVal(t, p, c.emp);
  };
  function empVal(t, p, empId) {
    var e = D.emp(empId); if (!e) return 0;
    if (p.id === '2027-Q1' && D.M1_KEY[t.id] && D.bankerTarget27) return D.bankerTarget27(empId, D.M1_KEY[t.id]);
    var b = D.branch(branchAt(e, p.to > D.DATA_AS_OF ? D.DATA_AS_OF : p.to));
    var v = (D.SEED_IND[t.id] != null ? D.SEED_IND[t.id] : (t.base || 0)) * (b ? b.f : 1);
    var ex = D.exceptionFor(empId, p.id, t.id);
    if (ex) v = v * ex.factor;
    return D.roundT(v, t.unit);
  }
  function branchVal(t, p, bid) {
    if (t.kind !== 'timski') {
      if (p.id === '2027-Q1' && D.M1_KEY[t.id] && D.branchTarget27) return D.branchTarget27(bid, D.M1_KEY[t.id]);
      return D.branchStaff(bid, t.pos || 'licni').reduce(function (a, e) { return a + D.val(t.id, p.id, { emp: e.id }); }, 0);
    }
    var vm = t.value || {};
    if (vm.mode === 'zbir') return (vm.of || []).reduce(function (a, oid) {
      var o = D.target(oid); if (!o) return a;
      var pids = D.typeLen(o.periodType) < D.typeLen(p.type) ? D.subPeriods(p.id, o.periodType) : [p.id];
      return a + pids.reduce(function (x, m) { return x + D.val(oid, m, { branch: bid }); }, 0);
    }, 0);
    if (D.SEED_TEAM[t.id] != null && p.type === 'M') return D.teamTarget(bid, p.id, t.id);
    var f = (D.branch(bid) || {}).f || 1;
    return D.roundT((t.base || 0) * f, t.unit);
  }
  /* kompatibilnost: vrednost po ključu šeme savetnika (T1–T3) */
  D.targetFor = function (empId, pid, key) { var tg = D.targetByKey('S-M1', key); return tg ? D.val(tg.id, pid, { emp: empId }) : 0; };
  D.exceptions = [
    { emp: 'E1006', period: '2026-Q3', targets: ['TG-101', 'TG-102', 'TG-103'], factor: 2 / 3, reason: L('Premeštaj iz Dorćola 01.08. — target za 2 od 3 meseca', 'Transfer from Dorćol on Aug 1 — target for 2 of 3 months'), by: 'A001', at: '2026-07-28T11:20' }
  ];
  D.exceptionFor = function (empId, pid, tid) {
    return D.exceptions.filter(function (x) { return x.emp === empId && x.period === pid && x.targets.indexOf(tid) >= 0; })[0];
  };
  /* timski mesečni target: član se broji ako je u timu bar polovinu perioda */
  D.teamTarget = function (bid, pid, tid) {
    var b = D.branch(bid), p = D.period(pid), tot = days(p.from, p.to);
    var n = D.branchStaff(bid, 'univerzalni').filter(function (e) { return e.since <= p.to && days(e.since > p.from ? e.since : p.from, p.to) / tot >= 0.5; }).length;
    var tg = D.target(tid);
    return D.roundT(D.SEED_TEAM[tid] * b.f * (n / 4), tg ? tg.unit : 'kom');
  };
  /* kompatibilnost: po ključu šeme tima (K1–K3) i šeme menadžera (T1–T3) */
  D.teamTargetM3 = function (bid, pid, k) { var tg = D.targetByKey('S-M3', k); return tg ? D.val(tg.id, pid, { branch: bid }) : 0; };
  D.branchTarget = function (bid, pid, k) { var tg = D.targetByKey('S-M2', k); return tg ? D.val(tg.id, pid, { branch: bid }) : 0; };

  /* ---------- generator stavki ---------- */
  function prodsOf(seg, ptype) { return D.products.filter(function (p) { return p.seg === seg && p.ptype === ptype && p.status === 'aktivan' && p.w > 0; }); }
  function pickProd(r, seg, ptype) {
    var ps = prodsOf(seg, ptype); var tot = ps.reduce(function (s, p) { return s + p.w; }, 0);
    var x = r() * tot;
    for (var i = 0; i < ps.length; i++) { x -= ps[i].w; if (x <= 0) return ps[i]; }
    return ps[0];
  }
  function pickSeg(r, mix) { var x = r(); return x < mix[0] ? 'FL' : x < mix[0] + mix[1] ? 'PR' : 'PO'; }
  function bizDays(from, to) {
    var out = [], d = new Date(from + 'T00:00:00Z'), end = new Date(to + 'T00:00:00Z');
    while (d <= end) { var w = d.getUTCDay(); if (w !== 0 && w !== 6) out.push(d.toISOString().slice(0, 10)); d.setUTCDate(d.getUTCDate() + 1); }
    return out;
  }
  function rangeOf(pid, emp) {
    var p = D.period(pid), to = p.status === 'u_toku' ? D.DATA_AS_OF : p.to, from = p.from;
    if (emp && emp.since > from) from = emp.since;
    return bizDays(from, to);
  }
  function mkItem(r, e, pid, seqNo, o) {
    var date = o.date || o.dates[Math.floor(r() * o.dates.length)];
    var p = o.product || pickProd(r, o.seg, o.ptype);
    var code = o.code || p.codes[Math.floor(r() * p.codes.length)];
    return {
      id: 'TX-' + pid.replace('-', '') + '-' + e.id.slice(1) + '-' + String(seqNo).padStart(4, '0'),
      date: date, emp: e.id, branch: branchAt(e, date), period: pid,
      product: o.unmapped ? null : p.id, code: code, seg: p.seg, ptype: p.ptype, cat: o.unmapped ? null : p.cat,
      type: o.type || 'nova', amount: o.amount || 0,
      client: (p.seg === 'PR' ? 'Preduzetnik ••' : p.seg === 'PO' ? 'Gazdinstvo ••' : 'Klijent ••') + String(1000 + Math.floor(r() * 8999)), contract: 'UG-' + String(2600000 + Math.floor(r() * 899999)),
      source: 'DWH', status: o.unmapped ? 'nemapirano' : 'priznato', note: o.note || null
    };
  }
  /* iznos kredita prema proizvodu (zbir tačno = total) */
  function splitLoans(r, total, seg, ptype) {
    var out = [], rest = Math.round(total), guard = 0;
    while (rest > 0 && guard++ < 60) {
      var p = pickProd(r, seg, ptype), a = p.amt || [300000, 1500000];
      var v = Math.round((a[0] + r() * (a[1] - a[0])) / 10000) * 10000;
      if (v > rest) { if (rest >= a[0] * 0.5 || !out.length) v = rest; else { out[out.length - 1].amount += rest; break; } }
      out.push({ product: p, amount: v }); rest -= v;
    }
    return out;
  }

  var CACHE = {};
  function planFor(e, pid) {
    var p = D.plan.M1[e.id] && D.plan.M1[e.id][pid];
    if (p) return p;
    var r = rng('plan|' + e.id + '|' + pid);
    var running = D.period(pid).status === 'u_toku', el = D.elapsed(pid);
    return [0, 1, 2].map(function () { var v = 0.72 + r() * 0.62; return running ? v * el * (0.85 + r() * 0.3) : v; });
  }
  function stornoOf(empId, pid, ptype) { return D.stornoPlan.filter(function (s) { return s[0] === empId && s[1] === pid && s[2] === ptype; }); }

  /* prodaje koje (još) ne ispunjavaju uslove priznavanja (prikaz u Dnevnom ostvarenju, ne ulaze u ostvarenje);
     posebna sekvenca slučajnih brojeva — postojeće stavke se ne menjaju */
  function extraItems(e, pid, seq, segs) {
    var p = D.period(pid), r = rng('extra|' + e.id + '|' + pid), out = [], dates = rangeOf(pid, e), run = p.status === 'u_toku';
    if (!dates.length) return out;
    var seg = segs[Math.floor(r() * segs.length)];
    function add(o) { o.dates = o.dates || dates; o.seg = o.seg || seg; var it = mkItem(r, e, pid, ++seq.n, o); if (o.fail) it.fail = o.fail; out.push(it); }
    var late = dates.slice(-8), early = dates.slice(0, Math.max(1, dates.length - 30));
    if (run) {
      if (r() < 0.8) add({ ptype: 'kartica', fail: 'T-ACTIVATION', dates: late });
      if (r() < 0.6) add({ ptype: 'kartica', fail: 'T-ACTIVATION', dates: late });
      if (r() < 0.6) add({ ptype: 'racun', fail: 'T-FLAG', dates: late });
    } else {
      if (r() < 0.7) add({ ptype: 'kartica', fail: 'T-ACTIVATION', dates: early });
      var refi = D.products.filter(function (x) { return x.seg === 'FL' && x.ptype === 'kredit' && x.ref && x.status === 'aktivan'; });
      if (refi.length && r() < 0.5) { var pr = refi[Math.floor(r() * refi.length)]; add({ ptype: 'kredit', seg: 'FL', product: pr, amount: Math.round((400000 + r() * 900000) / 10000) * 10000, fail: 'T-EXCLUDE' }); }
    }
    if (!run && r() < 0.4) add({ ptype: r() < 0.5 ? 'racun' : 'kartica', fail: 'T-STAFF', dates: early });
    if (run && segs.indexOf('FL') >= 0 && r() < 0.6) { var sk = D.products.filter(function (x) { return x.seg === 'FL' && x.ptype === 'kredit' && /^SK-/.test(x.codes[0]) && x.status === 'aktivan'; }); if (sk.length) add({ ptype: 'kredit', seg: 'FL', product: sk[Math.floor(r() * sk.length)], amount: Math.round((6000000 + r() * 6000000) / 100000) * 100000, fail: 'T-MORTGAGE', dates: late }); }
    return out;
  }

  /* savetnik: fizička lica */
  D.genM1 = function (e, pid) {
    var r = rng('m1|' + e.id + '|' + pid), dates = rangeOf(pid, e), plan = planFor(e, pid), items = [], n = 0;
    if (!dates.length) return items;
    function add(o) { o.dates = dates; o.seg = o.seg || 'FL'; items.push(mkItem(r, e, pid, ++n, o)); }
    var tgt = { T1: D.targetFor(e.id, pid, 'T1'), T2: D.targetFor(e.id, pid, 'T2'), T3: D.targetFor(e.id, pid, 'T3') };
    var st1 = stornoOf(e.id, pid, 'kredit').reduce(function (a, s) { return a + s[3]; }, 0);
    splitLoans(r, tgt.T1 * plan[0] + st1, 'FL', 'kredit').forEach(function (x) { add({ ptype: 'kredit', product: x.product, amount: x.amount }); });
    var c2 = Math.round(tgt.T2 * plan[1]) + stornoOf(e.id, pid, 'racun').length;
    for (var a = 0; a < c2; a++) add({ ptype: 'racun' });
    var c3 = Math.round(tgt.T3 * plan[2]) + stornoOf(e.id, pid, 'kartica').length;
    for (var c = 0; c < c3; c++) add({ ptype: 'kartica' });
    /* storno */
    D.stornoPlan.forEach(function (s) {
      if (s[0] === e.id && s[1] === pid) add({ ptype: s[2], amount: s[3], type: 'storno', date: s[4], note: s[5] });
    });
    if (!D.plan.M1[e.id] && D.period(pid).status !== 'u_toku' && r() < 0.5) add({ ptype: 'kredit', amount: Math.round((200000 + r() * 500000) / 10000) * 10000, type: 'storno', note: L('Prevremena otplata u roku od 90 dana', 'Early repayment within 90 days') });
    /* nemapirane stavke (nova šifra iz core sistema) */
    if (pid === '2026-Q3') {
      if (e.id === 'E1002') items.push(mkItem(r, e, pid, ++n, { dates: dates, date: '2026-09-29', product: D.product('P17'), code: 'KK-RSD-PROMO-Q3', amount: 950000, unmapped: true }));
      else if (/^E20(0[2-9]|1[0-9])$/.test(e.id) && r() < 0.45) items.push(mkItem(r, e, pid, ++n, { dates: dates, date: '2026-09-' + (26 + Math.floor(r() * 4)), product: D.product('P17'), code: 'KK-RSD-PROMO-Q3', amount: Math.round((300000 + r() * 700000) / 10000) * 10000, unmapped: true }));
    }
    if (pid === '2026-Q4' && (e.id === 'E1003' || e.id === 'E2003' || e.id === 'E2016' || e.id === 'E2030')) items.push(mkItem(r, e, pid, ++n, { dates: dates, date: '2026-10-1' + (1 + Math.floor(r() * 6)), product: D.product('P13'), code: 'CC-FLX-APP', unmapped: true }));
    items = items.concat(extraItems(e, pid, { n: n }, ['FL']));
    items.sort(function (x, y) { return x.date < y.date ? -1 : x.date > y.date ? 1 : 0; });
    return items;
  };

  /* tim univerzalnih bankara: sve tri grupe klijenata, mesečno */
  D.genM3 = function (bid, pid) {
    var b = D.branch(bid), r = rng('m3|' + bid + '|' + pid), p = D.period(pid);
    var members = D.branchStaff(bid, 'univerzalni').filter(function (e) { return e.since <= (p.status === 'u_toku' ? D.DATA_AS_OF : p.to); });
    var plan = D.plan.M3[bid] && D.plan.M3[bid][pid];
    if (!plan) { var el = D.elapsed(pid); plan = [0, 1, 2].map(function () { var v = 0.76 + r() * 0.6; return p.status === 'u_toku' ? v * el * (0.85 + r() * 0.3) : v; }); }
    var items = [], n = {};
    var W = members.map(function (m) { return m.isNew ? 0.6 : 0.8 + r() * 0.5; });
    var WT = W.reduce(function (s, x) { return s + x; }, 0);
    function who() { var x = r() * WT; for (var i = 0; i < members.length; i++) { x -= W[i]; if (x <= 0) return members[i]; } return members[0]; }
    function add(e, o) { n[e.id] = (n[e.id] || 0) + 1; o.dates = rangeOf(pid, e); if (!o.dates.length) return; items.push(mkItem(r, e, pid, n[e.id], o)); }
    if (!members.length) return items;
    /* krediti: iznos raspoređen po segmentima */
    var k1 = D.teamTargetM3(bid, pid, 'K1') * plan[0], mixA = [0.55, 0.30, 0.15];
    [['FL', mixA[0]], ['PR', mixA[1]], ['PO', mixA[2]]].forEach(function (s) {
      splitLoans(r, k1 * s[1], s[0], 'kredit').forEach(function (x) { add(who(), { seg: s[0], ptype: 'kredit', product: x.product, amount: x.amount }); });
    });
    var k2 = Math.round(D.teamTargetM3(bid, pid, 'K2') * plan[1]);
    for (var i = 0; i < k2; i++) add(who(), { seg: pickSeg(r, [0.6, 0.25]), ptype: 'racun' });
    var k3 = Math.round(D.teamTargetM3(bid, pid, 'K3') * plan[2]);
    for (var j = 0; j < k3; j++) add(who(), { seg: pickSeg(r, [0.6, 0.25]), ptype: 'kartica' });
    if (p.status !== 'u_toku' && r() < 0.6) add(members[Math.floor(r() * members.length)], { seg: 'FL', ptype: 'racun', type: 'storno', note: L('Račun zatvoren u roku od 90 dana', 'Account closed within 90 days') });
    if (p.status === 'u_toku' && bid === 'B06') add(members[0], { seg: 'PR', product: D.product('P29'), code: 'PRO-GLD-02', date: '2026-10-14', unmapped: true });
    var xr = rng('extra|' + bid + '|' + pid), ex = members[Math.floor(xr() * members.length)];
    if (ex) items = items.concat(extraItems(ex, pid, { n: n[ex.id] || 0 }, ['FL', 'PR', 'PO']).filter(function (i) { return i.ptype !== 'kredit'; }));
    items.sort(function (a, c) { return a.date < c.date ? -1 : 1; });
    return items;
  };

  /* pristup stavkama */
  function longP(pid) { var p = D.period(pid); return !!p && (p.type === 'H' || p.type === 'Y'); }
  function cat(l) { return [].concat.apply([], l); }
  D.itemsM1 = function (empId, pid) {
    if (D.isPlanned(pid)) return [];
    if (longP(pid)) return cat(D.subPeriods(pid, 'Q').map(function (q) { return D.itemsM1(empId, q); }));
    var k = 'm1|' + empId + '|' + pid;
    if (!CACHE[k]) CACHE[k] = D.genM1(D.emp(empId), pid);
    return CACHE[k];
  };
  D.itemsM3 = function (bid, pid) {
    if (D.isPlanned(pid)) return [];
    if (longP(pid)) return cat(D.subPeriods(pid, 'M').map(function (m) { return D.itemsM3(bid, m); }));
    var k = 'm3|' + bid + '|' + pid;
    if (!CACHE[k]) CACHE[k] = D.genM3(bid, pid);
    return CACHE[k];
  };
  D.itemsOf = function (empId, pid) {
    var e = D.emp(empId);
    if (e.pos === 'licni') return D.itemsM1(empId, pid);
    if (e.pos === 'univerzalni') return D.itemsM3(e.branch, pid).filter(function (it) { return it.emp === empId; });
    return [];
  };
  D.allItems = function (pid) {
    if (D.isPlanned(pid)) return [];
    var k = 'all|' + pid;
    if (CACHE[k]) return CACHE[k];
    var out = [], p = D.period(pid);
    if (longP(pid)) return (CACHE[k] = cat(D.subPeriods(pid, 'Q').concat(D.subPeriods(pid, 'M')).map(D.allItems)));
    if (p.type === 'Q') D.employees.forEach(function (e) { if (e.pos === 'licni') out = out.concat(D.itemsM1(e.id, pid)); });
    else D.branches.forEach(function (b) { out = out.concat(D.itemsM3(b.id, pid)); });
    CACHE[k] = out;
    return out;
  };
  D.resetRuntime = function () { CACHE = {}; };
})();
