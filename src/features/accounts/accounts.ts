import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import {
  createAccountSchema,
  type Account,
  type CreateAccountFormValues,
} from '../../shared/schema';

async function getAccounts() {
  const res = await fetch('/api/accounts');

  const { message, data } = (await res.json()) as APIResponse<Account[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });
}

async function getPayeeAccounts(payeeId: number) {
  const res = await fetch('/api/payees/' + payeeId.toString() + '/accounts');

  const { message, data } = (await res.json()) as APIResponse<Account[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayeeAccounts(payeeId: number) {
  return useQuery({
    queryKey: ['accounts', payeeId],
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

async function createAccount(formData: CreateAccountFormValues) {
  const res = await fetch('/api/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const { message } = (await res.json()) as { message: string };

  if (!res.ok) throw new Error(message);

  return { message };
}

export function useCreateAccount() {
  return useMutation({
    mutationFn: createAccount,
  });
}
