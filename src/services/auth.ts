import http from './httpClient'
import type { paths } from '../api-types/openapi'

type LoginRequest = paths['/auth/login']['post']['requestBody']['content']['application/json']
type LoginResponse = paths['/auth/login']['post']['responses']['200']['content']['application/json']

export interface LoginParams {
  email: string
  password: string
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const res = await http.post('/auth/login', params)
  const data = res.data as LoginResponse

  if (data?.data?.accessToken) {
    localStorage.setItem('token', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken || '')
  }

  return data
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken')
}

export default { login, logout, getToken, getRefreshToken }
