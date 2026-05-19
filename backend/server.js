import express from "express"
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const app = express();



connectDB(process.env.POSTGRESQL_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on PORT : ${PORT}`)
    })
})