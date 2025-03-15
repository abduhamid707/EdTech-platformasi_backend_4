const GOOGLE_BARD_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
const GOOGLE_BARD_API_KEY = "YOUR_GOOGLE_BARD_API_KEY";

export async function extractInfoFromText(text) {
    const response = await fetch(`${GOOGLE_BARD_API_URL}?key=${GOOGLE_BARD_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text }] }] })
    });

    const data = await response.json();
    return data;
}
