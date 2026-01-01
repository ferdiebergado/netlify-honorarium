import { ComboboxField } from '@/components/ComboBox';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useVenues } from '../../features/venues/venue';
import CreateVenuePopover from './CreateVenuePopover';

type VenueInputProps = {
  form: ActivityHookForm;
};

export default function VenueInput({ form }: VenueInputProps) {
  const { isPending, isError, error, data: venues = [] } = useVenues();

  const options = venues.map(venue => ({
    id: venue.id,
    label: venue.name,
  }));

  return (
    <ComboboxField
      control={form.control}
      name="venueId"
      label="Venue"
      placeholder="Select venue..."
      options={options}
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
    >
      <CreateVenuePopover />
    </ComboboxField>
  );
}
