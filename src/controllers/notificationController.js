const Notification = require("../models/notificationSchema");
const { emitNotification } = require("../utils/socket");

async function createNotification({ recipientId, senderId, businessId, type, title, message, link }) {
    try {
        const notification = await Notification.create({
            recipientId,
            senderId,
            businessId,
            type,
            title,
            message,
            link
        });

        emitNotification(recipientId, notification);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

async function getMyNotifications(req, res) {
    try {
        const notifications = await Notification.find({ recipientId: req.user._id })
            .populate("senderId", "name role")
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function markAsRead(req, res) {
    try {
        const { notificationId } = req.params;
        await Notification.findOneAndUpdate(
            { _id: notificationId, recipientId: req.user._id },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function markAllAsRead(req, res) {
    try {
        await Notification.updateMany(
            { recipientId: req.user._id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function clearNotifications(req, res) {
    try {
        await Notification.deleteMany({ recipientId: req.user._id });
        res.status(200).json({ success: true, message: "Notifications cleared" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { createNotification, getMyNotifications, markAsRead, markAllAsRead, clearNotifications };
