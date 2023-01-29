// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const routerArr = [
  {
    path: '/resp/performanceRecord',
    name: 'performanceRecord',
    redirect: '/resp/performanceRecord',
    component: Layout,
    hidden: false,
    meta: {
      title: '履职情况',
      icon: 'platformManage',
    },
    children: [
      {
        path: 'index',
        name: 'performanceRecord',
        component: () => import('@/views/performanceRecord/index'),
        meta: {
          title: '履职情况',
          activeMenu: '/performanceRecord',
        },
      },
      {
        path: 'detail',
        name: 'performanceRecord',
        component: () => import('@/views/performanceRecord/detail'),
        meta: {
          title: '查看—履职情况',
          activeMenu: '/performanceRecord',
        },
        hidden: true
      },
    ],
  },
]

export default routerArr
