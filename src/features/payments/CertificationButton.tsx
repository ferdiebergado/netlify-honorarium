import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useCert } from './payments';

type CertificationButtonProps = {
  activityId: string;
};

export default function CertificationButton({ activityId }: CertificationButtonProps) {
  const title = 'Certification';
  const { isPending, mutate: genCert } = useCert();

  const handleClick = () => {
    genCert(activityId);
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
