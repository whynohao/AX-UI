/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
import {ConsoleItemKey} from '../../../components/items/console-items'
class OaHomeControl {
  static id = ConsoleItemKey.OA_HOME

  static getControl () {
    const panel = Ext.create('Container.OaHomeControl', {
      height: '100%',
      width: '100%'
    });
    return panel
  }
}
export {OaHomeControl}
Ext.define('Container.OaHomeControl', {
  extend: 'Ext.panel.Panel',
  header: true,
  title: '首页',
  animCollapse: false,
  constrainHeader: true,
  closable: true,
  layout: {type: 'hbox', align: 'stretch'},

  init: function () {
    // this.launcher = {
    //   text: '我的消息',
    //   iconCls: 'msgIco'
    // };
  },
  create: function () {
//获取公告信息数据
    var noticeStore = Ext.create('Ext.data.Store', {
      model: 'OAHome.OaNotice',
      proxy: {
        type: 'ajax',
        url: '/Desk/GetNoticeList',
        reader: new Ext.data.JsonReader({model: 'OAHome.OaNotice'})
      },
      autoLoad: true
    });
    //创建公告表格模块
    var advicesPanel = Ext.create('Ext.grid.Panel', {
      title: '公告',
      width: '100%',
      flex: 3,
      border: true,
      style: {
        background: 'white'
      },
      hideHeaders: true,
      forceFit: true,
      store: noticeStore,
      columns: [
        {header: "内容", width: 50, dataIndex: "Content", sortable: true, hidden: true},
        {header: "标题", dataIndex: "Title", flex: 1, sortable: true},
        {header: "创建时间", width: 100, dataIndex: "CreateTime", sortable: true}
      ],
      listeners: {
        itemdblclick: function (dataview, record, item, index, e) {
          ShowMessagePanel("公告", record.get('Title'), record.get('CreateTime'), record.get('Content')).show();
        },
      }
    });
    //获取公司动态信息数据
    var newsStore = Ext.create('Ext.data.Store', {
      model: 'OAHome.OaNotice',
      proxy: {
        type: 'ajax',
        url: '/Desk/GetNewsList',
        reader: new Ext.data.JsonReader({model: 'OAHome.OaNotice'})
      },
      autoLoad: true
    });
    //创建公司动态表格模块
    var newsPanel = Ext.create('Ext.grid.Panel', {
      title: '公司动态',
      width: '100%',
      flex: 3,
      border: true,
      style: {
        background: 'white'
      },
      hideHeaders: true,
      forceFit: true,
      store: newsStore,
      columns: [
        {header: "内容", width: 50, dataIndex: "Content", sortable: true, hidden: true},
        {header: "标题", dataIndex: "Title", flex: 1, sortable: true},
        {header: "创建时间", width: 100, dataIndex: "CreateTime", sortable: true}
      ],
      listeners: {
        itemdblclick: function (dataview, record, item, index, e) {
          ShowMessagePanel("公司动态", record.get('Title'), record.get('CreateTime'), record.get('Content')).show();
        },
      }
    });
    //获取友情链接信息数据
    var linksStore = Ext.create('Ext.data.Store', {
      model: 'OAHome.OaNotice',
      proxy: {
        type: 'ajax',
        url: '/Desk/GetLinksList',
        reader: new Ext.data.JsonReader({model: 'OAHome.OaNotice'})
      },
      autoLoad: true
    });
    //创建友情链接表格模块
    var linksPanel = Ext.create('Ext.grid.Panel', {
      title: '友情链接',
      width: '100%',
      flex: 2,
      style: {
        background: 'white'
      },
      hideHeaders: true,
      forceFit: true,
      store: linksStore,
      columns: [
        {text: '左边链接', xtype: 'templatecolumn', tpl: '<a href="{Content}" target="_blank">{Title}</a>', flex: 1},
        {text: '右边链接', xtype: 'templatecolumn', tpl: '<a href="{Content2}" target="_blank">{Title2}</a>', flex: 1}
      ]
    });
    //创建知识管理内容模块
    var knowledgePanel = Ext.create('Ext.panel.Panel', {
      title: '知识管理',
      width: '100%',
      flex: 1,
      border: true,
      style: {
        background: 'white'
      },
      html: '<div style="width:100%;height:100%;"></div>'
    });
    //获取知识管理信息数据
    $.ajax({
      dataType: "json",
      url: "/Desk/GetKnowledgeList",
      type: "POST",
      async: true,
      data: {},
      contentType: "application/x-www-form-urlencoded",
      success: function (list) {
        var html = '&nbsp;';
        if (list.length > 0) {
          var model = list[0];
          html = '<div style="width:100%;height:100%;margin-top:10px;">' +
            '<table style="width:100%;height:75px;">' +
            '<tbody><tr>' +
            '<td style="text-align:center;word-wrap:break-word;word-break:break-all;font-size:25px;font-weight:bold;line-height:28px;">' + model.Title + '</td>' +
            '<td style="width:100px;text-align:center;color:grey;font-size:18px;">' + model.CreateTime + '</td>' +
            '</tr></tbody>' +
            '</table>' +
            '<textarea readonly="readonly" class="x-form-text x-form-text-default x-form-textarea" autocomplete="off" style="padding:0px 10px;height:calc(100% - 95px);">' + model.Content + '</textarea></div>';
        }
        knowledgePanel.update(html);
      }
    });
    //创建图片区域内容模块
    var picturePanel = Ext.create('Ext.panel.Panel', {
      title: '图片区域',
      width: '100%',
      height: 300,
      flex: 0,
      border: true,
      style: {
        background: 'white'
      },
      html: '<div id="changeIamges" style="width:100%;height:100%;display:block;position:absolute;">&nbsp;</div>'
    });
    //获取图片区域信息数据
    $.ajax({
      dataType: "json",
      url: "/Desk/GetImageList",
      type: "POST",
      async: true,
      data: {},
      contentType: "application/x-www-form-urlencoded",
      success: function (list) {
        var html = '';
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            if (i == 0) {
              html = html + '<img name="smallPic" style="max-width:100%;max-height:100%;display: block;margin:0 auto;" src="' + list[i] + '" />';
            } else {
              html = html + '<img name="smallPic" style="max-width:100%;max-height:100%;display: none;margin:0 auto;" src="' + list[i] + '" />';
            }
          }
          html == '' ? '&nbsp;' : html;
          html = '<div id="changeIamges" style="width:100%;height:100%;display:block;position:absolute;">' + html + '</div>';
          var index = 1;
          setInterval(function () {
            var i = index == 0 ? list.length - 1 : index - 1;
            $("#changeIamges").find("img").eq(i).css("display", "none");
            $("#changeIamges").find("img").eq(index).css("display", "block");
            index++;
            index = index == list.length ? 0 : index;
          }, 2000);
        }
        picturePanel.update(html);
      }
    });
    this.items.add(Ext.create('Ext.panel.Panel', {
      flex: 2,
      layout: 'vbox',
      height: '100%',
      items: [advicesPanel, newsPanel, linksPanel]
    }))
    this.items.add(Ext.create('Ext.panel.Panel', {
      flex: 3,
      layout: 'vbox',
      height: '100%',
      items: [picturePanel, knowledgePanel]
    }))
  }
});

