const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getApprovedRequests, getPendingRequests, getRejectedRequests,getAllRequests } = require("../controller/teacherDashboardController");

// Routes for fetching specific types of requests
router.get("/approved-requests", authMiddleware, getApprovedRequests);
router.get("/pending-requests", authMiddleware, getPendingRequests);
router.get("/rejected-requests", authMiddleware, getRejectedRequests);
router.get('/teacher-requests', authMiddleware, getAllRequests);

module.exports = router;