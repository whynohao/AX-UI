<template>
  <section class="sidebar-form">
    <div class="input-group">
      <input type="text" v-model.trim="text" class="form-control" placeholder="Search...">
      <span class="input-group-btn">
        <button type="submit" name="search" id="search-btn" class="btn btn-flat">
          <i class="fa fa-search"></i>
        </button>
      </span>
    </div>
  </section>
</template>
<script>
  export default {
    data () {
      return {
        text: ''
      }
    },
    watch: {
      'text': 'changed'
    },
    methods: {
      changed (val) {
        this.$emit('changed', val)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
