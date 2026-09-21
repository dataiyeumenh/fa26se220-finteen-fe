import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from './demoStore'
import { resolveSession } from './model'
export function useWorkspace() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { ...state, actor: resolveSession(state.db, state.session) }
}
