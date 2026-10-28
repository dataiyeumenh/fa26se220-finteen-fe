// Bản đồ truyện "rẽ rồi nhập": câu hỏi tách thành làn, làn không có cảnh riêng đi thẳng về điểm nhập.
// Bấm một ô để mở cảnh đó ở Khung hình. ↩ = quay lại cảnh trước, ↪ = nhảy sang cảnh đã vẽ ở làn khác.
import { useEffect, useRef, useState } from "react";
import {
  CornerDownLeft,
  CornerDownRight,
  GitMerge,
  Lock,
  Plus,
} from "lucide-react";
import { buildStoryMap, sceneLabel, typeOf, TYPE_LABEL } from "./storyOps";

function Node({ scenes, index, onOpen, strong, currentIndex }) {
  const scene = scenes[index];
  return (
    <button
      type="button"
      className={`map-node${strong ? " is-branch" : ""}${index === currentIndex ? " is-current" : ""}`}
      aria-current={index === currentIndex ? "true" : undefined}
      onClick={() => onOpen(index)}
    >
      <span className="map-number">{index + 1}</span>
      <span className="map-text">{sceneLabel(scene)}</span>
      {strong && <small>{TYPE_LABEL[typeOf(scene)]}</small>}
    </button>
  );
}

function Run({ scenes, indexes, onOpen, currentIndex }) {
  const [open, setOpen] = useState(indexes.slice(1, -1).includes(currentIndex));
  if (open || indexes.length <= 3)
    return indexes.map((index) => (
      <Node
        key={index}
        scenes={scenes}
        index={index}
        onOpen={onOpen}
        currentIndex={currentIndex}
      />
    ));
  return (
    <>
      <Node
        scenes={scenes}
        index={indexes[0]}
        onOpen={onOpen}
        currentIndex={currentIndex}
      />
      <button type="button" className="map-more" onClick={() => setOpen(true)}>
        Hiện thêm {indexes.length - 2} cảnh
      </button>
      <Node
        scenes={scenes}
        index={indexes.at(-1)}
        onOpen={onOpen}
        currentIndex={currentIndex}
      />
    </>
  );
}

function Jump({ scenes, to, back, same, onOpen }) {
  const Icon = back ? CornerDownLeft : CornerDownRight;
  return (
    <button type="button" className="map-jump" onClick={() => onOpen(to)}>
      <Icon size={15} aria-hidden="true" />
      {back
        ? "Quay lại"
        : same
          ? "Cùng đường với làn trên, tới"
          : "Nhập vào"}{" "}
      cảnh {to + 1}: {sceneLabel(scenes[to])}
    </button>
  );
}

function Blocks({ blocks, ...props }) {
  return blocks.map((block, key) => {
    if (block.kind === "nodes")
      return block.indexes.map((index) => (
        <Node key={`${key}-${index}`} {...props} index={index} />
      ));
    if (block.kind === "run")
      return <Run key={key} {...props} indexes={block.indexes} />;
    if (block.kind === "jump")
      return <Jump key={key} {...props} to={block.to} back={block.back} />;
    const { write, onBranch, onLaneEnd } = props;
    return (
      <div className="map-branch" key={key}>
        <Node {...props} index={block.index} strong />
        <div className="map-lanes">
          {block.lanes.map((lane, k) => (
            <div className="map-lane" key={k}>
              <div className="map-lane-head">
                {block.choice && <span className="map-number">{k + 1}</span>}
                {lane.locked && (
                  <Lock size={13} aria-label="Lựa chọn có khoá" />
                )}
                <span>{lane.label}</span>
              </div>
              {lane.jump ? (
                <Jump {...props} {...lane.jump} />
              ) : lane.empty ? (
                <>
                  <p className="map-empty">
                    {lane.empty === "join"
                      ? "Không có cảnh riêng, đi thẳng về chỗ các làn nhập lại"
                      : "Chưa chọn đi tiếp tới đâu"}
                  </p>
                  {write && lane.option != null && (
                    <button
                      type="button"
                      className="map-add"
                      onClick={() =>
                        onBranch(block.index, lane.option, block.join)
                      }
                    >
                      <Plus size={15} />
                      Tạo nhánh riêng
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Blocks blocks={lane.body} {...props} />
                  {write && lane.last != null && (
                    <button
                      type="button"
                      className="map-add"
                      onClick={() => onLaneEnd(lane.last)}
                    >
                      <Plus size={15} />
                      Thêm cảnh cuối làn
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {block.join != null && !block.sameJoinAsParent && (
          <p className="map-join">
            <GitMerge size={15} aria-hidden="true" />
            Các làn nhập lại ở cảnh {block.join + 1}
          </p>
        )}
      </div>
    );
  });
}

export default function StoryMap({
  scenes,
  currentIndex,
  write,
  onOpen,
  onBranch,
  onLaneEnd,
}) {
  const blocks = buildStoryMap(scenes);
  const ref = useRef(null);
  // mở bản đồ thì cuộn tới cảnh đang soạn
  useEffect(() => {
    ref.current
      ?.querySelector(".map-node.is-current")
      ?.scrollIntoView({ block: "center", inline: "center" });
  }, []);
  return (
    <div className="story-map" ref={ref}>
      <p className="map-hint">
        Câu hỏi tách thành các làn. Làn không có cảnh riêng đi thẳng về chỗ các
        làn nhập lại. Bấm một ô để mở cảnh đó.
      </p>
      <div className="map-column">
        <Blocks
          blocks={blocks}
          scenes={scenes}
          currentIndex={currentIndex}
          write={write}
          onOpen={onOpen}
          onBranch={onBranch}
          onLaneEnd={onLaneEnd}
        />
      </div>
    </div>
  );
}
