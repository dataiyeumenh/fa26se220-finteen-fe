import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ total, page, size, sizes, onPage, onSize, noun }) {
  const pages = Math.max(1, Math.ceil(total / size))
  const start = Math.max(0, Math.min(page - 2, pages - 5))
  return <nav className="studio-pagination" aria-label={`Phân trang ${noun}`}>
    <div className="studio-pagination-info"><strong>{total ? page * size + 1 : 0}–{Math.min((page + 1) * size, total)}</strong><span>/ {total} {noun}</span><label>Mỗi trang<select value={size} onChange={event => onSize(Number(event.target.value))}>{sizes.map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>
    <div className="studio-pagination-pages"><button type="button" aria-label="Trang trước" disabled={page === 0} onClick={() => onPage(page - 1)}><ChevronLeft size={16} /></button>{Array.from({ length: Math.min(5, pages) }, (_, index) => start + index).map(index => <button type="button" key={index} aria-label={`Trang ${index + 1}`} aria-current={index === page ? 'page' : undefined} onClick={() => onPage(index)}>{index + 1}</button>)}<span className="studio-pagination-total">/ {pages}</span><button type="button" aria-label="Trang sau" disabled={page >= pages - 1} onClick={() => onPage(page + 1)}><ChevronRight size={16} /></button></div>
  </nav>
}
