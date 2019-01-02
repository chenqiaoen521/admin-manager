<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="dept" placeholder="添加一级部门" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="code" placeholder="添加一级部门编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <div class="custom-tree-container">
      <el-tree
        :data="data"
        node-key="departmentId"
        default-expand-all
        :props="defaultProps"
        :expand-on-click-node="false"
        :render-content="renderContent"
        >
      </el-tree>
    </div>
    <el-dialog width="536px" :visible.sync="dialogFormVisible" :title="title">
      <el-form :rules="rules" ref="dataForm"   :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="本门名称" prop="departmentName">
          <el-input v-model="temp.departmentName"/>
        </el-form-item>
        <el-form-item label="本门编号" prop="departmentCode">
          <el-input v-model="temp.departmentCode"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="status===0" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="editData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import * as deptApi from '@/api/dept'

let id = 1000;
export default {
  data() {
    return {
      temp: {},
      title: '添加子部门',
      status: 0,  // 0 添加  1 编辑
      dept: '',
      dialogFormVisible: false,
      code: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'departmentName'
      },
      rules: {
        departmentName: [{ required: true, message: '必填', trigger: 'blur' }],
        departmentCode: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    handleCreate () {
      if (this.dept && this.code) {
        deptApi.createDept({
          "parentId": 0,
          "departmentName": this.dept,
          "departmentCode": this.code,
          "child": 0
        }).then(res => {
          this.dept = ''
          this.code = ''
          this.getTree()
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
         if (valid) {
            deptApi.createDept({
              "parentId": this.temp.parentId,
              "departmentName": this.temp.departmentName,
              "departmentCode": this.temp.departmentCode,
              "child": 0
            }).then(res => {
              this.dialogFormVisible = false
              this.temp = {}
              this.getTree()
            })
         }
      })
    },
    getTree() {
      deptApi.getDeptList().then(res => {
      if (res.data.data.row) {
          this.data = this.treeNodeData(res.data.data.row)
        }
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
            fnodeitem.isMulit = false
          }
        }
        this.findChild(fnodeitem.children, tree, selectFa)
      }
    },
    edit(data) {
      this.title = '编辑子部门'
      this.status = 1
      this.temp = Object.assign({}, data)
      this.dialogFormVisible = true
    },
    editData() {
      this.$refs['dataForm'].validate((valid) => {
         if (valid) {
            deptApi.editDept({
              "parentId": this.temp.parentId,
              "departmentName": this.temp.departmentName,
              "departmentCode": this.temp.departmentCode,
              "departmentId": this.temp.departmentId,
              "child": 0
            }).then(res => {
              this.dialogFormVisible = false
              this.temp = {}
              this.getTree()
            })
         }
      })
    },
    append(data) {
      this.title = '添加子部门'
      this.status = 0
      this.temp.parentId = data.departmentId
      this.dialogFormVisible = true
    },

    remove(node, data) {
      this.$confirm('是否要删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (node.childNodes && node.childNodes.length > 0) {
        this.$alert('该部门不是一个子节点', '警告', {
          type: 'error'
        })
        return
        } else {
          deptApi.delDept({
            ids: data.departmentId
          }).then(res => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.getTree()
            }
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
    renderContent(h, { node, data, store }) {
      let a = node.isLeaf ? 'file' : 'folder'
      return (
        <span class="custom-tree-node">
          <div>
            <svg-icon iconClass={a} />
            <span style={{marginLeft: '3px'}}>{node.label + '_' + data.departmentCode}</span>
          </div>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加子部门</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除部门</el-button>
            <el-button size="mini" type="text" on-click={ () => this.edit(data) }>编辑</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style>
  .custom-tree-container {
    float: left;
    margin-left: 20px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
