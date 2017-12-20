/**********************************************************************
 * CopyRight 2017 杭州集控科技有限公司 版权所有
 * 功能描述：CPS建模功能通用类模块
 * 创建标识：Huangwz 2017/05/02
 *
 * 修改标识：Huangwz 2017/05/02
 *
 ************************************************************************/
import {CpsPolylineAttr} from './CpsPolylineAttr'
class CpsCommonConst {
  static mainPanelId = '#cpsMainPanel'      // 主体模块ID
  static canvasId = '#cpsCanvas'            // 画板模块Dom的ID
  static controlsId = '#controlModule'      // 组件模块Dom的ID
  static cpsControlsId = '#cpsControls'     // CPS动态组件模块Dom的ID
  static sysControlsId = '#sysControls'     // 系统组件模块Dom的ID
  static drawSVGId = '#drawSVGView'         // 画板模块Dom的ID
  static comTechRouteType = 'comTechRouteType_'           //标准工艺类别
  static comMaterial = 'comMaterial_'                     //物料
  static comWorkshopSection = 'comWorkshopSection_'       //工段
  static comWorkProcess = 'comWorkProcess_'               //工序
  static comWorkstationConfig = 'comWorkstationConfig_'   //站点配置
  static comMaterialType = 'comMaterialType_'             //物料类别
  static comTechRoute = 'comTechRoute_'                   //标准工艺路线
  static comProduceLine = 'comProduceLine_'               //生产线
  static comWorkstation = 'comWorkstation_'               //工作站点
  static materialTypeSize = 50             //物料类别标准宽（横向布局）高（竖向布局）度
  static materialSize = 50                 //物料标准宽（横向布局）高（竖向布局）度
  static workstationConfigSize = 50        //站点配置标准宽（横向布局）高（竖向布局）度
  static workProcessSize = 60              //工序标准宽（横向布局）高（竖向布局）度
  static techRouteTypeSize = 50            //标准工艺类别标准宽（横向布局）高（竖向布局）度
  static workshopSectionSize = 60          //工段标准宽（横向布局）高（竖向布局）度
}
class CpsCommonVar {
  static renderTo = null                 // CPS建模模块所要放置的元素
  static controlLineModels = null        // 记录画板上所有组件配置的数据
  static drawSvgWidth = 0                // 画板模块Dom的实际宽度
  static drawSvgHeight = 0               // 画板模块Dom的实际高度

  static attrFormPanels = null           // 包含组件属性模块和矢量线属性模块
  static controlsAttrPanel = null        // 组件属性模块
  static polylineAttrPanel = null        // 矢量线属性模块
  static munePanel = null                // 右键菜单模块
  static descToolTip = null              // 提示框模块
  static masterVcl = null                // CPS产线配置视图面板

  static useToolTip = false               // 是否使用描述框
  static useVectorLine = false            // 是否使用画线功能
  static redrawVectorLine = false         // 是否重新绘制矢量线
  static vectorLineIndex = 1              // 拉伸所选择的矢量线移动端,0代表非箭头方向移动，1代表箭头方向移动
  static positionRectPoints = null        // 组件圆点坐标集，存储圆点的坐标，半径，组件ID，位置类型【0是位于SVG的起结点，1-4（1-8）是位于组件上的起结点】
  static redrawCpsControl = false         // 是否重新绘制CPS功能组件
  static cpsControlPoint = null           // CPS功能组件的拉伸圆点的坐标

  static selControlId = null              // 所点击选中的功能组件的组件ID
  static selVectorLineId = null           // 所点击选中的矢量线的矢量ID
  static selCpsControl = null            // 要复制的CPS功能组件
  static selSvgPolyline = null           // 要复制的SVG矢量线
  static isSelCpsControl = true          // 要复制的是不是CPS功能组件，true表示为CPS功能组件，false表示为VG矢量线
}
class CpsCommonFunc {
  /** 通过后端的方法GetProduceControlLineModel获取CPS产线模型数据列表，并将此数据列表返回回去
   * produceControlLineId：CPS产线模型代码，为CPS产线模型中的唯一标识，默认为空
   * callback：回调函数，可以将变量当做参数返回给另一个函数
   * */
  static getProduceControlLineList(produceControlLineId, callback) {
    Ext.Ajax.request({
      url: '/CpsModule/GetProduceControlLineModel',
      jsonData: {produceControlLineId: produceControlLineId},
      method: 'POST',
      async: true,
      timeout: 90000000,
      success: function (response) {
        var list = Ext.JSON.decode(response.responseText)
        CpsCommonVar.controlLineModels = list
        callback(list)
      },
      failure: function (response) {
        Ext.Msg.alert('提示', '获取CPS产线模型数据出现异常')
        callback(null)
        $('#cpsLoading').css('display', 'none')
      }
    })
  }

