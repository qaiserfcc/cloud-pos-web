import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { components } from '../api-types/openapi'

type User = components['schemas']['User']

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload
      if (action.payload) {
        localStorage.setItem('token', action.payload)
        state.isAuthenticated = true
      } else {
        localStorage.removeItem('token')
        state.isAuthenticated = false
      }
    },
    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload
      if (action.payload) {
        localStorage.setItem('refreshToken', action.payload)
      } else {
        localStorage.removeItem('refreshToken')
      }
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload
    },
    logout(state) {
      state.token = null
      state.refreshToken = null
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
  },
})

export const { setToken, setRefreshToken, setUser, setAuthenticated, logout } = authSlice.actions
export default authSlice.reducer
