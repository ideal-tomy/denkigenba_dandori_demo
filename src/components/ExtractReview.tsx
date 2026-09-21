import { evidenceLabel } from "../content/evidence";
import type { ExtractField } from "../content/types";
import { useDemo } from "../state/DemoStore";

function FieldRow({ field }: { field: ExtractField }) {
  const { seenEvidence, openEvidence, updateField, planStatus, fieldNeedsReviewOf } = useDemo();
  const seen = seenEvidence.includes(field.evidenceId);
  const stillNeeds = fieldNeedsReviewOf(field.id);
  const locked = planStatus === "approved";

  return (
    <div className={`extract-row${stillNeeds ? " is-review" : ""}`}>
      <div className="extract-main">
        <div className="extract-label">
          {field.label}
          {stillNeeds ? <em className="pill is-warn extract-pill">要確認</em> : null}
        </div>
        {field.editable && field.kind === "date" ? (
          <input
            type="date"
            className="extract-input"
            value={field.value}
            disabled={locked}
            onChange={(e) => updateField(field.id, e.target.value)}
            aria-label={field.label}
          />
        ) : null}
        {field.editable && field.kind === "number" ? (
          <div className="extract-number">
            <button
              type="button"
              className="extract-step"
              disabled={locked || Number(field.value) <= 1}
              onClick={() => updateField(field.id, String(Math.max(1, Number(field.value) - 1)))}
              aria-label="減らす"
            >
              −
            </button>
            <span className="extract-num-val">{field.value}</span>
            <button
              type="button"
              className="extract-step"
              disabled={locked || Number(field.value) >= 9}
              onClick={() => updateField(field.id, String(Math.min(9, Number(field.value) + 1)))}
              aria-label="増やす"
            >
              ＋
            </button>
            <span className="extract-unit">名</span>
          </div>
        ) : null}
        {!field.editable ? <div className="extract-value">{field.value}</div> : null}
        {stillNeeds && field.reviewReason ? <p className="extract-reason">{field.reviewReason}</p> : null}
      </div>
      <button type="button" className="draftbtn extract-evidence" onClick={() => openEvidence(field.evidenceId)}>
        {evidenceLabel(field.evidenceId)}
        {seen ? "（確認済み）" : ""}
      </button>
    </div>
  );
}

export function ExtractReview() {
  const { fields, reviewCount, planStatus } = useDemo();

  return (
    <section className="panel card extract-panel reveal">
      <div className="extract-hd">
        <h3>
          <span className="ic">📋</span>取り込んだ現場情報
        </h3>
        {planStatus === "approved" ? (
          <em className="pill is-ok">確定済み</em>
        ) : reviewCount > 0 ? (
          <em className="pill is-warn">要確認 {reviewCount}件</em>
        ) : (
          <em className="pill is-ok">確認済み</em>
        )}
      </div>
      <p className="extract-note">依頼から読み取った項目です。根拠を見てから、段取り案を確定してください。</p>
      <div className="extract-list">
        {fields.map((field) => (
          <FieldRow key={field.id} field={field} />
        ))}
      </div>
    </section>
  );
}
