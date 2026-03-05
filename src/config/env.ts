import { z } from 'zod';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, "Telegram bot token is required"),
  TELEGRAM_ALLOWED_USER_IDS: z.string().min(1, "Allowed user IDs are required").transform(val => 
    val.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))
  ),
  GROQ_API_KEY: z.string().min(1, "Groq API key is required"),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default("openrouter/free"),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1, "Google Application Credentials path is required for Firebase"),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:", error.flatten().fieldErrors);
      process.exit(1);
    }
    throw error;
  }
};

export const config = parseEnv();
