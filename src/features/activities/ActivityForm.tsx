import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { useFocals } from '@/features/focals/focal';
import { useVenues } from '@/features/venues/venue';
import { cn } from '@/lib/utils';
import { Check, ChevronDownIcon, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useActivityForm, useCreateActivity, type ActivityFormdata } from './activity';

type ActivityFormProps = {
  data: ActivityFormdata;
  setIsDialogOpen: (open: boolean) => void;
};

export default function ActivityForm({ data, setIsDialogOpen }: ActivityFormProps) {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [isVenueOpen, setIsVenueOpen] = useState(false);
  const [isFocalOpen, setIsFocalOpen] = useState(false);

  const {
    isPending: isPendingVenues,
    isError: isErrorVenues,
    error: errorVenues,
    isSuccess: isSuccessVenues,
    data: venues,
  } = useVenues();

  const {
    isPending: isPendingFocals,
    isError: isErrorFocals,
    error: errorFocals,
    isSuccess: isSuccessFocals,
    data: focals,
  } = useFocals();

  const form = useActivityForm(data);

  const {
    mutate,
    isError: isErrorCreate,
    error: errorCreate,
    isSuccess: isSuccessCreate,
    data: response,
  } = useCreateActivity();

  const handleSubmit = (data: ActivityFormdata) => {
    mutate(data);
  };

  if (isErrorCreate) toast.error(errorCreate.message);

  useEffect(() => {
    if (isSuccessCreate) {
      form.reset();
      setIsDialogOpen(false);
      toast.success(response.message);
    }
  }, [form, isSuccessCreate, response, setIsDialogOpen]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form id="activity-form" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {/*  TITLE */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="title"
                  placeholder="Workshop on the Development of Idols"
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/150 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF TITLE */}

        {/* VENUE */}
        <Controller
          name="venueId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="venue">Venue</FieldLabel>

              {isPendingVenues && (
                <div className="flex items-center gap-3">
                  <Spinner />
                  Loading venues...
                </div>
              )}

              {isErrorVenues && <FieldError errors={[{ message: errorVenues.message }]} />}

              {isSuccessVenues && (
                <Popover open={isVenueOpen} onOpenChange={setIsVenueOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isVenueOpen}
                      className="w-auto justify-between"
                    >
                      {field.value
                        ? venues.find(venue => venue.id === field.value)?.name
                        : 'Select venue...'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Command>
                      <CommandInput
                        id="venue"
                        placeholder="Search venue..."
                        className="h-9"
                        aria-invalid={fieldState.invalid}
                      />
                      <CommandList>
                        <CommandEmpty>No venues found.</CommandEmpty>
                        <CommandGroup>
                          {venues.map(venue => (
                            <CommandItem
                              key={venue.id}
                              value={venue.name}
                              onSelect={() => {
                                field.onChange(venue.id);
                                setIsVenueOpen(false);
                              }}
                            >
                              {venue.name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  field.value === venue.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF VENUE */}

        {/* START DATE */}
        <Controller
          name="startDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
              <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                    {field.value ? new Date(field.value).toLocaleDateString() : 'Select start date'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    id="start-date"
                    mode="single"
                    selected={new Date(field.value)}
                    captionLayout="dropdown"
                    onSelect={date => {
                      if (!date) return;

                      field.onChange(date.toISOString().slice(0, 10));
                      setIsStartDateOpen(false);
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF START DATE */}

        {/* END DATE */}
        <Controller
          name="endDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="end-date">End Date</FieldLabel>
              <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                    {field.value ? new Date(field.value).toLocaleDateString() : 'Select end date'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    id="end-date"
                    mode="single"
                    selected={new Date(field.value)}
                    captionLayout="dropdown"
                    onSelect={date => {
                      if (!date) return;
                      field.onChange(date.toISOString().slice(0, 10));
                      setIsEndDateOpen(false);
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF END DATE */}

        {/* CODE */}
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="code">Activity Code</FieldLabel>
              <Input
                {...field}
                id="code"
                aria-invalid={fieldState.invalid}
                placeholder="AC-25-BLD-TLD-BEC-000"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fund"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fund">Fund Source</FieldLabel>
              <Input
                {...field}
                id="fund"
                aria-invalid={fieldState.invalid}
                placeholder="2025 BEC Current"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF CODE */}

        {/* FOCAL ID */}
        <Controller
          name="focalId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="focal">Focal Person</FieldLabel>

              {isPendingFocals && (
                <div className="flex items-center gap-3">
                  <Spinner />
                  Loading focal persons...
                </div>
              )}

              {isErrorFocals && <FieldError errors={[{ message: errorFocals.message }]} />}

              {isSuccessFocals && (
                <Popover open={isFocalOpen} onOpenChange={setIsFocalOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isFocalOpen}
                      className="w-auto justify-between"
                    >
                      {field.value
                        ? focals.find(focal => focal.id === field.value)?.name
                        : 'Select focal person...'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Command>
                      <CommandInput
                        id="focal"
                        placeholder="Search focal..."
                        className="h-9"
                        aria-invalid={fieldState.invalid}
                      />
                      <CommandList>
                        <CommandEmpty>No focals found.</CommandEmpty>
                        <CommandGroup>
                          {focals.map(focal => (
                            <CommandItem
                              key={focal.id}
                              value={focal.name}
                              onSelect={() => {
                                field.onChange(focal.id);
                                setIsFocalOpen(false);
                              }}
                            >
                              {focal.name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  field.value === focal.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* END OF FOCAL ID */}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
            }}
          >
            Reset
          </Button>

          <Button type="submit" form="activity-form">
            Submit
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
