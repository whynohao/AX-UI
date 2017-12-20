/**
 * Created by Administrator on 2017/4/28.
 */
import storage from '../module/storage'
import * as types from '../store/mutation-types.js'
import signalR from '../assets/js/signalR/signalR.js'
history.pushState(null, null, document.URL)
window.addEventListener('popstate', function () {
  history.pushState(null, null, document.URL)
})
window.onbeforeunload = function () {
  return '你确定要登出系统吗？'
}
window.onunload = function () {
  loginOutConfig.loginOut()
}
const apiLoginOut = function (handle) {
  Ext.Ajax.request({
    url: '/sysSvc/loginOut',
    async: false,
    jsonData: {handle: handle},
    method: 'POST'
  })
}

class loginOutConfig {
  static store = null

  static setStore (store) {
    loginOutConfig.store = store
  }

  static loginOut (relocation = false) {
    const user = storage.getUser()
    if (!user) {
      return
    }
    var handle = user.Handle
    loginOutConfig.store.dispatch(types.WINDOW_TAB_CLEAR)
    window.sessionStorage.clear()
    signalR.destory()
    apiLoginOut(handle)
    if (relocation) {
      window.DesktopApp.router.push('/')
    }
  }
}
export default loginOutConfig
