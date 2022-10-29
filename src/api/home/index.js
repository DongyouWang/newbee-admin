import axios from '@/utils/axios'

// 获取轮播图列表
export const getCarousels = (Pageparams) => {
  return axios('/carousels', 'get', Pageparams)
}

// 获取轮播图详情
export const getCarouselDetail = (id) => {
  return axios(`/carousels/${id}`, 'get')
}

// 添加一张轮播图
export const postAddCarousel = (carouselForm) => {
  return axios('/carousels', 'post', carouselForm)
}

// 修改一张轮播图
export const putUpdateCarousel = (carouselForm) => {
  return axios('/carousels', 'put', carouselForm)
}

// 批量删除轮播图
export const deleteCarousels = (ids) => {
  return axios('/carousels', 'delete', ids)
}

// 获取热销商品列表、新品上线列表、为你推荐列表
export const getIndexConfigs = (params) => {
  return axios('/indexConfigs', 'get', params)
}

// 获取商品详情
export const getGoodsDetail = (id) => {
  return axios(`/indexConfigs/${id}`, 'get')
}

// 添加商品
export const postAddGoods = (goodsForm) => {
  return axios('/indexConfigs', 'post', goodsForm)
}

// 修改商品
export const putUpdateGoods = (goodsForm) => {
  return axios('/indexConfigs', 'put', goodsForm)
}

// 批量删除商品
export const deleteGoods = (ids) => {
  return axios('/indexConfigs/delete', 'post', ids)
}

// 删除商品
export const deleteGood = (id) => {
  return axios('/indexConfigs/delete', 'post', id)
}
