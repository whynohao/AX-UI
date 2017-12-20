/**********************************************************************
 * CopyRight 2017 杭州集控科技有限公司 版权所有
 * 功能描述：CPS系统组件模块的主窗口
 * 创建标识：Huangwz 2017/04/28
 *
 * 修改标识：Huangwz 2017/04/28
 *
 ************************************************************************/
import {CpsCommonVar, CpsCommonConst} from './CpsCommon'
class CpsSystemControls {
  /** 根据相应的组件数据列表加载出相应的组件配置Vue
   * list：组件数据列表
   * isDraggable：是否用于拖拽功能,true表示CPS动态组件，false表示系统组件
   * 根据数据列表中的显示模式DisplayType（1*1,2*2,3*3）以表格方式显示出来
   * */
  static loadControlConfigVue(list, isDraggable) {
    let configVue = ''
    if (list && list.ConfigDetail.length > 0) {
      // 根据显示的模式计算出组件的宽度
      let width = list.DisplayType === 0 ? 180 : (list.DisplayType === 1 ? 90 : 60)
      // 根据显示的模式计算出组件的宽度
      let height = list.DisplayType === 0 ? 120 : (list.DisplayType === 1 ? 60 : 40)
      // 根据显示的模式计算出以几列显示
      let cos = list.DisplayType + 1
      // 当前列索引为0，默认第一列，当其值等于显示允许的列数时，重新默认第一列
      let j = 0
      configVue = '<table cellspacing="5" border="0"><tbody>'
      for (let i = 0; i < list.ConfigDetail.length; i++) {
        let model = list.ConfigDetail[i]
        //  从当前第一列开始创建表格行开始标签
        if (j === 0) {
          configVue = configVue + '<tr>'
        }
        configVue = configVue + '<td>'
        // 根据变量isDraggable判断当前组件是否可以拖拽，然后设置组件的name值
        if (isDraggable) {
          configVue = configVue + '<div class="cps-controls-td" name="cpsIcon" style="width:' + width + 'px;height:' + height + 'px;"  draggable="true" id="' + model.ProgId.replace('.', '') + '"  data-relid="" data-progid="' + model.ProgId + '">'
        } else {
          configVue = configVue + '<div class="cps-controls-td" name="sysIcon" style="width:' + width + 'px;height:' + height + 'px;" id="' + model.ProgId.replace('.', '') + '"  data-checked="" data-progid="' + model.ProgId + '">'
        }
        configVue = configVue + '<div class="cps-controls-region">'
        configVue = configVue + '<img src="' + model.RelIcon + '" style="width: ' + (height - 30) + 'px;height:' + (height - 30) + 'px;"/>'
        configVue = configVue + '<div class="cps-controls-span">' + model.ProgName + '</div>'
        configVue = configVue + '</div>'
        configVue = configVue + '</div>'
        configVue = configVue + '</td>'
        j++
        // 从当前最后一列开始创建表格行开结束标签，并将当前列索引置为0
        if (j === cos) {
          configVue = configVue + '</tr>'
          j = 0
        }
      }
      // 当数据列表数据加载完毕后，当前列索引不为0，说明最后一行只有j列数据，剩余的列将会被填充
      if (j !== 0) {
        j = cos - j
        configVue = configVue + '<td colspan="' + j + '"></td>'
        configVue = configVue + '</tr>'
      }
      configVue = configVue + '</tbody></table>'
    }
    if (isDraggable) {
      $(CpsCommonConst.cpsControlsId).empty().append(configVue)
    } else {
      $(CpsCommonConst.sysControlsId).empty().append(configVue)
    }
  }

