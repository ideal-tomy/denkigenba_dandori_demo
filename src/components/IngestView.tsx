import type { IngestStep } from "../content/types";
import { useDemo } from "../state/DemoStore";

const STEPS: { id: IngestStep; label: string; detail: string }[] = [
  { id: "receiving", label: "依頼を受付", detail: "メール・FAXの内容を取り込みます" },
  { id: "reading", label: "現場を読み取り", detail: "住所・工事種別・作業日を把握します" },
  { id: "drafting", label: "段取りを組み立て", detail: "申請・人員・書類の見通しを並べます" },
];

export function IngestView() {
  const { activeRequest, ingestStep } = useDemo();
  if (!activeRequest) return null;

  const stepIndex = STEPS.findIndex((s) => s.id === ingestStep);

  return (
    <main className="ingest-main">
      <div className="wrap ingest-wrap">
        <div className="ingest-meta">
          <span className={`channel channel-${activeRequest.channel}`}>
            {activeRequest.channel === "email" ? "メール" : "FAX"}
          </span>
          <span className="ingest-from">{activeRequest.from}</span>
        </div>
        <h2 className="ingest-title">{activeRequest.subject}</h2>

        <ol className="ingest-steps" aria-live="polite">
          {STEPS.map((step, i) => {
            const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "pending";
            return (
              <li key={step.id} className={`ingest-step is-${state}`}>
                <span className="ingest-step-dot" aria-hidden />
                <div>
                  <div className="ingest-step-label">{step.label}</div>
                  <div className="ingest-step-detail">{step.detail}</div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="ingest-body panel">
          <pre>{activeRequest.body}</pre>
        </div>
      </div>
    </main>
  );
}
