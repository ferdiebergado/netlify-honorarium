import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useORS } from './payments';

type ORSButtonProps = {
  activityId: string;
};

export default function ORSButton({ activityId }: ORSButtonProps) {
  const title = 'ORS/DV';
  const { isPending, mutate: genORS } = useORS();

  const handleClick = () => {
    genORS(activityId);
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
