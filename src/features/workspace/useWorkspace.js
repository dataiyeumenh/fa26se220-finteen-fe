import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from './demoStore'
import { resolveSession, workspaceDatabase } from './model'
export function useWorkspace() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const actor = resolveSession(state.db, state.session)
  return { ...state, db: workspaceDatabase(state.db, actor), actor }
}
