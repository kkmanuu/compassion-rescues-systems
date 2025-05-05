const pool = require("../config/db");

class Case {
  static async create(victimId, caseType, description, severity, location) {
    const [result] = await pool.query(
      'INSERT INTO cases (victim_id, case_type, description, severity, location, status) VALUES (?, ?, ?, ?, ?, "pending")',
      [victimId, caseType, description, severity, location]
    );
    return result.insertId;
  }

  
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT c.*, v.name as victim_name, v.phone, v.email, v.age, v.gender 
      FROM cases c
      JOIN victims v ON c.victim_id = v.id
      ORDER BY c.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT c.*, v.name as victim_name, v.phone, v.email, v.age, v.gender 
      FROM cases c
      JOIN victims v ON c.victim_id = v.id
      WHERE c.id = ?
    `,
      [id]
    );
    return rows[0];
  }

  static async updateStatus(id, status) {
    await pool.query("UPDATE cases SET status = ? WHERE id = ?", [status, id]);
  }
}

module.exports = Case;
