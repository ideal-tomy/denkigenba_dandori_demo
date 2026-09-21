import { sites } from "../content/sites";
import type { DraftKind, SiteId } from "../content/types";
import { fmtDate, parseWorkDate } from "./dates";

type DraftRow = [string, string];

export function buildDraftForm(
  kind: DraftKind,
  siteId: SiteId,
  workDateIso: string,
  naraMode: boolean,
): { title: string; rows: DraftRow[] } {
  const s = sites[siteId];
  const wd = parseWorkDate(workDateIso);
  const period = `${fmtDate(wd)} 〜 ${fmtDate(new Date(wd.getTime() + 2 * 864e5))}`;
  const police = naraMode ? s.nara.police : s.police.v;
  const admin = naraMode ? s.nara.admin : s.admin.v;

  if (kind === "road-use") {
    return {
      title: "道路使用許可申請書",
      rows: [
        ["申請者", " ideal合同会社（御社名）"],
        ["道路使用の場所", `${s.locname} 先 車道・歩道`],
        ["使用の期間", period],
        ["使用の目的", "電気工事（建柱・配線作業）"],
        ["使用の方法", "保安柵設置・交通誘導員配置のうえ片側交互通行"],
        ["提出先", `${police} 長 殿`],
      ],
    };
  }

  if (kind === "road-occupy") {
    return {
      title: "道路占用許可申請書",
      rows: [
        ["占用者", "ideal合同会社（御社名）"],
        ["占用の場所", s.locname],
        ["占用物件", "電柱・地中管路 ほか"],
        ["占用の期間", period],
        ["道路管理者", admin],
      ],
    };
  }

  const isNight = siteId === "shinjuku";
  return {
    title: isNight ? "夜間工事 近隣周知文" : "作業計画書",
    rows: [
      ["件名", isNight ? "夜間電気工事のお知らせ" : "電気工事 作業計画"],
      ["場所", s.locname],
      ["日時", `${period}${isNight ? " 22:00〜翌5:00" : " 9:00〜17:00"}`],
      ["作業内容", s.type],
      ["緊急連絡先", "現場代理人 ／ ○○-○○○○-○○○○"],
    ],
  };
}
