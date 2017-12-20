/**********************************************************************
 * CopyRight 2017 杭州集控科技有限公司 版权所有
 * 功能描述：通用事件模块的主窗口
 * 创建标识：Huangwz 2017/05/12
 *
 * 修改标识：Huangwz 2017/05/12
 *
 ************************************************************************/
import {CpsCommonFunc, CpsCommonVar, CpsCommonConst} from './CpsCommon'
import {CpsMainPanel} from './CpsMainPanel'
import {CpsSystemControls} from './CpsSystemControls'
import {CpsProgramControls} from './CpsProgramControls'
import {CpsPolylineAttr} from './CpsPolylineAttr'
import {CpsControlsAttr} from './CpsControlsAttr'
class CpsEventPanel {
  // 系统事件panel
  static sysEventPanel = true
  // 要复制的CPS功能组件
  static showAttrFormPanel = true
  // 定时查看产线模型的工作站点中的派工单执行情况
  static taskNoTipInterval = null
  // 要开启的产线模型的工作站点中的派工单执行情况
  static isShowTaskNoTip = true
  // 要复制的CPS功能组件
  static copyCpsControl = null
  // 要复制的SVG矢量线
  static copySvgPolyline = null
  // 要复制的SVG矢量线
  static isPasteCpsControl = true

  /** 初始化CPS建模，使CPS建模处于新增状态并恢复默认设置
   * */
  static reInitCpsConfigureView() {
    CpsCommonVar.controlLineModels = {
      'ProduceControlLineId': '',
      'ProduceControlLineName': '',
      'ControlConfigId': '',
      'FactoryModuleType': 0,
      'State': 0,
      'ControlDetail': [],
      'VectorLineDetail': []
    }
    CpsCommonVar.masterVcl = null
    CpsCommonVar.selControlId = null
    CpsCommonVar.selVectorLineId = null
    CpsCommonVar.vectorLineIndex = 1
    CpsEventPanel.isShowTaskNoTip = true
    CpsEventPanel.sysEventPanel.items.getAt(5).setText('开启动态展示')
    $('#pointerTool').click()
    if ($('#descriptionBox').attr('data-checked')) {
      $('#descriptionBox').click()
    }
    CpsMainPanel.selFactoryModuleType(undefined, null)
  }