  /** 根据系统组件数据列表加载组件配置Vue
   * 包含 指针工具、矢量线、描述框、组合框
   * */
  static loadSystemControlConfigVue() {
    let list = {
      'ControlConfigId': '1',
      'ControlConfigName': '',
      'FactoryModuleType':0,
      'DisplayType': 1,
      'ConfigDetail': [
        {
          'ControlConfigId': '1',
          'RowId': 1,
          'RowNo': 1,
          'ProgId': 'pointerTool',
          'ProgName': '指针工具',
          'RelIcon': '/Scripts/img/cps/指针工具.png',
          'ControlType': 1
        },
        {
          'ControlConfigId': '1',
          'RowId': 2,
          'RowNo': 2,
          'ProgId': 'vectorLine',
          'ProgName': '矢量线',
          'RelIcon': '/Scripts/img/cps/矢量线.png',
          'ControlType': 1
        },
        {
          'ControlConfigId': '1',
          'RowId': 3,
          'RowNo': 3,
          'ProgId': 'descriptionBox',
          'ProgName': '描述框',
          'RelIcon': '/Scripts/img/cps/描述框.png',
          'ControlType': 1
        },
        {
          'ControlConfigId': '1',
          'RowId': 4,
          'RowNo': 4,
          'ProgId': 'comboBox',
          'ProgName': '组合框',
          'RelIcon': '/Scripts/img/cps/组合框.png',
          'ControlType': 1
        }
      ]
    }
    CpsSystemControls.loadControlConfigVue(list, false)
    $('#pointerTool').find('div.cps-controls-region').css({
      'background-color': '#f7f8db',
      'border': '1px solid #d2c06c '
    })
  }

  /** 系统组件的初始化通用事件【描述框，指针工具，矢量线】
   * 【描述框的点击事件，通过变量CpsCommonVar.useToolTip控制组件的描述框是否显示，默认不显示】
   * 【指针工具点击事件,通过变量CpsCommonVar.useVectorLine控制在画板中是用于拖拽组件、选中组件/矢量线、双击组件等操作还是用于绘制矢量线，默认不绘制矢量线】
   * 【矢量线点击事件,通过变量CpsCommonVar.useVectorLine控制在画板中是用于拖拽组件、选中组件/矢量线、双击组件等操作还是用于绘制矢量线，默认不绘制矢量线】
   * */
  static initSystemControlEvent() {
    /** 重新绑定描述框点击事件，用于显示或隐藏组件的组件描述内容。默认为不显示
     * 若已选中，则描述框设置成禁用状态，禁止组件显示提示描述框
     * 若未选中，则描述框设置成使用状态，允许组件显示提示描述框
     * */
    $('#descriptionBox').unbind('click').bind('click', function (event) {
      let checked = $(this).attr('data-checked')
      if (checked) {
        $(this).attr('data-checked', '')
        $('#descriptionBox').find('div.cps-controls-region').css({
          'background-color': '#ffffff',
          'border': '0'
        })
        CpsCommonVar.useToolTip = false
      } else {
        $(this).attr('data-checked', 'true')
        $('#descriptionBox').find('div.cps-controls-region').css({
          'background-color': '#f7f8db',
          'border': '1px solid #d2c06c'
        })
        CpsCommonVar.useToolTip = true
      }
    })

    /** 重新绑定指针工具点击事件，用于拖拽组件、选中组件/矢量线、双击
     * 将指针工具设置成选中使用状态
     * 将矢量线设置成选中禁用状态
     * 将画板上鼠标状态改为默认的箭头状态
     * 隐藏组件的位置方点
     * 禁止绘制矢量线
     * */
    $('#pointerTool').unbind('click').bind('click', function (event) {
      $('#pointerTool').find('div.cps-controls-region').css({
        'background-color': '#f7f8db',
        'border': '1px solid #d2c06c '
      })
      $('#vectorLine').find('div.cps-controls-region').css({
        'background-color': '#ffffff',
        'border': '0'
      })
      $(CpsCommonConst.drawSVGId).css({'cursor': 'default'})
      $(CpsCommonConst.drawSVGId).find('rect[name=\'controlRect\']').css({'display': 'none'})
      $(CpsCommonConst.drawSVGId).find('circle[name=\'drawCircle\']').css({'display': 'none'})
      CpsCommonVar.useVectorLine = false
    })

    /** 重新绑定矢量线点击事件，用于绘制矢量线
     * 将指针工具设置成选中禁用状态
     * 将矢量线设置成选中使用状态
     * 将画板上鼠标状态改为默认的十字线状态
     * 隐藏组件的拉伸圆点
     * 隐藏矢量线的拉伸圆点
     * 允许绘制矢量线
     * */
    $('#vectorLine').unbind('click').bind('click', function (event) {
      $('#pointerTool').find('div.cps-controls-region').css({
        'background-color': '#ffffff',
        'border': '0'
      })
      $('#vectorLine').find('div.cps-controls-region').css({
        'background-color': '#f7f8db',
        'border': '1px solid #d2c06c '
      })
      $(CpsCommonConst.drawSVGId).css({'cursor': 'crosshair'})
      $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
      CpsCommonVar.useVectorLine = true
    })
  }
}
export {CpsSystemControls}
