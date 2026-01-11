import BackButton from '@/components/BackButton';
import SkeletonCard from '@/components/SkeletonCard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { checkId, formatMoney } from '@/lib/utils';
import {
  IconBriefcase,
  IconBuildingBank,
  IconCalendar,
  IconMapPin,
  IconTag,
  IconUserStar,
} from '@tabler/icons-react';
import { useParams } from 'react-router';
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

  checkId(activityId);

  const { isPending, isError, error, data: activity } = useFullActivity(activityId);

  if (isPending)
    return (
      <>
        <Card className="mt-36 flex h-80 w-4/10 flex-col gap-x-4 gap-y-8">
          <div className="mx-8 flex flex-col gap-6">
            <Skeleton className="h-9 w-1/4" />
            <Skeleton className="h-28 w-9/10" />
            <Skeleton className="h-9 w-3/7" />
          </div>
        </Card>
        <SkeletonCard />;
      </>
    );

  if (isError) return <p className="text-destructive m-3">Error: {error.message}</p>;
  const { title, venue, code, focal, payments, position, fundCluster, dateRange } = activity;

  const totalPayments = payments?.reduce((sum, { honorarium }) => sum + honorarium, 0) ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-6 flex">
        <div className="flex flex-col px-3">
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className="text-muted-foreground flex items-center gap-1">
            <IconMapPin className="h-4 w-4" /> {venue}
          </h2>
          <h2 className="text-muted-foreground flex items-center gap-1">
            <IconCalendar className="h-4 w-4" /> {dateRange}
          </h2>
        </div>
        <div className="flex flex-1 items-end justify-end px-3">
          <CreatePaymentDialog activity={{ id: parseInt(activityId), title }} />
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <Card className="w-full lg:w-4/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Activity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="my-2" />

            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <IconTag className="h-4 w-4" />
                    <span>Activity Code</span>
                  </div>
                  <span className="bg-muted rounded px-2 py-0.5 font-mono font-medium">{code}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <IconBuildingBank className="h-4 w-4" />
                    <span>Fund Cluster</span>
                  </div>
                  <span className="bg-muted rounded px-2 py-0.5 font-mono font-medium">
                    {fundCluster}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <IconUserStar className="h-4 w-4" />
                    <span>Focal Person</span>
                  </div>
                  <span className="text-foreground font-medium">{focal}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <IconBriefcase className="h-4 w-4" />
                    <span>Focal Position</span>
                  </div>
                  <span className="text-foreground text-right">{position}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="text-xl font-semibold">Payments</CardHeader>
        <CardContent>
          <PaymentsTable payments={payments ?? []} />
        </CardContent>

        {totalPayments > 0 && (
          <CardFooter>
            <h3 className="text-base font-medium">Total: {formatMoney(totalPayments)}</h3>
          </CardFooter>
        )}
      </Card>

      <div className="flex items-center justify-between">
        {payments && payments.length > 0 && (
          <div className="flex items-center space-x-1">
            <CertificationButton activityId={activityId} />
            <ComputationButton activityId={activityId} />
            <ORSButton activityId={activityId} />
            <PayrollButton activityId={activityId} />
          </div>
        )}
        <BackButton path="/activities" />
      </div>
    </div>
  );
}
