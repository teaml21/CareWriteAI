// api/improve.js — CareWrite AI • Vercel Serverless Endpoint
const { OpenAI } = require("openai");

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Read text sent from app
    const { text } = req.body;
    if (!text || typeof text !== "string" || text.trim().length < 3) {
      return res.status(400).json({ error: "Please provide valid note text" });
    }

    // Connect securely — KEY comes from Vercel Environment Variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // AI prompt tuned for UK Care / Supported Living standards
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.2, // Keep consistent, factual
      messages: [
        {
          role: "system",
          content: `You are CareWrite AI, an assistant for UK health and supported living documentation.
Rewrite the support worker’s rough, spoken or incomplete note into:
• Clear, grammatically correct, well‑structured professional English
• Objective, person‑centred tone
• Suitable for official care records, care plans and audits
✅ IMPORTANT: NEVER invent, guess or add ANY facts not written in the original text
✅ Preserve exactly what happened, who was involved, times/details if given`
        },
        { role: "user", content: text.trim() }
      ]
    });

    // Send clean result back to app
    return res.status(200).json({
      improved: completion.choices[0].message.content.trim()
    });

  } catch (err) {
    console.error("❌ API /improve error:", err?.message || err);
    return res.status(500).json({
      error: "AI improvement failed — please try again shortly"
    });
  }
};