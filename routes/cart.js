const express = require("express");
const db = require("../db");
const router = express.Router();

// ดึงข้อมูลตะกร้าสินค้า
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM cart WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// เพิ่มสินค้าลงตะกร้า
router.post("/", (req, res) => {
  const { userId, productId, quantity } = req.body;

  const query = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
  db.query(query, [userId, productId, quantity], (err) => {
    if (err) return res.status(500).json({ message: "Error adding to cart", error: err });
    res.status(201).json({ message: "Product added to cart" });
  });
});

module.exports = router;
