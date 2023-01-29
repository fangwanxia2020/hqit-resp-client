import Layout from '@/layout'
const routerArr = [
  {
    path: '/resp/reporting',
    name: 'reporting',
    redirect: '/resp/reporting',
    component: Layout,
    hidden: false,
    meta: {
      title: '主动上报履职要求',
      icon: 'platformManage',
    },
    children: [
      {
        path: 'index',
        name: 'reporting',
        component: () => import('@/views/reporting/index.vue'),
        meta: {
          title: '主动上报履职要求',
          activeMenu: '/systems/reporting',
        },
        hidden: false
      },
      {
        path: 'detail',
        name: 'reporting',
        component: () => import('@/views/reporting/detail.vue'),
        meta: {
          title: '主动上报履职要求详情',
          activeMenu: '/systems/reporting',
        },
        hidden: true
      },
      {
        path: 'detailTwo',
        name: 'detailTwo',
        component: () => import('@/views/reporting/detailTwo.vue'),
        meta: {
          title: '主动上报履职要求详情',
          activeMenu: '/systems/reporting',
        },
        hidden: true
      },
  
      
    ],
  },
]

export default routerArr