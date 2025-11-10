import { useAppSelector } from './redux';

export const usePermissions = () => {
  const { userPermissions, loading, error } = useAppSelector(
    (state) => state.permission
  );

  const hasPermission = (resource: string, action: string): boolean => {
    if (!userPermissions) return false;
    if (userPermissions.isSuperAdmin) return true;

    return userPermissions.permissions.some(
      (permission) => permission.resource === resource && permission.action === action
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!userPermissions) return false;
    if (userPermissions.isSuperAdmin) return true;

    return userPermissions.roles.some((role) => role.name === roleName);
  };

  const hasAnyPermission = (permissions: Array<{ resource: string; action: string }>): boolean => {
    return permissions.some(({ resource, action }) => hasPermission(resource, action));
  };

  return {
    userPermissions,
    loading,
    error,
    hasPermission,
    hasRole,
    hasAnyPermission,
    isSuperAdmin: userPermissions?.isSuperAdmin ?? false,
    isAuthenticated: !!userPermissions,
  };
};