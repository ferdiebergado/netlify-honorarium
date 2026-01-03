import type { APIResponse } from '@/lib/api';
import { positionSchema, type Position, type PositionFormValues } from '@/shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const BASE_URL = '/api/positions';
const QUERY_KEY = 'positions';

export function usePositionForm(defaultValues: PositionFormValues) {
  return useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    defaultValues,
  });
}

export type PositionHookForm = ReturnType<typeof usePositionForm>;

async function createPosition(formData: PositionFormValues) {
  const res = await fetch(BASE_URL, {
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

export function useCreatePosition() {
  return useMutation({
    mutationFn: createPosition,
  });
}

async function getPositions() {
  const res = await fetch(BASE_URL);

  const { message, data } = (await res.json()) as APIResponse<Position[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function usePositions() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getPositions,
  });
}
