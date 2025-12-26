import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useORS } from './payments';

export default function ORSButton() {
  const { isPending, mutate: genORS } = useORS();

  const handleClick = () => {
    genORS();
  };

  return (
    <Button title="ORS/DV" className="mx-3 mt-6 w-36" onClick={handleClick} disabled={isPending}>
      {isPending ? <Loader text="Generating..." /> : 'ORS/DV'}
    </Button>
  );
}
