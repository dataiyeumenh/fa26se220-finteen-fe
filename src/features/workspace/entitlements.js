const KIND_BY_PLAN = { parent: 'PARENT', teacher: 'TEACHER' }
export const PLAN_NAME = { PARENT: 'Gói Gia đình', TEACHER: 'Gói Giáo viên' }
export const PLAN_LIMIT = { PARENT: '4 slot', TEACHER: '40 slot' }

const localDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const nextDate = value => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + 1))
  return date.toISOString().slice(0, 10)
}

export function currentEntitlements(actor, entitlements) {
  if (!actor || !Array.isArray(entitlements)) return []
  return actor.plans.map(plan => {
    const kind = KIND_BY_PLAN[plan]
    const records = entitlements.filter(item => item.kind === kind).sort((a, b) => a.startsOn.localeCompare(b.startsOn))
    const today = localDate()
    const activeIndex = records.findIndex(item => item.startsOn <= today && today <= item.expiresOn)
    if (activeIndex < 0) return records.at(-1) || null
    const active = records[activeIndex]
    let chainEnd = active.expiresOn
    let renewalCount = 0
    for (const item of records.slice(activeIndex + 1)) {
      if (item.startsOn > nextDate(chainEnd)) break
      if (item.expiresOn > chainEnd) chainEnd = item.expiresOn
      renewalCount += 1
    }
    return { ...active, currentExpiresOn: active.expiresOn, expiresOn: chainEnd, renewalCount }
  }).filter(Boolean)
}

export function entitlementForRole(role, entitlements) {
  const kind = KIND_BY_PLAN[role]
  return Array.isArray(entitlements) ? entitlements.find(item => item.kind === kind) || null : null
}

export function formatPlanDate(value) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}

export function daysUntilExpiry(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  const [todayYear, todayMonth, todayDay] = localDate().split('-').map(Number)
  if (![year, month, day, todayYear, todayMonth, todayDay].every(Number.isFinite)) return null
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(todayYear, todayMonth - 1, todayDay)) / 86400000)
}
