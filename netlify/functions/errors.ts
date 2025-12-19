export class ValidationError extends Error {
  readonly name = 'ValidationError';
  statusCode = 400;

  constructor() {
    super('Invalid input');

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export function handleError(error: unknown) {
  console.error(error);

  if (error instanceof ValidationError)
    return Response.json({ message: error.message }, { status: error.statusCode });

  return Response.json({ message: 'An unknown error occurred.' }, { status: 500 });
}
