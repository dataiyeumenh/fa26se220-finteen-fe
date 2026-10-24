import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

/** Thông báo nổi đơn giản: notify(msg, ok). */
export function useToast() {
  const [items, setItems] = useState([])
  const notify = useCallback((text, ok = false) => {
    const id = Math.random()
    setItems((xs) => [...xs, { id, text, ok }])
    if (ok) setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4000)
  }, [])
  const view = (
    <div className="fixed right-4 bottom-4 z-[1100] flex max-h-[60vh] max-w-md flex-col gap-2 overflow-auto" aria-label="Thông báo Studio">
      {items.map((t) => (
        <div role={t.ok ? 'status' : 'alert'} key={t.id} className={cn('rounded-lg px-4 py-2 text-sm text-white shadow-lg', t.ok ? 'bg-green-700' : 'bg-red-600')}>
          {t.text}
          <button type="button" aria-label="Đóng thông báo" className="ml-3 underline" onClick={() => setItems(xs => xs.filter(x => x.id !== t.id))}>Đóng</button>
        </div>
      ))}
    </div>
  )
  return { notify, view }
}
