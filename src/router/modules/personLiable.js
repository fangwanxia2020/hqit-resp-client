import Layout from '@/layout'
const routerArr = [
  {
    path: '/resp/personLiable',
    name: 'personLiable',
    redirect: '/resp/systems/personLiable',
    component: Layout,
    hidden: false,
    meta: {
      title: '安全第一责任人',
      icon: 'platformManage',
    },
    children: [
      {
        path: '',
        name: 'personLiable',
        component: () => import('@/views/personLiable/unauthorized.vue'),
        meta: {
          title: '安全第一责任人',
          activeMenu: '/systems/personLiable',
        },
        hidden: true
      },
  
      {
        path: 'authentication',
        name: 'personLiable',
        component: () => import('@/views/personLiable/authentication.vue'),
        meta: {
          title: '安全第一责任人认证',
          activeMenu: '/systems/personLiable',
        },
        hidden: true
      },
      {
        path: 'reauth',
        name: 'personLiable',
        component: () => import('@/views/personLiable/reauth.vue'),
        meta: {
          title: '重新认证',
          activeMenu: '/systems/personLiable',
        },
        hidden: true
      },
      {
        path: 'noPass',
        name: 'personLiable',
        component: () => import('@/views/personLiable/noPass.vue'),
        meta: {
          title: '认证不通过',
          activeMenu: '/systems/personLiable',
        },
        hidden: true
      },
      {
        path: 'process',
        name: 'personLiable',
        component: () => import('@/views/personLiable/process.vue'),
        meta: {
          title: '审核中',
          activeMenu: '/systems/personLiable',
        },
        hidden: true
      },
      {
        path: 'index',
        name: 'personLiable',
        component: () => import('@/views/personLiable/index.vue'),
        meta: {
          title: '认证通过',
          activeMenu: '/systems/personLiable',
        },
        hidden: true
      },
      
    ],
  },
]

export default routerArr