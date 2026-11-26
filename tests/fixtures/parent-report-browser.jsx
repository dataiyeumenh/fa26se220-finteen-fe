import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import ParentReportsContent from "/src/pages/Parent/Reports/components/ParentReportsContent.jsx";
import "/src/index.css";
import "/src/features/workspace/workspace-design-system.css";

const rows = [
  { slotId:"one", displayName:"An", status:"ACTIVE", completedChapters:8, averageScore:5.5, lastActiveAt:"2026-11-25T08:00:00Z" },
  { slotId:"two", displayName:"Bình", status:"ACTIVE", completedChapters:6, averageScore:4, lastActiveAt:"2026-11-24T08:00:00Z" },
  { slotId:"three", displayName:"Chi", status:"ACTIVE", completedChapters:2, averageScore:2.5, lastActiveAt:null },
  { slotId:"four", displayName:"Duy", status:"ARCHIVED", completedChapters:0, averageScore:null, lastActiveAt:null },
];
const report = { group:{ id:"family", name:"Nhà Chuột" }, summary:{ learners:4, active:3, activeLast7Days:2, chaptersCompleted:16, totalChapters:8, quizAssigned:6, quizSubmitted:8, averageScore:4 }, rows };
const state = { reports:[report], report, rows, status:"", setStatus(){}, setGroupId(){}, loading:false, error:"", warning:"", refresh(){} };
createRoot(document.getElementById("root")).render(<MemoryRouter><main className="ws" data-ws-page="reports"><ParentReportsContent reportState={state}/></main></MemoryRouter>);
