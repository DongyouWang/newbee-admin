import axios from '@/utils/axios'

// 商品管理模块接口

// 获取商品轮播图列表
export const getGoods = (goodsParams) => {
  return axios('/goods/list', 'get', goodsParams)
}

// 商品上下架
export const goodsShelvesOnOff = (shelvesData) => {
  return axios(`/goods/status/${shelvesData.status}`, 'put', {ids: shelvesData.ids})
}

// 获取商品详情
export const getGoodsDetail = (id)=> {
  return axios(`/goods/${id}`, 'get', id)
}

// 添加商品
export const postAddGoods = (goodsForm) => {
  return axios('/goods', 'post', goodsForm)
}

// 修改商品
export const putUpdateGoods = (goodsForm) => {
  return axios('/goods', 'put', goodsForm)
}
