import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface UserPermissions {
  userId: string;
  roles: Role[];
  permissions: Permission[];
  isSuperAdmin: boolean;
}

interface PermissionState {
  userPermissions: UserPermissions | null;
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  userPermissions: null,
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setUserPermissions: (state, action: PayloadAction<UserPermissions>) => {
      state.userPermissions = action.payload;
      state.error = null;
    },
    setPermissionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPermissionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearPermissionError: (state) => {
      state.error = null;
    },
    resetPermissionState: () => initialState,
  },
});

export const {
  setUserPermissions,
  setPermissionLoading,
  setPermissionError,
  clearPermissionError,
  resetPermissionState,
} = permissionSlice.actions;

export default permissionSlice.reducer;