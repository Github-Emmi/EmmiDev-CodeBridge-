const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  uploadAvatar,
  updateSettings
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/settings', protect, updateSettings);
router.post('/logout', protect, logout);

module.exports = router;
