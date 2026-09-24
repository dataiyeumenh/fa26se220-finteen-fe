import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChartNoAxesColumn, Coins, ImageOff, Maximize2, Menu, Minimize2, RotateCcw } from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import "./visual-novel.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NeedWantMiniGame } from "./NeedWantMiniGame";
import { ServeCustomerMiniGame } from "./ServeCustomerMiniGame";

const statLabels = {
  WEALTH: "Tài sản",
  SAVINGS: "Tiết kiệm",
  FIQ: "IQ tài chính",
  HAPPINESS: "Hạnh phúc",
  RISK: "Rủi ro",
  GOAL: "Mục tiêu",
};

function applyStatEffects(current, effects = {}) {
  const next = { ...current };
  Object.entries(effects).forEach(([key, delta]) => {
    const currentValue = next[key] ?? 0;
    next[key] = Math.max(0, currentValue + Number(delta || 0));
  });
  return next;
}

function evaluateCondition(stats, condition) {
  if (condition?.check || condition?.expression || condition?.formula) {
    const expression = String(
      condition.check || condition.expression || condition.formula || "",
    ).trim();

    if (!expression) return false;

    try {
      const evaluator = new Function(
        "stats",
        `const { WEALTH = 0, SAVINGS = 0, FIQ = 0, HAPPINESS = 0, RISK = 0, GOAL = 0 } = stats || {}; return Boolean(${expression});`,
      );
      return evaluator(stats || {});
    } catch {
      return false;
    }
  }

  if (!condition?.field) return false;

  const left = Number(stats?.[condition.field] ?? 0);
  const right = Number(condition.value ?? 0);

  switch (condition.operator) {
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case "==":
    case "=":
      return left === right;
    case "!=":
      return left !== right;
    default:
      return false;
  }
}

function CharacterSprite({
  src,
  alt,
  position,
  dimmed = false,
}) {
  const [broken, setBroken] = useState(false);

  const positionClass = {
    left: "left-[4%] md:left-[8%]",
    center: "left-1/2 -translate-x-1/2",
    right: "right-[4%] md:right-[8%]",
  }[position];

  return (
    <div
      className={cn(
        "absolute z-20 transition-opacity",
        "vn-character",
        positionClass,
      )}
    >
      {!broken ? (
        <img
          src={src}
          alt={alt}
          onError={() => setBroken(true)}
          className={cn(
            "w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]",
            dimmed && "opacity-60",
          )}
        />
      ) : (
        <div className="aspect-[3/4] rounded-3xl border-2 border-white/40 bg-black/30 backdrop-blur-sm text-white text-xs flex items-center justify-center px-3 text-center">
          <span>{alt}</span>
        </div>
      )}
    </div>
  );
}

function SceneBackground({ src, showMissingHint = true }) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#84cc16_0%,#22c55e_40%,#14532d_100%)]">
        <div className="absolute inset-0 bg-black/20" />
        {showMissingHint ? (
          <div className="absolute top-6 right-6 inline-flex items-center gap-2 text-white/80 text-xs font-bold rounded-full border border-white/25 px-3 py-1.5 bg-white/10">
            <ImageOff className="w-3.5 h-3.5" /> Thiếu ảnh nền
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt="scene background"
        onError={() => setBroken(true)}
        onLoad={(event) => { const img = event.currentTarget; img.parentElement.style.setProperty("--scene-ratio", img.naturalWidth / img.naturalHeight); }}
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
    </>
  );
}

function SpeakerTag({ scene }) {
  if (scene.type !== "dialogue") return null;

  return (
    <div className="vn-speaker">
      {scene.speaker || "Nhân vật"}
    </div>
  );
}

