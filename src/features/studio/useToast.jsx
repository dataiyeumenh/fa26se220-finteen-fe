import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

/** Thông báo nổi đơn giản: notify(msg, ok). */
export function useToast() {
  const [items, setItems] = useState([])
  const notify = useCallback((text, ok = false) => {
    const id = Math.random()
    setItems((xs) => [...xs, { id, text, ok }])
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), ok ? 2500 : 7000)
  }, [])
  const view = (
    <div className="fixed right-4 bottom-4 z-50 flex max-w-md flex-col gap-2">
      {items.map((t) => (
        <div key={t.id} className={cn('rounded-lg px-4 py-2 text-sm text-white shadow-lg', t.ok ? 'bg-green-700' : 'bg-red-600')}>
          {t.text}
        </div>
      ))}
    </div>
  )
  return { notify, view }
}
