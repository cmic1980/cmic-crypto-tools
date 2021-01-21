<template>
  <div id="wrapper">
    <el-form
      :model="data"
      label-position="left"
      size="mini"
      label-width="80px"
      id="form"
    >
      <el-form-item label="品种 1">
        <el-select v-model="data.type1" style="width: 100%">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品种 2">
        <el-select v-model="data.type2" style="width: 100%">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="compare()">Go</el-button>
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
        type1: "",
        type2: "",
      },
    };
  },
  methods: {
    compare() {
      if (v.isEmpty(this.data.type1)) {
        this.$message({
          message: "请选择品种1",
          type: "warning",
        });
        return;
      }

      if (v.isEmpty(this.data.type2)) {
        this.$message({
          message: "请选择品种1",
          type: "warning",
        });
        return;
      }

      let request = { type1: this.data.type1, type2: this.data.type2 };
      this.$store.dispatch("contract/compare", request);
    },
  },
  computed: {
    ...mapState({
      typeList: (state) => state.contract.typeList,
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
