/**
 * Created by Administrator on 2017/1/17.
 */
import * as types from '../mutation-types'
const state = {
  sideItem: null,
  selectedItem: null,
  searchEnabled: true,
  menuEnabled: true
}

const getters = {}

const actions = {
  [types.MAIN_SIDEBAR_SIDE_ITEM] ({commit}, {sideItem}) {
    commit(types.MAIN_SIDEBAR_SIDE_ITEM, {sideItem})
  },
  [types.MAIN_SIDEBAR_SELECTED_ITEM] ({commit}, {selectedItem}) {
    commit(types.MAIN_SIDEBAR_SELECTED_ITEM, {selectedItem})
  },
  [types.MAIN_SIDEBAR_SEARCH_ENABLED] ({commit}, {isEnabled}) {
    commit(types.MAIN_SIDEBAR_SEARCH_ENABLED, {isEnabled})
  },
  [types.MAIN_SIDEBAR_MENU_ENABLED] ({commit}, {isEnabled}) {
    commit(types.MAIN_SIDEBAR_MENU_ENABLED, {isEnabled})
  }
}

const mutations = {
  [types.MAIN_SIDEBAR_SIDE_ITEM] (state, {sideItem}) {
    state.sideItem = sideItem
  },
  [types.MAIN_SIDEBAR_SELECTED_ITEM] (state, {selectedItem}) {
    state.selectedItem = selectedItem
  },
  [types.MAIN_SIDEBAR_SEARCH_ENABLED] (state, {isEnabled}) {
    state.searchEnabled = isEnabled
  },
  [types.MAIN_SIDEBAR_MENU_ENABLED] (state, {isEnabled}) {
    state.menuEnabled = isEnabled
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
