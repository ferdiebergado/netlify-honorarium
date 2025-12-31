import { Button } from './ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from './ui/empty';

type FallbackPageProps = {
  resetErrorBoundary: (...args: unknown[]) => void;
};

export default function FallbackPage({ resetErrorBoundary }: FallbackPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-destructive text-2xl font-bold">SYSTEM ERROR</EmptyTitle>
          <EmptyDescription>
            The application encountered an internal error and was unable to complete your request.
            Please try again in a few minutes. If the problem persists, please contact the
            administrator.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            onClick={() => {
              resetErrorBoundary();
            }}
          >
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
