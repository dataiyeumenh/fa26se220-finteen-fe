import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Brain,
  ChartNoAxesColumn,
  Coins,
  FileSearch,
  Heart,
  ImageOff,
  Landmark,
  Lock,
  Maximize2,
  Menu,
  Minimize2,
  PiggyBank,
  RotateCcw,
  ShieldAlert,
  Target,
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
import "./chapter-three.css";

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

function StatsPanel({ stats, statFxByKey }) {
  return (
    <div className="vn-stats-grid">
      {Object.entries(statDisplay)
        .filter(([key]) => key in stats)
        .map(([key, meta]) => {
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
              <span className="vn-stat-icon">
                <Icon size={17} />
              </span>
              <span className="vn-stat-copy">
                <small>{meta.label}</small>
                <strong>
                  {Number(stats[key] ?? 0).toLocaleString("vi-VN")}
                </strong>
              </span>
              {statFxByKey[key] ? (
                <span
                  className={cn(
                    "vn-stat-delta",
                    statFxByKey[key] > 0 ? "is-positive" : "is-negative",
                  )}
                >
                  {statFxByKey[key] > 0
                    ? `+${statFxByKey[key]}`
                    : statFxByKey[key]}
                </span>
              ) : null}
            </div>
          );
        })}
    </div>
  );
}

