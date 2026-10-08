/* Incentive Hub — konfiguracija: targeti, bonus šeme (bonus za ostvaren target, provizija po prodaji, bonus + provizija iznad targeta), rasporedi, saglasnosti, obaveštenja */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, L = D.L2;
  function preset(pt) { var p = D.ptype(pt); return { unit: p.unit, measure: p.measure, basis: p.basis, formula: { agg: p.measure === 'iznos' ? 'zbir' : 'broj', measure: p.measure, basis: p.basis }, conds: JSON.parse(JSON.stringify(p.conds)) }; }
  function tg(o) {
    var p = o.subject.ptype ? preset(o.subject.ptype) : {};
    return Object.assign({ dir: 'rastuci', counted: ['nova'], status: 'aktivan', ver: 1, from: '2026-01-01', unit: p.unit, measure: p.measure, basis: p.basis, formula: p.formula, conds: p.conds }, o);
  }

  /* ---------- bodovne liste: koliko bodova nosi proizvod (Katalog proizvoda → Bodovne liste) ---------- */
  D.pointListsBase = [
    { id: 'BL-01', name: L('Kartice – fizička lica', 'Cards – private individuals'), status: 'aktivan',
      versions: [{ v: 1, from: '2026-10-01', at: '2026-09-15T10:00', note: L('Bodovi za kartice od Q4 2026', 'Card points from Q4 2026'),
        items: [{ p: 'P07', b: 1 }, { p: 'P08', b: 1 }, { p: 'P09', b: 2 }, { p: 'P11', b: 2 }, { p: 'P12', b: 3 }, { p: 'P10', b: 4 }, { p: 'P13', b: 4 }, { p: 'P14', b: 5 }] }] },
    { id: 'BL-02', name: L('Prodajni bodovi – fizička lica', 'Sales points – private individuals'), status: 'aktivan',
      versions: [{ v: 1, from: '2027-01-01', at: '2026-10-12T09:30', note: L('Bodovna politika za 2027.', '2027 points policy'),
        items: [{ p: 'P24', b: 10 }, { p: 'P25', b: 10 }, { p: 'P16', b: 5 }, { p: 'P17', b: 5 }, { p: 'P23', b: 4 }, { p: 'P21', b: 3 }, { p: 'P04', b: 4 }, { p: 'P03', b: 3 }, { p: 'P02', b: 2 }, { p: 'P14', b: 5 }, { p: 'P13', b: 4 }, { p: 'P10', b: 3 }] }] }
  ];
  D.pointLists = function () {
    var ext = IH.list ? IH.list('newPointLists') : [], vers = IH.list ? IH.list('pointListVersions') : [], ed = (IH.state && IH.state.data && IH.state.data.pointListEdits) || {};
    return D.pointListsBase.concat(ext).map(function (x) {
      var add = vers.filter(function (v) { return v.id === x.id; });
      return Object.assign({}, x, ed[x.id] || {}, { versions: x.versions.concat(add.map(function (v) { return { v: v.v, from: v.from, items: v.items, at: v.at, note: v.note }; })) });
    });
  };
  D.pointList = function (id) { return D.pointLists().filter(function (x) { return x.id === id; })[0]; };

  /* ---------- targeti ---------- */
  D.targets = [
    tg({ id: 'TG-101', name: L('Krediti – fizička lica', 'Loans – private individuals'), kind: 'individualni', pos: 'licni', periodType: 'Q', subject: { segs: ['FL'], ptype: 'kredit', products: [] }, base: 7500000, ver: 2, from: '2026-07-01',
      note: L('Isplaćeni gotovinski, potrošački, auto i stambeni krediti i prekoračenja', 'Disbursed cash, consumer, car and housing loans and overdrafts') }),
    tg({ id: 'TG-102', name: L('Računi – fizička lica', 'Accounts – private individuals'), kind: 'individualni', pos: 'licni', periodType: 'Q', subject: { segs: ['FL'], ptype: 'racun', products: [] }, base: 24, ver: 2, from: '2026-07-01' }),
    tg({ id: 'TG-103', name: L('Kartice – fizička lica', 'Cards – private individuals'), kind: 'individualni', pos: 'licni', periodType: 'Q', subject: { segs: ['FL'], ptype: 'kartica', products: [] }, base: 12 }),
    tg({ id: 'TG-201', name: L('Krediti ekspoziture', 'Branch loans'), kind: 'timski', team: ['licni', 'univerzalni'], periodType: 'Q', subject: { segs: ['FL', 'PR', 'PO'], ptype: 'kredit', products: [] }, base: 45000000, value: { mode: 'zbir', of: ['TG-101', 'TG-301'] },
      note: L('Stavke se pripisuju ekspozituri u kojoj je zaposleni bio na dan prodaje', 'Items attributed to the branch where the employee worked on the sale date') }),
    tg({ id: 'TG-202', name: L('Računi ekspoziture', 'Branch accounts'), kind: 'timski', team: ['licni', 'univerzalni'], periodType: 'Q', subject: { segs: ['FL', 'PR', 'PO'], ptype: 'racun', products: [] }, base: 230, value: { mode: 'zbir', of: ['TG-102', 'TG-302'] } }),
    tg({ id: 'TG-203', name: L('Kartice ekspoziture', 'Branch cards'), kind: 'timski', team: ['licni', 'univerzalni'], periodType: 'Q', subject: { segs: ['FL', 'PR', 'PO'], ptype: 'kartica', products: [] }, base: 120, value: { mode: 'zbir', of: ['TG-103', 'TG-303'] } }),
    tg({ id: 'TG-301', name: L('Krediti – tim univerzalnih bankara', 'Loans – universal banker team'), kind: 'timski', team: ['univerzalni'], periodType: 'M', subject: { segs: ['FL', 'PR', 'PO'], ptype: 'kredit', products: [] }, base: 3000000 }),
    tg({ id: 'TG-302', name: L('Računi – tim univerzalnih bankara', 'Accounts – universal banker team'), kind: 'timski', team: ['univerzalni'], periodType: 'M', subject: { segs: ['FL', 'PR', 'PO'], ptype: 'racun', products: [] }, base: 36 }),
    tg({ id: 'TG-303', name: L('Kartice – tim univerzalnih bankara', 'Cards – universal banker team'), kind: 'timski', team: ['univerzalni'], periodType: 'M', subject: { segs: ['FL', 'PR', 'PO'], ptype: 'kartica', products: [] }, base: 20, ver: 2, from: '2026-07-01' }),
    /* slobodni targeti (nisu u šemi) — primeri za dodavanje u šemu */
    tg({ id: 'TG-402', name: L('Krediti – preduzetnici', 'Loans – entrepreneurs'), kind: 'individualni', pos: 'univerzalni', periodType: 'Q', subject: { segs: ['PR'], ptype: 'kredit', products: [] }, base: 9000000, from: '2026-10-01' }),
    tg({ id: 'TG-403', name: L('Kreditne kartice – fizička lica', 'Credit cards – private individuals'), kind: 'individualni', pos: 'licni', periodType: 'Q', subject: { segs: ['FL'], ptype: 'kartica', products: ['P13', 'P14'] }, base: 6, from: '2026-10-01' }),
    /* bodovni targeti: proizvode i bodove daje bodovna lista; ostvarenje = zbir bodova priznatih prodaja − storno */
    tg({ id: 'TG-104', name: L('Kartice – bodovi (fizička lica)', 'Cards – points (private individuals)'), kind: 'individualni', pos: 'licni', periodType: 'Q', from: '2026-10-01',
      subject: { segs: ['FL'], ptype: 'kartica', plist: 'BL-01', products: [] },
      unit: 'bod', measure: 'bodovi', formula: { agg: 'zbir', measure: 'bodovi', basis: 'datum_prodaje' }, base: 28 }),
    tg({ id: 'TG-105', name: L('Prodajni bodovi – fizička lica', 'Sales points – private individuals'), kind: 'individualni', pos: 'licni', periodType: 'Q', from: '2027-01-01',
      subject: { segs: ['FL'], ptype: null, plist: 'BL-02', products: [] },
      unit: 'bod', measure: 'bodovi', formula: { agg: 'zbir', measure: 'bodovi', basis: 'datum_prodaje' }, conds: D.mixConds(['kredit', 'racun', 'kartica']), base: 150 })
  ];
  D.target = function (id) { return D.targets.concat((IH.state.data && IH.state.data.newTargets) || []).filter(function (t) { return t.id === id; })[0]; };
  /* target po ključu iz šeme (ključ T1, K1… važi samo unutar šeme) */
  D.targetByKey = function (scheme, key) { var s = D.scheme(scheme), tc = s && s.targets.filter(function (x) { return x.key === key; })[0]; return tc ? D.target(tc.id) : null; };
  /* verzija targeta za period: planirane verzije (izmena targeta) važe od svog datuma */
  function targetAt0(id, pid) {
    var b = D.target(id), p = D.period(pid); if (!b || !p) return b;
    var vs = ((IH.state.data && IH.state.data.targetVersions) || []).filter(function (v) { return v.id === id && v.from <= p.from; });
    if (!vs.length) return b;
    var v = vs[vs.length - 1];
    return Object.assign({}, b, { ver: v.v, from: v.from, base: v.base != null ? v.base : b.base, subject: v.subject || b.subject, formula: v.formula || b.formula, conds: v.conds || b.conds, dir: v.dir || b.dir, mode: v.mode || b.mode, value: v.value || b.value });
  };

  /* target u periodu; bodovni target dobija proizvode i bodove iz verzije bodovne liste koja važi u periodu */
  D.targetAt = function (id, pid) {
    var x = targetAt0(id, pid);
    return x && x.subject && x.subject.plist && !x.subject._pl ? Object.assign({}, x, { subject: D.resolveSubj(x.subject, pid) }) : x;
  };

  /* ---------- bonus šeme ---------- */
  /* skala: ostvarenje od (uključeno) – do (isključeno) → % isplate; poslednji red je otvoren */
  var SCALE_Q = [{ to: 0.8, f: 0 }, { to: 1.0, f: 0.6 }, { to: 1.2, f: 1.0 }, { to: null, f: 1.3 }];
  var SCALE_M = [{ to: 0.8, f: 0 }, { to: 1.0, f: 0.8 }, { to: 1.2, f: 1.0 }, { to: 1.5, f: 1.2 }, { to: null, f: 1.5 }];
  D.SCALES = { Q: SCALE_Q, M: SCALE_M };
  D.schemeTypes = [
    { id: 'scorecard', name: L('Bonus za ostvaren target', 'Bonus for achieved target'), d: L('Iznos na 100% targeta × ostvarenje', 'Amount at 100% of target × achievement') },
    { id: 'provizija', name: L('Provizija po prodaji', 'Commission per sale'), d: L('Svaka prodaja donosi iznos ili % od iznosa', 'Every sale earns an amount or a % of the amount') },
    { id: 'kombinovana', name: L('Bonus + provizija iznad targeta', 'Bonus + commission above target'), d: L('Do 100% bonus, iznad 100% provizija', 'Bonus up to 100%, commission above 100%') }
  ];
  D.schemes = [
    {
      id: 'S-M1', code: 'BS-LB-2026', type: 'scorecard', model: 'M1', name: L('Savetnik – fizička lica 2026', 'Advisor – private individuals 2026'),
      pos: 'licni', periodType: 'Q', status: 'aktivan',
      versions: [
        { v: 1, from: '2026-01-01', to: '2026-06-30', base: 55000, limit: 80000, contAmount: 8000, note: L('Početna verzija', 'Initial version') },
        { v: 2, from: '2026-07-01', to: null, base: 60000, limit: 85000, contAmount: 10000, note: L('Veća osnova i limit', 'Higher base and limit') },
        { v: 3, from: '2027-01-01', to: null, base: 63000, limit: 90000, contAmount: 10000, planned: true, at: '2026-10-14T10:20', note: L('Plan 2027: pravila između targeta', '2027 plan: rules between targets'),
          targets: [{ key: 'T1', id: 'TG-101', share: 0.4 }, { key: 'T2', id: 'TG-102', share: 0.3 }, { key: 'T3', id: 'TG-103', share: 0.3 }],
          scale: [{ to: 0.8, f: 0 }, { to: 1.0, f: 0.6 }, { to: 1.2, f: 1.0 }, { to: null, f: 1.3 }],
          rules: [
            { tpl: 'umanjenje', cond: 'T1', min: 0.85, affects: ['T2', 'T3'], factor: 0.5 },
            { tpl: 'timski', src: 'eksp', target: 'TG-201', min: 0.8, affects: ['T1', 'T2', 'T3'], factor: 0.8 },
            { tpl: 'nodm', n: 2, keys: ['T1', 'T2', 'T3'], min: 0.9, affects: ['T1', 'T2', 'T3'], factor: 0.8 },
            { tpl: 'pojacanje', cond: 'T1', min: 1.1, affects: ['T2'], factor: 1.2 },
            { tpl: 'kap', affects: ['T3'], k: 1.0 }
          ] }
      ],
      targets: [{ key: 'T1', id: 'TG-101', share: 0.4 }, { key: 'T2', id: 'TG-102', share: 0.3 }, { key: 'T3', id: 'TG-103', share: 0.3 }],
      scale: SCALE_Q,
      conds: [{ cond: 'T1', min: 0.85, affects: ['T2', 'T3'], factor: 0.5 }, { src: 'eksp', target: 'TG-201', min: 0.8, affects: ['T1', 'T2', 'T3'], factor: 0.8, from: '2026-07-01' }],
      continuity: { target: 'T1', min: 1.0, periods: 3 },
      carryNegative: true
    },
    {
      id: 'S-M1P', code: 'BS-LB-PROV', type: 'provizija', model: 'M1', name: L('Savetnik – provizija po prodaji (pilot Novi Sad)', 'Advisor – commission per sale (Novi Sad pilot)'),
      pos: 'licni', periodType: 'Q', status: 'aktivan',
      versions: [{ v: 1, from: '2026-07-01', to: '2026-09-30', limit: 90000, contAmount: 0, note: L('Pilot od Q3 2026', 'Pilot from Q3 2026') },
        { v: 2, from: '2026-10-01', to: null, limit: 90000, contAmount: 0, at: '2026-09-18T10:00', note: L('Kartice u bodovima od Q4 2026', 'Cards in points from Q4 2026'),
          targets: [{ key: 'T1', id: 'TG-101', val: { k: 'pct', v: 0.006 } }, { key: 'T2', id: 'TG-102', val: { k: 'rsd', v: 1200 } }, { key: 'T3', id: 'TG-104', val: { k: 'rsd', v: 600 } }] }],
      targets: [{ key: 'T1', id: 'TG-101', val: { k: 'pct', v: 0.006 } }, { key: 'T2', id: 'TG-102', val: { k: 'rsd', v: 1200 } }, { key: 'T3', id: 'TG-103', val: { k: 'rsd', v: 1500 } }],
      scale: SCALE_Q,
      conds: [{ cond: 'T1', min: 0.85, affects: ['T2', 'T3'], factor: 0.5 }],
      carryNegative: true
    },
    {
      id: 'S-M2', code: 'BS-ME-2026', type: 'scorecard', model: 'M2', name: L('Menadžer ekspoziture 2026', 'Branch manager 2026'),
      pos: 'menadzer', periodType: 'Q', status: 'aktivan',
      versions: [
        { v: 1, from: '2026-01-01', to: null, base: 120000, limit: 180000, note: L('Početna verzija', 'Initial version') },
        { v: 2, from: '2027-01-01', to: null, base: 120000, limit: 200000, planned: true, at: '2026-10-14T11:05', note: L('Plan 2027: vrednost iznad targeta i matrica krediti × računi', '2027 plan: value above target and loans × accounts matrix'), type: 'kombinovana',
          targets: [{ key: 'T1', id: 'TG-201', share: 0.4, val: { k: 'pct', v: 0.001 } }, { key: 'T2', id: 'TG-202', share: 0.3, val: { k: 'rsd', v: 300 } }, { key: 'T3', id: 'TG-203', share: 0.3, val: { k: 'rsd', v: 300 } }],
          rules: [{ tpl: 'matrica', a: 'T1', b: 'T2', ra: [0.9, 1.1], rb: [0.9, 1.1], cells: [[0.8, 0.9, 1.0], [0.9, 1.0, 1.1], [1.0, 1.1, 1.2]], affects: [] }] }
      ],
      targets: [{ key: 'T1', id: 'TG-201', share: 0.4 }, { key: 'T2', id: 'TG-202', share: 0.3 }, { key: 'T3', id: 'TG-203', share: 0.3 }],
      scale: SCALE_Q,
      conds: [],
      teamFactor: { by: 'udeo', target: 'TG-101', min: 1.0, pos: ['licni'], bands: [{ to: 0.4, f: 0.8 }, { to: 0.6, f: 0.9 }, { to: 0.8, f: 1.0 }, { to: null, f: 1.1 }] },
      carryNegative: false
    },
    {
      id: 'S-M3', code: 'BS-TU-2026', type: 'scorecard', model: 'M3', teamSplit: 'menadzer', name: L('Tim ekspoziture – univerzalni bankari 2026', 'Branch team – universal bankers 2026'),
      pos: 'univerzalni', periodType: 'M', status: 'aktivan',
      versions: [
        { v: 1, from: '2026-01-01', to: '2026-06-30', base: 18000, capFactor: 1.5, shares: { K1: 0.45, K2: 0.30, K3: 0.25 }, note: L('Početna verzija', 'Initial version') },
        { v: 2, from: '2026-07-01', to: null, base: 20000, capFactor: 1.5, shares: { K1: 0.40, K2: 0.30, K3: 0.30 }, note: L('Veća osnova, veći udeo kartica', 'Higher base, larger card share') },
        { v: 3, from: '2027-01-01', to: null, base: 20000, capFactor: 1.5, shares: { K1: 0.40, K2: 0.30, K3: 0.30 }, planned: true, at: '2026-10-14T11:40', note: L('Plan 2027: kartice tek uz račune, najmanje 2 od 3 targeta', '2027 plan: cards only with accounts, at least 2 of 3 targets'),
          rules: [{ tpl: 'otkljucavanje', cond: 'K2', min: 0.8, affects: ['K3'] }, { tpl: 'nodm', n: 2, keys: ['K1', 'K2', 'K3'], min: 0.9, affects: ['K1', 'K2', 'K3'], factor: 0.9 }] }
      ],
      targets: [{ key: 'K1', id: 'TG-301', share: 0.4 }, { key: 'K2', id: 'TG-302', share: 0.3 }, { key: 'K3', id: 'TG-303', share: 0.3 }],
      scale: SCALE_M,
      conds: [],
      teamFactor: { by: 'broj', min: 1.0, byCount: [0.8, 0.9, 1.0, 1.1] },
      carryNegative: false
    }
  ];
  D.scheme = function (id) { return D.schemes.concat((IH.state.data && IH.state.data.newSchemes) || []).filter(function (s) { return s.id === id; })[0]; };
  /* sve verzije šeme: postojeće + planirane (nova verzija od sledećeg perioda) */
  D.schemeVersions = function (s) {
    var pl = ((IH.state.data && IH.state.data.schemeVersions) || []).filter(function (v) { return v.scheme === s.id; });
    return s.versions.concat(pl).slice().sort(function (a, b) { return a.from < b.from ? -1 : a.from > b.from ? 1 : 0; });
  };
  /* verzija koja važi u periodu: poslednja koja počinje najkasnije prvog dana perioda */
  D.schemeVersion = function (s, pid) {
    var p = D.period(pid), vs = D.schemeVersions(s);
    var ok = p ? vs.filter(function (v) { return v.from <= p.from; }) : [];
    return ok.length ? ok[ok.length - 1] : vs[0];
  };
  /* parametri šeme koji važe u periodu (verzija nosi sve što menja obračun) */
  var VKEYS = ['type', 'targets', 'scale', 'conds', 'rules', 'continuity', 'teamFactor', 'carryNegative', 'teamSplit'];
  D.schemeAt = function (s, pid) {
    if (!s) return s;
    var v = D.schemeVersion(s, pid), o = Object.assign({}, s);
    VKEYS.forEach(function (k) { if (v && v[k] !== undefined) o[k] = v[k]; });
    o.ver = v;
    return o;
  };
  /* šeme u kojima učestvuje target (bilo koja verzija koja nije arhivirana) */
  D.schemesOf = function (tid) {
    var all = D.schemes.concat((IH.state.data && IH.state.data.newSchemes) || []);
    return all.filter(function (s) { return s.status !== 'arhiviran' && D.schemeVersions(s).some(function (v) { return (v.targets || s.targets).some(function (tc) { return tc.id === tid; }); }); });
  };

  /* ---------- kampanjski dodaci (vremenski ograničen iznos po prodaji, sa limitom, na izabrane šeme) ---------- */
  D.addons = [
    { id: 'KD-01', name: L('Jesenja akcija – gotovinski krediti', 'Autumn campaign – cash loans'), status: 'aktivan', from: '2026-10-01', to: '2026-11-30', schemes: ['S-M1', 'S-M1P', 'S-M3'],
      subject: { ptype: 'kredit', segs: ['FL'], products: ['P16', 'P17'] }, val: { k: 'rsd', v: 1500 }, limit: 15000, by: 'A001', at: '2026-09-24T09:15' }
  ];

  /* ---------- raspored šema (ko je na kojoj šemi) ---------- */
  D.assignments = [];
  D.employees.forEach(function (e) {
    var pos = D.positions[e.pos];
    if (!pos || !pos.scheme) return;
    var from = e.since > '2026-01-01' ? e.since : '2026-01-01', appr = (e.since > '2026-01-01' ? e.since : '2025-12-18') + 'T10:00';
    if (e.pos === 'licni' && e.branch === 'B04') {
      /* pilot: provizijska šema u Novom Sadu od Q3 2026 */
      D.assignments.push({ id: 'RS-' + e.id.slice(1) + 'A', emp: e.id, scheme: 'S-M1', from: from, to: '2026-06-30', status: 'zavrsen', approvedBy: e.mgr, approvedAt: appr });
      D.assignments.push({ id: 'RS-' + e.id.slice(1), emp: e.id, scheme: 'S-M1P', from: '2026-07-01', to: null, status: 'aktivan', approvedBy: e.mgr, approvedAt: '2026-06-22T09:30', note: L('Pilot provizijske šeme', 'Commission scheme pilot') });
      return;
    }
    D.assignments.push({ id: 'RS-' + e.id.slice(1), emp: e.id, scheme: pos.scheme, from: from, to: null, status: 'aktivan', approvedBy: e.mgr, approvedAt: appr });
  });
  D.assignments.push({ id: 'RS-P001', emp: 'E1006', scheme: 'S-M1', from: '2026-10-01', to: null, status: 'na_odobravanju', submittedBy: 'A001', submittedAt: '2026-10-17T14:05', note: L('Pun target od Q4 posle premeštaja (Q3 je imao izuzetak 2/3)', 'Full target from Q4 after the transfer (Q3 had a 2/3 exception)') });
  D.assignments.push({ id: 'RS-P002', emp: null, pending: 'Mina Krstić', branch: 'B01', scheme: 'S-M3', from: '2026-10-20', to: null, status: 'nacrt', note: L('Novi zaposleni iz noćnog uvoza', 'New hire from nightly import') });

  /* ---------- saglasnosti (početno stanje) ---------- */
  /* status: ceka | saglasan | auto | prigovor | korigovano | odobreno | isplaceno */
  D.approvalSeed = {
    '2026-Q3': {
      E1002: { status: 'ceka' },
      E1003: { status: 'prigovor', complaint: 'C-0412' },
      E1004: { status: 'saglasan', at: '2026-10-13T08:41' },
      E1005: { status: 'saglasan', at: '2026-10-14T16:02' },
      E1006: { status: 'ceka' },
      E1001: { status: 'ceka' }
    },
    '2026-09': {
      E1007: { status: 'saglasan', at: '2026-10-09T09:12' },
      E1008: { status: 'saglasan', at: '2026-10-10T13:30' },
      E1009: { status: 'auto', at: '2026-10-18T23:59' },
      E1010: { status: 'saglasan', at: '2026-10-08T15:44' }
    }
  };
  /* prigovor: kredit isplaćen 1.10. (prema DWH-u) — zaposleni misli da pripada Q3 */
  D.complaints = [
    {
      id: 'C-0412', emp: 'E1003', period: '2026-Q3', status: 'otvoren', at: '2026-10-15T11:22', itemRef: { emp: 'E1003', period: '2026-Q4', ptype: 'kredit', first: true },
      subject: L('Kredit nije uračunat u target Krediti', 'Loan not included in the Loans target'),
      text: L('Gotovinski kredit klijenta {client} ({amount}) ugovoren je krajem septembra, a ne vidim ga u obračunskom listu za Q3. Molim proveru.', 'Cash loan for client {client} ({amount}) was contracted at the end of September, but I cannot see it in my Q3 statement. Please check.'),
      attach: ['Ugovor_{contract}.pdf'],
      facts: L('Prema DWH-u kredit je isplaćen {date} i uračunat je u Q4.', 'According to DWH, the loan was disbursed on {date} and counted in Q4.'),
      thread: []
    }
  ];

  /* ---------- obaveštenja ---------- */
  D.notifications = {
    admin: [
      { id: 'N-A1', at: '2026-10-20T06:14', icon: 'upload', text: L('Noćni uvoz iz DWH završen: 1.284 stavke, 6 nemapiranih', 'Nightly DWH import done: 1,284 items, 6 unmapped'), go: 'ucitavanje' },
      { id: 'N-A2', at: '2026-10-20T06:15', icon: 'org', text: L('3 promene u organizaciji iz noćnog uvoza', '3 organisation changes from nightly import'), go: 'organizacija' },
      { id: 'N-A3', at: '2026-10-19T08:00', icon: 'clock', text: L('Rok za saglasnost Q3 ističe 22.10. — 21 obračun bez odgovora', 'Q3 consent deadline Oct 22 — 21 statements unanswered'), go: 'saglasnosti' },
      { id: 'N-A4', at: '2026-10-18T23:59', icon: 'checkc', text: L('Septembar: rok istekao, 7 obračuna automatski odobreno', 'September: deadline passed, 7 statements auto-approved'), go: 'isplata' }
    ],
    manager: [
      { id: 'N-M1', at: '2026-10-17T14:05', icon: 'calendar', text: L('Raspored za Milicu Kostić čeka vaše odobrenje', 'Assignment for Milica Kostić awaits your approval'), go: 'rasporedi-odobravanje' },
      { id: 'N-M2', at: '2026-10-15T11:22', icon: 'msg', text: L('Marko Ilić je uložio prigovor na obračun Q3', 'Marko Ilić filed a complaint on the Q3 statement'), go: 'prigovori-tima' },
      { id: 'N-M3', at: '2026-10-12T10:00', icon: 'calc', text: L('Obračun Q3 je poslat timu na saglasnost', 'Q3 statements sent to the team for consent'), go: 'saglasnosti-tima' }
    ],
    employee: [
      { id: 'N-E1', at: '2026-10-19T08:00', icon: 'clock', text: L('Podsetnik: saglasnost na obračun Q3 do 22.10.', 'Reminder: Q3 statement consent due Oct 22'), go: 'moj-obracun' },
      { id: 'N-E2', at: '2026-10-12T10:00', icon: 'calc', text: L('Vaš obračun za Q3 2026 je spreman', 'Your Q3 2026 statement is ready'), go: 'moj-obracun' },
      { id: 'N-E3', at: '2026-10-01T07:30', icon: 'target', text: L('Postavljeni su vaši targeti za Q4 2026', 'Your Q4 2026 targets have been set'), go: 'moji-targeti' }
    ],
    viewer: [
      { id: 'N-V1', at: '2026-10-12T10:00', icon: 'chart', text: L('Dostupan je izveštaj o obračunu Q3 2026', 'Q3 2026 calculation report is available'), go: 'izvestaji' }
    ]
  };

  /* ---------- persone ---------- */
  D.personas = {
    admin: { emp: 'A001', role: 'admin' },
    manager: { emp: 'E1001', role: 'manager' },
    employee: { emp: 'E1002', role: 'employee' },
    viewer: { emp: 'V001', role: 'viewer' }
  };

  /* ---------- targeti za naredni period (Q1 2027): raspodela na bankare u toku ---------- */
  D.plan27 = {
    period: '2027-Q1', label: 'Q1 2027', received: '2026-10-15', deadline: '2026-10-31', by: 'D001', uplift: 1.05,
    status: { B01: 'nacrt', B02: 'na_odobravanju', B03: 'odobreno', B04: 'odobreno', B05: 'nacrt', B06: 'na_odobravanju', B07: 'odobreno', B08: 'nacrt' },
    approvedAt: { B03: '2026-10-17T11:20', B04: '2026-10-16T15:05', B07: '2026-10-18T09:40' },
    submittedAt: { B02: '2026-10-19T16:30', B06: '2026-10-19T12:10' },
    /* target fokus ekspoziture i predlog raspodele (zbir = target ekspoziture) */
    branch: { B01: { T1: 39500000, T2: 126, T3: 63 } },
    suggest: {
      E1002: { T1: 8500000, T2: 28, T3: 14 },
      E1003: { T1: 7000000, T2: 22, T3: 11 },
      E1004: { T1: 9500000, T2: 30, T3: 15 },
      E1005: { T1: 7500000, T2: 24, T3: 12 },
      E1006: { T1: 7000000, T2: 22, T3: 11 }
    }
  };
  D.branchTarget27 = function (bid, tid) {
    var tg = D.targetByKey('S-M1', tid), ov = tg && D.valOv(tg.id, '2027-Q1', { branch: bid });
    if (ov != null) return ov;
    if (D.plan27.branch[bid]) return D.plan27.branch[bid][tid];
    var b = D.branch(bid), n = D.branchStaff(bid, 'licni').length;
    return D.roundT(D.M1_TARGETS[tid] * D.plan27.uplift * b.f * n, tid === 'T1' ? 'RSD' : 'kom');
  };
  /* raspodela po bankaru za Q1 2027 (predlog za fokus, ravnomerno za ostale) */
  D.bankerTarget27 = function (empId, tid) {
    var ov = IH.state.data.plan27 && IH.state.data.plan27[empId + '|' + tid];
    if (ov != null) return ov;
    if (D.plan27.suggest[empId]) return D.plan27.suggest[empId][tid];
    var e = D.emp(empId), bt = D.branchTarget27(e.branch, tid), lic = D.branchStaff(e.branch, 'licni'), n = lic.length;
    var step = tid === 'T1' ? 100000 : 1, eq = Math.round(bt / n / step) * step;
    return lic[0].id === empId ? bt - eq * (n - 1) : eq;
  };
  D.status27 = function (bid) { return (IH.state.data.plan27Status || {})[bid] || D.plan27.status[bid]; };
})();
