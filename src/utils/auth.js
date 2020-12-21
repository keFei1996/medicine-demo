import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLS(key) {
  return localStorage.getItem(key) || ''
}

export function setLS(key, value) {
  return localStorage.setItem(key, value)
}

export function removeLS(key) {
  return localStorage.removeItem(key)
}

