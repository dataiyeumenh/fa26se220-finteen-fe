import { useEffect, useRef, useState } from "react";

export default function SceneVoice({ src }) {
  const audioRef = useRef(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    let active = true;
    audio.play().catch((error) => {
      if (!active || error.name === "AbortError") return;
      setStatus(error.name === "NotAllowedError"
        ? "Bấm phát để nghe giọng đọc."
        : "Chưa phát được giọng đọc. Bạn có thể thử lại.");
    });
    return () => {
      active = false;
      audio.pause();
    };
  }, [src]);

  return <div className="vn-scene-voice">
    <audio
      ref={audioRef}
      src={src}
      hidden
      preload="auto"
      aria-label="Giọng đọc của cảnh"
      onPlaying={() => setStatus("")}
      onError={() => setStatus("Không tải được giọng đọc của cảnh này.")}
    />
    {status && <button type="button" className="vn-icon-button" onClick={() => {
      audioRef.current.play().catch(() => setStatus("Chưa phát được giọng đọc. Bấm để thử lại."));
    }}>{status}</button>}
  </div>;
}
