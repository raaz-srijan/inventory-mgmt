const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
const bcrypt = require("bcrypt");

async function createStaff(req, res) {
    try {
        const { name, email, password, roleName } = req.body;
        const owner = req.user;

        // Ensure role is valid (manager or staff)
        if (!['manager', 'staff'].includes(roleName)) {
            return res.status(400).json({ success: false, message: "Invalid role for staff creation." });
        }

        const role = await Role.findOne({ name: roleName });
        if (!role) return res.status(400).json({ success: false, message: "Role not found" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newStaff = await User.create({
            name,
            email,
            password: hashedPassword,
            businessId: owner.businessId,
            role: role._id,
            isVerify: true // Automatically verify since owner is creating them
        });

        res.status(201).json({ success: true, data: newStaff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function getBusinessStaff(req, res) {
    try {
        const staff = await User.find({ businessId: req.user.businessId })
            .populate("role", "name")
            .select("-password");

        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function updateStaff(req, res) {
    try {
        const { staffId } = req.params;
        const { name, email, roleName } = req.body;

        const staff = await User.findById(staffId);
        if (!staff || staff.businessId.toString() !== req.user.businessId.toString()) {
            return res.status(404).json({ success: false, message: "Staff member not found in your business." });
        }

        if (name) staff.name = name;
        if (email) staff.email = email;
        if (roleName) {
            const role = await Role.findOne({ name: roleName });
            if (role) staff.role = role._id;
        }

        await staff.save();
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteStaff(req, res) {
    try {
        const { staffId } = req.params;
        const staff = await User.findById(staffId);

        if (!staff || staff.businessId.toString() !== req.user.businessId.toString()) {
            return res.status(404).json({ success: false, message: "Staff member not found." });
        }

        await User.findByIdAndDelete(staffId);
        res.status(200).json({ success: true, message: "Staff member removed." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { createStaff, getBusinessStaff, updateStaff, deleteStaff };
