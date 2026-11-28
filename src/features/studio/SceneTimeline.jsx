import { useEffect, useRef, useState } from 'react';
import { GripVertical, Plus } from 'lucide-react';
import { followsPageOrder, sceneLabel } from './storyOps';

/** Page placement is explicit; native dragging, touch handles and keyboard share the same gaps. */
export default function SceneTimeline({ scenes, previewScenes, idx, setIdx, write, busy, onAdd, onReorder, issueScenes, trackRef, renderThumbnail }) {
  const [dragId, setDragId] = useState(null);
  const [gap, setGap] = useState(null);
  const gesture = useRef(null);
  const pointerX = useRef(null);
  const editable = write && !busy;

  const gapAt = (x) => {
    const items = [...(trackRef.current?.querySelectorAll('[data-timeline-id]') || [])];
    const found = items.findIndex(item => {
      const rect = item.getBoundingClientRect();
      return x < rect.left + rect.width / 2;
    });
    return found < 0 ? scenes.length : found;
  };
  const reset = () => {
    gesture.current = null;
    pointerX.current = null;
    setDragId(null);
    setGap(null);
  };
  const move = (id, position) => {
    const from = scenes.findIndex(scene => scene.id === id);
    if (editable && from >= 0 && position != null) onReorder(from, position);
  };
  const moveWithKeys = (event, index) => {
    if (!editable || !event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'ArrowLeft' ? index - 1 : index + 1;
    if (target < 0 || target >= scenes.length) return;
    move(scenes[index].id, target > index ? target + 1 : target);
    const id = scenes[index].id;
    requestAnimationFrame(() => [...(trackRef.current?.querySelectorAll('[data-timeline-id]') || [])]
      .find(item => item.dataset.timelineId === id)?.querySelector('.scene-thumbnail')?.focus());
  };

  useEffect(() => {
    if (!dragId) return;
    let frame;
    const scroll = () => {
      const track = trackRef.current;
      if (track && pointerX.current != null) {
        const rect = track.getBoundingClientRect();
        const x = pointerX.current;
        const direction = x < rect.left + 40 ? -1 : x > rect.right - 40 ? 1 : 0;
        if (direction) {
          track.scrollLeft += direction * 9;
          const items = [...track.querySelectorAll('[data-timeline-id]')];
          const target = items.findIndex(item => {
            const box = item.getBoundingClientRect();
            return x < box.left + box.width / 2;
          });
          setGap(target < 0 ? items.length : target);
        }
      }
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [dragId, trackRef]);

  return <section className="scene-timeline" aria-label="Các cảnh trong chương">
    <div className="scene-timeline-heading">
      <span>Các cảnh <b>{scenes.length}</b></span>
      {write && <button type="button" disabled={busy} onClick={() => onAdd(scenes.length)}><Plus size={15} /> Thêm cảnh</button>}
    </div>
    {write && <p className="scene-timeline-help">Dấu + giữa các cảnh để chèn; kéo cảnh để đổi thứ tự. <span>{followsPageOrder(scenes) ? 'Thứ tự chơi theo các cảnh.' : 'Hướng đi của các nhánh xem trong Bản đồ truyện.'}</span></p>}
    <div className={`scene-timeline-track ${dragId ? 'is-sorting' : ''}`} ref={trackRef}
      onDragOver={event => {
        if (!dragId || !editable) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        pointerX.current = event.clientX;
        setGap(gapAt(event.clientX));
      }}
      onDrop={event => {
        if (!dragId) return;
        event.preventDefault();
        move(dragId, gapAt(event.clientX));
        reset();
      }}
      onKeyDown={event => { if (event.key === 'Escape') reset(); }}
    >
      {scenes.map((scene, index) => <div className="scene-timeline-slot" key={scene.id}>
        {write && <div className={`scene-insert-gap ${gap === index ? 'is-drop-target' : ''}`}>
          <button type="button" disabled={busy} aria-label={index === 0 ? 'Thêm cảnh vào đầu chương' : `Thêm cảnh giữa cảnh ${index} và ${index + 1}`}
            title={index === 0 ? 'Thêm cảnh vào đầu chương' : `Thêm cảnh ở vị trí ${index + 1}`} onClick={() => onAdd(index)}><Plus size={16} /></button>
        </div>}
        <div className={`scene-timeline-item ${dragId === scene.id ? 'is-dragging' : ''}`} data-timeline-id={scene.id}>
          <button type="button" className={`scene-thumbnail ${index === idx ? 'selected' : ''}`}
            draggable={editable}
            onDragStart={event => {
              if (!editable) { event.preventDefault(); return; }
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', scene.id);
              setDragId(scene.id);
              setGap(index);
              pointerX.current = event.clientX;
            }}
            onDragEnd={reset}
            onKeyDown={event => moveWithKeys(event, index)}
            aria-label={`Cảnh ${index + 1}: ${scene.title || scene.id}`}
            aria-pressed={index === idx}
            aria-describedby={write ? 'scene-reorder-help' : undefined}
            onClick={() => setIdx(index)}>
            <span className="scene-thumbnail-index">{index + 1}</span>
            {issueScenes.has(index) && <span className="scene-thumbnail-alert" title="Cảnh này còn chỗ cần sửa" />}
            {renderThumbnail(previewScenes[index] || scene)}
            <span className="scene-thumbnail-label">{sceneLabel(scene)}</span>
          </button>
          {write && <button type="button" className="scene-reorder-handle" disabled={busy}
            aria-label={`Di chuyển cảnh ${index + 1}`} aria-describedby="scene-reorder-help" title="Kéo để đổi thứ tự · Alt + ← / →"
            onKeyDown={event => moveWithKeys(event, index)}
            onPointerDown={event => {
              if (!editable || event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              gesture.current = { id: scene.id, x: event.clientX, active: false };
            }}
            onPointerMove={event => {
              const current = gesture.current;
              if (!current) return;
              if (!current.active && Math.abs(event.clientX - current.x) < 5) return;
              current.active = true;
              pointerX.current = event.clientX;
              setDragId(current.id);
              setGap(gapAt(event.clientX));
            }}
            onPointerUp={event => {
              const current = gesture.current;
              if (current?.active) move(current.id, gapAt(event.clientX));
              reset();
            }}
            onPointerCancel={reset} onLostPointerCapture={reset}
          ><GripVertical size={16} /></button>}
        </div>
      </div>)}
      {write && <div className={`scene-timeline-end ${gap === scenes.length ? 'is-drop-target' : ''}`}>
        <button type="button" className="scene-add-page" disabled={busy} onClick={() => onAdd(scenes.length)} aria-label="Thêm cảnh vào cuối chương" title="Thêm cảnh vào cuối chương"><Plus size={22} /></button>
      </div>}
    </div>
    {write && <span id="scene-reorder-help" className="sr-only">Kéo hình cảnh hoặc nút di chuyển để đổi vị trí. Dùng Alt và phím mũi tên trái, phải để sắp xếp bằng bàn phím.</span>}
  </section>;
}
