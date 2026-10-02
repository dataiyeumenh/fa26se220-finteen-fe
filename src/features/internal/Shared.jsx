import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { STATUS_LABELS } from './model'
export function Status({ status }) { return <span className={`studio-status studio-status-${status}`}>{STATUS_LABELS[status]}</span> }
export function StudioModal({ title, description, children, close }) {
  return <Dialog open onOpenChange={open => { if (!open) close() }}><DialogContent className="ws-modal studio-modal"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription>{children}</DialogContent></Dialog>
}
