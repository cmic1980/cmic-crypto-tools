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
    {{ message }}
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
      message: (state) => {
        let result = "";
        if (
          state.contract.type1.price != -1 &&
          state.contract.type2.price != -1
        ) {
          debugger;
          let t1 = state.contract.type1;
          let t2 = state.contract.type2;
          let benefits = (t2.price / t1.price - 1) * 100;
          let days = parseInt(t2.end - t1.end) / 1000 / 60 / 60 / 24;
          let benefitsOneDay = benefits*365 / days;
          benefits = benefits + "%";
          benefitsOneDay = benefitsOneDay + "%";

          result = v.sprintf(
            "%s: %s - %s: %s 利润: %s 年化利润: %s",
            t1.id,
            t1.price,
            t2.id,
            t2.price,
            benefits,
            benefitsOneDay
          );
        }
        return result;
      },
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
