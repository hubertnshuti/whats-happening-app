import type { ApiError as FieldError } from "@/types/api";

/**
 * Custom error class thrown by the api client when the backend returns
 * { success: false, ... } or when the request fails.
 *
 * Components can catch this and inspect:
 *   - error.message  → human-readable message
 *   - error.status   → HTTP status code (0 = network)
 *   - error.errors   → field-level validation errors
 */
export class ApiException extends Error {
  status: number;
  errors: FieldError[];

  constructor(message: string, status: number, errors: FieldError[] = []) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.errors = errors;
  }

  /** Returns the first field-level error message, or the main message. */
  get firstError(): string {
    return this.errors[0]?.message ?? this.message;
  }

  /** Returns a map of field → message for form validation display. */
  get fieldErrors(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const e of this.errors) {
      if (e.field) map[e.field] = e.message;
    }
    return map;
  }
}