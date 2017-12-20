/**
 * Created by Administrator on 2017/3/16.
 */
/* 将功能菜单配置对象，转换为侧边栏菜单项 */
import SideItem from './sidebar-menu-item'
import storage from '../../module/storage'
import * as api from '../../api'
import * as types from '../../store/mutation-types'
class SidebarItemUtility {
  /* 根据顶部导航菜单选择项设置侧边栏菜单项 */
  static setSideItem (menuName, store) {
    const menuData = api.file.getMenuData(true)
    storage.setMenuData(menuData)
    const sideItem = getSideItem(menuName)
    store.dispatch(types.MAIN_SIDEBAR_SIDE_ITEM, {sideItem})
  }

  /* 根据关键字搜索菜单列表 */
  static searchSideItem (sideItem, key) {
    const root = new SideItem({MENUITEM: '搜索结果'})
    searchSideItem(root, sideItem, key)
    return root
  }
}

/* 根据顶部导航菜单选择项获取侧边栏菜单项 */
const getSideItem = (menuName) => {
  const headerMenuData = getHeaderMenuData(menuName)
  if (!headerMenuData) {
    return null
  }
  if (!headerMenuData.children || headerMenuData.children.length === 0) {
    return null
  }
  const root = new SideItem(headerMenuData)
  convertSideItem(root)
  return root
}

/* 获取用户功能菜单配置对象 */
const getHeaderMenuData = (menuItemName) => {
  try {
    const srcMenuData = storage.getMenuData()
    if (srcMenuData && srcMenuData.children) {
      return srcMenuData.children.find((item) => {
        return item.MENUITEM === menuItemName
      })
    }
  } catch (ex) {
    console.error(ex)
  }
  return null
}

/* 将功能菜单配置对象，转换为侧边栏菜单项 */
const convertSideItem = (sideItemParent, srcHeaderItems) => {
  let srcChildren = srcHeaderItems
  if (!srcChildren) {
    srcChildren = sideItemParent.item.children
  }
  for (let child of srcChildren) {
    const sideItem = new SideItem(child)
    sideItemParent.children.push(sideItem)
    if (child.children && child.children.length > 0) {
      convertSideItem(sideItem, child.children)
    }
  }
}

/* 根据关键字搜索菜单列表 */
const searchSideItem = (root, sideItem, key) => {
  let children = sideItem.children
  if (!children) {
    return
  }
  for (let child of children) {
    if (child.name.indexOf(key) !== -1 && child.leaf) {
      root.children.push(child)
    }
    searchSideItem(root, child, key)
  }
}

export default SidebarItemUtility
