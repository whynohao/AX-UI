/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
import {ConsoleItemKey} from '../../../components/items/console-items'
class MessageControl {
  static id = ConsoleItemKey.MESSAGES

  static getControl () {
    const panel = Ext.create('Container.MessageControl', {
      height: '100%',
      width: '100%'
    });
    return panel
  }
}
export {MessageControl}
Ext.define('Container.MessageControl', {
  extend: 'Ext.panel.Panel',
  header: true,
  title: '我的消息',
  animCollapse: false,
  constrainHeader: true,
  closable: true,
  layout: {type: 'vbox', align: 'stretch'},
  requires: [
    'Ext.data.ArrayStore',
    'Ext.util.Format',
    'Ext.grid.Panel',
    'Ext.grid.RowNumberer'
  ],

  init: function () {
    this.launcher = {
      text: '我的消息',
      iconCls: 'msgIco'
    };
  },
  create: function () {
    var modelName = "MyMessage";
    var modelType = Ext.data.Model.schema.getEntity(modelName);
    if (modelType === null) {
      modelType = Ext.define(modelName, {
        extend: 'Ext.data.Model',
        fields: [
          {name: 'NewsId', type: 'string'},
          {name: 'Title', type: 'string'},
          {name: 'MainContent', type: 'string'},
          {name: 'InfoId', type: 'string'},
          {name: 'PersonName', type: 'string'},
          {name: 'CreateDate', type: 'int'},
          {name: 'CreateTime', type: 'int'},
          {name: 'IsRead', type: 'bool'},
          {name: 'ProgId', type: 'string'},
          {name: 'DisplayText', type: 'string'},
          {name: 'BillType', type: 'int'},
          {name: 'CurPks', type: 'string'},
          {name: 'EntryParam', type: 'string'},
          {name: 'SourceSiteId', type: 'string'},
          {name: 'SourceSiteName', type: 'string'},
          {name: 'SourceSiteFullName', type: 'string'},
          {name: 'SourceSiteUrl', type: 'string'},
        ]
      });
    }
    var data = [];
    Ext.Ajax.request({
      url: 'billSvc/getMyNews',
      method: 'POST',
      jsonData: {
        handle: UserHandle, startTime: 0, onlyUnRead: true
      },
      async: false,
      timeout: 90000000,
      success: function (response) {
        var ret = Ext.decode(response.responseText);
        data = ret.GetMyNewsResult;
      }
    });

    var store = Ext.create('Ext.data.Store', {
      model: modelType,
      data: data,
      sorters: [{property: 'CreateDate', direction: 'DESC'}, {property: 'CreateTime', direction: 'DESC'}]
    });

    var isShowReaded = Ext.create('Ext.form.field.Checkbox', {
      boxLabel: '显示已读信息',
      labelAlign: 'right'
    });

    var grid = Ext.create('Ext.grid.Panel', {
      store: store,
      collapsible: false,
      selType: 'checkboxmodel',
      multiSelect: true,
      plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: new Ext.XTemplate('<p>{MainContent}</p>')
      }],
      dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        items: [{
          text: '标记为已读',
          handler: function () {
            var newsList = [];
            var records = grid.getSelectionModel().getSelection();
            for (var i = 0; i < records.length; i++) {
              if (!records[i].get('IsRead')) {
                records[i].set('IsRead', true);
                newsList.push(records[i].get('NewsId'));
              }
            }
            if (newsList.length > 0) {
              Ext.Ajax.request({
                url: 'billSvc/setMyNewsReadState',
                method: 'POST',
                jsonData: {
                  handle: UserHandle, newsList: newsList
                },
                async: false,
                timeout: 90000000,
                success: function (response) {
                  var ret = Ext.decode(response.responseText);
                  ret = ret.SetMyNewsReadStateResult;
                  if (ret == null || ret == '')
                    ret = '已标记成功。';
                  Ext.Msg.alert('提示', ret);
                }
              });
            }
          }
        }, isShowReaded, {
          text: '刷新列表',
          handler: function () {
            Ext.Ajax.request({
              url: 'billSvc/getMyNews',
              method: 'POST',
              jsonData: {
                handle: UserHandle, startTime: 0, onlyUnRead: !isShowReaded.getValue()
              },
              async: false,
              timeout: 90000000,
              success: function (response) {
                var ret = Ext.decode(response.responseText);
                data = ret.GetMyNewsResult;
                grid.getStore().loadData(data);
              }
            });
          }
        }]
      }],
      columns: [{
        text: '主题',
        flex: 1,
        dataIndex: 'Title',
        summaryType: 'count',
        summaryRenderer: function (value, summaryData, dataIndex) {
          return ((value === 0 || value > 1) ? '(' + value + ' 条)' : '(1 条)');
        }
      }, {
        text: '信息',
        xtype: 'actioncolumn',
        width: 60,
        items: [{
          iconCls: 'icon-grid',
          tooltip: '查看',
          scope: this,
          handler: function (grid, rowIndex, colIndex) {
            var rec = grid.getStore().getAt(rowIndex);

            function canUseFunc (progId) {
              var canUse = false;
              Ext.Ajax.request({
                url: 'billSvc/canUseFunc',
                method: 'POST',
                jsonData: {
                  handle: UserHandle, progId: progId
                },
                async: false,
                timeout: 90000000,
                success: function (response) {
                  var ret = Ext.decode(response.responseText);
                  canUse = ret.CanUseFuncResult;
                }
              });
              return canUse;
            };
            function getCurToken () {
              var token = '';
              Ext.Ajax.request({
                url: 'sysSvc/getToken',
                method: 'POST',
                jsonData: {
                  userHandle: UserHandle
                },
                async: false,
                timeout: 90000000,
                success: function (response) {
                  var ret = Ext.decode(response.responseText);
                  token = ret.GetTokenResult;
                }
              });
              return token;
            };
            if (canUseFunc(rec.get('ProgId'))) {
              var infoId = rec.get('InfoId');
              var billType = rec.get('BillType');
              var sourceSiteId = rec.get('SourceSiteId');
              var sourceSiteFullName = rec.get('SourceSiteFullName');
              if (infoId != null && infoId != '') {
                if (sourceSiteId != null && sourceSiteId != '') {
                  // 跨站点登录并打开单据
                  // 先获取当前Token
                  var token = getCurToken();
                  // 构建sso登录并打开单据的Url
                  var curPks = Ext.decode(rec.get('CurPks'));
                  var entryParam = null;
                  if (curPks && curPks.length > 0) {
                    entryParam = rec.get('EntryParam');
                    if (entryParam != null && entryParam != '')
                      entryParam = Ext.decode(entryParam);
                  }
                  var ssoOpenBill = {
                    UserId: UserId,
                    Token: token,
                    BillType: billType,
                    ProgId: rec.get('ProgId'),
                    CurPks: curPks,
                    EntryParam: entryParam,
                    InfoId: infoId,
                    DisplayText: rec.get('DisplayText')
                  };
                  var siteUrl = rec.get('SourceSiteUrl');
                  var newPageUrl = siteUrl + '/#/ssobill?bill=' + encodeURIComponent(JSON.stringify(ssoOpenBill));
                  window.open(newPageUrl, sourceSiteFullName);
                } else {
                  switch (billType) {
                    case 0:
                    case 1:
                      var curPks = Ext.decode(rec.get('CurPks'));
                      if (curPks && curPks.length > 0) {
                        var entryParam = rec.get('EntryParam');
                        if (entryParam != null && entryParam != '')
                          entryParam = Ext.decode(entryParam);
                        Ax.utils.BillManager.openBillByF4(rec.get('ProgId'), BillActionEnum.Browse, curPks, entryParam);
                      }
                      break;
                    case 4:
                      Ax.utils.BillManager.openRpt(rec.get('ProgId'), rec.get('DisplayText'), infoId);
                      break;
                    case 5:
                      Ax.utils.BillManager.openRpt(rec.get('ProgId'), rec.get('DisplayText'), infoId);
                      break;
                  }
                }
              }
            }
            else
              alert('没有该信息的查看权限。');
          }
        }]
      },
        {
          text: '发送人员',
          width: 80,
          dataIndex: 'PersonName'
        },
        {
          text: '来源站点',
          width: 100,
          dataIndex: 'SourceSiteName'
        },
        {
          text: '日期',
          width: 120,
          dataIndex: 'CreateDate',
          xtype: 'libDatecolumn',
          axT: 1
        }, {
          text: '时间',
          width: 75,
          dataIndex: 'CreateTime',
          xtype: 'libDatecolumn',
          axT: 3
        }, {
          text: '已读',
          width: 75,
          dataIndex: 'IsRead',
          xtype: 'libCheckcolumn'
        }]
    });
    this.height = '100%'
    this.items.add(grid);
  }
});

