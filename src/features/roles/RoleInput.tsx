import { SelectField } from '@/components/SelectField';
import type { PaymentHookForm } from '../../features/payments/payments';
import CreateRolePopover from './CreateRolePopover';
import { useRoles } from './roles';

type RoleInputProps = {
  form: PaymentHookForm;
};

export default function RoleInput({ form }: RoleInputProps) {
  const { isPending, isError, error, data: roles = [] } = useRoles();

  const options = roles.map(role => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <SelectField
      name="roleId"
      control={form.control}
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
