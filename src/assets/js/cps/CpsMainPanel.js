/**********************************************************************
 * CopyRight 2017 杭州集控科技有限公司 版权所有
 * 功能描述：CPS主模块的窗口，包含CPS组件模块，系统组件模块，画板模块
 * 创建标识：Huangwz 2017/04/28
 *
 * 修改标识：Huangwz 2017/04/28
 *
 ************************************************************************/
import {CpsCommonFunc, CpsCommonVar, CpsCommonConst} from './CpsCommon'
import {CpsEventPanel} from './CpsEventPanel'
import {CpsSystemControls} from './CpsSystemControls'
import {CpsControlsAttr} from './CpsControlsAttr'
import {CpsPolylineAttr} from './CpsPolylineAttr'
class CpsMainPanel {
  // 当前可视画板的最小宽度
  static minWidth = 0
  // 当前可视画板的最小高度
  static minHeight = 0
  // CPS建模的模式选择
  static factoryModuleTypeWin = null
  // 标准工艺路线上所有关联组件的属性数据集合
  static controlAttrArr = []

  /** 创建主体模块：组件模块以及画板模块
   * 通过getControlConfigureVue方法获得组件模块Vue，包含CPS组件模块、系统模块
   * */
  static createMainPanel() {
    let mainPanelDomId = CpsCommonConst.mainPanelId.replace('#', '')
    let controlsDomId = CpsCommonConst.controlsId.replace('#', '')
    let canvasDomId = CpsCommonConst.canvasId.replace('#', '')
    let html = '<div class="cps-controls-layout" id="' + mainPanelDomId + '" style="width:100%;height:100%;">'
    html = html + '<aside class="cps-controls-layout-aside" id="' + controlsDomId + '">' + CpsMainPanel.getControlConfigureVue() + '</aside>'
    html = html + '<div class="cps-controls-layout-main" id="' + canvasDomId + '" tabindex="0" style="position:relative;overflow:overlay;">'
    html = html + '</div>'
    html = html + '<div id="cpsLoading" class="cps-loading"><i class="fa fa-refresh fa-spin"></i></div>'
    html = html + '</div>'
    let mainPanel = Ext.create('Ext.panel.Panel', {
      border: false,
      height: '100%',
      flex: 1,
      html: html
    })
    return mainPanel
  }

  /** 获得控件组模块Vue
   * 通过getSystemControlVue方法加载默认的系统模块Vue
   * */
  static getControlConfigureVue() {
    let cpsControlsDomId = CpsCommonConst.cpsControlsId.replace('#', '')
    let sysControlsDomId = CpsCommonConst.sysControlsId.replace('#', '')
    let height = parseInt($('.content-section').css('height').replace('px', '')) - 35 * 2 - 130 - 50 - 10
    let html = '<ul class="cps-controls-sidebar" style="width:100%;height:100%;">'
    html = html + '<li>'
    html = html + '<div class="cps-controls-title" name="cpsControlTitle">'
    html = html + '<span>CPS组件</span>'
    html = html + '<img src="/Scripts/img/cps/less_than.png" class="cps-controls-openimg cps-controls-angle" name="cpsImage"></span>'
    html = html + '</div>'
    html = html + '<div class="cps-controls-table" id="' + cpsControlsDomId + '" name="cpsControls" style="display:block;max-height:' + height + 'px;overflow-y:auto;">'
    html = html + '</div>'
    html = html + '</li>'
    html = html + '<li style="margin-top:5px;">'
    html = html + '<div class="cps-controls-title" name="cpsControlTitle">'
    html = html + '<span>系统组件</span>'
    html = html + '<img src="/Scripts/img/cps/less_than.png" class="cps-controls-openimg cps-controls-angle" name="cpsImage"></span>'
    html = html + '</div>'
    html = html + '<div class="cps-controls-table" id="' + sysControlsDomId + '" name="cpsControls" style="display:block;height: 130px;">'
    html = html + '</div>'
    html = html + '</li>'
    html = html + '</ul>'
    return html
  }

  /** 获取SVG模板默认Vue
   * 定义了            矢量线的箭头   矢量线的拉伸圆点   功能组件的连接圆点    功能组件的缩放原点
   * 以ID或name值判定  markerArrow       drawCircle          controlRect         zoomCircle
   * */
  static getSvgLayoutVue() {
    let drawSVGDomId = CpsCommonConst.drawSVGId.replace('#', '')
    let html = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="position: absolute;left:0px;top:0px;width:100%;height:100%;" id="' + drawSVGDomId + '">'
    html = html + '<defs>'
    html = html + '<marker id="markerArrow" markerUnits="strokeWidth" markerWidth="8" markerHeight="8" viewBox="0 0 12 12" refX="6" refY="6" orient="auto">'
    html = html + '<path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: red;" />'
    html = html + '</marker>'
    html = html + '</defs>'
    html = html + '<circle id="drawCircle0" name="drawCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="0" style="display:none;cursor: sw-resize;" data-lineid=""/>'
    html = html + '<circle id="drawCircle1" name="drawCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="1" style="display:none;cursor: se-resize;" data-lineid=""/>'
    html = html + '<rect id="controlRect0" name="controlRect" x="0" y="0" width="7" height="7" fill="#ffffff" stroke="#ff0000" stroke-width="1" data-index="1" style="display:none;cursor: pointer;" data-controlid=""/>'
    html = html + '<rect id="controlRect1" name="controlRect" x="0" y="0" width="7" height="7" fill="#ffffff" stroke="#ff0000" stroke-width="1" data-index="2" style="display:none;cursor: pointer;" data-controlid=""/>'
    html = html + '<rect id="controlRect2" name="controlRect" x="0" y="0" width="7" height="7" fill="#ffffff" stroke="#ff0000" stroke-width="1" data-index="3" style="display:none;cursor: pointer;" data-controlid=""/>'
    html = html + '<rect id="controlRect3" name="controlRect" x="0" y="0" width="7" height="7" fill="#ffffff" stroke="#ff0000" stroke-width="1" data-index="4" style="display:none;cursor: pointer;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle0" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="1" style="display:none;cursor: se-resize;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle1" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="2" style="display:none;cursor: s-resize;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle2" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="3" style="display:none;cursor: sw-resize;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle3" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="4" style="display:none;cursor: w-resize;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle4" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="5" style="display:none;cursor: se-resize;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle5" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="6" style="display:none;cursor: s-resize;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle6" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="7" style="display:none;cursor: sw-resize;" data-controlid=""/>'
    html = html + '<circle id="zoomCircle7" name="zoomCircle" cx="0" cy="0" r="5" stroke="#3c8dbc" fill="#ffffff" stroke-width="1" data-index="8" style="display:none;cursor: w-resize;" data-controlid=""/>'
    html = html + '</svg>'
    return html
  }

