const express = require('express');
const { registerChefDepartement, registerImprimerie, registerTeacher, loginAdmin, loginUser } = require('../controller/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register-chef', authMiddleware, registerChefDepartement);
router.post('/register-imprimerie', authMiddleware, registerImprimerie);
router.post('/register-teacher', authMiddleware, registerTeacher);
router.post('/login-admin',loginAdmin );
router.post('/login', loginUser);

module.exports = router;