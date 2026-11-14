import { useEffect, useState } from "react";
import { getCurrentRelease } from "../api/content.api.js";

export function useCurrentRelease() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ attempt: null, chapters: [], error: "" });
  useEffect(() => {
    let active = true;
    getCurrentRelease().then((release) => {
      if (!Array.isArray(release?.chapters)) throw new Error("Không tải được danh sách chương.");
      if (active) setResult({ attempt, chapters: release.chapters, error: "" });
    }).catch((error) => {
      if (active) setResult({ attempt, chapters: [], error: error.message });
    });
    return () => { active = false; };
  }, [attempt]);
  const current = result.attempt === attempt;
  return {
    chapters: current ? result.chapters : [],
    loading: !current,
    error: current ? result.error : "",
    retry: () => setAttempt((value) => value + 1),
  };
}
