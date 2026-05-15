import express from "express";
import connectDB from "./config/db.js";
import mentorRoutes from "./routes/mentor.routes.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use('/api/mentor', mentorRoutes);


connectDB(process.env.POSTGRESQL_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on PORT : ${PORT}`)
    })
})