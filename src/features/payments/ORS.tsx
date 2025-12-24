import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useORS } from './payments';

export default function ORS() {
  const { mutateAsync: genORS } = useORS();

  const handleClick = () => {
    toast.promise(genORS(), {
      loading: 'Generating ORS...',
      success: (response: { message: string } | undefined) => response?.message,
      error: (err: Error) => err.message,
    });
  };

  return (
    <div className="flex gap-3">
      <Button title="ORS/DV" size="lg" className="mx-3 mt-6" onClick={handleClick}>
        ORS/DV
      </Button>
    </div>
  );
}
