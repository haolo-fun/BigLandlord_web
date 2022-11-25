import request from '@/utils/request'

export function getPaymentMsg(data) {
  return request({
    url: '/payment/msg',
    method: 'post',
    data
  })
}
