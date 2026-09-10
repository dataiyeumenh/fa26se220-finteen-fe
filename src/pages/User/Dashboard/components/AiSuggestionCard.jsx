import { Button } from '@/components/ui/button'

export default function AiSuggestionCard() {
  return (
    <div className="bg-white rounded-2xl border-2 border-[#a855f7]/30 p-5 md:p-6 flex items-center gap-4 hover:shadow-finteen-md transition-all">
      <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-3xl shrink-0">
        🤖
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-[#2d1b4e]">Trợ lý AI có gì mới?</div>
        <div className="text-xs text-[#2d1b4e]/65 mt-0.5">
          Hỏi bất cứ điều gì về tiền bạc — mình giải thích bằng chính con số của bạn ✨
        </div>
      </div>
      <Button
        size="sm"
        className="gradient-primary text-white border-0 font-extrabold hidden md:inline-flex"
      >
        Hỏi ngay 💬
      </Button>
    </div>
  )
}
