const express = require("express");
const router = express.Router();

const { registerStudent, registerAdmin, login, getMyProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register/student", registerStudent);
router.post("/register/admin", registerAdmin);
router.post("/login", login);
router.get("/me", protect, getMyProfile);

module.exports = router;
