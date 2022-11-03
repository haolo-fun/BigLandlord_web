import request from '@/utils/request'

/**
 * 获取所有押金单
 * @param current
 * @param size
 * @returns {*}
 */
export function list(current, size) {
  return request({
    url: '/deposit/list/' + current + '/' + size,
    method: 'get'
  })
}

export function listBySn(sn) {
  return request({
    url: '/deposit/list/' + sn,
    method: 'get'
  })
}

/**
 * 获取所有押金单（倒序）
 * @param current
 * @param size
 * @returns {*}
 */
export function listByDesc(current, size) {
  return request({
    url: '/deposit/list/desc/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 根据租客id获取所有押金单
 * @param tenantId
 * @param current
 * @param size
 * @returns {*}
 */
export function listByTenantId(tenantId, current, size) {
  return request({
    url: '/deposit/list/' + tenantId + '/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取所有未付款押金单
 * @param current
 * @param size
 * @returns {*}
 */
export function listByNotPay(current, size) {
  return request({
    url: '/deposit/list/DID_NOT_PAY/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取所有未付款押金单（倒序）
 * @param current
 * @param size
 * @returns {*}
 */
export function listByNotPayDesc(current, size) {
  return request({
    url: '/deposit/list/DID_NOT_PAY/desc/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取所有已付款押金单
 * @param current
 * @param size
 * @returns {*}
 */
export function listByPay(current, size) {
  return request({
    url: '/deposit/list/HAVE_TO_PAY/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取所有已付款押金单（倒序）
 * @param current
 * @param size
 * @returns {*}
 */
export function listByPayDesc(current, size) {
  return request({
    url: '/deposit/list/HAVE_TO_PAY/desc/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取所有已退款押金单
 * @param current
 * @param size
 * @returns {*}
 */
export function listByRefund(current, size) {
  return request({
    url: '/deposit/list/REFUND/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取所有已退款押金单（倒序）
 * @param current
 * @param size
 * @returns {*}
 */
export function listByRefundDesc(current, size) {
  return request({
    url: '/deposit/list/REFUND/desc/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 更新状态为已支付
 * @param sn 押金单编号
 * @returns {*}
 */
export function updateStatusToPay(sn) {
  return request({
    url: '/deposit/status/HAVE_TO_PAY/' + sn,
    method: 'put'
  })
}

/**
 * 删除押金单
 * @param sn 押金单编号
 * @returns {*}
 */
export function deleteBySn(sn) {
  return request({
    url: '/deposit/' + sn,
    method: 'delete'
  })
}
