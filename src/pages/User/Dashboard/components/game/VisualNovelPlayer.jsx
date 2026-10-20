import { FuturePlanMiniGame } from "./FuturePlanMiniGame.jsx";
import { buildPlanReview, chapterEightLearning, chapterEightSettlement, planProjection, resolveFutureScene } from "./futurePlanRules.js";
import { LoanDetectiveMiniGame } from "./LoanDetectiveMiniGame";
import { chapterSixLearning } from "./loanDetectiveRules.js";
import { ScamOrSafeMiniGame } from "./ScamOrSafeMiniGame.jsx";
import { chapterSevenLearning } from "./scamOrSafeRules.js";
import { readNovelProgress, saveNovelProgress } from "./visualNovelProgress.js";
import { CompoundTimelineMiniGame } from "./CompoundTimelineMiniGame";
import { ChapterFiveReflection, ChapterFivePlanSummary, InspectCardsDialog } from "./ChapterFiveActivities";
import { chapterFiveLearning } from "./compoundTimelineRules";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Coins,
  FileSearch,
  ImageOff,
  Lock,
  Maximize2,
  Menu,
  Minimize2,
  RotateCcw,
} from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import "./visual-novel.css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NeedWantMiniGame } from "./NeedWantMiniGame";
import { BudgetBuilderMiniGame } from "./BudgetBuilderMiniGame";
import { SavingsRaceMiniGame } from "./SavingsRaceMiniGame";
import { CareerMatchMiniGame } from "./CareerMatchMiniGame";
import { SmartShoppingMiniGame } from "./SmartShoppingMiniGame";
import { InspectHotspot } from "./InspectHotspot.jsx";
import "./chapter-three.css";
import "./inspect-theme.css";
import { chapterMiniGameSummary, flexibleReserveLock, recordMiniGameResult, summarizeMiniGames } from "./miniGameRules";

function applyStatEffects(current, effects = {}) {
  const next = { ...current };
  Object.entries(effects).forEach(([key, delta]) => {
    const currentValue = next[key] ?? 0;
    next[key] = Math.min(100, Math.max(0, currentValue + Number(delta || 0)));
  });
  return next;
}

