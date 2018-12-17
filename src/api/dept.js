import request from '@/utils/request'

export function getDeptList() {
  return request({
    url: '/api/department/selectAll',
    method: 'get'
  })
}

export function createDept(data) {
  return request({
    url: '/api/department/create',
    method: 'post',
    data
  })
}

export function editDept(data) {
  return request({
    url: '/api/department/update',
    method: 'put',
    data
  })
}

export function delDept(data) {
  return request({
    url: '/api/department/delete',
    method: 'delete',
    data
  })
}

