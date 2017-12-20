/**
 * Created by Administrator on 2017/3/6.
 */
/* 功能清单ext组件 */
class MenuConfig {
  static onSetMenu (el) {
    const id = Ext.id();
    DesktopApp.ActiveWindow = id;
    const rootData = Ax.utils.LibVclSystemUtils.loadMenuData(true);
    const modelName = 'LibMenuSettingModel';
    let modelType = Ext.data.Model.schema.getEntity(modelName);
    if (modelType === null) {
      modelType = Ext.define("LibMenuSettingModel", {
        extend: "Ext.data.Model",
        fields: [
          {name: 'MENUITEM', type: 'string'},
          {name: 'PROGID', type: 'string'},
          {name: 'PROGNAME', type: 'string'},
          {name: 'BILLTYPE', type: 'int'},
          {name: 'ENTRYPARAM', type: 'string'},
          {name: 'ISVISUAL', type: 'boolean'},
          {name: 'CONDITION', type: 'string'},
          {name: 'ENABLETREELISTING', type: 'boolean'},
          {name: 'TREECOLUMNNAME', type: 'string'}
        ]
      });
    }
    const store = Ext.create('Ext.data.TreeStore', {
      model: 'LibMenuSettingModel',
      proxy: {
        type: 'memory',
        reader: {
          type: 'json'
        }
      },
      root: rootData || {
        expanded: true,
        children: [
          {
            MENUITEM: '业务功能',
            PROGID: '',
            PROGNAME: '',
            BILLTYPE: 1,
            ENTRYPARAM: '',
            CONDITION: '',
            ISVISUAL: false,
            leaf: false,
            ENABLETREELISTING: false,
            TREECOLUMNNAME: ''
          },
          {
            MENUITEM: '报表管理',
            PROGID: '',
            PROGNAME: '',
            BILLTYPE: 1,
            ENTRYPARAM: '',
            CONDITION: '',
            ISVISUAL: false,
            leaf: false,
            ENABLETREELISTING:false,
            TREECOLUMNNAME:''
          },
          {
            MENUITEM: 'KPI管理',
            PROGID: '',
            PROGNAME: '',
            BILLTYPE: 1,
            ENTRYPARAM: '',
            CONDITION: '',
            ISVISUAL: false,
            leaf: false,
            ENABLETREELISTING:false,
            TREECOLUMNNAME:''
          },
          {
            MENUITEM: '看板管理',
            PROGID: '',
            PROGNAME: '',
            BILLTYPE: 1,
            ENTRYPARAM: '',
            CONDITION: '',
            ISVISUAL: false,
            leaf: false,
            ENABLETREELISTING:false,
            TREECOLUMNNAME:''
          },
          {
            MENUITEM: '文档管理',
            PROGID: '',
            PROGNAME: '',
            BILLTYPE: 1,
            ENTRYPARAM: '',
            CONDITION: '',
            ISVISUAL: false,
            leaf: false,
            ENABLETREELISTING:false,
            TREECOLUMNNAME:''
          }
        ]
      }
    });

    const fixNodes = ['业务功能', '报表管理', 'KPI管理', '看板管理', '文档管理'];
    const treePanel = Ext.create('Ext.tree.Panel', {
      width: 300,
      flex: 0,
      store: store,
      displayField: 'MENUITEM',
      rootVisible: false,
      plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
          clicksToEdit: 1
        })
      ],
      dockedItems: [{
        xtype: 'toolbar',
        items: [{
          text: '保存',
          handler: function () {
            const root = store.getRootNode();
            const save = function () {
              Ext.Ajax.request({
                url: 'fileTranSvc/saveMenuSetting',
                jsonData: {
                  handle: UserHandle, menuData: Ext.encode(root.serialize())
                },
                method: 'POST',
                success: function (response) {
                  Ext.Msg.alert("提示", "保存成功！");
                },
                failure: function () {
                  Ext.Msg.alert("错误", "保存失败！");
                }
              });
            }();
          }
        }, {
          text: '取消',
          handler: function () {
            const rootData = Ax.utils.LibVclSystemUtils.loadMenuData(true);
            rootData.expanded = true
            store.setRoot(rootData)
            const record = Ext.create('LibMenuSettingModel', {
              MENUITEM: '',
              PROGID: '',
              PROGNAME: '',
              BILLTYPE: 1,
              ENTRYPARAM: '',
              CONDITION: '',
              ISVISUAL: false,
              ENABLETREELISTING: false,
              TREECOLUMNNAME: ''
            });
            formPanel.loadRecord(record);
          }
        }]
      }],
      viewConfig: {
        plugins: {
          ptype: 'treeviewdragdrop',
          dragText: '{0} 选中节点',
          allowContainerDrop: true,
          allowParentInsert: true,
          containerScroll: true,
          sortOnDrop: true
        }
      },
      listeners: {
        'itemcontextmenu': function (view, record, item, index, e, eOpts) {
          e.preventDefault();
          const menu = new Ext.menu.Menu({
            items: [{
              text: "新增节点",
              iconCls: 'gridAdd',
              handler: function () {
                if (!Ext.Array.contains(fixNodes, record.get('MENUITEM')))
                  addNode(record, false);
              }
            }, {
              text: "新增子节点",
              iconCls: 'gridAdd',
              handler: function () {
                addNode(record, true);
              }
            }, {
              text: "删除节点",
              iconCls: 'gridDelete',
              handler: function () {
                if (!Ext.Array.contains(fixNodes, record.get('MENUITEM')))
                  record.remove();
              }
            }]
          }).showAt(e.getXY());
        },
        'itemclick': function (view, record, item, index, e, eOpts) {
          const selectedNode = treePanel.getSelectionModel().getLastSelected();
          formPanel.loadRecord(selectedNode);
          const progId = selectedNode.get('PROGID');
          if (progId && progId != '') {
            const field = formPanel.down('libSearchfield');
            const fieldStore = field.getStore();
            fieldStore.add({Id: progId, Name: selectedNode.get('PROGNAME')});
            field.select(progId);
            field.fieldType = typeof (progId);
          }
        }
      }
    });
    treePanel.expand();
    const addNode = function (currNode, nextLevel) {
      const newNode = Ext.create('LibMenuSettingModel', {
        MENUITEM: '',
        PROGID: '',
        PROGNAME: '',
        BILLTYPE: 1,
        ENTRYPARAM: '',
        CONDITION: '',
        ISVISUAL: false,
        expanded: true,
        id: Ax.utils.LibVclSystemUtils.newGuid()
      });
      if (nextLevel) {
        currNode.appendChild(newNode);
      }
      else {
        currNode.parentNode.appendChild(newNode);
      }
      return newNode;
    };
    const clearParam = function (name) {
      const dataRow = formPanel.getRecord();
      if (dataRow) {
        dataRow.set(name, '');
        const selectedNode = treePanel.getSelectionModel().getLastSelected();
        if (selectedNode) {
          selectedNode.beginEdit();
          try {
            selectedNode.set(name, '');
          } finally {
            selectedNode.endEdit();
          }
        }
        const ctrl = Ext.getCmp(name + '0_' + id);
        ctrl.setValue('');
      }
    }
    const formPanel = Ext.create('Ext.form.Panel', {
      flex: 1,
      tbar: [{
        xtype: 'button',
        text: '设置入口参数',
        handler: function () {
          var dataRow = formPanel.getRecord();
          if (dataRow) {
            let param = dataRow.get('ENTRYPARAM');
            const progId = dataRow.get('PROGID');
            if (progId) {
              if (param.length > 0)
                param = Ext.decode(param).ParamStore;
              else
                param = undefined;
              Ax.utils.LibEntryParam.createForm(proxyVcl, progId, param);
            }
            else
              alert('请先选择功能。');
          }
        }
      }, {
        xtype: 'button',
        text: '清除入口参数',
        handler: function () {
          clearParam('ENTRYPARAM');
        }
      }, {
        xtype: 'button',
        text: '设置条件',
        handler: function () {
          const dataRow = formPanel.getRecord();
          if (dataRow) {
            let execCondition = dataRow.get('CONDITION');
            const execProgId = dataRow.get('PROGID');
            if (execProgId) {
              if (execCondition.length > 0)
                execCondition = Ext.decode(execCondition).QueryFields;
              else
                execCondition = undefined;
              Ax.utils.LibQueryForm.createForm(proxyVcl, execProgId, execCondition);
            }
            else
              alert('请先选择功能。');
          }
        }
      }, {
        xtype: 'button',
        text: '清除条件',
        handler: function () {
          clearParam('CONDITION');
        }
      }],
      border: false,
      items: [{
        xtype: 'container',
        layout: {type: 'table', columns: 1},
        style: {marginTop: '6px', marginBottom: '6px'},
        defaults: {labelAlign: 'right'},
        defaultType: 'libTextField',
        items: [{
          xtype: 'libTextField',
          height: 24,
          width: 600,
          colspan: 1,
          fieldLabel: '清单名称',
          name: 'MENUITEM',
          tableIndex: 0
        }, {
          xtype: 'libSearchfield',
          height: 24,
          width: 600,
          colspan: 2,
          fieldLabel: '功能',
          relSource: {'axp.FuncList': ''},
          relName: 'PROGNAME',
          relPk: '',
          selParams: [],
          name: 'PROGID',
          tableIndex: 0,
          selectFields: 'A.PROGNAME,A.BILLTYPE',
          condition: 'A.CANMENU=1'
        }, {
          xtype: 'libTextField',
          height: 24,
          width: 600,
          colspan: 1,
          readOnly: true,
          fieldLabel: '(功能名称)',
          name: 'PROGNAME',
          tableIndex: 0
        }, {
          xtype: 'libComboboxField',
          height: 24,
          width: 600,
          colspan: 1,
          readOnly: true,
          fieldLabel: '(功能类型)',
          queryMode: 'local',
          editable: false,
          displayField: 'value',
          valueField: 'key',
          store: Ext.create('Ext.data.Store', {
            fields: ['key', 'value'],
            data: [{'key': 0, 'value': '主数据'},
              {'key': 1, 'value': '单据'},
              {'key': 2, 'value': '数据维护功能'},
              {'key': 3, 'value': '自定义功能'},
              {'key': 4, 'value': '报表'},
              {'key': 5, 'value': '日报表'}]
          }), name: 'BILLTYPE', tableIndex: 0
        }, {
          xtype: 'libTextAreaField',
          height: 100,
          width: 600,
          colspan: 1,
          readOnly: true,
          fieldLabel: '(入口参数)',
          name: 'ENTRYPARAM',
          tableIndex: 0
        }, {
          xtype: 'libCheckboxField',
          fieldLabel: '是否看板',
          name: 'ISVISUAL',
          tableIndex: 0
        }, {
          xtype: 'libTextAreaField',
          height: 200,
          width: 600,
          colspan: 1,
          readOnly: true,
          fieldLabel: '(条件)',
          name: 'CONDITION',
          tableIndex: 0
        }]
      }]
    });
    const record = Ext.create('LibMenuSettingModel', {
      MENUITEM: '',
      PROGID: '',
      PROGNAME: '',
      BILLTYPE: 1,
      ENTRYPARAM: '',
      CONDITION: '',
      ISVISUAL: false
    });
    formPanel.loadRecord(record);

    const splitter = Ext.create('Ext.resizer.Splitter', {
      border: 5,
      style: {
        borderColor: '#eae4e4',
        borderStyle: 'solid'
      }
    });

    const proxyVcl = {
      proxy: true,
      vclHandler: function (sender, e) {
        switch (e.libEventType) {
          case LibEventTypeEnum.Validating:
            if (Ext.Array.contains(fixNodes, e.dataInfo.dataRow.get('MENUITEM')))
              e.dataInfo.cancel = true;
            break;
          case LibEventTypeEnum.Validated:
            if (e.dataInfo.fieldName == 'PROGID') {
              const progName = e.dataInfo.dataRow.get('PROGNAME');
              let ctrl = Ext.getCmp('PROGNAME0_' + id);
              ctrl.setValue(progName);
              ctrl = Ext.getCmp('MENUITEM0_' + id);
              ctrl.setValue(progName);
              ctrl = Ext.getCmp('ISVISUAL0_' + id);
              ctrl.setValue(false);
              ctrl = Ext.getCmp('CONDITION0_' + id);
              ctrl.setValue('');
              ctrl = Ext.getCmp('ENTRYPARAM0_' + id);
              ctrl.setValue('');
              const selectedNode = treePanel.getSelectionModel().getLastSelected();
              if (selectedNode) {
                selectedNode.beginEdit();
                try {
                  selectedNode.set('MENUITEM', progName);
                  selectedNode.set('PROGID', e.dataInfo.value);
                  selectedNode.set('PROGNAME', progName);
                  selectedNode.set('BILLTYPE', e.dataInfo.dataRow.get('BILLTYPE'));
                  selectedNode.set('ISVISUAL', false);
                  selectedNode.set('CONDITION', '');
                  selectedNode.set('ENTRYPARAM', '');
                  selectedNode.set('leaf', e.dataInfo.value != '');
                } finally {
                  selectedNode.endEdit();
                }
              }
            } else if (e.dataInfo.fieldName == 'MENUITEM' || e.dataInfo.fieldName == 'ISVISUAL') {
              const selectedNode = treePanel.getSelectionModel().getLastSelected();
              if (selectedNode) {
                selectedNode.beginEdit();
                try {
                  selectedNode.set(e.dataInfo.fieldName, e.dataInfo.value);
                } finally {
                  selectedNode.endEdit();
                }
              }
            }
            if (sender.xtype == 'libSearchfield') {
              var dataInfo = e.dataInfo;
              var tableIndex = dataInfo ? dataInfo.tableIndex : 0;
              var fieldName = dataInfo ? dataInfo.fieldName : '';
              //赋值relative name
              var index = sender.store.find('Id', dataInfo.value);
              if (index != -1)
                dataInfo.dataRow.set(sender.relName, sender.store.data.items[index].get('Name'));
              else
                dataInfo.dataRow.set(sender.relName, '');

              var realRelSource;
              if (sender.realRelSource) {
                realRelSource = sender.realRelSource;
              }
              else {
                var obj = {};
                realRelSource = Ax.utils.LibSysUtils.getRelSource(sender, dataInfo, sender.xcontainer.vcl, obj);
                if (obj.hasRealRelSource) {
                  sender.realRelSource = realRelSource;
                }
              }
              if (sender.win.vcl.proxy === true) {
                if (sender.selectFields) {
                  var fn = function (realRelSource) {
                    var condition = typeof this.condition == "function" ? this.condition() : this.condition ? 'and ' + this.condition : '';
                    var returnValue;
                    Ext.Ajax.request({
                      url: '/billSvc/checkFieldValue',
                      jsonData: {
                        handle: UserHandle,
                        fields: sender.selectFields,
                        relSource: realRelSource,
                        curPk: dataInfo.value,
                        condition: condition,
                        tableIndex: sender.tableIndex
                      },
                      method: 'POST',
                      async: false,
                      timeout: 90000000,
                      success: function (response) {
                        var result = Ext.decode(response.responseText);
                        if (result.CheckFieldValueResult !== "{}") {
                          returnValue = Ext.decode(result.CheckFieldValueResult);
                        } else {
                          returnValue = null
                        }
                      }
                    });
                    if (returnValue) {
                      for (p in returnValue) {
                        if (!returnValue.hasOwnProperty(p))
                          continue;
                        var value = returnValue[p];
                        if (value !== undefined && value !== null) {
                          if (dataInfo.dataRow && dataInfo.dataRow.getField(p) != null) {
                            dataInfo.dataRow.set(p, value);
                            var ctrl = Ext.getCmp(p + e.dataInfo.tableIndex + '_' + sender.win.getId());
                            if (ctrl) {
                              if (ctrl.xtype == 'libSearchfield') {
                                ctrl.store.add({Id: returnValue[ctrl.name], Name: returnValue[ctrl.relName]});
                                ctrl.select(returnValue[ctrl.name]);
                              }
                              else
                                ctrl.setValue(value);
                            }
                          }
                        }
                      }
                    } else {
                      dataInfo.dataRow.set(sender.relName, '');
                      dataInfo.dataRow.set('PROGID', '');
                    }
                  }
                  fn.call(sender, realRelSource);
                }
              } else {
                sender.win.vcl.doCheckField(dataInfo.tableIndex, dataInfo.fieldName, realRelSource, sender.relPk, dataInfo.value, dataInfo.dataRow, dataInfo.curGrid);
              }
              if (dataInfo.curForm)
                dataInfo.curForm.loadRecord(dataInfo.dataRow);
            }
            break;
        }
      },
      formCallBackHandler: function (tag, param) {
        if (tag == 'SYSTEM_QUERY') {
          const value = Ext.encode({QueryFields: param.condition});
          setCondition('CONDITION', value);
        } else if (tag == 'ENTRY_PARAM') {
          const value = Ext.encode(param.condition);
          setCondition('ENTRYPARAM', value);
        }
      }
    };

    const setCondition = function (name, value) {
      const dataRow = formPanel.getRecord();
      if (dataRow) {
        dataRow.set(name, value);
        const selectedNode = treePanel.getSelectionModel().getLastSelected();
        if (selectedNode) {
          selectedNode.beginEdit();
          try {
            selectedNode.set(name, value);
          } finally {
            selectedNode.endEdit();
          }
        }
        const ctrl = Ext.getCmp(name + '0_' + id);
        ctrl.setValue(value);
      }
    }

    const panel = Ext.create('Ext.panel.Panel', {
      containerpanel: true,
      id: id,
      isVcl: true,
      title: '菜单设置',
      autoScroll: true,
      width: '100%',
      height: '100%',
      layout: {type: 'hbox', align: 'stretch'},
      minimizable: false,
      maximizable: false,
      modal: true,
      vcl: proxyVcl,
      items: [treePanel, splitter, formPanel],
      renderTo: el
    });
    return panel
  }
}
export {MenuConfig}