  /** 根据生产线关联主数据ID和工作站点关联主数据ID获得此产线下的此工作站点DOM
   * produceLineRelId：生产线关联主数据ID
   * workStationId：工作站点关联主数据ID
   * */
  static getProduceLineOfWorkStation(produceLineRelId, workStationId) {
    let workstations = $(CpsCommonConst.canvasId).find('div[data-progid=\'com.Workstation\'][data-relid=\'' + workStationId + '\']')
    if (workstations && workstations.length > 0) {
      for (let i = 0; i < workstations.length; i++) {
        let controlId = $(workstations[i]).attr('id')
        let workProcessId = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + controlId + '\'][data-endid^=\'' + CpsCommonConst.comWorkProcess + '\']').attr('data-endid')
        let workSectionId = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + workProcessId + '\'][data-endid^=\'' + CpsCommonConst.comWorkshopSection + '\']').attr('data-endid')
        let produceLineId = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + workSectionId + '\'][data-endid^=\'' + CpsCommonConst.comProduceLine + '\']').attr('data-endid')
        let relId = $(CpsCommonConst.canvasId).find('div[id=\'' + produceLineId + '\']').attr('data-relid')
        if (produceLineRelId === relId) {
          return $(workstations[i])
        }
      }
    }
    return null
  }

  /** 创建SVG画板下的svg块，作为一个整体显示模型
   * controlId：工作站点的元素的属性ID值
   * left：工作站点的元素的属性坐标X值
   * top：工作站点的元素的属性坐标Y值
   * */
  static createSvg(controlDom, showBottomOrLeftTrg, isTopOrRight) {
    let svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    if (svgNode) {
      let controlId = controlDom.attr('id') + '-tip'
      let left = Math.round(controlDom.css('left').replace('px', ''))
      let top = Math.round(controlDom.css('top').replace('px', ''))
      let width = Math.round(controlDom.css('width').replace('px', ''))
      svgNode.setAttribute('id', controlId)
      svgNode.setAttribute('name', 'wsTip')
      if (showBottomOrLeftTrg) {
        let x = left - 30
        let y = isTopOrRight ? top - 55 : top - 120
        svgNode.setAttribute('x', x)
        svgNode.setAttribute('y', y)
      } else {
        let x = left + width - 5
        let y = top
        svgNode.setAttribute('x', x)
        svgNode.setAttribute('y', y)
      }
      svgNode.setAttribute('preserveAspectRatio', 'xMidYMin meet')
      svgNode.setAttribute('style', 'fill: none;fill-opacity: 1;')
    }
    return svgNode
  }

  /** 创建一条SVG的多边曲线
   * points：曲线的坐标集合
   * startControlId：开始组件ID
   * startPointIndex：开始矢量线连接类型
   * endControlId：结束组件ID
   * endPointIndex：结束矢量线连接类型
   * */
  static createSvgPolyline(points, startControlId, startPointIndex, endControlId, endPointIndex) {
    // 定义一个变量polyline来表示在SVG上创建的一条多边曲线
    let polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    if (polyline) {
      // 定义一个变量lineId用于表示矢量线的矢量ID，具有唯一标识
      let lineId = 'drawLine_' + parseInt(Math.random() * 10000)
      while ($(CpsCommonConst.drawSVGId).find('line[id=\'' + lineId + '\']').length > 0) {
        lineId = 'drawLine_' + parseInt(Math.random() * 10000)
      }
      polyline.setAttribute('name', 'drawLine')
      polyline.setAttribute('id', lineId)
      polyline.setAttribute('marker-end', 'url(#markerArrow)')
      polyline.setAttribute('style', 'fill:none;stroke:red;stroke-width:2;cursor:move')
      polyline.setAttribute('data-startid', startControlId)
      polyline.setAttribute('data-starttype', startPointIndex)
      polyline.setAttribute('data-endid', endControlId)
      polyline.setAttribute('data-endtype', endPointIndex)
      polyline.setAttribute('points', points)
    }
    return polyline
  }

  /** 创建SVG画板下的rect，构建一个椭圆角的矩形块，用于展示区域范围
   * */
  static createSvgRect(showBottomOrLeftTrg, isTopOrRight) {
    let rectNode = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    if (rectNode) {
      let px = showBottomOrLeftTrg ? 1 : (isTopOrRight ? 15 : 150)
      rectNode.setAttribute('x', px)
      rectNode.setAttribute('y', '0')
      rectNode.setAttribute('rx', '6')
      rectNode.setAttribute('ry', '6')
      rectNode.setAttribute('width', '130')
      rectNode.setAttribute('height', '50')
      rectNode.setAttribute('style', 'fill:#f7f8db;stroke:rgba(136, 136, 136, 0.5);stroke-width:3;')
    }
    return rectNode
  }

  /** 创建SVG画板下的polygon，构建一个三角形指向块，用于指向工作站点
   * */
  static createSvgPolygon(showBottomOrLeftTrg, isTopOrRight) {
    let polygonNode = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    if (polygonNode) {
      if (showBottomOrLeftTrg) {
        let points = isTopOrRight ? '45,45 53,65 61,45' : '60,45 68,130 76,45'
        polygonNode.setAttribute('points', points)
      } else {
        let points = isTopOrRight ? '18,15 0,23 18,31' : '153,20 0,28 153,36'
        polygonNode.setAttribute('points', points)
      }
      polygonNode.setAttribute('style', 'fill: #f7f8db;')
    }
    return polygonNode
  }

  /** 创建SVG画板下的text块，用于文字内容描述
   * ty：文本在整体模块中的Y坐标位置
   * text：文本描述
   * textValue：文本值
   * */
  static createSvgText(ty, text, textValue, showBottomOrLeftTrg, isTopOrRight) {
    let textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    if (textNode) {
      let px = showBottomOrLeftTrg ? 5 : (isTopOrRight ? 20 : 155)
      textNode.setAttribute('x', px)
      textNode.setAttribute('y', ty)
      textNode.setAttribute('style', 'font-size: 10px;fill: black;')
      let textNodeString = document.createTextNode(text + ':');
      textNode.appendChild(textNodeString);
      let tSpanNode = CpsEventPanel.createSvgTSpan(ty, textValue, showBottomOrLeftTrg, isTopOrRight)
      textNode.appendChild(tSpanNode);
    }
    return textNode
  }

  /** 创建SVG画板下的tspan块，用于文字描述的值
   * tpy：文本值在整体模块中的Y坐标位置
   * text：文本值
   * */
  static createSvgTSpan(tpy, text, showBottomOrLeftTrg, isTopOrRight) {
    let tSpanNode = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
    if (tSpanNode) {
      let px = showBottomOrLeftTrg ? 50 : (isTopOrRight ? 65 : 200)
      tSpanNode.setAttribute('x', px)
      tSpanNode.setAttribute('y', tpy)
      tSpanNode.setAttribute('style', 'font-size: 10px;fill: black;font-weight: bold;')
      let tSpanNodeString = document.createTextNode(text);
      tSpanNode.appendChild(tSpanNodeString);
    }
    return tSpanNode
  }

  /** 创建工作站点悬浮框，显示出此站点的派工单的执行情况
   * produceLineId：生产线关联主数据ID
   * wsModel：当前生产线下的工作站点上的派工单完成情况数据模型
   * */
  static createWorkStationSvgTip(produceLineId, wsModel, isTopOrRight, showBottomOrLeftTrg) {
    let controlDom = CpsEventPanel.getProduceLineOfWorkStation(produceLineId, wsModel.WorkStationId)
    if (controlDom) {
      let state = wsModel.State === 0 ? '空闲' : '被占用'
      let svgNode = CpsEventPanel.createSvg(controlDom, showBottomOrLeftTrg, isTopOrRight)
      let rectNode = CpsEventPanel.createSvgRect(showBottomOrLeftTrg, isTopOrRight)
      svgNode.appendChild(rectNode);
      let polygonNode = CpsEventPanel.createSvgPolygon(showBottomOrLeftTrg, isTopOrRight)
      svgNode.appendChild(polygonNode);
      let textNode1 = CpsEventPanel.createSvgText('15', '站点状态', state, showBottomOrLeftTrg, isTopOrRight)
      svgNode.appendChild(textNode1);
      let textNode2 = CpsEventPanel.createSvgText('30', '派工单号', wsModel.TaskNo, showBottomOrLeftTrg, isTopOrRight)
      svgNode.appendChild(textNode2);
      let textNode3 = CpsEventPanel.createSvgText('45', '已完成数', wsModel.FinishCount, showBottomOrLeftTrg, isTopOrRight)
      svgNode.appendChild(textNode3);
      $(CpsCommonConst.drawSVGId).append(svgNode)
    }
  }

  /** 设置画板上生产线下的所有工作站点的悬浮框
   * produceModuleInfo：画板上所有生产线下的工作站点上的派工单完成情况
   * */
  static setProduceLineOfWorkStationTips(produceModuleInfo) {
    for (let i = 0; i < produceModuleInfo.length; i++) {
      let produceModule = produceModuleInfo[i]
      let produceLineId = produceModule.ProduceLineId
      let produceLine = $(CpsCommonConst.canvasId).find('div[data-progid=\'com.ProduceLine\'][data-relid=\'' + produceLineId + '\']')
      let width = Math.round(produceLine.css('width').replace('px', ''))
      let height = Math.round(produceLine.css('height').replace('px', ''))
      let showBottomOrLeftTrg = width > height - 30 ? true : false
      for (let j = 0; j < produceModule.WorkstationDetail.length; j++) {
        let model = produceModule.WorkstationDetail[j]
        let isTopOrRight = j % 2 === 0 ? true : false
        CpsEventPanel.createWorkStationSvgTip(produceLineId, model, isTopOrRight, showBottomOrLeftTrg)
      }
    }
  }

  /** 以悬浮框的形式显示生产线下的所有工作站点上的派工单完成情况
   * */
  static showProduceLineOfWorkStationInfo() {
    Ext.Ajax.request({
      url: '/CpsModule/GetProduceLineOfStationInfo',
      jsonData: {info: CpsCommonVar.controlLineModels},
      method: 'POST',
      async: false,
      timeout: 90000000,
      success: function (response) {
        //  方法GetProduceLineOfStationInfo执行正常，将json字符串转换json对象
        let result = Ext.decode(response.responseText)
        // 后端校验失败, 显示出错误信息
        if (result.Messages.length > 0) {
          let errMsg = []
          for (let i = 0; i < result.Messages.length; i++) {
            errMsg.push({kind: result.Messages[i].MessageKind, msg: result.Messages[i].Message})
          }
          Ax.utils.LibMsg.show(errMsg)
        } else {
          if (result.Result.length > 0) {
            CpsEventPanel.destroyWorkStationTips()
            CpsEventPanel.setProduceLineOfWorkStationTips(result.Result)
            CpsEventPanel.isShowTaskNoTip = false
            CpsEventPanel.sysEventPanel.items.getAt(5).setText('关闭动态展示')
          } else {
            Ext.Msg.alert('提示', '当前产线的站点未进行任何指令操作！')
          }
        }
      },
      failure: function (response) {
        Ext.Msg.alert('提示', '当前产线的站点动态数据展示失败')
      }
    })
  }

  /** 销毁当前所有的显示工作站点上的派工单完成情况的悬浮框
   * */
  static destroyWorkStationTips() {
    $(CpsCommonConst.drawSVGId).find('svg[name=\'wsTip\']').remove()
    CpsCommonFunc.removeControlSelStyle()
    CpsEventPanel.isShowTaskNoTip = true
    CpsEventPanel.sysEventPanel.items.getAt(5).setText('开启动态展示')
  }

  /** 创建通用事件模块 位于平台上方，高度50，宽度不定
   * 【初始化：重置平台的状态为原始新增状态】
   * 【保存：先校验产线模型配置数据，再提示输入CPS建模名称，最后进入后端保存数据】
   * 【预览：将当前产线模型的组件配置明细和矢量线配置明细数据在新弹窗中显示出来】
   * 【纠察：校验产线模型配置数据，即组件配置明细数据和矢量线配置明细数据】
   * */
  static createEventPanel() {
    CpsEventPanel.sysEventPanel = Ext.create('Ext.panel.Panel', {
      id: 'cpsEvent-panel',
      bodyPadding: 5,
      layout: {
        type: 'table',
        columns: 6
      },
      defaults: {
        margin: '0 5 0 5'
      },
      items: [
        {
          xtype: 'button',
          text: '初始化',
          scale: 'medium',
          colspan: 1,
          handler: function () {
            Ext.Msg.confirm('系统提示', '这将会清空画板，确认继续吗？', function (btn) {
              if (btn === 'yes') {
                CpsEventPanel.reInitCpsConfigureView()
              }
            })
          }
        },
        {
          xtype: 'button',
          text: '保存',
          scale: 'medium',
          colspan: 1,
          handler: function () {
            let checkErrorStr = CpsCommonFunc.checkProduceControlLineModels()
            if (checkErrorStr.length < 1) {
              Ext.Msg.prompt('请输入CPS建模名称', '名称', function (btn, text) {
                if (btn === 'ok') {
                  if (!text) {
                    Ext.Msg.alert('提示', 'CPS建模名称不能为空!')
                  } else {
                    CpsCommonVar.controlLineModels.ProduceControlLineName = text
                    $('#cpsLoading').css('display', 'block')
                    CpsCommonFunc.saveProduceControlLineModels()
                    $('#cpsLoading').css('display', 'none')
                  }
                }
              }, this, false, CpsCommonVar.controlLineModels.ProduceControlLineName)
            } else {
              Ax.utils.LibMsg.show(checkErrorStr)
            }
          }
        },
        {
          xtype: 'button',
          text: '预览',
          scale: 'medium',
          colspan: 1,
          handler: function () {
            CpsMainPanel.showProduceControlLineModels()
          }
        },
        {
          xtype: 'button',
          text: '纠察',
          scale: 'medium',
          colspan: 1,
          handler: function () {
            let checkErrorStr = CpsCommonFunc.checkProduceControlLineModels()
            if (checkErrorStr.length < 1) {
              Ext.Msg.alert('提示', '已为您纠察完毕。')
            } else {
              Ax.utils.LibMsg.show(checkErrorStr)
            }
          }
        },
        {
          xtype: 'button',
          text: '隐藏属性模块',
          scale: 'medium',
          colspan: 1,
          handler: function () {
            if (CpsEventPanel.showAttrFormPanel) {
              CpsEventPanel.showAttrFormPanel = false
              this.up('panel').items.getAt(4).setText('显示属性模块')
            } else {
              CpsEventPanel.showAttrFormPanel = true
              this.up('panel').items.getAt(4).setText('隐藏属性模块')
            }
            CpsCommonVar.attrFormPanels.setVisible(CpsEventPanel.showAttrFormPanel)
          }
        },
        {
          xtype: 'button',
          text: '开启动态展示',
          scale: 'medium',
          colspan: 1,
          handler: function () {
            if (CpsEventPanel.isShowTaskNoTip) {
              let checkErrorStr = CpsCommonFunc.checkProduceControlLineModels()
              if (checkErrorStr.length < 1) {
                CpsEventPanel.taskNoTipInterval = window.setInterval(CpsEventPanel.showProduceLineOfWorkStationInfo,3000)
              } else {
                Ax.utils.LibMsg.show(checkErrorStr)
              }
            } else {
              CpsEventPanel.destroyWorkStationTips()
              window.clearInterval(CpsEventPanel.taskNoTipInterval)
            }
          }
        }
      ]
    })
    return CpsEventPanel.sysEventPanel
  }

  /** 通用事件，适用于整体模块【模块容器鼠标右键事件，模块容器鼠标左键事件，组件模块标题点击，delete键键盘事件，组件拉伸事件，矢量线重绘事件】
   * 【模块容器鼠标右键事件：在浏览器中禁止在一定区域内使用鼠标右键的浏览器的功能】
   * 【模块容器鼠标左键事件：隐藏组件缩放圆点，去除选中状态，隐藏快捷菜单】
   * 【组件模块标题点击事件：用于控制CPS动态组件模块以及系统组件模块是否显示，默认显示】
   * 【delete键键盘事件：通过变量selVectorLineId删除矢量线，默认null，通过变量selControlId删除功能组件，默认null】
   * 【组件拉伸事件：用于按下组件的四周的拉伸圆点，重新改变组件的宽高位置】
   * 【矢量线重绘事件：用于按下矢量线的两端的拉伸圆点，重新绘制矢量线】
   * */
  static initCommonEvent() {
    /** 重新绑定模块容器的鼠标右键事件，用于阻止浏览器的鼠标右键事件
     * 禁止浏览器鼠标右键打开快捷菜单事件，允许本模块的右键打开快捷菜单事件
     * */
    $(CpsCommonVar.renderTo).unbind('contextmenu').bind('contextmenu', function (event) {
      event.originalEvent.preventDefault()
      return false
    })

    /** 重新绑定模块容器的鼠标点击事件，用于去除组件选中状态（右键快捷菜单）
     * 当组件右键菜单存在时（通过变量munePanel来判定），则隐藏其菜单
     * */
    $(CpsCommonVar.renderTo).unbind('mouseup').bind('mouseup', function (event) {
      if (!CpsCommonVar.useVectorLine && (event.button === 1 || event.button === 0)) {
        if (CpsCommonVar.munePanel) {
          CpsCommonVar.munePanel.hide()
        }
      }
    })

    /** 重新绑定组件模块标题点击事件，设置组件模块的显隐事件
     * 控制CPS动态组件模块的内部组件的显隐，通过其显示属性display来判定
     * 控制系统组件模块的内部组件的显隐，通过其显示属性display来判定
     * */
    $(CpsCommonConst.controlsId).find('div[name=\'cpsControlTitle\']').unbind('click').bind('click', function (event) {
      let display = $(this).parent().find('div[name=\'cpsControls\']').css('display')
      if (display === 'block') {
        $(this).find('img[name=\'cpsImage\']').removeClass('cps-controls-openimg')
        $(this).parent().find('div[name=\'cpsControls\']').css('display', 'none')
      } else {
        $(this).find('img[name=\'cpsImage\']').addClass('cps-controls-openimg')
        $(this).parent().find('div[name=\'cpsControls\']').css('display', 'block')
      }
    })

    /** 重新绑定画板模块的delete键键盘事件，用于删除选中的矢量线,组件
     * 矢量线的删除：根据选中的矢量线（矢量ID变量selVectorLineId）找出CPS产线模型中的矢量线配置明细中的矢量线并删除，将矢量ID置为空，隐藏其拖拽圆点
     * 组件的删除：根据选中的组件（组件D变量selControlId）找出CPS产线模型中的组件配置明细中的组件并删除，将组件ID置为空，隐藏其缩放圆点
     * */
    $(CpsCommonConst.canvasId).unbind('keydown').bind('keydown', function (event) {
      if (!CpsCommonVar.useVectorLine) {
        if ((event.key === 'Delete' || event.keyCode === 46 || event.which === 46) ||
          (event.ctrlKey && (event.key === 'd' || event.keyCode === 68 || event.which === 68))) {
          if (CpsCommonVar.selVectorLineId) {
            CpsPolylineAttr.deletePolylineByLineId(CpsCommonVar.selVectorLineId)
            CpsCommonVar.selVectorLineId = null
          }
          if (CpsCommonVar.selControlId) {
            CpsControlsAttr.deleteControlByControlId(CpsCommonVar.selControlId)
            CpsCommonVar.selControlId = null
          }
        }
        if (event.ctrlKey) {
          if (event.key === 'c' || event.keyCode === 67 || event.which === 67) {
            if (CpsCommonVar.isSelCpsControl) {
              CpsEventPanel.copyCpsControl = CpsCommonVar.selCpsControl
              CpsEventPanel.isPasteCpsControl = true
            } else {
              CpsEventPanel.copySvgPolyline = CpsCommonVar.selSvgPolyline
              CpsEventPanel.isPasteCpsControl = false
            }
          }
          if (event.key === 'v' || event.keyCode === 86 || event.which === 86) {
            if (CpsEventPanel.copyCpsControl && CpsEventPanel.isPasteCpsControl) {
              CpsProgramControls.copyCpsControl(CpsEventPanel.copyCpsControl)
            }
            if (CpsEventPanel.copySvgPolyline && !CpsEventPanel.isPasteCpsControl) {
              CpsPolylineAttr.copySvgPolyline(CpsEventPanel.copySvgPolyline)
            }
          }
          if (CpsCommonVar.selCpsControl && (event.key === '+' || event.keyCode === 107 || event.which === 107)) {
            CpsControlsAttr.zoomCpsControl(CpsCommonVar.selCpsControl, true)
          }
          if (CpsCommonVar.selCpsControl && (event.key === '-' || event.keyCode === 109 || event.which === 109)) {
            CpsControlsAttr.zoomCpsControl(CpsCommonVar.selCpsControl, false)
          }
          if (CpsCommonVar.selCpsControl && (event.key === 'ArrowUp' || event.keyCode === 38 || event.which === 38)) {
            $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
            let top = Math.round(CpsCommonVar.selCpsControl.css('top').replace('px', ''))
            top = top > 1 ? top - 1 : 1
            CpsControlsAttr.moveCpsControl(CpsCommonVar.selCpsControl, null, top)
          }
          if (CpsCommonVar.selCpsControl && (event.key === 'ArrowDown' || event.keyCode === 40 || event.which === 40)) {
            $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
            let down = Math.round(CpsCommonVar.selCpsControl.css('top').replace('px', '')) + 1
            CpsControlsAttr.moveCpsControl(CpsCommonVar.selCpsControl, null, down)
          }
          if (CpsCommonVar.selCpsControl && (event.key === 'ArrowLeft' || event.keyCode === 37 || event.which === 37)) {
            $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
            let left = Math.round(CpsCommonVar.selCpsControl.css('left').replace('px', ''))
            left = left > 1 ? left - 1 : 1
            CpsControlsAttr.moveCpsControl(CpsCommonVar.selCpsControl, left, null)
          }
          if (CpsCommonVar.selCpsControl && (event.key === 'ArrowRight' || event.keyCode === 39 || event.which === 39)) {
            $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
            let right = Math.round(CpsCommonVar.selCpsControl.css('left').replace('px', '')) + 1
            CpsControlsAttr.moveCpsControl(CpsCommonVar.selCpsControl, right, null)
          }
        }
      }
      event.originalEvent.preventDefault()
    })

    // 重新绑定组件的缩放圆点单击事件(鼠标按钮被按下。)，允许对组件进行拉伸
    $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').unbind('mousedown').bind('mousedown', function (event) {
      if (!CpsCommonVar.useVectorLine && !CpsCommonVar.redrawCpsControl) {
        let controlId = $(this).attr('data-controlid')
        let pointIndex = parseInt($(this).attr('data-index'))
        let elDrag = $(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']')
        let width = Math.round(elDrag.css('width').replace('px', ''))
        let height = Math.round(elDrag.css('height').replace('px', ''))
        let left = Math.round(elDrag.css('left').replace('px', ''))
        let top = Math.round(elDrag.css('top').replace('px', ''))
        $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
        CpsCommonVar.selControlId = controlId
        CpsCommonVar.cpsControlPoint = {
          'point': event.clientX + ',' + event.clientY,
          'width': width,
          'height': height,
          'left': left,
          'top': top,
          'index': pointIndex
        }
        CpsCommonVar.redrawCpsControl = true
        CpsProgramControls.dragControl = null
      }
    })

    /** 重新绑定矢量线两端的圆点单击事件(鼠标按钮被按下。)，允许对矢量线进行拉伸
     * 变量vectorLinePoint指的是当前矢量线两端的拉伸圆点的圆点标识，用于代表起点或尾点的位置移动，重新绘制矢量线时将此圆点隐藏
     * 变量redrawVectorLine代表可以重新绘制矢量线
     * */
    $(CpsCommonConst.drawSVGId).find('circle[name=\'drawCircle\']').unbind('mousedown').bind('mousedown', function (event) {
      // if (!CpsCommonVar.useVectorLine) {
      let lineId = $(this).attr('data-lineid')
      let pointIndex = parseInt($(this).attr('data-index'))
      $(CpsCommonConst.drawSVGId).find('circle[id=\'drawCircle' + pointIndex + '\']').css({'display': 'none'})
      CpsCommonVar.selVectorLineId = lineId
      CpsCommonVar.vectorLineIndex = pointIndex
      CpsCommonVar.redrawVectorLine = true
      // }
    })
  }

  /** 加载CPS工厂建模的全部事件【系统模块通用事件，通用事件，功能组件事件，矢量线事件】
   * 【系统模块通用事件：指针工具、矢量线、描述框的功能使用情况】
   * 【通用事件：浏览器鼠标右键，组件模块标题点击，delete键键盘事件】
   * 【功能组件事件：组件拖拽事件，组件拖放事件，组件其他事件】
   * 【矢量线事件：矢量线其他事件，矢量线绘制事件】
   * */
  static loadCpsConfigureEvent() {
    CpsSystemControls.initSystemControlEvent()      // 系统模块通用事件【指针工具、矢量线、描述框】
    CpsEventPanel.initCommonEvent()                 // 通用事件【模块容器鼠标左右键事件，组件模块标题点击，delete键键盘事件，组件拉伸事件，矢量线重绘事件】
    CpsProgramControls.initProgramControlEvent()    // CPS功能组件通用事件【CPS组件拖拽事件，SVG组件拖放事件，SVG组件共有事件】
    CpsPolylineAttr.initPolylineEvent()             // 矢量线事件【矢量线其他事件，矢量线绘制事件】
  }
}
export {CpsEventPanel}
