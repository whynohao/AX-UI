/**
 * Created by Administrator on 2017/1/17.
 */

// import * as types from '../mutation-types'
// class btn {
// }
import * as types from '../mutation-types'
// import {WindowTab} from '../../components/common/window-tab.js'

const state = {
  items: []
}

const getters = {
}

const actions = {
  [types.WINDOW_TAB_CREATEITEM] ({commit}, {tab}) {
    commit(types.WINDOW_TAB_CREATEITEM, {tab})
  },
  [types.WINDOW_TAB_DESTROYITEM] ({commit}, {index}) {
    commit(types.WINDOW_TAB_DESTROYITEM, {index})
  },
  [types.WINDOW_TAB_CHANGEITEM] ({commit}, {tab, index}) {
    commit(types.WINDOW_TAB_CHANGEITEM, {tab, index})
  },
  [types.WINDOW_TAB_CLEAR] ({commit}) {
    commit(types.WINDOW_TAB_CLEAR)
  }
}

const mutations = {
  [types.WINDOW_TAB_CREATEITEM] (state, {tab}) {
    state.items.push(tab)
  },
  [types.WINDOW_TAB_DESTROYITEM] (state, {index}) {
    state.items.splice(index, 1)
  },
  [types.WINDOW_TAB_CHANGEITEM] (state, {tab, index}) {
    state.items.splice(index, 1, tab)
  },
  [types.WINDOW_TAB_CLEAR] (state) {
    state.items.splice(0, state.items.length)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
