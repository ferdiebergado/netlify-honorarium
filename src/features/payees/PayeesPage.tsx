import CreatePayeeForm from './CreatePayeeForm';
import PayeeList from './PayeeList';

export default function PayeesPage() {
  return (
    <>
      <div className="mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-2xl font-semibold">Payees</h1>
          <h2 className="text-muted-foreground">List of Payees</h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreatePayeeForm />
        </div>
      </div>
      <PayeeList />
    </>
  );
}
