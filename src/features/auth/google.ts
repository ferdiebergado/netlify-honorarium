import type { APIResponse } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

async function googleLogin() {
  const res = await fetch('/api/oauth/google/login', {
    method: 'POST',
  });

  const { message, data } = (await res.json()) as APIResponse<string>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: googleLogin,
    onSuccess: authUrl => {
      navigate(authUrl);
    },
  });
}