function StatsPanel({ stats, statFxByKey }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
      {Object.entries(statLabels).map(([key, label]) => (
        <div
          key={key}
          className={cn(
            "relative bg-[#faf8f5] rounded-xl border p-2.5 transition-all duration-500",
            statFxByKey[key]
              ? statFxByKey[key] > 0
                ? "border-[#22c55e]/55 shadow-[0_0_0_2px_rgba(34,197,94,0.18)]"
                : "border-[#ef4444]/55 shadow-[0_0_0_2px_rgba(239,68,68,0.18)]"
              : "border-[#22c55e]/15",
          )}
        >
          <div className="text-[10px] uppercase tracking-wide font-bold text-[#1a3a1a]/55">
            {label}
          </div>
          <div className="text-base font-black text-[#1a3a1a]">
            {Number(stats[key] ?? 0).toLocaleString("vi-VN")}
          </div>
          {statFxByKey[key] ? (
            <span
              className={cn(
                "absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-[11px] font-black text-white animate-bounce",
                statFxByKey[key] > 0 ? "bg-[#22c55e]" : "bg-[#ef4444]",
              )}
            >
              {statFxByKey[key] > 0 ? `+${statFxByKey[key]}` : statFxByKey[key]}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function VisualNovelPlayer({ data }) {
  const gameContainerRef = useRef(null);
  const stageRef = useRef(null);
  const dialogueRef = useRef(null);
  const pendingTransitionRef = useRef(null);
  const statFxTimerRef = useRef(null);

  const [scenePath, setScenePath] = useState([0]);
  const [miniGameDoneByScene, setMiniGameDoneByScene] = useState({});
  const [sceneActionApplied, setSceneActionApplied] = useState({});
  const [stats, setStats] = useState(data.initialStats || {});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingEffects, setPendingEffects] = useState(null);
  const [statFxByKey, setStatFxByKey] = useState({});

  const sceneIndex = scenePath[scenePath.length - 1];

  const totalScenes = data.scenes.length;
  const scene = data.scenes[sceneIndex];
  const progress = Math.round(((sceneIndex + 1) / totalScenes) * 100);

  const sceneIndexById = useMemo(() => {
    const mapping = {};
    data.scenes.forEach((item, index) => {
      mapping[item.id] = index;
    });
    return mapping;
  }, [data.scenes]);

  const resolveNavigableSceneIndex = (startIndex) => {
    let index = startIndex;
    let guard = 0;

    while (guard < data.scenes.length) {
      const candidate = data.scenes[index];
      if (!candidate) break;

      if (candidate.type !== "conditional") return index;

      const branchResult = evaluateCondition(stats, candidate.condition);
      const targetId = branchResult
        ? candidate.ifTrueSceneId
        : candidate.ifFalseSceneId;
      const targetIndex = sceneIndexById[targetId];

      if (typeof targetIndex !== "number") return index;
      index = targetIndex;
      guard += 1;
    }

    return index;
  };

  const sceneCharacters = useMemo(() => {
    if (!scene.characters) return [];

    return scene.characters.map((character) => {
      const spriteSet = data.sprites?.[character.id] || {};
      return {
        ...character,
        src: spriteSet[character.expression] || spriteSet.neutral || "",
      };
    });
  }, [data.sprites, scene.characters]);

  const hasChoiceOptions =
    Array.isArray(scene.options) && scene.options.length > 0;
  const isSceneOnlyScreen = scene.type === "cutscene" || scene.type === "scene";

  const canGoNext =
    (scene.type !== "minigame" || Boolean(miniGameDoneByScene[scene.id])) &&
    scene.type !== "choice" &&
    !hasChoiceOptions &&
    sceneIndex < totalScenes - 1;

  const goToSceneIndex = (nextIndex) => {
    const resolved = resolveNavigableSceneIndex(nextIndex);
    setScenePath((current) => [...current, resolved]);
  };

  const applyOneTimeSceneEffect = (sceneId, effects) => {
    if (!effects || sceneActionApplied[sceneId]) return;

    setStats((current) => applyStatEffects(current, effects));
    setSceneActionApplied((prev) => ({ ...prev, [sceneId]: true }));
    setStatFxByKey(effects);

    if (statFxTimerRef.current) {
      clearTimeout(statFxTimerRef.current);
    }
    statFxTimerRef.current = setTimeout(() => {
      setStatFxByKey({});
    }, 1200);
  };

  const runTransitionWithEffects = ({ sceneId, effects, transition }) => {
    if (!effects || sceneActionApplied[sceneId]) {
      transition();
      return;
    }

    pendingTransitionRef.current = transition;
    setPendingEffects({ sceneId, effects });
  };

  const confirmPendingEffects = () => {
    if (!pendingEffects) return;

    applyOneTimeSceneEffect(pendingEffects.sceneId, pendingEffects.effects);
    setPendingEffects(null);

    const nextTransition = pendingTransitionRef.current;
    pendingTransitionRef.current = null;
    nextTransition?.();
  };

  const goNext = () => {
    if (!canGoNext) return;

    runTransitionWithEffects({
      sceneId: scene.id,
      effects: scene.effects,
      transition: () => {
        if (
          scene.nextSceneId &&
          typeof sceneIndexById[scene.nextSceneId] === "number"
        ) {
          goToSceneIndex(sceneIndexById[scene.nextSceneId]);
          return;
        }

        const nextIndex = Math.min(sceneIndex + 1, totalScenes - 1);
        goToSceneIndex(nextIndex);
      },
    });
  };

  const selectChoice = (option) => {
    runTransitionWithEffects({
      sceneId: option.id,
      effects: option.effects,
      transition: () => {
        const targetIndex = option.nextSceneId
          ? sceneIndexById[option.nextSceneId]
          : Math.min(sceneIndex + 1, totalScenes - 1);

        if (typeof targetIndex === "number") {
          goToSceneIndex(targetIndex);
        }
      },
    });
  };

  const handleMiniGameComplete = (result) => {
    const { passed } = result || {};
    setMiniGameDoneByScene((prev) => ({ ...prev, [scene.id]: true }));

    const targetSceneId = passed ? scene.onPassSceneId : scene.onFailSceneId;
    if (targetSceneId && typeof sceneIndexById[targetSceneId] === "number") {
      goToSceneIndex(sceneIndexById[targetSceneId]);
      return;
    }

    if (
      scene.nextSceneId &&
      typeof sceneIndexById[scene.nextSceneId] === "number"
    ) {
      goToSceneIndex(sceneIndexById[scene.nextSceneId]);
    }
  };

  const restart = () => {
    setScenePath([resolveNavigableSceneIndex(0)]);
    setMiniGameDoneByScene({});
    setSceneActionApplied({});
    setStats(data.initialStats || {});
    setPendingEffects(null);
    setStatFxByKey({});
    pendingTransitionRef.current = null;
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === gameContainerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (statFxTimerRef.current) {
        clearTimeout(statFxTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const dialogue = dialogueRef.current;
    if (!stage) return;
    const updateClearance = () => {
      const stageBounds = stage.getBoundingClientRect();
      const dialogueBounds = dialogue?.getBoundingClientRect();
      const clearance = dialogueBounds?.height
        ? Math.max(0, stageBounds.bottom - dialogueBounds.top + 12)
        : 0;
      stage.style.setProperty("--dialogue-clearance", `${clearance}px`);
    };
    const observer = new ResizeObserver(updateClearance);
    observer.observe(stage);
    if (dialogue) observer.observe(dialogue);
    window.addEventListener("resize", updateClearance);
    updateClearance();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateClearance);
    };
  }, [scene.id]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await gameContainerRef.current?.requestFullscreen?.();
      } else if (document.fullscreenElement === gameContainerRef.current) {
        await document.exitFullscreen();
      }
    } catch {
      // Browser or permissions may block fullscreen in some contexts.
    }
  };

  return createPortal(
    <div ref={gameContainerRef} className="vn-player">
      <header className="vn-toolbar">
        <details className="vn-details vn-menu">
          <summary className="vn-icon-button" aria-label="Menu trò chơi" title="Menu trò chơi"><Menu size={20} /></summary>
          <div className="vn-popover vn-menu-panel">
            <div className="vn-heading"><span className="vn-eyebrow">HÀNH TRÌNH FINTEEN</span><h1>{data.title}</h1></div>
            <p className="vn-menu-progress">Cảnh {sceneIndex + 1} / {totalScenes}</p>
            <div className="vn-progress" role="progressbar" aria-label="Tiến độ chương" aria-valuenow={sceneIndex + 1} aria-valuemin={0} aria-valuemax={totalScenes}><div style={{ width: progress + "%" }} /></div>
            <StatsPanel stats={stats} statFxByKey={statFxByKey} />
            <div className="vn-menu-actions">
        <Link to="/dashboard/user/lessons" className="vn-icon-button" aria-label="Về bản đồ chương" title="Về bản đồ chương"><ArrowLeft size={18} /></Link>
        <button type="button" onClick={toggleFullscreen} className="vn-icon-button" aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}>{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        <details className="vn-restart-confirm">
          <summary><RotateCcw size={16} /> Chơi lại</summary>
          <p>Đặt lại tiến độ và chỉ số của lượt chơi này?</p>
          <button type="button" onClick={(event) => { restart(); event.currentTarget.closest("details").open = false; }}>Bắt đầu lại chương</button>
        </details>
            </div>
          </div>
        </details>
        {!isSceneOnlyScreen && scene.type !== "minigame" && <div className="vn-hud-right">
        <div className="vn-wallet"><Coins size={17} /><span>{Number(stats.WEALTH || 0).toLocaleString("vi-VN")}<small> đ</small></span></div>
        <details className="vn-details">
          <summary className="vn-icon-button" aria-label="Xem chỉ số" title="Chỉ số"><ChartNoAxesColumn size={18} /><span className="vn-control-label">Chỉ số</span></summary>
          <div className="vn-popover"><h2>Hành trình của bạn</h2><StatsPanel stats={stats} statFxByKey={statFxByKey} /></div>
        </details>
        <button type="button" onClick={toggleFullscreen} className="vn-icon-button" aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"} title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}>{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </div>}
      </header>
      <main
        className="vn-play-area"
        onClick={(event) => {
          if (
            !canGoNext ||
            pendingEffects ||
            hasChoiceOptions ||
            scene.type === "minigame" ||
            event.target.closest("button, a, input, select, textarea, summary, details, .vn-dialogue-dock") ||
            window.getSelection()?.toString()
          ) return;
          goNext();
        }}
      >
        <div className="vn-stage-space">
          {scene.background && <img key={`ambient-${scene.background}`} src={scene.background} alt="" aria-hidden="true" className="vn-ambient" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
          <div ref={stageRef} className="vn-stage">
            <SceneBackground key={scene.background} src={scene.background} showMissingHint={scene.type !== "minigame"} />
        {scene.type === "dialogue" && (
          <>
            {sceneCharacters.map((character) => (
              <CharacterSprite
                key={`${scene.id}-${character.id}-${character.expression}`}
                src={character.src}
                alt={`${character.id} ${character.expression}`}
                position={character.position || "center"}
                dimmed={
                  sceneCharacters.length > 1 &&
                  scene.speakerId &&
                  scene.speakerId !== character.id
                }
              />
            ))}
          </>
        )}

          {isSceneOnlyScreen && canGoNext && <button className="vn-scene-next" onClick={(event) => { event.stopPropagation(); goNext(); }}>Tiếp tục câu chuyện <span>→</span></button>}
          </div>
        </div>
        {scene.type === "minigame" ? (
          <div className="vn-minigame-host">
            {scene.game?.id === "STALL_SERVE_MINIGAME" ? (
              <ServeCustomerMiniGame
                key={scene.id}
                game={scene.game}
                onComplete={handleMiniGameComplete}
                className="h-full"
                immersive
              />
            ) : (
              <NeedWantMiniGame
                key={scene.id}
                game={scene.game}
                onComplete={handleMiniGameComplete}
                className="h-full"
                immersive
              />
            )}
          </div>
        ) : hasChoiceOptions ? (
          <div className="vn-choice-overlay" key={scene.id}>
            <section className="vn-choice-panel" aria-labelledby="vn-choice-question">
              <span className="vn-choice-eyebrow">ĐẾN LƯỢT BẠN QUYẾT ĐỊNH</span>
              {scene.text && scene.prompt && scene.text !== scene.prompt && <p className="vn-choice-context">{scene.text}</p>}
              <h2 id="vn-choice-question">{scene.prompt || scene.text || "Bạn sẽ chọn điều gì?"}</h2>
              <div className="vn-choices">
                {scene.options.map((option, index) => (
                  <button key={option.id} type="button" className="vn-choice-option" onClick={() => selectChoice(option)} disabled={Boolean(pendingEffects)}>
                    <span className="vn-choice-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                    <span>{option.label}</span>
                    <span className="vn-choice-arrow" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
              <p className="vn-choice-hint">Mỗi lựa chọn viết tiếp câu chuyện của bạn.</p>
            </section>
          </div>
        ) : (
          <div ref={dialogueRef} className={cn("vn-dialogue-dock", isSceneOnlyScreen && "hidden")}>
            {isSceneOnlyScreen ? null : scene.type === "summary" ? (
              <div
                className={cn(
                  "vn-dialogue",
                  canGoNext && "cursor-pointer",
                )}
                onClick={canGoNext ? goNext : undefined}
              >
                <div className="vn-speaker">
                  Tổng kết chương
                </div>
                <p className="vn-summary-title">
                  {scene.title || "Hoàn thành chương"}
                </p>
                {scene.nextChapter && (
                  <p className="text-sm">
                    Chương tiếp theo: {scene.nextChapter.toUpperCase()}
                  </p>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "vn-dialogue",
                  canGoNext && "cursor-pointer",
                )}
                onClick={canGoNext ? goNext : undefined}
              >
                {scene.type === "dialogue" && <SpeakerTag scene={scene} />}
                <p className="vn-dialogue-text">
                  {scene.text || scene.prompt}
                </p>

                {canGoNext && !hasChoiceOptions && scene.type !== "summary" && (
                  <button type="button" className="vn-dialogue-next" onClick={(event) => { event.stopPropagation(); goNext(); }}>
                    Tiếp tục <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </main>
        {pendingEffects && (
          <div className="absolute inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl border border-white/25 bg-[#0b1723] text-white p-5 shadow-2xl">
              <h3 className="text-base font-black mb-1">Chỉ số thay đổi</h3>
              <p className="text-sm text-white/75 mb-4">
                Lựa chọn của bạn đã tác động đến các chỉ số sau:
              </p>
              <div className="space-y-2">
                {Object.entries(pendingEffects.effects).map(([key, delta]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl bg-white/10 border border-white/15 px-3 py-2"
                  >
                    <span className="text-sm font-bold">
                      {statLabels[key] || key}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-black",
                        Number(delta) >= 0
                          ? "text-[#86efac]"
                          : "text-[#fca5a5]",
                      )}
                    >
                      {Number(delta) >= 0 ? `+${delta}` : delta}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={confirmPendingEffects}
                className="w-full mt-4 bg-[#22c55e] text-white hover:bg-[#16a34a]"
              >
                Đã hiểu
              </Button>
            </div>
          </div>
        )}
    </div>,
    document.body,
  );
}
