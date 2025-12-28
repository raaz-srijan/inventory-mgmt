const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business"
    },
    type: {
        type: String,
        enum: ["Post", "Inventory", "Staff", "Message", "General"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    link: {
        type: String, // Optional URL to redirect to when clicked
    }
}, { timestamps: true });

// Index for performance
notificationSchema.index({ recipientId: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
