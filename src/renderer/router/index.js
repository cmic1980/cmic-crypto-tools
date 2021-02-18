import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'index-page',
      component: require('@/components/IndexPage').default
    },
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/contract/arbitrage',
      name: 'contract-arbitrage-page',
      component: require('@/components/ContractArbitragePage').default
    },
    {
      path: '/contract/stalking',
      name: 'stalking-quantification-page',
      component: require('@/components/StalkingQuantification').default
    }
  ]
})
