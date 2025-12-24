import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

export default function SkeletonCard() {
  return (
    <Card>
      <div className="ml-8 flex flex-col space-y-8 space-x-4">
        <Skeleton className="h-9 w-1/4" />
        <Skeleton className="h-28 w-9/10" />
        <Skeleton className="h-9 w-3/7" />
      </div>
    </Card>
  );
}
