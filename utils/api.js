import axios from 'axios'
const getToken = function () {
  if (process.server) {
    return
  }
  if (window.$nuxt) {
    return window.$nuxt.$auth.getToken('local')
  }
}

const HOSTNAME = 'http://localhost:8080/api'

export async function request(method, url, data, auth = false) {
  const headers = {}
  if (auth) {
    headers['Authorization'] = getToken()
  }
  try {
    const response = await axios({
      method,
      url: HOSTNAME + url,
      data,
      headers,
    })
    return response
  } catch (e) {
    return e
  }
}
