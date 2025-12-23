import type { APIResponse } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import * as z from 'zod';

const queryKey = 'payments';

export type Payment = {
  id: number;
  activityId: number;
  activity: string;
  payeeId: number;
  payee: string;
  roleId: number;
  role: string;
  honorarium: number;
  hoursRendered: number;
  actualHonorarium: number;
  taxRate: number;
  netHonorarium: number;
  salaryId: number;
  bankId: number;
  tinId?: number;
  createdAt: string;
  updatedAt: string;
  activityCode: string;
};

export const formSchema = z.object({
  activityId: z.number().min(1, 'Activity is required.'),
  payeeId: z.number().min(1, 'Payee is required.'),
  roleId: z.number().min(1, 'Role is required.'),
  honorarium: z.number().min(1, 'Honorarium is required.'),
  salaryId: z.number().min(1, 'Basic salary is required.'),
  taxRate: z.number().min(1, 'Withholding tax rate is required.'),
  tinId: z.number().optional(),
  bankId: z.number().min(1, 'Bank account is required.'),
});

export type PaymentFormValues = z.infer<typeof formSchema>;

export function usePaymentForm(defaultValues: PaymentFormValues) {
  return useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
}

export type PaymentHookForm = ReturnType<typeof usePaymentForm>;

async function createPayment(formData: PaymentFormValues) {
  const res = await fetch('/api/payments', {
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

export function useCreatePayment() {
  return useMutation({
    mutationFn: createPayment,
    mutationKey: [queryKey],
  });
}

async function getPayments(activityId: string | null) {
  let url = '/api/payments';
  if (activityId) url += '/' + activityId;

  const res = await fetch(url);
  const { message, data = [] } = (await res.json()) as APIResponse<Payment[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayments() {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('activityId');

  return useQuery({
    queryKey: [queryKey, activityId],
    queryFn: () => getPayments(activityId),
  });
}
