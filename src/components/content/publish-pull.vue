<template>
  <div style="height: 100%">
    <div>
      <el-table
        :data="funcinfo"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="MenuItem"
          label="清单名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="ProgName"
          label="功能名称"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="ProgId"
          label="功能标识"
          width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          width="150"
          label="功能类型">
          <template scope="scope">
            <el-select v-model="scope.row.BillType"  :disabled="true">
              <el-option
                v-for="item in billtype"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="EntryParam"
          label="入口参数"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="PublishDate"
          label="发布日期"
          width="150"
          show-overflow-tooltip>
          <template scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.PublishDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              size="small"
              @click="handleLoad(scope.$index, scope.row)">加载</el-button>
            <el-dialog title="功能清单" :visible.sync="dialogTableVisible" :before-close="close">
              <div style="height:350px;overflow:auto;">
                <!--<el-button @click="savaMenuData">确认加载</el-button>-->
                <el-tree :data="treedata"
                         :props="defaultProps"
                         ref="functree"
                         node-key="id"
                         :highlight-current="true"
                         :render-content="renderContent"
                         :expand-on-click-node="false"
                         accordion>
                </el-tree>
              </div>
            </el-dialog>
            <el-button
              v-if="isAdmin"
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>
  import { Message } from 'element-ui'
  export default {
    data () {
      return {
        isShow: false,
        funcinfo: [],
        loadList: {},
        dialogTableVisible: false,
        treedata: [],
        defaultProps: {
          children: 'children',
          label: 'MENUITEM'
        },
        billtype: [
          {value: 0, label: '主数据'},
          {value: 1, label: '单据'},
          {value: 2, label: '数据维护功能'},
          {value: 3, label: '自定义功能'},
          {value: 4, label: '报表'},
          {value: 5, label: '日报表'}
        ],
        root: [],
        isAdmin: false
      }
    },
    computed: {
    },
    mounted () {
      this.getFuncList()
      this.checkAdmin()
    },
    methods: {
      checkAdmin () {
        Ext.Ajax.request({
          url: '/billSvc/checkAdmin',
          jsonData: {
            handle: window.UserHandle
          },
          method: 'POST',
          async: false,
          success: (response) => {
            let result = Ext.decode(response.responseText)
            this.isAdmin = result.CheckAdminResult
          },
          failure: function () {
            Message.error('用户句柄无效')
            window.DesktopApp.router.push('/')
          }
        })
      },
      getMenuData () {
        this.treedata.splice(0, this.treedata.length)
//        this.root.splice(0, this.root.length)
        var rootData
        Ext.Ajax.request({
          url: '/fileTranSvc/loadMenuSetting',
          jsonData: {
            handle: window.UserHandle,
            setting: true
          },
          method: 'POST',
          async: false,
          success: (response) => {
            var temp = Ext.decode(response.responseText)
            var menu = temp['LoadMenuSettingResult']
            if (menu !== '') {
              rootData = Ext.decode(menu)
              this.root = (Ext.decode(menu))
            }
          },
          failure: function () {
            Message.error('载入失败！返回登录页！')
            window.DesktopApp.router.push('/')
          }
        })
        for (var item of rootData.children) {
          this.treedata.push(item)
        }
      },
      savaMenuData () {
        delete this.root.children
        this.root.children = this.treedata
        var json = Ext.encode(this.root)
        Ext.Ajax.request({
          url: 'fileTranSvc/saveMenuSetting',
          jsonData: {
            handle: window.UserHandle,
            menuData: json
          },
          method: 'POST',
          success: (response) => {
            Message({
              message: '保存成功',
              type: 'success'
            })
            this.dialogTableVisible = false
          },
          failure: (response) => {
            Message.error('保存失败')
            this.dialogTableVisible = false
          }
        })
      },
      getFuncList () {
        this.funcinfo.splice(0, this.funcinfo.length)
        Ext.Ajax.request({
          url: '/billSvc/getPublishFunc',
          method: 'POST',
          async: false,
          timeout: 90000000,
          success: (response) => {
            let result = Ext.decode(response.responseText)
            let returnValue = result.GetPublishFuncResult
            for (var item of returnValue) {
              this.funcinfo.push(item)
            }
          }
        })
      },
      close () {
        this.dialogTableVisible = false
      },
      handleLoad (index, data) {
        this.getMenuData()
        this.dialogTableVisible = true
        this.loadList = data
      },
      handleDelete (index, data) {
        Ext.Ajax.request({
          url: '/billSvc/deleteFuncPublish',
          jsonData: {
            handle: window.UserHandle,
            ProgId: data.ProgId,
            EntryParam: data.EntryParam
          },
          method: 'POST',
          async: false,
          success: (response) => {
            Message({
              message: '刪除成功',
              type: 'success'
            })
          },
          failure: function () {
            Message.error('用户句柄无效')
            window.DesktopApp.router.push('/')
          }
        })
        this.funcinfo.splice(index, 1)
      },
      append (store, data) {
        if (data.children !== undefined) {
          if (data.children.length > 0) {
            data.children.push({
              id: Ax.utils.LibVclSystemUtils.newGuid(),
              MENUITEM: this.loadList.MenuItem,
              PROGID: this.loadList.ProgId,
              PROGNAME: this.loadList.ProgName,
              BILLTYPE: this.loadList.BillType,
              ENTRYPARAM: this.loadList.EntryParam,
              ISVISUAL: false,
              CONDITION: '',
              leaf: true
            })
          }
          this.savaMenuData()
        } else {
          Message({
            message: '该节点不能添加子节点',
            type: 'warning'
          })
        }
      },
      renderContent (h, { node, data, store }) {
        return (
          <span>
          <span>
          <span>{node.label}</span>
        </span>
        <span style="float: right; margin-right: 20px">
          <el-button icon="plus" size="mini" on-click={ () => this.append(store, data) }></el-button>
        </span>
        </span>)
      }
    }
  }
</script>
<style scoped>

</style>
