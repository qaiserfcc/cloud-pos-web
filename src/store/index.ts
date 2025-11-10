import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import tenantReducer from './tenantSlice'
import permissionReducer from './permissionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    permission: permissionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
