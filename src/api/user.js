import request from '@/utils/request2'

export function login(data) {
  return request({
    url: 'auth1/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'auth1/logout',
    method: 'get'
  })
}
