const request = require('request-promise');
const config = require('config');
const Telegraf = require('telegraf');

const bot = new Telegraf(config.get('telegram.botToken'));
const chatId = config.get('telegram.chatId');

function getData() {
  const options = {
    uri: config.get('pt.api'),
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
  for (const entry of data)
  {
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
      + `Average Price: ${entry.currentPrice}\n`
      + `Current Price: ${entry.averageCalculator.avgPrice}\n`
      + `Times: ${entry.boughtTimes}\n`
      + `Date: ${d.toLocaleString()}\n`;
    strings.push(string);
  }

  return strings.join('\n');
}

function formatPairsLog(data) {
  let strings = [];
  for (const entry of data)
  {
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
      + `Average Price: ${entry.currentPrice}\n`
      + `Current Price: ${entry.averageCalculator.avgPrice}\n`
      + `Date: ${d.toLocaleString()}\n`;
    strings.push(string);
  }

  return strings.join('\n');
}

bot.command('dca', ctx => {
  if (ctx.chat.id === chatId)
  {
    return getData()
      .then(data => {
        return ctx.reply(formatDcaLog(data.dcaLogData));
      })
      .catch(err => {
        return ctx.reply(err);
      });
  }
});

bot.command('pairs', ctx => {
  if (ctx.chat.id === chatId)
  {
    return getData()
      .then(data => {
        return ctx.reply(formatPairsLog(data.gainLogData));
      })
      .catch(err => {
        return ctx.reply(err);
      });
  }
});

bot.startPolling();
