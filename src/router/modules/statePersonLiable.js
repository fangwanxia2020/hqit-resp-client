import Layout from '@/layout'
const routerArr = [
  {
    path: '/resp/statePersonLiable',
    name: 'statePersonLiable',
    redirect: '/resp/statePersonLiable',
    component: Layout,
    hidden: false,
    meta: {
      title: '安全第一责任人(政府端)',
      icon: 'platformManage',
    },
    children: [
      {
        path: '',
        name: 'statePersonLiable',
        component: () => import('@/views/statePersonLiable/index.vue'),
        meta: {
          title: '安全第一责任人(政府端)',
          activeMenu: '/systems/statePersonLiable',
        },
        hidden: false
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/statePersonLiable/detail.vue'),
        meta: {
          title: '认证详情',
          activeMenu: '/systems/statePersonLiable',
        },
        hidden: true
      },
  
  
      
    ],
  },
]

export default routerArr