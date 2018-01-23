const request = require('request-promise');
const config = require('config');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const Promise = require('bluebird');

const bot = new Telegraf(config.get('telegram.botToken'));
const chatId = config.get('telegram.chatId');

const dcaMarkup = Markup.inlineKeyboard([Markup.callbackButton('Update', 'update_dca')]).extra();
const pairsMarkup = Markup.inlineKeyboard([Markup.callbackButton('Update', 'update_pairs')]).extra();

function getData() {
  const options = {
    uri: `${config.get('pt.api')}/monitoring/data`,
    qs: {
      _: `${new Date().getTime()}`,
    },
    headers: {
      'Cookie': config.get('pt.cookie'),
    },
    json: true,
  };

  return request(options);
}

function formatDcaLog(data) {
  let strings = [];
  for (const entry of data) {
    let firstDate = entry.averageCalculator.firstBoughtDate;
    let d = new Date(Date.UTC(
      firstDate.date.year,
      firstDate.date.month,
      firstDate.date.day,
      firstDate.time.hour,
      firstDate.time.minute,
      firstDate.time.second
    ));
    let string = `Coin: ${entry.market}\n`
      + `Profit: ${entry.profit}\n`
      + `Volume: ${entry.volume}\n`
      + `Total Amount: ${entry.averageCalculator.totalAmount}\n`
      + `Total Cost: ${entry.averageCalculator.totalCost}\n`
      + `Average Price: ${entry.averageCalculator.avgPrice}\n`
      + `Current Price: ${entry.currentPrice}\n`
      + `Times: ${entry.boughtTimes}\n`
      + `Date: ${d.toLocaleString()}\n`;
    strings.push(string);
  }

  if (data.length === 0)
    return "No records.";
  else
    return strings.join('\n');
}

function formatPairsLog(data) {
  let strings = [];
  for (const entry of data) {
    let firstDate = entry.averageCalculator.firstBoughtDate;
    let d = new Date(Date.UTC(
      firstDate.date.year,
      firstDate.date.month,
      firstDate.date.day,
      firstDate.time.hour,
      firstDate.time.minute,
      firstDate.time.second
    ));
    let string = `Coin: ${entry.market}\n`
      + `Profit: ${entry.profit}\n`
      + `Total Amount: ${entry.averageCalculator.totalAmount}\n`
      + `Total Cost: ${entry.averageCalculator.totalCost}\n`
      + `Average Price: ${entry.averageCalculator.avgPrice}\n`
      + `Current Price: ${entry.currentPrice}\n`
      + `Date: ${d.toLocaleString()}\n`;
    strings.push(string);
  }

  if (data.length === 0)
    return "No records.";
  else
    return strings.join('\n');
}

bot.command('dca', ctx => {
  if (ctx.chat.id === chatId) {
    return getData()
      .then(data => {
        return ctx.reply(formatDcaLog(data.dcaLogData), dcaMarkup);
      })
      .catch(err => ctx.reply(err));
  }
});

bot.command('pairs', ctx => {
  if (ctx.chat.id === chatId) {
    return getData()
      .then(data => ctx.reply(formatPairsLog(data.gainLogData), pairsMarkup))
      .catch(err => ctx.reply(err));
  }
});

bot.action('update_dca', (ctx, next) => {
  return getData().then(data => {
    return ctx.editMessageText(formatDcaLog(data.dcaLogData), dcaMarkup)
      .catch(err => console.error(err))
      .then(() => next());
  });
});

bot.action('update_pairs', (ctx, next) => {
  return getData().then(data => {
    return ctx.editMessageText(formatPairsLog(data.gainLogData) , pairsMarkup)
      .catch(err => console.error(err))
      .then(() => next());
  });
});

bot.startPolling();
