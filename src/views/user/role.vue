<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" clearable style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>

    </div>
    <el-container direction="vertical" style="margin: 20px">
      <span style="font-size: 16px;font-weight: 600;">用户基本信息</span>
      <div class="user_info">
        <span class="user_span">用户名：</span>
        <span class="user_span_right">{{ userInfo.username }}</span>
      </div>
      <div class="user_info">
        <span class="user_span">手机号：</span>
        <span class="user_span_right">{{ userInfo.mobile }}</span>
      </div>
      <div class="user_info">
        <span class="user_span">邮箱：</span>
        <span class="user_span_right">{{ userInfo.email }}</span>
      </div>
      <div class="user_info">
        <span class="user_span">昵称：</span>
        <span class="user_span_right">{{ userInfo.nickName }}</span>
      </div>
      <div class="user_info">
        <span class="user_span">创建时间：</span>
        <span class="user_span_right">{{ userInfo.createTime }}</span>
      </div>
    </el-container>

    <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" style="margin-top: 100px" @click="addDialogVisible = true">
      添加角色
    </el-button>
    <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refreshList" />
    <el-table v-loading="listLoading" :data="list" style="width: 800px">
      <el-table-column label="角色名称" width="200px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template v-slot="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200px" fixed="right" class-name="small-padding fixed-width">
        <template v-slot="{ row, $index }">
          <el-button size="mini" type="danger" @click="handleDel($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" center>
      <el-radio v-model="radio" label="admin">admin(管理员)</el-radio>
      <el-radio v-model="radio" label="user">user(房东）</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleAdd()"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getRoleByUsername, addRole, delRole } from '@/api/role'
import { getUserByUsername } from '@/api/user'

export default {
  name: 'Role',
  data() {
    return {
      listLoading: false,
      listQuery: {
        username: ''
      },
      userInfo: {

      },
      list: [],
      addDialogVisible: false,
      radio: 'admin'
    }
  },
  created() {
    const route = this.$route
    if (route.query.u !== undefined) {
      this.listQuery.username = route.query.u
      this.handleFilter()
    }
  },
  methods: {
    handleFilter() {
      this.listLoading = true
      getUserByUsername(this.listQuery.username).then(
        (r) => {
          this.userInfo = r.data.list[0]
          getRoleByUsername(this.userInfo.username).then(
            (r) => {
              this.list = r.data
              this.listLoading = false
            }
          )
        }
      )
    },
    refreshList() {
      this.listLoading = true
      getRoleByUsername(this.userInfo.username).then(
        (r) => {
          this.list = r.data
          this.listLoading = false
        }
      )
    },
    handleAdd() {
      addRole(this.userInfo.username, this.radio)
    },
    handleDel(index, rolName) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRole(this.userInfo.username, rolName).then(
          (response) => {
            this.list.splice(index, 1)
            this.$notify({
              title: response.msg,
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
          }
        )
      })
    }
  }
}
</script>

<style scoped>
.user_span {
  color: #555555;
  font-size: 14px;
}
.user_span_right {
  color: #555555;
  font-size: 14px;
  float: right;
}
.user_info {
  width: 300px;
  margin-top: 15px
}
</style>
