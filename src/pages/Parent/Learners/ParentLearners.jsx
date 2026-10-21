import ParentLearnersContent from "./components/ParentLearnersContent";
import useParentLearners from "./hooks/useParentLearners";

export default function ParentLearners() {
  const learnerState = useParentLearners();
  return <ParentLearnersContent learnerState={learnerState} />;
}
