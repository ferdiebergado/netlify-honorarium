import { ComboboxField } from '@/components/ComboBox';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useVenues } from '../../features/venues/venue';

type VenueInputProps = {
  form: ActivityHookForm;
};

export default function VenueInput({ form }: VenueInputProps) {
  const { isPending, isError, error, data: venues = [] } = useVenues();

  return (
    <ComboboxField
      form={form}
      name="venueId"
      label="Venue"
      placeholder="Select venue..."
      searchPlaceholder="Search venue..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={venues.map(venue => ({
        id: venue.id,
        label: venue.name,
      }))}
    />
  );
}
