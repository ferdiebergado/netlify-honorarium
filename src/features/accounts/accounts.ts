import type { APIResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export type Account = {
  id: number;
  payeeId: number;
  accountNo: string;
  bank: string;
  bankBranch: string;
};

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
