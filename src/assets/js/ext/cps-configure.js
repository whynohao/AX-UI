/**********************************************************************
 * CopyRight 2016 杭州集控科技有限公司 版权所有
 * 功能描述：CPS建模模块的主窗口
 * 创建标识：Huangwz 2017/03/10
 *
 * 修改标识：Huangwz 2017/03/10
 *
 ************************************************************************/
import storage from '../../../module/storage'
import {EnumNavHeader, NavHeaderItems} from '../../../components/items/nav-header-items'
import {CpsCommonFunc, CpsCommonVar} from '../cps/CpsCommon'
import {CpsMainPanel} from '../cps/CpsMainPanel'
import {CpsProgramControls} from '../cps/CpsProgramControls'
import '../cps/CpsConfigureMain'
class CpsConfigure {
  // 在系统初始时需要做的工作
  static onInit(gotoMenu) {
    // CPS建模对象不存在时，默认初始加载,创建CPS建模管理模块对象
    if (!CpsConfigure.Instance) {
      CpsConfigure.Instance = Ext.create('CPSConfigureManage.CpsConfigureMain', {})
    }
    // 为CPS建模的跳转菜单赋值
    CpsConfigure.gotoMenu = gotoMenu
    // 查找得到顶部菜单中的CPS建模管理Item
    let filterList = undefined
    for (let i = 0; i < NavHeaderItems.length; i++) {
      if (NavHeaderItems[i] && NavHeaderItems[i].text === 'CPS建模') {
        filterList = NavHeaderItems[i]
        break
      }
    }
    /** 若CPS建模对象存在，则将对象赋值给当前建模项
     * 否则，默认初始化赋值
     */
    if (filterList) {
      CpsConfigure.CpsConfigureItem = filterList
    } else {
      CpsConfigure.CpsConfigureItem = {
        key: EnumNavHeader.cpsModel,
        text: 'CPS建模',
        contrainer: 'cpsModel'
      }
    }

    CPSConfigureManage.CpsConfigureMain.jumpTo = CpsConfigure.jumpTo      // 定义回调函数，跳转到文档管理页面
    CPSConfigureManage.CpsConfigureMain.loadCanvas = CpsConfigure.loadCanvas  // 定义回调函数，加载画板模块数据
  }

  /** 跳转到CPS工厂建模管理界面并显示出来
   * 保存之前的页面项，以方便离开本页面返回并跳转到此页面
   * 将CPS工厂建模管理界面保存到storage中的主菜单共享数据中
   * 切换到此CPS工厂建模管理界面
   * 加载CPS工厂建模管理界面的画板模块数据
   * */
  static jumpTo(cpsConfigureId, factoryModuleType, vcl) {
    CpsConfigure.LastItem = storage.getHeaderItem()
    let selectedItem = CpsConfigure.CpsConfigureItem
    storage.setHeaderItem(selectedItem)
    CpsConfigure.gotoMenu(selectedItem)
    CpsMainPanel.factoryModuleTypeWin.close()
    CpsMainPanel.loadCpsConfigureView(cpsConfigureId, factoryModuleType, vcl)
  }

  /** 根据产线模型ID加载画板模块数据，包括组件配置和矢量线配置明细数据Vue
   * produceControlLineId：CPS产线模型代码，为CPS产线模型的唯一标识
   * */
  static loadCanvas(produceControlLineId) {
    CpsCommonFunc.getProduceControlLineList(produceControlLineId, function (list) {
      CpsCommonVar.controlLineModels = list
      CpsMainPanel.showProduceControlLineModels()
    })
  }

  /** 初始化CPS工厂建模管理界面
   * 初始化整体界面并加载相关数据
   * */
  static onSetMenu(el) {
    if (!CpsConfigure.Instance) {
      CpsConfigure.Instance = Ext.create('CPSConfigureManage.CpsConfigureMain', {})
    }
    let panel = CpsConfigure.Instance.createCpsFactoryModule(el, undefined, undefined)
    return panel
  }
}
export {CpsConfigure}
