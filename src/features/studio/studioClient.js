import { auth } from '../../api/auth.api'

export const hasRole = (...roles) => roles.some(role => auth.getSnapshot().actor?.roles?.includes(role))
export const currentAccountId = () => auth.getSnapshot().actor?.id || null

export const studioApi = {
  get: path => auth.studioRequest(path),
  post: (path, body) => auth.studioRequest(path, { method: 'POST', body }),
  put: (path, body) => auth.studioRequest(path, { method: 'PUT', body }),
  del: path => auth.studioRequest(path, { method: 'DELETE' }),
  upload: (path, form) => auth.studioRequest(path, { method: 'POST', body: form }),
}

export const STATUS_LABEL = { DRAFT: 'Nháp', SUBMITTED: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Trả về', RELEASED: 'Đã phát hành' }
export const fmtTime = value => value ? new Date(value).toLocaleString('vi-VN') : '—'
export const formatError = error => `${error.message}${error.status ? ` (HTTP ${error.status}, code ${error.code ?? '—'})` : ''}`
