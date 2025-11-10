import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components } from '../api-types/openapi';

type Tenant = components['schemas']['Tenant'];

interface TenantState {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  currentTenant: null,
  availableTenants: [],
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload;
      state.error = null;
    },
    setAvailableTenants: (state, action: PayloadAction<Tenant[]>) => {
      state.availableTenants = action.payload;
      state.error = null;
    },
    setTenantLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTenantError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearTenantError: (state) => {
      state.error = null;
    },
    resetTenantState: () => initialState,
  },
});

export const {
  setCurrentTenant,
  setAvailableTenants,
  setTenantLoading,
  setTenantError,
  clearTenantError,
  resetTenantState,
} = tenantSlice.actions;

export default tenantSlice.reducer;