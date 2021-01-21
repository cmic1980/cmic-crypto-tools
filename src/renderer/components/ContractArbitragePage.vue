<template>
  <div id="wrapper">
    <el-form
      :model="data"
      label-position="left"
      size="mini"
      label-width="80px"
      id="form"
    >
      <el-form-item label="Symbol">
        <el-select
          v-model="data.symbol"
          placeholder="Symbol"
          style="width: 100%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Contract">
        <el-select
          v-model="data.contract"
          placeholder="Contract"
          style="width: 100%"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="test()">Test</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "contract-arbitrage-page",
  data() {
    return {
      data: {
        symbol: "",
        contract: "",
      },
    };
  },
  methods: {
    test() {
      this.$store.dispatch("contract/get");
    },
  },
};
</script>

<style scoped>
#form {
  width: 500px;
}
</style>
