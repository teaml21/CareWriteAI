export default async function handler(req, res) {
  // Allow the CareWrite website to call this endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser security check
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        error: "No care note was provided."
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        instructions: `
You are CareWrite AI, an assistant for professional adult social care documentation.

Rewrite the user's note into a clear, professional, objective care record.

Rules:
- Only use information contained in the original note.
- NEVER invent facts, observations, diagnoses, medication, times, outcomes or events.
- Do not exaggerate or change the meaning.
- Use respectful, person-centred language.
- Keep the person's dignity and privacy.
- Do not identify the person by name unless the original note contains a name.
- Keep the wording concise and suitable for a professional care record.
- Do not give medical advice.
        `,
        input: note
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res.status(response.status).json({
        error: "AI service error."
      });
    }

    // Extract the generated text
    const output =
      data.output
        ?.flatMap(item => item.content || [])
        ?.filter(item => item.type === "output_text")
        ?.map(item => item.text)
        ?.join("") || "";

    if (!output) {
      return res.status(500).json({
        error: "The AI returned no text."
      });
    }

    return res.status(200).json({
      improvedNote: output
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Something went wrong connecting to CareWrite AI."
    });
  }
}
