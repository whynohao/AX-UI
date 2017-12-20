/**********************************************************************
 * CopyRight 2017 杭州集控科技有限公司 版权所有
 * 功能描述：矢量线属性模块的主窗口
 * 创建标识：Huangwz 2017/04/28
 *
 * 修改标识：Huangwz 2017/04/28
 *
 ************************************************************************/
import {CpsCommonFunc, CpsCommonVar, CpsCommonConst} from './CpsCommon'
import {CpsMainPanel} from './CpsMainPanel'
import {CpsControlsAttr} from './CpsControlsAttr'
import {CpsEventPanel} from './CpsEventPanel'
class CpsPolylineAttr {
  // 当前矢量线组件相对于画板元素偏X移位
  static canvasOffsetX = 0
  // 当前矢量线组件相对于画板元素偏Y移位
  static canvasOffsetY = 0

  /** 创建矢量线属性模块 位于平台下右下方，高度170，宽度固定250
   * 【模型编号，行标识，行号，起始组件ID，结束组件ID，矢量线ID，矢量坐标，起点类型【无上右下左】，尾点类型【无上右下左】】
   * 【ProduceControlLineId，RowId，RowNo，StartControlId，EndControlId，LineId，Coordinates，ControlStartType，ControlEndType】
   * */
  static createPolylineAttrPanel() {
    CpsCommonVar.polylineAttrPanel = Ext.create('Ext.form.Panel', {
      id: 'cpsPolylineAttr-panel',
      title: '矢量线属性',
      bodyPadding: 5,
      width: '100%',
      height: 170,
      flex: 0,
      defaults: {
        anchor: '100%'
      },
      cls: 'cps-x-panel',
      items: [
        {
          xtype: 'textfield',
          name: 'ProduceControlLineId',
          fieldLabel: '模型编号',
          labelWidth: 60,
          hidden: true
        },
        {
          xtype: 'numberfield',
          name: 'RowId',
          fieldLabel: '行标识',
          labelWidth: 60,
          value: 0,
          minValue: 0,
          step: 1,
          hidden: true
        },
        {
          xtype: 'numberfield',
          name: 'RowNo',
          fieldLabel: '行号',
          labelWidth: 60,
          value: 0,
          minValue: 0,
          step: 1,
          hidden: true
        },
        {
          xtype: 'textfield',
          name: 'StartControlId',
          fieldLabel: '起始组件',
          labelWidth: 60,
          allowBlank: false,
          blankText: '此项必填',
          enforceMaxLength: true,
          maxLength: 100,
          maxLengthText: '此项最大输入长度为100',
          readOnly: true
        },
        {
          xtype: 'textfield',
          name: 'EndControlId',
          fieldLabel: '结束组件',
          labelWidth: 60,
          allowBlank: false,
          blankText: '此项必填',
          enforceMaxLength: true,
          maxLength: 100,
          maxLengthText: '此项最大输入长度为100',
          readOnly: true
        },
        {
          xtype: 'textfield',
          name: 'LineId',
          fieldLabel: '矢量线ID',
          labelWidth: 60,
          allowBlank: false,
          blankText: '此项必填',
          enforceMaxLength: true,
          maxLength: 100,
          maxLengthText: '此项最大输入长度为100',
          readOnly: true
        },
        {
          xtype: 'textfield',
          name: 'Coordinates',
          fieldLabel: '矢量坐标',
          labelWidth: 60,
          allowBlank: false,
          blankText: '此项必填',
          enforceMaxLength: true,
          maxLength: 100,
          maxLengthText: '此项最大输入长度为100',
          readOnly: true
        },
        {
          xtype: 'fieldcontainer',
          fieldLabel: '起点类型',
          labelWidth: 60,
          defaultType: 'radiofield',
          defaults: {
            flex: 1
          },
          layout: 'hbox',
          items: [
            {
              boxLabel: '其他',
              name: 'ControlStartType',
              inputValue: '0',
              checked: true,
              id: 'startRadio0',
              readOnly: true
            },
            {
              boxLabel: '上',
              name: 'ControlStartType',
              inputValue: '1',
              id: 'startRadio1',
              readOnly: true
            },
            {
              boxLabel: '右',
              name: 'ControlStartType',
              inputValue: '2',
              id: 'startRadio2',
              readOnly: true
            },
            {
              boxLabel: '下',
              name: 'ControlStartType',
              inputValue: '3',
              id: 'startRadio3',
              readOnly: true
            },
            {
              boxLabel: '左',
              name: 'ControlStartType',
              inputValue: '4',
              id: 'startRadio4',
              readOnly: true
            }
          ],
          hidden: true
        },
        {
          xtype: 'fieldcontainer',
          fieldLabel: '尾点类型',
          labelWidth: 60,
          defaultType: 'radiofield',
          defaults: {
            flex: 1
          },
          layout: 'hbox',
          items: [
            {
              boxLabel: '其他',
              name: 'ControlEndType',
              inputValue: '0',
              checked: true,
              id: 'endRadio0',
              readOnly: true
            },
            {
              boxLabel: '上',
              name: 'ControlEndType',
              inputValue: '1',
              id: 'endRadio1',
              readOnly: true
            },
            {
              boxLabel: '右',
              name: 'ControlEndType',
              inputValue: '2',
              id: 'endRadio2',
              readOnly: true
            },
            {
              boxLabel: '下',
              name: 'ControlEndType',
              inputValue: '3',
              id: 'endRadio3',
              readOnly: true
            },
            {
              boxLabel: '左',
              name: 'ControlEndType',
              inputValue: '4',
              id: 'endRadio4',
              readOnly: true
            }
          ],
          hidden: true
        }
      ]
    })
    return CpsCommonVar.polylineAttrPanel
  }

