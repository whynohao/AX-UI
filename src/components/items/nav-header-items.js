/**
 * Created by Administrator on 2017/3/16.
 */
/* 顶部菜单栏枚举类 */
class EnumNavHeader {
  static workbench = 'workbench'
  static business = 'business'
  static report = 'report'
  static kpi = 'kpi'
  static board = 'board'
  static document = 'document'
  static menuConfig = 'menuConfig'
  static cpsModel = 'cpsModel'
}
const defaultHeaderItem = {
  key: EnumNavHeader.workbench,
  text: '工作台',
  contrainer: 'workbench',
  enabled: true
}
const NavHeaderItems = [
  defaultHeaderItem,
  {
    key: EnumNavHeader.business,
    text: '业务功能',
    contrainer: EnumNavHeader.business,
    enabled: true
  },
  {
    key: EnumNavHeader.report,
    text: '报表管理',
    contrainer: EnumNavHeader.business,
    enabled: true
  },
  {
    key: EnumNavHeader.kpi,
    text: 'KPI管理',
    contrainer: EnumNavHeader.business,
    enabled: true
  },
  {
    key: EnumNavHeader.board,
    text: '看板管理',
    contrainer: EnumNavHeader.business,
    enabled: false
  },
  {
    key: EnumNavHeader.document,
    text: '文档管理',
    contrainer: EnumNavHeader.document,
    enabled: true
  },
  {
    key: EnumNavHeader.cpsModel,
    text: 'CPS建模',
    contrainer: 'cpsModel',
    enabled: true
  },
  {
    key: EnumNavHeader.menuConfig,
    text: '功能菜单',
    contrainer: EnumNavHeader.menuConfig,
    enabled: true
  }
]

class NavHeaderItemUtility {
  /* 获取默认顶部菜单项 */
  static getDefaultHeaderItem () {
    return defaultHeaderItem
  }

  /* 获取顶部菜单栏容器数组 */
  static getContrainers () {
    return Array.from(new Set(NavHeaderItems.map((item) => {
      return item.contrainer
    })))
  }
}
export {EnumNavHeader, NavHeaderItems, NavHeaderItemUtility}
