import type { Config } from '@netlify/functions';
import { venueSchema } from '../../src/shared/schema';
import { newVenue } from '../activity';
import { errorResponse, ValidationError } from '../errors';
import { checkSession } from '../session';

export const config: Config = {
  method: 'POST',
  path: '/api/venues',
};

export default async (req: Request) => {
  try {
    const userId = await checkSession(req);

    const body = await req.json();
    const { error, data } = venueSchema.safeParse(body);

    if (error) throw new ValidationError();

    await newVenue(data, userId);

    return Response.json({ message: 'Venue created.' }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
};
