const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

// สมัครสมาชิก
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'user')";
  db.query(query, [username, hashedPassword, email], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "User registered successfully" });
  });
});

// เข้าสู่ระบบ
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "secret_key", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  });
});

module.exports = router;
