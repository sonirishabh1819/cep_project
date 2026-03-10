const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email profilePicture')
      .populate('listing', 'title images price isDonation')
      .sort({ lastMessageAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { conversation: conversation._id, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.startConversation = async (req, res) => {
  try {
    const { participantId, listingId, message } = req.body;

    if (participantId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot message yourself' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
      listing: listingId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        listing: listingId,
        lastMessage: message || '',
        lastMessageAt: new Date(),
      });
    }

    if (message) {
      const msg = await Message.create({
        conversation: conversation._id,
        sender: req.user._id,
        text: message,
      });
      conversation.lastMessage = message;
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    await conversation.populate('participants', 'name email profilePicture');
    await conversation.populate('listing', 'title images price isDonation');

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id });
    const conversationIds = conversations.map((c) => c._id);

    const count = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user._id },
      read: false,
    });

    res.json({ unread: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
