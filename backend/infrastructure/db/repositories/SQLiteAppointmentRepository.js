const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;
const IAppointmentRepository = require('../../../core/repositories/IAppointmentRepository');

class SQLiteAppointmentRepository extends IAppointmentRepository {
  constructor(dbPath) {
    super();
    this.db = new sqlite3.Database(dbPath);
    this.sqlDir = path.join(__dirname, '..', 'scripts', 'sql', 'appointments');
    this.queries = {};
    this._loadQueries();
  }

  // TODO: Переписать это говно
  async _loadQueries() {
    try {
      const files = await fs.readdir(this.sqlDir);
      
      for (const file of files) {
        if (file.endsWith('.sql')) {
          const queryName = this._getQueryName(file);
          const filePath = path.join(this.sqlDir, file);
          const sql = await fs.readFile(filePath, 'utf8');
          this.queries[queryName] = sql;
        }
      }

    } catch (error) {
      console.error('Ошибка загрузки SQL запросов:', error);
      throw error;
    }
  }

  _getQueryName(filename) {
    return filename
      .replace('.sql', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  async createRecord(appointmentData) {
    return new Promise((resolve, reject) => {
      const params = [
        appointmentData.clientName,
        appointmentData.clientEmail,
        appointmentData.appointmentDate,
        appointmentData.notes || null,
        'pending'
      ];
      console.log(params)

      this.db.run(this.queries.CreateRecord, params, function(err) {
        if (err) {
          console.error('Ошибка создания записи в таблице Appointments:', err);
          reject(err);
        } else {
          const result = {
            id: this.lastID,
            ...appointmentData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          resolve(result);
        }
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(this.queries.GetById, [id], (err, row) => {
        if (err) {
          console.error('Ошибка поиска записи по ID в таблице Appointments:', err);
          reject(err);
        } else if (!row) {
          reject(new Error(`Не найдена запись в таблице Appointments по ID`));
        } else {
          const appointment = {
            ...row,
            appointment_date: new Date(row.appointment_date),
            created_at: new Date(row.created_at),
            updated_at: new Date(row.updated_at)
          };
          resolve(appointment);
        }
      });
    });
  }

  async getBusySlots(date) {
    return new Promise((resolve, reject) => {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      this.db.all(this.queries.GetBusySlots, [targetDate], (err, rows) => {
        if (err) {
          console.error('Ошибка получения занятых слотов:', err);
          reject(err);
        } else {
          const busySlots = rows.map(row => ({
            start: new Date(row.appointment_date),
            end: new Date(new Date(row.appointment_date).getTime() + 60 * 60000),
            status: row.status
          }));
          
          resolve(busySlots);
        }
      });
    });
  }



  // async getRecordsByMonth(email = null, date = null) {
  //   return new Promise((resolve, reject) => {
  //     let sql = this.queries.GetRecordsByMonth;
  //     const params = [date || new Date().toISOString()];
      
  //     if (email) {
  //       sql += ' AND client_email = ?';
  //       params.push(email);
  //     }
      
  //     // TODO Подумать над этой херней
  //     sql += ' ORDER BY appointment_date ASC';

  //     this.db.all(sql, params, (err, rows) => {
  //       if (err) {
  //         console.error('Ошибка поиска записей по месяцу в таблице Appointments:', err);
  //         reject(err);
  //       } else {
  //         const appointments = rows.map(row => ({
  //           ...row,
  //           appointment_date: new Date(row.appointment_date),
  //           created_at: new Date(row.created_at),
  //           updated_at: new Date(row.updated_at)
  //         }));

  //         resolve(appointments);
  //       }
  //     });
  //   });
  // }

  async deleteById(id, status = null) {
    return new Promise((resolve, reject) => {
      let sql = this.queries.DeleteById;
      const params = [id];
      
      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }

      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Ошибка удаления записи в таблице Appointments:', err);
          reject(err);
        } else if (this.changes === 0) {
          const message = status 
            ? `Appointment with ID ${id} and status '${status}' not found`
            : `Appointment with ID ${id} not found`;
          reject(new Error(message));
        } else {
          resolve({ 
            deleted: true, 
            id: id,
            changes: this.changes 
          });
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          console.error('Ошибка закрытия таблицы Appointments:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = SQLiteAppointmentRepository;