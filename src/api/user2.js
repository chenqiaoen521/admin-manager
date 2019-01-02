import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: '/upmsManage/user/list',
    method: 'get',
    params: query
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
    url: '/upmsManage/role/list',
    method: 'get',
    params: query
  })
}

export function userAddRole(data) {
  return request({
    url: '/upmsManage/userRole/createRoles',
    method: 'post',
    data
  })
}

export function getUserByRole(params) {
  return request({
    url: '/upmsManage/userRole/getRolesByUserId',
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

export function addPerm(data) {
  return request({
    url: '/upmsManage/rolePermission/create',
    method: 'post',
    data
  })
}

export function addDeptByUser(data) {
  return request({
    url: '/upmsManage/userDepartment/create',
    method: 'post',
    data
  })
}
export function delDeptByUser(data) {
  return request({
    url: '/upmsManage/userDepartment/delete',
    method: 'delete',
    data
  })
}
export function getPermByRole(params) {
  return request({
    url: '/upmsManage/rolePermission/getPermissions',
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
    url: '/upmsManage/role/create',
    method: 'post',
    data
  })
}
export function delRole(data) {
  return request({
    url: '/upmsManage/role/delete',
    method: 'delete',
    data
  })
}
export function updateRole(data) {
  return request({
    url: '/upmsManage/role/update',
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
