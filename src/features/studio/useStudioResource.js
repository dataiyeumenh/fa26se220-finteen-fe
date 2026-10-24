import { useCallback, useEffect, useRef, useState } from 'react'
import { formatError } from './studioClient'

// Ignore responses from a previous filter or an unmounted screen.
export function useStudioResource(loader) {
  const [value, setValue] = useState({ data: null, loading: true, error: '' })
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    // A new filter/reload starts a new external request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(previous => ({ ...previous, loading: true, error: '' }))
    Promise.resolve().then(loader).then(data => {
      if (active) setValue({ data, loading: false, error: '' })
    }, error => {
      if (active) setValue({ data: null, loading: false, error: formatError(error) })
    })
    return () => { active = false }
  }, [loader, revision])
  const reload = useCallback(() => setRevision(value => value + 1), [])
  return { ...value, reload }
}

export function useStudioAction(notify) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const running = useRef(false)
  const run = async (action, success, after) => {
    if (running.current) return false
    running.current = true
    setBusy(true)
    setError('')
    try {
      const result = await action()
      notify(typeof success === 'function' ? success(result) : success, true)
      after?.(result)
      return true
    } catch (error) {
      setError(error.message)
      notify(formatError(error))
      return false
    } finally {
      running.current = false
      setBusy(false)
    }
  }
  return { busy, run, error, clearError: () => setError('') }
}
