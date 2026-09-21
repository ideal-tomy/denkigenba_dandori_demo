import { useEffect } from "react";
import { buildDraftForm } from "../lib/draftForms";
import { useDemo } from "../state/DemoStore";

const AUTO_FIELDS = new Set([
  "道路使用の場所",
  "提出先",
  "占用の場所",
  "道路管理者",
  "場所",
]);

export function DraftModal() {
  const { draftKind, closeDraft, site, workDateIso, naraMode, activeRequest } = useDemo();

  useEffect(() => {
    if (!draftKind) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDraft();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [draftKind, closeDraft]);

  if (!draftKind || !site || !activeRequest) return null;

  const form = buildDraftForm(draftKind, activeRequest.siteId, workDateIso, naraMode);

  return (
    <div
      className="scrim on"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDraft();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="draft-title">
        <div className="modal-h">
          <span>
            <span className="mt" id="draft-title">
              {form.title}
            </span>
            <span className="mtag">下書き</span>
          </span>
          <button type="button" className="x" onClick={closeDraft} aria-label="閉じる">
            ×
          </button>
        </div>
        <div className="modal-b">
          <div className="form-preview">
            <div className="ftitle">{form.title}</div>
            {form.rows.map(([key, value]) => (
              <div className="frow" key={key}>
                <div className="fk">{key}</div>
                <div className="fv">
                  {value}
                  {AUTO_FIELDS.has(key) ? <span className="auto">自動入力</span> : null}
                </div>
              </div>
            ))}
          </div>
          <div className="modal-note">
            「自動入力」のタグが付いた項目は、現場の住所と段取り案から埋めた箇所です。提出前に、担当者が内容を確認します。
          </div>
        </div>
      </div>
    </div>
  );
}
