const express = require("express");
const router = express.Router();

const {
    getPendingItems,
    getApprovedItems,
    approveItem,
    rejectItem,
    getAllUsers,
    getDashboardStats,
} = require("../controllers/adminController");

const { getAllClaims, approveClaim, rejectClaim } = require("../controllers/claimController");

const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

// Every route below needs the user to be logged in AND be an admin
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);

router.get("/items/pending", getPendingItems);
router.get("/items/approved", getApprovedItems);
router.put("/items/:id/approve", approveItem);
router.put("/items/:id/reject", rejectItem);

router.get("/claims", getAllClaims);
router.put("/claims/:id/approve", approveClaim);
router.put("/claims/:id/reject", rejectClaim);

module.exports = router;
