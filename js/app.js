/* Incentive Hub — okvir aplikacije: meni, topbar, router, pokretanje */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon;

  /* ---------- meni po ulogama ---------- */
  IH.NAV = {
    admin: [
      { id: 'pocetna', icon: 'home' },
      { g: 'g.admin' }, { id: 'organizacija', icon: 'org', badge: function () { return IH.orgOpenChanges ? IH.orgOpenChanges().length : 0; } },
      { id: 'korisnici', icon: 'shield' }, { id: 'sifarnici', icon: 'list' }, { id: 'sabloni', icon: 'mail' }, { id: 'audit', icon: 'history' },
      { g: 'g.settings' }, { id: 'katalog', icon: 'box' }, { id: 'targeti', icon: 'target' }, { id: 'dodela-targeta', icon: 'share' }, { id: 'seme', icon: 'layers' },
      { g: 'g.ops' }, { id: 'ucitavanje', icon: 'upload', badge: function () { return IH.stats.unmapped().length; } }, { id: 'ostvarenje', icon: 'activity' }, { id: 'obracun', icon: 'calc' },
      { id: 'korekcije', icon: 'edit' }, { id: 'saglasnosti', icon: 'checkc', badge: function () { return IH.stats.approvalCounts('2026-Q3').ceka; } }, { id: 'isplata', icon: 'wallet' },
      { g: 'g.views' }, { id: 'izvestaji', icon: 'chart' }
    ],
    manager: [
      { id: 'pocetna', icon: 'home' },
      { g: 'g.team' }, { id: 'tim', icon: 'users' }, { id: 'targeti-tima', icon: 'target' },
      { id: 'rasporedi-odobravanje', icon: 'calendar', badge: function () { return IH.stats.pendingAssignments().length; } },
      { g: 'g.calc' }, { id: 'saglasnosti-tima', icon: 'checkc' }, { id: 'prigovori-tima', icon: 'msg', badge: function () { return IH.stats.openComplaints(IH.me().id).length; } }, { id: 'moj-bonus', icon: 'wallet' },
      { g: 'g.views' }, { id: 'izvestaji', icon: 'chart' }
    ],
    employee: [
      { id: 'pocetna', icon: 'home' },
      { g: 'g.my' }, { id: 'moji-targeti', icon: 'target' }, { id: 'moje-ostvarenje', icon: 'activity' },
      { id: 'moj-obracun', icon: 'calc', badge: function () { var a = EN.approval(IH.me().id, EN.lastClosed(IH.me().id)); return a.status === 'ceka' || a.status === 'korigovano' ? 1 : 0; } },
      { id: 'moja-kartica', icon: 'user' }
    ],
    viewer: [
      { id: 'pocetna', icon: 'home' },
      { g: 'g.views' }, { id: 'izvestaji', icon: 'chart' }
    ]
  };

  IH.me = function () { return D.emp(D.personas[IH.state.role].emp); };

  /* ---------- zajedničke statistike ---------- */
  IH.stats = {
    unmapped: function () {
      var out = [];
      ['2026-Q3', '2026-Q4', '2026-10'].forEach(function (pid) { D.allItems(pid).forEach(function (i) { if (i.status === 'nemapirano' && !(IH.state.data.mapped || {})[i.code]) out.push(i); }); });
      return out;
    },
    approvalCounts: function (pid) {
      var c = { ceka: 0, saglasan: 0, auto: 0, prigovor: 0, korigovano: 0, odobreno: 0, isplaceno: 0, total: 0 };
      EN.staffForPeriod(pid).forEach(function (e) { var a = EN.approval(e.id, pid); c[a.status] = (c[a.status] || 0) + 1; c.total++; });
      return c;
    },
    pendingAssignments: function () {
      var done = IH.state.data.assignDecisions || {};
      return D.assignments.filter(function (a) { return a.status === 'na_odobravanju' && !done[a.id]; });
    },
    openComplaints: function (mgrId) {
      var st = IH.state.data.complaints || {};
      return D.complaints.filter(function (c) { var e = D.emp(c.emp); return (!mgrId || e.mgr === mgrId) && (st[c.id] ? st[c.id].status : c.status) === 'otvoren'; })
        .concat((IH.state.data.newComplaints || []).filter(function (c) { var e = D.emp(c.emp); return (!mgrId || e.mgr === mgrId) && (st[c.id] ? st[c.id].status : c.status) === 'otvoren'; }));
    },
    periodTotal: function (pid) {
      return EN.staffForPeriod(pid).reduce(function (a, e) { var r = EN.result(e.id, pid); return a + (r ? r.payout : 0); }, 0);
    }
  };

  /* ---------- obaveštenja ---------- */
  function notifs() {
    var list = (D.notifications[IH.state.role] || []).slice();
    if (IH.state.role === 'admin') {
      var um = IH.stats.unmapped().length, ac = IH.stats.approvalCounts('2026-Q3');
      list = list.map(function (n) {
        if (n.id === 'N-A1') return Object.assign({}, n, { text: { sr: 'Noćni uvoz iz DWH završen: 1.284 stavke, ' + um + ' nemapiranih ukupno', en: 'Nightly DWH import done: 1,284 items, ' + um + ' unmapped in total' } });
        if (n.id === 'N-A3') return Object.assign({}, n, { text: { sr: 'Rok za saglasnost Q3 ističe 22.10. — ' + ac.ceka + ' obračuna bez odgovora', en: 'Q3 consent deadline Oct 22 — ' + ac.ceka + ' statements unanswered' } });
        return n;
      });
    }
    return list.concat(IH.state.data.extraNotif && IH.state.data.extraNotif[IH.state.role] || []).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  }
  function unreadCount() { return notifs().filter(function (n) { return !IH.state.notifRead[n.id]; }).length; }

  /* ---------- shell ---------- */
  function sidebar(cur) {
    var b = D.bank[IH.state.tenant];
    var h = '<aside class="side"><div class="logo">' + (b.logo ? '<span class="lm img"><img src="' + b.logo + '" alt="' + IH.esc(b.short) + '"></span>' : '<span class="lm" title="Logo banke">' + b.mark + '</span>') + '<span class="lt"><b>' + t('app.name') + '</b><small>' + IH.esc(b.short) + '</small></span></div><nav aria-label="Glavni meni">';
    IH.NAV[IH.state.role].forEach(function (n) {
      if (n.g) { h += '<div class="ngroup">' + t(n.g) + '</div>'; return; }
      var badge = n.badge ? n.badge() : 0;
      h += '<a class="nitem' + (cur === n.id ? ' on' : '') + '" href="#/' + n.id + '">' + ic(n.icon) + '<span>' + t('nav.' + n.id) + '</span>' + (badge ? '<span class="nb">' + badge + '</span>' : '') + '</a>';
    });
    h += '</nav><div class="side-foot"><span class="demo-badge">' + ic('info') + t('side.demo') + '</span><div style="margin-top:8px">' + t('side.ver') + ' 0.1 · ' + IH.fmt.date(D.TODAY) + '</div></div></aside>';
    return h;
  }

  function topbar() {
    var me = IH.me(), un = unreadCount();
    var dark = document.documentElement.getAttribute('data-mode') === 'dark';
    var h = '<header class="top">';
    h += '<div class="top-search rel"><div class="box">' + ic('search') + '<input id="gsearch" type="search" autocomplete="off" placeholder="' + t('top.search') + '" aria-label="' + t('c.search') + '"><kbd>/</kbd></div><div class="pop search-res" id="pop-search"></div></div>';
    h += '<div class="top-sp"></div>';
    h += '<span class="chip">' + ic('clock') + t('top.asof') + ' <b>' + IH.fmt.date(D.DATA_AS_OF) + '</b> · ' + t('top.import') + ' ' + D.LAST_LOAD.slice(11) + '</span>';
    h += '<div class="seg-lang" role="group" aria-label="' + t('top.lang') + '"><button data-act="lang" data-arg="sr" class="' + (IH.state.lang === 'sr' ? 'on' : '') + '">SR</button><button data-act="lang" data-arg="en" class="' + (IH.state.lang === 'en' ? 'on' : '') + '">EN</button></div>';
    h += '<button class="ibtn" data-act="mode-toggle" title="' + t('top.mode') + '" aria-label="' + t('top.mode') + '">' + ic(dark ? 'sun' : 'moon') + '</button>';
    /* podešavanja prikaza */
    h += '<div class="rel"><button class="ibtn" data-pop="pop-view" title="' + t('top.view') + '" aria-label="' + t('top.view') + '">' + ic('palette') + '</button><div class="pop" id="pop-view">';
    h += '<div class="ph2">' + t('top.tenant') + '</div>';
    h += '<button class="pi' + (IH.state.tenant === 'unicredit-rs' ? ' on' : '') + '" data-act="tenant" data-arg="unicredit-rs"><span class="lm img" style="width:22px;height:22px;border-radius:6px"><img src="img/uc-logo.png" alt="UniCredit"></span><span class="pit"><b>UniCredit Bank Srbija</b><small>#007A91 · #E2001A</small></span></button>';
    h += '<button class="pi' + (IH.state.tenant === 'dex-neutral' ? ' on' : '') + '" data-act="tenant" data-arg="dex-neutral"><span class="lm" style="width:22px;height:22px;border-radius:6px;background:#1F3A5F;color:#fff;display:grid;place-items:center;font-size:9px;font-weight:700">DB</span><span class="pit"><b>' + t('top.neutral') + '</b><small>#2B5C8A</small></span></button>';
    h += '<div class="sep"></div><div class="ph2">' + t('top.mode') + '</div><div class="row"><div class="seg">' + ['light', 'dark', 'system'].map(function (m) { return '<button data-act="mode" data-arg="' + m + '" class="' + (IH.state.mode === m ? 'on' : '') + '">' + t('top.' + m) + '</button>'; }).join('') + '</div></div>';
    h += '<div class="sep"></div><button class="pi" data-act="reset">' + ic('reset') + '<span class="pit"><b>' + t('top.reset') + '</b></span></button></div></div>';
    /* obaveštenja */
    h += '<div class="rel"><button class="ibtn" data-pop="pop-notif" aria-label="' + t('notif.title') + '">' + ic('bell') + (un ? '<span class="dot">' + un + '</span>' : '') + '</button><div class="pop notif" id="pop-notif"><div class="nh"><span>' + t('notif.title') + '</span><button class="btn ghost sm" data-act="notif-read">' + t('notif.readAll') + '</button></div>';
    var ns = notifs();
    if (!ns.length) h += '<div class="empty">' + t('notif.empty') + '</div>';
    ns.forEach(function (n) {
      h += '<button class="ni' + (IH.state.notifRead[n.id] ? '' : ' unread') + '" data-act="notif-open" data-arg="' + n.id + '|' + (n.go || '') + '"><span class="ai" style="width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:var(--line-2);flex:none">' + ic(n.icon) + '</span><span>' + IH.esc(IH.L(n.text)) + '<small>' + IH.fmt.dt(n.at) + '</small></span></button>';
    });
    h += '</div></div>';
    /* uloga */
    h += '<div class="rel"><button class="who" data-pop="pop-role">' + IH.ui.avatar(me.name) + '<span class="wt"><b>' + IH.esc(me.name) + '</b><small>' + t('role.' + IH.state.role) + '</small></span>' + ic('chevd') + '</button><div class="pop" id="pop-role" style="min-width:300px"><div class="ph2">' + t('top.persona') + '</div>';
    ['admin', 'manager', 'employee', 'viewer'].forEach(function (r) {
      var e = D.emp(D.personas[r].emp);
      var sub = e.branch ? D.posName(e.pos) + ' · ' + D.branchName(e.branch) : D.posName(e.pos);
      h += '<button class="pi' + (IH.state.role === r ? ' on' : '') + '" data-act="role" data-arg="' + r + '">' + IH.ui.avatar(e.name) + '<span class="pit"><b>' + t('role.' + r) + ' — ' + IH.esc(e.name) + '</b><small>' + IH.esc(sub) + '</small></span></button>';
    });
    h += '</div></div>';
    h += '</header>';
    return h;
  }

  /* ---------- placeholder ekrani (lista sadržaja po meniju) ---------- */
  IH.PLAN = IH.PLAN || {};
  function wip(id) {
    var pl = IH.PLAN[id] || { part: 2, sr: [], en: [] };
    var list = pl[IH.state.lang] || pl.sr;
    return IH.ui.header(t('nav.' + id), '') + '<div class="wip"><h3>' + t('wip.title') + ' · <span class="pill p-accent">' + t('wip.part', { n: pl.part }) + '</span></h3>' +
      (list.length ? '<div class="mut">' + t('wip.will') + '</div><ul>' + list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') + '</div>';
  }

  /* ---------- render ---------- */
  var lastRoute = null;
  IH.render = function () {
    IH.applyTheme();
    var cur = IH.current();
    var allowed = IH.NAV[IH.state.role].filter(function (n) { return n.id; }).map(function (n) { return n.id; });
    var def = IH.routes[cur.id];
    var ok = allowed.indexOf(cur.id) >= 0 || (def && def.roles && def.roles.indexOf(IH.state.role) >= 0);
    if (!ok) { location.replace('#/pocetna'); cur = { id: 'pocetna', params: [] }; def = IH.routes.pocetna; }
    var body;
    try { body = def && def.render ? def.render(cur.params) : wip(cur.id); }
    catch (err) { console.error(err); body = '<div class="note warn">' + IH.esc(err.message) + '</div>'; }
    var navId = def && def.nav ? def.nav : cur.id;
    var root = document.getElementById('app');
    root.innerHTML = '<div class="app">' + sidebar(navId) + '<div class="main">' + topbar() + '<main class="wrap' + (lastRoute !== cur.raw ? ' screen-enter' : '') + '" id="main">' + body + '</main></div></div>';
    if (def && def.mount) def.mount(document.getElementById('main'), cur.params);
    document.title = (def && def.title ? def.title() : t('nav.' + cur.id)) + ' · ' + t('app.name');
    if (lastRoute !== cur.raw) window.scrollTo(0, 0);
    lastRoute = cur.raw;
  };

  /* ---------- akcije topbara ---------- */
  IH.act.lang = function (el) { IH.state.lang = el.dataset.arg; IH.save(); IH.render(); };
  IH.act.tenant = function (el) { IH.state.tenant = el.dataset.arg; IH.save(); IH.render(); };
  IH.act.mode = function (el) { IH.state.mode = el.dataset.arg; IH.save(); IH.render(); };
  IH.act['mode-toggle'] = function () {
    var dark = document.documentElement.getAttribute('data-mode') === 'dark';
    IH.state.mode = dark ? 'light' : 'dark'; IH.save(); IH.render();
  };
  IH.act.role = function (el) { IH.state.role = el.dataset.arg; IH.save(); location.hash = '#/pocetna'; IH.render(); };
  IH.act.reset = function () { IH.resetDemo(); EN.invalidate(); location.hash = '#/pocetna'; IH.render(); IH.toast(t('top.resetDone')); };
  IH.act['notif-read'] = function () { notifs().forEach(function (n) { IH.state.notifRead[n.id] = 1; }); IH.save(); IH.render(); };
  IH.act['notif-open'] = function (el) {
    var p = el.dataset.arg.split('|'); IH.state.notifRead[p[0]] = 1; IH.save();
    if (p[1]) IH.go(p[1]); else IH.render();
  };
  IH.act.export = function (el) { IH.toast(t('c.exported', { f: IH.esc(el.dataset.arg || 'izvestaj.xlsx') })); };

  /* ---------- globalna pretraga ---------- */
  function searchResults(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) return '';
    var role = IH.state.role, out = [];
    if (role === 'admin' || role === 'manager' || role === 'viewer') {
      var pool = role === 'manager' ? D.team(IH.me().id) : D.employees.filter(function (e) { return e.branch; });
      pool.filter(function (e) { return e.name.toLowerCase().indexOf(q) >= 0 || e.hr.toLowerCase().indexOf(q) >= 0; }).slice(0, 5).forEach(function (e) {
        out.push({ icon: 'user', title: e.name, sub: D.posName(e.pos) + ' · ' + D.branchName(e.branch), go: role === 'manager' ? 'tim/' + e.id : 'organizacija/' + e.id });
      });
    }
    if (role === 'admin') {
      (IH.products ? IH.products() : D.products).filter(function (p) { return D.productName(p).toLowerCase().indexOf(q) >= 0 || p.id.toLowerCase() === q || p.codes.join(' ').toLowerCase().indexOf(q) >= 0; }).slice(0, 5).forEach(function (p) {
        out.push({ icon: 'box', title: D.productName(p), sub: p.id + ' · ' + IH.L(D.cat(p.cat).name), go: 'katalog/' + p.id });
      });
      (IH.targets ? IH.targets() : D.targets).filter(function (x) { return IH.L(x.name).toLowerCase().indexOf(q) >= 0; }).slice(0, 4).forEach(function (x) {
        out.push({ icon: 'target', title: IH.L(x.name), sub: x.id, go: 'targeti/' + x.id });
      });
    }
    if (!out.length) return '<div class="empty">' + t('c.empty') + '</div>';
    return out.map(function (r) { return '<button class="pi" data-go="' + r.go + '">' + ic(r.icon) + '<span class="pit"><b>' + IH.esc(r.title) + '</b><small>' + IH.esc(r.sub) + '</small></span></button>'; }).join('');
  }
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'gsearch') return;
    var p = document.getElementById('pop-search'), html = searchResults(e.target.value);
    p.innerHTML = html; p.classList.toggle('on', !!html);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); var s = document.getElementById('gsearch'); if (s) s.focus(); }
  });

  /* ---------- pokretanje ---------- */
  IH.boot = function () {
    IH.loadState();
    IH.state.data = IH.state.data || {};
    /* direktan link na personu/temu: ?role=manager&lang=en&tenant=dex-neutral&mode=dark */
    try {
      var qs = new URLSearchParams(location.search);
      ['role', 'lang', 'tenant', 'mode'].forEach(function (k) { if (qs.get(k)) IH.state[k] = qs.get(k); });
      if (!D.personas[IH.state.role]) IH.state.role = 'admin';
    } catch (e) { }
    window.addEventListener('hashchange', IH.render);
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (IH.state.mode === 'system') IH.render(); });
    if (!location.hash) location.replace('#/pocetna');
    IH.render();
  };
})();
