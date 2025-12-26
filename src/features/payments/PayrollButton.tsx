import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { usePayroll } from './payments';

export default function PayrollButton() {
  const { isPending, mutate: genPayroll } = usePayroll();

  const handleClick = () => {
    genPayroll();
  };

  return (
    <Button title="Payroll" className="mx-3 mt-6 w-36" onClick={handleClick} disabled={isPending}>
      {isPending ? <Loader text="Generating..." /> : 'Payroll'}
    </Button>
  );
}
