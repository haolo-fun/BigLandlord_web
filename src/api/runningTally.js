import request from '@/utils/request'

/**
 * 获取所有流水
 * @param current
 * @param size
 * @returns {*}
 */
export function getAllRunningTally(current, size) {
  return request({
    url: '/runningTally/all/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取最近十条流水
 * @returns {*}
 */
export function getRecentlyRunningTally() {
  return request({
    url: '/runningTally/recently',
    method: 'get'
  })
}

/**
 * 获取押金流水
 * @param current
 * @param size
 * @returns {*}
 */
export function getDepositRunningTally(current, size) {
  return request({
    url: '/runningTally/deposit/' + current + '/' + size,
    method: 'get'
  })
}

/**
 * 获取租金流水
 * @param current
 * @param size
 * @returns {*}
 */
export function getRentRunningTally(current, size) {
  return request({
    url: '/runningTally/rent/' + current + '/' + size,
    method: 'get'
  })
}
