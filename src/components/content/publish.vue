<template>
  <div>
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index=2>功能加载</el-menu-item>
      <el-menu-item index="1">功能发布</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>
<script>
  import { Message } from 'element-ui'
  export default {
    data () {
      return {
        activeIndex: '2',
        isAdmin: false
      }
    },
    mounted () {

    },
    methods: {
      checkAdmin () {
        Ext.Ajax.request({
          url: '/billSvc/checkAdmin',
          jsonData: {
            handle: window.UserHandle
          },
          method: 'POST',
          async: false,
          success: (response) => {
            let result = Ext.decode(response.responseText)
            this.isAdmin = result.CheckAdminResult
          },
          failure: function () {
            Message.error('用户句柄无效')
            window.DesktopApp.router.push('/')
          }
        })
      },
      handleSelect (key, keyPath) {
        this.checkAdmin()
        if (key === '1') {
          if (!this.isAdmin) {
            Message.error('没有该功能权限')
          } else {
            this.$router.push('/layout/content/publish/push')
          }
        } else if (key === '2') {
          this.$router.push('/layout/content/publish/pull')
        }
      }
    }
  }
</script>

<style>

</style>

<style scoped>

</style>
