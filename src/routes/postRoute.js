const express = require("express");
const router = express.Router();
const { createPost, getPosts } = require("../controllers/postController");
const { authenticate } = require("../middlewares/authMiddleware");

router.use(authenticate);

router.post("/", createPost);
router.get("/", getPosts);

module.exports = router;
