import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import mainHeader from './modules/main-header'
import mainSideBar from './modules/main-sidebar'
import windowTab from './modules/window-tab'
export default new Vuex.Store({
  modules: {
    mainHeader,
    mainSideBar,
    windowTab
  }
})
