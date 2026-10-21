import TeacherQuizContent from "./components/TeacherQuizContent";
import useTeacherQuizzes from "./hooks/useTeacherQuizzes";

export default function TeacherQuizManagement() {
  const quizState = useTeacherQuizzes();
  return <TeacherQuizContent quizState={quizState} />;
}
