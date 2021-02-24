import stalkingStrategy from "@/strategy/stalking";
import market from '@/api/huobi/market'


// initial state
const state = () => ({
    weekType: 0,
    weekDate: null,
    dayType: 0,
    dayDate: null,
})

// getters
const getters = {

}

const actions = {
    calculate({ commit }, request) {
        // 周线长期趋势
        market.getKline("1week", 2000, request.symbol)
            .then(function (response) {
                let klineList = response.data.data;

                klineList = klineList.sort((s1, s2) => {
                    return s1.id - s2.id;
                });

                let pointList = stalkingStrategy.calculate(klineList);
                let lastPoint = pointList[pointList.length - 1]

                commit('setWeek', lastPoint)
            })
            .catch(function (error) {
                console.log(error);
            });

        // 日线长期趋势
        market.getKline("1day", 2000, request.symbol)
            .then(function (response) {
                let klineList = response.data.data;

                klineList = klineList.sort((s1, s2) => {
                    return s1.id - s2.id;
                });

                let pointList = stalkingStrategy.calculate(klineList);
                let lastPoint = pointList[pointList.length - 1]

                commit('setDay', lastPoint)
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    backtest({ commit }, request) {
        // 周线长期趋势
        market.getKline("1week", 2000, request.symbol)
            .then(function (response) {
                let klineList = response.data.data;

                klineList = klineList.sort((s1, s2) => {
                    return s1.id - s2.id;
                });

                let amount = 100000;
                let status = 1; // 1. 空仓， 2. 满仓
                let pointList = stalkingStrategy.calculate(klineList);
                pointList.forEach(point => {
                    // 底分型 买入
                    if (point.type == 2) {
                        if (status == 1) {
                            status = 2;
                            console.log("买入: " + point.date.toString("yyyy-MM-dd") + " " + point.price)
                        }
                    }
                    // 顶分型 卖出
                    if (point.type == 1) {
                        if (status == 2) {
                            status = 1;
                            console.log("卖出: " + point.date.toString("yyyy-MM-dd") + " " + point.price)
                        }
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

const mutations = {
    setWeek(state, result) {
        state.weekType = result.type;
        state.weekDate = result.date.toString("yyyy-MM-dd");
    },
    setDay(state, result) {
        state.dayType = result.type;
        state.dayDate = result.date.toString("yyyy-MM-dd");
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}