import TeacherQuizContent from "./components/TeacherQuizContent";
import useTeacherQuizzes from "./hooks/useTeacherQuizzes";
import { useSearchParams } from "react-router-dom";

export default function TeacherQuizManagement() {
  const [searchParams] = useSearchParams();
  const quizState = useTeacherQuizzes({
    requestedQuizId: searchParams.get("quiz") || "",
  });
  return <TeacherQuizContent quizState={quizState} />;
}
