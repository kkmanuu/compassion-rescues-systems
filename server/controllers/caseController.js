// controllers/caseController.js
const pool = require("../config/db");

exports.createCase = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      age,
      gender,
      location,
      case_type,
      description,
      severity,
    } = req.body;
    const userId = req.user.id;

    const [victimResult] = await pool.query(
      "INSERT INTO victims (name, phone, email, age, gender, location, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, phone, email, age, gender, location, userId]
    );

    const [caseResult] = await pool.query(
      "INSERT INTO cases (victim_id, case_type, description, severity, location, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [
        victimResult.insertId,
        case_type,
        description,
        severity,
        location,
        "pending",
      ]
    );

    const [newCase] = await pool.query("SELECT * FROM cases WHERE id = ?", [
      caseResult.insertId,
    ]);

    res
      .status(201)
      .json({ caseId: caseResult.insertId, created_at: newCase[0].created_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    let params;

    if (userRole === "admin") {
      query = `
        SELECT c.*, 
               v.name as victim_name, v.phone, v.email, v.age, v.gender, v.location
        FROM cases c
        JOIN victims v ON c.victim_id = v.id
        ORDER BY c.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT c.*, 
               v.name as victim_name, v.phone, v.email, v.age, v.gender, v.location
        FROM cases c
        JOIN victims v ON c.victim_id = v.id
        WHERE v.user_id = ?
        ORDER BY c.created_at DESC
      `;
      params = [userId];
    }

    const [cases] = await pool.query(query, params);
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCaseDetails = async (req, res) => {
  try {
    const { caseId } = req.params;

    const [cases] = await pool.query(
      `SELECT c.*, 
              v.name as victim_name, v.phone, v.email, v.age, v.gender, v.location
       FROM cases c
       JOIN victims v ON c.victim_id = v.id
       WHERE c.id = ?`,
      [caseId]
    );

    if (!cases.length) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(cases[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveCase = async (req, res) => {
  try {
    const { approved, feedback } = req.body;
    const caseId = req.params.id;

    // Validation
    if (typeof approved !== "boolean") {
      return res.status(400).json({ message: "Approval status is required" });
    }

    // Update database
    const [result] = await pool.query(
      "UPDATE cases SET status = ?, admin_feedback = ?, approved_at = ? WHERE id = ?",
      [
        approved ? "approved" : "rejected",
        feedback || null,
        approved ? new Date() : null,
        caseId,
      ]
    );

    // Check if update was successful
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json({
      message: `Case ${approved ? "approved" : "rejected"} successfully`,
    });
  } catch (error) {
    console.error("Approve Case Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    await pool.query("DELETE FROM messages WHERE case_id = ?", [caseId]);
    await pool.query("DELETE FROM cases WHERE id = ?", [caseId]);

    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("Delete Case Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;

    await pool.query("UPDATE cases SET status = ? WHERE id = ?", [
      status,
      caseId,
    ]);

    const [caseData] = await pool.query(
      "SELECT victim_id FROM cases WHERE id = ?",
      [caseId]
    );
    const victimId = caseData[0].victim_id;

    await pool.query(
      'INSERT INTO messages (case_id, user_id, sender_type, message) VALUES (?, ?, "admin", ?)',
      [caseId, victimId, `Your case has been ${status.toLowerCase()}.`]
    );

    res.json({ message: "Status updated and user notified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = exports;
