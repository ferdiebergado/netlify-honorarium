import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useComp } from './payments';

export default function ComputationButton() {
  const { isPending, mutate: genComp } = useComp();

  const handleClick = () => {
    genComp();
  };

  return (
    <Button
      title="Computation"
      className="mx-3 mt-6 flex w-36 items-center"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader text="Generating..." /> : 'Computation'}
    </Button>
  );
}
