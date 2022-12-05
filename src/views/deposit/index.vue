<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.depositSn" placeholder="押金单号" clearable style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.tenantId" placeholder="租客姓名" clearable filterable remote class="filter-item" :remote-method="remoteMethod" :loading="selectLoading">
        <el-option v-for="item in selectOptions" :key="item.tenantId" :label="item.name + '（' + item.mobile + '）'" :value="item.tenantId" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="订单状态" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in depositStatusOptions" :key="item.key" :label="item.display_name + '(' + item.key + ')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="refreshList">
        刷新
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column label="押金单号" align="center" min-width="160">
        <template v-slot="{ row }">
          <span>{{ row.depositSn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金" width="100px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.deposit }}</span>
        </template>
      </el-table-column>
      <!--todo 考虑不显示租客id-->
      <el-table-column label="租客id" width="105px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租客姓名" width="120px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" class-name="status-col" width="120px">
        <template v-slot="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ depositStatusKeyValue[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="支付交易号" min-width="200px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.payId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间" width="160px" align="center">
        <template v-slot="{row}">
          <span>{{ row.payTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template v-slot="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px" fixed="right" class-name="small-padding fixed-width">
        <template v-slot="{ row, $index }">
          <el-button v-if="row.status == '0'" size="mini" type="success" @click="handleStatusToPayDialog(row.depositSn)">
            已收款
          </el-button>
          <el-button v-if="row.status == '1'" size="mini" type="warning" @click="handleRefund(row.depositSn)">
            退款
          </el-button>
          <el-button v-if="row.status == '0' || row.status == '2'" size="mini" type="danger" @click="handleDeleteDialog(row.depositSn,$index)">
            删除
          </el-button>
          <el-button v-if="row.status != '0' && row.status != '2'" size="mini" type="danger" disabled>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="提示" :visible.sync="statusToPayDialogVisible" width="30%" center>
      <span>确定已经付款了吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusToPayDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="statusToPay()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
      <span>确定要删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  list,
  listBySn,
  listByDesc,
  listByTenantId,
  listByNotPay,
  listByNotPayDesc,
  listByPay,
  listByPayDesc,
  listByRefund,
  listByRefundDesc,
  updateStatusToPay,
  deleteBySn
} from '@/api/deposit'
import { getTenantOptions } from '@/api/tenant'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive

const depositStatusOptions = [
  {
    key: '0',
    display_name: '未付款'
  },
  {
    key: '1',
    display_name: '已付款'
  },
  {
    key: '2',
    display_name: '已退款'
  }
]

const depositStatusKeyValue = depositStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'info',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      selectLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        tenantId: '',
        status: null,
        depositSn: '',
        sort: 'desc'
      },
      temp: {
        sn: '',
        index: 0
      },
      depositStatusOptions,
      depositStatusKeyValue,
      selectOptions: [],
      sortOptions: [{ label: 'Ascending', key: 'asc' }, { label: 'Descending', key: 'desc' }],
      deleteDialogVisible: false,
      statusToPayDialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.depositSn !== '') {
        listBySn(this.listQuery.depositSn).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.tenantId !== '') {
        listByTenantId(this.listQuery.tenantId, this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.status === 0 && this.listQuery.sort === 'asc') {
        listByNotPay(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.status === 0 && this.listQuery.sort === 'desc') {
        listByNotPayDesc(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.status === 1 && this.listQuery.sort === 'asc') {
        listByPay(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.status === 1 && this.listQuery.sort === 'desc') {
        listByPayDesc(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.status === 2 && this.listQuery.sort === 'asc') {
        listByRefund(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.status === 2 && this.listQuery.sort === 'desc') {
        listByRefundDesc(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.sort === 'asc') {
        list(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      listByDesc(this.listQuery.page, this.listQuery.limit).then(
        (response) => {
          this.list = response.data.list
          this.total = response.data.total
        }
      )
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    refreshList() {
      this.getList()
    },
    statusToPay() {
      this.statusToPayDialogVisible = false
      this.listLoading = true
      updateStatusToPay(this.temp.sn).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Update Failed',
              duration: 2000
            })
          }
        }
      )
      this.refreshList()
      this.listLoading = false
    },
    handleDelete() {
      this.deleteDialogVisible = false
      this.listLoading = true
      deleteBySn(this.temp.sn).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false
            this.list.splice(this.temp.index, 1)
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Delete Failed',
              duration: 2000
            })
            this.listLoading = false
          }
        }
      )
    },
    handleDeleteDialog(sn, index) {
      this.deleteDialogVisible = true
      this.temp.sn = sn
      this.temp.index = index
    },
    handleStatusToPayDialog(sn) {
      this.statusToPayDialogVisible = true
      this.temp.sn = sn
    },
    remoteMethod(name) {
      if (name !== '') {
        this.selectLoading = true
        getTenantOptions(name).then(
          (response) => {
            this.selectOptions = response.data
          }
        )
        this.selectLoading = false
      }
    },
    handleRefund(sn) {
      window.open(window.location.origin + '/#/finance/refund?d=' + sn)
    }
  }

}
</script>

<style scoped>

</style>
