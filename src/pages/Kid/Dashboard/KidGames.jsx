import { Gamepad2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import useKidDashboard from "./hooks/useKidDashboard";
import { VisualNovelPlayer } from "./components/game/VisualNovelPlayer";
import { getChapterContent, getCurrentRelease } from "@/api/content.api";
import { useWorkspace } from "@/features/workspace/useWorkspace";
import { novelProgressOwner } from "./components/game/visualNovelProgress.js";
import { PersonalizationGate } from "./components/PersonalizationGate.jsx";

// MỘT nguồn nội dung (Hưng 24/10: "tất cả phải đồng nhất"): mọi chương tải từ bản phát hành hiện tại của BE
// Learners use /api/play/releases/{version}/chapters/{code}; guests use public content.
const chapterCode = (number) => `CH${String(number).padStart(2, "0")}`;

export default function KidGames() {
  const { actor } = useWorkspace();
  const progressOwner = novelProgressOwner(actor);
  const { pathname } = useLocation();
  const playPath = pathname.startsWith("/dashboard/demo")
    ? "/dashboard/demo/play"
    : "/dashboard/kid/play";
  const [searchParams] = useSearchParams();
  const chapterParam = searchParams.get("chapter") || "1";
  const chapterNumber = Number(chapterParam);
  const validChapter =
    Number.isInteger(chapterNumber) &&
    chapterNumber >= 1 &&
    chapterNumber <= 99;
  const { loading, error } = useKidDashboard();
  const [gameData, setGameData] = useState(null);
  const [runtimeError, setRuntimeError] = useState("");
  const [loadedChapter, setLoadedChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const isLearner = actor?.role === "kid";
  const [gateOwner, setGateOwner] = useState(null);
  const gateDone = !isLearner || chapterNumber !== 1 || gateOwner === progressOwner;
  const finishGate = useCallback(() => setGateOwner(progressOwner), [progressOwner]);

  useEffect(() => {
    let mounted = true;
    if (!validChapter) {
      getCurrentRelease()
        .then((release) => mounted && setChapters(release.chapters || []))
        .catch((e) => mounted && setRuntimeError(e.message));
      return () => {
        mounted = false;
      };
    }
    if (!gateDone) return undefined;
    getChapterContent(chapterCode(chapterNumber))
      .then((content) => {
        if (!mounted) return;
        setGameData({ ...content, loadedAt: new Date().toISOString() });
        setLoadedChapter(JSON.stringify([progressOwner, chapterNumber]));
        setRuntimeError("");
      })
      .catch(
        (e) =>
          mounted && setRuntimeError(e.message || "Không tải được chương."),
      );
    return () => {
      mounted = false;
    };
  }, [chapterNumber, validChapter, gateDone, progressOwner]);

  return (
    <>
      {loading && (
        <div className="text-center text-sm text-[#1a3a1a]/60 py-12">
          Đang tải game...
        </div>
      )}

      {error && (
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: "#f8717115",
            borderColor: "#f87171",
            color: "#dc2626",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && runtimeError && (
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: "#fbbf2415",
            borderColor: "#fbbf24",
            color: "#92400e",
          }}
        >
          {runtimeError}
        </div>
      )}

      {!loading && !error && validChapter && !gateDone && (
        <PersonalizationGate key={progressOwner} onDone={finishGate} />
      )}

      {!loading &&
        !error &&
        gateDone &&
        validChapter &&
        gameData &&
        loadedChapter === JSON.stringify([progressOwner, chapterNumber]) && (
          <VisualNovelPlayer
            key={JSON.stringify([progressOwner, gameData.id, gameData.variantKey])}
            data={gameData}
            progressOwner={progressOwner}
            learnerCode={actor?.role === "kid" ? actor.code : null}
          />
        )}

      {!loading && !error && !validChapter && (
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center">
            <Gamepad2 className="mx-auto mb-4 h-12 w-12 text-amber-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Chọn chương để bắt đầu
            </h1>
            <p className="mt-3 text-gray-600">
              Chọn một chương để vào visual novel tương ứng.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {chapters.map((chapter) => (
              <Link
                key={chapter.code}
                to={`${playPath}?chapter=${chapter.chapterNumber}`}
                className="rounded-3xl border border-amber-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  Chương {chapter.chapterNumber}
                </div>
                <h2 className="mt-2 text-2xl font-black text-gray-900">
                  {chapter.title}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
