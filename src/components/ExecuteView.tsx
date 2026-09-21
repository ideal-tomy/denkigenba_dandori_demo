import { fmtDate, parseWorkDate } from "../lib/dates";
import { useDemo } from "../state/DemoStore";

export function ExecuteView() {
  const {
    site,
    activeRequest,
    workDateIso,
    executeTasks,
    taskStatusOf,
    completeTask,
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
          <h2 className="execute-title">申請と人員の準備を進めます</h2>
          <p className="lede execute-lede">
            {site.title}は確定済みです。申請書の確認と、警備会社への配置依頼を順に進めてください。このデモでは実際の提出・配置依頼は行いません。
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
                    <div className="exec-task-due">締切 {fmtDate(due)}（作業日の{task.dueOffset}日前）</div>
                  </div>
                  {done ? (
                    <span className="pill is-ok">完了</span>
                  ) : (
                    <button type="button" className="draftbtn" onClick={() => completeTask(task.id)}>
                      {task.actionLabel}
                    </button>
                  )}
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
                    <div className="exec-task-due">締切 {fmtDate(due)}（作業日の{task.dueOffset}日前）</div>
                  </div>
                  {done ? (
                    <span className="pill is-ok">完了</span>
                  ) : (
                    <button type="button" className="draftbtn" onClick={() => completeTask(task.id)}>
                      {task.actionLabel}
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        </div>

        {allTasksDone ? (
          <div className="approve-bar is-done">
            <p>申請と人員の準備がそろいました。依頼一覧に戻って状態を確認できます。</p>
            <button type="button" className="go approve-btn" onClick={backToInbox}>
              依頼一覧へ
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
