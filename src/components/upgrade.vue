<template>
  <div class='col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 update-box-container'>
    <div class="box box-default box-solid update-box">
      <div class="box-header with-border update-box-header">
        <h3 class="box-title">系统升级</h3>
      </div>
      <div class="box-body" style="display: block;">
        <button type="button" class="btn btn-block btn-danger btn-lg" @click='upgrade()'>升级数据库</button>
        <button type="button" class="btn btn-block btn-info btn-lg" @click='openTask()'>打开排程任务</button>
      </div>
      <div class="overlay" v-if=' loading
        '>
        <i class="fa fa-refresh fa-spin"></i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        loading: false
      }
    },
    mounted () {
    },
    methods: {
      upgrade () {
        const vm = this
        vm.loading = true
        Ext.Ajax.request({
          url: 'systemManager/upgrade',
          method: 'POST',
          async: true,
          timeout: 90000000,
          success: function (response) {
            vm.loading = false
            Ext.Msg.alert('提示', '升级成功!')
          },
          failure: function () {
            vm.loading = false
            Ext.Msg.alert('提示', '升级失败!')
          }
        })
      },
      openTask () {
        Ext.Ajax.request({
          url: 'systemManager/openScheduleTask',
          method: 'POST',
          timeout: 90000000,
          success: function (response) {
            Ext.Msg.alert('提示', '打开成功!')
          },
          failure: function () {
            Ext.Msg.alert('提示', '打开失败!')
          }
        })
      }
    }
  }
</script>
<style scoped>
  .update-box-container {
    margin-top: 10%;
  }

  .update-box {
    height: 300px;
  }

  .btn {
    margin-top: 20px !important;
  }

  .update-box-header {
    color: white !important;
    background-color: #00c0ef !important;
  }
</style>
