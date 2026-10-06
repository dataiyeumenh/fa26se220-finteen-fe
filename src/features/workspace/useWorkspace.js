import { useSyncExternalStore } from 'react'
import { emptyDatabase } from './model'
import { auth } from '../../api/auth.api'

const db = emptyDatabase()
export function useWorkspace() {
  const account = useSyncExternalStore(auth.subscribe, auth.getSnapshot, auth.getSnapshot)
  return { db, session: null, actor: account.actor, loading: account.loading, authError: account.error }
}
