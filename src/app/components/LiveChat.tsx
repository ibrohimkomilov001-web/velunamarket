import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
  userName?: string; // YANGI: Kim yozgan
  userId?: string; // YANGI: User ID
  read?: boolean; // YANGI: O'qilganmi
}

interface LiveChatProps {
  userName?: string;
  userId?: string;
  externalOpen?: boolean; // YANGI: Tashqaridan ochish uchun
  onExternalOpenChange?: (open: boolean) => void; // YANGI: Tashqaridan ochilishni boshqarish
}

export function LiveChat({ userName = 'Mehmon', userId = 'guest', externalOpen = false, onExternalOpenChange }: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // YANGI: Tashqaridan ochilishni handle qilish
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
      if (onExternalOpenChange) {
        onExternalOpenChange(false); // Reset external open state
      }
    }
  }, [externalOpen]);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`veluna_chat_${userId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      const welcomeMessage: Message = {
        id: '1',
        text: 'Salom! Sizga qanday yordam bera olaman?',
        sender: 'support',
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(`veluna_chat_${userId}`, JSON.stringify([welcomeMessage]));
    }

    // Check for new admin messages
    const interval = setInterval(() => {
      const savedMessages = localStorage.getItem(`veluna_chat_${userId}`);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
        
        // Count unread messages from support
        const unread = parsed.filter((m: Message) => m.sender === 'support' && !m.read).length;
        setUnreadCount(unread);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [userId]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      userName: userName,
      userId: userId,
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage('');
    
    // Save to localStorage
    localStorage.setItem(`veluna_chat_${userId}`, JSON.stringify(updatedMessages));
    
    // Save to global chat list for admin
    const allChats = JSON.parse(localStorage.getItem('veluna_all_chats') || '{}');
    allChats[userId] = {
      userId,
      userName,
      lastMessage: newMessage.text,
      lastTime: newMessage.time,
      unreadCount: (allChats[userId]?.unreadCount || 0) + 1,
    };
    localStorage.setItem('veluna_all_chats', JSON.stringify(allChats));
    
    // YANGI: Send to Telegram via backend
    sendToTelegram(newMessage);
  };

  const sendToTelegram = async (message: Message) => {
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5158fb34/chat/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          userId: message.userId,
          userName: message.userName,
          message: message.text,
          time: message.time,
        }),
      });
    } catch (error) {
      console.log('Telegram xabarnoma yuborishda xato:', error);
      // Xatolik bo'lsa ham chat davom etadi
    }
  };

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const updatedMessages = messages.map(m => 
        m.sender === 'support' ? { ...m, read: true } : m
      );
      setMessages(updatedMessages);
      localStorage.setItem(`veluna_chat_${userId}`, JSON.stringify(updatedMessages));
      setUnreadCount(0);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-all z-40 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed bottom-24 md:bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-40 transition-all ${
          isMinimized ? 'w-80 h-14' : 'w-80 md:w-96 h-[500px]'
        } flex flex-col`}>
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p>Yordam markazi</p>
                <p className="text-xs text-emerald-100">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-gray-800 border'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Xabar yozing..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}