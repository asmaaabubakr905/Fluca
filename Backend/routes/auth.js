const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Register route
router.post('/register', upload.single('boatImage'), authController.register);

// Login route
router.post('/login', authController.login);

// Profile route (protected)
router.get('/profile', auth, authController.profile);

module.exports = router; 