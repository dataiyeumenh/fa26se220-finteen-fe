export default function ActionTiles({ tiles }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {tiles.map(t => (
        <div
          key={t.title}
          className={`bg-white rounded-2xl border-2 ${t.borderClass} p-5 hover:shadow-[0_8px_30px_rgba(196,181,253,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden`}
        >
          {/* Top color stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: t.stripeColor }}
            aria-hidden="true"
          />

          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
            style={{ backgroundColor: t.bgIcon }}
          >
            <span aria-hidden="true">{t.emoji}</span>
          </div>
          <div className="text-sm font-extrabold text-[#1a3a1a]">{t.title}</div>
          <div className="text-xs text-[#1a3a1a]/60 mt-1">{t.desc}</div>
        </div>
      ))}
    </div>
  )
}
