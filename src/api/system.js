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

/* 登录 */
export const login = (userId, password, quitOther) => {
  const params = {userId, password, quitOther}
  return instance.post('sysSvc/login', params)
}

/* 检查登录 */
export const checkLogin = () => {
  const params = {handle: getUserhandle()}
  return instance.post('sysSvc/checkLogin', params)
}

/* 获取子站点信息 */
export const getSubSites = () => {
  const params = {userHandle: getUserhandle()}
  return instance.post('sysSvc/getLinkSites', params)
}

/* 获取子系统登录token */
export const getSubSiteToken = () => {
  const params = {userHandle: getUserhandle()}
  return instance.post('sysSvc/getToken', params)
}

/* 获取跳转子系统登录 */
export const getSSOLogin = (userId, token) => {
  const params = {ssoInfo: {UserId: userId, Token: token}}
  return instance.post('sysSvc/SSOLogin', params)
}
