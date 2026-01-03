import type { APIResponse } from '@/lib/api';
import type { User } from '@/shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const GOOGLE_LOGIN_ENDPOINT = '/api/oauth/google/login';

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

export function login() {
  window.location.replace(GOOGLE_LOGIN_ENDPOINT);
}

async function getMe() {
  const res = await fetch('/api/auth/me');

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
  const res = await fetch('/api/auth/logout', {
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
    onError: err => {
      toast.error(err.message);
    },
  });
}
