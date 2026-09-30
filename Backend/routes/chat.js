const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const auth = require('../middlewares/auth');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Send a message
router.post('/', auth, chatController.sendMessage);

// Get messages between two users (optionally for a trip)
router.get('/', auth, chatController.getMessages);

module.exports = router; 