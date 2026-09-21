import { useEffect } from "react";
import { getEvidence } from "../content/evidence";
import { useDemo } from "../state/DemoStore";

function highlightText(text: string, highlight?: string) {
  if (!highlight || !text.includes(highlight)) {
    return text;
  }
  const parts = text.split(highlight);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 ? <mark>{highlight}</mark> : null}
    </span>
  ));
}

export function EvidenceModal() {
  const { evidenceId, closeEvidence, activeRequest, site } = useDemo();

  useEffect(() => {
    if (!evidenceId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeEvidence();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [evidenceId, closeEvidence]);

  if (!evidenceId || !activeRequest || !site) return null;

  const doc = getEvidence(site.id, evidenceId);
  if (!doc) return null;

  const highlight = doc.highlight;
  const body = evidenceId === "request" ? activeRequest.body : null;

  return (
    <div
      className="scrim on"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEvidence();
      }}
    >
      <div className="modal evidence-modal" role="dialog" aria-modal="true" aria-labelledby="evidence-title">
        <div className="modal-h">
          <span>
            <span className="mt" id="evidence-title">
              {doc.title}
            </span>
            <span className="mtag">確認用</span>
          </span>
          <button type="button" className="x" onClick={closeEvidence} aria-label="閉じる">
            ×
          </button>
        </div>
        <div className="modal-b">
          <p className="evidence-lead">{doc.lead}</p>
          {doc.kind === "request" && body ? (
            <pre className="evidence-request">{highlightText(body, highlight)}</pre>
          ) : null}
          {doc.kind === "table" && doc.headers && doc.rows ? (
            <div className="evidence-table-wrap">
              <table className="evidence-table">
                <thead>
                  <tr>
                    {doc.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doc.rows.map((row, i) => (
                    <tr key={i} className={row.hit ? "is-hit" : undefined}>
                      {row.cells.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <div className="modal-note">
            該当行や原文の印は、取り込んだ項目の確認用です。提出先の最終確定は担当者が行います。
          </div>
        </div>
      </div>
    </div>
  );
}
