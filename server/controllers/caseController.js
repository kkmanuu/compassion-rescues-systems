const pool = require('../config/db');

exports.createCase = async (req, res) => {
  try {
    const { name, phone, email, age, gender, location, case_type, description, severity } = req.body;
    
    const [victimResult] = await pool.query(
      'INSERT INTO victims (name, phone, email, age, gender, location) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, email, age, gender, location]
    );
    
    const [caseResult] = await pool.query(
      'INSERT INTO cases (victim_id, case_type, description, severity, location) VALUES (?, ?, ?, ?, ?)',
      [victimResult.insertId, case_type, description, severity, location]
    );
    
    res.status(201).json({ caseId: caseResult.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const [cases] = await pool.query(`
      SELECT c.*, v.name as victim_name, v.phone 
      FROM cases c
      JOIN victims v ON c.victim_id = v.id
      ORDER BY c.created_at DESC
    `);
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getCaseDetails = async (req, res) => {
  try {
    const { caseId } = req.params;

    const [cases] = await pool.query(
      `SELECT c.*, v.name as victim_name 
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
    console.error('Database error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    
    // Delete messages related to this case (if applicable)
    await pool.query('DELETE FROM messages WHERE case_id = ?', [caseId]);
    
    // Delete the case itself
    await pool.query('DELETE FROM cases WHERE id = ?', [caseId]);

    res.json({ message: 'Case deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.updateCaseStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE cases SET status = ? WHERE id = ?',
      [status, caseId]
    );

    // Send a notification message to the user
    const [caseData] = await pool.query('SELECT victim_id FROM cases WHERE id = ?', [caseId]);
    const victimId = caseData[0].victim_id;

    await pool.query(
      'INSERT INTO messages (case_id, user_id, sender_type, message) VALUES (?, ?, "admin", ?)',
      [caseId, victimId, `Your case has been ${status.toLowerCase()}.`]
    );

    res.json({ message: 'Status updated and user notified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
