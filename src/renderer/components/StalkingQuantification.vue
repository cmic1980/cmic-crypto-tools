<template>
  <div id="wrapper">
    <div v-loading="loading">
      <div style="margin-bottom: 30px">
        <el-page-header @back="back()" content="缠论量化交易工具">
        </el-page-header>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form
            :model="data"
            label-position="left"
            size="mini"
            label-width="80px"
            id="form"
          >
            <el-form-item label="品种">
              <el-select v-model="data.type">
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
              <el-button type="primary" plain @click="go()">Go</el-button>
            </el-form-item>
            <el-form-item>
              <table id="table" border="0">
                <thead>
                  <tr>
                    <th>周线</th>
                    <th>交易方向</th>
                    <th>日线</th>
                    <th>交易操作</th>
                  </tr>
                </thead>
                <tr>
                  <td rowspan="2">底分型->顶分型</td>
                  <td rowspan="2">做多</td>
                  <td>底分型</td>
                  <td>做多</td>
                </tr>
                <tr>
                  <td>顶分型</td>
                  <td>做多平仓</td>
                </tr>
                <tr>
                  <td rowspan="2">顶分型->底分型</td>
                  <td rowspan="2">做空</td>
                  <td>顶分型</td>
                  <td>做空</td>
                </tr>
                <tr>
                  <td>底分型</td>
                  <td>做空平仓</td>
                </tr>
              </table>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import stalkingStrategy from '@/strategy/stalking'

export default {
  name: "stalking-quantification-page",
  data() {
    return {
      data: {
        type: "",
      },
      typeList: [{ id: "btcusdt", name: "BTC/USDT" }],
      loading: false,
    };
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    go() {
      stalkingStrategy.calculate(this.data.type)
    },
  },
};
</script>

<style scoped>
#table {
  width: 100%;
}
#table th {
  text-align: left;
  padding: 8px;
}

#table td {
  padding: 8px;
}
</style>