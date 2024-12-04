const express = require("express");
const router = express.Router();
const db = require('../db');  // ใช้งานการเชื่อมต่อฐานข้อมูล

// ดึงข้อมูลสินค้าทั้งหมด
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Database query error:", err);  // แสดงข้อผิดพลาดใน console
      return res.status(500).json({ message: "Database query error" });
    }
    res.json(results);
  });
});

// เพิ่มสินค้าลงในฐานข้อมูล
router.post("/", (req, res) => {
  const { name, price, image, description, category } = req.body;
  
  // ตรวจสอบว่าข้อมูลที่จำเป็นครบหรือไม่
  if (!name || !price || !category) {
    return res.status(400).json({ message: "Missing required fields: name, price, or category." });
  }

  // Query to insert data into the products table
  db.query(
    "INSERT INTO products (name, price, image, description, category) VALUES (?, ?, ?, ?, ?)",
    [name, price, image, description, category],
    (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);  // แสดงข้อผิดพลาดใน console
        return res.status(500).json({ message: "Error inserting data" });
      }
      res.status(201).json({ message: "Product added successfully", id: results.insertId });
    }
  );
});

// ลบสินค้า
router.delete("/:id", (req, res) => {
  const productId = req.params.id;

  // Query เพื่อลบข้อมูลสินค้า
  const query = "DELETE FROM products WHERE id = ?";
  
  db.query(query, [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting product", error: err });
    }
    if (result.affectedRows > 0) {
      return res.json({ message: "Product deleted successfully" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  });
});

router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const { name, price, image, description, category } = req.body;

  // สร้าง query หลัก
  let query = "UPDATE products SET ";
  let values = [];

  // ตรวจสอบว่ามีการส่งค่ามาจาก req.body หรือไม่
  if (name) {
    query += "name = ?, ";
    values.push(name);
  }
  if (price) {
    query += "price = ?, ";
    values.push(price);
  }
  if (image) {
    query += "image = ?, ";
    values.push(image);
  }
  if (description) {
    query += "description = ?, ";
    values.push(description);
  }
  if (category) {
    query += "category = ?, ";
    values.push(category);
  }

  // เอาคอมม่าออกจากท้าย query
  query = query.slice(0, -2);  // ลบคอมม่าออก

  // เพิ่มเงื่อนไข WHERE สำหรับ id ของสินค้าที่ต้องการอัปเดต
  query += " WHERE id = ?";

  // เพิ่มค่า id ที่ต้องการอัปเดต
  values.push(productId);

  // ทำการ query
  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating product", error: err });
    }
    if (result.affectedRows > 0) {
      return res.json({ message: "Product updated successfully" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  });
});


module.exports = router;
