const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../utils/generateToken");
const { logActivity } = require("./activityController");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email }).populate("role");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateJWT({ id: user._id });

        // Log Login Activity
        await logActivity({
            userId: user._id,
            businessId: user.businessId,
            action: "LOGIN",
            module: "AUTH",
            details: { email: user.email },
            req
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role?.name,
                businessId: user.businessId
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                businessId: user.businessId
            }
        });
    } catch (error) {
        console.error("GetMe Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function registerInitialAdmin(req, res) {
    try {
        const { name, email, password, roleName } = req.body;

        const existingAdmin = await User.findOne({
            role: { $in: await Role.find({ name: { $in: ["super_admin", "admin"] } }).select("_id") }
        });

        if (existingAdmin && req.body.secret !== process.env.ADMIN_SETUP_SECRET) {
            return res.status(403).json({ success: false, message: "Admin already exists or secret invalid." });
        }

        const role = await Role.findOne({ name: roleName });
        if (!role) return res.status(400).json({ success: false, message: "Role not found" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role._id,
            isVerify: true
        });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: role.name }
        });
    } catch (error) {
        console.error("Initial Admin Register Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { login, getMe, registerInitialAdmin };
