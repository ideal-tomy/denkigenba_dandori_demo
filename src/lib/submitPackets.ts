import type { PacketDoc, PacketField, PacketKind, SitePlan } from "../content/types";
import { fmtJpLong, parseWorkDate } from "./dates";

export const APPLICANT = "ideal合同会社";
export const SUPERVISOR = "高橋 誠";
export const SUPERVISOR_TEL = "03-6400-2180";
export const GUARD_COMPANY = "城西警備保障株式会社";
export const GUARD_STAFF = "佐藤 健一";

type PacketCtx = {
  site: SitePlan;
  workDateIso: string;
  guardCount: number;
  naraMode: boolean;
  edits: Record<string, string>;
};

function f(ctx: PacketCtx, key: string, label: string, value: string, editable = true): PacketField {
  return { key, label, value: ctx.edits[key] ?? value, editable };
}

function period(ctx: PacketCtx, night: boolean) {
  const wd = parseWorkDate(ctx.workDateIso);
  const end = new Date(wd.getTime() + 2 * 864e5);
  const time = night ? "22時00分から翌5時00分まで" : "9時00分から17時00分まで";
  return `${fmtJpLong(wd)} ${time}（${fmtJpLong(end)}まで）`;
}

function policeName(ctx: PacketCtx) {
  return ctx.naraMode ? ctx.site.nara.police : ctx.site.police.v;
}

function adminName(ctx: PacketCtx) {
  return ctx.naraMode ? ctx.site.nara.admin : ctx.site.admin.v;
}

function streetNames(site: SitePlan): { main: string; cross: string } {
  if (site.id === "shibuya") return { main: "道玄坂", cross: "井の頭通り" };
  return { main: "青梅街道", cross: "西新宿通り" };
}

