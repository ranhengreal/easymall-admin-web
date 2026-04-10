import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/Index.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/components/Layout/Index.vue'),
      redirect: '/dashboard',
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/Index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/category',
          name: 'Category',
          component: () => import('@/views/category/Index.vue'),
          meta: { title: '分类管理' }
        },
        {
          path: '/brand',
          name: 'Brand',
          component: () => import('@/views/brand/Index.vue'),
          meta: { title: '品牌管理' }
        },
        {
          path: '/product',
          name: 'Product',
          component: () => import('@/views/product/Index.vue'),
          meta: { title: '商品管理' }
        },
        {
          path: '/order',
          name: 'Order',
          component: () => import('@/views/order/Index.vue'),
          meta: { title: '订单管理' }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
