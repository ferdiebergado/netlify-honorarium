import { Link } from 'react-router';
import { Button } from './ui/button';

type BackButtonProps = {
  path: string;
};

export default function BackButton({ path }: BackButtonProps) {
  return (
    <Button
      variant="outline"
      className="mx-3 mt-6 font-bold"
      render={<Link to={path}>Back</Link>}
    ></Button>
  );
}
