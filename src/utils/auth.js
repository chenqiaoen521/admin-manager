import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getState(name) {
  return Cookies.get(name)
}

export function setState(name, state) {
  return Cookies.set(name, state)
}

export function removeState(name) {
  return Cookies.remove(name)
}