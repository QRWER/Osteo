const TimeHandler = require("../utils/TimeHandler");
const Appointment = require('../entities/Appointment');

// Тут высокоуровневая логика взаимодействия с записями
class AppointmentService {
  constructor(appointmentRepo) {
    this.appointmentRepo = appointmentRepo;
  }

  async isTimeSlotAvailable(appointmentDate, duration) {
    return true
  }

  async createAppointment(appointmentData) {
    console.log(appointmentData)
    const appointment = new Appointment(appointmentData); // TODO: Class Email

    const isAvailable = await this.isTimeSlotAvailable(
      appointment.appointmentDate,
      appointment.duration
    );

    if (!isAvailable) {
      throw new Error('Невалидное время для записи');
    }

    // TODO: Здесь можно поставить лимиты на записи для одного человека

    const savedAppointment = await this.appointmentRepo.createRecord(appointment);
    // TODO: Здесь добавить отправку сообщений/email

    return {
      appointmentId: savedAppointment.id,
      status: savedAppointment.status,
      message: 'Success'
    };
  }

  /**
 * Модуль для работы с записями на прием (appointments)
 * Соответствует структуре SQL таблицы appointments
 */

/**
 * Валидирует объект записи на прием
 * @param {Object} appointment - Объект записи для валидации
 * @returns {Array} Массив ошибок, пустой если ошибок нет
 */
function validateAppointment(appointment) {
    const errors = [];
    
    if (!appointment.client_name || appointment.client_name.trim() === "") {
        errors.push("client_name is required");
    }
    
    if (!appointment.client_email || appointment.client_email.trim() === "") {
        errors.push("client_email is required");
    } else if (!isValidEmail(appointment.client_email)) {
        errors.push("client_email is not valid");
    }
    
    if (!appointment.appointment_date || !(appointment.appointment_date instanceof Date)) {
        errors.push("appointment_date is required and must be a Date object");
    }
    
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (appointment.status && !validStatuses.includes(appointment.status)) {
        errors.push("status must be one of: " + validStatuses.join(", "));
    }
    
    return errors;
}

/**
 * Обрабатывает объект записи на прием (основная функция)
 * @param {Object} appointment - Объект записи
 * @returns {Object} Результат обработки { success: boolean, data: Object, errors: Array }
 */
function processAppointment(appointment) {
    // Валидация
    const validationErrors = validateAppointment(appointment);
    
    if (validationErrors.length > 0) {
        return {
            success: false,
            data: null,
            errors: validationErrors
        };
    }
    
    // Обработка валидного объекта
    const processedAppointment = {
        ...appointment,
        updated_at: new Date() // Обновляем временную метку
    };
    
    // Если нет created_at, устанавливаем текущее время
    if (!processedAppointment.created_at) {
        processedAppointment.created_at = new Date();
    }
    
    return {
        success: true,
        data: processedAppointment,
        errors: []
    };
}

/**
 * Проверяет валидность email формата
 * @param {string} email - Email для проверки
 * @returns {boolean} true если email валиден
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Экспорт функций для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateAppointment,
        processAppointment,
        isValidEmail
    };
}

  generateAllDaySlots(workingHours, duration) {
    console.log(workingHours)
    if (!workingHours.working) {
      return [];
    }

    const slots = [];
    const [startHour, startMinute] = workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = workingHours.end.split(':').map(Number);
    
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);
    
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);

      if (slotEnd <= endTime) {
        slots.push({
          start: new Date(currentTime),
          end: slotEnd,
          duration: duration,
          formatted: TimeHandler.formatTimeSlot(currentTime, slotEnd)
        });
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    
    return slots;
  }


  async getAvailableDaySlots(date, duration = 60) {
    try {
      console.log(date)
      const workingHours = TimeHandler.getWorkingHours(date);
      const busySlots = await this.appointmentRepo.getBusySlots(date);
      console.log('workingHours', workingHours)

      const allSlots = this.generateAllDaySlots(workingHours, duration);
      console.log('allSlots', allSlots)
      const availableSlots = TimeHandler.filterAvailableSlots(allSlots, busySlots);
      console.log('availableSlots', availableSlots)

      return availableSlots;
      
    } catch (error) {
      console.error('Ошибка получения доступных слотов:', error);
      throw error;
    }
  }

  
  async getDaysWithAvailableSlots(startDate, endDate, duration = 60) {
    try {
      const daysWithSlots = [];
      const currentDate = new Date(startDate);
      const end = new Date(endDate);

      while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const workingHours = TimeHandler.getWorkingHours(dateStr);

        if (!workingHours.working) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }
        
        try {
          const availableSlots = await this.getAvailableDaySlots(dateStr, duration);
          
          if (availableSlots.length > 0) {
            daysWithSlots.push({
              date: dateStr,
              availableSlots: availableSlots.length,
              workingHours: workingHours
            });
          }
        } catch (error) {
          console.error(`Ошибка при попытке обработки ${dateStr} дня:`, error);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return daysWithSlots;
      
    } catch (error) {
      console.error('Ошибка получения дней с доступными слотами:', error);
      throw error;
    }
  }
}

module.exports = AppointmentService;
