/* Incentive Hub — Bodovne liste (Katalog proizvoda → Bodovne liste)
   Bodovna lista kaže koliko bodova nosi proizvod. Target sa jedinicom merenja Bodovi bira jednu listu i ne unosi bodove;
   u obračunu važi verzija liste koja važi u periodu. Izmena liste = nova verzija od izabranog datuma. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'k.tPts': 'Bodovne liste', 'bl.new': 'Nova bodovna lista', 'bl.search': 'Naziv liste', 'bl.colName': 'Bodovna lista', 'bl.colPt': 'Vrsta proizvoda', 'bl.colSeg': 'Grupa klijenata',
    'bl.colN': 'Proizvoda', 'bl.colFrom': 'Važi od', 'bl.colVer': 'Verzija', 'bl.colUsed': 'Koriste je targeti', 'bl.none': 'Nijedan target', 'bl.planned': 'Planirana',
    'bl.s1': 'Osnovno', 'bl.s2': 'Proizvodi i bodovi', 'bl.s3': 'Koriste je targeti', 'bl.fName': 'Naziv', 'bl.fFrom': 'Važi od', 'bl.fVer': 'Verzija', 'bl.fReason': 'Razlog izmene',
    'bl.colPts': 'Bodovi', 'bl.sel': 'Izabrano: {n} · {t}', 'bl.selNone': 'Nije izabran nijedan proizvod', 'bl.activate': 'Aktiviraj listu', 'bl.saveVer': 'Sačuvaj novu verziju', 'bl.editT': 'Izmena bodovne liste',
    'bl.done': 'Bodovna lista „{n}“ je aktivna od {d}', 'bl.verDone': 'Nova verzija v{v} liste „{n}“ važi od {d}', 'bl.bad': 'Lista nije sačuvana: {r}', 'bl.badName': 'upišite naziv', 'bl.badProds': 'izaberite bar jedan proizvod', 'bl.badPts': 'svaki proizvod mora nositi bodove',
    'bl.colTarget': 'Target', 'bl.colCarrier': 'Nosilac', 'bl.colScheme': 'Šema', 'bl.hVer': 'Važi verzija v{v} od {d}', 'bl.hNew': 'Kreirana bodovna lista'
  }, {
    'k.tPts': 'Points lists', 'bl.new': 'New points list', 'bl.search': 'List name', 'bl.colName': 'Points list', 'bl.colPt': 'Product type', 'bl.colSeg': 'Client group',
    'bl.colN': 'Products', 'bl.colFrom': 'Valid from', 'bl.colVer': 'Version', 'bl.colUsed': 'Used by targets', 'bl.none': 'No target', 'bl.planned': 'Planned',
    'bl.s1': 'Basics', 'bl.s2': 'Products and points', 'bl.s3': 'Used by targets', 'bl.fName': 'Name', 'bl.fFrom': 'Valid from', 'bl.fVer': 'Version', 'bl.fReason': 'Reason for change',
    'bl.colPts': 'Points', 'bl.sel': 'Selected: {n} · {t}', 'bl.selNone': 'No product selected', 'bl.activate': 'Activate list', 'bl.saveVer': 'Save new version', 'bl.editT': 'Edit points list',
    'bl.done': 'Points list “{n}” is active from {d}', 'bl.verDone': 'New version v{v} of list “{n}” valid from {d}', 'bl.bad': 'List not saved: {r}', 'bl.badName': 'enter a name', 'bl.badProds': 'choose at least one product', 'bl.badPts': 'every product must carry points',
    'bl.colTarget': 'Target', 'bl.colCarrier': 'Carrier', 'bl.colScheme': 'Scheme', 'bl.hVer': 'Version v{v} in force from {d}', 'bl.hNew': 'Points list created'
  });

  /* „važi od“: početak planiranog meseca iz kalendara (Obračunski periodi) */
  function FROMS() { var l = D.plannedOf('M'); if (!l.length) l = D.allPeriods().filter(function (p) { return p.status === 'planiran'; }); var seen = {}; return l.filter(function (p) { if (seen[p.from]) return false; seen[p.from] = 1; return true; }).map(function (p) { return { v: p.from, l: p.label }; }); }
  var QUEUE = [
    { name: L('Računi – fizička lica', 'Accounts – private individuals'), items: [{ p: 'P02', b: 2 }, { p: 'P03', b: 3 }, { p: 'P04', b: 4 }] },
    { name: L('Krediti – preduzetnici', 'Loans – entrepreneurs'), items: [] }
  ];
  function cur(l) { return D.pointListAt(l.id); }
  function planned(l) { return l.versions.filter(function (v) { return v.from > D.TODAY; }).sort(function (a, b) { return a.from < b.from ? 1 : -1; })[0]; }
  function usedBy(id) { return IH.targets().filter(function (x) { return x.subject && x.subject.plist === id && x.status !== 'arhiviran'; }); }
  function segsTxt(sj) { var s = D.resolveSubj(sj).segs || []; return s.length === D.segments.length ? IH.L(L('Sve grupe', 'All groups')) : s.map(D.segName).join(', '); }
  function fld(label, ctl, o) { o = o || {}; return '<div class="field' + (o.full ? ' full' : '') + '"><label class="lab">' + label + (o.req ? ' <span class="req">*</span>' : '') + '</label>' + ctl + '</div>'; }
  function rov(v) { return '<div class="in ro">' + (v === '' || v == null ? '<span class="mut">—</span>' : IH.esc(v)) + '</div>'; }
  function section(title, body) { return '<div class="fsec"><h3>' + title + '</h3>' + body + '</div>'; }

  /* ---------- lista ---------- */
  function listPage() {
    var grid = IH.grid({
      id: 'bl', exportName: 'Bodovne_liste.xlsx', searchLabel: t('bl.search'), create: { label: t('bl.new'), act: 'bl-new' },
      rows: function () { return D.pointLists(); }, key: function (x) { return x.id; }, label: function (x) { return IH.L(x.name); }, searchKeys: ['n'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (x) { return x.status; }, render: function (x) { return ui.st2(x.status) + (x.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } },
        { key: 'n', label: t('bl.colName'), val: function (x) { return IH.L(x.name); }, render: function (x) { var pv = planned(x); return '<b>' + IH.esc(IH.L(x.name)) + '</b>' + (pv && pv !== cur(x) ? ' ' + ui.pill(t('bl.planned') + ' v' + pv.v, 'warning') : ''); } },
        { key: 'pt', label: t('bl.colPt'), val: function (x) { return D.subjPtypeName({ plist: x.id }); } },
        { key: 'seg', label: t('bl.colSeg'), val: function (x) { return segsTxt({ plist: x.id }); } },
        { key: 'cnt', label: t('bl.colN'), num: true, search: false, val: function (x) { return cur(x).items.length; } },
        { key: 'from', label: t('bl.colFrom'), search: false, val: function (x) { return cur(x).from; }, render: function (x) { return F.date(cur(x).from); } },
        { key: 'ver', label: t('bl.colVer'), num: true, search: false, val: function (x) { return cur(x).v; }, render: function (x) { return 'v' + cur(x).v; } },
        { key: 'used', label: t('bl.colUsed'), val: function (x) { return usedBy(x.id).map(function (q) { return IH.L(q.name); }).join(', '); }, render: function (x) { var u = usedBy(x.id); return u.length ? IH.esc(u.map(function (q) { return IH.L(q.name); }).join(', ')) : '<span class="mut">' + t('bl.none') + '</span>'; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'g-go', arg: function (x) { return 'katalog/bodovi/' + x.id; } },
        { type: 'edit', title: t('g.aEdit'), act: 'g-go', kind: 'acc', arg: function (x) { return 'katalog/bodovi/' + x.id + '/izmena'; } },
        { type: 'history', title: t('g.aHistory'), act: 'bl-hist' },
        { type: 'copy', title: t('g.aCopy'), act: 'bl-copy' }
      ]
    });
    return IH.katalogHeader() + IH.katalogTabs('bodovi') + grid;
  }
  IH.act['bl-hist'] = function (el) {
    var l = D.pointList(el.dataset.arg); if (!l) return;
    var h = IH.auditFor('pointList', l.id).slice();
    l.versions.forEach(function (v) { h.push({ at: (v.at || v.from + 'T08:00'), by: 'A001', action: { sr: 'Važi verzija v' + v.v + ' od ' + F.date(v.from), en: 'Version v' + v.v + ' in force from ' + F.date(v.from) }, detail: v.note }); });
    IH.showHistory(IH.L(l.name), h);
  };

  /* ---------- forma: pregled, nova lista, nova verzija (ista forma) ---------- */
  function PF() { return IH.form.pl; }
  function nextId() { var n = 1 + D.pointLists().length; while (D.pointList('BL-' + ('0' + n).slice(-2))) n++; return 'BL-' + ('0' + n).slice(-2); }
  function initNew(src) {
    var q = src ? { name: { sr: IH.L(src.name) + ' – kopija', en: IH.L(src.name) + ' – copy' }, items: cur(src).items } : QUEUE[IH.list('newPointLists').length % QUEUE.length];
    IH.form = { pl: { id: nextId(), name: JSON.parse(JSON.stringify(q.name)), v: 1, from: '2027-01-01', items: JSON.parse(JSON.stringify(q.items)), reason: '' }, _mode: 'bl-new' };
  }
  function initEdit(l) {
    var c = cur(l), pv = planned(l), nv = Math.max.apply(null, l.versions.map(function (v) { return v.v; })) + 1;
    IH.form = { pl: { id: l.id, name: l.name, v: nv, from: '2027-01-01', items: JSON.parse(JSON.stringify((pv || c).items)), reason: '' }, _mode: 'bl-edit', _for: l.id };
  }
  function selTxt(items) {
    if (!items.length) return t('bl.selNone');
    var pts = {}; items.forEach(function (i) { var p = D.product(i.p); if (p) pts[p.ptype] = 1; });
    return t('bl.sel', { n: items.length + ' ' + IH.L(L('proizvoda', 'products')), t: D.ptypes.filter(function (x) { return pts[x.id]; }).map(function (x) { return IH.L(x.name); }).join(', ') });
  }
  function itemsTable(items) {
    return ui.table([{ key: 'n', label: t('k.colProd') }, { key: 'pt', label: t('bl.colPt') }, { key: 'sg', label: t('bl.colSeg') }, { key: 'b', label: t('bl.colPts'), num: true }],
      items.map(function (i) { var p = D.product(i.p); return { n: '<b>' + IH.esc(D.productName(i.p)) + '</b>', pt: IH.esc(p ? D.ptypeName(p.ptype) : ''), sg: IH.esc(p ? D.segName(p.seg) : ''), b: '<b>' + F.num(i.b) + '</b>' }; }), { compact: true });
  }
  function prodGrid() {
    var ids = function () { return PF().items.map(function (i) { return i.p; }); };
    return IH.grid({
      id: 'bl-prod', exportName: 'Proizvodi.xlsx', searchLabel: t('k.search'), actions: [],
      rows: function () { var s = ids(); return IH.products().filter(function (p) { return p.status === 'aktivan'; }).sort(function (a, b) { return (s.indexOf(a.id) < 0) - (s.indexOf(b.id) < 0); }); },
      key: function (p) { return p.id; }, label: function (p) { return D.productName(p); }, searchKeys: ['n'],
      select: {
        get: ids,
        set: function (l) { var f = PF(), old = f.items; f.items = l.map(function (id) { return old.filter(function (i) { return i.p === id; })[0] || { p: id, b: 1 }; }); },
        onChange: function () { IH.render(); }
      },
      cols: [
        { key: 'n', label: t('k.colProd'), val: function (p) { return D.productName(p); }, render: function (p) { return '<b>' + IH.esc(D.productName(p)) + '</b>'; } },
        { key: 'pt', label: t('bl.colPt'), val: function (p) { return D.ptypeName(p.ptype); }, fval: function (p) { return p.ptype; }, filter: function () { return D.ptypes.map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'seg', label: t('bl.colSeg'), val: function (p) { return D.segName(p.seg); }, fval: function (p) { return p.seg; }, filter: function () { return D.segments.map(function (s) { return { v: s.id, l: IH.L(s.name) }; }); } },
        { key: 'sub', label: t('k.colSub'), val: function (p) { return IH.L(p.sub); } },
        { key: 'b', label: t('bl.colPts'), num: true, search: false, val: function (p) { var i = PF().items.filter(function (x) { return x.p === p.id; })[0]; return i ? i.b : -1; },
          render: function (p) { var i = PF().items.filter(function (x) { return x.p === p.id; })[0]; return i ? '<input class="in cell tnum" style="width:72px;margin-left:auto;display:block" data-blpts="' + p.id + '" value="' + F.num(i.b) + '">' : '<span class="mut">—</span>'; } }
      ]
    });
  }
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}, f = IH.form && IH.form.pl; if (!f) return;
    if (d.blpts) { var n = parseFloat(String(e.target.value).replace(',', '.')); if (isNaN(n) || n < 0) n = 0; var it = f.items.filter(function (i) { return i.p === d.blpts; })[0]; if (it) it.b = n; e.target.value = F.num(n); }
    if (d.pl === 'from') f.from = e.target.value;
  });
  document.addEventListener('input', function (e) {
    var d = e.target.dataset || {}, f = IH.form && IH.form.pl; if (!f || !d.pl) return;
    if (d.pl === 'name') f.name = { sr: e.target.value, en: e.target.value };
    if (d.pl === 'reason') f.reason = e.target.value;
  });
  function formHtml(x, m) {
    var ro = m.ro, h = '<div class="form-grid g3">';
    h += fld(t('bl.fName'), ro ? rov(IH.L(x.name)) : '<input class="in" data-pl="name" value="' + IH.esc(IH.L(x.name)) + '">', { full: true, req: !ro });
    h += fld(t('bl.fFrom'), ro ? rov(F.date(x.from)) : '<select class="in" data-pl="from">' + FROMS().map(function (o) { return '<option value="' + o.v + '"' + (o.v === x.from ? ' selected' : '') + '>' + IH.esc(IH.L(o.l)) + ' (' + F.date(o.v) + ')</option>'; }).join('') + '</select>', { req: !ro });
    h += fld(t('bl.fVer'), rov('v' + x.v));
    if (ro) { h += fld(t('c.status'), rov(t('st2.' + (x.status || 'aktivan')))); h += fld(t('bl.colPt'), rov(D.subjPtypeName({ plist: x.id }))); h += fld(t('bl.colSeg'), rov(segsTxt({ plist: x.id }))); }
    if (m.edit) h += fld(t('bl.fReason'), '<input class="in" data-pl="reason" value="' + IH.esc(x.reason || '') + '" placeholder="' + IH.esc(IH.L(L('Nova bodovna politika za 2027.', 'New points policy for 2027'))) + '">', { full: true, req: true });
    h += '</div>';
    var s2 = ro ? itemsTable(x.items) : '<div class="in ro" style="margin-bottom:12px">' + IH.esc(selTxt(x.items)) + '</div>' + prodGrid();
    var out = section(t('bl.s1'), h) + section(t('bl.s2'), s2);
    if (ro) {
      var u = usedBy(x.id);
      out += section(t('bl.s3'), u.length ? ui.table([{ key: 'n', label: t('bl.colTarget') }, { key: 'c', label: t('bl.colCarrier') }, { key: 's', label: t('bl.colScheme') }], u.map(function (q) { var sl = D.schemesOf(q.id); return { n: '<a href="#/targeti/' + q.id + '"><b>' + IH.esc(IH.L(q.name)) + '</b></a>', c: IH.esc(IH.targetCarrier(q)), s: sl.length ? IH.esc(sl.map(function (z) { return IH.L(z.name); }).join(', ')) : '<span class="mut">' + t('tg.free') + '</span>' }; }), { compact: true }) : '<div class="empty" style="padding:12px">' + t('bl.none') + '</div>');
    }
    return out;
  }
  function crumb(x) { return '<a href="#/katalog">' + t('k.title') + '</a> ' + ic('chevr') + ' <a href="#/katalog/bodovi">' + t('k.tPts') + '</a>' + (x ? ' ' + ic('chevr') + ' ' + IH.esc(IH.L(x.name)) : ''); }
  function detailPage(id) {
    var l = D.pointList(id); if (!l) return listPage();
    var c = cur(l), x = { id: l.id, name: l.name, status: l.status, v: c.v, from: c.from, items: c.items };
    var acts = ui.btn(t('c.copy'), { icon: 'copy', act: 'bl-copy', arg: id }) + ui.btn(t('c.edit'), { icon: 'edit', cls: 'primary', go: 'katalog/bodovi/' + id + '/izmena' });
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('c.back'), { icon: 'chevl', go: 'katalog/bodovi' }) + ui.btn(t('c.edit'), { cls: 'primary', icon: 'edit', go: 'katalog/bodovi/' + id + '/izmena' }) + '</div>';
    return ui.header(IH.esc(IH.L(l.name)), '', acts, crumb(l)) + '<section class="card"><div class="cb">' + formHtml(x, { ro: true }) + '</div>' + foot + '</section>';
  }
  function newPage() {
    if (IH.form._mode !== 'bl-new' || !PF()) initNew();
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('c.cancel'), { go: 'katalog/bodovi' }) + ui.btn(t('bl.activate'), { cls: 'primary', icon: 'check', act: 'bl-save' }) + '</div>';
    return ui.header(t('bl.new'), '', '', crumb(null) + ' ' + ic('chevr') + ' ' + t('bl.new')) + '<section class="card"><div class="cb">' + formHtml(PF(), { ro: false }) + '</div>' + foot + '</section>';
  }
  function editPage(id) {
    var l = D.pointList(id); if (!l) return listPage();
    if (IH.form._mode !== 'bl-edit' || IH.form._for !== id) initEdit(l);
    var foot = '<div class="wz-foot"><span class="left"></span>' + ui.btn(t('c.cancel'), { go: 'katalog/bodovi/' + id }) + ui.btn(t('bl.saveVer'), { cls: 'primary', icon: 'check', act: 'bl-save' }) + '</div>';
    return ui.header(t('bl.editT') + ' · ' + IH.esc(IH.L(l.name)), '', '', crumb(l) + ' ' + ic('chevr') + ' ' + t('c.edit')) + '<section class="card"><div class="cb">' + formHtml(PF(), { ro: false, edit: true }) + '</div>' + foot + '</section>';
  }
  IH.act['bl-new'] = function () { initNew(); IH.go('katalog/bodovi/nova'); };
  IH.act['bl-copy'] = function (el) { var l = D.pointList(el.dataset.arg); if (!l) return; initNew(l); IH.go('katalog/bodovi/nova'); };
  IH.act['bl-save'] = function () {
    var f = PF(); if (!f) return;
    var bad = [];
    if (!IH.L(f.name).trim()) bad.push(t('bl.badName'));
    if (!f.items.length) bad.push(t('bl.badProds'));
    else if (!f.items.every(function (i) { return i.b > 0; })) bad.push(t('bl.badPts'));
    if (bad.length) { IH.toast(t('bl.bad', { r: bad.join('; ') })); return; }
    var items = f.items.map(function (i) { return { p: i.p, b: i.b }; });
    if (IH.form._mode === 'bl-edit') {
      var l = D.pointList(f.id), reason = f.reason || IH.L(L('Nova bodovna politika za 2027.', 'New points policy for 2027'));
      IH.list('pointListVersions').push({ id: f.id, v: f.v, from: f.from, items: items, at: IH.now(), note: { sr: reason, en: reason } });
      if (IH.L(f.name) !== IH.L(l.name)) IH.map('pointListEdits')[f.id] = { name: f.name };
      IH.audit('pointList', f.id, { sr: 'Kreirana verzija v' + f.v + ' bodovne liste', en: 'Points list version v' + f.v + ' created' }, { sr: 'Važi od ' + F.date(f.from) + ' · ' + reason, en: 'Valid from ' + F.date(f.from) + ' · ' + reason });
      IH.engine.invalidate(); IH.form = {}; IH.save(); IH.go('katalog/bodovi'); IH.toast(t('bl.verDone', { v: f.v, n: IH.esc(IH.L(f.name)), d: F.date(f.from) }));
      return;
    }
    IH.list('newPointLists').push({ id: f.id, name: f.name, status: 'aktivan', isNew: true, versions: [{ v: 1, from: f.from, items: items, at: IH.now(), note: L('Nova lista', 'New list') }] });
    IH.audit('pointList', f.id, { sr: t('bl.hNew'), en: 'Points list created' }, { sr: 'Važi od ' + F.date(f.from), en: 'Valid from ' + F.date(f.from) });
    IH.engine.invalidate(); IH.form = {}; IH.save(); IH.go('katalog/bodovi'); IH.toast(t('bl.done', { n: IH.esc(IH.L(f.name)), d: F.date(f.from) }));
  };

  IH.pointsPage = function (p) {
    if (!p[0]) return listPage();
    if (p[0] === 'nova') return newPage();
    if (p[1] === 'izmena') return editPage(p[0]);
    return detailPage(p[0]);
  };
})();
