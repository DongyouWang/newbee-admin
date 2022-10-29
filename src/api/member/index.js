import axios from '@/utils/axios'

// 会员模块接口

// 账号解禁
export const putRemoveForbid = (ids) => {
  return axios(`/users/0`, 'put', ids)
}

// 禁用账号
export const putForbid = (ids) => {
  return axios(`/users/1`, 'put', ids)
}

// 获取会员账号列表
export const getAccountList = (accountParams) => {
  return axios('/users', 'get', accountParams)
}