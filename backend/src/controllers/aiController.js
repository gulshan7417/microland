const fetch = (...args) =>
  import("node-fetch").then(({ default: fetchFn }) => fetchFn(...args));

const User = require("../models/User");
const Medicine = require("../models/Medicine");

function buildMockSchedule(extraWarning) {
  return {
    optimizedSchedule: [
      {
        time: "08:00",
        medicines: ["Blood pressure pill 10mg"],
        notes: "Take with water after breakfast"
      },
      {
        time: "20:00",
        medicines: ["Cholesterol pill 20mg"],
        notes: "Avoid grapefruit juice"
      }
    ],
    precautions: [
      "Stand up slowly to avoid dizziness",
      "Avoid alcohol unless doctor allows"
    ],
    doctorWarning:
      "This is an AI-generated example schedule. Always confirm with your doctor." +
      (extraWarning ? ` ${extraWarning}` : "")
  };
}

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;

  // ⭐ MOCK RESPONSE (when API key missing)
  if (!apiKey) {
    return buildMockSchedule();
  }

  // ⭐ CALL OPENAI
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,

        messages: [
          {
            role: "system",
            content:
              "You are a cautious medical assistant. Respond ONLY with valid JSON. No explanations."
          },
          { role: "user", content: prompt }
        ],

        // ⭐ THIS FIXES YOUR PROBLEM
        response_format: { type: "json_object" }
      })
    }
  );

  const data = await response.json();

  // If the API itself returned an error, handle quota issues gracefully
  if (!response.ok) {
    const errorMessage = data.error?.message || "";
    const errorCode = data.error?.code || data.error?.type;

    const isQuotaError =
      response.status === 429 ||
      errorCode === "insufficient_quota" ||
      /quota/i.test(errorMessage);

    if (isQuotaError) {
      // Fall back to a mock schedule so the UI keeps working in demos
      return {
        ...buildMockSchedule(
          "Live AI calls are temporarily disabled because the API quota was exceeded."
        ),
        raw: data
      };
    }

    return {
      optimizedSchedule: [],
      precautions: [],
      doctorWarning:
        errorMessage ||
        "AI could not generate a schedule. Please consult your doctor before making any changes.",
      raw: data
    };
  }

  let text = data.choices?.[0]?.message?.content || "";

  // Remove markdown code fences if the model adds them
  text = text.replace(/```json|```/g, "").trim();

  try {
    let parsed;

    try {
      // First, try to parse the whole string as JSON
      parsed = JSON.parse(text);
    } catch (innerErr) {
      // If that fails, try to extract the JSON object from within extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw innerErr;
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    // Basic validation
    if (!parsed.optimizedSchedule) {
      throw new Error("Missing optimizedSchedule");
    }

    return parsed;
  } catch (e) {
    return {
      optimizedSchedule: [],
      precautions: [],
      doctorWarning:
        "AI response parsing failed. Please consult your doctor before changes.",
      raw: text
    };
  }
}

exports.generateSchedule = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const medicines = await Medicine.find({ userId: req.user.id }).sort({
      time: 1
    });

    const prompt = `
User profile:
Name: ${user.name}
Age: ${user.age}
Conditions: ${user.conditions.join(", ") || "None"}

Current medicines:
${medicines
  .map(
    (m) =>
      `${m.name} | dosage: ${m.dosage} | time: ${m.time} | duration: ${m.duration}`
  )
  .join("\n")}

TASK:
Create an easy daily schedule for an elderly patient.
Spread medicines logically through the day when generally safe.
Suggest simple precautions.
Always include a doctor confirmation warning.

Return ONLY JSON in this structure:

{
  "optimizedSchedule": [
    { "time": "HH:MM", "medicines": ["name"], "notes": "short note" }
  ],
  "precautions": ["precaution 1", "precaution 2"],
  "doctorWarning": "warning text"
}
`;

    const aiResult = await callOpenAI(prompt);

    res.json({ aiResult });
  } catch (err) {
    next(err);
  }
};

exports.applySchedule = async (req, res, next) => {
  try {
    const { optimizedSchedule } = req.body;

    if (!Array.isArray(optimizedSchedule)) {
      return res
        .status(400)
        .json({ message: "optimizedSchedule array is required" });
    }

    const medicines = await Medicine.find({ userId: req.user.id });

    for (const entry of optimizedSchedule) {
      for (const medName of entry.medicines || []) {
        await Medicine.updateMany(
          { userId: req.user.id, name: medName },
          { time: entry.time }
        );
      }
    }

    const updated = await Medicine.find({ userId: req.user.id }).sort({
      time: 1
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};