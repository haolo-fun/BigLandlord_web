import request from '@/utils/request'

/**
 * 获取个人财务信息
 * @returns {*}
 */
export function getMsg() {
  return request({
    url: '/finance/msg',
    method: 'get'
  })
}
