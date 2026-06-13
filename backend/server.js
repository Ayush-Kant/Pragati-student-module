import express from "express";
import connectDB from "./config/db.js";
import mentorRoutes from "./routes/mentor.routes.js";
import interviewRoutes from "./routes/interview.routes.js";


const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "Backend is running",
    });
});

app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/company/interviews", interviewRoutes);


app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
});

connectDB(process.env.POSTGRESQL_URI).catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
});