<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加用户</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="deptAdd">添加部门</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.username')">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号">
        <template slot-scope="scope">
          <span> {{ scope.row.userCode }} </span>
        </template>
      </el-table-column>
      <el-table-column label="卡号">
        <template slot-scope="scope">
          <span> {{ scope.row.idcard }} </span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱">
        <template slot-scope="scope">
          <span> {{ scope.row.email }} </span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码">
        <template slot-scope="scope">
          <span> {{ scope.row.phone }} </span>
        </template>
      </el-table-column>
      <el-table-column label="是否在线">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.online === 0 ? '离线' : '在线'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.locked === 0 ? 'success' : 'danger'">{{scope.row.locked | parseStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否记住我">
        <template slot-scope="scope">
          <el-tag type="info">{{scope.row.rememberMe === 0 ? '不记住' : '记住我'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.createdDate')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.updatedDate')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户到期时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.expireDateline | parseTime('{y}-{m}-{d} {h}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button  size="mini" type="success" @click="handleuserole(scope.row)">{{ $t('table.userole') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog width="550px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.username')" prop="userName">
          <el-input :disabled="dialogStatus === 'update'" v-model="temp.userName"/>
        </el-form-item>
        <el-form-item :label="$t('table.password')" prop="password">
          <el-input type="password" v-model="temp.password"/>
        </el-form-item>
        <el-form-item :label="$t('table.relpassword')" prop="relpassword">
          <el-input type="password" v-model="temp.relpassword"/>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="用户编码" prop="userCode">
          <el-input v-model="temp.userCode"/>
        </el-form-item>
        <el-form-item label="用户卡号" prop="idcard">
          <el-input v-model="temp.idcard"/>
        </el-form-item>
        <el-form-item label="是否锁定" prop="locked">
          <el-switch v-model="temp.locked"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog width="450px" title="添加部门" :visible.sync="deptVisible">
      部门名称：<el-input v-model="treeinputdata" placeholder="请选择下面的部门" disabled class="inputtree-input"></el-input>
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
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible2">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-radio-group v-model="temp.yd_role_id">
          <el-radio v-for="item in temp2" :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateRole">{{ $t('table.confirm') }}</el-button>
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
import * as deptApi from '@/api/dept'
import * as userApi from '@/api/user2'
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
  name: 'role',
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
      treedata: [],
      treeinputdata: '',
      dialogFormVisible2: false,
      deptVisible: false,
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
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        userName: '',
        password: '',
        relpassword: '',
        idcard: '',
        phone: '',
        userCode: '',
        locked: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        userName: [
          { required: true, message: '用户名是必填项', trigger: 'blur' }
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
    deptAdd () {
      this.getTree().then(res => {
        if (res) {
          this.treedata = res
        }
      })
      this.deptVisible = true
    },
    clicktree (e) {
      this.treeinputdata = e.departmentName
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
      console.log(val)
    },
    handleuserole (row) {
      this.dialogFormVisible2 = true
      this.temp = Object.assign({}, row)
    },
    getList() {
      this.listLoading = true
      this.listQuery.offset = this.listQuery.page - 1
      userApi.getUserList(this.listQuery).then(response => {
        this.list = response.data.data.rows
        this.total = response.data.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    getRoles () {
      userApi.getRoleList().then(response => {
        this.temp2 = response.data.data
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
          userApi.delUser({ids: row.id}).then(()=> {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.list.splice(this.list.findIndex(item => item.id === row.id), 1)
            row.status = status
          })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
      })
    },
    resetTemp() {
      this.temp = {
        userName: '',
        password: '',
        relpassword: '',
        idcard: '',
        phone: '',
        userCode: '',
        locked: false
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
          this.temp.locked ? this.temp.locked = 0 : this.temp.locked = 1
          delete this.temp.relpassword
          userApi.addUser(this.temp).then(() => {
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
      this.temp.relpassword = this.temp.password
      this.temp.locked === 0 ?  this.temp.locked = false :  this.temp.locked = true
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
          tempData.locked ? tempData.locked = 1 : tempData.locked = 0
          userApi.updatePass(tempData).then(() => {
            for (const v of this.list) {
              if (v.userId === tempData.userId) {
                const index = this.list.indexOf(v)
                const obj = Object.assign({}, this.list[index], tempData)
                this.list.splice(index, 1, obj)
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