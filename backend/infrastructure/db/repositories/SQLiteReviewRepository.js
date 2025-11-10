const sqlite3 = require('sqlite3').verbose();

class SQLiteReviewRepository {
  constructor(dbPath) {
    this.db = new sqlite3.Database(dbPath);
  }

  async createReview(data) {
    const sql = `
      INSERT INTO reviews (client_name, text, rating)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [data.client_name, data.text, data.rating], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      });
    });
  }

  async getApprovedReviews() {
    const sql = `SELECT * FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async approveReview(id) {
    const sql = `UPDATE reviews SET is_approved = 1 WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [id], function (err) {
        if (err) return reject(err);
        resolve({ updated: this.changes });
      });
    });
  }

  async deleteReview(id) {
    const sql = `DELETE FROM reviews WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [id], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      });
    });
  }

  async close() {
    this.db.close();
  }
}

module.exports = SQLiteReviewRepository;
