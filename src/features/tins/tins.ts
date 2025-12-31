import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { tinSchema, type Tin, type TinFormValues } from '../../shared/schema';

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

async function getPayeeTins(payeeId: string) {
  const res = await fetch('/api/tins/' + payeeId);
  const { message, data } = (await res.json()) as APIResponse<Tin[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayeeTins(payeeId: string) {
  return useQuery({
    queryKey: [queryKey, payeeId],
    queryFn: () => getPayeeTins(payeeId),
  });
}

export function useCreateTinForm(defaultValues: TinFormValues) {
  return useForm<TinFormValues>({
    resolver: zodResolver(tinSchema),
    defaultValues,
  });
}

export type TinHookForm = ReturnType<typeof useCreateTinForm>;

async function createTin(formData: TinFormValues) {
  const res = await fetch('/api/tins', {
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

export function useCreateTin() {
  return useMutation({
    mutationFn: createTin,
  });
}
