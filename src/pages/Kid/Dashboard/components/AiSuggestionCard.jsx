import { Bot, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal, DataSourceNote } from "@/features/workspace/ui";
import { assistantTopics, kidAssistantMockApi } from "../api/kidAssistantMockApi.js";

export default function AiSuggestionCard() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  return (
    <>
    <div className="bg-white rounded-2xl border-2 border-[#c084fc]/25 p-5 md:p-6 flex items-center gap-4 hover:shadow-[0_8px_30px_rgba(192,132,252,0.2)] transition-all relative overflow-hidden">
      {/* Side color stripe */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1 bg-[#c084fc]"
        aria-hidden="true"
      />

      <div className="w-14 h-14 rounded-2xl bg-[#c084fc] flex items-center justify-center shrink-0">
        <Bot className="w-7 h-7 text-white" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-extrabold text-[#1a3a1a]">
          Trợ lý AI có gì mới?
        </div>
        <div className="text-xs text-[#1a3a1a]/65 mt-0.5">
          Đang phát triển · Hỏi đáp mẫu (mock), chưa kết nối AI.
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-[#c084fc] text-white border-0 font-extrabold inline-flex hover:bg-[#a855f7]"
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        Hỏi ngay
      </Button>
    </div>
    {open && <Modal title="Hỏi đáp tài chính mẫu" onClose={() => setOpen(false)}>
      <DataSourceNote>Đang sử dụng mock API với câu trả lời soạn sẵn; chưa kết nối AI và không sử dụng dữ liệu cá nhân của bạn.</DataSourceNote>
      <div className="ws-actions">
        {assistantTopics.map((topic) => <button className="ws-btn" key={topic.id} onClick={async () => {
          const result = await kidAssistantMockApi.ask(topic.id);
          setAnswer(result.answer);
        }}>{topic.question}</button>)}
      </div>
      {answer && <p role="status">{answer}</p>}
    </Modal>}
    </>
  );
}
