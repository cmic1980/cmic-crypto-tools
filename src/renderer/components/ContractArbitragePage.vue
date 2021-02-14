<template>
  <div id="wrapper">
    <div style="margin-bottom: 30px">
      <el-page-header @back="back()" content="合约套利"> </el-page-header>
    </div>
    <el-row>
      <el-col :span="12">
        <div v-loading="loading">
          <el-form
            :model="realtimeData"
            label-position="left"
            size="mini"
            label-width="80px"
            id="form"
          >
            <el-form-item label="品种 1">
              <el-select v-model="realtimeData.type1" style="width: 100%">
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
              <el-select v-model="realtimeData.type2" style="width: 100%">
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
              <el-button type="primary" plain @click="realtimeCompare()"
                >实时比较</el-button
              >
            </el-form-item>
            <el-form-item>
              <ul v-show="realtimeResult.show">
                <li>{{ realtimeResult.l1 }}</li>
                <li>{{ realtimeResult.l2 }}</li>
                <li>{{ realtimeResult.l3 }}</li>
                <li>{{ realtimeResult.l4 }}</li>
                <li>{{ realtimeResult.l5 }}</li>
                <li>{{ realtimeResult.l6 }}</li>
              </ul>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <div v-loading="loading">
          <el-form
            :model="klineData"
            label-position="left"
            size="mini"
            label-width="80px"
            id="form"
          >
            <el-form-item label="品种 1">
              <el-select v-model="klineData.type1" style="width: 100%">
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
              <el-select v-model="klineData.type2" style="width: 100%">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="K线类型">
              <el-select v-model="klineData.period" style="width: 100%">
                <el-option
                  v-for="item in klinePeriods"
                  :key="item.id"
                  :label="item.id"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="klineCompare()"
                >k线比较</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import contractService from "@/service/contract";

export default {
  name: "contract-arbitrage-page",
  data() {
    return {
      realtimeData: {
        type1: "",
        type2: "",
      },
      klineData: {
        type1: "",
        type2: "",
        period: "",
      },
      klinePeriods: [
        { id: "1min" },
        { id: "5min" },
        { id: "15min" },
        { id: "30min" },
        { id: "60min" },
        { id: "4hour" },
        { id: "1day" },
        { id: "1mon" },
        { id: "1week" },
        { id: "1year" },
      ],
      loading: false,
    };
  },
  methods: {
    realtimeCompare() {
      if (v.isEmpty(this.realtimeData.type1)) {
        this.$message({
          message: "请选择品种1",
          type: "warning",
        });
        return;
      }

      if (v.isEmpty(this.realtimeData.type2)) {
        this.$message({
          message: "请选择品种2",
          type: "warning",
        });
        return;
      }

      let self = this;
      self.loading = true;
      let request = {
        type1: this.realtimeData.type1,
        type2: this.realtimeData.type2,
      };

      request.cb = function () {
        // 记录 call back 次数
        if (request.cbl == null) {
          request.cbl = 1;
        } else {
          request.cbl = request.cbl + 1;
        }

        if (request.cbl == 2) {
          self.loading = false;
        }
      };
      this.$store.dispatch("contract/realtimeCompare", request);
    },
    klineCompare() {
      if (v.isEmpty(this.klineData.type1)) {
        this.$message({
          message: "请选择品种1",
          type: "warning",
        });
        return;
      }

      if (v.isEmpty(this.klineData.type2)) {
        this.$message({
          message: "请选择品种2",
          type: "warning",
        });
        return;
      }

      if (v.isEmpty(this.klineData.period)) {
        this.$message({
          message: "请选择K线类型",
          type: "warning",
        });
        return;
      }

      let request = {
        type1: this.klineData.type1,
        type2: this.klineData.type2,
        period: this.klineData.period,
      };
      this.$store.dispatch("contract/klineCompare", request);
    },
    back() {
      this.$router.push("/");
    },
  },
  computed: {
    ...mapState({
      typeList: (state) => state.contract.typeList,
      realtimeResult: (state) => {
        let result = {};
        if (
          state.contract.type1.price != -1 &&
          state.contract.type2.price != -1
        ) {
          let r = contractService.calculate(
            state.contract.type1,
            state.contract.type2
          );

          result.l1 = v.sprintf("1. %s: %s", r.t1Name, r.t1Price);
          result.l2 = v.sprintf("2. %s: %s", r.t2Name, r.t2Price);
          result.l3 = v.sprintf("3. 差价: %s", r.s);
          result.l4 = v.sprintf("4. 毛利润: %s", r.grossProfit);
          result.l5 = v.sprintf("5. 到期净利润: %s", r.netProfit);
          result.l6 = v.sprintf("6. 年化到期净利润: %s", r.yearlyProfit);
          result.show = true;
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
#title {
  margin: 10px;
}
</style>
