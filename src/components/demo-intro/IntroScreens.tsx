import { memo, useEffect, type ReactNode } from "react";
import { EvidenceModal } from "../EvidenceModal";
import { ExecuteView } from "../ExecuteView";
import { InboxView } from "../InboxView";
import { ResultView } from "../ResultView";
import { DemoProvider, type IntroSeed } from "../../state/DemoStore";
import type { DeviceId } from "./story";

function frameClass(id: DeviceId, stars: readonly DeviceId[]) {
  return `ki-device ki-monitor ki-${id}${stars.includes(id) ? " ki-active" : " ki-idle"}`;
}

function Monitor({
  id,
  tab,
  stars,
  children,
}: {
  id: DeviceId;
  tab: string;
  stars: readonly DeviceId[];
  children: ReactNode;
}) {
  return (
    <div className={frameClass(id, stars)}>
      <div className="ki-device-bar">
        現場ダンドリ <span>{tab}</span>
      </div>
      <div className="ki-monitor-body">{children}</div>
    </div>
  );
}

function Seeded({ seed, children }: { seed: IntroSeed; children: ReactNode }) {
  return <DemoProvider introSeed={seed}>{children}</DemoProvider>;
}

function EvidenceFocus() {
  useEffect(() => {
    const t = window.setTimeout(() => {
      const body = document.querySelector(".fd-plan .modal-b") as HTMLElement | null;
      if (body) body.scrollTop = 0;
    }, 80);
    return () => window.clearTimeout(t);
  }, []);
  return <EvidenceModal />;
}

export const IntroScreens = memo(function IntroScreens({
  phase,
  stars,
}: {
  phase: number;
  stars: readonly DeviceId[];
}) {
  const showEvidence = phase === 3;
  const approved = phase >= 4;
  return (
    <>
      <Monitor id="inbox" tab="依頼一覧" stars={stars}>
        <Seeded seed={{ view: "inbox" }}>
          <div className="fd-scale fd-inbox">
            <InboxView />
          </div>
        </Seeded>
      </Monitor>
      <Monitor id="plan" tab="段取り案" stars={stars}>
        <Seeded
          key={showEvidence ? "evidence" : approved ? "approved" : "draft"}
          seed={{
            view: "result",
            activeId: "req-shibuya",
            planStatus: approved ? "approved" : "draft",
            evidenceId: showEvidence ? "request" : null,
            seenEvidence: showEvidence || approved ? ["request"] : [],
            clearedReviews: approved ? ["workDate"] : [],
          }}
        >
          <div className={`fd-scale fd-plan${showEvidence ? " is-evidence" : ""}`}>
            <ResultView />
            {showEvidence ? <EvidenceFocus /> : null}
          </div>
        </Seeded>
      </Monitor>
      <Monitor id="prep" tab="申請準備" stars={stars}>
        <Seeded
          seed={{
            view: "execute",
            activeId: "req-shibuya",
            planStatus: "approved",
            clearedReviews: ["workDate"],
          }}
        >
          <div className="fd-scale fd-prep">
            <ExecuteView />
          </div>
        </Seeded>
      </Monitor>
    </>
  );
});
