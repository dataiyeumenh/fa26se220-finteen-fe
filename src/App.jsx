import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from '@/pages/Homepage'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import { AuthLayout } from '@/pages/auth/AuthLayout'
import UserDashboard from '@/pages/User/Dashboard/UserDashboard'
import UserLessons from '@/pages/User/Dashboard/UserLessons'
import ParentDashboard from '@/pages/Parent/Dashboard/ParentDashboard'
import TeacherDashboard from '@/pages/Teacher/Dashboard/TeacherDashboard'
import AdminDashboard from '@/pages/Admin/Dashboard/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/user/lessons" element={<UserLessons />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
