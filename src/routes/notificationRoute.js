const express = require("express");
const router = express.Router();
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications
} = require("../controllers/notificationController");
const { authenticate } = require("../middlewares/authMiddleware");

router.use(authenticate);

router.get("/", getMyNotifications);
router.patch("/read/:notificationId", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/clear", clearNotifications);

module.exports = router;