  /** 粘贴已经复制的SVG矢量线到画板中并绑定相关事件
   * svgPolyline：已复制的SVG矢量线元素
   * */
  static copySvgPolyline(svgPolyline) {
    let curPoints = null
    let oraPoints = svgPolyline.attr('points').split(' ')
    for (let i = 0; i < oraPoints.length; i++) {
      let pointX = parseInt(oraPoints[i].split(',')[0]) + 10
      let pointY = parseInt(oraPoints[i].split(',')[1]) + 10
      curPoints = curPoints + pointX + ',' + pointY + ' '
    }
    // 定义一个变量lineId用于表示矢量线的矢量ID，具有唯一标识
    let lineId = 'drawLine_' + parseInt(Math.random() * 10000)
    while ($(CpsCommonConst.drawSVGId).find('line[id=\'' + lineId + '\']').length > 0) {
      lineId = 'drawLine_' + parseInt(Math.random() * 10000)
    }
    // 定义一个变量polyline来表示在SVG上创建的一条多边曲线
    let polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    if (polyline) {
      polyline.setAttribute('name', 'drawLine')
      polyline.setAttribute('id', lineId)
      polyline.setAttribute('marker-end', 'url(#markerArrow)')
      polyline.setAttribute('style', 'fill:none;stroke:red;stroke-width:2;cursor:move')
      polyline.setAttribute('data-endid', '')
      polyline.setAttribute('data-endtype', '0')
      polyline.setAttribute('data-startid', '')
      polyline.setAttribute('data-starttype', '0')
      polyline.setAttribute('points', curPoints.substr(0, curPoints.length - 1))
      $(CpsCommonConst.drawSVGId).append(polyline)
      CpsPolylineAttr.updatePolylineByLineId(lineId)
      CpsPolylineAttr.setPolylineOtherEvent()
      CpsEventPanel.copySvgPolyline = $(polyline)
      CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
    }
  }

  /** 根据鼠标的坐标获得最近的吸附在组件位置方点的方点数据
   * 通过变量positionRectPoints得到组件的位置方点数组，
   * 然后计算每个方点的吸附范围【X坐标为leftX-rightX，Y坐标为lowerY-upperY】，
   * 处于组件方点的吸附范围，则返回此方点数据，否则返回空值
   * */
  static getPositionRectPoint(rectX, rectY) {
    let positionRectPoints = CpsCommonVar.positionRectPoints
    if (positionRectPoints) {
      for (let i = 0; i < positionRectPoints.length; i++) {
        let point = positionRectPoints[i]
        let leftX = point.x
        let rightX = point.x + point.width
        let lowerY = point.y
        let upperY = point.y + point.height
        if (rectX < rightX && rectX > leftX && rectY < upperY && rectY > lowerY) {
          return point
        }
      }
    }
    return null
  }

