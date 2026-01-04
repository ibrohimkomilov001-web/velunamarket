import { MessageCircle, X, Send, Minimize2, Maximize2, Check, CheckCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  read: boolean;
}

export function LiveChatWithTelegram() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get or create user ID
    let storedUserId = localStorage.getItem('veluna_chat_user_id');
    let storedUserName = localStorage.getItem('veluna_chat_user_name');

    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('veluna_chat_user_id', storedUserId);
    }

    setUserId(storedUserId);
    if (storedUserName) {
      setUserName(storedUserName);
      setHasStarted(true);
      loadMessages(storedUserId);
    }
  }, []);

  // Polling for new messages
  useEffect(() => {
    if (!hasStarted || !userId) return;

    // Initial load
    loadMessages(userId);

    // Poll every 1 second for faster updates
    pollingIntervalRef.current = setInterval(() => {
      loadMessages(userId);
    }, 1000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [hasStarted, userId]);

  const loadMessages = async (uid: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5158fb34/chat/messages/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        // Quietly fail - don't show error to user, just log to console
        return;
      }

      const data = await response.json();
      
      if (data.success && data.messages) {
        setMessages(data.messages);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      // Silently fail - polling will retry, no need to spam console
    }
  };

  const handleStart = async () => {
    if (!userName.trim()) return;

    localStorage.setItem('veluna_chat_user_name', userName);
    setHasStarted(true);

    // Send welcome message from admin
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5158fb34/chat/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            user_id: userId,
            user_name: userName,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Chat start error details:', data);
        throw new Error(data.details || 'Failed to start chat');
      }
      
      loadMessages(userId);
    } catch (error) {
      console.error('Error starting chat:', error);
      alert(`Chatni boshlashda xatolik: ${error.message}`);
      setHasStarted(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5158fb34/chat/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            user_id: userId,
            user_name: userName,
            message: message.trim(),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      // Add message to local state immediately
      setMessages((prev) => [...prev, data.message]);
      setMessage('');

      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Xabar yuborishda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasStarted) {
        handleSend();
      } else {
        handleStart();
      }
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        isMinimized ? 'bottom-20 md:bottom-6' : 'bottom-20 md:bottom-6'
      } right-4 md:right-6 z-50 transition-all`}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
          {messages.some(m => m.is_admin && !m.read) && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
              {messages.filter(m => m.is_admin && !m.read).length}
            </span>
          )}
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] md:w-96 overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Yordam markazi</h3>
                <p className="text-xs text-emerald-100">
                  {hasStarted ? 'Online - Telegram orqali' : 'Suhbatni boshlang'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {!hasStarted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="mb-2 dark:text-white">Salom! 👋</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sizga qanday yordam bera olaman?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  💬 Xabarlaringiz Telegram botimizga yuboriladi va adminimiz javob beradi
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.is_admin ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.is_admin
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                      }`}
                    >
                      {msg.is_admin && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                          Admin
                        </p>
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <p className={`text-xs ${msg.is_admin ? 'text-gray-400' : 'text-emerald-100'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('uz-UZ', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {!msg.is_admin && (
                          msg.read ? (
                            <CheckCheck className="w-3 h-3 text-emerald-100" />
                          ) : (
                            <Check className="w-3 h-3 text-emerald-100" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            {!hasStarted ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ismingizni kiriting..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleStart}
                  disabled={!userName.trim()}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suhbatni boshlash
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Xabaringizni yozing..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}