// scripts/generateToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Use the mentor user's actual ID from your seed data
const payload = {
  id: 1,          // user ID from users table
  role: "mentor",
  email: "john@example.com"
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

console.log("Your test JWT token:");
console.log(token);