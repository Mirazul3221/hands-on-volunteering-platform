const express = require("express");
const { create, find, join } = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Correct import

const router = express.Router();

router.post("/create", authMiddleware, create); // ✅ Middleware applied correctly
router.get("/find", find);
router.post("/join/:eventId", authMiddleware, join); // ✅ Middleware for protected route
module.exports = router;