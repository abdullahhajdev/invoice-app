const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.one(
      `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *`,
      [username, hashedPassword, role]
    );

    res.status(201).json(user);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation error code
      return res.status(409).json({ message: "Username already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.one(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

module.exports = { register, login };
