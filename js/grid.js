/* Incentive Hub — DEX standard tabelarnog ekrana
   toolbar (pretraga, očisti filtere, napredna pretraga | kreiraj, izvoz, kolone) · # · status toggle ·
   sort/filter u zaglavlju · sticky akcije desno · broj redova + paginacija */
(function () {
  'use strict';
  var IH = window.IH, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt;
  var G = IH.grids = {};

  IH.addStrings({
    'g.search': 'Naziv', 'g.clear': 'Očisti filtere', 'g.adv': 'Napredna pretraga', 'g.cols': 'Prikaz kolona', 'g.export': 'Izvoz u Excel', 'g.of': '{a}–{b} od {n}', 'g.rows': 'redova',
    'g.sortAsc': 'Rastuće', 'g.sortDesc': 'Opadajuće', 'g.all': 'Sve', 'g.apply': 'Primeni', 'g.reset': 'Poništi', 'g.empty': 'Nema rezultata za zadate kriterijume',
    'g.selAll': 'Izaberi sve', 'g.selected': 'Izabrano: {n}', 'g.selected1': 'Izabrano: {n}', 'g.selNone': 'poništi izbor', 'g.aDetails': 'Detalji', 'g.aItems': 'Stavke', 'g.aHistory': 'Istorija', 'g.aEdit': 'Izmeni', 'g.aDelete': 'Obriši', 'g.aCopy': 'Kopiraj', 'g.aDeact': 'Deaktiviraj',
    'g.on': 'Aktivno', 'g.off': 'Neaktivno', 'g.stOn': '{n} je aktiviran', 'g.stOff': '{n} je deaktiviran', 'g.histTitle': 'Istorija izmena — {n}',
    'g.delTitle': 'Brisanje zapisa', 'g.delTxt': 'Zapis „{n}“ biće trajno uklonjen iz šifarnika. Ako se koristi u targetima ili šemama, umesto brisanja koristite deaktivaciju.', 'g.delUsed': 'Zapis se koristi na {n} mesta — brisanje nije dozvoljeno, može samo deaktivacija.', 'g.deleted': 'Zapis „{n}“ je obrisan'
  }, {
    'g.search': 'Name', 'g.clear': 'Clear filters', 'g.adv': 'Advanced search', 'g.cols': 'Columns', 'g.export': 'Export to Excel', 'g.of': '{a}–{b} of {n}', 'g.rows': 'rows',
    'g.sortAsc': 'Ascending', 'g.sortDesc': 'Descending', 'g.all': 'All', 'g.apply': 'Apply', 'g.reset': 'Reset', 'g.empty': 'No results for the given criteria',
    'g.selAll': 'Select all', 'g.selected': 'Selected: {n}', 'g.selected1': 'Selected: {n}', 'g.selNone': 'clear selection', 'g.aDetails': 'Details', 'g.aItems': 'Items', 'g.aHistory': 'History', 'g.aEdit': 'Edit', 'g.aDelete': 'Delete', 'g.aCopy': 'Copy', 'g.aDeact': 'Deactivate',
    'g.on': 'Active', 'g.off': 'Inactive', 'g.stOn': '{n} activated', 'g.stOff': '{n} deactivated', 'g.histTitle': 'Change history — {n}',
    'g.delTitle': 'Delete record', 'g.delTxt': 'Record "{n}" will be permanently removed from the code list. If it is used in targets or schemes, deactivate it instead.', 'g.delUsed': 'The record is used in {n} places — it cannot be deleted, only deactivated.', 'g.deleted': 'Record "{n}" deleted'
  });

  /* ikonice akcija */
  var AIC = { details: 'eye', items: 'list', history: 'history', edit: 'edit', delete: 'trash', copy: 'copy', deact: 'lock', map: 'share', open: 'arrow' };
  /* dodatna ikonica (kanta) */
  IH.iconPaths = IH.iconPaths || {};

  function val(col, row) { return col.val ? col.val(row) : row[col.key]; }
  function txt(v) { return v == null ? '' : String(v).toLowerCase(); }

  /* filtriranje, sortiranje */
  function prepared(cfg) {
    var v = IH.v(cfg.id), q = txt(v.q), f = v.f || {};
    var rows = cfg.rows().filter(function (r) {
      if (q) {
        var hay = (cfg.searchKeys || cfg.cols.filter(function (c) { return c.search !== false; }).map(function (c) { return c.key; })).map(function (k) { var c = cfg.cols.filter(function (x) { return x.key === k; })[0]; return txt(c ? val(c, r) : r[k]); }).join(' ');
        if (hay.indexOf(q) < 0) return false;
      }
      for (var k in f) {
        if (f[k] == null || f[k] === '') continue;
        var c = cfg.cols.filter(function (x) { return x.key === k; })[0];
        var rv = c ? (c.fval ? c.fval(r) : val(c, r)) : r[k];
        if (Array.isArray(rv) ? rv.indexOf(f[k]) < 0 : String(rv) !== String(f[k])) return false;
      }
      return true;
    });
    if (v.sort) {
      var sc = cfg.cols.filter(function (x) { return x.key === v.sort; })[0];
      if (sc) rows.sort(function (a, b) {
        var x = val(sc, a), y = val(sc, b);
        if (typeof x === 'number' && typeof y === 'number') return (x - y) * (v.dir === 'desc' ? -1 : 1);
        return String(x == null ? '' : x).localeCompare(String(y == null ? '' : y), 'sr') * (v.dir === 'desc' ? -1 : 1);
      });
    }
    return rows;
  }

  function pager(page, pages) {
    var out = [], add = function (p) { out.push(p); };
    if (pages <= 7) { for (var i = 1; i <= pages; i++) add(i); return out; }
    add(1);
    if (page > 3) add('…');
    for (var j = Math.max(2, page - 1); j <= Math.min(pages - 1, page + 1); j++) add(j);
    if (page < pages - 2) add('…');
    add(pages);
    return out;
  }

  function bodyHtml(cfg) {
    var v = IH.v(cfg.id), rows = prepared(cfg), size = +(v.size || cfg.size || 10), pages = Math.max(1, Math.ceil(rows.length / size));
    var page = Math.min(Math.max(1, v.page || 1), pages); v.page = page;
    var slice = rows.slice((page - 1) * size, page * size), hide = v.hide || {};
    var cols = cfg.cols.filter(function (c) { return !hide[c.key]; });
    var sel = cfg.select ? cfg.select.get() : null;
    var selOk = function (r) { return !(cfg.select.disabled && cfg.select.disabled(r)); };
    var allOn = sel && rows.filter(selOk).length && rows.filter(selOk).every(function (r) { return sel.indexOf(cfg.key(r)) >= 0; });
    var h = '<div class="grid-tbl"><table class="t gt"><thead><tr><th class="gnum">#</th>' + (sel ? '<th class="gsel">' + (cfg.select.single ? '' : '<input type="checkbox" data-gselall="' + cfg.id + '"' + (allOn ? ' checked' : '') + ' title="' + t('g.selAll') + '">') + '</th>' : '');
    cols.forEach(function (c) {
      var sorted = v.sort === c.key, fActive = v.f && v.f[c.key] != null && v.f[c.key] !== '';
      h += '<th class="' + (c.num ? 'num ' : '') + (c.nw !== false ? 'nw' : '') + '"' + (c.w ? ' style="width:' + c.w + '"' : '') + '><span class="gth">' + c.label +
        (c.sort !== false ? '<button class="gsort' + (sorted ? ' on' : '') + '" data-act="g-sort" data-arg="' + cfg.id + '|' + c.key + '" title="' + t(sorted && v.dir !== 'desc' ? 'g.sortDesc' : 'g.sortAsc') + '">' + (sorted ? (v.dir === 'desc' ? '↓' : '↑') : '⇅') + '</button>' : '') +
        (c.filter ? '<span class="rel"><button class="gflt' + (fActive ? ' on' : '') + '" data-pop="gp-' + cfg.id + '-' + c.key + '" title="Filter">' + ic('filter') + '</button><div class="pop gpop" id="gp-' + cfg.id + '-' + c.key + '">' +
          [{ v: '', l: t('g.all') }].concat(c.filter()).map(function (o) { var on = String((v.f || {})[c.key] == null ? '' : v.f[c.key]) === String(o.v); return '<button class="pi' + (on ? ' on' : '') + '" data-act="g-filter" data-arg="' + cfg.id + '|' + c.key + '|' + IH.esc(o.v) + '"><span class="pit"><b style="font-weight:' + (on ? 600 : 400) + '">' + IH.esc(o.l) + '</b></span>' + (on ? ic('check') : '') + '</button>'; }).join('') + '</div></span>' : '') +
        '</span></th>';
    });
    h += '<th class="gact"><span class="gth" style="justify-content:flex-end"><span class="rel"><button class="gflt" data-pop="gp-' + cfg.id + '-cols" title="' + t('g.cols') + '">' + ic('grid') + '</button><div class="pop gpop" id="gp-' + cfg.id + '-cols" style="right:0;left:auto">' +
      '<div class="ph2">' + t('g.cols') + '</div>' + cfg.cols.map(function (c) { return '<label class="pi" style="cursor:pointer"><input type="checkbox" data-gcol="' + cfg.id + '|' + c.key + '"' + (hide[c.key] ? '' : ' checked') + ' style="accent-color:var(--accent)"><span class="pit"><b style="font-weight:500">' + c.label + '</b></span></label>'; }).join('') + '</div></span></span></th></tr></thead><tbody>';
    if (!slice.length) h += '<tr><td colspan="' + (cols.length + (sel ? 3 : 2)) + '"><div class="empty">' + t('g.empty') + '</div></td></tr>';
    slice.forEach(function (r, i) {
      var key = cfg.key(r);
      var on = sel && sel.indexOf(key) >= 0;
      h += '<tr class="' + (cfg.rowCls ? (cfg.rowCls(r) || '') : '') + (on ? ' gsel-on' : '') + '"' + (sel ? ' data-gselrow="' + cfg.id + '|' + IH.esc(key) + '"' : '') + '><td class="gnum">' + ((page - 1) * size + i + 1) + '</td>' + (sel ? '<td class="gsel"><input type="' + (cfg.select.single ? 'radio' : 'checkbox') + '" name="gs-' + cfg.id + '" data-gsel="' + cfg.id + '|' + IH.esc(key) + '"' + (on ? ' checked' : '') + (cfg.select.disabled && cfg.select.disabled(r) ? ' disabled' : '') + '></td>' : '');
      cols.forEach(function (c) {
        var cell;
        if (c.type === 'status') {
          var on = !!val(c, r);
          cell = '<button class="tg' + (on ? ' on' : '') + '" data-act="g-status" data-arg="' + cfg.id + '|' + IH.esc(key) + '" aria-pressed="' + on + '" title="' + t(on ? 'g.on' : 'g.off') + '"' + (c.locked && c.locked(r) ? ' disabled' : '') + '><i></i></button>';
        } else cell = c.render ? c.render(r) : IH.esc(val(c, r));
        h += '<td class="' + (c.num ? 'num ' : '') + (c.nw !== false ? 'nw' : '') + '">' + (cell == null ? '' : cell) + '</td>';
      });
      h += '<td class="gact"><div class="gacts">' + cfg.actions.filter(function (a) { return !a.show || a.show(r); }).map(function (a) {
        return '<button class="gab ' + (a.kind || '') + '" data-act="' + a.act + '" data-arg="' + IH.esc(a.arg ? a.arg(r) : key) + '" title="' + IH.esc(a.title) + '" aria-label="' + IH.esc(a.title) + '">' + ic(a.icon || AIC[a.type] || 'info') + '</button>';
      }).join('') + '</div></td></tr>';
    });
    h += '</tbody></table></div>';
    var from = rows.length ? (page - 1) * size + 1 : 0, to = Math.min(rows.length, page * size);
    var selRow = sel && cfg.select.single && sel.length ? cfg.rows().filter(function (r) { return cfg.key(r) === sel[0]; })[0] : null;
    h += '<div class="gfoot">' + (sel ? '<div class="gselc">' + (cfg.select.single ? t('g.selected1', { n: selRow && cfg.label ? '<b>' + IH.esc(cfg.label(selRow)) + '</b>' : '—' }) : t('g.selected', { n: sel.length }) + (sel.length ? ' · <button class="lnk" data-act="g-selnone" data-arg="' + cfg.id + '">' + t('g.selNone') + '</button>' : '')) + '</div>' : '') + '<div class="gsize"><select class="in" data-gsize="' + cfg.id + '">' + [10, 25, 50, 100].map(function (n) { return '<option' + (n === size ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select><span class="mut">' + t('g.of', { a: from, b: to, n: rows.length }) + '</span></div>' +
      '<div class="gpages"><button class="gpg" data-act="g-page" data-arg="' + cfg.id + '|' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>' + ic('chevl') + '</button>' +
      pager(page, pages).map(function (p) { return p === '…' ? '<span class="gell">…</span>' : '<button class="gpg' + (p === page ? ' on' : '') + '" data-act="g-page" data-arg="' + cfg.id + '|' + p + '">' + p + '</button>'; }).join('') +
      '<button class="gpg" data-act="g-page" data-arg="' + cfg.id + '|' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + '>' + ic('chevr') + '</button></div><div></div></div>';
    return h;
  }

  /* glavni render: vraća HTML, registruje konfiguraciju */
  IH.grid = function (cfg) {
    G[cfg.id] = cfg;
    var v = IH.v(cfg.id);
    if (!v.hide && cfg.hidden) { v.hide = {}; cfg.hidden.forEach(function (k) { v.hide[k] = true; }); }
    var hasF = v.q || (v.f && Object.keys(v.f).some(function (k) { return v.f[k] != null && v.f[k] !== ''; }));
    var tb = '<div class="gtool"><label class="sbox gsearch">' + ic('search') + '<input type="search" data-gq="' + cfg.id + '" value="' + IH.esc(v.q || '') + '" placeholder="' + IH.esc(cfg.searchLabel || t('g.search')) + '"></label>' +
      '<button class="gtb' + (hasF ? ' on' : '') + '" data-act="g-clear" data-arg="' + cfg.id + '" title="' + t('g.clear') + '">' + ic('filter') + '<span class="gx">×</span></button>' +
      '<button class="gtb" data-act="g-adv" data-arg="' + cfg.id + '" title="' + t('g.adv') + '">' + ic('search') + '</button>' +
      (cfg.toolbarExtra || '') + '<span class="sp"></span>' +
      (cfg.create ? ui.btn(cfg.create.label, { cls: 'primary', icon: 'plus', act: cfg.create.act, arg: cfg.create.arg }) : '') +
      '<button class="gtb" data-act="export" data-arg="' + IH.esc(cfg.exportName || (cfg.id + '.xlsx')) + '" title="' + t('g.export') + '">' + ic('download') + '</button>' +
      '<span class="rel"><button class="gtb" data-pop="gp-' + cfg.id + '-cols2" title="' + t('g.cols') + '">' + ic('grid') + '</button><div class="pop gpop" id="gp-' + cfg.id + '-cols2">' + '<div class="ph2">' + t('g.cols') + '</div>' + cfg.cols.map(function (c) { return '<label class="pi" style="cursor:pointer"><input type="checkbox" data-gcol="' + cfg.id + '|' + c.key + '"' + ((v.hide || {})[c.key] ? '' : ' checked') + ' style="accent-color:var(--accent)"><span class="pit"><b style="font-weight:500">' + c.label + '</b></span></label>'; }).join('') + '</div></span></div>';
    return '<section class="card gcard">' + tb + '<div id="gb-' + cfg.id + '">' + bodyHtml(cfg) + '</div></section>';
  };
  IH.gridRefresh = function (id) { var cfg = G[id]; if (cfg) IH.swap('gb-' + id, bodyHtml(cfg)); };
  /* izbor redova (čekiranje) */
  function setSel(cfg, list) { cfg.select.set(list); IH.gridRefresh(cfg.id); if (cfg.select.onChange) cfg.select.onChange(list); }
  function toggleSel(id, key, on) { var cfg = G[id]; if (!cfg || !cfg.select) return; if (cfg.select.single && !on) return; if (cfg.select.disabled) { var row = cfg.rows().filter(function (r) { return cfg.key(r) === key; })[0]; if (row && cfg.select.disabled(row)) { if (cfg.select.disabledMsg) IH.toast(cfg.select.disabledMsg(row)); return; } } var l = cfg.select.get().slice(), i = l.indexOf(key); if (on && i < 0) l.push(key); if (!on && i >= 0) l.splice(i, 1); if (cfg.select.single && on) l = [key]; setSel(cfg, l); }
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {};
    if (d.gsel) { var p = d.gsel.split('|'); toggleSel(p[0], p.slice(1).join('|'), e.target.checked); }
    if (d.gselall) { var cfg = G[d.gselall], keys = prepared(cfg).filter(function (r) { return !(cfg.select.disabled && cfg.select.disabled(r)); }).map(cfg.key), cur = cfg.select.get().filter(function (k) { return keys.indexOf(k) < 0; }); setSel(cfg, e.target.checked ? cur.concat(keys) : cur); }
  });
  document.addEventListener('click', function (e) {
    var tr = e.target.closest && e.target.closest('tr[data-gselrow]');
    if (!tr || e.target.closest('input,button,a,select,.gact')) return;
    var p = tr.dataset.gselrow.split('|'), cfg = G[p[0]], key = p.slice(1).join('|');
    toggleSel(p[0], key, cfg.select.get().indexOf(key) < 0);
  });
  IH.act['g-selnone'] = function (el) { var cfg = G[el.dataset.arg]; if (cfg) setSel(cfg, []); };

  /* događaji */
  document.addEventListener('input', function (e) {
    var id = e.target.dataset && e.target.dataset.gq; if (!id) return;
    var v = IH.v(id); v.q = e.target.value; v.page = 1; IH.gridRefresh(id);
  });
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {};
    if (d.gsize) { var v = IH.v(d.gsize); v.size = +e.target.value; v.page = 1; IH.gridRefresh(d.gsize); }
    if (d.gcol) { var p = d.gcol.split('|'), v2 = IH.v(p[0]); v2.hide = v2.hide || {}; v2.hide[p[1]] = !e.target.checked; IH.gridRefresh(p[0]); }
  });
  IH.act['g-sort'] = function (el) {
    var p = el.dataset.arg.split('|'), v = IH.v(p[0]);
    if (v.sort === p[1]) v.dir = v.dir === 'desc' ? 'asc' : 'desc'; else { v.sort = p[1]; v.dir = 'asc'; }
    v.page = 1; IH.gridRefresh(p[0]);
  };
  IH.act['g-filter'] = function (el) {
    var p = el.dataset.arg.split('|'), v = IH.v(p[0]); v.f = v.f || {}; v.f[p[1]] = p.slice(2).join('|'); v.page = 1;
    IH.closePops(); IH.render();
  };
  IH.act['g-clear'] = function (el) { var v = IH.v(el.dataset.arg); v.q = ''; v.f = {}; v.page = 1; IH.render(); };
  IH.act['g-page'] = function (el) { var p = el.dataset.arg.split('|'), v = IH.v(p[0]); v.page = +p[1]; IH.gridRefresh(p[0]); };
  IH.act['g-status'] = function (el) {
    var p = el.dataset.arg.split('|'), cfg = G[p[0]]; if (!cfg || !cfg.onStatus) return;
    var row = cfg.rows().filter(function (r) { return cfg.key(r) === p.slice(1).join('|'); })[0];
    var on = !el.classList.contains('on');
    if (cfg.onStatus(row, on) === false) return;
    IH.gridRefresh(p[0]);
    IH.toast(t(on ? 'g.stOn' : 'g.stOff', { n: IH.esc(cfg.label ? cfg.label(row) : p[1]) }));
  };
  IH.act['g-adv'] = function (el) {
    var cfg = G[el.dataset.arg], v = IH.v(cfg.id);
    var fcols = cfg.cols.filter(function (c) { return c.filter; });
    IH.modal({
      title: t('g.adv'),
      body: '<div class="form-grid"><div class="field full"><label class="lab">' + (cfg.searchLabel || t('g.search')) + '</label><input class="in" id="gadv-q" value="' + IH.esc(v.q || '') + '"></div>' +
        fcols.map(function (c) { return '<div class="field"><label class="lab">' + c.label + '</label><select class="in" data-gadv="' + c.key + '"><option value="">' + t('g.all') + '</option>' + c.filter().map(function (o) { return '<option value="' + IH.esc(o.v) + '"' + (String((v.f || {})[c.key]) === String(o.v) ? ' selected' : '') + '>' + IH.esc(o.l) + '</option>'; }).join('') + '</select></div>'; }).join('') + '</div>',
      foot: ui.btn(t('g.reset'), { act: 'g-clear', arg: cfg.id }) + ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('g.apply'), { cls: 'primary', icon: 'check', act: 'g-adv-apply', arg: cfg.id })
    });
  };
  IH.act['g-adv-apply'] = function (el) {
    var v = IH.v(el.dataset.arg); v.f = {}; v.page = 1;
    var q = document.getElementById('gadv-q'); v.q = q ? q.value : '';
    document.querySelectorAll('[data-gadv]').forEach(function (s) { if (s.value) v.f[s.dataset.gadv] = s.value; });
    IH.closeModal(); IH.render();
  };
  /* zajednički modal istorije */
  IH.showHistory = function (title, list) {
    IH.modal({ title: t('g.histTitle', { n: IH.esc(title) }), body: ui.hist(list), foot: ui.btn(t('c.close'), { act: 'modal-close' }) });
  };
})();
