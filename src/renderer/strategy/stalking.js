let XDate = require('xdate');

function combineKline(klineList) {
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
    return newList;
}

function calculatePointList(newList) {
    let pointList = [] // 0 未有分型， 1 卖单， 2 买单

    // 2.1.2 顶底分型判断
    let type = 0; // 0 未有分型， 1 顶分型， 2 底分型
    for (let i = 2; i < newList.length - 1; i++) {
        let left = newList[i - 1];
        let p = newList[i];
        let right = newList[i + 1];

        // 顶分型判断
        if (type != 1) {
            // 如果有某一根 K 线的高点都高于左右两侧 K 线的高点
            if (p.high > left.high && p.high > right.high) {
                // 并且这根 K 线的低点也高于左右两侧的 K 线的低点
                if (p.low > left.low && p.low > right.low) {
                    type = 1;
                    
                    let date = new Date();
                    date.setTime(p.id * 1000)
                    let xdate = new XDate(date)

                    let point = { "id": p.id, "date": xdate, "price": right.low, "type":1 };

                    pointList.push(point)
                }
            }
        }

        // 底分型判断
        if (type != 2) {
            // 如果有某一根 K 线的高点都低于左右两侧 K 线的高点
            if (p.high < left.high && p.high < right.high) {
                // 并且这根 K 线的低点也低于左右两侧的 K 线的低点
                if (p.low < left.low && p.low < right.low) {
                    type = 2;

                    let date = new Date();
                    date.setTime(p.id * 1000)
                    let xdate = new XDate(date)

                    let point = { "id": p.id, "date": xdate, "price": right.high, "type":2 };
                    pointList.push(point)
                }
            }
        }
    }
   return pointList;
}

export default {
    calculate(klineList) {
        klineList = klineList.sort((s1, s2) => {
            return s1.id - s2.id;
        });

        // 2.1.1 K 线合并
        let newList = combineKline(klineList);
        let result = calculatePointList(newList);
        return result;
    }
}



