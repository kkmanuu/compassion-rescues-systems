const pool = require('../config/db');

const submitFeedback = async (req, res) => {
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

const getAllFeedback = async (req, res) => {
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

const updateFeedbackStatus = async (req, res) => {
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

const submitAdminFeedback = async (req, res) => {
  try {
    const { role } = req.user;
    const { feedbackId, response } = req.body;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can submit feedback responses' });
    }

    if (!feedbackId || !response) {
      return res.status(400).json({ message: 'Feedback ID and response are required' });
    }

    await pool.query(
      'UPDATE feedback SET admin_response = ?, status = "responded" WHERE id = ?',
      [response, feedbackId]
    );

    res.json({ message: 'Feedback response submitted successfully' });
  } catch (error) {
    console.error('Admin Feedback Submission Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  submitAdminFeedback
};