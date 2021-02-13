<template>
  <div id="wrapper">
    <el-form
      :model="data"
      label-position="left"
      size="mini"
      label-width="80px"
      id="form"
    >
      <el-form-item label="合约套利"> </el-form-item>
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
        <el-button type="primary" plain @click="compare()">运行</el-button>
        <el-button type="primary" plain @click="back()">返回</el-button>

        <el-button type="primary" plain @click="backtest()">回测</el-button>
      </el-form-item>
    </el-form>
    <div>
      {{ message }}
    </div>
    <div v-for="item in klineListMessage" :key="item.id">
      {{ item }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import contractService from "@/service/contract";

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
          message: "请选择品种2",
          type: "warning",
        });
        return;
      }

      let request = { type1: this.data.type1, type2: this.data.type2 };
      this.$store.dispatch("contract/compare", request);
    },
    back() {
      this.$router.back();
    },
    backtest() {},
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
          let r = contractService.calculate(
            state.contract.type1,
            state.contract.type2
          );

          result = v.sprintf(
            "1. %s: %s ->>> %s: %s; 2. 毛利润: %s; 3. 到期净利润: %s; 4. 年化到期净利润: %s",
            r.t1Name,
            r.t1Price,
            r.t2Name,
            r.t2Price,
            r.grossProfit,
            r.netProfit,
            r.yearlyProfit
          );
        }
        return result;
      },

      klineListMessage: (state) => {
        let list = [];
        if (
          state.contract.expireList1.length != 0 &&
          state.contract.expireList2.length != 0
        ) {
          const l = state.contract.expireList1.length;
    
          for (let i = 0; i < l; i++) {
            
            let kline1 = state.contract.expireList1[i];
            let kline2 = state.contract.expireList2[i];

            let r = contractService.calculate(kline1, kline2, 7);
           

            let date = new Date()
            date.setTime(kline1.id*1000)
            r.id = date.toString()
            list.push(r);
          }
        }
        return list;
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
#title {
  margin: 10px;
}
</style>
