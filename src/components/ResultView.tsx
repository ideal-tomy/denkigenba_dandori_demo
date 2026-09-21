import { ApproveBar } from "./ApproveBar";
import { ExtractReview } from "./ExtractReview";
import { fmtDate, parseWorkDate } from "../lib/dates";
import type { DraftKind } from "../content/types";
import { useDemo } from "../state/DemoStore";

export function ResultView() {
  const {
    site,
    activeRequest,
    workDateIso,
    guardCount,
    naraMode,
    toggleNara,
    backToInbox,
    openDraft,
    lockPulse,
  } = useDemo();

  if (!site || !activeRequest) return null;

  const wd = parseWorkDate(workDateIso);
  const police = naraMode ? site.nara.police : site.police.v;
  const admin = naraMode ? site.nara.admin : site.admin.v;
  const badge = naraMode ? "" : site.police.badge;
  const title = naraMode
    ? `（参考）${site.nara.police.replace("警察署", "")}エリアの同じ工事`
    : site.title;

  const scheduleItems = [...site.sched].sort((a, b) => b.off - a.off);
  const crewTotal = site.crew.reduce((sum, c) => {
    if (c.r.includes("交通誘導")) return sum + (guardCount || c.q);
    return sum + c.q;
  }, 0);

  return (
    <main id="result">
      <div className="wrap">
        <button type="button" className="back" onClick={backToInbox}>
          ← 依頼一覧へ
        </button>

        <div className="secttl" style={{ marginTop: 18 }}>
          取り込んだ内容の確認
        </div>
        <ExtractReview />

        <section className="summary reveal" style={{ marginTop: 28 }}>
          <div className="ttl">▸ 段取り案</div>
          <h2>{title}</h2>
          <div className="sub">{site.sub}</div>
          <div className="lockrow">
            <div className="lock lit" key={`police-${lockPulse}`}>
              <div className="k">⚡ 所轄警察署 ／ 道路使用許可</div>
              <div className="v">
                {police}
                {badge ? <span className="badge">{badge}</span> : null}
              </div>
              <div className="n">{naraMode ? "地元の所轄" : site.police.n}</div>
            </div>
            <div className="lock lit" key={`admin-${lockPulse}`}>
              <div className="k">⚡ 道路管理者 ／ 道路占用許可</div>
              <div className="v">{admin}</div>
              <div className="n">{naraMode ? "地元の管理者" : site.admin.n}</div>
            </div>
          </div>
          <div className={`compare ${naraMode ? "nara" : ""}`}>
            {naraMode ? "地元（奈良）の段取りを表示中" : "もし奈良の同じ工事なら？"}
            <button type="button" onClick={toggleNara}>
              {naraMode ? "東京に戻す" : "奈良と比較"}
            </button>
          </div>
        </section>

        <div className="secttl">申請（許可）</div>
        <div className="panel card reveal" style={{ animationDelay: ".05s" }}>
          <h3>
            <span className="ic">🗂</span>必要な申請
          </h3>
          {site.permits.map((p) => {
            const dl = new Date(wd.getTime() - p.lead * 864e5);
            return (
              <div className="permit" key={p.n}>
                <div className="pn">
                  {p.n}
                  {p.note ? (
                    <span style={{ fontSize: "12px", color: "var(--ink-soft)", fontWeight: 400 }}>
                      {" "}
                      ／ {p.note}
                    </span>
                  ) : null}
                </div>
                <div className="pto">
                  提出先：<b>{p.to}</b>
                </div>
                <span className="deadline">
                  締切 {fmtDate(dl)}（作業日の{p.lead}
                  {p.leadu}前）
                </span>
                {p.draft ? (
                  <button
                    type="button"
                    className="draftbtn"
                    onClick={() => openDraft(p.draft as DraftKind)}
                  >
                    申請書ドラフトを見る
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="cards">
          <div>
            <div className="secttl">必要人員</div>
            <div className="panel card reveal" style={{ animationDelay: ".1s" }}>
              <h3>
                <span className="ic">👷</span>職種別の必要人員
              </h3>
              <div className="crew">
                {site.crew.map((c) => {
                  const qty = c.r.includes("交通誘導") && guardCount ? guardCount : c.q;
                  return (
                    <div className="row" key={c.r}>
                      <div className="role">
                        {c.r}
                        {c.note ? <span className="note">{c.note}</span> : null}
                      </div>
                      <div className="qty">×{qty}</div>
                    </div>
                  );
                })}
                <div className="tot">
                  <span className="l">総人工</span>
                  <span className="n">
                    {crewTotal}
                    <small>名／日</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="secttl">必要書類</div>
            <div className="panel card reveal" style={{ animationDelay: ".15s" }}>
              <h3>
                <span className="ic">📄</span>そろえる書類
              </h3>
              {site.docs.map((d) => (
                <div className="doc" key={d.n}>
                  <span className="dot" />
                  <span className="dn">
                    {d.n}
                    {d.note ? <span className="note"> ／ {d.note}</span> : null}
                  </span>
                  {d.draft ? (
                    <button
                      type="button"
                      className="draftbtn"
                      style={{ margin: 0 }}
                      onClick={() => openDraft(d.draft as DraftKind)}
                    >
                      下書き
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="secttl">スケジュール（作業日から逆算）</div>
        <div className="panel card reveal" style={{ animationDelay: ".2s" }}>
          <h3 style={{ marginBottom: 18 }}>
            <span className="ic">📅</span>作業日 {fmtDate(wd)} に向けて
          </h3>
          <div className="tl">
            {scheduleItems.map((it) => {
              const d = new Date(wd.getTime() - it.off * 864e5);
              return (
                <div className="ti" key={it.t}>
                  <div className="d">
                    {fmtDate(d)} ・ {it.off}日前
                  </div>
                  <div className="t">{it.t}</div>
                  {it.o ? <div className="o">{it.o}</div> : null}
                </div>
              );
            })}
            <div className="ti today">
              <div className="d">{fmtDate(wd)}</div>
              <div className="t">作業実施</div>
            </div>
          </div>
        </div>

        <div className="reveal" style={{ animationDelay: ".25s" }}>
          <div className="reasons">
            <div className="rh">⚡ なぜこの段取りになったか</div>
            {site.reasons.map((r) => (
              <div className="reason" key={r.h}>
                <span className="arr">→</span>
                <div>
                  <b>{r.h}</b> だから、
                  <span dangerouslySetInnerHTML={{ __html: r.b }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ApproveBar />
      </div>
    </main>
  );
}
