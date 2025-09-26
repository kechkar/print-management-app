//Defines department-related API endpoints
const express = require('express');
const {  approvePrintRequest, rejectPrintRequest, getDepartmentRequests, getApprovedRequests,getRejectedRequests } = require('../controller/ChefdashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.put('/:requestId/approve', authMiddleware, approvePrintRequest);
router.put('/:requestId/reject', authMiddleware, rejectPrintRequest);
router.get('/department-requests', authMiddleware, getDepartmentRequests);
// Get Approved & Rejected Requests 
router.get('/approved-requests', authMiddleware, getApprovedRequests);
router.get('/rejected-requests', authMiddleware, getRejectedRequests);

module.exports = router;