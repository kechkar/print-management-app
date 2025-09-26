const express = require('express');
const { getAllTeachers, getAllDepartments, getAllPrintRequests } = require('../controller/adminDashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get All Teachers (Admin Only)
router.get('/teachers', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Unauthorized: Only ADMIN can access this." });
    }
    next();
}, getAllTeachers);

// ✅ Get All Departments (Admin Only)
router.get('/departments', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Unauthorized: Only ADMIN can access this." });
    }
    next();
}, getAllDepartments);

// ✅ Get All Print Requests (Admin Only and )
router.get('/all-print-requests', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Unauthorized: Only ADMIN or can access this." });
    }
    next();
}, getAllPrintRequests);

module.exports = router;