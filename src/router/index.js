import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/pay',
    component: () => import('@/views/pay'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/finance',
    component: Layout,
    meta: { title: '财务', icon: 'el-icon-s-finance' },
    children: [
      {
        path: 'board',
        name: 'Board',
        component: () => import('@/views/finance/board'),
        meta: { title: '看板', icon: 'dashboard' }
      },
      {
        path: 'refund',
        name: 'Refund',
        component: () => import('@/views/finance/refund'),
        meta: { title: '退款', icon: 'el-icon-refresh-left' }
      }
    ]
  },

  {
    path: '/deposit',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Deposit',
        component: () => import('@/views/deposit/index'),
        meta: { title: '押金管理', icon: 'el-icon-money' }
      }
    ]
  },

  {
    path: '/tenant',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Tenant',
        component: () => import('@/views/tenant/index'),
        meta: { title: '租客信息管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/house',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'House',
        component: () => import('@/views/house/index'),
        meta: { title: '房源信息管理', icon: 'el-icon-s-home' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Order',
        component: () => import('@/views/order/index'),
        meta: { title: '租单信息管理', icon: 'el-icon-s-order' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
