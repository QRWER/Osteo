class AppointmentData {
  constructor({ clientName, clientEmail, appointmentDate, notes }) {
    this.clientName = clientName;
    this.clientEmail = clientEmail;
    this.appointmentDate = appointmentDate;
    this.notes = notes;
  }
}

module.exports = AppointmentData;