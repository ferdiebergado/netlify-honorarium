import type { APIResponse } from '@/lib/api';
import type { User } from '@/shared/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

const BASE_URL = '/api/auth';
const QUERY_KEY = 'me';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return ctx;
}

async function getMe() {
  const res = await fetch(`${BASE_URL}/me`);

  if (res.status === 401) return null;

  const { message, data } = (await res.json()) as APIResponse<User>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useMe() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    throwOnError: false,
  });
}

async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
  });

  const { message } = (await res.json()) as APIResponse;

  if (!res.ok) throw new Error(message);

  return { message };
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
      queryClient.setQueryData([QUERY_KEY], null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

async function verifyIdToken(idToken: string) {
  const payload = { id_token: idToken };
  const res = await fetch(`${BASE_URL}/google`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const { message } = (await res.json()) as APIResponse;

  if (!res.ok) throw new Error(message);
  return { message };
}

export function useIdToken() {
  return useMutation({
    mutationFn: (idToken: string) => verifyIdToken(idToken),
  });
}
