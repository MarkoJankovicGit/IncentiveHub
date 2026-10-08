/* Incentive Hub — engine obračuna
   Tipovi šeme: bonus za ostvaren target (udeo × % isplate sa skale × osnovica), provizija po prodaji (zbir provizija prodaja × % isplate)
   i bonus + provizija iznad targeta (osnovica do 100% ostvarenja + provizija po prodaji za ostvarenje iznad 100%).
   Prodaja ulazi u ostvarenje tek kada ispuni uslove priznavanja targeta.
   Pravila između targeta (umanjenje, pojačanje, timski uslov, najmanje N od M, otključavanje, matrica, kap po targetu) su šabloni u šemi.
   Šema i njeni parametri se čitaju iz rasporeda i verzije koja važi u periodu. Bez rasporeda nema obračuna. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data;
  var EN = IH.engine = {};
  var CACHE = {};
  EN.invalidate = function () { CACHE = {}; };

  /* skala: redovi {to, f} rastuće; ostvarenje od (uključeno) do (isključeno); poslednji red otvoren
     linearna skala: {type:'linear', min, cap} — ispod praga 0, zatim procenat isplate = ostvarenje, do plafona */
  function band(list, pct) {
    if (list && list.type === 'linear') { if (pct < list.min - 1e-9) return 0; return Math.min(pct, list.cap); }
    for (var i = 0; i < list.length; i++) if (list[i].to == null || pct < list[i].to - 1e-9) return list[i].f;
    return list[list.length - 1].f;
  }
  EN.band = band;
  /* sledeći prag skale iznad ostvarenja (null ako je dostignut najviši) */
  EN.nextBand = function (list, pct) {
    if (list && list.type === 'linear') return pct < list.min ? { at: list.min, f: list.min } : null;
    for (var i = 0; i < list.length; i++) if (list[i].to != null && pct < list[i].to - 1e-9) return { at: list[i].to, f: list[i + 1] ? list[i + 1].f : list[i].f };
    return null;
  };
  /* indeks opsega za matricu: granice rastuće [0.8, 1.0] → 0: <80%, 1: 80–100%, 2: ≥100% */
  function bandIdx(bounds, pct) { var i = 0; while (i < bounds.length && pct >= bounds[i] - 1e-9) i++; return i; }
  EN.bandIdx = bandIdx;

  /* ponovni obračun: ceo period ili pojedinačni zaposleni (vreme poslednjeg pokretanja) */
  function recalcAt(pid, empId) {
    var r = (IH.state.data && IH.state.data.recalc) || {}, a = r[pid] || '', b = empId ? r[pid + '|' + empId] || '' : '';
    return a > b ? a : b;
  }
  EN.recalcAt = recalcAt;
  /* korekcija važi odmah u tekućem periodu; u zaključenom tek posle ponovnog obračuna */
  function applies(c, empId) {
    if (c.seed) return true;
    var p = D.period(c.period);
    if (p.status === 'u_toku') return true;
    var rec = recalcAt(c.period, empId || c.emp);
    return !!rec && rec >= c.at;
  }
  EN.applies = applies;
  function allCorr() {
    var st = (IH.state.data && IH.state.data.corrections) || [], rev = (IH.state.data && IH.state.data.corrRev) || {};
    return (D.corrSeed || []).concat(st).filter(function (c) { return !rev[c.id]; });
  }
  EN.allCorr = allCorr;
  function corr(empId, pid) {
    return allCorr().filter(function (x) { return x.emp === empId && x.period === pid && x.kind !== 'izmena' && applies(x, empId); });
  }
  EN.corrections = corr;
  /* izmene učitanih stavki u periodu: id stavke → korekcija */
  function edits(pid) {
    var out = {};
    allCorr().forEach(function (c) { if (c.kind === 'izmena' && c.period === pid && c.item && c.item.id) out[c.item.id] = c; });
    return out;
  }
  EN.edits = edits;

  /* vrednost prodaje po pravilu {k:'pct'|'rsd', v, cap} */
  function itemValue(val, it, t) {
    if (!val) return 0;
    var v = val.k === 'pct' ? (it.amount || 0) * val.v : t && t.unit === 'bod' ? val.v * D.ptsOf(t, it.product) : val.v;
    if (val.cap && v > val.cap) v = val.cap;
    return Math.round(v);
  }
  EN.itemValue = itemValue;

  /* nemapirane stavke ulaze u obračun posle mapiranja: odmah u tekućem periodu, u zaključenom posle ponovnog obračuna */
  function mappedView(i) {
    var m = (IH.state.data.mapped || {})[i.code];
    if (!m) return null;
    var p = D.period(i.period), rec = recalcAt(i.period, i.emp);
    if (p.status !== 'u_toku' && !(rec && rec >= m.at)) return null;
    var pr = D.product(m.product);
    return Object.assign({}, i, { product: pr.id, seg: pr.seg, ptype: pr.ptype, cat: pr.cat, status: 'priznato', mappedLate: true });
  }
  EN.mappedView = mappedView;
  function effItems(empId, pid) {
    var ed = edits(pid);
    function apply(i) { var c = ed[i.id]; return c && applies(c, empId) ? Object.assign({}, i, c.changes, { orig: i, corrId: c.id }) : i; }
    var base = D.itemsOf(empId, pid).map(function (i) { return i.status === 'nemapirano' ? mappedView(i) || i : i; }).map(apply)
      .filter(function (i) { return i.status === 'priznato' && i.emp === empId; });
    var moved = Object.keys(ed).map(function (k) { return ed[k]; }).filter(function (c) { return c.changes.emp === empId && c.item.emp !== empId && applies(c, empId); })
      .map(function (c) { return Object.assign({}, c.item, c.changes, { orig: c.item, corrId: c.id }); }).filter(function (i) { return i.status === 'priznato'; });
    var added = corr(empId, pid).filter(function (c) { return c.kind === 'linija'; }).map(function (c) { return Object.assign({}, c.item, { corrId: c.id }); });
    return base.concat(moved).concat(added);
  }
  EN.effItems = effItems;

  /* ---------- predmet targeta i priznavanje prodaje ---------- */
  function matches(t, i) {
    var sj = t && D.resolveSubj(t.subject); if (!sj) return false;
    if (sj.ptype && i.ptype !== sj.ptype) return false;
    if (sj.segs && sj.segs.length && sj.segs.indexOf(i.seg) < 0) return false;
    if (sj.products && sj.products.length && sj.products.indexOf(i.product) < 0) return false;
    return true;
  }
  EN.matches = matches;
  /* da li prodaja ispunjava uslove priznavanja targeta (na dan podataka)
     ok — ulazi u ostvarenje; ceka — uslov se još može ispuniti u roku; ne — uslov nije ispunjen; iskljuceno — nikad se ne računa
     uslovi sa posledicom „poništava se“ dolaze kao posebne storno stavke */
  EN.recog = function (t, i) {
    var R = IH.rules, conds = t && t.conds;
    if (!R || !conds || !conds.length || i.source === 'KOREKCIJA' || i.type !== 'nova') return { st: 'ok' };
    var a = R.itemAttrs(i);
    for (var k = 0; k < conds.length; k++) {
      var c = conds[k]; if (c.effect === 'storno') continue;
      /* uslov važi samo za vrste proizvoda na koje se odnosi (bodovni target sa više vrsta) */
      if (c.pt && c.pt.indexOf(i.ptype) < 0) continue;
      var tp = c.tpl && R.template(c.tpl); if (tp && tp.pt && tp.pt.indexOf(i.ptype) < 0) continue;
      var r = R.evalAsOf(c, a, D.DATA_AS_OF); /* uslov sa „when“ važi samo za prodaje gde je to polje tačno */
      if (r.ok) continue;
      if (c.effect === 'iskljucenje') return { st: 'iskljuceno', c: c };
      if (c.effect === 'odlozeno' && r.pending) return { st: 'ceka', c: c, until: r.until };
      return { st: 'ne', c: c, until: r.until };
    }
    return { st: 'ok' };
  };
  /* uslovi vrste proizvoda (za zbirne preglede prodaje van targeta) */
  EN.recogDefault = function (i) { var p = i.ptype && D.ptype(i.ptype); return p ? EN.recog({ conds: p.conds }, i) : { st: 'ok' }; };
  /* ostvarenje targeta nad stavkama
     prodaja: priznate nove − storno; neto (računi): otvoreni − storno − zatvoreni u periodu; smer opadajući: manje je bolje */
  function achieve(t, items) {
    var pos = [], neg = [], clo = [], wait = [], rej = [];
    items.forEach(function (i) {
      if (!matches(t, i)) return;
      if (i.type === 'storno') { neg.push(i); return; }
      if (i.type === 'zatvaranje') { if (t.mode === 'neto') clo.push(i); return; }
      if (i.type !== 'nova') return;
      var rc = EN.recog(t, i);
      if (rc.st === 'ok') pos.push(i); else if (rc.st === 'ceka') wait.push(i); else rej.push(i);
    });
    var amt = t.unit === 'RSD', pts = t.unit === 'bod';
    function sum(l) { return pts ? l.reduce(function (a, i) { return a + D.ptsOf(t, i.product); }, 0) : amt ? l.reduce(function (a, i) { return a + (i.amount || 0); }, 0) : l.length; }
    var g = sum(pos), s = sum(neg), z = sum(clo);
    return { gross: g, storno: s, closed: z, ach: g - s - z, n: pos.length, nStorno: neg.length, nClosed: clo.length, nWait: wait.length, nRej: rej.length, items: pos, stornoItems: neg, closedItems: clo, waitItems: wait, rejItems: rej };
  }
  EN.achieve = achieve;
  /* procenat ostvarenja; kod opadajućeg smera: target / ostvarenje (ispod targeta je bolje) */
  function pctOf(t, ach, tgt) {
    if (!tgt) return 0;
    if (t.dir === 'opadajuci') return ach <= 0 ? 2 : tgt / ach;
    return ach / tgt;
  }
  EN.pctOf = pctOf;
  function targetOf(tc, s, pid) {
    var id = tc.id || ((s && D.targetByKey(s.id, tc.key)) || {}).id;
    return pid ? D.targetAt(id, pid) : D.target(id);
  }
  EN.targetOf = targetOf;

  /* ---------- raspored: koja šema važi za zaposlenog u periodu ---------- */
  EN.assignmentFor = function (empId, pid) {
    var p = D.period(pid); if (!p) return null;
    var list = (IH.assignments ? IH.assignments() : D.assignments).filter(function (a) {
      return a.emp === empId && (a.status === 'aktivan' || a.status === 'zavrsen') && a.from <= p.to && (!a.to || a.to >= p.from);
    });
    list.sort(function (a, b) { return a.from < b.from ? 1 : -1; });
    return list[0] || null;
  };
  /* bez odobrenog rasporeda nema šeme ni obračuna */
  EN.schemeFor = function (empId, pid) {
    var a = EN.assignmentFor(empId, pid);
    return a ? D.scheme(a.scheme) : null;
  };
  /* parametri šeme u periodu; opts.ver = druga verzija (simulacija) */
  function schemeIn(s, pid, opts) {
    if (opts && opts.ver) { var o = Object.assign({}, s); ['type', 'targets', 'scale', 'conds', 'rules', 'continuity', 'teamFactor', 'carryNegative'].forEach(function (k) { if (opts.ver[k] !== undefined) o[k] = opts.ver[k]; }); o.ver = opts.ver; return o; }
    return D.schemeAt(s, pid);
  }
  EN.schemeIn = schemeIn;
  function noScheme(empId, pid) {
    return { emp: empId, period: pid, scheme: null, noScheme: true, model: null, type: null, targets: [], kpis: [], members: [], condRes: [], addons: [], addonTotal: 0, payout: 0, subtotal: 0, beforeCap: 0, limit: 0, capped: false, continuity: 0, corrections: 0, priorAdj: 0, carryIn: 0, carryOut: 0, storno: 0, stornoN: 0, base: 0, teamFactor: 1, payoutPct: 0 };
  }
  EN.noScheme = noScheme;

  /* ---------- ostvarenje ekspoziture (savetnici + tim univerzalnih) ---------- */
  function branchItems(bid, pid) {
    var k = 'bi|' + bid + '|' + pid; if (CACHE[k]) return CACHE[k];
    var items = [], licni = D.employees.filter(function (e) { return e.pos === 'licni' && (e.branch === bid || (e.history || []).some(function (h) { return h.branch === bid; })); });
    licni.forEach(function (e) { items = items.concat(effItems(e.id, pid).filter(function (i) { return i.branch === bid; })); });
    D.monthsIn(pid).forEach(function (mid) { D.branchStaff(bid, 'univerzalni').forEach(function (u) { items = items.concat(effItems(u.id, mid)); }); });
    CACHE[k] = items; return items;
  }
  EN.branchItems = branchItems;
  /* procenat ostvarenja timskog targeta ekspoziture u periodu */
  EN.branchPct = function (bid, pid, tid, project) {
    var k = 'bp|' + bid + '|' + pid + '|' + tid + '|' + (project ? 'p' : ''); if (CACHE[k] != null) return CACHE[k];
    var t = D.targetAt(tid, pid), p = D.period(pid); if (!t) return 1;
    var proj = project && p.status === 'u_toku' ? 1 / D.elapsed(pid) : 1;
    var tgt = D.val(tid, pid, { branch: bid });
    var pct = tgt ? pctOf(t, achieve(t, branchItems(bid, pid)).ach * proj, tgt) : 0;
    CACHE[k] = pct; return pct;
  };

  /* ---------- pravila između targeta ----------
     umanjenje   {tpl, cond, min, affects, factor}       ako je cond ispod min → affects × factor
     pojacanje   {tpl, cond, min, affects, factor}       ako je cond najmanje min → affects × factor
     timski      {tpl, src:'eksp', target, min, affects, factor}  ako ekspozitura ostvari target ispod min → affects × factor
     nodm        {tpl, n, keys, min, affects, factor}    ako je manje od n targeta iz keys najmanje min → affects × factor
     otkljucavanje {tpl, cond, min, affects}             affects se računa tek kada je cond najmanje min
     matrica     {tpl, a, b, ra, rb, cells, affects}     ponder iz tabele: opseg ostvarenja a (redovi) × opseg b (kolone)
     kap         {tpl, affects, k}                       isplata targeta najviše k × iznos na 100% */
  EN.rulesOf = function (s) {
    if (s.rules) return s.rules;
    return (s.conds || []).map(function (d) { return Object.assign({ tpl: d.src === 'eksp' ? 'timski' : 'umanjenje' }, d); });
  };
  function mul(byKey, keys, f, r) { (keys || []).forEach(function (k) { if (byKey[k]) { byKey[k].dep = +(byKey[k].dep * f).toFixed(4); byKey[k].depBy = r; } }); }
  function applyRules(s, byKey, empId, pid, opts) {
    var out = [], p = D.period(pid), e = D.emp(empId), all = Object.keys(byKey);
    EN.rulesOf(s).forEach(function (r) {
      if (r.from && p.from < r.from) return;
      var x = { d: r, r: r, active: false };
      if (r.tpl === 'kap') { x.k = r.k; (r.affects || []).forEach(function (k) { if (byKey[k]) byKey[k].kap = Math.min(byKey[k].kap || Infinity, r.k); }); out.push(x); return; }
      if (r.tpl === 'timski') {
        if (!e || !e.branch) return;
        var t = D.target(r.target); x.pct = EN.branchPct(e.branch, pid, r.target, opts && opts.project); x.name = t ? t.name : r.target;
        x.active = x.pct < r.min; if (x.active) mul(byKey, r.affects, r.factor, r);
      } else if (r.tpl === 'nodm') {
        var keys = (r.keys && r.keys.length ? r.keys : all).filter(function (k) { return byKey[k]; });
        x.cnt = keys.filter(function (k) { return byKey[k].pct >= r.min; }).length; x.of = keys.length;
        x.active = x.cnt < r.n; if (x.active) mul(byKey, r.affects && r.affects.length ? r.affects : all, r.factor, r);
      } else if (r.tpl === 'matrica') {
        var A = byKey[r.a], B = byKey[r.b]; if (!A || !B) return;
        x.ia = bandIdx(r.ra, A.pct); x.ib = bandIdx(r.rb, B.pct); x.f = r.cells[x.ia][x.ib]; x.pa = A.pct; x.pb = B.pct;
        x.active = x.f !== 1; mul(byKey, r.affects && r.affects.length ? r.affects : all, x.f, r);
      } else {
        var c = byKey[r.cond]; if (!c) return;
        x.pct = c.pct; x.name = c.name;
        if (r.tpl === 'pojacanje') { x.active = c.pct >= r.min; if (x.active) mul(byKey, r.affects, r.factor, r); }
        else if (r.tpl === 'otkljucavanje') { x.active = c.pct < r.min; if (x.active) mul(byKey, r.affects, 0, r); }
        else { x.active = c.pct < r.min; if (x.active) mul(byKey, r.affects, r.factor, r); }
      }
      out.push(x);
    });
    return out;
  }
  EN.applyRules = applyRules;
  EN.applyConds = applyRules;
  /* isplata po targetu posle pravila: vrednost × min(% isplate × faktor pravila, kap) (+ vrednost iznad 100% kod kombinovane) */
  function payOf(r) {
    var eff = r.ponder * r.dep; if (r.kap != null && eff > r.kap) { eff = r.kap; r.capT = true; }
    r.eff = eff;
    return r.inCalc ? Math.round(r.value * eff + (r.extra || 0) * r.dep) : 0;
  }
  EN.payOf = payOf;

  /* ---------- kampanjski dodaci ---------- */
  EN.addonsFor = function (sid, pid) {
    var p = D.period(pid);
    return (IH.addons ? IH.addons() : D.addons || []).filter(function (a) { return (a.status === 'aktivan' || a.status === 'zavrsen') && a.schemes.indexOf(sid) >= 0 && a.from <= p.to && a.to >= p.from; });
  };
  function addonCalc(sid, pid, items, proj) {
    var out = EN.addonsFor(sid, pid).map(function (a) {
      var its = items.filter(function (i) { return i.type === 'nova' && i.date >= a.from && i.date <= a.to && matches(a, i) && EN.recogDefault(i).st === 'ok'; });
      /* dodatak se ne projektuje: kampanja ima svoj rok, računa se ono što je prodato do danas */
      var raw = Math.round(its.reduce(function (x, i) { return x + itemValue(a.val, i); }, 0));
      var amt = a.limit ? Math.min(raw, a.limit) : raw;
      return { id: a.id, name: a.name, n: its.length, raw: raw, amount: amt, capped: raw > amt, limit: a.limit };
    });
    return out;
  }
  EN.addonCalc = addonCalc;

  /* ---------- individualni obračun (savetnik; univerzalni sa individualnom šemom) ---------- */
  EN.m1 = function (empId, pid, opts) {
    opts = opts || {};
    var key = 'm1|' + empId + '|' + pid + '|' + (opts.project ? 'p' : '') + (opts.noCont ? 'n' : '') + (opts.simKey ? '|' + opts.simKey : '');
    if (CACHE[key]) return CACHE[key];
    var s0 = opts.sch || EN.schemeFor(empId, pid);
    if (!s0) return (CACHE[key] = noScheme(empId, pid));
    var s = schemeIn(s0, pid, opts), ver = s.ver, p = D.period(pid);
    var items = effItems(empId, pid).concat(opts.extra || []);
    var proj = opts.project && p.status === 'u_toku' ? 1 / D.elapsed(pid) : 1;
    var ty = s.type || 'scorecard', prov = ty === 'provizija', komb = ty === 'kombinovana';
    var res = { emp: empId, period: pid, scheme: s.id, code: s.code, type: ty, ver: ver.v, model: 'M1', base: prov ? 0 : (ver.base || 0), targets: [], project: !!opts.project };
    var byKey = {};
    s.targets.forEach(function (tc) {
      var t = targetOf(tc, s, pid); if (!t) return;
      var tgt = D.val(t.id, pid, { emp: empId });
      var a = achieve(t, items);
      var ach = a.ach * proj, pct = pctOf(t, ach, tgt);
      var inCalc = tc.inCalc !== false;
      var r = {
        key: tc.key, id: t.id, tver: t.ver || 1, name: t.name, unit: t.unit, dir: t.dir, mode: t.mode, role: tc.role || 'primarni', inCalc: inCalc, target: tgt, ach: ach, gross: a.gross * proj, stornoAch: a.storno, closedAch: a.closed, pct: pct,
        n: a.n, nStorno: a.nStorno, nClosed: a.nClosed, nWait: a.nWait, nRej: a.nRej, ponder: inCalc ? band(komb ? (tc.scale || s.scale) : (tc.scale || s.scale), komb ? Math.min(pct, 1) : pct) : 0, dep: 1, share: tc.share || 0, exception: D.exceptionFor(empId, pid, t.id)
      };
      if (prov) {
        r.val = tc.val;
        r.value = Math.round(a.items.reduce(function (x, i) { return x + itemValue(tc.val, i, t); }, 0) * proj);
        r.stornoValue = -Math.round(a.stornoItems.reduce(function (x, i) { return x + itemValue(tc.val, i, t); }, 0));
      } else {
        r.value = Math.round(res.base * r.share); r.stornoValue = 0;
        if (komb && tc.val && pct > 1) {
          var over = ach - tgt;
          r.val = tc.val; r.over = over;
          r.extra = Math.round(tc.val.k === 'pct' ? over * tc.val.v : Math.floor(over + 1e-9) * tc.val.v);
        }
      }
      byKey[tc.key] = r;
      res.targets.push(r);
    });
    res.condRes = applyRules(s, byKey, empId, pid, opts);
    res.targets.forEach(function (r) { r.bonus = payOf(r); });
    res.depActive = res.targets.some(function (r) { return r.dep !== 1; });
    /* storno: kod vrednosti po prodaji negativna linija; kod osnovice već umanjuje ostvarenje */
    res.storno = prov ? res.targets.reduce(function (a, r) { return a + r.stornoValue; }, 0) : 0;
    res.stornoN = res.targets.reduce(function (a, r) { return a + r.nStorno; }, 0);
    res.waitN = res.targets.reduce(function (a, r) { return a + (r.nWait || 0); }, 0);
    res.outOfTarget = 0; res.outOfTargetN = 0;
    contAndClose(res, s, ver, byKey, empId, pid, opts, EN.m1);
    finish(res, s, ver, empId, pid, opts, items, proj);
    CACHE[key] = res;
    return res;
  };
  /* kontinuitet: dodatni iznos ako je target najmanje min više perioda zaredom */
  function contAndClose(res, s, ver, byKey, empId, pid, opts, fn) {
    res.continuity = 0;
    if (s.continuity && ver.contAmount && !opts.noCont) {
      var t1 = byKey[s.continuity.target];
      var ok = t1 && t1.pct >= s.continuity.min;
      var prev = EN.prevPeriods(pid, s.continuity.periods - 1);
      res.contHistory = prev.map(function (pp) { var pr = fn(empId, pp, { noCont: true }); var x = pr.targets.filter(function (q) { return q.key === s.continuity.target; })[0]; return { period: pp, pct: x ? x.pct : 0 }; });
      if (ok && prev.length === s.continuity.periods - 1 && res.contHistory.every(function (h) { return h.pct >= s.continuity.min; })) res.continuity = ver.contAmount;
    }
  }
  /* korekcije, prenos negativnog salda, limit, kampanjski dodaci, verzije */
  function finish(res, s, ver, empId, pid, opts, items, proj, factor) {
    var cs = corr(empId, pid).filter(function (c) { return c.kind === 'iznos'; });
    res.corrections = cs.filter(function (c) { return !c.refPeriod; }).reduce(function (a, c) { return a + c.amount; }, 0);
    res.priorAdj = cs.filter(function (c) { return c.refPeriod; }).reduce(function (a, c) { return a + c.amount; }, 0);
    var tb = res.targets.reduce(function (a, r) { return a + r.bonus; }, 0);
    res.targetsTotal = tb;
    res.subtotal = Math.round(tb * (factor || 1)) + res.storno + res.continuity + res.corrections;
    res.carryIn = 0;
    if (s.carryNegative && !opts.noCont) {
      var pv = EN.prevPeriods(pid, 1)[0];
      if (pv) { var prevR = EN.result(empId, pv); res.carryIn = (prevR && prevR.carryOut) || 0; }
    }
    var net = res.subtotal - res.carryIn;
    res.limit = ver.limit;
    res.addons = addonCalc(s.id, pid, items || [], proj);
    res.addonTotal = res.addons.reduce(function (a, x) { return a + x.amount; }, 0);
    if (net < 0) { res.payout = Math.max(0, res.priorAdj); res.carryOut = -net; res.capped = false; }
    else { res.payout = Math.max(0, Math.min(net, ver.limit) + res.priorAdj) + res.addonTotal; res.carryOut = 0; res.capped = net > ver.limit; }
    res.beforeCap = net;
    res.versions = { scheme: s.code, v: ver.v, targets: res.targets.map(function (r) { return { id: r.id, name: r.name, v: r.tver }; }) };
  }

  /* prethodni periodi istog tipa */
  EN.prevPeriods = function (pid, n) {
    var p = D.period(pid);
    var same = D.periods.filter(function (x) { return x.type === p.type && x.from < p.from; }).sort(function (a, b) { return a.from < b.from ? 1 : -1; });
    return same.slice(0, n).map(function (x) { return x.id; });
  };

  /* ---------- timski obračun (tim univerzalnih bankara u ekspozituri) ---------- */
  /* šema tima: šema raspoređena članovima tima (timski model) */
  EN.teamScheme = function (bid, pid) {
    var ms = D.branchStaff(bid, 'univerzalni');
    for (var i = 0; i < ms.length; i++) { var s = EN.schemeFor(ms[i].id, pid); if (s && s.model === 'M3') return s; }
    return null;
  };
  EN.m3 = function (bid, pid, opts) {
    opts = opts || {};
    var key = 'm3|' + bid + '|' + pid + '|' + (opts.project ? 'p' : '') + (opts.simKey ? '|' + opts.simKey : '');
    if (CACHE[key]) return CACHE[key];
    var s0 = opts.sch || EN.teamScheme(bid, pid), p = D.period(pid);
    var empty = { branch: bid, period: pid, scheme: null, noScheme: true, model: 'M3', kpis: [], targets: [], members: [], total: 0, payoutPct: 0, teamFactor: 1, onTarget: 0, condRes: [], base: 0 };
    if (!s0) return (CACHE[key] = empty);
    var s = schemeIn(s0, pid, opts), ver = s.ver;
    var proj = opts.project && p.status === 'u_toku' ? 1 / D.elapsed(pid) : 1;
    var members = D.branchStaff(bid, 'univerzalni').filter(function (e) { if (e.since > (p.status === 'u_toku' ? D.DATA_AS_OF : p.to)) return false; var x = EN.schemeFor(e.id, pid); return x && x.id === s0.id; });
    var items = [];
    members.forEach(function (m) { items = items.concat(effItems(m.id, pid)); });
    var res = { branch: bid, period: pid, scheme: s.id, code: s.code, type: s.type, ver: ver.v, model: 'M3', base: ver.base, kpis: [], members: [], project: !!opts.project };
    var cnt = 0, tf = s.teamFactor || {}, onMin = tf.min != null ? tf.min : 1, byKey = {};
    s.targets.forEach(function (tc) {
      var t = targetOf(tc, s, pid); if (!t) return;
      var tgt = D.val(t.id, pid, { branch: bid });
      var a = achieve(t, items);
      var ach = a.ach * proj, pct = pctOf(t, ach, tgt);
      var w = band(tc.scale || s.scale, pct), share = (ver.shares && ver.shares[tc.key] != null) ? ver.shares[tc.key] : (tc.share || 0);
      if (pct >= onMin) cnt++;
      var k = { key: tc.key, id: t.id, tver: t.ver || 1, name: t.name, unit: t.unit, dir: t.dir, mode: t.mode, role: tc.role || 'primarni', inCalc: true, target: tgt, ach: ach, pct: pct, n: a.n, nStorno: a.nStorno, nClosed: a.nClosed, nWait: a.nWait, nRej: a.nRej, weight: w, ponder: w, dep: 1, share: share, value: Math.round(ver.base * share) };
      byKey[tc.key] = k;
      res.kpis.push(k);
    });
    res.condRes = applyRules(s, byKey, members[0] ? members[0].id : null, pid, opts);
    res.kpis.forEach(function (k) {
      var eff = k.weight * k.dep; if (k.kap != null && eff > k.kap) { eff = k.kap; k.capT = true; }
      k.eff = eff; k.contrib = k.share * eff; k.bonus = Math.round(ver.base * k.contrib);
    });
    res.targets = res.kpis;
    res.payoutPct = res.kpis.reduce(function (a, k) { return a + k.contrib; }, 0);
    res.onTarget = cnt;
    res.teamFactor = tf.byCount ? tf.byCount[Math.min(cnt, tf.byCount.length - 1)] : 1;
    /* zajednički bonus tima: jedan iznos za tim (osnovica članova × ostvarenje tima), deli se na jednake delove
       (srazmerno danima u timu) ili po odluci menadžera (procenti važe odmah, beleže se u audit) */
    var dt = D.daysInfo(pid), split = s.teamSplit || 'jednako', man = split === 'menadzer' ? (IH.state.data.teamSplit || {})[bid + '|' + pid] : null;
    var rows = members.map(function (m) { var base = ver.base || 0, pres = 1; if (m.since > p.from) pres = Math.max(0, (Date.parse(p.to) - Date.parse(m.since)) / 864e5 + 1) / dt.total; return { m: m, base: base, pres: pres, bb: base * pres }; });
    var sumBB = rows.reduce(function (a, x) { return a + x.bb; }, 0);
    var poolRaw = sumBB * res.payoutPct * res.teamFactor, poolCap = sumBB * (ver.capFactor || 1.5), pool = Math.min(poolRaw, poolCap);
    var manOk = !!man && rows.length > 0 && rows.every(function (x) { return man[x.m.id] != null; });
    rows.forEach(function (x) { x.share = manOk ? man[x.m.id] : (sumBB ? x.bb / sumBB : 0); });
    res.pool = { raw: Math.round(poolRaw), cap: Math.round(poolCap), pay: Math.round(pool), split: split, manual: manOk };
    rows.forEach(function (x) {
      var m = x.m;
      var cs = corr(m.id, pid).filter(function (c) { return c.kind === 'iznos'; }).reduce(function (a, c) { return a + c.amount; }, 0);
      var mine = items.filter(function (i) { return i.emp === m.id; });
      var ad = addonCalc(s.id, pid, mine, proj), adt = ad.reduce(function (a, q) { return a + q.amount; }, 0);
      var pay = Math.max(0, pool * x.share + cs) + adt;
      res.members.push({ emp: m.id, base: x.base, presence: x.pres, baseEff: Math.round(x.bb), share: x.share, raw: Math.round(poolRaw * x.share), cap: Math.round(poolCap * x.share), capped: poolRaw > poolCap, corrections: cs, addons: ad, addonTotal: adt, payout: Math.round(pay), items: mine.length });
    });
    res.total = res.members.reduce(function (a, m) { return a + m.payout; }, 0);
    res.versions = { scheme: s.code, v: ver.v, targets: res.kpis.map(function (k) { return { id: k.id, name: k.name, v: k.tver }; }) };
    CACHE[key] = res;
    return res;
  };
  EN.m3For = function (empId, pid, opts) {
    var e = D.emp(empId), r = EN.m3(e.branch, pid, opts);
    var me = r.members.filter(function (m) { return m.emp === empId; })[0];
    return Object.assign({}, r, { me: me, payout: me ? me.payout : 0, limit: me ? me.cap : 0, capped: me ? me.capped : false, corrections: me ? me.corrections : 0, addons: me ? me.addons : [], addonTotal: me ? me.addonTotal : 0, emp: empId });
  };

  /* ---------- menadžer ekspoziture (osnovica po targetima nad rezultatom ekspoziture) ---------- */
  EN.m2 = function (mgrId, pid, opts) {
    opts = opts || {};
    var key = 'm2|' + mgrId + '|' + pid + '|' + (opts.project ? 'p' : '') + (opts.noCont ? 'n' : '') + (opts.simKey ? '|' + opts.simKey : '');
    if (CACHE[key]) return CACHE[key];
    var s0 = opts.sch || EN.schemeFor(mgrId, pid);
    if (!s0) return (CACHE[key] = noScheme(mgrId, pid));
    var s = schemeIn(s0, pid, opts), ver = s.ver, p = D.period(pid), mg = D.emp(mgrId), bid = mg.branch;
    var proj = opts.project && p.status === 'u_toku' ? 1 / D.elapsed(pid) : 1;
    var items = branchItems(bid, pid);
    var ty = s.type || 'scorecard';
    var res = { emp: mgrId, branch: bid, period: pid, scheme: s.id, code: s.code, type: ty, ver: ver.v, model: 'M2', base: ver.base || 0, targets: [], project: !!opts.project };
    var byKey = {};
    s.targets.forEach(function (tc) {
      var t = targetOf(tc, s, pid); if (!t) return;
      var tgt = D.val(t.id, pid, { branch: bid });
      var a = achieve(t, items);
      var ach = a.ach * proj, pct = pctOf(t, ach, tgt);
      var r = { key: tc.key, id: t.id, tver: t.ver || 1, name: t.name, unit: t.unit, dir: t.dir, mode: t.mode, role: tc.role || 'primarni', inCalc: tc.inCalc !== false, target: tgt, ach: ach, pct: pct, n: a.n, nStorno: a.nStorno, nClosed: a.nClosed, nWait: a.nWait, nRej: a.nRej, ponder: band(tc.scale || s.scale, ty === 'kombinovana' ? Math.min(pct, 1) : pct), dep: 1, share: tc.share || 0 };
      if (ty === 'provizija') { r.val = tc.val; r.value = Math.round(a.items.reduce(function (x, i) { return x + itemValue(tc.val, i, t); }, 0) * proj); }
      else {
        r.value = Math.round(res.base * r.share);
        if (ty === 'kombinovana' && tc.val && pct > 1) { r.val = tc.val; r.over = ach - tgt; r.extra = Math.round(tc.val.k === 'pct' ? r.over * tc.val.v : Math.floor(r.over + 1e-9) * tc.val.v); }
      }
      byKey[tc.key] = r;
      res.targets.push(r);
    });
    res.condRes = applyRules(s, byKey, mgrId, pid, opts);
    res.targets.forEach(function (r) { r.bonus = payOf(r); });
    res.depActive = res.targets.some(function (r) { return r.dep !== 1; });
    /* timski faktor: udeo zaposlenih na izabranoj poziciji koji su na izabranom targetu najmanje do praga */
    var tf = s.teamFactor || {}, tPos = tf.pos || ['licni'], tMin = tf.min != null ? tf.min : 1;
    var staff = D.employees.filter(function (e) { return tPos.indexOf(e.pos) >= 0 && e.branch === bid; });
    var team = staff.map(function (e) {
      var m = EN.result(e.id, pid, { project: opts.project }), x = (m && m.targets || []).filter(function (q) { return q.id === tf.target; })[0] || (tf.target ? null : (m && m.targets[0]));
      var pc = x ? x.pct : 0;
      return { emp: e.id, pct: pc, on: pc >= tMin };
    });
    var share = team.length ? team.filter(function (x) { return x.on; }).length / team.length : 0;
    res.team = team; res.share = share;
    res.teamFactor = tf.bands ? band(tf.bands, share) : 1;
    res.storno = 0; res.stornoN = res.targets.reduce(function (a, r) { return a + r.nStorno; }, 0); res.outOfTarget = 0;
    contAndClose(res, s, ver, byKey, mgrId, pid, opts, EN.m2);
    finish(res, s, ver, mgrId, pid, opts, [], proj, res.teamFactor);
    CACHE[key] = res;
    return res;
  };

  /* ---------- univerzalni pristup: model šeme određuje način obračuna ---------- */
  EN.result = function (empId, pid, opts) {
    var s = (opts && opts.sch) || EN.schemeFor(empId, pid);
    if (!s) return noScheme(empId, pid);
    if (s.model === 'M2') return EN.m2(empId, pid, opts);
    if (s.model === 'M3') return EN.m3For(empId, pid, opts);
    return EN.m1(empId, pid, opts);
  };
  /* koji periodi važe za zaposlenog: tip perioda šeme iz poslednjeg rasporeda (bez rasporeda — po poziciji) */
  EN.periodType = function (empId) {
    var e = D.emp(empId), list = (IH.assignments ? IH.assignments() : D.assignments).filter(function (a) { return a.emp === empId && (a.status === 'aktivan' || a.status === 'zavrsen'); });
    list.sort(function (a, b) { return a.from < b.from ? 1 : -1; });
    var s = list[0] && D.scheme(list[0].scheme);
    return s ? s.periodType : (e.pos === 'univerzalni' ? 'M' : 'Q');
  };
  EN.periodsFor = function (empId) {
    var t = EN.periodType(empId);
    return D.periods.filter(function (p) { return p.type === t; });
  };
  EN.currentPeriod = function (empId) { return EN.periodsFor(empId).filter(function (p) { return p.status === 'u_toku'; })[0].id; };
  EN.lastClosed = function (empId) { return EN.periodsFor(empId).filter(function (p) { return p.status === 'saglasnost'; })[0].id; };

  /* ---------- saglasnosti ---------- */
  EN.approval = function (empId, pid) {
    var st = IH.state.data.approvals && IH.state.data.approvals[pid + '|' + empId];
    if (st) return st;
    var seed = D.approvalSeed[pid] && D.approvalSeed[pid][empId];
    if (seed) return seed;
    var p = D.period(pid);
    if (p.status === 'isplaceno') return { status: 'isplaceno', at: p.paidAt };
    if (p.status === 'u_toku') return { status: 'u_toku' };
    var r = D.rng('appr|' + empId + '|' + pid)();
    if (p.type === 'M') return r < 0.72 ? { status: 'saglasan', at: '2026-10-1' + Math.floor(r * 8) + 'T10:00' } : { status: 'auto', at: '2026-10-18T23:59' };
    if (empId === 'E2022' || empId === 'E2041') return { status: 'prigovor', complaint: null };
    return r < 0.55 ? { status: 'saglasan', at: '2026-10-1' + (2 + Math.floor(r * 7)) + 'T09:30' } : { status: 'ceka' };
  };
  EN.setApproval = function (empId, pid, obj) {
    IH.state.data.approvals = IH.state.data.approvals || {};
    IH.state.data.approvals[pid + '|' + empId] = obj;
    IH.save();
  };
  EN.staffForPeriod = function (pid) {
    var p = D.period(pid);
    return D.employees.filter(function (e) {
      if (p.type === 'M') return e.pos === 'univerzalni' && e.since <= p.to;
      return (e.pos === 'licni' || e.pos === 'menadzer') && e.since <= p.to;
    });
  };

  /* ---------- zbirne statistike prodaje (početna, izveštaji) ---------- */
  /* prodaja po mesecu i vrsti proizvoda za skup zaposlenih (priznate nove − storno) */
  EN.salesByMonth = function (empIds, months) {
    var out = months.map(function (m) { return { month: m, kredit: 0, racun: 0, kartica: 0, kreditN: 0 }; });
    var idx = {}; out.forEach(function (o) { idx[o.month] = o; });
    empIds.forEach(function (id) {
      var e = D.emp(id), pids = (e.pos === 'univerzalni' ? months : D.periods.filter(function (p) { return p.type === 'Q'; }).map(function (p) { return p.id; })).filter(function (pid) { return !!D.period(pid) && !D.isPlanned(pid); });
      pids.forEach(function (pid) {
        D.itemsOf(id, pid).forEach(function (i) {
          if (i.status !== 'priznato' || (i.type !== 'nova' && i.type !== 'storno')) return;
          if (i.type === 'nova' && EN.recogDefault(i).st !== 'ok') return;
          var m = i.date.slice(0, 7), o = idx[m]; if (!o) return;
          var sg = i.type === 'storno' ? -1 : 1;
          if (i.ptype === 'kredit') { o.kredit += sg * (i.amount || 0); o.kreditN += sg; } else o[i.ptype] += sg;
        });
      });
    });
    return out;
  };
})();
