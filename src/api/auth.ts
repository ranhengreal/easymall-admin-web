import request from '@/utils/request'

export interface LoginParams {
  account: string
  password: string
  checkCode: string
  checkCodeKey: string
}

export interface CheckCodeResponse {
  checkCodeKey: string
  checkCode: string
}

// 获取验证码
export const getCheckCode = () => {
  return request.get<any, CheckCodeResponse>('/admin/account/checkCode')
}

// 登录
export const login = (params: LoginParams) => {
  return request.post('/admin/account/login', null, { params })
}

// 登出
export const logout = () => {
  return request.post('/admin/account/logout')
}
