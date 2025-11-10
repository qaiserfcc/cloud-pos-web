import { useAppSelector } from './redux';

export const useTenant = () => {
  const { currentTenant, availableTenants, loading, error } = useAppSelector(
    (state) => state.tenant
  );

  return {
    currentTenant,
    availableTenants,
    loading,
    error,
    hasTenant: !!currentTenant,
  };
};