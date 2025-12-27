import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Tin } from '../../lib/schema';

const queryKey = 'tins';

async function getTins() {
  const res = await fetch('/api/tins');
  const { message, data } = (await res.json()) as APIResponse<Tin[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useTins() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getTins,
  });
}
