import { emptyDatabase } from './model.js'

// Empty/unavailable, not a mock backend. Do not create sample data or sessions.
const snapshot = { db: emptyDatabase(), session: null }
export const getSnapshot = () => snapshot
export const subscribe = () => () => {}
export function dispatch() {
  throw new Error('Chức năng này chưa kết nối API. Không lưu dữ liệu mô phỏng.')
}
export const saveLearner = dispatch
