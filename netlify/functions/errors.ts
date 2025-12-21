class HTTPError extends Error {
  statusCode: number;

  constructor(statusCode: number, msg: string) {
    super(msg);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, HTTPError.prototype);
  }
}

export class ValidationError extends HTTPError {
  readonly name = 'ValidationError';

  constructor() {
    super(400, 'Invalid input');

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends HTTPError {
  readonly name = 'NotFoundError';

  constructor() {
    super(404, 'Resource not found.');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export function errorResponse(error: unknown) {
  console.error(error);

  if (error instanceof HTTPError)
    return Response.json({ message: error.message }, { status: error.statusCode });

  return Response.json({ message: 'An unknown error occurred.' }, { status: 500 });
}
