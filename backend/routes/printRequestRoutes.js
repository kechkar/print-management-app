//Defines printing request-related API endpoints
const express = require('express');
const { submitPrintRequest, approvePrintRequest, rejectPrintRequest, getDepartmentRequests, getPrintRequestById } = require('../controller/printRequestController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const router = express.Router();

router.post('/submit', authMiddleware, submitPrintRequest);
router.put('/approve/:id', authMiddleware, approvePrintRequest);
router.put('/reject/:id', authMiddleware, rejectPrintRequest);
router.get('/department-requests', authMiddleware, getDepartmentRequests);
router.get('/request/:id', getPrintRequestById);

module.exports = router;