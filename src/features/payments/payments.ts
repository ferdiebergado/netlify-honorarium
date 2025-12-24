import type { APIResponse } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import * as z from 'zod';
import { formSchema } from './form-schema';

const queryKey = 'payments';

// TODO: embed objects
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

export type PaymentFormValues = z.infer<typeof formSchema>;

export function usePaymentForm(defaultValues: PaymentFormValues) {
  return useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
}

export type PaymentHookForm = ReturnType<typeof usePaymentForm>;

async function createPayment(formData: PaymentFormValues) {
  console.debug('formData:', formData);

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
    onError: err => {
      console.error(err);
    },
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

async function genCert(activityId: string | null) {
  console.log('generating cert...');

  if (!activityId) return;

  const res = await fetch('/api/certification/' + activityId, {
    method: 'POST',
  });

  if (!res.ok) {
    const { message } = (await res.json()) as APIResponse;
    throw new Error(message);
  }

  const blob = await res.blob();

  // Create a temporary link and trigger download
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certification-ac-${activityId}.docx`;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  return { message: 'Certification generated.' };
}

export function useCert() {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('activityId');

  return useMutation({
    mutationKey: ['certification', activityId],
    mutationFn: () => genCert(activityId),
  });
}
