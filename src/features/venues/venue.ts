import { useQuery } from '@tanstack/react-query';

export type Venue = {
  id: number;
  name: string;
};

export async function getVenues() {
  const res = await fetch('/api/venues');

  if (!res.ok) throw new Error('request failed');

  return (await res.json()) as Venue[];
}

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
  });
}
