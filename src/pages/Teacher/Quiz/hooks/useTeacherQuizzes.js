import { useCallback, useEffect, useState } from "react";
import { teacherQuizApi as auth } from "../api/teacherQuizApi";

const quizError = (error) => {
  if (Array.isArray(error?.result) && error.result.length) {
    const details = error.result.slice(0, 5).map((item) => {
      const position = Number.isInteger(item?.index) ? `Câu ${item.index + 1}` : "Câu hỏi";
      const field = ({ stem: "nội dung", options: "các lựa chọn", correctIndex: "đáp án đúng", question: "dữ liệu" })[item?.field] || item?.field;
      return `${position}${field ? ` – ${field}` : ""}: ${item?.message || "chưa hợp lệ"}`;
    });
    return `Vui lòng sửa các câu hỏi sau: ${details.join("; ")}${error.result.length > 5 ? `; và ${error.result.length - 5} lỗi khác` : ""}.`;
  }
  return ({
    3004: "Bạn không có quyền thao tác với lớp hoặc đề này.",
    3005: "Cần mua gói giáo viên trước khi tạo, sửa hoặc phát hành đề.",
    8001: "Không tìm thấy đề phù hợp.",
    8002: "Đề đã phát hành hoặc là hậu trắc nên không thể thay đổi.",
    8003: "Học sinh này chưa nộp bài.",
    8004: "Bài kiểm tra đã quá hạn nộp.",
    8005: "Bạn đã nộp bài này rồi.",
    8006: "Câu trả lời không khớp với đề.",
    8007: "Một câu hỏi đã bị rút, không tồn tại hoặc không dùng được cho đề giáo viên.",
    8008: "Chỉ lớp đang mở mới sử dụng được Quiz.",
  })[error?.code] ||
  error?.message ||
  "Không thể hoàn thành yêu cầu.";
};

export default function useTeacherQuizzes() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadGroups = useCallback(async () => {
    try {
      const rows = ((await auth.listGroups()) || []).filter(
        (item) => item.context === "CLASS",
      );
      setGroups(rows);
      setGroupId(
        (old) =>
          old || rows.find((item) => !item.closedAt)?.id || rows[0]?.id || "",
      );
    } catch (value) {
      setError(quizError(value));
    }
  }, []);

  const loadQuizzes = useCallback(async () => {
    if (!groupId) {
      setQuizzes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setQuizzes((await auth.listQuizzes(groupId)) || []);
    } catch (value) {
      setError(quizError(value));
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGroups();
  }, [loadGroups]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 4500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const refresh = useCallback(
    async (success) => {
      setMessage(success || "");
      await loadGroups();
      await loadQuizzes();
    },
    [loadGroups, loadQuizzes],
  );

  const act = useCallback(
    async (action, success) => {
      setError("");
      try {
        await action();
        await refresh(success);
        return true;
      } catch (value) {
        setError(quizError(value));
        return false;
      }
    },
    [refresh],
  );

  return {
    groups,
    groupId,
    setGroupId,
    quizzes,
    currentGroup: groups.find((item) => item.id === groupId),
    loading,
    message,
    error,
    refresh,
    reload: () => {
      void loadGroups();
      void loadQuizzes();
    },
    publishQuiz: (quizId) =>
      act(() => auth.publishQuiz(quizId), "Đã phát hành đề."),
    deleteQuiz: (quizId) =>
      act(() => auth.deleteQuiz(quizId), "Đã xóa đề nháp."),
  };
}

export function useTeacherQuestionBank(filters) {
  const [questions, setQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    Promise.all([auth.listQuestions(filters), auth.listMyQuestions()])
      .then(([sharedRows, mineRows]) => {
        if (active) {
          setQuestions(Array.isArray(sharedRows) ? sharedRows : (sharedRows?.items ?? []));
          setMyQuestions(Array.isArray(mineRows) ? mineRows : (mineRows?.items ?? []));
        }
      })
      .catch((value) => {
        if (active) setError(quizError(value));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters]);
  const saveQuiz = async (quizId, payload) => {
    try {
      if (quizId) await auth.updateQuiz(quizId, payload);
      else await auth.createQuiz(payload);
    } catch (value) {
      throw new Error(quizError(value), { cause: value });
    }
  };
  return { questions, myQuestions, loading, error, saveQuiz };
}

export function useTeacherQuizDetail(quizId) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!quizId) return undefined;
    let active = true;
    auth
      .getQuiz(quizId)
      .then((value) => {
        if (active) setDetail(value);
      })
      .catch((value) => {
        if (active) setError(quizError(value));
      });
    return () => {
      active = false;
    };
  }, [quizId]);
  return { detail, error };
}

export function useTeacherQuizResults(quizId) {
  const [data, setData] = useState(null);
  const [slotResult, setSlotResult] = useState(null);
  const [viewingSlotId, setViewingSlotId] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    auth
      .getQuizResults(quizId)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((value) => {
        if (active) setError(quizError(value));
      });
    return () => {
      active = false;
    };
  }, [quizId]);
  const viewSlot = async (slotId) => {
    setError("");
    setViewingSlotId(slotId);
    try {
      setSlotResult(await auth.getQuizSlotResult(quizId, slotId));
    } catch (value) {
      setError(quizError(value));
    } finally {
      setViewingSlotId("");
    }
  };
  return { data, slotResult, setSlotResult, viewingSlotId, error, viewSlot };
}
