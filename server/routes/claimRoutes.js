const express = require("express");
const router = express.Router();

const { submitClaim, getMyClaims } = require("../controllers/claimController");
const protect = require("../middleware/authMiddleware");
const { studentOnly } = require("../middleware/roleMiddleware");

router.post("/", protect, studentOnly, submitClaim);
router.get("/mine", protect, studentOnly, getMyClaims);

module.exports = router;
