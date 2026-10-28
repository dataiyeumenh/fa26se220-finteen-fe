import { useSyncExternalStore } from "react";
import { auth } from "../../api/auth.api";

export function useWorkspace() {
  const account = useSyncExternalStore(
    auth.subscribe,
    auth.getSnapshot,
    auth.getSnapshot,
  );
  return {
    session: null,
    actor: account.actor,
    entitlements: account.entitlements,
    entitlementsLoading: account.entitlementsLoading,
    learnerDashboard: account.learnerDashboard,
    learnerDashboardLoading: account.learnerDashboardLoading,
    learnerDashboardError: account.learnerDashboardError,
    loading: account.loading,
    authError: account.error,
    dataMode: account.actor?.source === "api" ? "api" : "none",
  };
}
