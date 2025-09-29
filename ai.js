import { fileTypeFromBuffer } from "file-type";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const API_KEY = "AIzaSyAsOrx9g1AqYpdzgmkhhxUp5njo7EuWC-Q";

const ai = new GoogleGenerativeAI(API_KEY);
const GEMINI_MODEL = "gemini-2.5-flash-lite";

export async function question(prompt) {
  try {
    const model = ai.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 100, // Ultra-reducido para respuestas muy cortas
      }
    });

    // Modificar el prompt para solicitar respuestas ULTRA concisas
    const concisePrompt = prompt + '\n\nINSTRUCCIÓN CRÍTICA: Responde de manera ULTRA BREVE. Máximo 3 oraciones cortas. Sé directo y conciso. NO agregues información innecesaria.';

    const result = await model.generateContent([concisePrompt]);
    let response = result.response.text();

    // Limitar ULTRA estrictamente la longitud
    if (response.length > 250) {
      response = response.substring(0, 250) + '...';
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fileAI(fileBuffer, mime, prompt) {
    try {
          const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

        const file = {
            inlineData: {
                data: fileBuffer.toString("base64"),
                mimeType: mime,
            },
        };

        const result = await model.generateContent([prompt + '\n\nAsegurate de generar tu respuesta en español.', file]);
        return result.response.text();
    } catch (error) {
        console.error(error);
    }
}

export async function analyzeImage(fileBuffer, prompt) {
  try {
    const type = await fileTypeFromBuffer(fileBuffer);

    const inlineData = {
      data: fileBuffer.toString("base64"),
      mimeType: type.mime,
    };

    const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

    const contents = [
      { role: "user", parts: [{ inlineData }] },
      {
        role: "user",
        parts: [{ text: prompt + "\n\nResponde solo en español." }],
      },
    ];

    const result = await model.generateContent({ contents });
    const response = await result.response;

    if (response && response.text()) {
      console.log(response.text());
    } else {
      console.error(
        "La respuesta de la API no tiene el formato esperado.",
        response
      );
    }
  } catch (error) {
    console.error("Error al analizar la imagen:", error);
  }
}