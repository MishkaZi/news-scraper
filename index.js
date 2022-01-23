import telegramAPI from 'node-telegram-bot-api';
import axios from 'axios';
import cheerio from 'cheerio';

import dotenv from 'dotenv';

dotenv.config();

const newsWireURL = 'https://www.newswire.com/newsroom/business-finance';
// const otcMarketsURL = 'https://www.otcmarkets.com/market-activity/news';

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new telegramAPI(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Bot starts' },
  { command: '/info', description: 'Bot commands' },
  { command: '/run', description: 'Run financial news' },
]);

let latestArticle = { title: '', url: '' };

bot.on('message', async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  try {
    // Bot start ++++++++++++++++++++++++++++++++++++
    if (text === '/start') {
      function getNews() {
        console.log('tick');
        // News Wire ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        axios(newsWireURL)
          .then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);

            const titleOfArticle = $('.content-link', html)
              .first()
              .find('h3')
              .text();
            const linkToArticle =
              'https://www.newswire.com/' +
              $('.content-link', html).first().attr('href');

            if (latestArticle.title != titleOfArticle) {
              latestArticle = { title: titleOfArticle, url: linkToArticle };
              console.log(latestArticle);

              if (latestArticle !== {}) {
                bot.sendMessage(
                  chatId,
                  latestArticle.title + `\n` + latestArticle.url
                );
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
        // // OTC Market ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // axios(otcMarketsURL)
        //   .then((res) => {
        //     const html = res.data;
        //     const $ = cheerio.load(html);
        //     console.log(html);

        //     const titleOfArticle = $('._1N_-1HEdLn', html).first().attr('href');
        //     // const linkToArticle =
        //     //   'https://www.newswire.com/' +
        //     //   $('.content-link', html).first().attr('href');
        //     console.log(titleOfArticle);
        //     // if (latestArticle.title != titleOfArticle) {
        //     //   latestArticle = { title: titleOfArticle, url: linkToArticle };
        //     //   console.log(latestArticle);

        //     //   if (latestArticle !== {}) {
        //     //     bot.sendMessage(chatId, latestArticle.title + `\n` + latestArticle.url);
        //     //   }
        //     // }
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      }

      setInterval(getNews, 60000);
      return bot.sendMessage(
        chatId,
        `Welcome to stocks scraper telegram bot ${msg.from.first_name}`
      );
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `In development`);
    }

    if (!text.startsWith('/')) {
      return bot.sendMessage(
        chatId,
        `So basicly you are saying that "${text}", nice brah`
      );
    }

    // return bot.sendMessage(chatId, 'Wrong command');
  } catch (e) {
    return bot.sendMessage(chatId, 'There was a problem');
  }
});