  /** 创建一条多边曲线，计算其实际起点坐标和起点位置类型并将其附加入SVG中，绑定其相关事件
   * 变量lineId为此多边曲线的矢量ID，为唯一标识。
   * */
  static createPolyline(clientX, clientY) {
    let startControlId = ''
    let startPointIndex = 0
    let x1 = clientX - CpsPolylineAttr.canvasOffsetX
    let y1 = clientY - CpsPolylineAttr.canvasOffsetY
    let points = x1 + ',' + y1
    // 当前鼠标坐标是否吸附在组件方点的上，若是则给矢量线开始组件和开始组件类型赋值并计算当前吸附点的实际坐标，否则给予默认值
    let point = CpsPolylineAttr.getPositionRectPoint(x1, y1)
    if (point) {
      startControlId = point.controlId
      startPointIndex = point.index
      // 根据矢量线起点吸附的组件方点的XY坐标和方点位置，计算实际吸附点坐标
      points = CpsCommonFunc.getPolylineStartOrEndPoint(point.x, point.y, point.index, true)
    }
    let polyline = CpsEventPanel.createSvgPolyline(points, startControlId, startPointIndex, '', 0)
    if (polyline) {
      $(CpsCommonConst.drawSVGId).append(polyline)
      let lineId = $(polyline).attr('id')
      CpsPolylineAttr.setPolylineAttrFormValues(lineId)
      CpsCommonVar.selVectorLineId = lineId
    }
  }

  /** 矢量线移动过程中设置其坐标集且更新起始组件或结束组件的组件ID和组件位置类型
   * 通过变量vectorLinePoint来判定绘制矢量线时起尾端的变化情况，0表示起点不定，尾点固定；1表示起点固定，尾点不定
   * 根据实际鼠标所在坐标点（吸附在组件上的位置方点时为方点的坐标）和矢量线起点坐标计算出相应的矢量线坐标集
   * */
  static updatePolyline(polyline, clientX, clientY) {
    let points = polyline.attr('points').split(' ')
    let x1, x2, y1, y2
    // 按住箭头方向拖动连接线,箭头坐标不定
    if (CpsCommonVar.vectorLineIndex === 1) {
      x1 = parseInt(points[0].split(',')[0])
      y1 = parseInt(points[0].split(',')[1])
      x2 = clientX - CpsPolylineAttr.canvasOffsetX
      y2 = clientY - CpsPolylineAttr.canvasOffsetY
      // 当前鼠标坐标是否吸附在组件方点的上，若是则给矢量线结束组件和结束组件类型赋值并计算当前吸附点的实际坐标，否则给予默认值
      let point = CpsPolylineAttr.getPositionRectPoint(x2, y2)
      if (point) {
        // 根据矢量线起点吸附的组件方点的XY坐标和方点位置，计算实际吸附点坐标
        let coordinate = CpsCommonFunc.getPolylineStartOrEndPoint(point.x, point.y, point.index, false)
        x2 = parseInt(coordinate.split(',')[0])
        y2 = parseInt(coordinate.split(',')[1])
        polyline.attr({'data-endid': point.controlId, 'data-endtype': point.index})
        CpsCommonVar.polylineAttrPanel.getForm().findField('EndControlId').setValue(point.controlId)
      } else {
        polyline.attr({'data-endid': '', 'data-endtype': 0})
        CpsCommonVar.polylineAttrPanel.getForm().findField('EndControlId').setValue('')
      }
    }
    // 按住非箭头方向拖动连接线,非箭头坐标不定
    if (CpsCommonVar.vectorLineIndex === 0) {
      let lstIndex = points.length - 1
      x1 = clientX - CpsPolylineAttr.canvasOffsetX
      y1 = clientY - CpsPolylineAttr.canvasOffsetY
      x2 = parseInt(points[lstIndex].split(',')[0])
      y2 = parseInt(points[lstIndex].split(',')[1])
      // 当前鼠标坐标是否吸附在组件方点的上，若是则给矢量线开始组件和开始组件类型赋值并计算当前吸附点的实际坐标，否则给予默认值
      let point = CpsPolylineAttr.getPositionRectPoint(x1, y1)
      if (point) {
        // 根据矢量线起点吸附的组件方点的XY坐标和方点位置，计算实际吸附点坐标
        let coordinate = CpsCommonFunc.getPolylineStartOrEndPoint(point.x, point.y, point.index, true)
        x1 = parseInt(coordinate.split(',')[0])
        y1 = parseInt(coordinate.split(',')[1])
        polyline.attr({'data-startid': point.controlId, 'data-starttype': point.index})
        CpsCommonVar.polylineAttrPanel.getForm().findField('StartControlId').setValue(point.controlId)
      } else {
        polyline.attr({'data-startid': '', 'data-starttype': 0})
        CpsCommonVar.polylineAttrPanel.getForm().findField('StartControlId').setValue('')
      }
    }
    let controlStartType = parseInt(polyline.attr('data-starttype'))
    let controlEndType = parseInt(polyline.attr('data-endtype'))
    points = CpsCommonFunc.getPointsByStyle(x1, y1, x2, y2, controlStartType, controlEndType)
    polyline.attr({'points': points})
    CpsCommonVar.polylineAttrPanel.getForm().findField('Coordinates').setValue(points)
  }

