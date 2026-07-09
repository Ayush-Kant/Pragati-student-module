import express from "express";
import connectDB from "./config/db.js";
import studentProfileRouter from "./src/routes/index.js";
import errorHandler from "./src/middleware/errorHandler.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running",
    });
});

// ── Student Profile Module Routes ─────────────────────────────────────────────
app.use(studentProfileRouter);

// ── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
});

connectDB(process.env.POSTGRESQL_URI).catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
});