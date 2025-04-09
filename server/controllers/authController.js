const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { identifier, password, loginType } = req.body;

  if (!identifier || !password || !loginType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let query;
    let params;

    if (loginType === "admin") {
      query = `SELECT * FROM admins WHERE email = ? LIMIT 1`;
      params = [identifier]; // Admins use email to log in
    } else {
      query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
      params = [identifier]; // Users use username to log in
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // Validate password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: loginType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: loginType,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Register Request:", { username, password }); // Log incoming data

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword); // Log the hash

    await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, "user")',
      [username, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("Admin Register Request:", { username, email, password }); // Log incoming data

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required for admin registration" });
    }

    const [existingAdmins] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingAdmins.length > 0) {
      return res
        .status(400)
        .json({ message: "Admin username or email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Admin Hashed Password:", hashedPassword); // Log the hash

    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "admin")',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
