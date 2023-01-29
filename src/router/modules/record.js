// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const routerArr = [
  {
    path: '/resp/record',
    name: 'record',
    redirect: '/resp/record',
    component: Layout,
    hidden: false,
    meta: {
      title: '履职记录',
      icon: 'platformManage',
    },
    children: [
      {
        path: 'index',
        name: 'record',
        component: () => import('@/views/record/index'),
        meta: {
          title: '履职记录',
          activeMenu: '/record',
        },
      },
      {
        path: 'detail',
        name: 'record',
        component: () => import('@/views/record/detail'),
        meta: {
          title: '查看—履职记录',
          activeMenu: '/record',
        },
        hidden: true
      },
    ],
  },
]

export default routerArr
