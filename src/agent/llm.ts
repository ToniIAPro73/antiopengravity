import OpenAI from 'openai';
import { config } from '../config/env.js';

const groq = new OpenAI({
  apiKey: config.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const openRouter = config.OPENROUTER_API_KEY ? new OpenAI({
  apiKey: config.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
}) : null;

const GROQ_MODEL = "llama-3.3-70b-versatile";

export const callLLM = async (messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], tools?: any[]) => {
  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      tools: tools?.length ? tools : undefined,
      tool_choice: tools?.length ? "auto" : "none",
    });
    return response.choices[0].message;
  } catch (error: any) {
    console.warn(`⚠️ Groq API failed: ${error.message}. Attempting fallback to OpenRouter...`);
    
    if (openRouter) {
      try {
        const fallbackResponse = await openRouter.chat.completions.create({
          model: config.OPENROUTER_MODEL,
          messages,
          tools: tools?.length ? tools : undefined,
          tool_choice: tools?.length ? "auto" : "none",
        });
        return fallbackResponse.choices[0].message;
      } catch (fallbackError: any) {
        console.error(`❌ OpenRouter fallback also failed: ${fallbackError.message}`);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};
