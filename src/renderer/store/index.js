import Vue from 'vue'
import Vuex from 'vuex'

import contract from './modules/contract'
import stalking from './modules/stalking'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    contract,
    stalking
    
  }
})



