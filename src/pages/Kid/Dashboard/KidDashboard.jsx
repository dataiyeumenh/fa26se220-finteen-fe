import useKidDashboard from "./hooks/useKidDashboard.js";
import WelcomeBanner from "./components/WelcomeBanner.jsx";
import ContinueLearning from "./components/ContinueLearning.jsx";
import Achievements from "./components/Achievements.jsx";
import AiSuggestionCard from "./components/AiSuggestionCard.jsx";

export default function KidDashboard() {
  const dashboard = useKidDashboard();

  return (
    <>
      {dashboard.loading && (
        <div className="text-center text-sm text-[#1a3a1a]/60 py-12">
          Đang tải dữ liệu...
        </div>
      )}

      {dashboard.error && (
        <div
          className="border-2 rounded-2xl p-4 mb-6 text-sm font-bold"
          style={{
            backgroundColor: "#f8717115",
            borderColor: "#f87171",
            color: "#dc2626",
          }}
        >
          {dashboard.error}
        </div>
      )}

      {!dashboard.loading && !dashboard.error && (
        <>
          <WelcomeBanner
            user={dashboard.user}
            streak={dashboard.streak}
            lessonsThisWeek={dashboard.lessonsThisWeek}
            lessonsTarget={dashboard.lessonsTarget}
          />
          <ContinueLearning lessons={dashboard.continueLessons} />
          <Achievements items={dashboard.achievements} />
          <AiSuggestionCard />
        </>
      )}
    </>
  );
}
