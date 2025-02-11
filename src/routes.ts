/**
 * An array of public routes that are accessible without authentication.
 * @type {Array<string>}
 */
export const publicRoutes: Array<string> = [
  "/sign-in",
  "/sign-up",
  "/verify-email",
  "/forgot-password",
];

/**
 * An array of protected routes that used for authentication.
 * These routes will redirect users to /dashboard
 * @type {Array<string>}
 */
export const authRoutes: Array<string> = ["/sign-in", "/sign-up"];

/**
 * The prefix for API authentication routes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect URL for users after successful login.
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