//定义公告、公司动态、知识管理、友情链接数据模型（标题，创建时间，内容，标题2，内容2）
Ext.define('OAHome.OaNotice', {
  extend: 'Ext.data.Model',
  fields: [
    {name: 'Title', type: 'string'},
    {name: 'CreateTime', type: 'string'},
    {name: 'Content', type: 'string'},
    {name: 'Title2', type: 'string'},
    {name: 'Content2', type: 'string'}
  ]
});

//用于显示当前公告或公司动态的具体信息（模块标题，内容标题，创建时间，内容）
function ShowMessagePanel (panelTitle, title, createTime, content) {
  var messageWindow = Ext.create('Ext.window.Window', {
    align: 'middle',
    closable: true,    //为'true'时显示‘close’工具按钮并且允许用户关闭窗体, 为假时隐藏按钮并且不允许关闭窗体。
    constrain: true,    //True： 限制窗口在窗口包含的元素里面，false：允许顶部超出它包含的元素.默认的，窗体将被渲染到document.body。渲染和禁用窗口在另一个指定的renderTo元素内部
    width: '60%',         //此组件的宽度，以像素为单位。
    height: '80%',      //此组件的高度，以像素为单位。
    plain: true,      //为真时，用一个透明的背景渲染窗体主体以便于它将融入框架元素， 为假时添加一个相对轻的背景颜色以便视觉上突出身体（body）元素并且 相对于周围的框架将它显示的更清晰。
    resizable: false, //指定为“真”允许用户调整每个边缘和窗口的角落，为假时禁用调整。
    title: panelTitle,  //此标题头内容被用于在panel 标题头展现。当一个title属性在Ext.panel.Header 中被指定那么会自动创建和渲染出一个头除非header属性被设置为了false。
    titleAlign: 'center',  //可以设置为"left"(左), "right"(右) 或者 "center"(居中)。 设置Panel标题文字在图标和工具栏之间可利用的位置。
    layout: 'fit',   //了保证子组件的大小和位置,通常开发者需要进行布局管理， 必须 通过layout项进行配置。 子组件的大小和位置items是根据开发者的配置由布局管理器去创建和管理的。
    items: [           //单个组件,或者是以数组形式定义的子组件集合 将会自动添加到容器中去 如果开发者没有配置layout属性， 默认是按顺序将子组件渲染到在容器中，不考虑子组件的大小和定位。
      Ext.create('Ext.panel.Panel', {
        border: true,
        flex: 1,
        style: {
          background: 'white'
        },
        html: '<div style="width:100%;height:100%;margin-top:10px;">' +
        '<table border="0" style="width:100%;height:75px;">' +
        '<tbody><tr>' +
        '<td style="text-align:center;word-wrap:break-word;word-break:break-all;font-size:25px;font-weight:bold;line-height:28px;">' + title + '</td>' +
        '<td style="width:100px;text-align:center;color:grey;font-size:18px;">' + createTime + '</td>' +
        '</tr></tbody>' +
        '</table>' +
        '<textarea readonly="readonly" class="x-form-text x-form-text-default x-form-textarea" autocomplete="off" style="padding: 0px 10px;height: calc(100% - 95px);">' + content + '</textarea></div>'
      })
    ],
  });
  return messageWindow;
}
