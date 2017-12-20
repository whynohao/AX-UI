/**********************************************************************
 * CopyRight 2017 杭州集控科技有限公司 版权所有
 * 功能描述：CPS功能组件属性模块的主窗口
 * 创建标识：Huangwz 2017/04/28
 *
 * 修改标识：Huangwz 2017/04/28
 *
 ************************************************************************/
import {CpsCommonFunc, CpsCommonVar, CpsCommonConst} from './CpsCommon'
import {CpsMainPanel} from './CpsMainPanel'
import {CpsPolylineAttr} from './CpsPolylineAttr'
class CpsControlsAttr {
  // 当前选中功能组件的某一属性的原始值
  static originalValue = null
  // 当前选中功能组件的组件ID
  static originalControlId = null

  /** 创建CPS组件属性模块 位于平台下右上方，高度不定，宽度固定250
   * 【模型编号，行标识，行号，关联主数据ID，功能标识，组件ID，组件别名，组件类型，X坐标，Y坐标，组件宽度，组件高度，组件描述】
   * 【ProduceControlLineId，RowId，RowNo，RelId，ProgId，ControlId，ControlName，ControlType，XCoordinate，YCoordinate，ControlWidth，ControlHeight，ControlDescription】
   * */
  static createControlAttrPanel() {
    CpsCommonVar.controlsAttrPanel = Ext.create('Ext.form.Panel', {
      id: 'cpsControlAttr-panel',
      title: 'CPS组件属性',
      bodyPadding: 5,
      width: '100%',
      flex: 1,
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
          name: 'RelId',
          fieldLabel: '主数据ID',
          labelWidth: 60,
          maxLength: 20,
          maxLengthText: '此项最大输入长度为20',
          readOnly: true
        },
        {
          xtype: 'textfield',
          name: 'ProgId',
          fieldLabel: '功能标识',
          labelWidth: 60,
          allowBlank: false,
          blankText: '此项必填',
          enforceMaxLength: true,
          maxLength: 50,
          maxLengthText: '此项最大输入长度为50',
          readOnly: true
        },
        {
          xtype: 'textfield',
          name: 'ControlId',
          fieldLabel: '组件ID',
          labelWidth: 60,
          allowBlank: false,
          blankText: '此项必填',
          enforceMaxLength: true,
          maxLength: 100,
          maxLengthText: '此项最大输入长度为100',
          listeners: {
            focus: function (component, eventObject, eOpts) {
              CpsControlsAttr.originalValue = component.value
            },
            blur: function (component, eventObject, eOpts) {
              if (CpsControlsAttr.originalValue) {
                // 当组件ID为空时，恢复原值并提示错误信息
                if (component.value) {
                  // 新的组件ID值与原值不同时，进行验证并赋予新值
                  if(component.value.split('_')[0] !== CpsControlsAttr.originalValue.split('_')[0]){
                    Ext.Msg.alert('提示', '当前组件ID必须以' + CpsControlsAttr.originalValue.split('_')[0] + '_为开头！')
                    this.up('form').getForm().findField('ControlId').setValue(CpsControlsAttr.originalValue)
                  } else if (component.value !== CpsControlsAttr.originalValue) {
                    // 若在画板中找到DOM的id为新值的元素时，说明已存在此组件ID值，违反了组件ID唯一性约束
                    let control = $(CpsCommonConst.canvasId).find('div[id=\'' + component.value + '\']')
                    if (control.length > 0) {
                      Ext.Msg.alert('提示', '当前组件ID已存在，请重新修改其值！')
                      this.up('form').getForm().findField('ControlId').setValue(CpsControlsAttr.originalValue)
                    } else {
                      // 更新当前选中组件DOM中属性id的值为新值,并更新CPS产线模型中的组件配置明细数据下的此组件的组件ID值为新值
                      $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalValue + '\']').attr('id', component.value)
                      CpsControlsAttr.setControlAttr(CpsControlsAttr.originalValue, 'ControlId', component.value)
                      // 更新CPS产线模型中与此组件相关联的所有在矢量线配置明细数据中的矢量线中的属性值
                      CpsPolylineAttr.updatePolylineIdByControlId(CpsControlsAttr.originalValue, component.value)
                    }
                  }
                  CpsControlsAttr.originalValue = null
                } else {
                  Ext.Msg.alert('提示', '当前组件ID不可为空！')
                  this.up('form').getForm().findField('ControlId').setValue(CpsControlsAttr.originalValue)
                }
              }
            }
          }
        },
        {
          xtype: 'textfield',
          name: 'ControlName',
          fieldLabel: '组件别名',
          labelWidth: 60,
          allowBlank: false,
          blankText: '此项必填',
          enforceMaxLength: true,
          maxLength: 100,
          maxLengthText: '此项最大输入长度为100',
          listeners: {
            focus: function (component, eventObject, eOpts) {
              CpsControlsAttr.originalControlId = this.up('form').getForm().findField('ControlId').getValue()
              CpsControlsAttr.originalValue = component.value
            },
            blur: function (component, eventObject, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                // 当组件别名为空时，恢复原值并提示错误信息
                if (component.value) {
                  if (component.value !== CpsControlsAttr.originalValue) {
                    // 更新当前选中组件DOM中属性组件别名的值为新值,并更新CPS产线模型中的组件配置明细数据下的此组件的组件别名值为新值
                    $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']').find('div.cps-controls-span').text(component.value)
                    CpsControlsAttr.setControlAttr(CpsControlsAttr.originalControlId, 'ControlName', component.value)
                  }
                } else {
                  Ext.Msg.alert('提示', '当前组件别名不可为空！')
                  this.up('form').getForm().findField('ControlName').setValue(CpsControlsAttr.originalValue)
                  $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']').find('div.cps-controls-span').text(CpsControlsAttr.originalValue)
                }
                CpsControlsAttr.originalControlId = null
              }
            },
            change: function (field, newValue, oldValue, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']').find('div.cps-controls-span').text(newValue)
              }
            }
          }
        },
        {
          xtype: 'fieldcontainer',
          fieldLabel: '组件类型',
          labelWidth: 60,
          defaultType: 'radiofield',
          defaults: {
            flex: 1
          },
          layout: 'vbox',
          items: [
            {
              boxLabel: 'CPS组件',
              name: 'ControlType',
              inputValue: '0',
              checked: true,
              id: 'radio0',
              readOnly: true
            },
            {
              boxLabel: '系统组件',
              name: 'ControlType',
              inputValue: '1',
              id: 'radio1',
              readOnly: true
            }
          ]
        },
        {
          xtype: 'numberfield',
          name: 'XCoordinate',
          fieldLabel: 'X坐标',
          labelWidth: 60,
          value: 1,
          minValue: 1,
          step: 1,
          allowBlank: false,
          blankText: '此项必填',
          allowDecimals: false,
          negativeText: '此项为整数值且大于0',
          listeners: {
            focus: function (component, eventObject, eOpts) {
              $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
              CpsControlsAttr.originalControlId = this.up('form').getForm().findField('ControlId').getValue()
              CpsControlsAttr.originalValue = component.value
            },
            blur: function (component, eventObject, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                // 当X坐标为空或0或小于0时，恢复原值并提示错误信息
                if (component.value && component.value > 0) {
                  // 新的X坐标值与原值不同时，进行验证并赋予新值
                  if (component.value !== CpsControlsAttr.originalValue) {
                    CpsControlsAttr.moveCpsControl(cpsControl, component.value, null)
                  }
                } else {
                  Ext.Msg.alert('提示', '当前X坐标不可为空且大于0！')
                  this.up('form').getForm().findField('XCoordinate').setValue(CpsControlsAttr.originalValue)
                  cpsControl.css('left', CpsControlsAttr.originalValue)
                }
                CpsControlsAttr.originalControlId = null
                CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
              }
            },
            change: function (field, newValue, oldValue, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                if (newValue > 0) {
                  cpsControl.css('left', newValue)
                  CpsMainPanel.resizeDrawSvg(cpsControl)  //CPS组件移动中拓展
                } else {
                  this.up('form').getForm().findField('XCoordinate').setValue(1)
                  cpsControl.css('left', 1)
                }
              }
            }
          }
        },
        {
          xtype: 'numberfield',
          name: 'YCoordinate',
          labelWidth: 60,
          fieldLabel: 'Y坐标',
          value: 1,
          minValue: 1,
          step: 1,
          allowBlank: false,
          blankText: '此项必填',
          allowDecimals: false,
          negativeText: '此项为整数值且大于0',
          listeners: {
            focus: function (component, eventObject, eOpts) {
              $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
              CpsControlsAttr.originalControlId = this.up('form').getForm().findField('ControlId').getValue()
              CpsControlsAttr.originalValue = component.value
            },
            blur: function (component, eventObject, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                // 当Y坐标为空或0或小于0时，恢复原值并提示错误信息
                if (component.value && component.value > 0) {
                  if (component.value !== CpsControlsAttr.originalValue) {
                    CpsControlsAttr.moveCpsControl(cpsControl, null, component.value)
                  }
                } else {
                  Ext.Msg.alert('提示', '当前Y坐标不可为空且大于0！')
                  this.up('form').getForm().findField('YCoordinate').setValue(CpsControlsAttr.originalValue)
                  cpsControl.css('top', CpsControlsAttr.originalValue)
                }
                CpsControlsAttr.originalControlId = null
                CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
              }
            },
            change: function (field, newValue, oldValue, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                if (newValue > 0) {
                  cpsControl.css('top', newValue)
                  CpsMainPanel.resizeDrawSvg(cpsControl)  //CPS组件移动中拓展
                } else {
                  this.up('form').getForm().findField('YCoordinate').setValue(1)
                  cpsControl.css('top', 1)
                }
              }
            }
          }
        },
        {
          xtype: 'numberfield',
          name: 'ControlWidth',
          fieldLabel: '组件宽度',
          labelWidth: 60,
          value: 90,
          minValue: 50,
          step: 1,
          allowBlank: false,
          blankText: '此项必填',
          allowDecimals: false,
          negativeText: '此项为整数值且不得小于50',
          listeners: {
            focus: function (component, eventObject, eOpts) {
              $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
              CpsControlsAttr.originalControlId = this.up('form').getForm().findField('ControlId').getValue()
              CpsControlsAttr.originalValue = component.value
            },
            blur: function (component, eventObject, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                // 获得此组件高度，在修改组件宽度时，此高度限定了组件宽度最小为组件高度-30，即不得小于图标的宽高度
                let cHeight = this.up('form').getForm().findField('ControlHeight').getValue()
                // 当组件宽度为空或小于50时，恢复原值并提示错误信息
                if (component.value && component.value >= 50) {
                  if (component.value !== CpsControlsAttr.originalValue) {
                    // 更新当前选中组件DOM中属性id的值为selControlId的元素，为其的width属性赋值，并更新CPS产线模型中的组件配置明细数据下的此组件的组件宽度值为新值
                    cpsControl.css('width', component.value)
                    CpsControlsAttr.setControlAttr(CpsControlsAttr.originalControlId, 'ControlWidth', component.value)
                    // 更新CPS产线模型中的矢量线配置明细数据下所有与此组件相关联的矢量线的矢量坐标
                    CpsPolylineAttr.updatePolylinePointsByControlId(CpsControlsAttr.originalControlId)
                  }
                } else {
                  Ext.Msg.alert('提示', '当前组件宽度不可为空且不小于50！')
                  this.up('form').getForm().findField('ControlWidth').setValue(CpsControlsAttr.originalValue)
                  cpsControl.css('width', CpsControlsAttr.originalValue)
                  // 在恢复组件原始宽度时，取得组件原始宽度和高度的最小值-30，作为图标实际的宽高度
                  if (cHeight > CpsControlsAttr.originalValue) {
                    cHeight = CpsControlsAttr.originalValue
                  }
                  cpsControl.find('img').css({
                    'width': (cHeight - 30) + 'px',
                    'height': (cHeight - 30) + 'px'
                  })
                }
                CpsControlsAttr.originalControlId = null
                CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
              }
            },
            change: function (field, newValue, oldValue, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                // 在修改组件原始宽度时，取得组件当前宽度和高度的最小值-30，作为图标实际的宽高度
                let cHeight = this.up('form').getForm().findField('ControlHeight').getValue()
                // 当组件宽度不足50时，强制变成50
                if (newValue < 50) {
                  newValue = 50
                  this.up('form').getForm().findField('ControlWidth').setValue(50)
                  cpsControl.css('width', newValue)
                } else {
                  cpsControl.css('width', newValue)
                  CpsMainPanel.resizeDrawSvg(cpsControl)  //CPS组件移动中拓展
                }
                if (cHeight > newValue) {
                  cHeight = newValue
                }
                cpsControl.find('img').css({
                  'width': (cHeight - 30) + 'px',
                  'height': (cHeight - 30) + 'px'
                })
              }
            }
          }
        },
        {
          xtype: 'numberfield',
          name: 'ControlHeight',
          fieldLabel: '组件高度',
          labelWidth: 60,
          value: 60,
          minValue: 40,
          step: 1,
          allowBlank: false,
          blankText: '此项必填',
          allowDecimals: false,
          negativeText: '此项为整数值且不得小于40',
          listeners: {
            focus: function (component, eventObject, eOpts) {
              $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
              CpsControlsAttr.originalControlId = this.up('form').getForm().findField('ControlId').getValue()
              CpsControlsAttr.originalValue = component.value
            },
            blur: function (component, eventObject, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                // 获得此组件宽度，在修改组件高度时，此宽度限定了组件高度最小为组件宽度，即不得小于图标的宽高度
                let cWidth = this.up('form').getForm().findField('ControlWidth').getValue()
                if (component.value && component.value >= 40) {
                  if (component.value !== CpsControlsAttr.originalValue) {
                    // 更新当前选中组件DOM中属性id的值为selControlId的元素，为其的height属性赋值，并更新CPS产线模型中的组件配置明细数据下的此组件的组件高度值为新值
                    cpsControl.css('height', component.value)
                    CpsControlsAttr.setControlAttr(CpsControlsAttr.originalControlId, 'ControlHeight', component.value)
                    // 更新CPS产线模型中的矢量线配置明细数据下所有与此组件相关联的矢量线的矢量坐标
                    CpsPolylineAttr.updatePolylinePointsByControlId(CpsControlsAttr.originalControlId)
                  }
                } else {
                  Ext.Msg.alert('提示', '当前组件高度不可为空且不小于40！')
                  this.up('form').getForm().findField('ControlHeight').setValue(CpsControlsAttr.originalValue)
                  cpsControl.css('height', CpsControlsAttr.originalValue)
                  // 在恢复组件高度时，取得组件原始高度和宽度的最小值-30，作为图标实际的宽高度
                  if (cWidth > CpsControlsAttr.originalValue) {
                    cWidth = CpsControlsAttr.originalValue
                  }
                  cpsControl.find('img').css({
                    'width': (cWidth - 30) + 'px',
                    'height': (cWidth - 30) + 'px'
                  })
                }
                CpsControlsAttr.originalControlId = null
                CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
              }
            },
            change: function (field, newValue, oldValue, eOpts) {
              if (CpsControlsAttr.originalControlId) {
                let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + CpsControlsAttr.originalControlId + '\']')
                // 在修改组件高度时，取得组件当前高度和宽度的最小值-30，作为图标实际的宽高度
                let cWidth = this.up('form').getForm().findField('ControlWidth').getValue()
                // 当组件高度不足40时，强制变成40
                if (newValue < 40) {
                  newValue = 40
                  this.up('form').getForm().findField('ControlHeight').setValue(40)
                  cpsControl.css('height', newValue)
                } else {
                  cpsControl.css('height', newValue)
                  CpsMainPanel.resizeDrawSvg(cpsControl)  //CPS组件移动中拓展
                }
                if (cWidth > newValue) {
                  cWidth = newValue
                }
                cpsControl.find('img').css({
                  'width': (cWidth - 30) + 'px',
                  'height': (cWidth - 30) + 'px'
                })
              }
            }
          }
        },
        {
          xtype: 'textareafield',
          name: 'ControlDescription',
          height: 200,
          fieldLabel: '组件描述',
          labelWidth: 60,
          grow: true,
          enforceMaxLength: true,
          maxLength: 2000,
          maxLengthText: '此项最大输入长度为2000',
          listeners: {
            focus: function (component) {
              CpsControlsAttr.originalControlId = this.up('form').getForm().findField('ControlId').getValue()
              CpsControlsAttr.originalValue = component.value
            },
            blur: function (component) {
              if (CpsControlsAttr.originalControlId) {
                // 更新CPS产线模型中的组件配置明细数据下的此组件的组件描述值为新值
                CpsControlsAttr.setControlAttr(CpsControlsAttr.originalControlId, 'ControlDescription', component.value)
                CpsControlsAttr.originalControlId = null
              }
            }
          }
        }
      ]
    })
    return CpsCommonVar.controlsAttrPanel
  }

  /** 将功能组件的属性在CPS组件属性模块中显示出来并将此组件设置成被选中状态
   * elDrag：组件元素，通过方法getControlAttr得到其model值，为组件属性模块的from赋值，去除其他组件的选中样式，将此组件设置成被选中状态
   * */
  static setControlAttrFormValues(elDrag) {
    let model = CpsControlsAttr.getControlAttr(elDrag)
    CpsCommonVar.controlsAttrPanel.getForm().setValues(model)
    Ext.getCmp('radio' + model.ControlType).setValue(true)
    $(CpsCommonConst.canvasId).find('div.cps-controls-region').css({
      'background-color': '#eceff4',
      'border': '1px solid #bbcfde'
    })
    elDrag.find('div.cps-controls-region').css({
      'background-color': '#f7f8db',
      'border': '1px solid #d2c06c'
    })
  }

  /** 根据组件的宽高度和坐标，返回CPS功能组件的最小宽高度
   * elDrag：CPS功能组件的元素
   * width：CPS功能组件的宽度
   * height：CPS功能组件的高度
   * left：CPS功能组件的X坐标
   * top：CPS功能组件的Y坐标
   * changeWidth：CPS功能组件的宽度发生变化
   * */
  static getCpsControlMinWidthOrHeight(elDrag, width, height, left, top, changeWidth) {
    let minValue = 0
    if (changeWidth) {
      minValue = width
      if (minValue < 50) {
        minValue = 50
      } else if (left) {
        elDrag.css('left', left)
        CpsCommonVar.controlsAttrPanel.getForm().findField('XCoordinate').setValue(left)
      }
      elDrag.css('width', minValue)
      CpsCommonVar.controlsAttrPanel.getForm().findField('ControlWidth').setValue(minValue)
      // 在修改组件原始宽度时，取得组件当前宽度和高度的最小值-30，作为图标实际的宽高度
      if (height > minValue) {
        height = minValue
      }
      elDrag.find('img').css({
        'width': (height - 30) + 'px',
        'height': (height - 30) + 'px'
      })
    } else {
      minValue = height
      if (minValue < 40) {
        minValue = 40
      } else if (top) {
        elDrag.css('top', top)
        CpsCommonVar.controlsAttrPanel.getForm().findField('YCoordinate').setValue(top)
      }
      elDrag.css('height', minValue)
      CpsCommonVar.controlsAttrPanel.getForm().findField('ControlHeight').setValue(minValue)
      // 在修改组件高度时，取得组件当前高度和宽度的最小值-30，作为图标实际的宽高度
      if (width > minValue) {
        width = minValue
      }
      elDrag.find('img').css({
        'width': (width - 30) + 'px',
        'height': (width - 30) + 'px'
      })
    }
    return minValue
  }

  /** 通过拖拽CPS功能组件上的拉伸圆点来改变组件的宽高、坐标以及内部的image图标大小
   * elDrag：CPS功能组件的元素
   * controlPoint：拉伸圆点属性【当前CPS组件宽高、坐标，拉伸圆点的起始坐标、原点位置（顺时针1-8个点）】
   * */
  static changeCpsControlAttr(elDrag, controlPoint) {
    let width = controlPoint.width
    let height = controlPoint.height
    let left = controlPoint.left
    let top = controlPoint.top
    let cx = event.clientX - parseInt(controlPoint.point.split(',')[0])
    let cy = event.clientY - parseInt(controlPoint.point.split(',')[1])
    if (controlPoint.index === 1) {
      let minWidth = CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width - cx, height - cy, left + cx, null, true)
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, minWidth, height - cy, null, top + cy, false)
    } else if (controlPoint.index === 3) {
      let minWidth = CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width + cx, height - cy, null, null, true)
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, minWidth, height - cy, null, top + cy, false)
    } else if (controlPoint.index === 5) {
      let minWidth = CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width + cx, height + cy, null, null, true)
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, minWidth, height + cy, null, null, false)
    } else if (controlPoint.index === 7) {
      let minWidth = CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width - cx, height + cy, left + cx, null, true)
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, minWidth, height + cy, null, null, false)
    } else if (controlPoint.index === 2) {
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width, height - cy, null, top + cy, false)
    } else if (controlPoint.index === 6) {
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width, height + cy, null, null, false)
    } else if (controlPoint.index === 4) {
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width + cx, height, null, null, true)
    } else if (controlPoint.index === 8) {
      CpsControlsAttr.getCpsControlMinWidthOrHeight(elDrag, width - cx, height, left + cx, null, true)
    }
  }

  /** 通过快捷键Ctrl+-来控制CPS功能组件上的宽高以及内部的image图标大小
   * cpsControl：CPS功能组件元素
   * enlarge：是否是放大操作，若是则宽度增加0.2倍，否则缩小0.2倍，高度等比例缩放
   * */
  static zoomCpsControl(cpsControl, enlarge) {
    $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
    let controlId = cpsControl.attr('id')
    let width = Math.round(cpsControl.css('width').replace('px', ''))
    let height = Math.round(cpsControl.css('height').replace('px', ''))
    let zoomWidth = enlarge ? width * 1.2 : width / 1.2
    let zoomHeight = zoomWidth / width * height
    zoomWidth = CpsControlsAttr.getCpsControlMinWidthOrHeight(cpsControl, zoomWidth, zoomHeight, null, null, true)
    CpsControlsAttr.setControlAttr(controlId, 'ControlWidth', zoomWidth)
    zoomHeight = CpsControlsAttr.getCpsControlMinWidthOrHeight(cpsControl, zoomWidth, zoomHeight, null, null, false)
    CpsControlsAttr.setControlAttr(controlId, 'ControlHeight', zoomHeight)
    // 更新CPS产线模型中的矢量线配置明细数据下所有与此组件相关联的矢量线的矢量坐标
    CpsPolylineAttr.updatePolylinePointsByControlId(controlId)
    CpsMainPanel.resizeDrawSvg(cpsControl)  //CPS组件移动中拓展
  }

  /** 移动CPS功能组件时，改变组件的坐标
   * cpsControl：CPS功能组件元素
   * left：组件的X坐标
   * top：组件的Y坐标
   * */
  static moveCpsControl(cpsControl, left, top) {
    let controlId = cpsControl.attr('id')
    if (top) {
      // 更新组件属性id的值为selControlId的组件元素，为其的top属性赋值，并更新CPS产线模型中的组件配置明细数据下的此组件的Y坐标值为新值
      cpsControl.css('top', top)
      CpsControlsAttr.setControlAttr(controlId, 'YCoordinate', top)
      CpsCommonVar.controlsAttrPanel.getForm().findField('YCoordinate').setValue(top)
    }
    if (left) {
      // 更新组件属性id的值为selControlId的组件元素，为其的left属性赋值，并更新CPS产线模型中的组件配置明细数据下的此组件的X坐标值为新值
      cpsControl.css('left', left)
      CpsControlsAttr.setControlAttr(controlId, 'XCoordinate', left)
      CpsCommonVar.controlsAttrPanel.getForm().findField('XCoordinate').setValue(left)
    }
    // 更新CPS产线模型中的矢量线配置明细数据下所有与此组件相关联的矢量线的矢量坐标
    CpsPolylineAttr.updatePolylinePointsByControlId(controlId)
    CpsMainPanel.resizeDrawSvg(cpsControl)  //CPS组件移动中拓展
  }

  /** 将功能组件上的属性组装成model并返回
   * elDrag：组件元素，可以从中获得相关元素值，组装成初始model值，再从组件配置明细中获得完整model值
   * */
  static getControlAttr(elDrag) {
    let progId = elDrag.attr('data-progid')
    let controlId = elDrag.attr('id')
    let relId = elDrag.attr('data-relid')
    let controlName = elDrag.find('div.cps-controls-span').text()
    let xCoordinate = Math.round(elDrag.css('left').replace('px', ''))
    let yCoordinate = Math.round(elDrag.css('top').replace('px', ''))
    let controlWidth = Math.round(elDrag.css('width').replace('px', ''))
    let controlHeight = Math.round(elDrag.css('height').replace('px', ''))
    let relIcon = elDrag.find('img').attr('src')
    let model = {
      'ProduceControlLineId': '',
      'RowId': 0,
      'RowNo': 0,
      'ProgId': progId,
      'ControlId': controlId,
      'ControlName': controlName,
      'ControlDescription': controlName,
      'ControlType': 0,
      'XCoordinate': xCoordinate,
      'YCoordinate': yCoordinate,
      'ControlWidth': controlWidth,
      'ControlHeight': controlHeight,
      'RelIcon': relIcon,
      'RelId': relId
    }
    for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
      if (CpsCommonVar.controlLineModels.ControlDetail[i].ControlId === controlId) {
        model.ProduceControlLineId = CpsCommonVar.controlLineModels.ControlDetail[i].ProduceControlLineId
        model.ControlDescription = CpsCommonVar.controlLineModels.ControlDetail[i].ControlDescription
        model.ControlType = CpsCommonVar.controlLineModels.ControlDetail[i].ControlType
        break
      }
    }
    return model
  }

  /** 更新CPS产线模型的组件配置明细数据中的某个组件中的属性值
   * controlId：组件ID，组件明细数据下的组件标识，具有唯一性
   * attrName：所要更新的属性名称
   * attrValue：所要更新的属性值
   * */
  static setControlAttr(controlId, attrName, attrValue) {
    for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
      if (CpsCommonVar.controlLineModels.ControlDetail[i].ControlId === controlId) {
        CpsCommonVar.controlLineModels.ControlDetail[i][attrName] = attrValue    // 将此组件的相应数据在数组变量中替换掉
        break
      }
    }
  }

  /** 设置功能组件的关联主数据ID和组件别名（由功能名称和关联主数据名称组成）
   * controlId：功能组件的组件ID，具有唯一性
   * controlName：功能组件的组件别名
   * relId：功能组件的关联主数据ID
   * relName：功能组件的关联主数据名称
   * */
  static setControlRelIdName(controlId, controlName, relId, relName) {
    controlName = controlName.split('[')[0] + '[' + relName + ']'

    $(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']').attr('data-relid', relId)
    $(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']').find('div.cps-controls-span').text(controlName)
    CpsControlsAttr.setControlAttr(controlId, 'RelId', relId)
    CpsControlsAttr.setControlAttr(controlId, 'ControlName', controlName)
    if (CpsCommonVar.controlsAttrPanel.getForm().findField('ControlId').getValue() === controlId) {
      CpsCommonVar.controlsAttrPanel.getForm().findField('RelId').setValue(relId)
      CpsCommonVar.controlsAttrPanel.getForm().findField('ControlName').setValue(controlName)
    }
  }

  /** 修正产线模型中的组件配置中的功能组件数据以及其相关联的矢量线数据
   * existControl：画板中是否存在此组件，true表示此组件是画板中拖拽的，新增此组件属性，false表示此组件是从外部拖拽的，修改此组件属性
   * controlId：拖拽的功能组件元素的组件ID。新增时添加此组件的属性model，修改时修改此组件的属性model并修正其关联矢量线属性值
   * */
  static updateControlByControlId(existControl, controlId) {
    let elDrag = $(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']')
    if (elDrag.length > 0) {
      let model = CpsControlsAttr.getControlAttr(elDrag)
      if (!existControl) {
        CpsCommonVar.controlLineModels.ControlDetail.push(model)
      } else {
        for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
          if (CpsCommonVar.controlLineModels.ControlDetail[i].ControlId === controlId) {
            // 将此组件模型从组件配置明细数组中替换掉
            CpsCommonVar.controlLineModels.ControlDetail.splice(i, 1, model)
            // 修正CPS产线模型中的矢量线配置明细数据中所有矢量线属性起始组件或结束组件值为controlId值的矢量线
            CpsPolylineAttr.updatePolylinePointsByControlId(controlId)
            break
          }
        }
      }
      CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
    }
  }

  /** 删除CPS产线模型中的组件配置明细数据中组件属性组件ID值为controlId值的组件
   * controlId：组件ID，组件明细数据下的组件标识，具有唯一性
   * */
  static deleteControlByControlId(controlId) {
    $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
    for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
      if (CpsCommonVar.controlLineModels.ControlDetail[i].ControlId === controlId) {
        // 将此组件模型从组件配置明细数组中删除
        CpsCommonVar.controlLineModels.ControlDetail.splice(i, 1)
        // 删除CPS产线模型中的矢量线配置明细数据中所有矢量线属性起始组件或结束组件值为controlId值的矢量线
        CpsPolylineAttr.deletePolylineByControlId(controlId)
        break
      }
    }
    // 若被删除的此组件已被选中并在CPS组件属性Form中展示出来，则恢复所由组件的样式为初始状态且重置CPS组件属性Form
    if (CpsCommonVar.controlsAttrPanel.getForm().findField('ControlId').getValue() === controlId) {
      CpsCommonFunc.removeControlSelStyle()
    }
    // 将删除画板中组件属性组件ID值为controlId的组件
    $(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']').remove()
    CpsMainPanel.setSizeDrawSvg()  //CPS组件移动后敛缩
  }
}
export {CpsControlsAttr}
