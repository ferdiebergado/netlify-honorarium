import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import type { APIResponse } from '../../lib/api';
import { activitySchema, type Activity, type ActivityFormValues } from '../../shared/schema';

// TODO: const url = '/api/activities'
const queryKey = 'activities';

export const useActivityForm = (defaultValues: ActivityFormValues) =>
  useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues,
  });

export type ActivityHookForm = ReturnType<typeof useActivityForm>;

async function getActivities(activityId: string | null): Promise<Activity[]> {
  let url = '/api/activities';
  if (activityId) url += '/' + activityId;

  const res = await fetch(url);

  const { message, data } = (await res.json()) as APIResponse<Activity[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export const useActivities = () => {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('activityId');

  return useQuery({
    queryKey: [queryKey, activityId],
    queryFn: () => getActivities(activityId),
  });
};

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
    mutationKey: [queryKey],
  });

export type UpdateActivityData = {
  activityId: number;
  formData: ActivityFormValues;
};

async function updateActivity({ activityId, formData }: UpdateActivityData) {
  console.debug('formData', formData);

  const res = await fetch('/api/activities/' + activityId.toString(), {
    method: 'PUT',
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
    mutationFn: updateActivity,
    mutationKey: [queryKey],
  });
}

async function deleteActivity(id: number) {
  const res = await fetch('/api/activities/' + id.toString(), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { message } = (await res.json()) as APIResponse;

  if (!res.ok) throw new Error(message);

  return { message };
}

export function useDeleteActivity() {
  return useMutation({
    mutationFn: deleteActivity,
    mutationKey: [queryKey],
  });
}
