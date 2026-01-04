# 🔍 TELEGRAM BOT DEBUG QILISH

## ✅ NIMANI TEKSHIRISH KERAK:

### 1️⃣ Webhook to'g'ri sozlanganligini tekshiring:

Browser orqali quyidagi URL ga o'ting:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

Javob quyidagicha bo'lishi kerak:
```json
{
  "ok": true,
  "result": {
    "url": "https://bhbcbxptdmwaraaknsfl.supabase.co/functions/v1/make-server-5158fb34/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

⚠️ Agar `url` bo'sh bo'lsa yoki boshqa URL bo'lsa, webhook sozlanmagan!

### 2️⃣ Webhook'ni qayta sozlang:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://bhbcbxptdmwaraaknsfl.supabase.co/functions/v1/make-server-5158fb34/telegram/webhook
```

### 3️⃣ Test jarayoni:

1. **Saytda Live Chat oching:**
   - Ismingizni kiriting
   - "Salom" deb xabar yuboring
   - Telegram botingizda xabar kelishini tekshiring

2. **Telegram botdan javob bering:**
   ```
   /reply user_1734358923_abc123 Salom! Qanday yordam kerak?
   ```
   
   ⚠️ MUHIM: `user_id` ni Telegram xabaridagi ID bilan almashtiring!

3. **Browser Console'ni oching:**
   - F12 bosing
   - Console tab'ga o'ting
   - Telegram botdan javob yozganingizda quyidagi log'larni ko'rishingiz kerak:

   ```
   📱 Telegram webhook received: { ... }
   💬 Processing message: /reply user_123 Salom
   👤 User ID: user_123
   📩 Admin message: Salom
   💾 Saving admin reply to KV store: { ... }
   ✅ Admin reply saved successfully!
   ```

### 4️⃣ Agar log'lar ko'rinmasa:

**Bu webhook ishlamayotganini anglatadi!**

Sabablari:
- ❌ Webhook URL noto'g'ri
- ❌ TELEGRAM_BOT_TOKEN noto'g'ri
- ❌ Bot yaratilmagan

**Yechim:**
1. Telegram'da bot yarating (BotFather orqali)
2. Bot tokenni Settings → Secrets ga qo'shing
3. Webhook'ni qayta sozlang
4. `/start` buyrug'ini botga yuboring

### 5️⃣ Agar log'lar ko'rinsa, lekin saytda javob yo'q:

**Bu polling yoki user_id muammosi!**

Console'da quyidagi xatoliklar bormi tekshiring:
- `Error loading messages: ...`
- `Failed to load messages`

**Yechim:**
1. User ID to'g'ri ekanligini tekshiring
2. Telegram'dan yuborgan user_id bilan saytdagi user_id bir xilmi?
3. LocalStorage'da `veluna_chat_user_id` ni tekshiring:
   ```javascript
   localStorage.getItem('veluna_chat_user_id')
   ```

### 6️⃣ KV Store'ni qo'lda tekshirish:

Browser Console'da:
```javascript
// User ID ni oling
const userId = localStorage.getItem('veluna_chat_user_id');
console.log('My User ID:', userId);

// Xabarlarni oling
fetch(`https://bhbcbxptdmwaraaknsfl.supabase.co/functions/v1/make-server-5158fb34/chat/messages/${userId}`, {
  headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYmNieHB0ZG13YXJhYWtuc2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNTY4MDQsImV4cCI6MjA0OTkzMjgwNH0.T9z8tN0FBOGFxkXXlwPTKoS3b3Zyv4vLVwHj8MbYEd4' }
})
.then(r => r.json())
.then(data => console.log('Messages:', data));
```

---

## 🎯 TO'G'RI ISHLATISH NAMUNASI:

### Saytdan:
```
Foydalanuvchi: Assalomu alaykum
```

### Telegram'da ko'rinadi:
```
💬 Yangi xabar!

👤 Javohir
🆔 user_1734358923_abc123

📩 Assalomu alaykum

Javob berish:
/reply user_1734358923_abc123 Sizning javobingiz
```

### Telegram'dan javob:
```
/reply user_1734358923_abc123 Aleykum assalom! Qanday yordam kerak?
```

### Saytda ko'rinadi:
```
Admin: Aleykum assalom! Qanday yordam kerak?
```

---

## ⚡ TEZKOR TEKSHIRISH:

1. ✅ Bot yaratdingizmi? (BotFather)
2. ✅ Bot token qo'shdingizmi? (Settings → Secrets)
3. ✅ Chat ID qo'shdingizmi? (Settings → Secrets)
4. ✅ Webhook sozladingizmi? (getWebhookInfo tekshiring)
5. ✅ Saytda xabar yubordingizmi?
6. ✅ Telegram'da xabar keldimi?
7. ✅ Console'da log'lar ko'rinyadimi?

Barcha javoblar "HA" bo'lsa - hammasi ishlashi kerak! 🎉
