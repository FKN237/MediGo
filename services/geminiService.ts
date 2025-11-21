
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface InterpretedSearch {
  medicationName: string;
  category?: string;
  urgencyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  isSymptomDescription: boolean;
}

/**
 * Interprets a user's raw search query (e.g., "headache medicine" or "Coartem")
 * and standardizes it for database lookup.
 */
export const interpretSearchQuery = async (query: string): Promise<InterpretedSearch | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this search query related to medicine in Cameroon: "${query}".
      Return a JSON object with:
      - medicationName: The likely generic or brand name of the drug.
      - category: Broad category (e.g., Antimalarial, Antibiotic).
      - urgencyLevel: HIGH if it sounds like an emergency (e.g., severe pain, bleeding, malaria attack), otherwise MEDIUM or LOW.
      - isSymptomDescription: true if the user described symptoms instead of a drug name.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicationName: { type: Type.STRING },
            category: { type: Type.STRING },
            urgencyLevel: { type: Type.STRING, enum: ["HIGH", "MEDIUM", "LOW"] },
            isSymptomDescription: { type: Type.BOOLEAN }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Search Interpretation Error:", error);
    return null;
  }
};

/**
 * Suggests alternatives if a specific drug is out of stock.
 */
export const getAlternatives = async (medicationName: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `List 3 safe, generic alternative medicines available in Central Africa for "${medicationName}". Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Alternatives Error:", error);
    return [];
  }
};

/**
 * Analyses a prescription image to extract medication names.
 */
export const analyzePrescriptionImage = async (base64Image: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Read this prescription. List the names of the medications prescribed as a JSON array of strings. If unclear, return an empty array."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return [];
  }
};

/**
 * Identifies a medicine box from an image for verification.
 */
export const identifyMedicineFromImage = async (base64Image: string): Promise<{detectedName: string, confidence: string}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Look at this image of a medicine box or barcode. Identify the BRAND NAME of the medication. Return a JSON with 'detectedName' (string) and 'confidence' (string: 'HIGH' or 'LOW'). If no text is clear, return 'Unknown'."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedName: { type: Type.STRING },
            confidence: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return { detectedName: 'Unknown', confidence: 'LOW' };
  }
};
