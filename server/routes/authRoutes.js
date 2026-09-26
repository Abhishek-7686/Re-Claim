const express = require("express");
const router = express.Router();

const {
    registerStudent,
    registerAdmin,
    login,
    requestPasswordResetOtp,
    verifyOtpAndResetPassword,
    getMyProfile,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register/student", registerStudent);
router.post("/register/admin", registerAdmin);
router.post("/login", login);
router.post("/forgot-password/request-otp", requestPasswordResetOtp);
router.post("/forgot-password/verify-otp", verifyOtpAndResetPassword);
router.get("/me", protect, getMyProfile);

module.exports = router;
