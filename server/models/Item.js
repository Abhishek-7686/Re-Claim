// This model stores every found item that a student reports.

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        itemName: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        color: { type: String }, // optional
        locationFound: { type: String, required: true },
        dateFound: { type: Date, required: true },
        image: { type: String, required: true }, // stored file name / path
        additionalDetails: { type: String }, // optional

        // Who reported this item
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Item goes: pending -> available -> claimed
        status: {
            type: String,
            enum: ["pending", "available", "claimed"],
            default: "pending",
        },

        // Filled in once an admin approves the report
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        approvedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Item", itemSchema);
