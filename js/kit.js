/* Incentive Hub — zajednički alati za ekrane: filteri, tabovi, čarobnjak, audit, forme */
(function () {
  'use strict';
  var IH = window.IH, t = IH.t, ic = IH.icon, ui = IH.ui;

  /* privremeno stanje ekrana (ne čuva se između učitavanja) */
  IH.view = IH.view || {};
  IH.form = IH.form || {};
  IH.refreshers = IH.refreshers || {};
  IH.v = function (scope) { IH.view[scope] = IH.view[scope] || {}; return IH.view[scope]; };

  /* "sada" u demo-u: demo datum + trenutno vreme */
  IH.now = function () {
    var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
    return IH.data.TODAY + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  };
  /* audit zapis */
  IH.audit = function (entity, ref, action, detail) {
    var me = IH.me();
    IH.state.data.audit = IH.state.data.audit || [];
    IH.state.data.audit.unshift({ at: IH.now(), by: me.id, entity: entity, ref: ref, action: action, detail: detail || null });
    IH.save();
  };
  IH.auditFor = function (entity, ref) {
    return (IH.state.data.audit || []).filter(function (a) { return a.entity === entity && a.ref === ref; });
  };
  /* trajni dodaci u stanju */
  IH.list = function (key) { IH.state.data[key] = IH.state.data[key] || []; return IH.state.data[key]; };
  IH.map = function (key) { IH.state.data[key] = IH.state.data[key] || {}; return IH.state.data[key]; };

  /* filteri: <input data-f="kljuc" data-scope="ekran"> → IH.view[ekran][kljuc] i osvežavanje kontejnera */
  function onFilter(e) {
    var el = e.target;
    if (el.dataset.k) IH.form[el.dataset.k] = el.type === 'checkbox' ? el.checked : el.value;
    if (!el.dataset || !el.dataset.f || !el.dataset.scope) return;
    IH.v(el.dataset.scope)[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value;
    var fn = IH.refreshers[el.dataset.scope];
    if (fn) fn();
  }
  document.addEventListener('input', onFilter);
  document.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT' || e.target.type === 'checkbox' || e.target.type === 'radio') onFilter(e); });

  ui.search = function (scope, ph) {
    var v = IH.v(scope).q || '';
    return '<label class="sbox">' + ic('search') + '<input type="search" data-f="q" data-scope="' + scope + '" value="' + IH.esc(v) + '" placeholder="' + IH.esc(ph || t('c.search')) + '"></label>';
  };
  ui.select = function (scope, key, opts, allLabel) {
    var v = IH.v(scope)[key] || '';
    return '<select class="in" data-f="' + key + '" data-scope="' + scope + '"><option value="">' + IH.esc(allLabel) + '</option>' +
      opts.map(function (o) { return '<option value="' + IH.esc(o.v) + '"' + (o.v === v ? ' selected' : '') + '>' + IH.esc(o.l) + '</option>'; }).join('') + '</select>';
  };
  ui.segf = function (scope, key, opts) {
    var v = IH.v(scope)[key] || opts[0].v;
    return '<div class="seg">' + opts.map(function (o) { return '<button data-act="segf" data-arg="' + scope + '|' + key + '|' + o.v + '" class="' + (o.v === v ? 'on' : '') + '">' + o.l + '</button>'; }).join('') + '</div>';
  };
  IH.act.segf = function (el) {
    var p = el.dataset.arg.split('|');
    IH.v(p[0])[p[1]] = p[2];
    if (IH.refreshers[p[0]]) IH.refreshers[p[0]](); else IH.render();
  };
  /* osveži deo ekrana bez gubitka fokusa */
  IH.swap = function (id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; };

  /* tabovi kao rute */
  ui.rtabs = function (base, tabs, cur) {
    return '<div class="tabs">' + tabs.map(function (x) {
      return '<a class="tab' + (x.id === cur ? ' on' : '') + '" href="#/' + base + (x.id ? '/' + x.id : '') + '">' + (x.icon ? ic(x.icon) : '') + x.label + (x.cnt != null ? '<span class="cnt' + (x.warn ? ' warn' : '') + '">' + x.cnt + '</span>' : '') + '</a>';
    }).join('') + '</div>';
  };

  /* polja forme sa pamćenjem vrednosti (data-k) */
  ui.field = function (k, label, sug, opts) {
    opts = opts || {};
    var val = IH.form[k] != null ? IH.form[k] : (opts.value != null ? opts.value : '');
    var id = 'fld-' + k;
    var ctl;
    if (opts.options) {
      var sel = IH.form[k] != null ? IH.form[k] : sug;
      ctl = '<select class="in" id="' + id + '" data-k="' + k + '">' + opts.options.map(function (o) {
        var v = typeof o === 'string' ? o : o.v, l = typeof o === 'string' ? o : o.l;
        return '<option value="' + IH.esc(v) + '"' + (v === sel ? ' selected' : '') + '>' + IH.esc(l) + '</option>';
      }).join('') + '</select>';
    } else if (opts.type === 'textarea') {
      ctl = '<textarea class="in guided' + (val === sug ? ' filled' : '') + '" id="' + id + '" data-k="' + k + '"' + IH.guided.attr(sug) + '>' + IH.esc(val) + '</textarea>';
    } else {
      ctl = '<input class="in guided' + (opts.num ? ' tnum' : '') + (val === sug ? ' filled' : '') + '" id="' + id + '" data-k="' + k + '"' + IH.guided.attr(sug) + ' value="' + IH.esc(val) + '">';
    }
    return '<div class="field' + (opts.full ? ' full' : '') + '"><label class="lab" for="' + id + '">' + label + (opts.req ? ' <span class="req">*</span>' : '') + '</label>' + ctl + (opts.hint ? '<div class="hint">' + opts.hint + '</div>' : '') + '</div>';
  };
  ui.toggle = function (k, label, on, hint) {
    var v = IH.form[k] != null ? IH.form[k] : on;
    return '<div class="field" style="display:flex;align-items:center;gap:10px"><button type="button" class="tg' + (v ? ' on' : '') + '" data-act="tg" data-arg="' + k + '" aria-pressed="' + !!v + '"><i></i></button><span><b style="font-weight:600">' + label + '</b>' + (hint ? '<span class="hint" style="display:block;margin:0">' + hint + '</span>' : '') + '</span></div>';
  };
  IH.act.tg = function (el) {
    var k = el.dataset.arg, on = !el.classList.contains('on');
    el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); IH.form[k] = on;
  };
  ui.opts = function (k, list, cur) {
    var v = IH.form[k] != null ? IH.form[k] : cur;
    return '<div class="opts">' + list.map(function (o) {
      return '<button type="button" class="opt' + (o.v === v ? ' on' : '') + '" data-act="opt" data-arg="' + k + '|' + o.v + '"><span class="ri"></span><span><b>' + o.l + '</b>' + (o.s ? '<small>' + o.s + '</small>' : '') + '</span></button>';
    }).join('') + '</div>';
  };
  IH.act.opt = function (el) {
    var p = el.dataset.arg.split('|');
    IH.form[p[0]] = p[1];
    el.parentNode.querySelectorAll('.opt').forEach(function (o) { o.classList.toggle('on', o === el); });
    if (IH.optHooks && IH.optHooks[p[0]]) IH.optHooks[p[0]](p[1]);
  };
  ui.segForm = function (k, list, cur) {
    var v = IH.form[k] != null ? IH.form[k] : cur;
    return '<div class="seg">' + list.map(function (o) { return '<button type="button" data-act="segform" data-arg="' + k + '|' + o.v + '" class="' + (o.v === v ? 'on' : '') + '">' + o.l + '</button>'; }).join('') + '</div>';
  };
  IH.act.segform = function (el) {
    var p = el.dataset.arg.split('|'); IH.form[p[0]] = p[1];
    el.parentNode.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === el); });
  };

  /* čarobnjak (puna strana): koraci u ruti, npr. targeti/novi/2 */
  ui.wizard = function (o) {
    /* o: {base, steps:[{label}], cur, body, finishLabel, finishAct, cancelGo} */
    var n = o.steps.length, cur = o.cur;
    var head = '<div class="pstep">' + o.steps.map(function (s, i) {
      var st = i < cur ? 'done' : i === cur ? 'on' : '';
      return (i ? '<span class="sep">' + ic('chevr') + '</span>' : '') + '<a class="ps ' + st + '" href="#/' + o.base + '/' + (i + 1) + '"><span class="pn">' + (i < cur ? '✓' : i + 1) + '</span>' + s.label + '</a>';
    }).join('') + '</div>';
    var foot = '<div class="wz-foot"><span class="left">' + t('wz.step', { a: cur + 1, b: n }) + '</span>' +
      ui.btn(t('c.fill'), { icon: 'edit', act: 'fill-form' }) +
      (o.cancelGo ? ui.btn(t('c.cancel'), { go: o.cancelGo }) : '') +
      (cur > 0 ? ui.btn(t('c.back'), { icon: 'chevl', go: o.base + '/' + cur }) : '') +
      (cur < n - 1 ? ui.btn(t('c.next'), { cls: 'primary', icon: 'arrow', go: o.base + '/' + (cur + 2) }) : ui.btn(o.finishLabel, { cls: 'primary', icon: 'check', act: o.finishAct })) +
      '</div>';
    return head + '<section class="card"><div class="ch"><h2>' + (cur + 1) + '. ' + o.steps[cur].label + '</h2>' + (o.steps[cur].right || '') + '</div><div class="cb">' + o.body + '</div>' + foot + '</section>';
  };

  /* naslov sekcije iznad tabele (tabela je sama kartica) */
  IH.sech = function (title, sub, actions) { return '<div class="sech"><h2>' + title + '</h2>' + (actions ? '<span class="sp"></span>' + actions : '') + '</div>'; };
  /* lista provera (validacija) */
  ui.checks = function (list) {
    return '<ul class="vlist">' + list.map(function (c) {
      var k = c.state || 'ok';
      return '<li><span class="' + (k === 'ok' ? 'ok' : k === 'warn' ? 'wa' : 'no') + '">' + ic(k === 'ok' ? 'checkc' : 'alert') + '</span><span style="flex:1">' + c.label + (c.sub ? '<span class="hint" style="display:block;margin:0">' + c.sub + '</span>' : '') + '</span></li>';
    }).join('') + '</ul>';
  };
  ui.hist = function (list) {
    if (!list.length) return '<div class="empty">' + t('c.empty') + '</div>';
    return '<ul class="hist">' + list.map(function (h) {
      var who = IH.data.emp(h.by);
      return '<li><time>' + IH.fmt.dt(h.at) + '</time><div><b style="font-weight:600">' + IH.esc(IH.L(h.action)) + '</b>' + (h.detail ? '<small>' + IH.esc(IH.L(h.detail)) + '</small>' : '') + '<small>' + (who ? IH.esc(who.name) : '') + '</small></div></li>';
    }).join('') + '</ul>';
  };

  IH.addStrings({
    'wz.step': 'Korak {a} od {b}', 'wz.hint': 'Zasivljena polja su predlog — Tab ili dvoklik popunjava', 'c.import': 'Uvoz iz Excela', 'c.edit': 'Izmeni', 'c.copy': 'Kopiraj', 'c.deactivate': 'Deaktiviraj',
    'c.history': 'Istorija izmena', 'c.versions': 'Verzije', 'c.usage': 'Gde se koristi', 'c.validFrom': 'Važi od', 'c.validTo': 'Važi do', 'c.version': 'Verzija', 'c.all2': 'Svi', 'c.active': 'Aktivni', 'c.inactive': 'Neaktivni',
    'c.confirm': 'Potvrdi', 'c.new': 'Novo', 'c.code': 'Šifra', 'c.name': 'Naziv', 'c.desc': 'Opis', 'c.unit': 'Jedinica', 'c.results': '{n} rezultata', 'c.saved': 'Sačuvano', 'c.draft': 'Nacrt', 'c.approved': 'Odobreno', 'c.pending': 'Čeka odobrenje',
    'c.sendApproval': 'Pošalji na odobrenje', 'c.saveDraft': 'Sačuvaj nacrt', 'c.now': 'Sa trenutnim dejstvom', 'c.nextPeriod': 'Od narednog perioda', 'c.chooseFile': 'Izaberi fajl', 'c.dropFile': 'Prevucite Excel fajl ovde ili',
    'st2.aktivan': 'Aktivan', 'st2.neaktivan': 'Neaktivan', 'st2.nacrt': 'Nacrt', 'st2.arhiviran': 'Arhiviran', 'st2.na_odobravanju': 'Na odobravanju', 'st2.odobreno': 'Odobreno', 'st2.aktivna': 'Aktivna', 'st2.zamenjena': 'Zamenjena'
  }, {
    'wz.step': 'Step {a} of {b}', 'wz.hint': 'Greyed fields are suggestions — Tab or double-click fills', 'c.import': 'Import from Excel', 'c.edit': 'Edit', 'c.copy': 'Copy', 'c.deactivate': 'Deactivate',
    'c.history': 'Change history', 'c.versions': 'Versions', 'c.usage': 'Where used', 'c.validFrom': 'Valid from', 'c.validTo': 'Valid to', 'c.version': 'Version', 'c.all2': 'All', 'c.active': 'Active', 'c.inactive': 'Inactive',
    'c.confirm': 'Confirm', 'c.new': 'New', 'c.code': 'Code', 'c.name': 'Name', 'c.desc': 'Description', 'c.unit': 'Unit', 'c.results': '{n} results', 'c.saved': 'Saved', 'c.draft': 'Draft', 'c.approved': 'Approved', 'c.pending': 'Awaiting approval',
    'c.sendApproval': 'Submit for approval', 'c.saveDraft': 'Save draft', 'c.now': 'Effective immediately', 'c.nextPeriod': 'From next period', 'c.chooseFile': 'Choose file', 'c.dropFile': 'Drop an Excel file here or',
    'st2.aktivan': 'Active', 'st2.neaktivan': 'Inactive', 'st2.nacrt': 'Draft', 'st2.arhiviran': 'Archived', 'st2.na_odobravanju': 'Pending approval', 'st2.odobreno': 'Approved', 'st2.aktivna': 'Active', 'st2.zamenjena': 'Replaced'
  });
  var ST2 = { aktivan: 'success', aktivna: 'success', neaktivan: 'gray', nacrt: 'warning', arhiviran: 'gray', na_odobravanju: 'warning', odobreno: 'success', zamenjena: 'gray', zamenjen: 'gray', zavrsen: 'gray', bez_seme: 'danger', vracen: 'danger' };
  ui.st2 = function (s) { return ui.pill(t('st2.' + s), ST2[s] || 'gray'); };
})();
