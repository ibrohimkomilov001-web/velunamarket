import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5158fb34/health", (c) => {
  return c.json({ status: "ok" });
});

// Chat: Start conversation
app.post("/make-server-5158fb34/chat/start", async (c) => {
  try {
    const { user_id, user_name } = await c.req.json();

    const messageId = `chat_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const welcomeMessage = {
      id: messageId,
      user_id,
      user_name,
      message: `Salom ${user_name}! 👋 Men Veluna Market yordam xizmati botiman. Sizga qanday yordam bera olaman?`,
      is_admin: true,
      read: false,
      created_at: new Date().toISOString(),
    };

    // Save to KV store
    await kv.set(`chat_${user_id}_${messageId}`, welcomeMessage);

    // Send notification to Telegram
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (telegramBotToken && telegramChatId) {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `🆕 Yangi suhbat boshlandi!\n\n👤 Foydalanuvchi: ${user_name}\n🆔 ID: ${user_id}\n\nJavob berish uchun quyidagi formatda yozing:\n/reply ${user_id} Sizning xabaringiz`,
          parse_mode: 'HTML',
        }),
      });
    }

    return c.json({ success: true, message: welcomeMessage });
  } catch (error) {
    console.error('Error starting chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to start chat', details: errorMessage }, 500);
  }
});

// Chat: Send message from user
app.post("/make-server-5158fb34/chat/send", async (c) => {
  try {
    const { user_id, user_name, message } = await c.req.json();

    const messageId = `chat_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMessage = {
      id: messageId,
      user_id,
      user_name,
      message,
      is_admin: false,
      read: false,
      created_at: new Date().toISOString(),
    };

    // Save to KV store
    await kv.set(`chat_${user_id}_${messageId}`, newMessage);

    // Send to Telegram with inline keyboard
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (telegramBotToken && telegramChatId) {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `💬 Yangi xabar!\n\n👤 ${user_name}\n🆔 ${user_id}\n\n📩 ${message}`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✍️ Javob berish',
                  callback_data: `reply_${user_id}_${user_name}`,
                }
              ]
            ]
          }
        }),
      });
    }

    return c.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to send message', details: errorMessage }, 500);
  }
});

// YANGI: Chat notification endpoint (for LiveChat component)
app.post("/make-server-5158fb34/chat/notify", async (c) => {
  try {
    const { userId, userName, message, time } = await c.req.json();

    // Send to Telegram with inline keyboard
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (telegramBotToken && telegramChatId) {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `💬 Yangi xabar!\n\n👤 Foydalanuvchi: ${userName}\n🆔 ID: ${userId}\n🕐 Vaqt: ${time}\n\n📩 Xabar:\n${message}`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✍️ Javob berish',
                  callback_data: `reply_${userId}_${userName}`,
                }
              ]
            ]
          }
        }),
      });
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error sending telegram notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to send notification', details: errorMessage }, 500);
  }
});

// Chat: Get messages for a user
app.get("/make-server-5158fb34/chat/messages/:user_id", async (c) => {
  try {
    const userId = c.req.param('user_id');
    
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }
    
    // Get all messages for this user
    const allMessages = await kv.getByPrefix(`chat_${userId}_`);
    
    // Sort by created_at
    const messages = allMessages.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return c.json({ success: true, messages });
  } catch (error) {
    console.error('Error loading messages:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to load messages', details: errorMessage }, 500);
  }
});

// Chat: Receive message from Telegram (webhook)
app.post("/make-server-5158fb34/telegram/webhook", async (c) => {
  try {
    const update = await c.req.json();
    console.log('📱 Telegram webhook received:', JSON.stringify(update, null, 2));

    // YANGI: Handle callback query (tugma bosilganda)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const callbackData = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;
      const messageId = callbackQuery.message.message_id;

      console.log('🔘 Callback query received:', callbackData);

      // Parse callback data: reply_userId_userName
      if (callbackData.startsWith('reply_')) {
        const parts = callbackData.substring(6).split('_');
        const userId = parts[0];
        const userName = parts.slice(1).join('_');

        // Answer callback query
        const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
        if (telegramBotToken) {
          await fetch(`https://api.telegram.org/bot${telegramBotToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackQuery.id,
              text: '✍️ Javob yozish uchun quyidagi formatda yozing:\n/reply ' + userId + ' Sizning javobingiz',
              show_alert: true,
            }),
          });

          // Also send a reminder message
          await sendTelegramMessage(
            chatId,
            `✍️ <b>${userName}</b> ga javob yozish uchun:\n\n<code>/reply ${userId} Sizning javobingiz</code>\n\n<i>Misol:</i>\n<code>/reply ${userId} Salom! Sizga qanday yordam bera olaman?</code>`
          );
        }
      }

      return c.json({ success: true });
    }

    if (!update.message || !update.message.text) {
      console.log('⚠️ No message text found in update');
      return c.json({ success: true });
    }

    const text = update.message.text;
    const telegramChatId = update.message.chat.id;
    console.log('💬 Processing message:', text);

    // Check if it's a reply command: /reply user_id message
    if (text.startsWith('/reply ')) {
      const parts = text.substring(7).split(' ');
      const userId = parts[0];
      const adminMessage = parts.slice(1).join(' ');

      console.log('👤 User ID:', userId);
      console.log('📩 Admin message:', adminMessage);

      if (!adminMessage) {
        await sendTelegramMessage(telegramChatId, '❌ Xabar matni kiritilmagan!');
        return c.json({ success: true });
      }

      // YANGI: Save to localStorage format (for Admin Panel)
      const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
      const newMessage = {
        id: Date.now().toString(),
        text: adminMessage,
        sender: 'support',
        time: time,
        read: false,
      };

      // This will be picked up by the frontend via localStorage polling
      console.log('💾 Telegram admin reply for user:', userId);

      // Save admin message to KV store
      const messageId = `chat_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const adminReply = {
        id: messageId,
        user_id: userId,
        user_name: 'Admin',
        message: adminMessage,
        is_admin: true,
        read: false,
        created_at: new Date().toISOString(),
      };

      console.log('💾 Saving admin reply to KV store:', adminReply);
      await kv.set(`chat_${userId}_${messageId}`, adminReply);
      console.log('✅ Admin reply saved successfully!');

      await sendTelegramMessage(telegramChatId, '✅ Javob yuborildi!');
    } else if (text === '/start') {
      await sendTelegramMessage(
        telegramChatId,
        '👋 Salom! Men Veluna Market yordam xizmati botiman.\n\nFoydalanuvchilarga javob berish uchun:\n/reply [user_id] [xabar]'
      );
    } else {
      console.log('⚠️ Unknown command:', text);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('❌ Error processing telegram webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to process webhook', details: errorMessage }, 500);
  }
});

async function sendTelegramMessage(chatId: string | number, text: string) {
  const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!telegramBotToken) return;

  await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
    }),
  });
}

Deno.serve(app.fetch);