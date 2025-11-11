import apiClient, { ApiResponse } from './api-client';

// Auth-related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  tenantId?: string;
  storeId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  tokens: AuthTokens;
}> {}

export interface RegisterResponse extends ApiResponse<{
  user: User;
  tokens: AuthTokens;
}> {}

export interface RefreshTokenResponse extends ApiResponse<{
  token: string;
  refreshToken: string;
}> {}

// Auth service class
class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  // Register new user
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  }

  // Logout user
  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/logout');
    return response.data;
  }

  // Get current user profile
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  }

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/change-password', data);
    return response.data;
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
    return response.data;
  }

  // Reset password with token
  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/reset-password', data);
    return response.data;
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/auth/verify-email', { token });
    return response.data;
  }

  // Check if user has permission
  hasPermission(user: User | null, resource: string, action: string): boolean {
    if (!user) return false;

    // Superadmin bypasses all permission checks
    if (user.roles.some(role => role.name === 'superadmin')) {
      return true;
    }

    return user.roles.some(role =>
      role.permissions.some(permission =>
        permission.resource === resource && permission.action === action
      )
    );
  }

  // Check if user has role
  hasRole(user: User | null, roleName: string): boolean {
    if (!user) return false;
    return user.roles.some(role => role.name === roleName);
  }

  // Get user permissions as flat array
  getUserPermissions(user: User | null): string[] {
    if (!user) return [];

    const permissions: string[] = [];
    user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        permissions.push(`${permission.resource}:${permission.action}`);
      });
    });

    return [...new Set(permissions)]; // Remove duplicates
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;