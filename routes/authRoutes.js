const express = require('express');
const { signup, login,sendUserPasswordResetOTP,confirmUserPasswordResetOTP,updateUserPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/sendOtp', sendUserPasswordResetOTP);
router.post('/confirmOtp', confirmUserPasswordResetOTP);
router.post('/resetPassword', updateUserPassword);

module.exports = router;
