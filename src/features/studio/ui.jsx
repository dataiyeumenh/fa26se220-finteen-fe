// Mảnh UI dùng chung của Studio demo. Cố ý đơn giản — team FE thay bằng design system sau.
import { cn } from '@/lib/utils'

const TONES = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-700',
  RELEASED: 'bg-violet-100 text-violet-800',
  IN_USE: 'bg-green-100 text-green-800',
  NEW: 'bg-blue-100 text-blue-800',
  OLD: 'bg-amber-100 text-amber-800',
  ORPHAN: 'bg-slate-100 text-slate-700',
  info: 'bg-blue-100 text-blue-800',
}

export function Tag({ tone = 'DRAFT', className, children }) {
  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-semibold', TONES[tone] || TONES.DRAFT, className)}>
      {children}
    </span>
  )
}

export function Btn({ tone = 'plain', className, ...props }) {
  const tones = {
    plain: 'border border-slate-300 bg-white text-slate-800 hover:border-blue-500',
    primary: 'border border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800',
    danger: 'border border-slate-300 bg-white text-red-600 hover:border-red-500',
  }
  return (
    <button
      type="button"
      className={cn('rounded-md px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40', tones[tone], className)}
      {...props}
    />
  )
}

export function Panel({ title, actions, className, children }) {
  return (
    <section className={cn('mb-4 rounded-xl border border-slate-200 bg-white p-4', className)}>
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-base font-semibold text-[#1f3864]">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </section>
  )
}
