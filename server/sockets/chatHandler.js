const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const onlineUsers = new Map();

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    onlineUsers.set(socket.userId, socket.id);

    // Broadcast online status
    io.emit('user_online', { userId: socket.userId });

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on('send_message', async (data) => {
      try {
        const { conversationId, text } = data;

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          text,
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          lastMessageAt: new Date(),
        });

        const populated = await message.populate('sender', 'name profilePicture');

        // Send to all in conversation room
        io.to(conversationId).emit('new_message', populated);

        // Also send notification to the other participant
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          const otherParticipant = conversation.participants.find(
            (p) => p.toString() !== socket.userId
          );
          if (otherParticipant) {
            const otherSocketId = onlineUsers.get(otherParticipant.toString());
            if (otherSocketId) {
              io.to(otherSocketId).emit('message_notification', {
                conversationId,
                message: populated,
              });
            }
          }
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.conversationId).emit('user_stop_typing', {
        userId: socket.userId,
        conversationId: data.conversationId,
      });
    });

    socket.on('mark_read', async (data) => {
      try {
        await Message.updateMany(
          {
            conversation: data.conversationId,
            sender: { $ne: socket.userId },
            read: false,
          },
          { read: true }
        );
        socket.to(data.conversationId).emit('messages_read', {
          conversationId: data.conversationId,
          userId: socket.userId,
        });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      io.emit('user_offline', { userId: socket.userId });
    });
  });
};
