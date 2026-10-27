/*
 * Object-oriented capstone interface prototype.
 * Seven classes are implemented to match docs/diagrams/class-diagram.dot.
 * This is a browser-only educational demo; do not enter real patient data.
 */
'use strict';

class Doctor {
  constructor({ id, hospital, name, department, speciality, days, time }) {
    this.id = String(id);
    this.hospital = String(hospital || '');
    this.name = String(name || '');
    this.department = String(department || '');
    this.speciality = String(speciality || '');
    this.days = String(days || 'u');
    this.time = String(time || 'Schedule not specified');
  }

  matches(query) {
    const q = String(query || '').trim().toLocaleLowerCase();
    if (!q) return true;
    return [this.name, this.hospital, this.department, this.speciality]
      .some(value => value.toLocaleLowerCase().includes(q));
  }

  isAvailableOn(dateString) {
    if (!dateString || this.days === 'u' || this.days === 'a' || this.days.length === 7) return true;
    const day = new Date(`${dateString}T12:00:00`).getDay();
    return this.days.includes(String(day));
  }

  toCardData() {
    return {
      id: this.id, hospital: this.hospital, name: this.name,
      department: this.department, speciality: this.speciality,
      days: this.days, time: this.time
    };
  }
}

class Patient {
  constructor({ name, phone, registrationNo = '' }) {
    this.name = String(name || '').trim();
    this.phone = String(phone || '').trim();
    this.registrationNo = String(registrationNo || '').trim();
  }

  validate() {
    const errors = [];
    if (this.name.length < 2 || this.name.length > 100) errors.push('Enter a patient name between 2 and 100 characters.');
    const digits = this.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) errors.push('Enter a valid mobile number (7–15 digits).');
    return errors;
  }
}

class Appointment {
  constructor({ id, doctorId, patient, date, serial, status = 'pending', createdAt = new Date().toISOString() }) {
    this.id = String(id);
    this.doctorId = String(doctorId);
    this.patient = patient instanceof Patient ? patient : new Patient(patient || {});
    this.date = String(date);
    this.serial = Number(serial);
    this.status = String(status || 'pending');
    this.createdAt = String(createdAt);
  }

  toJSON() {
    return {
      id: this.id, doctorId: this.doctorId, patient: this.patient,
      date: this.date, serial: this.serial, status: this.status, createdAt: this.createdAt
    };
  }
}

class LocalStorageRepository {
  constructor(storageKey = 'fyd_oop_prototype_appointments') {
    this.storageKey = storageKey;
  }

  getAll() {
    try {
      const value = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.warn('Prototype storage could not be read; starting empty.', error);
      return [];
    }
  }

  saveAll(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      throw new Error('Browser storage is unavailable. Try another browser profile or clear demo records.');
    }
  }

  add(item) {
    const items = this.getAll();
    items.push(item instanceof Appointment ? item.toJSON() : item);
    this.saveAll(items);
  }
}

class DoctorDirectory {
  constructor(doctors = []) {
    this.doctors = doctors;
  }

  search(query = '') {
    return this.doctors.filter(doctor => doctor.matches(query));
  }

  findById(id) {
    return this.doctors.find(doctor => doctor.id === String(id)) || null;
  }
}

class AppointmentService {
  constructor(directory, repository, dailyCapacity = 15) {
    this.directory = directory;
    this.repository = repository;
    this.dailyCapacity = dailyCapacity;
  }

  list() {
    return this.repository.getAll()
      .map(record => new Appointment(record))
      .sort((a, b) => a.date.localeCompare(b.date) || a.serial - b.serial);
  }

  book(input) {
    const doctor = this.directory.findById(input.doctorId);
    if (!doctor) throw new Error('Choose a doctor from the directory first.');
    const patient = new Patient({ name: input.patientName, phone: input.phone });
    const errors = patient.validate();
    if (errors.length) throw new Error(errors.join(' '));
    if (!input.date) throw new Error('Choose an appointment date.');
    const chosen = new Date(`${input.date}T00:00:00`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (Number.isNaN(chosen.getTime()) || chosen < today) throw new Error('Choose today or a future date.');
    if (!doctor.isAvailableOn(input.date)) throw new Error('The selected doctor is not listed for that weekday. Please choose another date.');

    const sameDay = this.list().filter(item => {
      const target = this.directory.findById(item.doctorId);
      return target && target.name === doctor.name && target.hospital === doctor.hospital && item.date === input.date;
    });
    if (sameDay.length >= this.dailyCapacity) throw new Error(`The demo limit of ${this.dailyCapacity} appointments for this doctor/date has been reached.`);
    const serial = sameDay.reduce((max, item) => Math.max(max, item.serial), 0) + 1;
    const appointment = new Appointment({
      id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
      doctorId: doctor.id, patient, date: input.date, serial, status: 'pending'
    });
    this.repository.add(appointment);
    return { appointment, doctor };
  }

  cancel(id) {
    const remaining = this.repository.getAll().filter(item => item.id !== id);
    if (remaining.length === this.repository.getAll().length) return false;
    this.repository.saveAll(remaining);
    return true;
  }
}

class PrototypeUI {
  constructor(directory, service) {
    this.directory = directory;
    this.service = service;
    this.selectedDoctor = null;
    this.results = document.querySelector('#doctor-results');
    this.searchInput = document.querySelector('#doctor-search');
    this.form = document.querySelector('#booking-form');
    this.message = document.querySelector('#booking-message');
  }

