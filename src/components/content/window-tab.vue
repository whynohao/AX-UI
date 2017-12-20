<template>
  <!--<div class="pull-right hidden-xs">-->
  <div class="taskbtn-row">
    <button class="scroll-left" v-if=true @click=moveLeft()>
    </button>
    <div class="tabspanel" id="tabspanel">
      <button v-for="tab in tabs" class="tabsbtn" @click=showWindow(tab)>
        {{tab.name}}
      </button>
    </div>
    <button class="scroll-right" v-if=true @click=moveRight()>
    </button>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    computed: {
      isoverflow () {
        const tabspanel = document.getElementById('tabspanel')
        return tabspanel.offsetWidth < tabspanel.scrollWidth
      },
      tabs () {
        return this.$store.state.windowTab.items
      }
    },
    mounted () {
    },
    methods: {
      moveLeft () {
        const tabspanel = document.getElementById('tabspanel')
        tabspanel.scrollLeft -= 50
      },
      moveRight () {
        const tabspanel = document.getElementById('tabspanel')
        tabspanel.scrollLeft += 50
      },
      showWindow (tab) {
        const win = Ext.getCmp(tab.id)
        win.setVisible(true)
      }
    }
  }
</script>
<style scoped>
  .taskbtn-row {
    display: flex;
    align-items: center;
    width: 1200px;
    height: 24px;
    padding-bottom: 5px;
  }

  .tabspanel {
    overflow: hidden;
    white-space: nowrap;
  }

  .tabsbtn {
    background-color: white;
    width: 120px;
    color: #49494A;
    font-weight: 800;
    opacity: 0.8;
    border-radius: 3px;
    padding: 3px 3px 3px 3px;
    margin: 2px 2px 2px 2px;
    border-width: 1px;
    border-style: solid;
    border-color: #555656;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .scroll-left:hover {
    opacity: 1;
  }

  .scroll-left {
    cursor: pointer;
    opacity: 0.5;
    margin-left: 4px;
    margin-right: 4px;
    text-align: center;
    width: 16px;
    height: 16px;
    border-style: none;
    background-image: url(/Scripts/extjs/images/footer-scroll-left.png);
  }

  .scroll-right:hover {
    opacity: 1;
  }

  .scroll-right {
    cursor: pointer;
    opacity: 0.5;
    margin-left: 4px;
    margin-right: 4px;
    text-align: center;
    width: 16px;
    height: 16px;
    border-style: none;
    background-image: url(/Scripts/extjs/images/footer-scroll-right.png);
  }
</style>
