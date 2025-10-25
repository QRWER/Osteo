const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
  server: {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    corsOrigin: process.env.CORS_ORIGIN
  },
  business: {
    time: {
      startWorking: process.env.START_WORKING || '09:00',
      endWorking: process.env.END_WORKING || '18:00'
    }
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH
  },
  database: {
    url: process.env.DATABASE_URL
  },
  client: {
    url: process.env.CLIENT_URL
  }
};

// Пока необязательно (потом раскоментить)

// const requiredEnvVars = ['JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH'];
// requiredEnvVars.forEach(envVar => {
//   if (!process.env[envVar]) {
//     console.error(`Ошибка: Переменная окружения ${envVar} не установлена`);
//     process.exit(1);
//   }
// });

module.exports = config;