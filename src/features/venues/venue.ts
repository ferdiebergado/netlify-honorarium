import { useQuery } from '@tanstack/react-query';

export type Venue = {
  id: number;
  name: string;
};

function isVenue(value: unknown): value is Venue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as Venue).id === 'number' &&
    'name' in value &&
    typeof (value as Venue).name === 'string'
  );
}

export async function getVenues(): Promise<Venue[]> {
  const res = await fetch('/api/venues');

  if (!res.ok) throw new Error('request failed');

  const data = await res.json();

  if (!isVenue(data[0])) throw new Error('invalid venue data');

  return data;
}

export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: getVenues,
  });
}
