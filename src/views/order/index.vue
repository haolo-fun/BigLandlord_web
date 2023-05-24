<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sn" placeholder="租单号" clearable style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.houseId" placeholder="房源地址" clearable filterable remote class="filter-item" :remote-method="addressRemoteMethod" :loading="addressSelectLoading">
        <el-option v-for="item in addressSelectOptions" :key="item.houseId" :label="item.address + '（' + item.houseId + '）'" :value="item.houseId" />
      </el-select>
      <el-select v-model="listQuery.tenantId" placeholder="租客姓名" clearable filterable remote class="filter-item" :remote-method="tenantIdRemoteMethod" :loading="tenantIdSelectLoading">
        <el-option v-for="item in tenantIdSelectOptions" :key="item.tenantId" :label="item.name + '（' + item.mobile + '）'" :value="item.tenantId" />
      </el-select>
      <el-select v-model="listQuery.orderStatus" placeholder="租单状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label + '(' + item.key + ')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="refreshList">
        刷新
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column label="租单编号" align="center" min-width="130">
        <template v-slot="{ row }">
          <span>{{ row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="250px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租客姓名" width="100px" align="center">
        <template v-slot="{ row }">
          <el-button type="text" @click="getTenant(row.tenantId)">{{ row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" class-name="status-col" width="100px">
        <template v-slot="{row}">
          <el-tag :type="row.orderStatus | statusFilter">
            {{ statusKeyValue[row.orderStatus] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="租期/月" width="100px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附加费" width="70px" align="center">
        <template v-slot="{ row }">
          <el-button type="text" @click="openDrawer(row.orderSn,row.orderStatus)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="总费用" width="100px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付交易号" min-width="210px" align="center">
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
        <template v-slot="{ row }">
          <el-button v-if="row.orderStatus == '0'" size="mini" type="success" @click="handlePush(row.orderSn)">
            推送
          </el-button>
          <el-button v-if="row.orderStatus != '0'" size="mini" type="success" disabled>
            推送
          </el-button>
          <el-button v-if="row.orderStatus == '1'" size="mini" type="danger" @click="handleCancelPush(row.orderSn)">
            取消推送
          </el-button>
          <el-button v-if="row.orderStatus != '1'" size="mini" type="danger" disabled>
            取消推送
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-drawer
      title="附加费详情"
      :visible.sync="drawerTableVisible"
      direction="rtl"
      size="50%"
    >
      <div style="margin: 20px">
        <el-button v-if="drawerAddButton" type="primary" icon="el-icon-circle-plus-outline" style="margin-bottom: 20px" @click="handleInnerAddDrawerVisible()">新增</el-button>
        <el-table v-loading="drawerListLoading" :data="drawerList" stripe>
          <el-table-column label="内容" width="150px">
            <template v-slot="{ row }">
              <span>{{ row.key }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="150px">
            <template v-slot="{ row }">
              <span>{{ row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="150px">
            <template v-slot="{ row }">
              <span>{{ row.count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template v-slot="{ row }">
              <span>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px" fixed="right" class-name="small-padding fixed-width">
            <template v-slot="{ row, $index }">
              <el-button size="mini" type="primary" @click="updateAdditional(row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteAdditional(row.id,$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-drawer
        title="编辑"
        :append-to-body="true"
        :before-close="handleInnerDrawerClose"
        :visible.sync="innerDrawerVisible"
      >
        <div>
          <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
            <el-form-item label="ID" prop="id">
              <el-input v-model="temp.id" disabled />
            </el-form-item>
            <el-form-item label="内容" prop="key">
              <el-input v-model="temp.key" />
            </el-form-item>
            <el-form-item label="单价" prop="value">
              <el-input v-model="temp.value" />
            </el-form-item>
            <el-form-item label="数量" prop="count">
              <el-input v-model="temp.count" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="temp.remark" />
            </el-form-item>
          </el-form>
          <div style="margin-left: 50px; margin-top: 50px">
            <el-button @click="innerDrawerVisible = false"> 取消 </el-button>
            <el-button type="primary" @click="handleUpdateAdditional()"> 提交 </el-button>
          </div>
        </div>
      </el-drawer>
      <el-drawer
        title="新增"
        :append-to-body="true"
        :before-close="handleInnerDrawerClose"
        :visible.sync="innerAddDrawerVisible"
      >
        <div>
          <el-form ref="dataForm" :model="addTemp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
            <el-form-item label="内容" prop="key">
              <el-input v-model="addTemp.key" />
            </el-form-item>
            <el-form-item label="单价" prop="value">
              <el-input v-model="addTemp.value" />
            </el-form-item>
            <el-form-item label="数量" prop="count">
              <el-input v-model="addTemp.count" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addTemp.remark" />
            </el-form-item>
          </el-form>
          <div style="margin-left: 50px; margin-top: 50px">
            <el-button @click="innerAddDrawerVisible = false"> 取消 </el-button>
            <el-button type="primary" @click="handleAddAdditional()"> 提交 </el-button>
          </div>
        </div>
      </el-drawer>
    </el-drawer>

    <el-dialog title="租客详情" :visible.sync="tenantDialogVisible" width="40%" center>
      <el-form ref="dataForm" :model="tenantInfo" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="tenantInfo.name" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="tenantInfo.mobile" disabled />
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="tenantInfo.idCard" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tenantDialogVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>

import {
  orderList, orderListByHouseId, orderListByOrderSn, orderListByOrderStatus, orderListByTenantId, updateStatusToHAS_BEEN_ISSUED,
  updateStatusToNOT_ISSUED, updateAdditional, deleteAdditional, addAdditional, listByAdditional
} from '@/api/order'
import Pagination from '@/components/Pagination'
import { getTenantOptions, getByTenantId } from '@/api/tenant'
import { listByHouseOptions } from '@/api/house'
import waves from '@/directive/waves'

const statusOptions = [
  {
    key: 0,
    label: '未推送'
  },
  {
    key: 1,
    label: '已推送'
  },
  {
    key: 2,
    label: '已支付'
  },
  {
    key: 3,
    label: '过期'
  },
  {
    key: 4,
    label: '已退款'
  }
]

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})

export default {
  name: 'OrderTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'warning',
        2: 'success',
        3: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      drawerList: null,
      total: 0,
      listLoading: true,
      drawerListLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sn: '',
        houseId: '',
        orderStatus: '',
        tenantId: '',
        desc: true
      },
      temp: {
        id: undefined,
        key: '',
        value: '',
        count: '',
        remark: ''
      },
      addTemp: {
        key: '',
        value: '',
        count: '',
        remark: ''
      },
      tenantInfo: {
        name: '',
        mobile: '',
        idCard: ''
      },
      statusOptions,
      statusKeyValue,
      addressSelectLoading: false,
      tenantIdSelectLoading: false,
      addressSelectOptions: [],
      tenantIdSelectOptions: [],
      drawerTableVisible: false,
      drawerAddButton: true,
      innerDrawerVisible: false,
      innerAddDrawerVisible: false,
      tenantDialogVisible: false,
      drawerOrderSn: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.sn !== '') {
        orderListByOrderSn(this.listQuery.sn).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.houseId !== '') {
        orderListByHouseId(this.listQuery.houseId, this.listQuery.desc, this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.tenantId !== '') {
        orderListByTenantId(this.listQuery.tenantId, this.listQuery.desc, this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.orderStatus !== '') {
        orderListByOrderStatus(this.listQuery.orderStatus, this.listQuery.desc, this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      orderList(this.listQuery.desc, this.listQuery.page, this.listQuery.limit).then(
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
    tenantIdRemoteMethod(name) {
      if (name !== '') {
        this.tenantIdSelectLoading = true
        getTenantOptions(name).then(
          (response) => {
            this.tenantIdSelectOptions = response.data
          }
        )
        this.tenantIdSelectLoading = false
      }
    },
    addressRemoteMethod(address) {
      if (address !== '') {
        this.addressSelectLoading = true
        listByHouseOptions(address).then(
          (response) => {
            this.addressSelectOptions = response.data
          }
        )
        this.addressSelectLoading = false
      }
    },
    handlePush(sn) {
      updateStatusToHAS_BEEN_ISSUED(sn).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.refreshList()
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Update Failed',
              duration: 2000
            })
          }
        }
      )
    },
    handleCancelPush(sn) {
      updateStatusToNOT_ISSUED(sn).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.refreshList()
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Update Failed',
              duration: 2000
            })
          }
        }
      )
    },
    getAdditionalList() {
      this.drawerListLoading = true
      listByAdditional(this.drawerOrderSn).then(
        (response) => {
          this.drawerList = response.data
          console.log(this.drawerList)
        }
      )
      this.drawerListLoading = false
    },
    openDrawer(sn, status) {
      this.drawerOrderSn = sn
      this.drawerTableVisible = true
      this.drawerAddButton = status <= 1
      this.getAdditionalList()
    },
    updateAdditional(row) {
      this.temp.id = row.id
      this.temp.key = row.key
      this.temp.value = row.value
      this.temp.count = row.count
      this.temp.remark = row.remark
      // 打开二级抽屉
      this.innerDrawerVisible = true
    },
    handleUpdateAdditional() {
      const tempData = Object.assign({}, this.temp)
      updateAdditional(tempData).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getAdditionalList()
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Update Failed',
              duration: 2000
            })
          }
        }
      )
    },
    deleteAdditional(id, index) {
      this.$confirm('此操作将删除该附加费用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdditional(id).then(
          (response) => {
            if (response.code === 200) {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
              })
              this.drawerList.splice(index, 1)
            } else {
              this.$notify.error({
                title: 'Fail',
                message: 'Delete Failed',
                duration: 2000
              })
            }
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleInnerDrawerClose(done) {
      this.$confirm('数据还未保存哦！确定关闭吗？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleInnerAddDrawerVisible() {
      this.innerAddDrawerVisible = true
      this.addTemp.key = ''
      this.addTemp.value = ''
      this.addTemp.count = ''
      this.addTemp.remark = ''
    },
    handleAddAdditional() {
      const tempData = Object.assign({}, this.addTemp)
      addAdditional(this.drawerOrderSn, tempData).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Add Successfully',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Add Failed',
              duration: 2000
            })
          }
        }
      )
    },
    getTenant(tenantId) {
      getByTenantId(tenantId).then(
        (response) => {
          this.tenantInfo.name = response.data.name
          this.tenantInfo.mobile = response.data.mobile
          this.tenantInfo.idCard = response.data.idcard
          this.tenantDialogVisible = true
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
