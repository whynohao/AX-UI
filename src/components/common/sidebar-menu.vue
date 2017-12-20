<script>
  import SideItem from './sidebar-menu-item'
  export default {
    render (h) {
      if (this.root) {
        return this.createRootNode(h, this.root)
      }
    },
    props: {
      root: {
        type: SideItem,
        default: function () {
          return {
            name: '菜单加载失败'
          }
        }
      }
    },
    data () {
      return {}
    },
    methods: {
      /* 此导航组件为研究render函数实现，简洁方式为使用嵌套组件即可 */
      createChildNodes (h, child) {
        const childNodes = []
        const nodeChildren = []
        const iIcon = h('i', {'class': child.icon})
        nodeChildren.push(iIcon)
        const spanName = h('span', [child.name])
        nodeChildren.push(spanName)
        const spanRightContainerChildren = []
        if (child.children && child.children.length > 0) {
          spanRightContainerChildren.push(h('i', {'class': {'fa fa-angle-left pull-right': true}}))
        }
        if (child.badges && child.badges.length > 0) {
          for (let badge of child.badges) {
            spanRightContainerChildren.push(h('i', {'class': badge.css}, [badge.value]))
          }
        }
        if (spanRightContainerChildren.length > 0) {
          nodeChildren.push(h('span', {'class': {'pull-right-container': true}}, spanRightContainerChildren))
        }
        const node = h('a',
          {
            on: {
              click: () => {
                this.$emit('itemClick', child)
              }
            }
          },
          nodeChildren
        )
        childNodes.push(node)
        if (child.children && child.children.length > 0) {
          const subChildren = h('ul',
            {
              'class': {'treeview-menu': true},
              style: {'overflow-x': 'auto'}
            }, this.createChildrenNode(h, child.children))
          childNodes.push(subChildren)
        }
        return childNodes
      },
      createChildrenNode (h, children) {
        const childrenNode = []
        for (let child of children) {
          const node = h(
            'li',
            {'class': child.css},
            this.createChildNodes(h, child)
          )
          childrenNode.push(node)
        }
        return childrenNode
      },
      createRootNode (h, root) {
        const rootChildren = []
        const titleNode = h(
          'li',
          {
            'class': {
              'header': true
            }
          }, [root.name]
        )
        rootChildren.push(titleNode)
        const children = this.createChildrenNode(h, root.children)
        for (let child of children) {
          rootChildren.push(child)
        }
        return h(
          'ul',
          {
            'class': {
              'sidebar-menu': true
            }
          },
          rootChildren
        )
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    color: #FFFFFF !important;
  }

  a {
    cursor: pointer
  }
</style>
