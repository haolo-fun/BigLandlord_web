import request from '@/utils/request'

export function getRoleByUsername(username) {
  return request({
    url: '/admin/roleRelation/list/' + username,
    method: 'get'
  })
}

export function addRole(username, roleName) {
  return request({
    url: '/admin/roleRelation/' + username + '/' + roleName,
    method: 'post'
  })
}

export function delRole(username, roleName) {
  return request({
    url: '/admin/roleRelation/' + username + '/' + roleName,
    method: 'delete'
  })
}
