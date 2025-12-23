import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCert } from './payments';

export default function Cert() {
  const { mutateAsync: genCert } = useCert();

  const handleClick = () => {
    toast.promise(genCert(), {
      loading: 'Generating certification...',
      success: (response: { message: string } | undefined) => response?.message,
      error: (err: Error) => err.message,
    });
  };

  return (
    <div className="flex gap-3">
      <Button variant="outline" title="Certification" onClick={handleClick}>
        Certification
      </Button>
    </div>
  );
}
