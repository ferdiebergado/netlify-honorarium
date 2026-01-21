import type { Config } from '@netlify/functions';
import { roleSchema } from '../../src/shared/schema';
import { errorResponse, ValidationError } from '../errors';
import { newRole } from '../role/service';
import { checkSession } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/roles',
};

export default async (req: Request) => {
  try {
    const userId = await checkSession(req);

    const body = await req.json();
    const { error, data } = roleSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newRole(data, userId);

    return Response.json({ message: 'Role created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};
