<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="请输入关键字" v-model="listQuery.keyword" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width:50%;">
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceGroupId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备组名称" min-width="150px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.deviceGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button  size="mini" type="success"   style="padding:7px 6px;"  @click="handleuserole(scope.row, false)">查看角色
          </el-button>
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
        <el-form-item label="设备组名称" prop="deviceGroupName">
          <el-input v-model="temp.deviceGroupName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog label="角色列表" :visible.sync="dialogFormVisible2">
      <el-form label-position="left" label-width="90px" style="margin-left:50px;">
        <el-checkbox-group v-model="userrole.ids">
          <el-checkbox  v-for="item in temp2" :label="item.roleId">{{item.roleName}}</el-checkbox>
        </el-checkbox-group>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateRole" >编辑</el-button>
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
import * as deviceApi from '@/api/device'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
const Qs = require('qs')

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
      activeName: '',
      tableKey: 0,
      list: null,
      total: null,
      temp3: [],
      userrole: {
        ids: [],
        userId: -1,
        preIds: []
      },
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        deviceGroupId: '',
        deviceGroupName: ''
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
        deviceGroupName: [{ required: true, message: '名称是必填项', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  watch: {
    activeName (newV, old) {
      if (newV === old) {
        return
      }
      if (!newV) return
      this.temp3 = this.temp2.filter(item => {
        return item.columnId == newV
      })
    }
  },
  methods: {
    getRoles () {
      userApi.getRoleList().then(response => {
        this.temp2 = response.data.data.rows
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    wocao (r) {
      return 'wocao_' + r
    },
    handleuserole (row, flag) {
      this.temp = Object.assign({}, row)
      deviceApi.devicegetRole({deviceGroupId: this.temp.deviceGroupId}).then(res=> {
        let rows
        if (!res.data.success) {
          rows = []
        } else {
          rows = Array.isArray(res.data.data) ? res.data.data : []
        }
        let arr = []
        for (let item of rows) {
          arr.push(item.roleId)
        }
        this.userrole.userId = row.deviceGroupId
        this.userrole.ids = arr
        this.userrole.preIds = arr
        this.dialogFormVisible2 = true
      })
    },
    setAuth () {
      userApi.addPerm({
        permissionIds: this.auth.checkboxes.join(','),
        roleId: this.auth.roleId
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
    getList() {
      this.listLoading = true
      this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
      deviceApi.deviceList(this.listQuery).then(response => {
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
    updateRole() {
      deviceApi.deviceAddRole({
        roleIds: this.userrole.ids.join(','),
        deviceGroupId: this.userrole.userId
      }).then((res) => { 
          this.userrole = {
            ids: [],
            id: -1,
            preIds: []
          }
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: res.data.success ? 'success' : 'error',
            duration: 2000
          })
        
        this.dialogFormVisible2 = false 
      },()=>{
        this.$notify({
          title: '失敗',
          message: '分角色失敗',
          type: 'error',
          duration: 2000
        })
        this.dialogFormVisible2 = false 
      })
      /*const tempData = Object.assign({}, this.temp)
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
      })*/
    },
    handleModifyStatus(row, status) {
      this.$confirm('是否要删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (status === 'deleted') {
          deviceApi.deviceDel({ids: row.deviceGroupId}).then(()=> {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.list.splice(this.list.findIndex(item => item.deviceGroupId === row.deviceGroupId), 1)
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
        deviceGroupName: ''
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
          deviceApi.deviceCreate(this.temp).then(() => {
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
          tempData.updateTime = new Date().getTime()
          deviceApi.deviceUpdate(tempData).then(() => {
            for (const v of this.list) {
              if (v.deviceGroupId === this.temp.deviceGroupId) {
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
<style>
  .ebox-my {
    width: 120px;
    margin-left: 0 !important;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
  }
</style>
