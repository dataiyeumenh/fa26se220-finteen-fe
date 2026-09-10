import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/dashboard/StatCard'

export default function ClassesGrid({ classes }) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Lớp của tôi"
        subtitle="Quản lý học sinh và bài giảng"
        emoji="🏫"
        action={
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-[#2d1b4e] text-[#2d1b4e] hover:bg-[#2d1b4e] hover:text-white"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Tạo lớp
          </Button>
        }
      />
      <div className="grid md:grid-cols-3 gap-4">
        {classes.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border-2 border-[#2d1b4e]/8 p-5 hover:-translate-y-0.5 hover:shadow-finteen-md transition-all cursor-pointer"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl mb-3`}
            >
              {c.emoji}
            </div>
            <div className="text-base font-extrabold text-[#2d1b4e] mb-3">{c.name}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#fff8f0] rounded-xl p-3">
                <div className="text-[10px] text-[#2d1b4e]/60 font-bold uppercase">Học sinh</div>
                <div className="text-lg font-black text-[#2d1b4e] mt-0.5">{c.students}</div>
              </div>
              <div className="bg-[#fff8f0] rounded-xl p-3">
                <div className="text-[10px] text-[#2d1b4e]/60 font-bold uppercase">Điểm TB</div>
                <div className="text-lg font-black text-[#fbbf24] mt-0.5">⭐ {c.avgScore}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
