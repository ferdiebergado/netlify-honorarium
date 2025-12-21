import type { APIResponse } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const queryKey = 'payees';

export type Payee = {
  name: string;
};

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  salary: z.number().min(1, 'Basic salary is required.'),
  tin: z.string().min(1, 'TIN is required.'),
  bankId: z.number().min(1, 'Bank name is required.'),
  bankBranch: z.string().min(1, 'Bank branch is required.'),
  accountName: z.string().min(1, 'Account name is required.'),
  accountNo: z.string().min(1, 'Account number is required.'),
});

export type PayeeFormData = z.infer<typeof formSchema>;

export const usePayeeForm = (defaultValues: PayeeFormData) =>
  useForm<PayeeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

export type PayeeHookForm = ReturnType<typeof usePayeeForm>;

async function createPayee(data: PayeeFormData) {
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

    onSuccess: (_data, _error, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: [queryKey] }),

    mutationKey: ['createPayee'],
  });

async function getPayees() {
  const res = await fetch('/api/payees');

  const { message, data } = (await res.json()) as APIResponse<Payee[]>;

  if (!res.ok) throw new Error(message);

  if (data) return data;

  return [];
}

export function usePayees() {
  return useQuery({
    queryKey: [queryKey],
    queryFn: getPayees,
  });
}
