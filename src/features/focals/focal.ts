import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { focalSchema, type Focal, type FocalFormValues } from '../../shared/schema';

export async function getFocals() {
  const res = await fetch('/api/focals');
  const { message, data } = (await res.json()) as APIResponse<Focal[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useFocals() {
  return useQuery({
    queryKey: ['focals'],
    queryFn: getFocals,
  });
}

export function useFocalForm(defaultValues: FocalFormValues) {
  return useForm<FocalFormValues>({
    resolver: zodResolver(focalSchema),
    defaultValues,
  });
}

export type FocalHookForm = ReturnType<typeof useFocalForm>;

async function createFocal(formData: FocalFormValues) {
  const res = await fetch('/api/focals', {
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

export function useCreateFocal() {
  return useMutation({
    mutationFn: createFocal,
  });
}
