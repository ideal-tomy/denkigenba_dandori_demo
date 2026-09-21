import { fmtDate, parseWorkDate } from "../lib/dates";
import { useDemo } from "../state/DemoStore";

export function ExecuteView() {
  const {
    site,
    activeRequest,
    workDateIso,
    executeTasks,
    taskStatusOf,
    openPacket,
    permitDone,
    permitTotal,
    crewDone,
    crewTotal,
    allTasksDone,
    backToInbox,
    goToResult,
  } = useDemo();

  if (!site || !activeRequest) return null;

  const wd = parseWorkDate(workDateIso);
  const permits = executeTasks.filter((t) => t.kind === "permit");
  const crews = executeTasks.filter((t) => t.kind === "crew");

  return (
    <main className="execute-main">
      <div className="wrap">
        <button type="button" className="back" onClick={backToInbox}>
          ← 依頼一覧へ
        </button>

        <div className="execute-hero">
          <span className="eyebrow">段取り確定後</span>
          <h2 className="execute-title">申請と人員の書類をそろえます</h2>
          <p className="lede execute-lede">
            {site.title}は確定済みです。各項目の申請書や依頼書を開き、内容を確認・直してから提出できる状態にしてください。このデモでは実際の提出・配置依頼は行いません。
          </p>
          <div className="execute-progress">
            申請 {permitDone}/{permitTotal} ・ 人員 {crewDone}/{crewTotal}
          </div>
          <button type="button" className="draftbtn" onClick={goToResult}>
            段取り案を見直す
          </button>
        </div>

        <div className="execute-grid">
          <section className="panel card">
            <h3>
              <span className="ic">🗂</span>申請の準備
            </h3>
            {permits.map((task) => {
              const done = taskStatusOf(task.id) === "done";
              const due = new Date(wd.getTime() - task.dueOffset * 864e5);
              return (
                <div className={`exec-task${done ? " is-done" : ""}`} key={task.id}>
                  <div className="exec-task-main">
                    <div className="exec-task-title">
                      <span className="exec-check" aria-hidden>
                        {done ? "✓" : "□"}
                      </span>
                      {task.title}
                    </div>
                    <div className="exec-task-detail">{task.detail}</div>
                    <div className="exec-task-docs">{task.attachments.join("、")}</div>
                    <div className="exec-task-due">
                      締切 {fmtDate(due)}（作業日の{task.dueOffset}日前）
                    </div>
                  </div>
                  <button type="button" className="draftbtn" onClick={() => openPacket(task.id)}>
                    {done ? "書類を見直す" : "書類を開く"}
                  </button>
                </div>
              );
            })}
          </section>

          <section className="panel card">
            <h3>
              <span className="ic">👷</span>人員の準備
            </h3>
            {crews.map((task) => {
              const done = taskStatusOf(task.id) === "done";
              const due = new Date(wd.getTime() - task.dueOffset * 864e5);
              return (
                <div className={`exec-task${done ? " is-done" : ""}`} key={task.id}>
                  <div className="exec-task-main">
                    <div className="exec-task-title">
                      <span className="exec-check" aria-hidden>
                        {done ? "✓" : "□"}
                      </span>
                      {task.title}
                    </div>
                    <div className="exec-task-detail">{task.detail}</div>
                    <div className="exec-task-docs">{task.attachments.join("、")}</div>
                    <div className="exec-task-due">
                      締切 {fmtDate(due)}（作業日の{task.dueOffset}日前）
                    </div>
                  </div>
                  <button type="button" className="draftbtn" onClick={() => openPacket(task.id)}>
                    {done ? "書類を見直す" : "書類を開く"}
                  </button>
                </div>
              );
            })}
          </section>
        </div>

        {allTasksDone ? (
          <div className="approve-bar is-done">
            <p>申請と人員の書類が提出できる状態になりました。依頼一覧に戻って状態を確認できます。</p>
            <button type="button" className="go approve-btn" onClick={backToInbox}>
              依頼一覧へ
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
