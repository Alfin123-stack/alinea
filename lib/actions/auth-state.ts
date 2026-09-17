export interface AuthFormState {
  /** Field-level validation errors, keyed by input name. */
  errors: Record<string, string[]>;
  /** Non-field error (e.g. wrong credentials, server error). */
  formError?: string;
  /** Echoes back non-sensitive input so the form doesn't clear on error. */
  values?: Record<string, string>;
}

export const initialAuthState: AuthFormState = { errors: {} };
