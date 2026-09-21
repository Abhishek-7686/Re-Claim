// This model stores a student's request to claim a found item.

const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        claimDetails: {
            type: String,
            required: true, // e.g. "It's my black wallet, has my college ID inside"
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Claim", claimSchema);
