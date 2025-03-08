const express = require("express");
const { register, login, user } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user",authMiddleware, user);

module.exports = router;