  init() {
    this.searchInput.addEventListener('input', () => this.renderDoctors());
    this.form.addEventListener('submit', event => this.handleBooking(event));
    document.querySelector('#clear-demo').addEventListener('click', () => {
      if (!window.confirm('Clear all appointment records created by this OOP demo in this browser?')) return;
      this.service.repository.saveAll([]);
      this.renderAppointments();
      this.showMessage('Demo appointments cleared from this browser.', 'success');
    });
    const dateInput = document.querySelector('#appointment-date');
    const today = new Date();
    dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.renderDoctors();
    this.renderAppointments();
  }

  renderDoctors() {
    const doctors = this.directory.search(this.searchInput.value);
    document.querySelector('#doctor-count').textContent = `${doctors.length} result${doctors.length === 1 ? '' : 's'}`;
    if (!doctors.length) {
      this.results.innerHTML = '<div class="empty-list" style="grid-column:1/-1">No matching doctor records. Try a shorter search.</div>';
      return;
    }
    this.results.innerHTML = doctors.slice(0, 30).map(doctor => `
      <article class="doctor-card">
        <div class="doctor-top"><div class="avatar" aria-hidden="true">+</div><div>
          <h3>${this.escapeHTML(doctor.name)}</h3>
          <p class="doctor-meta">${this.escapeHTML(doctor.hospital)}</p>
          <p class="doctor-meta">${this.escapeHTML(doctor.speciality)}</p>
        </div></div>
        <span class="department">${this.escapeHTML(doctor.department)}</span>
        <p class="doctor-meta" style="margin:10px 0 12px">${this.escapeHTML(doctor.time)}</p>
        <button class="btn primary" type="button" data-doctor-id="${this.escapeHTML(doctor.id)}">Choose this doctor</button>
      </article>`).join('');
    this.results.querySelectorAll('[data-doctor-id]').forEach(button => {
      button.addEventListener('click', () => this.selectDoctor(button.dataset.doctorId));
    });
  }

  selectDoctor(id) {
    this.selectedDoctor = this.directory.findById(id);
    if (!this.selectedDoctor) return;
    document.querySelector('#doctor-id').value = this.selectedDoctor.id;
    document.querySelector('#selected-doctor').classList.remove('empty-state');
    document.querySelector('#selected-doctor').innerHTML = `<strong>${this.escapeHTML(this.selectedDoctor.name)}</strong>${this.escapeHTML(this.selectedDoctor.hospital)}<br>${this.escapeHTML(this.selectedDoctor.department)} · ${this.escapeHTML(this.selectedDoctor.time)}`;
    this.showMessage('', '');
    document.querySelector('#patient-name').focus({ preventScroll: true });
  }

  handleBooking(event) {
    event.preventDefault();
    this.showMessage('', '');
    const formData = new FormData(this.form);
    try {
      const result = this.service.book({
        doctorId: formData.get('doctorId') || document.querySelector('#doctor-id').value,
        patientName: formData.get('patientName'), phone: formData.get('phone'), date: formData.get('date')
      });
      this.renderAppointments();
      this.showMessage(`Demo booking saved. Reference: ${result.appointment.id} · Serial: ${String(result.appointment.serial).padStart(3, '0')}. Status remains pending.`, 'success');
      this.form.reset();
      document.querySelector('#doctor-id').value = result.doctor.id;
    } catch (error) {
      this.showMessage(error.message || 'Could not create the demo appointment.', 'error');
    }
  }

  renderAppointments() {
    const list = this.service.list();
    const target = document.querySelector('#appointment-list');
    if (!list.length) {
      target.innerHTML = '<div class="empty-list">No demo appointments yet. Use the form above to create one.</div>';
      return;
    }
    target.innerHTML = list.map(appointment => {
      const doctor = this.directory.findById(appointment.doctorId);
      return `<article class="appt"><div class="appt-row"><div><strong>${this.escapeHTML(appointment.patient.name)} · Serial ${String(appointment.serial).padStart(3, '0')}</strong><p>${this.escapeHTML(doctor ? doctor.name : 'Unknown doctor')}</p><p>${this.escapeHTML(doctor ? doctor.hospital : '')} · ${this.escapeHTML(appointment.date)}</p><p>Ref: ${this.escapeHTML(appointment.id)}</p></div><span class="status">PENDING</span></div></article>`;
    }).join('');
  }

  showMessage(text, type) {
    this.message.textContent = text;
    this.message.className = `message${type ? ` ${type}` : ''}`;
  }

  escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }
}

function buildDirectoryFromProjectData() {
  if (!Array.isArray(window.D)) return new DoctorDirectory([]);
  const doctors = window.D.map((row, index) => new Doctor({
    id: `doc-${index}`, hospital: row[0], name: row[1], department: row[2],
    speciality: row[3], days: row[4], time: row[5]
  }));
  return new DoctorDirectory(doctors);
}

window.addEventListener('DOMContentLoaded', () => {
  const directory = buildDirectoryFromProjectData();
  const repository = new LocalStorageRepository();
  const service = new AppointmentService(directory, repository, 15);
  const ui = new PrototypeUI(directory, service);
  ui.init();
  if (!directory.doctors.length) {
    document.querySelector('#doctor-results').innerHTML = '<div class="empty-list">Could not load the bundled sample dataset.</div>';
  }
});

// Expose classes for coursework inspection and lightweight tests.
window.FindYourDoctorOOP = { Doctor, Patient, Appointment, DoctorDirectory, LocalStorageRepository, AppointmentService, PrototypeUI };
