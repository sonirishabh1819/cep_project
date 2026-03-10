const express = require('express');
const router = express.Router();
const { getConversations, getMessages, startConversation, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId', protect, getMessages);
router.post('/conversations', protect, startConversation);
router.get('/unread', protect, getUnreadCount);

module.exports = router;
