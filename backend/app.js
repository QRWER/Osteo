const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');

const SQLiteAppointmentRepository = require('./infrastructure/db/repositories/SQLiteAppointmentRepository');
const AppointmentService = require('./core/services/AppointmentService');
const AppointmentController = require('./infrastructure/controllers/AppointmentController');
const appointmentRoutes = require('./infrastructure/routes/appointments');

const SQLiteReviewRepository = require('./infrastructure/db/repositories/SQLiteReviewRepository');
const ReviewService = require('./core/services/ReviewService');
const ReviewController = require('./infrastructure/controllers/ReviewController');
const reviewRoutes = require('./infrastructure/routes/reviews');

class App {
  constructor() {
    this.app = express();
    this.setupDependencies();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupDependencies() {
    // TODO: Все таблицы через Pool
    this.appointmentRepo = new SQLiteAppointmentRepository(config.database.url);
    this.appointmentService = new AppointmentService(this.appointmentRepo);
    this.appointmentController = new AppointmentController(this.appointmentService);

    this.reviewRepo = new SQLiteReviewRepository(config.database.url);
    this.reviewService = new ReviewService(this.reviewRepo);
    this.reviewController = new ReviewController(this.reviewService);
  }

  setupMiddleware() {
    this.app.use(cors({
      origin: config.server.corsOrigin
    }));
    this.app.use(express.json());

    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
      next();
    });

    this.app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    }));
  }

  setupRoutes() {
    this.app.use('/api/appointments', appointmentRoutes(this.appointmentController));
    this.app.use('/api/reviews', reviewRoutes(this.reviewController));

    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Appointment + Reviews API'
      });
    });
    
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Маршрут не найден' });
    });

    this.app.use((error, req, res, next) => {
      console.error('Ошибка при установке роутов:', error);
      res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      });
    });
  }

  start() {
    const PORT = config.server.port;
    
    this.server = this.app.listen(PORT, () => {
      console.log('Сервер запущен!');
      console.log(`Порт: ${PORT}`);
      console.log(`База данных: ${config.database.url}`);
      console.log(`API документация: http://localhost:${PORT}/api/appointments`);
    });

    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  async shutdown() {
    console.log('Shutdown...');
    
    if (this.server) {
      this.server.close();
    }
    
    if (this.appointmentRepo) {
      await this.appointmentRepo.close();
    }
    
    console.log('Сервер остановлен');
    process.exit(0);
  }
}

if (require.main === module) {
  const app = new App();
  app.start();
}

module.exports = App;