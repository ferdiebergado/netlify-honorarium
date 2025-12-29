import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { checkId, startDownload } from '../../lib/utils';
import type { PaymentFormValues } from '../../shared/schema';
import { paymentSchema, type Payment } from '../../shared/schema';

const queryKey = 'payments';

export function usePaymentForm(defaultValues: PaymentFormValues) {
  return useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
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
  });
}

async function getPayments(activityId?: string) {
  let url = '/api/payments';
  if (activityId) url += '/' + activityId;

  const res = await fetch(url);
  const { message, data } = (await res.json()) as APIResponse<Payment[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePayments(activityId?: string) {
  return useQuery({
    queryKey: [queryKey, activityId],
    queryFn: () => getPayments(activityId),
  });
}

async function genCert(activityId: string) {
  checkId(activityId);
  const res = await fetch('/api/certification/' + activityId, {
    method: 'POST',
  });

  if (!res.ok) {
    const { message } = (await res.json()) as APIResponse;
    throw new Error(message);
  }

  startDownload(res, `certification-${activityId}.docx`);

  return { message: 'Certification generated.' };
}

export function useCert() {
  return useMutation({
    mutationFn: (activityId: string) => genCert(activityId),
  });
}

async function genComp(activityId: string) {
  checkId(activityId);

  const res = await fetch('/api/computations/' + activityId, {
    method: 'POST',
  });

  if (!res.ok) {
    const { message } = (await res.json()) as APIResponse;
    throw new Error(message);
  }

  startDownload(res, `computation-${activityId}.docx`);

  return { message: 'Computation generated.' };
}

export function useComp() {
  return useMutation({
    mutationFn: (activityId: string) => genComp(activityId),
  });
}

async function genORS(activityId: string) {
  checkId(activityId);

  const res = await fetch('/api/ors/' + activityId, {
    method: 'POST',
  });

  if (!res.ok) {
    const { message } = (await res.json()) as APIResponse;
    throw new Error(message);
  }

  startDownload(res, `ORS-${activityId}.xlsx`);

  return { message: 'ORS generated.' };
}

export function useORS() {
  return useMutation({
    mutationFn: (activityId: string) => genORS(activityId),
  });
}

async function genPayroll(activityId: string) {
  checkId(activityId);

  const res = await fetch('/api/payrolls/' + activityId, {
    method: 'POST',
  });

  if (!res.ok) {
    const { message } = (await res.json()) as APIResponse;
    throw new Error(message);
  }

  startDownload(res, `Payroll-${activityId}.xlsx`);

  return { message: 'Payroll generated.' };
}

export function usePayroll() {
  return useMutation({
    mutationFn: (activityId: string) => genPayroll(activityId),
  });
}
