import axios from '@/utils/axios'

// 分类模块接口

// 获取分类列表
export const getCategory = (categoryForm) => {
  return axios('/categories', 'get', categoryForm)
}

// 获取分类详情
export const getCategoryDetail = (id) => {
  return axios(`/categories/${id}`, 'get')
}

// 添加分类
export const postAddCategory = (categoryForm) => {
  return axios('/categories', 'post', categoryForm)
}

// 修改分类
export const putUpdateCategory = (categoryForm) => {
  return axios('/categories', 'put', categoryForm)
}

// 批量删除分类
export const deleteCategories = (ids) => {
  return axios('/categories', 'delete', ids)
}

// 单个删除分类
export const deleteCategoryOne = (id) => {
  return axios('/categories', 'delete', id)
}


