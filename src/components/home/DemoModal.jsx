import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatVND, cn } from '@/lib/utils'
import { Sparkles, Lightbulb } from 'lucide-react'

const PRINCIPAL = 10_000_000
const RATE = 0.08
const YEARS = 40
const ACTUAL = PRINCIPAL * Math.pow(1 + RATE, YEARS)

function getErrorTone(error) {
  const abs = Math.abs(error)
  if (abs < 20) return 'success'
  if (abs < 50) return 'warn'
  return 'error'
}

export function DemoModal({ open, onOpenChange }) {
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null)

  const handleCalculate = () => {
    const parsed = parseInt(guess.replace(/[^\d]/g, ''), 10) || 0
    const error = ((parsed - ACTUAL) / ACTUAL) * 100
    setResult({ guess: parsed, error, tone: getErrorTone(error) })
  }

  const handleClose = (next) => {
    if (!next) {
      setGuess('')
      setResult(null)
    }
    onOpenChange(next)
  }

  const toneColors = {
    success: { bg: 'bg-[#00d4aa]/15', text: 'text-[#00b894]', label: 'Xuất sắc!' },
    warn: { bg: 'bg-[#fbbf24]/15', text: 'text-[#fbbf24]', label: 'Khá gần!' },
    error: { bg: 'bg-[#ff6b6b]/15', text: 'text-[#ff6b6b]', label: 'Còn lệch nhiều' },
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 text-[#00d4aa] mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-semibold">Cơ chế đoán-trước</span>
          </div>
          <DialogTitle className="text-center">💰 Bài học: Lãi kép</DialogTitle>
          <DialogDescription className="text-center text-balance">
            Nếu bạn gửi <strong>10 triệu VNĐ</strong> với lãi suất <strong>8%/năm</strong>,
            sau <strong>40 năm</strong> bạn sẽ có bao nhiêu?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Nhập số của bạn (VNĐ)..."
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCalculate()
            }}
          />
          <Button onClick={handleCalculate} className="w-full" size="lg">
            Xem kết quả của bạn
          </Button>
        </div>

        {result && (
          <div
            className={cn(
              'mt-4 p-5 rounded-2xl space-y-3',
              toneColors[result.tone].bg,
              'animate-fade-up'
            )}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <Lightbulb className={cn('w-4 h-4', toneColors[result.tone].text)} />
              <span className={toneColors[result.tone].text}>{toneColors[result.tone].label}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                <span className="text-slate-500">Số của bạn:</span>
                <span className="font-mono font-bold text-[#1a1a2e]">
                  {formatVND(result.guess)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                <span className="text-slate-500">Đáp án thật:</span>
                <span className="font-mono font-bold text-[#00b894]">
                  {formatVND(ACTUAL)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Sai số của bạn:</span>
                <span
                  className={cn(
                    'font-mono font-bold text-base',
                    toneColors[result.tone].text
                  )}
                >
                  {result.error > 0 ? '+' : ''}
                  {result.error.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
