import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/views/Layout/index.vue'),

    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Consult/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/article',
        component: () => import('@/views/Article/index.vue'),
        meta: { title: '健康百科' }
      },
      {
        path: '/notify',
        component: () => import('@/views/Notify/index.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: '/user',
        component: () => import('@/views/User/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/user/patient',
    component: () => import('@/views/User/c-cnps/patient-page.vue'),
    meta: { title: '家庭档案' }
  },
  {
    path: '/consult/fast',
    component: () => import('@/views/Consult/index.vue'),
    meta: {
      title: '极速问诊'
    }
  },
  {
    path: '/consult/dep',
    component: () => import('@/views/Consult/c-cnps/consult-dep.vue'),
    meta: {
      title: '选择科室'
    }
  },

  {
    path: '/consult/illness',
    component: () => import('@/views/Consult/c-cnps/consultI-llness.vue'),
    meta: { title: '病情描述' }
  },
  {
    path: '/consult/pay',
    component: () => import('@/views/Consult/c-cnps/consult-pay.vue'),
    meta: { title: '问诊支付' }
  },
  {
    path: '/room',
    component: () => import('@/views/Room/index.vue'),
    beforeEnter: (to) => {
      // 判断是否支付成功，支付失败则跳入问诊记录中
      if (to.query.payResult === 'false') {
        return '/user/consult'
      }
    },
    meta: {
      title: '问诊室'
    }
  },
  {
    path: '/user/consult',
    component: () => import('@/views/User/c-cnps/consultPage/consult-page.vue'),
    meta: { title: '问诊记录' }
  },
  {
    path: '/user/consult/:id',
    component: () =>
      import('@/views/User/c-cnps/consultPage/consult-detail.vue'),
    meta: {
      title: '问诊详情'
    }
  },
  {
    path: '/user/order',
    component: () => import('@/views/User/c-cnps/orderPage/order-page.vue'),
    meta: {
      title: '我的订单'
    }
  },
  {
    path: '/medicine/pay',
    component: () => import('@/views/Medicine/index.vue'),
    meta: {
      title: '药品支付'
    }
  },
  {
    path: '/medicine/pay/result',
    component: () => import('@/views/Medicine/c-cnps/order-pay-result.vue'),
    meta: {
      title: '药品支付结果'
    }
  },
  {
    path: '/user/order/:id',
    component: () => import('@/views/User/c-cnps/orderPage/order-detail.vue'),
    meta: {
      title: '订单详情'
    }
  },
  {
    path: '/order/logistics/:id',
    component: () => import('@/views/Medicine/c-cnps/medicine-logistics.vue'),
    meta: { title: '物流详情' }
  }
]
export default routes
