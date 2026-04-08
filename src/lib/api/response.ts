export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json({ success: true, data } satisfies ApiSuccess<T>, init);
}

export function fail(code: string, message: string, status = 400, details?: unknown) {
  return Response.json(
    {
      success: false,
      error: { code, message, details },
    } satisfies ApiFailure,
    { status },
  );
}
