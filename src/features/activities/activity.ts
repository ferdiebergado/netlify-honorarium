import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

export type Activity = {
  id: number;
  title: string;
  venueId: number;
  venue: string;
  startDate: string;
  endDate: string;
  code: string;
  fund: string;
  focalId: number;
  focal: string;
};

export const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters.')
    .max(150, 'Title must be at most 150 characters.'),
  venueId: z.number().min(1, 'Venue is required.'),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  code: z.string().min(17, 'Activity Code must be at least 17 characters.'),
  fund: z.string().min(7, 'Fund Source must be at least 7 characters.'),
  focalId: z.number().min(1, 'Focal Person is required.'),
});

export type ActivityFormdata = z.infer<typeof formSchema>;

export const useActivityForm = () =>
  useForm<ActivityFormdata>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      venueId: 0,
      startDate: '',
      endDate: '',
      code: '',
      fund: '',
      focalId: 0,
    },
  });

async function createActivity(formData: ActivityFormdata) {
  console.log('formData', formData);

  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error('request failed');

  const data = await res.json();
  return data;
}

async function listActivities(): Promise<Activity[]> {
  const res = await fetch('/api/activities');

  if (!res.ok) throw new Error('request failed');

  return await res.json();
}

export const useActivityList = () =>
  useQuery({
    queryKey: ['activities'],
    queryFn: listActivities,
  });

export const useCreateActivity = (form: ReturnType<typeof useActivityForm>) =>
  useMutation({
    mutationFn: createActivity,
    onSuccess: async (data, _variables, _onMutateResult, context) => {
      await context.client.invalidateQueries({ queryKey: ['activities'] });
      form.reset();
      toast.success(data.message);
    },
    onError: err => toast.error(err.message),
  });
