<template>
  <div class="content-section">
    <section v-show="isExt" v-for="container in contrainers" :ref="container"></section>
    <router-view v-show="!isExt"></router-view>
  </div>
</template>

<script>
  import * as types from '../../store/mutation-types'
  import {ContentLayout} from '../../assets/js/ext/container-tab-panel'
  import {Workbench} from '../../assets/js/ext/workbench'
  import {MenuConfig} from '../../assets/js/ext/menu-config'
  import {CpsConfigure} from '../../assets/js/ext/cps-configure'
  import {Document} from '../../assets/js/ext/document'
  import {NavHeaderItemUtility, EnumNavHeader} from '../items/nav-header-items'
  import ExtContent from '../../assets/js/ext/contentExt'
  import SignalR from '../../assets/js/signalR/signalR.js'
  import Toastr from '../../assets/js/toastr/toastr.js'
  import storage from 'src/module/storage'
  export default {
    data () {
      return {
        subscribe: null,
        isExt: true
      }
    },
    computed: {
      /* 容器列表 */
      contrainers () {
        return NavHeaderItemUtility.getContrainers()
      },
      /* 顶部菜单选择项 */
      headerItem () {
        return this.$store.state.mainHeader.selectedItem
      }
    },
    beforeMount () {
      this.subscribeChanged()
    },
    mounted () {
      this.init()
    },
    beforeDestroy () {
      this.subscribe()
    },
    methods: {
      init () {
        Toastr.toastrInit()
        SignalR.connectionInit()
        Ax.utils.LibVclSystemUtils.loadVueStore(this.$store, types)
        Document.onInit(this.headerItemChanged) // 文档管理类初始化，将顶部菜单的切换函数传进对象中
        CpsConfigure.onInit(this.headerItemChanged) // CPS界面初始化
        this.setDefaultHeaderItem()
      },
      setDefaultHeaderItem () {
        let headerItem = storage.getHeaderItem()
        if (!headerItem) {
          headerItem = NavHeaderItemUtility.getDefaultHeaderItem()
        }
        this.$nextTick(() => {
          storage.setHeaderItem(headerItem)
          this.$store.dispatch(types.MAIN_HEADER_SELECTED_ITEM, {selectedItem: headerItem})
        })
      },
      /* 订阅store变化事件 */
      subscribeChanged () {
        this.subscribe = this.$store.subscribe((mutation, state) => {
          if (mutation.type === types.MAIN_HEADER_SELECTED_ITEM) {
            this.isExt = true
            this.$router.push('/layout/content/')
            this.headerItemChanged(mutation.payload.selectedItem)
          }
          if (mutation.type === types.MAIN_SIDEBAR_SELECTED_ITEM) {
            if (mutation.payload.selectedItem.item.PROGID === 'PUBLISH') {
              this.isExt = false
              this.$router.push('/layout/content/publish/pull')
            } else {
              this.isExt = true
              this.$router.push('/layout/content/')
              this.sideItemChanged(mutation.payload.selectedItem.item)
            }
          }
        })
      },
      /* 订阅侧边栏菜单点击事件 */
      sideItemChanged (item) {
        const extCmp = this.getExtComponent(this.headerItem.contrainer)
        if (!extCmp) {
          return
        }
        this.reRender(extCmp)
        extCmp.itemClick(item)
      },
      /* 顶部菜单切换事件 */
      headerItemChanged (item) {
        this.isExt = true
        this.$router.push('/layout/content/')
        this.setMainSidebarEnabled(true)
        const contrainer = item.contrainer
        this.setContrainer(contrainer)
        let extCmp = this.getExtComponent(contrainer)
        if (!extCmp) {
          this.initContrainer(contrainer)
          extCmp = this.getExtComponent(contrainer)
        }
        this.setSidebarEnabledByContrainer(contrainer)
        this.reRender(extCmp)
      },
      /* 初始化容器 */
      initContrainer (contrainer) {
        const domContrainer = this.$refs[contrainer][0]
        switch (contrainer) {
          case EnumNavHeader.workbench:
            this.putExtComponent(Workbench.getControl(domContrainer), contrainer)
            break
          case EnumNavHeader.menuConfig:
            this.putExtComponent(MenuConfig.onSetMenu(domContrainer), contrainer)
            break
          case EnumNavHeader.document:
            this.putExtComponent(Document.onSetMenu(domContrainer), contrainer)
            break
          case EnumNavHeader.cpsModel:
            this.putExtComponent(CpsConfigure.onSetMenu(domContrainer), contrainer)
            break
          default :
            this.putExtComponent(ContentLayout.getControl(domContrainer), contrainer)
            break
        }
      },
      /* 根据容器设置侧边栏搜索控件与菜单控件是否启用 */
      setSidebarEnabledByContrainer (contrainer) {
        switch (contrainer) {
          case EnumNavHeader.menuConfig:
            this.setMainSidebarEnabled(false)
            break
          case EnumNavHeader.document:
            this.setMainSidebarEnabled(false)
            break
          case EnumNavHeader.cpsModel:
            this.setMainSidebarEnabled(false)
            break
        }
      },
      /* 根据顶部菜单选项切换容器，设置高度显示/隐藏 */
      setContrainer (key) {
        for (let contrainer of this.contrainers) {
          const domList = this.$refs[contrainer]
          if (key === contrainer) {
            domList[0].className = 'contrainer-show'
          } else {
            domList[0].className = 'contrainer-hide'
          }
        }
      },
      /* 重新渲染ext组件 */
      reRender (ext) {
        this.$nextTick(() => {
          try {
            ExtContent.contrainer = ext
            ext.updateLayout()
          } catch (error) {
            console.error(error)
          }
        })
      },
      /* 设置侧边栏搜索控件与菜单控件是否启用 */
      setMainSidebarEnabled (isEnabled) {
        this.$store.dispatch(types.MAIN_SIDEBAR_SEARCH_ENABLED, {isEnabled})
        this.$store.dispatch(types.MAIN_SIDEBAR_MENU_ENABLED, {isEnabled})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .contrainer-hide {
    height: 0;
    width: 0;
  }

  .contrainer-show {
    height: 100%;
    width: 100%;
  }
</style>
