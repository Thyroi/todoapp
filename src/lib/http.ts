import { ZodError } from "zod";
import { fail } from "@/src/lib/api/response";
import { AppError } from "@/src/lib/errors/app-error";

type ErrorWithCode = Error & { code?: string; meta?: unknown };

export async function readJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new AppError("INVALID_JSON", "The request body must be valid JSON.", 400);
  }
}

function toErrorWithCode(error: unknown): ErrorWithCode | null {
  if (error instanceof Error) {
    return error as ErrorWithCode;
  }

  return null;
}

export function createRouteHandler<Context>(
  handler: (request: Request, context: Context) => Promise<Response>,
) {
  return async (request: Request, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ZodError) {
        const flattened = error.flatten();
        const fieldErrors = Object.fromEntries(
          Object.entries(flattened.fieldErrors).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.filter(Boolean) : [],
          ]),
        );

        const firstFieldError = Object.values(fieldErrors)
          .flat()
          .find((message) => typeof message === "string" && message.length > 0);

        return fail(
          "VALIDATION_ERROR",
          firstFieldError ?? flattened.formErrors[0] ?? "The request data is invalid.",
          400,
          {
            formErrors: flattened.formErrors,
            fieldErrors,
          },
        );
      }

      if (error instanceof AppError) {
        return fail(error.code, error.message, error.status, error.details);
      }

      const prismaLikeError = toErrorWithCode(error);

      if (prismaLikeError?.code === "P2002") {
        return fail("CONFLICT", "The resource conflicts with existing data.", 409);
      }

      if (prismaLikeError?.code === "P2003") {
        return fail(
          "RELATION_CONFLICT",
          "The operation violates a relation constraint.",
          409,
        );
      }

      if (prismaLikeError?.code === "P2025") {
        return fail("NOT_FOUND", "The requested resource was not found.", 404);
      }

      console.error(error);
      return fail("INTERNAL_ERROR", "An unexpected error occurred.", 500);
    }
  };
}
