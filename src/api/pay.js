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
    url: '/pay/TradeQuery/' + trade_no,
    method: 'get'
  })
}

export function alipayTradeRefund(refund_amount, deposit_sn) {
  return request({
    url: '/pay/TradeRefund/' + refund_amount + '/' + deposit_sn,
    method: 'put'
  })
}