  /** 通过后端的方法GetCurrentConfig获取CPS动态组件数据列表，并将此数据列表返回回去
   * controlConfigId：CPS产线模型中所关联的CPS组件配置代码，默认为空
   * factoryModuleType：工厂建模模型，用于获取CPS组件配置下此模型的最新数据
   * callback：回调函数，可以将变量当做参数返回给另一个函数
   * */
  static getCpsControlConfigureList(controlConfigId, factoryModuleType, callback) {
    Ext.Ajax.request({
      url: '/CpsModule/GetCurrentConfig',
      jsonData: {controlConfigId: controlConfigId, factoryModuleType: factoryModuleType},
      method: 'POST',
      async: true,
      timeout: 90000000,
      success: function (response) {
        let list = Ext.JSON.decode(response.responseText)
        CpsCommonVar.controlLineModels.ControlConfigId = list.ControlConfigId
        CpsCommonVar.controlLineModels.FactoryModuleType = list.FactoryModuleType
        callback(list)
      },
      failure: function (response) {
        Ext.Msg.alert('提示', '获取当前CPS组件配置数据出现异常')
        callback(null)
        $('#cpsLoading').css('display', 'none')
      }
    })
  }

  /** 根据功能组件或矢量线得到其周围圆点或方点属性数据（坐标、大小、关联ID）
   * element：所要操作的功能组件或矢量线元素
   * elementType：所要操作的功能组件或矢量线元素的元素类型，以便获取不同类型的坐标属性
   * */
  static getElementPoints(element, elementType) {
    // 定义一个数组变量pointsAttr用于存储此功能组件或矢量线周围的圆点或方点属性数据
    let pointsAttr = []
    // 当元素类型是矢量线时，计算得到矢量线两端的拉伸圆点的坐标属性
    if (elementType === 'drawCircle') {
      let lineId = element.attr('id')
      // 获得矢量线的起始点在组件上的位置方点的所在位置类型【上右下左-1234】或默认未连接到组件的位置类型0
      let controlStartType = parseInt(element.attr('data-starttype'))
      // 获得矢量线的矢量坐标
      let points = element.attr('points').split(' ')
      let x1 = parseInt(points[0].split(',')[0])
      let y1 = parseInt(points[0].split(',')[1])
      let x2 = parseInt(points[points.length - 1].split(',')[0])
      let y2 = parseInt(points[points.length - 1].split(',')[1])
      // 根据矢量线的起始点所在位置类型，计算得出不同位置下矢量线的两端的拉伸圆点的坐标
      if (controlStartType === 1) {
        y1 = y1 - 5
      } else if (controlStartType === 2) {
        x1 = x1 + 5
      } else if (controlStartType === 3) {
        y1 = y1 + 5
      } else if (controlStartType === 4) {
        x1 = x1 - 5
      }
      // 为数组变量pointsAttr赋值
      pointsAttr = [
        {'x': x1, 'y': y1, 'lineId': lineId, 'index': 1},
        {'x': x2, 'y': y2, 'lineId': lineId, 'index': 2}
      ]
    } else {
      // 当元素类型是功能组件时,获得组件的组件ID、X坐标、Y坐标、宽度、高度值，计算得到功能组件周围的位置方点或拉伸方点的坐标属性
      let controlId = element.attr('id')
      let x = Math.round(element.css('left').replace('px', ''))
      let y = Math.round(element.css('top').replace('px', ''))
      let w = Math.round(element.css('width').replace('px', ''))
      let h = Math.round(element.css('height').replace('px', ''))
      // 计算得出功能组件周围的位置方点的坐标属性并给数组变量pointsAttr赋值
      if (elementType === 'controlRect') {
        pointsAttr = [
          {'x': x + parseInt(w / 2) - 3, 'y': y - 3, 'controlId': controlId, 'width': 7, 'height': 7, 'index': 1},
          {'x': x + w - 4, 'y': y + parseInt(h / 2) - 3, 'controlId': controlId, 'width': 7, 'height': 7, 'index': 2},
          {'x': x + parseInt(w / 2) - 3, 'y': y + h - 4, 'controlId': controlId, 'width': 7, 'height': 7, 'index': 3},
          {'x': x - 3, 'y': y + parseInt(h / 2) - 3, 'controlId': controlId, 'width': 7, 'height': 7, 'index': 4}
        ]
      }
      // 计算得出功能组件周围的拉伸方点的坐标属性并给数组变量pointsAttr赋值
      if (elementType === 'zoomCircle') {
        pointsAttr = [
          {'x': x + 2, 'y': y + 2, 'controlId': controlId, 'r': 5, 'index': 1},
          {'x': x + parseInt(w / 2), 'y': y, 'controlId': controlId, 'r': 5, 'index': 2},
          {'x': x + w - 2, 'y': y + 2, 'controlId': controlId, 'r': 5, 'index': 3},
          {'x': x + w, 'y': y + parseInt(h / 2), 'controlId': controlId, 'r': 5, 'index': 4},
          {'x': x + w - 2, 'y': y + h - 2, 'controlId': controlId, 'r': 5, 'index': 5},
          {'x': x + parseInt(w / 2), 'y': y + h, 'controlId': controlId, 'r': 5, 'index': 6},
          {'x': x + 2, 'y': y + h - 2, 'controlId': controlId, 'r': 5, 'index': 7},
          {'x': x, 'y': y + parseInt(h / 2), 'controlId': controlId, 'r': 5, 'index': 8}
        ]
      }
    }
    return pointsAttr
  }

