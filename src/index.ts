import { db } from './memory/db.js';
import { bot } from './bot/telegram.js';
import { config } from './config/env.js';

const start = async () => {
  console.log("🚀 Starting OpenAntiAgent...");

  const stmt = db.prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='messages'");
  const result = stmt.get() as { count: number };
  if (result.count === 0) {
    console.error("❌ Database initialization failed.");
    process.exit(1);
  }
  
  console.log("✅ Database connected and verified.");
  console.log(`✅ Loaded ${config.TELEGRAM_ALLOWED_USER_IDS.length} whitelisted user(s).`);

  bot.start({
    onStart: (botInfo) => {
      console.log(`🤖 Bot @${botInfo.username} started successfully.`);
    }
  });

  const shutdown = () => {
    console.log("Stopping bot...");
    bot.stop();
    console.log("Closing database...");
    db.close();
    process.exit(0);
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
};

start().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
