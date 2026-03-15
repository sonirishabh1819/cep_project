const express = require('express');
const router = express.Router();
const { register, login, googleAuth, getMe, updateProfile, getUserProfile, verifyOTP, resendOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.get('/user/:id', getUserProfile);

module.exports = router;
