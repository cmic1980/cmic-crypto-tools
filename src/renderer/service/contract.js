export default {
    calculate(t1, t2) {
        let result = {};
        if (
            t1.price != -1 && t2.price != -1
        ) {
            let grossProfit = (t2.price / t1.price - 1) * 100;
            let days = parseInt(t2.time - t1.time) / 1000 / 60 / 60 / 24;
            let netProfit = grossProfit - 0.04 - 0.015;
            let yearlyProfit = (netProfit * 365) / days;
            grossProfit = grossProfit + "%";
            yearlyProfit = yearlyProfit+ "%";

            result = {
                t1Name: t1.name,
                t1Price: t1.price,
                t2Name: t2.name,
                t2Price: t2.price,
                grossProfit: grossProfit,
                netProfit: netProfit,
                yearlyProfit: yearlyProfit,
            };

        }
        return result;
    }
}