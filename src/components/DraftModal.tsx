import { useEffect } from "react";
import { buildDraftForm } from "../lib/draftForms";
import { useDemo } from "../state/DemoStore";

const EDITABLE_KEYS = new Set(["提出先", "使用の期間", "占用の期間", "道路使用の場所", "占用の場所", "場所"]);

const AUTO_FIELDS = new Set([
  "道路使用の場所",
  "提出先",
  "占用の場所",
  "道路管理者",
  "場所",
]);

export function DraftModal() {
  const {
    draftKind,
    closeDraft,
    site,
    workDateIso,
    naraMode,
    activeRequest,
    planStatus,
    draftEditOf,
    setDraftEdit,
    draftEdited,
  } = useDemo();

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
  const locked = planStatus === "approved";
  const edited = draftEdited(draftKind);

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
            {edited ? <span className="mtag">編集あり</span> : null}
          </span>
          <button type="button" className="x" onClick={closeDraft} aria-label="閉じる">
            ×
          </button>
        </div>
        <div className="modal-b">
          <div className="form-preview">
            <div className="ftitle">{form.title}</div>
            {form.rows.map(([key, value]) => {
              const display = draftEditOf(draftKind, key, value);
              const canEdit = EDITABLE_KEYS.has(key) && !locked;
              return (
                <div className="frow" key={key}>
                  <div className="fk">{key}</div>
                  <div className="fv">
                    {canEdit ? (
                      <input
                        type="text"
                        className="draft-input"
                        value={display}
                        onChange={(e) => setDraftEdit(draftKind, key, e.target.value)}
                        aria-label={key}
                      />
                    ) : (
                      display
                    )}
                    {AUTO_FIELDS.has(key) ? <span className="auto">自動入力</span> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="modal-note">
            「自動入力」のタグが付いた項目は、現場の住所と段取り案から埋めた箇所です。提出前に、担当者が内容を確認します。このデモでは申請提出しません。
          </div>
        </div>
      </div>
    </div>
  );
}
