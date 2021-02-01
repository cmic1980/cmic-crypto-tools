// import { getInfo, getDetail } from '@/api/huobi/contract'
import contract from '@/api/huobi/contract'
import market from '@/api/huobi/market'



// initial state
const state = () => ({
    typeList: [],
    type1: { price: -1, expireList: [] },
    type2: { price: -1, expireList: [] }
    
})

// getters
const getters = {}

let supportSymbolSet = new Set()
supportSymbolSet.add("BTC")
supportSymbolSet.add("ETH")
supportSymbolSet.add("EOS")


function getTypeAbbr(contractType) {
    let abbr = "";
    switch (contractType) {
        case "this_week":
            abbr = "CW";
            break;
        case "next_week":
            abbr = "NW";
            break;
        case "quarter":
            abbr = "CQ";
            break;
        case "next_quarter":
            abbr = "NQ";
            break;
    }
    return abbr;
}

function getTypeName(contractType) {
    let abbr = "";
    switch (contractType) {
        case "this_week":
            abbr = "当周";
            break;
        case "next_week":
            abbr = "次周";
            break;
        case "quarter":
            abbr = "当季";
            break;
        case "next_quarter":
            abbr = "次季";
            break;
    }
    return abbr;
}


function getExpireList(klineList) {
    const expireList = [];
    klineList.forEach(s => {
        const time = s.id * 1000;
        const date = new Date();
        date.setTime(time);
        const day = date.getDay();
        const hours = date.getHours();
        if (day == 4 && hours == 16) {
            const expire = { "open": s.open }
            expireList.push(expire)
        }
    });
    return expireList;
}

// actions
const actions = {
    getInfo({ commit }) {
        contract.getInfo()
            .then(function (response) {
                let data = response.data.data;


                let typeList = [];
                // distinct symbol
                data.forEach(item => {
                    if (supportSymbolSet.has(item.symbol)) {
                        // 期货当周前加上现货
                        if (getTypeAbbr(item.contract_type) == "CW") {
                            let id = v.sprintf('%susdt', v.lowerCase(item.symbol));
                            let name = v.sprintf('%s（现货）', item.symbol);
                            var date = new Date();
                            let type = { "id": id, "name": name, "symbol": item.symbol, "end": date.getTime() }
                            typeList.push(type)
                        }

                        let id = v.sprintf('%s_%s', item.symbol, getTypeAbbr(item.contract_type));
                        let name = v.sprintf('%s（%s）', item.symbol, getTypeName(item.contract_type));
                        let type = { "id": id, "name": name, "symbol": item.symbol, "end": item.delivery_time }
                        typeList.push(type)
                    }

                });
                commit('setTypeList', typeList)
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    compare({ commit }, request) {

        if (v.endsWith(request.type1, 'usdt')) // usdt结尾现货 
        {
            market.getDetail(request.type1)
                .then(function (response) {
                    let tick = response.data.tick;
                    commit('setPrice', { "type": 1, "id": request.type1, "price": tick.close })
                })
                .catch(function (error) {
                    console.log(error);
                });
            
        } else {
            contract.getDetail(request.type1)
                .then(function (response) {
                    let tick = response.data.tick;
                    commit('setPrice', { "type": 1, "id": request.type1, "price": tick.close })
                })
                .catch(function (error) {
                    console.log(error);
                });

            // 获取到期价格
            contract.getKline('60min', '2000', request.type2)
                .then(function (response) {
                    const klineList = response.data.data;
                    const expireList = getExpireList(klineList);
                    commit('setExpireList', { "type": 1, "id": request.type1, "expireList": expireList })
                })
                .catch(function (error) {
                    console.log(error);
                });
        }


        contract.getDetail(request.type2)
            .then(function (response) {
                let tick = response.data.tick;

                commit('setPrice', { "type": 2, "id": request.type2, "price": tick.close })
            })
            .catch(function (error) {
                console.log(error);
            });

        // 获取到期价格
        contract.getKline('60min', '2000', request.type2)
            .then(function (response) {
                const klineList = response.data.data;
                const expireList = getExpireList(klineList);
                commit('setExpireList', { "type": 2, "id": request.type2, "expireList": expireList })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

// mutations
const mutations = {
    setTypeList(state, typeList) {
        state.typeList = typeList;
    },
    setPrice(state, data) {
        let type = state.typeList.filter(s => s.id == data.id)[0];
        type.price = data.price
        state["type" + data.type] = type
    },
    setExpireList(state, data) {
        debugger
        let type = state.typeList.filter(s => s.id == data.id)[0];
        type.expireList = data.expireList
        state["type" + data.type] = type
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

