export type HttpError = Error & { status?: number };

export const createError =
  (name: string, status: number) =>
  (message: string = name): HttpError => {
    const err = new Error(message) as HttpError;
    err.name = name;
    err.status = status;
    return err;
  };

// common errors
export const NotFoundError = createError('NotFoundError', 404);
export const ValidationError = createError('ValidationError', 400);
