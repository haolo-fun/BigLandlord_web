import request from '@/utils/request'

export function buildOrder(data) {
  return request({
    url: '/order/build/' + data.tenantId + '/' + data.houseId + '/' + data.count,
    method: 'post'
  })
}
