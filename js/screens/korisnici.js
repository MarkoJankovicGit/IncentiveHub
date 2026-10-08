/* Incentive Hub — Korisnici i role: korisnici iz HR-a, uloge sa akcijama po modulu (kreiranje, izmena, pregled) */
(function () {
  'use strict';
  var IH = window.IH, D = IH.data, t = IH.t, ic = IH.icon, ui = IH.ui, F = IH.fmt, L = D.L2;

  IH.addStrings({
    'us.title': 'Korisnici i role', 'us.tUsers': 'Korisnici', 'us.tRoles': 'Uloge korisnika',
    'ur.admin': 'Administrator', 'ur.manager': 'Menadžer', 'ur.employee': 'Zaposleni', 'ur.viewer': 'Posmatrač',
    'us.colUser': 'Korisnik', 'us.colUname': 'Korisničko ime', 'us.colPos': 'Pozicija', 'us.colRole': 'Uloga', 'us.colScope': 'Obuhvat podataka', 'us.colUnit': 'Org. jedinica', 'us.colLast': 'Poslednja prijava', 'us.never': 'nije se prijavljivao',
    'usc.bank': 'Cela banka', 'usc.region': 'Region: {r}', 'usc.branch': 'Ekspozitura: {b}', 'usc.own': 'Sopstveni podaci', 'usc.sections': 'Odobreni izveštaji ({n})',
    'us.deact': 'Deaktivacija korisnika — {n}', 'us.deactDate': 'Važi od', 'us.deactReason': 'Razlog', 'us.deactSug': 'Odlazak iz banke (HR)', 'us.deactDone': 'Korisnik {n} je deaktiviran', 'us.react': 'Korisnik {n} je ponovo aktivan', 'us.planned': 'deaktivacija {d}',
    'us.edit': 'Izmena korisnika — {n}', 'us.view': 'Korisnik — {n}', 'us.roleRule': 'Uloga po pravilu (pozicija)', 'us.extraRole': 'Dodatna uloga', 'us.none': 'Bez dodatne uloge', 'us.saved': 'Izmena za {n} je sačuvana', 'us.search': 'Ime, korisničko ime, HR broj',
    'rl.colName': 'Naziv', 'rl.colCreated': 'Datum kreiranja', 'rl.colMod': 'Datum izmene', 'rl.colActs': 'Akcija', 'rl.colUsers': 'Korisnika', 'rl.new': 'Kreiraj novu ulogu', 'rl.editT': 'Izmena uloge — {n}', 'rl.viewT': 'Uloga — {n}',
    'rl.name': 'Naziv uloge', 'rl.namePh': 'Unesite naziv uloge', 'rl.addActs': 'Dodaj akcije za ovu ulogu', 'rl.searchAct': 'Pretraga akcija', 'rl.all': 'Označi sve', 'rl.none': 'Poništi sve', 'rl.cancel': 'Poništi', 'rl.save': 'Sačuvaj',
    'rl.saved': 'Uloga „{n}“ je sačuvana', 'rl.needName': 'Unesite naziv uloge', 'rl.delT': 'Brisanje uloge', 'rl.delUsed': 'Uloga je dodeljena {n} korisnika i ne može da se obriše.', 'rl.delTxt': 'Uloga „{n}“ biće obrisana.', 'rl.deleted': 'Uloga „{n}“ je obrisana', 'rl.noHit': 'Nema akcija za „{q}“', 'rl.search': 'Naziv'
  }, {
    'us.title': 'Users and roles', 'us.tUsers': 'Users', 'us.tRoles': 'User roles',
    'ur.admin': 'Administrator', 'ur.manager': 'Manager', 'ur.employee': 'Employee', 'ur.viewer': 'Viewer',
    'us.colUser': 'User', 'us.colUname': 'Username', 'us.colPos': 'Position', 'us.colRole': 'Role', 'us.colScope': 'Data scope', 'us.colUnit': 'Org. unit', 'us.colLast': 'Last sign-in', 'us.never': 'never signed in',
    'usc.bank': 'Whole bank', 'usc.region': 'Region: {r}', 'usc.branch': 'Branch: {b}', 'usc.own': 'Own data', 'usc.sections': 'Approved reports ({n})',
    'us.deact': 'Deactivate user — {n}', 'us.deactDate': 'Effective from', 'us.deactReason': 'Reason', 'us.deactSug': 'Leaving the bank (HR)', 'us.deactDone': 'User {n} deactivated', 'us.react': 'User {n} active again', 'us.planned': 'deactivation {d}',
    'us.edit': 'Edit user — {n}', 'us.view': 'User — {n}', 'us.roleRule': 'Role by rule (position)', 'us.extraRole': 'Additional role', 'us.none': 'No additional role', 'us.saved': 'Changes for {n} saved', 'us.search': 'Name, username, HR number',
    'rl.colName': 'Name', 'rl.colCreated': 'Created', 'rl.colMod': 'Modified', 'rl.colActs': 'Actions', 'rl.colUsers': 'Users', 'rl.new': 'Create new role', 'rl.editT': 'Edit role — {n}', 'rl.viewT': 'Role — {n}',
    'rl.name': 'Role name', 'rl.namePh': 'Enter the role name', 'rl.addActs': 'Add actions for this role', 'rl.searchAct': 'Search actions', 'rl.all': 'Select all', 'rl.none': 'Clear all', 'rl.cancel': 'Cancel', 'rl.save': 'Save',
    'rl.saved': 'Role "{n}" saved', 'rl.needName': 'Enter the role name', 'rl.delT': 'Delete role', 'rl.delUsed': 'The role is assigned to {n} users and cannot be deleted.', 'rl.delTxt': 'Role "{n}" will be deleted.', 'rl.deleted': 'Role "{n}" deleted', 'rl.noHit': 'No actions for "{q}"', 'rl.search': 'Name'
  });

  /* ---------- moduli i akcije (katalog permisija) ---------- */
  function M(id, name, acts) { return { id: id, name: name, acts: acts.map(function (a) { return { id: id + '.' + a[0], name: a[1] }; }) }; }
  var MODULES = [
    M('pocetna', L('Početna', 'Home'), [['pristup', L('Pristup početnoj strani', 'Home page access')]]),
    M('organizacija', L('Organizacija', 'Organisation'), [['pristup', L('Pristup meniju', 'Menu access')], ['struktura', L('Pregled strukture', 'View structure')], ['zaposleni', L('Pregled svih zaposlenih', 'View all employees')], ['izmena', L('Izmena podataka zaposlenog', 'Edit employee data')], ['istorija', L('Istorija pripadnosti', 'Membership history')], ['promene', L('Rešavanje promena iz uvoza', 'Resolve import changes')], ['uvoz', L('Uvoz organizacije iz fajla', 'Import organisation from file')], ['izvoz', L('Izvoz', 'Export')]]),
    M('korisnici', L('Korisnici i role', 'Users and roles'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled korisnika', 'View users')], ['izmena', L('Izmena korisnika', 'Edit user')], ['deaktivacija', L('Deaktivacija korisnika', 'Deactivate user')], ['uloge', L('Pregled uloga', 'View roles')], ['ulogaNova', L('Kreiranje uloge', 'Create role')], ['ulogaIzmena', L('Izmena uloge', 'Edit role')], ['ulogaBrisanje', L('Brisanje uloge', 'Delete role')]]),
    M('sifarnici', L('Šifarnici', 'Code lists'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled šifarnika', 'View code lists')], ['novi', L('Kreiranje šifarnika', 'Create code list')], ['stavkaNova', L('Kreiranje stavke', 'Create item')], ['stavkaIzmena', L('Izmena stavke', 'Edit item')], ['stavkaBrisanje', L('Brisanje stavke', 'Delete item')], ['status', L('Aktivacija i deaktivacija', 'Activate and deactivate')]]),
    M('sabloni', L('Šabloni obaveštenja', 'Notification templates'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled šablona', 'View templates')], ['izmena', L('Izmena šablona', 'Edit template')], ['okidaci', L('Izmena okidača slanja', 'Edit sending triggers')], ['status', L('Uključivanje i isključivanje', 'Switch on and off')]]),
    M('audit', L('Audit trag', 'Audit trail'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled zapisa', 'View records')], ['izvoz', L('Izvoz', 'Export')]]),
    M('katalog', L('Katalog proizvoda', 'Product catalogue'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled proizvoda', 'View products')], ['novi', L('Kreiranje proizvoda', 'Create product')], ['izmena', L('Izmena proizvoda', 'Edit product')], ['status', L('Deaktivacija proizvoda', 'Deactivate product')], ['mapiranje', L('Mapiranje šifara', 'Map codes')], ['uvoz', L('Uvoz kataloga', 'Import catalogue')], ['izvoz', L('Izvoz', 'Export')]]),
    M('targeti', L('Targeti', 'Targets'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled targeta', 'View targets')], ['novi', L('Kreiranje targeta', 'Create target')], ['izmena', L('Izmena targeta', 'Edit target')], ['verzija', L('Nova verzija targeta', 'New target version')], ['arhiva', L('Arhiviranje targeta', 'Archive target')], ['simulacija', L('Simulacija uslova', 'Condition simulation')]]),
    M('dodela', L('Dodela targeta', 'Target assignment'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled dodela', 'View assignments')], ['nova', L('Nova dodela', 'New assignment')], ['izmena', L('Izmena dodele', 'Edit assignment')], ['raspodela', L('Raspodela po ekspozituri', 'Branch split')], ['slanje', L('Slanje na odobrenje', 'Submit for approval')], ['uvoz', L('Uvoz iz fajla', 'Import from file')], ['izvoz', L('Izvoz', 'Export')]]),
    M('seme', L('Bonus šeme', 'Bonus schemes'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled šema', 'View schemes')], ['nova', L('Kreiranje šeme', 'Create scheme')], ['verzija', L('Nova verzija šeme', 'New scheme version')], ['arhiva', L('Arhiviranje šeme', 'Archive scheme')], ['primer', L('Primer obračuna', 'Calculation example')], ['raspored', L('Raspoređivanje zaposlenih', 'Assign employees')], ['izvoz', L('Izvoz', 'Export')]]),
    M('ucitavanje', L('Učitavanje podataka', 'Data loads'), [['pristup', L('Pristup meniju', 'Menu access')], ['registar', L('Pregled registra učitavanja', 'View load register')], ['upload', L('Ručni upload', 'Manual upload')], ['mapiranje', L('Mapiranje nemapiranih šifara', 'Map unmapped codes')], ['izvori', L('Podešavanje izvora', 'Configure sources')], ['ponovi', L('Ponovno učitavanje', 'Re-run load')], ['odbijeni', L('Preuzimanje odbijenih redova', 'Download rejected rows')]]),
    M('ostvarenje', L('Dnevno ostvarenje', 'Daily achievement'), [['pristup', L('Pristup meniju', 'Menu access')], ['mreza', L('Pregled mreže', 'Network view')], ['ekspozitura', L('Pregled ekspoziture', 'Branch view')], ['zaposleni', L('Pregled zaposlenog', 'Employee view')], ['prodaje', L('Pregled prodaja', 'View sales')], ['izvoz', L('Izvoz', 'Export')]]),
    M('obracun', L('Obračun', 'Calculation'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled perioda', 'View periods')], ['ponovni', L('Ponovni obračun', 'Recalculation')], ['kontrole', L('Kontrolne provere', 'Control checks')], ['slanje', L('Slanje obračunskih listova', 'Send statements')], ['list', L('Pregled obračunskog lista', 'View statement')], ['izvoz', L('Izvoz', 'Export')]]),
    M('korekcije', L('Korekcije', 'Corrections'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled prodaja', 'View sales')], ['prodaja', L('Korekcija prodaje', 'Correct sale')], ['dodavanje', L('Dodavanje prodaje', 'Add sale')], ['iznos', L('Iznos na bonus', 'Bonus amount')], ['storno', L('Storniranje korekcije', 'Reverse correction')], ['istorija', L('Istorija korekcija', 'Correction history')]]),
    M('saglasnosti', L('Saglasnosti', 'Consents'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled saglasnosti', 'View consents')], ['podsetnik', L('Slanje podsetnika', 'Send reminders')], ['auto', L('Automatska saglasnost', 'Auto-consent')], ['odobravanje', L('Odobravanje za isplatu', 'Approve for payout')], ['istorija', L('Istorija', 'History')]]),
    M('isplata', L('Isplata', 'Payout'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled isplata', 'View payouts')], ['batch', L('Kreiranje batch-a', 'Create batch')], ['izvoz', L('Izvoz fajla za sistem zarada', 'Export payroll file')], ['potvrda', L('Potvrda prijema', 'Confirm receipt')]]),
    M('izvestaji', L('Izveštaji', 'Reports'), [['pristup', L('Pristup meniju', 'Menu access')], ['r1', L('Ostvarenje po ekspozituri i targetu', 'Achievement by branch and target')], ['r2', L('Ostvarenje po zaposlenom', 'Achievement by employee')], ['r3', L('Prodaja po proizvodu', 'Sales by product')], ['r4', L('Isplate po periodu', 'Payouts by period')], ['r5', L('Trošak bonusa po komponenti', 'Bonus cost by component')], ['r6', L('Korekcije i prigovori', 'Corrections and complaints')], ['r7', L('Katalog proizvoda i šifre', 'Product catalogue and codes')], ['r8', L('Izmene podešavanja (audit)', 'Settings changes (audit)')], ['r9', L('Korisnici i pristupi', 'Users and access')], ['excel', L('Izvoz u Excel', 'Export to Excel')]]),
    M('tim', L('Moj tim', 'My team'), [['pristup', L('Pristup meniju', 'Menu access')], ['pregled', L('Pregled tima', 'View team')], ['targeti', L('Targeti tima', 'Team targets')], ['raspodela', L('Odobravanje raspodele targeta', 'Approve target split')], ['raspored', L('Odobravanje rasporeda šeme', 'Approve scheme assignment')], ['saglasnosti', L('Saglasnosti tima', 'Team consents')], ['prigovori', L('Odluka o prigovoru', 'Complaint decision')], ['bonus', L('Moj bonus', 'My bonus')]]),
    M('moji', L('Moji podaci', 'My data'), [['targeti', L('Moji targeti', 'My targets')], ['ostvarenje', L('Moje ostvarenje', 'My achievement')], ['obracun', L('Moj obračun', 'My statement')], ['saglasnost', L('Saglasnost na obračun', 'Consent to statement')], ['prigovor', L('Prigovor na obračun', 'Complaint on statement')], ['kartica', L('Moja kartica', 'My profile')]])
  ];
  var ALL = []; MODULES.forEach(function (m) { m.acts.forEach(function (a) { ALL.push(a.id); }); });
  function mods(list) { var out = []; MODULES.forEach(function (m) { if (list.indexOf(m.id) >= 0) m.acts.forEach(function (a) { out.push(a.id); }); }); return out; }
  var ADMIN_MODS = ['pocetna', 'organizacija', 'korisnici', 'sifarnici', 'sabloni', 'audit', 'katalog', 'targeti', 'dodela', 'seme', 'ucitavanje', 'ostvarenje', 'obracun', 'korekcije', 'saglasnosti', 'isplata', 'izvestaji'];
  var SEED = [
    { id: 'ADMIN', key: 'admin', name: L('Administrator', 'Administrator'), created: '2025-12-10', mod: '2026-09-02', acts: mods(ADMIN_MODS) },
    { id: 'MGR', key: 'manager', name: L('Menadžer ekspoziture', 'Branch manager'), created: '2025-12-10', mod: '2026-06-18', acts: mods(['pocetna', 'tim']).concat(['izvestaji.pristup', 'izvestaji.r1', 'izvestaji.r2', 'izvestaji.r3', 'izvestaji.r4', 'izvestaji.r6', 'izvestaji.excel', 'moji.obracun', 'moji.saglasnost', 'moji.kartica']) },
    { id: 'REG', key: 'manager', name: L('Regionalni direktor', 'Regional director'), created: '2025-12-10', mod: '2026-06-18', acts: mods(['pocetna', 'izvestaji']).concat(['organizacija.pristup', 'organizacija.struktura', 'organizacija.zaposleni', 'organizacija.istorija', 'tim.pristup', 'tim.pregled', 'tim.targeti', 'tim.raspodela']) },
    { id: 'EMP', key: 'employee', name: L('Zaposleni', 'Employee'), created: '2025-12-10', mod: '2026-03-04', acts: mods(['pocetna', 'moji']) },
    { id: 'VIEW', key: 'viewer', name: L('Posmatrač', 'Viewer'), created: '2025-12-10', mod: '2026-09-02', acts: ['pocetna.pristup', 'izvestaji.pristup', 'izvestaji.r1', 'izvestaji.r4', 'izvestaji.r5', 'izvestaji.r7', 'izvestaji.excel'] }
  ];
  var POSROLE = { admin: 'ADMIN', menadzer: 'MGR', regionalni: 'REG', licni: 'EMP', univerzalni: 'EMP', kontroling: 'VIEW' };
  function roles() { return SEED.concat(IH.list('newRoles')).filter(function (r) { return !IH.map('roleDel')[r.id]; }).map(function (r) { var e = IH.map('roleEdits')[r.id]; return e ? Object.assign({}, r, e) : r; }); }
  function role(id) { return roles().filter(function (r) { return r.id === id; })[0]; }
  function usersOfRole(r) { return D.employees.filter(function (e) { return POSROLE[e.pos] === r.id || extra(e) === r.id; }).length; }
  var REPMAP = { r1: 'ostvarenje-ekspozitura', r2: 'ostvarenje-zaposleni', r3: 'prodaja-proizvodi', r4: 'isplate', r5: 'trosak', r6: 'korekcije-prigovori', r7: 'katalog', r8: 'audit-podesavanja', r9: 'pristupi' };
  function viewerSections() { var r = role('VIEW'); if (!r) return []; return Object.keys(REPMAP).filter(function (k) { return r.acts.indexOf('izvestaji.' + k) >= 0; }).map(function (k) { return REPMAP[k]; }); }
  IH.viewerSections = viewerSections;

  /* ---------- korisnici ---------- */
  var ROLE = { admin: 'admin', menadzer: 'manager', regionalni: 'manager', licni: 'employee', univerzalni: 'employee', kontroling: 'viewer' };
  function users() { return D.employees.filter(function (e) { return ROLE[e.pos]; }); }
  function uname(e) { var p = e.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj').split(' '); return p[0] + '.' + p[p.length - 1]; }
  function roleOf(e) { return ROLE[e.pos]; }
  function extra(e) { return (IH.map('userExtra')[e.id] || {}).role || null; }
  function scopeOf(e) {
    var r = roleOf(e);
    if (r === 'admin') return t('usc.bank');
    if (r === 'viewer') return t('usc.sections', { n: viewerSections().length });
    if (e.pos === 'regionalni') return t('usc.region', { r: IH.L(D.region(e.region).name) });
    if (r === 'manager') return t('usc.branch', { b: D.branchShort(e.branch) });
    return t('usc.own');
  }
  function lastLogin(e) {
    if (e.since > D.DATA_AS_OF) return null;
    var g = D.rng('login|' + e.id), r = g(), r2 = g(), d = new Date(Date.parse('2026-10-20T07:30:00Z') - Math.floor(r * 9) * 864e5 + Math.floor(r2 * 540) * 6e4);
    if (e.id === 'A001') return '2026-10-20T07:52'; if (e.id === 'E1001') return '2026-10-20T08:14'; if (e.id === 'E1002') return '2026-10-20T08:41';
    return d.toISOString().slice(0, 16);
  }
  function offOf(e) {
    var o = IH.map('userOff')[e.id]; if (o) return o;
    var leave = D.orgChanges.filter(function (c) { return c.type === 'odlazak' && c.emp === e.id; })[0];
    return leave ? { planned: true, from: leave.eff, reason: L('Odlazak iz banke (HR)', 'Leaving the bank (HR)') } : null;
  }
  function active(e) { var o = offOf(e); return !o || (o.planned && o.from >= D.TODAY); }
  function roleName(e) { var r = role(POSROLE[e.pos]); return r ? IH.L(r.name) : t('ur.' + roleOf(e)); }
  function rolePill(e) { return ui.pill(roleName(e), { admin: 'danger', manager: 'accent', employee: 'gray', viewer: 'info' }[roleOf(e)]) + (extra(e) && role(extra(e)) ? ' ' + ui.pill(IH.L(role(extra(e)).name), 'warning') : ''); }
  function usersTab() {
    return IH.grid({
      id: 'us', exportName: 'Korisnici.xlsx', searchLabel: t('us.search'), hidden: ['un'],
      rows: users, key: function (e) { return e.id; }, label: function (e) { return e.name; }, searchKeys: ['u', 'un', 'hr'],
      rowCls: function (e) { return active(e) ? '' : 'muted'; },
      cols: [
        { key: 'st', label: t('c.status'), type: 'status', val: function (e) { return active(e); }, fval: function (e) { return active(e) ? 'on' : 'off'; }, locked: function (e) { return e.id === IH.me().id; }, filter: function () { return [{ v: 'on', l: t('g.on') }, { v: 'off', l: t('g.off') }]; } },
        { key: 'u', label: t('us.colUser'), val: function (e) { return e.name; }, render: function (e) { var o = offOf(e); return '<b>' + IH.esc(e.name) + '</b>' + (e.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : '') + (o && o.planned && active(e) ? ' <span class="mut" style="color:var(--warning)">· ' + t('us.planned', { d: F.date(o.from) }) + '</span>' : ''); } },
        { key: 'un', label: t('us.colUname'), val: function (e) { return uname(e); } },
        { key: 'hr', label: 'HR', val: function (e) { return e.hr; } },
        { key: 'p', label: t('us.colPos'), val: function (e) { return D.posName(e.pos); }, fval: function (e) { return e.pos; }, filter: function () { return Object.keys(ROLE).map(function (k) { return { v: k, l: D.posName(k) }; }); } },
        { key: 'r', label: t('us.colRole'), val: function (e) { return roleName(e); }, fval: function (e) { return POSROLE[e.pos]; }, render: rolePill, filter: function () { return roles().map(function (r) { return { v: r.id, l: IH.L(r.name) }; }); } },
        { key: 's', label: t('us.colScope'), val: function (e) { return scopeOf(e); } },
        { key: 'b', label: t('us.colUnit'), val: function (e) { return e.branch ? D.branchShort(e.branch) : e.region ? IH.L(D.region(e.region).name) : IH.L(L('Centrala', 'Head office')); }, fval: function (e) { return e.branch || e.region || 'HQ'; }, filter: function () { return D.branches.map(function (b) { return { v: b.id, l: D.branchShort(b) }; }).concat([{ v: 'HQ', l: IH.L(L('Centrala', 'Head office')) }]); } },
        { key: 'l', label: t('us.colLast'), search: false, val: function (e) { return lastLogin(e) || ''; }, render: function (e) { var l = lastLogin(e); return l ? F.dt(l) : '<span class="mut">' + t('us.never') + '</span>'; } }
      ],
      onStatus: function (e, on) { if (!on) { IH.act['us-deact']({ dataset: { arg: e.id } }); return false; } delete IH.map('userOff')[e.id]; IH.audit('user', e.id, { sr: 'Korisnik ponovo aktiviran', en: 'User reactivated' }); IH.save(); },
      actions: [{ type: 'details', title: t('g.aDetails'), act: 'us-view' }, { type: 'edit', title: t('g.aEdit'), act: 'us-edit', kind: 'acc' }, { type: 'history', title: t('g.aHistory'), act: 'us-hist' }]
    });
  }
  function userFields(e, edit) {
    var st = function (f) { f.type = 'static'; return f; };
    var opts = [{ v: '', l: t('us.none') }].concat(roles().filter(function (r) { return r.id !== POSROLE[e.pos]; }).map(function (r) { return { v: r.id, l: IH.L(r.name) }; }));
    return [
      st({ k: 'ue_name', label: t('us.colUser'), value: e.name }), st({ k: 'ue_un', label: t('us.colUname'), value: uname(e) }),
      st({ k: 'ue_hr', label: 'HR', value: e.hr }), st({ k: 'ue_pos', label: t('us.colPos'), value: D.posName(e.pos) }),
      st({ k: 'ue_role', label: t('us.roleRule'), value: roleName(e) }), st({ k: 'ue_scope', label: t('us.colScope'), value: scopeOf(e) }),
      { k: 'ue_x', label: t('us.extraRole'), type: 'select', options: opts, value: extra(e) || '' },
      st({ k: 'ue_last', label: t('us.colLast'), value: lastLogin(e) ? F.dt(lastLogin(e)) : t('us.never') })
    ];
  }
  IH.act['us-view'] = function (el) { var e = D.emp(el.dataset.arg); IH.modal({ title: t('us.view', { n: IH.esc(e.name) }), body: ui.form(userFields(e), { readonly: true }), foot: ui.btn(t('g.aEdit'), { icon: 'edit', act: 'us-edit', arg: e.id }) + ui.btn(t('c.close'), { act: 'modal-close' }) }); };
  IH.act['us-deact'] = function (el) {
    var e = D.emp(el.dataset.arg); IH.form = {};
    IH.modal({ title: t('us.deact', { n: IH.esc(e.name) }), body: ui.form([{ k: 'ud_d', label: t('us.deactDate'), value: F.date(D.TODAY) }, { k: 'ud_r', label: t('us.deactReason'), value: t('us.deactSug') }]),
      foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(IH.L(L('Deaktiviraj', 'Deactivate')), { cls: 'danger', icon: 'lock', act: 'us-deact-go', arg: e.id }) });
  };
  IH.act['us-deact-go'] = function (el) {
    var e = D.emp(el.dataset.arg), r = (document.getElementById('fld-ud_r') || {}).value || t('us.deactSug');
    IH.map('userOff')[e.id] = { from: D.TODAY, reason: { sr: r, en: r }, by: IH.me().id };
    IH.audit('user', e.id, { sr: 'Korisnik deaktiviran', en: 'User deactivated' }, { sr: r, en: r });
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('us.deactDone', { n: IH.esc(e.name) }));
  };
  IH.act['us-edit'] = function (el) {
    var e = D.emp(el.dataset.arg); IH.form = {};
    IH.modal({ title: t('us.edit', { n: IH.esc(e.name) }), body: ui.form(userFields(e, true)), foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('c.save'), { cls: 'primary', icon: 'check', act: 'us-edit-go', arg: e.id }) });
  };
  IH.act['us-edit-go'] = function (el) {
    var e = D.emp(el.dataset.arg), v = (document.getElementById('fld-ue_x') || {}).value || '';
    if (v) IH.map('userExtra')[e.id] = { role: v }; else delete IH.map('userExtra')[e.id];
    IH.audit('user', e.id, { sr: 'Izmenjena dodatna uloga', en: 'Additional role changed' }, { sr: v && role(v) ? IH.L(role(v).name) : t('us.none'), en: v && role(v) ? IH.L(role(v).name) : 'none' });
    IH.save(); IH.closeModal(); IH.render(); IH.toast(t('us.saved', { n: IH.esc(e.name) }));
  };
  IH.act['us-hist'] = function (el) {
    var e = D.emp(el.dataset.arg), h = IH.auditFor('user', e.id).slice();
    var l = lastLogin(e); if (l) h.push({ at: l, by: e.id, action: L('Prijava', 'Sign-in') });
    h.push({ at: (e.since < '2025-12-01' ? '2025-12-01' : e.since) + 'T05:04', by: null, action: { sr: 'Korisnik kreiran iz HR mastera — uloga ' + roleName(e), en: 'User created from HR master — role ' + roleName(e) } });
    IH.showHistory(e.name, h.sort(function (a, b) { return a.at < b.at ? 1 : -1; }));
  };

  /* ---------- uloge ---------- */
  function rolesTab() {
    return IH.grid({
      id: 'rl', exportName: 'Uloge.xlsx', searchLabel: t('rl.search'), create: { label: t('rl.new'), act: 'role-new' },
      rows: roles, key: function (r) { return r.id; }, label: function (r) { return IH.L(r.name); }, searchKeys: ['n'],
      cols: [
        { key: 'n', label: t('rl.colName'), val: function (r) { return IH.L(r.name); }, render: function (r) { return '<b>' + IH.esc(IH.L(r.name)) + '</b>' + (r.isNew ? ' ' + ui.pill(t('c.new'), 'accent') : ''); } },
        { key: 'c', label: t('rl.colCreated'), search: false, val: function (r) { return r.created; }, render: function (r) { return F.date(r.created); } },
        { key: 'm', label: t('rl.colMod'), search: false, val: function (r) { return r.mod; }, render: function (r) { return F.date(r.mod); } },
        { key: 'a', label: t('rl.colActs'), num: true, search: false, val: function (r) { return r.acts.length; }, render: function (r) { return r.acts.length + ' / ' + ALL.length; } },
        { key: 'u', label: t('rl.colUsers'), num: true, search: false, val: usersOfRole }
      ],
      actions: [
        { type: 'details', title: t('g.aDetails'), act: 'role-view' },
        { type: 'edit', title: t('g.aEdit'), act: 'role-edit', kind: 'acc' },
        { type: 'history', title: t('g.aHistory'), act: 'role-hist' },
        { type: 'delete', title: t('g.aDelete'), act: 'role-del', kind: 'dan' }
      ]
    });
  }
  function RF() { return IH.form.role; }
  function selCount(f) { return ALL.filter(function (a) { return f.sel[a]; }).length; }
  function visibleActs(m, q) { return m.acts.filter(function (a) { return !q || IH.L(a.name).toLowerCase().indexOf(q) >= 0 || IH.L(m.name).toLowerCase().indexOf(q) >= 0; }); }
  function roleList() {
    var f = RF(), q = (f.q || '').trim().toLowerCase(), any = false;
    var h = MODULES.map(function (m) {
      var acts = visibleActs(m, q); if (!acts.length) return '';
      any = true;
      var k = m.acts.filter(function (a) { return f.sel[a.id]; }).length, open = q ? true : !!f.open[m.id], allOn = k === m.acts.length;
      return '<div class="racc' + (open ? ' open' : '') + '"><div class="racc-h"><input type="checkbox" class="rchk" data-rm="' + m.id + '"' + (allOn ? ' checked' : '') + (f.ro ? ' disabled' : '') + '><button type="button" class="racc-t" data-act="role-mod" data-arg="' + m.id + '"><span>' + IH.esc(IH.L(m.name)) + '</span><span class="cnt">' + k + ' / ' + m.acts.length + '</span>' + ic('chevd') + '</button></div>' +
        (open ? '<div class="racc-b">' + acts.map(function (a) { return '<label class="ract"><input type="checkbox" data-ra="' + a.id + '"' + (f.sel[a.id] ? ' checked' : '') + (f.ro ? ' disabled' : '') + '><span>' + IH.esc(IH.L(a.name)) + '</span></label>'; }).join('') + '</div>' : '') + '</div>';
    }).join('');
    return any ? h : '<div class="empty">' + t('rl.noHit', { q: IH.esc(f.q) }) + '</div>';
  }
  function roleCnt() { var f = RF(); return selCount(f) + ' / ' + ALL.length; }
  function roleBody() {
    var f = RF();
    return '<div class="field"><label class="lab">' + t('rl.name') + (f.ro ? '' : ' <span class="req">*</span>') + '</label>' + (f.ro ? '<div class="in ro">' + IH.esc(f.name) + '</div>' : '<input class="in" data-rn="1" value="' + IH.esc(f.name || '') + '" placeholder="' + t('rl.namePh') + '">') + '</div>' +
      '<div class="rhead"><span>' + t('rl.addActs') + '</span><span class="cnt" id="role-cnt">' + roleCnt() + '</span></div>' +
      '<div class="rtool"><label class="sbox">' + ic('search') + '<input type="search" data-rq="1" value="' + IH.esc(f.q || '') + '" placeholder="' + t('rl.searchAct') + '"></label>' + (f.ro ? '' : ui.btn(t('rl.all'), { cls: 'sm', icon: 'checkc', act: 'role-all' }) + ui.btn(t('rl.none'), { cls: 'sm', icon: 'x', act: 'role-none' })) + '</div>' +
      '<div class="rlist" id="role-list">' + roleList() + '</div>';
  }
  function swapList() { var el = document.getElementById('role-list'), top = el ? el.scrollTop : 0; IH.swap('role-list', roleList()); IH.swap('role-cnt', roleCnt()); var el2 = document.getElementById('role-list'); if (el2) el2.scrollTop = top; }
  function openRole(r, mode) {
    var sel = {}; (r ? r.acts : []).forEach(function (a) { sel[a] = true; });
    IH.form = { role: { id: r ? r.id : null, name: r ? IH.L(r.name) : '', sel: sel, open: {}, q: '', ro: mode === 'view' } };
    var title = mode === 'view' ? t('rl.viewT', { n: IH.esc(IH.L(r.name)) }) : mode === 'edit' ? t('rl.editT', { n: IH.esc(IH.L(r.name)) }) : t('rl.new');
    IH.modal({ title: title, wide: true, body: '<div id="role-body">' + roleBody() + '</div>', foot: mode === 'view' ? ui.btn(t('g.aEdit'), { icon: 'edit', act: 'role-edit', arg: r.id }) + ui.btn(t('c.close'), { act: 'modal-close' }) : ui.btn(t('rl.cancel'), { act: 'modal-close' }) + ui.btn(t('rl.save'), { cls: 'primary', icon: 'check', act: 'role-save' }) });
  }
  IH.act['role-new'] = function () { openRole(null, 'new'); };
  IH.act['role-view'] = function (el) { var r = role(el.dataset.arg); if (r) openRole(r, 'view'); };
  IH.act['role-edit'] = function (el) { var r = role(el.dataset.arg); if (r) openRole(r, 'edit'); };
  IH.act['role-mod'] = function (el) { var f = RF(); f.open[el.dataset.arg] = !f.open[el.dataset.arg]; swapList(); };
  IH.act['role-all'] = function () { var f = RF(), q = (f.q || '').trim().toLowerCase(); MODULES.forEach(function (m) { visibleActs(m, q).forEach(function (a) { f.sel[a.id] = true; }); }); swapList(); };
  IH.act['role-none'] = function () { var f = RF(), q = (f.q || '').trim().toLowerCase(); MODULES.forEach(function (m) { visibleActs(m, q).forEach(function (a) { f.sel[a.id] = false; }); }); swapList(); };
  document.addEventListener('input', function (e) { var d = e.target.dataset || {}, f = RF(); if (!f) return; if (d.rn) f.name = e.target.value; if (d.rq) { f.q = e.target.value; swapList(); } });
  document.addEventListener('change', function (e) {
    var d = e.target.dataset || {}, f = RF(); if (!f || f.ro) return;
    if (d.ra) { f.sel[d.ra] = e.target.checked; swapList(); }
    if (d.rm) { var m = MODULES.filter(function (x) { return x.id === d.rm; })[0]; m.acts.forEach(function (a) { f.sel[a.id] = e.target.checked; }); swapList(); }
  });
  IH.act['role-save'] = function () {
    var f = RF(), name = (f.name || '').trim(); if (!name) { IH.toast(t('rl.needName')); return; }
    var acts = ALL.filter(function (a) { return f.sel[a]; }), now = IH.now();
    if (f.id) { var r = role(f.id); IH.map('roleEdits')[f.id] = Object.assign({}, IH.map('roleEdits')[f.id] || {}, { name: { sr: name, en: name }, acts: acts, mod: now.slice(0, 10) }); IH.audit('role', f.id, { sr: 'Izmenjena uloga', en: 'Role changed' }, { sr: name + ' · ' + acts.length + ' akcija', en: name + ' · ' + acts.length + ' actions' }); }
    else { var id = 'R-' + (100 + IH.list('newRoles').length); IH.list('newRoles').push({ id: id, name: { sr: name, en: name }, created: now.slice(0, 10), mod: now.slice(0, 10), acts: acts, isNew: true }); IH.audit('role', id, { sr: 'Kreirana uloga', en: 'Role created' }, { sr: name + ' · ' + acts.length + ' akcija', en: name + ' · ' + acts.length + ' actions' }); }
    IH.save(); IH.form = {}; IH.closeModal(); IH.render(); IH.toast(t('rl.saved', { n: IH.esc(name) }));
  };
  IH.act['role-hist'] = function (el) { var r = role(el.dataset.arg); IH.showHistory(IH.L(r.name), IH.auditFor('role', r.id).concat(r.isNew ? [] : [{ at: r.mod + 'T10:00', by: 'A001', action: L('Izmenjene akcije uloge', 'Role actions changed') }, { at: r.created + 'T09:00', by: 'A001', action: L('Uloga kreirana', 'Role created') }])); };
  IH.act['role-del'] = function (el) {
    var r = role(el.dataset.arg), n = usersOfRole(r);
    if (n) { IH.modal({ title: t('rl.delT'), body: '<div class="note warn">' + t('rl.delUsed', { n: n }) + '</div>', foot: ui.btn(t('c.close'), { act: 'modal-close' }) }); return; }
    IH.modal({ title: t('rl.delT'), body: '<p style="margin:0">' + t('rl.delTxt', { n: IH.esc(IH.L(r.name)) }) + '</p>', foot: ui.btn(t('c.cancel'), { act: 'modal-close' }) + ui.btn(t('g.aDelete'), { cls: 'danger', icon: 'trash', act: 'role-del-ok', arg: r.id }) });
  };
  IH.act['role-del-ok'] = function (el) { var r = role(el.dataset.arg); IH.map('roleDel')[r.id] = true; IH.audit('role', r.id, { sr: 'Uloga obrisana', en: 'Role deleted' }); IH.save(); IH.closeModal(); IH.render(); IH.toast(t('rl.deleted', { n: IH.esc(IH.L(r.name)) })); };

  IH.route('korisnici', {
    title: function () { return t('us.title'); },
    render: function (p) {
      var tab = p[0] === 'role' ? 'role' : '';
      var tabs = ui.rtabs('korisnici', [{ id: '', label: t('us.tUsers'), icon: 'users', cnt: users().length }, { id: 'role', label: t('us.tRoles'), icon: 'shield', cnt: roles().length }], tab);
      return ui.header(t('us.title')) + tabs + (tab === 'role' ? rolesTab() : usersTab());
    }
  });
})();
