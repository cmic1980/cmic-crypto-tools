import { getInfo } from '@/api/huobi/contract'


// initial state
const state = () => ({
    all: []
})

// getters
const getters = {}

// actions
const actions = {
    get({ commit }) {
        alert(1)
    }
}

// mutations
const mutations = {
    
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

