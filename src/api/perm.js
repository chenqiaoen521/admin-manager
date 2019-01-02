import request from '@/utils/request'

export function getPermList(params) {
  return request({
    url: '/upmsManage/permission/list',
    method: 'get',
    params
  })
}

export function getPermListAll() {
  return request({
    url: '/upmsManage/permission/getAll',
    method: 'get'
  })
}


export function createPerm(data) {
  return request({
    url: '/upmsManage/permission/create',
    method: 'post',
    data
  })
}

export function editPerm(data) {
  return request({
    url: '/upmsManage/permission/update',
    method: 'put',
    data
  })
}

export function delPerm(data) {
  return request({
    url: '/upmsManage/permission/delete',
    method: 'delete',
    data
  })
}

