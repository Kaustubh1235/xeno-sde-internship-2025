const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const generateRulesFromText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Text prompt is required.' });
        }

        // This is the core of our AI feature: Prompt Engineering
        const prompt = `
            You are a rule-generation assistant for a CRM platform.
            Your task is to convert a user's natural language text into a structured JSON object of rules.
            The available fields for rules are: "totalSpends", "visitCount", and "lastVisit".
            - "totalSpends" is a number.
            - "visitCount" is a number.
            - "lastVisit" represents days ago and is a number.
            The available operators are: ">", "<", "=", ">=", "<=".

            The final JSON output must only contain a single object with a "rules" array. Each object in the "rules" array must have three keys: "field", "operator", and "value". The value must be a number.

            Example 1:
            User Text: "Customers who have spent more than 5000"
            Your JSON:
            {
                "rules": [
                    { "field": "totalSpends", "operator": ">", "value": 5000 }
                ]
            }

            Example 2:
            User Text: "people who visited 3 times or less and were last seen more than 90 days ago"
            Your JSON:
            {
                "rules": [
                    { "field": "visitCount", "operator": "<=", "value": 3 },
                    { "field": "lastVisit", "operator": ">", "value": 90 }
                ]
            }

            Now, convert the following user text into the JSON format. Respond with ONLY the JSON object and nothing else.

            User Text: "${text}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Clean up the response to ensure it's valid JSON
        const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // Parse the JSON string into an object
        const jsonResponse = JSON.parse(cleanedJsonString);

        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ message: "Failed to generate rules from AI." });
    }
};

module.exports = { generateRulesFromText };