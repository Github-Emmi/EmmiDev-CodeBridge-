const express = require('express');
const router = express.Router();
const {
  getChatRooms,
  getRoomMessages,
  createDirectRoom,
  deleteMessage,
  createAIChat,
  getAIChats,
  getAIChatById,
  addAIMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/rooms', protect, getChatRooms);
router.get('/rooms/:roomId/messages', protect, getRoomMessages);
router.post('/rooms/direct', protect, createDirectRoom);
router.delete('/messages/:messageId', protect, deleteMessage);

// --- AI Assistant Chat History Routes ---
router.post('/ai', protect, createAIChat); // Create new AI chat
router.get('/ai', protect, getAIChats); // List all AI chats for user
router.get('/ai/:id', protect, getAIChatById); // Get single AI chat by id
router.post('/ai/:id/message', protect, addAIMessage); // Add message to AI chat
// --- End AI Assistant Chat History Routes ---

module.exports = router;
