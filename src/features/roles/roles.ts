import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { APIResponse } from '../../lib/api';
import { roleSchema, type Role, type RoleFormValues } from '../../shared/schema';

const BASE_URL = '/api/roles';
const QUERY_KEY = 'roles';

export async function getRoles() {
  const res = await fetch(BASE_URL);
  const { message, data } = (await res.json()) as APIResponse<Role[]>;

  if (!res.ok) throw new Error(message);

  return data;
}

export function useRoles() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getRoles,
  });
}

export function useRoleForm(defaultValues: RoleFormValues) {
  return useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });
}

export type RoleHookForm = ReturnType<typeof useRoleForm>;

async function createRole(formData: RoleFormValues) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const { message } = (await res.json()) as APIResponse;

  if (!res.ok) throw new Error(message);

  return { message };
}

export function useCreateRole() {
  return useMutation({
    mutationFn: createRole,
  });
}
