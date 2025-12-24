import Cert from './Cert';
import Comp from './Comp';
import CreatePaymentForm from './CreatePaymentForm';
import PaymentList from './PaymentList';

export default function PaymentsPage() {
  return (
    <>
      <div className="mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-2xl font-semibold">Payments</h1>
          <h2 className="text-muted-foreground">List of Payments</h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreatePaymentForm />
        </div>
      </div>
      <PaymentList />
      <Cert />
      <Comp />
    </>
  );
}
