import type { ExecuteTask, SitePlan } from "../content/types";

/** sched / permits / crew から申請・人員の準備タスクを生成する */
export function buildExecuteTasks(site: SitePlan): ExecuteTask[] {
  const tasks: ExecuteTask[] = [];

  for (const p of site.permits) {
    tasks.push({
      id: `permit-${p.n}`,
      kind: "permit",
      title: p.n,
      detail: `提出先：${p.to}${p.note ? ` ／ ${p.note}` : ""}`,
      dueOffset: p.lead,
      actionLabel: "申請書を確認した",
    });
  }

  const guard = site.crew.find((c) => c.r.includes("交通誘導"));
  const crewSched = site.sched.find((s) => s.t.includes("警備"));
  if (guard) {
    tasks.push({
      id: "crew-guard",
      kind: "crew",
      title: "警備会社へ配置依頼",
      detail: `${guard.r} ×${guard.q}${guard.note ? ` ／ ${guard.note}` : ""}`,
      dueOffset: crewSched?.off ?? 14,
      actionLabel: "配置依頼を送った（デモ）",
    });
  }

  return tasks;
}
