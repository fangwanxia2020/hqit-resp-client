// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const routerArr = [
  {
    path: '/resp/entryRequire',
    name: 'entryRequire',
    redirect: '/resp/entryRequire',
    component: Layout,
    hidden: false,
    meta: {
      title: '履职要求',
      icon: 'platformManage',
    },
    children: [
      {
        path: 'index',
        name: 'entryRequire',
        component: () => import('@/views/entryRequire/index'),
        meta: {
          title: '履职要求',
          activeMenu: '/entryRequire',
        },
      },
      {
        path: 'add',
        name: 'entryRequire',
        component: () => import('@/views/entryRequire/add'),
        meta: {
          title: '新增—履职要求',
          activeMenu: '/entryRequire',
        },
        hidden: true
      },
      {
        path: 'edit',
        name: 'entryRequire',
        component: () => import('@/views/entryRequire/add'),
        meta: {
          title: '修改—履职要求',
          activeMenu: '/entryRequire',
        },
        hidden: true
      },
      {
        path: 'info',
        name: 'entryRequire',
        component: () => import('@/views/entryRequire/info'),
        meta: {
          title: '查看—履职要求',
          activeMenu: '/entryRequire',
        },
        hidden: true
      },
    ],
  },
]

export default routerArr
