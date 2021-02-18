import market from '@/api/huobi/market'

export default {
    calculate(symbol) {
        debugger;
        market.getKline("1week", 2000, symbol)
            .then(function (response) {
                let klineList = response.data.data;

                let newList = [];
                klineList.forEach((kline) => {
                    let currentline = { "id": kline.id, "high": kline.high, "low": kline.low }
                    if (newList.length < 2) {
                        newList.push(currentline)
                    } else {
                        let left1Kline = newList[newList.length - 1];
                        if ((left1Kline.high >= currentline.high && left1Kline.low <= currentline.low))   // 包含关系
                        {
                            // 合并原则一：
                            /*
                            如果这两根有包含关系的 K 线左侧的第一个 K 线高点低于这两根有包含关
                            系的 K 线的第一根 K 线的高点 */
                            let left2Kline = newList[newList.length - 2];
                            if (left2Kline.high < left1Kline.high) {

                                // 则合并的原则是: 
                                // 1. 取两根 K 线的高点中最高的点，
                                let high = left1Kline.high > currentline.hig ? left1Kline.high : currentline.hig;

                                // 2. 以及两根 K 线的低点中最高的点，作为合并后 K 线的高低点。
                                let low = left1Kline.low > currentline.low ? left1Kline.low : currentline.low;

                                left1Kline.high = high;
                                left1Kline.low = low;
                            }
                            // 合并原则二:
                            /*
                            如果这两根有包含关系的 K 线左侧的第一个 K 线高点高于这两根有包含关
                            系的 K 线的第一根 K 线的高点 */
                            else if (left2Kline.high > left1Kline.high) {
                                // 则合并的原则是:取两根 K 线的高点中最低的点，以及两根 K 线的低点中最低的点，作为合并后 K 线的高低点。
                                let high = left1Kline.high < currentline.hig ? left1Kline.high : currentline.hig;
                                let low = left1Kline.low < currentline.low ? left1Kline.low : currentline.low;

                                left1Kline.high = high;
                                left1Kline.low = low;
                            } 
                        } else {
                            newList.push(currentline)
                        }
                    }
                });

                debugger
                klineList = null;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}