/**
 * Created by Administrator on 2017/6/27.
 */
import storage from 'src/module/storage'
import * as api from 'src/api'
import {eventBus, busKeys} from 'src/module/eventbus'
class System {
  static login (user, quitOther, success) {
    var userId = user.userId
    var password = user.password
    var autuLogin = user.autuLogin
    var isSuccess = false
    Ext.Ajax.request({
      url: '/sysSvc/login',
      async: false,
      jsonData: {userId: userId, password: password, quitOther: quitOther},
      method: 'POST',
      timeout: 60000,
      success: function (response) {
        var ret = Ext.decode(response.responseText)
        var loginInfo = ret.LoginResult
        if (loginInfo.IsUsed && !quitOther) {
          Ext.Msg.show({
            title: '账号重复登入',
            msg: '该账号正在使用，是否强制其下线并在当前位置登入？',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function (buttonId) {
              if (buttonId === 'yes') {
                System.login(user, true, success)
              }
            }
          })
        } else {
          if (loginInfo.Handle) {
            var expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 60))
            Ext.util.Cookies.set('autoLogin', autuLogin, expires)
            Ext.util.Cookies.set('loginUserId', userId, expires)
            Ext.util.Cookies.set('loginPassword', password, expires)
            Ext.util.Cookies.set('loginPersonId', loginInfo.PersonId, expires)
            Ext.util.Cookies.set('loginPersonName', loginInfo.PersonName, expires)
            var userHandle = {
              userId: userId,
              handle: loginInfo.Handle,
              personId: loginInfo.PersonId,
              personName: loginInfo.PersonName,
              position: loginInfo.Position
            }
            Ext.util.Cookies.set('userHandle', Ext.encode(userHandle), expires)
            storage.setUser(loginInfo)
            window.UserHandle = loginInfo.Handle
            eventBus.$emit(busKeys.userName)
            isSuccess = true
          } else {
            if (loginInfo.IsOverUser) {
              Ext.Msg.alert('提示', '在线用户数已到达最大值, 请联系管理员.')
            } else {
              Ext.Msg.alert('提示', '账号或密码错误.')
            }
          }
        }
      }
    })
    if (isSuccess) {
      storage.setUserId(userId, true)
      Ax.utils.LibVclSystemUtils.loadJs()
      success()
    }
  }

  static ssoLogin (userId, token, quitOther, success) {
    api.system.getSSOLogin(userId, token).then(p => {
      const loginInfo = p.data.SSOLoginResult
      if (loginInfo.IsUsed && !quitOther) {
        Ext.Msg.show({
          title: '账号重复登入',
          msg: '该账号正在使用，是否强制其下线并在当前位置登入？',
          buttons: Ext.Msg.YESNO,
          icon: Ext.Msg.QUESTION,
          fn: function (buttonId) {
            if (buttonId === 'yes') {
              System.ssoLogin(userId, token, true, success)
            }
          }
        })
      }
      if (loginInfo.Handle) {
        var expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 60))
        Ext.util.Cookies.set('loginUserId', userId, expires)
        Ext.util.Cookies.set('loginPersonId', loginInfo.PersonId, expires)
        Ext.util.Cookies.set('loginPersonName', loginInfo.PersonName, expires)
        var userHandle = {
          userId: userId,
          handle: loginInfo.Handle,
          personId: loginInfo.PersonId,
          personName: loginInfo.PersonName,
          position: loginInfo.Position
        }
        Ext.util.Cookies.set('userHandle', Ext.encode(userHandle), expires)
        storage.setUser(loginInfo)
        window.UserHandle = loginInfo.Handle
        storage.setUserId(userId, true)
        Ax.utils.LibVclSystemUtils.loadJs()
        eventBus.$emit(busKeys.userName)
        success()
      } else {
        if (loginInfo.IsOverUser) {
          Ext.Msg.alert('提示', '在线用户数已到达最大值, 请联系管理员.')
        } else {
          Ext.Msg.alert('提示', '账号或密码错误.')
        }
      }
    }, e => {
      alert('登录失败！')
      console.error(e)
    }).catch(function (ce) {
      console.error(ce)
      alert('登录失败！')
    })
  }
}
export default System
