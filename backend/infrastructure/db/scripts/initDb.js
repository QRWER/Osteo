const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const config = require('../../../config');

class DatabaseInitializer {
  constructor() {
    this.db = new sqlite3.Database(config.database.url);
  }

  runAsync(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => (err ? reject(err) : resolve()));
    });
  }

  async runSqlFile(filename) {
    const filePath = path.join(__dirname, 'sql', filename);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running SQL file: ${filename}`);
    await this.runAsync(sql);
  }

  async createTables() {
    console.log('Creating tables...');
    await Promise.all([
      this.runSqlFile('create_appointments.sql'),
      this.runSqlFile('create_reviews.sql')
    ]);
    console.log('Tables created successfully');
  }

  async createIndexes() {
    console.log('Creating indexes...');
    await this.runSqlFile('create_indexes.sql');
    console.log('Indexes created successfully');
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => (err ? reject(err) : resolve()));
    });
  }

  async initialize() {
    try {
      console.log('Starting database initialization...');
      await this.createTables();
      await this.createIndexes();
      console.log(`Database initialization complete: ${config.database.url}`);
    } catch (err) {
      console.error('Database initialization failed:', err);
      throw err;
    } finally {
      await this.close();
    }
  }
}

if (require.main === module) {
  new DatabaseInitializer()
    .initialize()
    .then(() => console.log('✅ Database ready to use!'))
    .catch((err) => {
      console.error('❌ Critical error during initialization:', err);
      process.exit(1);
    });
}

module.exports = { DatabaseInitializer };
