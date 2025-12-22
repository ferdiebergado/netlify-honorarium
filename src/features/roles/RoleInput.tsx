import { ComboboxField } from '@/components/ComboBox';
import type { PaymentHookForm } from '@/features/payments/payments';
import { useRoles } from './roles';

type RoleInputProps = {
  form: PaymentHookForm;
};

export default function RoleInput({ form }: RoleInputProps) {
  const { isPending, isError, error, isSuccess, data: roles } = useRoles();

  return (
    <ComboboxField
      form={form}
      name="roleId"
      label="Role"
      placeholder="Select role..."
      searchPlaceholder="Search role..."
      isPending={isPending}
      isError={isError}
      errorMessage={error?.message}
      options={
        isSuccess
          ? roles.map(role => ({
              id: role.id,
              label: role.name,
            }))
          : []
      }
    />
  );
}
