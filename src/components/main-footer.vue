<template>
  <footer class="main-footer">
    <div class="level">
      <div>
        <window-tab></window-tab>
      </div>
      <div style='border-top: 1px solid black;'>
        <div class="pull-right hidden-xs">
          <b>Version</b> 3.0
        </div>
        <strong>Copyright &copy; 2014-2017.</strong> All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script>
  import * as adminlte from '../../Scripts/vendor/admin-lte/adminlte'
  export default {
    components: {
      'window-tab': require('src/components/content/window-tab.vue')
    },
    data () {
      return {}
    },
    mounted () {
      this.$nextTick(() => {
        adminlte.init()
      })
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .main-footer {
    padding: 5px;
  }

  .level {
    display: flex;
    flex-direction: column;
  }
</style>
