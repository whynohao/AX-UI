/**********************************************************************
 * CopyRight 2016 杭州集控科技有限公司 版权所有
 * 功能描述：CPS建模主窗口
 * 创建标识：Huangwz 2017/03/18
 *
 * 修改标识：Huangwz 2017/03/18
 *
 ************************************************************************/
import {CpsCommonVar} from './CpsCommon'
import {CpsMainPanel} from './CpsMainPanel'
import {CpsSystemControls} from './CpsSystemControls'
import {CpsControlsAttr} from './CpsControlsAttr'
import {CpsPolylineAttr} from './CpsPolylineAttr'
import {CpsEventPanel} from './CpsEventPanel'
Ext.define('CPSConfigureManage.CpsConfigureMain', {
  init: function () {
    this.launcher = {
      text: 'CPS建模',
      iconCls: 'menuIco'
    }
  },

  /** 创建属性模块组  宽度固定250，最小高度750，小于可视区域范围出现滚动条
   * CPS组件属性模块  宽度固定250，高度不限定
   * 矢量线属性模块  宽度固定250，高度固定170
   * */
  createAttrPanel: function () {
    let maxHeight = parseInt($('.content-section').css('height').replace('px', '')) - 50
    // 加载组件属性模块
    let controlAttrPanel = CpsControlsAttr.createControlAttrPanel()
    // 加载矢量线属性模块
    let polylineAttrPanel = CpsPolylineAttr.createPolylineAttrPanel()
    CpsCommonVar.attrFormPanels = Ext.create('Ext.panel.Panel', {
      border: false,
      width: 250,
      height: '100%',
      maxHeight: maxHeight,
      autoScroll: true,
      flex: 0,
      layout: 'vbox',
      items: [controlAttrPanel, polylineAttrPanel]
    })
    return CpsCommonVar.attrFormPanels
  },

  /** 创建并显示CPS工厂建模管理主窗口
   * 初始加载 系统事件模块、画板以及组件模块、组件属性模块以及矢量线属性模块 这五大模块
   * 默认加载画板模块数据、组件模块数据
   * */
  createCpsFactoryModule: function (renderTo, produceControlLineId, masterVcl) {
    // 加载事件模块
    let eventPanel = CpsEventPanel.createEventPanel()
    // 加载画板以及组件模块
    let mainPanel = CpsMainPanel.createMainPanel()
    // 加载CPS组件属性模块和矢量线属性模块
    let attrPanel = this.createAttrPanel()

    // 创建整体panel，用于显示CPS产线模型操作面板
    let panel = Ext.create('Ext.panel.Panel', {
      id: 'CpsConfigureWinId',
      header: false,
      draggable: false,
      resizable: false,
      width: '100%',
      height: '100%',
      iconCls: 'gears',
      animCollapse: false,
      border: false,
      layout: 'vbox',
      items: [
        {
          xtype: 'panel',
          border: true,
          width: '100%',
          height: 50,
          flex: 0,
          layout: 'fit',
          items: [eventPanel]
        },
        {
          xtype: 'panel',
          border: false,
          width: '100%',
          flex: 1,
          layout: 'hbox',
          autoScroll: true,
          items: [mainPanel, attrPanel]
        }
      ],
      renderTo: renderTo,
      style: {
        'border-radius': '0px !important;',
        'background-color': '#4a9dcf !important;',
        'border-color': '#4a9dcf !important;'
      }
    })
    CpsCommonVar.renderTo = renderTo
    // 加载系统组件模块数据Vue
    CpsSystemControls.loadSystemControlConfigVue()
    if(!masterVcl){
      // 加载画板模块数据Vue和相关的组件模块Vue
      CpsMainPanel.selFactoryModuleType(produceControlLineId, masterVcl)
    }
    return panel
  }
})
