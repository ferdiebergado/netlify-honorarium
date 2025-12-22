import type { APIResponse } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const queryKey = 'salaries';

export type Salary = {
  id: number;
  salary: number;
  payeeId: number;
};

async function getSalaries() {
  const res = await fetch('/api/salaries');
  const { message, data } = (await res.json()) as APIResponse<Salary[]>;

  if (!res.ok) throw new Error(message);

  if (data) return data;

  return [];
}

export function useSalaries() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getSalaries,
  });
}