  /** 矢量线绘制结束，根据矢量线的矢量坐标集的规则判定是否保存矢量线数据
   * 矢量坐标集的规则：坐标个数不得小于两个，起尾坐标不得相同，起尾坐标的横向（X坐标范围）和竖向（Y坐标范围）不得小于4
   * */
  static savePolyline(polyline) {
    let lineId = polyline.attr('id')
    let points = polyline.attr('points').split(' ')
    if (points.length < 2 || points[0] === points[points.length - 1]) {
      CpsPolylineAttr.deletePolylineByLineId(lineId)
    } else {
      let x1 = parseInt(points[0].split(',')[0])
      let y1 = parseInt(points[0].split(',')[1])
      let x2 = parseInt(points[points.length - 1].split(',')[0])
      let y2 = parseInt(points[points.length - 1].split(',')[1])
      if (Math.abs(x2 - x1) < 4 && Math.abs(y2 - y1) < 4) {
        CpsPolylineAttr.deletePolylineByLineId(lineId)
      } else {
        let model = CpsPolylineAttr.getPolylineModel(polyline)
        let errorArr = CpsCommonFunc.checkProduceLineModel(model)
        if (errorArr.length > 0) {
          toastr.error(errorArr[0].msg, '错误矢量线绘制')
          CpsPolylineAttr.deletePolylineByLineId(lineId)
        } else {
          CpsPolylineAttr.updatePolylineByLineId(lineId)
          CpsPolylineAttr.setPolylineOtherEvent()
        }
      }
    }
  }

