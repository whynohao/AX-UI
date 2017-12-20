<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <div class="user-panel">
        <div class="pull-left image">
          <img src="/Scripts/img/user.png" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info ">
          <p>{{name}}</p>
          <i class="fa fa-circle text-success"></i>
          <span class="sidebar-cursor" @click='loginOut()'>登出</span>
          <span class="sidebar-cursor" @click='setPassword()'>修改密码</span>
        </div>
      </div>
      <sidebar-search v-if="searchEnabled" @changed="searchChanged" ref="search"></sidebar-search>
      <sidebar-menu v-if="menuEnabled" :root="sideItem" @itemClick="itemClick">
      </sidebar-menu>
    </section>
  </aside>
</template>

<script>
  import * as types from 'src/store/mutation-types'
  import storage from 'src/module/storage'
  import loginOutConfig from 'src/module/browser'
  import SidebarItemUtility from './common/sidebar-Item-utility'
  import SideItem from './common/sidebar-menu-item'
  import {ConsoleItems} from './items/console-items'
  import {eventBus, busKeys} from 'src/module/eventbus'
  export default {
    components: {
      'sidebar-menu': require('./common/sidebar-menu.vue'),
      'sidebar-search': require('./common/sidebar-search.vue')
    },
    data () {
      return {
        subscribe: null,
        name: Ext.util.Cookies.get('loginPersonName')
      }
    },
    computed: {
      sideItem () {
        return this.$store.state.mainSideBar.sideItem
      },
      searchEnabled () {
        return this.$store.state.mainSideBar.searchEnabled
      },
      menuEnabled () {
        return this.$store.state.mainSideBar.menuEnabled
      }
    },
    beforeMount () {
      this.subscribeChanged()
    },
    mounted () {
      eventBus.$on(busKeys.userName, () => {
        this.name = Ext.util.Cookies.get('loginPersonName')
      })
    },
    beforeDestroy () {
      this.subscribe()
    },
    methods: {
      /* 订阅store变化事件 */
      subscribeChanged () {
        this.subscribe = this.$store.subscribe((mutation, state) => {
          if (mutation.type === types.MAIN_HEADER_SELECTED_ITEM) {
            this.initSearch()
            this.setSideItems(mutation.payload.selectedItem)
          }
        })
      },
      /* 侧边栏点击事件 */
      itemClick (selectedItem) {
        this.$store.dispatch(types.MAIN_SIDEBAR_SELECTED_ITEM, {selectedItem})
      },
      /* 顶部菜单点击改变事件 */
      headerItemChanged (item) {
        this.initSearch()
        this.setSideItems(item)
      },
      /* 初始化搜索栏内容 */
      initSearch () {
        if (this.$refs.search) {
          this.$refs.search.text = ''
        }
      },
      /* 设置侧边栏选项 */
      setSideItems (item) {
        if (item.key === 'workbench') {
          this.setWorkbench()
        } else {
          SidebarItemUtility.setSideItem(item.text, this.$store)
        }
      },
      /* 设置工作台侧边栏选项 */
      setWorkbench () {
        const root = new SideItem({MENUITEM: '工作台'})
        const sortItems = ConsoleItems.sort((a, b) => {
          if (a.index > b.index) {
            return true
          } else {
            return false
          }
        })
        let defaultItem = null
        for (let item of sortItems) {
          if (item.enabled === false) {
            continue
          }
          const sideItem = new SideItem(item)
          if (defaultItem === null) {
            defaultItem = sideItem
          }
          root.children.push(sideItem)
        }
        this.$store.dispatch(types.MAIN_SIDEBAR_SIDE_ITEM, {sideItem: root})
        if (defaultItem !== null) {
          this.$nextTick(() => {
            this.itemClick(defaultItem)
          })
        }
      },
      /* 搜索栏改变事件 */
      searchChanged (val) {
        let headerItem = storage.getHeaderItem()
        if (!headerItem) {
          return
        }
        this.setSideItems(headerItem)
        if (val !== '') {
          const item = SidebarItemUtility.searchSideItem(this.sideItem, val)
          this.$store.dispatch(types.MAIN_SIDEBAR_SIDE_ITEM, {sideItem: item})
        }
      },
      loginOut () {
        Ext.Msg.confirm('提示', '你确定要登出系统吗?', (opt) => {
          if (opt !== 'yes') {
            return
          }
          loginOutConfig.loginOut(true)
        })
      },
      setPwd (win, handle, oldPwd, pwd1, pwd2) {
        if (pwd1 !== pwd2) {
          alert('两次输入的新密码不一致。')
        } else {
          Ext.Ajax.request({
            url: '/sysSvc/setPwd',
            async: false,
            jsonData: {handle: handle, oldPwd: oldPwd, newPwd: pwd1},
            method: 'POST',
            success: function (response) {
              var result = Ext.decode(response.responseText)
              result = result.SetPasswordResult
              if (result.Success) {
                Ext.util.Cookies.set('autoLogin', 'false')
                Ext.util.Cookies.set('loginPassword', '')
                win.close()
                Ext.Msg.alert('提示', '修改密码成功！')
              } else {
                alert(result.Msg)
              }
            }
          })
        }
      },
      setPassword () {
        const vm = this
        var oldPwdTxt = Ext.create('Ext.form.field.Text', {
          xtype: 'textfield',
          inputType: 'password',
          name: 'oldPwdTxt',
          fieldLabel: '旧密码'
        })
        var newPwdTxt1 = Ext.create('Ext.form.field.Text', {
          xtype: 'textfield',
          inputType: 'password',
          name: 'newPwdTxt1',
          fieldLabel: '新密码'
        })
        var newPwdTxt2 = Ext.create('Ext.form.field.Text', {
          xtype: 'textfield',
          inputType: 'password',
          name: 'newPwdTxt2',
          fieldLabel: '确认新密码',
          listeners: {
            specialkey: function (field, e) {
              if (e.getKey() === e.ENTER) {
                const userHandle = Ext.util.Cookies.get('userHandle')
                const handle = Ext.decode(userHandle).handle
                vm.setPwd(win, handle, oldPwdTxt.getValue(), newPwdTxt1.getValue(), newPwdTxt2.getValue())
              }
            }
          }
        })
        var button = Ext.create('Ext.button.Button', {
          text: '确定',
          handler: function () {
            const userHandle = Ext.util.Cookies.get('userHandle')
            const handle = Ext.decode(userHandle).handle
            vm.setPwd(win, handle, oldPwdTxt.getValue(), newPwdTxt1.getValue(), newPwdTxt2.getValue())
          }
        })
        var formPanel = Ext.create('Ext.form.Panel', {
          bodyPadding: 10,
          layout: {type: 'vbox', align: 'stretch'},
          items: [oldPwdTxt, newPwdTxt1, newPwdTxt2, button]
        })
        var win = Ext.create('Ext.window.Window', {
          title: '修改密码',
          autoScroll: true,
          width: 300,
          height: 200,
          layout: 'fit',
          constrainHeader: true,
          minimizable: false,
          maximizable: false,
          modal: true,
          items: [formPanel]
        })
        win.show()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .sidebar-cursor {
    cursor: pointer
  }
</style>
