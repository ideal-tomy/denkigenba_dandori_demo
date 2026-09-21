import { useEffect } from "react";
import { AppHeader } from "../components/AppHeader";
import { DraftModal } from "../components/DraftModal";
import { EvidenceModal } from "../components/EvidenceModal";
import { ExecuteView } from "../components/ExecuteView";
import { InboxView } from "../components/InboxView";
import { IngestView } from "../components/IngestView";
import { ResultView } from "../components/ResultView";
import { SubmitPacketModal } from "../components/SubmitPacketModal";
import { DemoProvider, useDemo } from "../state/DemoStore";

function DeskInner() {
  const { view, toast, clearToast } = useDemo();

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(clearToast, 4200);
    return () => window.clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <>
      <AppHeader />
      {view === "inbox" ? <InboxView /> : null}
      {view === "ingest" ? <IngestView /> : null}
      {view === "result" ? <ResultView /> : null}
      {view === "execute" ? <ExecuteView /> : null}
      <DraftModal />
      <EvidenceModal />
      <SubmitPacketModal />
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
      <footer>
        <div className="wrap">
          <div className="disc">
            ※ 本画面はデモです。表示される所轄・期限・人員数などはサンプル値で、実際の運用では路線種別・自治体ごとのマスタデータに基づいて確定します。許可窓口・提出期限は所轄の運用により異なるため、最終確認が前提です。このデモでは申請提出・配置依頼の送信は行いません。
          </div>
          <div className="axeon">
            <b>AXEON</b>株式会社
          </div>
        </div>
      </footer>
    </>
  );
}

export function DeskApp() {
  return (
    <DemoProvider>
      <DeskInner />
    </DemoProvider>
  );
}
