import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useWorkspace } from './useWorkspace'
import './role-theme.css'
export function Heading({ eyebrow = 'FINTEEN · ĐỒNG HÀNH MỖI NGÀY', title, description, children }) {
  return <div className="ws-heading"><div><small>{eyebrow}</small><h1>{title}</h1><p>{description}</p></div>{children}</div>
}
export function Empty({ children }) { return <div className="ws-empty">{children}</div> }
export function Notice({ text }) { return text ? <p className="ws-notice" role="status">{text}</p> : null }
export function Modal({ title, description, onClose, children }) {
  const { actor } = useWorkspace()
  return <Dialog open onOpenChange={open => { if (!open) onClose() }}><DialogContent className="ws-modal" data-ws-role={actor?.role || 'guest'}><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription>{children}</DialogContent></Dialog>
}
export function ActionForm({ onSubmit, children, submit = 'Lưu thay đổi' }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  return <form className="ws-form" onSubmit={async e => {
    e.preventDefault(); setError(''); setBusy(true)
    try { await onSubmit(new FormData(e.currentTarget)) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }}>{children}<Notice text={error}/><button className="ws-btn primary" disabled={busy}>{busy ? 'Đang xử lý…' : submit}</button></form>
}