  /** 根据矢量线的矢量ID值找到CPS产线模型中矢量线配置明细数据中的矢量线模型并将模型数据赋值给矢量线属性模块
   * lineId：矢量ID，矢量线明细数据下的矢量线标识，具有唯一性
   * */
  static setPolylineAttrFormValues(lineId) {
    let polyline = $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + lineId + '\']')
    if (polyline.length > 0) {
      let model = CpsPolylineAttr.getPolylineModel(polyline)
      CpsCommonVar.polylineAttrPanel.getForm().setValues(model)
      Ext.getCmp('startRadio' + model.ControlStartType).setValue(true)
      Ext.getCmp('endRadio' + model.ControlEndType).setValue(true)
    }
  }

  /** 根据矢量线的属性获取它的矢量线模型
   * polyline：矢量线元素
   * */
  static getPolylineModel(polyline) {
    let lineId = polyline.attr('id')
    let startControlId = polyline.attr('data-startid')
    let endControlId = polyline.attr('data-endid')
    let coordinates = polyline.attr('points')
    let controlStartType = polyline.attr('data-starttype')
    let controlEndType = polyline.attr('data-endtype')
    let model = {
      'ProduceControlLineId': '',
      'RowId': 0,
      'RowNo': 0,
      'StartControlId': startControlId,
      'EndControlId': endControlId,
      'LineId': lineId,
      'Coordinates': coordinates,
      'ControlStartType': parseInt(controlStartType),
      'ControlEndType': parseInt(controlEndType)
    }
    return model
  }

  /** 更新CPS产线模型中的矢量线配置明细数据中矢量线属性矢量ID值为lineId的矢量线
   * lineId：矢量ID，矢量线明细数据下的矢量线标识，具有唯一性
   * 当产线模型中的矢量线配置明细中矢量线（矢量ID值为lineId）存在时，先删除此矢量线数据再添加此矢量线新的数据
   * */
  static updatePolylineByLineId(lineId) {
    let polyline = $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + lineId + '\']')
    let model = CpsPolylineAttr.getPolylineModel(polyline)
    for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
      if (CpsCommonVar.controlLineModels.VectorLineDetail[i].LineId === lineId) {
        CpsCommonVar.controlLineModels.VectorLineDetail.splice(i, 1)
        break
      }
    }
    CpsCommonVar.controlLineModels.VectorLineDetail.push(model)
  }

  /** 组件ID更改，更新CPS产线模型中的矢量线配置明细数据中所有与此组件相关联的矢量线中的起始/结束组件属性值
   * controlId：组件ID，组件明细数据下的组件标识，具有唯一性
   * newValue：所要更新的属性值
   * */
  static updatePolylineIdByControlId(controlId, newValue) {
    // 若与此组件相关联的矢量线的属性在矢量线属性模块中显示出来，则在矢量线属性模块中重新加载此矢量线的属性
    let lineId = CpsCommonVar.polylineAttrPanel.getForm().findField('LineId').getValue()
    if (lineId) {
      let startControlId = CpsCommonVar.polylineAttrPanel.getForm().findField('StartControlId').getValue()
      let endControlId = CpsCommonVar.polylineAttrPanel.getForm().findField('EndControlId').getValue()
      if (startControlId === controlId) {
        CpsCommonVar.polylineAttrPanel.getForm().findField('StartControlId').setValue(newValue)
      }
      if (endControlId === controlId) {
        CpsCommonVar.polylineAttrPanel.getForm().findField('EndControlId').setValue(newValue)
      }
    }
    // 更新CPS产线模型中的矢量线配置明细数据下所有与此组件相关联的矢量线的起始组件和结束组件值为新值
    for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
      // 遍历此矢量线的模型数据
      let model = CpsCommonVar.controlLineModels.VectorLineDetail[i]
      if (model.StartControlId === controlId) {
        model.StartControlId = newValue
        // 更新所有与此组件相关联的矢量线DOM中的起始组件属性data-startcontrolid的值为新值
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').attr({'data-startid': newValue})
      }
      if (model.EndControlId === controlId) {
        model.EndControlId = newValue
        // 更新所有与此组件相关联的矢量线DOM中的结束组件属性data-endcontrolid的值为新值
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').attr({'data-endid': newValue})
      }
    }
  }

  /** 组件位置或宽高更改，更新CPS产线模型中的矢量线配置明细数据中所有与此组件相关联的矢量线中的矢量坐标属性值
   * controlId：组件ID，组件明细数据下的组件标识，具有唯一性
   * */
  static updatePolylinePointsByControlId(controlId) {
    let startVectors = $(CpsCommonConst.drawSVGId).find('polyline[data-startid=\'' + controlId + '\']')
    let endVectors = $(CpsCommonConst.drawSVGId).find('polyline[data-endid=\'' + controlId + '\']')
    if (startVectors.length > 0 || endVectors.length > 0) {
      // 根据组件ID得到画板中相应的组件DOM元素
      let eleControl = $(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']')
      // 根据得到的组件计算出此组件周围的位置圆点属性数组
      let positionRectPoints = CpsCommonFunc.getElementPoints(eleControl, 'controlRect')
      // 组件拖动时与非箭头方向相关联的矢量线
      for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
        // 遍历此矢量线的模型数据
        let model = CpsCommonVar.controlLineModels.VectorLineDetail[i]
        if (model.StartControlId === controlId || model.EndControlId === controlId) {
          // 矢量线的起点关联到组件上的位置圆点的所在位置类型【上右下左-1234】
          let controlStartType = model.ControlStartType
          // 矢量线的尾点关联到组件上的位置圆点的所在位置类型【上右下左-1234】
          let controlEndType = model.ControlEndType
          // 得到矢量线的矢量坐标中的坐标数组
          let pointArr = model.Coordinates.split(' ')
          // 矢量线的矢量坐标的起点坐标的X坐标
          let x1 = parseInt(pointArr[0].split(',')[0])
          // 矢量线的矢量坐标的起点坐标的Y坐标
          let y1 = parseInt(pointArr[0].split(',')[1])
          // 矢量线的矢量坐标的尾点坐标的X坐标
          let x2 = parseInt(pointArr[pointArr.length - 1].split(',')[0])
          // 矢量线的矢量坐标的尾点坐标的Y坐标
          let y2 = parseInt(pointArr[pointArr.length - 1].split(',')[1])

          if (model.StartControlId === controlId) {               // 修正矢量线属性起始组件为此组件ID值的所有矢量线的坐标属性值
            // 矢量线的起点的X坐标,默认为其所关联的组件上的位置圆点的X坐标
            x1 = positionRectPoints[controlStartType - 1].x
            // 矢量线的起点的Y坐标,默认为所关联的组件上的位置圆点的Y坐标
            y1 = positionRectPoints[controlStartType - 1].y
            // 获得矢量线的起点所关联的实际圆点吸附点坐标
            let point = CpsCommonFunc.getPolylineStartOrEndPoint(x1, y1, controlStartType, true)
            if (point) {
              x1 = parseInt(point.split(',')[0])
              y1 = parseInt(point.split(',')[1])
            }
          } else if (model.EndControlId === controlId) {          // 修正矢量线属性结束组件为此组件ID值的所有矢量线的坐标属性值
            // 矢量线的尾点的X坐标,默认为所关联的组件上的位置圆点的X坐标
            x2 = positionRectPoints[controlEndType - 1].x
            // 矢量线的尾点的Y坐标,默认为所关联的组件上的位置圆点的Y坐标
            y2 = positionRectPoints[controlEndType - 1].y
            // 获得矢量线的起点所关联的实际圆点吸附点坐标
            let point = CpsCommonFunc.getPolylineStartOrEndPoint(x2, y2, controlEndType, false)
            if (point) {
              x2 = parseInt(point.split(',')[0])
              y2 = parseInt(point.split(',')[1])
            }
          }

          // 根据矢量线的起尾点坐标以及起尾点的关联圆点位置计算出矢量线的矢量坐标
          let points = CpsCommonFunc.getPointsByStyle(x1, y1, x2, y2, controlStartType, controlEndType)
          // 修正画板上此矢量线的矢量坐标，以便重新绘制矢量线
          $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').attr({'points': points})
          // 更新CPS产线模型中的矢量线配置明细数据中的此矢量线的矢量坐标值
          model.Coordinates = points
        }
      }
    }
  }

  /** 删除CPS产线模型中的矢量线配置明细数据中所有矢量线属性起始组件或结束组件值为当前组件ID值的矢量线
   * controlId：组件ID，组件明细数据下的组件标识，具有唯一性
   * */
  static deletePolylineByControlId(controlId) {
    // 定义一个数组变量，用于存放新的矢量线数组，即为去除了CPS产线模型中的矢量线配置明细数据中的关联到组件的矢量线
    let vectorLineArr = []
    for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
      let model = CpsCommonVar.controlLineModels.VectorLineDetail[i]
      if (model.StartControlId !== controlId && model.EndControlId !== controlId) {
        vectorLineArr.push(model)
      } else {
        // 将删除画板中矢量线属性起始组件或结束组件为此组件ID的矢量线
        $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + model.LineId + '\']').remove()
      }
    }
    // 将删除与组件相关联的矢量线之后的矢量线数组重新赋值给CPS产线模型中的矢量线配置明细
    CpsCommonVar.controlLineModels.VectorLineDetail = vectorLineArr
    // 重置恢复矢量线属性模块上的默认数据
    CpsCommonVar.polylineAttrPanel.getForm().reset()
  }

  /** 删除CPS产线模型中的矢量线配置明细数据中矢量线属性矢量ID值为lineId的矢量线
   * lineId：矢量ID，矢量线明细数据下的矢量线标识，具有唯一性
   * */
  static deletePolylineByLineId(lineId) {
    $(CpsCommonConst.drawSVGId).find('circle[name=\'drawCircle\']').css({'display': 'none'})
    for (let i = 0; i < CpsCommonVar.controlLineModels.VectorLineDetail.length; i++) {
      if (CpsCommonVar.controlLineModels.VectorLineDetail[i].LineId === lineId) {
        // 将此矢量线模型从矢量线配置明细数组中删除
        CpsCommonVar.controlLineModels.VectorLineDetail.splice(i, 1)
        break
      }
    }
    // 若被删除的此矢量线已被选中并在矢量线属性Form中展示出来，则重置CPS组件属性Form
    if (CpsCommonVar.polylineAttrPanel.getForm().findField('LineId').getValue() === lineId) {
      // 重置恢复矢量线属性模块上的默认数据
      CpsCommonVar.polylineAttrPanel.getForm().reset()
    }
    // 将删除画板中矢量线属性矢量ID值为lineId的矢量线
    $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + lineId + '\']').remove()
    CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
  }

  /** 矢量线的初始化事件【矢量线其他事件，矢量线绘制事件】
   * 【矢量线其他事件：矢量线单击事件】
   * 【矢量线绘制事件：矢量线绘制开始事件，矢量线绘制移动事件，矢量线绘制结束事件】
   * */
  static initPolylineEvent() {
    CpsPolylineAttr.setPolylineOtherEvent()
    CpsPolylineAttr.setPolylineDrawEvent()
  }

  /** 矢量线其他事件【矢量线单击事件】
   * 【矢量线单击事件：用于显示矢量线的两端的拉伸圆点和其属性】
   * */
  static setPolylineOtherEvent() {
    /** 重新绑定矢量线单击事件，用于显示矢量线的两端的拉伸圆点并将此矢量线的属性在矢量线属性模块中显示出来
     * 使用变量selVectorLineId来表示当前矢量线的矢量ID，用于delete键时删除此矢量线
     * */
    $(CpsCommonConst.drawSVGId).find('polyline[name=\'drawLine\']').unbind('click').bind('click', function (event) {
      if (!CpsCommonVar.useVectorLine) {
        CpsCommonVar.selSvgPolyline = $(this)
        CpsCommonVar.isSelCpsControl = false
        CpsCommonVar.selVectorLineId = CpsCommonVar.selSvgPolyline.attr('id')
        CpsCommonFunc.showElementPoints(CpsCommonVar.selSvgPolyline, 'drawCircle')
        CpsPolylineAttr.setPolylineAttrFormValues(CpsCommonVar.selVectorLineId)
      }
    })
  }

  /** 矢量线绘制事件【矢量线绘制开始事件，矢量线绘制移动事件，矢量线绘制结束事件】
   * 【矢量线绘制开始事件：绘制一条多边曲线并将其放入SVG中】
   * 【矢量线绘制移动事件：改变多边曲线的矢量坐标集和其起始组件、结束组件的ID和位置类型】
   * 【矢量线绘制结束事件：根据矢量坐标集的规则判定是否保存此多边曲线的数据】
   * */
  static setPolylineDrawEvent() {
    /** 重新绑定矢量线绘制开始事件(鼠标按钮被按下。)，创建矢量线
     * 通过方法createPolyline创建一条多边曲线，并在矢量线属性模块中显示出此多边曲线的属性
     * */
    $(CpsCommonConst.canvasId).unbind('mousedown').bind('mousedown', function (event) {
      if (CpsCommonVar.useVectorLine && !CpsCommonVar.selVectorLineId) {
        CpsPolylineAttr.canvasOffsetX = $(CpsCommonConst.canvasId).offset().left - $(CpsCommonConst.canvasId).scrollLeft()
        CpsPolylineAttr.canvasOffsetY = $(CpsCommonConst.canvasId).offset().top - $(CpsCommonConst.canvasId).scrollTop()
        CpsPolylineAttr.createPolyline(event.clientX, event.clientY)
        event.preventDefault()
      }
    })

    /** 重新绑定矢量线绘制移动事件(鼠标被移动。)，记移动矢量线
     * 变量selVectorLineId来代表此要绘制的矢量线，移动过程中修改矢量线的矢量坐标集和其起始组件、结束组件的ID和位置类型
     * */
    $(CpsCommonConst.canvasId).unbind('mousemove').bind('mousemove', function (event) {
      if ((CpsCommonVar.useVectorLine || CpsCommonVar.redrawVectorLine) && CpsCommonVar.selVectorLineId) {
        let polyline = $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + CpsCommonVar.selVectorLineId + '\']')
        if (polyline.length > 0) {
          CpsPolylineAttr.canvasOffsetX = $(CpsCommonConst.canvasId).offset().left - $(CpsCommonConst.canvasId).scrollLeft()
          CpsPolylineAttr.canvasOffsetY = $(CpsCommonConst.canvasId).offset().top - $(CpsCommonConst.canvasId).scrollTop()
          CpsPolylineAttr.updatePolyline(polyline, event.clientX, event.clientY)
        }
      }
      if (!CpsCommonVar.useVectorLine && CpsCommonVar.redrawCpsControl && CpsCommonVar.selControlId) {
        let elDrag = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsCommonVar.selControlId + '\']')
        if (elDrag.length > 0) {
          CpsControlsAttr.changeCpsControlAttr(elDrag, CpsCommonVar.cpsControlPoint)
          CpsMainPanel.resizeDrawSvg(elDrag)  //CPS组件移动中拓展
        }
      }
    })

    /** 重新绑定矢量线绘制结束事件(鼠标按键被松开。)，保存矢量线或者去除矢量线选中状态
     * 变量selVectorLineId来代表此要绘制的矢量线，保存矢量线要根据矢量坐标集的规则判定是否保存此矢量线的数据
     * 若不是绘制矢量线的状态，则要去除矢量线的选中状态，隐藏矢量线两端的拉伸圆点
     * */
    $(CpsCommonConst.canvasId).unbind('mouseup').bind('mouseup', function (event) {
      if ((CpsCommonVar.useVectorLine || CpsCommonVar.redrawVectorLine) && CpsCommonVar.selVectorLineId) {
        let polyline = $(CpsCommonConst.drawSVGId).find('polyline[id=\'' + CpsCommonVar.selVectorLineId + '\']')
        if (polyline.length > 0) {
          CpsCommonFunc.showElementPoints(polyline, 'drawCircle')
          CpsPolylineAttr.savePolyline(polyline)
        }
        CpsCommonVar.selVectorLineId = null
        CpsCommonVar.redrawVectorLine = false
        CpsCommonVar.vectorLineIndex = 1
        $(CpsCommonConst.drawSVGId).find('rect[name=\'controlRect\']').css({'display': 'none'})
        CpsCommonVar.positionRectPoints = null
        CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
      } else {
        CpsCommonVar.selVectorLineId = null
        $(CpsCommonConst.drawSVGId).find('circle[name=\'drawCircle\']').css({'display': 'none'})
        CpsCommonVar.polylineAttrPanel.getForm().reset()
      }
      if (!CpsCommonVar.useVectorLine && CpsCommonVar.redrawCpsControl && CpsCommonVar.selControlId) {
        CpsCommonVar.redrawCpsControl = false
        CpsCommonVar.cpsControlPoint = null
        let elDrag = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsCommonVar.selControlId + '\']')
        CpsCommonFunc.showElementPoints(elDrag, 'zoomCircle')
        let width = Math.round(elDrag.css('width').replace('px', ''))
        CpsControlsAttr.setControlAttr(CpsCommonVar.selControlId, 'ControlWidth', width)
        let height = Math.round(elDrag.css('height').replace('px', ''))
        CpsControlsAttr.setControlAttr(CpsCommonVar.selControlId, 'ControlHeight', height)
        // 更新CPS产线模型中的矢量线配置明细数据下所有与此组件相关联的矢量线的矢量坐标
        CpsPolylineAttr.updatePolylinePointsByControlId(CpsCommonVar.selControlId)
        CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
      } else {
        CpsCommonVar.selControlId = null
        $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
      }
    })
  }
}
export {CpsPolylineAttr}
