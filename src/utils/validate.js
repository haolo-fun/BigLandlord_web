/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return /[a-zA-Z][0-9a-zA-Z_]+/.test(str.trim())
}

export function validPhone(phone) {
  return /^1([3578][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(phone)
}

export function validCode(code) {
  return /^\d{6}$/.test(code)
}
