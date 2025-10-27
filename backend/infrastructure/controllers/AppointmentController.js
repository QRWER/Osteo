const AppointmentData = require('../../core/repositories/dto/AppointmentData');

class AppointmentController {
  constructor(appointmentService) {
    this.appointmentService = appointmentService;
  }

  async create(req, res) {
    try {
      console.log(req.body)
      const appointmentData = new AppointmentData(req.body);
      const result = await this.appointmentService.createAppointment(appointmentData);
      
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAvailableDaySlots(req, res) {
    try {
      console.log(req.body)
      const slots = await this.appointmentService.getAvailableDaySlots(req.body.date);
      
      res.json({ slots });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDaysWithAvailableSlots(req, res) {
  try {
    const { startDate, endDate, duration } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'startDate and endDate are required' 
      });
    }
    
    const days = await this.appointmentService.getDaysWithAvailableSlots(
      startDate, 
      endDate, 
      duration
    );
    
    res.json({ 
      days,
      totalDays: days.length 
    });
    
  } catch (error) {
    console.error('Ошибка получения дней со слотами:', error);
    res.status(400).json({ error: error.message });
  }
}
}

module.exports = AppointmentController;