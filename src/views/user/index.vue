<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" clearable style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleAddDialog">
        添加
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="refreshList">
        刷新
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column label="用户名" align="center" min-width="160">
        <template v-slot="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="200px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="250px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="160px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" class-name="status-col" width="120px">
        <template v-slot="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ statusKeyValue[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="200px" align="center">
        <template v-slot="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320px" fixed="right">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" @click="handleUpdateDialog(row)">
            编辑
          </el-button>
          <el-button size="mini" type="primary" @click="addRole(row.username)">
            添加权限
          </el-button>
          <el-button size="mini" type="danger" @click="resetPassword(row.username)">
            密码重置
          </el-button>
          <el-button v-if="row.status === 0" size="mini" type="success" @click="resetStatus(row.username)">
            启用
          </el-button>
          <el-button v-if="row.status === 1" size="mini" type="danger" @click="resetStatus(row.username)">
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="添加" :visible.sync="addDialogVisible" width="40%" center>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="temp.username" placeholder="必填" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="必填" onkeyup="value=value.replace(/\D/g,'')" maxlength="11" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="idCard">
          <el-input v-model="temp.email" placeholder="可选" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="idCard">
          <el-input v-model="temp.nickName" placeholder="可选" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleAdd()"> 提交 </el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="updateDialogVisible" width="40%" center>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="temp.username" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" onkeyup="value=value.replace(/\D/g,'')" maxlength="11" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="idCard">
          <el-input v-model="temp.email" clearable />
        </el-form-item>
        <el-form-item label="昵称" prop="idCard">
          <el-input v-model="temp.nickName" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleUpdate()"> 更新 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { getUserList, getUserByUsername, resetPassword, resetStatus, addUser, updateUser } from '@/api/user'

const statusOptions = [
  {
    key: '0',
    display_name: '禁用'
  },
  {
    key: '1',
    display_name: '正常'
  }
]

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserTable',
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
      statusOptions,
      statusKeyValue,
      listQuery: {
        username: '',
        page: 1,
        limit: 20
      },
      addDialogVisible: false,
      updateDialogVisible: false,
      temp: {
        username: '',
        mobile: '',
        email: '',
        nickName: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.username !== '') {
        getUserByUsername(this.listQuery.username).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
            this.listLoading = false
          }
        )
        return
      }
      getUserList(this.listQuery.page, this.listQuery.limit).then(
        (response) => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        }
      )
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    refreshList() {
      this.getList()
    },
    handleAddDialog() {
      this.temp.username = ''
      this.temp.mobile = ''
      this.temp.email = ''
      this.temp.nickName = ''
      this.addDialogVisible = true
    },
    resetPassword(username) {
      resetPassword(username)
    },
    resetStatus(username) {
      resetStatus(username)
    },
    handleAdd() {
      const tempData = Object.assign({}, this.temp)
      addUser(tempData).then(
        (r) => {
          if (r.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Add Successfully',
              type: 'success',
              duration: 2000
            })
            this.addDialogVisible = false
            this.handleFilter()
          }
        }
      )
    },
    handleUpdate() {
      const tempData = Object.assign({}, this.temp)
      updateUser(tempData).then(
        (r) => {
          if (r.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.updateDialogVisible = false
            this.refreshList()
          }
        }
      )
    },
    handleUpdateDialog(row) {
      this.temp.username = row.username
      this.temp.mobile = row.mobile
      this.temp.email = row.email
      this.temp.nickName = row.nickName
      this.updateDialogVisible = true
    },
    addRole(username) {
      window.location.href = window.location.origin + '/#/user/role?u=' + username
    }
  }
}
</script>

<style scoped>

</style>
