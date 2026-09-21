import { Link } from 'react-router-dom'

export function PublicBrand() {
  return <Link to="/" className="ft-brand" aria-label="FinTeen — Trang chủ">
    <span className="ft-brand-mark" aria-hidden="true">F</span>
    <span><span className="ft-brand-dot">Fin</span>Teen</span>
  </Link>
}
