// import emptyLayout from '@/layout/layout'
import Layout from '@/layout'
const routerArr = [
  {
    path: '/resp/stayPerformance',
    name: 'stayPerformance',
    redirect: '/resp/stayPerformance',
    component: Layout,
    hidden: false,
    meta: {
      title: '待履职',
      icon: 'platformManage',
    },
    children: [
      {
        path: 'index',
        name: 'stayPerformance',
        component: () => import('@/views/stayPerformance/index'),
        meta: {
          title: '待履职',
          activeMenu: '/stayPerformance',
        },
      },
      {
        path: 'detail',
        name: 'stayPerformance',
        component: () => import('@/views/stayPerformance/detail'),
        meta: {
          title: '履职',
          activeMenu: '/stayPerformance',
        },
        hidden: true
      },
    ],
  },
]

export default routerArr
