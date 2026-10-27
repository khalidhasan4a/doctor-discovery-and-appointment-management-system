/* ===== PATIENT STATUS: "Check Appointment" (no login: Registration No. + mobile number) ===== */

// Keep only the last 10 digits so 01712345678 and +8801712345678 match
function ph10(s) {
  return String(s || '')
    .replace(/\D/g, '')
    .slice(-10);
}

// All appointments of a patient (Reg No. + mobile number must match)
function myAppts(reg, phone) {
  var r = reg.trim().toUpperCase(),
    p = DEMO.concat(pts).filter(function (q) {
      return q.reg == r && ph10(q.ph) == ph10(phone) && ph10(phone).length >= 7;
    })[0];
  if (!p) return null;
  return xrecs()
    .map(function (o) {
      return o.a;
    })
    .filter(function (a) {
      return a.reg == r;
    });
}

// One result card: status, the CURRENT serial number and the details
function statusCard(a) {
  var c = a.status == 'confirmed';
  return (
    '<div class="ac' +
    (c ? ' ok' : '') +
    '"><div class="ah1"><span class="bd ' +
    (c ? 'bc' : 'bp') +
    '">' +
    (c ? ic('checkc') + ' CONFIRMED' : ic('hourglass') + ' NOT CONFIRMED YET') +
    '</span></div>' +
    '<div class="bigsr"><small>' +
    (c ? 'YOUR FINAL SERIAL NO' : 'YOUR SERIAL NO (NOW)') +
    '</small><b>' +
    pad(a.sn) +
    '</b></div>' +
    '<div>' +
    ic('id') +
    ' Appointment No: <b>' +
    esc(a.sl) +
    '</b> · Reg: ' +
    esc(a.reg) +
    '</div>' +
    '<div>' +
    ic('user') +
    ' ' +
    esc(a.name) +
    '</div><div>' +
    ic('steth') +
    ' ' +
    esc(a.doc) +
    ' (' +
    esc(a.dep) +
    ')</div><div>' +
    ic('hospital') +
    ' ' +
    esc(a.hos || '-') +
    '</div>' +
    '<div>' +
    ic('calendar') +
    ' <b>' +
    esc(a.date) +
    '</b>' +
    (a.time ? ' · ' + esc(a.time) : '') +
    '</div>' +
    '<p class="' +
    (c ? 'okmsg' : 'inf') +
    '">' +
    (c
      ? 'The hospital has confirmed your appointment. Please come on the date above and show your slip. If a patient before you cancels, your serial moves up, so check this page again before you go.'
      : 'The hospital will call you to confirm. If a patient before you cancels, your serial moves up. Check again after the call to see your final serial.') +
    '</p><div class="acts"><button class="btn b" data-act="prt" data-sl="' +
    esc(a.sl) +
    '">' +
    ic('printer') +
    ' Print slip</button><button class="btn b" data-act="pdf" data-sl="' +
    esc(a.sl) +
    '">' +
    ic('download') +
    ' Download PDF</button></div></div>'
  );
}

function checkStatus() {
  $('cerr').textContent = '';
  var list = myAppts($('cr').value, $('cp').value);
  if (!list) {
    $('cres').innerHTML = '';
    $('cerr').textContent =
      'No patient found. Please check the Registration No. and the mobile number.';
    return;
  }
  $('cres').innerHTML = list.length
    ? list.map(statusCard).join('')
    : '<p class="inf">No active appointment found. If the hospital cancelled your appointment it is not shown here.</p>';
}

$('chk').onclick = function () {
  $('cres').innerHTML = '';
  $('cerr').textContent = '';
  open('ovc');
};
$('cgo').onclick = checkStatus;
['cr', 'cp'].forEach(function (i) {
  $(i).addEventListener('keydown', function (e) {
    if (e.key == 'Enter') checkStatus();
  });
});
// Print / PDF buttons inside the result list
$('cres').onclick = function (e) {
  var b = e.target.closest('[data-act]');
  if (!b) return;
  var a = mem.filter(function (x) {
    return x.sl == b.dataset.sl;
  })[0];
  if (!a) return;
  if (b.dataset.act == 'prt') printSlip(a);
  else if (!pdfSlip(a))
    $('cerr').textContent =
      'The PDF library needs internet once. Use Print and choose "Save as PDF".';
};
