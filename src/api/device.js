import request from '@/utils/request'

export function deviceList(params) {
  return request({
    url: '/upmsManage/deviceGroup/list',
    method: 'get',
    params
  })
}
