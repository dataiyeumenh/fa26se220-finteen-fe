import { useSyncExternalStore } from 'react'
import { auth } from '../../api/auth.api'
import { workspaceMockData } from './mockData'

export function useWorkspace() {
  const account = useSyncExternalStore(auth.subscribe, auth.getSnapshot, auth.getSnapshot)
  const db = workspaceMockData(account.actor)
  return { db, session: null, actor: account.actor, entitlements: account.entitlements, entitlementsLoading: account.entitlementsLoading, learnerDashboard: account.learnerDashboard, learnerDashboardLoading: account.learnerDashboardLoading, learnerDashboardError: account.learnerDashboardError, loading: account.loading, authError: account.error, dataMode: account.actor?.source === 'api' ? 'api-with-mock-features' : 'mock' }
}
