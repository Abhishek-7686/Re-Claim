// This is the starting point of our backend server.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const adminRoutes = require("./routes/adminRoutes");
const claimRoutes = require("./routes/claimRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// ===== Middleware =====
app.use(cors()); // allows our frontend (running on a different port) to call this API
app.use(express.json()); // lets us read JSON data sent in requests

// Make the "uploads" folder public so item images can be viewed in the browser
// e.g. http://localhost:5000/uploads/item_12345.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/claims", claimRoutes);

// Simple route to check the server is alive
app.get("/api/health", (req, res) => {
    res.json({ message: "ReClaim server is running" });
});

// ===== Error handler for file upload errors (e.g. wrong image type) =====
app.use((error, req, res, next) => {
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`ReClaim server running on http://localhost:${PORT}`);
});
