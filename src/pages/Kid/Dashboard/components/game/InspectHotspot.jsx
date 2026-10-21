import { normalizeHotspot } from "./inspectHotspot";
import "./inspect-hotspot.css";

export function InspectHotspot({ inspect, onOpen }) {
  const region = normalizeHotspot(inspect.hotspot);
  return (
    <div
      className="vn-hotspot-layer"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="vn-hotspot-region"
        style={{
          left: `${region.x}%`,
          top: `${region.y}%`,
          width: `${region.width}%`,
          height: `${region.height}%`,
        }}
        aria-label={inspect.buttonText}
        onClick={() => onOpen(inspect)}
      >
        <span>Nhấn vào đây để mở</span>
      </button>
    </div>
  );
}
