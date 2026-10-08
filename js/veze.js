/* Incentive Hub — pravila između targeta u bonus šemi
   Pravilo = šablon (šifarnik) + parametri; rečenica se generiše iz parametara.
   Šabloni: umanjenje, pojačanje, uslov ekspoziture, najmanje N od M, otključavanje, matrica dva targeta, kap po targetu.
   Isti obrazac kao uslovi priznavanja u targetu: izbor iz liste sa definicijom, rečenica sa poljima za unos. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;
  var V = IH.veze = {};

  IH.addStrings({
    'v.title': 'Pravila između targeta', 'v.none': 'Nema pravila — svaki target se isplaćuje nezavisno', 'v.add': 'Dodaj pravilo', 'v.pickT': 'Dodaj pravilo između targeta', 'v.pickGo': 'Dodaj izabrano',
    'v.all': 'sve targete', 'v.allT': 'svih targeta', 'v.colRule': 'Pravilo', 'v.colText': 'Šta važi', 'v.from': 'od {p}', 'v.rowsA': 'Ostvarenje: {a}', 'v.colsB': 'Ostvarenje: {b}', 'v.and': 'i',
    'v.t.umanjenje': 'Ako je {a} ispod {x}, isplata za {b} se množi sa {f}',
    'v.t.pojacanje': 'Ako je {a} najmanje {x}, isplata za {b} se množi sa {f}',
    'v.t.timski': 'Ako ekspozitura ostvari {a} ispod {x}, isplata za {b} se množi sa {f}',
    'v.t.nodm': 'Ako je manje od {n} od {m} targeta najmanje na {x}, isplata za {b} se množi sa {f}',
    'v.t.otkljucavanje': '{b} se isplaćuje tek kada je {a} najmanje {x}',
    'v.t.matrica': 'Isplata za {b} se množi ponderom iz tabele {a} × {c}',
    'v.t.kap': 'Isplata za {b} je najviše {k} iznosa na 100% ostvarenja',
    'v.r.umanjenjeOn': '{a} {p} — ispod {x}: isplata za {b} × {f}', 'v.r.umanjenjeOff': '{a} {p} — najmanje {x}, nema umanjenja',
    'v.r.pojacanjeOn': '{a} {p} — najmanje {x}: isplata za {b} × {f}', 'v.r.pojacanjeOff': '{a} {p} — ispod {x}, nema pojačanja',
    'v.r.timskiOn': 'Ekspozitura: {a} {p} — ispod {x}: isplata za {b} × {f}', 'v.r.timskiOff': 'Ekspozitura: {a} {p} — najmanje {x}, nema umanjenja',
    'v.r.nodmOn': 'Na {x} ili više: {c} od {m} targeta (potrebno {n}) — isplata za {b} × {f}', 'v.r.nodmOff': 'Na {x} ili više: {c} od {m} targeta (potrebno {n})',
    'v.r.otkljucavanjeOn': '{a} {p} — ispod {x}: {b} se ne isplaćuje', 'v.r.otkljucavanjeOff': '{a} {p} — {b} je otključan',
    'v.r.matrica': '{a} {pa} × {c} {pb} → ponder {f}', 'v.r.kap': '{b}: najviše {k} iznosa na 100%',
    'v.n.umanjenje': 'Umanjenje', 'v.n.pojacanje': 'Pojačanje', 'v.n.timski': 'Uslov ekspoziture', 'v.n.nodm': 'Najmanje N od M targeta', 'v.n.otkljucavanje': 'Otključavanje', 'v.n.matrica': 'Matrica dva targeta', 'v.n.kap': 'Kap po targetu',
    'v.d.umanjenje': 'Ako jedan target ne dostigne prag, isplata za druge izabrane targete se množi faktorom manjim od 1 (npr. 0,5 — pola). Čuva balans između targeta.',
    'v.d.pojacanje': 'Ako jedan target dostigne prag, isplata za druge izabrane targete se množi faktorom većim od 1 (npr. 1,2). Nagrađuje kombinaciju prodaje.',
    'v.d.timski': 'Isplata pojedinca zavisi od ostvarenja ekspozitura na timskom targetu. Ako ekspozitura ne dostigne prag, isplata za izabrane targete se množi faktorom.',
    'v.d.nodm': 'Najmanje N targeta iz šeme mora dostići prag. Ako ih je manje, isplata za izabrane targete se množi faktorom.',
    'v.d.otkljucavanje': 'Target se isplaćuje tek kada drugi target dostigne prag. Do tada je isplata za njega 0, a ostvarenje se i dalje prati.',
    'v.d.matrica': 'Ponder zavisi od kombinacije ostvarenja dva targeta: tabela opsega ostvarenja prvog targeta (redovi) i drugog targeta (kolone).',
    'v.d.kap': 'Isplata za target ne može preći zadati procenat iznosa koji pripada targetu na 100% ostvarenja, bez obzira na skalu i pojačanja.'
  }, {
    'v.title': 'Rules between targets', 'v.none': 'No rules — each target is paid independently', 'v.add': 'Add rule', 'v.pickT': 'Add a rule between targets', 'v.pickGo': 'Add selected',
    'v.all': 'all targets', 'v.allT': 'all targets', 'v.colRule': 'Rule', 'v.colText': 'What applies', 'v.from': 'from {p}', 'v.rowsA': 'Achievement: {a}', 'v.colsB': 'Achievement: {b}', 'v.and': 'and',
    'v.t.umanjenje': 'If {a} is below {x}, the payout for {b} is multiplied by {f}',
    'v.t.pojacanje': 'If {a} is at least {x}, the payout for {b} is multiplied by {f}',
    'v.t.timski': 'If the branch achieves {a} below {x}, the payout for {b} is multiplied by {f}',
    'v.t.nodm': 'If fewer than {n} of {m} targets reach {x}, the payout for {b} is multiplied by {f}',
    'v.t.otkljucavanje': '{b} is paid only once {a} is at least {x}',
    'v.t.matrica': 'The payout for {b} is multiplied by the factor from the {a} × {c} table',
    'v.t.kap': 'The payout for {b} is at most {k} of the amount at 100% achievement',
    'v.r.umanjenjeOn': '{a} {p} — below {x}: payout for {b} × {f}', 'v.r.umanjenjeOff': '{a} {p} — at least {x}, no reduction',
    'v.r.pojacanjeOn': '{a} {p} — at least {x}: payout for {b} × {f}', 'v.r.pojacanjeOff': '{a} {p} — below {x}, no boost',
    'v.r.timskiOn': 'Branch: {a} {p} — below {x}: payout for {b} × {f}', 'v.r.timskiOff': 'Branch: {a} {p} — at least {x}, no reduction',
    'v.r.nodmOn': 'At {x} or more: {c} of {m} targets ({n} required) — payout for {b} × {f}', 'v.r.nodmOff': 'At {x} or more: {c} of {m} targets ({n} required)',
    'v.r.otkljucavanjeOn': '{a} {p} — below {x}: {b} is not paid', 'v.r.otkljucavanjeOff': '{a} {p} — {b} is unlocked',
    'v.r.matrica': '{a} {pa} × {c} {pb} → factor {f}', 'v.r.kap': '{b}: at most {k} of the amount at 100%',
    'v.n.umanjenje': 'Reduction', 'v.n.pojacanje': 'Boost', 'v.n.timski': 'Branch condition', 'v.n.nodm': 'At least N of M targets', 'v.n.otkljucavanje': 'Unlock', 'v.n.matrica': 'Two-target matrix', 'v.n.kap': 'Cap per target',
    'v.d.umanjenje': 'If one target misses the threshold, the payout for the other selected targets is multiplied by a factor below 1 (e.g. 0.5 — half). Keeps the targets in balance.',
    'v.d.pojacanje': 'If one target reaches the threshold, the payout for the other selected targets is multiplied by a factor above 1 (e.g. 1.2). Rewards the sales combination.',
    'v.d.timski': 'The individual payout depends on the branch achievement of a team target. If the branch misses the threshold, the payout for the selected targets is multiplied by the factor.',
    'v.d.nodm': 'At least N targets of the scheme must reach the threshold. If fewer do, the payout for the selected targets is multiplied by the factor.',
    'v.d.otkljucavanje': 'A target is paid only once another target reaches the threshold. Until then its payout is 0, while achievement is still tracked.',
    'v.d.matrica': 'The factor depends on the combination of two targets: a table of achievement ranges of the first target (rows) and the second target (columns).',
    'v.d.kap': 'The payout for a target cannot exceed the given percentage of the amount the target carries at 100% achievement, regardless of the scale and boosts.'
  });

  V.TPLS = ['umanjenje', 'pojacanje', 'timski', 'nodm', 'otkljucavanje', 'matrica', 'kap'];
  V.rules = function (s) { return EN.rulesOf(s); };
  function tcOf(s, key) { return s.targets.filter(function (x) { return x.key === key; })[0]; }
  function nameOf(s, key) { var tc = tcOf(s, key), tg = tc && EN.targetOf(tc, s); return tg ? IH.L(tg.name) : key; }
  V.nameOf = nameOf;
  function list(s, keys) { var all = s.targets.map(function (x) { return x.key; }); if (!keys || !keys.length || keys.length === all.length && all.every(function (k) { return keys.indexOf(k) >= 0; })) return t('v.all'); return keys.map(function (k) { return nameOf(s, k); }).join(', '); }
  /* rečenica pravila (html: parametri podebljani) */
  V.text = function (s, r, plain) {
    var b = function (x) { return plain ? x : '<b>' + IH.esc(x) + '</b>'; }, n = function (x) { return plain ? x : '<b>' + x + '</b>'; };
    var tpl = r.tpl || (r.src === 'eksp' ? 'timski' : 'umanjenje'), p = {};
    if (tpl === 'timski') { var tg = D.target(r.target); p = { a: b(tg ? IH.L(tg.name) : r.target), x: n(F.pct(r.min)), b: b(list(s, r.affects)), f: n(F.num(r.factor, 2)) }; }
    else if (tpl === 'nodm') p = { n: n(r.n), m: n((r.keys || []).length || s.targets.length), x: n(F.pct(r.min)), b: b(list(s, r.affects)), f: n(F.num(r.factor, 2)) };
    else if (tpl === 'matrica') p = { a: b(nameOf(s, r.a)), c: b(nameOf(s, r.b)), b: b(list(s, r.affects)) };
    else if (tpl === 'kap') p = { b: b(list(s, r.affects)), k: n(F.pct(r.k)) };
    else p = { a: b(nameOf(s, r.cond)), x: n(F.pct(r.min)), b: b(list(s, r.affects)), f: n(F.num(r.factor, 2)) };
    return t('v.t.' + tpl, p) + (r.from ? ' (' + t('v.from', { p: F.date(r.from) }) + ')' : '');
  };
  /* rezultat pravila u obračunskom listu */
  V.resText = function (s, x) {
    var r = x.r || x.d, tpl = r.tpl || (r.src === 'eksp' ? 'timski' : 'umanjenje'), on = x.active;
    var p = { x: F.pct(r.min), b: IH.esc(list(s, r.affects)), f: F.num(r.factor, 2) };
    if (tpl === 'timski') { p.a = IH.esc(IH.L(x.name || '')); p.p = '<b>' + F.pct(x.pct) + '</b>'; }
    else if (tpl === 'nodm') { p.c = '<b>' + x.cnt + '</b>'; p.m = x.of; p.n = r.n; }
    else if (tpl === 'matrica') return '<span class="' + (x.f < 1 ? 'sum-bad' : x.f > 1 ? 'sum-ok' : 'mut') + '">' + t('v.r.matrica', { a: IH.esc(nameOf(s, r.a)), pa: '<b>' + F.pct(x.pa) + '</b>', c: IH.esc(nameOf(s, r.b)), pb: '<b>' + F.pct(x.pb) + '</b>', f: '<b>×' + F.num(x.f, 2) + '</b>' }) + '</span>';
    else if (tpl === 'kap') return '<span class="mut">' + t('v.r.kap', { b: IH.esc(list(s, r.affects)), k: F.pct(r.k) }) + '</span>';
    else { p.a = IH.esc(nameOf(s, r.cond)); p.p = '<b>' + F.pct(x.pct) + '</b>'; }
    var good = tpl === 'pojacanje' ? on : !on;
    return '<span class="' + (good ? 'sum-ok' : 'sum-bad') + '">' + t('v.r.' + tpl + (on ? 'On' : 'Off'), p) + '</span>';
  };
  /* tabela matrice (pregled ili izmena) */
  function rangeLabels(bounds) { var out = [], lo = 0; bounds.forEach(function (b) { out.push((lo ? F.pct(lo) + ' – ' : '< ') + F.pct(b)); lo = b; }); out.push('≥ ' + F.pct(lo)); out[0] = '< ' + F.pct(bounds[0]); return out; }
  V.matrix = function (s, r, edit, idx, hit) {
    var ra = rangeLabels(r.ra), rb = rangeLabels(r.rb);
    var head = '<tr><th>' + IH.esc(nameOf(s, r.a)) + ' \\ ' + IH.esc(nameOf(s, r.b)) + '</th>' + rb.map(function (l, j) { return '<th class="num">' + (edit && j < r.rb.length ? '&lt; <input class="in cell" style="width:58px" data-vr="' + idx + '" data-vf="rb.' + j + '" value="' + F.num(r.rb[j] * 100) + '">%' : l) + '</th>'; }).join('') + '</tr>';
    var rows = ra.map(function (l, i) {
      return '<tr><td class="nw">' + (edit && i < r.ra.length ? '&lt; <input class="in cell" style="width:58px" data-vr="' + idx + '" data-vf="ra.' + i + '" value="' + F.num(r.ra[i] * 100) + '">%' : l) + '</td>' + r.cells[i].map(function (f, j) {
        var on = hit && hit[0] === i && hit[1] === j;
        return '<td class="num' + (on ? ' mx-on' : '') + '">' + (edit ? '× <input class="in cell" style="width:58px" data-vr="' + idx + '" data-vf="cells.' + i + '.' + j + '" value="' + F.num(f, 2) + '">' : (on ? '<b>×' + F.num(f, 2) + '</b>' : '×' + F.num(f, 2))) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="tbl-wrap" style="margin-top:8px"><table class="t compact mx"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></div>';
  };
  /* pregled pravila šeme (forma šeme, samo za čitanje) */
  V.view = function (s) {
    var rs = V.rules(s);
    if (!rs.length) return '<div class="mut">' + t('v.none') + '</div>';
    return rs.map(function (r) { return '<div class="condrow" style="display:block"><span class="pill p-accent" style="margin-right:8px">' + t('v.n.' + (r.tpl || 'umanjenje')) + '</span>' + V.text(s, r) + (r.tpl === 'matrica' ? V.matrix(s, r, false) : '') + '</div>'; }).join('');
  };
  /* uloga targeta u pravilima šeme (za dodelu i prikaz targeta) */
  V.linksOf = function (tid) {
    var out = [];
    (IH.schemes ? IH.schemes() : D.schemes).filter(function (s) { return s.status !== 'arhiviran'; }).forEach(function (s0) {
      D.schemeVersions(s0).forEach(function (v) {
        var s = Object.assign({}, s0, { targets: v.targets || s0.targets, rules: v.rules !== undefined ? v.rules : s0.rules, conds: v.conds !== undefined ? v.conds : s0.conds });
        var tc = s.targets.filter(function (q) { return q.id === tid; })[0], key = tc && tc.key;
        V.rules(s).forEach(function (r) {
          var keys = [r.cond, r.a, r.b].concat(r.affects || []).concat(r.keys || []);
          if ((key && keys.indexOf(key) >= 0) || (r.tpl === 'timski' || r.src === 'eksp') && r.target === tid) {
            if (!out.some(function (o) { return o.s.id === s.id && JSON.stringify(o.r) === JSON.stringify(r); })) out.push({ s: s, r: r, d: r, v: v });
          }
        });
      });
    });
    return out;
  };

  /* ---------- izmena (čarobnjak šeme) ---------- */
  V.make = function (tpl, s, branchTargets) {
    var keys = s.targets.map(function (x) { return x.key; }), k0 = keys[0], k1 = keys[1] || keys[0];
    if (tpl === 'umanjenje') return { tpl: tpl, cond: k0, min: 0.85, affects: keys.slice(1), factor: 0.5 };
    if (tpl === 'pojacanje') return { tpl: tpl, cond: k0, min: 1.1, affects: [k1], factor: 1.2 };
    if (tpl === 'timski') return { tpl: tpl, src: 'eksp', target: branchTargets[0] ? branchTargets[0].id : null, min: 0.8, affects: keys.slice(), factor: 0.8 };
    if (tpl === 'nodm') return { tpl: tpl, n: Math.min(2, keys.length), keys: keys.slice(), min: 0.9, affects: keys.slice(), factor: 0.8 };
    if (tpl === 'otkljucavanje') return { tpl: tpl, cond: k0, min: 0.8, affects: [k1] };
    if (tpl === 'matrica') return { tpl: tpl, a: k0, b: k1, ra: [0.9, 1.1], rb: [0.9, 1.1], cells: [[0.8, 0.9, 1.0], [0.9, 1.0, 1.1], [1.0, 1.1, 1.2]], affects: [] };
    return { tpl: 'kap', affects: [keys[keys.length - 1]], k: 1.0 };
  };
  function selKey(i, f, cur, keys) { return '<select class="in" style="width:auto;min-width:180px;display:inline-block" data-vr="' + i + '" data-vf="' + f + '">' + keys.map(function (k) { return '<option value="' + k.v + '"' + (k.v === cur ? ' selected' : '') + '>' + IH.esc(k.l) + '</option>'; }).join('') + '</select>'; }
  function inp(i, f, val, w) { return '<input class="in cell" style="width:' + (w || 64) + 'px" data-vr="' + i + '" data-vf="' + f + '" value="' + IH.esc(val) + '">'; }
  function chks(i, f, sel, keys) { return '<span class="chks">' + keys.map(function (k) { return '<label class="chk" style="margin:0"><input type="checkbox" data-vr="' + i + '" data-vk="' + f + '|' + k.v + '"' + (sel.indexOf(k.v) >= 0 ? ' checked' : '') + '><span>' + IH.esc(k.l) + '</span></label>'; }).join('') + '</span>'; }
  /* red pravila u izmeni: rečenica sa poljima */
  V.editRow = function (s, r, i, branchTargets) {
    var keys = s.targets.map(function (x) { return { v: x.key, l: nameOf(s, x.key) }; }), h = '';
    var tpl = r.tpl || 'umanjenje', w = function (x) { return '<span>' + x + '</span>'; };
    if (tpl === 'umanjenje' || tpl === 'pojacanje') h = w(IH.L(L('Ako je', 'If'))) + selKey(i, 'cond', r.cond, keys) + w(tpl === 'umanjenje' ? IH.L(L('ispod', 'is below')) : IH.L(L('najmanje', 'is at least'))) + inp(i, 'min', F.num(r.min * 100)) + w('% → ' + IH.L(L('isplata za', 'payout for'))) + chks(i, 'affects', r.affects, keys.filter(function (k) { return k.v !== r.cond; })) + w(IH.L(L('množi se sa', 'is multiplied by'))) + inp(i, 'factor', F.num(r.factor, 2));
    else if (tpl === 'timski') h = w(IH.L(L('Ako ekspozitura ostvari', 'If the branch achieves'))) + '<select class="in" style="width:auto;min-width:200px;display:inline-block" data-vr="' + i + '" data-vf="target">' + branchTargets.map(function (x) { return '<option value="' + x.id + '"' + (x.id === r.target ? ' selected' : '') + '>' + IH.esc(IH.L(x.name)) + '</option>'; }).join('') + '</select>' + w(IH.L(L('ispod', 'below'))) + inp(i, 'min', F.num(r.min * 100)) + w('% → ' + IH.L(L('isplata za', 'payout for'))) + chks(i, 'affects', r.affects, keys) + w(IH.L(L('množi se sa', 'is multiplied by'))) + inp(i, 'factor', F.num(r.factor, 2));
    else if (tpl === 'nodm') h = w(IH.L(L('Ako je manje od', 'If fewer than'))) + inp(i, 'n', String(r.n), 48) + w(IH.L(L('targeta od', 'targets of'))) + chks(i, 'keys', r.keys || [], keys) + w(IH.L(L('najmanje na', 'reach'))) + inp(i, 'min', F.num(r.min * 100)) + w('% → ' + IH.L(L('isplata za', 'payout for'))) + chks(i, 'affects', r.affects, keys) + w(IH.L(L('množi se sa', 'is multiplied by'))) + inp(i, 'factor', F.num(r.factor, 2));
    else if (tpl === 'otkljucavanje') h = selKey(i, 'aff0', (r.affects || [])[0], keys.filter(function (k) { return k.v !== r.cond; })) + w(IH.L(L('se isplaćuje tek kada je', 'is paid only once'))) + selKey(i, 'cond', r.cond, keys) + w(IH.L(L('najmanje', 'is at least'))) + inp(i, 'min', F.num(r.min * 100)) + w('%');
    else if (tpl === 'matrica') h = w(IH.L(L('Ponder iz tabele', 'Factor from the table'))) + selKey(i, 'a', r.a, keys) + w('×') + selKey(i, 'b', r.b, keys.filter(function (k) { return k.v !== r.a; })) + w('→ ' + IH.L(L('isplata za', 'payout for'))) + chks(i, 'affects', r.affects, keys) + '<div style="flex-basis:100%">' + V.matrix(s, r, true, i) + '</div>';
    else h = w(IH.L(L('Isplata za', 'Payout for'))) + chks(i, 'affects', r.affects, keys) + w(IH.L(L('najviše', 'at most'))) + inp(i, 'k', F.num(r.k * 100)) + w('% ' + IH.L(L('iznosa na 100%', 'of the amount at 100%')));
    return '<div class="condrow"><span class="pill p-accent">' + t('v.n.' + tpl) + '</span>' + h + '<span style="flex:1"></span><button class="gab dan" data-act="v-rm" data-arg="' + i + '" title="' + t('c.cancel') + '">' + ic('trash') + '</button></div>';
  };
  V.editor = function (s, branchTargets) {
    var rs = s.rules || [];
    return (rs.length ? rs.map(function (r, i) { return V.editRow(s, r, i, branchTargets); }).join('') : '<div class="mut" style="margin-bottom:8px">' + t('v.none') + '</div>') + ui.btn(t('v.add'), { cls: 'sm', icon: 'plus', act: 'v-pick' });
  };
  /* izbor šablona: kartice sa definicijom */
  V.ctx = null; /* { get: () => šema u izmeni, branchTargets: () => [], changed: () => {} } */
  function pickBody() {
    var sel = IH.form._vpick, s = V.ctx.get(), bt = V.ctx.branchTargets();
    var avail = V.TPLS.filter(function (x) { return (x !== 'timski' || bt.length) && (s.targets.length > 1 || x === 'kap'); });
    return '<div class="opts pick-list">' + avail.map(function (x) {
      return '<button type="button" class="opt' + (sel === x ? ' on' : '') + '" data-act="v-pick-t" data-arg="' + x + '"><span class="ri"></span><span style="flex:1"><b>' + t('v.n.' + x) + '</b><small>' + t('v.d.' + x) + '</small></span></button>';
    }).join('') + '</div>';
  }
  IH.act['v-pick'] = function () { IH.form._vpick = null; IH.modal({ title: t('v.pickT'), wide: true, body: '<div id="v-pick-body">' + pickBody() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('v.pickGo'), { cls: 'primary', icon: 'plus', act: 'v-pick-go' }) }); };
  IH.act['v-pick-t'] = function (el) { IH.form._vpick = el.dataset.arg; IH.swap('v-pick-body', pickBody()); };
  IH.act['v-pick-go'] = function () {
    var tpl = IH.form._vpick; if (!tpl || !V.ctx) return;
    var s = V.ctx.get(); s.rules = (s.rules || EN.rulesOf(s).slice()); s.rules.push(V.make(tpl, s, V.ctx.branchTargets()));
    IH.closeModal(); V.ctx.changed();
  };
  IH.act['v-rm'] = function (el) { var s = V.ctx && V.ctx.get(); if (!s) return; s.rules.splice(+el.dataset.arg, 1); V.ctx.changed(); };
  function pnum(v) { var x = String(v == null ? '' : v).trim(); x = IH.state.lang === 'sr' ? x.replace(/\./g, '').replace(',', '.') : x.replace(/,/g, ''); var n = parseFloat(x.replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; }
  document.addEventListener('change', function (e) {
    var el = e.target; if (!el.dataset || el.dataset.vr == null || !V.ctx) return;
    var s = V.ctx.get(), r = s && s.rules && s.rules[+el.dataset.vr]; if (!r) return;
    if (el.dataset.vk) {
      var p = el.dataset.vk.split('|'), arr = r[p[0]] = r[p[0]] || [];
      if (el.checked) { if (arr.indexOf(p[1]) < 0) arr.push(p[1]); } else r[p[0]] = arr.filter(function (k) { return k !== p[1]; });
    } else {
      var f = el.dataset.vf, v = el.value;
      if (f === 'min' || f === 'k') r[f] = pnum(v) / 100;
      else if (f === 'factor') r[f] = pnum(v);
      else if (f === 'n') r.n = Math.max(1, parseInt(v, 10) || 1);
      else if (f === 'aff0') r.affects = [v];
      else if (/^(ra|rb)\./.test(f)) { var q = f.split('.'); r[q[0]][+q[1]] = pnum(v) / 100; r[q[0]].sort(function (a, b) { return a - b; }); }
      else if (/^cells\./.test(f)) { var c = f.split('.'); r.cells[+c[1]][+c[2]] = parseFloat(String(v).replace(',', '.')) || 0; }
      else { r[f] = v; if (f === 'cond' && r.affects) r.affects = r.affects.filter(function (k) { return k !== v; }); }
    }
    V.ctx.changed();
  });
})();
