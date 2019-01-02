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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="deptAdd">添加部门</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="datatable"
      border
      fit
      @selection-change="handleSelectionChange"
      highlight-current-row
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.username')">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.password')">
        <template slot-scope="scope">
          <span> ********* </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.flag ? 'success' : 'danger'">{{scope.row.status | parseStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="所属部门">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击删除" placement="right">
            <el-button v-if="scope.row.departmentName && scope.row.departmentId" @click="delDept(scope.row, scope.row.id, scope.row.departmentId)" size="mini" type="danger" round>{{ scope.row.departmentName }}</el-button>
          </el-tooltip>
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
      <el-table-column :label="$t('table.actions')" align="center" width="450" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>是否禁用</span>
          <el-switch
            v-model="scope.row.flag"
            active-color="#13ce66"
            @change="updateStat(scope.row)"
            inactive-color="#ff4949">
          </el-switch>&nbsp;&nbsp;&nbsp;
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button  size="mini" type="success"   style="padding:7px 6px;"  @click="handleuserole(scope.row, false)">查看角色
          </el-button>
          <el-button size="mini" type="danger"  style="padding:7px 6px;"  @click="handleuserole(scope.row, true)">取消角色
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input :disabled="dialogStatus === 'update'" v-model="temp.username"/>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item :label="$t('table.relpassword')" prop="relpassword">
          <el-input v-model="temp.relpassword"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog width="450px" title="添加部门" :visible.sync="deptVisible">
      部门名称：<el-input v-model="treeinputdata.departmentName" placeholder="请选择下面的部门" disabled class="inputtree-input"></el-input>
      <div class="custom-tree-container">
        <el-tree
          :data="treedata"
          node-key="departmentId"
          :props="defaultProps"
          @node-click="clicktree"
          :expand-on-click-node="false"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deptVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button  type="primary" @click="confirmDept">{{ $t('table.confirm') }}</el-button>
        <!-- <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button> -->
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
      <el-form label-position="left" label-width="90px" style="margin-left:50px;">
        <el-checkbox-group v-model="userrole.ids">
          <el-checkbox v-if="isupdate" v-for="item in ownerRole" :label="item.roleId">{{item.roleName}}</el-checkbox>
          <el-checkbox v-if="!isupdate" v-for="item in temp2" :label="item.roleId">{{item.roleName}}</el-checkbox>
        </el-checkbox-group>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="!isupdate" type="primary" @click="updateRole">分配角色</el-button>
        <el-button v-if="isupdate" type="danger" @click="setRoleCancel">取消角色</el-button>
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
import * as userApi from '@/api/user'
import * as user2Api from '@/api/user2'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime} from '@/utils'
import * as deptApi from '@/api/dept'
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
    var validateUsername =async (rule, value, callback) => {
      let reg = /^[a-z][a-z 0-9]{1,}$/i
      if (this.dialogStatus === 'update') {
        callback()
      } else {
        if (reg.test(value)) {
          await userApi.findUser({username: value}).then(res => {
            if (res.data.code === 1) {
              callback()
            } else {
              callback(new Error('用户名已经存在了'))
            }
          })
        } else {
          callback(new Error('密码格式为字母加数字'))
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value !== this.$refs.dataForm.model.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible2: false,
      tableKey: 0,
      treeinputdata: '',
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      treedata: [],
      deptVisible: false,
      list: null,
      datatable: [],
      total: null,
      isupdate: false,
      ownerRole: [],
      userrole: {
        ids: [],
        id: -1,
        preIds: []
      },
      listLoading: true,
      temp2: null,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        username: '',
        password: '',
        relpassword: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [
          { required: true, message: '用户名是必填项', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码是必填项', trigger: 'blur' }
        ],
        relpassword: [
           { required: true, message: '请确认密码', trigger: 'blur' },
           { validator: validatePass, trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    delDept(row, userId, departmentId) {
      user2Api.delDeptByUser({
        userId,
        departmentId
      }).then(res => {
        row.departmentId = ''
        row.departmentName = ''
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      }, err => {
         this.$notify({
          title: '失败',
          message: err,
          type: 'error',
          duration: 2000
        }) 
      })
    },
    confirmDept() {
      user2Api.addDeptByUser({
        departmentId: this.treeinputdata.departmentId,
        userIds: this.selectRows.map(item => item.id )
      },function(params) {
         return Qs.stringify({userIds: params.userIds,departmentId: params.departmentId}, {arrayFormat: 'repeat'})
      }).then(res => {
        this.deptVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }, err => {
        this.deptVisible = false
        this.$notify({
          title: '失败',
          message: err,
          type: 'error',
          duration: 2000
        })
      })
    },
    deptAdd () {
      if (!this.selectRows || !this.selectRows.length) {
        this.$message({
          message: '没有选中任何一个用户',
          type: 'warning'
        })
        return
      } else {
        let flag = false
        for (let item of this.selectRows) {
          if (item.departmentName && item.departmentName.length > 0) {
            flag = true
          }
        }
        if (flag) {
          this.$message({
            message: '选择的用户已经有部门了，请先删除部门',
            type: 'warning'
          })
          return
        }
      }
      this.getTree().then(res => {
        if (res) {
          this.treedata = res
        }
      })
      this.deptVisible = true
    },
    clicktree (e) {
      this.treeinputdata = e
    },
    getTree() {
      return deptApi.getDeptList().then(res => {
      if (res.data.data.row) {
          return this.treeNodeData(res.data.data.row)
        } else {
          return false
        }
      }).catch(err => {
        return false
      })
    },
    treeNodeData (tree) {
      let fNodes = []
      let lastTree = []
      for (let item of tree) {
        if (item.parentId === 0) {
          fNodes.push(item)
        } else {
          lastTree.push(item)
        }
      }
      this.findChild(fNodes, lastTree, false, false)
      return fNodes
    },
    findChild (fnode, tree, selectFa, isMulit) {
      for (let fnodeitem of fnode) {
        fnodeitem.children = []
        for (let treeitem of tree) {
          if (fnodeitem.departmentId === treeitem.parentId) {
            fnodeitem.children.push(treeitem)
          }
        }
        /*if (fnodeitem.children.length === 0) {
          return
        }*/
        if (selectFa) {
          if (!isMulit) {
            fnodeitem.disabled = selectFa
          } else {
            fnodeitem.isMulit = true
          }
        }
        this.findChild(fnodeitem.children, tree, selectFa)
      }
    },
    handleSelectionChange (val) {
      this.selectRows = val
    },
    handleuserole (row, flag) {
      this.ownerRole.length = 0
      this.temp = Object.assign({}, row)
      user2Api.getUserByRole({id: this.temp.id}).then(res=> {
        this.dialogFormVisible2 = true
        let arr = []
        for (let item of res.data.row) {
          arr.push(item.role_id)
          this.ownerRole.push({roleId: item.role_id, roleName: item.role_name})
        }
        this.userrole.id = row.id
        this.userrole.ids = arr
        this.userrole.preIds = arr
        this.dialogFormVisible2 = true
        this.isupdate = flag
      })
    },
    setRoleCancel () {
      let arr = [];
      for (let item of this.userrole.preIds) {
        if (!this.userrole.ids.includes(item)) {
          arr.push(item)
        }
      }
      user2Api.delRoleByUser({
        ids: arr,
        id: this.userrole.id
      },function(params) {
         return Qs.stringify({ids: params.ids,id: params.id}, {arrayFormat: 'repeat'})
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
    updateStat ({id, status, flag} = res) {
      flag = !flag
      userApi.updateStatus({id, status})
    },
    getList() {
      this.listLoading = true
      userApi.getUserList(this.listQuery).then(response => {
        for (let i of response.data.data) {
          i.flag = !!i.status
        }
        this.datatable = response.data.data
        this.total = response.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    getRoles () {
      user2Api.getRoleList().then(response => {
        this.temp2 = response.data.data.rows
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
          userApi.delUser({ids: row.userId}).then(()=> {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.datatable.splice(this.datatable.findIndex(item => item.userId === row.userId), 1)
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
          userApi.addUser(this.temp).then(() => {
            this.datatable.unshift(this.temp)
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
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          userApi.updatePass(tempData).then(() => {
            for (const v of this.datatable) {
              if (v.id === this.temp.id) {
                const index = this.datatable.indexOf(v)
                this.datatable.splice(index, 1, this.temp)
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
      user2Api.userAddRole({
        ids: this.userrole.ids,
        id: this.userrole.id
      },function(params) {
         return Qs.stringify({ids: params.ids,id: params.id}, {arrayFormat: 'repeat'})
      }).then((res) => { 
        if (res.data.success) {
          this.userrole = {
            ids: [],
            id: -1,
            preIds: []
          }
          this.$notify({
            title: '成功',
            message: '分角色成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失敗',
            message: '分角色失敗',
            type: 'error',
            duration: 2000
          })
        }
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
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.datatable.indexOf(row)
      this.datatable.splice(index, 1)
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
        const data = this.formatJson(filterVal, this.datatable)
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
<style>
  .custom-tree-container {
    float: left;
    min-width: 150px;
    margin-left: 75px;
    width: 310px;
    height: 250px;
    overflow: auto;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .inputtree-input{
    margin-bottom: 2px;
    width: 322px;
  }
</style>
