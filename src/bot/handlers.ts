import { Bot, Context } from 'grammy';
import { processUserMessage } from '../agent/loop.js';
import { repository } from '../memory/repository.js';

export const setupHandlers = (bot: Bot) => {
  bot.command('start', async (ctx) => {
    await ctx.reply("👋 Hello! I am OpenAntiAgent. How can I help you today?");
  });

  bot.command('clear', async (ctx) => {
    if (!ctx.from) return;
    repository.clearHistory(ctx.from.id);
    await ctx.reply("🧹 Conversation history cleared.");
  });

  bot.on('message:text', async (ctx) => {
    if (!ctx.from) return;
    
    // Ignore updates that are too old (optional, but good for local bots)
    if (ctx.message.date < Date.now() / 1000 - 60) {
       console.log("Ignoring old message");
       return;
    }

    await ctx.replyWithChatAction('typing');
    
    try {
      const reply = await processUserMessage(ctx.from.id, ctx.message.text);
      await ctx.reply(reply);
    } catch (error: any) {
      console.error("Error processing message:", error);
      await ctx.reply(`❌ An error occurred: ${error.message}`);
    }
  });
};
