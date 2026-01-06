import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useCallback, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import type { SalaryFormValues } from '../../shared/schema';
import { useCreateSalary, useCreateSalaryForm } from './salaries';

type CreateSalaryPopover = {
  payeeId: number;
};

export default function CreateSalaryForm({ payeeId }: CreateSalaryPopover) {
  const [isOpen, setIsOpen] = useState(false);

  const formValues: SalaryFormValues = useMemo(
    () => ({
      salary: 0,
    }),
    []
  );

  const form = useCreateSalaryForm(formValues);
  const { isPending, isError, error, mutateAsync: createSalary } = useCreateSalary();

  const handleSubmit = (formValues: SalaryFormValues) => {
    createSalary({ payeeId, formData: formValues });
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
            title="Click to add a salary."
          >
            <IconPlus />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add Basic Salary</h1>
        <h2 className="text-muted-foreground">Add a new basic salary for the payee.</h2>

        {isError && <p className="text-destructive">{error.message}</p>}

        <form id="salary-form" onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="salary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="salary">Basic Salary</FieldLabel>
                  <Input
                    {...field}
                    id="salary"
                    aria-invalid={fieldState.invalid}
                    placeholder="98000"
                    autoComplete="off"
                    type="number"
                    onChange={e => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange(0);
                      } else {
                        field.onChange(Number(value));
                      }
                    }}
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

              <Button type="submit" form="salary-form">
                {isPending ? <Loader text="Saving..." /> : 'Submit'}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </PopoverContent>
    </Popover>
  );
}
