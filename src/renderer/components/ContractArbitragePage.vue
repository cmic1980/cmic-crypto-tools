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
          @change="symbolChange()"
        >
          <el-option
            v-for="item in symbolList"
            :key="item.id"
            :label="item.id"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Contract">
        <el-select
          v-model="data.contract"
          placeholder="Contract"
          style="width: 100%"
        >
          <el-option
            v-for="item in contractTypeList"
            :key="item.id"
            :label="item.id"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="test()">Test</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "contract-arbitrage-page",
  data() {
    return {
      data: {
        symbol: "",
        contract: "",
      }
    };
  },
  methods: {
    symbolChange() {

      this.$store.dispatch(
        "contract/getContractTypeListBySymbol",
        this.data.symbol
      );
      
    },
  },
  computed: {
    ...mapState({
      symbolList: (state) => state.contract.symbolList,
      contractTypeList: (state) => state.contract.contractTypeList,
    }),
  },
  created() {
    this.$store.dispatch("contract/getInfo");
  },
};
</script>

<style scoped>
#form {
  width: 500px;
}
</style>
