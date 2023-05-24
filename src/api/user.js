import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function resetPw(data) {
  return request({
    url: '/user/resetPassword',
    method: 'put',
    data
  })
}

// admin permission

export function getUserList(current, size) {
  return request({
    url: '/admin/user/list/' + current + '/' + size,
    method: 'get'
  })
}

export function getUserByUsername(username) {
  return request({
    url: '/admin/user/getOne/' + username,
    method: 'get'
  })
}

export function resetPassword(username) {
  return request({
    url: '/admin/user/resetPassword/' + username,
    method: 'put'
  })
}

export function resetStatus(username) {
  return request({
    url: '/admin/user/resetStatus/' + username,
    method: 'put'
  })
}

export function addUser(data) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'put',
    data
  })
}
