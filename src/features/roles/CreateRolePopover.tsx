import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { RoleFormValues } from '../../shared/schema';
import RoleForm from './RoleForm';
import { useCreateRole, useRoleForm } from './roles';

export default function CreateRolePopover() {
  const [isOpen, setIsOpen] = useState(false);

  const formData: RoleFormValues = {
    name: '',
  };

  const form = useRoleForm(formData);
  const { isError, isSuccess, mutateAsync: createRole } = useCreateRole();

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
            title="Click to add a new role."
          >
            <IconPlus />
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent>
        <h1 className="text-lg font-semibold">Add Role</h1>
        <h2 className="text-muted-foreground">Add a new role.</h2>
        <RoleForm
          form={form}
          values={formData}
          onSubmit={createRole}
          loadingMsg="Creating role..."
          setIsPopoverOpen={setIsOpen}
          isSuccess={isSuccess}
          isError={isError}
        />
      </PopoverContent>
    </Popover>
  );
}
