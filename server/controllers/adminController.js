// This file handles admin-only actions: viewing pending reports, approving
// or rejecting them, seeing dashboard stats, and listing registered users.

const Item = require("../models/Item");
const Claim = require("../models/Claim");
const User = require("../models/User");

// @route   GET /api/admin/contact   (public - no login needed)
// Used by the Contact page to show real admin details instead of a form.
async function getPublicAdminContact(req, res) {
    try {
        let admin = await User.findOne({ role: "admin" }).select(
            "name email office officeLocation phone officeHours"
        );
        res.json(admin || null);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/admin/items/pending
async function getPendingItems(req, res) {
    try {
        let items = await Item.find({ status: "pending" })
            .populate("reportedBy", "name email studentId phone")
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/admin/items/approved
async function getApprovedItems(req, res) {
    try {
        let items = await Item.find({ status: { $in: ["available", "claimed"] } })
            .populate("reportedBy", "name")
            .sort({ approvedAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   PUT /api/admin/items/:id/approve
// Admin confirms they physically received the item, so it becomes public
async function approveItem(req, res) {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.status = "available";
        item.approvedBy = req.user.id;
        item.approvedAt = new Date();
        await item.save();

        res.json({ message: "Item approved and is now visible on the Found Items page", item });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   PUT /api/admin/items/:id/reject
// The physical item was never received / report was invalid, so we remove it
async function rejectItem(req, res) {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item report rejected" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/admin/users
async function getAllUsers(req, res) {
    try {
        let users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/admin/stats
async function getDashboardStats(req, res) {
    try {
        let pendingCount = await Item.countDocuments({ status: "pending" });
        let availableCount = await Item.countDocuments({ status: "available" });
        let claimedCount = await Item.countDocuments({ status: "claimed" });
        let pendingClaimsCount = await Claim.countDocuments({ status: "pending" });
        let usersCount = await User.countDocuments();

        res.json({
            pendingReports: pendingCount,
            availableItems: availableCount,
            claimedItems: claimedCount,
            pendingClaims: pendingClaimsCount,
            totalUsers: usersCount,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = {
    getPublicAdminContact,
    getPendingItems,
    getApprovedItems,
    approveItem,
    rejectItem,
    getAllUsers,
    getDashboardStats,
};
