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
        let XDate = require('xdate');
        /*
        let cb = function (result) {
            if(result.period=="week")
            {
                commit('setWeek', result)
            }
            if(result.period=="day")
            {
                commit('setDay', result)
            }
        };
        stalkingStrategy.calculate(request.symbol, cb);
        */

        // 周线长期趋势
        market.getKline("1week", 2000, request.symbol)
            .then(function (response) {
                let klineList = response.data.data;

                klineList = klineList.sort((s1, s2) => {
                    return s1.id - s2.id;
                });

                let pointList = stalkingStrategy.calculate(klineList);
                let lastPoint = pointList[pointList.length -1]
                
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
                let lastPoint = pointList[pointList.length -1]
                
                commit('setDay', lastPoint)
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