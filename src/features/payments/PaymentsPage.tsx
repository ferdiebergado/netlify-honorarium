import CertificationButton from './CertificationButton';
import ComputationButton from './ComputationButton';
import CreatePaymentDialog from './CreatePaymentDialog';
import ORSButton from './ORSButton';
import PaymentList from './PaymentList';
import PayrollButton from './PayrollButton';

export default function PaymentsPage() {
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
      <PaymentList />
      <div className="flex items-center gap-1">
        <CertificationButton />
        <ComputationButton />
        <ORSButton />
        <PayrollButton />
      </div>
    </>
  );
}
