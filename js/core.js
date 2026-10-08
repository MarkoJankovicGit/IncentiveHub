/* Incentive Hub — jezgro: stanje, i18n, formatiranje, ikonice, router, komponente, vođeno unošenje */
(function () {
  'use strict';
  var IH = window.IH = window.IH || {};
  IH.STR = IH.STR || { sr: {}, en: {} };
  IH.routes = IH.routes || {};
  IH.act = IH.act || {};

  /* ---------- i18n ---------- */
  IH.addStrings = function (sr, en) {
    Object.assign(IH.STR.sr, sr || {});
    Object.assign(IH.STR.en, en || {});
  };
  IH.t = function (key, vars) {
    var s = IH.STR[IH.state.lang] && IH.STR[IH.state.lang][key];
    if (s == null) s = IH.STR.sr[key];
    if (s == null) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  };
  /* lokalizovano polje podatka: string ili {sr,en} */
  IH.L = function (v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return v;
    return v[IH.state.lang] != null ? v[IH.state.lang] : v.sr;
  };

  /* ---------- escape ---------- */
  IH.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- formatiranje ---------- */
  function group(n, sep) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep); }
  IH.fmt = {
    num: function (n, dec) {
      dec = dec || 0;
      if (n == null || isNaN(n)) return '–';
      var neg = n < 0; n = Math.abs(n);
      var fixed = n.toFixed(dec).split('.');
      var sr = IH.state.lang === 'sr';
      var out = group(fixed[0], sr ? '.' : ',') + (dec ? (sr ? ',' : '.') + fixed[1] : '');
      return (neg ? '−' : '') + out;
    },
    rsd: function (n, dec) { return IH.fmt.num(n, dec) + ' RSD'; },
    mio: function (n) { /* skraćeno za velike iznose */
      if (Math.abs(n) >= 1e6) return IH.fmt.num(n / 1e6, 1) + (IH.state.lang === 'sr' ? ' mil.' : 'M');
      if (Math.abs(n) >= 1e3) return IH.fmt.num(n / 1e3, 0) + (IH.state.lang === 'sr' ? ' hilj.' : 'k');
      return IH.fmt.num(n);
    },
    pct: function (x, dec) {
      if (x == null || isNaN(x)) return '–';
      var v = x * 100;
      /* blizu okruglog praga (80, 85, 100…) prikaži decimalu, da 99,5% ne izgleda kao 100% */
      if (dec == null) { var r = Math.round(v); dec = r % 5 === 0 && Math.abs(v - r) >= 0.05 ? 1 : 0; }
      return IH.fmt.num(v, dec) + '%';
    },
    date: function (iso) {
      if (!iso) return '–';
      var p = iso.slice(0, 10).split('-');
      if (IH.state.lang === 'sr') return p[2] + '.' + p[1] + '.' + p[0] + '.';
      var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+p[1] - 1];
      return m + ' ' + (+p[2]) + ', ' + p[0];
    },
    dt: function (iso) { return IH.fmt.date(iso) + ' ' + iso.slice(11, 16); },
    unit: function (v, unit) { return unit === 'RSD' ? IH.fmt.rsd(v) : IH.fmt.num(v) + ' ' + IH.unitTxt(unit); },
    unitShort: function (v, unit) { return unit === 'RSD' ? IH.fmt.mio(v) : IH.fmt.num(v); }
  };

  /* ---------- ikonice (stroke, 24x24) ---------- */
  var P = {
    home: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    org: 'M9 3h6v4H9zM3 17h6v4H3zM15 17h6v4h-6zM12 7v5M6 17v-3h12v3',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
    history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 3',
    box: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7 12 12l8.7-5M12 22V12',
    target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
    layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    calendar: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18',
    upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    calc: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h4',
    edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    check: 'M20 6 9 17l-5-5',
    checkc: 'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
    msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z',
    chart: 'M18 20V10M12 20V4M6 20v-6',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    chevr: 'M9 18l6-6-6-6',
    chevd: 'M6 9l6 6 6-6',
    chevl: 'M15 18l-6-6 6-6',
    x: 'M18 6 6 18M6 6l12 12',
    plus: 'M12 5v14M5 12h14',
    refresh: 'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15',
    alert: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
    arrow: 'M5 12h14M12 5l7 7-7 7',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
    filter: 'M22 3H2l8 9.5V19l4 2v-8.5z',
    copy: 'M9 9h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
    trend: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
    briefcase: 'M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    wallet: 'M20 7H5a2 2 0 0 1 0-4h13v4M3 5v14a2 2 0 0 0 2 2h15V7M16 14h.01',
    reset: 'M1 4v6h6M3.5 15a9 9 0 1 0 2.1-9.4L1 10',
    palette: 'M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.4 3.4A1.6 1.6 0 0 1 12 22zM7.5 10.5h.01M10.5 7.5h.01M15.5 7.5h.01M17.5 11.5h.01',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    swap: 'M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16',
    trash: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6',
    paperclip: 'M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5'
  };
  IH.icon = function (name, cls) {
    var d = P[name] || P.info;
    return '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>';
  };

  /* ---------- stanje (localStorage + fallback u memoriji) ---------- */
  var KEY = 'incentive-hub-demo-v1';
  var DEFAULTS = function () {
    return { role: 'admin', lang: 'sr', tenant: 'unicredit-rs', mode: 'light', notifRead: {}, data: {} };
  };
  IH.state = DEFAULTS();
  IH.loadState = function () {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) Object.assign(IH.state, JSON.parse(raw));
    } catch (e) { /* storage nedostupan — radi u memoriji */ }
  };
  IH.save = function () {
    try { window.localStorage.setItem(KEY, JSON.stringify(IH.state)); } catch (e) { }
  };
  IH.resetDemo = function () {
    var keep = { lang: IH.state.lang, tenant: IH.state.tenant, mode: IH.state.mode };
    IH.state = Object.assign(DEFAULTS(), keep);
    try { window.localStorage.removeItem(KEY); } catch (e) { }
    if (IH.data && IH.data.resetRuntime) IH.data.resetRuntime();
    IH.save();
  };

  /* ---------- tema ---------- */
  IH.applyTheme = function () {
    var fi = document.getElementById('favicon');
    if (fi) fi.href = IH.state.tenant === 'unicredit-rs' ? 'img/uc-favicon.png' : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232B5C8A'/%3E%3Ctext x='16' y='21' font-family='Arial' font-size='13' font-weight='700' fill='white' text-anchor='middle'%3EDB%3C/text%3E%3C/svg%3E";
    var mode = IH.state.mode;
    if (mode === 'system') mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var h = document.documentElement;
    h.setAttribute('data-tenant', IH.state.tenant);
    h.setAttribute('data-mode', mode);
    h.setAttribute('lang', IH.state.lang === 'sr' ? 'sr-Latn' : 'en');
  };

  /* ---------- router ---------- */
  IH.route = function (id, def) { IH.routes[id] = def; };
  IH.current = function () {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean);
    return { id: parts[0] || 'pocetna', params: parts.slice(1), raw: h };
  };
  IH.go = function (path) {
    if (('#/' + path) === location.hash) IH.render();
    else location.hash = '#/' + path;
  };

  /* ---------- komponente ---------- */
  IH.ui = {
    pill: function (text, kind) { return '<span class="pill p-' + (kind || 'gray') + '">' + text + '</span>'; },
    bar: function (pct, opts) {
      opts = opts || {};
      var w = Math.max(0, Math.min(1, pct / (opts.max || 1.5))) * 100;
      var cls = opts.cls || (pct >= 1 ? 'ok' : pct >= 0.8 ? 'warn' : 'bad');
      var mk = opts.marker != null ? '<span class="mk" style="left:' + (Math.min(1, opts.marker / (opts.max || 1.5)) * 100) + '%"></span>' : '';
      return '<div class="bar ' + cls + '"><i style="width:' + w.toFixed(1) + '%"></i>' + mk + '</div>';
    },
    pcell: function (pct, opts) {
      return '<div class="pcell">' + IH.ui.bar(pct, Object.assign({ marker: 1 }, opts || {})) + '<b>' + IH.fmt.pct(pct) + '</b></div>';
    },
    kpi: function (label, value, sub, opts) {
      opts = opts || {};
      var tag = opts.go ? 'button' : 'div';
      var go = opts.go ? ' data-go="' + opts.go + '"' : '';
      return '<' + tag + ' class="kpi' + (opts.hl ? ' hl' : '') + '"' + go + '><small>' + label + '</small><b>' + value + '</b>' + (sub ? '<div class="d">' + sub + '</div>' : '') + '</' + tag + '>';
    },
    card: function (title, body, opts) {
      opts = opts || {};
      var head = title ? '<div class="ch' + (opts.plain ? ' plain' : '') + '"><h2>' + title + '</h2>' + (opts.actions || '') + (opts.sub ? '<div class="sub">' + opts.sub + '</div>' : '') + '</div>' : '';
      return '<section class="card' + (opts.cls ? ' ' + opts.cls : '') + '">' + head + '<div class="cb' + (opts.flush ? ' flush' : '') + '">' + body + '</div></section>';
    },
    header: function (title, desc, actions, crumb) {
      /* opis ispod naslova se ne prikazuje — ekran mora biti čist */
      return '<div class="ph"><div class="pt">' + (crumb ? '<div class="crumb">' + crumb + '</div>' : '') + '<h1>' + title + '</h1></div>' + (actions ? '<div class="acts">' + actions + '</div>' : '') + '</div>';
    },
    btn: function (label, opts) {
      opts = opts || {};
      var a = '';
      if (opts.act) a += ' data-act="' + opts.act + '"';
      if (opts.go) a += ' data-go="' + opts.go + '"';
      if (opts.arg != null) a += ' data-arg="' + IH.esc(opts.arg) + '"';
      return '<button class="btn ' + (opts.cls || '') + '"' + a + '>' + (opts.icon ? IH.icon(opts.icon) : '') + label + '</button>';
    },
    table: function (cols, rows, opts) {
      opts = opts || {};
      var h = '<div class="tbl-wrap"><table class="t' + (opts.compact ? ' compact' : '') + '"><thead><tr>';
      cols.forEach(function (c) { h += '<th' + (c.num ? ' class="num"' : '') + (c.w ? ' style="width:' + c.w + '"' : '') + '>' + c.label + '</th>'; });
      h += '</tr></thead><tbody>';
      if (!rows.length) h += '<tr><td colspan="' + cols.length + '"><div class="empty">' + IH.t('c.empty') + '</div></td></tr>';
      rows.forEach(function (r) {
        var go = r._go ? ' class="click" data-go="' + r._go + '"' : '';
        h += '<tr' + go + '>';
        cols.forEach(function (c) { var cl = (c.num ? 'num ' : '') + (c.nw ? 'nw' : ''); h += '<td' + (cl.trim() ? ' class="' + cl.trim() + '"' : '') + '>' + (r[c.key] == null ? '' : r[c.key]) + '</td>'; });
        h += '</tr>';
      });
      h += '</tbody>';
      if (opts.foot) {
        h += '<tfoot><tr>';
        cols.forEach(function (c) { h += '<td' + (c.num ? ' class="num"' : '') + '>' + (opts.foot[c.key] == null ? '' : opts.foot[c.key]) + '</td>'; });
        h += '</tr></tfoot>';
      }
      return h + '</table></div>';
    },
    flow: function (steps) {
      return '<div class="flow">' + steps.map(function (s, i) {
        return (i ? '<div class="farr">' + IH.icon('chevr') + '</div>' : '') +
          '<div class="fstep ' + (s.state || '') + '"><span class="fn">' + (s.state === 'done' ? '✓' : (i + 1)) + '</span><div><b>' + s.label + '</b>' + (s.sub ? '<small>' + s.sub + '</small>' : '') + '</div></div>';
      }).join('') + '</div>';
    },
    att: function (o) {
      var tag = o.go ? 'button' : 'div';
      return '<' + tag + ' class="att"' + (o.go ? ' data-go="' + o.go + '"' : '') + '><span class="ai ' + (o.tone || 'a') + '">' + IH.icon(o.icon || 'info') + '</span><span class="at"><b>' + o.title + '</b><small>' + (o.sub || '') + '</small></span>' + (o.right || '') + (o.go ? '<span class="chev">' + IH.icon('chevr') + '</span>' : '') + '</' + tag + '>';
    },
    avatar: function (name, lg) {
      var ini = String(name).split(' ').map(function (p) { return p[0]; }).slice(0, 2).join('');
      return '<span class="av' + (lg ? ' lg' : '') + '">' + IH.esc(ini) + '</span>';
    },
    hbars: function (rows, opts) {
      opts = opts || {};
      var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.v; }).concat([1]));
      return '<div class="hbars">' + rows.map(function (r, i) {
        return '<div class="hb"><span class="hl" title="' + IH.esc(r.label) + '">' + r.label + '</span><span class="ht"><i style="width:' + (Math.max(0, r.v) / max * 100).toFixed(1) + '%;background:var(--c' + (r.c || (i % 6) + 1) + ')"></i></span><span class="hv">' + (r.fmt || IH.fmt.num(r.v)) + '</span></div>';
      }).join('') + '</div>';
    }
  };

  /* ---------- toast, modal ---------- */
  var toastTimer;
  IH.toast = function (html) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.innerHTML = html;
    el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('on'); }, 3200);
  };
  IH.modal = function (o) {
    var ov = document.getElementById('ovl');
    ov.innerHTML = '<div class="mod' + (o.wide ? ' wide' : '') + '" role="dialog" aria-modal="true"><div class="mod-h"><h3>' + o.title + '</h3><button class="x" data-act="modal-close" aria-label="Zatvori">×</button></div><div class="mod-b">' + o.body + '</div>' + (o.foot ? '<div class="mod-f">' + o.foot + '</div>' : '') + '</div>';
    ov.classList.add('on');
    IH.guided.bind(ov);
    var f = ov.querySelector('input,select,textarea,button.btn');
    if (f && o.focus !== false) setTimeout(function () { f.focus(); }, 30);
  };
  IH.closeModal = function () { var ov = document.getElementById('ovl'); ov.classList.remove('on'); ov.innerHTML = ''; };

  /* ---------- vođeno unošenje ----------
     <input data-sug="..."> : placeholder prikazuje predlog; svaki pritisak tastera "kuca" sledeći znak predloga;
     Tab ili dvoklik popunjava ceo predlog. Sve što se upiše demo ignoriše i daje predefinisan ishod. */
  IH.guided = {
    attr: function (sug) { return ' data-sug="' + IH.esc(sug) + '" placeholder="' + IH.esc(sug) + '"'; },
    input: function (label, sug, opts) {
      opts = opts || {};
      var id = opts.id || ('f' + Math.random().toString(36).slice(2, 8));
      var ctl;
      if (opts.type === 'textarea') ctl = '<textarea class="in guided" id="' + id + '"' + IH.guided.attr(sug) + '></textarea>';
      else if (opts.options) {
        ctl = '<select class="in" id="' + id + '">' + opts.options.map(function (o) {
          var v = typeof o === 'string' ? o : o.v, l = typeof o === 'string' ? o : o.l;
          return '<option value="' + IH.esc(v) + '"' + (v === sug ? ' selected' : '') + '>' + IH.esc(l) + '</option>';
        }).join('') + '</select>';
      } else ctl = '<input class="in guided' + (opts.num ? ' tnum' : '') + '" id="' + id + '"' + (opts.type ? ' type="' + opts.type + '"' : '') + IH.guided.attr(sug) + '>';
      return '<div class="field"><label class="lab" for="' + id + '">' + label + (opts.req ? ' <span class="req">*</span>' : '') + '</label>' + ctl + (opts.hint ? '<div class="hint">' + opts.hint + '</div>' : '') + '</div>';
    },
    fill: function (el) {
      if (!el || !el.dataset.sug) return;
      el.value = el.dataset.sug;
      el.classList.add('filled');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    },
    fillAll: function (root) {
      (root || document).querySelectorAll('[data-sug]').forEach(IH.guided.fill);
    },
    bind: function (root) { /* event delegation na dokumentu — ovde ništa, ostavljeno radi kompatibilnosti */ }
  };
  document.addEventListener('keydown', function (e) {
    var el = e.target;
    if (!el || !el.dataset || el.dataset.sug == null) return;
    var sug = el.dataset.sug, v = el.value;
    if (e.key === 'Tab' && v !== sug && !e.shiftKey) { IH.guided.fill(el); return; }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var start = el.selectionStart, end = el.selectionEnd;
      var allSelected = start === 0 && end === v.length && v.length > 0;
      var base = allSelected ? '' : v;
      if (sug.toLowerCase().indexOf(base.toLowerCase()) === 0 && base.length < sug.length) {
        e.preventDefault();
        el.value = sug.slice(0, base.length + 1);
        if (el.value === sug) el.classList.add('filled');
        try { el.setSelectionRange(el.value.length, el.value.length); } catch (x) { }
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });
  document.addEventListener('dblclick', function (e) {
    var el = e.target;
    if (el && el.dataset && el.dataset.sug != null && !el.value) IH.guided.fill(el);
  });

  /* ---------- popovers ---------- */
  IH.closePops = function (except) {
    document.querySelectorAll('.pop.on').forEach(function (p) { if (p !== except) p.classList.remove('on'); });
  };

  /* ---------- delegirani klikovi ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-pop],[data-act],[data-go]');
    if (!t) { if (!e.target.closest('.pop')) IH.closePops(); return; }
    if (t.dataset.pop) {
      e.stopPropagation();
      var p = document.getElementById(t.dataset.pop);
      var on = p && !p.classList.contains('on');
      IH.closePops();
      if (p && on) p.classList.add('on');
      return;
    }
    if (t.dataset.act) {
      var fn = IH.act[t.dataset.act];
      if (fn) { e.preventDefault(); fn(t, e); }
      if (!t.closest('.pop') || t.dataset.keep == null) IH.closePops();
      return;
    }
    if (t.dataset.go != null) {
      e.preventDefault();
      IH.closePops();
      IH.closeModal();
      IH.go(t.dataset.go);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { IH.closePops(); IH.closeModal(); }
  });

  IH.act['modal-close'] = function () { IH.closeModal(); };
  IH.act['fill-form'] = function (el) { IH.guided.fillAll(el.closest('.mod') || el.closest('.card') || document); };
  IH.act['soon'] = function (el) { IH.toast(IH.t('c.soon') + (el.dataset.arg ? ' — ' + IH.esc(el.dataset.arg) : '')); };
})();
