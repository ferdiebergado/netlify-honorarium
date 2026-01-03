import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { salarySchema, type Salary, type SalaryFormValues } from '../../shared/schema';

const BASE_URL = '/api/salaries';
const QUERY_KEY = 'salaries';

async function getSalaries() {
  const res = await fetch(BASE_URL);
  const { message, data } = (await res.json()) as APIResponse<Salary[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useSalaries() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getSalaries,
  });
}

async function getSalary(payeeId: string) {
  const res = await fetch(`${BASE_URL}/${payeeId}/salaries`);
  const { message, data } = (await res.json()) as APIResponse<Salary[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useSalary(payeeId: string) {
  return useQuery({
    queryKey: [QUERY_KEY, payeeId],
    queryFn: () => getSalary(payeeId),
  });
}

export function useCreateSalaryForm(defaultValues: SalaryFormValues) {
  return useForm<SalaryFormValues>({
    resolver: zodResolver(salarySchema),
    defaultValues,
  });
}

export type SalaryHookForm = ReturnType<typeof useCreateSalaryForm>;

async function createSalary(formData: SalaryFormValues) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const { message } = (await res.json()) as APIResponse;

  if (!res.ok) throw new Error(message);

  return { message };
}

export function useCreateSalary() {
  return useMutation({
    mutationFn: createSalary,
  });
}
