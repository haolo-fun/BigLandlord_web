import request from '@/utils/request'

export function sandCode(phone) {
  return request({
    url: '/notify/sendCode/' + phone,
    method: 'post'
  })
}

export function sandCodeToTenant(phone) {
  return request({
    url: '/notify/tenant/sendCode/' + phone,
    method: 'post'
  })
}
