import { useParams } from "react-router-dom";
import LearnerReportContent from "./components/LearnerReportContent";
import useLearnerReport from "./hooks/useLearnerReport";

export default function LearnerReport() {
  const { id } = useParams();
  const reportState = useLearnerReport(id);
  return <LearnerReportContent reportState={reportState} />;
}
