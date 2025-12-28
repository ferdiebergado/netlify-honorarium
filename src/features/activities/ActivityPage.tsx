import SkeletonCard from '@/components/SkeletonCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Tag, UserStar } from 'lucide-react';
import { useParams } from 'react-router';
import PayeesTable from '../payees/PayeesTable';
import CertificationButton from '../payments/CertificationButton';
import ComputationButton from '../payments/ComputationButton';
import CreatePaymentDialog from '../payments/CreatePaymentDialog';
import ORSButton from '../payments/ORSButton';
import PaymentsTable from '../payments/PaymentsTable';
import PayrollButton from '../payments/PayrollButton';
import { useFullActivity } from './activity';

export default function ActivityPage() {
  const { activityId } = useParams<{ activityId: string }>();

  if (!activityId) throw new Error('activityId param is required');

  const { isPending, isError, error, data: activity } = useFullActivity(activityId);

  if (isPending) return <SkeletonCard />;

  if (isError) return <p className="text-destructive m-3">Error: {error.message}</p>;

  const { title, venue, startDate, endDate, code, focal, payees, payments } = activity;

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {venue}
          </h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreatePaymentDialog />
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Activity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="my-2" />

            <div className="grid gap-4 py-4">
              {/* Date Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    Start Date
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span>{startDate}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    End Date
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span>{endDate}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Metadata Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>Activity Code</span>
                  </div>
                  <span className="bg-muted rounded px-2 py-0.5 font-mono font-medium">{code}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <UserStar className="h-4 w-4" />
                    <span>Focal Person</span>
                  </div>
                  <span className="text-foreground font-medium">{focal}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PAYEES */}
        <Card className="flex-1">
          <CardHeader className="text-xl font-bold">Payees</CardHeader>
          <CardContent>
            <PayeesTable payees={payees ?? []} />
          </CardContent>
        </Card>
      </div>
      {/* END PAYEES */}

      <Card>
        <CardHeader className="text-xl font-bold">Payments</CardHeader>
        <CardContent>
          <PaymentsTable payments={payments ?? []} />
        </CardContent>
      </Card>

      <div className="flex items-center space-x-1">
        <CertificationButton />
        <ComputationButton />
        <ORSButton />
        <PayrollButton />
      </div>
    </div>
  );
}
