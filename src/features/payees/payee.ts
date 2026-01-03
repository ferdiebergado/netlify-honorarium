import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { createPayeeSchema, type CreatePayeeFormValues, type Payee } from '../../shared/schema';

const BASE_URL = '/api/payees';
const QUERY_KEY = 'payees';

export const usePayeeForm = (defaultValues: CreatePayeeFormValues) =>
  useForm<CreatePayeeFormValues>({
    resolver: zodResolver(createPayeeSchema),
    defaultValues,
  });

export type PayeeHookForm = ReturnType<typeof usePayeeForm>;

async function createPayee(data: CreatePayeeFormValues) {
  const res = await fetch(BASE_URL, {
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
  });

async function getPayees() {
  const res = await fetch(BASE_URL);

  const { message, data } = (await res.json()) as APIResponse<Payee[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayees() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getPayees,
  });
}

async function getPayee(id: number): Promise<Payee> {
  const res = await fetch(`${BASE_URL}/${id.toString()}`);
  const { message, data } = (await res.json()) as APIResponse<Payee>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayee(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getPayee(id),
  });
}

async function getPayeesByActivity(activityId: number): Promise<Payee[]> {
  const url = `/api/activities/${activityId.toString()}/payees'`;
  const res = await fetch(url);

  const { message, data } = (await res.json()) as APIResponse<Payee[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayeesByActivity(activityId: number) {
  return useQuery({
    queryKey: [QUERY_KEY, activityId],
    queryFn: () => getPayeesByActivity(activityId),
  });
}
