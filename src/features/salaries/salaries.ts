import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Salary } from '../../shared/schema';

const queryKey = 'salaries';

async function getSalaries() {
  const res = await fetch('/api/salaries');
  const { message, data } = (await res.json()) as APIResponse<Salary[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useSalaries() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getSalaries,
  });
}

async function getSalary(payeeId: string) {
  const res = await fetch('/api/salaries/' + payeeId);
  const { message, data } = (await res.json()) as APIResponse<Salary[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useSalary(payeeId: string) {
  return useQuery({
    queryKey: [queryKey, payeeId],
    queryFn: () => getSalary(payeeId),
  });
}