  /** 显示功能组件或矢量线的周围圆点或方点
   * element：所要操作的功能组件或矢量线元素
   * elementType：所要操作的功能组件或矢量线元素的元素类型
   * */
  static showElementPoints(element, elementType) {
    let elementPoints = CpsCommonFunc.getElementPoints(element, elementType)
    if (elementType === 'drawCircle') {
      for (let i = 0; i < elementPoints.length; i++) {
        $(CpsCommonConst.drawSVGId).find('circle[id=\'' + elementType + i + '\']').attr({
          'cx': elementPoints[i].x,
          'cy': elementPoints[i].y,
          'data-lineid': elementPoints[i].lineId
        })
      }
      $(CpsCommonConst.drawSVGId).find('circle[name=\'' + elementType + '\']').css('display', 'block')
    } else {
      if (elementType === 'zoomCircle') {
        for (let i = 0; i < elementPoints.length; i++) {
          $(CpsCommonConst.drawSVGId).find('circle[id=\'' + elementType + i + '\']').attr({
            'cx': elementPoints[i].x,
            'cy': elementPoints[i].y,
            'data-controlid': elementPoints[i].controlId
          })
        }
        $(CpsCommonConst.drawSVGId).find('circle[name=\'' + elementType + '\']').css('display', 'block')
      }
      if (elementType === 'controlRect') {
        for (let i = 0; i < elementPoints.length; i++) {
          $(CpsCommonConst.drawSVGId).find('rect[id=\'' + elementType + i + '\']').attr({
            'x': elementPoints[i].x,
            'y': elementPoints[i].y,
            'data-controlid': elementPoints[i].controlId
          })
        }
        CpsCommonVar.positionRectPoints = elementPoints
      }
      $(CpsCommonConst.drawSVGId).find('rect[name=\'' + elementType + '\']').css('display', 'block')
    }
  }

  /** 根据矢量线起尾点所关联的组件的位置方点类型计算出此方点的实际吸附点的坐标并返回
   * x：组件上某一位置方点的X坐标
   * y：组件上某一位置方点的X坐标
   * controlType：组件上某一位置方点的所在位置类型【上右下左-1234】
   * isStartPoint:矢量线起点吸附或尾点吸附
   * */
  static getPolylineStartOrEndPoint(x, y, controlType, isStartPoint) {
    if (isStartPoint) {
      if (controlType === 1) {
        x = x + 3
        y = y + 8
      } else if (controlType === 2) {
        x = x - 1
        y = y + 3
      } else if (controlType === 3) {
        x = x + 3
        y = y - 1
      } else if (controlType === 4) {
        x = x + 8
        y = y + 3
      }
    } else {
      if (controlType === 1) {
        x = x + 3
        y = y + 4
      } else if (controlType === 2) {
        x = x + 4
        y = y + 3
      } else if (controlType === 3) {
        x = x + 3
        y = y + 4
      } else if (controlType === 4) {
        x = x + 4
        y = y + 3
      }
    }
    return x + ',' + y
  }

