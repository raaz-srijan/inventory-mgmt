const User = require("../models/userSchema");
const { verifyJWT } = require("../utils/generateToken");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyJWT(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token."
            });
        }

        const user = await User.findById(decoded.id).populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const authorize = (permissionName) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: "Access forbidden. No role assigned."
            });
        }

        const hasPermission = req.user.role.permissions.some(p => p.name === permissionName);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: `You do not have the required permission: ${permissionName}`
            });
        }

        next();
    };
};

const checkBusinessAccess = (req, res, next) => {
    const businessId = req.params.businessId || req.body.businessId || req.query.businessId;
    const user = req.user;

    if (!user.role) {
        return res.status(403).json({ success: false, message: "Forbidden: No role assigned." });
    }

    if (user.role.name === 'super_admin' || user.role.name === 'admin') {
        return res.status(403).json({
            success: false,
            message: "Admins/SuperAdmins are restricted from accessing specific business data."
        });
    }

    if (!businessId) {
        return res.status(400).json({ success: false, message: "Business ID is required for this action." });
    }

    if (!user.businessId || user.businessId.toString() !== businessId.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You do not belong to this business."
        });
    }

    next();
};

module.exports = { authenticate, authorize, checkBusinessAccess };
