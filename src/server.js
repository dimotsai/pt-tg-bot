const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

router.get('/monitoring/data', ctx => {
  const d = new Date();
  const dummyData = {
    dcaLogData: [{
      market: 'DMOBTC',
      profit: 0.05,
      volume: 1000,
      averageCalculator: {
        totalAmount: 50,
        totalCost: 0.5,
        avgPrice: 0.01,
        firstBoughtDate: {
          date: {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
          },
          time: {
            hour: d.getHours(),
            minute: d.getMinutes(),
            second: d.getSeconds(),
          },
        }
      },
      currentPrice: 0.0105,
      boughtTimes: 1,
    }],
    gainLogData: [{
      market: 'DMOBTC',
      profit: 0.05,
      volume: 1000,
      averageCalculator: {
        totalAmount: 50,
        totalCost: 0.5,
        avgPrice: 0.01,
        firstBoughtDate: {
          date: {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
          },
          time: {
            hour: d.getHours(),
            minute: d.getMinutes(),
            second: d.getSeconds(),
          },
        }
      },
      currentPrice: 0.0105,
      boughtTimes: 1,
    }]
  };

  ctx.body = dummyData;
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(9876);
