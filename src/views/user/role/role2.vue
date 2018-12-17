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
          <span>{{ scope.row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色编码" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
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
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button  size="mini" type="success" @click="permission(scope.row, false)">{{ $t('table.permission') }}
          </el-button>
          <el-button size="mini" type="danger" @click="permission(scope.row, true)">取消</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="temp.roleName"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="temp.roleCode"/>
        </el-form-item>
        <el-form-item label="备    注" prop="roleCode">
          <el-input v-model="temp.memo"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible2">
      <el-form label-position="left" label-width="70px" style=" margin-left:50px;">
        <el-form-item label="权限">
          <el-checkbox-group v-model="auth.checkboxes">
            <el-checkbox v-if="!isupdate" v-for="item in temp2" :label="item.permissionId"  >{{item.permissionName}}</el-checkbox>
            <el-checkbox v-if="isupdate" v-for="item in ownerPerm" :label="item.permissionId"  >{{item.permissionName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="!isupdate" type="primary" @click="setAuth">{{ $t('table.confirm') }}</el-button>
        <el-button v-if="isupdate" type="danger" @click="setAuthCancel">取消權限</el-button>
      </div>
    </el-dialog>
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
import * as userApi from '@/api/user2'
import * as permApi from '@/api/perm'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
const Qs = require('qs')

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
      tableKey: 0,
      list: null,
      total: null,
      auth: {
        checkboxes: [],
        roleId: -1,
        prePerm: []
      },
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: undefined
      },
      ownerPerm: [],
      isupdate: false,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        roleName: '',
        roleCode: ''
      },
      temp2: null,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        roleName: [{ required: true, message: '名称是必填项', trigger: 'blur' }],
        roleCode: [{ required: true, message: '编码是必填项', trigger: 'blur' }],
        memo: [{ required: true, message: '备注是必填项', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getAuth()
  },
  methods: {
    wocao (r) {
      return 'wocao_' + r
    },
    permission (row, flag) {
      let data = Object.assign({}, row)
      this.ownerPerm.length = 0
      userApi.getPermByRole({roleId: data.roleId}).then(res=> {
        for (let item of res.data.row) {
          this.auth.checkboxes.push(item.permission_id)
          this.ownerPerm.push({permissionId: item.permission_id, permissionName: item.permission_name})
        }
        this.auth.roleId = data.roleId
        this.auth.prePerm = this.auth.checkboxes
        this.dialogFormVisible2 = true
        this.isupdate = flag
      })
    },
    setAuth () {
      userApi.addPerm({
        ids: this.auth.checkboxes,
        roleId: this.auth.roleId
      },function(params) {
         return Qs.stringify({ids: params.ids,roleId: params.roleId}, {arrayFormat: 'repeat'})
      }).then((res) => { 
        if (res.data.success) {
          this.auth = {
            checkboxes: [],
            roleId: -1,
            prePerm: []
          }
          this.$notify({
            title: '成功',
            message: '授权成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失敗',
            message: '授权失敗',
            type: 'error',
            duration: 2000
          })
        }
        this.dialogFormVisible2 = false 
      },()=>{
        this.$notify({
          title: '失敗',
          message: '授权失敗',
          type: 'error',
          duration: 2000
        })
        this.dialogFormVisible2 = false 
      })
    },
    setAuthCancel () {
      let arr = [];
      for (let item of this.auth.prePerm) {
        if (!this.auth.checkboxes.includes(item)) {
          arr.push(item)
        }
      }
      userApi.delPermByRole({
        ids: arr,
        roleId: this.auth.roleId
      },function(params) {
         return Qs.stringify({ids: params.ids,roleId: params.roleId}, {arrayFormat: 'repeat'})
      }).then((res) => { 
        if (res.data.success) {
          this.auth = {
            checkboxes: [],
            roleId: -1,
            prePerm: []
          }
          this.$notify({
            title: '成功',
            message: '取消成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失敗',
            message: '取消失敗',
            type: 'error',
            duration: 2000
          })
        }
        this.dialogFormVisible2 = false 
      },()=>{
        this.$notify({
          title: '失敗',
          message: '取消失敗',
          type: 'error',
          duration: 2000
        })
        this.dialogFormVisible2 = false 
      })
    },
    getAuth() {
      permApi.getPermList().then(response => {
        this.temp2 = response.data.data.row
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    getList() {
      this.listLoading = true
      this.listQuery.offset = this.listQuery.page - 1
      userApi.getRoleList(this.listQuery).then(response => {
        this.list = response.data.data.rows
        this.total = response.data.data.total
        // Just to simulate the time of the request
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
      this.$confirm('是否要删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (status === 'deleted') {
          userApi.delRole({roleId: row.roleId}).then(()=> {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.list.splice(this.list.findIndex(item => item.roleId === row.roleId), 1)
            row.status = status
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resetTemp() {
      this.temp = {
        roleCode: '',
        roleName: '',
        memo: ''
      }
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
          userApi.addRole(this.temp).then(() => {
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
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          userApi.updateRole(tempData).then(() => {
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
