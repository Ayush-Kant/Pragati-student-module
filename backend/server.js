import express from "express";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running",
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
});

connectDB(process.env.POSTGRESQL_URI).catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
});