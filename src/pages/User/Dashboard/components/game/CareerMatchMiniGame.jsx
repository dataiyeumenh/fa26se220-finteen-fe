import { useMemo, useState } from "react";
import { BriefcaseBusiness, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import "./chapter-two-minigames.css";
import "./chapter-three.css";

const STEPS = [
  { id: "fit", label: "1. Ghép việc với thời gian" },
  { id: "calc", label: "2. Tính thu nhập thực nhận" },
];

export function CareerMatchMiniGame({ game, onComplete, className }) {
  const jobs = useMemo(() => game.jobs || [], [game.jobs]);
  const questions = useMemo(() => game.questions || [], [game.questions]);
  const maxHours = Math.max(game.weeklyLimit, ...jobs.map((job) => job.hours));

  const [step, setStep] = useState("fit");
  const [verdicts, setVerdicts] = useState({});
  const [wrongJobs, setWrongJobs] = useState({});
  const [fitFirstScore, setFitFirstScore] = useState(null);
  const [fitSolved, setFitSolved] = useState(false);
  const [picked, setPicked] = useState({});
  const [missed, setMissed] = useState({});
  const [feedback, setFeedback] = useState({
    tone: "info",
    text: `Mỗi tuần An chỉ có tối đa ${game.weeklyLimit} giờ ngoài giờ học. Hãy đánh dấu từng việc là vừa lịch hay quá giờ.`,
  });

  const isFit = (job) => job.hours <= game.weeklyLimit;
  const allVerdicts = jobs.every((job) => verdicts[job.id]);
  const calcSolved = questions.every(
    (question) => picked[question.id] === question.correctId,
  );
  const calcFirstScore = questions.filter(
    (question) => !missed[question.id],
  ).length;

  const setVerdict = (jobId, value) => {
    if (fitSolved) return;
    setVerdicts((current) => ({ ...current, [jobId]: value }));
    setWrongJobs((current) => ({ ...current, [jobId]: false }));
  };

  const checkFit = () => {
    const wrong = {};
    let correct = 0;
    jobs.forEach((job) => {
      const ok = (verdicts[job.id] === "fit") === isFit(job);
      if (ok) correct += 1;
      else wrong[job.id] = true;
    });
    setWrongJobs(wrong);
    if (fitFirstScore === null) setFitFirstScore(correct);
    if (correct === jobs.length) {
      setFitSolved(true);
      setFeedback({
        tone: "good",
        text: "Chính xác. Việc 16 giờ vượt quỹ thời gian, hai việc còn lại vừa lịch học.",
      });
    } else {
      setFeedback({
        tone: "bad",
        text: "Có thẻ chưa khớp. So giờ làm mỗi tuần với vạch giới hạn rồi thử lại nhé.",
      });
    }
  };

  const answer = (question, option) => {
    if (picked[question.id] === question.correctId) return;
    setPicked((current) => ({ ...current, [question.id]: option.id }));
    if (option.id === question.correctId) {
      setFeedback({ tone: "good", text: question.explain });
    } else {
      setMissed((current) => ({ ...current, [question.id]: true }));
      setFeedback({ tone: "bad", text: question.hint });
    }
  };

  const goCalc = () => {
    setStep("calc");
    setFeedback({
      tone: "info",
      text: "Tính từng phép tính để biết số tiền thực nhận, lợi nhuận và khoản linh hoạt.",
    });
  };

  const finish = () => {
    onComplete?.({
      passed: true,
      score: (fitFirstScore ?? 0) + calcFirstScore,
      total: jobs.length + questions.length,
    });
  };

  return (
    <section
      className={cn("c2-game c3-game", className)}
      aria-label={game.title}
    >
      <header className="c2-header">
        <div>
          <span className="c2-eyebrow">
            <BriefcaseBusiness size={16} /> TUẦN NGHỀ NGHIỆP
          </span>
          <h2>{game.title}</h2>
          <p>{game.instruction}</p>
        </div>
      </header>

      <ol className="c3-steps" aria-label="Các bước">
        {STEPS.map((item) => (
          <li
            key={item.id}
            className={cn(
              step === item.id && "is-current",
              item.id === "fit" && step === "calc" && "is-done",
            )}
          >
            {item.label}
          </li>
        ))}
      </ol>

      {step === "fit" ? (
        <>
          <div className="c3-limit">
            {game.timeImage && <img src={game.timeImage} alt="" />}
            <span>
              Quỹ thời gian của An: tối đa {game.weeklyLimit} giờ/tuần ngoài giờ
              học
            </span>
          </div>
          <div className="c3-jobs">
            {jobs.map((job) => {
              const over = !isFit(job);
              return (
                <article
                  key={job.id}
                  className={cn(
                    "c3-job",
                    wrongJobs[job.id] && "is-wrong",
                    fitSolved && "is-right",
                  )}
                >
                  <img className="c3-job-image" src={job.image} alt="" />
                  <h3>{job.name}</h3>
                  <ul className="c3-facts">
                    {job.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                  <div>
                    <div className="c3-hours" aria-hidden="true">
                      <i
                        className={cn(over && "is-over")}
                        style={{ width: `${(job.hours / maxHours) * 100}%` }}
                      />
                      <b
                        style={{
                          left: `${(game.weeklyLimit / maxHours) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="c3-hours-label">
                      {job.hours} giờ/tuần · vạch đậm là {game.weeklyLimit} giờ
                    </span>
                  </div>
                  <div
                    className="c3-verdict"
                    role="group"
                    aria-label={`Đánh giá ${job.name}`}
                  >
                    <button
                      type="button"
                      aria-pressed={verdicts[job.id] === "fit"}
                      disabled={fitSolved}
                      onClick={() => setVerdict(job.id, "fit")}
                    >
                      Vừa lịch
                    </button>
                    <button
                      type="button"
                      aria-pressed={verdicts[job.id] === "over"}
                      disabled={fitSolved}
                      onClick={() => setVerdict(job.id, "over")}
                    >
                      Quá giờ
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="c3-calc">
          {questions.map((question) => {
            const solved = picked[question.id] === question.correctId;
            return (
              <article
                key={question.id}
                className={cn("c3-question", solved && "is-solved")}
              >
                <h3>{question.title}</h3>
                <p className="c3-formula">{question.formula}</p>
                <div
                  className="c3-options"
                  role="group"
                  aria-label={question.title}
                >
                  {question.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={cn(
                        "c3-option",
                        picked[question.id] === option.id &&
                          (option.id === question.correctId
                            ? "is-right"
                            : "is-wrong"),
                      )}
                      disabled={solved}
                      onClick={() => answer(question, option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {solved && <p className="c3-explain">{question.explain}</p>}
              </article>
            );
          })}
        </div>
      )}

      <p
        className={cn(
          "c3-feedback",
          feedback.tone === "good" && "is-good",
          feedback.tone === "bad" && "is-bad",
        )}
        role="status"
      >
        {feedback.text}
      </p>

      <footer className="c2-footer">
        <p>
          Lương, lợi nhuận và chi phí ở đây chỉ là số liệu mô phỏng để thực
          hành.
        </p>
        <div>
          {step === "fit" && !fitSolved && (
            <button
              type="button"
              className="c2-primary"
              disabled={!allVerdicts}
              onClick={checkFit}
            >
              <Check size={17} /> Kiểm tra
            </button>
          )}
          {step === "fit" && fitSolved && (
            <button type="button" className="c2-primary" onClick={goCalc}>
              Sang bước tính toán →
            </button>
          )}
          {step === "calc" && (
            <button
              type="button"
              className="c2-primary"
              disabled={!calcSolved}
              onClick={finish}
            >
              Hoàn tất Career Match →
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}
