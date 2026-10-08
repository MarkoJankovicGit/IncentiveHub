/* Incentive Hub — Dnevno ostvarenje (Administrator) i Moje ostvarenje (Zaposleni) */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'os.title': 'Dnevno ostvarenje', 'os.my': 'Moje ostvarenje',
    'os.day': 'Dan {d} od {t}', 'os.daySub': 'podaci do {d}', 'os.netT1': 'Krediti — mreža', 'os.netT1s': 'od {t} · projekcija {p}', 'os.cost': 'Projektovani trošak', 'os.costS': 'savetnici i menadžeri, {p}',
    'os.onTrack': 'Na putu ka targetu', 'os.onTrackS': 'savetnici, projekcija kredita ≥ 100%', 'os.lastLoad': 'Poslednji uvoz', 'os.lastLoadS': '{n} prodaja · {d}',
    'os.daily': 'Plasman kredita po danu (RSD)', 'os.byBranch': 'Ostvarenje po ekspozituri', 'os.colProj': 'Projekcija kredita', 'os.colOn': 'Na putu', 'os.colBonus': 'Bonus (proj.)',
    'os.final': 'konačno', 'os.lic': 'Savetnici', 'os.team': 'Tim univerzalnih bankara — {p}', 'os.teamSub': 'timski faktor {f} · {n} člana', 'os.mgr': 'Menadžer ekspoziture',
    'os.targets': 'Ostvarenje po targetu', 'os.items': 'Prodaje', 'os.proj': 'projekcija {p}', 'os.members': 'Članovi tima', 'os.myShare': 'Moje prodaje u timskom targetu',
    'os.colDate': 'Datum', 'os.colItem': 'Proizvod', 'os.colSeg': 'Grupa klijenata', 'os.colPt': 'Vrsta', 'os.colType': 'Vrsta prodaje', 'os.colAmt': 'Iznos', 'os.colTg': 'Target', 'os.colVal': 'Vrednost za bonus', 'os.colSrc': 'Izvor', 'os.colClient': 'Klijent', 'os.none': 'Ne ulazi',
    'it.priznato': 'Priznato', 'it.storno': 'Storno', 'it.nemapirano': 'Čeka mapiranje', 'it.mapirano': 'Mapirano naknadno', 'it.ceka': 'Čeka ponovni obračun', 'it.korigovano': 'Korigovano', 'it.rucno': 'Ručno dodato', 'it.iskljuceno': 'Isključeno', 'it.premesteno': 'Prebačeno drugom prodavcu',
    'it.why.priznato': 'Prodaja je priznata i ulazi u ostvarenje targeta {t}.', 'it.why.storno': 'Storno umanjuje ostvarenje targeta {t}.', 'it.why.nemapirano': 'Šifra {c} još nije povezana sa proizvodom u katalogu. Prodaja nije izgubljena — ulazi u obračun čim administrator mapira šifru.',
    'it.why.mapirano': 'Šifra {c} je mapirana naknadno; prodaja je uključena u obračun.', 'it.why.ceka': 'Izmena je evidentirana, a period je zaključen — ulazi u obračun pri ponovnom obračunu perioda.', 'it.why.korigovano': 'Prodaja je izmenjena korekcijom {k}; original je sačuvan.',
    'it.ceka_uslov': 'Čeka uslov', 'it.nije_priznato': 'Nije priznato', 'it.ne_racuna': 'Ne računa se', 'it.zatvaranje': 'Zatvoren račun',
    'it.why.ceka_uslov': 'Prodaja ulazi u ostvarenje targeta {t} kada se ispuni uslov „{c}“ — najkasnije {d}.', 'it.why.nije_priznato': 'Uslov „{c}“ nije ispunjen u roku — prodaja ne ulazi u ostvarenje targeta {t}.', 'it.why.ne_racuna': 'Uslov „{c}“ — prodaja se nikad ne računa u target {t}.', 'it.why.zatvaranje': 'Klijent je zatvorio račun. Umanjuje neto target {t}.',
    'it.why.rucno': 'Prodaja je ručno dodata korekcijom {k}.', 'it.why.iskljuceno': 'Prodaja je isključena iz obračuna korekcijom {k}.', 'it.why.premesteno': 'Prodaja je korekcijom {k} pripisana drugom prodavcu: {n}.',
    'it.detail': 'Prodaja', 'it.orig': 'Original iz izvora', 'it.now': 'Važi u obračunu', 'it.trail': 'Tok prodaje', 'it.loaded': 'Učitano iz {s} ({l})', 'it.mappedAt': 'Šifra {c} mapirana na {p}', 'it.corrAt': 'Korekcija {k}: {r}',
    'it.client': 'Klijent', 'it.contract': 'Ugovor', 'it.code': 'Šifra iz izvora', 'it.toCorr': 'Korekcija prodaje', 'os.empty': 'Za izabrani period nema prodaja.', 'os.inCalc': 'Prodaja u obračunu', 'os.ofTotal': 'od ukupno {n}', 'os.afterMap': 'ulaze posle mapiranja / ponovnog obračuna', 'os.reduce': 'umanjuju ostvarenje'
  }, {
    'os.title': 'Daily achievement', 'os.my': 'My achievement',
    'os.day': 'Day {d} of {t}', 'os.daySub': 'data as of {d}', 'os.netT1': 'Loans — network', 'os.netT1s': 'of {t} · projection {p}', 'os.cost': 'Projected cost', 'os.costS': 'advisors and managers, {p}',
    'os.onTrack': 'On track to target', 'os.onTrackS': 'advisors, loan projection ≥ 100%', 'os.lastLoad': 'Last import', 'os.lastLoadS': '{n} sales · {d}',
    'os.daily': 'Loan disbursement per day (RSD)', 'os.byBranch': 'Achievement by branch', 'os.colProj': 'Loan projection', 'os.colOn': 'On track', 'os.colBonus': 'Bonus (proj.)',
    'os.final': 'final', 'os.lic': 'Advisors', 'os.team': 'Universal banker team — {p}', 'os.teamSub': 'team factor {f} · {n} members', 'os.mgr': 'Branch manager',
    'os.targets': 'Achievement by target', 'os.items': 'Sales', 'os.proj': 'projection {p}', 'os.members': 'Team members', 'os.myShare': 'My sales in the team target',
    'os.colDate': 'Date', 'os.colItem': 'Product', 'os.colSeg': 'Client group', 'os.colPt': 'Type', 'os.colType': 'Sale type', 'os.colAmt': 'Amount', 'os.colTg': 'Target', 'os.colVal': 'Value for bonus', 'os.colSrc': 'Source', 'os.colClient': 'Client', 'os.none': 'Not counted',
    'it.priznato': 'Recognised', 'it.storno': 'Reversal', 'it.nemapirano': 'Awaiting mapping', 'it.mapirano': 'Mapped later', 'it.ceka': 'Awaiting recalculation', 'it.korigovano': 'Adjusted', 'it.rucno': 'Manually added', 'it.iskljuceno': 'Excluded', 'it.premesteno': 'Moved to another seller',
    'it.why.priznato': 'The sale is recognised and counts toward target {t}.', 'it.why.storno': 'A reversal reduces the achievement of target {t}.', 'it.why.nemapirano': 'Code {c} is not yet linked to a catalogue product. The sale is not lost — it counts as soon as the administrator maps the code.',
    'it.why.mapirano': 'Code {c} was mapped later; the sale is included.', 'it.why.ceka': 'The change is recorded but the period is locked — it counts when the period is recalculated.', 'it.why.korigovano': 'The sale was changed by correction {k}; the original is kept.',
    'it.ceka_uslov': 'Awaiting condition', 'it.nije_priznato': 'Not recognised', 'it.ne_racuna': 'Never counts', 'it.zatvaranje': 'Account closed',
    'it.why.ceka_uslov': 'The sale counts toward target {t} once condition "{c}" is met — by {d} at the latest.', 'it.why.nije_priznato': 'Condition "{c}" was not met in time — the sale does not count toward target {t}.', 'it.why.ne_racuna': 'Condition "{c}" — the sale never counts toward target {t}.', 'it.why.zatvaranje': 'The client closed the account. It reduces the net target {t}.',
    'it.why.rucno': 'The sale was added manually by correction {k}.', 'it.why.iskljuceno': 'The sale was excluded by correction {k}.', 'it.why.premesteno': 'Correction {k} attributed the sale to another seller: {n}.',
    'it.detail': 'Sale', 'it.orig': 'Original from source', 'it.now': 'Used in calculation', 'it.trail': 'Sale trail', 'it.loaded': 'Loaded from {s} ({l})', 'it.mappedAt': 'Code {c} mapped to {p}', 'it.corrAt': 'Correction {k}: {r}',
    'it.client': 'Client', 'it.contract': 'Contract', 'it.code': 'Source code', 'it.toCorr': 'Correct sale', 'os.empty': 'No sales for the selected period.', 'os.inCalc': 'Sales counted', 'os.ofTotal': 'of {n}', 'os.afterMap': 'count after mapping / recalculation', 'os.reduce': 'reduce achievement'
  });

  var ITC = { priznato: 'success', storno: 'danger', nemapirano: 'warning', mapirano: 'accent', ceka: 'warning', korigovano: 'accent', rucno: 'accent', iskljuceno: 'gray', premesteno: 'gray', ceka_uslov: 'warning', nije_priznato: 'gray', ne_racuna: 'gray', zatvaranje: 'gray' };
  IH.ui.itemSt = function (s) { return ui.pill(t('it.' + s), ITC[s] || 'gray'); };

  /* ---------- prodaje zaposlenog sa efektivnim statusom ---------- */
  function schemeOf(empId, pid) { var s = EN.schemeFor(empId, pid); return s ? D.schemeAt(s, pid) : null; }
  function targetOf(s, it, pid, neto) {
    for (var i = 0; i < s.targets.length; i++) { var tg = EN.targetOf(s.targets[i], s, pid); if (tg && EN.matches(tg, it) && (!neto || tg.mode === 'neto')) return s.targets[i]; }
    return null;
  }
  IH.itemRows = function (empId, pid) {
    var ed = EN.edits(pid), mapped = IH.map('mapped');
    var out = D.itemsOf(empId, pid).map(function (i) {
      var it = i, st;
      if (i.status === 'nemapirano') {
        var mv = EN.mappedView(i);
        if (mv) { it = mv; st = 'mapirano'; }
        else if (mapped[i.code]) { var mp = D.product(mapped[i.code].product); it = Object.assign({}, i, { product: mp.id, cat: mp.cat, seg: mp.seg, ptype: mp.ptype }); st = 'ceka'; }
        else st = 'nemapirano';
      } else st = i.type === 'storno' ? 'storno' : i.type === 'zatvaranje' ? 'zatvaranje' : 'priznato';
      var c = ed[i.id];
      if (c) {
        if (!EN.applies(c, empId)) st = 'ceka';
        else { it = Object.assign({}, it, c.changes); st = c.changes.emp && c.changes.emp !== empId ? 'premesteno' : c.changes.status === 'iskljuceno' ? 'iskljuceno' : 'korigovano'; }
      }
      return { id: i.id, it: it, raw: i, st: st, corr: c || null };
    });
    Object.keys(ed).forEach(function (k) {
      var c = ed[k]; if (!c.item || c.changes.emp !== empId || c.item.emp === empId) return;
      out.push({ id: c.item.id, it: Object.assign({}, c.item, c.changes), raw: c.item, st: EN.applies(c, empId) ? 'korigovano' : 'ceka', corr: c, movedIn: true });
    });
    EN.allCorr().filter(function (c) { return c.kind === 'linija' && c.emp === empId && c.period === pid && c.item; }).forEach(function (c) {
      out.push({ id: c.item.id, it: c.item, raw: c.item, st: EN.applies(c, empId) ? 'rucno' : 'ceka', corr: c });
    });
    var s = schemeOf(empId, pid);
    out.forEach(function (r) {
      var tc = s ? targetOf(s, r.it, pid, r.st === 'zatvaranje') : null, tg = tc ? EN.targetOf(tc, s, pid) : null;
      r.tg = tc ? tc.key : null; r.tgName = tg ? IH.L(tg.name) : null;
      if (tg && r.it.type === 'nova' && (r.st === 'priznato' || r.st === 'mapirano')) {
        var rc = EN.recog(tg, r.it);
        if (rc.st !== 'ok') { r.rc = rc; r.st = rc.st === 'ceka' ? 'ceka_uslov' : rc.st === 'iskljuceno' ? 'ne_racuna' : 'nije_priznato'; }
      } else if (!tg && r.it.type === 'nova' && r.st === 'priznato') {
        var rd = EN.recogDefault(r.it);
        if (rd.st !== 'ok') { r.rc = rd; r.st = rd.st === 'ceka' ? 'ceka_uslov' : rd.st === 'iskljuceno' ? 'ne_racuna' : 'nije_priznato'; }
      }
      var counts = r.st === 'priznato' || r.st === 'mapirano' || r.st === 'korigovano' || r.st === 'rucno' || r.st === 'storno';
      r.val = s && s.type === 'provizija' && tc && counts && r.it.ptype ? (r.st === 'storno' ? -1 : 1) * EN.itemValue(tc.val, r.it) : null;
    });
    return out.sort(function (a, b) { return a.it.date < b.it.date ? 1 : a.it.date > b.it.date ? -1 : (a.id < b.id ? 1 : -1); });
  };
  function loadOf(it) {
    if (it.load) return it.load;
    if (it.source === 'KOREKCIJA') return null;
    var d = new Date(Date.parse(it.date) + 864e5).toISOString().slice(0, 10).replace(/-/g, '');
    return 'LD-' + d + '-01';
  }
  function prodLabel(it) { return it.product ? IH.esc(D.productName(it.product)) : '<span class="mut">' + IH.esc(it.code) + '</span>'; }
  function findRow(empId, pid, id) { return IH.itemRows(empId, pid).filter(function (r) { return r.id === id; })[0]; }

  /* ---------- detalj prodaje (ista forma, samo za čitanje) ---------- */
  function whyText(r) {
    var k = r.corr ? r.corr.id : '', n = r.st === 'premesteno' ? D.emp(r.it.emp).name : '';
    if (r.rc) return t('it.why.' + r.st, { t: IH.esc(r.tgName || '—'), c: IH.esc(IH.rules.condName(r.rc.c)), d: r.rc.until ? F.date(r.rc.until) : '—' });
    return t('it.why.' + r.st, { t: r.tgName || '—', c: r.raw.code, k: k, n: IH.esc(n) });
  }
  function itemFields(it) {
    return [
      { k: 'iv_d', label: t('c.date'), type: 'static', value: F.date(it.date) }, { k: 'iv_p', label: t('c.product'), type: 'static', value: it.product ? D.productName(it.product) : it.code },
      { k: 'iv_seg', label: t('os.colSeg'), type: 'static', value: it.seg ? D.segName(it.seg) : '' }, { k: 'iv_pt', label: t('os.colPt'), type: 'static', value: it.ptype ? D.ptypeName(it.ptype) : '' },
      { k: 'iv_ty', label: t('os.colType'), type: 'static', value: t('ct.' + it.type) }, { k: 'iv_a', label: t('os.colAmt'), type: 'static', value: it.amount ? F.rsd(it.amount) : '' },
      { k: 'iv_e', label: t('c.employee'), type: 'static', value: D.emp(it.emp).name }, { k: 'iv_c', label: t('it.code'), type: 'static', value: it.code },
      { k: 'iv_cl', label: t('it.client'), type: 'static', value: it.client || '' }, { k: 'iv_u', label: t('it.contract'), type: 'static', value: it.contract || '' }
    ];
  }
  IH.act['it-det'] = function (el) {
    var p = el.dataset.arg.split('|'), r = findRow(p[0], p[1], p[2]); if (!r) return;
    var changed = r.corr && r.corr.kind === 'izmena';
    var trail = [];
    if (r.raw.source === 'KOREKCIJA') trail.push({ at: r.corr.at, by: r.corr.by, action: t('it.corrAt', { k: r.corr.id, r: IH.L(reasonName(r.corr.reason)) }) });
    else if (r.raw.load && IH.loads) { var ld = IH.loads().filter(function (l) { return l.id === r.raw.load; })[0]; trail.push({ at: ld ? ld.at : D.LAST_LOAD, by: ld ? ld.by : null, action: t('it.loaded', { s: IH.L(L('ručnog uploada', 'manual upload')), l: r.raw.load }) }); }
    else trail.push({ at: (loadOf(r.raw) ? loadOf(r.raw).slice(3, 7) + '-' + loadOf(r.raw).slice(7, 9) + '-' + loadOf(r.raw).slice(9, 11) + 'T06:12' : r.raw.date + 'T06:12'), by: null, action: t('it.loaded', { s: r.raw.source === 'RUCNO' ? IH.L(L('ručnog uploada', 'manual upload')) : 'DWH', l: loadOf(r.raw) || '—' }) });
    var m = IH.map('mapped')[r.raw.code];
    if (r.raw.status === 'nemapirano' && m) trail.push({ at: m.at, by: m.by, action: t('it.mappedAt', { c: r.raw.code, p: D.productName(m.product) }) });
    if (changed) trail.push({ at: r.corr.at, by: r.corr.by, action: t('it.corrAt', { k: r.corr.id, r: IH.L(reasonName(r.corr.reason)) }), detail: r.corr.note });
    var admin = IH.state.role === 'admin' && D.period(p[1]).status !== 'isplaceno' && !r.movedIn && r.raw.source !== 'KOREKCIJA' && (r.st === 'priznato' || r.st === 'storno' || r.st === 'korigovano');
    IH.modal({
      title: t('it.detail') + ' · ' + (r.it.product ? IH.esc(D.productName(r.it.product)) : IH.esc(r.it.code)), wide: true,
      body: '<div class="note' + (r.st === 'nemapirano' || r.st === 'ceka' ? ' warn' : '') + '" style="margin-bottom:14px">' + IH.ui.itemSt(r.st) + ' ' + whyText(r) + (r.val != null ? ' ' + t('os.colVal') + ': <b>' + F.rsd(r.val) + '</b>.' : '') + '</div>' +
        (changed && r.st !== 'ceka' ? '<div class="grid g2"><div><div class="lab">' + t('it.orig') + '</div>' + ui.form(itemFields(r.raw), { readonly: true, cols: 1 }) + '</div><div><div class="lab">' + t('it.now') + '</div>' + ui.form(itemFields(r.it), { readonly: true, cols: 1 }) + '</div></div>' : ui.form(itemFields(r.it), { readonly: true })) +
        '<div class="lab" style="margin-top:14px">' + t('it.trail') + '</div>' + ui.hist(trail.reverse()),
      foot: (admin ? ui.btn(t('it.toCorr'), { icon: 'edit', act: 'kor-from-item', arg: el.dataset.arg }) : '') + ui.btn(t('c.close'), { act: 'modal-close' })
    });
  };
  function reasonName(id) { var r = IH.codeItems('RAZLOG_KOREKCIJE').filter(function (x) { return x.id === id; })[0]; return r ? r.name : id; }

  /* ---------- panel zaposlenog: targeti + prodaje ---------- */
  function periodsOf(empId) { var e = D.emp(empId); return e.pos === 'univerzalni' ? ['2026-10', '2026-09', '2026-08', '2026-07'] : ['2026-Q4', '2026-Q3', '2026-Q2', '2026-Q1']; }
  function perLabel(pid) { return D.periodLabel(pid) + (D.period(pid).status === 'u_toku' ? ' · ' + t('pst.u_toku').toLowerCase() : ''); }
  function targetsCard(empId, pid) {
    var e = D.emp(empId), run = D.period(pid).status === 'u_toku', s = schemeOf(empId, pid);
    if (e.pos !== 'univerzalni') {
      var r = EN.result(empId, pid), pr = run ? EN.result(empId, pid, { project: true }) : null;
      var rows = r.targets.map(function (x, i) { var pp = pr ? pr.targets[i].pct : null; return { k: '<b>' + IH.esc(IH.L(x.name)) + '</b>', a: F.unit(Math.round(x.ach), x.unit) + ' / ' + F.unit(x.target, x.unit), p: ui.pcell(x.pct), pr: pp != null ? ui.pcell(pp) : '<span class="mut">' + t('os.final') + '</span>', n: x.n }; });
      return ui.card(t('os.targets') + ' · ' + IH.esc(IH.L(s.name)), ui.table([{ key: 'k', label: t('c.target') }, { key: 'a', label: t('c.ach'), num: true }, { key: 'p', label: run ? IH.L(L('Do danas', 'To date')) : t('c.pct'), w: '170px' }, { key: 'pr', label: t('c.projection'), w: '170px' }, { key: 'n', label: t('os.items'), num: true }], rows, { compact: true }), { flush: true });
    }
    var m3 = EN.m3(e.branch, pid, { project: run }), mine = EN.effItems(empId, pid);
    var kr = m3.kpis.map(function (k) {
      var tg = D.targetAt(k.id, pid), my = mine.filter(function (i) { return EN.matches(tg, i) && i.type === 'nova' && EN.recog(tg, i).st === 'ok'; });
      var myv = tg.unit === 'RSD' ? my.reduce(function (a, i) { return a + i.amount; }, 0) : my.length;
      return { k: '<b>' + IH.esc(IH.L(k.name)) + '</b>', a: F.unit(Math.round(k.ach), k.unit) + ' / ' + F.unit(k.target, k.unit), p: ui.pcell(k.pct, { max: 1.6 }), m: F.unit(myv, k.unit) };
    });
    return ui.card(t('os.targets') + ' · ' + IH.esc(IH.L(s.name)) + ' · ' + t('os.teamSub', { f: '×' + F.num(m3.teamFactor, 1), n: m3.members.length }), ui.table([{ key: 'k', label: t('c.target') }, { key: 'a', label: t('c.ach') + (run ? ' (' + t('c.projection').toLowerCase() + ')' : ''), num: true }, { key: 'p', label: t('c.pct'), w: '170px' }, { key: 'm', label: t('os.myShare'), num: true }], kr, { compact: true }), { flush: true });
  }
  function itemsGrid(empId, pid) {
    var s = schemeOf(empId, pid), prov = s && s.type === 'provizija', gid = 'it-' + empId;
    var rowsFn = function () { return IH.itemRows(empId, pid); };
    return IH.sech(t('os.items')) + IH.grid({
      id: gid, exportName: 'Prodaje_' + D.emp(empId).hr + '_' + pid + '.xlsx', searchLabel: IH.L(L('Proizvod, klijent, ugovor, šifra', 'Product, client, contract, code')), hidden: ['src', 'code', 'cl'].concat(prov ? [] : ['v']),
      rows: rowsFn, key: function (r) { return r.id; }, label: function (r) { return r.id; }, searchKeys: ['p', 'q', 'cl', 'code'],
      rowCls: function (r) { return r.st === 'premesteno' || r.st === 'iskljuceno' ? 'muted' : ''; },
      cols: [
        { key: 'st', label: t('c.status'), val: function (r) { return t('it.' + r.st); }, fval: function (r) { return r.st; }, render: function (r) { return IH.ui.itemSt(r.st); }, filter: function () { var u = {}; rowsFn().forEach(function (r) { u[r.st] = 1; }); return Object.keys(u).map(function (k) { return { v: k, l: t('it.' + k) }; }); } },
        { key: 'd', label: t('os.colDate'), val: function (r) { return r.it.date; }, render: function (r) { return F.date(r.it.date); } },
        { key: 'p', label: t('os.colItem'), nw: false, val: function (r) { return r.it.product ? D.productName(r.it.product) : r.it.code; }, render: function (r) { return '<b>' + prodLabel(r.it) + '</b>'; } },
        { key: 'seg', label: t('os.colSeg'), val: function (r) { return r.it.seg ? D.segName(r.it.seg) : ''; }, fval: function (r) { return r.it.seg || ''; }, filter: function () { return D.segments.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'pt', label: t('os.colPt'), val: function (r) { return r.it.ptype ? D.ptypeName(r.it.ptype) : ''; }, fval: function (r) { return r.it.ptype || ''; }, filter: function () { return D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'ty', label: t('os.colType'), val: function (r) { return t('ct.' + r.it.type); }, fval: function (r) { return r.it.type; }, filter: function () { return ['nova', 'storno'].map(function (k) { return { v: k, l: t('ct.' + k) }; }); } },
        { key: 'a', label: t('os.colAmt'), num: true, search: false, val: function (r) { return r.it.amount || 0; }, render: function (r) { return r.it.amount ? F.num(r.it.amount) : '<span class="mut">—</span>'; } },
        { key: 'q', label: t('it.contract'), val: function (r) { return r.it.contract || ''; }, sort: false },
        { key: 'cl', label: t('os.colClient'), val: function (r) { return r.it.client || ''; } },
        { key: 'code', label: t('it.code'), val: function (r) { return r.it.code; } },
        { key: 'tg', label: t('os.colTg'), val: function (r) { return r.tgName || ''; }, fval: function (r) { return r.tg || ''; }, render: function (r) { return r.tgName ? IH.esc(r.tgName) : '<span class="mut">' + t('os.none') + '</span>'; }, filter: function () { return s ? s.targets.map(function (tc) { return { v: tc.key, l: IH.L(EN.targetOf(tc, s).name) }; }) : []; } },
        { key: 'v', label: t('os.colVal'), num: true, search: false, val: function (r) { return r.val == null ? -1e12 : r.val; }, render: function (r) { return r.val == null ? '<span class="mut">—</span>' : '<span' + (r.val < 0 ? ' style="color:var(--danger)"' : '') + '>' + F.num(r.val) + '</span>'; } },
        { key: 'src', label: t('os.colSrc'), val: function (r) { return r.raw.source === 'KOREKCIJA' ? r.corr.id : loadOf(r.raw) || ''; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'it-det', arg: function (r) { return empId + '|' + pid + '|' + r.id; } },
        { type: 'edit', title: t('it.toCorr'), act: 'kor-from-item', kind: 'acc', arg: function (r) { return empId + '|' + pid + '|' + r.id; }, show: function (r) { return IH.state.role === 'admin' && D.period(pid).status !== 'isplaceno' && !r.movedIn && r.raw.source !== 'KOREKCIJA' && (r.st === 'priznato' || r.st === 'storno' || r.st === 'korigovano'); } }
      ]
    });
  }
  /* bodovni target: komadi i bodovi po proizvodu iz bodovne liste (priznate prodaje − storno) */
  function ptsBreakdown(tg, empId, pid) {
    var a = EN.achieve(tg, EN.effItems(empId, pid)), by = {}, tn = 0, tb = 0;
    a.items.forEach(function (i) { (by[i.product] = by[i.product] || { n: 0, s: 0 }).n++; });
    a.stornoItems.forEach(function (i) { (by[i.product] = by[i.product] || { n: 0, s: 0 }).s++; });
    var rows = D.subjProducts(tg.subject).map(function (p) {
      var o = by[p.id] || { n: 0, s: 0 }, k = o.n - o.s, b = D.ptsOf(tg, p.id); tn += k; tb += k * b;
      return { p: IH.esc(D.productName(p)), b: F.num(b), n: k ? F.num(k) : '<span class="mut">0</span>', s: k ? '<b>' + F.num(k * b) + '</b>' : '<span class="mut">0</span>' };
    });
    return ui.table([{ key: 'p', label: IH.L(L('Proizvod', 'Product')) }, { key: 'b', label: IH.L(L('Bodova po komadu', 'Points per piece')), num: true }, { key: 'n', label: IH.L(L('Komada', 'Pieces')), num: true }, { key: 's', label: IH.L(L('Bodova', 'Points')), num: true }],
      rows, { compact: true, foot: { p: t('c.total'), n: '<b>' + F.num(tn) + '</b>', s: '<b>' + F.num(tb) + '</b>' } });
  }
  IH.ptsBreakdown = ptsBreakdown;
  function ptsCards(empId, pid) {
    var r = EN.result(empId, pid); if (!r || r.noScheme || D.emp(empId).pos === 'univerzalni') return '';
    return (r.targets || []).filter(function (x) { return x.unit === 'bod'; }).map(function (x) { return ui.card(IH.esc(IH.L(x.name)) + ' — ' + IH.L(L('komadi i bodovi', 'pieces and points')), ptsBreakdown(D.targetAt(x.id, pid), empId, pid), { flush: true }); }).join('');
  }
  function empPage(empId, scope, crumb) {
    var e = D.emp(empId), pers = periodsOf(empId), v = IH.v(scope);
    var pid = pers.indexOf(v.per) >= 0 ? v.per : pers[0];
    IH.refreshers[scope] = function () { IH.render(); };
    var seg = ui.segf(scope, 'per', pers.map(function (p) { return { v: p, l: perLabel(p) }; }));
    var r = EN.result(empId, pid, { project: D.period(pid).status === 'u_toku' });
    var title = scope === 'my' ? t('os.my') : IH.esc(e.name);
    var acts = scope === 'my' ? ui.btn(t('nav.moj-obracun'), { icon: 'calc', go: 'moj-obracun' }) : ui.btn(IH.L(L('Obračunski list', 'Statement')), { icon: 'calc', go: 'obracun/' + (D.period(pid).status === 'u_toku' ? (e.pos === 'univerzalni' ? '2026-10' : '2026-Q4') : pid) + '/' + empId });
    var rows = IH.itemRows(empId, pid);
    var kp = '<div class="kpis" style="margin-bottom:14px">' +
      ui.kpi(D.period(pid).status === 'u_toku' ? IH.L(L('Projektovani bonus', 'Projected bonus')) : IH.L(L('Bonus za period', 'Bonus for the period')), F.num(r ? r.payout : 0) + '<span class="u">RSD</span>', D.periodLabel(pid), { hl: true }) +
      ui.kpi(t('os.inCalc'), EN.effItems(empId, pid).length, t('os.ofTotal', { n: rows.length })) +
      ui.kpi(t('it.nemapirano'), rows.filter(function (x) { return x.st === 'nemapirano' || x.st === 'ceka'; }).length, t('os.afterMap')) +
      ui.kpi(t('it.storno'), rows.filter(function (x) { return x.st === 'storno'; }).length, t('os.reduce')) + '</div>';
    return ui.header(title, '', acts, crumb || (D.posName(e.pos) + ' · ' + IH.esc(D.branchName(e.branch)))) + '<div class="toolbar" style="border:0;padding:0 0 14px">' + seg + '</div>' + kp + targetsCard(empId, pid) + ptsCards(empId, pid) + itemsGrid(empId, pid);
  }

  /* ================= MREŽA ================= */
  function branchStats(bid, pid) {
    var run = D.period(pid).status === 'u_toku';
    var lic = D.branchStaff(bid, 'licni'), keys = D.TKEYS, agg = {};
    keys.forEach(function (k) { agg[k] = { a: 0, t: 0, pa: 0 }; });
    var on = 0, bonus = 0;
    lic.forEach(function (e) {
      var r = EN.m1(e.id, pid), pr = run ? EN.m1(e.id, pid, { project: true }) : r;
      r.targets.forEach(function (x, i) { if (agg[x.key]) { agg[x.key].a += x.ach; agg[x.key].t += x.target; agg[x.key].pa += pr.targets[i].ach; } });
      if (pr.targets[0].pct >= 1) on++;
      bonus += pr.payout;
    });
    var mg = D.branchManager(bid); bonus += EN.m2(mg.id, pid, { project: run }).payout;
    var res = { b: D.branch(bid), n: lic.length, on: on, bonus: bonus };
    keys.forEach(function (k) { res[k] = agg[k].t ? agg[k].a / agg[k].t : 0; res['p' + k] = agg[k].t ? agg[k].pa / agg[k].t : 0; res['a' + k] = agg[k].a; res['t' + k] = agg[k].t; });
    return res;
  }
  function tName(k) { return IH.L(D.targetByKey('S-M1', k).name).split(' – ')[0]; }
  function netPage() {
    var v = IH.v('os'), pid = v.per === '2026-Q3' ? '2026-Q3' : '2026-Q4', run = pid === '2026-Q4', di = D.daysInfo(pid);
    IH.refreshers.os = function () { IH.render(); };
    var rows = D.branches.map(function (b) { return branchStats(b.id, pid); });
    var aT = rows.reduce(function (a, r) { return a + r.aT1; }, 0), tT = rows.reduce(function (a, r) { return a + r.tT1; }, 0);
    var pT = rows.reduce(function (a, r) { return a + r.pT1 * r.tT1; }, 0) / (tT || 1);
    var nOn = rows.reduce(function (a, r) { return a + r.on; }, 0), nL = rows.reduce(function (a, r) { return a + r.n; }, 0), cost = rows.reduce(function (a, r) { return a + r.bonus; }, 0);
    var lastLoad = (IH.loads ? IH.loads()[0] : null);
    var kp = '<div class="kpis">' +
      ui.kpi(run ? t('os.day', { d: di.done, t: di.total }) : D.periodLabel(pid), run ? F.pct(di.done / di.total) : t('os.final'), run ? t('os.daySub', { d: F.date(D.DATA_AS_OF) }) : t('pst.saglasnost')) +
      ui.kpi(t('os.netT1'), F.mio(aT) + '<span class="u">RSD</span>', t('os.netT1s', { t: F.mio(tT), p: F.pct(run ? pT : aT / tT) }), { hl: true }) +
      ui.kpi(t('os.onTrack'), nOn + ' / ' + nL, t('os.onTrackS')) +
      ui.kpi(t('os.cost'), F.mio(cost) + '<span class="u">RSD</span>', t('os.costS', { p: D.periodLabel(pid) })) +
      (lastLoad ? ui.kpi(t('os.lastLoad'), F.dt(lastLoad.at).slice(-5), t('os.lastLoadS', { n: F.num(lastLoad.acc), d: F.date(lastLoad.at) }), { go: 'ucitavanje' }) : '') + '</div>';
    var byDay = {};
    D.employees.filter(function (e) { return e.pos === 'licni'; }).forEach(function (e) { EN.effItems(e.id, pid).forEach(function (i) { if (i.ptype === 'kredit' && i.type !== 'storno') byDay[i.date] = (byDay[i.date] || 0) + i.amount; }); });
    var days = Object.keys(byDay).sort().slice(-15);
    var chart = ui.chartBars({ labels: days.map(function (d) { return d.slice(8, 10) + '.' + d.slice(5, 7) + '.'; }), series: [{ name: t('h.loans'), values: days.map(function (d) { return byDay[d]; }), color: 'var(--c1)' }], h: 190, legend: false });
    var grid = IH.grid({
      id: 'os-b', exportName: 'Ostvarenje_po_ekspozituri_' + pid + '.xlsx', searchLabel: IH.L(L('Ekspozitura', 'Branch')),
      rows: function () { return rows; }, key: function (r) { return r.b.id; }, label: function (r) { return D.branchName(r.b); }, searchKeys: ['b'],
      cols: [
        { key: 'b', label: t('c.branch'), val: function (r) { return D.branchShort(r.b); }, render: function (r) { return '<b>' + IH.esc(D.branchShort(r.b)) + '</b>'; } },
        { key: 'rg', label: t('c.region'), val: function (r) { return IH.L(D.region(r.b.region).name); }, fval: function (r) { return r.b.region; }, filter: function () { return D.regions.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } }
      ].concat(D.TKEYS.map(function (k) { return { key: k, label: tName(k), search: false, val: function (r) { return r[k]; }, render: function (r) { return '<div style="min-width:100px">' + ui.pcell(r[k]) + '</div>'; } }; })).concat([
        { key: 'pT1', label: t('os.colProj'), num: true, search: false, val: function (r) { return r.pT1; }, render: function (r) { return run ? '<b style="color:' + (r.pT1 >= 1 ? 'var(--success)' : r.pT1 >= 0.8 ? 'var(--warning)' : 'var(--danger)') + '">' + F.pct(r.pT1) + '</b>' : '<span class="mut">' + t('os.final') + '</span>'; } },
        { key: 'on', label: t('os.colOn'), num: true, search: false, val: function (r) { return r.on; }, render: function (r) { return r.on + ' / ' + r.n; } },
        { key: 'bon', label: t('os.colBonus'), num: true, search: false, val: function (r) { return r.bonus; }, render: function (r) { return F.num(r.bonus); } }
      ]),
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (r) { return 'ostvarenje/' + r.b.id; } }]
    });
    return ui.header(t('os.title'), '', ui.segf('os', 'per', [{ v: '2026-Q4', l: perLabel('2026-Q4') }, { v: '2026-Q3', l: D.periodLabel('2026-Q3') }])) + kp +
      ui.card(t('os.daily'), chart) + IH.sech(t('os.byBranch') + ' — ' + D.periodLabel(pid)) + grid;
  }

  /* ================= EKSPOZITURA ================= */
  function branchPage(bid) {
    var b = D.branch(bid); if (!b) return netPage();
    var v = IH.v('os'), pid = v.per === '2026-Q3' ? '2026-Q3' : '2026-Q4', run = pid === '2026-Q4', mpid = run ? '2026-10' : '2026-09';
    var st = branchStats(bid, pid), mg = D.branchManager(bid), m2 = EN.m2(mg.id, pid, { project: run }), m3 = EN.m3(bid, mpid, { project: run });
    var kp = '<div class="kpis">' +
      ui.kpi(tName('T1'), F.pct(st.T1), run ? t('os.proj', { p: F.pct(st.pT1) }) : t('os.final'), { hl: true }) +
      ui.kpi(t('os.onTrack'), st.on + ' / ' + st.n, t('os.onTrackS')) +
      ui.kpi(IH.L(L('Tim univerzalnih', 'Universal team')), F.pct(m3.payoutPct), D.periodLabel(mpid) + ' · ' + IH.L(L('timski faktor', 'team factor')) + ' ×' + F.num(m3.teamFactor, 1)) +
      ui.kpi(t('os.cost'), F.num(st.bonus + m3.total) + '<span class="u">RSD</span>', D.periodLabel(pid) + ' + ' + D.periodLabel(mpid)) + '</div>';
    var lic = D.branchStaff(bid, 'licni').map(function (e) { var r = EN.m1(e.id, pid), pr = run ? EN.m1(e.id, pid, { project: true }) : r; return { e: e, r: r, pr: pr }; });
    var g = IH.grid({
      id: 'os-e', exportName: 'Ostvarenje_' + b.code + '_' + pid + '.xlsx', searchLabel: IH.L(L('Ime', 'Name')),
      rows: function () { return lic; }, key: function (x) { return x.e.id; }, label: function (x) { return x.e.name; }, searchKeys: ['e'],
      cols: [{ key: 'e', label: t('c.employee'), val: function (x) { return x.e.name; }, render: function (x) { return '<b>' + IH.esc(x.e.name) + '</b>'; } }, { key: 's', label: t('c.scheme'), val: function (x) { var sc = D.scheme(x.r.scheme); return sc ? sc.code : ''; } }]
        .concat(D.TKEYS.map(function (k, i) { return { key: k, label: tName(k), search: false, val: function (x) { return x.r.targets[i] ? x.r.targets[i].pct : 0; }, render: function (x) { return '<div style="min-width:110px">' + ui.pcell(x.r.targets[i] ? x.r.targets[i].pct : 0) + '</div>'; } }; }))
        .concat([{ key: 'b', label: run ? t('os.colBonus') : IH.L(L('Bonus', 'Bonus')), num: true, search: false, val: function (x) { return x.pr.payout; }, render: function (x) { return F.num(x.pr.payout) + (x.pr.capped ? ' ' + ui.pill(t('sc.kCap'), 'warning') : ''); } }]),
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (x) { return 'ostvarenje/' + bid + '/' + x.e.id; } }]
    });
    var mem = m3.members.map(function (m) { var e = D.emp(m.emp); return { _go: 'ostvarenje/' + bid + '/' + e.id, n: '<b>' + IH.esc(e.name) + '</b>' + (e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''), i: m.items, b: F.num(m.baseEff), s: F.pct(m.share), p: F.num(m.payout) }; });
    if (run) D.branchStaff(bid, 'univerzalni').filter(function (e) { return e.since > D.DATA_AS_OF && e.since <= D.period(mpid).to; }).forEach(function (e) {
      var dt = D.daysInfo(mpid), pres = (Date.parse(D.period(mpid).to) - Date.parse(e.since)) / 864e5 + 1;
      mem.push({ n: '<b>' + IH.esc(e.name) + '</b> ' + ui.pill(t('c.new'), 'accent') + ' <span class="mut">' + IH.L(L('od ', 'from ')) + F.date(e.since) + '</span>', i: '—', b: F.num(Math.round(m3.base * pres / dt.total)), p: '<span class="mut">' + IH.L(L('od sledećeg uvoza', 'from next import')) + '</span>' });
    });
    mem.forEach(function (r) { if (r.s == null) r.s = '<span class="mut">—</span>'; });
    var kpis = m3.kpis.map(function (k) { return { k: '<b>' + IH.esc(IH.L(k.name)) + '</b>', a: F.unit(Math.round(k.ach), k.unit) + ' / ' + F.unit(k.target, k.unit), p: ui.pcell(k.pct, { max: 1.6 }), w: F.pct(k.weight) }; });
    var team = '<div class="grid g2">' + ui.card(t('os.team', { p: D.periodLabel(mpid) }) + ' · ' + t('os.teamSub', { f: '×' + F.num(m3.teamFactor, 1), n: m3.members.length }), ui.table([{ key: 'k', label: t('c.target') }, { key: 'a', label: t('c.ach'), num: true }, { key: 'p', label: t('c.pct'), w: '160px' }, { key: 'w', label: t('sc.pay'), num: true }], kpis, { compact: true }), { flush: true }) +
      ui.card(t('os.members'), ui.table([{ key: 'n', label: t('c.employee') }, { key: 'i', label: t('os.items'), num: true }, { key: 'b', label: IH.L(L('Osnova', 'Base')), num: true }, { key: 's', label: IH.L(L('Udeo', 'Share')), num: true }, { key: 'p', label: run ? t('os.colBonus') : 'Bonus', num: true }], mem, { compact: true, foot: { n: t('c.total'), p: F.num(m3.total) } }), { flush: true }) + '</div>';
    var mgr = ui.card(t('os.mgr') + ' — ' + IH.esc(mg.name) + ' · ' + D.periodLabel(pid), '<dl class="kv" style="grid-template-columns:max-content 1fr max-content 1fr max-content 1fr max-content 1fr">' + m2.targets.map(function (x) { return '<dt>' + IH.esc(IH.L(x.name)) + '</dt><dd>' + F.pct(x.pct) + '</dd>'; }).join('') + '<dt>' + t('sc.teamF') + '</dt><dd>×' + F.num(m2.teamFactor, 1) + ' (' + F.pct(m2.share) + ')</dd><dt>' + (run ? t('os.colBonus') : 'Bonus') + '</dt><dd><b>' + F.rsd(m2.payout) + '</b></dd></dl>', { actions: ui.btn(IH.L(L('Obračunski list', 'Statement')), { cls: 'sm', icon: 'calc', go: 'obracun/' + pid + '/' + mg.id }) });
    var crumb = '<a href="#/ostvarenje">' + t('os.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(D.branchShort(b));
    return ui.header(IH.esc(D.branchName(b)), '', ui.segf('os', 'per', [{ v: '2026-Q4', l: perLabel('2026-Q4') }, { v: '2026-Q3', l: D.periodLabel('2026-Q3') }]), crumb) + kp +
      IH.sech(t('os.lic') + ' — ' + D.periodLabel(pid)) + g + team + mgr;
  }

  IH.branchStats = branchStats;
  IH.empTargetsCard = targetsCard;
  IH.empItemsGrid = itemsGrid;
  IH.empPeriods = periodsOf;

  IH.route('ostvarenje', {
    title: function () { return t('os.title'); },
    render: function (p) {
      IH.refreshers.os = function () { IH.render(); };
      if (p[1] && D.emp(p[1])) { var e = D.emp(p[1]); return empPage(p[1], 'ose-' + p[1], '<a href="#/ostvarenje">' + t('os.title') + '</a> ' + ic('chevr') + ' <a href="#/ostvarenje/' + e.branch + '">' + IH.esc(D.branchShort(e.branch)) + '</a> ' + ic('chevr') + ' ' + IH.esc(e.name)); }
      if (p[0]) return branchPage(p[0]);
      return netPage();
    }
  });
  IH.route('moje-ostvarenje', { title: function () { return t('os.my'); }, render: function () { return empPage(IH.me().id, 'my'); } });
})();
