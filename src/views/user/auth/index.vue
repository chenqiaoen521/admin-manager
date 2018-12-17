<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-select v-model="listQuery.type" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.permissionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码" >
        <template slot-scope="scope">
          <span>{{ scope.row.permissionCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="uri" >
        <template slot-scope="scope">
          <span> {{ scope.row.permissionUri }} </span>
        </template>
      </el-table-column>
      <el-table-column  label="权限名称" >
        <template slot-scope="scope">
           <span> {{ scope.row.permissionName }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="分栏id">
        <template slot-scope="scope">
           <span> {{ scope.row.columnId }} </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createdDate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updatedDate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="temp.permissionName"/>
        </el-form-item>
        <el-form-item label="权限编码" prop="permissionCode">
          <el-input v-model="temp.permissionCode"/>
        </el-form-item>
        <el-form-item label="权限uri" prop="permissionUri">
          <el-input v-model="temp.permissionUri"/>
        </el-form-item>
        <el-form-item label="分栏id" prop="columnId">
          <el-input v-model="temp.columnId"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

   <!--  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
     <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
       <el-radio-group v-model="temp.yd_role_id">
         <el-radio v-for="item in temp2" :label="item.id">{{item.name}}</el-radio>
       </el-radio-group>
   </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisible2 = false">{{ $t('table.cancel') }}</el-button>
       <el-button type="primary" @click="updateRole">{{ $t('table.confirm') }}</el-button>
     </div>
   </el-dialog> -->
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import * as permApi from '@/api/perm'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime} from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      dialogFormVisible2: false,
      tableKey: 0,
      list: null,
      total: null, 
      listLoading: true,
      temp2: null,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        permissionUri: '',
        permissionName: '',
        permissionCode: '',
        columnId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        permissionName: [
          { required: true, message: '权限名称必填', trigger: 'blur' }
        ],
        permissionCode: [
          { required: true, message: '权限编码必填', trigger: 'blur' }
        ],
        permissionUri: [
           { required: true, message: '权限uri必填', trigger: 'blur' }
        ]/*,
        columnId: [
           { required: true, message: '分栏id必填', trigger: 'blur' },
           { type: 'number', message: 'ID必须为数字值'}
        ]*/
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()

  },
  methods: {
    handleuserole (row) {
      this.dialogFormVisible2 = true
      this.temp = row
    },
    updateStat ({id, status} = res) {
      userApi.updateStatus({id, status})
    },
    getList() {
      this.listLoading = true
      this.listQuery.offset = this.listQuery.page - 1
      permApi.getPermList(this.listQuery).then(response => {
        this.list = response.data.data.row
        this.total = response.data.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      if (status === 'deleted') {
        permApi.delPerm({permissionId: row.permissionId}).then(()=> {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.list.splice(this.list.findIndex(item => item.id === row.id), 1)
          row.status = status
        })
      }
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          permApi.createPerm(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.temp.createAt = new Date()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          permApi.editPerm(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateRole() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          userApi.updateroleID(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible2 = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
