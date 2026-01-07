import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import {
  createAccountSchema,
  type Account,
  type CreateAccountFormValues,
} from '../../shared/schema';

const BASE_URL = '/api/accounts';
const QUERY_KEY = 'accounts';

async function getAccounts() {
  const res = await fetch(BASE_URL);

  const { message, data } = (await res.json()) as APIResponse<Account[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useAccounts() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAccounts,
  });
}

async function getPayeeAccounts(payeeId: number) {
  const res = await fetch(`${BASE_URL}/${payeeId.toString()}/accounts`);

  const { message, data } = (await res.json()) as APIResponse<Account[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayeeAccounts(payeeId: number) {
  return useQuery({
    queryKey: [QUERY_KEY, payeeId],
    queryFn: () => getPayeeAccounts(payeeId),
  });
}

export function useAccountForm(defaultValues: CreateAccountFormValues) {
  return useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues,
  });
}
export type AccountHookForm = ReturnType<typeof useAccountForm>;

async function createAccount(payeeId: number, formData: CreateAccountFormValues) {
  const payload = { payeeId, formData };
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const { message } = (await res.json()) as { message: string };

  if (!res.ok) throw new Error(message);

  return { message };
}

type CreateAccountData = {
  payeeId: number;
  formData: CreateAccountFormValues;
};

export function useCreateAccount() {
  return useMutation({
    mutationFn: ({ payeeId, formData }: CreateAccountData) => createAccount(payeeId, formData),
  });
}
