import { useQuery } from '@tanstack/react-query';
import type { APIResponse } from '../../lib/api';
import type { Venue } from '../../lib/schema';

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
