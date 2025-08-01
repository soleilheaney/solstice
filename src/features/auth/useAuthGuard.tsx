import { useNavigate } from "@tanstack/react-router";
import type { User } from "better-auth";
import React, { useEffect } from "react";

interface UseAuthGuardOptions {
  /**
   * The user object from the auth context/loader
   */
  user: User | null;

  /**
   * Whether authentication is required for this route
   * @default true
   */
  requireAuth?: boolean;

  /**
   * Whether to redirect authenticated users away (for login/signup pages)
   * @default false
   */
  redirectAuthenticated?: boolean;

  /**
   * URL to redirect to when authentication is required but user is not authenticated
   * @default "/login"
   */
  redirectTo?: string;

  /**
   * URL to redirect authenticated users to when redirectAuthenticated is true
   * @default "/dashboard"
   */
  authenticatedRedirectTo?: string;

  /**
   * Optional callback to execute after successful authentication check
   */
  onAuthSuccess?: (user: User) => void;

  /**
   * Optional callback to execute when authentication fails
   */
  onAuthFail?: () => void;
}

/**
 * @deprecated Use route-based guards instead. This hook uses useEffect for navigation
 * which is an anti-pattern. Use `requireAuth` or `redirectIfAuthenticated` in your
 * route's beforeLoad function instead.
 *
 * @see ~/lib/auth/guards/route-guards.ts
 *
 * Hook to handle authentication guards for routes
 *
 * @example
 * // DEPRECATED - Don't use this:
 * useAuthGuard({ user, requireAuth: true });
 *
 * // Instead, use in your route:
 * beforeLoad: async ({ context, location }) => {
 *   requireAuth({ user: context.user, location });
 * }
 */
export function useAuthGuard({
  user,
  requireAuth = true,
  redirectAuthenticated = false,
  redirectTo = "/login",
  authenticatedRedirectTo = "/dashboard",
  onAuthSuccess,
  onAuthFail,
}: UseAuthGuardOptions) {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle redirect for authenticated users (e.g., on login/signup pages)
    if (redirectAuthenticated && user) {
      navigate({ to: authenticatedRedirectTo, replace: true });
      return;
    }

    // Handle authentication requirement
    if (requireAuth && !user) {
      onAuthFail?.();
      navigate({
        to: redirectTo,
        replace: true,
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          redirect: window.location.pathname,
        }),
      });
      return;
    }

    // Authentication successful
    if (requireAuth && user) {
      onAuthSuccess?.(user);
    }
  }, [
    user,
    requireAuth,
    redirectAuthenticated,
    redirectTo,
    authenticatedRedirectTo,
    navigate,
    onAuthSuccess,
    onAuthFail,
  ]);

  return {
    isAuthenticated: !!user,
    isLoading: false, // Can be extended if using async auth state
    user,
  };
}

/**
 * Higher-order component to wrap components with auth guard
 *
 * @example
 * export default withAuthGuard(DashboardComponent, { requireAuth: true });
 */
export function withAuthGuard<P extends { user: User | null }>(
  Component: React.ComponentType<P>,
  options: Omit<UseAuthGuardOptions, "user">,
) {
  return function AuthGuardedComponent(props: P) {
    useAuthGuard({ ...options, user: props.user });
    return <Component {...props} />;
  };
}
