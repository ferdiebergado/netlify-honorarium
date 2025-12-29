import SkeletonCard from '@/components/SkeletonCard';
import CreatePayeeDialog from './CreatePayeeDialog';
import { usePayees } from './payee';
import PayeeList from './PayeeList';

export default function PayeesPage() {
  const { isPending, isError, error, data: payees } = usePayees();

  if (isPending) return <SkeletonCard />;

  if (isError) return <p className="text-destructive m-3">Error: {error.message}</p>;

  return (
    <>
      <div className="mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-2xl font-semibold">Payees</h1>
          <h2 className="text-muted-foreground">List of Payees</h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreatePayeeDialog />
        </div>
      </div>
      <PayeeList payees={payees} />
    </>
  );
}
