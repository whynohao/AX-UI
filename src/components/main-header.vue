<template>
  <header class="main-header">
    <!-- Logo -->
    <a class="logo">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>智能</b></span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><b>智慧工厂</b></span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button" id="sidebar-toggle">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </a>
      <div class="col-xs-11 navbar-custom-menu navbar-custom-menu-left">
        <ul class="nav navbar-nav">
          <li class="" v-for="item in navHeaderItems">
            <a v-show='item.enabled' @click="itemClick(item)">{{item.text}}</a>
          </li>
          <li class="" v-for="item in subSites">
            <a @click='btnSubSite(item)'>{{item.SiteName}}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<script>
  import * as types from 'src/store/mutation-types'
  import * as api from 'src/api'
  import storage from 'src/module/storage'
  import {NavHeaderItems} from './items/nav-header-items'

  export default {
    data () {
      return {
        navHeaderItems: NavHeaderItems,
        subSites: []
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      /* 初始化刷新获取storage存储的菜单选择项 */
      init () {
        this.setSubSite()
      },
      /* 点击菜单选择项触发事件 */
      itemClick (selectedItem) {
        storage.setHeaderItem(selectedItem)
        this.$store.dispatch(types.MAIN_HEADER_SELECTED_ITEM, {selectedItem})
      },
      setSubSite () {
        this.subSites.splice(0, this.subSites.length)
        if (!window.UserId) {
          return
        }
        api.system.getSubSites().then(p => {
          if (p.data && p.data.GetLinkSitesResult) {
            const items = p.data.GetLinkSitesResult
            for (let item of items) {
              this.subSites.push(item)
            }
          }
        }, e => {
          console.info(e)
        })
      },
      btnSubSite (item) {
        api.system.getSubSiteToken().then(p => {
          if (p.data) {
            const userId = encodeURIComponent(storage.getUserId(true))
            const token = encodeURIComponent(p.data.GetTokenResult === '' ? 'null' : p.data.GetTokenResult)
            const urltmp = `${item.SiteUrl}#/sso?token=${token}&userId=${userId}`
            window.open(urltmp, item.SiteName)
          }
        }, e => {
          console.info(e)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .navbar-custom-menu-left {
    float: left;
    max-height: 50px;
    overflow: auto;
  }

  .sidebar-toggle {
    width: 42px;
    height: 50px;
  }
</style>
