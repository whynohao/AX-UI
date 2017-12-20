/**
 * Created by Administrator on 2017/3/7.
 */
import ExtContent from './contentExt'
/* ext工具类 */
class ExtUtility {
  /* 主页面根据侧边栏伸展对容器属性containerpanel=true 的ext控件设置宽度 */
  static setContainerWidth (offset) {
    try {
      window.setTimeout(() => {
        // const cmptArray = Ext.ComponentQuery.query('[containerpanel=true]')
        // for (let cmpt of cmptArray) {
        //   cmpt.setWidth(cmpt.width + offset)
        if (ExtContent.contrainer) {
          ExtContent.contrainer.setWidth(ExtContent.contrainer.width + offset)
        }
      }, 500)
    } catch (ex) {
      console.error(ex)
    }
  }

  /* 更新挂载的ext组件布局 */
  static updateCmpLayout = () => {
    window.setTimeout(() => {
      try {
        Ext.ComponentManager.each(function (cmpId, cmp, length) {
          if (cmp.hasOwnProperty('renderTo')) {
            cmp.updateLayout()
          }
        })
      } catch (error) {
      }
    }, 500)
  }
}
export { ExtUtility }
