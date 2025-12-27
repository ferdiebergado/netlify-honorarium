import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useORS } from './payments';

export default function ORSButton() {
  const title = 'ORS/DV';
  const { isPending, mutate: genORS } = useORS();

  const handleClick = () => {
    genORS();
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
