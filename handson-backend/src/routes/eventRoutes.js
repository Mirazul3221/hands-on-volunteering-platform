const express = require("express");
const { create, find,filterEvents, join,createComment, myEvent } = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Correct import

const router = express.Router();

router.post("/create", authMiddleware, create); // ✅ Middleware applied correctly
router.get("/find",authMiddleware, find);
router.get("/filter",authMiddleware, filterEvents);
router.get("/findmyevent",authMiddleware, myEvent);
router.post("/join/:eventId", authMiddleware, join); // ✅ Middleware for protected route
router.post("/comment", authMiddleware, createComment); // ✅ Middleware for protected route
module.exports = router;