import type { APIResponse } from '@/lib/api';
import type { User } from '@/shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';

const BASE_URL = '/api/auth';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return ctx;
}

async function getMe() {
  const res = await fetch(`${BASE_URL}/me`);

  const { message, data } = (await res.json()) as APIResponse<User>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate('/login', { replace: true });
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

type LocationState = {
  intendedPath?: string;
};

export function useIdToken() {
  const location = useLocation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (idToken: string) => verifyIdToken(idToken),
    onSuccess: () => {
      const { intendedPath } = location.state as LocationState;
      navigate(intendedPath ?? '/', { replace: true });
    },
  });
}
