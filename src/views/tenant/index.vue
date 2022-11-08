<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="姓名" clearable style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
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
      <el-table-column label="id" align="center" min-width="100px">
        <template v-slot="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="150px">
        <template v-slot="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="180px">
        <template v-slot="{ row }">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" align="center" min-width="200px">
        <template v-slot="{ row }">
          <span>{{ row.idcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160px" align="center">
        <template v-slot="{row}">
          <span>{{ row.creatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" fixed="right" class-name="small-padding fixed-width">
        <template v-slot="{ row, $index }">
          <el-button size="mini" type="primary" @click="handleUpdateDialog(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDeleteDialog(row.id,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="编辑" :visible.sync="updateDialogVisible" width="30%" center>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="ID" prop="id">
          <el-input v-model="temp.id" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" clearable />
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="temp.idCard" placeholder="身份证为空则不修改" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加" :visible.sync="addDialogVisible" width="30%" center>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left: 50px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" clearable />
        </el-form-item>
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="temp.idCard" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="handleAdd()"> 提交 </el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span>确定要删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { add, update, deleteById, list, listByDesc, listByName } from '@/api/tenant'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'

export default {
  name: 'TenantTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        sort: 'asc'
      },
      temp: {
        id: undefined,
        name: undefined,
        mobile: undefined,
        idCard: undefined
      },
      delTemp: {
        id: undefined,
        index: 0
      },
      sortOptions: [{ label: 'Ascending', key: 'asc' }, { label: 'Descending', key: 'desc' }],
      updateDialogVisible: false,
      addDialogVisible: false,
      deleteDialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.name !== '') {
        listByName(this.listQuery.name, this.listQuery.page, this.listQuery.limit).then(
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
      if (this.listQuery.sort === 'desc') {
        listByDesc(this.listQuery.page, this.listQuery.limit).then(
          (response) => {
            this.list = response.data.list
            this.total = response.data.total
          }
        )
        this.listLoading = false
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    refreshList() {
      this.getList()
    },
    handleUpdateDialog(row) {
      this.updateDialogVisible = true
      this.temp.id = row.id
      this.temp.mobile = row.mobile
      this.temp.name = row.name
      this.temp.idCard = ''
    },
    handleUpdate() {
      const tempData = Object.assign({}, this.temp)
      update(tempData).then(
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
              message: response.msg,
              duration: 2000
            })
          }
        }
      )
    },
    handleAddDialog() {
      this.addDialogVisible = true
      this.temp.id = ''
      this.temp.mobile = ''
      this.temp.name = ''
      this.temp.idCard = ''
    },
    handleAdd() {
      const tempData = Object.assign({}, this.temp)
      add(tempData).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Add Successfully',
              type: 'success',
              duration: 2000
            })
            this.addDialogVisible = false
          } else {
            this.$notify.error({
              title: 'Fail',
              message: response.msg,
              duration: 2000
            })
          }
        }
      )
    },
    handleDelete() {
      this.deleteDialogVisible = false
      this.listLoading = true
      deleteById(this.delTemp.id).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.listLoading = false
            this.list.splice(this.delTemp.index, 1)
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
    handleDeleteDialog(id, index) {
      this.deleteDialogVisible = true
      this.delTemp.id = id
      this.delTemp.index = index
    }
  }
}
</script>

<style scoped>

</style>
