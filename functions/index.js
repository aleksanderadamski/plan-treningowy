const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.analyzeTraining = onRequest({ secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
  // 1. Konfiguracja CORS dla autoryzowanej domeny
  res.set('Access-Control-Allow-Origin', '[https://aleksanderadamski.github.io](https://aleksanderadamski.github.io)');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Obsługa zapytań wstępnych (pre-flight)
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { dataSummary } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = "Jesteś trenerem personalnym. Analizujesz historię treningową. Cel: 1. Szacuj 1RM. 2. Wykryj stagnację. 3. Zasugeruj obciążenia. Pisz krótko po polsku.";
    
    const result = await model.generateContent([systemInstruction, dataSummary]);
    const responseText = result.response.text();

    res.status(200).json({ text: responseText });
  } catch (error) {
    console.error("Błąd serwera AI:", error);
    res.status(500).json({ error: error.message });
  }
});
