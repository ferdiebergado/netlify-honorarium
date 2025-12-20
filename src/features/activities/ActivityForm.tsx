import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import FocalInput from '@/features/focals/FocalInput';
import VenueInput from '@/features/venues/VenueInput';
import { ChevronDownIcon } from 'lucide-react';
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

  const form = useActivityForm(data);

  const { mutate, isError, error, isSuccess, data: response } = useCreateActivity();

  const handleSubmit = (data: ActivityFormdata) => {
    mutate(data);
  };

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      setIsDialogOpen(false);
      toast.success(response.message);
    }
  }, [form, isSuccess, response, setIsDialogOpen]);

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
        <VenueInput form={form} />
        {/* END OF VENUE */}

        <Field orientation="horizontal">
          {/* START DATE */}
          <Controller
            name="startDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
                <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {field.value
                        ? new Date(field.value).toLocaleDateString()
                        : 'Select start date'}
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

                        field.onChange(date.toLocaleDateString());
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
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
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
                        field.onChange(date.toLocaleDateString());
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
        </Field>

        <Field orientation="horizontal">
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
        </Field>

        {/* FOCAL ID */}
        <FocalInput form={form} />
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
