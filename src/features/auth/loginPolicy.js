import { accountDestination, hasInternalAccess } from '../internal/access.js'

export const wrongLoginMessage = internal => internal
  ? 'Trang này chỉ dành cho tài khoản nội bộ. Vui lòng đăng nhập tài khoản người dùng tại /login.'
  : 'Tài khoản nội bộ phải đăng nhập tại /internal/login.'

export function completeLogin(client, internal) {
  const { actor, error } = client.getSnapshot()
  if (!actor) {
    client.logout()
    throw new Error(error || 'Không thể kiểm tra thông tin tài khoản. Vui lòng đăng nhập lại.')
  }
  if (hasInternalAccess(actor) !== internal) {
    client.logout()
    throw new Error(wrongLoginMessage(internal))
  }
  return accountDestination(actor)
}
