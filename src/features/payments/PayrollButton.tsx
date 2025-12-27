import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { usePayroll } from './payments';

export default function PayrollButton() {
  const title = 'Payroll';
  const { isPending, mutate: genPayroll } = usePayroll();

  const handleClick = () => {
    genPayroll();
  };

  return (
    <Button
      title={title}
      className="mx-3 mt-6 w-36 shrink-0"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader text="Generating..." /> : title}
    </Button>
  );
}
