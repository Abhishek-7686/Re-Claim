// This file handles claim requests - a student saying "this item is mine".

const Claim = require("../models/Claim");
const Item = require("../models/Item");

// @route   POST /api/claims   (student only)
async function submitClaim(req, res) {
    try {
        const { itemId, claimDetails } = req.body;

        if (!itemId || !claimDetails) {
            return res.status(400).json({ message: "Please describe why this item belongs to you" });
        }

        let item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.status !== "available") {
            return res.status(400).json({ message: "This item is not available to claim" });
        }

        // Stop the same student from spamming multiple claims on one item
        let existingClaim = await Claim.findOne({
            item: itemId,
            student: req.user.id,
            status: "pending",
        });
        if (existingClaim) {
            return res.status(400).json({ message: "You have already submitted a claim for this item" });
        }

        let newClaim = await Claim.create({
            item: itemId,
            student: req.user.id,
            claimDetails,
            status: "pending",
        });

        res.status(201).json({ message: "Claim submitted. An admin will review it soon.", claim: newClaim });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/claims/mine   (student only)
async function getMyClaims(req, res) {
    try {
        let claims = await Claim.find({ student: req.user.id })
            .populate("item")
            .sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   GET /api/admin/claims   (admin only)
async function getAllClaims(req, res) {
    try {
        let claims = await Claim.find({ status: "pending" })
            .populate("item")
            .populate("student", "name email studentId phone")
            .sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   PUT /api/admin/claims/:id/approve   (admin only)
async function approveClaim(req, res) {
    try {
        let claim = await Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        claim.status = "approved";
        await claim.save();

        // Once a claim is approved, the item officially belongs to that student
        await Item.findByIdAndUpdate(claim.item, { status: "claimed" });

        res.json({ message: "Claim approved. Item marked as claimed." });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

// @route   PUT /api/admin/claims/:id/reject   (admin only)
async function rejectClaim(req, res) {
    try {
        let claim = await Claim.findById(req.params.id);
        if (!claim) {
            return res.status(404).json({ message: "Claim not found" });
        }

        claim.status = "rejected";
        await claim.save();

        res.json({ message: "Claim rejected" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { submitClaim, getMyClaims, getAllClaims, approveClaim, rejectClaim };
