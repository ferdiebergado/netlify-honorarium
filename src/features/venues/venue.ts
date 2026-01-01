import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { venueSchema, type Venue, type VenueFormValues } from '../../shared/schema';

export async function getVenues() {
  const res = await fetch('/api/venues');
  const { message, data } = (await res.json()) as APIResponse<Venue[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
  });
}

export function useVenueForm(defaultValues: VenueFormValues) {
  return useForm<VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues,
  });
}

export type VenueHookForm = ReturnType<typeof useVenueForm>;

async function createVenue(formData: VenueFormValues) {
  const res = await fetch('/api/venues', {
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

export function useCreateVenue() {
  return useMutation({
    mutationFn: createVenue,
  });
}
