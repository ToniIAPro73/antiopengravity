import { Bot } from 'grammy';
import { config } from '../config/env.js';
import { setupHandlers } from './handlers.js';

export const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

// Whitelist Middleware (Silent drop for unauthorized users)
bot.use(async (ctx, next) => {
  if (!ctx.from) return;
  const userId = ctx.from.id;
  
  if (!config.TELEGRAM_ALLOWED_USER_IDS.includes(userId)) {
    console.warn(`Unauthorized access attempt from user ID: ${userId}`);
    return;
  }
  
  await next();
});

setupHandlers(bot);

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`, err.error);
});
