import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/home/index.vue'
import AddGood from '@/views/home/AddGood.vue'
import Swiper from '@/views/home/Swiper.vue'
import IndexConfig from '@/views/home/IndexConfig.vue'
import Category from '@/views/category/index.vue'
import Goods from '@/views/goods/index.vue'
import Order from '@/views/order/index.vue'
import OrderDetail from '@/views/order/OrderDetail.vue'
import Member from '@/views/member/index.vue'
import Login from '@/views/login/index.vue'
import Account from '@/views/login/Account.vue'

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/add',
      name: 'add',
      component: AddGood
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: Swiper
    },
    {
      path: '/hot',
      name: 'hot',
      component: IndexConfig
    },
    {
      path: '/new',
      name: 'new',
      component: IndexConfig
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: IndexConfig
    },
    {
      path: '/category',
      name: 'category',
      component: Category,
      children: [
        {
          path: '/category/level2',
          name: 'level2',
          component: Category,
        },
        {
          path: '/category/level3',
          name: 'level3',
          component: Category,
        }
      ]
    },
    {
      path: '/goods',
      name: 'goods',
      component: Goods
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: OrderDetail
    },
    {
      path: '/member',
      name: 'member',
      component: Member
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    },


  ]
})

export default router
