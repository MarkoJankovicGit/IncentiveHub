/* Incentive Hub — Organizacija: struktura (stablo + pretraga), svi zaposleni, promene iz noćnog uvoza */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'og.title': 'Organizacija', 'og.tTree': 'Struktura', 'og.tAll': 'Svi zaposleni', 'og.tChg': 'Promene iz uvoza', 'og.import': 'Uvoz iz fajla', 'og.search': 'Pretraga strukture', 'og.noHit': 'Nema rezultata za „{q}“',
    'og.bank': 'Banka', 'og.region': 'Region', 'og.branch': 'Ekspozitura', 'og.staff': 'Zaposlenih', 'og.head': 'Rukovodilac', 'og.addr': 'Adresa', 'og.city': 'Grad', 'og.code': 'Šifra', 'og.factor': 'Faktor veličine', 'og.since': 'U organizaciji od', 'og.mgr': 'Menadžer', 'og.scheme': 'Bonus šema',
    'og.members': 'Zaposleni', 'og.branches': 'Ekspoziture', 'og.regions': 'Regioni', 'og.memb': 'Istorija pripadnosti', 'og.open': 'Otvori ostvarenje', 'og.basic': 'Osnovni podaci', 'og.name': 'Ime i prezime', 'og.hr': 'HR broj', 'og.pos': 'Pozicija', 'og.phone': 'Telefon', 'og.email': 'E-mail', 'og.unit': 'Organizaciona jedinica', 'og.hq': 'Centrala',
    'og.edit': 'Izmena podataka — {n}', 'og.saved': 'Podaci za {n} su sačuvani', 'og.schemeFrom': '{s} od {d}', 'og.allSearch': 'Ime, HR broj, telefon',
    'oc.novi': 'Novi zaposleni', 'oc.premestaj': 'Premeštaj', 'oc.odlazak': 'Odlazak', 'oc.pozicija': 'Promena pozicije',
    'oc.colType': 'Promena', 'oc.colEmp': 'Zaposleni', 'oc.colPos': 'Pozicija', 'oc.colFrom': 'Iz', 'oc.colTo': 'U', 'oc.colEff': 'Važi od', 'oc.colImpact': 'Uticaj na obračun', 'oc.open': 'Otvoreno', 'oc.done': 'Rešeno', 'oc.resolve': 'Reši',
    'oc.iNovi': 'Nema raspoređenu šemu — bez šeme se bonus ne obračunava', 'oc.iPrem': 'Raspored ostaje; target {p} se deli po danima ({a} dana u {b1}, {c} dana u {b2}); prodaje se pripisuju po ekspozituri na dan prodaje', 'oc.iOdl': 'Raspored se zatvara {d} — obračun {p} do poslednjeg radnog dana', 'oc.iPoz': 'Nova pozicija traži novu šemu od {d} — postojeći raspored se zatvara',
    'oc.applyT': 'Primena promene — {n}', 'oc.apply': 'Primeni', 'oc.applied': 'Promena za {n} je primenjena', 'oc.goAssign': 'Rasporedi šemu',
    'oi.title': 'Uvoz organizacije iz fajla', 'oi.file': 'Fajl', 'oi.choose': 'Izaberi fajl', 'oi.rows': '{n} promene pronađene', 'oi.go': 'Uvezi promene', 'oi.done': 'Uvezeno {n} promena — čekaju rešavanje',
    'mh.colEmp': 'Zaposleni', 'mh.colUnit': 'Organizaciona jedinica', 'mh.colPos': 'Pozicija', 'mh.colFrom': 'Od', 'mh.colTo': 'Do', 'mh.colSrc': 'Izvor', 'mh.hr': 'HR uvoz', 'mh.plan': 'planirano', 'mh.open': 'bez kraja'
  }, {
    'og.title': 'Organisation', 'og.tTree': 'Structure', 'og.tAll': 'All employees', 'og.tChg': 'Import changes', 'og.import': 'Import from file', 'og.search': 'Search the structure', 'og.noHit': 'No results for "{q}"',
    'og.bank': 'Bank', 'og.region': 'Region', 'og.branch': 'Branch', 'og.staff': 'Staff', 'og.head': 'Head', 'og.addr': 'Address', 'og.city': 'City', 'og.code': 'Code', 'og.factor': 'Size factor', 'og.since': 'In organisation since', 'og.mgr': 'Manager', 'og.scheme': 'Bonus scheme',
    'og.members': 'Employees', 'og.branches': 'Branches', 'og.regions': 'Regions', 'og.memb': 'Membership history', 'og.open': 'Open achievement', 'og.basic': 'Basic data', 'og.name': 'Full name', 'og.hr': 'HR number', 'og.pos': 'Position', 'og.phone': 'Phone', 'og.email': 'Email', 'og.unit': 'Organisation unit', 'og.hq': 'Head office',
    'og.edit': 'Edit data — {n}', 'og.saved': 'Data for {n} saved', 'og.schemeFrom': '{s} from {d}', 'og.allSearch': 'Name, HR number, phone',
    'oc.novi': 'New employee', 'oc.premestaj': 'Transfer', 'oc.odlazak': 'Leaving', 'oc.pozicija': 'Position change',
    'oc.colType': 'Change', 'oc.colEmp': 'Employee', 'oc.colPos': 'Position', 'oc.colFrom': 'From', 'oc.colTo': 'To', 'oc.colEff': 'Effective', 'oc.colImpact': 'Impact on calculation', 'oc.open': 'Open', 'oc.done': 'Resolved', 'oc.resolve': 'Resolve',
    'oc.iNovi': 'No scheme assigned — no bonus is calculated without a scheme', 'oc.iPrem': 'Assignment stays; the {p} target is split by days ({a} days in {b1}, {c} days in {b2}); sales follow the branch on the sale date', 'oc.iOdl': 'Assignment closes {d} — {p} calculated to the last working day', 'oc.iPoz': 'The new position needs a new scheme from {d} — the current assignment closes',
    'oc.applyT': 'Apply change — {n}', 'oc.apply': 'Apply', 'oc.applied': 'Change for {n} applied', 'oc.goAssign': 'Assign scheme',
    'oi.title': 'Organisation import from file', 'oi.file': 'File', 'oi.choose': 'Choose file', 'oi.rows': '{n} changes found', 'oi.go': 'Import changes', 'oi.done': '{n} changes imported — awaiting resolution',
    'mh.colEmp': 'Employee', 'mh.colUnit': 'Organisation unit', 'mh.colPos': 'Position', 'mh.colFrom': 'From', 'mh.colTo': 'To', 'mh.colSrc': 'Source', 'mh.hr': 'HR import', 'mh.plan': 'planned', 'mh.open': 'open-ended'
  });

  /* promene iz uvoza vezane za stvarne zaposlene */
  (function bind() {
    var map = { OC2: D.branchStaff('B07', 'licni')[0], OC3: D.branchStaff('B04', 'licni')[1] };
    D.orgChanges.forEach(function (c) { if (map[c.id]) { c.emp = map[c.id].id; c.name = map[c.id].name; } if (c.id === 'OC1') c.emp = 'E3001'; });
    D.orgChanges.forEach(function (c) { if (c.type === 'odlazak' && !c.open && c.emp) D.assignments.forEach(function (a) { if (a.emp === c.emp && a.status === 'aktivan') a.to = c.eff; }); });
  })();
  function changes() { return D.orgChanges.concat(IH.list('orgImports')); }
  function isOpen(c) { return c.open && !IH.map('orgDone')[c.id]; }
  IH.orgOpenChanges = function () { return changes().filter(isOpen); };
  function impact(c) {
    if (c.type === 'novi') return t('oc.iNovi');
    if (c.type === 'premestaj') return t('oc.iPrem', { p: 'Q4 2026', a: 31, b1: D.branchShort(c.branch), c: 61, b2: D.branchShort(c.to) });
    if (c.type === 'odlazak') return t('oc.iOdl', { d: F.date(c.eff), p: 'Q4 2026' });
    return t('oc.iPoz', { d: F.date(c.eff) });
  }
  function curAsg(id) { return (IH.assignments ? IH.assignments() : D.assignments).filter(function (a) { return a.emp === id && a.status === 'aktivan'; })[0]; }
  function edits(e) { return IH.map('empEdits')[e.id] || {}; }
  function phoneOf(e) { return edits(e).phone || e.phone || ''; }
  function emailOf(e) { return edits(e).email || D.email(e); }
  function unitOf(e) { return e.branch ? D.branchShort(e.branch) : e.region ? IH.L(D.region(e.region).name) : t('og.hq'); }
  function schemeTxt(e) { var a = curAsg(e.id); return a ? t('og.schemeFrom', { s: IH.L(D.scheme(a.scheme).name), d: F.date(a.from) }) : ''; }

  /* ---------- osnovni podaci zaposlenog (ista forma za pregled i izmenu) ---------- */
  function basicFields(e, edit) {
    var m = D.emp(e.mgr), st = function (f) { f.type = 'static'; return f; };
    return [
      st({ k: 'og_name', label: t('og.name'), value: e.name }), st({ k: 'og_hr', label: t('og.hr'), value: e.hr }),
      st({ k: 'og_pos', label: t('og.pos'), value: D.posName(e.pos) }), st({ k: 'og_unit', label: t('og.unit'), value: unitOf(e) }),
      st({ k: 'og_reg', label: t('og.region'), value: e.branch ? IH.L(D.region(D.branch(e.branch).region).name) : e.region ? IH.L(D.region(e.region).name) : '' }), st({ k: 'og_mgr', label: t('og.mgr'), value: m ? m.name : '' }),
      edit ? { k: 'og_phone', label: t('og.phone'), value: phoneOf(e) } : st({ k: 'og_phone', label: t('og.phone'), value: phoneOf(e) }),
      edit ? { k: 'og_email', label: t('og.email'), value: emailOf(e) } : st({ k: 'og_email', label: t('og.email'), value: emailOf(e) }),
      st({ k: 'og_since', label: t('og.since'), value: F.date(e.since) }), st({ k: 'og_sch', label: t('og.scheme'), value: schemeTxt(e) })
    ];
  }
  function membOf(e) {
    var out = (e.history || [{ from: e.since, branch: e.branch, pos: e.pos }]).map(function (h) { return { emp: e, unit: h.branch, pos: h.pos || e.pos, from: h.from, to: h.to || null, src: 'hr' }; });
    changes().forEach(function (c) {
      if (c.emp !== e.id || !(isOpen(c) || IH.map('orgDone')[c.id] || !c.open)) return;
      var last = out[out.length - 1];
      if (c.type === 'premestaj') { last.to = new Date(Date.parse(c.eff) - 864e5).toISOString().slice(0, 10); out.push({ emp: e, unit: c.to, pos: e.pos, from: c.eff, to: null, src: 'hr', plan: c.eff > D.TODAY }); }
      if (c.type === 'odlazak') last.to = c.eff;
    });
    return out;
  }
  function membTable(e) {
    return ui.table([{ key: 'u', label: t('mh.colUnit') }, { key: 'p', label: t('mh.colPos') }, { key: 'f', label: t('mh.colFrom') }, { key: 'to', label: t('mh.colTo') }, { key: 's', label: t('mh.colSrc') }],
      membOf(e).map(function (h) { return { u: IH.esc(h.unit ? D.branchShort(h.unit) : unitOf(e)), p: D.posName(h.pos), f: F.date(h.from) + (h.plan ? ' ' + ui.pill(t('mh.plan'), 'accent') : ''), to: h.to ? F.date(h.to) : '<span class="mut">' + t('mh.open') + '</span>', s: t('mh.hr') }; }), { compact: true });
  }
  function empHead(e) { return '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px">' + ui.avatar(e.name, true) + '<div><b style="font-size:15px">' + IH.esc(e.name) + '</b>' + (e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : '') + '<div class="mut">' + D.posName(e.pos) + ' · ' + IH.esc(unitOf(e)) + '</div></div></div>'; }
  IH.act['og-view'] = function (el) {
    var e = D.emp(el.dataset.arg); if (!e) return;
    IH.modal({ title: t('og.basic') + ' — ' + IH.esc(e.name), wide: true, body: empHead(e) + ui.form(basicFields(e), { readonly: true }),
      foot: ui.btn(t('og.memb'), { icon: 'history', act: 'og-hist', arg: e.id }) + ui.btn(t('g.aEdit'), { icon: 'edit', act: 'og-edit', arg: e.id }) + ui.btn(t('c.close'), { act: 'modal-close' }) });
  };
  IH.act['og-hist'] = function (el) {
    var e = D.emp(el.dataset.arg); if (!e) return;
    IH.modal({ title: t('og.memb') + ' — ' + IH.esc(e.name), wide: true, body: membTable(e), foot: ui.btn(t('c.close'), { act: 'modal-close' }) });
  };
  IH.act['og-edit'] = function (el) {
    var e = D.emp(el.dataset.arg); if (!e) return; IH.form = {};
    IH.modal({ title: t('og.edit', { n: IH.esc(e.name) }), wide: true, body: empHead(e) + ui.form(basicFields(e, true)),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'og-save', arg: e.id }) });
  };
  IH.act['og-save'] = function (el) {
    var e = D.emp(el.dataset.arg), g = function (k) { var x = document.getElementById('fld-' + k); return x ? x.value : null; };
    var ph = g('og_phone'), em = g('og_email');
    IH.map('empEdits')[e.id] = { phone: ph || e.phone, email: em || D.email(e) };
    IH.audit('org', e.id, { sr: 'Izmenjeni osnovni podaci zaposlenog', en: 'Employee basic data changed' }, { sr: e.name, en: e.name });
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('og.saved', { n: IH.esc(e.name) }));
  };

  /* ================= STABLO ================= */
  function V() { var v = IH.v('org'); if (!v.open) v.open = { UC: true, R1: true, B01: true }; if (!v.sel) v.sel = 'B01'; return v; }
  function node(id, label, sub, kids, icon, forceOpen) {
    var v = V(), op = forceOpen || !!v.open[id], has = kids && kids.length;
    return '<li><div class="tn' + (v.sel === id ? ' on' : '') + '">' + (has ? '<button class="tt" data-act="org-tg" data-arg="' + id + '">' + ic(op ? 'chevd' : 'chevr') + '</button>' : '<span class="tt"></span>') +
      '<button class="tl" data-act="org-sel" data-arg="' + id + '">' + ic(icon) + '<span><b>' + label + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span></button></div>' + (has && op ? '<ul>' + kids.join('') + '</ul>' : '') + '</li>';
  }
  function tree() {
    var b = D.bank[IH.state.tenant], q = (V().q || '').trim().toLowerCase();
    var hit = function (s) { return !q || String(s || '').toLowerCase().indexOf(q) >= 0; };
    var any = false;
    var regs = D.regions.map(function (r) {
      var brs = D.branches.filter(function (x) { return x.region === r.id; }).map(function (br) {
        var st = D.employees.filter(function (e) { return e.branch === br.id; });
        var emps = st.filter(function (e) { return !q || hit(e.name) || hit(e.hr); });
        if (q && !emps.length && !hit(D.branchShort(br))) return '';
        if (q && !emps.length) emps = st;
        any = true;
        var kids = emps.sort(function (a, c) { return a.pos === 'menadzer' ? -1 : c.pos === 'menadzer' ? 1 : a.pos < c.pos ? -1 : a.pos > c.pos ? 1 : 0; }).map(function (e) { return node(e.id, IH.esc(e.name), D.posName(e.pos) + (e.isNew ? ' · ' + t('c.new') : ''), null, e.pos === 'menadzer' ? 'briefcase' : 'user'); });
        return node(br.id, IH.esc(D.branchShort(br)), br.code + ' · ' + st.length, kids, 'home', !!q);
      }).filter(Boolean);
      if (q && !brs.length) return '';
      return node(r.id, IH.esc(IH.L(r.name)), IH.esc(D.emp(r.head).name), brs, 'share', !!q);
    }).filter(Boolean);
    if (q && !any) return '<div class="empty">' + t('og.noHit', { q: IH.esc(q) }) + '</div>';
    return '<ul class="otree">' + node('UC', IH.esc(b.name), IH.L(L('Sektor poslova sa stanovništvom', 'Retail banking division')), regs, 'org', !!q) + '</ul>';
  }
  IH.act['org-tg'] = function (el) { var v = V(); v.open[el.dataset.arg] = !v.open[el.dataset.arg]; IH.render(); };
  IH.act['org-sel'] = function (el) { var v = V(); v.sel = el.dataset.arg; v.open[el.dataset.arg] = true; IH.render(); };
  IH.refreshers.org = function () { IH.swap('org-tree', tree()); };

  function detail(id) {
    var b = D.bank[IH.state.tenant];
    if (id === 'UC') {
      var rows = D.regions.map(function (r) { var brs = D.branches.filter(function (x) { return x.region === r.id; }); return { _go: 'organizacija/' + r.id, r: '<b>' + IH.esc(IH.L(r.name)) + '</b>', h: IH.esc(D.emp(r.head).name), b: brs.length, n: D.employees.filter(function (e) { return brs.some(function (x) { return x.id === e.branch; }); }).length }; });
      return ui.card(IH.esc(b.name), ui.form([{ k: 'bk_r', label: t('og.regions'), value: String(D.regions.length) }, { k: 'bk_b', label: t('og.branches'), value: String(D.branches.length) }, { k: 'bk_n', label: t('og.staff'), value: String(D.employees.filter(function (e) { return e.branch; }).length) }], { readonly: true, cols: 3 }) + '<div class="lab" style="margin-top:14px">' + t('og.regions') + '</div>' +
        ui.table([{ key: 'r', label: t('og.region') }, { key: 'h', label: t('og.head') }, { key: 'b', label: t('og.branches'), num: true }, { key: 'n', label: t('og.staff'), num: true }], rows, { compact: true }));
    }
    var r = D.regions.filter(function (x) { return x.id === id; })[0];
    if (r) {
      var brs = D.branches.filter(function (x) { return x.region === id; }), head = D.emp(r.head);
      return ui.card(IH.esc(IH.L(r.name)), ui.form([{ k: 'rg_h', label: t('og.head'), value: head.name }, { k: 'rg_ph', label: t('og.phone'), value: phoneOf(head) }, { k: 'rg_em', label: t('og.email'), value: emailOf(head) }, { k: 'rg_n', label: t('og.staff'), value: String(D.employees.filter(function (e) { return brs.some(function (x) { return x.id === e.branch; }); }).length) }], { readonly: true }) +
        '<div class="lab" style="margin-top:14px">' + t('og.branches') + '</div>' + ui.table([{ key: 'b', label: t('og.branch') }, { key: 'c', label: t('og.code') }, { key: 'g', label: t('og.city') }, { key: 'm', label: t('og.mgr') }, { key: 'n', label: t('og.staff'), num: true }], brs.map(function (x) { return { _go: 'organizacija/' + x.id, b: '<b>' + IH.esc(D.branchShort(x)) + '</b>', c: x.code, g: IH.esc(x.city), m: IH.esc(D.branchManager(x.id).name), n: D.employees.filter(function (e) { return e.branch === x.id; }).length }; }), { compact: true }));
    }
    var br = D.branch(id);
    if (br) {
      var st = D.employees.filter(function (e) { return e.branch === br.id; }), mg = D.branchManager(br.id);
      return ui.card(IH.esc(D.branchName(br)),
        ui.form([{ k: 'br_c', label: t('og.code'), value: br.code }, { k: 'br_g', label: t('og.city'), value: br.city }, { k: 'br_a', label: t('og.addr'), value: br.addr, full: true }, { k: 'br_ph', label: t('og.phone'), value: br.phone || '' }, { k: 'br_r', label: t('og.region'), value: IH.L(D.region(br.region).name) }, { k: 'br_m', label: t('og.mgr'), value: mg.name }, { k: 'br_mp', label: t('og.mgr') + ' — ' + t('og.phone').toLowerCase(), value: phoneOf(mg) }, { k: 'br_n', label: t('og.staff'), value: st.length + ' (' + D.posName('licni') + ': ' + st.filter(function (e) { return e.pos === 'licni'; }).length + ', ' + D.posName('univerzalni') + ': ' + st.filter(function (e) { return e.pos === 'univerzalni'; }).length + ')' }], { readonly: true }) +
        '<div class="lab" style="margin-top:14px">' + t('og.members') + '</div>' + ui.table([{ key: 'e', label: t('og.members'), nw: true }, { key: 'p', label: t('mh.colPos'), nw: true }, { key: 'ph', label: t('og.phone'), nw: true }, { key: 's', label: t('og.scheme'), nw: true }], st.map(function (e) { var a = curAsg(e.id); return { _go: 'organizacija/' + e.id, e: '<b>' + IH.esc(e.name) + '</b>' + (e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''), p: D.posName(e.pos), ph: phoneOf(e), s: a ? IH.esc(D.scheme(a.scheme).code) : ui.st2('bez_seme'), f: F.date(e.since) }; }), { compact: true }), { actions: ui.btn(t('og.open'), { cls: 'sm', icon: 'activity', go: 'ostvarenje/' + br.id }) });
    }
    var e = D.emp(id); if (!e) return '';
    return ui.card(t('og.basic'), empHead(e) + ui.form(basicFields(e), { readonly: true }) + '<div class="lab" style="margin-top:14px">' + t('og.memb') + '</div>' + membTable(e),
      { actions: ui.btn(t('g.aEdit'), { cls: 'sm', icon: 'edit', act: 'og-edit', arg: e.id }) + (e.pos !== 'menadzer' && D.positions[e.pos].scheme ? ' ' + ui.btn(t('og.open'), { cls: 'sm', icon: 'activity', go: 'ostvarenje/' + e.branch + '/' + e.id }) : '') });
  }
  function treeTab(sel) {
    var v = V(); if (sel) { v.sel = sel; var e = D.emp(sel); if (e && e.branch) { v.open[e.branch] = true; v.open[D.branch(e.branch).region] = true; } var b = D.branch(sel); if (b) v.open[b.region] = true; }
    return '<div class="grid g-main" style="grid-template-columns:minmax(300px,380px) 1fr"><section class="card"><div class="cb" style="padding-bottom:8px">' + ui.search('org', t('og.search')).replace('class="sbox"', 'class="sbox" style="flex:none;display:flex;width:100%"') + '</div><div class="cb" style="max-height:640px;overflow:auto;padding-top:0" id="org-tree">' + tree() + '</div></section><div>' + detail(v.sel) + '</div></div>';
  }

  /* ================= SVI ZAPOSLENI ================= */
  function allTab() {
    return IH.grid({
      id: 'oga', exportName: 'Zaposleni.xlsx', searchLabel: t('og.allSearch'), hidden: ['em', 'rg', 'sch'],
      rows: function () { return D.employees.slice(); }, key: function (e) { return e.id; }, label: function (e) { return e.name; }, searchKeys: ['e', 'hr', 'ph'],
      cols: [
        { key: 'e', label: t('og.name'), val: function (e) { return e.name; }, render: function (e) { return '<b>' + IH.esc(e.name) + '</b>' + (e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } },
        { key: 'hr', label: t('og.hr'), val: function (e) { return e.hr; } },
        { key: 'p', label: t('og.pos'), val: function (e) { return D.posName(e.pos); }, fval: function (e) { return e.pos; }, filter: function () { return Object.keys(D.positions).map(function (k) { return { v: k, l: D.posName(k) }; }); } },
        { key: 'u', label: t('og.unit'), val: function (e) { return unitOf(e); }, fval: function (e) { return e.branch || e.region || 'HQ'; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }).concat(D.regions.map(function (r) { return { v: r.id, l: IH.L(r.name) }; })).concat([{ v: 'HQ', l: t('og.hq') }]); } },
        { key: 'rg', label: t('og.region'), val: function (e) { var rid = e.branch ? D.branch(e.branch).region : e.region; return rid ? IH.L(D.region(rid).name) : ''; } },
        { key: 'm', label: t('og.mgr'), val: function (e) { var m = D.emp(e.mgr); return m ? m.name : ''; } },
        { key: 'ph', label: t('og.phone'), val: function (e) { return phoneOf(e); } },
        { key: 'em', label: t('og.email'), val: function (e) { return emailOf(e); } },
        { key: 'f', label: t('og.since'), search: false, val: function (e) { return e.since; }, render: function (e) { return F.date(e.since); } },
        { key: 'sch', label: t('og.scheme'), val: function (e) { var a = curAsg(e.id); return a ? D.scheme(a.scheme).code : ''; } }
      ],
      actions: [
        { type: 'details', title: t('og.basic'), act: 'og-view' },
        { type: 'history', title: t('og.memb'), act: 'og-hist' },
        { type: 'edit', title: t('g.aEdit'), act: 'og-edit', kind: 'acc' },
        { icon: 'activity', title: t('og.open'), act: 'g-go', arg: function (e) { return 'ostvarenje/' + e.branch + '/' + e.id; }, show: function (e) { return e.pos === 'licni' || e.pos === 'univerzalni'; } }
      ]
    });
  }

  /* ================= PROMENE ================= */
  function chgTab() {
    return IH.grid({
      id: 'oc', exportName: 'Promene_organizacije.xlsx', searchLabel: IH.L(L('Zaposleni', 'Employee')),
      rows: function () { return changes().slice().sort(function (a, b) { return (isOpen(a) ? 0 : 1) - (isOpen(b) ? 0 : 1) || (a.eff < b.eff ? 1 : -1); }); }, key: function (c) { return c.id; }, label: function (c) { return c.name; }, searchKeys: ['e'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (c) { return isOpen(c) ? 0 : 1; }, fval: function (c) { return isOpen(c) ? 'open' : 'done'; }, render: function (c) { return isOpen(c) ? ui.pill(t('oc.open'), 'warning') : ui.pill(t('oc.done'), 'success'); }, filter: function () { return [{ v: 'open', l: t('oc.open') }, { v: 'done', l: t('oc.done') }]; } },
        { key: 't', label: t('oc.colType'), val: function (c) { return t('oc.' + c.type); }, fval: function (c) { return c.type; }, render: function (c) { return '<b>' + t('oc.' + c.type) + '</b>'; }, filter: function () { return ['novi', 'premestaj', 'odlazak', 'pozicija'].map(function (k) { return { v: k, l: t('oc.' + k) }; }); } },
        { key: 'e', label: t('oc.colEmp'), val: function (c) { return c.name; } },
        { key: 'p', label: t('oc.colPos'), val: function (c) { return D.posName(c.pos) + (c.type === 'pozicija' ? ' → ' + D.posName(c.newPos) : ''); } },
        { key: 'f', label: t('oc.colFrom'), val: function (c) { return c.type === 'novi' ? '' : D.branchShort(c.branch); }, render: function (c) { return c.type === 'novi' ? '<span class="mut">—</span>' : IH.esc(D.branchShort(c.branch)); } },
        { key: 'to', label: t('oc.colTo'), val: function (c) { return c.type === 'odlazak' ? '' : D.branchShort(c.to || c.branch); }, render: function (c) { return c.type === 'odlazak' ? '<span class="mut">—</span>' : IH.esc(D.branchShort(c.to || c.branch)); } },
        { key: 'd', label: t('oc.colEff'), val: function (c) { return c.eff; }, render: function (c) { return F.date(c.eff); } },
        { key: 'i', label: t('oc.colImpact'), search: false, val: function (c) { return impact(c); }, render: function (c) { return '<span class="cell-clip mut" title="' + IH.esc(impact(c)) + '">' + impact(c) + '</span>'; } }
      ],
      actions: [
        { icon: 'check', title: t('oc.resolve'), act: 'oc-resolve', kind: 'acc', show: isOpen },
        { type: 'details', title: t('og.basic'), act: 'og-view', arg: function (c) { return c.emp || ''; }, show: function (c) { return !!c.emp && !!D.emp(c.emp); } }
      ]
    });
  }
  function findC(id) { return changes().filter(function (c) { return c.id === id; })[0]; }
  IH.act['oc-resolve'] = function (el) {
    var c = findC(el.dataset.arg);
    IH.modal({ title: t('oc.applyT', { n: IH.esc(c.name) }), body: ui.form([{ k: 'oc_t', label: t('oc.colType'), value: t('oc.' + c.type) }, { k: 'oc_e', label: t('oc.colEmp'), value: c.name }, { k: 'oc_p', label: t('oc.colPos'), value: D.posName(c.pos) + (c.type === 'pozicija' ? ' → ' + D.posName(c.newPos) : '') }, { k: 'oc_d', label: t('oc.colEff'), value: F.date(c.eff) }, { k: 'oc_f', label: t('oc.colFrom'), value: c.type === 'novi' ? '' : D.branchShort(c.branch) }, { k: 'oc_to', label: t('oc.colTo'), value: c.type === 'odlazak' ? '' : D.branchShort(c.to || c.branch) }], { readonly: true }) + '<div class="note" style="margin-top:12px">' + impact(c) + '</div>',
      foot: (c.type === 'pozicija' || c.type === 'novi' ? ui.btn(t('oc.goAssign'), { icon: 'calendar', go: 'seme/rasporedi' }) : '') + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('oc.apply'), { cls: 'primary', icon: 'check', act: 'oc-apply', arg: c.id }) });
  };
  IH.act['oc-apply'] = function (el) {
    var c = findC(el.dataset.arg); IH.map('orgDone')[c.id] = { at: IH.now(), by: IH.me().id };
    if (c.type === 'odlazak' && c.emp) { var a = curAsg(c.emp); if (a) IH.map('assignEnds')[a.id] = { to: c.eff, reason: 'ODLAZAK' }; }
    IH.audit('org', c.id, { sr: 'Primenjena promena: ' + t('oc.' + c.type), en: 'Change applied: ' + t('oc.' + c.type) }, { sr: c.name + ' · ' + F.date(c.eff), en: c.name + ' · ' + F.date(c.eff) });
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('oc.applied', { n: IH.esc(c.name) }));
  };
  function importRows() {
    var k = D.branchStaff('B07', 'univerzalni')[0], s = D.branchStaff('B05', 'licni')[0];
    return [
      { id: 'OC4', type: 'novi', name: 'Teodora Ilić', pos: 'univerzalni', branch: 'B07', eff: '2026-11-01', open: true, note: L('Nova zaposlena', 'New hire') },
      { id: 'OC5', type: 'pozicija', emp: s.id, name: s.name, pos: 'licni', newPos: 'menadzer', branch: 'B05', eff: '2026-11-01', open: true, note: L('Unapređenje u menadžera (zamena)', 'Promoted to manager (replacement)') },
      { id: 'OC6', type: 'premestaj', emp: k.id, name: k.name, pos: 'univerzalni', branch: 'B07', to: 'B06', eff: '2026-11-15', open: true, note: L('Premeštaj', 'Transfer') }
    ];
  }
  IH.act['oi-open'] = function () {
    IH.form = { oi: {} };
    IH.modal({ title: t('oi.title'), wide: true, body: '<div id="oi-body">' + oiBody() + '</div>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('oi.go'), { cls: 'primary', icon: 'upload', act: 'oi-go' }) });
  };
  function oiBody() {
    var f = IH.form.oi || {};
    var html = '<div class="field"><label class="lab">' + t('oi.file') + '</label>' + (f.file ? '<span class="filechip">' + ic('file') + IH.esc(f.file) + '</span>' : '<div class="drop">' + ic('upload') + '<div>' + t('up.drop') + ' ' + ui.btn(t('oi.choose'), { cls: 'sm', act: 'oi-file' }) + '</div><small class="mut">.csv</small></div>') + '</div>';
    if (f.file) html += '<div class="lab">' + t('oi.rows', { n: importRows().length }) + '</div>' + ui.table([{ key: 't', label: t('oc.colType') }, { key: 'e', label: t('oc.colEmp') }, { key: 'p', label: t('oc.colPos') }, { key: 'b', label: t('og.branch') }, { key: 'd', label: t('oc.colEff') }], importRows().map(function (c) { return { t: '<b>' + t('oc.' + c.type) + '</b>', e: IH.esc(c.name), p: D.posName(c.pos), b: IH.esc(D.branchShort(c.branch)), d: F.date(c.eff) }; }), { compact: true });
    return html;
  }
  IH.act['oi-file'] = function () { IH.form.oi.file = 'HR_ORG_izmene_2026-10-20.csv'; IH.swap('oi-body', oiBody()); };
  IH.act['oi-go'] = function () {
    if (!(IH.form.oi || {}).file) { IH.toast(t('up.noFile')); return; }
    var have = IH.list('orgImports').map(function (c) { return c.id; }), add = importRows().filter(function (c) { return have.indexOf(c.id) < 0; });
    add.forEach(function (c) { IH.list('orgImports').push(c); });
    IH.audit('org', 'IMPORT', { sr: 'Uvoz organizacije iz fajla', en: 'Organisation import from file' }, { sr: add.length + ' promena', en: add.length + ' changes' });
    IH.save(); IH.closeModal(); IH.go('organizacija/promene'); IH.toast(t('oi.done', { n: add.length }));
  };

  IH.route('organizacija', {
    title: function () { return t('og.title'); },
    render: function (p) {
      var tab = ['zaposleni', 'promene'].indexOf(p[0]) >= 0 ? p[0] : '';
      var n = IH.orgOpenChanges().length;
      var tabs = ui.rtabs('organizacija', [{ id: '', label: t('og.tTree'), icon: 'org' }, { id: 'zaposleni', label: t('og.tAll'), icon: 'users', cnt: D.employees.length }, { id: 'promene', label: t('og.tChg'), icon: 'refresh', cnt: n || null, warn: true }], tab);
      var body = tab === 'promene' ? chgTab() : tab === 'zaposleni' ? allTab() : treeTab(tab ? null : p[0]);
      return ui.header(t('og.title'), '', ui.btn(t('og.import'), { icon: 'upload', act: 'oi-open' })) + tabs + body;
    }
  });
})();