export function buildPacketDocs(kind: PacketKind, ctx: PacketCtx): PacketDoc[] {
  const night = ctx.site.time.includes("夜");
  const { main, cross } = streetNames(ctx.site);
  const wd = parseWorkDate(ctx.workDateIso);

  if (kind === "road-use") {
    return [
      {
        id: "form",
        tab: "申請書",
        kind: "road-use-form",
        title: "道路使用許可申請書",
        note: "上段は提出用です。下段の許可証欄は、提出後に所轄が記入します。",
        fields: [
          f(ctx, "filedOn", "申請日", fmtJpLong(new Date(wd.getTime() - 10 * 864e5))),
          f(ctx, "police", "提出先", `${policeName(ctx)} 長 殿`),
          f(ctx, "applicantAddr", "申請者住所", "東京都港区南青山二丁目2番3号"),
          f(ctx, "applicant", "申請者氏名", APPLICANT),
          f(ctx, "purpose", "道路使用の目的", `${ctx.site.type}に伴う車道作業`),
          f(ctx, "place", "場所又は区間", `${ctx.site.locname} 先（${main} × ${cross}）車道・歩道`),
          f(ctx, "period", "期間", period(ctx, night)),
          f(
            ctx,
            "method",
            "方法又は形態",
            night
              ? "保安柵・カラーコーン設置、交通誘導員配置のうえ車線規制（夜間）"
              : "保安柵・カラーコーン設置、交通誘導員配置のうえ片側交互通行",
          ),
          f(ctx, "attach", "添付書類", "交通規制図、作業計画書、資格者名簿"),
          f(ctx, "siteAddr", "現場住所", ctx.site.addr),
          f(ctx, "supervisor", "責任者氏名", SUPERVISOR),
          f(ctx, "phone", "電話", SUPERVISOR_TEL),
        ],
      },
      {
        id: "plan",
        tab: "規制図",
        kind: "regulation-plan",
        title: "交通規制図",
        note: "提出用の規制図です。作業範囲と誘導位置を確認してください。",
        fields: [
          f(ctx, "planTitle", "図面名", `${ctx.site.locname} 交通規制図`, false),
          f(ctx, "planStreet", "対象路線", `${main} × ${cross}`, false),
          f(ctx, "planTime", "規制時間", night ? "22:00〜翌5:00" : "9:00〜17:00", false),
        ],
      },
    ];
  }

  if (kind === "road-occupy") {
    return [
      {
        id: "form",
        tab: "申請書",
        kind: "occupy-form",
        title: "道路占用許可申請書",
        note: "道路管理者へ提出する占用の申請書です。内容を確認・直してから提出できる状態にしてください。",
        fields: [
          f(ctx, "filedOn", "申請日", fmtJpLong(new Date(wd.getTime() - 24 * 864e5))),
          f(ctx, "admin", "道路管理者", adminName(ctx)),
          f(ctx, "applicantAddr", "占用者住所", "東京都港区南青山二丁目2番3号"),
          f(ctx, "applicant", "占用者氏名", APPLICANT),
          f(ctx, "place", "占用の場所", ctx.site.locname),
          f(ctx, "object", "占用物件", night ? "地中管路・作業用仮設物" : "電柱・引込線・作業用仮設物"),
          f(ctx, "period", "占用の期間", `${fmtJpLong(wd)} から ${fmtJpLong(new Date(wd.getTime() + 2 * 864e5))} まで`),
          f(ctx, "purpose", "占用の目的", ctx.site.type),
          f(ctx, "supervisor", "現場代理人", SUPERVISOR),
          f(ctx, "phone", "連絡先", SUPERVISOR_TEL),
        ],
      },
    ];
  }

  if (kind === "buried") {
    return [
      {
        id: "form",
        tab: "照会依頼書",
        kind: "buried-form",
        title: "埋設物照会依頼書",
        note: "ガス・水道・通信の各事業者へ出す照会です。このデモでは送信しません。",
        fields: [
          f(ctx, "filedOn", "依頼日", fmtJpLong(new Date(wd.getTime() - 32 * 864e5))),
          f(ctx, "to", "宛先", "東京ガス株式会社／東京都水道局／NTT東日本"),
          f(ctx, "from", "依頼者", APPLICANT),
          f(ctx, "place", "工事場所", ctx.site.addr),
          f(ctx, "work", "工事内容", ctx.site.type),
          f(ctx, "dig", "掘削範囲", "車道部 延長 18m ・ 幅 1.2m ・ 深さ 1.5m"),
          f(ctx, "start", "着工予定", fmtJpLong(wd)),
          f(ctx, "due", "回答希望日", fmtJpLong(new Date(wd.getTime() - 14 * 864e5))),
          f(ctx, "supervisor", "担当", SUPERVISOR),
          f(ctx, "phone", "連絡先", SUPERVISOR_TEL),
        ],
      },
    ];
  }

  const heads = ctx.guardCount || ctx.site.crew.find((c) => c.r.includes("交通誘導"))?.q || 2;
  const gradeNote = ctx.site.id === "shibuya" ? "うち交通誘導2級 ×1" : "うち交通誘導2級 ×1（夜間）";

  return [
    {
      id: "order",
      tab: "配置依頼書",
      kind: "guard-order",
      title: "交通誘導警備 配置依頼書",
      note: "警備会社へ渡す配置依頼です。人数と日時を確認してください。このデモでは送信しません。",
      fields: [
        f(ctx, "orderNo", "依頼番号", `KG-${ctx.site.id === "shibuya" ? "2609-084" : "2610-117"}`, false),
        f(ctx, "orderDate", "依頼日", fmtJpLong(new Date(wd.getTime() - 16 * 864e5))),
        f(ctx, "client", "発注者（甲）", APPLICANT),
        f(ctx, "vendor", "受注者（乙）", GUARD_COMPANY),
        f(ctx, "site", "配置場所", ctx.site.addr),
        f(ctx, "when", "配置日時", period(ctx, night)),
        f(ctx, "heads", "配置人数", `${heads}名（${gradeNote}）`),
        f(ctx, "work", "業務内容", "工事現場周辺の車両誘導、歩行者の安全確保、開口部の交通整理"),
        f(ctx, "contact", "現場連絡先", `${SUPERVISOR} ／ ${SUPERVISOR_TEL}`),
      ],
    },
    {
      id: "contract",
      tab: "委託契約書",
      kind: "guard-contract",
      title: "交通誘導警備業務委託契約書",
      note: "甲乙の捺印欄まで入った提出用の契約書です。条文の日時・人数を確認してください。",
      fields: [
        f(ctx, "client", "委託者（甲）", APPLICANT),
        f(ctx, "vendor", "受託者（乙）", GUARD_COMPANY),
        f(ctx, "site", "実施場所", ctx.site.addr),
        f(ctx, "when", "実施日時", period(ctx, night)),
        f(ctx, "heads", "配置人数", `${heads}名`),
        f(ctx, "signedOn", "契約日", fmtJpLong(new Date(wd.getTime() - 16 * 864e5))),
      ],
    },
  ];
}

export function packetLead(kind: PacketKind): string {
  if (kind === "crew-guard") {
    return "配置依頼書と委託契約書を確認し、人数や日時を直してから提出できる状態にしてください。";
  }
  if (kind === "road-use") {
    return "申請書と規制図を確認し、場所や期間を直してから提出できる状態にしてください。";
  }
  return "申請書の内容を確認し、直してから提出できる状態にしてください。";
}
