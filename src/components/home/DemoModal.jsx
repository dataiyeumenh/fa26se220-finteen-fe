import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatVND, cn } from "@/lib/utils";
import { Sparkles, Lightbulb, Target } from "lucide-react";

const PRINCIPAL = 10_000_000;
const RATE = 0.08;
const YEARS = 40;
const ACTUAL = PRINCIPAL * Math.pow(1 + RATE, YEARS);

function getErrorTone(error) {
  const absoluteError = Math.abs(error);
  if (absoluteError < 20) return "success";
  if (absoluteError < 50) return "warn";
  return "error";
}

export function DemoModal({ open, onOpenChange }) {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const parsed = parseInt(guess.replace(/[^\d]/g, ""), 10) || 0;
    const error = ((parsed - ACTUAL) / ACTUAL) * 100;
    setResult({ guess: parsed, error, tone: getErrorTone(error) });
  };

  const handleClose = (nextOpen) => {
    if (!nextOpen) { setGuess(""); setResult(null); }
    onOpenChange(nextOpen);
  };

  const toneColors = {
    success: { bg: "bg-[#bdf20f]/15", text: "text-[#08704a]", label: "Xuất sắc!", accent: "#8fc400" },
    warn: { bg: "bg-[#ffc643]/15", text: "text-[#b45309]", label: "Khá gần!", accent: "#d98c00" },
    error: { bg: "bg-[#e57787]/15", text: "text-[#dc2626]", label: "Còn lệch nhiều", accent: "#dc2626" },
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="public-home-demo sm:max-w-[420px]">
        <DialogHeader>
          <div className="mb-1 flex items-center justify-center gap-2 text-[#08704a]">
            <Target className="size-5" />
            <span className="text-sm font-semibold">Cơ chế đoán trước</span>
          </div>
          <DialogTitle className="flex items-center justify-center gap-2 text-center">
            <Sparkles className="size-6 text-[#8fc400]" aria-hidden="true" /> Bài học: Lãi kép
          </DialogTitle>
          <DialogDescription className="text-balance text-center">
            Nếu bạn gửi <strong>10 triệu VNĐ</strong> với lãi suất <strong>8%/năm</strong>, sau <strong>40 năm</strong> bạn sẽ có bao nhiêu?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Input type="text" inputMode="numeric" placeholder="Nhập số của bạn (VNĐ)..." value={guess} onChange={(event) => setGuess(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleCalculate(); }} />
          <Button onClick={handleCalculate} className="w-full bg-[#07553a] text-white hover:bg-[#08704a]" size="lg">Xem kết quả của bạn</Button>
        </div>
        {result && (
          <div className={cn("relative mt-4 space-y-3 overflow-hidden rounded-2xl p-5", toneColors[result.tone].bg)}>
            <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: toneColors[result.tone].accent }} aria-hidden="true" />
            <div className="flex items-center gap-2 text-sm font-bold"><Lightbulb className={cn("size-4", toneColors[result.tone].text)} /><span className={toneColors[result.tone].text}>{toneColors[result.tone].label}</span></div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-slate-200/50 py-2"><span className="text-slate-500">Số của bạn:</span><span className="font-mono font-bold">{formatVND(result.guess)}</span></div>
              <div className="flex items-center justify-between border-b border-slate-200/50 py-2"><span className="text-slate-500">Đáp án thật:</span><span className="font-mono font-bold text-[#07553a]">{formatVND(ACTUAL)}</span></div>
              <div className="flex items-center justify-between pt-1"><span className="text-slate-500">Sai số của bạn:</span><span className={cn("font-mono text-base font-bold", toneColors[result.tone].text)}>{result.error > 0 ? "+" : ""}{result.error.toFixed(1)}%</span></div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
