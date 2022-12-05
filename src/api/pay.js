import request from '@/utils/request'

export function payOrderByPC(data) {
  return request({
    url: '/pay/order/pc',
    method: 'post',
    data
  })
}

export function payOrderByPhone(data) {
  return request({
    url: '/pay/order/phone',
    method: 'post',
    data
  })
}

export function payDepositByPC(data) {
  return request({
    url: '/pay/deposit/pc',
    method: 'post',
    data
  })
}

export function payDepositByPhone(data) {
  return request({
    url: '/pay/deposit/phone',
    method: 'post',
    data
  })
}

export function alipayTradeQuery(trade_no) {
  return request({
    url: '/pay/tradeQuery/' + trade_no,
    method: 'get'
  })
}

export function depositRefund(refund_amount, deposit_sn) {
  return request({
    url: '/pay/tradeRefund/deposit/' + refund_amount + '/' + deposit_sn,
    method: 'put'
  })
}

export function orderRefund(refund_amount, order_sn) {
  return request({
    url: '/pay/tradeRefund/order/' + refund_amount + '/' + order_sn,
    method: 'put'
  })
}
