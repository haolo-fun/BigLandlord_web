<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.address" placeholder="地址" clearable style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="房屋状态" clearable style="width: 200px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label + '(' + item.key + ')'" :value="item.key" />
      </el-select>
      <el-select v-model="selectValue" class="filter-item" style="width: 130px">
        <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="listQuery.min" placeholder="最小值" style="width: 100px" clearable class="filter-item" />
      <el-input v-model="listQuery.max" placeholder="最大值" style="width: 100px" clearable class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddDialog">
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="refreshList">
        刷新
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column label="地址" align="center" min-width="200px">
        <template v-slot="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="面积" align="center" width="100px">
        <template v-slot="{ row }">
          <span>{{ row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="押金" align="center" width="100px">
        <template v-slot="{ row }">
          <span>{{ row.deposit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格/月" align="center" width="100px">
        <template v-slot="{ row }">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" class-name="status-col" width="100px">
        <template v-slot="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ statusKeyValue[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="租客" align="center" width="150px">
        <template v-slot="{ row }">
          <span class="link-type" @click="getTenant(row.tenantId)">{{ row.tenantName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期时间" align="center" width="200px">
        <template v-slot="{ row }">
          <span>{{ row.dueDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px" fixed="right" class-name="small-padding fixed-width">
        <template v-slot="{ row, $index }">
          <el-button v-if="row.status === 0" size="mini" type="success" @click="handleOrderDialog()">
            构建租单
          </el-button>
          <el-button v-if="row.status === 1" size="mini" type="success" disabled>
            构建租单
          </el-button>
          <el-button v-if="row.status === 0" size="mini" type="primary" @click="handleUpdateDialog(row)">
            编辑
          </el-button>
          <el-button v-if="row.status === 1" size="mini" type="primary" disabled>
            编辑
          </el-button>
          <el-button v-if="row.status === 0" size="mini" type="danger" @click="handleDeleteConfirm(row.id,$index)">
            删除
          </el-button>
          <el-button v-if="row.status === 1" size="mini" type="danger" disabled>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="构建租单" :visible.sync="createOrderDialogVisible" width="25%" center>
      <el-form ref="dataForm" :model="dialogTemp" label-position="top" label-width="100px" style="text-align: center;">
        <el-form-item label="租客" prop="name">
          <el-select v-model="dialogTemp.tenantId" placeholder="租客姓名" clearable filterable remote :remote-method="remoteMethod" :loading="selectLoading">
            <el-option v-for="item in dialogOptions" :key="item.tenantId" :label="item.name + '（' + item.mobile + '）'" :value="item.tenantId" />
          </el-select>
        </el-form-item>
        <el-form-item label="租赁月数" prop="count">
          <el-input-number v-model="dialogTemp.count" :min="1" :max="12" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createOrderDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleCreateOrder()"> 构建 </el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增房源" :visible.sync="addDialogVisible" width="30%" center>
      <el-form ref="dataForm" :model="houseTemp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="地址" prop="address">
          <el-input v-model="houseTemp.address" clearable />
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model="houseTemp.area" clearable />
        </el-form-item>
        <el-form-item label="押金" prop="deposit">
          <el-input v-model="houseTemp.deposit" clearable />
        </el-form-item>
        <el-form-item label="价格/月" prop="price">
          <el-input v-model="houseTemp.price" clearable />
        </el-form-item>
        <el-form-item label="房屋状态" prop="status">
          <el-select v-model="houseTemp.status" style="width: 140px">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createOrderDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleAdd()"> 确定 </el-button>
      </div>
    </el-dialog>

    <el-dialog title="更新信息" :visible.sync="updateDialogVisible" width="30%" center>
      <el-form ref="dataForm" :model="houseTemp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="ID" prop="id">
          <el-input v-model="houseTemp.id" disabled />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="houseTemp.address" clearable />
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model="houseTemp.area" clearable />
        </el-form-item>
        <el-form-item label="押金" prop="deposit">
          <el-input v-model="houseTemp.deposit" clearable />
        </el-form-item>
        <el-form-item label="价格/月" prop="price">
          <el-input v-model="houseTemp.price" clearable />
        </el-form-item>
        <el-form-item label="房屋状态" prop="status">
          <el-select v-model="houseTemp.status" style="width: 140px">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleUpdate()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { addHouse, delHouse, updateHouse, list, listByAddress, listByStatus, listByArea, listByPrice } from '@/api/house'
import Pagination from '@/components/Pagination'
import { getTenantOptions } from '@/api/tenant'
import { buildOrder } from '@/api/order'

const statusOptions = [
  {
    key: 0,
    label: '空闲'
  },
  {
    key: 1,
    label: '已租'
  }
]

const selectOptions = [
  {
    value: 0,
    label: '面积范围'
  },
  {
    value: 1,
    label: '价格范围'
  }
]

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})

export default {
  name: 'HouseTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'danger',
        0: 'success'
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
      listQuery: {
        page: 1,
        limit: 20,
        min: '',
        max: '',
        id: undefined,
        address: '',
        status: undefined,
        tenantId: undefined
      },
      statusOptions,
      statusKeyValue,
      selectOptions,
      selectValue: 0,
      createOrderDialogVisible: false,
      addDialogVisible: false,
      updateDialogVisible: false,
      dialogOptions: [],
      selectLoading: false,
      dialogTemp: {
        houseId: undefined,
        tenantId: undefined,
        count: 1
      },
      houseTemp: {
        id: undefined,
        address: '',
        area: undefined,
        deposit: undefined,
        price: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.address !== '') {
        listByAddress(this.listQuery.address, this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.status !== '' && this.listQuery.status !== undefined) {
        listByStatus(this.listQuery.status, this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
        return
      }
      if (this.listQuery.min !== '' && this.listQuery.max !== '') {
        if (this.selectValue === 0) {
          listByArea(this.listQuery.min, this.listQuery.max, this.listQuery.page, this.listQuery.limit).then(
            (response) => {
              this.list = response.data.list
              this.total = response.data.total
            }
          )
          this.listLoading = false
          return
        }
        if (this.selectValue === 1) {
          listByPrice(this.listQuery.min, this.listQuery.max, this.listQuery.page, this.listQuery.limit).then(
            (response) => {
              this.list = response.data.list
              this.total = response.data.total
            }
          )
          this.listLoading = false
          return
        }
      }
      list(this.listQuery.page, this.listQuery.limit).then(
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
    handleDelete(id, index) {
      this.listLoading = true
      delHouse(id).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false
            this.list.splice(index, 1)
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
    handleOrderDialog(houseId) {
      this.createOrderDialogVisible = true
      this.dialogTemp.houseId = houseId
    },
    handleAddDialog() {
      this.houseTemp.id = undefined
      this.houseTemp.address = undefined
      this.houseTemp.area = undefined
      this.houseTemp.deposit = undefined
      this.houseTemp.price = undefined
      this.houseTemp.status = undefined
      this.addDialogVisible = true
    },
    handleUpdateDialog(row) {
      this.houseTemp.id = row.id
      this.houseTemp.address = row.address
      this.houseTemp.area = row.area
      this.houseTemp.deposit = row.deposit
      this.houseTemp.price = row.price
      this.houseTemp.status = row.status
      this.updateDialogVisible = true
    },
    handleDeleteConfirm(id, index) {
      this.$confirm('此操作将删除该房源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(id, index)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    remoteMethod(name) {
      if (name !== '') {
        this.selectLoading = true
        getTenantOptions(name).then(
          (response) => {
            this.dialogOptions = response.data
          }
        )
        this.selectLoading = false
      }
    },
    handleCreateOrder() {
      const tempData = Object.assign({}, this.dialogTemp)
      buildOrder(tempData).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Build Successfully',
              type: 'success',
              duration: 2000
            })
            this.createOrderDialogVisible = false
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Build Failed',
              duration: 2000
            })
          }
        }
      )
    },
    handleAdd() {
      const tempData = Object.assign({}, this.houseTemp)
      addHouse(tempData).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Add Successfully',
              type: 'success',
              duration: 2000
            })
            this.updateDialogVisible = false
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
    handleUpdate() {
      const tempData = Object.assign({}, this.houseTemp)
      updateHouse(tempData).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.updateDialogVisible = false
          } else {
            this.$notify.error({
              title: 'Fail',
              message: 'Update Failed',
              duration: 2000
            })
          }
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
