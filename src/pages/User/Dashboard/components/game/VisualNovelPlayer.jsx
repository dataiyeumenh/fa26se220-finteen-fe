import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Brain, ChartNoAxesColumn, Coins, Heart, ImageOff, Landmark, Maximize2, Menu, Minimize2, PiggyBank, RotateCcw, ShieldAlert, Target } from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import "./visual-novel.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NeedWantMiniGame } from "./NeedWantMiniGame";
import { BudgetBuilderMiniGame } from "./BudgetBuilderMiniGame";
import { SavingsRaceMiniGame } from "./SavingsRaceMiniGame";

const statDisplay = {
  WEALTH: { label: "Tài sản", icon: Landmark, tone: "wealth" },
  SAVING: { label: "Tiết kiệm", icon: PiggyBank, tone: "saving" },
  FIQ: { label: "IQ tài chính", icon: Brain, tone: "fiq" },
  HAPPINESS: { label: "Hạnh phúc", icon: Heart, tone: "happiness" },
  RISK: { label: "Rủi ro", icon: ShieldAlert, tone: "risk" },
  GOAL: { label: "Mục tiêu", icon: Target, tone: "goal" },
};
const statLabels = Object.fromEntries(
  Object.entries(statDisplay).map(([key, value]) => [key, value.label]),
);

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
    <div className="vn-stats-grid">
      {Object.entries(statDisplay).map(([key, meta]) => {
        const Icon = meta.icon;
        return (
        <div
          key={key}
          className={cn(
            "vn-stat-card",
            `is-${meta.tone}`,
            statFxByKey[key]
              ? statFxByKey[key] > 0
                ? "has-positive-change"
                : "has-negative-change"
              : "",
          )}
        >
          <span className="vn-stat-icon"><Icon size={17} /></span>
          <span className="vn-stat-copy"><small>{meta.label}</small><strong>{Number(stats[key] ?? 0).toLocaleString("vi-VN")}</strong></span>
          {statFxByKey[key] ? (
            <span
              className={cn(
                "vn-stat-delta",
                statFxByKey[key] > 0 ? "is-positive" : "is-negative",
              )}
            >
              {statFxByKey[key] > 0 ? `+${statFxByKey[key]}` : statFxByKey[key]}
            </span>
          ) : null}
        </div>
      )})}
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
  
  // New state for Scene Data Runtime features
  const [gameFlag, setGameFlag] = useState(null);
  const [evidenceScores, setEvidenceScores] = useState({ I: 0, C: 0, P: 0 });
  const [inspectPopup, setInspectPopup] = useState(null);
  const [miniGameCompleted, setMiniGameCompleted] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0); // Track score: 0-6
  const [money, setMoney] = useState(data.initialMoney || 0);
  const [moneyFx, setMoneyFx] = useState(null);

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
      // If src is already provided in character object, use it
      if (character.src) {
        return character;
      }
      
      // Otherwise, build from sprites data
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
    // Track evidence scores
    if (option.evidenceScores) {
      setEvidenceScores((prev) => ({
        I: (prev.I || 0) + (option.evidenceScores.I || 0),
        C: (prev.C || 0) + (option.evidenceScores.C || 0),
        P: (prev.P || 0) + (option.evidenceScores.P || 0),
      }));
    }

    // Track game flag
    if (option.flag) {
      setGameFlag(option.flag);
    }

    // Handle money events
    if (option.moneyEvents && Array.isArray(option.moneyEvents)) {
      const totalMoneyDelta = option.moneyEvents.reduce((sum, evt) => sum + (evt.amount || 0), 0);
      setMoney((prev) => Math.max(0, prev + totalMoneyDelta));
      if (totalMoneyDelta !== 0) {
        setMoneyFx(totalMoneyDelta);
        setTimeout(() => setMoneyFx(null), 1200);
      }
    }

    runTransitionWithEffects({
      sceneId: option.id,
      effects: option.deltaStats || option.effects,
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
    const { passed, score } = result || {};
    setMiniGameDoneByScene((prev) => ({ ...prev, [scene.id]: Boolean(passed) }));
    setMiniGameCompleted(Boolean(passed));
    if (score !== undefined) {
      setMiniGameScore(score);
    }

    const targetSceneId = passed
      ? scene.onPassSceneId || scene.nextSceneId
      : scene.onFailSceneId;
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
    setGameFlag(null);
    setEvidenceScores({ I: 0, C: 0, P: 0 });
    setMiniGameCompleted(false);
    setMiniGameScore(0);
    setMoney(data.initialMoney || 0);
    setMoneyFx(null);
  };

  const evaluateEndingCondition = (condition) => {
    if (condition === "DEFAULT_FALLBACK") return true;
    
    if (typeof condition === "string") {
      try {
        const evaluator = new Function(
          "flag",
          "evidenceScore",
          "miniGameCompleted",
          "stats",
          "money",
          "miniGameScore",
          `const { SAVING = 0, HAPPINESS = 0, RISK = 0, GOAL = 0 } = stats || {}; return Boolean(${condition});`,
        );
        
        const totalEvidenceScore = (evidenceScores.I || 0) + (evidenceScores.C || 0) + (evidenceScores.P || 0);
        
        return evaluator(
          gameFlag,
          totalEvidenceScore,
          miniGameCompleted,
          stats,
          money,
          miniGameScore
        );
      } catch {
        return false;
      }
    }
    
    return false;
  };

  const resolveEnding = () => {
    if (!data.endingRules?.endings) return null;

    const endingRules = data.endingRules;
    const priorityOrder = endingRules.priorityOrder || [];

    for (const endingId of priorityOrder) {
      const ending = endingRules.endings.find((e) => e.id === endingId);
      if (ending && evaluateEndingCondition(ending.condition)) {
        return ending;
      }
    }

    return endingRules.endings[endingRules.endings.length - 1] || null;
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
          <summary className="vn-icon-button vn-menu-trigger" aria-label="Mở menu trò chơi" title="Menu trò chơi"><Menu size={20} /><span className="vn-control-label">Menu</span></summary>
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
        <div className="vn-progress-pill" aria-label={`Tiến độ: cảnh ${sceneIndex + 1} trên ${totalScenes}`}>
          <span>{data.title}</span>
          <div className="vn-progress" role="progressbar" aria-label="Tiến độ chương" aria-valuenow={sceneIndex + 1} aria-valuemin={1} aria-valuemax={totalScenes}><div style={{ width: progress + "%" }} /></div>
          <small>{sceneIndex + 1}/{totalScenes}</small>
        </div>
        <div className="vn-hud-right">
          <div className={cn("vn-wallet", moneyFx && (moneyFx > 0 ? "has-positive-change" : "has-negative-change"))} aria-label={`Số dư ${Number(money || 0).toLocaleString("vi-VN")} đồng`}><Coins size={18} /><span>{Number(money || 0).toLocaleString("vi-VN")}<small> đ</small></span>{moneyFx ? <span className={cn("vn-wallet-delta", moneyFx > 0 ? "is-positive" : "is-negative")}>{moneyFx > 0 ? `+${Number(moneyFx).toLocaleString("vi-VN")}` : Number(moneyFx).toLocaleString("vi-VN")}</span> : null}</div>
          <details className="vn-details vn-stats-details">
            <summary className="vn-icon-button" aria-label="Xem các chỉ số hành trình" title="Chỉ số"><ChartNoAxesColumn size={18} /><span className="vn-control-label">Chỉ số</span></summary>
            <div className="vn-popover vn-stats-popover"><div className="vn-popover-heading"><span>TIẾN TRÌNH</span><h2>Chỉ số hành trình</h2></div><StatsPanel stats={stats} statFxByKey={statFxByKey} /></div>
          </details>
          <button type="button" onClick={toggleFullscreen} className="vn-icon-button vn-fullscreen-button" aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"} title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}>{isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </div>
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

          {isSceneOnlyScreen && scene.inspect && (
            <button
              className="vn-inspect-button"
              onClick={(event) => {
                event.stopPropagation();
                setInspectPopup(scene.inspect);
              }}
              title="Bấm vào phong bì để mở"
              aria-label="Mở phong bì"
            >
              <span>Nhấn vào đây để mở</span>
            </button>
          )}
          {isSceneOnlyScreen && canGoNext && !scene.inspect && <button className="vn-scene-next" onClick={(event) => { event.stopPropagation(); goNext(); }}>Tiếp tục câu chuyện <span>→</span></button>}
          </div>
        </div>
        {scene.type === "minigame" ? (
          <div className="vn-minigame-host">
            {scene.game?.id === "BUDGET_BUILDER_CH02" ? (
              <BudgetBuilderMiniGame
                key={`${scene.id}-${scenePath.length}`}
                game={scene.game}
                onComplete={handleMiniGameComplete}
                className="h-full"
              />
            ) : scene.game?.id === "SAVINGS_RACE_CH02" ? (
              <SavingsRaceMiniGame
                key={`${scene.id}-${scenePath.length}`}
                game={scene.game}
                planFlag={gameFlag}
                onComplete={handleMiniGameComplete}
                className="h-full"
              />
            ) : (
              <NeedWantMiniGame
                key={`${scene.id}-${scenePath.length}`}
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
            ) : scene.type === "ending" ? (
              <div className="vn-dialogue">
                <p className="text-2xl font-black mb-3 text-center">
                  {resolveEnding()?.title || "Kết thúc"}
                </p>
                <p className="text-center mb-4">
                  {resolveEnding()?.storyText || scene.text}
                </p>
                {resolveEnding()?.finalStats && (
                  <div className="bg-white/5 rounded-lg p-3 mb-4 text-sm">
                    <p className="font-bold mb-2">Chỉ số cuối cùng:</p>
                    <div className="space-y-1 text-white/75">
                      {Object.entries(resolveEnding().finalStats).map(([stat, value]) => value !== null && (
                        <div key={stat} className="flex justify-between">
                          <span>{statLabels[stat]}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Link to="/dashboard/user/lessons" className="w-full inline-block bg-green-600 text-white p-3 rounded-lg text-center hover:bg-green-700">
                  Quay lại bản đồ chương
                </Link>
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

                {scene.inspect && (
                  <button
                    type="button"
                    className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectPopup(scene.inspect);
                    }}
                  >
                    {scene.inspect.buttonText}
                  </button>
                )}

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
        {inspectPopup && (
          <div className="absolute inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-3xl rounded-3xl border border-white/25 bg-[#0b1723] text-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-base font-black">{inspectPopup.buttonText}</h3>
                <button
                  onClick={() => {
                    // Handle money events when closing popup
                    if (inspectPopup.moneyEvents && Array.isArray(inspectPopup.moneyEvents)) {
                      const totalMoneyDelta = inspectPopup.moneyEvents.reduce((sum, evt) => sum + (evt.amount || 0), 0);
                      setMoney((prev) => Math.max(0, prev + totalMoneyDelta));
                      if (totalMoneyDelta !== 0) {
                        setMoneyFx(totalMoneyDelta);
                        setTimeout(() => setMoneyFx(null), 1200);
                      }
                    }
                    setInspectPopup(null);
                    if (inspectPopup.autoNextSceneOnClose) {
                      goNext();
                    }
                  }}
                  className="text-white/60 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              {inspectPopup.popupImage && (
                <img src={inspectPopup.popupImage} alt={inspectPopup.buttonText} className="w-full rounded-lg mb-4 max-h-96 object-contain" />
              )}
              <p className="text-sm whitespace-pre-wrap text-white/90 mb-4">
                {inspectPopup.dataText}
              </p>
              <button
                onClick={() => {
                  // Handle money events when closing popup
                  if (inspectPopup.moneyEvents && Array.isArray(inspectPopup.moneyEvents)) {
                    const totalMoneyDelta = inspectPopup.moneyEvents.reduce((sum, evt) => sum + (evt.amount || 0), 0);
                    setMoney((prev) => Math.max(0, prev + totalMoneyDelta));
                    if (totalMoneyDelta !== 0) {
                      setMoneyFx(totalMoneyDelta);
                      setTimeout(() => setMoneyFx(null), 1200);
                    }
                  }
                  setInspectPopup(null);
                  if (inspectPopup.autoNextSceneOnClose) {
                    goNext();
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold"
              >
                Đóng
              </button>
            </div>
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
    </div>,
    document.body,
  );
}
