import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useCallback, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import type { TinFormValues } from '../../shared/schema';
import { useCreateTin, useCreateTinForm } from './tins';

type CreateTinFormProps = {
  payeeId: number;
};

export default function CreateTinForm({ payeeId }: CreateTinFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formData: TinFormValues = useMemo(
    () => ({
      tin: '',
    }),
    []
  );

  const form = useCreateTinForm(formData);
  const { isPending, isError, error, mutateAsync: createTin } = useCreateTin();

  const handleSubmit = (formData: TinFormValues) => {
    createTin({ payeeId, formData });
    form.reset();
    setIsOpen(false);
  };

  const handleReset = useCallback(() => {
    form.reset();
  }, [form]);

  const handleCancel = useCallback(() => {
    form.reset();
    setIsOpen(false);
  }, [form, setIsOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            className="text-muted-foreground text-center"
            disabled={!payeeId}
            title="Click to add a new TIN."
          >
            <IconPlus />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add TIN</h1>
        <h2 className="text-muted-foreground">Add a new tin for the payee.</h2>

        {isError && <p className="text-destructive">{error.message}</p>}

        <form id="tin-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="tin"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Tax Identification Number (TIN)</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex w-full justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>

              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>

              <Button type="submit" form="tin-form">
                {isPending ? <Loader text="Saving..." /> : 'Submit'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </PopoverContent>
    </Popover>
  );
}
