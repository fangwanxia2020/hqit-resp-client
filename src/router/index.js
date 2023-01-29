import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
import emptyLayout from '@/layout/layout'
// 菜单管理
import menu from './modules/menu'
//用户管理
import user from './modules/user'
//角色管理
import role from './modules/role'
//履职要求
import entryRequire from './modules/entryRequire'
import personLiable from './modules/personLiable'
import statePersonLiable from "./modules/statePersonLiable"
import performanceRecord from "./modules/performanceRecord"
import record from "./modules/record"
import stayPerformance from "./modules/stayPerformance"
import reporting from "./modules/reporting"


export const constantRoutes = [
  {
    path: '/login/:roleKey?',
    component: () => import('@/views/login'),
    hidden: true,
  },

  // ...user,
  // ...menu,
  ...entryRequire,
  ...personLiable,
  ...statePersonLiable,
  ...performanceRecord,
  ...record,
  ...stayPerformance,
  ...reporting,
  {
    path: '/404',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/404'),
        name: '404',
        meta: {
          title: '404页面',
        },
      },
    ],
    hidden: true,
  },

  {
    path: '/',
    hidden: true,
    redirect: '/resp/personLiable',
  },
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  })
const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 新路由实例matcer，赋值给旧路由实例的matcher，（相当于replaceRouter）
}
/*前端动态路由设置 如果是后端配置可以不用管--------------*/
export const asyncRoutes = []
/*前端动态路由设置 如果是后端配置可以不用管--------------*/
//解决Vue-router在3.1之后把$router.push()方法改为了Promise后导致的报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}
// 解决Loading chunk (\d)+ failed问题
router.onError((error) => {
  console.error('路由报错++=====================================', error)
  const pattern = /Loading chunk/g
  // const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  console.log('444================', router)
  if (isChunkLoadFailed && error.type === 'missing') {
    // const targetPath =router.history.pending.fullPath
    router.push(targetPath)
  }
})
export default router