  /** 根据矢量线的起尾点的坐标以及起尾点的位置类型【关联组件的原点位置类型：上右下左-1234；不关联组件的原点位置类型：无-0】
   * x1：矢量线的起点坐标的X坐标
   * y1：矢量线的起点坐标的Y坐标
   * x2：矢量线的尾点坐标的X坐标
   * y2：矢量线的尾点坐标的Y坐标
   * controlStartType：矢量线的起点的原点位置类型【无上右下左-01234】
   * controlEndType：矢量线的起点的尾点位置类型【无上右下左-01234】
   * */
  static getPointsByStyle(x1, y1, x2, y2, controlStartType, controlEndType) {
    // 定义一个坐标变量points用于存储矢量线的矢量坐标，默认为起尾点坐标的集合，为一条直线
    let points = x1 + ',' + y1 + ' ' + x2 + ',' + y2
    let type = controlStartType + '_' + controlEndType
    // 当起尾点坐标的X坐标或Y坐标不等或XY坐标的值差大于4或起尾点的位置类型有关联时，矢量线的矢量坐标将会是一个曲折线
    switch (type) {
      case '0_0':           // 矢量线: 起点-->不关联 结点-->不关联
        if (x1 !== x2 && y1 !== y2 && Math.abs(x2 - x1) > 4 && Math.abs(y2 - y1) > 4) {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
        }
        break
      case '0_1':           // 矢量线: 起点-->不关联 结点-->关联 上线↑
        if (x1 !== x2) {
          if (y1 >= y2) {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
          }
        }
        break
      case '0_2':           // 矢量线: 起点-->不关联 结点-->关联 右线→
        if (y1 !== y2) {
          if (x1 > x2) {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + Math.abs(x2 + 10) + ',' + y1 + ' ' + Math.abs(x2 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
          }
        }
        break
      case '0_3':           // 矢量线: 起点-->不关联 结点-->关联 下线↓
        if (x1 !== x2) {
          if (y1 > y2) {
            points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + y2
          }
        }
        break
      case '0_4':           // 矢量线: 起点-->不关联 结点-->关联 左线←
        if (y1 !== y2) {
          if (x1 >= x2) {
            points = x1 + ',' + y1 + ' ' + Math.abs(x2 - 10) + ',' + y1 + ' ' + Math.abs(x2 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
          }
        }
        break
      case '1_0':           // 矢量线: 起点-->关联 上线↑ 结点-->不关联
        if (x1 !== x2) {
          if (y1 > y2) {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 - 10) + ' ' + x2 + ',' + Math.abs(y1 - 10) + ' ' + x2 + ',' + y2
          }
        }
        break
      case '1_1':           // 矢量线: 起点-->关联 上线↑ 结点-->关联 上线↑
        if (x1 !== x2) {
          if (y1 > y2) {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 - 10) + ' ' + x2 + ',' + Math.abs(y1 - 10) + ' ' + x2 + ',' + y2
          }
        }
        break
      case '1_2':           // 矢量线: 起点-->关联 上线↑ 结点-->关联 右线→
        if (x1 > x2 && y1 > y2) {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 - 10) + ' ' + Math.abs(x2 + 10) + ',' + Math.abs(y1 - 10) + ' ' + Math.abs(x2 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
        }
        break
      case '1_3':           // 矢量线: 起点-->关联 上线↑ 结点-->关联 下线↓
        if (y1 > y2) {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 - 10) + ' ' + Math.floor(x1 + (x2 - x1) / 2) + ',' + Math.abs(y1 - 10) + ' ' + Math.floor(x1 + (x2 - x1) / 2) + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + y2
        }
        break
      case '1_4':           // 矢量线: 起点-->关联 上线↑ 结点-->关联 左线←
        if (x1 < x2 && y1 > y2) {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 - 10) + ' ' + Math.abs(x2 - 10) + ',' + Math.abs(y1 - 10) + ' ' + Math.abs(x2 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
        }
        break
      case '2_0':           // 矢量线: 起点-->关联 右线→ 结点-->不关联
        if (y1 !== y2) {
          if (x1 >= x2) {
            points = x1 + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
          }
        }
        break
      case '2_1':           // 矢量线: 起点-->关联 右线→ 结点-->关联 上线↑
        if (y1 < y2 && x1 < x2) {
          points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + y2
        }
        break
      case '2_2':           // 矢量线: 起点-->关联 右线→ 结点-->关联 右线→
        if (y1 !== y2) {
          if (x1 >= x2) {
            points = x1 + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + Math.abs(x2 + 10) + ',' + y1 + ' ' + Math.abs(x2 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
          }
        }
        break
      case '2_3':           // 矢量线: 起点-->关联 右线→ 结点-->关联 下线↓
        if (x1 < x2 && y1 > y2) {
          points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + y2
        }
        break
      case '2_4':           // 矢量线: 起点-->关联 右线→ 结点-->关联 左线←
        if (x1 >= x2) {
          points = x1 + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + y1 + ' ' + Math.abs(x1 + 10) + ',' + Math.floor(y1 + (y2 - y1) / 2) + ' ' + Math.abs(x2 - 10) + ',' + Math.floor(y1 + (y2 - y1) / 2) + ' ' + Math.abs(x2 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + Math.abs(x2 - 10) + ',' + y1 + ' ' + Math.abs(x2 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
        }
        break
      case '3_0':           // 矢量线: 起点-->关联 下线↓ 结点-->不关联
        if (x1 !== x2) {
          if (y1 >= y2) {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 + 10) + ' ' + x2 + ',' + Math.abs(y1 + 10) + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
          }
        }
        break
      case '3_1':           // 矢量线: 起点-->关联 下线↓ 结点-->关联 上线↑
        if (y1 >= y2) {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 + 10) + ' ' + Math.floor(x1 + (x2 - x1) / 2) + ',' + Math.abs(y1 + 10) + ' ' + Math.floor(x1 + (x2 - x1) / 2) + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + y2
        }
        break
      case '3_2':           // 矢量线: 起点-->关联 下线↓ 结点-->关联 右线→
        if (x1 > x2 && y1 < y2) {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 + 10) + ' ' + Math.abs(x2 + 10) + ',' + Math.abs(y1 + 10) + ' ' + Math.abs(x2 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
        }
        break
      case '3_3':           // 矢量线: 起点-->关联 下线↓ 结点-->关联 下线↓
        if (x1 !== x2) {
          if (y1 >= y2) {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 + 10) + ' ' + x2 + ',' + Math.abs(y1 + 10) + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + y2
          }
        }
        break
      case '3_4':           // 矢量线: 起点-->关联 下线↓ 结点-->关联 左线←
        if (x1 < x2 && y1 < y2) {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + y2 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + x1 + ',' + Math.abs(y1 + 10) + ' ' + Math.abs(x2 - 10) + ',' + Math.abs(y1 + 10) + ' ' + Math.abs(x2 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
        }
        break
      case '4_0':           // 矢量线: 起点-->关联 左线← 结点-->不关联
        if (y1 !== y2) {
          if (x1 > x2) {
            points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
          }
        }
        break
      case '4_1':           // 矢量线: 起点-->关联 左线← 结点-->关联 上线↑
        if (x1 > x2 && y1 < y2) {
          points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + Math.abs(y2 - 10) + ' ' + x2 + ',' + y2
        }
        break
      case '4_2':           // 矢量线: 起点-->关联 左线← 结点-->关联 右线→
        if (x1 > x2) {
          points = x1 + ',' + y1 + ' ' + Math.abs(x2 + 10) + ',' + y1 + ' ' + Math.abs(x2 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + Math.floor(y1 + (y2 - y1) / 2) + ' ' + Math.abs(x2 + 10) + ',' + Math.floor(y1 + (y2 - y1) / 2) + ' ' + Math.abs(x2 + 10) + ',' + y2 + ' ' + x2 + ',' + y2
        }
        break
      case '4_3':           // 矢量线: 起点-->关联 左线← 结点-->关联 下线↓
        if (x1 > x2 && y1 > y2) {
          points = x1 + ',' + y1 + ' ' + x2 + ',' + y1 + ' ' + x2 + ',' + y2
        } else {
          points = x1 + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + Math.abs(y2 + 10) + ' ' + x2 + ',' + y2
        }
        break
      case '4_4':           // 矢量线: 起点-->关联 左线← 结点-->关联 左线←
        if (y1 !== y2) {
          if (x1 > x2) {
            points = x1 + ',' + y1 + ' ' + Math.abs(x2 - 10) + ',' + y1 + ' ' + Math.abs(x2 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
          } else {
            points = x1 + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + y1 + ' ' + Math.abs(x1 - 10) + ',' + y2 + ' ' + x2 + ',' + y2
          }
        }
        break
      default:
        points = x1 + ',' + y1 + ' ' + x2 + ',' + y2
        break
    }
    return points
  }

  /** 校验矢量线的连接CPS功能组件的规则【起始组件、结束组件不可不等单次特定指向】
   * model：矢量线的数据模型
   * */
  static checkProduceLineModel(model) {
    // 定义一个数组变量checkErrorStr用于保存校验错误信息，数组中对象元素kind为错误类型【0-提示,1-警告,2-错误,3-异常】，msg表示错误信息
    let checkErrorStr = []
    // 校验：矢量线的起始组件和结束组件的值不可为空且不可相同且有一定的单一指向性，否则提示错误信息
    if (model.StartControlId && model.EndControlId && model.StartControlId !== model.EndControlId) {
      if (CpsCommonVar.controlLineModels.FactoryModuleType === 1) {
        let startProduceLine = model.StartControlId.indexOf(CpsCommonConst.comProduceLine)          // 生产线 -- 开始组件
        let endProduceLine = model.EndControlId.indexOf(CpsCommonConst.comProduceLine)              // 生产线 -- 结束组件
        let startWorkshopSection = model.StartControlId.indexOf(CpsCommonConst.comWorkshopSection)  // 工段 -- 开始组件
        let endWorkshopSection = model.EndControlId.indexOf(CpsCommonConst.comWorkshopSection)      // 工段 -- 结束组件
        let startWorkProcess = model.StartControlId.indexOf(CpsCommonConst.comWorkProcess)          // 工序 -- 开始组件
        let endWorkProcess = model.EndControlId.indexOf(CpsCommonConst.comWorkProcess)              // 工序 -- 结束组件
        let startWorkstation = model.StartControlId.indexOf(CpsCommonConst.comWorkstation)          // 工作站点 -- 开始组件
        let endWorkstation = model.EndControlId.indexOf(CpsCommonConst.comWorkstation)              // 工作站点 -- 结束组件

        if ((startProduceLine === 0 && endWorkshopSection !== 0) || (endWorkshopSection === 0 && startProduceLine !== 0)) {
          checkErrorStr.push({kind: 1, msg: '只能由生产线组件指向工段组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if ((startWorkshopSection === 0 && endWorkProcess !== 0) || (endWorkProcess === 0 && startWorkshopSection !== 0)) {
          checkErrorStr.push({kind: 1, msg: '只能由工段组件指向工序组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if ((startWorkProcess === 0 && endWorkstation !== 0) || (endWorkstation === 0 && startWorkProcess !== 0)) {
          checkErrorStr.push({kind: 1, msg: '只能由工序组件指向工作站点组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if (endProduceLine === 0 && startWorkstation === 0) {
          checkErrorStr.push({kind: 1, msg: '工作站点组件不能指向生产线组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else {
          let oneWayVectors = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + model.StartControlId + '\'][data-endid=\'' + model.EndControlId + '\']')
          let twoWayVectors = $(CpsCommonConst.drawSVGId).find('polyline[data-startid!=\'' + model.StartControlId + '\'][data-endid=\'' + model.EndControlId + '\']')
          if (endWorkshopSection === 0 && (oneWayVectors.length > 1 || twoWayVectors.length > 0)) {
            checkErrorStr.push({kind: 1, msg: '同一工段组件只能被一个生产线组件来指向，矢量线【' + model.LineId + '】已为您自动删除！'})
          } else if (endWorkProcess === 0 && (oneWayVectors.length > 1 || twoWayVectors.length > 0)) {
            checkErrorStr.push({kind: 1, msg: '同一工序组件只能被一个工段组件来指向，矢量线【' + model.LineId + '】已为您自动删除！'})
          } else if (endWorkstation === 0 && (oneWayVectors.length > 1 || twoWayVectors.length > 0)) {
            checkErrorStr.push({kind: 1, msg: '同一工作站点组件只能被指向一个工序组件来指向，矢量线【' + model.LineId + '】已为您自动删除！'})
          }
        }
      }
      if (CpsCommonVar.controlLineModels.FactoryModuleType === 2) {
        let startTechRouteType = model.StartControlId.indexOf(CpsCommonConst.comTechRouteType)                  // 标准工艺类型 -- 开始组件
        let endTechRouteType = model.EndControlId.indexOf(CpsCommonConst.comTechRouteType)                      // 标准工艺类型 -- 结束组件
        let startTechRoute = model.StartControlId.indexOf(CpsCommonConst.comTechRoute)                          // 标准工艺路线 -- 开始组件
        let endTechRoute = model.EndControlId.indexOf(CpsCommonConst.comTechRoute)                              // 标准工艺路线 -- 结束组件
        let startWorkshopSection = model.StartControlId.indexOf(CpsCommonConst.comWorkshopSection)              // 工段 -- 开始组件
        let endWorkshopSection = model.EndControlId.indexOf(CpsCommonConst.comWorkshopSection)                  // 工段 -- 结束组件
        let startWorkProcess = model.StartControlId.indexOf(CpsCommonConst.comWorkProcess)                      // 工序 -- 开始组件
        let endWorkProcess = model.EndControlId.indexOf(CpsCommonConst.comWorkProcess)                          // 工序 -- 结束组件
        let startWorkstationConfig = model.StartControlId.indexOf(CpsCommonConst.comWorkstationConfig)          // 站点配置 -- 开始组件
        let endWorkstationConfig = model.EndControlId.indexOf(CpsCommonConst.comWorkstationConfig)              // 站点配置 -- 结束组件
        let startMaterialType = model.StartControlId.indexOf(CpsCommonConst.comMaterialType)                    // 物料类别 -- 开始组件
        let endMaterialType = model.EndControlId.indexOf(CpsCommonConst.comMaterialType)                        // 物料类别 -- 结束组件
        let startMaterial = model.StartControlId.indexOf(CpsCommonConst.comMaterial)                            // 物料 -- 开始组件

        if (endTechRouteType === 0) {
          checkErrorStr.push({kind: 1, msg: '只能由标准工艺类型组件指向标准工艺路线组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if (endWorkstationConfig === 0) {
          checkErrorStr.push({kind: 1, msg: '只能由站点配置组件指向工序组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if (endTechRoute === 0 && (startMaterial !== 0 && startTechRouteType !== 0)) {
          checkErrorStr.push({kind: 1, msg: '只能由标准工艺类型或物料组件指向标准工艺路线组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if ((startTechRoute === 0 && endWorkshopSection !== 0) || (endWorkshopSection === 0 && startTechRoute !== 0)) {
          checkErrorStr.push({kind: 1, msg: '只能由标准工艺路线组件指向工段组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if ((endWorkProcess !== 0 && (startWorkshopSection === 0 || startWorkstationConfig === 0 || startMaterialType === 0 || startWorkProcess === 0)) ||
          ((startWorkshopSection !== 0 && startWorkstationConfig !== 0 && startMaterialType !== 0 && startWorkProcess !== 0) && endWorkProcess === 0)) {
          checkErrorStr.push({kind: 1, msg: '只能由工段或站点配置或物料类别或工序组件指向工序组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else if (startMaterial === 0 && (endMaterialType !== 0 && endTechRoute !== 0)) {
          checkErrorStr.push({kind: 1, msg: '只能由物料组件指向物料类别或标准工艺路线组件，矢量线【' + model.LineId + '】已为您自动删除！'})
        } else {
          let oneWayVectors = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + model.StartControlId + '\']')
          if (startTechRouteType === 0 && oneWayVectors.length > 1) {
            checkErrorStr.push({kind: 1, msg: '同一标准工艺类型组件只能指向一个标准工艺路线组件，矢量线【' + model.LineId + '】已为您自动删除！'})
          } else if (startWorkProcess === 0 && oneWayVectors.length > 1) {
            checkErrorStr.push({kind: 1, msg: '同一工序组件只能指向一个工序组件，矢量线【' + model.LineId + '】已为您自动删除！'})
          } else if (startWorkstationConfig === 0 && oneWayVectors.length > 1) {
            checkErrorStr.push({kind: 1, msg: '同一站点配置组件只能指向一个工序组件，矢量线【' + model.LineId + '】已为您自动删除！'})
          } else {
            let towWayVectors = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + model.StartControlId + '\'][data-endid!=\'' + model.EndControlId + '\']')
            if (startTechRoute === 0 && endWorkshopSection === 0 && towWayVectors.length > 1) {
              checkErrorStr.push({kind: 1, msg: '同一工段只能被一个标准工艺路线组件组件所指向，矢量线【' + model.LineId + '】已为您自动删除！'})
            } else if (startWorkstationConfig === 0 && endWorkProcess === 0 && towWayVectors.length > 1) {
              checkErrorStr.push({kind: 1, msg: '同一工序只能被一个站点配置组件组件所指向，矢量线【' + model.LineId + '】已为您自动删除！'})
            }
          }
        }
      }
    } else {
      checkErrorStr.push({kind: 1, msg: '矢量线的起始组件、结束组件均不可为空且不可相同，矢量线【' + model.LineId + '】已为您自动删除！'})
    }

    return checkErrorStr
  }

  /** 校验产线模型配置中的组件配置和矢量线配置数据，去除无效数据并提示相关信息，返回是否需要保存
   * 组件校验：关联主数据ID不可为空
   * 矢量线校验：起始组件、结束组件不可不同不重复且具有一定指向性，只与当前组件配置明细中的组件相关联
   * */
  static checkProduceControlLineModels() {
    // 定义一个数组变量checkErrorStr用于保存校验错误信息，数组中对象元素kind为错误类型【0-提示,1-警告,2-错误,3-异常】，msg表示错误信息
    let checkErrorStr = []
    // 校验：当前产线模型配置中的组件配置和矢量线配置需全部存在相关数据，则继续校验，否则提示错误
    if (CpsCommonVar.controlLineModels.ControlDetail.length > 0 && CpsCommonVar.controlLineModels.VectorLineDetail.length > 0) {
      // 定义一个数组变量controlArray用于存储所有有效的功能组件，重新赋值给当前产线模型配置中的组件配置数据
      let controlArray = []
      // 定义一个数组变量controlIds用于存储所有组件ID值，用于校验矢量线的起始组件和结束组件是否在这个数组中和是否重复
      let controlIds = []
      // 校验：当前产线模型配置中的组件配置明细中的组件的关联主数据ID不可为空，否则提示错误信息
      for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
        let model = CpsCommonVar.controlLineModels.ControlDetail[i]
        if ($.inArray(model.ControlId, controlIds) !== -1) {
          $(CpsCommonConst.canvasId).find('div[id=\'' + model.ControlId + '\']').remove()
          CpsPolylineAttr.deletePolylineByControlId(model.ControlId)
          checkErrorStr.push({kind: 2, msg: '组件的ID已存在，组件【' + model.ControlName + '】已为您自动删除！'})
        } else {
          if (!model.RelId) {
            checkErrorStr.push({kind: 1, msg: '组件【' + model.ControlName + '】的关联主数据ID不可为空'})
          }
          controlIds.push(model.ControlId)
          controlArray.push(model)
        }
      }
      CpsCommonVar.controlLineModels.ControlDetail = controlArray

      // 定义一个数组变量polylineArray用于存储所有有效的矢量线，重新赋值给当前产线模型配置中的矢量线配置数据
      let polylineArray = []
      // 定义一个数组变量polylineIds用于存储所有矢量线ID值，用于校验矢量线的矢量线ID是否重复
      let polylineIds = []
      // 校验：当前产线模型配置中的矢量线配置明细中的矢量线的各种数据校验，否则提示错误信息
      for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
        let model = CpsCommonVar.controlLineModels.VectorLineDetail[i]
        let errorArr = CpsCommonFunc.checkProduceLineModel(model)
        if (errorArr.length > 0) {
          $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
          checkErrorStr = checkErrorStr.concat(errorArr)
        } else {
          // 校验：矢量线的起始组件和结束组件的值需跟画板上的CPS功能组件相关联且不允许完全重复，否则提示错误信息
          if ($.inArray(model.StartControlId, controlIds) === -1 || $.inArray(model.EndControlId, controlIds) === -1) {
            $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
            checkErrorStr.push({kind: 1, msg: '矢量线的起始组件、结束组件需跟画板中的组件关联的规则，矢量线【' + model.LineId + '】已为您自动删除！'})
          } else if ($.inArray(model.LineId, polylineIds) !== -1) {
            $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
            checkErrorStr.push({kind: 1, msg: '矢量线的ID已存在，矢量线【' + model.LineId + '】已为您自动删除！'})
          } else {
            polylineIds.push(model.LineId)
            polylineArray.push(model)
          }
        }
      }
      CpsCommonVar.controlLineModels.VectorLineDetail = polylineArray

      $(CpsCommonConst.drawSVGId).find('circle[name=\'drawCircle\']').css({'display': 'none'})
      CpsCommonVar.polylineAttrPanel.getForm().reset()               // 重置属性面板上的数据
    } else {
      checkErrorStr.push({kind: 2, msg: '画板中须存在组件以及其矢量线，否则无法继续操作！'})
    }
    return checkErrorStr
  }

  /** 保存当前CPS产线模型上的组件配置数据和矢量线配置数据
   * 将返回的结果中的错误信息显示出来或保存当前产线模型数据并刷新视图
   * */
  static saveProduceControlLineModels() {
    Ext.Ajax.request({
      url: '/CpsModule/SaveProduceControlLine',
      jsonData: {info: CpsCommonVar.controlLineModels},
      method: 'POST',
      async: false,
      timeout: 90000000,
      success: function (response) {
        //  方法SaveProduceControlLine执行正常，将json字符串转换json对象
        let result = Ext.decode(response.responseText)
        // 后端校验失败, 显示出错误信息
        if (result.Messages.length > 0) {
          let errMsg = []
          for (let i = 0; i < result.Messages.length; i++) {
            errMsg.push({kind: result.Messages[i].MessageKind, msg: result.Messages[i].Message})
          }
          Ax.utils.LibMsg.show(errMsg)
        } else {
          CpsCommonFunc.removeControlSelStyle()
          // 重置矢量线属性面板上的数据
          CpsCommonVar.polylineAttrPanel.getForm().reset()
          CpsCommonVar.controlLineModels = result.Result
          // 刷新当前产线模型视图
          if (CpsCommonVar.masterVcl) {
            let data = CpsCommonVar.masterVcl.invorkBcf('BrowseTo', [CpsCommonVar.masterVcl.currentPk])
            CpsCommonVar.masterVcl.setDataSet(data, false)
            let masterRow = CpsCommonVar.masterVcl.dataSet.getTable(0).data.items[0]
            for (let i = 0; i < CpsCommonVar.masterVcl.forms.length; i++) {
              CpsCommonVar.masterVcl.forms[i].loadRecord(masterRow)
            }
          }
          Ext.Msg.alert('提示', 'CPS产线建模成功')
        }
      },
      failure: function (response) {
        //  方法SaveProduceControlLine执行异常，将json字符串转换json对象，显示出异常信息
        let result = '保存当前CPS建模数据失败。异常原因为：' + Ext.decode(response.responseText)
        Ext.Msg.alert('提示', response.responseText)
      }
    })
  }

  /** 去除组件选中样式
   * */
  static removeControlSelStyle() {
    // 去除组件选中样式，重新CPS组件属性from，保存数据
    $(CpsCommonConst.canvasId).find('div.cps-controls-region').css({
      'background-color': '#eceff4',
      'border': '1px solid #bbcfde'
    })
    // 重置CPS功能组件属性面板上的数据
    CpsCommonVar.controlsAttrPanel.getForm().reset()
  }

  /** 获得长度为len的随机数字符串
   * len：随机字符串的长度,规则是：ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678  并默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
   * */
  static randomString(len) {
    len = len || 32
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }

  /** 根据功能标识progId来判断此功能是否拥有使用权限
   * progId：功能标识，在功能数据中具有唯一性
   * */
  static canUseFunc(progId) {
    // 定义一个变量canUse，用于表示当前功能是否拥有使用权限，默认false
    let canUse = false
    // 同步执行后端方法canUseFunc，根据当前用户对象UserHandle和功能标识progId确认当前功能的使用权限
    Ext.Ajax.request({
      url: '/billSvc/canUseFunc',
      method: 'POST',
      jsonData: {
        handle: UserHandle, progId: progId
      },
      async: false,
      timeout: 90000000,
      success: function (response) {
        // 将返回的json字符串转换成Json格式对象，并为使用当前功能权限赋值
        let ret = Ext.decode(response.responseText)
        canUse = ret.CanUseFuncResult
      },
      failure: function (response) {
        Ext.Msg.alert('提示', '当前功能不具有使用权限')
        canUse = false
      }
    })
    return canUse
  }

  /** 定义查询下拉框的模型
   * */
  static getFilterCob() {
    // 查询数据model
    let filterStore = Ext.create('Ext.data.Store', {
      fields: ['key', 'value'],
      data: [{key: 'all', value: '无'}],
      proxy: {
        type: 'memory',
        reader: {
          type: 'json'
        }
      }
    })
    // 下拉数据model
    let filterCbo = Ext.create('Ext.form.field.ComboBox', {
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
    return filterCbo
  }

  /** 定义比较下拉框的模型
   * */
  static getCompareCbo() {
    // 比较数据model
    let compareStore = Ext.create('Ext.data.Store', {
      fields: ['key', 'value'],
      data: [{key: 0, value: '包含'},
        {key: 1, value: '等于'},
        {key: 2, value: '大于等于'},
        {key: 3, value: '小于等于'},
        {key: 4, value: '大于'},
        {key: 5, value: '小于'}]
    })
    // 下拉比较数据model
    let compareCbo = Ext.create('Ext.form.field.ComboBox', {
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
    return compareCbo
  }

  /** 定义文本的模型
   * */
  static getCompareTxt() {
    let compareTxt = Ext.create('Ext.form.field.Text', {
      labelWidth: 60,
      labelAlign: 'right',
      margin: '0 2 2 2',
      flex: 2
    })
    return compareTxt
  }

  /** 定义日期下拉框的模型
   * */
  static getDateCbo() {
    // 日期数据model
    let dateStore = Ext.create('Ext.data.Store', {
      fields: ['key', 'value'],
      data: [{key: 0, value: '无'},
        {key: 1, value: '近一周'},
        {key: 2, value: '近一月'},
        {key: 3, value: '近三月'}]
    })
    // 下拉日期数据model
    let dateCbo = Ext.create('Ext.form.field.ComboBox', {
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
    return dateCbo
  }
}
export {CpsCommonFunc, CpsCommonVar, CpsCommonConst}
