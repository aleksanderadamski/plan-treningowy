/**
 * Import wymaganych modułów
 */
const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Eksport funkcji chmurowej analyzeTraining.
 * Wykorzystuje Secret Manager do bezpiecznego odczytu klucza API.
 */
exports.analyzeTraining = onRequest({ secrets: ["GEMINI_API_KEY"] }, async (req, res) => {
  // 1. Konfiguracja nagłówków CORS (Cross-Origin Resource Sharing)
  // Pozwala na zapytania wyłącznie z autoryzowanej domeny.
  res.set('Access-Control-Allow-Origin', 'https://aleksanderadamski.github.io');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Obsługa zapytania wstępnego (pre-flight) przeglądarki
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Weryfikacja metody żądania
  if (req.method !== 'POST') {
    res.status(405).send('Metoda niedozwolona');
    return;
  }

  try {
    const { dataSummary } = req.body;

    // Walidacja danych wejściowych
    if (!dataSummary) {
      res.status(400).json({ error: "Brak danych treningowych w żądaniu." });
      return;
    }

    // Inicjalizacja klienta Google AI za pomocą klucza z Secret Managera
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Konfiguracja modelu Gemini 1.5 Flash (wydajny i stabilny)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Definicja kontekstu i instrukcji dla sztucznej inteligencji
    const systemInstruction = "Jesteś trenerem personalnym i ekspertem od analizy danych. Twoim zadaniem jest przeanalizowanie przesłanych logów treningowych (format CSV/tekst). Wylicz szacowane 1RM (One Rep Max) dla głównych bojów, zidentyfikuj ćwiczenia, w których nastąpiła stagnacja, i zaproponuj konkretną progresję ciężaru (+2.5kg) na kolejną sesję. Odpowiadaj zwięźle, w punktach, używając języka polskiego.";
    
    // Przesłanie zapytania do modelu
    const result = await model.generateContent([systemInstruction, dataSummary]);
    const responseText = result.response.text();

    // Zwrócenie odpowiedzi w formacie JSON
    res.status(200).json({ text: responseText });

  } catch (error) {
    // Rejestrowanie błędów w logach Google Cloud Console
    console.error("Błąd przetwarzania AI:", error);
    res.status(500).json({ error: "Wystąpił błąd po stronie serwera AI: " + error.message });
  }
});