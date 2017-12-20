/**
 * Created by Administrator on 2017/3/7.
 */
/* 管理vue组件中ext组件自动释放 */
class VueModule {
  constructor (isAutoDestroy) {
    this.isAutoDestroy = isAutoDestroy
    this._index = 0
    this._vueMap = new Map()
  }

  setComponent (extCmpt, name) {
    if (name) {
      this._vueMap.set(name, extCmpt)
    } else {
      this._index = this._index + 1
      this._vueMap.set(this._index, extCmpt)
    }
  }

  getComponent (name) {
    return this._vueMap.get(name)
  }

  destroyByName (name) {
    const extCmpt = this._vueMap.get(name)
    if (!extCmpt) {
      return
    }
    extCmpt.destroy()
    this._vueMap.delete(name)
  }

  destroy () {
    for (let extCmpt of this._vueMap.values()) {
      extCmpt.destroy()
    }
  }
}

class ExtCmptManager {
  constructor () {
    this._vueMap = new Map()
  }

  setComponent (name, vueId, extCmpt, isAutoDestroy) {
    if (!this._vueMap.has(vueId)) {
      this._vueMap.set(vueId, new VueModule(isAutoDestroy))
    }
    const vueModule = this._vueMap.get(vueId)
    if (!vueModule) {
      return
    }
    vueModule.setComponent(extCmpt, name)
  }

  getComponent (name, vueId) {
    if (!this._vueMap.has(vueId)) {
      return null
    }
    const vueModule = this._vueMap.get(vueId)
    return vueModule.getComponent(name)
  }

  destroy (vueId) {
    if (!this._vueMap.has(vueId)) {
      return
    }
    const vueModule = this._vueMap.get(vueId)
    if (vueModule.isAutoDestroy) {
      vueModule.destroy()
      this._vueMap.delete(vueId)
    }
  }

  destroyByName (name, vueId) {
    if (!this._vueMap.has(vueId)) {
      return null
    }
    const vueModule = this._vueMap.get(vueId)
    vueModule.destroyByName(name)
  }
}
const extCmptManager = new ExtCmptManager()
const mixVueExt = {
  beforeDestroy () {
    extCmptManager.destroy(this._uid)
  },
  deactivated () {
    extCmptManager.destroy(this._uid)
  },
  methods: {
    putExtComponent (cmpt, name, isAutoDestroy = true) {
      extCmptManager.setComponent(name, this._uid, cmpt, isAutoDestroy)
    },

    getExtComponent (name) {
      return extCmptManager.getComponent(name, this._uid)
    },

    deleteExtComponent (name) {
      extCmptManager.destroyByName(name, this._uid)
    }
  }
}

export {mixVueExt}
