import type { APIResponse } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export type Payee = {
  name: string;
  positionId: number;
  bank: string;
  bankBranch: string;
  accountNo: string;
  accountName: string;
  tin: string;
};

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  positionId: z.number().min(1, 'Position is required.'),
  bank: z.string().min(1, 'Bank is required.'),
  bankBranch: z.string().min(1, 'Bank branch is required.'),
  accountNo: z.string().min(1, 'Account number is required.'),
  accountName: z.string().min(1, 'Account name is required.'),
  tin: z.string().min(1, 'TIN is required'),
});

export type PayeeFormData = z.infer<typeof formSchema>;

export const usePayeeForm = (defaultValues: PayeeFormData) =>
  useForm<PayeeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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
  });
