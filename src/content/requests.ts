import type { IncomingRequest } from "./types";

function defaultWorkDate(): string {
  const d = new Date(Date.now() + 30 * 864e5);
  return d.toISOString().slice(0, 10);
}

export const incomingRequests: IncomingRequest[] = [
  {
    id: "req-shibuya",
    siteId: "shibuya",
    channel: "email",
    time: "9:14",
    from: "北関東電設 田村様",
    subject: "道玄坂の建柱、来月21日",
    preview: "渋谷区道玄坂2丁目で電柱新設。来月21日、日中でお願いします。",
    body: `件名：道玄坂の建柱、来月21日

北関東電設
田村

ideal合同会社 御中

お世話になっております。
渋谷区道玄坂2丁目にて、電柱新設・建柱／引込線張替えを予定しています。

・現場住所：東京都渋谷区道玄坂2丁目
・工事種別：電柱新設・建柱／引込線張替え
・希望作業日：来月21日
・時間帯：日中
・車道にかかる作業になります

段取りと必要な申請の確認をお願いします。

北関東電設
田村`,
    workDate: defaultWorkDate(),
  },
  {
    id: "req-shinjuku",
    siteId: "shinjuku",
    channel: "fax",
    time: "8:41",
    from: "城東工業（FAX）",
    subject: "西新宿7丁目 夜間掘削の段取り",
    preview: "地中ケーブル敷設（掘削あり）。夜間作業。10月25日希望。",
    body: `【FAX受信】城東工業 より

現場：東京都新宿区西新宿7丁目
工事：屋外配電・地中ケーブル敷設（掘削あり）
作業日：10月25日
時間帯：夜間（22:00〜翌5:00）
備考：車道掘削あり。埋設物照会が必要か確認希望。

担当：城東工業 手配係`,
    workDate: defaultWorkDate(),
  },
];
