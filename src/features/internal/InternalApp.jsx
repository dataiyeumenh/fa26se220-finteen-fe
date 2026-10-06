import { Navigate, Route, Routes } from 'react-router-dom'
import InternalLogin from './InternalLogin'
import InternalLayout, { RequireStaff } from './InternalLayout'
import { Chapters, ChapterDetail, ChapterDemo } from './Chapters'
import { InternalOverview, StaffDirectory, Publications, AuditLog, AccountMonitor } from './Operations'

export default function InternalApp() {
  return <Routes><Route path="login" element={<InternalLogin/>}/><Route element={<RequireStaff/>}><Route element={<InternalLayout/>}><Route index element={<InternalOverview/>}/><Route path="chapters" element={<Chapters/>}/><Route path="chapters/:id" element={<ChapterDetail/>}/><Route path="chapters/:id/demo" element={<ChapterDemo/>}/><Route path="audit" element={<AuditLog/>}/><Route element={<RequireStaff roles={['manager', 'admin']}/>}><Route path="staff" element={<StaffDirectory/>}/><Route path="publications" element={<Publications/>}/></Route><Route element={<RequireStaff roles={['admin']}/>}><Route path="accounts" element={<AccountMonitor/>}/></Route></Route></Route><Route path="*" element={<Navigate to="/internal" replace/>}/></Routes>
}
