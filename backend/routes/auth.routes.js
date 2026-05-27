import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// TEMP LOGIN (for testing only)
router.post("/login", (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;