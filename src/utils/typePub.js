// 工具函数
const _toString = Object.prototype.toString;
const map = {
  array: 'Array',
  object: 'Object',
  function: 'Function',
  string: 'String',
  null: 'Null',
  undefined: 'Undefined',
  boolean: 'Boolean',
  number: 'Number'
}
export const getType = (item) => {
  return _toString.call(item).slice(8, -1)
}
export const isTypeOf = (item, type) => {
  return map[type] && map[type] === getType(item)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// 深拷贝方法
export function cloneObj(obj) {
  if (!isTypeOf(obj, 'array') && !isTypeOf(obj, 'object')) {
    return obj
  }
  const newObj = obj instanceof Array ? [] : {};
  Object.keys(obj).forEach(key => {
    newObj[key] = cloneObj(obj[key])
  })
  return newObj
}
