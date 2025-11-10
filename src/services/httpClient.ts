import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1'

const http = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// Attach tokens and tenant/store headers
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const tenantId = localStorage.getItem('tenantId')
  const storeId = localStorage.getItem('storeId')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  if (tenantId && config.headers) config.headers['X-Tenant-ID'] = tenantId
  if (storeId && config.headers) config.headers['X-Store-ID'] = storeId
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // simple 401 handling placeholder
    if (err?.response?.status === 401) {
      // trigger logout or token refresh flow (to implement)
      localStorage.removeItem('token')
    }
    return Promise.reject(err)
  }
)

export default http
