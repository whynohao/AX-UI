// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css/site.scss'
import './module/browser'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import store from './store'
import '../Scripts/vendor/admin-lte/adminlte'
import {ExtUtility} from './assets/js/ext/ext-utility'
import storage from './module/storage'
import loginOutConfig from './module/browser.js'
import Golbal from './golbal'
import './assets/js/ext/container-tab-panel'
/* eslint-disable no-new */
/* 全局混合在组件挂载完成调用adminlte调整内容高度 */
import {mixVueExt} from './assets/js/ext/ext-cmpt-manager'

Vue.use(ElementUI)
Vue.mixin(mixVueExt)
Vue.mixin({
  mounted () {
    $.AdminLTE.me.resizeContent()
  }
})
Golbal.init()
Golbal.setRouter(router)
/* ext加载完成之后再渲染vue组件 */
loginOutConfig.setStore(store)
Ext.application({
  name: 'ExtApp',
  launch () {
    window.onresize = () => {
      $.AdminLTE.me.resizeContent()
      ExtUtility.updateCmpLayout()
    }
    const user = storage.getUser()
    if (user && user.Handle) {
      window.UserHandle = user.Handle
      window.UserId = user.UserId
    }
    new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: {App}
    })
  }
})
