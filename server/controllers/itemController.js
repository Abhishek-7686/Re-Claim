// This file handles everything related to reporting and viewing items.

const Item = require("../models/Item");
const User = require("../models/User");

// @route   POST /api/items   (student only, sends image as form-data)
async function reportFoundItem(req, res) {
    try {
        const { itemName, category, description, color, locationFound, dateFound, additionalDetails } = req.body;

        // Basic validation on the backend (frontend already checks this too)
        if (!itemName || !category || !description || !locationFound || !dateFound) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image of the item" });
        }

        let newItem = await Item.create({
            itemName,
            category,
            description,
            color,
            locationFound,
            dateFound,
            additionalDetails,
            image: req.file.filename, // just the file name, we build the full URL later
            reportedBy: req.user.id,
            status: "pending",
        });

        // Find an admin to show their contact details to the student,
        // so the student knows who to physically hand the item to.
        let admin = await User.findOne({ role: "admin" }).select(
            "name office officeLocation phone officeHours"
        );

        res.status(201).json({
            message: "Report submitted successfully. Please hand over the item to the admin below.",
            item: newItem,
            admin: admin || null,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/items/mine   (student only - items they reported)
async function getMyReportedItems(req, res) {
    try {
        let items = await Item.find({ reportedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/items/found   (public - only available & claimed items, never pending)
async function getFoundItems(req, res) {
    try {
        let items = await Item.find({ status: { $in: ["available", "claimed"] } })
            .populate("reportedBy", "name")
            .sort({ approvedAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/items/:id   (view one item's full details)
async function getItemById(req, res) {
    try {
        let item = await Item.findById(req.params.id).populate("reportedBy", "name email studentId");
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { reportFoundItem, getMyReportedItems, getFoundItems, getItemById };
