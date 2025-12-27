import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { createPayeeSchema, type CreatePayeeFormValues, type Payee } from '../../shared/schema';

const queryKey = 'payees';

export const usePayeeForm = (defaultValues: CreatePayeeFormValues) =>
  useForm<CreatePayeeFormValues>({
    resolver: zodResolver(createPayeeSchema),
    defaultValues,
  });

export type PayeeHookForm = ReturnType<typeof usePayeeForm>;

async function createPayee(data: CreatePayeeFormValues) {
  const res = await fetch('/api/payees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const { message } = (await res.json()) as APIResponse;

  if (!res.ok) throw new Error(message);

  return { message };
}

export const useCreatePayee = () =>
  useMutation({
    mutationFn: createPayee,
    mutationKey: [queryKey],
  });

async function getPayees() {
  const res = await fetch('/api/payees');

  const { message, data } = (await res.json()) as APIResponse<Payee[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayees() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getPayees,
  });
}

async function getPayee(id: number): Promise<Payee> {
  const res = await fetch('/api/payees/' + id.toString());
  const { message, data } = (await res.json()) as APIResponse<Payee>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayee(id: number) {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: () => getPayee(id),
  });
}
