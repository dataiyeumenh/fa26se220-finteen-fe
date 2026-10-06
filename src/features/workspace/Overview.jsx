import { Link } from 'react-router-dom'
import { useWorkspace } from './useWorkspace'
import { PLANS } from './model'
import { Heading, Empty } from './ui'
import AccountSettings from '../auth/AccountSettings'

export function Overview() {
  const { actor } = useWorkspace()
  return <><Heading title={`Chào ${actor.name}!`} description="Bạn đã đăng nhập bằng tài khoản FinTeen."/>
    <section className="ws-card"><h2>Tài khoản đã kết nối</h2>
      <p>Gói hiện có: {actor.plans.map(p => PLANS[p].name).join(' + ') || 'Chưa có gói'}.</p>
      <p>Dữ liệu học sinh, báo cáo và thanh toán chưa kết nối API.</p>
      <Link className="ws-btn primary" to="/dashboard/settings">Quản lý tài khoản</Link>
      {actor.role === 'guest' && <Link className="ws-btn" to="/dashboard/demo">Chơi thử</Link>}
    </section></>
}
export function Plans() {
  const { actor } = useWorkspace()
  return <><Heading title="Gói học tập" description="Quyền hiện tại được đọc từ máy chủ."/>
    <section className="ws-card"><p>Gói đang có: {actor.plans.map(p => PLANS[p].name).join(' + ') || 'Chưa có gói'}.</p>
      <p>Chức năng mua gói chưa kết nối. Không kích hoạt gói mô phỏng.</p>
    </section></>
}
export function Settings() {
  const { actor } = useWorkspace()
  return <AccountSettings actor={actor}/>
}
export function LearnerHome() {
  return <Empty>Không gian học sinh đang chờ kết nối API SLOT.</Empty>
}
