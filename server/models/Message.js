const pool = require("../config/db");

class Message {
  static async create(caseId, senderType, message) {
    const [result] = await pool.query(
      "INSERT INTO messages (case_id, sender_type, message) VALUES (?, ?, ?)",
      [caseId, senderType, message]
    );
    return result.insertId;
  }

  static async findByCaseId(caseId) {
    const [rows] = await pool.query(
      "SELECT * FROM messages WHERE case_id = ? ORDER BY created_at ASC",
      [caseId]
    );
    return rows;
  }
  
}

module.exports = Message;
