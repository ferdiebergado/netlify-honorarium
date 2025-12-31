import { SingleCombobox } from '@/components/SingleComboBox';
import type { ActivityHookForm } from '../../features/activities/activity';
import { useVenues } from '../../features/venues/venue';

type VenueInputProps = {
  form: ActivityHookForm;
};

export default function VenueInput({ form }: VenueInputProps) {
  const { data: venues = [] } = useVenues();

  const options = venues.map(venue => ({
    value: venue.id,
    label: venue.name,
  }));

  return (
    <SingleCombobox
      control={form.control}
      name="venueId"
      label="Venue"
      placeholder="Select venue..."
      options={options}
    />
  );
}
