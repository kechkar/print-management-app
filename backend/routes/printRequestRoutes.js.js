//Defines printing request-related API endpoints
const express = require('express');
const { submitPrintRequest, approvePrintRequest, rejectPrintRequest, getDepartmentRequests } = require('../controller/printRequestController.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/submit', authMiddleware, submitPrintRequest);
router.put('/:requestId/approve', authMiddleware, approvePrintRequest);
router.put('/:requestId/reject', authMiddleware, rejectPrintRequest);
router.get('/department-requests', authMiddleware, getDepartmentRequests);

module.exports = router;