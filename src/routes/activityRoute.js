const express = require("express");
const router = express.Router();
const { getBusinessLogs, getPlatformLogs } = require("../controllers/activityController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

router.use(authenticate);

router.get("/business", authorize("view_reports"), getBusinessLogs);

router.get("/platform", authorize("manage_platform"), getPlatformLogs);

module.exports = router;
