const pool = require('../config/db');

exports.submitFeedback = async (req, res) => {
  try {
    const { userId, feedback } = req.body;

    if (!userId || !feedback) {
      return res.status(400).json({ message: 'User ID and feedback are required' });
    }

    await pool.query('INSERT INTO feedback (user_id, feedback, status) VALUES (?, ?, "pending")', [userId, feedback]);

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback Submission Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const [feedback] = await pool.query('SELECT * FROM feedback');
    res.json(feedback);
  } catch (error) {
    console.error('Fetch Feedback Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { feedbackId, status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await pool.query('UPDATE feedback SET status = ? WHERE id = ?', [status, feedbackId]);

    res.json({ message: `Feedback ${status} successfully` });
  } catch (error) {
    console.error('Update Feedback Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
