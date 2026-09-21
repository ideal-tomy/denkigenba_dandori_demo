import { AppHeader } from "../components/AppHeader";
import { DraftModal } from "../components/DraftModal";
import { InboxView } from "../components/InboxView";
import { IngestView } from "../components/IngestView";
import { ResultView } from "../components/ResultView";
import { DemoProvider, useDemo } from "../state/DemoStore";

function DeskInner() {
  const { view } = useDemo();

  return (
    <>
      <AppHeader />
      {view === "inbox" ? <InboxView /> : null}
      {view === "ingest" ? <IngestView /> : null}
      {view === "result" ? <ResultView /> : null}
      <DraftModal />
      <footer>
        <div className="wrap">
          <div className="disc">
            ※ 本画面はデモです。表示される所轄・期限・人員数などはサンプル値で、実際の運用では路線種別・自治体ごとのマスタデータに基づいて確定します。許可窓口・提出期限は所轄の運用により異なるため、最終確認が前提です。
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
