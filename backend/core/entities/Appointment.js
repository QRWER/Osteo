class Appointment {
  constructor({ id, clientName, clientEmail, appointmentDate, status, notes }) {
    this.id = id;
    this.clientName = clientName;
    this.clientEmail = clientEmail;
    this.appointmentDate = appointmentDate;
    this.status = status || 'pending';
    this.notes = notes;
    this.validate();
  }

  validate() {
    console.log(this.clientName, this.clientEmail, this.appointmentDate);
    if (!this.clientName || !this.clientEmail || !this.appointmentDate) {
      throw new Error('Пропущены обязательные поля');
    }
    if (!this.isValidEmail(this.clientEmail)) {
      throw new Error('Невалидный email');
    }
    if (this.appointmentDate < new Date()) {
      throw new Error('Невалидная дата записи');
    }
  }

  confirm() {
    this.status = 'confirmed';
  }

  cancel() {
    this.status = 'cancelled';
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

module.exports = Appointment;