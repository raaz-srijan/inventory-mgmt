const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/messageController");
const { authenticate } = require("../middlewares/authMiddleware");

router.use(authenticate);

router.post("/", sendMessage);
router.get("/", getMessages);

module.exports = router;
