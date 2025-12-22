import type { APIResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const queryKey = 'roles';

export type Role = {
  id: number;
  name: string;
};

export async function getRoles() {
  const res = await fetch('/api/roles');
  const { message, data } = (await res.json()) as APIResponse<Role[]>;

  if (!res.ok) throw new Error(message);

  if (data) return data;
  return [];
}

export function useRoles() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getRoles,
  });
}
