import { getInfo, getDetail } from '@/api/huobi/contract'
import { Debugger } from 'electron';


// initial state
const state = () => ({
    typeList: [],
    type1: { price: -1 },
    type2: { price: -1 }
})

// getters
const getters = {}

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


// actions
const actions = {
    getInfo({ commit }) {
        getInfo()
            .then(function (response) {
                let data = response.data.data;

                let typeList = [];
                // distinct symbol
                data.forEach(item => {
                    var id = v.sprintf('%s_%s', item.symbol, getTypeAbbr(item.contract_type));
                    var name = v.sprintf('%s（%s）- %s', item.symbol, getTypeName(item.contract_type), item.delivery_date);
                    let type = { "id": id, "name": name, "symbol": item.symbol, "end": item.delivery_time }
                    typeList.push(type)
                });
                commit('setTypeList', typeList)
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    compare({ commit }, request) {
        getDetail(request.type1)
            .then(function (response) {
                let tick = response.data.tick;
                commit('setPrice', { "type": 1, "id": request.type1, "price": tick.close })
            })
            .catch(function (error) {
                console.log(error);
            });

        getDetail(request.type2)
            .then(function (response) {
                let tick = response.data.tick;

                commit('setPrice', { "type": 2, "id": request.type2, "price": tick.close })
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

