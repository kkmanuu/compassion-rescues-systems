const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { identifier, password, role } = req.body;

  // Validate required fields
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Username and password are required' });
  }

  const field = role === 'admin' ? 'email' : 'username';
  const query = `SELECT * FROM users WHERE ${field} = ? LIMIT 1`;

  try {
    const [rows] = await pool.query(query, [identifier]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Validate password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, "user")',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required for admin registration' });
    }

    const [existingAdmins] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: 'Admin username or email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "admin")',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Admin Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
