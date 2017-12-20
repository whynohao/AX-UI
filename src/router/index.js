import Vue from 'vue'
import Router from 'vue-router'
import system from 'src/service/system'
import bill from 'src/service/bill'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component (resolve) {
        require(['../components/login.vue'], resolve)
      }
    },
    {
      path: '/sso',
      component (resolve) {
        require(['../components/main-layout.vue'], resolve)
      },
      children: [
        {
          name: 'content',
          path: 'content',
          component (resolve) {
            require(['../components/content/layout.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/ssobill',
      component (resolve) {
        require(['../components/main-layout.vue'], resolve)
      },
      children: [
        {
          name: 'content',
          path: 'content',
          component (resolve) {
            require(['../components/content/layout.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/update',
      component (resolve) {
        require(['../components/upgrade.vue'], resolve)
      }
    },
    {
      path: '/register',
      component (resolve) {
        require(['../components/register.vue'], resolve)
      }
    },
    {
      path: '/recoverpassword',
      component (resolve) {
        require(['../components/recoverpassword.vue'], resolve)
      }
    },
    {
      path: '/layout',
      component (resolve) {
        require(['../components/main-layout.vue'], resolve)
      },
      children: [
        {
          name: 'content',
          path: 'content',
          component (resolve) {
            require(['../components/content/layout.vue'], resolve)
          },
          children: [
            {
              name: 'publish',
              path: 'publish',
              component (resolve) {
                require(['../components/content/publish.vue'], resolve)
              },
              children: [
                {
                  name: 'push',
                  path: 'push',
                  component (resolve) {
                    require(['../components/content/publish-push.vue'], resolve)
                  }
                },
                {
                  name: 'pull',
                  path: 'pull',
                  component (resolve) {
                    require(['../components/content/publish-pull.vue'], resolve)
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '*',
      component (resolve) {
        require(['../components/404.vue'], resolve)
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.toString() === '/sso') {
    system.ssoLogin(decodeURIComponent(to.query.userId), decodeURIComponent(to.query.token), true, () => {
      next('/layout/content')
    })
  } else if (to.path.toString() === '/ssobill') {
    const info = JSON.parse(decodeURIComponent(to.query.bill))
    system.ssoLogin(info.UserId, decodeURIComponent(info.Token), true, () => {
      next('/layout/content')
      bill.openBill(info)
    })
  } else if (to.path !== '/' && to.path !== '/login') {
    if (!window.UserHandle) {
      next('/')
    }
  }
  next()
})

export default router
