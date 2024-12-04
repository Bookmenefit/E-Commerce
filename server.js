const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db');  // ใช้งานการเชื่อมต่อฐานข้อมูลจาก db.js

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const productRoutes = require("./routes/product");
app.use("/api/products", productRoutes);

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
