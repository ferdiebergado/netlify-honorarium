import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Bank } from '../../shared/schema';

const BASE_URL = '/api/banks';
const QUERY_KEY = 'banks';

async function getBanks() {
  const res = await fetch(BASE_URL);

  const { message, data } = (await res.json()) as APIResponse<Bank[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useBanks() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getBanks,
  });
}
