import { lazy, Suspense, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog'
import './game-preview.css'

const Player = lazy(() => import('../../pages/Kid/Dashboard/components/game/VisualNovelPlayer.jsx').then(module => ({ default: module.VisualNovelPlayer })))

export default function GamePreview({ content, code, startIndex = 0, onEdit, onClose }) {
  const [container, setContainer] = useState(null)
  const data = useMemo(() => ({ ...content, metadata: { ...content.metadata, chapterId: content.metadata?.chapterId || code } }), [content, code])
  return <Dialog open onOpenChange={open => { if (!open) onClose() }}>
    <DialogContent layout="studio-game-preview" className="studio-game-preview" aria-describedby={undefined}
      onEscapeKeyDown={event => { if (document.fullscreenElement) event.preventDefault() }}>
      <DialogTitle className="sr-only">Chơi thử nội dung nháp như trẻ</DialogTitle>
      <div className="studio-game-preview-host" ref={setContainer}>
        <Suspense fallback={<div className="studio-game-preview-loading"><p role="status">Đang mở trò chơi…</p><button type="button" onClick={onClose}>Quay lại trình soạn</button></div>}>
          {container && <Player data={data} preview startSceneId={content.scenes[startIndex]?.id} portalContainer={container}
            onExit={onClose} onEditScene={id => { const index = content.scenes.findIndex(scene => scene.id === id); if (index >= 0) onEdit(index) }} />}
        </Suspense>
      </div>
    </DialogContent>
  </Dialog>
}
