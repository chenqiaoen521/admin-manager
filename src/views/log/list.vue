<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="关键字搜索" v-model="listQuery.keyword" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="listQuery.startTime"
        type="datetime"
        class="filter-item"
        placeholder="选择开始日期"
        @change="transTime($event, 'startTime')"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker
        v-model="listQuery.endTime"
        type="datetime"
        @change="transTime($event, 'endTime')"
        class="filter-item"
        placeholder="选择结束日期"
        align="right"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-select v-model="listQuery.logType" style="width: 160px" class="filter-item" @change="handleFilter">
        <el-option label="全部" :value="undefined"/>
        <el-option v-for="item in typeCol" :key="item.id" :label="item.label" :value="item.id"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="$t('table.id')" type="index" align="center" width="65">
      </el-table-column>
      <el-table-column label="用户IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userIp }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="事件"  align="center">
        <template slot-scope="scope">
           <span> {{ scope.row.logEvent }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="类型" align="center">
        <template slot-scope="scope">
           <span> {{ scope.row.logType | colFilter}} </span>
        </template>
      </el-table-column>
      <el-table-column  label="用户账号" align="center">
        <template slot-scope="scope">
           <span> {{ scope.row.userCode }} </span>
        </template>
      </el-table-column>
      <el-table-column  label="信息" align="center">
        <template slot-scope="scope">
           <span> {{ scope.row.logMessage }} </span>
        </template>
      </el-table-column>
      <el-table-column  label="是否成功" align="center">
        <template slot-scope="scope">
           <el-tag v-if="scope.row.logSucess" type="success">成功</el-tag>
           <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="描述" align="center">
        <template slot-scope="scope">
           <span> {{ scope.row.logDesc }} </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createdDate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.logCreateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
        <el-form-item label="权限类型" prop="columnId">
          <el-select v-model="temp.columnId" placeholder="请选择权限类型">
            <el-option label="客户端功能权限" :value="1"></el-option>
            <el-option label="客户端菜单权限" :value="2"></el-option>
            <el-option label="管理端功能权限" :value="3"></el-option>
            <el-option label="管理端菜单权限" :value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
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
import * as Api from '@/api/log'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime} from '@/utils'



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
    },
    colFilter(val) {
      switch (val) {
        case 1:
          return '增加'
        case 2:
           return '修改'
        case 3:
           return '删除'
        case 4:
           return '查询'
        case 5:
           return '异常'
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date);
          }
        }]
      },
      dialogFormVisible2: false,
      tableKey: 0,
      typeCol: [
        {label: '增加', id: 1},
        {label: '修改', id: 2},
        {label: '删除', id: 3},
        {label: '查询', id: 4},
        {label: '异常', id: 5}
      ],
      list: null,
      total: null, 
      listLoading: true,
      temp2: null,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        logType: undefined,
        endTime: undefined,
        startTime: undefined
      },
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
        ],
        columnId: [
           {required: true, message: '分栏id必填', trigger: 'blur' }
        ]
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
    transTime(e, name) {
      console.log(e)
      this.listQuery[name] = new Date(e).getTime()
    },
    getList() {
      this.listLoading = true
      this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
      Api.logList(this.listQuery).then(response => {
        this.list = response.data.data.rows
        this.total = response.data.data.total
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
        permApi.delPerm({ids: row.permissionId}).then((res)=> {
          this.$message({
            title: '提示',
            message: res.data.message,
            type: (res.data.success ? 'success' : 'error')
          })
          this.list.splice(this.list.findIndex(item => item.permissionId === row.permissionId), 1)
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
          permApi.createPerm(this.temp).then((res) => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: res.data.success ? 'success' : 'error',
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
        const tHeader = ['编码', 'uri', '权限名称', '权限类型']
        const filterVal = ['permissionCode', 'permissionUri', 'permissionName', 'columnId']
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
        if (j === 'columnId') {
          let data = v[j]
          switch (data) {
            case 1:
              return '客户端功能权限'
            case 2:
              return '客户端菜单权限'
              
            case 3:
              return '管理端功能权限'
              
            case 4:
              return '管理端菜单权限'
          }
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
