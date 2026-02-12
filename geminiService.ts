import { GoogleGenAI, Type } from "@google/genai";
import { DeductionCategory } from "./types";

export const generateUniqueCode = async (planName: string, providerName: string, category: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a unique, short, professional payroll code (uppercase alphanumeric) for an HR deduction. 
    Plan: ${planName}, Provider: ${providerName}, Category: ${category}. 
    The code MUST be between 4 and 12 characters long. 
    Return ONLY the code. Example: MED-BLU-01`,
  });
  return response.text.trim().toUpperCase().substring(0, 12);
};

export const parseBulkDeductions = async (rawText: string): Promise<any[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following text into a list of payroll deduction plans. Extract Plan Name, Provider Name, and Category.
    Text: ${rawText}
    
    Valid Categories are: ${Object.values(DeductionCategory).join(', ')}. 
    Map the extracted data to these categories accurately. 
    Also, generate a unique payroll code for each (max 12 characters).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            planName: { type: Type.STRING },
            providerName: { type: Type.STRING },
            category: { type: Type.STRING },
            suggestedCode: { type: Type.STRING, description: "Max 12 characters" }
          },
          required: ["planName", "providerName", "category", "suggestedCode"]
        }
      }
    }
  });

  try {
    const parsed = JSON.parse(response.text.trim());
    return parsed.map((item: any) => ({
      ...item,
      suggestedCode: item.suggestedCode?.substring(0, 12).toUpperCase()
    }));
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};