  /** 将CPS产线模型数据列表通过方法getControlsHtml加载组件Vue，方法getSVGHtml加载矢量线Vue
   * list：CPS产线模型数据列表
   * */
  static loadCanvasVue(list) {
    let svgVue = CpsMainPanel.getSvgLayoutVue()
    $(CpsCommonConst.canvasId).empty().append(svgVue)
    if (list) {
      let controlsVue = CpsMainPanel.loadCanvasControlsVue(list)
      $(CpsCommonConst.canvasId).append(controlsVue)
      CpsMainPanel.loadCanvasSvgVue(list)
    }
  }

  /** 根据CPS产线模型数据列表中的功能组件配置明细数据列表转换成组件Vue集合并返回
   * list：功能组件配置明细数据列表
   * */
  static loadCanvasControlsVue(list) {
    let html = ''
    for (let i = 0; i < list.ControlDetail.length; i++) {
      let model = list.ControlDetail[i]
      let imgSize = model.ControlWidth > model.ControlHeight ? model.ControlHeight : model.ControlWidth
      html = html + '<div class="cps-controls-td" name="cpsIcon" style="width:' + model.ControlWidth + 'px;height:' + model.ControlHeight + 'px;position:absolute;margin:0px;left:' + model.XCoordinate + 'px;top:' + model.YCoordinate + 'px;"  draggable="true" id="' + model.ControlId + '" data-relid="' + model.RelId + '" data-progid="' + model.ProgId + '">'
      html = html + '<div class="cps-controls-region" style="border:1px solid #d2c06c;">'
      html = html + '<img src="' + model.RelIcon + '" style="width: ' + (imgSize - 30) + 'px;height:' + (imgSize - 30) + 'px;"/>'
      html = html + '<div class="cps-controls-span">' + model.ControlName + '</div>'
      html = html + '</div>'
      html = html + '</div>'
    }
    return html
  }

  /** 根据CPS产线模型数据列表中的矢量线配置明细数据列表转换成矢量线Vue并加入到SVG中
   * list：功能组件配置明细数据列表
   * */
  static loadCanvasSvgVue(list) {
    for (let i = 0; i < list.VectorLineDetail.length; i++) {
      let model = list.VectorLineDetail[i]
      let polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
      if (polyline) {
        polyline.setAttribute('name', 'drawLine')
        polyline.setAttribute('id', model.LineId)
        polyline.setAttribute('points', model.Coordinates)
        polyline.setAttribute('data-startid', model.StartControlId)
        polyline.setAttribute('data-endid', model.EndControlId)
        polyline.setAttribute('data-starttype', model.ControlStartType)
        polyline.setAttribute('data-endtype', model.ControlEndType)
        polyline.setAttribute('marker-end', 'url(#markerArrow)')
        polyline.setAttribute('style', 'fill:none;stroke:red;stroke-width:2;cursor:move;')
        $(CpsCommonConst.drawSVGId).append(polyline)
      }
    }
  }

  /** 重置画板模块的宽高度，以修正可视区域的滚动条（拓展到画板最小的宽高度）
   * element：此为移动中和复制的CPS功能组件元素
   * 此处应在CPS功能组件的移动（新增，拉伸）中，删除，复制等操作上使用
   * */
  static resizeDrawSvg(element) {
    if (!element || element.length === 0)
      return
    let minWidth = CpsMainPanel.minWidth
    let minHeight = CpsMainPanel.minHeight
    let cx = Math.round(element.css('left').replace('px', '')) + Math.round(element.css('width').replace('px', ''))
    let cy = Math.round(element.css('top').replace('px', '')) + Math.round(element.css('height').replace('px', ''))
    minWidth = cx + 20 > minWidth ? minWidth + 200 : minWidth
    minHeight = cy + 20 > minHeight ? minHeight + 200 : minHeight
    minWidth = CpsCommonVar.drawSvgWidth > minWidth ? CpsCommonVar.drawSvgWidth : minWidth
    minHeight = CpsCommonVar.drawSvgHeight > minHeight ? CpsCommonVar.drawSvgHeight : minHeight
    $(CpsCommonConst.drawSVGId).css({'width': minWidth, 'height': minHeight})
    CpsMainPanel.minWidth = minWidth
    CpsMainPanel.minHeight = minHeight
  }

