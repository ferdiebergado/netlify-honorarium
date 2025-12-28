import { Button } from '@/components/ui/button';
import type { Activity } from '@/shared/schema';
import type { Row } from '@tanstack/react-table';
import { Link } from 'react-router';

type PayeeButtonProps = {
  row: Row<Activity>;
};

export default function PayeeButton({ row }: PayeeButtonProps) {
  return (
    <Button variant="outline" size="icon" title="Payments" asChild>
      <Link to={'/payees/?activityId=' + row.getValue<string>('id')}>Payees</Link>
    </Button>
  );
}
