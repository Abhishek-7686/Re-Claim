// This file just connects our server to MongoDB using Mongoose.

const mongoose = require("mongoose");

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        // If the database is not connected, there is no point running the server
        process.exit(1);
    }
}

module.exports = connectDB;
