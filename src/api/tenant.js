import request from '@/utils/request'

export function getTenantOptions(name) {
  return request({
    url: '/tenant/get/el-select/' + name,
    method: 'get'
  })
}
