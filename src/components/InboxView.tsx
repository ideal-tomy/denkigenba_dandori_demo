import type { IncomingRequest } from "../content/types";
import { useDemo } from "../state/DemoStore";

function channelLabel(channel: IncomingRequest["channel"]) {
  return channel === "email" ? "メール" : "FAX";
}

function statusPill(status: "needs-check" | "draft" | "preparing" | "done") {
  if (status === "needs-check") return <em className="pill is-warn">要確認</em>;
  if (status === "preparing") return <em className="pill is-prep">準備中</em>;
  if (status === "done") return <em className="pill is-ok">準備完了</em>;
  return <em className="pill">未確定</em>;
}

function RequestCard({ request }: { request: IncomingRequest }) {
  const { openRequest, statusOf } = useDemo();
  const status = statusOf(request.id);

  return (
    <button type="button" className="inbox-card" onClick={() => openRequest(request.id)}>
      <div className="inbox-card-top">
        <span className={`channel channel-${request.channel}`}>{channelLabel(request.channel)}</span>
        <span className="inbox-time">{request.time}</span>
      </div>
      <div className="inbox-from">{request.from}</div>
      <div className="inbox-subject-row">
        <div className="inbox-subject">{request.subject}</div>
        {statusPill(status)}
      </div>
      <p className="inbox-preview">{request.preview}</p>
      <span className="inbox-cta">
        {status === "preparing" || status === "done" ? "準備を開く →" : "依頼を開く →"}
      </span>
    </button>
  );
}

export function InboxView() {
  const { requests } = useDemo();

  return (
    <main>
      <div className="wrap hero">
        <span className="eyebrow">電気工事 / 屋外・道路工事</span>
        <h1>
          届いた依頼から
          <br />
          <span className="hl">申請・人員・書類</span>の準備
        </h1>
        <p className="lede">
          メールやFAXで届いた依頼を開くと、所轄の警察署・道路管理者と、必要な申請・人員・書類の見通しが同じ画面で確認できます。提出先の確定は、担当者が行います。
        </p>
      </div>

      <div className="wrap inbox-wrap">
        <section className="panel inbox-panel">
          <div className="inbox-head">
            <span>今日届いた依頼</span>
            <span className="tag">{requests.length}件</span>
          </div>
          <div className="inbox-list">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
