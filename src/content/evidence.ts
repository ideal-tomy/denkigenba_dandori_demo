import type { EvidenceDoc, EvidenceId, SiteId } from "./types";

const COMMON_REQUEST: Omit<EvidenceDoc, "highlight"> = {
  id: "request",
  title: "届いた依頼の原文",
  lead: "取り込んだ項目と、依頼文の該当箇所が同じかを見てから確定してください。",
  kind: "request",
};

const EVIDENCE_BY_SITE: Record<SiteId, Partial<Record<EvidenceId, EvidenceDoc>>> = {
  shibuya: {
    request: { ...COMMON_REQUEST, highlight: "道玄坂2丁目" },
    jurisdiction: {
      id: "jurisdiction",
      title: "所轄マスタ（警察署・道路管理者）",
      lead: "確認に使う社内情報です。所轄の候補と、段取り案の提出先が同じかを見てください。",
      kind: "table",
      headers: ["現場エリア", "所轄警察署", "道路管理者", "備考"],
      rows: [
        {
          cells: ["渋谷区道玄坂", "渋谷警察署", "渋谷区 土木部", "特別区道"],
          hit: true,
        },
        {
          cells: ["渋谷区宇田川町", "渋谷警察署", "渋谷区 土木部", "特別区道"],
        },
        {
          cells: ["港区南青山", "麻布警察署", "港区 土木課", "特別区道"],
        },
      ],
    },
    "route-rule": {
      id: "route-rule",
      title: "公安委員会 指定路線一覧（抜粋）",
      lead: "指定路線に該当すると、交通誘導は検定2級保有者の配置が必要です。該当行を確認してください。",
      kind: "table",
      headers: ["路線名", "区間", "指定", "誘導要件"],
      rows: [
        {
          cells: ["道玄坂", "道玄坂交差点〜神泉駅前", "指定路線", "交通誘導2級"],
          hit: true,
        },
        {
          cells: ["明治通り", "渋谷駅前〜原宿駅前", "指定路線", "交通誘導2級"],
        },
        {
          cells: ["宇田川町通", "センター街入口〜公園通り", "一般", "交通誘導可"],
        },
      ],
    },
  },
  shinjuku: {
    request: { ...COMMON_REQUEST, highlight: "夜間（22:00〜翌5:00）" },
    jurisdiction: {
      id: "jurisdiction",
      title: "所轄マスタ（警察署・道路管理者）",
      lead: "確認に使う社内情報です。所轄の候補と、段取り案の提出先が同じかを見てください。",
      kind: "table",
      headers: ["現場エリア", "所轄警察署", "道路管理者", "備考"],
      rows: [
        {
          cells: ["新宿区西新宿7丁目", "新宿警察署", "東京都 第三建設事務所", "都道"],
          hit: true,
        },
        {
          cells: ["新宿区歌舞伎町", "歌舞伎町警察署", "新宿区 土木部", "特別区道"],
        },
        {
          cells: ["渋谷区道玄坂", "渋谷警察署", "渋谷区 土木部", "特別区道"],
        },
      ],
    },
    "night-rule": {
      id: "night-rule",
      title: "夜間の道路使用条件（抜粋）",
      lead: "夜間作業の条件を、依頼文の時間帯と突き合わせて確認してください。",
      kind: "table",
      headers: ["時間帯", "条件", "近隣周知", "備考"],
      rows: [
        {
          cells: ["22:00〜翌5:00", "夜間道路使用の条件付き", "配布必須", "掘削開口部あり"],
          hit: true,
        },
        {
          cells: ["9:00〜17:00", "日中標準", "任意", "—"],
        },
        {
          cells: ["17:00〜22:00", "夕方延長", "配布推奨", "騒音配慮"],
        },
      ],
    },
    "buried-utility": {
      id: "buried-utility",
      title: "埋設物照会先一覧",
      lead: "掘削工事では、着工前に各インフラ事業者への照会と試掘が必要です。照会先を確認してください。",
      kind: "table",
      headers: ["事業者", "照会内容", "目安日数", "備考"],
      rows: [
        { cells: ["東京ガス", "ガス管位置", "30日", "試掘記録を添付"], hit: true },
        { cells: ["東京都水道局", "水道管位置", "30日", "試掘記録を添付"], hit: true },
        { cells: ["NTT東日本", "通信管路", "30日", "試掘記録を添付"], hit: true },
        { cells: ["東京電力", "地中ケーブル", "21日", "任意（今回は対象外）"] },
      ],
    },
  },
};

export function getEvidence(siteId: SiteId, id: EvidenceId): EvidenceDoc | null {
  return EVIDENCE_BY_SITE[siteId][id] ?? null;
}

export function evidenceLabel(id: EvidenceId): string {
  const labels: Record<EvidenceId, string> = {
    request: "依頼原文を見る",
    jurisdiction: "所轄マスタを見る",
    "route-rule": "指定路線一覧を見る",
    "night-rule": "夜間条件を見る",
    "buried-utility": "埋設物照会先を見る",
  };
  return labels[id];
}
