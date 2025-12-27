import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Account } from '../../shared/schema';

async function getAccounts() {
  const res = await fetch('/api/accounts');

  const { message, data } = (await res.json()) as APIResponse<Account[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });
}
