import { useSyncExternalStore } from 'react'
import { getInternalSnapshot, subscribeInternal } from './store'
import { internalView, publicChapters, staffSession } from './model'
export function useInternal() {
  const { db, session } = useSyncExternalStore(subscribeInternal, getInternalSnapshot, getInternalSnapshot)
  const actor = staffSession(db, session)
  return { actor, db: internalView(db, actor) }
}
export function usePublishedChapters() {
  const { db } = useSyncExternalStore(subscribeInternal, getInternalSnapshot, getInternalSnapshot)
  return publicChapters(db)
}
