import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { bankSchema, type Bank, type BankFormValues } from '../../shared/schema';

const BASE_URL = '/api/banks';
const QUERY_KEY = 'banks';

async function getBanks() {
  const res = await fetch(BASE_URL);

  const { message, data } = (await res.json()) as APIResponse<Bank[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useBanks() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getBanks,
  });
}

export function useBankForm(defaultValues: BankFormValues) {
  return useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues,
  });
}

export type BankHookForm = ReturnType<typeof useBankForm>;

async function createBank(data: BankFormValues) {
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

export function useCreateBank() {
  return useMutation({
    mutationFn: createBank,
  });
}
