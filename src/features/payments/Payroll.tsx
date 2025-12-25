import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePayroll } from './payments';

export default function Payroll() {
  const { isPending, mutateAsync: genPayroll } = usePayroll();

  const handleClick = () => {
    toast.promise(genPayroll(), {
      loading: 'Generating payroll...',
      success: (response: { message: string } | undefined) => response?.message,
      error: (err: Error) => err.message,
    });
  };

  return (
    <div className="flex gap-3">
      <Button title="Payroll" className="mx-3 mt-6" onClick={handleClick} disabled={isPending}>
        Payroll
      </Button>
    </div>
  );
}
