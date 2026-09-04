// api/improve.js – Secure OpenAI endpoint (Vercel Serverless)
const { OpenAI } = require("openai");

module.exports = async function handler(req, res) {
  // Allow only POST & protect origin
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;
    if (!text || text.trim().length < 3) {
      return res.status(400).json({ error: "No valid text provided" });
    }

    // ✅ Key stays hidden – loaded from Vercel env vars
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.3, // consistent/professional for care
      messages: [
        {
          role: "system",
          content: `You are CareWrite AI – an expert in UK health & supported living documentation.
Rewrite/improve the support worker’s rough note into:
• Clear, professional, objective language
• Grammatically correct & well‑structured
• Person‑centred tone
• Keep ALL original facts/details – do NOT invent anything
• Suitable for official records/care plans`
        },
        { role: "user", content: text }
      ]
    });

    res.status(200).json({
      improved: completion.choices[0].message.content.trim()
    });

  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({ error: "AI improvement failed – try again later" });
  }
};