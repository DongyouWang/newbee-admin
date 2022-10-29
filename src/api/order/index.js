import axios from '@/utils/axios'

// 订单模块

// 获取订单列表
export const getOrders = (ordersParams) => {
  return axios('/orders', 'get', ordersParams)
}

// 配货方法
export const putDistributeGoods = (ids) => {
  return axios('/orders/checkDone', 'put', ids)
}

// 出库方法
export const putDeliveryGoods = (ids) => {
  return axios('/orders/checkOut', 'put', ids)
}

// 关闭订单方法
export const putCloseOrder = (ids) => {
  return axios('/orders/close', 'put', ids)
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return axios(`/orders/${id}`, 'get')
}
