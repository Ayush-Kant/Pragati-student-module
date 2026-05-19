// scripts/generateToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Use the mentor user's actual ID from your seed data
const payload = {
  uid: 1,          // maps to auth_users.id in this feature branch
  role: "mentor",
  email: "mentor@example.com"
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

console.log("Your test JWT token:");
console.log(token);