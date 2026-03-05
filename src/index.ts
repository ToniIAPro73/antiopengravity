import { bot } from './bot/telegram.js';
import { config } from './config/env.js';
import './memory/firestore.js'; // Ensure Firebase initializes on startup

const start = async () => {
  console.log("🚀 Starting OpenAntiAgent...");

  console.log(`✅ Loaded ${config.TELEGRAM_ALLOWED_USER_IDS.length} whitelisted user(s).`);

  bot.start({
    onStart: (botInfo) => {
      console.log(`🤖 Bot @${botInfo.username} started successfully.`);
    }
  });

  const shutdown = () => {
    console.log("Stopping bot...");
    bot.stop();
    process.exit(0);
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

start().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
