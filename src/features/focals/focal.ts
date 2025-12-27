import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Focal } from '../../lib/schema';

export async function getFocals() {
  const res = await fetch('/api/focals');
  const { message, data } = (await res.json()) as APIResponse<Focal[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useFocals() {
  return useQuery({
    queryKey: ['focals'],
    queryFn: getFocals,
  });
}
