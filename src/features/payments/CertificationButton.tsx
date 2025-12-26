import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useCert } from './payments';

export default function CertificationButton() {
  const { isPending, mutate: genCert } = useCert();

  const handleClick = () => {
    genCert();
  };

  return (
    <div className="flex gap-3">
      <Button
        title="Certification"
        className="mx-3 mt-6 w-36"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? <Loader text="Generating..." /> : 'Certification'}
      </Button>
    </div>
  );
}
