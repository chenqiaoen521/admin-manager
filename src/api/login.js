import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    userCode: username,
    password,
    rememberMe: 0
  }
  return request({
    url: '/sso/login',
    method: 'put',
    data
  })
}

export function logout() {
  return request({
    url: '/sso/logout',
    method: 'put'
  })
}

export function getUserInfo(userCode) {
  return request({
    url: '/upmsManage/permission/permissionsByUserId',
    method: 'get',
    params: {
      userCode
    }
  })
}

export function UserRegister(data) {
  return request({
    url: '/sso/register',
    method: 'put',
    data
  })
}

export function UserLogin(data) {
  return request({
    url: '/sso/login',
    method: 'put',
    data
  })
}