function EndingReport({ report }) {
  if (!report) return null;
  const format = (value) => Number(value || 0).toLocaleString("vi-VN");
  const signed = (value) => (value > 0 ? `+${value}` : String(value));

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
        <div className="vn-report-card">
          <small>Chỉ số thay đổi</small>
          <ul>
            {report.stats.map((item) => (
              <li key={item.key}>
                {item.label}{" "}
                <b className={item.delta > 0 ? "is-up" : "is-down"}>
                  {signed(item.delta)}
                </b>
              </li>
            ))}
          </ul>
        </div>
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
            Mini-game chọn nghề: <b>{report.miniPercent}%</b>
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
  const [flags, setFlags] = useState({});
  const [choiceLedger, setChoiceLedger] = useState({});
  const [firstChoiceScores, setFirstChoiceScores] = useState({});
  const [inspectedIds, setInspectedIds] = useState({});
  const [moneyEventsApplied, setMoneyEventsApplied] = useState({});
  const [inspectPopup, setInspectPopup] = useState(null);
  const [miniGameCompleted, setMiniGameCompleted] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0); // Track score: 0-6
  const [money, setMoney] = useState(data.initialMoney || 0);
  const [moneyFx, setMoneyFx] = useState(null);

  const sceneIndex = scenePath[scenePath.length - 1];

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

  const applyOneTimeSceneEffect = (sceneId, effects, force = false) => {
    if (!effects || (!force && sceneActionApplied[sceneId])) return;

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

  const goNext = () => {
    if (!canGoNext) return;

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
    const requires = option.requires;
    if (!requires) return null;
    const unmet =
      (requires.minMoney != null && money < requires.minMoney) ||
      (requires.flags || []).some((key) => !flags[key]) ||
      (requires.inspected || []).some((key) => !inspectedIds[key]);
    return unmet ? requires.lockedReason || "Chưa đủ điều kiện để chọn." : null;
  };

  const openInspect = (inspect) => {
    if (inspect.id)
      setInspectedIds((prev) => ({ ...prev, [inspect.id]: true }));
    setInspectPopup(inspect);
  };

  const selectChoice = (option) => {
    if (getOptionLock(option)) return;

    // A choice group keeps one effective option; re-choosing reverts the old deltas first.
    const groupId = scene.choiceGroup || scene.id;
    const previous = choiceLedger[groupId];
    const isSame = previous?.optionId === option.id;
    const nextDelta = option.deltaStats || option.effects || {};

    if (!isSame) {
      setChoiceLedger((prev) => ({
        ...prev,
        [groupId]: {
          optionId: option.id,
          sceneTitle: scene.title,
          label: option.label,
          deltaStats: nextDelta,
          evidenceScores: option.evidenceScores || null,
          reflectionScore: option.reflectionScore || 0,
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
    if (!isSame) {
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
    const { passed, score } = result || {};
    setMiniGameDoneByScene((prev) => ({
      ...prev,
      [scene.id]: Boolean(passed),
    }));
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
    setFlags({});
    setChoiceLedger({});
    setFirstChoiceScores({});
    setInspectedIds({});
    setMoneyEventsApplied({});
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
          "flags",
          "reflectionScore",
          `const { SAVING = 0, HAPPINESS = 0, RISK = 0, GOAL = 0 } = stats || {}; return Boolean(${condition});`,
        );

        const totalEvidenceScore =
          (evidenceScores.I || 0) +
          (evidenceScores.C || 0) +
          (evidenceScores.P || 0);

        return evaluator(
          gameFlag,
          totalEvidenceScore,
          miniGameCompleted,
          stats,
          money,
          miniGameScore,
          flags,
          reflectionScore,
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
    const miniPercent =
      miniGameCompleted && config.miniGameMax
        ? Math.min(100, Math.round((100 * miniGameScore) / config.miniGameMax))
        : null;
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
      stats: Object.keys(statDisplay)
        .filter((key) => key in stats)
        .map((key) => ({
          key,
          label: statDisplay[key].label,
          delta: (stats[key] ?? 0) - ((data.initialStats || {})[key] ?? 0),
        }))
        .filter((item) => item.delta !== 0),
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
    };
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
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
            <StatsPanel stats={stats} statFxByKey={statFxByKey} />
            <div className="vn-menu-actions">
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
          className="vn-progress-pill"
          aria-label={`Tiến độ: cảnh ${sceneIndex + 1} trên ${totalScenes}`}
        >
          <span>{data.title}</span>
          <div
            className="vn-progress"
            role="progressbar"
            aria-label="Tiến độ chương"
            aria-valuenow={sceneIndex + 1}
            aria-valuemin={1}
            aria-valuemax={totalScenes}
          >
            <div style={{ width: progress + "%" }} />
          </div>
          <small>
            {sceneIndex + 1}/{totalScenes}
          </small>
        </div>
        <div className="vn-hud-right">
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
          <details className="vn-details vn-stats-details">
            <summary
              className="vn-icon-button"
              aria-label="Xem các chỉ số hành trình"
              title="Chỉ số"
            >
              <ChartNoAxesColumn size={18} />
              <span className="vn-control-label">Chỉ số</span>
            </summary>
            <div className="vn-popover vn-stats-popover">
              <div className="vn-popover-heading">
                <span>TIẾN TRÌNH</span>
                <h2>Chỉ số hành trình</h2>
              </div>
              <StatsPanel stats={stats} statFxByKey={statFxByKey} />
            </div>
          </details>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="vn-icon-button vn-fullscreen-button"
            aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
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

            {isSceneOnlyScreen && scene.inspect && (
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
                      className="vn-choice-tool"
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
                {resolveEnding()?.finalStats && (
                  <div className="bg-white/5 rounded-lg p-3 mb-4 text-sm">
                    <p className="font-bold mb-2">Chỉ số cuối cùng:</p>
                    <div className="space-y-1 text-white/75">
                      {Object.entries(resolveEnding().finalStats).map(
                        ([stat, value]) =>
                          value !== null && (
                            <div key={stat} className="flex justify-between">
                              <span>{statLabels[stat]}</span>
                              <span>{value}</span>
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                )}
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
                    className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInspect(scene.inspect);
                    }}
                  >
                    {scene.inspect.buttonText}
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
      {inspectPopup && (
        <div className="absolute inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-white/25 bg-[#0b1723] text-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-black">
                {inspectPopup.buttonText}
              </h3>
              <button
                onClick={() => {
                  // Handle money events when closing popup
                  if (
                    inspectPopup.moneyEvents &&
                    Array.isArray(inspectPopup.moneyEvents)
                  ) {
                    const totalMoneyDelta = inspectPopup.moneyEvents.reduce(
                      (sum, evt) => sum + (evt.amount || 0),
                      0,
                    );
                    setMoney((prev) => Math.max(0, prev + totalMoneyDelta));
                    if (totalMoneyDelta !== 0) {
                      setMoneyFx(totalMoneyDelta);
                      setTimeout(() => setMoneyFx(null), 1200);
                    }
                  }
                  // Handle flags when closing popup
                  if (
                    inspectPopup.setFlags &&
                    Object.keys(inspectPopup.setFlags).length > 0
                  ) {
                    setFlags((prev) => ({ ...prev, ...inspectPopup.setFlags }));
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
            <p className="text-sm whitespace-pre-wrap text-white/90 mb-4">
              {inspectPopup.dataText}
            </p>
            <button
              onClick={() => {
                // Handle money events when closing popup
                if (
                  inspectPopup.moneyEvents &&
                  Array.isArray(inspectPopup.moneyEvents)
                ) {
                  const totalMoneyDelta = inspectPopup.moneyEvents.reduce(
                    (sum, evt) => sum + (evt.amount || 0),
                    0,
                  );
                  setMoney((prev) => Math.max(0, prev + totalMoneyDelta));
                  if (totalMoneyDelta !== 0) {
                    setMoneyFx(totalMoneyDelta);
                    setTimeout(() => setMoneyFx(null), 1200);
                  }
                }
                // Handle flags when closing popup
                if (
                  inspectPopup.setFlags &&
                  Object.keys(inspectPopup.setFlags).length > 0
                ) {
                  setFlags((prev) => ({ ...prev, ...inspectPopup.setFlags }));
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
                      Number(delta) >= 0 ? "text-[#86efac]" : "text-[#fca5a5]",
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
