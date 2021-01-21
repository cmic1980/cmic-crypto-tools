import { getInfo } from '@/api/huobi/contract'


// initial state
const state = () => ({
    symbolList: [],
    contractTypeList: []
})

// getters
const getters = {}

// actions
const actions = {
    getInfo({ commit }) {
        getInfo()
            .then(function (response) {
                let data = response.data.data;

                let symbolList = [];
                let dict = {}

                // distinct symbol
                data.forEach(item => {
                    let id = item.symbol

                    let symbol = dict[id]
                    if (symbol == null) {
                        symbol = { "id": id, "contractTypeList": [] }
                    }

                    let contractType = { "id": item.contract_type }
                    symbol.contractTypeList.push(contractType)

                    dict[id] = symbol
                });

                for (let id in dict) {
                    let symbol = dict[id]
                    symbolList.push(symbol)
                }
                commit('setSymbolList', symbolList)
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    getContractTypeListBySymbol({ commit }, symbol) {
        commit('setContractTypeList', symbol)
    }
}

// mutations
const mutations = {
    setSymbolList(state, symbolList) {
        state.symbolList = symbolList;
    },
    setContractTypeList(state, symbol) {
        state.symbolList.forEach(item => {
            if (item.id == symbol) {
                state.contractTypeList = item.contractTypeList;
            }
        });

    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

