<template>
  <div id="wrapper">
    <el-row>
      <el-button type="primary" plain @click="goContractArbitrage()">合约套利</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "index-page",
  methods: {
    goContractArbitrage() {
        this.$router.push('/contract/arbitrage')
    },
  },
};
</script>

<style>
</style>
