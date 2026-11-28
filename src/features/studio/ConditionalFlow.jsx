import { Pencil } from 'lucide-react'
import { SceneThumb } from './SceneDialogs'
import { conditionOutcomeLabels, conditionSentence, exitsOf, sceneLabel } from './storyOps'

/** Cùng dữ liệu và hộp sửa với bảng thuộc tính; mọi thay đổi đi qua lịch sử của Editor. */
export default function ConditionalFlow({ scene, scenes, statLabels, write, onCondition, onTarget, onGo, onMap }) {
  const incoming = scenes.filter(item => exitsOf(item).includes(scene.id))
  const sameTarget = scene.ifTrueSceneId && scene.ifTrueSceneId === scene.ifFalseSceneId
  const outcomes = conditionOutcomeLabels(scene.condition)
  const label = id => {
    const index = scenes.findIndex(item => item.id === id)
    return index < 0 ? (id ? 'Cảnh đích không còn tồn tại' : 'Chưa chọn cảnh đích') : `Cảnh ${index + 1} · ${sceneLabel(scenes[index])}`
  }
  return <section className="conditional-flow" aria-label="Luồng rẽ nhánh tự động">
    <header>
      <div><h2>Trẻ sẽ xem cảnh nào tiếp theo?</h2><p>Chọn việc trẻ cần làm, rồi chọn cảnh cho từng trường hợp.</p></div>
    </header>
    <div className="conditional-check">
      <div><h3><span className="conditional-step">1</span>Trước tiên, kiểm tra</h3><button type="button" disabled={!write} onClick={onCondition}><Pencil size={14} aria-hidden="true" />Chọn việc cần kiểm tra</button></div>
      <p className="conditional-question">{conditionSentence(scene.condition, scenes, statLabels)}</p>
    </div>
    <div className="conditional-routes">
      {[['ifTrueSceneId', outcomes.yes, 'Cho trẻ xem cảnh này', '2'], ['ifFalseSceneId', outcomes.no, 'Cho trẻ xem cảnh này', '3']].map(([key, title, hint, step]) => {
        const targetId = scene[key]
        const exists = scenes.some(item => item.id === targetId)
        return <article key={key} className={exists ? '' : 'is-missing'}>
          <h3><span className="conditional-step">{step}</span>{title}</h3>
          <small>{hint}</small>
          <div className="conditional-scene">{exists && <SceneThumb scene={scenes.find(item => item.id === targetId)} />}<p>{label(targetId)}</p></div>
          <div>
            <button type="button" disabled={!write} onClick={() => onTarget(key, title)} aria-label={`Chọn cảnh cho trường hợp ${title.toLowerCase()}`}><Pencil size={14} aria-hidden="true" />{exists ? 'Đổi cảnh' : 'Chọn cảnh'}</button>
            {exists && <button type="button" onClick={() => onGo(targetId)} aria-label={`Xem nội dung cảnh ${title.toLowerCase()}`}>Xem nội dung</button>}
          </div>
        </article>
      })}
    </div>
    {sameTarget && <p className="conditional-note">Bạn đang chọn cùng một cảnh cho cả hai trường hợp. Trẻ sẽ luôn xem cảnh đó.</p>}
    <p className="conditional-note">Trẻ không thấy trang thiết lập này. Khi chơi đến đây, câu chuyện tự chuyển sang cảnh bạn đã chọn.</p>
    <details className="conditional-incoming">
      <summary>Xem các cảnh dẫn đến đây ({incoming.length})</summary>
      {incoming.length ? <div>{incoming.map(item => <button type="button" key={item.id} onClick={() => onGo(item.id)}>{label(item.id)}</button>)}</div>
        : <p>Chưa có cảnh nào dẫn đến đây. Nếu đây không phải đầu chương, hãy chọn trang này làm cảnh tiếp theo của một cảnh khác.</p>}
      {incoming.length > 1 && <p>Các đoạn truyện trên cùng tiếp tục ở đây. Dù đến từ đoạn nào, trẻ cũng được kiểm tra theo yêu cầu ở mục 1.</p>}
      <button type="button" onClick={onMap}>Xem toàn bộ câu chuyện</button>
    </details>
  </section>
}
