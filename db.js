const mysql = require("mysql2");

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: "localhost", // หรือ IP ของเครื่องที่รัน MySQL
    user: "root", // ชื่อผู้ใช้งาน MySQL (ค่าเริ่มต้นคือ root)
    password: "", // รหัสผ่านของ MySQL (ค่าเริ่มต้น XAMPP คือค่าว่าง)
    database: "ecommerce", // ชื่อฐานข้อมูลที่สร้างไว้
});

// ทดสอบการเชื่อมต่อ
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err);
        process.exit(1); // หยุดโปรแกรมหากเชื่อมต่อไม่ได้
    }
    console.log("Connected to the database!");
});

module.exports = db;
