import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { tinSchema, type Tin, type TinFormValues } from '../../shared/schema';

const BASE_URL = '/api/tins';
const QUERY_KEY = 'tins';

async function getTins() {
  const res = await fetch(BASE_URL);
  const { message, data } = (await res.json()) as APIResponse<Tin[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useTins() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getTins,
  });
}

async function getPayeeTins(payeeId: string) {
  const res = await fetch(`${BASE_URL}/${payeeId}`);
  const { message, data } = (await res.json()) as APIResponse<Tin[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayeeTins(payeeId: string) {
  return useQuery({
    queryKey: [QUERY_KEY, payeeId],
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

export function useCreateTin() {
  return useMutation({
    mutationFn: createTin,
  });
}
