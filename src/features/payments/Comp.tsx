import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useComp } from './payments';

export default function Comp() {
  const { mutateAsync: genComp } = useComp();

  const handleClick = () => {
    toast.promise(genComp(), {
      loading: 'Generating computation...',
      success: (response: { message: string } | undefined) => response?.message,
      error: (err: Error) => err.message,
    });
  };

  return (
    <div className="flex gap-3">
      <Button title="Computation" className="mx-3 mt-6" onClick={handleClick}>
        Computation
      </Button>
    </div>
  );
}
