const express = require("express");
const router = express.Router();
const db = require("../db");

// เพิ่มสินค้าใหม่
router.post("/", (req, res) => {
    const { name, price, stock, image, description, category } = req.body;

    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาครบ
    if (!name || !price || !stock) {
        return res.status(400).json({ message: "Missing required fields (name, price, stock)" });
    }

    const query = `
        INSERT INTO products (name, price, stock, image, description, category)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, price, stock, image || null, description || null, category || null];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ message: "Error adding product", error: err });
        }
        res.status(201).json({ message: "Product added successfully", productId: result.insertId });
    });
});

// ดึงข้อมูลสินค้าทั้งหมด
router.get("/", (req, res) => {
    const query = "SELECT * FROM products";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ message: "Error fetching products", error: err });
        }
        res.status(200).json(results);
    });
});

// ดึงข้อมูลสินค้าตาม ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM products WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ message: "Error fetching product", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(results[0]);
    });
});

// อัปเดตข้อมูลสินค้า
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, price, stock, image, description, category } = req.body;

    const query = `
        UPDATE products
        SET name = ?, price = ?, stock = ?, image = ?, description = ?, category = ?
        WHERE id = ?
    `;
    const values = [name, price, stock, image || null, description || null, category || null, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({ message: "Error updating product", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully" });
    });
});

// ลบสินค้า
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM products WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ message: "Error deleting product", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    });
});

module.exports = router;
