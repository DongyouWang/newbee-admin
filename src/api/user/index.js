import axios from '@/utils/axios'

// 用户模块接口

// 用户登录
export const userAccountLogin = (loginForm) => {
  return axios('/adminUser/login', 'post', loginForm)
}

// 获取用户信息
export const getUserInfo = () => {
  return axios('/adminUser/profile','get')
}

// 用户退出登录
export const userLogout = () => {
  return axios('/logout', 'delete')
}

// 修改账号信息
export const putModifyAccount = (accountForm) => {
  return axios('/adminUser/name', 'put', accountForm)
}

// 修改密码
export const putModifyPassword = (passwordForm) => {
  return axios('/adminUser/password', 'put', passwordForm)
}

