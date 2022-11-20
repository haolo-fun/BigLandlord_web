<template>
  <div class="app-container">
    <el-container style="margin: 20px">
      <el-card shadow="always" style="width: 300px">
        <div slot="header">
          <span>押金账户</span>
          <el-tooltip class="item" effect="dark" content="暂时无法开通转账功能（需支付宝企业认证）" placement="top-end">
            <el-button style="float: right; padding: 3px 0" type="text">提现</el-button>
          </el-tooltip>
        </div>
        <div style="margin: 10px">
          <span>余额</span>
          <span style="color: red;float: right">{{ deposit }}</span>
        </div>
        <div style="margin: 10px">
          <span>可提现</span>
          <span style="color: green;float: right">{{ withdrawDeposit }}</span>
        </div>
      </el-card>
      <el-card shadow="always" style="width: 300px; margin-left: 40px">
        <div slot="header">
          <span>租金账户</span>
          <el-tooltip class="item" effect="dark" content="暂时无法开通转账功能（需支付宝企业认证）" placement="top-end">
            <el-button style="float: right; padding: 3px 0" type="text">提现</el-button>
          </el-tooltip>
        </div>
        <div style="margin: 10px">
          <span>余额</span>
          <span style="color: red;float: right">{{ rent }}</span>
        </div>
        <div style="margin: 10px">
          <span>可提现</span>
          <span style="color: green;float: right">{{ withdrawRent }}</span>
        </div>
      </el-card>
    </el-container>

    <div style="margin-top: 100px;margin-bottom: 20px">
      <span style="color: #99a9bf;">以下为近十笔交易记录：</span>
    </div>
    <el-table v-loading="listLoading" :data="list" style="width: 100%" stripe>
      <el-table-column label="租/押单号" width="180px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.sn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100px" align="center">
        <template v-slot="{ row }">
          <span>{{ typeKeyValue[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流水" width="150px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户余额" width="150px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流向" width="100px" align="center">
        <template v-slot="{ row }">
          <el-tag :type="row.form | formFilter">
            {{ formKeyValue[row.form] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="180px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import { getMsg } from '@/api/finance'
import { getRecentlyRunningTally } from '@/api/runningTally'

const typeOptions = [
  {
    key: '0',
    type_name: '押金'
  },
  {
    key: '1',
    type_name: '租金'
  }
]

const typeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.type_name
  return acc
}, {})

const formOptions = [
  {
    key: 'in',
    form_name: '流入'
  },
  {
    key: '1',
    form_name: '流出'
  }
]

const formKeyValue = formOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.form_name
  return acc
}, {})

export default {
  name: 'Board',
  filters: {
    formFilter(form) {
      const formMap = {
        'in': 'success',
        'out': 'danger'
      }
      return formMap[form]
    }
  },
  data() {
    return {
      listLoading: true,
      deposit: undefined,
      rent: undefined,
      withdrawDeposit: undefined,
      withdrawRent: undefined,
      list: null,
      typeOptions,
      typeKeyValue,
      formOptions,
      formKeyValue
    }
  },
  created() {
    this.initFinance()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRecentlyRunningTally().then(
        (response) => {
          this.list = response.data
        }
      )
      this.listLoading = false
    },
    initFinance() {
      getMsg().then(
        (response) => {
          this.deposit = response.data.deposit
          this.rent = response.data.rent
          this.withdrawDeposit = response.data.withdrawDeposit
          this.withdrawRent = response.data.withdrawRent
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
