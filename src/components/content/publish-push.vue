<template>
  <div class="col-md-6">
    <div class="function-list-form-btn">
      <el-dialog title="入口参数设置" :visible.sync="dialogParamsVisible"
                 :show-close=false
                 size="tiny">
        <el-form :model="formInline">
          <el-form-item :label="paramInfo.DisplayText">
          <el-select v-model="selectEntryParam">
            <el-option
              v-for="item in paramOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer form-footer">
          <el-button @click="dialogParamsVisible = false">取 消</el-button>
          <el-button type="primary" @click="setParam">确 定</el-button>
        </div>
      </el-dialog>
      <el-button @click="setParamForm">设置入口参数</el-button>
      <el-button @click="clearParam(0)">清除入口参数</el-button>
      <el-button @click="setFuncPublish">确认发布</el-button>
    </div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="清单名称">
        <el-input v-model="formdata.MENUITEM">
        </el-input>
      </el-form-item>
      <el-form-item label="功能">
        <el-select v-model="formdata.PROGID" filterable placeholder="请选择" @change="selectedChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="(功能名称)">
        <el-input v-model="formdata.PROGNAME"
                  :readonly="true">
        </el-input>
      </el-form-item>
      <el-form-item label="(功能类型)">
        <el-select v-model="formdata.BILLTYPE" :disabled="true">
          <el-option
            v-for="item in billtype"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="(入口参数)">
        <el-input v-model="formdata.ENTRYPARAM"
                  :readonly="true">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { Message } from 'element-ui'
  export default {
    data () {
      return {
        dialogParamsVisible: false,
        select: '',
        formdata: {
          MENUITEM: '',
          PROGID: '',
          PROGNAME: '',
          BILLTYPE: '',
          ENTRYPARAM: '',
          ISVISUAL: false,
          CONDITION: '',
          id: ''
        },
        options: [],
        paramOptions: [],
        formInline: {
          user: '',
          region: ''
        },
        selectEntryParam: '',
        paramInfo: {
          DisplayText: '',
          Name: ''
        },
        billtype: [
          {value: 0, label: '主数据'},
          {value: 1, label: '单据'},
          {value: 2, label: '数据维护功能'},
          {value: 3, label: '自定义功能'},
          {value: 4, label: '报表'},
          {value: 5, label: '日报表'}
        ]
      }
    },
    mounted () {
      this.getSelectField()
    },
    methods: {
      setParam () {
        let entryParam = { ParamStore: {} }
        entryParam.ParamStore[this.paramInfo.Name] = this.selectEntryParam
        this.formdata.ENTRYPARAM = Ext.encode(entryParam)
        this.dialogParamsVisible = false
      },
      getParam (realRelSource, queryString, condition, tableIndex) {
        this.paramOptions.splice(0, this.paramOptions.length)
        Ext.Ajax.request({
          url: '/billSvc/getSelectData',
          jsonData: {
            handle: window.UserHandle,
            relSource: realRelSource,
            query: queryString,
            condition: condition,
            tableIndex: tableIndex
          },
          method: 'POST',
          async: false,
          timeout: 90000000,
          success: (result) => {
            var val = Ext.decode(result.responseText)
            for (var item of val.GetSelectDataResult) {
              const value = item.Id
              const label = item.Id + ',' + item.Name
              this.paramOptions.push({value: value, label: label})
            }
            this.dialogParamsVisible = true
            console.log(this.paramOptions)
          }
        })
      },
      setParamForm () {
//        let param = this.formdata.ENTRYPARAM
        let progId = this.formdata.PROGID
        if (progId !== '') {
          Ext.Ajax.request({
            url: '/billSvc/getEntryParam',
            jsonData: {
              handle: window.UserHandle,
              progId: progId
            },
            method: 'POST',
            async: false,
            timeout: 90000000,
            success: (result) => {
              let returnValue = Ext.decode(result.responseText)
              if (returnValue.GetEntryParamResult !== '') {
                let ret = Ext.decode(returnValue.GetEntryParamResult)
                let temp = ret[0].RelSource.split("'")
                this.paramInfo.DisplayText = ret[0].DisplayText
                this.paramInfo.Name = ret[0].Name
                this.getParam(temp[1], '', '', ret[0].TableIndex)
              } else {
                Message({
                  message: '没有配置入口参数！',
                  type: 'warning'
                })
              }
            }
          })
        } else {
          Message({
            message: '请先选择功能！',
            type: 'warning'
          })
        }
      },
      clearParam (data) {
        if (data === 0) {
          this.formdata.ENTRYPARAM = ''
        }
      },
      setFuncPublish () {
        var funcInfo = Ext.encode(this.formdata)
        Ext.Ajax.request({
          url: '/billSvc/setFuncPublish',
          jsonData: {
            funcInfoJson: funcInfo
          },
          method: 'POST',
          async: false,
          timeout: 90000000,
          success: (response) => {
            let result = Ext.decode(response.responseText)
            let returnValue = Ext.decode(result.SetFuncPublishResult)
            console.log(returnValue)
            if (returnValue === 0) {
              Message({
                message: '发布成功',
                type: 'success'
              })
            } else if (returnValue === 1) {
              Message({
                message: '已发布过相同功能',
                type: 'warning'
              })
            }
          }
        })
      },
      selectedChange (value) {
        const selectFields = 'A.PROGNAME,A.BILLTYPE'
        const condition = 'and A.CANMENU=1'
        const tableIndex = 0
        const realRelSource = 'axp.FuncList'
        Ext.Ajax.request({
          url: '/billSvc/checkFieldValue',
          jsonData: {
            handle: window.UserHandle,
            fields: selectFields,
            relSource: realRelSource,
            curPk: value,
            condition: condition,
            tableIndex: tableIndex
          },
          method: 'POST',
          async: false,
          timeout: 90000000,
          success: (response) => {
            let result = Ext.decode(response.responseText)
            let returnValue = Ext.decode(result.CheckFieldValueResult)
            this.formdata.MENUITEM = returnValue.PROGNAME
            this.formdata.PROGNAME = returnValue.PROGNAME
            this.formdata.BILLTYPE = returnValue.BILLTYPE
          }
        })
      },
      getSelectField () {
        const realRelSource = 'axp.FuncList'
        const queryString = ''
        const condition = 'and A.CANMENU=1'
        const tableIndex = 0
        this.options.splice(0, this.options.length)
        Ext.Ajax.request({
          url: '/billSvc/getSelectData',
          jsonData: {
            handle: window.UserHandle,
            relSource: realRelSource,
            query: queryString,
            condition: condition,
            tableIndex: tableIndex
          },
          method: 'POST',
          async: false,
          timeout: 90000000,
          success: (result) => {
            var val = Ext.decode(result.responseText)
            for (var item of val.GetSelectDataResult) {
              const value = item.Id
              const label = item.Id + ',' + item.Name
              this.options.push({value: value, label: label})
            }
          }
        })
      }
    }
  }
</script>

<style>

</style>

<style scoped>
  .form-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .function-list-layout {
    height: 100%;
  }

  .function-list-form-btn {
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

</style>
