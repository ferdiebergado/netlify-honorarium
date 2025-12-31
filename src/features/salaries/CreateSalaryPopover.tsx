import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { SalaryFormValues } from '../../shared/schema';
import { useCreateSalary, useCreateSalaryForm } from './salaries';
import SalaryForm from './SalaryForm';

type CreateSalaryPopover = {
  payeeId: number;
};

export default function CreateSalaryPopover({ payeeId }: CreateSalaryPopover) {
  const [isOpen, setIsOpen] = useState(false);

  const formData: SalaryFormValues = {
    payeeId,
    salary: 0,
  };

  const form = useCreateSalaryForm(formData);
  const { isError, isSuccess, mutateAsync: createSalary } = useCreateSalary();

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            onClick={handleClick}
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
        <SalaryForm
          form={form}
          values={formData}
          onSubmit={createSalary}
          loadingMsg="Creating salary..."
          setIsPopoverOpen={setIsOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </PopoverContent>
    </Popover>
  );
}
