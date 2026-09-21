// This file handles: student register, admin register, login, and
// fetching the logged-in user's own profile.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Small helper to create a login token for a user
function createToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// @route   POST /api/auth/register/student
async function registerStudent(req, res) {
    try {
        const { name, email, studentId, department, year, phone, password, confirmPassword } = req.body;

        if (!name || !email || !studentId || !department || !year || !phone || !password) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        let existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists" });
        }

        // Hash the password before saving - never store plain text passwords
        let hashedPassword = await bcrypt.hash(password, 10);

        let newStudent = await User.create({
            name,
            email,
            studentId,
            department,
            year,
            phone,
            password: hashedPassword,
            role: "student",
        });

        let token = createToken(newStudent);

        res.status(201).json({
            message: "Student registered successfully",
            token,
            user: {
                id: newStudent._id,
                name: newStudent.name,
                email: newStudent.email,
                role: newStudent.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   POST /api/auth/register/admin
async function registerAdmin(req, res) {
    try {
        const { name, email, staffId, department, phone, adminKey, password, confirmPassword } = req.body;

        if (!name || !email || !staffId || !department || !phone || !adminKey || !password) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // This is what stops random students from making themselves admin
        if (adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
            return res.status(403).json({ message: "Invalid Admin Registration Key" });
        }

        let existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let newAdmin = await User.create({
            name,
            email,
            staffId,
            department,
            phone,
            password: hashedPassword,
            role: "admin",
        });

        let token = createToken(newAdmin);

        res.status(201).json({
            message: "Admin registered successfully",
            token,
            user: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   POST /api/auth/login
async function login(req, res) {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter email and password" });
        }

        let user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // If the person picked a role tab on the login page, make sure it matches
        if (role && user.role !== role) {
            return res.status(400).json({ message: `This account is not registered as ${role}` });
        }

        let passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        let token = createToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/auth/me   (needs login token)
async function getMyProfile(req, res) {
    try {
        let user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { registerStudent, registerAdmin, login, getMyProfile };
