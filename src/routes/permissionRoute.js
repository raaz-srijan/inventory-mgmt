const express = require("express");
const router = express.Router();
const Permission = require("../models/permissionSchema");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.get("/", authenticate, authorize("manage_platform"), async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
