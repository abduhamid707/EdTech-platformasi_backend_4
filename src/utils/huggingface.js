const HF_API_URL = "https://api-inference.huggingface.co/models/bigscience/T0_3B";
// const HF_API_KEY = "YOUR_HUGGINGFACE_API_KEY"; 

export async function extractInfoFromText(text) {
    const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${HF_API_KEY}` // Agar model autentifikatsiya talab qilsa
        },
        body: JSON.stringify({ inputs: text })
    });

    const data = await response.json();
    return data;
}
