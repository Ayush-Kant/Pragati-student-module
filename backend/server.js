import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import studentRoutes from "./routes/studentRoutes.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/student", studentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
  });
});