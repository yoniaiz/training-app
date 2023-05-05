import type z from "zod";

export function zodErrorTypeGuard(error: unknown): error is z.ZodError {
  return (error as z.ZodError).errors !== undefined;
}
