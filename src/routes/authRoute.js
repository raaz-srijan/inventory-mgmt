const express = require("express");
const router = express.Router();
const { login, getMe, registerInitialAdmin } = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/login", login);
router.post("/register-initial-admin", registerInitialAdmin);
router.get("/me", authenticate, getMe);

module.exports = router;
