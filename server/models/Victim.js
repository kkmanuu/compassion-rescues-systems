const pool = require("../config/db");

class Victim {
  static async create(name, phone, email, age, gender, location) {
    const [result] = await pool.query(
      "INSERT INTO victims (name, phone, email, age, gender, location) VALUES (?, ?, ?, ?, ?, ?)",
      [name, phone, email, age, gender, location]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM victims WHERE id = ?", [id]);
    return rows[0];
  }
}

module.exports = Victim;
