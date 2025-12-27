import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useComp } from './payments';

export default function ComputationButton() {
  const title = 'Computation';
  const { isPending, mutate: genComp } = useComp();

  const handleClick = () => {
    genComp();
  };

  return (
    <Button
      title={title}
      className="mx-3 mt-6 flex w-36 shrink-0"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader text="Generating..." /> : title}
    </Button>
  );
}
