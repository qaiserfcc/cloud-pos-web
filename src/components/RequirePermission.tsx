import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface RequirePermissionProps {
  resource: string;
  action: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  resource,
  action,
  fallback = null,
  children,
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RequireAnyPermissionProps {
  permissions: Array<{ resource: string; action: string }>;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RequireAnyPermission: React.FC<RequireAnyPermissionProps> = ({
  permissions,
  fallback = null,
  children,
}) => {
  const { hasAnyPermission } = usePermissions();

  if (!hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface RequireRoleProps {
  role: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  fallback = null,
  children,
}) => {
  const { hasRole } = usePermissions();

  if (!hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};