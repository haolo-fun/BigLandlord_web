import request from '@/utils/request'

export function addHouse(data) {
  return request({
    url: '/house/add',
    method: 'post',
    data
  })
}

export function delHouse(id) {
  return request({
    url: '/house/del/' + id,
    method: 'delete'
  })
}

export function updateHouse(data) {
  return request({
    url: '/house/update',
    method: 'put',
    data
  })
}

export function list(current, size) {
  return request({
    url: '/house/list/' + current + '/' + size,
    method: 'get'
  })
}

export function listByAddress(address, current, size) {
  return request({
    url: '/house/list/address/' + address + '/' + current + '/' + size,
    method: 'get'
  })
}

export function listByStatus(status, current, size) {
  return request({
    url: '/house/list/status/' + status + '/' + current + '/' + size,
    method: 'get'
  })
}

export function listByArea(low, high, current, size) {
  return request({
    url: '/house/list/area/' + low + '/' + high + '/' + current + '/' + size,
    method: 'get'
  })
}

export function listByPrice(low, high, current, size) {
  return request({
    url: '/house/list/price/' + low + '/' + high + '/' + current + '/' + size,
    method: 'get'
  })
}

export function listByHouseOptions(address) {
  return request({
    url: '/house/options/' + address,
    method: 'get'
  })
}
