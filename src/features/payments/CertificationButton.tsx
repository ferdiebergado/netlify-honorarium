import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useCert } from './payments';

export default function CertificationButton() {
  const title = 'Certification';
  const { isPending, mutate: genCert } = useCert();

  const handleClick = () => {
    genCert();
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
