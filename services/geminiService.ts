
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiPlanResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const schema = {
  type: Type.OBJECT,
  properties: {
    idea: {
      type: Type.STRING,
      description: "A single, realistic, and creative side hustle idea based on the user's profile. Should be a short, catchy title.",
    },
    tasks: {
      type: Type.ARRAY,
      description: "An array of exactly 5 simple, actionable starter tasks for the side hustle. Each task should be a concise string.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ['idea', 'tasks'],
};

export const generateSideHustlePlan = async (
  skills: string,
  time: string,
  constraints: string
): Promise<GeminiPlanResponse> => {
  try {
    const prompt = `You are an expert side hustle coach specializing in helping people during tough economic times. Your advice is practical, realistic, and encouraging. Based on the following user profile, generate one realistic side hustle idea and exactly 5 simple, actionable starter tasks to begin.

User Profile:
- Skills: "${skills}"
- Time Available: "${time}"
- Constraints or Resources: "${constraints}"

Generate a creative but practical idea that the user can start with minimal investment. The tasks should be clear, concise first steps.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.text.trim();
    const plan = JSON.parse(jsonText);

    if (!plan.idea || !Array.isArray(plan.tasks) || plan.tasks.length === 0) {
      throw new Error("Invalid response format from API.");
    }
    
    return plan as GeminiPlanResponse;

  } catch (error) {
    console.error("Error generating side hustle plan:", error);
    throw new Error(
      "Failed to generate a plan. The AI coach might be busy. Please try again later."
    );
  }
};
