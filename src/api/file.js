/**
 * Created by a on 2016/9/22.
 */
import storage from '../module/storage'
import axios from 'axios'
import promiseFinally from 'promise.prototype.finally'
promiseFinally.shim()
var instance = axios.create({
  baseURL: '',
  timeout: 5000
  // headers: {'X-Custom-Header': 'foobar'}
})

const getUserhandle = () => {
  try {
    const user = storage.getUser()
    return user.Handle
  } catch (error) {
    console.error(error)
    return null
  }
}

/* 获取设置菜单数据 */
export const getMenuData = (setting) => {
  let rootData = null
  Ext.Ajax.request({
    url: 'fileTranSvc/loadMenuSetting',
    jsonData: {handle: getUserhandle(), setting: setting === true},
    method: 'POST',
    async: false,
    success: function (response) {
      var temp = Ext.decode(response.responseText)
      var menu = temp['LoadMenuSettingResult']
      if (menu !== '') {
        rootData = Ext.decode(menu)
      }
    },
    failure: function () {
      Ext.Msg.show({
        title: '错误',
        msg: '载入失败！返回登录页！',
        buttons: Ext.Msg.YES,
        icon: Ext.Msg.INFO,
        fn: function (buttonId) {
          if (buttonId === 'yes') {
            if (window.DesktopApp.router) {
              window.DesktopApp.router.push('/')
            }
          }
        }
      })
    }
  })
  return rootData
}

/* 获取设置菜单数据 */
export const saveMenuData = (menuData) => {
  const params = {handle: getUserhandle(), menuData}
  return instance.post('fileTranSvc/saveMenuSetting', params)
}
