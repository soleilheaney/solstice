import { useQueryClient } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useMemo, useState } from "react";
import { SafeLink as Link } from "~/components/ui/SafeLink";
import { ADMIN_PRIMARY_NAV, ADMIN_SECONDARY_NAV } from "~/features/layouts/admin-nav";
import { userHasRole } from "~/features/roles/permission.service";
import { auth } from "~/lib/auth-client";

export function AdminSidebar() {
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const context = useRouteContext({ strict: false });
  const user = context?.user || null;

  // Filter sidebar items based on user roles
  const sidebarItems = useMemo(
    () =>
      ADMIN_PRIMARY_NAV.filter((item) => {
        if (!item.roles || item.roles.length === 0) {
          return true;
        }
        if (!user) {
          return false;
        }
        return item.roles.some((roleName) => userHasRole(user, roleName));
      }),
    [user],
  );

  const secondaryItems = ADMIN_SECONDARY_NAV;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const result = await auth.signOut();
      if (result?.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear all cached state first
      queryClient.clear();

      // Await router invalidation to ensure completion
      await router.invalidate();

      // Use window.location.href for a complete page refresh
      // This ensures clean state and is more reliable for logout
      window.location.href = "/auth/login";
    }
  };

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="p-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <h1 className="text-admin-text-primary text-xl font-bold">Quadball Canada</h1>
          <p className="text-admin-text-secondary text-sm">Dashboard</p>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="nav-item"
              {...(item.exact ? { activeOptions: { exact: true as const } } : {})}
              activeProps={{
                className: "nav-item-active",
                "aria-current": "page",
                "data-status": "active",
              }}
            >
              <Icon className="pointer-events-none h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-gray-200 px-4 py-4">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="nav-item"
              {...(item.exact ? { activeOptions: { exact: true as const } } : {})}
              activeProps={{
                className: "nav-item-active",
                "aria-current": "page",
                "data-status": "active",
              }}
            >
              <Icon className="pointer-events-none h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="nav-item w-full text-left hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
