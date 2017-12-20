/**
 * Created by Administrator on 2017/1/17.
 */
import * as types from '../mutation-types'
const state = {
  selectedItem: null
}

const getters = {}

const actions = {
  [types.MAIN_HEADER_SELECTED_ITEM] ({commit}, {selectedItem}) {
    commit(types.MAIN_HEADER_SELECTED_ITEM, {selectedItem})
  }
}

const mutations = {
  [types.MAIN_HEADER_SELECTED_ITEM] (state, {selectedItem}) {
    state.selectedItem = selectedItem
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
