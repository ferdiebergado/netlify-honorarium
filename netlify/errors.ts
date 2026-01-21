class HTTPError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, msg: string, error = 'Unspecified error') {
    super(msg);
    this.statusCode = statusCode;
    this.error = error;

    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends HTTPError {
  constructor() {
    super(400, 'Invalid input');
  }
}

export class BadRequestError extends HTTPError {
  constructor(error: string) {
    super(400, 'Bad Request', error);
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(error: string) {
    super(401, 'Unauthorized', error);
  }
}

export class NotFoundError extends HTTPError {
  constructor() {
    super(404, 'Resource not found.');
  }
}

export class InternalServerError extends HTTPError {
  constructor() {
    super(500, 'Internal server error');
  }
}

export function errorResponse(error: unknown) {
  console.error(error);

  if (error instanceof ResourceNotFoundError) {
    return Response.json({ message: error.message }, { status: 404 });
  }

  if (error instanceof HTTPError) {
    return Response.json({ message: error.message }, { status: error.statusCode });
  }

  return Response.json({ message: 'An unknown error occurred.' }, { status: 500 });
}

export class ResourceNotFoundError extends Error {
  error: string;

  constructor(error = 'Unspecified error') {
    super('Resource not found.');
    this.error = error;

    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
