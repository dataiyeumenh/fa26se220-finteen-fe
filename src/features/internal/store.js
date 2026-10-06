import { emptyInternal } from './model.js'

// Backend contract does not support the editorial workflow yet.
// Never seed users, authenticate locally, or read legacy browser databases.
const snapshot = { db: emptyInternal(), session: null }
export const subscribeInternal = () => () => {}
export const getInternalSnapshot = () => snapshot
export const logoutInternal = () => {}
export function dispatchInternal() {
  throw new Error('Chức năng nội bộ chưa có API. Không lưu dữ liệu mô phỏng.')
}
export const createStaff = dispatchInternal
