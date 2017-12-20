/**
 * Created by Administrator on 2017/3/14.
 */
import {BillTypeEnum} from './ext-enums'
import * as api from '../../../api'
class ContentLayout {
  static getControl (el) {
    const panel = Ext.create('Container.tab.Panel', {
      containerpanel: true,
      renderTo: el,
      height: '100%',
      width: '100%',
      autoScroll: false
    })
    return panel
  }
}
export {ContentLayout}
/* 定义主页面中间tabPanel容器 */
Ext.define('Container.tab.Panel', {
  extend: 'Ext.tab.Panel',
  requires: [
    'Ext.data.TreeStore',
    'Ext.layout.container.Accordion',
    'Ext.toolbar.Spacer',
    'Ext.data.ArrayStore',
    'Ext.util.Format',
    'Ext.grid.Panel',
    'Ext.grid.RowNumberer'
  ],
  title: '',
  iconCls: '',
  needTabPanel: true,
  itemClick (record) {
    const billType = record.BILLTYPE
    const progId = record.PROGID
    const text = record.MENUITEM
    const isVisual = record.ISVISUAL
    let canUseFunc = null
    if (progId) {
      canUseFunc = api.bill.canUseFunc(progId)
    }
    if (!progId) {
      return
    }
    if (!canUseFunc) {
      alert('没有当前功能的使用权限。')
      return
    }
    switch (billType) {
      case BillTypeEnum.Master:
      case BillTypeEnum.Bill:
        this.createListing(record)
        break
      case BillTypeEnum.Grid:
        if (isVisual) {
          Ax.utils.LibVclSystemUtils.openVisual(progId, text, undefined, record.CONDITION)
        } else {
          Ax.utils.LibVclSystemUtils.openGrid(progId, text, undefined)
        }
        break
      case BillTypeEnum.DataFunc:
        Ax.utils.LibVclSystemUtils.openDataFunc(progId, text, undefined)
        break
      case BillTypeEnum.DailyRpt:
        Ax.utils.LibVclSystemUtils.openDailyRpt(progId, text, undefined)
        break
      case BillTypeEnum.Rpt:
        Ax.utils.LibVclSystemUtils.openRpt(progId, text, undefined)
        break
      default:
        break
    }
  },
  createListing: function (record) {
    var me = this
    var entryParam = ''
    if (record.ENTRYPARAM !== '') {
      var jsonString = JSON.stringify(Ext.decode(record.ENTRYPARAM).ParamStore)
      jsonString = jsonString.substring(jsonString.indexOf(':') + 1, jsonString.indexOf('}'))
      var temp = jsonString.split(',')
      for (var i = 0; i < temp.length; i++) {
        entryParam = entryParam + temp[i].substring(temp[i].indexOf(':') + 1)
      }
    }
    var tabId = record['PROGID'].replace('.', '') + entryParam.replace(new RegExp('"', 'gm'), '')
    var displayText = record.MENUITEM
    var tab = me.items.get(tabId)
    if (tab) {
      tab.show()
    } else {
      var filterStore = Ext.create('Ext.data.Store', {
        fields: ['key', 'value'],
        data: [{key: 'all', value: '无'}],
        proxy: {
          type: 'memory',
          reader: {
            type: 'json'
          }
        }
      })
      var compareStore = Ext.create('Ext.data.Store', {
        fields: ['key', 'value'],
        data: [{key: 0, value: '包含'},
          {key: 1, value: '等于'},
          {key: 2, value: '大于等于'},
          {key: 3, value: '小于等于'},
          {key: 4, value: '大于'},
          {key: 5, value: '小于'}]
      })
      var filterCbo = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: '字段',
        labelAlign: 'right',
        labelWidth: 60,
        margin: '0 2 2 2',
        flex: 1,
        queryMode: 'local',
        displayField: 'value',
        valueField: 'key',
        store: filterStore,
        editable: false,
        value: 'all'
      })
      var compareCbo = Ext.create('Ext.form.field.ComboBox', {
        labelWidth: 60,
        labelAlign: 'right',
        margin: '0 2 2 2',
        fieldLabel: '比较符',
        flex: 1,
        displayField: 'value',
        queryMode: 'local',
        valueField: 'key',
        store: compareStore,
        editable: false,
        value: 0
      })
      var compareTxt = Ext.create('Ext.form.field.Text', {
        labelWidth: 60,
        labelAlign: 'right',
        margin: '0 2 2 2',
        flex: 2
      })
      var dateStore = Ext.create('Ext.data.Store', {
        fields: ['key', 'value'],
        data: [{key: 0, value: '无'},
          {key: 1, value: '近一周'},
          {key: 2, value: '近一月'},
          {key: 3, value: '近三月'}]
      })
      var dateCbo = Ext.create('Ext.form.field.ComboBox', {
        labelWidth: 60,
        labelAlign: 'right',
        margin: '0 2 2 2',
        fieldLabel: '时间',
        flex: 1,
        displayField: 'value',
        queryMode: 'local',
        valueField: 'key',
        store: dateStore,
        editable: false,
        value: 0
      })
      var getSelectPanel = function () {
        return Ext.create('Ext.form.Panel', {
          layout: {type: 'vbox', align: 'stretch'},
          items: [{
            xtype: 'fieldset',
            layout: {type: 'hbox', align: 'stretch'},
            border: false,
            items: [filterCbo, compareCbo, compareTxt, dateCbo]
          }]
        })
      }
      var filterFun = Ax.utils.LibQuickSelectBuilder.createSelectBar(record.BILLTYPE)
      var listingData
      var listingLoadData = []
      var pageSize = 50// 每页多少条
      var allPageCount = 0
      var listingLength = 0
      var pageCount = 1
      var getBillListing = function (func, queryFields) {
        var filter = func()
        var fieldName = filterCbo.getValue()
        if (fieldName == 'all') { fieldName = '' }
        Ext.Ajax.request({
          url: 'billSvc/getBillListing',
          method: 'POST',
          jsonData: {
            listingQuery: {
              Handle: UserHandle,
              ProgId: record.PROGID,
              TimeFilter: dateCbo.getValue(),
              Filter: filter,
              EntryParam: record.ENTRYPARAM,
              Condition: { QueryFields: queryFields },
              PageSize: pageSize
            }
          },
          async: false,
          timeout: 90000000,
          success: function (response) {
            var ret = Ext.decode(response.responseText)
            listingData = Ext.decode(ret.GetBillListingResult)
            listingLoadData = listingData.Data
            var filterField = Ext.decode(listingData.FilterField)
            if (filterField.length > 0) { filterCbo.store.loadData(filterField, true) }
          }
        })
      }
      getBillListing(filterFun[1])
      var listingStore = Ext.create('Ext.data.Store', {
        fields: Ext.decode(listingData.Fields),
        proxy: {
          type: 'memory',
          enablePaging: true,
          reader: {
            type: 'json'
          }
        },
        pageSize: pageSize,
        data: listingLoadData
      })
      var gridPanel = Ext.create('Ext.grid.Panel', {
        pageCount: 1,
        pageSize: pageSize,
        flex: 1,
        store: listingStore,
        autoScroll: true,
        Pks: listingData.Pk,
        selType: 'checkboxmodel',
        multiSelect: true,
        columns: Ext.decode(listingData.Columns),
        plugins: 'gridfilters',
        listeners: {
          itemclick: function (self, record, item, index, e, eOpts) {
            // if (document.body.clientWidth < 1210)
            // toolBarAction[2].execute();
          },
          itemdblclick: function (self, record, item, index, e, eOpts) {
            if (document.body.clientWidth >= 1210) { toolBarAction[2].execute() }
          }
        }
      })
      gridPanel.columns[0].renderer = function (value, metadata, record, rowIndex) {
        return (gridPanel.pageCount - 1) * gridPanel.pageSize + rowIndex + 1
      }
      var toolBarAction = Ax.utils.LibToolBarBuilder.createBillListingAction(record.PROGID,
        record.BILLTYPE, displayText, 0, gridPanel, filterCbo, compareCbo,
        compareTxt, dateCbo, filterFun[1], record.ENTRYPARAM)
      var rightContent = Ext.create('Ext.panel.Panel', {
        layout: {type: 'vbox', align: 'stretch'},
        flex: 1,
        items: [
          gridPanel,
          filterFun[0]
        ]
      })
      // 请求查询框的结构，构造出来
      // 2017/6/27 自定义查询组件
      var methodParam = [window.UserId]
      var relParam = []
      if (methodParam) {
        for (var i = 0; i < methodParam.length; i++) {
          relParam.push(Ext.encode(methodParam[i]))
        }
      };
      function reloadGridPanelBillListing (queryCondition) {
        var filter = filterFun[1]()
        Ext.Ajax.request({
          url: '/billSvc/getBillListing',
          method: 'POST',
          jsonData: {
            listingQuery: {
              Handle: UserHandle,
              ProgId: record.PROGID,
              Condition: { QueryFields: queryCondition },
              TimeFilter: dateCbo.getValue(),
              Filter: filter,
              EntryParam: record.ENTRYPARAM,
              PageSize: pageSize
            }
          },
          async: false,
          timeout: 90000000,
          success: function (response) {
            var ret = Ext.decode(response.responseText)
            var listingData = Ext.decode(ret.GetBillListingResult)
            var curStore = gridPanel.getStore()
            var proxy = curStore.getProxy()
            proxy.setData(listingData.Data)
            curStore.loadPage(1)
          }
        })
      }
      var result = ''
      Ext.Ajax.request({
        url: 'billSvc/invorkBcf',
        jsonData: { param: { ProgId: record['PROGID'], MethodName: 'GetFilterLayoutJs', MethodParam: relParam, Handle: UserHandle } },
        method: 'POST',
        async: false,
        timeout: 90000000,
        success: function (response) {
          result = Ext.decode(response.responseText)
          result = Ext.decode(result.ExecuteBcfMethodResult)
          if (result.Messages.length > 0) {
            var ex = []
            for (var i = 0; i < result.Messages.length; i++) {
              var msgKind = result.Messages[i].MessageKind
              ex.push({ kind: msgKind, msg: result.Messages[i].Message })
            }
            Ax.utils.LibMsg.show(ex)
          };
        },
        failure: function (response) {
          Ax.utils.LibMsg.show([{ kind: LibMessageKind.SysException, msg: response.responseText }])
        }
      })
      try {
        var filterPanel = eval(result.Result)
      } catch (e) {
        filterPanel = undefined
      }
      var items = [ rightContent ]
      if (filterPanel) {
        items = [ filterPanel, rightContent ]
      }
      var queryHeaderAndRightContentPanel = Ext.create('Ext.panel.Panel', {
        layout: {type: 'vbox', align: 'stretch'},
        flex: 1,
        border: false,
        items: items
      })
      // end
      tab = Ext.create('Ext.panel.Panel', {
        id: tabId,
        title: displayText,
        closable: true,
        layout: {type: 'hbox', align: 'stretch'},
        border: false,
        toolBarAction: toolBarAction,
        tbar: Ax.utils.LibToolBarBuilder.createToolBar(toolBarAction)
      })
      creatTreePanel(tab, gridPanel, record, dateCbo, filterFun)
      tab.add(queryHeaderAndRightContentPanel)
      me.grid = gridPanel
      var addTab = (function () {
        me.add(tab).show()
      }())
    }
  }
})
const creatTreePanel = (contrainer, gridPanel, record, dateCbo, filterFun) => {
  if (!record.ENABLETREELISTING) {
    return
  }
  var modelType = Ext.data.Model.schema.getEntity('LibTreeMenuDataModel')
  if (modelType === null) {
    modelType = Ext.define('LibTreeMenuDataModel', {
      extend: 'Ext.data.Model',
      fields: [
        {name: 'DisplayName', type: 'string'},
        {name: 'Id', type: 'string'}
      ]
    })
  }
  var store = Ext.create('Ext.data.TreeStore', {
    model: modelType,
    root: {children: []}
  })
  let selectNodeId = null
  var btnCheckBox = Ext.create('Ext.form.Checkbox', {
    xtype: 'checkboxfield',
    boxLabel: '显示子项',
    checked: true,
    listeners: {
      change: function (field, newValue, oldValue, eOpts) {
        api.bill.getBillListing(record.PROGID, record.TREECOLUMNNAME, btnCheckBox.getValue(), selectNodeId, dateCbo.getValue(), filterFun[1](), record.ENTRYPARAM).then(p => {
          if (!p.data.GetBillListingResult || p.data.GetBillListingResult.length === 0) {
            return
          }
          const curStore = gridPanel.getStore()
          const proxy = curStore.getProxy()
          const listingData = JSON.parse(p.data.GetBillListingResult)
          proxy.setData(listingData.Data)
          curStore.loadPage(1)
        }, p => {
          console.info(p)
        }).catch(e => {
          console.info(e)
        })
      }
    }
  })
  var treeContent = Ext.create('Ext.tree.Panel', {
    width: 200,
    rootVisible: false,
    displayField: 'DisplayName',
    store,
    tbar: [
      btnCheckBox
    ],
    listeners: {
      beforeitemexpand: function (node, eOpts) {
        node.removeAll()
        api.bill.getBillTreeListing(record.PROGID, node.data.Id).then(p => {
          if (!p.data.GetBillTreeListingResult || p.data.GetBillTreeListingResult.length === 0) {
            return
          }
          p.data.GetBillTreeListingResult.forEach(p => {
            node.appendChild(p)
          })
        }, p => {
          console.info(p)
        }).catch(e => {
          console.info(e)
        })
      },
      itemclick: function (scope, currentRecord, item, index, e, eOpts) {
        selectNodeId = currentRecord.data.Id
        api.bill.getBillListing(record.PROGID, record.TREECOLUMNNAME, btnCheckBox.getValue(), selectNodeId, dateCbo.getValue(), filterFun[1](), record.ENTRYPARAM).then(p => {
          if (!p.data.GetBillListingResult || p.data.GetBillListingResult.length === 0) {
            return
          }
          const curStore = gridPanel.getStore()
          const proxy = curStore.getProxy()
          const listingData = JSON.parse(p.data.GetBillListingResult)
          proxy.setData(listingData.Data)
          curStore.loadPage(1)
        }, p => {
          console.info(p)
        }).catch(e => {
          console.info(e)
        })
      }
    }
  })
  contrainer.add(treeContent)
  const node = store.getRootNode()
  api.bill.getBillTreeListing(record.PROGID, null).then(p => {
    if (!p.data.GetBillTreeListingResult || p.data.GetBillTreeListingResult.length === 0) {
      return
    }
    p.data.GetBillTreeListingResult.forEach(p => {
      node.appendChild(p)
    })
  }, p => {
    console.info(p)
  }).catch(e => {
    console.info(e)
  })
}
