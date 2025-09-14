// server/src/controllers/aiController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

exports.generateRulesFromText = async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ message: 'Text prompt is required.' });

    const prompt = `
You are an API that converts marketing text into a strict JSON object:
{ "logic": "AND"|"OR", "rules": [{ "field": "totalSpends"|"visitCount"|"lastVisit", "operator": ">"|"<"|"="|">="|"<=", "value": number }] }

## Fields
- totalSpends: total customer spend (number, INR)
- visitCount: total visits (number)
- lastVisit: days since last visit (number)

## Choose logic (CRUCIAL)
- Use "OR" when the text expresses alternatives:
  - phrases like "either X or Y", "X or Y", "any of X, Y"
  - comma-separated alternates that read like options (e.g., "low spenders, new users")
- Use "AND" when criteria must all hold:
  - "X and Y", "both X and Y", "as well as"
- If both appear, prefer the connector joining the top-level ideas:
  - "either ... or ..." forces OR
  - otherwise default to AND
- If only one rule is present, use "AND".

## Business shortcuts
- "high value / top spenders / big buyers"  => totalSpends > 5000
- "low value / small carts"                 => totalSpends < 1000
- "inactive / churn / not seen / dormant"  => lastVisit > 90
- "active / recent"                        => lastVisit < 30
- "new customers / first-timers"           => visitCount <= 1
- "loyal / frequent / repeat"              => visitCount > 5

## Time
- Today is Sep 14, 2025. "visited this year" => lastVisit < 257.

## Output (STRICT JSON only, no prose)
User Text: "${text}"
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    });

    const out = JSON.parse(result.response.text() || '{}');

    // Tiny guardrails without full sanitization:
    const logic = (out.logic === 'OR') ? 'OR' : 'AND';
    const rules = Array.isArray(out.rules) ? out.rules.slice(0, 12) : [];

    return res.json({ logic, rules });
  } catch (e) {
    console.error('AI rules error:', e);
    return res.status(500).json({ message: 'Failed to generate rules from AI.' });
  }
};
