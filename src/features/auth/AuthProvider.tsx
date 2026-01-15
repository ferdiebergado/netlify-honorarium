import { useMemo, type ReactNode } from 'react';
import { AuthContext, useMe } from './auth';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { isPending, isFetching, data: me } = useMe();

  const value = useMemo(
    () => ({
      user: me ?? null,
      isLoading: isPending || isFetching,
    }),
    [me, isPending, isFetching]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
