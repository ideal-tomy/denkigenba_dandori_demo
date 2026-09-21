import { useDemo } from "../state/DemoStore";

export function ApproveBar() {
  const { reviewCount, planStatus, approvePlan, goToExecute } = useDemo();

  if (planStatus === "approved") {
    return (
      <div className="approve-bar is-done">
        <p>段取り案は確定済みです。申請と人員の準備を進められます。</p>
        <button type="button" className="go approve-btn" onClick={goToExecute}>
          準備を進める →
        </button>
      </div>
    );
  }

  return (
    <div className="approve-bar">
      {reviewCount > 0 ? (
        <p>要確認が残っています（{reviewCount}件）。根拠を見るか、内容を直してから確定してください。</p>
      ) : (
        <p>取り込んだ項目を確認しました。段取り案を確定すると、申請と人員の準備に進みます。</p>
      )}
      <button type="button" className="go approve-btn" onClick={approvePlan} disabled={reviewCount > 0}>
        段取り案を確定する
      </button>
    </div>
  );
}
