import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export default function SkeletonCard() {
  return (
    <Card className="mt-8 flex flex-col gap-x-4 gap-y-8">
      <Skeleton className="h-9 w-1/4" />
      <Skeleton className="h-28 w-9/10" />
      <Skeleton className="h-9 w-3/7" />
    </Card>
  );
}
