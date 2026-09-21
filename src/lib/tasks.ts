import type { ExecuteTask, PacketKind, SitePlan } from "../content/types";

function packetKindForPermit(name: string): PacketKind {
  if (name.includes("占用")) return "road-occupy";
  if (name.includes("埋設")) return "buried";
  return "road-use";
}

function attachmentsFor(kind: PacketKind): string[] {
  if (kind === "road-use") return ["道路使用許可申請書", "交通規制図"];
  if (kind === "road-occupy") return ["道路占用許可申請書"];
  if (kind === "buried") return ["埋設物照会依頼書"];
  return ["配置依頼書", "交通誘導警備業務委託契約書"];
}

/** sched / permits / crew から申請・人員の準備タスクを生成する */
export function buildExecuteTasks(site: SitePlan): ExecuteTask[] {
  const tasks: ExecuteTask[] = [];

  for (const p of site.permits) {
    const packetKind = packetKindForPermit(p.n);
    tasks.push({
      id: `permit-${p.n}`,
      kind: "permit",
      packetKind,
      title: p.n,
      detail: `提出先：${p.to}${p.note ? ` ／ ${p.note}` : ""}`,
      dueOffset: p.lead,
      actionLabel: "書類を開く",
      attachments: attachmentsFor(packetKind),
    });
  }

  const guard = site.crew.find((c) => c.r.includes("交通誘導"));
  const crewSched = site.sched.find((s) => s.t.includes("警備"));
  if (guard) {
    tasks.push({
      id: "crew-guard",
      kind: "crew",
      packetKind: "crew-guard",
      title: "警備会社へ配置依頼",
      detail: `${guard.r} ×${guard.q}${guard.note ? ` ／ ${guard.note}` : ""}`,
      dueOffset: crewSched?.off ?? 14,
      actionLabel: "書類を開く",
      attachments: attachmentsFor("crew-guard"),
    });
  }

  return tasks;
}
