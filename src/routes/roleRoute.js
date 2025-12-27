const express = require("express");
const router = express.Router();
const Role = require("../models/roleSchema");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// List roles
router.get("/", authenticate, async (req, res) => {
    try {
        const roles = await Role.find().populate("permissions");
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
