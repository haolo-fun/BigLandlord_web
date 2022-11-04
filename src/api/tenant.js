import request from '@/utils/request'

export function getTenantOptions(name) {
  return request({
    url: '/tenant/get/el-select/' + name,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/tenant/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/tenant/update',
    method: 'put',
    data
  })
}

export function deleteById(id) {
  return request({
    url: '/tenant/del/' + id,
    method: 'delete'
  })
}

export function list(current, size) {
  return request({
    url: '/tenant/get/' + current + '/' + size,
    method: 'get'
  })
}

export function listByDesc(current, size) {
  return request({
    url: '/tenant/get/desc/' + current + '/' + size,
    method: 'get'
  })
}

export function listByName(name, current, size) {
  return request({
    url: '/tenant/get/' + name + '/' + current + '/' + size,
    method: 'get'
  })
}
