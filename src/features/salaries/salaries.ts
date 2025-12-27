import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Salary } from '../../lib/schema';

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
