import { useEffect, useMemo, useRef, useState } from "react";
import { ImageOff, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NeedWantMiniGame } from "./NeedWantMiniGame";

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
  isFullscreen = false,
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
        isFullscreen
          ? "bottom-32 md:bottom-36 w-[51%] max-w-[450px]"
          : "bottom-36 md:bottom-40 w-[34%] max-w-[300px]",
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
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
    </>
  );
}

function SpeakerTag({ scene }) {
  if (scene.type !== "dialogue") return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-[#22c55e]/20 text-[#dcfce7] border border-[#22c55e]/40 mb-2">
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
            {stats[key] ?? 0}
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

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border-2 border-[#22c55e]/15 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#1a3a1a]">
              {data.title}
            </h1>
            <p className="text-sm text-[#1a3a1a]/65">{data.subtitle}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={restart}
            className="border-[#1a3a1a]/20 text-[#1a3a1a]"
          >
            <RotateCcw className="w-4 h-4" /> Chơi lại
          </Button>
        </div>

        <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#22c55e] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1.5 text-xs font-semibold text-[#1a3a1a]/65">
          Cảnh {sceneIndex + 1}/{totalScenes}
        </div>
        <StatsPanel stats={stats} statFxByKey={statFxByKey} />
      </div>

      <div
        ref={gameContainerRef}
        className={cn(
          "relative overflow-hidden border-2 border-[#22c55e]/15 bg-[#0f172a]",
          isFullscreen
            ? "min-h-screen rounded-none"
            : "min-h-[560px] md:min-h-[620px] rounded-3xl",
          canGoNext &&
            !hasChoiceOptions &&
            !isSceneOnlyScreen &&
            "cursor-pointer",
        )}
        onClick={canGoNext && isSceneOnlyScreen ? goNext : undefined}
      >
        <SceneBackground
          src={scene.background}
          showMissingHint={scene.type !== "minigame"}
        />

        <button
          type="button"
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            toggleFullscreen();
          }}
          className="absolute top-4 right-4 z-40 inline-flex items-center justify-center rounded-full border border-white/30 bg-black/25 text-white p-2 hover:bg-black/40 transition-colors"
          aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

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
                isFullscreen={isFullscreen}
              />
            ))}
          </>
        )}

        {scene.type === "minigame" ? (
          <div className="absolute inset-0 z-30 p-3 md:p-4">
            <NeedWantMiniGame
              game={scene.game}
              onComplete={handleMiniGameComplete}
              className="h-full"
              immersive
            />
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-5">
            {isSceneOnlyScreen ? null : scene.type === "summary" ? (
              <div
                className={cn(
                  "rounded-3xl bg-[#0b1723]/88 backdrop-blur border border-white/20 p-4 md:p-5",
                  canGoNext && "cursor-pointer",
                )}
                onClick={canGoNext ? goNext : undefined}
              >
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-[#22c55e]/20 text-[#dcfce7] border border-[#22c55e]/40 mb-2">
                  Tổng kết chương
                </div>
                <p className="text-xl font-black text-white mb-2">
                  {scene.title || "Hoàn thành chương"}
                </p>
                {scene.nextChapter && (
                  <p className="text-sm text-white/85">
                    Chương tiếp theo: {scene.nextChapter.toUpperCase()}
                  </p>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "rounded-3xl bg-[#0b1723]/88 backdrop-blur border border-white/20 p-4 md:p-5",
                  canGoNext && "cursor-pointer",
                )}
                onClick={canGoNext ? goNext : undefined}
              >
                {scene.type === "dialogue" && <SpeakerTag scene={scene} />}
                <p className="text-sm md:text-base leading-relaxed text-white/95">
                  {scene.text || scene.prompt}
                </p>

                {hasChoiceOptions && (
                  <div className="space-y-2 mt-3">
                    {scene.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          selectChoice(option);
                        }}
                        className="w-full text-left rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {canGoNext && !hasChoiceOptions && scene.type !== "summary" && (
                  <p className="text-[11px] md:text-xs text-white/65 mt-3">
                    Nhấn vào khung thoại để tiếp tục
                  </p>
                )}
              </div>
            )}
          </div>
        )}

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
      </div>
    </div>
  );
}
