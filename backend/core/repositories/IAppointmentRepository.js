class IAppointmentRepository {
  async createRecord(appointmentData) {
    throw new Error('Method not implemented');
  }

  async getById(id) {
    throw new Error('Method not implemented');
  }

  // async getRecordsByMonth(email, date) {
  //   throw new Error('Method not implemented');
  // }

  // TODO: Автоматическое удаление записи после истечения времени записи (приёма)
  async deleteById(id, status) {
    throw new Error('Method not implemented');
  }

  async getBusySlots(date) {
    throw new Error('Method not implemented');
  }

  // TODO: Метод получения записи по имени/email
}

module.exports = IAppointmentRepository;