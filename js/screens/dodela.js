/* Incentive Hub — Dodela i raspodela targeta (Administrator) i Targeti tima (Menadžer)
   Plan vrednosti u tri nivoa: regija → ekspozitura → zaposleni.
   Individualni target: regija se raspodeljuje na ekspoziture, ekspozitura na zaposlene; vrednost ekspoziture je zbir zaposlenih.
   Timski target: vrednost se zadaje ekspozituri ili je zbir dodela drugih targeta (definiše se u targetu).
   Vrednosti tekućeg i zaključenih perioda se ne menjaju; izmene važe za planirane periode. */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, EN = IH.engine, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2, V = IH.veze;

  IH.addStrings({
    'd.title': 'Dodela i raspodela targeta', 'd.newAsg': 'Nova dodela', 'd.import': 'Uvoz dodela', 'd.split': 'Raspodeli na bankare', 'd.splitR': 'Raspodeli na ekspoziture', 'd.splitTitle': 'Raspodela targeta ekspoziture na bankare', 'd.splitRTitle': 'Raspodela targeta regije na ekspoziture',
    'd.colCarrier': 'Nosilac', 'd.colType': 'Nivo', 'd.colBranch': 'Ekspozitura', 'd.colTarget': 'Target', 'd.colValue': 'Vrednost', 'd.colValid': 'Važi', 'd.colSource': 'Izvor', 'd.colApproved': 'Odobrio', 'd.colPeriod': 'Period',
    'd.srcCasc': 'Raspodela', 'd.srcMan': 'Ručno', 'd.srcImp': 'Uvoz', 'd.srcExc': 'Izuzetak', 'd.srcPlan': 'Plan banke', 'd.srcReg': 'Raspodela regije', 'd.srcSum': 'Zbir',
    'd.carrEmp': 'Zaposleni', 'd.carrTeam': 'Tim', 'd.carrBranch': 'Ekspozitura', 'd.carrRegion': 'Regija', 'd.fFind': 'Ime, ekspozitura',
    'd.w1': 'Targeti', 'd.w2': 'Nosioci', 'd.w3': 'Vrednosti', 'd.w4': 'Pregled i aktivacija', 'd.fCarr': 'Nosioci', 'd.colCarriers': 'Broj nosilaca', 'd.colPrev': 'Vrednost u {p}', 'd.vals': 'Vrednosti po nosiocu',
    'd.links': 'Veze u bonus šemi', 'd.noLinks': 'Target ne zavisi od drugih targeta i drugi targeti ne zavise od njega', 'd.linkCond': 'Pravilo', 'd.chk1': 'Izabrani su nosioci', 'd.chk2': 'Svaki nosilac ima vrednost veću od nule', 'd.chk3': 'Važi od {d} — tekući obračun se ne menja',
    'd.fPeriod': 'Period', 'd.notifyEmp': 'Obavesti nosioce', 'd.notifyMgr': 'Obavesti menadžere', 'd.activate': 'Aktiviraj dodelu',
    'd.colNew': 'Vrednost za {p}', 'd.colMembers': 'Članova', 'd.colMgr': 'Menadžer', 'd.diff': 'Razlika',
    'd.same': 'Ista vrednost za sve izabrane', 'd.apply': 'Primeni na sve', 'd.pick': 'Izaberite bar jednog nosioca', 'd.selInfo': 'Izabrano: {n}',
    'd.done': 'Dodela sačuvana: {t} · nosilaca: {n} · {d}', 'd.done1': 'Dodela sačuvana: {t} za {n} — {v} · {d}',
    'd.viewTitle': 'Dodela', 'd.sumRow': 'Zbir raspodele', 'd.targetRow': 'Target ekspoziture', 'd.targetRowR': 'Target regije', 'd.diffRow': 'Razlika', 'd.even': 'Ravnomerno', 'd.byPrev': 'Prema prethodnom ostvarenju', 'd.byStaff': 'Prema broju bankara', 'd.prev': 'Q3: {p}',
    'd.ok': 'Usklađeno', 'd.notDist': 'Nije raspodeljeno', 'd.readonly': 'Raspodela je poslata na odobrenje i ne može se menjati', 'd.sent': 'Raspodela za {p} poslata na odobrenje — {n}', 'd.draftSaved': 'Nacrt raspodele sačuvan',
    'd.mismatch': 'Zbir se ne poklapa sa nadređenim targetom', 'd.mismatchTxt': 'Kod targeta {k} razlika je {d}. Sistem može da raspodeli razliku proporcionalno i pošalje raspodelu na odobrenje.', 'd.fixSend': 'Raspodeli razliku i pošalji',
    'd.fromRegion': 'Target ekspoziture', 'd.fromRegionSub': 'Dodelio {n} · {d} · rok za raspodelu {r}', 'd.dist': 'Raspodela na bankare', 'd.distR': 'Raspodela na ekspoziture', 'd.approver': 'Odobrava',
    'd.approve': 'Odobri raspodelu', 'd.approved': 'Raspodela za {b} je odobrena', 'd.confirm': 'Potvrdi raspodelu', 'd.confirmed': 'Raspodela regije {r} za {p} je potvrđena', 'd.locked': 'Vrednosti tekućeg perioda se ne menjaju',
    'd.i1': 'Fajl', 'd.i2': 'Pregled', 'd.i3': 'Potvrda', 'd.iFile': 'Targeti_Q1_2027_Subotica_Cacak.xlsx', 'd.iRead': '26 redova pročitano · 1 list',
    'd.iSum': '{a} novih dodela · {b} izmena · {c} sa greškom', 'd.iErr1': 'HR broj ne postoji u organizaciji', 'd.iErr2': 'Duplirani red za istog zaposlenog i target', 'd.iCheck1': 'Struktura fajla i obavezne kolone', 'd.iCheck2': 'Zbir po ekspozituri odgovara targetu ekspoziture',
    'd.iConfirm': 'Potvrdi uvoz ({n} dodela)', 'd.iDone': 'Uvoz završen: {n} dodela primenjeno, 2 reda odbijena',
    'd.fTargets': 'Targeti', 'd.pickT': 'Izaberite bar jedan target', 'd.sameCarr': 'Zajedno se dodeljuju targeti istog nosioca i perioda: {c} · {p}', 'd.prevV': '{p}: {v}', 'd.nTargets': '{n} targeta', 'd.colAsg': 'Broj dodela',
    'd.doneN': 'Dodela sačuvana: {k} targeta · nosilaca: {n} · {d}', 'd.doneAppr': 'Dodela poslata na odobrenje — {n}', 'd.sendAppr': 'Pošalji na odobrenje',
    'd.noSch': 'Bez šeme', 'd.lockNoSch': '{n} nema raspoređenu šemu za {p}', 'd.lockNoT': 'Šema „{s}“ za {p} ne sadrži izabrane targete', 'd.noneOk': 'Nijedan nosilac nema izabrane targete u šemi za {p}',
    'd.impB': 'Uticaj na target ekspoziture', 'd.impR': 'Uticaj na target regije', 'd.colSumB': 'Zbir bankara posle dodele', 'd.colSumR': 'Zbir ekspozitura posle dodele',
    'd.chkFitB': 'Zbir bankara odgovara targetu ekspoziture', 'd.chkFitR': 'Zbir ekspozitura odgovara targetu regije', 'd.chkMoveB': 'Menja se target ekspoziture i regije', 'd.chkMoveR': 'Menja se target regije',
    'd.chkAppr': 'Ide na odobrenje: {n}', 'd.chkApprSub': 'Ponovo se odobrava raspodela: {b}', 'd.chkDraft': 'Ulazi u nacrt raspodele koji menadžer šalje na odobrenje: {b}', 'd.noLinksN': 'Izabrani targeti ne zavise od drugih targeta i drugi targeti ne zavise od njih',
    'tt.title': 'Targeti tima', 'tt.q4title': 'Targeti bankara — Q4 2026', 'tt.teamM3': 'Tim univerzalnih bankara — oktobar 2026'
  }, {
    'd.title': 'Target assignment and split', 'd.newAsg': 'New assignment', 'd.import': 'Import assignments', 'd.split': 'Split to bankers', 'd.splitR': 'Split to branches', 'd.splitTitle': 'Split of the branch target to bankers', 'd.splitRTitle': 'Split of the region target to branches',
    'd.colCarrier': 'Carrier', 'd.colType': 'Level', 'd.colBranch': 'Branch', 'd.colTarget': 'Target', 'd.colValue': 'Value', 'd.colValid': 'Valid', 'd.colSource': 'Source', 'd.colApproved': 'Approved by', 'd.colPeriod': 'Period',
    'd.srcCasc': 'Split', 'd.srcMan': 'Manual', 'd.srcImp': 'Import', 'd.srcExc': 'Exception', 'd.srcPlan': 'Bank plan', 'd.srcReg': 'Region split', 'd.srcSum': 'Sum',
    'd.carrEmp': 'Employee', 'd.carrTeam': 'Team', 'd.carrBranch': 'Branch', 'd.carrRegion': 'Region', 'd.fFind': 'Name, branch',
    'd.w1': 'Targets', 'd.w2': 'Carriers', 'd.w3': 'Values', 'd.w4': 'Review and activation', 'd.fCarr': 'Carriers', 'd.colCarriers': 'Number of carriers', 'd.colPrev': 'Value in {p}', 'd.vals': 'Values per carrier',
    'd.links': 'Links in the bonus scheme', 'd.noLinks': 'The target does not depend on other targets and no target depends on it', 'd.linkCond': 'Rule', 'd.chk1': 'Carriers are selected', 'd.chk2': 'Every carrier has a value above zero', 'd.chk3': 'Valid from {d} — the current calculation is not changed',
    'd.fPeriod': 'Period', 'd.notifyEmp': 'Notify carriers', 'd.notifyMgr': 'Notify managers', 'd.activate': 'Activate assignment',
    'd.colNew': 'Value for {p}', 'd.colMembers': 'Members', 'd.colMgr': 'Manager', 'd.diff': 'Difference',
    'd.same': 'Same value for all selected', 'd.apply': 'Apply to all', 'd.pick': 'Choose at least one carrier', 'd.selInfo': 'Selected: {n}',
    'd.done': 'Assignment saved: {t} · carriers: {n} · {d}', 'd.done1': 'Assignment saved: {t} for {n} — {v} · {d}',
    'd.viewTitle': 'Assignment', 'd.sumRow': 'Sum of split', 'd.targetRow': 'Branch target', 'd.targetRowR': 'Region target', 'd.diffRow': 'Difference', 'd.even': 'Evenly', 'd.byPrev': 'By previous achievement', 'd.byStaff': 'By number of bankers', 'd.prev': 'Q3: {p}',
    'd.ok': 'Balanced', 'd.notDist': 'Not distributed', 'd.readonly': 'The split is submitted for approval and cannot be changed', 'd.sent': 'Split for {p} submitted for approval — {n}', 'd.draftSaved': 'Split draft saved',
    'd.mismatch': 'The sum does not match the parent target', 'd.mismatchTxt': 'For target {k} the difference is {d}. The system can distribute the difference proportionally and submit the split for approval.', 'd.fixSend': 'Distribute difference and submit',
    'd.fromRegion': 'Branch target', 'd.fromRegionSub': 'Assigned by {n} · {d} · split due {r}', 'd.dist': 'Split to bankers', 'd.distR': 'Split to branches', 'd.approver': 'Approver',
    'd.approve': 'Approve split', 'd.approved': 'Split for {b} approved', 'd.confirm': 'Confirm split', 'd.confirmed': 'Split of region {r} for {p} confirmed', 'd.locked': 'Values of the current period do not change',
    'd.i1': 'File', 'd.i2': 'Preview', 'd.i3': 'Confirm', 'd.iFile': 'Targeti_Q1_2027_Subotica_Cacak.xlsx', 'd.iRead': '26 rows read · 1 sheet',
    'd.iSum': '{a} new assignments · {b} changes · {c} with errors', 'd.iErr1': 'HR number does not exist in the organisation', 'd.iErr2': 'Duplicate row for the same employee and target', 'd.iCheck1': 'File structure and mandatory columns', 'd.iCheck2': 'Sum per branch matches the branch target',
    'd.iConfirm': 'Confirm import ({n} assignments)', 'd.iDone': 'Import complete: {n} assignments applied, 2 rows rejected',
    'd.fTargets': 'Targets', 'd.pickT': 'Choose at least one target', 'd.sameCarr': 'Targets are assigned together only with the same carrier and period: {c} · {p}', 'd.prevV': '{p}: {v}', 'd.nTargets': '{n} targets', 'd.colAsg': 'Number of assignments',
    'd.doneN': 'Assignment saved: {k} targets · carriers: {n} · {d}', 'd.doneAppr': 'Assignment submitted for approval — {n}', 'd.sendAppr': 'Submit for approval',
    'd.noSch': 'No scheme', 'd.lockNoSch': '{n} has no scheme assigned for {p}', 'd.lockNoT': 'Scheme “{s}” for {p} does not contain the selected targets', 'd.noneOk': 'No carrier has the selected targets in a scheme for {p}',
    'd.impB': 'Impact on the branch target', 'd.impR': 'Impact on the region target', 'd.colSumB': 'Sum of bankers after assignment', 'd.colSumR': 'Sum of branches after assignment',
    'd.chkFitB': 'Sum of bankers matches the branch target', 'd.chkFitR': 'Sum of branches matches the region target', 'd.chkMoveB': 'The branch and region targets change', 'd.chkMoveR': 'The region target changes',
    'd.chkAppr': 'Goes for approval: {n}', 'd.chkApprSub': 'Split approved again: {b}', 'd.chkDraft': 'Added to the split draft the manager submits for approval: {b}', 'd.noLinksN': 'The selected targets do not depend on other targets and no target depends on them',
    'tt.title': 'Team targets', 'tt.q4title': 'Banker targets — Q4 2026', 'tt.teamM3': 'Universal banker team — October 2026'
  });

  function fmtU(v, unit) { return F.unit(v, unit); }
  function unitTxt(tg) { return IH.unitTxt(tg.unit); }
  function diffCell(d, unit) { if (Math.abs(d) < 0.5) return '<span class="sum-ok">' + t('d.ok') + '</span>'; return '<span class="sum-bad">' + (d > 0 ? '+' : '−') + fmtU(Math.abs(d), unit) + '</span>'; }
  function parseNum(s) { var n = String(s || '').replace(/[^\d]/g, ''); return n ? +n : 0; }
  /* period dodele: tekući i planirani periodi vrsta koje koriste aktivne šeme (iz kalendara Obračunskih perioda) */
  function PERS() {
    var tys = {}, ord = { Y: 0, H: 1, Q: 2, M: 3 };
    IH.schemes().forEach(function (s) { if (s.status === 'aktivan') tys[s.periodType] = 1; });
    return D.allPeriods().filter(function (p) { return tys[p.type] && (p.status === 'u_toku' || p.status === 'planiran'); })
      .sort(function (a, b) { return (a.from < b.from ? -1 : a.from > b.from ? 1 : 0) || ord[a.type] - ord[b.type]; }).map(function (p) { return { v: p.id, l: D.periodLabel(p.id) }; });
  }
  function perSel() { var cur = IH.v('asg').per || '2026-Q4'; return '<select class="in" data-asgper="1" style="width:auto;min-width:180px">' + PERS().map(function (o) { return '<option value="' + o.v + '"' + (o.v === cur ? ' selected' : '') + '>' + IH.esc(o.l) + '</option>'; }).join('') + '</select>'; }
  document.addEventListener('change', function (e) { if (e.target.dataset && e.target.dataset.asgper) { IH.v('asg').per = e.target.value; IH.render(); } });
  IH.asgPeriodLabel = function (p) { return D.periodLabel(p); };
  function editable(per) { return D.isPlanned(per); }

  /* ---------- koji targeti i nosioci važe u periodu ---------- */
  /* parametri šeme zaposlenog u periodu (planirana verzija važi od svog datuma) */
  function schemeIn(empId, pid) { var s = EN.schemeFor(empId, pid); return s ? D.schemeAt(s, pid) : null; }
  function usesT(empId, tid, pid) { var s = schemeIn(empId, pid); return !!s && s.targets.some(function (tc) { return tc.id === tid; }); }
  /* targeti koji u periodu ulaze u neku šemu (kao target ili kao uslov ekspoziture) */
  function targetsIn(pid) {
    var p = D.period(pid), ids = {};
    IH.schemes().filter(function (s) { return s.status === 'aktivan' && s.periodType === p.type; }).forEach(function (s0) {
      var s = D.schemeAt(s0, pid);
      s.targets.forEach(function (tc) { ids[tc.id] = 1; });
      EN.rulesOf(s).forEach(function (r) { if (r.target) ids[r.target] = 1; });
    });
    Object.keys(IH.state.data.vals || {}).forEach(function (k) { var q = k.split('|'); if (q[1] === pid) ids[q[0]] = 1; });
    return IH.targets().filter(function (x) { return ids[x.id] && x.status !== 'arhiviran'; });
  }
  IH.targetsIn = targetsIn;
  function staffFor(tg, bid, pid) { return D.branchStaff(bid, tg.pos || 'licni').filter(function (e) { return usesT(e.id, tg.id, pid); }); }
  function teamCarrier(tg) { return (tg.team || []).length === 1; }
  /* status raspodele: regija → ekspoziture i ekspozitura → bankari (planirani periodi) */
  function regStatus(rid, pid) { var m = IH.map('regionSplit'); return m[rid + '|' + pid] || 'odobreno'; }
  function brStatus(bid, pid) { if (pid === '2027-Q1') return D.status27(bid); return (IH.map('branchSplit') || {})[bid + '|' + pid] || 'odobreno'; }
  function head(rid) { return D.emp(D.region(rid).head); }

  /* ---------- redovi plana za period ---------- */
  function planRows(per) {
    var out = [], plan = editable(per), ov = IH.state.data.vals || {};
    targetsIn(per).forEach(function (tg) {
      var ind = tg.kind !== 'timski', vm = tg.value || {}, sum = !ind && vm.mode === 'zbir';
      D.regions.forEach(function (rg) {
        var brs = D.branches.filter(function (b) { return b.region === rg.id && (!ind || staffFor(tg, b.id, per).length); });
        if (!brs.length) return;
        var kR = D.valKey(tg.id, per, { region: rg.id });
        out.push({ id: kR, lvl: 'R', name: IH.L(rg.name), region: rg.id, branch: null, tg: tg, val: D.val(tg.id, per, { region: rg.id }), per: per, src: ov[kR] != null ? t('d.srcMan') : sum ? t('d.srcSum') : t('d.srcPlan'), appr: plan ? '' : head(rg.id).name, st: 'aktivna', canSplit: plan && (ind || !sum), canEdit: plan && !sum });
        brs.forEach(function (b) {
          var kB = D.valKey(tg.id, per, { branch: b.id }), rs = regStatus(rg.id, per);
          out.push({ id: kB, lvl: ind ? 'B' : teamCarrier(tg) ? 'T' : 'B', name: (!ind && teamCarrier(tg) ? t('d.carrTeam') + ' · ' : '') + D.branchShort(b), region: rg.id, branch: b.id, tg: tg, val: D.val(tg.id, per, { branch: b.id }), per: per,
            src: ov[kB] != null ? t('d.srcMan') : sum ? t('d.srcSum') : plan ? t('d.srcReg') : ind ? t('d.srcSum') : t('d.srcPlan'), appr: head(rg.id).name, st: plan ? (rs === 'odobreno' ? 'aktivna' : rs) : 'aktivna', canSplit: ind && (tg.pos || 'licni') === 'licni', canEdit: plan && !ind && !sum && rs !== 'na_odobravanju' });
          if (!ind) return;
          staffFor(tg, b.id, per).forEach(function (e) {
            var kE = D.valKey(tg.id, per, { emp: e.id }), bs = brStatus(b.id, per), ex = !plan && D.exceptionFor(e.id, per, tg.id);
            out.push({ id: kE, lvl: 'E', e: e, name: e.name, region: rg.id, branch: b.id, tg: tg, val: D.val(tg.id, per, { emp: e.id }), per: per, src: ov[kE] != null ? t('d.srcMan') : ex ? t('d.srcExc') : t('d.srcCasc'), appr: plan && bs !== 'odobreno' ? '' : head(rg.id).name, st: plan ? (bs === 'odobreno' ? 'aktivna' : bs) : 'aktivna', canEdit: plan && bs !== 'na_odobravanju', canApprove: bs === 'na_odobravanju' });
          });
        });
      });
    });
    return out;
  }
  var LVL = function (r) { return t({ R: 'd.carrRegion', B: 'd.carrBranch', T: 'd.carrTeam', E: 'd.carrEmp' }[r.lvl]); };
  function listPage() {
    var per = IH.v('asg').per || '2026-Q4';
    var acts = ui.btn(t('d.import'), { icon: 'upload', act: 'asg-imp' }) + ui.btn(t('d.newAsg'), { cls: 'primary', icon: 'plus', act: 'asg-new' });
    var grid = IH.grid({
      id: 'asg', exportName: 'Dodele_targeta.xlsx', searchLabel: t('d.fFind'), hidden: ['appr'],
      toolbarExtra: perSel(),
      rows: function () { return planRows(IH.v('asg').per || '2026-Q4'); }, key: function (r) { return r.id; }, label: function (r) { return r.name + ' · ' + IH.L(r.tg.name); }, searchKeys: ['c', 'b'],
      cols: [
        { key: 'st', label: t('c.status'), val: function (r) { return r.st; }, render: function (r) { return ui.st2(r.st) + (r.src === t('d.srcMan') ? ' ' + ui.pill(t('d.srcMan'), 'accent') : ''); }, filter: function () { return ['aktivna', 'na_odobravanju', 'nacrt'].map(function (k) { return { v: k, l: t('st2.' + k) }; }); } },
        { key: 'c', label: t('d.colCarrier'), val: function (r) { return r.name; }, render: function (r) { return r.lvl === 'E' ? IH.esc(r.name) : '<b>' + IH.esc(r.name) + '</b>'; } },
        { key: 'ct', label: t('d.colType'), val: LVL, fval: function (r) { return r.lvl; }, filter: function () { return [{ v: 'R', l: t('d.carrRegion') }, { v: 'B', l: t('d.carrBranch') }, { v: 'T', l: t('d.carrTeam') }, { v: 'E', l: t('d.carrEmp') }]; } },
        { key: 'b', label: t('d.colBranch'), val: function (r) { return r.branch ? D.branchShort(r.branch) : IH.L(D.region(r.region).name); }, fval: function (r) { return r.branch || ''; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }); } },
        { key: 't', label: t('d.colTarget'), val: function (r) { return IH.L(r.tg.name); }, fval: function (r) { return r.tg.id; }, filter: function () { return targetsIn(IH.v('asg').per || '2026-Q4').map(function (x) { return { v: x.id, l: IH.L(x.name) }; }); } },
        { key: 'v', label: t('d.colValue'), num: true, search: false, val: function (r) { return r.val; }, render: function (r) { return r.lvl === 'E' ? fmtU(r.val, r.tg.unit) : '<b>' + fmtU(r.val, r.tg.unit) + '</b>'; } },
        { key: 'va', label: t('d.colPeriod'), val: function (r) { return r.per; }, render: function (r) { return D.periodLabel(r.per); } },
        { key: 's', label: t('d.colSource'), val: function (r) { return r.src; }, filter: function () { return [t('d.srcPlan'), t('d.srcReg'), t('d.srcSum'), t('d.srcCasc'), t('d.srcMan'), t('d.srcExc')].map(function (x) { return { v: x, l: x }; }); } },
        { key: 'appr', label: t('d.colApproved'), val: function (r) { return r.appr; } }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'asg-view' },
        { icon: 'share', title: t('d.splitR'), act: 'asg-splitr', kind: 'acc', show: function (r) { return r.lvl === 'R' && r.canSplit; }, arg: function (r) { return r.region + '|' + r.per; } },
        { icon: 'share', title: t('d.split'), act: 'asg-split', kind: 'acc', show: function (r) { return r.lvl === 'B' && r.canSplit; }, arg: function (r) { return r.branch + '|' + r.per; } },
        { icon: 'checkc', title: t('d.approve'), act: 'asg-approve', kind: 'acc', show: function (r) { return r.lvl === 'E' && r.canApprove; }, arg: function (r) { return r.branch + '|' + r.per; } },
        { type: 'edit', title: t('g.aEdit'), act: 'asg-edit', kind: 'acc', show: function (r) { return r.canEdit; } },
        { type: 'history', title: t('g.aHistory'), act: 'asg-hist' }
      ]
    });
    return ui.header(t('d.title'), '', acts) + grid;
  }
  function rowById(id) { var per = id.split('|')[1]; return planRows(per).filter(function (r) { return r.id === id; })[0]; }
  function asgFields(r, ro) {
    return [
      { k: 'av_c', label: t('d.colCarrier'), type: 'static', value: r.name }, { k: 'av_ct', label: t('d.colType'), type: 'static', value: LVL(r) },
      { k: 'av_t', label: t('d.colTarget'), type: 'static', value: IH.L(r.tg.name) }, { k: 'av_p', label: t('d.colPeriod'), type: 'static', value: D.periodLabel(r.per) + ' (' + F.date(D.period(r.per).from) + ' – ' + F.date(D.period(r.per).to) + ')' },
      { k: 'av_v', label: t('d.colValue') + ' (' + unitTxt(r.tg) + ')', type: ro ? 'static' : 'number', value: F.num(r.val) },
      { k: 'av_sc', label: t('c.scheme'), type: 'static', value: D.schemesOf(r.tg.id).map(function (s) { return IH.L(s.name); }).join(', ') || t('tg.free') },
      { k: 'av_s', label: t('d.colSource'), type: 'static', value: r.src }, { k: 'av_a', label: t('d.colApproved'), type: 'static', value: r.appr }
    ];
  }
  function linksTable(tgs) {
    tgs = [].concat(tgs);
    var seen = {}, l = [];
    tgs.forEach(function (tg) { V.linksOf(tg.id).forEach(function (x) { var k = x.s.id + '|' + x.v.v + '|' + V.text(x.s, x.r); if (!seen[k]) { seen[k] = 1; l.push(x); } }); });
    if (!l.length) return '<div class="empty" style="padding:12px">' + t(tgs.length > 1 ? 'd.noLinksN' : 'd.noLinks') + '</div>';
    return ui.table([{ key: 's', label: t('c.scheme') }, { key: 'c', label: t('d.linkCond') }], l.map(function (x) { return { s: '<a href="#/seme/' + x.s.id + '" data-act="modal-close">' + IH.esc(IH.L(x.s.name)) + '</a> <span class="mut">v' + x.v.v + '</span>', c: V.text(x.s, x.r) }; }), { compact: true });
  }
  IH.targetLinks = function (tg) { return V.linksOf(tg.id); };
  function asgBody(r, ro) { return ui.form(asgFields(r, ro), { readonly: ro }) + '<div class="fsec" style="margin-top:14px"><h3>' + t('d.links') + '</h3>' + linksTable(r.tg) + '</div>'; }
  IH.act['asg-view'] = function (el) { var r = rowById(el.dataset.arg); if (!r) return; IH.modal({ title: t('d.viewTitle') + ' · ' + IH.esc(r.name), wide: true, body: asgBody(r, true), foot: (r.canEdit ? ui.btn(t('c.edit'), { icon: 'edit', act: 'asg-edit', arg: r.id }) : '') + ui.btn(t('c.close'), { act: 'modal-close' }) }); };
  IH.act['asg-edit'] = function (el) { var r = rowById(el.dataset.arg); if (!r || !r.canEdit) { IH.toast(t('d.locked')); return; } IH.form = {}; IH.closeModal(); IH.modal({ title: t('c.edit') + ' · ' + IH.esc(r.name) + ' · ' + IH.esc(IH.L(r.tg.name)), wide: true, body: asgBody(r, false), foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'asg-edit-save', arg: r.id }) }); };
  IH.act['asg-edit-save'] = function (el) {
    var r = rowById(el.dataset.arg); if (!r || !r.canEdit) return;
    var v = parseFloat(String(IH.form.av_v || '').replace(/\./g, '').replace(',', '.'));
    if (!isNaN(v)) IH.map('vals')[r.id] = v;
    IH.audit('assignment', r.id, { sr: 'Izmenjena dodela — ' + IH.L(r.tg.name), en: 'Assignment changed — ' + IH.L(r.tg.name) }, { sr: r.name + ' · ' + D.periodLabel(r.per) + ' · ' + fmtU(isNaN(v) ? r.val : v, r.tg.unit), en: r.name + ' · ' + D.periodLabel(r.per) + ' · ' + fmtU(isNaN(v) ? r.val : v, r.tg.unit) });
    EN.invalidate(); IH.save(); IH.closeModal(); IH.render(); IH.toast(t('c.saved'));
  };
  IH.act['asg-hist'] = function (el) { var r = rowById(el.dataset.arg); IH.showHistory(r ? r.name + ' · ' + IH.L(r.tg.name) : el.dataset.arg, IH.auditFor('assignment', el.dataset.arg).concat([{ at: '2026-09-28T10:00', by: r ? D.region(r.region).head : 'D001', action: { sr: 'Dodela odobrena', en: 'Assignment approved' } }])); };
  IH.act['asg-approve'] = function (el) {
    var p = el.dataset.arg.split('|'), bid = p[0], per = p[1];
    if (per === '2027-Q1') IH.map('plan27Status')[bid] = 'odobreno'; else IH.map('branchSplit')[bid + '|' + per] = 'odobreno';
    IH.audit('cascade', bid, { sr: 'Raspodela ' + D.periodLabel(per) + ' odobrena', en: D.periodLabel(per) + ' split approved' }, { sr: D.branchShort(bid), en: D.branchShort(bid) });
    IH.save(); IH.render(); IH.toast(t('d.approved', { b: IH.esc(D.branchShort(bid)) }));
  };

  /* ---------- čarobnjak nove dodele: target → nosioci → vrednosti → pregled ---------- */
  /* planirani periodi vrste targeta (dodela važi samo za planirane periode) */
  function aper(type) { return D.plannedOf(type).slice(0, 8).map(function (p) { return p.id; }); }
  function noPer() { return '<div class="note warn">' + t('pe.noPlanned') + ' — <a href="#/periodi">' + t('pe.toCal') + '</a></div>'; }
  function prevOf(pid) { var p = D.period(pid); if (!p) return null; var all = D.allPeriods().filter(function (x) { return x.type === p.type && x.from < p.from; }).sort(function (a, b) { return a.from < b.from ? 1 : -1; }); return all[0] ? all[0].id : null; }
  /* više targeta u jednoj dodeli: isti nosilac i isti period (redovi su nosioci, kolone targeti).
     Nova dodela je izuzetak uz raspodelu (novi zaposleni, premeštaj, korekcija):
     nosilac mora imati target u šemi za period, pregled pokazuje uticaj na nadređeni nivo,
     a izmena perioda koji već ima raspodelu ekspoziture ide na odobrenje kao i raspodela. */
  function AW() { if (!IH.form.aw) IH.form.aw = { tgs: ['TG-101'], sel: [], per: '2027-Q1', vals: {} }; return IH.form.aw; }
  function awTargets() { return AW().tgs.map(D.target).filter(Boolean); }
  function grpOf(tg) { return IH.targetCarrier(tg) + '|' + tg.periodType; }
  function ctOf(tg) { return tg.kind !== 'timski' ? 'emp' : 'br'; }
  function carriers(tg) {
    if (ctOf(tg) === 'emp') { var pos = tg.pos || 'licni'; return D.employees.filter(function (e) { return e.branch && e.pos === pos; }).map(function (e) { return { id: e.id, name: e.name, pos: e.pos, branch: e.branch, mgr: e.mgr, e: e, c: { emp: e.id } }; }); }
    return D.branches.map(function (b) { return { id: b.id, name: (teamCarrier(tg) ? t('d.carrTeam') + ' · ' : '') + D.branchShort(b), branch: b.id, n: D.employees.filter(function (e) { return e.branch === b.id && (tg.team || []).indexOf(e.pos) >= 0; }).length, mgr: D.branchManager(b.id).id, c: { branch: b.id } }; });
  }
  function cById(id) { var tg = awTargets()[0]; return tg ? carriers(tg).filter(function (c) { return c.id === id; })[0] : null; }
  /* target u šemi nosioca: zaposleni — njegova šema; tim ili ekspozitura — šema bar jednog člana */
  function hasT(s, tid) { return !!s && (s.targets.some(function (tc) { return tc.id === tid; }) || EN.rulesOf(s).some(function (r) { return r.target === tid; })); }
  function members(c, tg) { return c.e ? [c.e] : D.employees.filter(function (e) { return e.branch === c.branch && (tg.team || []).indexOf(e.pos) >= 0; }); }
  function cUses(c, tg, per) { return members(c, tg).some(function (e) { return hasT(schemeIn(e.id, per), tg.id); }); }
  function cOk(c) { var per = AW().per; return awTargets().some(function (tg) { return cUses(c, tg, per); }); }
  function cSchemes(c) { var tg = awTargets()[0], per = AW().per, l = []; if (!tg) return l; members(c, tg).forEach(function (e) { var s = EN.schemeFor(e.id, per); if (s && l.indexOf(s) < 0) l.push(s); }); return l; }
  function cells(sel, tgs) { var per = AW().per, out = []; tgs.forEach(function (tg) { sel.forEach(function (c) { if (cUses(c, tg, per)) out.push({ c: c, tg: tg }); }); }); return out; }
  function prevVal(c, tg) { var pv = prevOf(AW().per); return pv ? D.val(tg.id, pv, c.c) : null; }
  function newVal(c, tg) { var a = AW(), k = tg.id + '|' + c.id; if (a.vals[k] != null) return a.vals[k]; return D.val(tg.id, a.per, c.c) || prevVal(c, tg) || 0; }
  function tgNames(tgs) { return tgs.map(function (x) { return IH.L(x.name); }).join(', '); }
  function selOk() { return AW().sel.map(cById).filter(function (c) { return c && cOk(c); }); }
  /* izbor targeta: prvi izabrani određuje nosioca i period; promena nosioca briše izbor nosilaca i vrednosti */
  function setTargets(l) {
    var a = AW(), cur = awTargets(), g0 = cur.length ? grpOf(cur[0]) : null;
    var anchor = l.map(D.target).filter(function (x) { return x && (!g0 || grpOf(x) === g0); })[0] || D.target(l[0]);
    l = l.filter(function (id) { var x = D.target(id); return x && anchor && grpOf(x) === grpOf(anchor); });
    a.tgs = l;
    if (!anchor || grpOf(anchor) !== g0) { a.sel = []; a.vals = {}; if (anchor) a.per = aper(anchor.periodType)[0] || null; }
    a.sel = selOk().map(function (c) { return c.id; });
  }

  /* uticaj na nadređeni nivo: zaposleni → target ekspoziture, tim ili ekspozitura → target regije.
     Nadređeni target je fiksan ako ga je zadala regija (ili plan banke za Q1 2027); inače je zbir i menja se sa dodelom. */
  function parentFixed(tg, per, pc) { return D.valOv(tg.id, per, pc) != null || !!(pc.branch && per === '2027-Q1' && D.M1_KEY[tg.id]); }
  function impact() {
    var a = AW(), tgs = awTargets(), sel = selOk(), emp = tgs[0] && ctOf(tgs[0]) === 'emp', out = [];
    tgs.forEach(function (tg) {
      var groups = {}, order = [];
      sel.filter(function (c) { return cUses(c, tg, a.per); }).forEach(function (c) { var pid = emp ? c.branch : D.branch(c.branch).region; if (!groups[pid]) { groups[pid] = {}; order.push(pid); } groups[pid][c.id] = c; });
      order.forEach(function (pid) {
        var pc = emp ? { branch: pid } : { region: pid };
        var kids = emp ? D.branchStaff(pid, tg.pos || 'licni').map(function (e) { return { id: e.id, c: { emp: e.id } }; }) : D.branches.filter(function (b) { return b.region === pid; }).map(function (b) { return { id: b.id, c: { branch: b.id } }; });
        var sum = kids.reduce(function (s, k) { var c = groups[pid][k.id]; return s + (c ? newVal(c, tg) : D.val(tg.id, a.per, k.c)); }, 0);
        var before = D.val(tg.id, a.per, pc), fixed = parentFixed(tg, a.per, pc);
        out.push({ name: emp ? D.branchShort(pid) : IH.L(D.region(pid).name), tg: tg, ti: tgs.indexOf(tg), before: before, after: fixed ? before : sum, sum: sum, fixed: fixed });
      });
    });
    /* redosled: ekspozitura (regija), pa target */
    var po = []; out.forEach(function (r) { if (po.indexOf(r.name) < 0) po.push(r.name); });
    return out.sort(function (x, y) { return po.indexOf(x.name) - po.indexOf(y.name) || x.ti - y.ti; });
  }
  /* ekspoziture čija raspodela za period već postoji: odobrena ili poslata → ponovo na odobrenje; nacrt → dodela ulazi u nacrt */
  function hasSplit(bid, per) { return per === '2027-Q1' || (IH.map('branchSplit') || {})[bid + '|' + per] != null; }
  function apprOf() {
    var a = AW(), tgs = awTargets(), r = { appr: [], draft: [], heads: [] };
    if (!tgs[0] || ctOf(tgs[0]) !== 'emp' || !editable(a.per)) return r;
    selOk().forEach(function (c) {
      if (!hasSplit(c.branch, a.per) || r.appr.indexOf(c.branch) >= 0 || r.draft.indexOf(c.branch) >= 0) return;
      if (brStatus(c.branch, a.per) === 'nacrt') r.draft.push(c.branch);
      else { r.appr.push(c.branch); var h = head(D.branch(c.branch).region).name; if (r.heads.indexOf(h) < 0) r.heads.push(h); }
    });
    return r;
  }

  function step1() {
    var list = IH.targets().filter(function (x) { return x.status === 'aktivan' && !(x.value && x.value.mode === 'zbir'); });
    return IH.grid({ id: 'aw-tg', exportName: 'Targeti.xlsx', searchLabel: t('tg.search'), rows: function () { return list; }, key: function (x) { return x.id; }, label: function (x) { return IH.L(x.name); }, searchKeys: ['n'], actions: [],
      select: { get: function () { return AW().tgs; }, set: setTargets, onChange: function () { IH.render(); },
        disabled: function (x) { var f = awTargets()[0]; return !!f && grpOf(f) !== grpOf(x); },
        disabledMsg: function () { var f = awTargets()[0]; return t('d.sameCarr', { c: IH.targetCarrier(f), p: t('per.' + f.periodType) }); } },
      cols: [
        { key: 'n', label: t('c.target'), val: function (x) { return IH.L(x.name); }, render: function (x) { return '<b>' + IH.esc(IH.L(x.name)) + '</b>'; } },
        { key: 'k', label: t('tg.colKind'), val: function (x) { return x.kind === 'timski' ? t('k.team') : t('k.ind'); }, fval: function (x) { return x.kind; }, filter: function () { return [{ v: 'individualni', l: t('k.ind') }, { v: 'timski', l: t('k.team') }]; } },
        { key: 'c', label: t('tg.colCarrier'), val: function (x) { return IH.targetCarrier(x); }, filter: function () { var o = []; list.forEach(function (x) { var c = IH.targetCarrier(x); if (!o.some(function (q) { return q.v === c; })) o.push({ v: c, l: c }); }); return o; } },
        { key: 'pt', label: t('tg.colPt'), val: function (x) { return D.subjPtypeName(x.subject); }, fval: function (x) { return x.subject.ptype || 'mix'; }, filter: function () { return D.ptypes.map(function (p) { return { v: p.id, l: IH.L(p.name) }; }).concat([{ v: 'mix', l: D.ptypeName(null) }]); } },
        { key: 'p', label: t('c.period'), val: function (x) { return t('per.' + x.periodType); } },
        { key: 'u', label: t('c.unit'), val: function (x) { return unitTxt(x); } },
        { key: 's', label: t('c.scheme'), val: function (x) { var l = D.schemesOf(x.id); return l.length ? l.map(function (q) { return q.code; }).join(', ') : t('tg.free'); } }
      ] });
  }
  function perSelect(tg) {
    var a = AW();
    return '<select class="in" data-aw="per">' + aper(tg.periodType).map(function (o) { var p = D.period(o); return '<option value="' + o + '"' + (o === a.per ? ' selected' : '') + '>' + IH.esc(D.periodLabel(o)) + ' (' + F.date(p.from) + ' – ' + F.date(p.to) + ')</option>'; }).join('') + '</select>';
  }
  function step2() {
    var a = AW(), tgs = awTargets(), tg = tgs[0];
    if (!tg) return '<div class="note warn">' + t('d.pickT') + '</div>';
    if (!aper(tg.periodType).length) return noPer();
    var ct = ctOf(tg), gid = 'aw-' + ct + '-' + (tg.pos || (tg.team || []).join('-')) + '-' + tg.periodType;
    var cols = [{ key: 'n', label: t('d.colCarrier'), val: function (c) { return c.name; }, render: function (c) { return '<b>' + IH.esc(c.name) + '</b>' + (c.e && c.e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } }];
    cols.push({ key: 'br', label: t('d.colBranch'), val: function (c) { return D.branchShort(c.branch); }, fval: function (c) { return c.branch; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }); } });
    cols.push({ key: 'rg', label: t('c.region'), val: function (c) { return IH.L(D.region(D.branch(c.branch).region).name); }, fval: function (c) { return D.branch(c.branch).region; }, filter: function () { return D.regions.map(function (r) { return { v: r.id, l: IH.L(r.name) }; }); } });
    if (ct !== 'emp') cols.push({ key: 'm', label: t('d.colMembers'), num: true, search: false, val: function (c) { return c.n; } });
    cols.push({ key: 'sc', label: t('c.scheme'), val: function (c) { var l = cSchemes(c); return l.length ? l.map(function (s) { return IH.L(s.name); }).join(', ') : t('d.noSch'); },
      render: function (c) { var l = cSchemes(c); return l.length ? IH.esc(l.map(function (s) { return IH.L(s.name); }).join(', ')) : ui.pill(t('d.noSch'), 'warning'); } });
    cols.push({ key: 'mg', label: t('d.colMgr'), val: function (c) { return c.mgr ? D.emp(c.mgr).name : ''; } });
    var hd = '<div class="form-grid g3"><div class="field"><label class="lab">' + t('d.fPeriod') + '</label>' + perSelect(tg) + '</div>' +
      '<div class="field"><label class="lab">' + t('d.fTargets') + '</label><div class="in ro">' + IH.esc(tgNames(tgs)) + '</div></div>' +
      '<div class="field"><label class="lab">' + t('d.fCarr') + '</label><div class="in ro">' + IH.esc(IH.targetCarrier(tg)) + '</div></div></div>';
    var none = !carriers(tg).some(cOk) ? '<div class="note warn">' + t('d.noneOk', { p: D.periodLabel(a.per) }) + '</div>' : '';
    return hd + none + IH.grid({ id: gid, exportName: 'Nosioci.xlsx', searchLabel: t('d.fFind'), rows: function () { return carriers(tg); }, key: function (c) { return c.id; }, label: function (c) { return c.name; }, searchKeys: ['n', 'mg'], cols: cols, actions: [],
      select: { get: function () { return AW().sel; }, set: function (l) { AW().sel = l; }, onChange: function () { IH.render(); },
        disabled: function (c) { return !cOk(c); },
        disabledMsg: function (c) { var l = cSchemes(c), p = D.periodLabel(AW().per); return l.length ? t('d.lockNoT', { s: l.map(function (s) { return IH.L(s.name); }).join(', '), p: p }) : t('d.lockNoSch', { n: c.name, p: p }); } } });
  }
  function step3() {
    var a = AW(), tgs = awTargets(), sel = selOk(), pv = prevOf(a.per);
    if (!tgs.length) return '<div class="note warn">' + t('d.pickT') + '</div>';
    if (!D.period(a.per)) return noPer();
    if (!sel.length) return '<div class="note warn">' + t('d.pick') + '</div>';
    var inp = 'style="width:130px;margin-left:auto;display:block" class="in cell tnum"', dash = '<span class="mut">—</span>';
    var th = '<tr><th>' + t('d.colCarrier') + '</th><th>' + t('d.colBranch') + '</th>' + tgs.map(function (tg) { return '<th class="num">' + IH.esc(IH.L(tg.name)) + ' (' + unitTxt(tg) + ')</th>'; }).join('') + '</tr>';
    var all = sel.length > 1 ? '<tr class="lvl-0"><td colspan="2">' + t('d.same') + '</td>' + tgs.map(function (tg) { var f = sel.filter(function (c) { return cUses(c, tg, a.per); })[0]; return '<td class="num">' + (f ? '<input ' + inp + ' data-awall="' + tg.id + '" placeholder="' + F.num(newVal(f, tg)) + '">' : dash) + '</td>'; }).join('') + '</tr>' : '';
    var rows = sel.map(function (c) {
      return '<tr><td class="nw"><b>' + IH.esc(c.name) + '</b></td><td class="nw">' + IH.esc(D.branchShort(c.branch)) + '</td>' + tgs.map(function (tg) {
        if (!cUses(c, tg, a.per)) return '<td class="num">' + dash + '</td>';
        var p = prevVal(c, tg);
        return '<td class="num"><input ' + inp + ' data-awv="' + tg.id + '|' + c.id + '" value="' + F.num(newVal(c, tg)) + '">' + (pv && p != null ? '<div class="mut nw" style="font-size:11.5px;margin-top:3px">' + t('d.prevV', { p: D.periodLabel(pv), v: F.num(p) }) + '</div>' : '') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    var foot = '<tr class="lvl-0"><td colspan="2">' + t('c.total') + '</td>' + tgs.map(function (tg) { return '<td class="num">' + fmtU(sel.reduce(function (s, c) { return s + (cUses(c, tg, a.per) ? newVal(c, tg) : 0); }, 0), tg.unit) + '</td>'; }).join('') + '</tr>';
    return '<div class="form-grid g3"><div class="field"><label class="lab">' + t('d.fPeriod') + '</label><div class="in ro">' + IH.esc(D.periodLabel(a.per)) + ' (' + F.date(D.period(a.per).from) + ' – ' + F.date(D.period(a.per).to) + ')</div></div></div>' +
      '<div class="tbl-wrap"><table class="t"><thead>' + th + '</thead><tbody>' + all + rows + '</tbody><tfoot>' + foot + '</tfoot></table></div>' +
      '<div class="fsec" style="margin-top:16px"><h3>' + t('d.links') + '</h3>' + linksTable(tgs) + '</div>';
  }
  function step4() {
    var a = AW(), tgs = awTargets(), tg = tgs[0], sel = selOk(), p = D.period(a.per);
    if (!tg) return '<div class="note warn">' + t('d.pickT') + '</div>';
    if (!p) return noPer();
    var cl = cells(sel, tgs), emp = ctOf(tg) === 'emp', imp = impact(), ap = apprOf(), dash = '<span class="mut">—</span>';
    var dTxt = function (r, d) { return IH.esc(r.name) + ' · ' + IH.esc(IH.L(r.tg.name)) + ': ' + d; };
    var mism = imp.filter(function (r) { return r.fixed && Math.abs(r.sum - r.before) > 0.5; });
    var moved = imp.filter(function (r) { return !r.fixed && Math.abs(r.after - r.before) > 0.5; });
    var chk = [{ label: t('d.chk1'), state: sel.length ? 'ok' : 'no', sub: t('d.selInfo', { n: sel.length }) }, { label: t('d.chk2'), state: cl.every(function (x) { return newVal(x.c, x.tg) > 0; }) ? 'ok' : 'no' }];
    chk.push({ label: t(emp ? 'd.chkFitB' : 'd.chkFitR'), state: mism.length ? 'warn' : 'ok', sub: mism.length ? mism.map(function (r) { var d = r.sum - r.before; return dTxt(r, (d > 0 ? '+' : '−') + fmtU(Math.abs(d), r.tg.unit)); }).join(' · ') : null });
    if (moved.length) chk.push({ label: t(emp ? 'd.chkMoveB' : 'd.chkMoveR'), state: 'warn', sub: moved.map(function (r) { return dTxt(r, fmtU(r.before, r.tg.unit) + ' → ' + fmtU(r.after, r.tg.unit)); }).join(' · ') });
    if (ap.appr.length) chk.push({ label: t('d.chkAppr', { n: IH.esc(ap.heads.join(', ')) }), sub: t('d.chkApprSub', { b: ap.appr.map(D.branchShort).join(', ') }) });
    if (ap.draft.length) chk.push({ label: t('d.chkDraft', { b: ap.draft.map(D.branchShort).join(', ') }) });
    chk.push({ label: t('d.chk3', { d: F.date(p.from) }) });
    var summary = ui.form([{ k: 'as_t', label: t('d.fTargets'), value: tgNames(tgs) }, { k: 'as_k', label: t('tg.colKind'), value: tg.kind === 'timski' ? t('k.team') : t('k.ind') }, { k: 'as_c', label: t('d.fCarr'), value: IH.targetCarrier(tg) }, { k: 'as_p', label: t('d.fPeriod'), value: D.periodLabel(a.per) + ' (' + F.date(p.from) + ' – ' + F.date(p.to) + ')' }, { k: 'as_n', label: t('d.colCarriers'), value: String(sel.length) }, { k: 'as_a', label: t('d.colAsg'), value: String(cl.length) }], { readonly: true, cols: 3 });
    var cols = [{ key: 'n', label: t('d.colCarrier') }, { key: 'b', label: t('d.colBranch') }].concat(tgs.map(function (x) { return { key: x.id, label: IH.esc(IH.L(x.name)) + ' (' + unitTxt(x) + ')', num: true }; }));
    var rows = sel.map(function (c) { var r = { n: IH.esc(c.name), b: IH.esc(D.branchShort(c.branch)) }; tgs.forEach(function (x) { r[x.id] = cUses(c, x, a.per) ? fmtU(newVal(c, x), x.unit) : dash; }); return r; });
    var ft = { n: t('c.total') }; tgs.forEach(function (x) { ft[x.id] = '<b>' + fmtU(cl.filter(function (q) { return q.tg === x; }).reduce(function (s, q) { return s + newVal(q.c, x); }, 0), x.unit) + '</b>'; });
    var impCols = [{ key: 'n', label: emp ? t('d.colBranch') : t('c.region') }, { key: 't', label: t('d.colTarget') }, { key: 'p', label: t(emp ? 'd.targetRow' : 'd.targetRowR'), num: true }, { key: 's', label: t(emp ? 'd.colSumB' : 'd.colSumR'), num: true }, { key: 'd', label: t('d.diff'), num: true }];
    var impRows = imp.map(function (r) { return { n: IH.esc(r.name), t: IH.esc(IH.L(r.tg.name)), p: r.fixed || Math.abs(r.after - r.before) < 0.5 ? fmtU(r.before, r.tg.unit) : fmtU(r.before, r.tg.unit) + ' → <b>' + fmtU(r.after, r.tg.unit) + '</b>', s: fmtU(r.sum, r.tg.unit), d: diffCell(r.sum - r.after, r.tg.unit) }; });
    return ui.checks(chk) + '<div class="hr"></div>' + summary + '<div class="fsec" style="margin-top:14px"><h3>' + t('d.vals') + '</h3>' + ui.table(cols, rows, { compact: true, foot: ft }) + '</div>' +
      '<div class="fsec"><h3>' + t(emp ? 'd.impB' : 'd.impR') + '</h3>' + ui.table(impCols, impRows, { compact: true }) + '</div>' +
      '<div class="fsec"><h3>' + t('d.links') + '</h3>' + linksTable(tgs) + '</div>' +
      '<div class="form-grid" style="margin-top:4px">' + ui.toggle('a_n1', t('d.notifyEmp'), true) + ui.toggle('a_n2', t('d.notifyMgr'), true) + '</div>';
  }
  function wizardPage(step) {
    var a = AW(), cur = Math.max(0, Math.min(3, (+step || 1) - 1));
    var steps = [{ label: t('d.w1') }, { label: t('d.w2') }, { label: t('d.w3') }, { label: t('d.w4') }];
    var body = [step1, step2, step3, step4][cur]();
    var tgs = awTargets(), crumb = tgs.length === 1 ? IH.esc(IH.L(tgs[0].name)) : tgs.length ? t('d.nTargets', { n: tgs.length }) : '', n = selOk().length;
    return ui.header(t('d.newAsg'), '', '', '<a href="#/dodela-targeta">' + t('d.title') + '</a>' + (crumb ? ' ' + ic('chevr') + ' ' + crumb : '') + (n ? ' <span class="mut">· ' + t('d.selInfo', { n: n }) + '</span>' : '')) +
      ui.wizard({ base: 'dodela-targeta/nova', steps: steps, cur: cur, body: '<div id="aw-body">' + body + '</div>', finishLabel: apprOf().appr.length ? t('d.sendAppr') : t('d.activate'), finishAct: 'asg-save', cancelGo: 'dodela-targeta' });
  }
  IH.startAssignFor = function (tgId) { var tg = D.target(tgId); IH.form = {}; if (!tg || tg.value && tg.value.mode === 'zbir') { IH.go('dodela-targeta'); return; } IH.form.aw = { tgs: [tgId], sel: [], per: aper(tg.periodType)[0], vals: {} }; IH.go('dodela-targeta/nova/2'); };
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}; if (!IH.form.aw) return;
    var num = function (s) { return parseFloat(String(s).replace(/\./g, '').replace(',', '.')); };
    if (d.awv) { var v = num(e.target.value); if (!isNaN(v)) IH.form.aw.vals[d.awv] = v; IH.render(); }
    if (d.awall) { var w = num(e.target.value), a = AW(), tg = D.target(d.awall); if (!isNaN(w)) selOk().forEach(function (c) { if (cUses(c, tg, a.per)) a.vals[d.awall + '|' + c.id] = w; }); IH.render(); }
    if (d.aw === 'per') { var b = AW(); b.per = e.target.value; b.vals = {}; b.sel = selOk().map(function (c) { return c.id; }); IH.render(); }
  });
  IH.act['asg-new'] = function () { IH.form = {}; IH.go('dodela-targeta/nova/1'); };
  IH.act['asg-save'] = function () {
    var a = AW(), tgs = awTargets(), sel = selOk(), cl = cells(sel, tgs), ap = apprOf();
    if (!tgs.length) { IH.toast(t('d.pickT')); IH.go('dodela-targeta/nova/1'); return; }
    if (!D.period(a.per)) { IH.toast(t('pe.noPlanned')); return; }
    if (!cl.length) { IH.toast(t('d.pick')); IH.go('dodela-targeta/nova/2'); return; }
    cl.forEach(function (x) {
      var v = newVal(x.c, x.tg), k = D.valKey(x.tg.id, a.per, x.c.c);
      IH.map('vals')[k] = v;
      IH.audit('assignment', k, { sr: 'Nova dodela — ' + IH.L(x.tg.name) + ' · ' + fmtU(v, x.tg.unit), en: 'New assignment — ' + IH.L(x.tg.name) + ' · ' + fmtU(v, x.tg.unit) }, { sr: x.c.name + ' · ' + D.periodLabel(a.per), en: x.c.name + ' · ' + D.periodLabel(a.per) });
    });
    /* izmena postojeće raspodele ekspoziture ponovo ide na odobrenje direktoru regije */
    ap.appr.forEach(function (bid) {
      if (a.per === '2027-Q1') IH.map('plan27Status')[bid] = 'na_odobravanju'; else IH.map('branchSplit')[bid + '|' + a.per] = 'na_odobravanju';
      var hd = head(D.branch(bid).region);
      IH.audit('cascade', bid, { sr: 'Raspodela ' + D.periodLabel(a.per) + ' izmenjena novom dodelom — na odobrenju', en: D.periodLabel(a.per) + ' split changed by a new assignment — pending approval' }, { sr: 'Odobrava: ' + hd.name, en: 'Approver: ' + hd.name });
    });
    var tg = tgs[0], one = cl.length === 1, msg = ap.appr.length ? t('d.doneAppr', { n: IH.esc(ap.heads.join(', ')) })
      : tgs.length > 1 ? t('d.doneN', { k: tgs.length, n: sel.length, d: D.periodLabel(a.per) })
      : one ? t('d.done1', { t: IH.esc(IH.L(tg.name)), n: IH.esc(cl[0].c.name), v: fmtU(newVal(cl[0].c, tg), tg.unit), d: D.periodLabel(a.per) }) : t('d.done', { t: IH.esc(IH.L(tg.name)), n: sel.length, d: D.periodLabel(a.per) });
    EN.invalidate(); IH.v('asg').per = a.per; IH.form = {}; IH.save();
    IH.go('dodela-targeta'); IH.toast(msg);
  };

  /* ---------- raspodela: ekspozitura → bankari (admin i menadžer) ---------- */
  /* targeti raspodele: individualni targeti savetnika u šemama ekspoziture za period */
  function splitTargets(bid, per) {
    var ids = [];
    D.branchStaff(bid, 'licni').forEach(function (e) { var s = schemeIn(e.id, per); (s ? s.targets : []).forEach(function (tc) { var x = D.target(tc.id); if (x && x.kind !== 'timski' && ids.indexOf(x.id) < 0) ids.push(x.id); }); });
    return ids.map(D.target);
  }
  function q3pct(empId, tid) { var r = EN.result(empId, '2026-Q3'), x = (r.targets || []).filter(function (q) { return q.id === tid; })[0]; return x ? x.pct : null; }
  function splitBody(bid, per, isMgr) {
    var lic = D.branchStaff(bid, 'licni'), plan = editable(per), st = plan ? brStatus(bid, per) : 'odobreno', locked = st !== 'nacrt', tgs = splitTargets(bid, per);
    var rg = D.branch(bid).region, hd = head(rg);
    var bt = {}; tgs.forEach(function (tg) { bt[tg.id] = D.val(tg.id, per, { branch: bid }); });
    var top = '<div class="kpis" style="margin:0">' + tgs.map(function (tg) { return ui.kpi(IH.esc(IH.L(tg.name)), tg.unit === 'RSD' ? F.mio(bt[tg.id]) + '<span class="u">RSD</span>' : F.num(bt[tg.id]) + '<span class="u">' + IH.unitTxt(tg.unit) + '</span>'); }).join('') + '</div>';
    var rows = lic.map(function (e) {
      var r = '<tr><td class="nw"><b>' + IH.esc(e.name) + '</b></td>';
      tgs.forEach(function (tg) {
        if (!usesT(e.id, tg.id, per)) { r += '<td class="num mut">—</td><td></td>'; return; }
        var sug = F.num(D.val(tg.id, per, { emp: e.id })), key = 'sp|' + e.id + '|' + tg.id, cur = IH.form[key] != null ? IH.form[key] : (locked ? sug : ''), pq = q3pct(e.id, tg.id);
        r += '<td class="num">' + (locked ? '<b>' + sug + '</b>' : '<input style="width:130px;margin-left:auto;display:block" class="in cell guided' + (cur === sug ? ' filled' : '') + '" data-sp2="' + e.id + '|' + tg.id + '" data-k="' + key + '"' + IH.guided.attr(sug) + ' value="' + IH.esc(cur) + '">') + '</td><td class="mut nw">' + (pq != null ? t('d.prev', { p: F.pct(pq) }) : '') + '</td>';
      });
      return r + '</tr>';
    }).join('');
    var sumRow = '<tr class="lvl-0"><td>' + t('d.sumRow') + '</td>' + tgs.map(function (tg) { return '<td class="num" id="ss-' + tg.id + '"></td><td></td>'; }).join('') + '</tr>';
    var tgtRow = '<tr><td>' + t('d.targetRow') + '</td>' + tgs.map(function (tg) { return '<td class="num">' + fmtU(bt[tg.id], tg.unit) + '</td><td></td>'; }).join('') + '</tr>';
    var diffRow = '<tr><td><b>' + t('d.diffRow') + '</b></td>' + tgs.map(function (tg) { return '<td class="num" id="sd-' + tg.id + '"></td><td></td>'; }).join('') + '</tr>';
    var tbl = '<div class="tbl-wrap"><table class="t"><thead><tr><th>' + t('c.employee') + '</th>' + tgs.map(function (tg) { return '<th class="num">' + IH.esc(IH.L(tg.name)) + (tg.unit === 'RSD' ? ' (RSD)' : tg.unit === 'bod' ? ' (' + IH.unitTxt('bod') + ')' : '') + '</th><th></th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody><tfoot>' + sumRow + tgtRow + diffRow + '</tfoot></table></div>';
    var acts = locked ? ui.st2(st) : ui.btn(t('d.even'), { cls: 'sm', act: 'sp-fill', arg: 'even|' + bid + '|' + per }) + ui.btn(t('d.byPrev'), { cls: 'sm', act: 'sp-fill', arg: 'q3|' + bid + '|' + per });
    var foot = locked ? '<div class="wz-foot"><span class="left">' + (plan ? t('d.readonly') : t('d.locked')) + '</span></div>' : '<div class="wz-foot"><span class="left">' + t('wz.hint') + '</span>' + ui.btn(t('c.saveDraft'), { act: 'sp-draft', arg: bid + '|' + per }) + ui.btn(t('c.sendApproval'), { cls: 'primary', icon: 'send', act: 'sp-send', arg: bid + '|' + per }) + '</div>';
    var info = ui.card(t('d.fromRegion') + ' — ' + IH.esc(D.branchShort(bid)) + ' · ' + D.periodLabel(per), top, { actions: (per === '2027-Q1' ? '<span class="mut">' + t('d.fromRegionSub', { n: IH.esc(hd.name), d: F.date(D.plan27.received), r: F.date(D.plan27.deadline) }) + '</span> ' : '') + (locked ? '' : ui.pill(t('d.notDist'), 'warning')) });
    return info + '<section class="card"><div class="ch"><h2>' + t('d.dist') + '</h2>' + acts + '</div><div class="cb flush">' + tbl + '</div>' + foot + '</section>';
  }
  function splitPage(arg) {
    var p = (arg || '').split('|'), bid = p[0] || 'B01', per = p[1] || '2027-Q1';
    var pers = ui.segf('tt-' + bid, 'per', [{ v: '2027-Q1', l: 'Q1 2027' }, { v: '2026-Q4', l: 'Q4 2026' }]);
    IH.v('tt-' + bid).per = IH.v('tt-' + bid).per || per;
    IH.refreshers['tt-' + bid] = function () { IH.go('dodela-targeta/raspodela/' + bid + '|' + (IH.v('tt-' + bid).per || '2027-Q1')); };
    return ui.header(t('d.splitTitle'), '', '', '<a href="#/dodela-targeta">' + t('d.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(D.branchShort(bid))) + '<div style="margin-bottom:16px">' + pers + '</div>' + splitBody(bid, per, false);
  }
  IH.act['asg-split'] = function (el) { var p = el.dataset.arg.split('|'); IH.v('tt-' + p[0]).per = p[1]; IH.go('dodela-targeta/raspodela/' + el.dataset.arg); };
  function inputsOf(tid) { return document.querySelectorAll('[data-sp2$="|' + tid + '"]'); }
  function updSums(bid, per) {
    splitTargets(bid, per).forEach(function (tg) {
      var sum = 0, any = false, ins = inputsOf(tg.id);
      ins.forEach(function (el) { if (el.value) any = true; sum += parseNum(el.value); });
      if (!ins.length) { sum = D.branchStaff(bid, 'licni').filter(function (e) { return usesT(e.id, tg.id, per); }).reduce(function (a, e) { return a + D.val(tg.id, per, { emp: e.id }); }, 0); any = true; }
      var bt = D.val(tg.id, per, { branch: bid });
      IH.swap('ss-' + tg.id, any ? fmtU(sum, tg.unit) : '—');
      IH.swap('sd-' + tg.id, any ? diffCell(sum - bt, tg.unit) : '<span class="mut">' + fmtU(-bt, tg.unit) + '</span>');
    });
  }
  function curSplit() { var c = IH.current(); if (c.id === 'targeti-tima') return { bid: IH.me().branch, per: IH.v('tt').per || '2027-Q1' }; var p = (c.params[1] || 'B01|2027-Q1').split('|'); return { bid: p[0], per: p[1] }; }
  document.addEventListener('input', function (e) { if (e.target.dataset && e.target.dataset.sp2) { var s = curSplit(); updSums(s.bid, s.per); } });
  IH.act['sp-fill'] = function (el) {
    var p = el.dataset.arg.split('|'), mode = p[0], bid = p[1], per = p[2];
    splitTargets(bid, per).forEach(function (tg) {
      var lic = D.branchStaff(bid, 'licni').filter(function (e) { return usesT(e.id, tg.id, per); }), bt = D.val(tg.id, per, { branch: bid }), step = tg.unit === 'RSD' ? 100000 : 1, acc = 0;
      var w = lic.map(function (e) { if (mode === 'even') return 1; var q = q3pct(e.id, tg.id); return q == null ? 1 : Math.max(0.5, q); }), ws = w.reduce(function (a, x) { return a + x; }, 0);
      lic.forEach(function (e, i) {
        var v = i === lic.length - 1 ? bt - acc : Math.round(bt * w[i] / ws / step) * step;
        acc += v;
        var inp = document.querySelector('[data-sp2="' + e.id + '|' + tg.id + '"]');
        if (inp) { inp.value = F.num(v); inp.classList.toggle('filled', inp.value === inp.dataset.sug); IH.form['sp|' + e.id + '|' + tg.id] = inp.value; }
      });
    });
    updSums(bid, per);
  };
  IH.act['sp-draft'] = function (el) { var p = el.dataset.arg.split('|'); IH.audit('cascade', p[0], { sr: 'Sačuvan nacrt raspodele ' + D.periodLabel(p[1]), en: D.periodLabel(p[1]) + ' split draft saved' }); IH.toast(t('d.draftSaved')); };
  function doSend(bid, per) {
    var vals = IH.map('vals');
    splitTargets(bid, per).forEach(function (tg) {
      D.branchStaff(bid, 'licni').filter(function (e) { return usesT(e.id, tg.id, per); }).forEach(function (e) { var inp = document.querySelector('[data-sp2="' + e.id + '|' + tg.id + '"]'); vals[D.valKey(tg.id, per, { emp: e.id })] = inp && inp.value ? parseNum(inp.value) : D.val(tg.id, per, { emp: e.id }); });
    });
    if (per === '2027-Q1') IH.map('plan27Status')[bid] = 'na_odobravanju'; else IH.map('branchSplit')[bid + '|' + per] = 'na_odobravanju';
    var hd = head(D.branch(bid).region), me = IH.me();
    IH.audit('cascade', bid, { sr: 'Raspodela ' + D.periodLabel(per) + ' poslata na odobrenje', en: D.periodLabel(per) + ' split submitted for approval' }, { sr: 'Odobrava: ' + hd.name, en: 'Approver: ' + hd.name });
    IH.state.data.extraNotif = IH.state.data.extraNotif || {};
    (IH.state.data.extraNotif.admin = IH.state.data.extraNotif.admin || []).push({ id: 'N-X' + Date.now(), at: IH.now(), icon: 'share', text: { sr: me.name + ' je poslao raspodelu ' + D.periodLabel(per) + ' za ' + D.branchShort(bid) + ' na odobrenje', en: me.name + ' submitted the ' + D.periodLabel(per) + ' split for ' + D.branchShort(bid) }, go: 'dodela-targeta' });
    EN.invalidate(); IH.form = {}; IH.save(); IH.closeModal(); if (IH.current().id === 'dodela-targeta') IH.go('dodela-targeta'); else IH.render(); IH.toast(t('d.sent', { p: D.periodLabel(per), n: IH.esc(hd.name) }));
  }
  IH.act['sp-send'] = function (el) {
    var p = el.dataset.arg.split('|'), bid = p[0], per = p[1], bad = null;
    splitTargets(bid, per).forEach(function (tg) {
      if (bad) return;
      var sum = 0; inputsOf(tg.id).forEach(function (x) { sum += parseNum(x.value); });
      var d = sum - D.val(tg.id, per, { branch: bid });
      if (Math.abs(d) > 0.5) bad = { tg: tg, d: d };
    });
    if (!bad) return doSend(bid, per);
    IH.modal({ title: t('d.mismatch'), body: '<p>' + t('d.mismatchTxt', { k: IH.esc(IH.L(bad.tg.name)), d: '<b>' + (bad.d > 0 ? '+' : '') + fmtU(bad.d, bad.tg.unit) + '</b>' }) + '</p>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('d.fixSend'), { cls: 'primary', icon: 'send', act: 'sp-send-force', arg: bid + '|' + per }) });
  };
  IH.act['sp-send-force'] = function (el) { var p = el.dataset.arg.split('|'); doSend(p[0], p[1]); };

  /* ---------- raspodela: regija → ekspoziture ---------- */
  function regTargets(rid, per) {
    return targetsIn(per).filter(function (tg) { var vm = tg.value || {}; return !(tg.kind === 'timski' && vm.mode === 'zbir') && D.branches.some(function (b) { return b.region === rid && (tg.kind === 'timski' || staffFor(tg, b.id, per).length); }); });
  }
  /* prethodno ostvarenje ekspoziture na targetu (Q3 za kvartalne, septembar za mesečne) */
  function prevAch(tg, bid) {
    if (tg.periodType === 'M') { var k = EN.m3(bid, '2026-09').kpis.filter(function (q) { return q.id === tg.id; })[0]; return k ? k.ach : 0; }
    if (tg.kind === 'timski') return EN.achieve(D.targetAt(tg.id, '2026-Q3'), EN.branchItems(bid, '2026-Q3')).ach;
    return D.branchStaff(bid, tg.pos || 'licni').reduce(function (a, e) { var r = EN.result(e.id, '2026-Q3'), x = (r.targets || []).filter(function (q) { return q.id === tg.id; })[0]; return a + (x ? x.ach : 0); }, 0);
  }
  function regBranches(rid, tg, per) { return D.branches.filter(function (b) { return b.region === rid && (tg.kind === 'timski' || staffFor(tg, b.id, per).length); }); }
  function regionPage(arg) {
    var p = (arg || '').split('|'), rid = p[0] || 'R1', per = p[1] || '2027-Q1', rg = D.region(rid), plan = editable(per), st = regStatus(rid, per), locked = !plan || st !== 'nacrt' && IH.v('rg-' + rid).edit !== true;
    var tgs = regTargets(rid, per), brs = D.branches.filter(function (b) { return b.region === rid; });
    var rt = {}; tgs.forEach(function (tg) { rt[tg.id] = D.val(tg.id, per, { region: rid }); });
    var top = '<div class="kpis" style="margin:0">' + tgs.map(function (tg) { return ui.kpi(IH.esc(IH.L(tg.name)), tg.unit === 'RSD' ? F.mio(rt[tg.id]) + '<span class="u">RSD</span>' : F.num(rt[tg.id]) + '<span class="u">' + IH.unitTxt(tg.unit) + '</span>'); }).join('') + '</div>';
    var rows = brs.map(function (b) {
      var r = '<tr><td class="nw"><b>' + IH.esc(D.branchShort(b)) + '</b> <span class="mut">· ' + D.branchStaff(b.id, 'licni').length + ' / ' + D.branchStaff(b.id, 'univerzalni').length + '</span></td>';
      tgs.forEach(function (tg) {
        if (regBranches(rid, tg, per).indexOf(b) < 0) { r += '<td class="num mut">—</td>'; return; }
        var sug = F.num(D.val(tg.id, per, { branch: b.id })), key = 'rg|' + b.id + '|' + tg.id, cur = IH.form[key] != null ? IH.form[key] : sug;
        r += '<td class="num">' + (locked ? '<b>' + sug + '</b>' : '<input style="width:140px;margin-left:auto;display:block" class="in cell" data-rg="' + b.id + '|' + tg.id + '" data-k="' + key + '" value="' + IH.esc(cur) + '">') + '</td>';
      });
      return r + '</tr>';
    }).join('');
    var sumRow = '<tr class="lvl-0"><td>' + t('d.sumRow') + '</td>' + tgs.map(function (tg) { return '<td class="num" id="rs-' + tg.id + '"></td>'; }).join('') + '</tr>';
    var tgtRow = '<tr><td>' + t('d.targetRowR') + '</td>' + tgs.map(function (tg) { return '<td class="num">' + fmtU(rt[tg.id], tg.unit) + '</td>'; }).join('') + '</tr>';
    var diffRow = '<tr><td><b>' + t('d.diffRow') + '</b></td>' + tgs.map(function (tg) { return '<td class="num" id="rd-' + tg.id + '"></td>'; }).join('') + '</tr>';
    var tbl = '<div class="tbl-wrap"><table class="t"><thead><tr><th>' + t('d.colBranch') + '</th>' + tgs.map(function (tg) { return '<th class="num">' + IH.esc(IH.L(tg.name)) + (tg.unit === 'RSD' ? ' (RSD)' : tg.unit === 'bod' ? ' (' + IH.unitTxt('bod') + ')' : '') + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody><tfoot>' + sumRow + tgtRow + diffRow + '</tfoot></table></div>';
    var acts = locked ? ui.st2(st) + (plan ? ' ' + ui.btn(t('c.edit'), { cls: 'sm', icon: 'edit', act: 'rg-edit', arg: rid }) : '') : ui.btn(t('d.even'), { cls: 'sm', act: 'rg-fill', arg: 'even|' + rid + '|' + per }) + ui.btn(t('d.byStaff'), { cls: 'sm', act: 'rg-fill', arg: 'staff|' + rid + '|' + per }) + ui.btn(t('d.byPrev'), { cls: 'sm', act: 'rg-fill', arg: 'q3|' + rid + '|' + per });
    var foot = locked ? '' : '<div class="wz-foot"><span class="left">' + t('wz.hint') + '</span>' + ui.btn(t('c.cancel'), { act: 'rg-cancel', arg: rid }) + ui.btn(t('d.confirm'), { cls: 'primary', icon: 'check', act: 'rg-save', arg: rid + '|' + per }) + '</div>';
    return ui.header(t('d.splitRTitle'), '', '', '<a href="#/dodela-targeta">' + t('d.title') + '</a> ' + ic('chevr') + ' ' + IH.esc(IH.L(rg.name))) +
      ui.card(t('d.targetRowR') + ' — ' + IH.esc(IH.L(rg.name)) + ' · ' + D.periodLabel(per), top, { actions: '<span class="mut">' + t('d.approver') + ': ' + IH.esc(head(rid).name) + '</span>' }) +
      '<section class="card"><div class="ch"><h2>' + t('d.distR') + '</h2>' + acts + '</div><div class="cb flush">' + tbl + '</div>' + foot + '</section>';
  }
  function curReg() { var c = IH.current(), p = (c.params[1] || 'R1|2027-Q1').split('|'); return { rid: p[0], per: p[1] }; }
  function updReg(rid, per) {
    regTargets(rid, per).forEach(function (tg) {
      var ins = document.querySelectorAll('[data-rg$="|' + tg.id + '"]'), sum = 0;
      if (ins.length) ins.forEach(function (el) { sum += parseNum(el.value); });
      else sum = regBranches(rid, tg, per).reduce(function (a, b) { return a + D.val(tg.id, per, { branch: b.id }); }, 0);
      IH.swap('rs-' + tg.id, fmtU(sum, tg.unit));
      IH.swap('rd-' + tg.id, diffCell(sum - D.val(tg.id, per, { region: rid }), tg.unit));
    });
  }
  document.addEventListener('input', function (e) { if (e.target.dataset && e.target.dataset.rg) { var r = curReg(); updReg(r.rid, r.per); } });
  IH.act['asg-splitr'] = function (el) { IH.form = {}; IH.go('dodela-targeta/regija/' + el.dataset.arg); };
  IH.act['rg-edit'] = function (el) { IH.v('rg-' + el.dataset.arg).edit = true; IH.render(); };
  IH.act['rg-cancel'] = function (el) { IH.v('rg-' + el.dataset.arg).edit = false; IH.form = {}; IH.render(); };
  IH.act['rg-fill'] = function (el) {
    var p = el.dataset.arg.split('|'), mode = p[0], rid = p[1], per = p[2];
    regTargets(rid, per).forEach(function (tg) {
      var brs = regBranches(rid, tg, per), rt = D.val(tg.id, per, { region: rid }), step = tg.unit === 'RSD' ? 100000 : 1, acc = 0;
      var w = brs.map(function (b) {
        if (mode === 'even') return 1;
        if (mode === 'staff') return Math.max(1, tg.kind === 'timski' ? D.branchStaff(b.id, 'univerzalni').length : staffFor(tg, b.id, per).length);
        return Math.max(1, prevAch(tg, b.id) || 1);
      }), ws = w.reduce(function (a, x) { return a + x; }, 0);
      brs.forEach(function (b, i) {
        var v = i === brs.length - 1 ? rt - acc : Math.round(rt * w[i] / ws / step) * step; acc += v;
        var inp = document.querySelector('[data-rg="' + b.id + '|' + tg.id + '"]'); if (inp) { inp.value = F.num(v); IH.form['rg|' + b.id + '|' + tg.id] = inp.value; }
      });
    });
    updReg(rid, per);
  };
  IH.act['rg-save'] = function (el) {
    var p = el.dataset.arg.split('|'), rid = p[0], per = p[1], vals = IH.map('vals'), rt = {};
    regTargets(rid, per).forEach(function (tg) { rt[tg.id] = D.val(tg.id, per, { region: rid }); });
    regTargets(rid, per).forEach(function (tg) {
      vals[D.valKey(tg.id, per, { region: rid })] = rt[tg.id];
      regBranches(rid, tg, per).forEach(function (b) { var inp = document.querySelector('[data-rg="' + b.id + '|' + tg.id + '"]'); if (inp && inp.value) vals[D.valKey(tg.id, per, { branch: b.id })] = parseNum(inp.value); });
    });
    IH.map('regionSplit')[rid + '|' + per] = 'odobreno'; IH.v('rg-' + rid).edit = false;
    IH.audit('cascade', rid, { sr: 'Raspodela regije ' + D.periodLabel(per) + ' potvrđena', en: 'Region split ' + D.periodLabel(per) + ' confirmed' }, { sr: IH.L(D.region(rid).name), en: IH.L(D.region(rid).name) });
    EN.invalidate(); IH.form = {}; IH.save(); IH.go('dodela-targeta'); IH.toast(t('d.confirmed', { r: IH.esc(IH.L(D.region(rid).name)), p: D.periodLabel(per) }));
  };

  /* ---------- uvoz dodela ---------- */
  IH.act['asg-imp'] = function () { IH.v('aimp').file = false; IH.go('dodela-targeta/uvoz/1'); };
  function m1T() { return ['TG-101', 'TG-102', 'TG-103'].map(D.target); }
  function importPage(step) {
    var cur = Math.max(0, Math.min(2, (+step || 1) - 1)), loaded = IH.v('aimp').file;
    var steps = [{ label: t('d.i1') }, { label: t('d.i2') }, { label: t('d.i3') }];
    var lic = D.branchStaff('B05', 'licni').concat(D.branchStaff('B08', 'licni')), tgs = m1T();
    var body;
    if (cur === 0) {
      body = (loaded ? '<div class="filechip">' + ic('file') + '<div style="flex:1"><b>' + t('d.iFile') + '</b><div class="hint" style="margin:0">' + t('d.iRead') + '</div></div>' + ic('checkc') + '</div>'
        : '<div class="drop">' + ic('upload') + '<div>' + t('c.dropFile') + '</div><div style="margin-top:10px">' + ui.btn(t('c.chooseFile'), { cls: 'primary', act: 'aimp-file' }) + '</div></div>') +
        '<div style="margin-top:12px">' + ui.btn(t('k.impTemplate'), { cls: 'ghost sm', icon: 'download', act: 'export', arg: 'Sablon_dodele.xlsx' }) + '</div>';
    } else if (cur === 1) {
      var rows = [], rn = 2;
      lic.forEach(function (e) { tgs.forEach(function (tg) { rows.push({ r: rn++, n: IH.esc(e.name), b: IH.esc(D.branch(e.branch).city), t: IH.esc(IH.L(tg.name)), v: fmtU(D.val(tg.id, '2027-Q1', { emp: e.id }), tg.unit), res: ui.pill(t('k.rOk'), 'success'), a: ui.pill(t('k.aNew'), 'accent') }); }); });
      rows.push({ r: rn++, n: 'HR-99999', b: 'Čačak', t: IH.esc(IH.L(tgs[0].name)), v: '8.000.000 RSD', res: ui.pill(t('k.rErr'), 'danger') + ' <span class="mut">' + t('d.iErr1') + '</span>', a: ui.pill(t('k.aErr'), 'danger') });
      rows.push({ r: rn++, n: IH.esc(lic[1].name), b: IH.esc(D.branch(lic[1].branch).city), t: IH.esc(IH.L(tgs[0].name)), v: fmtU(D.val('TG-101', '2027-Q1', { emp: lic[1].id }), 'RSD'), res: ui.pill(t('k.rErr'), 'danger') + ' <span class="mut">' + t('d.iErr2') + '</span>', a: ui.pill(t('k.aErr'), 'danger') });
      body = '<div class="note">' + t('d.iSum', { a: lic.length * 3, b: 0, c: 2 }) + '</div>' + ui.table([{ key: 'r', label: t('k.impRow'), num: true }, { key: 'a', label: t('k.impAction') }, { key: 'n', label: t('d.colCarrier') }, { key: 'b', label: t('c.branch') }, { key: 't', label: t('d.colTarget') }, { key: 'v', label: t('d.colValue'), num: true }, { key: 'res', label: t('k.impRes') }], rows, { compact: true });
    } else {
      body = ui.checks([{ label: t('d.iCheck1') }, { label: t('d.iCheck2') }, { label: t('d.iErr1'), state: 'warn' }, { label: t('d.iErr2'), state: 'warn' }]) + '<div class="hr"></div><div class="big-amt">' + (lic.length * 3) + '<span class="u">' + IH.L(L('dodela za primenu', 'assignments to apply')) + '</span></div>';
    }
    var nextBtn = cur < 2 ? (loaded || cur > 0 ? ui.btn(t('c.next'), { cls: 'primary', icon: 'arrow', go: 'dodela-targeta/uvoz/' + (cur + 2) }) : '<button class="btn primary" disabled>' + ic('arrow') + t('c.next') + '</button>') : ui.btn(t('d.iConfirm', { n: lic.length * 3 }), { cls: 'primary', icon: 'check', act: 'aimp-apply' });
    var hd = '<div class="pstep">' + steps.map(function (s, i) { return (i ? '<span class="sep">' + ic('chevr') + '</span>' : '') + '<span class="ps ' + (i < cur ? 'done' : i === cur ? 'on' : '') + '"><span class="pn">' + (i < cur ? '✓' : i + 1) + '</span>' + s.label + '</span>'; }).join('') + '</div>';
    return ui.header(t('d.import'), '', '', '<a href="#/dodela-targeta">' + t('d.title') + '</a> ' + ic('chevr') + ' ' + t('d.import')) + hd +
      '<section class="card"><div class="ch"><h2>' + (cur + 1) + '. ' + steps[cur].label + '</h2></div><div class="cb">' + body + '</div><div class="wz-foot"><span class="left">' + t('wz.step', { a: cur + 1, b: 3 }) + '</span>' + ui.btn(t('c.cancel'), { go: 'dodela-targeta' }) + (cur ? ui.btn(t('c.back'), { icon: 'chevl', go: 'dodela-targeta/uvoz/' + cur }) : '') + nextBtn + '</div></section>';
  }
  IH.act['aimp-file'] = function () { IH.v('aimp').file = true; IH.render(); };
  IH.act['aimp-apply'] = function () {
    var vals = IH.map('vals'), lic = D.branchStaff('B05', 'licni').concat(D.branchStaff('B08', 'licni'));
    lic.forEach(function (e) { m1T().forEach(function (tg) { vals[D.valKey(tg.id, '2027-Q1', { emp: e.id })] = D.val(tg.id, '2027-Q1', { emp: e.id }); }); });
    var st = IH.map('plan27Status'); st.B05 = 'na_odobravanju'; st.B08 = 'na_odobravanju';
    IH.audit('cascade', 'import', { sr: 'Uvoz dodela Q1 2027 — Subotica i Čačak', en: 'Q1 2027 assignment import — Subotica and Čačak' }, { sr: (lic.length * 3) + ' dodela primenjeno, 2 reda odbijena', en: (lic.length * 3) + ' assignments applied, 2 rows rejected' });
    EN.invalidate(); IH.save(); IH.v('asg').per = '2027-Q1'; IH.go('dodela-targeta'); IH.toast(t('d.iDone', { n: lic.length * 3 }));
  };

  IH.route('dodela-targeta', {
    title: function () { return t('d.title'); },
    render: function (p) {
      if (p[0] === 'nova') return wizardPage(p[1]);
      if (p[0] === 'uvoz') return importPage(p[1]);
      if (p[0] === 'raspodela') return splitPage(p[1]);
      if (p[0] === 'regija') return regionPage(p[1]);
      return listPage();
    },
    mount: function (root, p) { if (p[0] === 'raspodela') { var s = curSplit(); updSums(s.bid, s.per); } if (p[0] === 'regija') { var r = curReg(); updReg(r.rid, r.per); } }
  });

  /* ================= MENADŽER: Targeti tima ================= */
  function mgrPage() {
    var me = IH.me(), bid = me.branch, v = IH.v('tt'), per = v.per || '2027-Q1';
    var tb = '<div style="margin-bottom:16px">' + ui.segf('tt', 'per', [{ v: '2027-Q1', l: 'Q1 2027' }, { v: '2026-Q4', l: 'Q4 2026' }]) + '</div>';
    var h = ui.header(t('tt.title'), '', '', IH.esc(D.branchName(bid)));
    if (per === '2026-Q4') {
      var lic = D.branchStaff(bid, 'licni'), tgs = splitTargets(bid, '2026-Q4');
      var rows = lic.map(function (e) { var r = { n: '<b>' + IH.esc(e.name) + '</b>' }, res = EN.result(e.id, '2026-Q4'); tgs.forEach(function (tg) { var x = (res.targets || []).filter(function (q) { return q.id === tg.id; })[0]; r[tg.id] = x ? fmtU(x.target, x.unit) : '—'; r[tg.id + 'p'] = x ? ui.pcell(x.pct, { max: 1.2 }) : ''; }); return r; });
      var cols = [{ key: 'n', label: t('c.employee') }]; tgs.forEach(function (tg) { cols.push({ key: tg.id, label: IH.esc(IH.L(tg.name)), num: true }); cols.push({ key: tg.id + 'p', label: t('c.pct'), w: '150px' }); });
      var m3 = EN.m3(bid, '2026-10');
      var m3t = ui.table([{ key: 'k', label: t('c.target') }, { key: 't', label: t('c.target'), num: true }, { key: 'a', label: t('c.ach'), num: true }, { key: 's', label: IH.L(L('Udeo', 'Share')), num: true }], m3.kpis.map(function (k) { return { k: IH.esc(IH.L(k.name)), t: F.unit(k.target, k.unit), a: F.unit(Math.round(k.ach), k.unit), s: F.pct(k.share) }; }), { compact: true });
      return h + tb + ui.card(t('tt.q4title'), ui.table(cols, rows), { flush: true, actions: ui.st2('odobreno') }) + ui.card(t('tt.teamM3'), m3t, { flush: true });
    }
    return h + tb + splitBody(bid, '2027-Q1', true);
  }
  IH.route('targeti-tima', {
    title: function () { return t('tt.title'); },
    render: function () { return mgrPage(); },
    mount: function () { var s = curSplit(); updSums(s.bid, s.per); }
  });
  IH.refreshers.tt = function () { IH.render(); };
})();