  /** 设置画板模块的宽高度，以修正可视区域的滚动条（敛缩到画板最小的宽高度）
   * 此处应在CPS功能组件或矢量线的移动（新增，拉伸）后等操作上使用
   * */
  static setSizeDrawSvg() {
    let minWidth = CpsMainPanel.minWidth
    let minHeight = CpsMainPanel.minHeight
    let cx = 0
    let cy = 0
    for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
      let model = CpsCommonVar.controlLineModels.ControlDetail[i]
      cx = model.XCoordinate + model.ControlWidth > cx ? model.XCoordinate + model.ControlWidth : cx
      cy = model.YCoordinate + model.ControlHeight > cy ? model.YCoordinate + model.ControlHeight : cy
    }
    for (let j = 0; j < CpsCommonVar.controlLineModels.VectorLineDetail.length; j++) {
      let model = CpsCommonVar.controlLineModels.VectorLineDetail[j]
      let points = model.Coordinates.split(' ')
      for (let i = 0; i < points.length; i++) {
        let x = parseInt(points[i].split(',')[0])
        let y = parseInt(points[i].split(',')[1])
        cx = x > cx ? x : cx
        cy = y > cy ? y : cy
      }
    }
    while (minWidth - 200 > cx + 20) {
      minWidth = minWidth - 200
    }
    while (minHeight - 200 > cy + 20) {
      minHeight = minHeight - 200
    }
    minWidth = CpsCommonVar.drawSvgWidth > minWidth ? CpsCommonVar.drawSvgWidth : minWidth
    minHeight = CpsCommonVar.drawSvgHeight > minHeight ? CpsCommonVar.drawSvgHeight : minHeight
    $(CpsCommonConst.drawSVGId).css({'width': minWidth, 'height': minHeight})
    CpsMainPanel.minWidth = minWidth
    CpsMainPanel.minHeight = minHeight
  }

  /** 初始化画板模块的宽高度，以形成可视区域的滚动条（设定默认画板最大的宽高度）
   * 此处应在画板初始化的新增界面或加载CPS产线的修改模型界面情况下使用
   * */
  static initSizeDrawSvg() {
    let canvasEle = $(CpsCommonConst.canvasId)[0]
    let clientWidth = canvasEle.offsetWidth - 2 > canvasEle.scrollWidth ? canvasEle.offsetWidth - 2 : canvasEle.scrollWidth
    let clientHeight = canvasEle.offsetHeight > canvasEle.scrollHeight ? canvasEle.offsetHeight : canvasEle.scrollHeight
    $(CpsCommonConst.drawSVGId).css({'width': clientWidth, 'height': clientHeight})
    CpsCommonVar.drawSvgWidth = clientWidth
    CpsCommonVar.drawSvgHeight = clientHeight
    CpsMainPanel.minWidth = clientWidth
    CpsMainPanel.minHeight = clientHeight
  }

  /** 清除工厂建模的所有事件，以便重新加载相应HTML时，减少缓存，加快浏览器反应速度
   * */
  static clearElementBindEvent() {
    $(CpsCommonVar.renderTo).unbind('contextmenu')
    $(CpsCommonVar.renderTo).unbind('mouseup')
    $(CpsCommonConst.controlsId).find('div[name=\'cpsControlTitle\']').unbind('click')
    $(CpsCommonConst.canvasId).unbind('keydown')
    $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').unbind('mousedown')
    $(CpsCommonConst.drawSVGId).find('circle[name=\'drawCircle\']').unbind('mousedown')
    $(CpsCommonConst.drawSVGId).find('polyline[name=\'drawLine\']').unbind('click')
    $(CpsCommonConst.canvasId).unbind('mousedown')
    $(CpsCommonConst.canvasId).unbind('mousemove')
    $(CpsCommonConst.canvasId).unbind('mouseup')
    $(CpsCommonConst.mainPanelId).find('div[name=\'cpsIcon\']').unbind('dragstart')
    $(CpsCommonConst.mainPanelId).find('div[name=\'cpsIcon\']').unbind('dragend')
    $(CpsCommonConst.canvasId).unbind('dragenter')
    $(CpsCommonConst.canvasId).unbind('dragover')
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('mouseup')
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('click')
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('dblclick')
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('mouseenter')
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('mouseleave')
    $(CpsCommonConst.drawSVGId).find('polyline[name=\'drawLine\']').unbind('click')
    $('#descriptionBox').unbind('click')
    $('#pointerTool').unbind('click')
    $('#vectorLine').unbind('click')
  }

  /** 设置CPS建模的建模模型【无，产线配置，标准工艺路线】，获取相应模型的CPS组件配置数据
   * produceControlLineId：CPS产线模型代码，为CPS产线模型的唯一标识
   * vcl：CPS产线模型视图界面
   * */
  static selFactoryModuleType(produceControlLineId, masterVcl) {
    let factoryModuleTypeStore = Ext.create("Ext.data.Store", {
      fields: ["Name", "Value"],
      data: [
        {Name: "无", Value: 0},
        {Name: "产线配置", Value: 1},
        {Name: "标准工艺路线", Value: 2}
      ]
    });
    let form = Ext.create('Ext.form.Panel', {
      bodyPadding: 5,
      width: '100%',
      height: '100%',
      defaults: {
        anchor: '100%'
      },
      cls: 'cps-x-panel',
      items: [
        {
          xtype: 'combobox',
          name: 'FactoryModuleType',
          fieldLabel: "工厂建模模型",
          store: factoryModuleTypeStore,
          displayField: "Name",
          valueField: "Value",
          value: 0,
          triggerAction: 'all',
          editable: false,
          mode: "local",
          queryMode: "local"
        }
      ],
      buttons: [
        {
          xtype: 'button',
          text: '确认',
          scale: 'medium',
          handler: function () {
            let factoryModuleType = this.up('form').getForm().findField('FactoryModuleType').getValue()
            CpsMainPanel.loadCpsConfigureView(produceControlLineId, factoryModuleType, masterVcl)
            let isShowWsTip = factoryModuleType === 1 ? false : true
            CpsEventPanel.sysEventPanel.items.getAt(5).setDisabled(isShowWsTip)
            CpsMainPanel.factoryModuleTypeWin.close()
          }
        }
      ]
    })
    CpsMainPanel.factoryModuleTypeWin = Ext.create('Ext.window.Window', {
      title: 'CPS建模的模型选择',
      height: 150,
      width: 300,
      closable: false,
      layout: 'fit',
      items: [form]
    })
    CpsMainPanel.factoryModuleTypeWin.show()
  }

  /** 初始化CPS建模界面，即加载产线模型数据Vue和相关的CPS动态组件配置数据Vue
   * produceControlLineId：CPS产线模型代码，为CPS产线模型的唯一标识
   * factoryModuleType：工厂建模模型，用于获取CPS组件配置下此模型的最新数据
   * vcl：CPS产线模型视图界面
   * */
  static loadCpsConfigureView(produceControlLineId, factoryModuleType, vcl) {
    $('#cpsLoading').css('display', 'block')
    CpsMainPanel.clearElementBindEvent()
    window.clearInterval(CpsEventPanel.taskNoTipInterval)
    // 根据CPS产线模型代码得到此产线模型数据列表
    CpsCommonFunc.getProduceControlLineList(produceControlLineId, function (list) {
      // 加载相应的画板中的组件和矢量线Vue
      CpsMainPanel.loadCanvasVue(list)
      // 加载CPS动态组件Vue
      CpsCommonFunc.getCpsControlConfigureList(CpsCommonVar.controlLineModels.ControlConfigId, factoryModuleType, function (list) {
        CpsSystemControls.loadControlConfigVue(list, true)
        CpsEventPanel.loadCpsConfigureEvent()    // 加载CPS工厂建模事件
        $('#cpsLoading').css('display', 'none')
        CpsMainPanel.initSizeDrawSvg()
      })
      CpsCommonVar.controlsAttrPanel.getForm().reset()
      CpsCommonVar.polylineAttrPanel.getForm().reset()
    })
    // 给当前的CPS产线配置的视图面板赋值
    CpsCommonVar.masterVcl = vcl
  }

  /** 显示当前CPS产线模型上的组件配置和矢量线配置明细数据
   * 显示出的组件和矢量线的布局跟实际画板上的布局是一致的，且不可操作组件和矢量线，只作为显示使用
   * */
  static showProduceControlLineModels() {
    let maxWidth = document.body.clientWidth * 0.8
    let maxHeight = document.body.clientHeight * 0.7

    let content = '<div class="cps-controls-layout-main" style="min-height:' + (maxHeight - 41) + 'px;min-width:' + (maxWidth - 11) + 'px;position:relative;overflow:auto;" id="cps_cavasId">'
    // 加载组件配置明细数据内容
    if (CpsCommonVar.controlLineModels && CpsCommonVar.controlLineModels.ControlDetail.length > 0) {
      content = content + CpsMainPanel.loadCanvasControlsVue(CpsCommonVar.controlLineModels)
    }
    // 加载矢量线配置明细数据内容
    if (CpsCommonVar.controlLineModels && CpsCommonVar.controlLineModels.VectorLineDetail.length > 0) {
      content = content + '<svg xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="100%" style="position: absolute;" id="cps_svgId">'
      content = content + '<defs><marker id="arrowPoint" markerUnits="strokeWidth" markerWidth="8" markerHeight="8" viewBox="0 0 12 12" refX="6" refY="6" orient="auto">'
      content = content + '<path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: red;" /></marker></defs>'
      for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
        let model = CpsCommonVar.controlLineModels.VectorLineDetail[i]
        content = content + '<polyline name="drawLine" id="' + model.LineId + '" points="' + model.Coordinates + '" data-startid="' + model.StartControlId + '" data-endid="' + model.EndControlId + '" data-starttype="' + model.ControlStartType + '" data-endtype="' + model.ControlEndType + '" marker-end="url(#arrowPoint)" style="fill:none;stroke:red;stroke-width:2;" />'
      }
      content = content + '</svg>'
    }
    content = content + '</div>'
    // 将内容加载到panel中
    let panel = Ext.create('Ext.panel.Panel', {
      border: false,
      width: '100%',
      height: '100%',
      html: content
    })
    let title = 'CPS产线模型配置'
    if (CpsCommonVar.controlLineModels.ProduceControlLineName) {
      title = CpsCommonVar.controlLineModels.ProduceControlLineName
    }
    // 创建window，将上面的panel加载到这个弹框中并显示出来
    let win = Ext.create('Ext.window.Window', {
      title: title,
      titleAlign: 'center',
      constrain: true,
      closable: true,
      draggable: true,
      resizable: false,
      width: maxWidth,
      height: maxHeight,
      border: false,
      layout: 'fit',
      items: panel
    })
    win.show()
    // 计算出当前显示内容的实际宽高度并给画板赋值
    $('#cps_svgId').attr({
      'height': $('#cps_cavasId')[0].scrollHeight + 'px',
      'width': $('#cps_cavasId')[0].scrollWidth + 'px'
    })
  }

  /** 双击打开标准工艺路线的新增或修改页面，并进行模型数据的附加
   * vcl：当前标准工艺路线的数据表逻辑结构
   * data：标准工艺路线的模型数据
   * */
  static FillTechRouteGridData(vcl, data) {
    let masterRow = vcl.dataSet.getTable(0).data.items[0]
    masterRow.set('TECHROUTEID', data.TechRouteId)
    masterRow.set('TECHROUTENAME', data.TechRouteName)
    masterRow.set('TECHROUTETYPEID', data.TechRouteTypeId)
    masterRow.set('TECHROUTETYPENAME', data.TechRouteTypeName)
    masterRow.set('ISPARALLELTECHROUTE', data.IsParallelTechRoute)
    masterRow.set('BIZATTR', data.BizAttr)
    masterRow.set('VERSION', data.Version)
    masterRow.set('MATERIALID', data.MaterialId)
    masterRow.set('MATERIALNAME', data.MaterialName)
    masterRow.set('MATERIALSPEC', data.MaterialSpec)
    masterRow.set('UNITID', data.UnitId)
    masterRow.set('UNITNAME', data.UnitName)
    vcl.forms[0].loadRecord(masterRow)

    // 关闭Ext布局
    Ext.suspendLayouts();
    let curStore = vcl.dataSet.getTable(1);
    // 关闭store事件
    curStore.suspendEvents();
    try {
      // 删除当前grid的数据
      vcl.dataSet.getTable(1).removeAll();
      vcl.dataSet.getTable(2).removeAll();
      // 找到表头的数据
      let masterRow = vcl.dataSet.getTable(0).data.items[0];
      // 一般是中间层返回来的数据，中间可能定义的是dictionary,在前段反序列化之后是对象
      if (data != undefined && data.WorkProcessDetail.length > 0) {
        for (let i = 0; i < data.WorkProcessDetail.length; i++) {
          let info = data.WorkProcessDetail[i];
          // 这个方法第一个参数是表头数据行，第二个参数是当前grid数据源store所属第几个表
          let newRow = vcl.addRow(masterRow, 1);
          newRow.set("TECHROUTEID", info.TechRouteId);
          newRow.set("ROW_ID", info.RowId);
          newRow.set("ROWNO", info.RowNo);
          newRow.set("WORKSHOPSECTIONID", info.WorkShopSectionId);
          newRow.set("WORKSHOPSECTIONNAME", info.WorkShopSectionName);
          newRow.set("WORKPROCESSID", info.WorkProcessId);
          newRow.set("WORKPROCESSNAME", info.WorkProcessName);
          newRow.set("PRODUCTDETAIL", info.ProductDetail);
          newRow.set("WORKSTATIONCONFIGID", info.WorkStationConfigId);
          newRow.set("WORKSTATIONCONFIGNAME", info.WorkStationConfigName);
          newRow.set("WORKPROCESSNO", info.WorkProcessNo);
          newRow.set("TRANSFERWORKPROCESSNO", info.TransferWorkProcessNo);
          newRow.set("NEEDGATHER", info.NeedGather);
          newRow.set("DOWORKPROCESS", info.DoWorkProcess);
          for (let j = 0; j < info.ProductOuterDetail.length; j++) {
            let product = info.ProductOuterDetail[j];
            let subRow = vcl.addRow(newRow, 2);
            subRow.set("TECHROUTEID", product.TechRouteId);
            subRow.set("PARENTROWID", product.ParentRowId);
            subRow.set("ROW_ID", product.RowId);
            subRow.set("ROWNO", product.RowNo);
            subRow.set("MATERIALID", product.MaterialId);
            subRow.set("MATERIALNAME", product.MaterialName);
            subRow.set("MATERIALTYPEID", product.MaterialTypeId);
            subRow.set("MATERIALTYPENAME", product.MaterialTypeName);
            subRow.set("ISPRODUCT", product.IsProduct);
          }
        }
      }
    } finally {
      // 打开store事件
      curStore.resumeEvents();
      if (curStore.ownGrid && curStore.ownGrid.getView().store != null)
        curStore.ownGrid.reconfigure(curStore);
      // 打开Ext布局
      Ext.resumeLayouts(true);
    }
  }

  /** 建立标准工艺路线上的组件布局
   * techRouteControlId：标准工艺路线的组件ID
   * controlName：标准工艺路线的功能名称
   * techRouteId：标准工艺路线的关联主数据ID
   * techRouteName：标准工艺路线的关联主数据名称
   * isCopy：标准工艺路线的数据模型是否进行复制操作
   * */
  static buildControlLayout(techRouteControlId, controlName, techRouteId, techRouteName, isCopy) {
    let materialId = undefined
    // 复制当前标准工艺路线时，确保物料必须存在且有关联
    if (isCopy) {
      for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
        let lineModel = CpsCommonVar.controlLineModels.VectorLineDetail[i]
        if (lineModel.EndControlId === techRouteControlId && lineModel.StartControlId.indexOf(CpsCommonConst.comMaterial) === 0) {
          for (let j = 0; j < CpsCommonVar.controlLineModels.ControlDetail.length; j++) {
            let controlModel = CpsCommonVar.controlLineModels.ControlDetail[j]
            if (controlModel.ControlId === lineModel.StartControlId) {
              materialId = controlModel.RelId
              break
            }
          }
          break
        }
      }
    }
    if (isCopy && !materialId) {
      Ext.Msg.alert('提示', '复制当前标准工艺路线需要先关联上物料数据')
    } else {
      CpsMainPanel.getTechRouteData(techRouteId, materialId, isCopy, function (techRouteModel) {
        CpsControlsAttr.setControlRelIdName(techRouteControlId, controlName, techRouteModel.TechRouteId, techRouteModel.TechRouteName)
        CpsMainPanel.resetTechRouteLayout(techRouteControlId, techRouteModel)
      })
    }
  }

  /** 根据当前标准工艺路线的ID返回其本身或复制的数据模型
   * techRouteId:标准工艺路线的唯一标识
   * materialId:物料的唯一标识
   * isCopy:是否要复制当前标准工艺路线的数据模型，true表示复制，false表示不复制
   * callback:返回当前标准工艺路线本身或复制的数据模型
   * */
  static getTechRouteData(techRouteId, materialId, isCopy, callback) {
    Ext.Ajax.request({
      url: '/CpsModule/GetTechRouteInfoById',
      jsonData: {techRouteId: techRouteId, materialId: materialId, isCopy: isCopy},
      method: 'POST',
      async: false,
      timeout: 90000000,
      success: function (response) {
        let result = Ext.decode(response.responseText)
        if (result.Messages.length > 0) {
          let errMsg = []
          for (let i = 0; i < result.Messages.length; i++) {
            errMsg.push({kind: result.Messages[i].MessageKind, msg: result.Messages[i].Message})
          }
          Ax.utils.LibMsg.show(errMsg)
        } else {
          let techRouteModel = result.Result;
          callback(techRouteModel)
        }
      },
      failure: function (response) {
        let result = Ext.decode(response.responseText)
        if (result.Messages.length > 0) {
          Ext.Msg.alert('异常提示', result.Messages[0].Message)
        } else {
          if (isCopy) {
            Ext.Msg.alert('提示', '复制当前标准工艺路线[' + techRouteId + ']数据出现异常')
          } else {
            Ext.Msg.alert('提示', '获取当前标准工艺路线[' + techRouteId + ']数据出现异常')
          }
        }
      }
    })
  }

  /** 重置标准工艺路线的位置和大小
   * techRouteControlId：标准工艺路线的组件ID
   * techRouteModel：标准工艺路线的数据模型
   * */
  static resizeTechRouteControl(techRouteControlId, techRouteModel) {
    let trModel = undefined
    let workProcessCount = 0              // 标准工艺路线下的工序个数
    for (let i = 0; i < techRouteModel.WorkShopSectionDetail.length; i++) {
      let workShopSectionModel = techRouteModel.WorkShopSectionDetail[i]
      workProcessCount = workProcessCount + workShopSectionModel.WorkProcessNodeList.length
    }
    for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
      let model = CpsCommonVar.controlLineModels.ControlDetail[i]
      if (model.ControlId === techRouteControlId) {
        let isVerticalLayout = model.ControlWidth > model.ControlHeight ? false : true      // 标准工艺路线的横向（false）和竖向（true）布局
        let hSpace = isVerticalLayout ? 20 : 10                  // 组件的宽度
        let vSpace = isVerticalLayout ? 10 : 20                  // 组件的宽度
        let standardSize = CpsCommonConst.workProcessSize + CpsCommonConst.materialSize + CpsCommonConst.materialTypeSize + CpsCommonConst.workstationConfigSize
        standardSize = isVerticalLayout ? standardSize + vSpace * 4 : standardSize + hSpace * 4       // 入口工序【包含站点配置、物料类别、物料】的标准宽高度
        let size = isVerticalLayout ? workProcessCount * standardSize - vSpace : workProcessCount * standardSize - hSpace
        let left = isVerticalLayout ? CpsCommonConst.techRouteTypeSize + hSpace + 10 : 10
        let top = isVerticalLayout ? 10 : CpsCommonConst.techRouteTypeSize + vSpace + 10
        model.XCoordinate = isVerticalLayout ? (model.XCoordinate > left ? model.XCoordinate : left) : (model.XCoordinate > 10 ? model.XCoordinate : 10)
        model.YCoordinate = isVerticalLayout ? (model.YCoordinate > 10 ? model.YCoordinate : 10) : (model.YCoordinate > top ? model.YCoordinate : top)
        model.ControlWidth = isVerticalLayout ? 70 : size
        model.ControlHeight = isVerticalLayout ? size : 70
        let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + model.ControlId + '\']')
        cpsControl.css({
          'width': model.ControlWidth + 'px',
          'height': model.ControlHeight + 'px',
          'left': model.XCoordinate + 'px',
          'top': model.YCoordinate + 'px'
        })
        cpsControl.find('img').css({'width': '40px', 'height': '40px'})
        trModel = {
          'isVerticalLayout': isVerticalLayout,
          'x': model.XCoordinate,
          'y': model.YCoordinate,
          'w': model.ControlWidth,
          'h': model.ControlHeight,
          'hSpace': hSpace,
          'vSpace': vSpace,
          'size': standardSize
        }
        break
      }
    }
    return trModel
  }

  /** 重置标准工艺路线的组件布局并加载相关事件，创建相关组件和其矢量线
   * techRouteControlId：标准工艺路线的组件ID
   * techRouteModel：标准工艺路线的数据模型
   * */
  static resetTechRouteLayout(techRouteControlId, techRouteModel) {
    CpsMainPanel.controlAttrArr = []
    CpsMainPanel.clearElementBindEvent()
    CpsMainPanel.delAllTechRouteControlLines(techRouteControlId)
    CpsCommonFunc.removeControlSelStyle()
    let trModel = CpsMainPanel.resizeTechRouteControl(techRouteControlId, techRouteModel)
    if (!trModel) {
      Ext.Msg.alert('提示', '标准工艺路线[' + techRouteControlId + ']数据出现异常')
      return
    }
    let size = trModel.size
    // 当布局为竖向时，组件的高度大于宽度（工序、站点配置、物料类别、物料组件宽高大小相反）
    let trtHeight = trModel.isVerticalLayout ? parseInt((trModel.h - trModel.vSpace) / 2) : CpsCommonConst.techRouteTypeSize    // 标准工艺类别和物料的高度
    let trtWidth = trModel.isVerticalLayout ? CpsCommonConst.techRouteTypeSize : parseInt((trModel.w - trModel.hSpace) / 2)     // 标准工艺类别和物料的宽度
    let trtLeft = trModel.isVerticalLayout ? trModel.x - trtWidth - trModel.hSpace : trModel.x                                  // 标准工艺类别或物料的X坐标
    let trtTop = trModel.isVerticalLayout ? trModel.y : trModel.y - trtHeight - trModel.vSpace                                  // 标准工艺类别或物料的的Y坐标
    let trtIndex = trModel.isVerticalLayout ? '2-4' : '3-1'                                                                       // 物料的矢量点位置
    // 标准工艺类别--标准工艺路线  竖向布局
    let techRouteTypeControlId = CpsMainPanel.createCpsControl(trtLeft, trtTop, trtWidth, trtHeight, CpsCommonConst.comTechRouteType, techRouteModel.TechRouteTypeId, techRouteModel.TechRouteTypeName)
    CpsMainPanel.createVectorLine(techRouteTypeControlId, techRouteControlId, trtIndex)

    let mLeft = trModel.isVerticalLayout ? trtLeft : trtLeft + trModel.w - trtWidth   // 物料的X坐标
    let mTop = trModel.isVerticalLayout ? trtTop + trModel.h - trtHeight : trtTop     // 物料的Y坐标
    let mIndex = trModel.isVerticalLayout ? '2-4' : '3-1'                               // 物料的矢量点位置
    // 物料--标准工艺路线  竖向/横向布局
    let materialControlId = CpsMainPanel.createCpsControl(mLeft, mTop, trtWidth, trtHeight, CpsCommonConst.comMaterial, techRouteModel.MaterialId, techRouteModel.MaterialName)
    CpsMainPanel.createVectorLine(materialControlId, techRouteControlId, mIndex)

    let entryWorkProcessCount = 0     // 入口工序的个数
    // 解析标准工艺路线下的工段【工序、站点配置、物料类别、物料】的布局
    for (let i = 0; i < techRouteModel.WorkShopSectionDetail.length; i++) {
      let workShopSectionModel = techRouteModel.WorkShopSectionDetail[i]                    // 工段模型

      let wsWidth = trModel.isVerticalLayout ? CpsCommonConst.workshopSectionSize : workShopSectionModel.WorkProcessNodeList.length * size - trModel.hSpace     // 工段的宽度
      let wsHeight = trModel.isVerticalLayout ? workShopSectionModel.WorkProcessNodeList.length * size - trModel.vSpace : CpsCommonConst.workshopSectionSize    // 工段的高度
      let wsLeft = trModel.isVerticalLayout ? trModel.x + trModel.w + trModel.hSpace : trModel.x + entryWorkProcessCount * size                                 // 工段的X坐标
      let wsTop = trModel.isVerticalLayout ? trModel.y + entryWorkProcessCount * size : trModel.y + trModel.w + trModel.vSpace                                  // 工段的Y坐标
      let wsIndex = trModel.isVerticalLayout ? '2-4' : '3-1'                                                                                                      // 工段的矢量点位置
      // 标准工艺路线--工段  竖向/横向布局
      let workshopSectionId = CpsMainPanel.createCpsControl(wsLeft, wsTop, wsWidth, wsHeight, CpsCommonConst.comWorkshopSection, workShopSectionModel.WorkShopSectionId, workShopSectionModel.WorkShopSectionName)
      CpsMainPanel.createVectorLine(techRouteControlId, workshopSectionId, wsIndex)

      // 解析工段下入口工序和转入工序【站点配置、物料类别、物料】的布局
      for (let j = 0; j < workShopSectionModel.WorkProcessNodeList.length; j++) {
        let WorkProcessNode = workShopSectionModel.WorkProcessNodeList[j]     // 工段模型下工序关系树模型
        let entryWorkProcess = WorkProcessNode.WorkProcess                    // 工段模型下工序关系树模型下入口工序
        let workProcessChild = WorkProcessNode.WorkProcessChild               // 工段模型下工序关系树模型下入口工序的指向工序集

        let ewcHeight = trModel.isVerticalLayout ? CpsCommonConst.workstationConfigSize : 160    // 入口工序上站点配置的高度
        let ewcWidth = trModel.isVerticalLayout ? 160 : CpsCommonConst.workstationConfigSize     // 入口工序上站点配置的宽度
        let ewpLeft = trModel.isVerticalLayout ? wsLeft + wsWidth + trModel.hSpace : wsLeft + j * size + ewcWidth + trModel.hSpace // 入口工序的X坐标
        let ewpTop = trModel.isVerticalLayout ? wsTop + j * size + ewcHeight + trModel.vSpace : wsTop + wsHeight + trModel.vSpace // 入口工序的Y坐标
        CpsMainPanel.createWorkProcessControls(trModel, workshopSectionId, entryWorkProcess, workProcessChild, ewpLeft, ewpTop)
      }
      entryWorkProcessCount = workShopSectionModel.WorkProcessNodeList.length + entryWorkProcessCount
    }
    CpsEventPanel.loadCpsConfigureEvent()    // 加载CPS工厂建模事件
  }

  /** 创建工序组件并创建其关联的站点配置、物料类别、物料组件和创建其关联矢量线
   * trModel：标准工艺路线的组件数据模型，包括布局方式，宽高位置，标准宽高，横竖向间距等
   * startControlId：工序的连接矢量线的起始组件
   * workProcess：工序的数据模型
   * workProcessChild：工序关系树模型下入口工序的指向工序集
   * wpLeft：工序的X坐标
   * wpTop：工序的Y坐标
   * */
  static createWorkProcessControls(trModel, startControlId, workProcess, workProcessChild, wpLeft, wpTop) {
    let wpHeight = trModel.isVerticalLayout ? CpsCommonConst.workProcessSize : 160          // 入口工序、转入工序的高度
    let wpWidth = trModel.isVerticalLayout ? 160 : CpsCommonConst.workProcessSize           // 入口工序、转入工序的宽度
    let wpIndex = trModel.isVerticalLayout ? '2-4' : '3-1'                                    // 入口工序、转入工序的矢量点位置
    // 工段--入口工序或入口工序--转入工序  横向/竖向布局
    let workProcessId = CpsMainPanel.createCpsControl(wpLeft, wpTop, wpWidth, wpHeight, CpsCommonConst.comWorkProcess, workProcess.WorkProcessId, workProcess.WorkProcessName)
    CpsMainPanel.createVectorLine(startControlId, workProcessId, wpIndex)
    if (workProcess.WorkStationConfigId) {
      let wcHeight = trModel.isVerticalLayout ? CpsCommonConst.workstationConfigSize : 160    // 入口工序/转入工序上站点配置的高度
      let wcWidth = trModel.isVerticalLayout ? 160 : CpsCommonConst.workstationConfigSize     // 入口工序/转入工序上站点配置的宽度
      let wcLeft = trModel.isVerticalLayout ? wpLeft : wpLeft - wcWidth - trModel.hSpace      // 入口工序/转入工序上站点配置的Y坐标
      let wcTop = trModel.isVerticalLayout ? wpTop - wcHeight - trModel.vSpace : wpTop        // 入口工序/转入工序上站点配置的Y坐标
      let wcIndex = trModel.isVerticalLayout ? '3-1' : '2-4'                                    // 入口工序/转入工序上站点配置的矢量点位置
      // 站点配置--入口工序/转入工序  横向/竖向布局
      let workstationConfigId = CpsMainPanel.createCpsControl(wcLeft, wcTop, wcWidth, wcHeight, CpsCommonConst.comWorkstationConfig, workProcess.WorkStationConfigId, workProcess.WorkStationConfigName)
      CpsMainPanel.createVectorLine(workstationConfigId, workProcessId, wcIndex)
    }

    for (let k = 0; k < workProcess.ProductOuterDetail.length; k++) {
      let productOuterDetail = workProcess.ProductOuterDetail[k]
      if (productOuterDetail.MaterialTypeId) {
        let wtHeight = trModel.isVerticalLayout ? CpsCommonConst.materialTypeSize : 160                                       // 入口工序/转入工序上物料类别的高度
        let wtWidth = trModel.isVerticalLayout ? 160 : CpsCommonConst.materialTypeSize                                        // 入口工序/转入工序上物料类别的宽度
        let wtLeft = trModel.isVerticalLayout ? wpLeft + k * (wpWidth + trModel.hSpace) : wpLeft + wpWidth + trModel.hSpace   // 入口工序/转入工序上物料类别的X坐标
        let wtTop = trModel.isVerticalLayout ? wpTop + wpHeight + trModel.vSpace : wpTop + k * (wpHeight + trModel.vSpace)    // 入口工序/转入工序上物料类别的Y坐标
        let wtIndex = trModel.isVerticalLayout ? '1-3' : '4-2'                                                                  // 入口工序/转入工序上物料类别的矢量点位置
        // 物料类别--入口工序/转入工序  横向/竖向布局
        let materialTypeId = CpsMainPanel.createCpsControl(wtLeft, wtTop, wtWidth, wtHeight, CpsCommonConst.comMaterialType, productOuterDetail.MaterialTypeId, productOuterDetail.MaterialTypeName)
        CpsMainPanel.createVectorLine(materialTypeId, workProcessId, wtIndex)
        if (productOuterDetail.MaterialId) {
          let ewHeight = trModel.isVerticalLayout ? CpsCommonConst.materialSize : 160             // 入口工序/转入工序上物料的高度
          let ewWidth = trModel.isVerticalLayout ? 160 : CpsCommonConst.materialSize              // 入口工序/转入工序上物料的宽度
          let ewLeft = trModel.isVerticalLayout ? wtLeft : wtLeft + wtWidth + trModel.hSpace      // 入口工序/转入工序上物料的X坐标
          let ewTop = trModel.isVerticalLayout ? wtTop + wtHeight + trModel.vSpace : wtTop        // 入口工序/转入工序上物料的Y坐标
          let ewIndex = trModel.isVerticalLayout ? '1-3' : '4-2'                                    // 入口工序/转入工序上物料的矢量点位置
          // 物料--物料类别  横向/竖向布局
          let materialId = CpsMainPanel.createCpsControl(ewLeft, ewTop, ewWidth, ewHeight, CpsCommonConst.comMaterial, productOuterDetail.MaterialId, productOuterDetail.MaterialName)
          CpsMainPanel.createVectorLine(materialId, materialTypeId, ewIndex)
        }
      }
    }
    // 在入口工序的指向工序集中找到当前工序的下一级工序【若在标准工艺路线上所有关联组件的属性数据集合中已存在此转入工序，则停止循环创建工序】
    let transferWorkProcess = undefined
    for (let i = 0; i < workProcessChild.length; i++) {
      if (workProcess.TransferWorkProcessNo === workProcessChild[i].WorkProcessNo) {
        transferWorkProcess = workProcessChild[i]
        for (let i = 0; i < CpsMainPanel.controlAttrArr.length; i++) {
          let controlAttr = CpsMainPanel.controlAttrArr[i]
          if (controlAttr.relId === transferWorkProcess.WorkProcessId && controlAttr.controlFilter === CpsCommonConst.comWorkProcess && controlAttr.relName === transferWorkProcess.WorkProcessName) {
            CpsMainPanel.createVectorLine(workProcessId, controlAttr.controlId, wpIndex)
            transferWorkProcess = undefined
            break
          }
        }
        break
      }
    }
    if (transferWorkProcess) {
      wpLeft = trModel.isVerticalLayout ? wpLeft + wpWidth + trModel.hSpace : wpLeft   // 转入工序的X坐标
      wpTop = trModel.isVerticalLayout ? wpTop : wpTop + wpHeight + trModel.vSpace     // 转入工序的Y坐标
      CpsMainPanel.createWorkProcessControls(trModel, workProcessId, transferWorkProcess, workProcessChild, wpLeft, wpTop)
    }
  }

  /** 创建CPS组件
   * x：组件的X坐标
   * y：组件的Y坐标
   * w：组件的宽度
   * h：组件的高度
   * controlFilter：组件的功能类型
   * relId：组件的关联主数据ID
   * relName：组件的关联主数据名称
   * */
  static createCpsControl(x, y, w, h, controlFilter, relId, relName) {
    let controlId = undefined
    for (let i = 0; i < CpsMainPanel.controlAttrArr.length; i++) {
      let controlAttr = CpsMainPanel.controlAttrArr[i]
      if (controlAttr.relId === relId && controlAttr.controlFilter === controlFilter && controlAttr.relName === relName) {
        controlAttr.OccurrenceTimes = controlAttr.OccurrenceTimes + 1
        controlId = controlAttr.controlId
        break
      }
    }
    if (!controlId) {
      let cpsControlId = controlFilter.substring(0, controlFilter.length - 1);
      let cpsControl = $(CpsCommonConst.cpsControlsId).find('div[id=\'' + cpsControlId + '\']').clone()
      if (cpsControl) {
        controlId = cpsControlId + '_' + parseInt(Math.random() * 1000)
        while ($(CpsCommonConst.canvasId).find('div[id=\'' + id + '\']').length > 0) {
          controlId = cpsControlId + '_' + parseInt(Math.random() * 1000)
        }
        let imgSize = w > h ? h - 30 : w - 30
        let controlName = cpsControl.find('div.cps-controls-span').text() + '[' + relName + ']'
        cpsControl = cpsControl.attr({'id': controlId, 'data-relid': relId})
        cpsControl.css({
          'position': 'absolute',
          'margin': '0',
          'width': w + 'px',
          'height': h + 'px',
          'left': x + 'px',
          'top': y + 'px'
        })
        cpsControl.find('div.cps-controls-region').css('border', '1px solid #d2c06c')
        cpsControl.find('img').css({'width': imgSize + 'px', 'height': imgSize + 'px'})
        cpsControl.find('div.cps-controls-span').text(controlName)
        let model = CpsControlsAttr.getControlAttr(cpsControl)
        CpsCommonVar.controlLineModels.ControlDetail.push(model)
        $(CpsCommonConst.canvasId).append(cpsControl)
        CpsMainPanel.resizeDrawSvg(cpsControl)
        let controlAttr = {
          'x': x,
          'y': y,
          'w': w,
          'h': h,
          'controlId': controlId,
          'relId': relId,
          'relName': relName,
          'controlFilter': controlFilter,
          'OccurrenceTimes': 1
        }
        CpsMainPanel.controlAttrArr.push(controlAttr)
      }
    }
    return controlId
  }

  /** 创建CPS组件关联的矢量线
   * startControlId：矢量线的起始组件
   * endControlId：矢量线的结束组件
   * pointIndex：矢量线的组件连接类型，用'-'分隔表示起始组件类型和结束组件类型
   * */
  static createVectorLine(startControlId, endControlId, pointIndex) {
    // 若矢量线已存在，将不再重建一条矢量线
    let polyline = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + startControlId + '\'][data-endid=\'' + endControlId + '\']')
    if (polyline && polyline.length > 0) {
      return
    }
    let startControl = $(CpsCommonConst.canvasId).find('div[id=\'' + startControlId + '\']')
    let endControl = $(CpsCommonConst.canvasId).find('div[id=\'' + endControlId + '\']')
    let startPointIndex = parseInt(pointIndex.split('-')[0])
    let endPointIndex = parseInt(pointIndex.split('-')[1])
    if (startControl && endControl) {
      let startRectPoints = CpsCommonFunc.getElementPoints(startControl, 'controlRect')
      let endRectPoints = CpsCommonFunc.getElementPoints(endControl, 'controlRect')
      let startRectIndex = startPointIndex - 1
      let endRectIndex = endPointIndex - 1
      let startControlPoint = CpsCommonFunc.getPolylineStartOrEndPoint(startRectPoints[startRectIndex].x, startRectPoints[startRectIndex].y, startPointIndex, true)
      let endControlPoint = CpsCommonFunc.getPolylineStartOrEndPoint(endRectPoints[endRectIndex].x, endRectPoints[endRectIndex].y, endPointIndex, false)
      let x1 = parseInt(startControlPoint.split(',')[0])
      let y1 = parseInt(startControlPoint.split(',')[1])
      let x2 = parseInt(endControlPoint.split(',')[0])
      let y2 = parseInt(endControlPoint.split(',')[1])
      let points = CpsCommonFunc.getPointsByStyle(x1, y1, x2, y2, startPointIndex, endPointIndex)
      let polyline = CpsEventPanel.createSvgPolyline(points, startControlId, startPointIndex, endControlId, endPointIndex)
      if (polyline) {
        $(CpsCommonConst.drawSVGId).append(polyline)
        let model = {
          'ProduceControlLineId': '',
          'RowId': 0,
          'RowNo': 0,
          'StartControlId': startControlId,
          'EndControlId': endControlId,
          'LineId': $(polyline).attr('id'),
          'Coordinates': points,
          'ControlStartType': startPointIndex,
          'ControlEndType': endPointIndex
        }
        CpsCommonVar.controlLineModels.VectorLineDetail.push(model)
      }
    }
  }

  /** 去除当前标准工艺路线下的组件布局
   * controlId：当前标准工艺路线的组件ID
   * */
  static delAllTechRouteControlLines(controlId) {
    let controlIdArr = []
    // 检索出跟标准工艺路线相关联的工段的组件ID数组
    let workshopSectionIdArr = []
    // 标准工艺路线去除相关联的组件矢量线的矢量线数据数组
    let trVectorArray = []
    // 检索出所有跟标准工艺路线相关联的物料/标准工艺类型/工段的组件ID放入controlIdArr并删除其矢量线和矢量线数据
    for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
      let model = CpsCommonVar.controlLineModels.VectorLineDetail[i]
      // 检索出所有跟标准工艺路线相关联的起始物料/起始标准工艺类型/结束工段的组件ID
      if (model.EndControlId === controlId && (model.StartControlId.indexOf(CpsCommonConst.comMaterial) === 0 || model.StartControlId.indexOf(CpsCommonConst.comTechRouteType) === 0)) {
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
        controlIdArr.push(model.StartControlId)
      } else if (model.StartControlId === controlId && model.EndControlId.indexOf(CpsCommonConst.comWorkshopSection) === 0) {
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
        controlIdArr.push(model.EndControlId)
        workshopSectionIdArr.push(model.EndControlId)
      } else {
        trVectorArray.push(model)
      }
    }
    // 检索出所有跟工段相关联的入口工序的组件ID数组
    let workProcessIdArray = []
    // 工段去除相关联的组件矢量线的矢量线数据数组
    let wsVectorArray = []
    // 检索出所有跟工段相关联的工序的组件ID并删除其矢量线和矢量线数据
    for (let i = 0; i < trVectorArray.length; i++) {
      let model = trVectorArray[i]
      // 检索出所有跟工段相关联的入口工序的组件ID
      if ($.inArray(model.StartControlId, workshopSectionIdArr) !== -1 && model.EndControlId.indexOf(CpsCommonConst.comWorkProcess) === 0) {
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
        controlIdArr.push(model.EndControlId)
        workProcessIdArray.push(model.EndControlId)
      } else {
        wsVectorArray.push(model)
      }
    }

    CpsCommonVar.controlLineModels.VectorLineDetail = wsVectorArray
    // 检索出所有跟入口工序相关联的工序、站点配置、物料类别（物料）的组件ID并删除其矢量线和矢量线数据
    while (workProcessIdArray.length > 0) {
      workProcessIdArray = CpsMainPanel.delWorkProcessRelLines(workProcessIdArray, controlIdArr)
    }
    // 标准工艺路线去除相关联的组件布局的组件数据数组
    let controlArray = []
    for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
      let model = CpsCommonVar.controlLineModels.ControlDetail[i]
      if ($.inArray(model.ControlId, controlIdArr) !== -1) {
        $(CpsCommonConst.canvasId).find('div[id=\'' + model.ControlId + '\']').remove()
      } else {
        controlArray.push(model)
      }
    }
    CpsCommonVar.controlLineModels.ControlDetail = controlArray
  }

  /** 去除当前工序数组上的关联矢量线并返回当前工序的下级工序的工序组件ID数组
   * startWorkProcessIdArray：当前工序的组件ID数组
   * controlIdArr：与标准工艺路线相关联的组件ID数组
   * */
  static delWorkProcessRelLines(startWorkProcessIdArray, controlIdArr) {
    let workProcessIdArray = []                                      // 检索出所有跟工序相关联的工序的组件ID数组
    let materialTypeIdArray = []                                     // 检索出所有跟工序相关联的起始物料类别的组件ID数组
    let wpVectorArray = []                                         // 工序去除相关联的组件矢量线的矢量线数据数组
    for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
      let model = CpsCommonVar.controlLineModels.VectorLineDetail[i]
      // 检索出所有跟工序相关联的开始站点配置/开始物料类别/结束工序的组件ID
      if ($.inArray(model.EndControlId, startWorkProcessIdArray) !== -1 && model.StartControlId.indexOf(CpsCommonConst.comWorkstationConfig) === 0) {
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
        controlIdArr.push(model.StartControlId)
      } else if ($.inArray(model.EndControlId, startWorkProcessIdArray) !== -1 && model.StartControlId.indexOf(CpsCommonConst.comMaterialType) === 0) {
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
        controlIdArr.push(model.StartControlId)
        materialTypeIdArray.push(model.StartControlId)
      } else if ($.inArray(model.StartControlId, startWorkProcessIdArray) !== -1 && model.EndControlId.indexOf(CpsCommonConst.comWorkProcess) === 0) {
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
        controlIdArr.push(model.EndControlId)
        workProcessIdArray.push(model.EndControlId)
      } else {
        wpVectorArray.push(model)
      }
    }

    let mtVectorArray = []                                         // 物料类别去除相关联的组件矢量线的矢量线数据数组
    // 检索出所有跟物料类别相关联的物料的组件ID并删除其矢量线和矢量线数据
    for (let i = 0; i < wpVectorArray.length; i++) {
      let model = wpVectorArray[i]
      // 检索出所有跟物料类别相关联的起始物料的组件ID
      if ($.inArray(model.EndControlId, materialTypeIdArray) !== -1 && model.StartControlId.indexOf(CpsCommonConst.comMaterial) === 0) {
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
        controlIdArr.push(model.StartControlId)
      } else {
        mtVectorArray.push(model)
      }
    }

    CpsCommonVar.controlLineModels.VectorLineDetail = mtVectorArray
    return workProcessIdArray;
  }
}
export {CpsMainPanel}
