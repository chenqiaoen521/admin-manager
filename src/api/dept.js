import request from '@/utils/request'

export function getDeptList() {
  return request({
    url: '/upmsManage/department/selectAll',
    method: 'get'
  })
}

export function createDept(data) {
  return request({
    url: '/upmsManage/department/create',
    method: 'post',
    data
  })
}

export function editDept(data) {
  return request({
    url: '/upmsManage/department/update',
    method: 'put',
    data
  })
}

export function delDept(data) {
  return request({
    url: '/upmsManage/department/delete',
    method: 'delete',
    data
  })
}

