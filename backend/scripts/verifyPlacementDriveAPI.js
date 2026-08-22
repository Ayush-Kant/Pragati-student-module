import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { connectDB } from "../config/db.js";
import placementDriveRoutes from "../routes/placementDrives.routes.js";
import errorMiddleware from "../middleware/errorMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/placement-drives", placementDriveRoutes);
app.use(errorMiddleware);

async function runVerification() {
  await connectDB();
  const server = app.listen(5009, async () => {
    const baseURL = "http://localhost:5009/api/placement-drives";
    console.log("\n=======================================================");
    console.log("Testing Placement Drive Backend & PostgreSQL Database...");
    console.log("=======================================================\n");

    try {
      // 1. GET /
      console.log("1. Fetching placement drives from PostgreSQL database...");
      const resGet = await axios.get(baseURL);
      console.log(`✔ STATUS: ${resGet.status}`);
      console.log(`✔ DRIVES IN DB: ${resGet.data.length}`);
      console.log("Sample drive from DB:", JSON.stringify(resGet.data[0], null, 2));

      // 2. POST /
      console.log("\n2. Creating a new Placement Drive in database...");
      const newDrivePayload = {
        company: "Google Cloud",
        role: "Cloud Solutions Architect",
        package: "35 LPA",
        drive_date: "2026-12-01",
        deadline: "2026-11-20",
        status: "Upcoming",
        eligibility: {
          department: ["CSE", "IT"],
          cgpa: 8.0,
        },
        rounds: [
          { name: "Online Assessment", description: "DSA & System Design", order: 1 },
          { name: "Technical Interview I", description: "Coding & Algorithms", order: 2 },
          { name: "HR Interview", description: "Cultural Fitment", order: 3 },
        ],
      };

      const resPost = await axios.post(baseURL, newDrivePayload);
      console.log(`✔ STATUS: ${resPost.status}`);
      console.log("Created Drive Response:", JSON.stringify(resPost.data, null, 2));
      const createdId = resPost.data.id;

      // 3. GET /:id
      console.log(`\n3. Fetching single drive ID ${createdId}...`);
      const resGetOne = await axios.get(`${baseURL}/${createdId}`);
      console.log(`✔ STATUS: ${resGetOne.status}`);
      console.log("Fetched Drive Details:", JSON.stringify(resGetOne.data, null, 2));

      // 4. DELETE /:id
      console.log(`\n4. Cleaning up test drive ID ${createdId}...`);
      const resDel = await axios.delete(`${baseURL}/${createdId}`);
      console.log(`✔ STATUS: ${resDel.status}`);
      console.log("Delete Response:", resDel.data);

      console.log("\n=======================================================");
      console.log("✅ ALL PLACEMENT DRIVE DATABASE INTEGRATION TESTS PASSED!");
      console.log("=======================================================\n");

      server.close(() => process.exit(0));
    } catch (err) {
      console.error("❌ Verification failed:", err.response?.data || err.message);
      server.close(() => process.exit(1));
    }
  });
}

runVerification();
