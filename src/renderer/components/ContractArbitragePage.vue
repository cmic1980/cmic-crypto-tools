<template>
  <div id="wrapper">
    <div v-loading="loading">
      <div style="margin-bottom: 30px">
        <el-page-header @back="back()" content="合约套利"> </el-page-header>
      </div>
      <el-row>
        <el-col :span="12">
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
        </el-col>
        <el-col :span="12">
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
          <el-table :data="klineResult" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
          let item = contractService.calculate(
            state.contract.type1,
            state.contract.type2
          );

          result.l1 = v.sprintf("1. %s: %s", item.t1Name, item.t1Price);
          result.l2 = v.sprintf("2. %s: %s", item.t2Name, item.t2Price);
          result.l3 = v.sprintf("3. 差价: %s", item.s);
          result.l4 = v.sprintf("4. 毛利润: %s", item.grossProfit);
          result.l5 = v.sprintf("5. 到期净利润: %s", item.netProfit);
          result.l6 = v.sprintf("6. 年化到期净利润: %s", item.yearlyProfit);
          result.show = true;
        }
        return result;
      },
      klineResult: (state) => {
        let result = [];
        if (
          state.contract.klineList1.length != 0 &&
          state.contract.klineList2.length != 0
        ) {
          // 转换 id 为 key 的 dict， 为了对齐 k 线
          let klineDict1 = {};
          let klineDict2 = {};

          let klineList1 = state.contract.klineList1;
          klineList1.forEach((element) => {
            let key = "k" + element.id;
            klineDict1[key] = element;
          });

          let klineList2 = state.contract.klineList2;
          klineList2.forEach((element) => {
            let key = "k" + element.id;
            klineDict2[key] = element;
          });

          klineList1 = klineList1.sort((s1, s2) => {
            return s1.id - s2.id;
          });

          // 生成 k 线 比较结果
          klineList1.forEach((element) => {
            let id = element.id;
            let key = "k" + id;
            let type1 = klineDict1[key];
            let type2 = klineDict2[key];
            if (type1 != null && type2 != null) {
              let item = contractService.calculate(type1, type2);
              item.id = id;
              let date = new Date();
              date.setTime(id * 1000);
              item.date = date.toDateString();
              result.push(item);
            }
          });
        }

        console.log(JSON.stringify(result));
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
