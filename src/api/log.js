import request from '@/utils/request'

export function logList(params) {
  return request({
    url: '/systemManage/sysLog/list',
    method: 'get',
    params
  })
}
