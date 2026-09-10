export default function ActionTiles({ tiles }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {tiles.map(t => (
        <div
          key={t.title}
          className={`bg-white rounded-2xl border-2 ${t.borderClass} p-5 hover:shadow-finteen-md hover:-translate-y-0.5 transition-all cursor-pointer`}
        >
          <div className="text-3xl mb-2">{t.emoji}</div>
          <div className="text-sm font-extrabold text-[#2d1b4e]">{t.title}</div>
          <div className="text-xs text-[#2d1b4e]/60 mt-1">{t.desc}</div>
        </div>
      ))}
    </div>
  )
}
