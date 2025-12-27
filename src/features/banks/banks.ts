import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Bank } from '../../shared/schema';

async function getBanks() {
  const res = await fetch('/api/banks');

  const { message, data } = (await res.json()) as APIResponse<Bank[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useBanks() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: getBanks,
  });
}
