# Teacher-Bot (بدون كلمة سر)
هذا المشروع نسخة مبسطة من المعلم الروبوتي بدون شاشة قفل أو كلمة سر.  
اتبع الإرشادات التالية لتشغيله ونشره.

## ملاحظة أمنية
- لا ترفع ملف `.env` أو مفتاح OpenAI لمستودع عام.
- إذا أعطيت أحدًا رابط الخدمة، تأكد من فهم تكاليف استخدام OpenAI.

## تشغيل محلي
1. ثبت الحزم:
   ```bash
   npm install
   ```
2. أنشئ ملف `.env` في جذر المشروع وأضف:
   ```
   OPENAI_API_KEY=ضع_مفتاحك_هنا
   ```
3. شغّل السيرفر:
   ```bash
   npm start
   ```
4. افتح `http://localhost:3000`

## نشر على Render
1. ارفع المشروع لمستودع GitHub.
2. في Render أنشئ Web Service واربطه بالمستودع.
3. Build Command: `npm install`
   Start Command: `npm start`
4. في Environment Variables أضف `OPENAI_API_KEY` بقيمة مفتاحك.
5. Deploy وسيعطيك رابط مباشر.
