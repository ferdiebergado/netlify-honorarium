import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Role } from '../../lib/schema';

const queryKey = 'roles';

export async function getRoles() {
  const res = await fetch('/api/roles');
  const { message, data } = (await res.json()) as APIResponse<Role[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useRoles() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getRoles,
  });
}
