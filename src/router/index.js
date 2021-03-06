import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: 'users', component: Users },
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles },
        { path: 'categories', component: Cate },
        { path: 'goods', component: Cate },
        { path: 'params', component: Cate },
        { path: 'orders', component: Cate },
        { path: 'reports', component: Cate }
      ]
    }
  ]
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户进入登录界面，直接放行
  if (to.path === '/login') {
    next()
  } else {
    // 如果在其他界面，判断其是否登录(是否有token值)
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) next('/login')
    else {
      next()
    }
  }
})

export default router
