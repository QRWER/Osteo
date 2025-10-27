const express = require('express');
const AppointmentController = require('../controllers/AppointmentController');

const router = express.Router();

module.exports = (appointmentController) => {
  router.post('/', (req, res) => appointmentController.create(req, res));

  //router.get('/:id', (req, res) => appointmentController.getById(req, res));
  router.get('/available-slots', (req, res) => appointmentController.getAvailableDaySlots(req, res));
  router.post('/available-days', (req, res) => appointmentController.getDaysWithAvailableSlots(req, res));
  
  //router.delete('/:id', (req, res) => appointmentController.delete(req, res));

  return router;
};