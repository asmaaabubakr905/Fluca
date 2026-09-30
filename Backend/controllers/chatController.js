const ChatMessage = require('../models/ChatMessage');

// Send a message
async function sendMessage(req, res) {
  try {
    const { receiver, message, trip } = req.body;
    if (!receiver || !message) {
      return res.status(400).json({ message: 'Receiver and message are required' });
    }
    const chatMessage = new ChatMessage({
      sender: req.user.id,
      receiver,
      message,
      trip,
    });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Get messages between two users (optionally for a trip)
async function getMessages(req, res) {
  try {
    const { userId, trip } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const filter = {
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    };
    if (trip) filter.trip = trip;
    const messages = await ChatMessage.find(filter).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
  sendMessage,
  getMessages,
}; 