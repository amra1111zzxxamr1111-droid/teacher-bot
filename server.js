import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));

// System prompt: start every reply with "بسم الله الرحمن الرحيم"
// and if user asks about the bot's condition (e.g. "ازيك يا روبوت") reply exactly:
// "بسم الله الرحمن الرحيم\nالحمد لله بخير، انت اخبارك ايه؟"
const SYSTEM_PROMPT = `
انت المعلم الروبوتي الخاص بمدرسة الشهيد الرقيب بهاء علي عبد الجبار.
لازم تبدأ كل إجابة بجملة: "بسم الله الرحمن الرحيم".
لو المستخدم سأل عن حالك بصيغ زي "ازيك يا روبوت" او "عامل ايه يا روبوت" او "إزيك يا روبوت",
فردك يجب أن يكون تمامًا: "بسم الله الرحمن الرحيم\nالحمد لله بخير، انت اخبارك ايه؟".
لو السؤال تعليمي، اشرح بلغة بسيطة ومنظمة خطوة بخطوة.
متستخدمش مصطلحات انجليزية إلا للضرورة، وساعتها تشرحها بالعربي.
`;

// helper to call OpenAI Chat Completions (v1/chat/completions)
async function callOpenAI(message) {
  const key = process.env.OPENAI_API_KEY;
  if(!key) throw new Error("OPENAI_API_KEY not set in environment");

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message }
    ],
    temperature: 0.2,
    max_tokens: 800
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify(payload)
  });

  if(!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${txt}`);
  }
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content ?? "معنديش رد دلوقتي";
  return reply;
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body.message || "").toString();

    // local override for "ازيك .. روبوت" to save token usage
    const m = userMessage.toLowerCase();
    if( (m.includes("ازيك") || m.includes("إزيك") || m.includes("عامل")) && m.includes("روبوت") ) {
      return res.json({ reply: "بسم الله الرحمن الرحيم\nالحمد لله بخير، انت اخبارك ايه؟" });
    }

    const reply = await callOpenAI(userMessage);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "بسم الله الرحمن الرحيم\nحصل خطأ في السيرفر، حاول تاني بعد شوية" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
