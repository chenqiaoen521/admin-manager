import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: '/upmsManage/user/list',
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
    url: '/upmsManage/user/create',
    method: 'post',
    data
  })
}

export function delUser(data) {
  return request({
    url: 'upmsManage/user/delete',
    method: 'delete',
    data
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
    url: '/upmsManage/user/update',
    method: 'put',
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
    url: '/api/role2/list',
    method: 'get',
    params: query
  })
}

export function userAddRole(params, paramsSerializer) {
  return request({
    url: '/api/user/addRole',
    method: 'get',
    params,
    paramsSerializer
  })
}

export function getUserByRole(params) {
  return request({
    url: '/api/user/getUserByRole',
    method: 'get',
    params
  })
}
export function delRoleByUser(data) {
  return request({
    url: '/api/user/delRoleByUser',
    method: 'delete',
    data
  })
}

export function addPerm(params, paramsSerializer) {
  return request({
    url: '/api/role2/addPerm',
    method: 'get',
    params,
    paramsSerializer
  })
}

export function addDeptByUser(params, paramsSerializer) {
  return request({
    url: '/api/user/addDept',
    method: 'get',
    params,
    paramsSerializer
  })
}
export function delDeptByUser(data) {
  return request({
    url: '/api/user/delDeptByUser',
    method: 'delete',
    data
  })
}
export function getPermByRole(params) {
  return request({
    url: '/api/role2/getPermByRole',
    method: 'get',
    params
  })
}
export function delPermByRole(data) {
  return request({
    url: '/api/role2/delPermByRole',
    method: 'delete',
    data
  })
}
export function addRole(data) {
  return request({
    url: '/api/role2/create',
    method: 'put',
    data
  })
}
export function delRole(data) {
  return request({
    url: '/api/role2/delete',
    method: 'delete',
    data
  })
}
export function updateRole(data) {
  return request({
    url: '/api/role2/edit',
    method: 'put',
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
