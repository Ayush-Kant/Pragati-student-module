// src/app.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Routes
// ===============================

const codingChallengeRoutes = require("./routes/codingChallengeRoutes");
const { initializeDatabase } = require("./config/initDatabase");

app.use("/api/student/coding-challenges", codingChallengeRoutes);

initializeDatabase()
  .then(() => console.log("Database initialized successfully"))
  .catch((error) => {
    console.error("Database initialization failed:", error);
  });

// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Coding Challenges Backend API is running 🚀",
  });
});

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===============================
// Global Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// Start Server
// ===============================

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${fallbackPort} instead...`);
      server.close(() => startServer(fallbackPort));
    } else {
      console.error("Server failed to start:", error);
      process.exit(1);
    }
  });
};

const PORT = Number(process.env.PORT) || 5000;
startServer(PORT);