import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useComp } from './payments';

type ComputationButtonProps = {
  activityId: string;
};

export default function ComputationButton({ activityId }: ComputationButtonProps) {
  const title = 'Computation';
  const { isPending, mutate: genComp } = useComp();

  const handleClick = () => {
    genComp(activityId);
  };

  return (
    <Button
      title={title}
      className="mx-3 mt-6 flex w-36 shrink-0 font-bold"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? <Loader text="Generating..." /> : title}
    </Button>
  );
}
