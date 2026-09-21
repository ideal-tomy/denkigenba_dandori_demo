import type { ExtractField } from "./types";
import { incomingRequests } from "./requests";

function workDateFor(requestId: string): string {
  return incomingRequests.find((r) => r.id === requestId)?.workDate ?? "";
}

export function initialFieldsFor(requestId: string): ExtractField[] {
  if (requestId === "req-shibuya") {
    return [
      {
        id: "addr",
        label: "現場住所",
        value: "東京都渋谷区道玄坂2丁目",
        evidenceId: "request",
        highlight: "道玄坂2丁目",
      },
      {
        id: "type",
        label: "工事種別",
        value: "電柱新設・建柱／引込線張替え",
        evidenceId: "request",
        highlight: "電柱新設・建柱",
      },
      {
        id: "workDate",
        label: "作業日",
        value: workDateFor(requestId),
        editable: true,
        kind: "date",
        needsReview: true,
        reviewReason: "依頼文は「来月21日」です。カレンダー上の日付を確認してください。",
        evidenceId: "request",
        highlight: "来月21日",
      },
      {
        id: "time",
        label: "時間帯",
        value: "日中",
        evidenceId: "request",
        highlight: "日中",
      },
      {
        id: "road",
        label: "車道作業",
        value: "あり（車道にかかる作業）",
        evidenceId: "request",
        highlight: "車道にかかる作業",
      },
      {
        id: "crew-guard",
        label: "交通誘導警備員",
        value: "2",
        editable: true,
        kind: "number",
        evidenceId: "route-rule",
        highlight: "道玄坂",
      },
    ];
  }

  if (requestId === "req-shinjuku") {
    return [
      {
        id: "addr",
        label: "現場住所",
        value: "東京都新宿区西新宿7丁目",
        evidenceId: "request",
        highlight: "西新宿7丁目",
      },
      {
        id: "type",
        label: "工事種別",
        value: "屋外配電・地中ケーブル敷設（掘削あり）",
        evidenceId: "request",
        highlight: "地中ケーブル敷設",
      },
      {
        id: "workDate",
        label: "作業日",
        value: workDateFor(requestId),
        editable: true,
        kind: "date",
        evidenceId: "request",
        highlight: "10月25日",
      },
      {
        id: "time",
        label: "時間帯",
        value: "夜間（22:00〜翌5:00）",
        needsReview: true,
        reviewReason: "夜間作業の条件と近隣周知の要否を、夜間条件の表で確認してください。",
        evidenceId: "night-rule",
        highlight: "22:00〜翌5:00",
      },
      {
        id: "buried",
        label: "埋設物照会",
        value: "必要（掘削あり）",
        needsReview: true,
        reviewReason: "掘削工事のため、各インフラ事業者への照会が必要です。照会先を確認してください。",
        evidenceId: "buried-utility",
        highlight: "埋設物照会",
      },
      {
        id: "crew-guard",
        label: "交通誘導警備員",
        value: "3",
        editable: true,
        kind: "number",
        evidenceId: "night-rule",
      },
    ];
  }

  return [];
}
