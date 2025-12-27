const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business"
    },
    action: {
        type: String, // e.g., "CREATE_ITEM", "DELETE_STAFF", "LOGIN", "UPDATE_BUSINESS"
        required: true
    },
    module: {
        type: String, // e.g., "INVENTORY", "STAFF", "AUTH", "BUSINESS"
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed // JSON object with specific details
    },
    ipAddress: String,
    userAgent: String
}, { timestamps: true });

// Index for auditing speed
activityLogSchema.index({ businessId: 1, createdAt: -1 });
activityLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
