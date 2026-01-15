import { useMemo, type ReactNode } from 'react';
import { AuthContext, useMe } from './auth';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { isPending, data: me } = useMe();

  const value = useMemo(
    () => ({
      user: me ?? null,
      isLoading: isPending,
    }),
    [me, isPending]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