function evaluateCondition(stats, condition, flags = {}) {
  if (condition?.check || condition?.expression || condition?.formula) {
    const expression = String(
      condition.check || condition.expression || condition.formula || "",
    ).trim();

    if (!expression) return false;

    try {
      const evaluator = new Function(
        "stats",
        "flags",
        `const { WEALTH = 0, SAVINGS = 0, SAVING = 0, FIQ = 0, HAPPINESS = 0, RISK = 0, GOAL = 0 } = stats || {}; return Boolean(${expression});`,
      );
      return evaluator(stats || {}, flags || {});
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

function CharacterSprite({ src, alt, position, dimmed = false }) {
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
        onLoad={(event) => {
          const img = event.currentTarget;
          img.parentElement.style.setProperty(
            "--scene-ratio",
            img.naturalWidth / img.naturalHeight,
          );
        }}
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
    </>
  );
}

function SpeakerTag({ scene }) {
  if (scene.type !== "dialogue") return null;

  return <div className="vn-speaker">{scene.speaker || "Nhân vật"}</div>;
}

function EndingReport({ report }) {
  if (!report) return null;
  const format = (value) => Number(value || 0).toLocaleString("vi-VN");

  return (
    <div className="vn-report">
      <div className="vn-report-grid">
        <div className="vn-report-card">
          <small>Số dư cuối chương</small>
          <strong>{format(report.money.end)} đ</strong>
          <span>Ban đầu {format(report.money.start)} đ</span>
        </div>
        {report.learningScore !== null && (
          <div className="vn-report-card">
            <small>Điểm học chương</small>
            <strong>{report.learningScore}/100</strong>
            <span>{report.bandLabel}</span>
          </div>
        )}
      </div>
      <ul className="vn-report-metrics">
        {report.choicePercent !== null && (
          <li>
            Quyết định trong truyện: <b>{report.choicePercent}%</b>
            {report.firstPercent !== null &&
            report.firstPercent !== report.choicePercent ? (
              <span> (lần đầu {report.firstPercent}%)</span>
            ) : null}
          </li>
        )}
        {report.miniPercent !== null && (
          <li>
            Mini-game{report.miniGameLabel ? `: ${report.miniGameLabel}` : ''}: <b>{report.miniPercent}%</b>
            {report.miniFirstPercent != null && report.miniFirstPercent !== report.miniPercent && <span> (lần đầu {report.miniFirstPercent}%)</span>}
          </li>
        )}
        {report.reflectionPercent !== null && (
          <li>
            Phản tư sau trải nghiệm: <b>{report.reflectionPercent}%</b>
          </li>
        )}
      </ul>
      {report.decisions.length > 0 && (
        <div className="vn-report-decisions">
          <h3>Những quyết định của bạn</h3>
          <ol>
            {report.decisions.map((item) => (
              <li key={item.title + item.label}>
                <b>{item.title}</b>
                <span>
                  {item.label}
                  {item.revised ? " (đã xem xét lại)" : ""}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {report.achieved && (
        <p className="vn-report-line">
          <b>Đã làm tốt:</b> {report.achieved}
        </p>
      )}
      {report.practice && (
        <p className="vn-report-line">
          <b>Cần luyện thêm:</b> {report.practice}
        </p>
      )}
      {report.next && (
        <p className="vn-report-line">
          <b>Chương tiếp theo:</b> {report.next}
        </p>
      )}
    </div>
  );
}

export function VisualNovelPlayer({ data }) {
  const [savedProgress] = useState(() => {
    try { return readNovelProgress(window.sessionStorage, data); } catch { return null; }
  });
  const learningSummary = data.metadata?.chapterId === 'CH08' ? chapterEightLearning : data.metadata?.chapterId === 'CH07' ? chapterSevenLearning : data.metadata?.chapterId === 'CH06' ? chapterSixLearning : chapterFiveLearning;
  const gameContainerRef = useRef(null);
  const menuDetailsRef = useRef(null);
  const stageRef = useRef(null);
  const dialogueRef = useRef(null);
  const pendingTransitionRef = useRef(null);
  const committedDecisionsRef = useRef(new Set(savedProgress?.committedDecisions || []));
  const marketSettlementAppliedRef = useRef(Boolean(savedProgress?.moneyEventsApplied?.CH08_MARKET_SETTLEMENT));
  const preloadedImageStateRef = useRef(new Map());
  const preloadingImageRef = useRef(new Map());

  const [scenePath, setScenePath] = useState(savedProgress?.scenePath || [0]);
  const [miniGameDoneByScene, setMiniGameDoneByScene] = useState(savedProgress?.miniGameDoneByScene || {});
  const [sceneActionApplied, setSceneActionApplied] = useState(savedProgress?.sceneActionApplied || {});
  const [stats, setStats] = useState(savedProgress?.stats || data.initialStats || {});
  const [reviewOffset, setReviewOffset] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingEffects, setPendingEffects] = useState(null);

  // New state for Scene Data Runtime features
  const [gameFlag, setGameFlag] = useState(savedProgress?.gameFlag || null);
  const [flags, setFlags] = useState(savedProgress?.flags || {});
  const [choiceLedger, setChoiceLedger] = useState(savedProgress?.choiceLedger || {});
  const [firstChoiceScores, setFirstChoiceScores] = useState(savedProgress?.firstChoiceScores || {});
  const [inspectedIds, setInspectedIds] = useState(savedProgress?.inspectedIds || {});
  const [moneyEventsApplied, setMoneyEventsApplied] = useState(savedProgress?.moneyEventsApplied || {});
  const [budgetAllocations, setBudgetAllocations] = useState(savedProgress?.budgetAllocations || {});
  const [inspectPopup, setInspectPopup] = useState(null);
  const [miniGameCompleted, setMiniGameCompleted] = useState(savedProgress?.miniGameCompleted || false);
  const [miniGameResults, setMiniGameResults] = useState(savedProgress?.miniGameResults || {});
  const { score: miniGameScore, percent: miniGamePercent } = summarizeMiniGames(miniGameResults);
  const [money, setMoney] = useState(savedProgress?.money ?? data.initialMoney ?? 0);
  const [moneyFx, setMoneyFx] = useState(null);

  const isReviewing = reviewOffset > 0;
  const sceneIndex = scenePath[scenePath.length - 1 - reviewOffset];

  // Effective choice evidence: each choice group keeps only its current option.
  const { evidenceScores, reflectionScore } = useMemo(() => {
    const totals = { I: 0, C: 0, P: 0 };
    let reflection = 0;
    Object.values(choiceLedger).forEach((entry) => {
      totals.I += entry.evidenceScores?.I || 0;
      totals.C += entry.evidenceScores?.C || 0;
      totals.P += entry.evidenceScores?.P || 0;
      reflection += entry.reflectionScore || 0;
    });
    return { evidenceScores: totals, reflectionScore: reflection };
  }, [choiceLedger]);
  const totalScenes = data.scenes.length;
  const scene = data.metadata?.chapterId === 'CH08' ? resolveFutureScene(data.scenes[sceneIndex], miniGameResults, flags) : data.scenes[sceneIndex];
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

      const branchResult = evaluateCondition(stats, candidate.condition, flags);
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

  const preloadImage = useCallback((src) => {
    if (!src || typeof src !== "string") return;

    const state = preloadedImageStateRef.current.get(src);
    if (state === "loaded" || state === "loading") return;

    preloadedImageStateRef.current.set(src, "loading");

    const image = new Image();
    image.decoding = "async";

    image.onload = () => {
      preloadedImageStateRef.current.set(src, "loaded");
      preloadingImageRef.current.delete(src);
    };

    image.onerror = () => {
      preloadedImageStateRef.current.set(src, "error");
      preloadingImageRef.current.delete(src);
    };

    preloadingImageRef.current.set(src, image);
    image.src = src;
  }, []);

  const getSceneImageUrls = useCallback(
    (targetScene) => {
      if (!targetScene) return [];

      const urls = new Set();
      if (targetScene.background) urls.add(targetScene.background);
      if (targetScene.sceneArt) urls.add(targetScene.sceneArt);

      (targetScene.characters || []).forEach((character) => {
        if (character?.src) {
          urls.add(character.src);
          return;
        }

        const spriteSet = data.sprites?.[character?.id] || {};
        const fallbackSrc =
          spriteSet[character?.expression] || spriteSet.neutral || "";
        if (fallbackSrc) urls.add(fallbackSrc);
      });

      return Array.from(urls);
    },
    [data.sprites],
  );

  const expandTargetSceneIds = useCallback(
    (rawIds) => {
      const queue = rawIds.filter(Boolean);
      const visited = new Set();
      const expanded = new Set();
      let guard = 0;

      while (queue.length && guard < data.scenes.length * 2) {
        const sceneId = queue.shift();
        if (!sceneId || visited.has(sceneId)) continue;
        visited.add(sceneId);

        const targetIndex = sceneIndexById[sceneId];
        if (typeof targetIndex !== "number") continue;

        const targetScene = data.scenes[targetIndex];
        if (!targetScene) continue;

        if (targetScene.type === "conditional") {
          if (targetScene.ifTrueSceneId) queue.push(targetScene.ifTrueSceneId);
          if (targetScene.ifFalseSceneId)
            queue.push(targetScene.ifFalseSceneId);
        } else {
          expanded.add(sceneId);
        }

        guard += 1;
      }

      return Array.from(expanded);
    },
    [data.scenes, sceneIndexById],
  );

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

  const canGoNext = isReviewing || (
    scene.type !== "activity" &&
    (scene.requiredInspections || []).every(id => inspectedIds[id]) &&
    (scene.type !== "minigame" || Boolean(miniGameDoneByScene[scene.id])) &&
    scene.type !== "choice" &&
    !hasChoiceOptions &&
    sceneIndex < totalScenes - 1);

  const goToSceneIndex = (nextIndex) => {
    const resolved = resolveNavigableSceneIndex(nextIndex);
    setScenePath((current) => [...current, resolved]);
  };

  const applyOneTimeSceneEffect = (sceneId, effects, force = false) => {
    if (!effects || (!force && sceneActionApplied[sceneId])) return;

    setStats((current) => applyStatEffects(current, effects));
    setSceneActionApplied((prev) => ({ ...prev, [sceneId]: true }));
  };

  const runTransitionWithEffects = ({
    sceneId,
    effects,
    transition,
    force = false,
  }) => {
    if (!effects || (!force && sceneActionApplied[sceneId])) {
      transition();
      return;
    }

    pendingTransitionRef.current = transition;
    setPendingEffects({ sceneId, effects, force });
  };

  const confirmPendingEffects = () => {
    if (!pendingEffects) return;

    applyOneTimeSceneEffect(
      pendingEffects.sceneId,
      pendingEffects.effects,
      pendingEffects.force,
    );
    setPendingEffects(null);

    const nextTransition = pendingTransitionRef.current;
    pendingTransitionRef.current = null;
    nextTransition?.();
  };

  const goNext = (completedInspection = null) => {
    if (isReviewing) { setReviewOffset(offset => Math.max(0, offset - 1)); return; }
    // Closing a required card and advancing happen in the same React event.
    const completedRequired = scene.requiredInspections?.length && scene.requiredInspections.every(id => inspectedIds[id] || id === completedInspection);
    if (!canGoNext && !completedRequired) return;

    if (data.metadata?.chapterId === 'CH08' && scene.marketSettlement) {
      const settlement = chapterEightSettlement(miniGameResults, flags);
      if (!moneyEventsApplied[settlement.eventId] && !marketSettlementAppliedRef.current) {
        marketSettlementAppliedRef.current = true;
        setMoneyEventsApplied(previous => ({ ...previous, [settlement.eventId]: true }));
        setMoney(previous => Math.max(0, previous + settlement.delta));
        if (settlement.delta) setMoneyFx(settlement.delta);
      }
    }

    runTransitionWithEffects({
      sceneId: scene.id,
      effects: scene.effects,
      transition: () => {
        if (scene.setFlags) {
          setFlags((prev) => ({ ...prev, ...scene.setFlags }));
        }
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

  const getOptionLock = (option) => {
    const reserveLock = flexibleReserveLock(option, budgetAllocations);
    if (reserveLock) return reserveLock;
    const requires = option.requires;
    if (!requires) return null;
    const unmet =
      (requires.minMoney != null && money < requires.minMoney) ||
      (requires.flags || []).some((key) => !flags[key]) ||
      (requires.inspected || []).some((key) => !inspectedIds[key]);
    return unmet ? requires.lockedReason || "Chưa đủ điều kiện để chọn." : null;
  };

  const openInspect = (inspect) => {
    if (!isReviewing && inspect.id && !inspect.cards)
      setInspectedIds((prev) => ({ ...prev, [inspect.id]: true }));
    setInspectPopup(inspect.planResultFrom ? { ...inspect, ...buildPlanReview(miniGameResults[inspect.planResultFrom]?.ui) } : inspect);
  };

  const closeInspectPopup = () => {
    if (!inspectPopup) return;
    if (isReviewing) { setInspectPopup(null); return; }
    const popup = inspectPopup;
    if (popup.id && popup.cards) setInspectedIds(prev => ({ ...prev, [popup.id]: true }));
    if (Array.isArray(popup.moneyEvents)) {
      const newEvents = popup.moneyEvents.filter((evt, index) =>
        !moneyEventsApplied[evt.eventId || `${popup.id || "inspect"}:${index}`]);
      if (newEvents.length) {
        const delta = newEvents.reduce((sum, evt) => sum + Number(evt.amount || 0), 0);
        setMoneyEventsApplied(prev => ({ ...prev, ...Object.fromEntries(newEvents.map((evt, i) => [evt.eventId || `${popup.id || "inspect"}:${i}`, true])) }));
        setMoney(prev => Math.max(0, prev + delta));
        if (delta) setMoneyFx(delta);
      }
    }
    if (popup.setFlags) setFlags(prev => ({ ...prev, ...popup.setFlags }));
    setInspectPopup(null);
    if (popup.autoNextSceneOnClose) goNext(popup.id);
  };

  const selectChoice = (option) => {
    if (isReviewing) return;
    if (getOptionLock(option)) return;
    if (data.metadata?.lockDecisions && committedDecisionsRef.current.has(scene.id)) return;
    if (option.deferLedger) {
      const nextIndex = sceneIndexById[option.nextSceneId];
      if (typeof nextIndex === 'number') goToSceneIndex(nextIndex);
      return;
    }
    if (data.metadata?.lockDecisions) committedDecisionsRef.current.add(scene.id);

    // A choice group keeps one effective option; re-choosing reverts the old deltas first.
    const groupId = scene.choiceGroup || scene.id;
    const previous = choiceLedger[groupId];
    const isSame = previous?.optionId === option.id &&
      (!option.answer || JSON.stringify(previous.answer) === JSON.stringify(option.answer));
    const nextDelta = option.deltaStats || option.effects || {};

    if (!isSame) {
      setChoiceLedger((prev) => ({
        ...prev,
        [groupId]: {
          optionId: option.id,
          sceneTitle: scene.title,
          label: option.label || scene.title,
          deltaStats: nextDelta,
          evidenceScores: option.evidenceScores || null,
          reflectionScore: option.reflectionScore || 0,
          reflectionEvidenceScores: option.reflectionEvidenceScores || null,
          answer: option.answer || null,
          firstOptionId: previous?.firstOptionId || option.id,
          firstLabel: previous?.firstLabel || option.label || scene.title,
          firstEvidenceScores: previous ? previous.firstEvidenceScores : option.evidenceScores || null,
          revised: Boolean(previous),
        },
      }));
      setFirstChoiceScores((prev) =>
        groupId in prev
          ? prev
          : { ...prev, [groupId]: option.evidenceScores || null },
      );
    }

    // Track game flag
    if (option.flag) {
      setGameFlag(option.flag);
    }
    if (option.flag || option.setFlags || (previous && !isSame)) {
      setFlags((prev) => ({
        ...prev,
        ...(option.flag ? { [option.flag]: true } : {}),
        ...(option.setFlags || {}),
        ...(previous && !isSame ? { choiceRevised: true } : {}),
      }));
    }

    // Handle money events (each transaction is recorded once)
    if (option.moneyEvents && Array.isArray(option.moneyEvents)) {
      const freshEvents = option.moneyEvents
        .map((evt, index) => ({
          ...evt,
          key: evt.eventId || `${option.id}:${index}`,
        }))
        .filter((evt) => !moneyEventsApplied[evt.key]);
      const totalMoneyDelta = freshEvents.reduce(
        (sum, evt) => sum + (evt.amount || 0),
        0,
      );
      if (freshEvents.length) {
        setMoneyEventsApplied((prev) => ({
          ...prev,
          ...Object.fromEntries(freshEvents.map((evt) => [evt.key, true])),
        }));
      }
      setMoney((prev) => Math.max(0, prev + totalMoneyDelta));
      if (totalMoneyDelta !== 0) {
        setMoneyFx(totalMoneyDelta);
        setTimeout(() => setMoneyFx(null), 1200);
      }
    }

    const net = {};
    if (!isSame && !(data.metadata?.preserveFirstChoiceStats && previous)) {
      Object.entries(previous?.deltaStats || {}).forEach(([key, delta]) => {
        net[key] = (net[key] || 0) - Number(delta || 0);
      });
      Object.entries(nextDelta).forEach(([key, delta]) => {
        net[key] = (net[key] || 0) + Number(delta || 0);
      });
    }
    const effects = Object.fromEntries(
      Object.entries(net).filter(([, delta]) => delta !== 0),
    );

    runTransitionWithEffects({
      sceneId: option.id,
      effects: Object.keys(effects).length ? effects : null,
      force: true,
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
    if (isReviewing) return;
    if (scene.game?.id === 'LIFE_PLAN_CH08' && result?.ui?.budgets) {
      const projection = planProjection(result.ui.budgets);
      setFlags(prev => ({ ...prev, plan_draft_feasible: projection.feasible, plan_year_savings: projection.yearSavings }));
    }
    if (scene.game?.id === 'COMPOUND_TIMELINE_CH05') setFlags(prev => ({ ...prev, mini_game_completed: true }));
    if (result?.allocations) setBudgetAllocations(result.allocations);
    setMiniGameResults(previous => recordMiniGameResult(previous, {
      chapterId: data.metadata?.chapterId || data.id,
      sceneId: scene.id,
      gameId: scene.game?.id || scene.id,
    }, result || {}));
    setMiniGameDoneByScene((prev) => ({
      ...prev,
      [scene.id]: true,
    }));
    setMiniGameCompleted(true);

    const targetSceneId = scene.nextSceneId || scene.onPassSceneId;
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
    committedDecisionsRef.current.clear();
    marketSettlementAppliedRef.current = false;
    setScenePath([resolveNavigableSceneIndex(0)]);
    setMiniGameDoneByScene({});
    setSceneActionApplied({});
    setStats(data.initialStats || {});
    setReviewOffset(0);
    setPendingEffects(null);
    pendingTransitionRef.current = null;
    setGameFlag(null);
    setFlags({});
    setChoiceLedger({});
    setFirstChoiceScores({});
    setInspectedIds({});
    setMoneyEventsApplied({});
    setBudgetAllocations({});
    setMiniGameCompleted(false);
    setMiniGameResults({});
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
          "flags",
          "reflectionScore",
          "choicePercent", "learningScore", "coreCalculationsCorrect", "reflectionCompleted",
          "miniGameGoalEligible", "miniGameNeedsPractice",
          `const { SAVING = 0, HAPPINESS = 0, RISK = 0, GOAL = 0 } = stats || {}; return Boolean(${condition});`,
        );

        const totalEvidenceScore =
          (evidenceScores.I || 0) +
          (evidenceScores.C || 0) +
          (evidenceScores.P || 0);

        const learning = data.endingReport?.choiceGroupMaxima
          ? learningSummary(choiceLedger, miniGameResults, data.endingReport) : {};
        const miniGames = chapterMiniGameSummary(miniGameResults, data.endingReport || {});
        return evaluator(
          gameFlag,
          totalEvidenceScore,
          miniGameCompleted,
          stats,
          money,
          miniGameScore,
          flags,
          reflectionScore,
          learning.choicePercent, learning.learningScore, learning.coreCalculationsCorrect, learning.reflectionCompleted,
          miniGames.miniGameGoalEligible, miniGames.miniGameNeedsPractice,
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

  const buildEndingReport = () => {
    const config = data.endingReport;
    if (!config) return null;
    const normalizedLearning = config.choiceGroupMaxima ? learningSummary(choiceLedger, miniGameResults, config) : null;

    const sumScore = (scores) =>
      (scores?.I || 0) + (scores?.C || 0) + (scores?.P || 0);
    const scored = Object.entries(choiceLedger).filter(
      ([, entry]) => entry.evidenceScores,
    );
    const maxPerChoice = config.maxChoiceScore || 6;
    const toPercent = (value) =>
      scored.length
        ? Math.round((100 * value) / (maxPerChoice * scored.length))
        : null;
    const choicePercent = toPercent(
      scored.reduce(
        (total, [, entry]) => total + sumScore(entry.evidenceScores),
        0,
      ),
    );
    const firstPercent = toPercent(
      scored.reduce(
        (total, [group]) => total + sumScore(firstChoiceScores[group]),
        0,
      ),
    );
    const miniPercent = config.requiredGameIds ? chapterMiniGameSummary(miniGameResults, config).miniPercent : miniGamePercent;
    const reflectionPercent = config.reflectionMax
      ? Math.min(
          100,
          Math.round((100 * reflectionScore) / config.reflectionMax),
        )
      : null;

    const weights = config.weights || {
      choices: 0.6,
      miniGame: 0.3,
      reflection: 0.1,
    };
    const parts = [
      [choicePercent, weights.choices],
      [miniPercent, weights.miniGame],
      [reflectionPercent, weights.reflection],
    ].filter(([value]) => value !== null);
    const weightTotal = parts.reduce((total, [, weight]) => total + weight, 0);
    const learningScore = weightTotal
      ? Math.round(
          parts.reduce((total, [value, weight]) => total + value * weight, 0) /
            weightTotal,
        )
      : null;
    const band = (config.bands || []).find(
      (item) => learningScore !== null && learningScore >= item.min,
    );

    const pickLine = (list) =>
      (list || []).find(
        (item) => !item.when || evaluateEndingCondition(item.when),
      )?.text || null;

    return {
      money: { start: data.initialMoney || 0, end: money },
      choicePercent,
      firstPercent,
      miniPercent,
      miniGameScore,
      reflectionPercent,
      learningScore,
      bandLabel: band?.label || null,
      decisions: Object.values(choiceLedger).map((entry) => ({
        title: entry.sceneTitle,
        label: entry.label,
        revised: entry.revised,
      })),
      achieved: pickLine(config.achieved),
      practice: pickLine(config.practice),
      next: config.nextStep || null,
      ...(config.choiceGroupMaxima ? {
        ...Object.fromEntries(Object.entries(normalizedLearning).map(([key, value]) => [key, typeof value === 'number' ? Math.round(value) : value])),
        bandLabel: (config.bands || []).find(item => normalizedLearning.learningScore >= item.min)?.label || null,
        miniGameLabel: config.miniGameLabel,
        miniFirstPercent: ['CH06', 'CH07', 'CH08'].includes(data.metadata?.chapterId)
          ? (() => { const games = Object.values(miniGameResults).filter(result => config.requiredGameIds.includes(result.gameId)); const total = games.reduce((n, g) => n + g.total, 0); return total ? Math.round(games.reduce((n, g) => n + g.firstPercent * g.total, 0) / total) : null; })()
          : Object.values(miniGameResults).find(result => result.gameId === 'COMPOUND_TIMELINE_CH05')?.firstPercent,
        statDeltas: Object.fromEntries(Object.keys(data.initialStats).map(key => [key, (stats[key] || 0) - data.initialStats[key]])),
      } : {}),
    };
  };

  useEffect(() => {
    // A choice with a stats popup commits atomically after the player acknowledges it.
    // Until then keep the previous checkpoint, so reload cannot omit its delta.
    if (pendingEffects || !data.metadata?.persistProgress) return;
    try {
      saveNovelProgress(window.sessionStorage, data, {
        scenePath, miniGameDoneByScene, sceneActionApplied, stats, gameFlag, flags,
        choiceLedger, firstChoiceScores, inspectedIds, moneyEventsApplied,
        budgetAllocations, miniGameCompleted, miniGameResults, money,
        committedDecisions: [...committedDecisionsRef.current],
      });
    } catch { /* Session storage is optional. */ }
  }, [data, pendingEffects, scenePath, miniGameDoneByScene, sceneActionApplied, stats,
    gameFlag, flags, choiceLedger, firstChoiceScores, inspectedIds, moneyEventsApplied,
    budgetAllocations, miniGameCompleted, miniGameResults, money]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!scene) return;

    const nextTargets = [
      scene.nextSceneId,
      scene.onPassSceneId,
      scene.onFailSceneId,
      ...(scene.options || []).map((option) => option.nextSceneId),
    ].filter(Boolean);

    if (!nextTargets.length) return;

    expandTargetSceneIds(nextTargets).forEach((sceneId) => {
      const targetIndex = sceneIndexById[sceneId];
      if (typeof targetIndex !== "number") return;

      const targetScene = data.scenes[targetIndex];
      getSceneImageUrls(targetScene).forEach(preloadImage);
    });
  }, [
    data.scenes,
    expandTargetSceneIds,
    getSceneImageUrls,
    preloadImage,
    scene,
    sceneIndexById,
  ]);

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
    const preloadingImages = preloadingImageRef.current;

    return () => {
      preloadingImages.clear();
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

  const collapseMenuOnGameClick = (event) => {
    const menuDetails = menuDetailsRef.current;
    if (!menuDetails?.open) return;

    if (event.target instanceof Element && event.target.closest(".vn-menu")) {
      return;
    }

    menuDetails.open = false;
  };

  return createPortal(
    <div
      ref={gameContainerRef}
      className="vn-player"
      data-scene-id={scene.id}
      onPointerDownCapture={collapseMenuOnGameClick}
    >
      <header className="vn-toolbar">
        <div className="vn-toolbar-left">
          <details ref={menuDetailsRef} className="vn-details vn-menu">
            <summary
              className="vn-icon-button vn-menu-trigger"
              aria-label="Mở menu trò chơi"
              title="Menu trò chơi"
            >
              <Menu size={20} />
              <span className="vn-control-label">Menu</span>
            </summary>
            <div className="vn-popover vn-menu-panel">
              <div className="vn-heading">
                <span className="vn-eyebrow">HÀNH TRÌNH FINTEEN</span>
                <h1>{data.title}</h1>
              </div>
              <p className="vn-menu-progress">
                Cảnh {sceneIndex + 1} / {totalScenes}
              </p>
              <div
                className="vn-progress"
                role="progressbar"
                aria-label="Tiến độ chương"
                aria-valuenow={sceneIndex + 1}
                aria-valuemin={0}
                aria-valuemax={totalScenes}
              >
                <div style={{ width: progress + "%" }} />
              </div>
              <div className="vn-menu-actions">
                <button
                  type="button"
                  className="vn-icon-button"
                  disabled={reviewOffset >= scenePath.length - 1 || Boolean(pendingEffects) || Boolean(inspectPopup)}
                  onClick={() => {
                    setReviewOffset(offset => Math.min(offset + 1, scenePath.length - 1));
                    if (menuDetailsRef.current) menuDetailsRef.current.open = false;
                  }}
                  title="Lùi lại một cảnh đã đi qua; giữ nguyên tiền và điểm"
                >
                  <ArrowLeft size={18} />
                  <span>Lùi lại một cảnh</span>
                </button>
                <Link
                  to="/dashboard/user/lessons"
                  className="vn-icon-button"
                  aria-label="Về bản đồ chương"
                  title="Về bản đồ chương"
                >
                  <ArrowLeft size={18} />
                </Link>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="vn-icon-button"
                  aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
                >
                  {isFullscreen ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
                <details className="vn-restart-confirm">
                  <summary>
                    <RotateCcw size={16} /> Chơi lại
                  </summary>
                  <p>Đặt lại tiến độ và chỉ số của lượt chơi này?</p>
                  <button
                    type="button"
                    onClick={(event) => {
                      restart();
                      event.currentTarget.closest("details").open = false;
                    }}
                  >
                    Bắt đầu lại chương
                  </button>
                </details>
              </div>
            </div>
          </details>
          <div
            className={cn(
              "vn-wallet",
              moneyFx &&
                (moneyFx > 0 ? "has-positive-change" : "has-negative-change"),
            )}
            aria-label={`Số dư ${Number(money || 0).toLocaleString("vi-VN")} đồng`}
          >
            <Coins size={18} />
            <span>
              {Number(money || 0).toLocaleString("vi-VN")}
              <small> đ</small>
            </span>
            {moneyFx ? (
              <span
                className={cn(
                  "vn-wallet-delta",
                  moneyFx > 0 ? "is-positive" : "is-negative",
                )}
              >
                {moneyFx > 0
                  ? `+${Number(moneyFx).toLocaleString("vi-VN")}`
                  : Number(moneyFx).toLocaleString("vi-VN")}
              </span>
            ) : null}
          </div>

        </div>
      </header>
      {isReviewing && <div className="vn-review-indicator" role="status">Đang xem lại <button onClick={() => { setReviewOffset(0); setInspectPopup(null); }}>Về cảnh đang chơi →</button></div>}
      <main
        className="vn-play-area"
        onClick={(event) => {
          if (
            scene.id === "CH01_SC01_A" ||
            Boolean(scene.inspect?.hotspot) ||
            !canGoNext ||
            pendingEffects ||
            hasChoiceOptions ||
            scene.type === "minigame" ||
            event.target.closest(
              "button, a, input, select, textarea, summary, details, .vn-dialogue-dock",
            ) ||
            window.getSelection()?.toString()
          )
            return;
          goNext();
        }}
      >
        <div className="vn-stage-space">
          {scene.background && (
            <img
              key={`ambient-${scene.background}`}
              src={scene.background}
              alt=""
              aria-hidden="true"
              className="vn-ambient"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
          <div ref={stageRef} className="vn-stage">
            <SceneBackground
              key={scene.background}
              src={scene.background}
              showMissingHint={scene.type !== "minigame"}
            />
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

            {isSceneOnlyScreen && scene.inspect?.hotspot ? (
              <InspectHotspot key={scene.id} sceneId={scene.id} inspect={scene.inspect} onOpen={openInspect} />
            ) : isSceneOnlyScreen && scene.inspect && (
              <button
                className="vn-inspect-button"
                onClick={(event) => {
                  event.stopPropagation();
                  openInspect(scene.inspect);
                }}
                title="Bấm vào phong bì để mở"
                aria-label="Mở phong bì"
              >
                <span>Nhấn vào đây để mở</span>
              </button>
            )}
            {isSceneOnlyScreen && canGoNext && !scene.inspect && (
              <button
                className="vn-scene-next"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
              >
                Tiếp tục câu chuyện <span>→</span>
              </button>
            )}
          </div>
        </div>
        {isReviewing && ['choice', 'activity', 'minigame', 'ending'].includes(scene.type) ? (
          <div className="vn-choice-overlay"><section className="vn-choice-panel vn-review-panel" aria-label="Xem lại cảnh đã đi qua">
            <span className="vn-choice-eyebrow">ĐANG XEM LẠI</span>
            <h2>{scene.prompt || scene.title}</h2>
            {scene.type === 'choice' ? <ul className="vn-review-options">{scene.options.map(option => <li key={option.id}>{option.label}</li>)}</ul>
              : <p>{scene.type === 'minigame' ? 'Bạn đã đi qua mini-game này. Kết quả được giữ nguyên khi xem lại.' : scene.type === 'activity' ? 'Phần trả lời đã được ghi nhận. Bạn có thể tiếp tục đọc lại câu chuyện.' : scene.text || 'Kết quả lượt chơi được giữ nguyên.'}</p>}
            <p className="vn-review-note">Đang đọc lại lịch sử. Tiền và kết quả không thay đổi.</p>
            <button className="vn-review-forward" onClick={() => goNext()}>Tiếp tục →</button>
          </section></div>
        ) : scene.type === "activity" ? (
          <div className="vn-minigame-host"><ChapterFiveReflection key={`${scene.id}-${scenePath.length}`} scene={scene} flags={flags} onComplete={selectChoice}/></div>
        ) : scene.type === "minigame" ? (
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
            ) : ['PORTFOLIO_CH08', 'CLAIM_REVIEW_CH08', 'LIFE_PLAN_CH08'].includes(scene.game?.id) ? (
              <FuturePlanMiniGame key={`${scene.id}-${scenePath.length}`} game={scene.game} initialResult={miniGameResults[scene.id]} onProgress={result => setMiniGameResults(prev => ({ ...prev, [scene.id]: { ...result, gameId: scene.game.id, completed: false } }))} onComplete={handleMiniGameComplete}/>
            ) : ['INSURANCE_DESK_CH07', 'SCAM_OR_SAFE_CH07'].includes(scene.game?.id) ? (
              <ScamOrSafeMiniGame key={`${scene.id}-${scenePath.length}`} game={scene.game} initialResult={miniGameResults[scene.id]} onProgress={result => setMiniGameResults(prev => ({ ...prev, [scene.id]: { ...result, gameId: scene.game.id, completed: false } }))} onComplete={handleMiniGameComplete}/>
            ) : ['LOAN_OFFERS_CH06', 'LOAN_REPAYMENT_CH06'].includes(scene.game?.id) ? (
              <LoanDetectiveMiniGame key={`${scene.id}-${scenePath.length}`} game={scene.game} initialResult={miniGameResults[scene.id]} onProgress={result => setMiniGameResults(prev => ({ ...prev, [scene.id]: { ...result, gameId: scene.game.id, completed: false } }))} onComplete={handleMiniGameComplete}/>
            ) : scene.game?.id === "COMPOUND_TIMELINE_CH05" ? (
              <CompoundTimelineMiniGame key={`${scene.id}-${scenePath.length}`} game={scene.game} initialResult={miniGameResults[scene.id]} onProgress={result => setMiniGameResults(prev => ({ ...prev, [scene.id]: { ...result, gameId: scene.game.id, completed: false } }))} onComplete={handleMiniGameComplete} className="h-full" />
            ) : scene.game?.id === "SMART_SHOPPING_CH04" ? (
              <SmartShoppingMiniGame
                key={`${scene.id}-${scenePath.length}`}
                game={scene.game}
                initialResult={miniGameResults[scene.id]}
                onProgress={result => setMiniGameResults(prev => ({ ...prev, [scene.id]: { ...result, gameId: scene.game.id, completed: false } }))}
                onComplete={handleMiniGameComplete}
                className="h-full"
              />
            ) : scene.game?.id === "CAREER_MATCH_CH03" ? (
              <CareerMatchMiniGame
                key={`${scene.id}-${scenePath.length}`}
                game={scene.game}
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
            <section
              className="vn-choice-panel"
              aria-labelledby="vn-choice-question"
            >
              <span className="vn-choice-eyebrow">ĐẾN LƯỢT BẠN QUYẾT ĐỊNH</span>
              {scene.text && scene.prompt && scene.text !== scene.prompt && (
                <p className="vn-choice-context">{scene.text}</p>
              )}
              <h2 id="vn-choice-question">
                {scene.prompt || scene.text || "Bạn sẽ chọn điều gì?"}
              </h2>
              {scene.planSummary && <ChapterFivePlanSummary flags={flags}/>}
              <div className="vn-choices">
                {scene.options.map((option, index) => {
                  const lockReason = getOptionLock(option);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={cn(
                        "vn-choice-option",
                        lockReason && "is-locked",
                      )}
                      onClick={() => selectChoice(option)}
                      disabled={Boolean(pendingEffects) || Boolean(lockReason)}
                      aria-disabled={Boolean(lockReason)}
                    >
                      <span className="vn-choice-letter" aria-hidden="true">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="vn-choice-copy">
                        {option.label}
                        {lockReason ? (
                          <small className="vn-choice-lock">
                            <Lock size={14} aria-hidden="true" /> {lockReason}
                          </small>
                        ) : null}
                      </span>
                      <span className="vn-choice-arrow" aria-hidden="true">
                        {lockReason ? <Lock size={18} /> : "→"}
                      </span>
                    </button>
                  );
                })}
              </div>
              {(scene.inspect || scene.reviewAction) && (
                <div className="vn-choice-tools">
                  {scene.inspect && (
                    <button
                      type="button"
                      className="vn-choice-tool vn-inspect-choice-trigger"
                      onClick={() => openInspect(scene.inspect)}
                    >
                      <FileSearch size={17} aria-hidden="true" />{" "}
                      {scene.inspect.buttonText}
                      {scene.inspect.id && inspectedIds[scene.inspect.id] ? (
                        <span className="vn-choice-tool-done">Đã xem</span>
                      ) : null}
                    </button>
                  )}
                  {scene.reviewAction &&
                    scene.options.some((option) => getOptionLock(option)) && (
                      <button
                        type="button"
                        className="vn-choice-tool"
                        onClick={() => {
                          const target =
                            sceneIndexById[scene.reviewAction.targetSceneId];
                          if (typeof target === "number")
                            goToSceneIndex(target);
                        }}
                      >
                        <RotateCcw size={17} aria-hidden="true" />{" "}
                        {scene.reviewAction.label}
                      </button>
                    )}
                </div>
              )}
              <p className="vn-choice-hint">
                Mỗi lựa chọn viết tiếp câu chuyện của bạn.
              </p>
            </section>
          </div>
        ) : scene.type === "ending" && data.endingReport ? (
          <div className="vn-choice-overlay" key={scene.id}>
            <section
              className="vn-choice-panel vn-ending-panel"
              aria-labelledby="vn-ending-title"
            >
              <span className="vn-choice-eyebrow">KẾT THÚC CHƯƠNG</span>
              <header className="vn-ending-head">
                {resolveEnding()?.characterSprite && (
                  <img
                    src={resolveEnding().characterSprite}
                    alt=""
                    className="vn-ending-avatar"
                  />
                )}
                <div>
                  <h2 id="vn-ending-title">
                    {resolveEnding()?.title || "Kết thúc"}
                  </h2>
                  <p className="vn-ending-story">
                    {resolveEnding()?.storyText}
                  </p>
                </div>
              </header>
              <EndingReport report={buildEndingReport()} />
              {data.endingReport.reviewSceneId && <button className="vn-choice-option" onClick={() => goToSceneIndex(sceneIndexById[data.endingReport.reviewSceneId])}>Xem lại và sửa kế hoạch</button>}
              <Link to="/dashboard/user/lessons" className="vn-ending-exit">
                Quay lại bản đồ chương
              </Link>
            </section>
          </div>
        ) : (
          <div
            ref={dialogueRef}
            className={cn("vn-dialogue-dock", isSceneOnlyScreen && "hidden")}
          >
            {isSceneOnlyScreen ? null : scene.type === "summary" ? (
              <div
                className={cn("vn-dialogue", canGoNext && "cursor-pointer")}
                onClick={canGoNext ? goNext : undefined}
              >
                <div className="vn-speaker">Tổng kết chương</div>
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
                <Link
                  to="/dashboard/user/lessons"
                  className="w-full inline-block bg-green-600 text-white p-3 rounded-lg text-center hover:bg-green-700"
                >
                  Quay lại bản đồ chương
                </Link>
              </div>
            ) : (
              <div
                className={cn("vn-dialogue", canGoNext && "cursor-pointer")}
                onClick={canGoNext ? goNext : undefined}
              >
                {scene.type === "dialogue" && <SpeakerTag scene={scene} />}
                <p className="vn-dialogue-text">{scene.text || scene.prompt}</p>

                {scene.inspect && (
                  <button
                    type="button"
                    className="ch5-inspect-trigger"
                    aria-label={scene.inspect.buttonText}
                    onClick={(e) => {
                      e.stopPropagation();
                      openInspect(scene.inspect);
                    }}
                  >
                    <span className="ch5-inspect-icon" aria-hidden="true"><FileSearch size={26}/></span><span><b>{scene.inspect.buttonText}</b>{scene.inspect.cards && <small>Mở thẻ để cùng An tìm hiểu</small>}</span><span className="ch5-inspect-arrow" aria-hidden="true">↗</span>
                  </button>
                )}

                {canGoNext && !hasChoiceOptions && scene.type !== "summary" && (
                  <button
                    type="button"
                    className="vn-dialogue-next"
                    onClick={(event) => {
                      event.stopPropagation();
                      goNext();
                    }}
                  >
                    Tiếp tục <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      {inspectPopup?.cards && <InspectCardsDialog key={inspectPopup.id} inspect={inspectPopup} onClose={closeInspectPopup}/>}
      {inspectPopup && !inspectPopup.cards && (
        <div className="vn-inspect-modal">
          <div className="vn-inspect-paper" role="dialog" aria-modal="true" aria-labelledby="vn-inspect-title">
            <div className="flex items-start justify-between mb-4">
              <h3 id="vn-inspect-title" className="vn-inspect-title">
                {inspectPopup.buttonText}
              </h3>
              <button
                onClick={closeInspectPopup}
                className="vn-inspect-close"
                aria-label="Đóng"
              >
                ×
              </button>
            </div>
            {inspectPopup.popupImage && (
              <img
                src={inspectPopup.popupImage}
                alt={inspectPopup.buttonText}
                className="w-full rounded-lg mb-4 max-h-96 object-contain"
              />
            )}
            {inspectPopup.popupImages?.length > 0 && (
              <div className="vn-popup-grid">
                {inspectPopup.popupImages.map((image) => (
                  <figure key={image.src}>
                    <img
                      src={image.src}
                      alt={image.caption || inspectPopup.buttonText}
                    />
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                    {image.description && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#ffffffcc",
                          margin: "4px 0 0 0",
                        }}
                      >
                        {image.description}
                      </p>
                    )}
                  </figure>
                ))}
              </div>
            )}
            <p className="vn-inspect-note">
              {inspectPopup.dataText}
            </p>
            <button
              onClick={closeInspectPopup}
              className="vn-inspect-done"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {pendingEffects && (
        <div className="absolute inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/25 bg-[#0b1723] text-white p-5 shadow-2xl">
            <h3 className="text-base font-black mb-1">Lựa chọn đã ghi nhận</h3>
            <p className="text-sm text-white/75 mb-4">
              Trò chơi đã cập nhật kết quả theo lựa chọn của bạn.
            </p>
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
