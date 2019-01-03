import request from '@/utils/request'

export function deviceList(params) {
  return request({
    url: '/upmsManage/deviceGroup/list',
    method: 'get',
    params
  })
}

export function deviceCreate(data) {
  return request({
    url: '/upmsManage/deviceGroup/create',
    method: 'post',
    data
  })
}

export function deviceUpdate(data) {
  return request({
    url: '/upmsManage/deviceGroup/update',
    method: 'put',
    data
  })
}

export function deviceDel(data) {
  return request({
    url: '/upmsManage/deviceGroup/delete',
    method: 'delete',
    data
  })
}

export function deviceAddRole(data) {
  return request({
    url: '/upmsManage/roleDeviceGroup/create',
    method: 'post',
    data
  })
}

export function devicegetRole(params) {
  return request({
    url: '/upmsManage/roleDeviceGroup/rolesByDeviceGroupId',
    method: 'get',
    params
  })
}

