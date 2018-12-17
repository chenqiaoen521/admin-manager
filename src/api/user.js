import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params: query
  })
}

export function findUser(data) {
  return request({
    url: '/api/user/find',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: 'api/user/del',
    method: 'get',
    params: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/api/user/update/status',
    method: 'get',
    params: data
  })
}

export function updatePass(data) {
  return request({
    url: '/api/user/update/password',
    method: 'post',
    data
  })
}

export function updateroleID(data) {
  return request({
    url: '/api/user/update/role',
    method: 'post',
    data
  })
}

export function getRoleList(query) {
  return request({
    url: '/api/user/role/list',
    method: 'get',
    params: query
  })
}

export function addRole(data) {
  return request({
    url: '/api/user/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/api/user/role/update',
    method: 'post',
    data
  })
}

export function getAuthList(params) {
  return request({
    url: '/api/user/auth/list',
    method: 'get',
    params
  })
}

export function addAuth(data) {
  return request({
    url: '/api/user/auth/add',
    method: 'post',
    data
  })
}

export function updateAuth(data) {
  return request({
    url: '/api/user/auth/update',
    method: 'post',
    data
  })
}

export function getUserAuths(data) {
  return request({
    url: '/api/user/auths',
    method: 'get',
    params: data
  })
}
