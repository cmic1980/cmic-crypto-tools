let XDate = require('xdate');


function getCWTime(time) {
    let xdate = new XDate()
    xdate.setTime(time);
    while (xdate.getDay() != 5) {
        xdate.addDays(1)
    }

    let year = xdate.getFullYear();
    let month = xdate.getMonth();
    let date = xdate.getDate();
    xdate = new XDate(year, month, date, 16, 0, 0, 0);
    let result = xdate.toDate();
    return result;
}


function getNWTime(time) {
    let xdate = new XDate()
    let result = getCWTime(time);
    xdate.setTime(result);
    xdate = xdate.addWeeks(1)

    result = xdate.toDate();
    return result;
}

let quarterList = [2, 3, 8, 11]
function getCQTime(time) {
    let today = new XDate()
    today.setTime(time);

    let xdate = new XDate()
    xdate.setTime(time);
    let year = xdate.getFullYear();
    let month = xdate.getMonth();

    // 季度月
    while (quarterList.includes(month) == false) {
        month = month + 1;
    }

    // 当年 4.1 号,  当年 7.1 号, 当年 10.1 号, 下一年 1.1  
    if (month == 11) {
        year = year + 1;
        month = 0;
    } else {
        month = month + 1;
    }
    
    xdate = new XDate(year, month, 1)
    xdate =  xdate.addDays(-1)


    // 从上一步减去1天循环早到季度末最后一个星期5
    while (xdate.getDay() != 5) {
        xdate.addDays(-1)
    }

    // 如果日期晚于本季度最后一个周五, 使用下一个季度
    if (xdate.diffDays(today) > 0) {
        let nextQuarter = new XDate(year, month, 1)
        nextQuarter.addMonths(3)
        nextQuarter =  nextQuarter.addDays(-1)

        while (nextQuarter.getDay() != 5) {
            nextQuarter.addDays(-1)
        }

        xdate = nextQuarter;
    }

    let result = xdate.toDate();
    return result;
}


export default {
    calculate(t1, t2, days) {
        let result = {};
        if (
            t1.price != -1 && t2.price != -1
        ) {
            let s = t2.price - t1.price;
            let grossProfit = (t2.price / t1.price - 1) * 100;

            if (days == null) {
                days = parseInt(t2.time - t1.time) / 1000 / 60 / 60 / 24;
            }
            let netProfit = grossProfit - 0.04 - 0.015;
            let yearlyProfit = (netProfit * 365) / days;
            let dailyProfit = netProfit / days;

            grossProfit = grossProfit.toFixed(3) + "%";
            netProfit = netProfit.toFixed(3) + "%";
            yearlyProfit = yearlyProfit.toFixed(3) + "%";
            dailyProfit = dailyProfit.toFixed(3) + "%";
            days = days.toFixed(2) + " 天";
            
            result = {
                t1Name: t1.name,
                t1Price: t1.price,
                t2Name: t2.name,
                t2Price: t2.price,
                grossProfit: grossProfit,
                netProfit: netProfit,
                yearlyProfit: yearlyProfit,
                days: days,
                dailyProfit: dailyProfit,
                s: s.toFixed(2)
            };

        }
        return result;
    },

    setDeliveryTime(type) {
        if (v.endsWith(type.name, "CW")) {
            let cwTime = getCWTime(type.time)
            type.time = cwTime;
        }


        if (v.endsWith(type.name, "NW")) {
            let nwTime = getNWTime(type.time)
            type.time = nwTime;
        }

        if (v.endsWith(type.name, "CQ")) {
            let cqTime = getCQTime(type.time)
            type.time = cqTime;
        }
    }
}

