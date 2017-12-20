/**
 * Created by Administrator on 2017/3/9.
 */
class SideItem {
  constructor (item,
               icon = {
                 'fa fa-circle-o text-aqua': true
               },
               css = {
                 'treeView': true,
                 'header': false
               }) {
    this.item = item
    this.name = item.MENUITEM
    this.icon = icon
    this.css = css
    this.leaf = true
    this._badges = []
    this._children = []
    if (item.children && item.children.length > 0) {
      this.leaf = false
      this.icon = {
        'fa fa-folder': true
      }
    }
  }

  set badges (badges) {
    this._badges.splice(0, this._badges.length)
    for (let badge of badges) {
      this._badges.push(badge)
    }
  }

  get badges () {
    return this._badges
  }

  set children (children) {
    this._children.splice(0, this._children.length)
    for (let child of children) {
      this._children.push(child)
    }
  }

  get children () {
    return this._children
  }
}

export default SideItem
