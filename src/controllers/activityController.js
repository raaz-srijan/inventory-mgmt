const ActivityLog = require("../models/activityLogSchema");

// Utility to log activity (internal use)
async function logActivity({ userId, businessId, action, module, details, req }) {
    try {
        await ActivityLog.create({
            userId,
            businessId,
            action,
            module,
            details,
            ipAddress: req?.ip,
            userAgent: req?.get('User-Agent')
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
}

async function getBusinessLogs(req, res) {
    try {
        // Only Owners/Managers can see business audit trails
        const logs = await ActivityLog.find({ businessId: req.user.businessId })
            .populate("userId", "name role")
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getPlatformLogs(req, res) {
    try {
        // Only SuperAdmin/Admin can see platform-wide audit trails
        const logs = await ActivityLog.find()
            .populate("userId", "name role")
            .populate("businessId", "name")
            .sort({ createdAt: -1 })
            .limit(200);

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { logActivity, getBusinessLogs, getPlatformLogs };
