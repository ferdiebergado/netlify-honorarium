import { useMemo } from 'react';
import { AuthContext, useMe } from './auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isPending, isError, error, data: me } = useMe();

  const value = useMemo(
    () => ({
      user: me ?? null,
      isAuthenticated: !!me,
      isLoading: isPending,
      isError,
      error,
    }),
    [me, isPending, isError, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
