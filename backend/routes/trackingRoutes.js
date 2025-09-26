const express = require("express");
const router = express.Router();
const { getApprovedPrintRequests, getApprovedRequestsByDepartment, markAsPrinted, getAllValidatedPrintRequests } = require("../controller/trackingController");
const authMiddleware = require("../middleware/authMiddleware");

// Debugging line: Check if functions are loaded
console.log("✅ Tracking Controller Functions:", { getApprovedPrintRequests, getApprovedRequestsByDepartment, markAsPrinted });

// Routes
router.get("/approved", authMiddleware, getApprovedPrintRequests);
router.get("/approved/:department", authMiddleware, getApprovedRequestsByDepartment);
router.put("/printed/:id", authMiddleware, markAsPrinted);
// ✅ Get All Print Requests (Admin Only and Imprimerie Only)
router.get('/all-validated-requests', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'IMPRIMERIE') {
        return res.status(403).json({ message: "Unauthorized: Only IMPRIMERIE or can access this." });
    }
    next();
}, getAllValidatedPrintRequests);

module.exports = router;
