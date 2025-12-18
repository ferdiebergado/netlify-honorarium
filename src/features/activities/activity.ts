import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export type Activity = {
  id: number;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  code: string;
  fund: string;
};

export const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters.')
    .max(150, 'Title must be at most 150 characters.'),
  venue: z
    .string()
    .min(20, 'Venue must be at least 20 characters.')
    .max(100, 'Venue must be at most 100 characters.'),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  code: z.string(),
  fund: z.string(),
});

export type ActivityFormdata = z.infer<typeof formSchema>;

export const useActivityForm = () =>
  useForm<ActivityFormdata>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      venue: '',
      startDate: '',
      endDate: '',
      code: '',
      fund: '',
    },
  });

async function listActivities() {
  const res = await fetch('/list-activities');

  if (!res.ok) throw new Error('request failed');

  const data = await res.json();
  return data.data;
}

async function getActivity(id: number): Promise<Activity> {
  const res = await fetch('/activity/' + id);

  if (!res.ok) throw new Error('request failed');

  const data = await res.json();
  return data;
}

export const useActivityList = () =>
  useQuery({
    queryKey: ['activities'],
    queryFn: listActivities,
  });

export const useActivity = (id: number) => {
  return useQuery({
    queryKey: ['activity'],
    queryFn: () => getActivity(id),
  });
};
