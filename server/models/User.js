// One "users" collection is used for both students and admins.
// The "role" field tells us which type of user this is.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true, // this will store the HASHED password, never plain text
        },
        role: {
            type: String,
            enum: ["student", "admin"],
            required: true,
        },

        // ---- Student-only fields ----
        studentId: { type: String },
        department: { type: String },
        year: { type: Number },
        phone: { type: String },

        // ---- Forgot password (OTP) fields ----
        // These are only ever filled in temporarily while someone is
        // resetting their password, then cleared again.
        resetPasswordOtp: { type: String, default: null }, // stored hashed, never plain text
        resetPasswordOtpExpires: { type: Date, default: null },

        // ---- Admin-only fields ----
        staffId: { type: String },
        // These extra fields are shown to students so they know where to
        // physically hand over a found item. They are not part of the
        // registration form, so we just fill in sensible defaults.
        office: { type: String, default: "Student Affairs Office" },
        officeLocation: { type: String, default: "Admin Block, Room 102" },
        officeHours: { type: String, default: "10:00 AM - 4:00 PM" },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("User", userSchema);
