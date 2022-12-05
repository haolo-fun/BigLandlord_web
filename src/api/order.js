import request from '@/utils/request'

export function buildOrder(data) {
  return request({
    url: '/order/build/' + data.tenantId + '/' + data.houseId + '/' + data.count,
    method: 'post'
  })
}

export function orderList(desc, current, size) {
  return request({
    url: '/order/list/' + current + '/' + size + '/' + desc,
    method: 'get'
  })
}

export function orderListByHouseId(houseId, desc, current, size) {
  return request({
    url: '/order/listByHouseId/' + houseId + '/' + current + '/' + size + '/' + desc,
    method: 'get'
  })
}

export function orderListByOrderSn(orderSn) {
  return request({
    url: '/order/listByOrderSn/' + orderSn,
    method: 'get'
  })
}

export function orderListByOrderStatus(orderStatus, desc, current, size) {
  return request({
    url: '/order/listByOrderStatus/' + orderStatus + '/' + current + '/' + size + '/' + desc,
    method: 'get'
  })
}

export function orderListByTenantId(tenantId, desc, current, size) {
  return request({
    url: '/order/listByTenantId/' + tenantId + '/' + current + '/' + size + '/' + desc,
    method: 'get'
  })
}

export function updateStatusToHAS_BEEN_ISSUED(sn) {
  return request({
    url: '/order/updateStatus/HAS_BEEN_ISSUED/' + sn,
    method: 'put'
  })
}

export function updateStatusToHAVE_TO_PAY(sn) {
  return request({
    url: '/order/updateStatus/HAVE_TO_PAY/' + sn,
    method: 'put'
  })
}

export function updateStatusToNOT_ISSUED(sn) {
  return request({
    url: '/order/updateStatus/NOT_ISSUED/' + sn,
    method: 'put'
  })
}

export function updateAdditional(data) {
  return request({
    url: '/order/additional',
    method: 'put',
    data
  })
}

export function deleteAdditional(orderAdditionalId) {
  return request({
    url: '/order/additional/' + orderAdditionalId,
    method: 'delete'
  })
}

export function addAdditional(orderSn, data) {
  return request({
    url: '/order/additional/' + orderSn,
    method: 'post',
    data
  })
}

export function listByAdditional(orderSn) {
  return request({
    url: '/order/additional/' + orderSn,
    method: 'get'
  })
}
