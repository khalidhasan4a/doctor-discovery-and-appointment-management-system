'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');

const state = new Map();
const sandbox = {
  console,
  Date,
  localStorage: {
    getItem(key) { return state.has(key) ? state.get(key) : null; },
    setItem(key, value) { state.set(key, String(value)); },
    removeItem(key) { state.delete(key); }
  },
  document: {},
  setTimeout,
  clearTimeout
};
sandbox.window = sandbox;
sandbox.addEventListener = () => {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), sandbox, { filename: 'js/data.js' });
vm.runInContext(fs.readFileSync(path.join(root, 'prototype/js/app.js'), 'utf8'), sandbox, { filename: 'prototype/js/app.js' });

const { Doctor, Patient, Appointment, DoctorDirectory, LocalStorageRepository, AppointmentService } = sandbox.FindYourDoctorOOP;
assert.equal(typeof Doctor, 'function');
assert.equal(typeof Patient, 'function');
assert.equal(typeof Appointment, 'function');
assert.equal(typeof DoctorDirectory, 'function');
assert.equal(typeof LocalStorageRepository, 'function');
assert.equal(typeof AppointmentService, 'function');

const doc1 = new Doctor({ id: 'd1', hospital: 'Demo Clinic', name: 'Dr Demo', department: 'Medicine', speciality: 'General Medicine', days: 'a', time: '10 AM' });
const doc2 = new Doctor({ id: 'd2', hospital: 'Sample Center', name: 'Dr Sample', department: 'Cardiology', speciality: 'Heart', days: 'a', time: '11 AM' });
const directory = new DoctorDirectory([doc1, doc2]);
assert.equal(directory.search('cardio').length, 1, 'directory search should match department/speciality');
assert.equal(directory.findById('d1').name, 'Dr Demo');
assert.equal(new Patient({ name: 'X', phone: '123' }).validate().length > 0, true, 'invalid patient data should fail validation');

const repo = new LocalStorageRepository('test-appointments');
const service = new AppointmentService(directory, repo, 1);
const result = service.book({ doctorId: 'd1', patientName: 'Sample Patient', phone: '01700000000', date: '2099-01-01' });
assert.equal(result.appointment.serial, 1);
assert.equal(result.appointment.status, 'pending');
assert.equal(service.list().length, 1);
assert.throws(() => service.book({ doctorId: 'd1', patientName: 'Second Patient', phone: '01800000000', date: '2099-01-01' }), /reached/);
assert.throws(() => service.book({ doctorId: 'd1', patientName: 'Third Patient', phone: '01800000000', date: '2000-01-01' }), /today or a future date/);
assert.equal(service.cancel(result.appointment.id), true);
assert.equal(service.list().length, 0);

console.log('PASS: seven OOP classes are exposed and core search/validation/booking/capacity/cancel tests passed.');
console.log(`PASS: baseline dataset loaded with ${Array.isArray(sandbox.D) ? sandbox.D.length : 0} doctor/facility entries.`);
