import { Link } from 'react-router';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-2xl font-bold">Page Not Found</EmptyTitle>
          <EmptyDescription>The page you&apos;re looking for doesn&apos;t exist.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            <Link to="/">Home</Link>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
