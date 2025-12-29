import { SelectField } from '@/components/SelectField';
import type { PaymentHookForm } from '../../features/payments/payments';
import { useRoles } from './roles';

type RoleInputProps = {
  form: PaymentHookForm;
};

export default function RoleInput({ form }: RoleInputProps) {
  const { isPending, isError, error, data: roles = [] } = useRoles();

  return (
    <SelectField
      name="roleId"
      control={form.control}
      label="Role"
      placeholder="Select a role..."
      triggerClassName="w-[180px]"
      options={roles.map(role => ({
        value: role.id,
        label: role.name,
      }))}
      isLoading={isPending}
      isError={isError}
      error={error}
    />
  );
}
