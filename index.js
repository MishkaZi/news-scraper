import telegramAPI from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.token;

const bot = new telegramAPI(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Bot starts' },
  { command: '/info', description: 'Bot commands' },
]);

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  try {
    console.log(text);
    if (text === '/start') {
      return bot.sendMessage(
        chatId,
        `Welcome to stocks scraper telegram bot ${msg.from.first_name}`
      );
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `In development`);
    }

    return bot.sendMessage(chatId, 'Wrong command');
  } catch (e) {
    return bot.sendMessage(chatId, 'There was a problem');
  }
});
