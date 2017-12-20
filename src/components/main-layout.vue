<template>
  <div class="wrapper">
    <main-header></main-header>
    <main-sidebar></main-sidebar>
    <div class="content-wrapper">
      <router-view></router-view>
    </div>
    <main-footer></main-footer>
    <main-control-sidebar></main-control-sidebar>
  </div>
</template>

<script>
  export default {
    components: {
      'main-header': require('./main-header.vue'),
      'main-sidebar': require('./main-sidebar.vue'),
      'main-footer': require('./main-footer.vue'),
      'main-control-sidebar': require('./main-control-sidebar.vue')
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted () {
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
