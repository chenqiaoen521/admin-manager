import request from '@/utils/request'

export function getPermList(params) {
  return request({
    url: '/api/permission/list',
    method: 'get',
    params
  })
}

export function createPerm(data) {
  return request({
    url: '/api/permission/create',
    method: 'post',
    data
  })
}

export function editPerm(data) {
  return request({
    url: '/api/permission/update',
    method: 'put',
    data
  })
}

export function delPerm(data) {
  return request({
    url: '/api/permission/delete',
    method: 'delete',
    data
  })
}

