import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-destructive text-2xl font-bold">Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need
            below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>
            Need help? <a href="#">Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
