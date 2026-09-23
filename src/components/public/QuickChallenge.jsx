import { useState } from 'react'
import { ArrowRight, Check, Gamepad2, RotateCcw, Sparkles } from 'lucide-react'

export function QuickChallenge() {
  const [choice, setChoice] = useState(null)
  const correct = choice === 'want'
  return <div className="ft-challenge-scene" id="try-game">
    <span className="ft-sticker ft-sticker-top"><Sparkles size={18} aria-hidden="true" /> Học bằng cách chơi!</span>
    <section className="ft-challenge" aria-label="Chơi thử phân biệt cần và muốn">
      <div className="ft-challenge-bar"><span><Gamepad2 size={18} aria-hidden="true" /> THỬ THÁCH NHANH</span><span>01</span></div>
      <div className="ft-challenge-content">
        <span className="ft-small-label">CẦN HAY MUỐN?</span>
        <h2>Một chiếc thẻ game.<br />Bạn chọn bên nào?</h2>
        <div className="ft-item-stage"><span className="ft-orbit" aria-hidden="true" /><img src="/images/c1/mini-game/c1_item_game_gift_card.png" alt="Thẻ nạp game" width="180" height="180" /></div>
        <div className="ft-answer-buttons">
          <button type="button" aria-pressed={choice === 'need'} onClick={() => setChoice('need')} className={choice === 'need' ? 'selected' : ''}>A <span>Mình cần</span></button>
          <button type="button" aria-pressed={choice === 'want'} onClick={() => setChoice('want')} className={choice === 'want' ? 'selected' : ''}>B <span>Mình muốn</span></button>
        </div>
        <div className="ft-challenge-feedback" aria-live="polite">
          {choice ? <><strong>{correct ? <Check size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}{correct ? 'Chuẩn rồi, bạn hiểu rất nhanh!' : 'Thử nhìn theo cách khác nhé!'}</strong><p>Thẻ game phục vụ sở thích, nên thuộc nhóm “Muốn”. Phân biệt được là bước đầu để chi tiêu thông minh.</p><button type="button" className="ft-text-button" onClick={() => setChoice(null)}><RotateCcw size={14} aria-hidden="true" /> Chọn lại</button></> : <p>Chọn một đáp án và khám phá ngay <ArrowRight size={16} aria-hidden="true" /></p>}
        </div>
      </div>
    </section>
    <span className="ft-sticker ft-sticker-bottom">Một lựa chọn nhỏ.<br /><strong>Một bài học hay.</strong></span>
  </div>
}
