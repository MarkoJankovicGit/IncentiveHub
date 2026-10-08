/* Incentive Hub — dijagrami (SVG, bez biblioteka) i forme za pregled/izmenu */
(function () {
  'use strict';
  var IH = window.IH, t = IH.t, ui = IH.ui, F = IH.fmt;
  var COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)'];

  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), n = v / p;
    var m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return m * p;
  }
  function short(v) { return Math.abs(v) >= 1e6 ? F.num(v / 1e6, 1) + (IH.state.lang === 'sr' ? ' mil.' : 'M') : Math.abs(v) >= 1e3 ? F.num(v / 1e3, 0) + (IH.state.lang === 'sr' ? ' hilj.' : 'k') : F.num(v); }
  function legend(series) {
    return '<div class="leg">' + series.map(function (s, i) { return '<span><i style="background:' + (s.color || COLORS[i % 6]) + '"></i>' + IH.esc(s.name) + '</span>'; }).join('') + '</div>';
  }

  /* vertikalni stubići: grupe po oznaci, više serija (grupisano ili naslagano) */
  ui.chartBars = function (o) {
    var W = o.w || 640, H = o.h || 220, padL = 46, padR = 10, padT = 12, padB = 28;
    var labels = o.labels, series = o.series, stacked = !!o.stacked;
    var maxv = o.max || niceMax(Math.max.apply(null, labels.map(function (_, i) {
      return stacked ? series.reduce(function (a, s) { return a + Math.max(0, s.values[i] || 0); }, 0) : Math.max.apply(null, series.map(function (s) { return s.values[i] || 0; }));
    }).concat([1])));
    var iw = W - padL - padR, ih = H - padT - padB, gw = iw / labels.length;
    var fmt = o.fmt || short;
    var h = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chart" role="img">';
    for (var g = 0; g <= 4; g++) { var y = padT + ih - ih * g / 4; h += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y + '" y2="' + y + '" class="grid"/><text x="' + (padL - 6) + '" y="' + (y + 4) + '" class="ax" text-anchor="end">' + IH.esc(fmt(maxv * g / 4)) + '</text>'; }
    labels.forEach(function (lb, i) {
      var x0 = padL + gw * i;
      h += '<text x="' + (x0 + gw / 2) + '" y="' + (H - 8) + '" class="ax" text-anchor="middle">' + IH.esc(lb) + '</text>';
      if (stacked) {
        var acc = 0, bw = Math.min(42, gw * 0.6), bx = x0 + (gw - bw) / 2;
        series.forEach(function (s, k) {
          var v = Math.max(0, s.values[i] || 0), bh = ih * v / maxv, y1 = padT + ih - acc - bh;
          if (v > 0) h += '<rect x="' + bx + '" y="' + y1 + '" width="' + bw + '" height="' + bh + '" rx="2" fill="' + (s.color || COLORS[k % 6]) + '"><title>' + IH.esc(s.name + ': ' + fmt(v)) + '</title></rect>';
          acc += bh;
        });
      } else {
        var n = series.length, bw2 = Math.min(34, gw * 0.7 / n), tot = bw2 * n, sx = x0 + (gw - tot) / 2;
        series.forEach(function (s, k) {
          var v = Math.max(0, s.values[i] || 0), bh = ih * v / maxv, y1 = padT + ih - bh;
          h += '<rect x="' + (sx + bw2 * k) + '" y="' + y1 + '" width="' + (bw2 - 2) + '" height="' + bh + '" rx="3" fill="' + (s.color || COLORS[k % 6]) + '"' + (s.dashed ? ' opacity=".55"' : '') + '><title>' + IH.esc(s.name + ': ' + fmt(v)) + '</title></rect>';
        });
      }
    });
    if (o.marker != null) { var my = padT + ih - ih * Math.min(o.marker, maxv) / maxv; h += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + my + '" y2="' + my + '" class="mark"/>' + (o.markerLabel ? '<text x="' + (W - padR) + '" y="' + (my - 4) + '" class="ax mk" text-anchor="end">' + IH.esc(o.markerLabel) + '</text>' : ''); }
    h += '</svg>';
    return '<div class="chartw">' + h + (o.legend === false ? '' : legend(series)) + '</div>';
  };

  /* linije (trend), više serija; tačke sa vrednostima na hover */
  ui.chartLine = function (o) {
    var W = o.w || 640, H = o.h || 200, padL = 46, padR = 14, padT = 14, padB = 28;
    var labels = o.labels, series = o.series;
    var all = []; series.forEach(function (s) { s.values.forEach(function (v) { if (v != null) all.push(v); }); });
    var maxv = o.max || niceMax(Math.max.apply(null, all.concat([1])));
    var iw = W - padL - padR, ih = H - padT - padB, step = labels.length > 1 ? iw / (labels.length - 1) : iw;
    var fmt = o.fmt || short;
    var h = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chart" role="img">';
    for (var g = 0; g <= 4; g++) { var y = padT + ih - ih * g / 4; h += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y + '" y2="' + y + '" class="grid"/><text x="' + (padL - 6) + '" y="' + (y + 4) + '" class="ax" text-anchor="end">' + IH.esc(fmt(maxv * g / 4)) + '</text>'; }
    labels.forEach(function (lb, i) { h += '<text x="' + (padL + step * i) + '" y="' + (H - 8) + '" class="ax" text-anchor="middle">' + IH.esc(lb) + '</text>'; });
    series.forEach(function (s, k) {
      var col = s.color || COLORS[k % 6], pts = [];
      s.values.forEach(function (v, i) { if (v == null) return; pts.push([padL + step * i, padT + ih - ih * Math.min(v, maxv) / maxv, v]); });
      if (s.area && pts.length) h += '<path d="M' + pts[0][0] + ',' + (padT + ih) + ' ' + pts.map(function (p) { return 'L' + p[0] + ',' + p[1]; }).join(' ') + ' L' + pts[pts.length - 1][0] + ',' + (padT + ih) + ' Z" fill="' + col + '" opacity=".12"/>';
      h += '<polyline points="' + pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" fill="none" stroke="' + col + '" stroke-width="2.2"' + (s.dashed ? ' stroke-dasharray="6 5"' : '') + '/>';
      pts.forEach(function (p) { h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="' + col + '"><title>' + IH.esc(s.name + ': ' + fmt(p[2])) + '</title></circle>'; });
    });
    h += '</svg>';
    return '<div class="chartw">' + h + (o.legend === false ? '' : legend(series)) + '</div>';
  };

  /* prsten ostvarenja (do 150%) sa procentom u sredini */
  ui.ring = function (pct, o) {
    o = o || {};
    var size = o.size || 76, sw = o.sw || 8, r = (size - sw) / 2, c = 2 * Math.PI * r;
    var p = Math.max(0, Math.min(pct, 1.5)) / 1.5;
    var cls = pct >= 1 ? 'ok' : pct >= 0.8 ? 'warn' : 'bad';
    return '<span class="ring ' + cls + '" style="width:' + size + 'px;height:' + size + 'px"><svg viewBox="0 0 ' + size + ' ' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="bg" stroke-width="' + sw + '"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="fg" stroke-width="' + sw + '" stroke-dasharray="' + (c * p).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg><b>' + F.pct(pct) + '</b></span>';
  };

  /* kartica "koliko sam od targeta" */
  ui.targetCard = function (o) {
    var gap = o.target - o.ach, u = o.unit;
    var fmtU = function (v) { return u === 'RSD' ? short(v) + ' RSD' : F.num(v) + ' ' + IH.unitTxt(u); };
    var line;
    if (gap > 0) line = t('ch.toGo', { v: fmtU(gap) });
    else line = t('ch.over', { v: fmtU(-gap) });
    var next = o.next ? '<div class="tc-next">' + t('ch.nextTh', { th: F.pct(o.next.at), v: fmtU(Math.max(0, o.target * o.next.at - o.ach)) }) + '</div>' : (o.nextNone ? '<div class="tc-next">' + t('ch.maxTh') + '</div>' : '');
    return '<div class="tcard2' + (o.go ? ' click' : '') + '"' + (o.go ? ' data-go="' + o.go + '"' : '') + '>' + ui.ring(o.pct, { size: 70 }) + '<div class="tc-b"><b>' + IH.esc(o.name) + '</b><div class="tc-v">' + fmtU(o.ach) + ' <span class="mut">' + t('h.of') + ' ' + fmtU(o.target) + '</span></div><div class="tc-g ' + (gap > 0 ? '' : 'ok') + '">' + line + '</div>' + next + '</div></div>';
  };

  /* forma za pregled i izmenu — isti raspored; readonly prikazuje vrednosti u istim poljima */
  ui.form = function (fields, o) {
    o = o || {};
    var h = '<div class="form-grid' + (o.cols === 3 ? ' g3' : o.cols === 1 ? ' g1' : '') + '">';
    fields.forEach(function (f) {
      if (f.hidden) return;
      var id = 'fld-' + f.k, lab = '<label class="lab" for="' + id + '">' + f.label + (f.req && !o.readonly ? ' <span class="req">*</span>' : '') + '</label>';
      var val = f.value == null ? '' : f.value, disp = f.display != null ? f.display : val;
      var ctl;
      if (o.readonly || f.type === 'static') {
        if (f.type === 'toggle') disp = val ? t('c.yes') : t('c.no');
        else if (f.type === 'select' && f.options) { var op = f.options.filter(function (x) { return String(typeof x === 'string' ? x : x.v) === String(val); })[0]; if (op) disp = typeof op === 'string' ? op : op.l; }
        ctl = '<div class="in ro' + (f.type === 'textarea' ? ' ta' : '') + '" id="' + id + '">' + (disp === '' ? '<span class="mut">—</span>' : IH.esc(disp)) + '</div>';
      } else if (f.type === 'toggle') {
        var on = IH.form[f.k] != null ? IH.form[f.k] : !!val;
        ctl = '<div style="display:flex;align-items:center;gap:10px;min-height:36px"><button type="button" class="tg' + (on ? ' on' : '') + '" data-act="tg" data-arg="' + f.k + '" aria-pressed="' + on + '"><i></i></button><span class="mut">' + (f.hint || '') + '</span></div>';
      } else if (f.type === 'select') {
        var sel = IH.form[f.k] != null ? IH.form[f.k] : val;
        ctl = '<select class="in" id="' + id + '" data-k="' + f.k + '">' + (f.options || []).map(function (x) { var v = typeof x === 'string' ? x : x.v, l = typeof x === 'string' ? x : x.l; return '<option value="' + IH.esc(v) + '"' + (String(v) === String(sel) ? ' selected' : '') + '>' + IH.esc(l) + '</option>'; }).join('') + '</select>';
      } else if (f.type === 'textarea') {
        var cv = IH.form[f.k] != null ? IH.form[f.k] : val;
        ctl = '<textarea class="in' + (f.sug ? ' guided' : '') + '" id="' + id + '" data-k="' + f.k + '"' + (f.sug ? IH.guided.attr(f.sug) : '') + '>' + IH.esc(cv) + '</textarea>';
      } else {
        var cv2 = IH.form[f.k] != null ? IH.form[f.k] : val;
        ctl = '<input class="in' + (f.type === 'number' ? ' tnum' : '') + (f.sug ? ' guided' : '') + (f.sug && cv2 === f.sug ? ' filled' : '') + '" id="' + id + '" data-k="' + f.k + '"' + (f.type === 'date' ? ' type="date"' : '') + (f.sug ? IH.guided.attr(f.sug) : '') + ' value="' + IH.esc(cv2) + '">';
      }
      h += '<div class="field' + (f.full ? ' full' : '') + '">' + lab + ctl + (f.hint && !o.readonly && f.type !== 'toggle' ? '<div class="hint">' + f.hint + '</div>' : '') + '</div>';
    });
    return h + '</div>';
  };
  /* vrednosti iz forme (IH.form ima prednost nad početnim vrednostima) */
  ui.formValues = function (fields) {
    var out = {};
    fields.forEach(function (f) { out[f.k] = IH.form[f.k] != null ? IH.form[f.k] : f.value; });
    return out;
  };

  IH.addStrings({
    'ch.toGo': 'Do targeta još {v}', 'ch.over': 'Iznad targeta za {v}', 'ch.nextTh': 'Do praga {th}: još {v}', 'ch.maxTh': 'Najviši prag dostignut', 'h.of': 'od'
  }, {
    'ch.toGo': '{v} to target', 'ch.over': '{v} above target', 'ch.nextTh': 'To the {th} threshold: {v} more', 'ch.maxTh': 'Top threshold reached', 'h.of': 'of'
  });
})();
