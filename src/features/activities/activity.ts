import type { APIResponse } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const queryKey = 'activities';

export type Activity = {
  id: number;
  title: string;
  venueId: number;
  venue: string;
  startDate: string;
  endDate: string;
  code: string;
  focalId: number;
  focal: string;
};

export const formSchema = z
  .object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters.')
      .max(150, 'Title must be at most 150 characters.'),
    venueId: z.number().min(1, 'Venue is required.'),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    code: z.string().min(17, 'Activity Code must be at least 17 characters.'),
    focalId: z.number().min(1, 'Focal Person is required.'),
  })
  .refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    path: ['endDate'],
    message: 'End date must be on or after start date',
  });

export type ActivityFormValues = z.infer<typeof formSchema>;

export const useActivityForm = (defaultValues: ActivityFormValues) =>
  useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

export type ActivityHookForm = ReturnType<typeof useActivityForm>;

async function getActivities() {
  const res = await fetch('/api/activities');

  const { message, data } = (await res.json()) as APIResponse<Activity[]>;
  if (!res.ok) throw new Error(message);

  if (data) return data;

  return [];
}

export const useActivities = () =>
  useQuery({
    queryKey: [queryKey],
    queryFn: getActivities,
  });

async function createActivity(formData: ActivityFormValues) {
  console.debug('formData', formData);

  const res = await fetch('/api/activities', {
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

export const useCreateActivity = () =>
  useMutation<{ message: string }, Error, ActivityFormValues>({
    mutationFn: createActivity,

    onSuccess: (_data, _variables, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: [queryKey] }),
  });

async function updateActivity(id: number, formData: ActivityFormValues) {
  const res = await fetch('/api/activities/' + id.toString(), {
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

export function useUpdateActivity() {
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: ActivityFormValues }) =>
      updateActivity(id, formData),
    onSuccess: (_data, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}
