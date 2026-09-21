const express = require("express");
const router = express.Router();

const { reportFoundItem, getMyReportedItems, getFoundItems, getItemById } = require("../controllers/itemController");
const protect = require("../middleware/authMiddleware");
const { studentOnly } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public - anyone can see approved found items
router.get("/found", getFoundItems);

// Student only
router.post("/", protect, studentOnly, upload.single("image"), reportFoundItem);
router.get("/mine", protect, studentOnly, getMyReportedItems);

// Anyone logged in can view one item's details
router.get("/:id", protect, getItemById);

module.exports = router;
