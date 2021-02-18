<template>
  <div id="wrapper">
    <el-row>
      <el-button type="primary" plain @click="goContractArbitrage()"
        >合约套利</el-button
      >
      <el-button type="primary" plain @click="stalkingQuantification()"
        >缠论量化交易工具</el-button
      >
    </el-row>
  </div>
</template>

<script>
export default {
  name: "index-page",
  methods: {
    goContractArbitrage() {
      this.$router.push("/contract/arbitrage");
    },
    stalkingQuantification(){
      this.$router.push("/contract/stalking");
    }
  },
};
</script>

<style>
</style>

