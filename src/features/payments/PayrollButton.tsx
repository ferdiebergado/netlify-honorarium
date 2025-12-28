import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { usePayroll } from './payments';

type PayrollButtonProps = {
  activityId: string;
};

export default function PayrollButton({ activityId }: PayrollButtonProps) {
  const title = 'Payroll';
  const { isPending, mutate: genPayroll } = usePayroll();

  const handleClick = () => {
    genPayroll(activityId);
  };

  return (
    <Button
      title={title}
      className="mx-3 mt-6 w-36 shrink-0 font-bold"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader text="Generating..." /> : title}
    </Button>
  );
}
