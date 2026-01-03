import { checkId } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { activitySchema, type Activity, type ActivityFormValues } from '../../shared/schema';

const BASE_URL = '/api/activities';
const QUERY_KEY = 'activities';

export const useActivityForm = (defaultValues: ActivityFormValues) =>
  useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues,
  });

export type ActivityHookForm = ReturnType<typeof useActivityForm>;

async function getActivities(): Promise<Activity[]> {
  const url = BASE_URL;
  const res = await fetch(url);

  const { message, data } = (await res.json()) as APIResponse<Activity[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export const useActivities = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getActivities,
  });
};

async function createActivity(formData: ActivityFormValues) {
  console.debug('formData', formData);

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

export const useCreateActivity = () =>
  useMutation<{ message: string }, Error, ActivityFormValues>({
    mutationFn: createActivity,
  });

export type UpdateActivityData = {
  activityId: number;
  formData: ActivityFormValues;
};

async function updateActivity({ activityId, formData }: UpdateActivityData) {
  console.debug('formData', formData);

  const res = await fetch(`${BASE_URL}/${activityId.toString()}`, {
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
  });
}

async function deleteActivity(id: number) {
  const res = await fetch(`${BASE_URL}/${id.toString()}`, {
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
  });
}

async function getActivity(activityId: string): Promise<Activity> {
  const url = `${BASE_URL}/${activityId}`;
  const res = await fetch(url);

  const { message, data } = (await res.json()) as APIResponse<Activity>;

  if (!res.ok) throw new Error(message);

  return data;
}

export const useActivity = (activityId: string) => {
  checkId(activityId);

  return useQuery({
    queryKey: [QUERY_KEY, activityId],
    queryFn: () => getActivity(activityId),
  });
};

async function getFullActivity(activityId: string): Promise<Activity> {
  const url = `${BASE_URL}/${activityId}/payments`;
  const res = await fetch(url);

  const { message, data } = (await res.json()) as APIResponse<Activity>;

  if (!res.ok) throw new Error(message);

  return data;
}

export const useFullActivity = (activityId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, activityId],
    queryFn: () => getFullActivity(activityId),
  });
};
