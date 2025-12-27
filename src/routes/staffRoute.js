const express = require("express");
const router = express.Router();
const {
    createStaff,
    getBusinessStaff,
    updateStaff,
    deleteStaff
} = require("../controllers/staffController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.use(authenticate);

// Only Owners and Managers can manage staff
router.post("/", authorize("manage_staff_roles"), createStaff);
router.get("/", authorize("view_reports"), getBusinessStaff); // Reusing view_reports or manage_staff_roles
router.patch("/:staffId", authorize("manage_staff_roles"), updateStaff);
router.delete("/:staffId", authorize("manage_staff_roles"), deleteStaff);

module.exports = router;
