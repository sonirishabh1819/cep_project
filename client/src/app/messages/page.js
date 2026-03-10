'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';
import { messagesAPI } from '@/lib/api';

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { socket, setUnreadCount } = useSocket();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }
    loadConversations();
  }, [user, authLoading]);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      });
      return () => socket.off('new_message');
    }
  }, [socket, activeConv]);

  const loadConversations = async () => {
    try { const data = await messagesAPI.getConversations(); setConversations(data); }
    catch {} finally { setLoading(false); }
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);
    try {
      const msgs = await messagesAPI.getMessages(conv._id);
      setMessages(msgs);
      if (socket) { socket.emit('join_conversation', conv._id); socket.emit('mark_read', { conversationId: conv._id }); }
      setUnreadCount(0);
      setTimeout(scrollToBottom, 100);
    } catch {}
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv || !socket) return;
    socket.emit('send_message', { conversationId: activeConv._id, text: newMessage });
    setNewMessage('');
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  const getOtherUser = (conv) => conv.participants?.find((p) => p._id !== user?._id);

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-8"><div className="h-[70vh] shimmer rounded-2xl" /></div>;

  return (
    <div className="min-h-screen bg-[#faf5f0]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#1a1210] font-display mb-6">Messages</h1>

        <div className="bg-white rounded-2xl overflow-hidden h-[72vh] flex border border-[#e8ddd0] shadow-sm">
          {/* Conversations List */}
          <div className={`w-full md:w-80 border-r border-[#e8ddd0] flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-5 border-b border-[#e8ddd0]">
              <h2 className="text-sm font-bold text-[#8c7e72] uppercase tracking-widest font-body">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-[#8c7e72] text-sm font-body font-medium">No conversations yet</p>
                  <p className="text-[#8c7e72]/60 text-xs font-body mt-1">Contact a seller to start chatting</p>
                </div>
              ) : conversations.map((conv) => {
                const other = getOtherUser(conv);
                return (
                  <button key={conv._id} onClick={() => openConversation(conv)}
                    className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-[#faf5f0] transition-colors text-left border-b border-[#f0e6d9] ${
                      activeConv?._id === conv._id ? 'bg-[#c41e3a]/5 border-l-3 border-l-[#c41e3a]' : ''
                    }`}>
                    <div className="w-10 h-10 rounded-full bg-[#c41e3a] flex items-center justify-center text-sm text-white font-bold shrink-0 font-body">
                      {other?.name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a1210] truncate font-body">{other?.name || 'User'}</p>
                      <p className="text-xs text-[#8c7e72] truncate font-body">{conv.lastMessage || 'No messages yet'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-[#faf5f0]/50 ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
            {activeConv ? (
              <>
                <div className="p-4 border-b border-[#e8ddd0] bg-white flex items-center gap-3">
                  <button onClick={() => setActiveConv(null)} className="md:hidden p-1 text-[#8c7e72] hover:text-[#c41e3a]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="w-9 h-9 rounded-full bg-[#c41e3a] flex items-center justify-center text-sm text-white font-bold font-body">
                    {getOtherUser(activeConv)?.name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1210] font-body">{getOtherUser(activeConv)?.name}</p>
                    {activeConv.listing && <p className="text-xs text-[#8c7e72] font-body">Re: {activeConv.listing.title}</p>}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-body ${
                          isMine
                            ? 'bg-[#c41e3a] text-white rounded-br-md'
                            : 'bg-white text-[#1a1210] rounded-bl-md border border-[#e8ddd0]'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-[#e8ddd0] bg-white">
                  <div className="flex gap-2">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 bg-[#faf5f0] border border-[#e8ddd0] rounded-xl px-4 py-3 text-sm text-[#1a1210] placeholder:text-[#8c7e72]/50 focus:outline-none focus:border-[#c41e3a] transition-all font-body" />
                    <button onClick={sendMessage} disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-[#c41e3a] text-white font-bold rounded-xl hover:bg-[#8b1425] transition-all disabled:opacity-40 text-sm font-body">
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <div className="text-6xl mb-4">📨</div>
                  <p className="text-[#8c7e72] font-body font-medium">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
