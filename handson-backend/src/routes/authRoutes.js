const express = require("express");
const { register, login, user,updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require('multer');
// Setup multer for file upload
const storage = multer.memoryStorage(); // Store file in memory temporarily
const upload = multer({ storage }).single('profilePicture');

router.post("/register", register);
router.post("/login", login);
router.get("/user",authMiddleware, user);
router.put("/profile", authMiddleware,upload, updateProfile); // Update user profile

module.exports = router;