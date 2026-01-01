import { SelectField } from '@/components/SelectField';
import { useMemo } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import CreateRolePopover from './CreateRolePopover';
import { useRoles } from './roles';

type WithRoleId = {
  roleId: number;
};

type RoleInputProps<T extends FieldValues & WithRoleId> = {
  control: Control<T>;
};

export default function RoleInput<T extends FieldValues & WithRoleId>({
  control,
}: RoleInputProps<T>) {
  const { isPending, isError, error, data: roles = [] } = useRoles();

  const options = useMemo(
    () =>
      roles.map(role => ({
        value: role.id,
        label: role.name,
      })),
    [roles]
  );

  return (
    <SelectField
      name={'roleId' as Path<T>}
      control={control}
      label="Role"
      placeholder="Select a role..."
      triggerClassName="w-full"
      options={options}
      isLoading={isPending}
      isError={isError}
      error={error}
    >
      <CreateRolePopover />
    </SelectField>
  );
}
