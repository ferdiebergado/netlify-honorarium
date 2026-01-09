import SkeletonCard from '@/components/SkeletonCard';
import CreatePaymentDialog from './CreatePaymentDialog';
import PaymentList from './PaymentList';
import { usePayments } from './payments';

export default function PaymentsPage() {
  const { isPending, isError, error, data: payments } = usePayments();

  if (isPending) return <SkeletonCard />;

  if (isError) return <p className="text-destructive">{error.message}</p>;

  return (
    <>
      <div className="mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-2xl font-semibold">Payments</h1>
          <h2 className="text-muted-foreground">List of Payments</h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreatePaymentDialog />
        </div>
      </div>
      <PaymentList payments={payments} />
    </>
  );
}
