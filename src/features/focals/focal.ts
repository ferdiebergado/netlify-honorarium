import { useQuery } from '@tanstack/react-query';

export type Focal = {
  id: number;
  name: string;
};

export async function getFocals(): Promise<Focal[]> {
  const res = await fetch('/api/focals');

  if (!res.ok) throw new Error('request failed');

  return await res.json();
}

export function useFocals() {
  return useQuery({
    queryKey: ['focals'],
    queryFn: getFocals,
  });
}
